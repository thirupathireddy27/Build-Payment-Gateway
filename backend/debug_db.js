const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing DB connection...');
console.log('URL:', process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT 1', (err, res) => {
    if (err) {
        console.error('Connection Error:', err);
    } else {
        console.log('Connection Success! Result:', res.rows[0]);
    }
    pool.end();
});
