import type { Dataset } from "@/types/exercise";

export const storyNexusMarktDatasetEn: Dataset = {
  id: "story-nexusmarkt",
  name: "NexusMarkt Trading System",
  description: "Story-exclusive shop database for the case 'Phantom Transactions in NexusMarkt'.",
  tables: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "city", type: "VARCHAR(50)", nullable: true },
        { name: "registered_on", type: "DATE", nullable: false },
      ],
    },
    {
      name: "categories",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
      ],
    },
    {
      name: "products",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "category_id", type: "INTEGER", nullable: false, references: "categories.id" },
        { name: "price", type: "DECIMAL(10,2)", nullable: false },
        { name: "stock", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "orders",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "customer_id", type: "INTEGER", nullable: false, references: "customers.id" },
        { name: "date", type: "DATE", nullable: false },
        { name: "total_amount", type: "DECIMAL(10,2)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
      ],
    },
    {
      name: "order_items",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "order_id", type: "INTEGER", nullable: false, references: "orders.id" },
        { name: "product_id", type: "INTEGER", nullable: false, references: "products.id" },
        { name: "quantity", type: "INTEGER", nullable: false },
        { name: "unit_price", type: "DECIMAL(10,2)", nullable: false },
      ],
    },
    {
      name: "payments",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "order_id", type: "INTEGER", nullable: false, references: "orders.id" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false },
        { name: "payment_method", type: "VARCHAR(20)", nullable: false },
        { name: "payment_date", type: "DATE", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  city VARCHAR(50),
  registered_on DATE NOT NULL
);
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL
);
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);
CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_date DATE NOT NULL
);
INSERT INTO customers VALUES
(1,'Max Fischer','max@nexus.east','East-Block-1','2088-01-10'),
(2,'Anna Mueller','anna@nexus.east','East-Block-2','2088-02-15'),
(3,'Peter Schmidt','peter@nexus.east','East-Block-1','2088-03-20'),
(4,'Klaus Wagner','klaus@nexus.east','East-Block-3','2088-04-05'),
(5,'Sarah Keller','sarah@nexus.east','East-Block-2','2088-05-12'),
(6,'Michael Braun','m.braun@nexus.east','East-Block-0','2088-06-18'),
(7,'Julia Koch','julia@nexus.east','East-Block-4','2088-07-22'),
(8,'Thomas Berg','thomas@nexus.east','East-Block-3','2088-08-30'),
(9,'Lisa Wolf','lisa@nexus.east','East-Block-1','2088-09-14'),
(10,'David Hoffmann','david@nexus.east','East-Block-5','2088-10-01');
INSERT INTO categories VALUES
(1,'Electronics'),
(2,'Clothing'),
(3,'Household'),
(4,'Sports'),
(5,'Food');
INSERT INTO products VALUES
(1,'Laptop Pro 15',1,599.00,12),
(2,'Smartphone Basic',1,299.00,25),
(3,'Wireless Headphones',1,89.00,40),
(4,'T-Shirt Standard',2,24.99,100),
(5,'Running Shoes Sport',4,69.99,30),
(6,'Coffee Machine 2000',3,89.99,18),
(7,'Fitness Tracker',4,49.99,35),
(8,'USB-C Charging Cable',1,12.99,200),
(9,'Laptop Bag',1,39.99,60),
(10,'Phantom Module X',1,199.99,3),
(11,'Shadow Adapter Pro',1,149.99,2),
(12,'Ghost Device Alpha',1,249.99,1);
INSERT INTO orders VALUES
(1,1,'2024-01-15',89.99,'completed'),
(2,2,'2024-01-20',149.99,'completed'),
(3,2,'2024-02-05',89.00,'completed'),
(4,4,'2024-02-08',24.99,'completed'),
(5,6,'2024-02-10',798.99,'completed'),
(6,6,'2024-02-11',449.99,'completed'),
(7,6,'2024-02-11',339.99,'completed'),
(8,5,'2024-03-08',599.00,'cancelled'),
(9,2,'2024-03-10',49.99,'completed'),
(10,4,'2024-03-15',89.99,'completed'),
(11,7,'2024-03-20',69.99,'completed'),
(12,6,'2024-03-22',52.98,'completed'),
(13,7,'2024-03-25',12.99,'completed'),
(14,2,'2024-04-01',39.99,'completed'),
(15,8,'2024-04-05',12.99,'completed');
INSERT INTO order_items VALUES
(1,1,6,1,89.99),
(2,2,3,1,89.00),
(3,2,8,2,12.99),
(4,2,9,1,39.99),
(5,3,3,1,89.00),
(6,4,4,1,24.99),
(7,5,1,1,599.00),
(8,5,10,1,199.99),
(9,6,2,1,299.00),
(10,6,11,1,149.99),
(11,7,3,1,89.00),
(12,7,12,1,249.99),
(13,8,1,1,599.00),
(14,9,7,1,49.99),
(15,10,6,1,89.99),
(16,11,5,1,69.99),
(17,12,4,1,24.99),
(18,12,5,1,27.99),
(19,13,8,1,12.99),
(20,14,9,1,39.99),
(21,15,8,1,12.99);
INSERT INTO payments VALUES
(1,1,89.99,'PayPal','2024-01-15'),
(2,2,149.99,'Credit Card','2024-01-20'),
(3,3,89.00,'PayPal','2024-02-05'),
(4,4,24.99,'PayPal','2024-02-08'),
(5,5,798.99,'Credit Card','2024-02-10'),
(6,6,449.99,'Credit Card','2024-02-11'),
(7,7,339.99,'Credit Card','2024-02-11'),
(8,8,599.00,'Credit Card','2024-03-08'),
(9,9,49.99,'PayPal','2024-03-10'),
(10,10,89.99,'Bank Transfer','2024-03-15'),
(11,11,69.99,'PayPal','2024-03-20'),
(12,12,52.98,'Credit Card','2024-03-22'),
(13,13,12.99,'PayPal','2024-03-25'),
(14,14,39.99,'PayPal','2024-04-01'),
(15,15,12.99,'PayPal','2024-04-05');
`,
};
