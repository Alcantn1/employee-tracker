INSERT INTO department 
(name) 
VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance');

INSERT INTO role 
(title, salary, department_id) 
VALUES
  ('Sales Manager', 60000, 1),
  ('Sales Representative', 40000, 1),
  ('Marketing Manager', 55000, 2),
  ('Marketing Coordinator', 35000, 2),
  ('Financial Analyst', 50000, 3),
  ('Accountant', 45000, 3);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
 VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1),
  ('Sarah', 'Williams', 4, 2),
  ('David', 'Brown', 5, 3),
  ('Emily', 'Taylor', 6, 3);
