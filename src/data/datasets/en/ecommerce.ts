/**
 * E-Commerce Analytics dataset (English).
 * Contains customers, products, orders, reviews, and marketing campaigns
 * for advanced analytics exercises.
 */
import type { Dataset } from "@/types/exercise";

export const ecommerceDatasetEn: Dataset = {
  id: "ecommerce",
  name: "E-Commerce Analytics",
  description:
    "An e-commerce system with customers, products, orders, reviews, and marketing campaigns for advanced analytics exercises.",
  tables: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "city", type: "VARCHAR(50)", nullable: true },
        { name: "country", type: "VARCHAR(50)", nullable: false },
        { name: "registered_on", type: "DATE", nullable: false },
        { name: "is_premium", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "products",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "category", type: "VARCHAR(50)", nullable: false },
        { name: "price", type: "DECIMAL(10,2)", nullable: false },
        { name: "manufacturer", type: "VARCHAR(80)", nullable: true },
        { name: "rating", type: "DECIMAL(3,2)", nullable: true },
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
        { name: "shipping_method", type: "VARCHAR(30)", nullable: false },
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
      name: "reviews",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "customer_id", type: "INTEGER", nullable: false, references: "customers.id" },
        { name: "product_id", type: "INTEGER", nullable: false, references: "products.id" },
        { name: "stars", type: "INTEGER", nullable: false },
        { name: "comment", type: "TEXT", nullable: true },
        { name: "date", type: "DATE", nullable: false },
      ],
    },
    {
      name: "campaigns",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "type", type: "VARCHAR(30)", nullable: false },
        { name: "start_date", type: "DATE", nullable: false },
        { name: "end_date", type: "DATE", nullable: false },
        { name: "budget", type: "DECIMAL(12,2)", nullable: false },
        { name: "clicks", type: "INTEGER", nullable: false },
        { name: "conversions", type: "INTEGER", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  city VARCHAR(50),
  country VARCHAR(50) NOT NULL,
  registered_on DATE NOT NULL,
  is_premium BOOLEAN NOT NULL
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  manufacturer VARCHAR(80),
  rating DECIMAL(3,2)
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  shipping_method VARCHAR(30) NOT NULL
);
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  stars INTEGER NOT NULL,
  comment TEXT,
  date DATE NOT NULL
);
CREATE TABLE campaigns (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(30) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(12,2) NOT NULL,
  clicks INTEGER NOT NULL,
  conversions INTEGER NOT NULL
);
INSERT INTO customers VALUES
(1,'Anna Bauer','anna@example.com','Berlin','Germany','2023-01-15',1),
(2,'Ben Schneider','ben@example.com','Munich','Germany','2023-03-20',0),
(3,'Clara Hofmann','clara@example.com','Vienna','Austria','2023-05-10',1),
(4,'David Klein','david@example.com','Zurich','Switzerland','2023-07-05',0),
(5,'Eva Mueller','eva@example.com','Hamburg','Germany','2023-09-12',1),
(6,'Felix Wolf','felix@example.com','Salzburg','Austria','2023-11-18',0),
(7,'Greta Fischer','greta@example.com','Cologne','Germany','2024-01-22',0),
(8,'Hans Wagner','hans@example.com','Bern','Switzerland','2024-03-30',1),
(9,'Ina Becker','ina@example.com','Frankfurt','Germany','2024-05-14',0),
(10,'Jan Schmitz','jan@example.com','Graz','Austria','2024-07-01',0);
INSERT INTO products VALUES
(1,'Laptop Pro 15','Electronics',1199.00,'TechCorp',4.50),
(2,'Wireless Mouse','Electronics',39.99,'InputCo',4.20),
(3,'Mechanical Keyboard','Electronics',129.00,'KeyMaster',4.60),
(4,'Office Chair Comfort','Furniture',349.00,'SitWell',4.30),
(5,'Oak Desk','Furniture',599.00,'WoodCraft',4.10),
(6,'Monitor 27 inch','Electronics',399.00,'ViewMax',4.40),
(7,'USB-C Hub','Electronics',59.99,'ConnectAll',4.00),
(8,'Webcam HD','Electronics',89.99,'StreamPro',3.80),
(9,'Memory Foam Headrest','Furniture',79.00,'SitWell',4.50),
(10,'Bookshelf','Furniture',249.00,'WoodCraft',4.20),
(11,'Noise-Cancelling Headphones','Electronics',249.00,'AudioMax',4.70),
(12,'Standing Desk','Furniture',449.00,'ErgoUp',4.60);
INSERT INTO orders VALUES
(1,1,'2024-01-20',1238.99,'delivered','Express'),
(2,1,'2024-03-15',168.99,'delivered','Standard'),
(3,2,'2024-02-10',59.99,'delivered','Standard'),
(4,3,'2024-01-25',1567.99,'delivered','Express'),
(5,3,'2024-04-01',449.00,'delivered','Standard'),
(6,4,'2024-03-05',89.99,'cancelled','Standard'),
(7,5,'2024-02-20',798.00,'delivered','Express'),
(8,5,'2024-05-10',39.99,'processing','Standard'),
(9,6,'2024-04-15',399.00,'delivered','Standard'),
(10,7,'2024-03-28',129.00,'delivered','Standard'),
(11,8,'2024-04-05',1598.99,'delivered','Express'),
(12,8,'2024-06-12',59.99,'processing','Standard'),
(13,9,'2024-05-20',599.00,'delivered','Standard'),
(14,10,'2024-06-01',249.00,'delivered','Standard'),
(15,1,'2024-06-15',449.00,'processing','Express');
INSERT INTO order_items VALUES
(1,1,1,1,1199.00),
(2,1,2,1,39.99),
(3,2,3,1,129.00),
(4,2,9,1,79.00),
(5,3,2,1,39.99),
(6,4,1,1,1199.00),
(7,4,6,1,399.00),
(8,4,7,1,59.99),
(9,5,12,1,449.00),
(10,6,8,1,89.99),
(11,7,11,1,249.00),
(12,7,6,1,399.00),
(13,7,3,1,129.00),
(14,8,2,1,39.99),
(15,9,6,1,399.00),
(16,10,3,1,129.00),
(17,11,1,1,1199.00),
(18,11,3,1,129.00),
(19,11,11,1,249.00),
(20,12,7,1,59.99),
(21,13,5,1,599.00),
(22,14,11,1,249.00),
(23,15,12,1,449.00);
INSERT INTO reviews VALUES
(1,1,1,5,'Excellent device','2024-02-01'),
(2,1,3,4,'Great typing feel','2024-03-20'),
(3,2,2,3,'Okay','2024-02-15'),
(4,3,1,5,'Fast and reliable','2024-02-01'),
(5,3,6,4,'Good image quality','2024-04-10'),
(6,4,8,2,'Mediocre','2024-03-15'),
(7,5,11,5,'Best sound','2024-02-28'),
(8,5,7,4,'Practical','2024-05-20'),
(9,6,6,4,'Sharp image','2024-04-20'),
(10,7,3,5,'Favorite keyboard','2024-04-05'),
(11,8,1,4,'Solid performance','2024-04-15'),
(12,8,12,5,'Perfect for home office','2024-06-20'),
(13,9,5,4,'Stable desk','2024-05-28'),
(14,10,11,4,'Good noise cancellation','2024-06-10');
INSERT INTO campaigns VALUES
(1,'Summer Sale 2024','discount','2024-06-01','2024-06-30',15000.00,45000,2800),
(2,'Spring Promotion','discount','2024-03-01','2024-03-31',8000.00,22000,1300),
(3,'New Customer Welcome','banner','2024-01-01','2024-12-31',20000.00,85000,4200),
(4,'Black Friday 2024','discount','2024-11-22','2024-11-29',25000.00,120000,9500),
(5,'Premium Launch','email','2024-04-01','2024-04-30',5000.00,15000,800),
(6,'Return Campaign','email','2024-02-01','2024-02-28',3000.00,10000,500),
(7,'Christmas 2024','banner','2024-12-01','2024-12-24',18000.00,95000,7200);
`,
};
