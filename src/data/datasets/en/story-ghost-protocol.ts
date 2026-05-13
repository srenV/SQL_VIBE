import type { Dataset } from "@/types/exercise";

export const storyGhostProtocolDatasetEn: Dataset = {
  id: "story-ghost-protocol",
  name: "Sigma E-Commerce",
  description: "Story-exclusive e-commerce database for the case 'Ghost Protocol Sigma'.",
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
(1,'Anna Bauer','anna@sigma.net','Berlin','DE','2091-01-10',1),
(2,'Clara Hofmann','clara@sigma.net','Hamburg','DE','2091-02-15',1),
(3,'Eva Mueller','eva@sigma.net','Munich','DE','2091-03-20',1),
(4,'Hans Wagner','hans@sigma.net','Cologne','DE','2091-04-05',1),
(5,'Robert Klein','r.klein@netz.de','Frankfurt','DE','2091-05-12',0),
(6,'Maria Lange','m.lange@netz.de','Stuttgart','DE','2091-06-18',0),
(7,'Paul Richter','p.richter@netz.de','Dresden','DE','2091-07-22',0),
(8,'Emma Beck','e.beck@netz.de','Bremen','DE','2091-08-30',0),
(9,'Jonas Braun','j.braun@netz.de','Leipzig','DE','2091-09-14',0),
(10,'Klara Meier','k.meier@netz.de','Hanover','DE','2091-10-01',0);
INSERT INTO products VALUES
(1,'Laptop Pro 15','Electronics',799.00,'TechCorp',4.80),
(2,'Noise-Cancelling Headphones','Electronics',199.00,'SoundX',4.60),
(3,'Standing Desk','Furniture',449.00,'DeskPro',4.50),
(4,'USB-C Hub','Electronics',49.99,'ConnectAll',4.10),
(5,'Wireless Mouse','Electronics',39.99,'ClickFast',4.20),
(6,'Oak Desk','Furniture',299.00,'WoodWorks',4.10),
(7,'Keyboard Pro','Electronics',89.99,'TypeFast',4.40),
(8,'Monitor 27 inch','Electronics',349.00,'ViewMax',4.30),
(9,'Office Chair Basic','Furniture',199.00,'SitRight',4.50),
(10,'Office Chair Comfort','Furniture',349.00,'ErgoCo',NULL),
(11,'Bookshelf','Furniture',249.00,'ShelfCo',NULL),
(12,'Memory Foam Headrest','Furniture',79.00,'NeckEase',NULL);
INSERT INTO orders VALUES
(1,1,'2091-01-05',799.00,'completed','Express'),
(2,2,'2091-01-10',799.00,'completed','Express'),
(3,3,'2091-01-15',199.00,'completed','Standard'),
(4,4,'2091-01-20',449.00,'completed','Express'),
(5,5,'2091-01-25',299.00,'completed','Standard'),
(6,6,'2091-02-01',349.00,'completed','Standard'),
(7,1,'2091-02-05',449.00,'completed','Express'),
(8,2,'2091-02-10',199.00,'completed','Standard'),
(9,3,'2091-02-15',39.99,'completed','Standard'),
(10,4,'2091-02-20',49.99,'completed','Standard'),
(11,1,'2091-03-01',299.00,'completed','Express'),
(12,7,'2091-03-05',89.99,'completed','Standard'),
(13,8,'2091-03-10',39.99,'completed','Standard'),
(14,9,'2091-03-15',49.99,'completed','Standard');
INSERT INTO order_items VALUES
(1,1,1,1,799.00),
(2,2,1,1,799.00),
(3,3,2,1,199.00),
(4,4,3,1,449.00),
(5,5,6,1,299.00),
(6,6,8,1,349.00),
(7,7,3,1,449.00),
(8,8,2,1,199.00),
(9,9,5,1,39.99),
(10,10,4,1,49.99),
(11,11,6,1,299.00),
(12,12,7,1,89.99),
(13,13,5,1,39.99),
(14,14,4,1,49.99);
INSERT INTO reviews VALUES
(1,1,1,5,'Absolutely top!','2091-01-10'),
(2,2,1,5,'Perfect performance','2091-01-15'),
(3,3,2,5,'Best headphones','2091-01-20'),
(4,4,2,4,NULL,'2091-01-25'),
(5,1,3,5,'Indispensable','2091-02-08'),
(6,4,3,4,'Good quality','2091-02-25'),
(7,5,6,4,'Solid','2091-01-30'),
(8,6,8,4,NULL,'2091-02-05'),
(9,7,7,5,'Fast keys','2091-03-08'),
(10,8,5,4,NULL,'2091-03-12'),
(11,9,4,4,'Affordable','2091-03-18');
INSERT INTO campaigns VALUES
(1,'Black Friday','Email','2091-11-24','2091-11-27',15000.00,500,40),
(2,'Christmas','Email','2091-12-01','2091-12-24',20000.00,600,45),
(3,'Flash Sale May','Email','2091-05-01','2091-05-03',5000.00,250,18),
(4,'Autumn Deal','Email','2091-09-15','2091-09-30',10000.00,700,42),
(5,'Spring Sale','Social','2091-03-15','2091-03-31',12000.00,800,50),
(6,'Summer Promo','Banner','2091-07-01','2091-07-15',8000.00,400,20),
(7,'New Year','Social','2092-01-01','2092-01-07',6000.00,300,15);
`,
};
