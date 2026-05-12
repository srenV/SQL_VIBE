import type { Dataset } from "@/types/exercise";

export const storyAnna7DatasetEn: Dataset = {
  id: "story-anna7",
  name: "Corporate HR (ANNA-7)",
  description: "Story-exclusive HR database for the case 'Missing: Unit ANNA-7'.",
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
        { name: "start_date", type: "DATE", nullable: false },
        { name: "manager_id", type: "INTEGER", nullable: true, references: "employees.id" },
      ],
    },
    {
      name: "vacation",
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
  department_id INTEGER NOT NULL,
  position VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  manager_id INTEGER
);
CREATE TABLE vacation (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  approved BOOLEAN NOT NULL
);
CREATE TABLE applications (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL,
  application_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL
);
INSERT INTO departments VALUES
(1,'Development','Sector-7','280000.00'),
(2,'Sales','Sector-2','190000.00'),
(3,'HR','Sector-1','120000.00'),
(4,'Finance','Sector-4','160000.00'),
(5,'IT Security','Sector-9','220000.00'),
(6,'Special Unit','Sector-0','500000.00');
INSERT INTO employees VALUES
(1,'Anna Schmidt',1,'Senior System Architect',72000.00,'2019-03-15',NULL),
(2,'Ben Mueller',1,'Developer',58000.00,'2020-06-01',1),
(3,'Maria Wagner',1,'Junior Developer',45000.00,'2022-01-10',1),
(4,'Lisa Fischer',2,'Sales Manager',52000.00,'2018-07-20',NULL),
(5,'Max Schmidt',3,'HR Specialist',48000.00,'2021-04-05',NULL),
(6,'Sarah Keller',4,'Financial Analyst',40000.00,'2023-02-12',NULL),
(7,'Viktor Shen',5,'Security Analyst',65000.00,'2017-09-30',NULL),
(8,'Stefan Wolff',6,'Project Manager',85000.00,'2015-11-01',NULL);
INSERT INTO vacation VALUES
(1,1,'2024-01-10','2024-01-19',10,1),
(2,2,'2024-07-15','2024-07-20',6,1),
(3,3,'2024-02-05','2024-02-09',5,1),
(4,4,'2024-03-01','2024-03-10',10,1),
(5,5,'2024-04-15','2024-04-20',6,0),
(6,6,'2024-06-01','2024-06-07',7,1);
INSERT INTO applications VALUES
(1,'Paul Schmitz','paul.schmitz@mail.com',1,'2024-01-10','received'),
(2,'Tom Meier','tom.meier@mail.com',1,'2024-02-01','rejected'),
(3,'Noah Berger','noah.berger@mail.com',1,'2024-04-20','offer'),
(4,'Julia Bauer','julia.bauer@mail.com',2,'2024-01-25','received'),
(5,'Kai Hoffmann','kai.hoffmann@mail.com',3,'2024-03-12','offer');
`,
};
