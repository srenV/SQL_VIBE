import type { Dataset } from "@/types/exercise";

export const storyRoteZoneDatasetEn: Dataset = {
  id: "story-rote-zone",
  name: "MedGov Hospital",
  description: "Story-exclusive hospital database for the case 'The Red Zone'.",
  tables: [
    {
      name: "departments",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
        { name: "floor", type: "INTEGER", nullable: false },
        { name: "bed_count", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "doctors",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "department_id", type: "INTEGER", nullable: false, references: "departments.id" },
        { name: "position", type: "VARCHAR(30)", nullable: false },
        { name: "salary", type: "DECIMAL(10,2)", nullable: false },
        { name: "hired_on", type: "DATE", nullable: false },
      ],
    },
    {
      name: "patients",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "birth_date", type: "DATE", nullable: false },
        { name: "gender", type: "VARCHAR(10)", nullable: false },
        { name: "address", type: "VARCHAR(200)", nullable: true },
        { name: "insured", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "treatments",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "patient_id", type: "INTEGER", nullable: false, references: "patients.id" },
        { name: "doctor_id", type: "INTEGER", nullable: false, references: "doctors.id" },
        { name: "diagnosis", type: "VARCHAR(200)", nullable: false },
        { name: "treatment_date", type: "DATE", nullable: false },
        { name: "duration_days", type: "INTEGER", nullable: false },
        { name: "cost", type: "DECIMAL(10,2)", nullable: false },
      ],
    },
    {
      name: "invoices",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "patient_id", type: "INTEGER", nullable: false, references: "patients.id" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "invoice_date", type: "DATE", nullable: false },
        { name: "due_date", type: "DATE", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  floor INTEGER NOT NULL,
  bed_count INTEGER NOT NULL
);
CREATE TABLE doctors (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL,
  position VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  hired_on DATE NOT NULL
);
CREATE TABLE patients (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  address VARCHAR(200),
  insured BOOLEAN NOT NULL
);
CREATE TABLE treatments (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  diagnosis VARCHAR(200) NOT NULL,
  treatment_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL
);
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL
);
INSERT INTO departments VALUES
(1,'Surgery',3,20),
(2,'Cardiology',2,15),
(3,'Internal Medicine',1,25),
(4,'Pediatrics',4,18),
(5,'Orthopedics',2,12),
(6,'General Medicine',1,30);
INSERT INTO doctors VALUES
(1,'Dr. Schnitt',1,'Chief Physician',16000.00,'2010-03-15'),
(2,'Dr. Herz',2,'Chief Physician',15000.00,'2012-07-01'),
(3,'Dr. Meyer',3,'Senior Physician',12000.00,'2015-01-20'),
(4,'Dr. Klein',4,'Chief Physician',13500.00,'2011-09-10'),
(5,'Dr. Braun',6,'Resident',8500.00,'2020-03-01'),
(6,'Dr. Hoffmann',5,'Senior Physician',11000.00,'2016-06-15'),
(7,'Dr. Werner',3,'Resident',8000.00,'2022-01-10'),
(8,'Dr. Gruber',1,'Resident',9000.00,'2021-08-20'),
(9,'Dr. Baum',2,'Senior Physician',12500.00,'2014-04-05'),
(10,'Dr. Frost',6,'Resident',8200.00,'2023-02-28');
INSERT INTO patients VALUES
(1,'Stefan Knochen','1985-04-12','male','Hauptstr. 5, East-Block-1',1),
(2,'Peter Schmerz','1990-08-22','male','Ringstr. 8, East-Block-2',0),
(3,'Thomas Fieber','1978-11-15','male','Lindenweg 3, East-Block-3',1),
(4,'Maria Kurz','1995-02-28','female','Gartenstr. 12, East-Block-1',1),
(5,'Ingrid Pfundig','1982-07-04','female','Marktplatz 7, East-Block-4',0),
(6,'Wolfgang Stark','1975-12-30','male','Bahnhofstr. 2, East-Block-2',0),
(7,'Claudia Bein','1988-05-16','female','Rosenweg 4, East-Block-3',1),
(8,'Karl Nerv','1970-09-08','male','Kirchstr. 9, East-Block-5',1),
(9,'Sandra Herz','1993-01-25','female','Eichenweg 6, East-Block-1',1),
(10,'Bruno Lung','1965-06-18','male','Wiesenstr. 11, East-Block-2',1);
INSERT INTO treatments VALUES
(1,1,1,'Rehabilitation after accident',  '2091-01-10',14,7200.00),
(2,1,1,'Femur fracture',   '2091-03-05',10,4800.00),
(3,2,1,'Appendicitis',                '2091-02-14',7, 5200.00),
(4,3,2,'Heart arrhythmia',         '2091-01-20',3, 3800.00),
(5,5,3,'Hypertension',               '2091-02-10',2, 2200.00),
(6,6,3,'Gallstone',                 '2091-03-01',4, 3500.00),
(7,4,4,'Tonsillitis',           '2091-01-15',2, 1800.00),
(8,7,6,'Complex cold',           '2091-02-20',2, 1400.00),
(9,8,2,'Coronary heart disease',     '2091-03-10',3, 4100.00),
(10,9,3,'Stomach ulcer',              '2091-01-25',3, 2400.00),
(11,10,1,'Appendicitis',      '2091-02-05',2, 4200.00),
(12,2,5,'Appendicitis follow-up','2091-03-20',2, 1800.00),
(13,3,2,'Check-up',       '2091-04-01',1, 800.00),
(14,8,3,'Blood pressure check',         '2091-04-05',1, 600.00),
(15,4,6,'Aftercare',                  '2091-04-10',1, 600.00);
INSERT INTO invoices VALUES
(1,3,6000.00,'open',  '2091-02-01','2091-03-01'),
(2,2,5200.00,'open',  '2091-03-01','2091-04-01'),
(3,1,4800.00,'open',  '2091-03-15','2091-04-15'),
(4,1,7200.00,'paid','2091-01-25','2091-02-25'),
(5,4,1800.00,'paid','2091-01-20','2091-02-20'),
(6,5,2200.00,'paid','2091-02-15','2091-03-15'),
(7,6,3500.00,'paid','2091-03-10','2091-04-10'),
(8,8,4100.00,'paid','2091-03-20','2091-04-20'),
(9,9,2400.00,'paid','2091-02-05','2091-03-05'),
(10,10,4200.00,'paid','2091-02-15','2091-03-15'),
(11,7,1400.00,'paid','2091-03-01','2091-04-01'),
(12,2,1800.00,'pending','2091-03-25','2091-04-25');
`,
};
