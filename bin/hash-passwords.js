const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const pool = new Pool(dbParams);

async function hashExistingPasswords() {
  try {
    // Get all users
    const result = await pool.query('SELECT id, email FROM users LIMIT 5;');
    
    // Default password for demo users
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // Update all users with hashed password
    await pool.query('UPDATE users SET password = $1;', [hashedPassword]);
    
    console.log('✓ All user passwords have been hashed');
    console.log('\n📋 Demo Login Credentials:');
    console.log('   Email: cmacgiffin0@squarespace.com');
    console.log('   Password: password123');
    console.log('\n   (All seeded users use password: password123)\n');
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

hashExistingPasswords();
