const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Neeknasty69!',
    database: 'employee_tracker_db',
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
  });

  function startApp() {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all departments':
            viewDepartments();
            break;
          case 'View all roles':
            viewRoles();
            break;
          case 'View all employees':
            viewEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connection.end();
            break;
        }
      });
  }


// Function to view all departments
function viewDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      console.table('Departments:', res);
      startApp();
    });
  }
  
  // Function to view all roles
  function viewRoles() {
    connection.query(
      `SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      INNER JOIN department ON role.department_id = department.id`,
      (err, res) => {
        if (err) throw err;
        console.table('Roles:', res);
        startApp();
      }
    );
  }
  
  // Function to view all employees
  function viewEmployees() {
    connection.query(
      `SELECT employee.id, employee.first_name, employee.last_name, 
      role.title, department.name AS department, role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`,
      (err, res) => {
        if (err) throw err;
        console.table('Employees:', res);
        startApp();
      }
    );
  }
  
  // Function to add a department
  function addDepartment() {
    inquirer
      .prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:',
      })
      .then((answer) => {
        connection.query(
          'INSERT INTO department SET ?',
          { name: answer.departmentName },
          (err, res) => {
            if (err) throw err;
            console.log('Department added successfully!');
            startApp();
          }
        );
      });
  }
  
  // Function to add a role
  function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            name: 'roleTitle',
            type: 'input',
            message: 'Enter the title of the role:',
          },
          {
            name: 'roleSalary',
            type: 'input',
            message: 'Enter the salary of the role:',
          },
          {
            name: 'departmentId',
            type: 'list',
            message: 'Select the department for the role:',
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            'INSERT INTO role SET ?',
            {
              title: answer.roleTitle,
              salary: answer.roleSalary,
              department_id: answer.departmentId,
            },
            (err, res) => {
              if (err) throw err;
              console.log('Role added successfully!');
              startApp();
            }
          );
        });
    });
  }
  
  // Function to add an employee
  function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            name: 'firstName',
            type: 'input',
            message: "Enter the employee's first name:",
          },
          {
            name: 'lastName',
            type: 'input',
            message: "Enter the employee's last name:",
          },
          {
            name: 'roleId',
            type: 'list',
            message: "Select the employee's role:",
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
        ])
        .then((employeeAnswer) => {
          connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
  
            inquirer
              .prompt([
                {
                  name: 'managerId',
                  type: 'list',
                  message: "Select the employee's manager:",
                  choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                  })),
                },
              ])
              .then((managerAnswer) => {
                connection.query(
                  'INSERT INTO employee SET ?',
                  {
                    first_name: employeeAnswer.firstName,
                    last_name: employeeAnswer.lastName,
                    role_id: employeeAnswer.roleId,
                    manager_id: managerAnswer.managerId,
                  },
                  (err, res) => {
                    if (err) throw err;
                    console.log('Employee added successfully!');
                    startApp();
                  }
                );
              });
          });
        });
    });
  }
  
  // Function to update an employee's role
  function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
  
      inquirer
        .prompt({
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        })
        .then((employeeAnswer) => {
          connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
  
            inquirer
              .prompt({
                name: 'roleId',
                type: 'list',
                message: 'Select the new role for the employee:',
                choices: roles.map((role) => ({
                  name: role.title,
                  value: role.id,
                })),
              })
              .then((roleAnswer) => {
                connection.query(
                  'UPDATE employee SET ? WHERE ?',
                  [
                    { role_id: roleAnswer.roleId },
                    { id: employeeAnswer.employeeId },
                  ],
                  (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    startApp();
                  }
                );
              });
          });
        });
    });
  }