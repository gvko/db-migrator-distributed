"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Umzug = require("umzug");
const logger_1 = require("./logger");
const error_handler_1 = require("./error-handler");
const fireway = require("fireway");
class DBMigrator {
    constructor({ sequelizeConnection, migrationsTable = '_migrations', migrationsLockTable = '_migrations_lock', lockTimeoutSeconds = 60, migrationsDirPath = 'dist/migrations', migrationFilesPattern = /^\d+[\w-_]+\.js$/, // eslint-disable-line
    logger = undefined, firebaseAdmin = undefined, firebaseMigrationsDirPath = undefined, extraMigrationFuncParams = [] }) {
        this.lockAttempts = 1;
        this.releaseAttempts = 1;
        this.logger = logger || new logger_1.default();
        this.sequelize = sequelizeConnection;
        this.migrationsLockTable = migrationsLockTable;
        this.lockTimeoutSeconds = lockTimeoutSeconds;
        this.umzug = new Umzug({
            storage: 'sequelize',
            logging: this.logger.info.bind(this.logger),
            storageOptions: {
                sequelize: sequelizeConnection,
                tableName: migrationsTable
            },
            migrations: {
                /*
                 * The params that get passed to the migrations `up` and `down` functions:
                 * (queryInterface, Sequelize, ...)
                 */
                params: [this.sequelize.getQueryInterface(), this.sequelize.constructor, ...extraMigrationFuncParams],
                /*
                 * The path to the migrations dir, relative to the root dir
                 */
                path: migrationsDirPath,
                /*
                 *  The pattern that determines whether or not a file is a migration.
                 */
                pattern: migrationFilesPattern
            }
        });
        this.firebaseAdmin = firebaseAdmin;
        this.firebaseMigrationsDirPath = firebaseMigrationsDirPath || 'dist/firebase-migrations';
    }
    /**
     * Combines all functions that need to be executed in sequence in order to run the migration process.
     */
    async run() {
        try {
            await this.checkLockTableExistsOrCreate();
        }
        catch (err) {
            throw err;
        }
        try {
            const lockAcquired = await this.acquireLock();
            if (lockAcquired) {
                await this.executeMigrations();
                if (this.firebaseAdmin) {
                    await this.executeFirestoreMigrations();
                }
                await this.releaseLock();
            }
        }
        catch (err) {
            await this.releaseLock();
            this.logger.error({ err }, 'Could not execute migrations. Exiting...');
            throw err;
        }
    }
    /**
     * Checks if the migrations lock table exists. If not, creates it, since it's needed for acquiring the lock.
     */
    async checkLockTableExistsOrCreate() {
        this.logger.info({}, 'Check lock table exists');
        const sqlQuery = `CREATE TABLE IF NOT EXISTS ${this.migrationsLockTable} (
      acquired_at   timestamp with time zone default null
    );`;
        try {
            await this.sequelize.query(sqlQuery);
            this.logger.info({}, 'Lock table exists. Proceed with migrations.');
        }
        catch (err) {
            this.logger.error({ originalErrMsg: err.message, originalErr: err }, 'Could not create lock table. Exiting...');
            throw err;
        }
    }
    /**
     * Executes the pending migrations
     */
    async executeMigrations() {
        const pendingMigrations = await this.umzug.pending();
        if (pendingMigrations.length > 0) {
            this.logger.info({ pendingMigrations: pendingMigrations.map(migration => migration.file) }, '-- STARTING MIGRATION PROCESS for files:');
        }
        try {
            const migrations = await this.umzug.up();
            const resultText = migrations.length > 0
                ? 'The migrations have been migrated successfully!'
                : 'No migrations needed to be executed!';
            this.logger.info({}, resultText);
        }
        catch (err) {
            throw new error_handler_1.GeneralError(err.message, { err, subModule: 'db-migrator' });
        }
    }
    /**
     * Executes the pending migrations in Firestore
     */
    async executeFirestoreMigrations() {
        try {
            const firebaseApp = this.firebaseAdmin.app();
            const result = await fireway.migrate({ path: this.firebaseMigrationsDirPath, app: firebaseApp });
            const resultText = result.executedFilesCount > 0
                ? 'Firestore migrations have been migrated successfully!'
                : 'No Firestore migrations needed to be executed!';
            this.logger.info(result, resultText);
        }
        catch (err) {
            throw new error_handler_1.GeneralError(err.message, { err, subModule: 'db-migrator' });
        }
    }
    /**
     * Acquires a lock for establishing dominance in order to execute the migrations
     */
    async acquireLock() {
        var _a;
        let lockAcquiredAt;
        try {
            const sqlQuery = `SELECT acquired_at FROM ${this.migrationsLockTable} FOR UPDATE`;
            const lock = await this.sequelize.query(sqlQuery);
            lockAcquiredAt = (_a = lock[0][0]) === null || _a === void 0 ? void 0 : _a.acquired_at;
        }
        catch (err) {
            this.lockAttempts++;
            this.logger.warn({ err: err.message, attempt: this.lockAttempts }, 'Could not check for lock. Attempting again...');
            if (this.lockAttempts <= 3) {
                return await this.acquireLock();
            }
            this.logger.error({ err: err.message }, `Could not check for lock after ${this.lockAttempts} attempts!`);
            throw new error_handler_1.GeneralError(err.message);
        }
        /*
         * If lock has been acquired more than `lockTimeoutSeconds` ago, then it must be stuck. Release and try again.
         * Otherwise, it has been acquired by another instance of the service that is executing the migrations right now.
         */
        if (lockAcquiredAt) {
            if ((Number(new Date()) - Number(new Date(lockAcquiredAt))) > this.lockTimeoutSeconds * 1000) {
                this.logger.warn({}, 'Lock is stuck. Releasing and acquiring over...');
                await this.releaseLock();
                return await this.acquireLock();
            }
            this.logger.info({}, 'Lock acquired by another service. Skip migrations!');
            return false;
        }
        try {
            await this.sequelize.query(`INSERT INTO ${this.migrationsLockTable}(acquired_at) VALUES (NOW())`, {
                raw: true
            });
            this.logger.info({}, 'Lock acquired!');
            return true;
        }
        catch (err) {
            throw new error_handler_1.GeneralError(err.message);
        }
    }
    /**
     * Releases the acquired lock of dominance
     */
    async releaseLock() {
        try {
            await this.sequelize.query(`DELETE FROM ${this.migrationsLockTable} WHERE acquired_at IS NOT NULL`);
            this.logger.info({}, 'Lock released!');
        }
        catch (err) {
            this.releaseAttempts++;
            this.logger.warn({ err: err.message, attempt: this.releaseAttempts }, 'Could not release lock. Attempting again...');
            if (this.releaseAttempts <= 3) {
                await this.releaseLock();
            }
            else {
                this.logger.error({ err: err.message }, `Could not release lock after ${this.releaseAttempts} attempts!`);
                throw new error_handler_1.GeneralError(err.message);
            }
        }
    }
}
exports.default = DBMigrator;
//# sourceMappingURL=index.js.map