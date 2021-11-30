export default class DBMigrator {
    private readonly logger;
    private readonly umzug;
    private readonly sequelize;
    private readonly migrationsLockTable;
    private readonly lockTimeoutSeconds;
    private readonly firebaseAdmin;
    private readonly firebaseMigrationsDirPath;
    private lockAttempts;
    private releaseAttempts;
    constructor({ sequelizeConnection, migrationsTable, migrationsLockTable, lockTimeoutSeconds, migrationsDirPath, migrationFilesPattern, // eslint-disable-line
    logger, firebaseAdmin, firebaseMigrationsDirPath, extraMigrationFuncParams }: {
        sequelizeConnection: any;
        migrationsTable?: string;
        migrationsLockTable?: string;
        lockTimeoutSeconds?: number;
        migrationsDirPath?: string;
        migrationFilesPattern?: RegExp;
        logger?: any;
        firebaseAdmin?: any;
        firebaseMigrationsDirPath?: any;
        extraMigrationFuncParams?: any[];
    });
    /**
     * Combines all functions that need to be executed in sequence in order to run the migration process.
     */
    run(): Promise<void>;
    /**
     * Checks if the migrations lock table exists. If not, creates it, since it's needed for acquiring the lock.
     */
    private checkLockTableExistsOrCreate;
    /**
     * Executes the pending migrations
     */
    private executeMigrations;
    /**
     * Executes the pending migrations in Firestore
     */
    private executeFirestoreMigrations;
    /**
     * Acquires a lock for establishing dominance in order to execute the migrations
     */
    private acquireLock;
    /**
     * Releases the acquired lock of dominance
     */
    private releaseLock;
}
