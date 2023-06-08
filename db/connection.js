const mysql = require('mysql2');

// Create a connection pool
const connection = mysql.createconnection({
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: 'Neeknasty69!',
  database: 'employees'
});

// Export the pool as the connection
module.exports = connection();
