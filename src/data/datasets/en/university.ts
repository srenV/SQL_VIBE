/**
 * University dataset (English).
 * Contains students, professors, courses, enrollments, and exams
 * for university-related SQL exercises.
 */
import type { Dataset } from "@/types/exercise";

export const universityDatasetEn: Dataset = {
  id: "university",
  name: "University",
  description:
    "A university system with students, professors, courses, enrollments, and exams.",
  tables: [
    {
      name: "students",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "semester", type: "INTEGER", nullable: false },
        { name: "major", type: "VARCHAR(50)", nullable: false },
        { name: "enrollment_date", type: "DATE", nullable: false },
      ],
    },
    {
      name: "professors",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "faculty", type: "VARCHAR(50)", nullable: false },
        { name: "salary", type: "DECIMAL(10,2)", nullable: false },
        { name: "hired_on", type: "DATE", nullable: false },
      ],
    },
    {
      name: "courses",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "professor_id", type: "INTEGER", nullable: false, references: "professors.id" },
        { name: "credits", type: "INTEGER", nullable: false },
        { name: "semester", type: "VARCHAR(20)", nullable: false },
        { name: "max_participants", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "enrollments",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "student_id", type: "INTEGER", nullable: false, references: "students.id" },
        { name: "course_id", type: "INTEGER", nullable: false, references: "courses.id" },
        { name: "grade", type: "DECIMAL(3,1)", nullable: true },
        { name: "semester", type: "VARCHAR(20)", nullable: false },
      ],
    },
    {
      name: "exams",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "course_id", type: "INTEGER", nullable: false, references: "courses.id" },
        { name: "date", type: "DATE", nullable: false },
        { name: "type", type: "VARCHAR(20)", nullable: false },
        { name: "max_points", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "exam_results",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "exam_id", type: "INTEGER", nullable: false, references: "exams.id" },
        { name: "student_id", type: "INTEGER", nullable: false, references: "students.id" },
        { name: "points", type: "INTEGER", nullable: false },
        { name: "passed", type: "BOOLEAN", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  semester INTEGER NOT NULL,
  major VARCHAR(50) NOT NULL,
  enrollment_date DATE NOT NULL
);
CREATE TABLE professors (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  faculty VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  hired_on DATE NOT NULL
);
CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  professor_id INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  semester VARCHAR(20) NOT NULL,
  max_participants INTEGER NOT NULL
);
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade DECIMAL(3,1),
  semester VARCHAR(20) NOT NULL
);
CREATE TABLE exams (
  id INTEGER PRIMARY KEY,
  course_id INTEGER NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL,
  max_points INTEGER NOT NULL
);
CREATE TABLE exam_results (
  id INTEGER PRIMARY KEY,
  exam_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  points INTEGER NOT NULL,
  passed BOOLEAN NOT NULL
);
INSERT INTO students VALUES
(1,'Lukas Weber','lukas@uni.de',3,'Computer Science','2022-10-01'),
(2,'Marie Schneider','marie@uni.de',5,'Mathematics','2021-10-01'),
(3,'Jonas Braun','jonas@uni.de',2,'Computer Science','2023-10-01'),
(4,'Sophie Fischer','sophie@uni.de',7,'Physics','2020-10-01'),
(5,'Tim Mueller','tim@uni.de',1,'Computer Science','2024-10-01'),
(6,'Laura Becker','laura@uni.de',4,'Mathematics','2022-04-01'),
(7,'Felix Wagner','felix@uni.de',6,'Physics','2021-04-01'),
(8,'Anna Hoffmann','anna@uni.de',3,'Computer Science','2022-10-01'),
(9,'Max Schmitz','max@uni.de',2,'Economics','2023-10-01'),
(10,'Emma Klein','emma@uni.de',5,'Computer Science','2021-10-01'),
(11,'Leon Krause','leon@uni.de',1,'Mathematics','2024-10-01'),
(12,'Hannah Wolf','hannah@uni.de',4,'Economics','2022-04-01'),
(13,'Julian Maier','julian@uni.de',8,'Computer Science','2020-10-01'),
(14,'Sarah Neumann','sarah@uni.de',3,'Physics','2022-10-01'),
(15,'David Hartmann','david@uni.de',6,'Mathematics','2021-04-01');
INSERT INTO professors VALUES
(1,'Prof. Dr. Mueller','Computer Science',8500.00,'2015-03-01'),
(2,'Prof. Dr. Schmidt','Mathematics',7800.00,'2012-06-15'),
(3,'Prof. Dr. Fischer','Physics',8200.00,'2018-09-01'),
(4,'Prof. Dr. Weber','Economics',7500.00,'2016-01-10'),
(5,'Prof. Dr. Keller','Computer Science',9000.00,'2010-11-01');
INSERT INTO courses VALUES
(1,'Databases',1,6,'WS2024',40),
(2,'Algorithms',1,6,'WS2024',35),
(3,'Linear Algebra',2,8,'WS2024',50),
(4,'Analysis I',2,8,'WS2024',45),
(5,'Quantum Mechanics',3,6,'WS2024',30),
(6,'Business Administration Basics',4,4,'WS2024',60),
(7,'Machine Learning',5,6,'WS2024',25),
(8,'Statistics',2,6,'SS2024',40),
(9,'Software Engineering',1,6,'SS2024',30),
(10,'Theoretical Physics',3,8,'SS2024',20);
INSERT INTO enrollments VALUES
(1,1,1,2.3,'WS2024'),
(2,1,2,1.7,'WS2024'),
(3,2,3,1.0,'WS2024'),
(4,2,4,1.3,'WS2024'),
(5,3,1,2.7,'WS2024'),
(6,3,2,3.0,'WS2024'),
(7,4,5,1.7,'WS2024'),
(8,5,1,NULL,'WS2024'),
(9,5,2,NULL,'WS2024'),
(10,6,3,2.0,'WS2024'),
(11,6,8,1.3,'SS2024'),
(12,7,5,2.3,'WS2024'),
(13,8,1,1.7,'WS2024'),
(14,8,7,2.0,'WS2024'),
(15,9,6,2.7,'WS2024'),
(16,10,7,1.0,'WS2024'),
(17,10,1,1.3,'WS2024'),
(18,11,3,NULL,'WS2024'),
(19,12,6,2.0,'WS2024'),
(20,13,9,1.7,'SS2024'),
(21,13,1,1.0,'WS2024'),
(22,14,5,2.7,'WS2024'),
(23,15,8,1.3,'SS2024'),
(24,15,3,1.0,'WS2024'),
(25,1,7,2.0,'WS2024');
INSERT INTO exams VALUES
(1,1,'2024-02-15','Written Exam',60),
(2,2,'2024-02-20','Written Exam',80),
(3,3,'2024-02-10','Written Exam',50),
(4,4,'2024-02-12','Written Exam',100),
(5,5,'2024-02-18','Oral Exam',30),
(6,6,'2024-02-22','Written Exam',40),
(7,7,'2024-07-15','Project',100),
(8,8,'2024-07-10','Written Exam',60);
INSERT INTO exam_results VALUES
(1,1,1,48,1),
(2,1,3,35,1),
(3,1,5,28,0),
(4,1,8,52,1),
(5,1,10,55,1),
(6,1,13,58,1),
(7,2,1,72,1),
(8,2,3,55,1),
(9,2,5,40,0),
(10,2,8,65,1),
(11,3,2,48,1),
(12,3,4,45,1),
(13,3,6,38,0),
(14,3,7,42,0),
(15,3,9,50,1),
(16,3,11,47,1),
(17,3,14,49,1),
(18,4,2,85,1),
(19,4,4,78,1),
(20,4,6,65,1),
(21,4,7,72,1),
(22,4,9,88,1),
(23,4,11,92,1),
(24,4,14,75,1),
(25,5,4,25,1),
(26,5,7,22,1),
(27,5,12,28,1),
(28,5,14,20,0),
(29,6,9,35,1),
(30,6,12,32,1),
(31,6,15,38,1),
(32,7,1,85,1),
(33,7,3,78,1),
(34,7,5,92,1),
(35,7,8,88,1),
(36,7,10,95,1),
(37,7,13,90,1),
(38,8,2,55,1),
(39,8,6,48,1),
(40,8,11,52,1),
(41,8,15,58,1);`,
};
