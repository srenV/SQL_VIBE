/**
 * Hospital Management dataset (English).
 * Contains patients, doctors, departments, treatments, and invoices
 * for complex JOIN and analytics exercises.
 */
import type { Dataset } from "@/types/exercise";

export const hospitalDatasetEn: Dataset = {
  id: "hospital",
  name: "Hospital Management",
  description:
    "A hospital system with patients, doctors, departments, treatments, and invoices for complex JOIN and analytics exercises.",
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
  department_id INTEGER NOT NULL REFERENCES departments(id),
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
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  doctor_id INTEGER NOT NULL REFERENCES doctors(id),
  diagnosis VARCHAR(200) NOT NULL,
  treatment_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL
);
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL
);
INSERT INTO departments VALUES
(1,'Cardiology',3,40),
(2,'Neurology',4,35),
(3,'Surgery',2,50),
(4,'Pediatrics',5,30),
(5,'Internal Medicine',1,60),
(6,'Emergency Room',0,20);
INSERT INTO doctors VALUES
(1,'Dr. Herz','Cardiology','Chief Physician',15000.00,'2015-03-01'),
(2,'Dr. Nerv','Neurology','Senior Physician',12000.00,'2016-06-15'),
(3,'Dr. Schnitt','Surgery','Chief Physician',16000.00,'2014-01-10'),
(4,'Dr. Kind','Pediatrics','Specialist',9500.00,'2019-09-01'),
(5,'Dr. Allgemeinn','Internal Medicine','Senior Physician',11000.00,'2017-11-01'),
(6,'Dr. Puls','Cardiology','Specialist',10000.00,'2020-02-15'),
(7,'Dr. Brain','Neurology','Specialist',9800.00,'2021-04-01'),
(8,'Dr. Knochen','Surgery','Resident',7500.00,'2022-08-01'),
(9,'Dr. Wund','Surgery','Specialist',10500.00,'2018-05-10'),
(10,'Dr. Haus','Internal Medicine','Chief Physician',14500.00,'2013-07-01');
INSERT INTO patients VALUES
(1,'Karl Herzberg','1950-03-15','m','Hauptstr. 1, Berlin',1),
(2,'Helga Muellerin','1945-07-22','f','Parkweg 5, Hamburg',1),
(3,'Peter Schmerz','1988-11-04','m','Ringstr. 12, Munich',0),
(4,'Maria Gesund','1995-05-18','f','Marktplatz 3, Cologne',1),
(5,'Stefan Knochen','1970-09-30','m','Lindenallee 8, Stuttgart',1),
(6,'Ingrid Pfundig','1960-01-14','f','Rosenweg 2, Frankfurt',0),
(7,'Thomas Fieber','1992-12-08','m','Kirchstr. 7, Dresden',1),
(8,'Sabine Ruhig','1982-04-25','f','Eichenweg 4, Bremen',1),
(9,'Wolfgang Stark','1978-06-30','m','Goethestr. 10, Leipzig',0),
(10,'Petra Leicht','1990-08-16','f','Schillerstr. 6, Nuremberg',1);
INSERT INTO treatments VALUES
(1,1,1,'Heart arrhythmia','2024-01-15',5,3500.00),
(2,2,5,'Diabetes check','2024-01-20',3,1800.00),
(3,3,3,'Appendicitis','2024-02-05',7,5200.00),
(4,4,4,'Pediatric examination','2024-01-10',1,450.00),
(5,5,9,'Bone fracture','2024-02-15',10,4800.00),
(6,6,5,'Hypertension','2024-01-25',4,2200.00),
(7,7,6,'Cardiac catheterization','2024-03-01',3,6000.00),
(8,8,2,'Migraine','2024-02-10',2,1500.00),
(9,9,3,'Gallstone','2024-03-05',5,3500.00),
(10,10,5,'Allergy test','2024-01-30',1,600.00),
(11,1,6,'Heart valve check','2024-04-01',2,4200.00),
(12,3,8,'Follow-up treatment','2024-03-10',3,1800.00),
(13,5,3,'Rehabilitation','2024-03-20',14,7200.00),
(14,7,1,'ECG check','2024-04-15',1,800.00),
(15,8,7,'CT scan','2024-03-12',1,2500.00);
INSERT INTO invoices VALUES
(1,1,3500.00,'paid','2024-02-01','2024-03-01'),
(2,2,1800.00,'paid','2024-02-20','2024-03-20'),
(3,3,5200.00,'open','2024-03-05','2024-04-05'),
(4,4,450.00,'paid','2024-02-10','2024-03-10'),
(5,5,4800.00,'open','2024-03-15','2024-04-15'),
(6,6,2200.00,'paid','2024-02-25','2024-03-25'),
(7,7,6000.00,'open','2024-04-01','2024-05-01'),
(8,8,1500.00,'overdue','2024-03-10','2024-04-10'),
(9,9,3500.00,'paid','2024-04-05','2024-05-05'),
(10,10,600.00,'paid','2024-03-01','2024-04-01'),
(11,11,4200.00,'open','2024-05-01','2024-06-01'),
(12,12,1800.00,'paid','2024-04-10','2024-05-10'),
(13,13,7200.00,'open','2024-04-20','2024-05-20'),
(14,14,800.00,'paid','2024-05-15','2024-06-15'),
(15,15,2500.00,'overdue','2024-04-12','2024-05-12');
`,
};
