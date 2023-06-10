const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Neeknasty69!',
  database: 'employee_tracker_db'
});

module.exports = connection;
