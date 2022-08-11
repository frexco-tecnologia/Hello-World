const path = require('path');
const fs = require('fs');

const getFolder = base =>
    path.join(__dirname, base, 'business', 'repositories', 'migrations');

const migrationFolder = fs.existsSync(getFolder('src')) ? getFolder('src') : getFolder('dist');

const dbSettings = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: migrationFolder
  },
  seeds: {
    directory: path.join(migrationFolder, 'seeds')
  },
  debug: false
};

module.exports = {
  development: {...dbSettings},
  staging: {...dbSettings},
  production: {...dbSettings},
  test: {...dbSettings, client: 'sqlite3', connection: ':memory:'}
};
