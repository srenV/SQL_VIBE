import type { Dataset } from "@/types/exercise";

export const storyGeldstromOmegaDatasetEn: Dataset = {
  id: "story-geldstrom-omega",
  name: "Omega Bank Database",
  description: "Story-exclusive bank database for the case 'Money Flow Omega'.",
  tables: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "birth_date", type: "DATE", nullable: false },
        { name: "address", type: "VARCHAR(200)", nullable: false },
        { name: "registered_on", type: "DATE", nullable: false },
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
        { name: "opened_on", type: "DATE", nullable: false },
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
  registered_on DATE NOT NULL
);
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  account_number VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  opened_on DATE NOT NULL
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
(2,'Wolfgang Becker','1955-09-30','Lindenallee 8, Stuttgart','2014-05-12'),
(3,'Brigitte Mueller','1975-07-22','Bahnhofstrasse 5, Munich','2016-02-20'),
(4,'Klaus Fischer','1988-11-04','Ringstrasse 12, Hamburg','2018-03-15'),
(5,'Petra Wagner','1992-05-18','Marktplatz 3, Cologne','2019-04-05'),
(6,'Ursula Hoffmann','1980-01-14','Rosenweg 2, Frankfurt','2017-06-18'),
(7,'Dieter Lang','1995-12-08','Kirchstrasse 7, Dresden','2020-07-22'),
(8,'Monika Bauer','1970-04-25','Eichenweg 4, Bremen','2015-08-30');
INSERT INTO accounts VALUES
(1,1,'DE12345678901234567890','Checking',12500.00,'2015-01-10'),
(2,1,'DE98765432109876543210','Savings',45000.00,'2015-01-10'),
(3,3,'DE11111111111111111111','Checking',3200.00,'2016-02-20'),
(4,3,'DE22222222222222222222','Savings',28000.00,'2016-02-20'),
(5,4,'DE33333333333333333333','Checking',1500.00,'2018-03-15'),
(6,5,'DE44444444444444444444','Checking',8900.00,'2019-04-05'),
(7,5,'DE55555555555555555555','Savings',15000.00,'2019-04-05'),
(8,2,'DE66666666666666666666','Checking',67000.00,'2014-05-12'),
(9,6,'DE77777777777777777777','Checking',4200.00,'2017-06-18'),
(10,6,'DE88888888888888888888','Savings',12000.00,'2017-06-18'),
(11,7,'DE99999999999999999999','Checking',800.00,'2020-07-22'),
(12,8,'DE00000000000000000000','Checking',5600.00,'2015-08-30');
INSERT INTO transactions VALUES
-- Account 1 (Helmut Checking): 7 transactions, 2 fraud
(1,1,2000.00,'credit','Salary January','2024-01-01 08:00:00'),
(2,1,1500.00,'credit','Bonus','2024-01-02 10:00:00'),
(3,1,1000.00,'credit','Side income','2024-01-04 14:00:00'),
(4,1,500.00,'credit','Refund','2024-01-05 09:00:00'),
(5,1,-365.00,'debit','Rent','2024-02-13 11:00:00'),
(6,1,-5000.00,'debit','Transfer to unknown account','2024-02-14 03:00:00'),
(7,1,-999.99,'debit','Night transaction online shop','2024-02-14 03:45:00'),
-- Account 2 (Helmut Savings): 4 transactions, total ABS = 4460
(8,2,2000.00,'credit','Savings deposit Jan','2024-01-10 10:00:00'),
(9,2,-800.00,'debit','Withdrawal','2024-01-15 10:00:00'),
(10,2,1500.00,'credit','Savings deposit Feb','2024-02-10 10:00:00'),
(11,2,-1160.00,'debit','Withdrawal','2024-02-20 10:00:00'),
-- Account 3 (Brigitte Mueller Checking): 3 transactions
(12,3,1800.00,'credit','Salary January','2024-01-01 08:00:00'),
(13,3,-800.00,'debit','Rent','2024-01-02 10:00:00'),
(14,3,-60.00,'debit','Supermarket','2024-01-03 14:30:00'),
-- Account 4 (Brigitte Mueller Savings): 3 transactions
(15,4,2200.00,'credit','Salary January','2024-01-01 08:00:00'),
(16,4,-950.00,'debit','Rent','2024-01-02 10:00:00'),
(17,4,-85.00,'debit','Supermarket','2024-01-03 14:30:00'),
-- Account 8 (Wolfgang Becker Checking): 2 transactions, both fraud, 15 min apart
(18,8,-9999.99,'debit','Nighttime luxury purchase online','2024-01-06 03:00:00'),
(19,8,-4999.99,'debit','Nighttime luxury purchase online','2024-01-06 03:15:00'),
-- Other accounts: 1-2 normal transactions each
(20,5,3500.00,'credit','Salary January','2024-01-01 08:00:00'),
(21,6,1900.00,'credit','Salary January','2024-01-01 08:00:00'),
(22,9,1400.00,'credit','Salary January','2024-01-01 08:00:00'),
(23,11,800.00,'credit','Salary January','2024-01-01 08:00:00'),
(24,12,2100.00,'credit','Salary January','2024-01-01 08:00:00'),
(25,12,-650.00,'debit','Rent','2024-01-02 10:00:00');
INSERT INTO fraud_cases VALUES
(1,6,'Transfer to unknown account','investigation','2024-02-15 09:00:00'),
(2,7,'Night transaction outside normal behavior','investigation','2024-02-15 09:00:00'),
(3,18,'Unusual time and high amount','investigation','2024-01-07 09:00:00'),
(4,19,'Unusual time and high amount','investigation','2024-01-07 09:00:00');
`,
  // Ch1: 4 fraud_cases (trans 6,7 Helmut + trans 18,19 Wolfgang) ✓
  // Ch2: High frequency > 2: account 1 (7 trans), account 2 (4 trans), account 3 (3), account 4 (3) ✓
  // Ch3: account_id IN (1,8): account 1 goes to T6 (running: 2000+1500+1000+500-365-5000=-365) into negative,
  //       after T7 (-365-999.99=-1364.99); account 8 immediately -9999.99 ✓
  // Ch4 LAG: account 1 T1-T4 1-2 day gap, then 39 days to T5, then 1 day T6, 45min T7 ✓
  //          account 8: T18 and T19 = 15 min gap ✓
  // Ch5 CTE: COUNT>3 OR ABS>5000: account 1 (7 trans, vol=10864.99), account 2 (4, 5460),
  //           account 8 (2, 14999.98), account 3 (3, 2660), account 4 (3, 3235)
  //   => Vol>5000: account 1 ✓, account 2 (5460>5000 ✓), account 8 ✓; Count>3: account 1 ✓, account 2 ✓
  //   => "Three suspicious accounts": account 1+2+8 all appear (vol>5000 or count>3) ✓
  // Ch6 Perpetrator accounts: fraud(1,8) OR frequency(count>3: 1,2): accounts 1,2,8 ✓
  //   Helmut Savings balance=45000 (actual target), Wolfgang balance=67000 ✓
  // Ch7 fraud_stats: Helmut (trans 6+7, vol=5999.99, 2 fraud), Wolfgang (trans 18+19, vol=14999.98, 2 fraud) ✓
};
