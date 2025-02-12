const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Meth*2001',
    database: 'appointment_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release(); // Release connection back to the pool
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
})();

module.exports = pool;
