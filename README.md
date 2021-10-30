# db-migrator-distributed

# About

A tool for executing DB migrations based on Sequelize and Umzug.

The tool is safely executing migrations among distributed, synchronously launched server instances, by acquiring a
greedy lock on a migration table.

### Production tested

The tool has been tested and currently used in production env of one project.

It has been successfully tested with up to 6 simultaneously deployed instances.

Currently only tested with Postgres sequelize connection.

# Getting started

1. Install the package:

by:

```bash
npm i db-migrator-distributed
```

or by putting it in your `package.json` dependencies and running `npm i`

```json
    "db-migrator-distributed": "git+https://github.com/gvko/db-migrator-distributed.git",
```

2. In the file where you want to execute the migrations (usually the starting point of your server), import the lib and
   instantiate the migrator:

```typescript
import DbMigrator from 'db-migrator-distributed';

const dbMigrator = new DbMigrator({ sequelizeConnection: mySequelizeConn });
try {
  await dbMigrator.run();
} catch (err) {
  process.exit(1); // migrations were unsuccessful
}
```

3. Set up your migration files dir and structure. The most typical one would be to have the `/migrations` dir hold your
   migrations and put it right under the root source files dir, eg: `myProject/src/migrations`. Otherwise, you can
   specify the dir path in the init params of the DbMigrator constructor (see below for full list of possible params).

## List possible init params

* `sequelizeConnection {Sequelize}` *(mandatory)* The Sequelize connection instance that you use to connect to your DB

* `migrationsTable {string}` *(optional)* The DB table where Umzug keeps track of the executed migrations so far.
  **Default:** `'_migrations'`

* `migrationsLockTable {string}` *(optional)* The DB table that is going to be used for acquiring the migrations
  lock. **Default:** `'_migrations_lock'`

* `migrationsDirPath {string}` *(optional)* The dir path where you store your migrations files.
  **Default:** `'dist/migrations'`. If you don't use Typescript or a separate `/dist` dir for the compiled TS files,
  then `dist` won't make sense for you.

* `migrationFilesPattern {RegEx | string}` *(optional)* The regex by which Umzug will determine whether a file in your
  migrations dir is an actual migration file that is to be executed. **Default:** `/^\d+[\w-_]+\.js$/` . This would
  match for example `20200330092617-create-users-table.js`

* `extraMigrationFuncParams {any[]}` *(optional)* Params, values, objects that you want to pass to your `up()`
  and `down()` migrations execution functions. By default, the first two params will be the Sequelize `queryInterface`
  and the Sequelize instance.

* `loggger {any}` *(optional)* A logger that you want to use that the migrator will also use to log events. The default
  one is `bunyan` and it's set up to log to the console, so you don't have to provide anything, if you wish.
