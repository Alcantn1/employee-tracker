const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_mysql_password',
    database: 'employee_tracker_db',
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
  });