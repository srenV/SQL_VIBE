/**
 * Banking-Light dataset (English).
 * Contains accounts, customers, transactions, and fraud detection cases
 * for banking-related SQL exercises.
 */
import type { Dataset } from "@/types/exercise";

export const bankingDatasetEn: Dataset = {
  id: "banking",
  name: "Banking-Light",
  description:
    "A simplified banking system with accounts, customers, transactions, and fraud detection cases.",
  tables: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "birth_date", type: "DATE", nullable: false },
        { name: "address", type: "VARCHAR(200)", nullable: false },
        { name: "registered_at", type: "DATE", nullable: false },
      ],
    },
    {
      name: "accounts",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "customer_id", type: "INTEGER", nullable: false, references: "customers.id" },
        { name: "account_number", type: "VARCHAR(20)", nullable: false },
        { name: "type", type: "VARCHAR(20)", nullable: false },
        { name: "balance", type: "DECIMAL(12,2)", nullable: false },
        { name: "opened_at", type: "DATE", nullable: false },
      ],
    },
    {
      name: "transactions",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "account_id", type: "INTEGER", nullable: false, references: "accounts.id" },
        { name: "amount", type: "DECIMAL(12,2)", nullable: false },
        { name: "type", type: "VARCHAR(10)", nullable: false },
        { name: "description", type: "VARCHAR(200)", nullable: true },
        { name: "date", type: "DATETIME", nullable: false },
      ],
    },
    {
      name: "fraud_cases",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "transaction_id", type: "INTEGER", nullable: false, references: "transactions.id" },
        { name: "reason", type: "VARCHAR(100)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "reported_at", type: "DATETIME", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  address VARCHAR(200) NOT NULL,
  registered_at DATE NOT NULL
);
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  account_number VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  opened_at DATE NOT NULL
);
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id),
  amount DECIMAL(12,2) NOT NULL,
  type VARCHAR(10) NOT NULL,
  description VARCHAR(200),
  date DATETIME NOT NULL
);
CREATE TABLE fraud_cases (
  id INTEGER PRIMARY KEY,
  transaction_id INTEGER NOT NULL REFERENCES transactions(id),
  reason VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  reported_at DATETIME NOT NULL
);
INSERT INTO customers VALUES
(1,'Helmut Richter','1960-03-15','Hauptstrasse 1, Berlin','2015-01-10'),
(2,'Brigitte Mueller','1975-07-22','Bahnhofstrasse 5, Muenchen','2016-02-20'),
(3,'Klaus Fischer','1988-11-04','Ringstrasse 12, Hamburg','2018-03-15'),
(4,'Petra Wagner','1992-05-18','Marktplatz 3, Koeln','2019-04-05'),
(5,'Wolfgang Becker','1955-09-30','Lindenallee 8, Stuttgart','2014-05-12'),
(6,'Ursula Hoffmann','1980-01-14','Rosenweg 2, Frankfurt','2017-06-18'),
(7,'Dieter Lang','1995-12-08','Kirchstrasse 7, Dresden','2020-07-22'),
(8,'Monika Bauer','1970-04-25','Eichenweg 4, Bremen','2015-08-30');
INSERT INTO accounts VALUES
(1,1,'DE12345678901234567890','Checking Account',12500.00,'2015-01-10'),
(2,1,'DE98765432109876543210','Savings Account',45000.00,'2015-01-10'),
(3,2,'DE11111111111111111111','Checking Account',3200.00,'2016-02-20'),
(4,2,'DE22222222222222222222','Savings Account',28000.00,'2016-02-20'),
(5,3,'DE33333333333333333333','Checking Account',1500.00,'2018-03-15'),
(6,4,'DE44444444444444444444','Checking Account',8900.00,'2019-04-05'),
(7,4,'DE55555555555555555555','Savings Account',15000.00,'2019-04-05'),
(8,5,'DE66666666666666666666','Checking Account',67000.00,'2014-05-12'),
(9,6,'DE77777777777777777777','Checking Account',4200.00,'2017-06-18'),
(10,6,'DE88888888888888888888','Savings Account',12000.00,'2017-06-18'),
(11,7,'DE99999999999999999999','Checking Account',800.00,'2020-07-22'),
(12,8,'DE00000000000000000000','Checking Account',5600.00,'2015-08-30');
INSERT INTO transactions VALUES
(1,1,2500.00,'credit','Salary January','2024-01-01 08:00:00'),
(2,1,-120.50,'debit','Rent','2024-01-02 10:00:00'),
(3,1,-45.00,'debit','Supermarket','2024-01-03 14:30:00'),
(4,1,-200.00,'debit','Gas Station','2024-01-05 09:00:00'),
(5,1,2500.00,'credit','Salary February','2024-02-01 08:00:00'),
(6,1,-5000.00,'debit','Transfer to Account 3','2024-02-10 11:00:00'),
(7,2,1800.00,'credit','Salary January','2024-01-01 08:00:00'),
(8,2,-800.00,'debit','Rent','2024-01-02 10:00:00'),
(9,2,-60.00,'debit','Supermarket','2024-01-03 14:30:00'),
(10,2,1800.00,'credit','Salary February','2024-02-01 08:00:00'),
(11,3,5000.00,'credit','Transfer from Account 1','2024-02-10 11:00:00'),
(12,3,-30.00,'debit','Cafe','2024-02-11 15:00:00'),
(13,4,2200.00,'credit','Salary January','2024-01-01 08:00:00'),
(14,4,-950.00,'debit','Rent','2024-01-02 10:00:00'),
(15,4,-85.00,'debit','Supermarket','2024-01-03 14:30:00'),
(16,5,3500.00,'credit','Salary January','2024-01-01 08:00:00'),
(17,5,-2000.00,'debit','Savings Transfer','2024-01-05 09:00:00'),
(18,6,1900.00,'credit','Salary January','2024-01-01 08:00:00'),
(19,6,-720.00,'debit','Rent','2024-01-02 10:00:00'),
(20,7,1500.00,'credit','Salary January','2024-01-01 08:00:00'),
(21,8,-9999.99,'debit','Online Shop Luxury','2024-01-06 03:00:00'),
(22,8,-4999.99,'debit','Online Shop Luxury','2024-01-06 03:15:00'),
(23,9,1400.00,'credit','Salary January','2024-01-01 08:00:00'),
(24,10,-5000.00,'debit','Savings Transfer','2024-01-10 10:00:00'),
(25,11,800.00,'credit','Salary January','2024-01-01 08:00:00'),
(26,12,2100.00,'credit','Salary January','2024-01-01 08:00:00'),
(27,12,-650.00,'debit','Rent','2024-01-02 10:00:00'),
(28,1,-999.99,'debit','Online Shop','2024-01-06 02:00:00');
INSERT INTO fraud_cases VALUES
(1,21,'Unusual time and high amount','under_investigation','2024-01-07 09:00:00'),
(2,22,'Unusual time and high amount','under_investigation','2024-01-07 09:00:00'),
(3,28,'Nighttime transaction outside normal behavior','under_investigation','2024-01-07 09:00:00'),
(4,6,'Large transfer to unknown account','closed','2024-02-11 10:00:00');
`,
};