// load .env data into process.env
require('dotenv').config();

// other dependencies
const fs = require('fs');
const chalk = require('chalk');
const { Client } = require('pg');
const dbParams = require('../lib/db.js');

const client = new Client(dbParams);

const runSchemaFiles = async function () {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync('./db/schema');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/schema/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await client.query(sql);
  }
};

const runSeedFiles = async function () {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const schemaFilenames = fs.readdirSync('./db/seeds');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/seeds/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await client.query(sql);
  }
};

(async () => {
  try {
    console.log(`-> Connecting to PG ...`);
    await client.connect();
    await runSchemaFiles();
    await runSeedFiles();
    await client.end();
    console.log(chalk.green(`-> Database reset complete!`));
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err}`));
    await client.end();
    process.exit(1);
  }
})();
