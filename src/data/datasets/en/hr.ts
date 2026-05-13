/**
 * HR System dataset – English version.
 * Employees, Departments, Salaries, Vacations, and Applications
 * for HR-related SQL exercises.
 */
import type { Dataset } from "@/types/exercise";

export const hrDatasetEn: Dataset = {
  id: "hr",
  name: "HR System",
  description:
    "An HR system with employees, departments, salaries, vacations, and applications.",
  tables: [
    {
      name: "departments",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
        { name: "location", type: "VARCHAR(50)", nullable: false },
        { name: "budget", type: "DECIMAL(12,2)", nullable: false },
      ],
    },
    {
      name: "employees",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "department_id", type: "INTEGER", nullable: false, references: "departments.id" },
        { name: "position", type: "VARCHAR(50)", nullable: false },
        { name: "salary", type: "DECIMAL(10,2)", nullable: false },
        { name: "hire_date", type: "DATE", nullable: false },
        { name: "manager_id", type: "INTEGER", nullable: true, references: "employees.id" },
      ],
    },
    {
      name: "vacations",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "employee_id", type: "INTEGER", nullable: false, references: "employees.id" },
        { name: "start_date", type: "DATE", nullable: false },
        { name: "end_date", type: "DATE", nullable: false },
        { name: "days", type: "INTEGER", nullable: false },
        { name: "approved", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "applications",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "department_id", type: "INTEGER", nullable: false, references: "departments.id" },
        { name: "application_date", type: "DATE", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  budget DECIMAL(12,2) NOT NULL
);
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  position VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  hire_date DATE NOT NULL,
  manager_id INTEGER
);
CREATE TABLE vacations (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  approved BOOLEAN NOT NULL
);
CREATE TABLE applications (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  application_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL
);
INSERT INTO departments VALUES
(1,'Engineering','London',500000.00),
(2,'Sales','Manchester',300000.00),
(3,'Marketing','Birmingham',250000.00),
(4,'Finance','London',200000.00),
(5,'HR','Cologne',150000.00),
(6,'Support','Manchester',180000.00);
INSERT INTO employees VALUES
(1,'Anna Schmidt',1,'Senior Developer',72000.00,'2018-03-15',NULL),
(2,'Ben Mueller',1,'Developer',58000.00,'2020-06-01',1),
(3,'Clara Fischer',2,'Sales Manager',65000.00,'2019-01-10',NULL),
(4,'David Wagner',2,'Sales Representative',48000.00,'2021-04-20',3),
(5,'Elena Becker',3,'Marketing Manager',62000.00,'2019-09-15',NULL),
(6,'Felix Hoffmann',3,'Content Creator',45000.00,'2022-02-28',5),
(7,'Greta Lang',4,'Controller',60000.00,'2017-11-01',NULL),
(8,'Henrik Bauer',4,'Accountant',42000.00,'2021-08-15',7),
(9,'Ines Keller',5,'HR Manager',55000.00,'2020-01-20',NULL),
(10,'Jakob Neumann',5,'Recruiter',40000.00,'2022-05-10',9),
(11,'Kira Wolf',6,'Support Lead',50000.00,'2019-07-01',NULL),
(12,'Lars Krause',6,'Support Agent',38000.00,'2023-01-15',11),
(13,'Maria Maier',1,'Junior Developer',45000.00,'2023-03-01',1),
(14,'Noah Peters',2,'Sales Representative',47000.00,'2023-06-15',3),
(15,'Olivia Braun',3,'Social Media Manager',44000.00,'2023-09-01',5);
INSERT INTO vacations VALUES
(1,1,'2024-06-01','2024-06-10',10,1),
(2,2,'2024-07-15','2024-07-20',6,1),
(3,3,'2024-08-01','2024-08-14',14,1),
(4,4,'2024-09-05','2024-09-10',6,0),
(5,5,'2024-06-20','2024-06-25',6,1),
(6,6,'2024-10-01','2024-10-05',5,0),
(7,7,'2024-07-01','2024-07-15',15,1),
(8,8,'2024-11-10','2024-11-15',6,1),
(9,9,'2024-08-20','2024-08-25',6,1),
(10,10,'2024-12-20','2024-12-24',5,0),
(11,11,'2024-06-15','2024-06-20',6,1),
(12,12,'2024-09-01','2024-09-03',3,1),
(13,13,'2024-07-10','2024-07-12',3,0),
(14,14,'2024-08-05','2024-08-10',6,1),
(15,15,'2024-10-15','2024-10-20',6,0);
INSERT INTO applications VALUES
(1,'Paul Schmitz','paul@applicant.de','2024-01-10','received'),
(2,'Lisa Weber','lisa@applicant.de','2024-01-15','interview'),
(3,'Tom Meier','tom@applicant.de','2024-02-01','rejected'),
(4,'Nina Hartmann','nina@applicant.de','2024-02-20','received'),
(5,'Leon Schwarz','leon@applicant.de','2024-03-05','offer'),
(6,'Emma Richter','emma@applicant.de','2024-03-15','interview'),
(7,'Finn Lorenz','finn@applicant.de','2024-04-01','received'),
(8,'Mia Schmid','mia@applicant.de','2024-04-10','rejected'),
(9,'Noah Berger','noah@applicant.de','2024-04-20','offer'),
(10,'Sophia Wolf','sophia@applicant.de','2024-05-01','received');
`,
};