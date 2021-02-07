// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./db.js');
const pool = new Pool(dbParams);

// db.connect();

module.exports = pool;
