const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      // change to your username
  host: 'localhost',
  database: 'ground_booking', // create this in PostgreSQL
  password: 'Sonamyangchen',   // change to your password
  port: 5432,
});

module.exports = pool;
