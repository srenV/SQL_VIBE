/**
 * Shop dataset – English version.
 * Customers, Orders, Products, Categories, Payments.
 * Translated from the German shop dataset with English table/column names and data.
 */
import type { Dataset } from "@/types/exercise";

export const shopDatasetEn: Dataset = {
  id: "shop",
  name: "Online Shop",
  description:
    "A small online shop with customers, products, categories, orders, and payments.",
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
(1,'John Smith','john@example.com','London','2023-01-15'),
(2,'Emily Johnson','emily@example.com','Manchester','2023-02-20'),
(3,'David Brown','david@example.com','London','2023-03-10'),
(4,'Sarah Davis','sarah@example.com','Birmingham','2023-04-05'),
(5,'Michael Wilson','michael@example.com','Manchester','2023-05-12'),
(6,'Lisa Taylor','lisa@example.com','Cologne','2023-06-18'),
(7,'Thomas Anderson','thomas@example.com','London','2023-07-22'),
(8,'Jessica Martin','jessica@example.com','Birmingham','2023-08-30'),
(9,'Mark White','mark@example.com','Manchester','2023-09-14'),
(10,'Julia Harris','julia@example.com','Cologne','2023-10-01');
INSERT INTO categories VALUES
(1,'Electronics'),
(2,'Books'),
(3,'Clothing'),
(4,'Sports'),
(5,'Household');
INSERT INTO products VALUES
(1,'Laptop',1,899.00,15),
(2,'Smartphone',1,599.00,30),
(3,'Headphones',1,129.00,50),
(4,'SQL for Dummies',2,24.99,100),
(5,'Adventure Novel',2,14.99,80),
(6,'Cookbook',2,19.99,60),
(7,'T-Shirt',3,19.99,200),
(8,'Jeans',3,49.99,120),
(9,'Running Shoes',4,89.99,80),
(10,'Yoga Mat',4,29.99,150),
(11,'Vacuum Cleaner',5,199.00,25),
(12,'Coffee Machine',5,79.99,40);
INSERT INTO orders VALUES
(1,1,'2024-01-10',1028.99,'completed'),
(2,2,'2024-01-15',599.00,'completed'),
(3,3,'2024-01-20',44.98,'completed'),
(4,4,'2024-02-05',199.00,'shipped'),
(5,5,'2024-02-12',119.98,'shipped'),
(6,6,'2024-02-18',929.99,'processing'),
(7,7,'2024-03-01',149.98,'completed'),
(8,8,'2024-03-08',599.00,'cancelled'),
(9,9,'2024-03-15',89.99,'completed'),
(10,10,'2024-03-20',49.99,'shipped'),
(11,1,'2024-04-02',129.00,'completed'),
(12,3,'2024-04-10',79.99,'shipped'),
(13,5,'2024-04-15',199.00,'processing'),
(14,7,'2024-04-22',59.98,'completed'),
(15,9,'2024-05-01',929.99,'completed');
INSERT INTO order_items VALUES
(1,1,1,1,899.00),
(2,1,3,1,129.00),
(3,2,2,1,599.00),
(4,3,4,1,24.99),
(5,3,5,1,14.99),
(6,3,6,1,4.99),
(7,4,11,1,199.00),
(8,5,7,2,19.99),
(9,5,10,2,29.99),
(10,6,1,1,899.00),
(11,6,3,1,29.99),
(12,7,9,1,89.99),
(13,7,10,2,29.99),
(14,8,2,1,599.00),
(15,9,9,1,89.99),
(16,10,8,1,49.99),
(17,11,3,1,129.00),
(18,12,12,1,79.99),
(19,13,11,1,199.00),
(20,14,7,3,19.99),
(21,15,1,1,899.00),
(22,15,3,1,29.99);
INSERT INTO payments VALUES
(1,1,1028.99,'Credit Card','2024-01-10'),
(2,2,599.00,'PayPal','2024-01-15'),
(3,3,44.98,'Credit Card','2024-01-20'),
(4,4,199.00,'Bank Transfer','2024-02-06'),
(5,5,119.98,'PayPal','2024-02-12'),
(6,6,929.99,'Credit Card','2024-02-18'),
(7,7,149.98,'PayPal','2024-03-01'),
(8,8,599.00,'Credit Card','2024-03-08'),
(9,9,89.99,'Bank Transfer','2024-03-16'),
(10,10,49.99,'PayPal','2024-03-20'),
(11,11,129.00,'Credit Card','2024-04-02'),
(12,12,79.99,'Bank Transfer','2024-04-11'),
(13,13,199.00,'PayPal','2024-04-15'),
(14,14,59.98,'Credit Card','2024-04-22'),
(15,15,929.99,'Credit Card','2024-05-01');
`,
};