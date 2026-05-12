/**
 * English learning content for the theory hub of the SQL-Trainer platform.
 *
 * Structured learning modules with articles on normalization,
 * relational model, ERM, SQL basics and more.
 * Each module has a difficulty level, each article has
 * multiple sections with sectionType, keyTakeaways and optional
 * widgets (ERM diagram, NF checker, RM-to-SQL, Mini-Playground).
 */

import type { LearnModule } from "@/types/sandbox";

export const learnModulesEn: LearnModule[] = [
  // ═══════════════════════════════════════════════════════════════
  // MODULE 1: Normalization
  // ═══════════════════════════════════════════════════════════════
  {
    id: "normalisierung",
    title: "Normalization",
    description: "From 1NF to BCNF: Optimize database structures and avoid anomalies.",
    icon: "ruler",
    difficulty: "junior",
    articles: [
      {
        id: "was-ist-normalisierung",
        title: "What is Normalization?",
        estimatedMinutes: 12,
        sections: [
          {
            id: "einfuehrung",
            title: "Introduction to Normalization",
            sectionType: "theory",
            content: `Normalization is the process of structuring a relational database to reduce **data redundancy** (storing the same data multiple times) and **anomalies** (errors when inserting, updating, or deleting).

Normalization was introduced by **Edgar F. Codd** in 1970 and remains one of the most important concepts in database design. It is based on so-called **normal forms** (NF), each of which imposes specific conditions on the structure of a table.

Each higher normal form presupposes the previous one:

- **1NF** (First Normal Form) — Atomic values, no repeating groups
- **2NF** (Second Normal Form) — Full functional dependency
- **3NF** (Third Normal Form) — No transitive dependencies
- **BCNF** (Boyce-Codd Normal Form) — Extended 3NF

The goal of normalization is **data integrity**: Every fact is stored exactly once, thereby avoiding inconsistencies.`,
            keyTakeaways: [
              "Normalization reduces data redundancy and anomalies",
              "Each normal form builds on the previous one",
              "Introduced by Codd in 1970, still relevant today",
              "Goal: Data integrity through single storage of each fact",
            ],
          },
          {
            id: "warum-normalisierung",
            title: "Why Normalization?",
            sectionType: "example",
            content: `Without normalization, the following **anomalies** can occur:

**Insert Anomaly:**
New data cannot be inserted because other required fields are missing.
*Example:* A new employee cannot be recorded before being assigned to a project.

**Update Anomaly:**
Changes must be made in multiple places, which can lead to inconsistencies.
*Example:* If a customer's address changes, it must be updated in all orders — forgetting one makes the data inconsistent.

**Delete Anomaly:**
Deleting a row accidentally deletes other important information.
*Example:* If an employee's only project is deleted, the employee information is also lost.

These anomalies arise from **data redundancy**: the same information is stored in multiple places, leading to inconsistencies if not all copies are kept in sync.`,
            keyTakeaways: [
              "Three anomaly types: Insert, Update, and Delete anomalies",
              "Cause is data redundancy — same info in multiple places",
              "Normalization prevents anomalies through structuring",
            ],
          },
          {
            id: "normalisierung-ueberblick",
            title: "Overview: The Normal Forms",
            sectionType: "summary",
            content: `Normalization is a step-by-step process where each stage eliminates the problems of the previous one. You start with unstructured data and proceed systematically: First, non-atomic values and repeating groups are eliminated (1NF), then partial dependencies on the primary key (2NF), then transitive dependencies between non-key attributes (3NF), and finally overlapping candidate keys (BCNF). Each stage builds on the previous one — you cannot achieve 3NF without first satisfying 1NF and 2NF.

Here is an overview of the most important normal forms and their conditions:

| Normal Form | Condition | Prevents |
|------------|-----------|------------|
| 1NF | Atomic values, no repeating groups | Lists in cells |
| 2NF | 1NF + full functional dependency | Partial dependencies |
| 3NF | 2NF + no transitive dependencies | Indirect dependencies |
| BCNF | 3NF + every determinant is a candidate key | Overlapping candidate keys |

In practice, most databases are normalized up to **3NF**. BCNF is a stricter variant of 3NF that becomes relevant in special cases.`,
          },
        ],
      },
      {
        id: "erste-normalform",
        title: "First Normal Form (1NF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-1nf",
            title: "Definition of 1NF",
            sectionType: "theory",
            content: `A table is in **First Normal Form** when:

1. Each attribute contains **atomic** (indivisible) values — no lists, arrays, or nested values
2. Each row is uniquely identifiable (**primary key**)
3. No repeating groups exist (no columns like "Course1", "Course2", "Course3")
4. The order of rows and columns has no meaning

**Atomic** means: Each cell contains exactly one value that should not be further divided. A full name "Anna Müller" is atomic if treated as one concept. A list "Mathematics, Physics, Chemistry" in a cell is **not atomic**.`,
            keyTakeaways: [
              "1NF requires atomic (indivisible) values in each cell",
              "No lists, arrays, or nested values",
              "Each row needs a unique primary key",
              "No repeating groups (no columns like Course1, Course2, ...)",
            ],
          },
          {
            id: "beispiel-1nf",
            title: "Example: Converting to 1NF",
            sectionType: "example",
            content: `The First Normal Form (1NF) is the basic prerequisite for a clean database structure. It requires that each attribute contains exactly one atomic value — no lists, no nested structures, and no repeating groups. In practice, this means: If you have "Mathematics, Physics, Chemistry" in a cell, you violate 1NF because multiple values are in one cell. Likewise, creating columns like Course1, Course2, Course3 violates 1NF because that is a repeating group.

**Not in 1NF — Violation of atomicity:**

| Student | Courses |
|---------|-------|
| Anna | Mathematics, Physics, Chemistry |
| Ben | German, English |

The "Courses" attribute contains multiple values → **1NF violation**.

**Not in 1NF — Repeating groups:**

| Student | Course1 | Course2 | Course3 |
|---------|-------|-------|-------|
| Anna | Math | Physics | Chemistry |
| Ben | German | English | NULL |

The columns Course1, Course2, Course3 are a repeating group → **1NF violation**.

**In 1NF — Correct structure:**

| Student | Course |
|---------|------|
| Anna | Mathematics |
| Anna | Physics |
| Anna | Chemistry |
| Ben | German |
| Ben | English |

Each cell contains exactly one value → **1NF satisfied**.`,
          },
        ],
      },
      {
        id: "zweite-normalform",
        title: "Second Normal Form (2NF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-2nf",
            title: "Definition of 2NF",
            sectionType: "theory",
            content: `A table is in **Second Normal Form** when:

1. It is in **1NF**
2. Every non-key attribute is **fully functionally dependent** on the entire primary key

**Full functional dependency** means: If the primary key consists of multiple columns, no non-key attribute may depend on only a **part** of the key.

**Partial dependency** only occurs when the primary key is **composite** (consists of multiple columns). With a simple primary key, 2NF is automatically satisfied if 1NF holds.`,
            keyTakeaways: [
              "2NF presupposes 1NF",
              "No partial dependencies on the primary key",
              "Partial dependencies only occur with composite keys",
              "Solution: Split the table to separate dependencies",
            ],
          },
          {
            id: "beispiel-2nf",
            title: "Example: Converting to 2NF",
            sectionType: "example",
            content: `The Second Normal Form (2NF) eliminates partial dependencies. A partial dependency exists when a non-key attribute depends on only part of the primary key — not on the entire key. This only happens with composite primary keys (consisting of multiple columns). The solution: Split the table so that each non-key attribute depends on the entire primary key.

**In 1NF, but not in 2NF:**

| Student_ID | Course_ID | Student_Name | Course_Name | Grade |
|------------|---------|--------------|-----------|------|
| 1 | 101 | Anna | Mathematics | 1 |
| 1 | 102 | Anna | Physics | 2 |
| 2 | 101 | Ben | Mathematics | 3 |

- **Student_Name** depends only on **Student_ID** (partial dependency!)
- **Course_Name** depends only on **Course_ID** (partial dependency!)
- Only **Grade** depends on the entire key (Student_ID, Course_ID)

**In 2NF — Split into three tables:**

Table **students**: (Student_ID → Student_Name)
Table **courses**: (Course_ID → Course_Name)
Table **grades**: (Student_ID, Course_ID → Grade)`,
          },
        ],
      },
      {
        id: "dritte-normalform",
        title: "Third Normal Form (3NF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-3nf",
            title: "Definition of 3NF",
            sectionType: "theory",
            content: `A table is in **Third Normal Form** when:

1. It is in **2NF**
2. No non-key attribute depends **transitively** on the primary key

**Transitive dependency** means: A → B → C. If attribute A determines attribute B, and B in turn determines attribute C, then C depends **transitively** on A.

The problem: If B changes, all dependent C values must be updated. And: C could exist without having a direct relationship to A.`,
            keyTakeaways: [
              "3NF presupposes 2NF",
              "No transitive dependencies (A → B → C)",
              "Every non-key attribute depends directly on the primary key",
              "Solution: Split the table to remove indirect dependencies",
            ],
          },
          {
            id: "beispiel-3nf",
            title: "Example: Converting to 3NF",
            sectionType: "example",
            content: `The Third Normal Form (3NF) eliminates transitive dependencies. A transitive dependency exists when a non-key attribute depends on another non-key attribute, not directly on the primary key. The classic example: Student_ID determines the ZIP code, and the ZIP code determines the city. Thus, the city depends transitively on Student_ID — via the ZIP code as an intermediary. The problem: If the mapping ZIP → City changes, you must update all students with that ZIP code. In 3NF, you split the table so that each dependency depends only directly on its own key.

**In 2NF, but not in 3NF:**

| Student_ID | Name | ZIP | City |
|------------|------|-----|-------|
| 1 | Anna | 10115 | Berlin |
| 2 | Ben | 80331 | Munich |

- **City** depends on **ZIP** (transitive dependency!)
- ZIP → City, and Student_ID → ZIP, so Student_ID → ZIP → City

**In 3NF — Split:**

Table **students**: (Student_ID → Name, ZIP)
Table **zip_codes**: (ZIP → City)`,
          },
        ],
      },
      {
        id: "bcnf",
        title: "Boyce-Codd Normal Form (BCNF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-bcnf",
            title: "Definition of BCNF",
            sectionType: "theory",
            content: `The **Boyce-Codd Normal Form (BCNF)** is a stricter variant of 3NF. A table is in BCNF when:

1. It is in **3NF**
2. For every functional dependency X → Y: **X is a superkey**

In other words: Every **determinant** (left side of a functional dependency) must be a **candidate key**.

BCNF solves a specific problem of 3NF: When a table has multiple overlapping candidate keys, anomalies can still occur in 3NF.

**When is BCNF relevant?**
- When a table has multiple candidate keys
- When these candidate keys overlap (overlapping attributes)
- In practice, this case is rare but important to know.`,
            keyTakeaways: [
              "BCNF is a stricter variant of 3NF",
              "Every determinant must be a candidate key",
              "Relevant for overlapping candidate keys",
              "In practice, usually automatically satisfied when 3NF holds",
            ],
          },
          {
            id: "beispiel-bcnf",
            title: "Example: BCNF Violation",
            sectionType: "example",
            content: `The Boyce-Codd Normal Form (BCNF) is a tightening of 3NF. It requires that for every functional dependency X → Y, the determinant X must be a candidate key. The problem with 3NF: There can be functional dependencies where the determinant is not a candidate key — so-called overlapping candidate keys. BCNF closes this gap.

**In 3NF, but not in BCNF:**

A course can be taught by exactly one instructor, but an instructor can lead multiple courses. A student has exactly one instructor for each course.

| Student | Course | Instructor |
|---------|------|--------|
| Anna | Math | Prof. Müller |
| Anna | Physics | Prof. Schmidt |
| Ben | Math | Prof. Müller |

**Functional Dependencies:**
- (Student, Course) → Instructor  ← Primary key
- Instructor → Course  ← Instructor determines the course, but Instructor is NOT a candidate key!

**Problem:** Instructor → Course is a functional dependency where the determinant (Instructor) is not a candidate key.

**In BCNF — Split:**

Table **enrollments**: (Student, Instructor) — Primary key
Table **instructor_courses**: (Instructor → Course) — Instructor is now the primary key`,
          },
        ],
      },
      {
        id: "normalisierung-praxis",
        title: "Normalization in Practice",
        estimatedMinutes: 12,
        sections: [
          {
            id: "wann-normalisieren",
            title: "When to Normalize — and When Not To?",
            sectionType: "theory",
            content: `In practice, normalization is **almost always done up to 3NF**. BCNF is only targeted in special cases. But there are also good reasons to **deliberately denormalize**:

**Reasons for Denormalization:**
- **Performance**: JOINs across many tables can be slow. A denormalized table can speed up queries.
- **Simpler queries**: Fewer JOINs mean simpler SQL statements.
- **Reporting**: Data warehouses are often deliberately denormalized (star schema, snowflake schema).

**Reasons against Denormalization:**
- **Data integrity**: Redundancy leads to anomalies.
- **Maintainability**: Changes must be made in multiple places.
- **Storage space**: Redundant data requires more storage.

**Best Practice:**
1. First normalize (at least 3NF)
2. Then selectively denormalize when performance problems occur
3. Document and justify denormalization`,
            keyTakeaways: [
              "In practice: aim for at least 3NF",
              "Denormalization can improve performance but endanger integrity",
              "Best Practice: First normalize, then selectively denormalize",
              "Data warehouses deliberately use denormalized schemas",
            ],
          },
          {
            id: "normalisierung-prozess",
            title: "The Normalization Process",
            sectionType: "summary",
            content: `The normalization process follows a systematic approach:

**Step 1: Identify unnormalized data**
Collect all attributes and identify repeating groups and non-atomic values.

**Step 2: Achieve 1NF**
- Convert repeating groups into separate rows
- Split composite attributes
- Define primary key

**Step 3: Achieve 2NF**
- Identify partial dependencies
- Split table: Move attributes that depend on only part of the key into their own tables

**Step 4: Achieve 3NF**
- Identify transitive dependencies
- Split table: Move attributes that depend on a non-key attribute into their own tables

**Step 5: Check BCNF**
- Identify overlapping candidate keys
- Perform further splitting if necessary

Each step builds on the previous one — you cannot achieve 3NF without first satisfying 1NF and 2NF.`,
            widget: {
              type: "nf-checker",
              data: {
                question: {
                  tableName: "Orders",
                  columns: [
                    { name: "Order_ID", isPrimaryKey: true },
                    { name: "Customer_ID", isForeignKey: true },
                    { name: "Customer_Name" },
                    { name: "Customer_ZIP" },
                    { name: "Customer_City" },
                    { name: "Product_ID", isForeignKey: true },
                    { name: "Quantity" },
                    { name: "Order_Date" },
                  ],
                  rows: [
                    { Order_ID: "1", Customer_ID: "C01", Customer_Name: "Anna", Customer_ZIP: "10115", Customer_City: "Berlin", Product_ID: "P01", Quantity: "3", Order_Date: "2024-01-15" },
                    { Order_ID: "2", Customer_ID: "C01", Customer_Name: "Anna", Customer_ZIP: "10115", Customer_City: "Berlin", Product_ID: "P02", Quantity: "1", Order_Date: "2024-01-20" },
                    { Order_ID: "3", Customer_ID: "C02", Customer_Name: "Ben", Customer_ZIP: "80331", Customer_City: "Munich", Product_ID: "P01", Quantity: "5", Order_Date: "2024-02-01" },
                  ],
                  correctAnswer: "3NF",
                  explanation: "The table violates 3NF because Customer_City depends transitively on Order_ID: Order_ID → Customer_ID → (Customer_Name, Customer_ZIP, Customer_City). Customer_Name, ZIP, and City depend only on Customer_ID, not directly on the primary key Order_ID. Solution: Split into Orders, Customers, and ZIP codes.",
                },
              },
            },
          },
        ],
      },
      {
        id: "normalisierungsziele",
        title: "Goals of Normalization",
        estimatedMinutes: 10,
        sections: [
          {
            id: "warum-normalisieren-ziele",
            title: "The Goals of Normalization",
            sectionType: "theory",
            content: `Normalization pursues three central goals:

**1. Avoid data redundancy**
Every fact is stored exactly once. Redundancy leads to inconsistencies when the same information must be updated in multiple places.

*Example:* A customer name is stored in every order → if the name changes, it must be updated in all orders. After normalization, the name is only stored in the customer table.

**2. Prevent anomalies**
- **Insert Anomaly:** Data cannot be inserted because other required fields are missing
- **Update Anomaly:** Changes must be made in multiple places
- **Delete Anomaly:** Deleting a row accidentally deletes other information

**3. Ensure data integrity**
Primary keys, foreign keys, and constraints ensure that data remains consistent and correct.

**Trade-offs of Normalization:**
- **Advantage:** Consistency, no anomalies, less storage space
- **Disadvantage:** More tables → more JOINs → potentially slower queries
- **Solution:** First normalize, then selectively denormalize where performance requires it`,
            keyTakeaways: [
              "Avoid data redundancy — store each fact only once",
              "Prevent anomalies — Insert, Update, and Delete anomalies",
              "Ensure data integrity — through keys and constraints",
              "Trade-off: Normalization improves consistency but can cost performance",
            ],
          },
          {
            id: "normalisierung-vs-denormalisierung",
            title: "Normalization vs. Denormalization",
            sectionType: "example",
            content: `The decision between normalization and denormalization is not an either-or, but a trade-off between consistency and performance. Normalization eliminates redundancy and anomalies but requires more JOINs. Denormalization improves read performance but risks inconsistencies on write accesses. The rule of thumb: First normalize consistently (at least 3NF), then selectively denormalize where performance bottlenecks are proven.

**Normalize (up to 3NF):**
- Operational databases (OLTP) with many write accesses
- When data consistency is the top priority
- When multiple users modify data simultaneously

**Denormalize (deliberately):**
- Data warehouses and reporting (OLAP)
- When read performance is more important than write performance
- When certain queries are very frequent and require many JOINs

**Example — Denormalization for Reporting:**

Normalized (3 tables):
\`\`\`
customers(id, name, city)
orders(id, customer_id, date, amount)
products(id, name, price)
\`\`\`

---

Denormalized for reporting (1 table):
\`\`\`
order_report(id, customer_name, customer_city, order_date, product_name, amount)
\`\`\`

---

**Best Practice:**
1. First normalize consistently (at least 3NF)
2. Measure performance
3. Only selectively denormalize for proven bottlenecks
4. Document and justify denormalization`,
            keyTakeaways: [
              "OLTP → normalize, OLAP → denormalize",
              "First normalize, then selectively denormalize",
              "Always document and justify denormalization",
              "Measure performance bottlenecks, don't assume them",
            ],
          },
        ],
      },
      {
        id: "funktionale-abhaengigkeiten",
        title: "Functional Dependencies",
        estimatedMinutes: 12,
        sections: [
          {
            id: "fd-definition",
            title: "What are Functional Dependencies?",
            sectionType: "theory",
            content: `A **functional dependency (FD)** is the foundation of normalization theory. It describes which attributes determine other attributes.

**Definition:** X → Y (read: "X determines Y" or "Y depends functionally on X")
means: If two tuples match in the attributes of X, then they also match in the attributes of Y.

**Example:**
In a table Students(MatriculationNumber, Name, Major):
- MatriculationNumber → Name (the matriculation number determines the name)
- MatriculationNumber → Major (the matriculation number determines the major)
- Name → MatriculationNumber? No! Two students can have the same name.

**Types of Functional Dependencies:**

| Type | Description | Example |
|-----|-------------|----------|
| Full functional | Y depends on the entire X | (Student_ID, Course_ID) → Grade |
| Partial | Y depends only on part of X | (Student_ID, Course_ID) → Student_Name |
| Transitive | X → Y → Z | ZIP → City |
| Trivial | Y is a subset of X | (Name, ZIP) → Name |

**Important:** Functional dependencies are properties of the **real world**, not of the table! You must understand which dependencies hold in the domain to normalize correctly.`,
            keyTakeaways: [
              "X → Y: X uniquely determines Y",
              "Full functional dependency: Y depends on the entire key",
              "Partial dependency: Y depends only on part of the key → 2NF violation",
              "Transitive dependency: X → Y → Z → 3NF violation",
              "FDs are properties of the real world, not the table",
            ],
          },
          {
            id: "fd-bestimmen",
            title: "Determining Functional Dependencies",
            sectionType: "practice",
            content: `How do you find functional dependencies in a given table?

**Step 1: List all attributes**
Example table Orders:
Order_ID, Customer_ID, Customer_Name, Customer_ZIP, Customer_City, Product_ID, Quantity, Product_Name, Price

**Step 2: For each attribute, check: What determines it?**
- Order_ID → all other attributes? No, not directly (only Customer_ID, Product_ID, Quantity)
- Customer_ID → Customer_Name, Customer_ZIP, Customer_City
- Product_ID → Product_Name, Price
- (Order_ID) → Customer_ID, Product_ID, Quantity

**Step 3: Note the FDs**
- Order_ID → Customer_ID, Product_ID, Quantity
- Customer_ID → Customer_Name, Customer_ZIP, Customer_City
- Product_ID → Product_Name, Price

**Step 4: Classify dependencies**
- Order_ID → Customer_ID: full dependency (on the primary key)
- Customer_ID → Customer_Name: transitive dependency (via Customer_ID)
- Product_ID → Product_Name: transitive dependency (via Product_ID)

**Step 5: Determine normal form**
- 1NF? Yes (all values atomic)
- 2NF? Yes (no partial dependencies, since simple primary key)
- 3NF? No (transitive dependencies: Customer_ID → Customer_Name, Product_ID → Product_Name)

**Exercise:** Determine the functional dependencies for:
Employee(ID, Name, Department, Department_Head, Salary, Salary_Grade)

Solution:
- ID → Name, Department, Salary, Salary_Grade
- Department → Department_Head
- Salary_Grade → Salary (or vice versa, depending on the domain)`,
            keyTakeaways: [
              "Determine FDs systematically: List attributes → Check dependencies → Note them",
              "Each FD is a statement about the real world",
              "Recognize transitive dependencies: A → B → C",
              "Recognize partial dependencies: Y depends only on part of the key",
            ],
          },
        ],
      },
      {
        id: "normalisierung-schritt-fuer-schritt",
        title: "Normalization Step by Step",
        estimatedMinutes: 15,
        sections: [
          {
            id: "nf-schritt-1nf",
            title: "From Unnormalized Table to 1NF",
            sectionType: "theory",
            content: `We normalize an unnormalized table step by step up to 3NF.

**Starting table (UNF — Unnormalized Form):**

| Order_ID | Customer | Products | Delivery_Address |
|------------|-------|----------|---------------|
| 1 | Anna, Berlin | (Laptop, €999), (Mouse, €29) | Berlin, Main St. 1 |
| 2 | Ben, Munich | (Keyboard, €79) | Munich, Market 5 |

**Problems:**
- "Customer" contains Name AND City (not atomic)
- "Products" contains multiple values (not atomic)
- "Delivery_Address" contains Street AND City (not atomic)

**Step 1: Achieve 1NF — Make all values atomic**

| Order_ID | Customer_Name | Customer_City | Product | Price | Delivery_Street | Delivery_City |
|------------|-----------|-------------|---------|-------|---------------|-------------|
| 1 | Anna | Berlin | Laptop | 999 | Main St. 1 | Berlin |
| 1 | Anna | Berlin | Mouse | 29 | Main St. 1 | Berlin |
| 2 | Ben | Munich | Keyboard | 79 | Market 5 | Munich |

Now each cell is atomic. The primary key is (Order_ID, Product).`,
            keyTakeaways: [
              "UNF: Unnormalized table with repeating groups and non-atomic values",
              "1NF: Each cell contains exactly one atomic value",
              "Repeating groups are resolved into separate rows",
              "Primary key may change through the conversion",
            ],
          },
          {
            id: "nf-schritt-2nf-3nf",
            title: "From 1NF to 2NF and 3NF",
            sectionType: "practice",
            content: `**Starting point: 1NF table**

| Order_ID | Customer_Name | Customer_City | Product | Price | Delivery_Street | Delivery_City |
|------------|-----------|-------------|---------|-------|---------------|-------------|

Primary key: (Order_ID, Product)

**Step 2: Achieve 2NF — Remove partial dependencies**

Partial dependencies:
- Customer_Name depends only on Order_ID (not on Product)
- Customer_City depends only on Order_ID
- Price depends only on Product (not on Order_ID)
- Delivery_Street and Delivery_City depend only on Order_ID

**Split:**

Orders(Order_ID, Customer_Name, Customer_City, Delivery_Street, Delivery_City)
Order_Items(Order_ID, Product, Price)

**Step 3: Achieve 3NF — Remove transitive dependencies**

In the Orders table:
- Order_ID → Customer_Name, Customer_City, Delivery_Street, Delivery_City
- But: Customer_City depends on Customer_Name? No, better: We need a Customer_ID!

**Corrected split:**

Customers(Customer_ID, Customer_Name, Customer_City)
Orders(Order_ID, Customer_ID, Delivery_Street, Delivery_City)
Order_Items(Order_ID, Product, Price)
Products(Product_ID, Product_Name, Price)

Now each table is in 3NF:
- Every non-key attribute depends directly on the primary key
- No transitive dependencies
- No partial dependencies

**Summary of normalization steps:**

| Step | Problem | Solution |
|---------|---------|--------|
| UNF → 1NF | Non-atomic values, repeating groups | Make values atomic |
| 1NF → 2NF | Partial dependencies | Split table |
| 2NF → 3NF | Transitive dependencies | Split table |`,
            keyTakeaways: [
              "1NF → 2NF: Move partial dependencies into their own tables",
              "2NF → 3NF: Move transitive dependencies into their own tables",
              "Each step builds on the previous one",
              "Foreign keys secure the relationships between the split tables",
            ],
          },
        ],
      },
      {
        id: "denormalisierung",
        title: "Denormalization — When Less Normal Form is Better",
        estimatedMinutes: 10,
        sections: [
          {
            id: "wann-denormalisieren",
            title: "When Denormalization Makes Sense",
            sectionType: "theory",
            content: `**Denormalization** is the deliberate return to a lower normal form to improve read performance.

**Good reasons for denormalization:**

1. **Performance with frequent JOINs**
   If a query must JOIN 5+ tables and is executed very frequently, a denormalized table can be significantly faster.

2. **Caching computed columns**
   Instead of recalculating \`SUM(amount)\` on every query, a \`total_amount\` can be stored in the table.

3. **Data Warehousing**
   In OLAP systems (analysis, reporting), denormalization is standard. Star schema and snowflake schema are deliberately denormalized.

4. **Historical data**
   When the historical state of an entity should be stored (e.g., price at the time of order).

**Bad reasons for denormalization:**
- "JOINs are complicated" → Learn JOINs instead of denormalizing
- "I only need one table" → That's a design error
- "It's faster to implement" → Technical debt

**Denormalization Strategies:**

| Strategy | Description | Example |
|-----------|-------------|----------|
| Redundant column | Duplicate frequently needed column | \`customer_name\` in Orders |
| Precomputed column | Store aggregation result | \`order_count\` in Customers |
| Merged table | Combine multiple tables | Order report table |
| Snapshot | Freeze historical state | \`price_at_order\` |`,
            keyTakeaways: [
              "Denormalization = deliberate return to lower normal form",
              "Good for: frequent JOINs, computed columns, OLAP, historization",
              "Bad for: OLTP, when consistency is more important than performance",
              "Always normalize first, then selectively denormalize",
            ],
          },
          {
            id: "denormalisierung-beispiel",
            title: "Denormalization in Practice",
            sectionType: "example",
            content: `**Example: Online Shop with Order Reporting**

**Normalized (3NF):**
\`\`\`sql
-- 4 tables, 3 JOINs for an order overview
SELECT c.name, o.date, p.name AS product, oi.quantity, oi.unit_price
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
\`\`\`

---

**Denormalized (for reporting):**
\`\`\`sql
-- 1 table, no JOIN
SELECT customer_name, order_date, product_name, quantity, unit_price
FROM order_report;
\`\`\`

---

**When which version?**

| Scenario | Recommendation |
|----------|-----------|
| Online order (OLTP) | Normalized — consistency is important |
| Daily report (OLAP) | Denormalized — performance is important |
| Customer dashboard | Normalized with view |
| Monthly closing report | Denormalized as materialized view |

**Important:** Denormalization does **not** mean deleting the normalized tables! You keep the normalized tables for write accesses and create additional denormalized tables/views for read accesses.

**Trigger for automatic synchronization:**
\`\`\`sql
-- Update the order report on every new order
CREATE TRIGGER update_report
AFTER INSERT ON order_items
BEGIN
  INSERT OR REPLACE INTO order_report (...)
  SELECT ... FROM ... ;
END;
\`\`\`

---

This keeps the denormalization consistent without requiring manual updates.`,
            keyTakeaways: [
              "Keep normalized tables, create denormalized ones additionally",
              "OLTP = normalized, OLAP = denormalized",
              "Triggers can automatically synchronize denormalized tables",
              "Denormalization is a deliberate design decision, not a stopgap",
            ],
          },
        ],
      },
      {
        id: "normalisierung-fehler",
        title: "Common Normalization Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "nf-fehler-liste",
            title: "The Most Common Normalization Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: Denormalizing too early**
Many developers denormalize for performance reasons before they even have a performance problem. **Correct:** First normalize, then selectively denormalize for proven bottlenecks.

**Mistake 2: Overlooking 1NF violations**
- Lists in a cell ("Math, Physics, Chemistry")
- Repeating groups (Column1, Column2, Column3)
- Composite values ("Anna Müller" instead of First/Last name)

**Mistake 3: Not recognizing composite keys**
When the primary key consists of multiple columns, you must check for partial dependencies. This is often overlooked.

**Mistake 4: Overlooking transitive dependencies**
\`Customer_ID → ZIP → City\` — ZIP determines the city, but the city is still stored in the customer table.

**Mistake 5: BCNF violations in practice**
With overlapping candidate keys, 3NF may be achieved but BCNF not. Example: (Student, Course) → Instructor and Instructor → Course.

**Mistake 6: Normalization as a goal instead of a means**
Normalization is a tool for avoiding anomalies, not an end in itself. Sometimes a lower normal form is deliberately better.

**Mistake 7: Forgetting foreign keys**
After splitting tables, foreign keys must be defined to secure the relationships.`,
            keyTakeaways: [
              "Don't denormalize too early — only for proven bottlenecks",
              "1NF violations: Lists, repeating groups, composite values",
              "Composite keys require checking for partial dependencies",
              "Transitive dependencies: Recognize and resolve A → B → C",
              "Don't forget foreign keys after splitting",
            ],
          },
          {
            id: "nf-fehler-uebungen",
            title: "Recognizing and Correcting Errors",
            sectionType: "practice",
            content: `**Exercise 1: Which normal form is violated?**

Table: Bookings(Booking_ID, Room_Number, Room_Type, Room_Price, Guest_ID, Guest_Name, Check_in, Check_out)

- Room_Type depends on Room_Number → **Transitive dependency** → 3NF violation
- Room_Price depends on Room_Number → **Transitive dependency** → 3NF violation
- Guest_Name depends on Guest_ID → **Transitive dependency** → 3NF violation

**Correction:** Split into:
- Bookings(Booking_ID, Room_Number, Guest_ID, Check_in, Check_out)
- Rooms(Room_Number, Room_Type, Room_Price)
- Guests(Guest_ID, Guest_Name)

---

**Exercise 2: Recognize 1NF violation**

Table: Students(ID, Name, Courses)
| ID | Name | Courses |
|----|------|-------|
| 1 | Anna | Math, Physics |
| 2 | Ben | German |

**Problem:** The "Courses" column contains multiple values → 1NF violation

**Correction:**
Students(ID, Name)
Enrollments(Student_ID, Course)

---

**Exercise 3: Recognize 2NF violation**

Table: Grades(Student_ID, Course_ID, Student_Name, Grade)
Primary key: (Student_ID, Course_ID)

**Problem:** Student_Name depends only on Student_ID → Partial dependency → 2NF violation

**Correction:**
Students(Student_ID, Student_Name)
Grades(Student_ID, Course_ID, Grade)

---

**Exercise 4: Recognize BCNF violation**

Table: Schedule(Student, Course, Instructor)
- (Student, Course) → Instructor (Primary key)
- Instructor → Course (Instructor determines the course)

**Problem:** Instructor is not a determinant that is a candidate key → BCNF violation

**Correction:**
Enrollments(Student, Instructor)
Instructor_Courses(Instructor, Course)`,
            keyTakeaways: [
              "Transitive dependencies: Non-key attributes that depend on other non-key attributes",
              "1NF violation: Lists or repeating groups in a cell",
              "2NF violation: Attributes that depend only on part of the key",
              "BCNF violation: Determinant is not a candidate key",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 2: Relational Model
  // ═══════════════════════════════════════════════════════════════
  {
    id: "relationenmodell",
    title: "Relational Model",
    description: "Relations, keys, integrity constraints, and the mathematical foundations of relational databases.",
    icon: "link",
    difficulty: "junior",
    articles: [
      {
        id: "grundbegriffe-rm",
        title: "Basic Concepts of the Relational Model",
        estimatedMinutes: 10,
        sections: [
          {
            id: "relation-attribut-tupel",
            title: "Relation, Attribute, Tuple",
            sectionType: "theory",
            content: `The **relational model** was introduced by Edgar F. Codd in 1970 and is the theoretical foundation of relational databases.

**Core concepts:**

| RM Term | SQL Term | Colloquial |
|------------|-------------|-------------------|
| Relation | Table | Table |
| Attribute | Column | Field |
| Tuple | Row | Record |
| Domain | Data type | Value range |
| Primary key | PRIMARY KEY | Unique key |

A **relation** is a set of **tuples** (rows) over a set of **attributes** (columns). Each attribute has a **domain** (value range) — e.g., the domain of "Age" is the set of natural numbers.

Important: A relation is a **set** — the order of rows and columns has no meaning. SQL does not always guarantee this property (e.g., with ORDER BY), but the relational model requires it.`,
            keyTakeaways: [
              "Relation = Table, Tuple = Row, Attribute = Column",
              "Domain = allowed value range of an attribute",
              "Relations are sets — order is irrelevant",
              "Introduced by Codd in 1970 as mathematical foundation",
            ],
          },
          {
            id: "schluessel",
            title: "Keys and Dependencies",
            sectionType: "theory",
            content: `**Super Key:**
A set of attributes that uniquely identifies each tuple. Every relation has at least one super key (the set of all attributes).

**Candidate Key:**
A minimal super key — no attribute can be removed without losing uniqueness. A relation can have multiple candidate keys.

**Primary Key:**
The candidate key selected by the database designer. It is defined in SQL with \`PRIMARY KEY\`.

**Foreign Key:**
An attribute (or combination of attributes) that references the primary key of another relation. Foreign keys create relationships between tables.

**Functional Dependency:**
X → Y means: If two tuples match in X, they also match in Y. Example: MatriculationNumber → Name (the matriculation number uniquely determines the name).`,
            keyTakeaways: [
              "Super key: Set of attributes that uniquely identifies a tuple",
              "Candidate key: Minimal super key",
              "Primary key: Candidate key selected by the designer",
              "Foreign key: Reference to the primary key of another relation",
              "Functional dependency X → Y: X uniquely determines Y",
            ],
          },
          {
            id: "relationale-operationen",
            title: "Relational Operations",
            sectionType: "theory",
            content: `Relational algebra defines operations on relations that form the basis for SQL:

**Basic operations:**

| Operation | Symbol | SQL Equivalent | Description |
|-----------|--------|-----------------|---------------|
| Selection | σ (sigma) | WHERE | Filter rows |
| Projection | π (pi) | SELECT columns | Select columns |
| Cross product | × | CROSS JOIN | All combinations |
| Union | ∪ | UNION | Combine results |
| Difference | − | EXCEPT | Subtract results |
| Rename | ρ (rho) | AS | Rename attributes |

**Derived operations:**

| Operation | Symbol | SQL Equivalent | Description |
|-----------|--------|-----------------|---------------|
| Natural join | ⋈ | INNER JOIN | Join over matching attributes |
| Intersection | ∩ | INTERSECT | Common rows |

Example: \`σ_{age > 25}(π_{name, age}(Students))\` corresponds to \`SELECT name, age FROM Students WHERE age > 25\``,
            keyTakeaways: [
              "Selection (σ) filters rows → WHERE in SQL",
              "Projection (π) selects columns → SELECT in SQL",
              "Natural join (⋈) connects tables → INNER JOIN",
              "Every SQL query can be expressed as a relational algebra expression",
            ],
          },
        ],
      },
      {
        id: "integritaetsbedingungen",
        title: "Integrity Constraints",
        estimatedMinutes: 12,
        sections: [
          {
            id: "integritaet-grundlagen",
            title: "Three Types of Integrity",
            sectionType: "theory",
            content: `Integrity constraints are the rules that ensure data in a database remains correct and consistent. Without integrity constraints, erroneous data could be inserted — such as an order for a customer who doesn't exist, or a negative price. There are three types of integrity that together guarantee data quality: Entity integrity ensures that each row is uniquely identifiable, referential integrity ensures that relationships between tables are consistent, and domain integrity ensures that each column contains only valid values.

**1. Entity Integrity:**
Every relation must have a primary key, and no attribute of the primary key may be NULL.

---

\`\`\`sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,  -- Must not be NULL
  name VARCHAR(50) NOT NULL
);
\`\`\`

---

**2. Referential Integrity:**
A foreign key must either be NULL or reference an existing tuple in the referenced relation.

---

\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id)  -- Must exist in customers
);
\`\`\`

---

**3. Domain Integrity:**
Each attribute must accept values from its domain. Constraints like NOT NULL, CHECK, and UNIQUE ensure this.

---

\`\`\`sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  price DECIMAL(10,2) CHECK (price > 0),  -- Domain constraint
  name VARCHAR(100) NOT NULL
);
\`\`\``,
            keyTakeaways: [
              "Entity integrity: Primary key must not be NULL",
              "Referential integrity: Foreign key must exist or be NULL",
              "Domain integrity: Values must be within the allowed domain",
              "Together they guarantee data consistency",
            ],
          },
        ],
      },
      {
        id: "relationale-algebra",
        title: "Relational Algebra",
        estimatedMinutes: 12,
        sections: [
          {
            id: "relationale-algebra-grundlagen",
            title: "The Operations of Relational Algebra",
            sectionType: "theory",
            content: `Relational algebra is the formal foundation for SQL — it defines operations on relations (tables) that produce new relations. Every SQL query can be expressed as a relational algebra expression and vice versa. The six basic operations according to Codd are: Selection (filter rows), Projection (select columns), Cross product (all combinations), Union (combine results), Difference (subtract results), and Rename (name attributes). From these, further operations are derived: natural join (JOIN), intersection (INTERSECT), and division.

**The 6 Basic Operations (according to Codd):**

| Operation | Symbol | SQL | Description |
|-----------|--------|-----|-------------|
| Selection | σ (sigma) | WHERE | Filter rows by condition |
| Projection | π (pi) | SELECT | Select columns |
| Cross product | × | CROSS JOIN | All combinations of two tables |
| Union | ∪ | UNION | Combine rows from both tables |
| Difference | − | EXCEPT | Rows from table A not in B |
| Rename | ρ (rho) | AS | Rename attributes |

**Additional important operations:**

| Operation | Symbol | SQL | Description |
|-----------|--------|-----|-------------|
| Natural join | ⋈ | NATURAL JOIN | Join over matching attributes |
| Intersection | ∩ | INTERSECT | Common rows of both tables |
| Division | ÷ | — | "For all" queries |

**Example — Selection and Projection combined:**
\`σ_{age > 25}(π_{name, age}(Students))\`
corresponds to:
\`\`\`sql
SELECT name, age FROM Students WHERE age > 25;
\`\`\`

---

**Properties of relational algebra:**
- **Closure:** Every operation on a relation produces another relation
- **Composition:** Operations can be nested (like in SQL)
- **Every SQL query can be expressed as a relational algebra expression**`,
            keyTakeaways: [
              "6 basic operations: Selection, Projection, Cross product, Union, Difference, Rename",
              "σ = WHERE, π = SELECT, × = CROSS JOIN, ∪ = UNION",
              "Every SQL query can be expressed as a relational algebra expression",
              "Operations are composable and closed",
            ],
          },
          {
            id: "relationale-algebra-beispiele",
            title: "Translating Relational Algebra to SQL",
            sectionType: "example",
            content: `Relational algebra is the theoretical foundation for SQL. Every SQL query can be expressed as a relational algebra expression — and vice versa. Understanding this translation helps you build SQL queries systematically rather than just typing from intuition. The mapping is direct: Selection becomes WHERE, Projection becomes SELECT columns, Join becomes JOIN, Union becomes UNION, and Difference becomes EXCEPT.

**1. Selection (σ) — Filter rows:**
\`σ_{price > 50}(Products)\` →
\`\`\`sql
SELECT * FROM products WHERE price > 50;
\`\`\`

---

**2. Projection (π) — Select columns:**
\`π_{name, price}(Products)\` →
\`\`\`sql
SELECT name, price FROM products;
\`\`\`

---

**3. Cross product (×) — All combinations:**
\`Customers × Products\` →
\`\`\`sql
SELECT * FROM customers CROSS JOIN products;
\`\`\`

---

**4. Natural join (⋈) — Join over matching attributes:**
\`Customers ⋈ Orders\` →
\`\`\`sql
SELECT * FROM customers NATURAL JOIN orders;
\`\`\`

---

**5. Union (∪) — Combine results:**
\`Active_Customers ∪ Inactive_Customers\` →
\`\`\`sql
SELECT * FROM active_customers
UNION
SELECT * FROM inactive_customers;
\`\`\`

---

**6. Difference (−) — Subtract results:**
\`All_Customers − Active_Customers\` →
\`\`\`sql
SELECT * FROM all_customers
EXCEPT
SELECT * FROM active_customers;
\`\`\`

---

**7. Combined example:**
\`π_{name}(σ_{category = 'Electronics'}(Products ⋈ Orders))\` →
\`\`\`sql
SELECT p.name
FROM products p
JOIN orders o ON p.id = o.product_id
WHERE p.category = 'Electronics';
\`\`\``,
            keyTakeaways: [
              "σ (Selection) → WHERE in SQL",
              "π (Projection) → SELECT in SQL",
              "⋈ (Join) → JOIN in SQL",
              "∪ (Union) → UNION, − (Difference) → EXCEPT",
              "Operations can be freely combined",
            ],
          },
        ],
      },
      {
        id: "schluessel-und-abhaengigkeiten",
        title: "Keys and Dependencies",
        estimatedMinutes: 12,
        sections: [
          {
            id: "schluesselarten",
            title: "Key Types in Detail",
            sectionType: "theory",
            content: `**Super Key**
A set of attributes that uniquely identifies each tuple. Every relation has at least one super key — the set of all attributes.

*Example:* In Students(ID, Name, MatriculationNumber, Major), super keys are:
- {ID}
- {MatriculationNumber}
- {ID, Name}
- {ID, MatriculationNumber}
- {ID, Name, MatriculationNumber, Major}

**Candidate Key**
A **minimal** super key — no attribute can be removed without losing uniqueness.

From the above super keys, only {ID} and {MatriculationNumber} are candidate keys, since they are minimal.

**Primary Key**
The candidate key **selected** by the database designer. Defined in SQL with \`PRIMARY KEY\`.

**Foreign Key**
An attribute (or combination of attributes) that references the primary key of another relation.

\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id)  -- Foreign key
);
\`\`\`

---

**Alternate Key**
All candidate keys that were not selected as the primary key. Defined in SQL with \`UNIQUE\`.

\`\`\`sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  matriculation_number VARCHAR(10) UNIQUE  -- Alternate key
);
\`\`\`

---

**Composite Key**
A key that consists of multiple attributes.

\`\`\`sql
CREATE TABLE enrollments (
  student_id INTEGER,
  course_id INTEGER,
  grade DECIMAL(3,1),
  PRIMARY KEY (student_id, course_id)  -- Composite key
);
\`\`\``,
            keyTakeaways: [
              "Super key: Set of attributes that uniquely identifies a tuple",
              "Candidate key: Minimal super key",
              "Primary key: Candidate key selected by the designer",
              "Foreign key: Reference to the primary key of another table",
              "Composite key: Consists of multiple attributes",
            ],
          },
          {
            id: "funktionale-abhaengigkeiten-rm",
            title: "Functional Dependencies in the Relational Model",
            sectionType: "practice",
            content: `**Functional dependencies (FDs)** are the central concept of normalization theory.

**Definition:** X → Y means: If two tuples match in the attributes of X, then they also match in Y.

**Armstrong's Axioms:**

1. **Reflexivity:** If Y ⊆ X, then X → Y
   (Every set of attributes determines itself)

2. **Augmentation:** If X → Y, then XZ → YZ
   (Extend both sides by the same attributes)

3. **Transitivity:** If X → Y and Y → Z, then X → Z
   (Chaining of dependencies)

**Derived rules:**

4. **Union:** If X → Y and X → Z, then X → YZ
5. **Decomposition:** If X → YZ, then X → Y and X → Z
6. **Pseudotransitivity:** If X → Y and YW → Z, then XW → Z

**Example — FDs for an order table:**

Orders(Order_ID, Customer_ID, Date, Product_ID, Quantity, Price)

FDs:
- Order_ID → Customer_ID, Date
- Product_ID → Price
- (Order_ID, Product_ID) → Quantity

**Determining keys:**
1. Start with the set of all attributes: {Order_ID, Customer_ID, Date, Product_ID, Quantity, Price}
2. Find the minimal set that determines all attributes
3. (Order_ID, Product_ID) determines: Order_ID → Customer_ID, Date; Product_ID → Price; (Order_ID, Product_ID) → Quantity
4. So (Order_ID, Product_ID) is a candidate key`,
            keyTakeaways: [
              "X → Y: X uniquely determines Y",
              "Armstrong's axioms: Reflexivity, Augmentation, Transitivity",
              "Candidate key = minimal set of attributes that determines all attributes",
              "Determine FDs systematically and derive keys",
            ],
          },
        ],
      },
      {
        id: "fremdschluessel-referenzielle-integritaet",
        title: "Foreign Keys and Referential Integrity",
        estimatedMinutes: 12,
        sections: [
          {
            id: "fremdschluessel-detail",
            title: "Foreign Keys in Detail",
            sectionType: "theory",
            content: `A **foreign key** is an attribute (or combination of attributes) that references the primary key of another table, thereby establishing relationships between tables.

**Declaration in SQL:**
\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

---

**Referential integrity** means: A foreign key value must either be NULL or exist as a primary key value in the referenced table.

**Violations of referential integrity:**
1. Inserting a foreign key value that does not exist in the referenced table
2. Deleting a primary key value that still has foreign keys referencing it
3. Changing a primary key value that foreign keys reference

**Resolution strategies for delete and update operations:**

| Action | Description | SQL |
|--------|-------------|-----|
| CASCADE | Dependent rows are deleted/updated as well | \`ON DELETE CASCADE\` |
| SET NULL | Foreign key is set to NULL | \`ON DELETE SET NULL\` |
| SET DEFAULT | Foreign key is set to the default value | \`ON DELETE SET DEFAULT\` |
| RESTRICT | Deletion is prevented (error) | \`ON DELETE RESTRICT\` |
| NO ACTION | Like RESTRICT (default) | \`ON DELETE NO ACTION\` |

**Example with CASCADE:**
\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE    -- When customer is deleted, their orders are also deleted
    ON UPDATE CASCADE    -- When customer ID changes, it also changes in orders
);
\`\`\``,
            keyTakeaways: [
              "Foreign keys reference the primary key of another table",
              "Referential integrity: FK value must be NULL or exist in the referenced table",
              "CASCADE: Dependent rows are deleted/updated as well",
              "RESTRICT/NO ACTION: Deletion is prevented",
              "SET NULL: FK is set to NULL on deletion",
            ],
          },
          {
            id: "fremdschluessel-praxis",
            title: "Foreign Keys in Practice",
            sectionType: "example",
            content: `**Example: Online shop with referential integrity**

\`\`\`sql
-- Customers table
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0)
);

-- Orders with foreign keys
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Order items with two foreign keys
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT
);
\`\`\`

---

**When to choose which action?**

| Relationship | ON DELETE | Reason |
|-----------|----------|-----------|
| Customer → Orders | CASCADE | Orders without a customer are meaningless |
| Product → Order Items | RESTRICT | Product cannot be deleted while referenced in orders |
| Category → Products | SET NULL | Products without a category are allowed |
| Department → Employees | RESTRICT | Department cannot be deleted while there are employees |

**Common mistakes:**
1. Forgetting foreign keys → data inconsistency
2. Wrong CASCADE action → accidental data deletion
3. Circular foreign keys → Table A references B and B references A`,
            keyTakeaways: [
              "CASCADE for dependent data (orders without customer are meaningless)",
              "RESTRICT for referenced data (don't delete product if in order)",
              "SET NULL for optional relationships",
              "Always define foreign keys — otherwise data inconsistency",
            ],
          },
        ],
      },
      {
        id: "domaenen-constraints",
        title: "Domains and Constraints",
        estimatedMinutes: 10,
        sections: [
          {
            id: "domaenen-und-constraints",
            title: "Domain Integrity and Constraints",
            sectionType: "theory",
            content: `**Domain integrity** ensures that each attribute only accepts values from its allowed value range (domain).

**Types of Constraints:**

| Constraint | Description | Example |
|-----------|-------------|----------|
| NOT NULL | Required field | \`name VARCHAR(100) NOT NULL\` |
| UNIQUE | Uniqueness | \`email VARCHAR(100) UNIQUE\` |
| PRIMARY KEY | Unique identification | \`id INTEGER PRIMARY KEY\` |
| FOREIGN KEY | Referential integrity | \`REFERENCES customers(id)\` |
| CHECK | Restrict value range | \`CHECK (price > 0)\` |
| DEFAULT | Default value | \`status VARCHAR(20) DEFAULT 'new'\` |

**CHECK Constraints in detail:**
\`\`\`sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) CHECK (price > 0),
  category VARCHAR(50) CHECK (category IN ('Electronics', 'Book', 'Clothing', 'Other')),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);
\`\`\`

---

**Domain integrity through data types:**
- \`INTEGER\` — Only whole numbers
- \`DECIMAL(10,2)\` — Decimal numbers with 2 decimal places
- \`VARCHAR(100)\` — Strings up to 100 characters
- \`DATE\` — Date values
- \`BOOLEAN\` — Only TRUE/FALSE

**User-defined domains (SQL standard, not in SQLite):**
\`\`\`sql
-- SQL standard (not SQLite)
CREATE DOMAIN email_type VARCHAR(100)
  CHECK (VALUE LIKE '%@%.%');

CREATE DOMAIN positive_decimal DECIMAL(10,2)
  CHECK (VALUE > 0);
\`\`\`

---

In SQLite, the same effect is achieved with CHECK constraints.`,
            keyTakeaways: [
              "NOT NULL, UNIQUE, CHECK, DEFAULT are the most important constraints",
              "CHECK constraints restrict the value range",
              "Data types ensure domain integrity",
              "In SQLite: CHECK instead of user-defined domains",
            ],
          },
        ],
      },
      {
        id: "relationale-vs-nicht-relationale",
        title: "Relational vs. Non-Relational Databases",
        estimatedMinutes: 10,
        sections: [
          {
            id: "relational-vs-nosql",
            title: "Comparison: Relational vs. NoSQL Databases",
            sectionType: "theory",
            content: `**Relational databases (RDBMS)** store data in tables with a fixed schema. **NoSQL databases** use flexible data models.

| Property | Relational (SQL) | NoSQL |
|------------|-----------------|-------|
| Data model | Tables with rows and columns | Documents, key-value, graph, column |
| Schema | Fixed definition | Flexible / schema-less |
| Query language | SQL | Database-specific |
| Scaling | Vertical (larger servers) | Horizontal (more servers) |
| Transactions | ACID guaranteed | Often only eventual consistency |
| Relationships | Foreign keys, JOINs | Often denormalized, embedded |
| Normalization | Up to 3NF recommended | Often deliberately denormalized |

**Types of NoSQL databases:**

| Type | Example | Use case |
|------|----------|---------------|
| Document | MongoDB | Flexible data structures, CMS |
| Key-value | Redis | Caching, sessions |
| Column family | Cassandra | Time series, IoT data |
| Graph | Neo4j | Social networks, recommendations |

**When to use relational databases?**
- Data has clear structure and relationships
- Data integrity is important (ACID)
- Complex queries with JOINs
- Transaction safety required

**When to use NoSQL databases?**
- Data structure changes frequently
- Very large data volumes (Big Data)
- High write rate, simple read access
- Flexible schema requirements

**Important:** The choice is not either-or. Many modern systems use both — relational for critical data, NoSQL for caching and analytics.`,
            keyTakeaways: [
              "Relational: Tables, fixed schema, SQL, ACID, JOINs",
              "NoSQL: Flexible data models, horizontal scaling, eventual consistency",
              "4 NoSQL types: Document, Key-value, Column family, Graph",
              "Choice depends on use case — often both are combined",
            ],
          },
        ],
      },
      {
        id: "mengenoperationen",
        title: "Set Operations in SQL",
        estimatedMinutes: 10,
        sections: [
          {
            id: "union-intersect-except",
            title: "UNION, INTERSECT, and EXCEPT",
            sectionType: "theory",
            content: `Set operations combine the results of two SELECT queries. Unlike JOINs, which add columns, set operations add rows — they work vertically, not horizontally. UNION combines results (like set theory union ∪), INTERSECT returns the intersection (∩), and EXCEPT returns the difference (∖). Important: Both queries must be compatible — same number of columns and compatible data types. Column names always come from the first query.

**UNION — Combine:**
\`\`\`sql
-- All customers and suppliers (without duplicates)
SELECT name, city FROM customers
UNION
SELECT name, city FROM suppliers;

-- With duplicates (UNION ALL)
SELECT name, city FROM customers
UNION ALL
SELECT name, city FROM suppliers;
\`\`\`

---

**INTERSECT — Intersection:**
\`\`\`sql
-- Customers who are also suppliers
SELECT name, city FROM customers
INTERSECT
SELECT name, city FROM suppliers;
\`\`\`

---

**EXCEPT — Difference:**
\`\`\`sql
-- Customers who are not suppliers
SELECT name, city FROM customers
EXCEPT
SELECT name, city FROM suppliers;
\`\`\`

---

**Important rules:**
- Both queries must have the same number of columns
- Columns must have compatible data types
- Column names come from the first query
- \`UNION\` removes duplicates, \`UNION ALL\` keeps them
- \`INTERSECT\` and \`EXCEPT\` automatically remove duplicates`,
            keyTakeaways: [
              "UNION: Combine two result sets (without duplicates)",
              "UNION ALL: Combine with duplicates (faster)",
              "INTERSECT: Intersection of both result sets",
              "EXCEPT: Difference — rows in A that are not in B",
              "Both queries must have compatible columns",
            ],
          },
          {
            id: "mengenoperationen-beispiele",
            title: "Set Operations in Practice",
            sectionType: "example",
            content: `Set operations are particularly useful when you need to combine, compare, or subtract data from different sources. UNION ALL is the most common operation — it combines rows from different tables, such as active and inactive customers in one list. INTERSECT finds commonalities (which products are in both branches?), EXCEPT finds differences (which products are only in the north inventory?). Unlike JOINs, which add columns, set operations add rows.

**Example 1: Combine active and inactive customers**
\`\`\`sql
SELECT id, name, 'active' AS status FROM active_customers
UNION ALL
SELECT id, name, 'inactive' AS status FROM inactive_customers;
\`\`\`

---

**Example 2: Products available in both branches**
\`\`\`sql
SELECT product_id FROM branch_north_inventory
INTERSECT
SELECT product_id FROM branch_south_inventory;
\`\`\`

---

**Example 3: Products only in north inventory**
\`\`\`sql
SELECT product_id FROM branch_north_inventory
EXCEPT
SELECT product_id FROM branch_south_inventory;
\`\`\`

---

**UNION vs. JOIN — When to use which?**

| UNION | JOIN |
|-------|------|
| Combines rows from different tables | Combines columns from different tables |
| Both queries must have same column structure | Any column structure |
| Increases row count | Increases column count |
| Combine vertically | Combine horizontally |

**Common mistakes:**
1. Column count doesn't match → Error
2. Incompatible data types → Error
3. Using \`UNION\` instead of \`UNION ALL\` when duplicates are wanted → missing rows
4. Column names come from the first query → confusing with different tables`,
            keyTakeaways: [
              "UNION combines rows (vertically), JOIN combines columns (horizontally)",
              "UNION ALL is faster than UNION (no duplicate check)",
              "Column count and data types must match",
              "Column names come from the first query",
            ],
          },
        ],
      },
      {
        id: "normalformen-ueberblick",
        title: "Normal Forms Overview",
        estimatedMinutes: 10,
        sections: [
          {
            id: "nf-ueberblick-tabelle",
            title: "All Normal Forms at a Glance",
            sectionType: "theory",
            content: `Normal forms build on each other: Each higher normal form presupposes the previous one and eliminates additional problems. From 1NF (atomic values) through 2NF (no partial dependencies) and 3NF (no transitive dependencies) to BCNF (every determinant is a candidate key), the data structure is refined step by step. In practice, 3NF is usually sufficient — BCNF and higher are special cases that are only relevant in specific situations.

**Overview of the most important normal forms:**

| NF | Condition | Prevents | Example Violation |
|----|-----------|-----------|---------------------|
| 1NF | Atomic values, no repeating groups | Lists in cells, repeating columns | "Math, Physics" in one cell |
| 2NF | 1NF + full functional dependency | Partial dependencies | Name depends only on part of the key |
| 3NF | 2NF + no transitive dependencies | Indirect dependencies | ZIP → City (via ZIP) |
| BCNF | 3NF + every determinant is a candidate key | Overlapping candidate keys | Instructor → Course, but Instructor not a key |
| 4NF | BCNF + no multi-valued dependencies | Multi-valued dependencies | One instructor teaches multiple courses and has multiple rooms |
| 5NF | 4NF + no join dependencies | Decomposition losses | Three-table join dependency |

**Relevant in practice:**
- **1NF, 2NF, 3NF** — Standard for operational databases
- **BCNF** — Relevant in special cases
- **4NF, 5NF** — Very rarely relevant, usually automatically satisfied

**Determining the normal form — step by step:**

1. **Check 1NF:** Are all values atomic? No lists, no repeating groups?
2. **Check 2NF:** Are there composite keys? Do attributes depend on only part of the key?
3. **Check 3NF:** Are there attributes that depend on other non-key attributes?
4. **Check BCNF:** Are there functional dependencies where the determinant is not a candidate key?

**Rule of thumb:** In practice, normalizing up to 3NF is sufficient. BCNF and higher normal forms are only relevant in special cases.`,
            keyTakeaways: [
              "1NF: Atomic values, no lists in cells",
              "2NF: No partial dependencies on the key",
              "3NF: No transitive dependencies",
              "BCNF: Every determinant is a candidate key",
              "In practice: 3NF is usually sufficient",
            ],
          },
        ],
      },
      {
        id: "relationenmodell-praxis",
        title: "From Relational Model to SQL Table",
        estimatedMinutes: 12,
        sections: [
          {
            id: "rm-zu-sql-prozess",
            title: "Transformation: Relational Model → SQL",
            sectionType: "practice",
            content: `The transformation from the relational model to an SQL table follows clear rules: Each relation becomes a table, each attribute becomes a column, and the domain determines the data type plus CHECK constraints. Primary keys become PRIMARY KEY, foreign keys become FOREIGN KEY REFERENCES. Relationships are mapped through foreign keys on the n-side, and n:m relationships are resolved through junction tables. The process is systematic: First define tables and columns, then set primary keys, then create foreign keys for relationships, and finally add constraints for integrity.

The path from the relational model to the finished SQL table:

**Step 1: Identify relations**
Each relation becomes a table. Attributes become columns.

**Step 2: Choose data types**
\`\`\`sql
-- From the RM: Students(MatriculationNumber: INTEGER, Name: VARCHAR, Major: VARCHAR, Semester: INTEGER)
CREATE TABLE students (
  matriculation_number INTEGER,
  name VARCHAR(100) NOT NULL,
  major VARCHAR(50),
  semester INTEGER CHECK (semester > 0)
);
\`\`\`

---

**Step 3: Define primary key**
\`\`\`sql
CREATE TABLE students (
  matriculation_number INTEGER PRIMARY KEY,  -- Primary key
  name VARCHAR(100) NOT NULL,
  major VARCHAR(50),
  semester INTEGER CHECK (semester > 0)
);
\`\`\`

---

**Step 4: Foreign keys and relationships**
\`\`\`sql
-- 1:n relationship: One major has many students
CREATE TABLE majors (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE students (
  matriculation_number INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  major_id INTEGER,
  semester INTEGER CHECK (semester > 0),
  FOREIGN KEY (major_id) REFERENCES majors(id)
);
\`\`\`

---

**Step 5: Add constraints**
\`\`\`sql
CREATE TABLE students (
  matriculation_number INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  major_id INTEGER,
  semester INTEGER DEFAULT 1 CHECK (semester > 0),
  FOREIGN KEY (major_id) REFERENCES majors(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
\`\`\`

---

**Summary of the transformation:**

| RM Concept | SQL Concept |
|-----------|-------------|
| Relation | Table (CREATE TABLE) |
| Attribute | Column |
| Domain | Data type + CHECK constraint |
| Tuple | Row |
| Primary key | PRIMARY KEY |
| Foreign key | FOREIGN KEY REFERENCES |
| Integrity constraint | CHECK, NOT NULL, UNIQUE |`,
            keyTakeaways: [
              "Relation → Table, Attribute → Column, Tuple → Row",
              "Define primary keys with PRIMARY KEY",
              "Define foreign keys with FOREIGN KEY REFERENCES",
              "Constraints (NOT NULL, UNIQUE, CHECK) ensure integrity",
              "Specify ON DELETE/ON UPDATE for foreign key actions",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 3: Entity-Relationship Model
  // ═══════════════════════════════════════════════════════════════
  {
    id: "erm",
    title: "Entity-Relationship Model",
    description: "Entities, relationships, cardinalities, and the transformation from ERM to the relational model.",
    icon: "bar-chart",
    difficulty: "junior",
    articles: [
      {
        id: "erm-grundlagen",
        title: "ERM Basics",
        estimatedMinutes: 10,
        sections: [
          {
            id: "entitaeten-attribute",
            title: "Entities and Attributes",
            sectionType: "theory",
            content: `The **Entity-Relationship Model (ERM)** was developed by Peter Chen in 1976 and is the most important conceptual data model.

**Entity:**
An object of the real world that should be represented in the data model.
*Examples:* Customer, Product, Order

**Attribute:**
A property of an entity.
*Examples:* Name, Price, Date

**Entity Type:**
The class of all entities with the same attributes.
*Example:* "Customer" is the entity type, "Anna Müller" is a concrete entity.

**Key Attribute:**
An attribute that uniquely identifies each entity (underlined in ERM notation).

**Attributes can be:**
- **Simple** (atomic): e.g., Age
- **Composite**: e.g., Address (Street, ZIP, City)
- **Multi-valued**: e.g., Phone numbers (multiple per customer)
- **Derived**: e.g., Age (derived from date of birth)`,
            keyTakeaways: [
              "ERM by Peter Chen 1976 — conceptual data model",
              "Entity = object of the real world",
              "Attribute = property of an entity",
              "Key attribute = unique identification (underlined in ERM)",
            ],
          },
          {
            id: "beziehungen-kardinalitaeten",
            title: "Relationships and Cardinalities",
            sectionType: "theory",
            content: `**Relationship:**
A connection between two or more entities.
*Example:* "orders" connects Customer and Product.

**Cardinalities** describe how many entities on one side can be linked to how many on the other side:

| Notation | Meaning | Example |
|----------|-----------|----------|
| 1:1 | One-to-One | A customer has exactly one ID card |
| 1:n | One-to-Many | A customer has many orders |
| n:m | Many-to-Many | A student attends many courses, a course has many students |

**Important:** n:m relationships must be resolved in the relational model through a **junction table**!

**Chen Notation vs. Crow's Foot Notation:**
- **Chen Notation**: Relationships as diamonds, cardinalities as numbers (1, n, m)
- **Crow's Foot Notation**: Cardinalities as symbols at line ends (‖ = 1, ◇ = 0 or 1, ∗ = many)`,
            widget: {
              type: "erm-diagram",
              data: {
                entities: [
                  {
                    id: "kunde",
                    name: "Customer",
                    attributes: [
                      { name: "id", isPrimaryKey: true },
                      { name: "name" },
                      { name: "email" },
                    ],
                    x: 50,
                    y: 80,
                  },
                  {
                    id: "bestellung",
                    name: "Order",
                    attributes: [
                      { name: "id", isPrimaryKey: true },
                      { name: "date" },
                      { name: "amount" },
                      { name: "customer_id", isForeignKey: true },
                    ],
                    x: 280,
                    y: 80,
                  },
                  {
                    id: "produkt",
                    name: "Product",
                    attributes: [
                      { name: "id", isPrimaryKey: true },
                      { name: "name" },
                      { name: "price" },
                    ],
                    x: 510,
                    y: 80,
                  },
                ],
                relationships: [
                  {
                    id: "r1",
                    name: "places",
                    fromEntityId: "kunde",
                    toEntityId: "bestellung",
                    fromCardinality: "1",
                    toCardinality: "n",
                  },
                  {
                    id: "r2",
                    name: "contains",
                    fromEntityId: "bestellung",
                    toEntityId: "produkt",
                    fromCardinality: "n",
                    toCardinality: "m",
                  },
                ],
              },
            },
          },
          {
            id: "erm-zu-rm",
            title: "Transformation ERM → Relational Model",
            sectionType: "practice",
            content: `The transformation from ERM to the relational model follows fixed rules:

**1. Entity type → Table**
Each entity type becomes a table. Attributes become columns.

**2. 1:1 relationship → Foreign key**
The primary key of one table is added as a foreign key to the other table.

**3. 1:n relationship → Foreign key on the n-side**
The primary key of the "1-side" is added as a foreign key to the table on the "n-side".

**4. n:m relationship → Junction table**
A new table is created that contains the primary keys of both entities as foreign keys.`,
            widget: {
              type: "rm-to-sql",
              data: {
                tables: [
                  {
                    name: "students",
                    columns: [
                      { name: "id", type: "INTEGER", isPrimaryKey: true },
                      { name: "name", type: "VARCHAR(100)", isNotNull: true },
                    ],
                  },
                  {
                    name: "courses",
                    columns: [
                      { name: "id", type: "INTEGER", isPrimaryKey: true },
                      { name: "name", type: "VARCHAR(100)", isNotNull: true },
                    ],
                  },
                  {
                    name: "enrollments",
                    columns: [
                      { name: "student_id", type: "INTEGER", isNotNull: true, isForeignKey: true, references: "students(id)" },
                      { name: "course_id", type: "INTEGER", isNotNull: true, isForeignKey: true, references: "courses(id)" },
                      { name: "semester", type: "VARCHAR(10)", isNotNull: true },
                    ],
                  },
                ],
                hint: "Create three tables: students (id, name), courses (id, name) and enrollments (student_id, course_id, semester) with foreign keys.",
              },
            },
          },
        ],
      },
      {
        id: "erm-notationen",
        title: "ERM Notations",
        estimatedMinutes: 10,
        sections: [
          {
            id: "chen-notation",
            title: "Chen Notation",
            sectionType: "theory",
            content: `**Chen Notation** (also called Chen diagram) is the original notation introduced by Peter Chen in 1976:

**Elements:**
- **Rectangle** = Entity type
- **Ellipse** = Attribute (key attribute with underlined text)
- **Diamond** = Relationship type
- **Lines** = Connections between elements
- **Cardinalities** = Numbers (1, n, m) at the lines

**Advantages of Chen Notation:**
- Clear separation of entities, attributes, and relationships
- Even complex n:m relationships can be directly represented
- Good for conceptual design

**Disadvantages:**
- Quickly becomes confusing with many entities and relationships
- Less common in practice than Crow's Foot notation`,
            keyTakeaways: [
              "Rectangle = Entity, Ellipse = Attribute, Diamond = Relationship",
              "Cardinalities as numbers (1, n, m) at the lines",
              "Good for conceptual design, less for physical",
            ],
          },
          {
            id: "krahenfuss-notation",
            title: "Crow's Foot Notation",
            sectionType: "theory",
            content: `**Crow's Foot Notation** is the most widely used ERM representation in practice:

**Symbols at line ends:**

| Symbol | Meaning | Description |
|--------|-----------|-------------|
| ‖ | Exactly one | One and only one |
| ◇ | Zero or one | Optional |
| ∗ | Many | One or more |
| ○ | Zero or many | None or more |

**Combinations:**
- ‖‖ = 1:1 (Exactly one to exactly one)
- ‖∗ = 1:n (Exactly one to many)
- ○∗ = 0:n (Optional to many)

**Advantages of Crow's Foot Notation:**
- Compact and clear
- Directly transferable to physical table structure
- Standard in many CASE tools (MySQL Workbench, etc.)`,
            keyTakeaways: [
              "Crow's Foot Notation is the practice standard",
              "Symbols: ‖ (one), ◇ (zero/one), ∗ (many)",
              "More compact than Chen Notation",
              "Directly transferable to table structure",
            ],
          },
        ],
      },
      {
        id: "entitaetstypen-attributtypen",
        title: "Entity Types and Attribute Types",
        estimatedMinutes: 10,
        sections: [
          {
            id: "entitaetstypen",
            title: "Entity Types in Detail",
            sectionType: "theory",
            content: `**Entity types** describe classes of objects in the real world with the same attributes.

**Regular entity types:**
Exist independently of other entities.
*Examples:* Customer, Product, Employee

**Weak entity types:**
Exist only in dependence on another (strong) entity type. They have no own primary key, but a **partial key** in combination with the foreign key of the strong entity type.

*Example:* A "Room" exists only in the context of a "Building". Without a building, there is no room.

**Identifying relationship:**
The relationship that connects a weak entity type with its strong entity type. The primary key of the strong entity type becomes part of the primary key of the weak entity type.

---

\`\`\`sql
-- Strong: Building
CREATE TABLE buildings (
  building_id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

-- Weak: Room (dependent on Building)
CREATE TABLE rooms (
  building_id INTEGER,
  room_number INTEGER,
  size DECIMAL(5,2),
  PRIMARY KEY (building_id, room_number),
  FOREIGN KEY (building_id) REFERENCES buildings(building_id)
);
\`\`\`

---

**Attribute types:**

| Type | Description | Example |
|-----|-------------|----------|
| Simple | A single value | Age, Price |
| Composite | Multiple components | Address (Street, ZIP, City) |
| Multi-valued | Multiple values per entity | Phone numbers |
| Derived | Calculable from other attributes | Age (from date of birth) |
| Key | Uniquely identifies the entity | Matriculation number |`,
            keyTakeaways: [
              "Regular entity types exist independently",
              "Weak entity types depend on a strong entity type",
              "Identifying relationship connects weak with strong entity type",
              "5 attribute types: simple, composite, multi-valued, derived, key",
            ],
          },
        ],
      },
      {
        id: "beziehungsarten",
        title: "Relationship Types in ERM",
        estimatedMinutes: 12,
        sections: [
          {
            id: "1-zu-1",
            title: "1:1 Relationship",
            sectionType: "theory",
            content: `**1:1 Relationship (One-to-One)**
Each entity on one side is associated with exactly one entity on the other side.

*Examples:*
- A customer has exactly one ID card
- An employee has exactly one office
- A user has exactly one profile

**Implementation in the relational model:**
\`\`\`sql
-- Option 1: Foreign key in one table
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE id_cards (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER UNIQUE,  -- UNIQUE enforces 1:1
  number VARCHAR(50),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Option 2: Merge both tables (if it's the same entity)
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  id_card_number VARCHAR(50) UNIQUE
);
\`\`\`

---

**When 1:1 makes sense:**
- When a table would have very many columns (horizontal partitioning)
- When certain attributes are rarely filled (NULL savings)
- When different access rights should apply`,
            keyTakeaways: [
              "1:1: Each entity is associated with exactly one other",
              "UNIQUE constraint on the foreign key enforces 1:1",
              "1:1 relationships can often be merged into one table",
              "Useful for horizontal partitioning or NULL savings",
            ],
          },
          {
            id: "1-zu-n",
            title: "1:n Relationship",
            sectionType: "example",
            content: `**1:n Relationship (One-to-Many)**
One entity on one side is associated with multiple entities on the other side.

*Examples:*
- A customer has many orders
- A department has many employees
- An author has many books

**Implementation in the relational model:**
The primary key of the "1-side" is added as a foreign key on the "n-side".

---

\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,  -- Foreign key on the n-side
  date DATE,
  amount DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

---

**Important:** The foreign key goes **always on the n-side**! On the 1-side (Customer) there is no reference to Orders.`,
            keyTakeaways: [
              "1:n: One entity has many associated entities",
              "Foreign key always goes on the n-side",
              "Most common relationship type in practice",
            ],
          },
          {
            id: "n-zu-m",
            title: "n:m Relationship",
            sectionType: "example",
            content: `**n:m Relationship (Many-to-Many)**
Multiple entities on one side are associated with multiple entities on the other side.

*Examples:*
- Students attend many courses, courses have many students
- Products belong to many categories, categories have many products
- Authors write many books, books have many authors

**Implementation in the relational model:**
A **junction table** (association table) is created that contains the primary keys of both entities as foreign keys.

---

\`\`\`sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

-- Junction table
CREATE TABLE enrollments (
  student_id INTEGER,
  course_id INTEGER,
  semester VARCHAR(20),
  grade DECIMAL(3,1),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
\`\`\`

---

**The junction table has:**
- Two foreign keys (one per entity)
- A composite primary key from both foreign keys
- Optionally: Additional attributes of the relationship (e.g., Grade, Semester)

**Common mistake:** Not resolving n:m relationships and instead storing lists in a cell (violates 1NF!).`,
            keyTakeaways: [
              "n:m: Both sides have many associated entities",
              "Create a junction table with two foreign keys",
              "Composite primary key from both FKs",
              "Relationship attributes (Grade, Semester) go in the junction table",
            ],
          },
        ],
      },
      {
        id: "kardinalitaeten-bestimmen",
        title: "Determining Cardinalities",
        estimatedMinutes: 10,
        sections: [
          {
            id: "kardinalitaet-methodik",
            title: "How to Determine Cardinalities",
            sectionType: "theory",
            content: `**Cardinalities** describe how many entities on one side can be linked to how many on the other side.

**Method for determining cardinality:**

Ask two questions:
1. "Can one A be associated with multiple B?" → Answer for the B-side
2. "Can one B be associated with multiple A?" → Answer for the A-side

**Example: Customer — orders — Product**
- Can one customer order multiple products? → Yes → n on the Product side
- Can one product be ordered by multiple customers? → Yes → m on the Customer side
- Result: **n:m relationship**

**Example: Department — has — Employee**
- Can one department have multiple employees? → Yes → n on the Employee side
- Can one employee be in multiple departments? → No (in this model) → 1 on the Department side
- Result: **1:n relationship**

**Min/Max Notation (Chen):**
Instead of just 1, n, m, you can also specify Min/Max cardinalities:
- (1,1) = exactly one
- (0,1) = zero or one
- (1,n) = at least one, any number
- (0,n) = any number

**Example with Min/Max:**
Customer (1,n) — orders — (0,n) Order
- A customer has at least 1 to any number of orders
- An order belongs to exactly 0 or 1 customers`,
            keyTakeaways: [
              "Ask two questions: 'Can one A have multiple B?' and vice versa",
              "1:1, 1:n, n:m are the three basic types",
              "Min/Max notation for more precise cardinalities",
              "Cardinalities determine the table structure in the RM",
            ],
          },
        ],
      },
      {
        id: "erm-zu-sql",
        title: "ERM to SQL: Transformation Step by Step",
        estimatedMinutes: 12,
        sections: [
          {
            id: "erm-zu-sql-regeln",
            title: "Transformation Rules",
            sectionType: "theory",
            content: `**Rules for transforming from ERM to the relational model:**

**1. Entity type → Table**
Each entity type becomes a table. Attributes become columns.

**2. 1:1 relationship → Foreign key (one side)**
The primary key of one table is added as a foreign key to the other table. UNIQUE constraint on the foreign key ensures the 1:1 relationship.

**3. 1:n relationship → Foreign key on the n-side**
The primary key of the "1-side" is added as a foreign key to the table on the "n-side".

**4. n:m relationship → Junction table**
A new table is created that contains the primary keys of both entities as foreign keys.

**5. Composite attributes → Split**
A composite attribute like "Address" is split into individual columns: street, zip, city.

**6. Multi-valued attributes → Separate table**
A multi-valued attribute like "Phone numbers" is moved to a separate table.

**7. Derived attributes → Do not store**
Derived attributes (e.g., age from date of birth) are not stored but calculated when needed.`,
            keyTakeaways: [
              "Entity type → Table",
              "1:1 → Foreign key with UNIQUE",
              "1:n → Foreign key on the n-side",
              "n:m → Junction table",
              "Composite attributes → split",
              "Multi-valued attributes → separate table",
            ],
          },
          {
            id: "erm-zu-sql-beispiel",
            title: "Complete Example: Online Shop",
            sectionType: "practice",
            content: `**ERM for an online shop:**

Entities: Customer, Product, Order, Category
Relationships:
- Customer (1) — orders — (n) Order
- Order (n) — contains — (m) Product
- Product (n) — belongs to — (1) Category

**Step 1: Entities to tables**
\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category_id INTEGER
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);
\`\`\`

---

**Step 2: 1:n relationship (Customer → Order)**
\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

---

**Step 3: n:m relationship (Order ↔ Product)**
\`\`\`sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
\`\`\`

---

**Step 4: 1:n relationship (Category → Product)**
\`\`\`sql
-- Add foreign key to products table
ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES categories(id);
\`\`\`

---

**Done!** The ERM has been transformed into a complete SQL schema.`,
            keyTakeaways: [
              "ERM transformation: Entities → Tables, Relationships → Foreign keys",
              "1:n: FK on the n-side",
              "n:m: Junction table with two FKs",
              "Always define constraints (NOT NULL, CHECK, UNIQUE)",
            ],
          },
        ],
      },
      {
        id: "schwache-entitaeten",
        title: "Weak Entities and Identifying Relationships",
        estimatedMinutes: 10,
        sections: [
          {
            id: "schwache-entitaeten-detail",
            title: "Weak Entity Types",
            sectionType: "theory",
            content: `A **weak entity type** has no own primary key and depends on a **strong entity type** (owner).

**Properties of weak entity types:**
1. Existence-dependent: Without the owner, the weak entity cannot exist
2. No own primary key: Only unique in combination with the owner
3. Connected through an **identifying relationship**

**Example: Building and Room**
- Building (strong): Has its own primary key (building_id)
- Room (weak): Has only a partial key (room_number)
- The primary key of Room is (building_id, room_number)

---

\`\`\`sql
CREATE TABLE buildings (
  building_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200)
);

CREATE TABLE rooms (
  building_id INTEGER NOT NULL,
  room_number INTEGER NOT NULL,
  size DECIMAL(5,2),
  PRIMARY KEY (building_id, room_number),
  FOREIGN KEY (building_id) REFERENCES buildings(building_id)
    ON DELETE CASCADE  -- Room is deleted with building
);
\`\`\`

---

**More examples:**
- Invoice (strong) → Invoice item (weak)
- Department (strong) → Project (weak, if project number is only unique per department)
- Customer (strong) → Order (weak, if order number is only unique per customer)

**In ERM:** Weak entity types are represented with a double rectangle, the identifying relationship with a double diamond.`,
            keyTakeaways: [
              "Weak entity types have no own primary key",
              "They are existence-dependent on a strong entity type (owner)",
              "Primary key = Owner-PK + partial key",
              "ON DELETE CASCADE ensures existence dependency",
            ],
          },
        ],
      },
      {
        id: "erm-erweitert",
        title: "Advanced ERM Concepts",
        estimatedMinutes: 12,
        sections: [
          {
            id: "isa-hierarchie",
            title: "ISA Hierarchies (Inheritance)",
            sectionType: "theory",
            content: `**ISA hierarchies** ("is a") model inheritance in ERM — similar to class inheritance in object-oriented programming.

**Example:** Employee is the superclass, Salaried and Freelancer are subclasses.

**Three implementation strategies in the relational model:**

**1. One table for all (Single Table Inheritance):**
\`\`\`sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('salaried', 'freelancer')),
  salary DECIMAL(10,2),       -- only for Salaried
  hourly_rate DECIMAL(10,2),  -- only for Freelancer
  vacation_days INTEGER       -- only for Salaried
);
\`\`\`
Advantage: Simple queries, no JOIN
Disadvantage: Many NULL values, no NOT NULL constraints for subclass attributes

**2. One table per subclass (Class Table Inheritance):**
\`\`\`sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL
);

CREATE TABLE salaried (
  employee_id INTEGER PRIMARY KEY REFERENCES employees(id),
  salary DECIMAL(10,2) NOT NULL,
  vacation_days INTEGER NOT NULL
);

CREATE TABLE freelancer (
  employee_id INTEGER PRIMARY KEY REFERENCES employees(id),
  hourly_rate DECIMAL(10,2) NOT NULL
);
\`\`\`
Advantage: No NULL values, NOT NULL constraints possible
Disadvantage: JOINs for complete data

**3. Only subclass tables (Concrete Table Inheritance):**
\`\`\`sql
CREATE TABLE salaried (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  vacation_days INTEGER NOT NULL
);

CREATE TABLE freelancer (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL
);
\`\`\`
Advantage: No JOINs, no NULL values
Disadvantage: Common queries (all employees) require UNION`,
            keyTakeaways: [
              "ISA hierarchies model inheritance in ERM",
              "Single Table: One table, many NULL values",
              "Class Table: Superclass and subclass tables, JOINs needed",
              "Concrete Table: Only subclass tables, UNION for common queries",
            ],
          },
          {
            id: "erm-aggregation",
            title: "Aggregation and Recursion in ERM",
            sectionType: "theory",
            content: `**Aggregation** models relationships between relationships and entities.

*Example:* A project consists of multiple work packages. An employee works on a work package. The "works on" relationship refers to the work package, not the project directly.

In ERM, aggregation is represented as a rectangle around the aggregated relationship.

**Recursive relationships:**
An entity is in a relationship with itself.

*Examples:*
- Employee → Supervisor (hierarchy)
- Part → consists of parts (bill of materials)
- Friend → is friends with friend (network)

---

\`\`\`sql
-- Recursive relationship: Employee with supervisor
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  supervisor_id INTEGER,
  FOREIGN KEY (supervisor_id) REFERENCES employees(id)
);

-- Bill of materials: Part consists of other parts
CREATE TABLE parts (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE bill_of_materials (
  parent_part_id INTEGER NOT NULL,
  child_part_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (parent_part_id, child_part_id),
  FOREIGN KEY (parent_part_id) REFERENCES parts(id),
  FOREIGN KEY (child_part_id) REFERENCES parts(id)
);
\`\`\`

---

**Ternary relationships:**
Relationships between three entities.

*Example:* An instructor teaches a subject in a specific semester.
\`\`\`sql
CREATE TABLE teaches (
  instructor_id INTEGER,
  subject_id INTEGER,
  semester_id INTEGER,
  PRIMARY KEY (instructor_id, subject_id, semester_id),
  FOREIGN KEY (instructor_id) REFERENCES instructors(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (semester_id) REFERENCES semesters(id)
);
\`\`\``,
            keyTakeaways: [
              "Aggregation: Relationships between relationships and entities",
              "Recursive relationships: Entity references itself",
              "Ternary relationships: Three entities in one relationship",
              "Bill of materials is a classic example of recursion",
            ],
          },
        ],
      },
      {
        id: "erm-fehler",
        title: "Common ERM Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "erm-fehler-liste",
            title: "The Most Common ERM Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: Not resolving n:m relationships**
n:m relationships MUST be resolved in the relational model through a junction table. Lists in a cell violate 1NF.

**Mistake 2: Attributes on the wrong entity**
"Price" belongs to the product, not the order. "Quantity" belongs to the order item, not the product.

**Mistake 3: Redundant attributes**
"Customer name" in the order table is redundant — it belongs in the customer table and is accessed via JOIN.

**Mistake 4: Incorrectly determining cardinalities**
1:n is often modeled as n:m or vice versa. Always ask both questions: "Can one A have multiple B?" and vice versa.

**Mistake 5: Overlooking weak entities**
Room number is only unique within a building — the foreign key to the building MUST be part of the primary key.

**Mistake 6: Forgetting relationship attributes**
In n:m relationships, attributes of the relationship (e.g., "Grade" for Student↔Course) belong in the junction table, not in one of the entity tables.

**Mistake 7: Incorrectly implementing ISA hierarchies**
Inheritance must be explicitly modeled — either as one table with a type column or as separate tables with foreign keys.

**Mistake 8: Ignoring identifying relationships**
If a weak entity cannot exist without its owner, ON DELETE CASCADE must be set.`,
            keyTakeaways: [
              "ALWAYS resolve n:m relationships through a junction table",
              "Place attributes on the correct entity",
              "Determine cardinalities by asking two questions",
              "Relationship attributes belong in the junction table",
              "Don't forget weak entities and ON DELETE CASCADE",
            ],
          },
        ],
      },
      {
        id: "erm-praxisbeispiel",
        title: "ERM Practice Example: Online Shop",
        estimatedMinutes: 15,
        sections: [
          {
            id: "erm-praxis-anforderung",
            title: "Requirements Analysis",
            sectionType: "theory",
            content: `**Scenario:** An online shop is to be modeled.

**Requirements:**
1. Customers can place multiple orders
2. Each order contains multiple products with quantity and price
3. Products belong to exactly one category
4. Categories can contain multiple products
5. Customers have name, email, and address (street, ZIP, city)
6. Products have name, price, and description
7. Orders have date and status

**Step 1: Identify entities**
- Customer (id, name, email, street, zip, city)
- Product (id, name, price, description)
- Category (id, name)
- Order (id, date, status)

**Step 2: Identify relationships**
- Customer → Order: 1:n (one customer, many orders)
- Order → Product: n:m (one order, many products; one product, many orders)
- Category → Product: 1:n (one category, many products)

**Step 3: Note cardinalities**
- Customer (1) — orders — (n) Order
- Order (n) — contains — (m) Product
- Category (1) — belongs to — (n) Product`,
            keyTakeaways: [
              "Requirements analysis: What needs to be stored?",
              "Identify entities: Main objects of the domain",
              "Identify relationships: How are entities connected?",
              "Determine cardinalities: 1:1, 1:n, or n:m?",
            ],
          },
          {
            id: "erm-praxis-sql",
            title: "From ERM to SQL Schema",
            sectionType: "practice",
            content: `The final step of database modeling is translating the ERM into an executable SQL schema. Each entity becomes a table, each attribute becomes a column, and each relationship is mapped through foreign keys or junction tables. Composite attributes like "Address" are split into individual columns (Street, ZIP, City). Relationship attributes like "Quantity" or "Unit Price" go in the junction table, not in the entity tables.

**Step 4: Create SQL schema**

\`\`\`sql
-- Categories
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);

-- Customers (composite attribute Address split)
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  street VARCHAR(200),
  zip VARCHAR(10),
  city VARCHAR(100)
);

-- Products (1:n with Category)
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders (1:n with Customer)
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'processing', 'shipped', 'cancelled')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order items (n:m junction table)
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
\`\`\`

---

**Step 5: Verify schema**
- ✓ All entities implemented as tables
- ✓ 1:n relationships with foreign keys on the n-side
- ✓ n:m relationship resolved through junction table
- ✓ Composite attribute (Address) split
- ✓ Relationship attributes (Quantity, Unit Price) in junction table
- ✓ CHECK constraints for value ranges
- ✓ NOT NULL for required fields`,
            keyTakeaways: [
              "Entities → Tables, Relationships → Foreign keys",
              "Split composite attributes into individual columns",
              "Relationship attributes go in the junction table",
              "Don't forget CHECK and NOT NULL constraints",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 4: SQL Basics
  // ═══════════════════════════════════════════════════════════════
  {
    id: "sql-grundlagen",
    title: "SQL Basics",
    description: "SELECT, WHERE, ORDER BY, LIMIT, aggregation, and the most important SQL clauses.",
    icon: "code",
    difficulty: "beginner",
    articles: [
      {
        id: "select-where",
        title: "SELECT and WHERE",
        estimatedMinutes: 10,
        sections: [
          {
            id: "select-syntax",
            title: "SELECT Syntax",
            sectionType: "theory",
            content: `**SELECT** is the most fundamental SQL statement and the entry point for every database query. With SELECT, you retrieve data from one or more tables and can filter, sort, and aggregate it. SQL beginners start here — and experienced database developers also use SELECT daily.

The basic structure of a SELECT statement follows a fixed pattern that resembles a natural sentence: "Select these columns from this table, where this condition is met, sorted by this column."

---

\`\`\`sql
SELECT column1, column2, ...
FROM table
WHERE condition;
\`\`\`

---

Each clause has a specific task: \`SELECT\` determines which columns appear in the result. \`FROM\` specifies the table from which the data comes. \`WHERE\` filters rows based on conditions. Beyond that, there are additional clauses that you will learn over time.

**Important clauses at a glance:**
- \`SELECT *\` — Query all columns (useful for exploring, but avoid in production code)
- \`DISTINCT\` — Remove duplicate rows
- \`WHERE\` — Filter rows by conditions
- \`ORDER BY\` — Sort results (ASC = ascending, DESC = descending)
- \`LIMIT n\` — Return only the first n rows

**WHERE Operators — your filtering toolkit:**

The WHERE clause is the heart of every query. You can filter rows with various operators — from simple comparisons to patterns and ranges:

| Operator | Meaning | Example |
|----------|-----------|----------|
| = | Equal | \`WHERE name = 'Anna'\` |
| != or <> | Not equal | \`WHERE status != 'inactive'\` |
| >, <, >=, <= | Comparison | \`WHERE price > 100\` |
| BETWEEN | Range | \`WHERE price BETWEEN 10 AND 50\` |
| IN | Set | \`WHERE category IN ('A', 'B')\` |
| LIKE | Pattern | \`WHERE name LIKE 'A%'\` |
| IS NULL | Null check | \`WHERE email IS NULL\` |
| AND, OR, NOT | Logic | \`WHERE price > 100 AND category = 'A'\` |

An important note: \`WHERE\` is applied **before** grouping (GROUP BY). If you want to filter groups, you need \`HAVING\` — more on that in the article on aggregate functions.`,
            keyTakeaways: [
              "SELECT is the most fundamental SQL query",
              "WHERE filters rows with various operators",
              "DISTINCT removes duplicates",
              "LIKE with % (any characters) and _ (exactly one character)",
            ],
          },
          {
            id: "select-beispiele",
            title: "SELECT Examples in Practice",
            sectionType: "example",
            content: `Let's deepen the SELECT basics with concrete examples. We're working with a products table.

**Simple queries:**

---

\`\`\`sql
-- All columns of all products
SELECT * FROM products;

-- Only name and price
SELECT name, price FROM products;

-- Distinct categories
SELECT DISTINCT category FROM products;
\`\`\`

---

**WHERE filters:**

---

\`\`\`sql
-- Products more expensive than 50
SELECT name, price FROM products WHERE price > 50;

-- Products in specific categories
SELECT name, category FROM products
WHERE category IN ('Electronics', 'Book');

-- Products whose name starts with 'A'
SELECT name FROM products WHERE name LIKE 'A%';

-- Products without a price
SELECT name FROM products WHERE price IS NULL;

-- Combined conditions
SELECT name, price, category FROM products
WHERE price BETWEEN 10 AND 50
  AND category = 'Electronics'
  AND name IS NOT NULL;
\`\`\`

---

**Sorting and limiting:**

---

\`\`\`sql
-- Products sorted by price descending
SELECT name, price FROM products ORDER BY price DESC;

-- The 5 most expensive products
SELECT name, price FROM products ORDER BY price DESC LIMIT 5;

-- Products sorted by category, then by price
SELECT name, category, price FROM products
ORDER BY category ASC, price DESC;
\`\`\`

---

**Important notes:**
- \`SELECT *\` is convenient for testing, but in practice you should always explicitly specify the needed columns
- \`LIKE\` with a leading \`%\` (\`%text\`) cannot use an index — avoid it on large tables
- \`ORDER BY\` without \`LIMIT\` sorts the entire table — slow with large datasets
- \`DISTINCT\` requires sorting — expensive with many rows`,
            keyTakeaways: [
              "Avoid SELECT * — explicitly specify needed columns instead",
              "LIKE with leading % cannot use an index",
              "Use ORDER BY + LIMIT for Top-N queries",
              "DISTINCT is expensive — only when really needed",
            ],
          },
        ],
      },
      {
        id: "aggregation-groupby",
        title: "Aggregate Functions and GROUP BY",
        estimatedMinutes: 12,
        sections: [
          {
            id: "aggregatfunktionen",
            title: "Aggregate Functions",
            sectionType: "theory",
            content: `**Aggregate functions** are the tool for calculating a single summary value from many rows. Instead of looking at each row individually, aggregate functions condense the data into a single metric — how many rows are there, what is the average, what is the maximum value? These functions are indispensable for reports, statistics, and analyses of all kinds.

Imagine you have a table with 10,000 orders and want to know: What is the total revenue? How many orders are there? What is the average order value? Without aggregate functions, you would have to go through all rows individually — with aggregate functions, a single query is enough.

**The five aggregate functions at a glance:**

| Function | Meaning | Example |
|----------|-----------|----------|
| COUNT() | Number of rows | \`COUNT(*)\` — all rows |
| SUM() | Sum | \`SUM(price)\` — total price |
| AVG() | Average | \`AVG(price)\` — average price |
| MIN() | Minimum | \`MIN(price)\` — cheapest product |
| MAX() | Maximum | \`MAX(price)\` — most expensive product |

**Important nuances that are often overlooked:**
- \`COUNT(*)\` counts **all** rows, including rows with NULL values — it's the simplest way to get the total number of rows
- \`COUNT(column)\` counts only rows where the specified column is **not NULL** — useful for finding out how many rows have a value
- \`COUNT(DISTINCT column)\` counts only **unique** values — useful for determining the number of different categories
- \`SUM()\`, \`AVG()\`, \`MIN()\`, and \`MAX()\` **ignore NULL values** — they are simply skipped during calculation
- \`AVG()\` divides the sum by the number of **non-NULL values**, not by all rows — a common pitfall`,
            keyTakeaways: [
              "COUNT, SUM, AVG, MIN, MAX are the five aggregate functions",
              "COUNT(*) counts all rows, COUNT(column) ignores NULL",
              "Aggregate functions return a single value",
              "NULL values are ignored by SUM, AVG, MIN, MAX",
            ],
          },
          {
            id: "group-by",
            title: "GROUP BY and HAVING in Practice",
            sectionType: "example",
            content: `**GROUP BY** groups rows with the same values in the specified columns. Aggregate functions are then calculated per group.

**Simple GROUP BY:**

---

\`\`\`sql
-- Number of products per category
SELECT category, COUNT(*) AS count
FROM products
GROUP BY category;

-- Average price per category
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category;

-- Revenue per customer
SELECT customer_id, SUM(amount) AS total_revenue
FROM orders
GROUP BY customer_id;
\`\`\`

---

**GROUP BY with multiple columns:**

---

\`\`\`sql
-- Number of products per category and status
SELECT category, status, COUNT(*) AS count
FROM products
GROUP BY category, status;
\`\`\`

---

**HAVING — Filtering groups:**

---

\`\`\`sql
-- Only categories with more than 5 products
SELECT category, COUNT(*) AS count
FROM products
GROUP BY category
HAVING COUNT(*) > 5;

-- Categories with average price over 100
SELECT category, AVG(price) AS average
FROM products
GROUP BY category
HAVING AVG(price) > 100;
\`\`\`

---

**Important rule:** In the SELECT clause after GROUP BY, only columns that are either in GROUP BY or wrapped in an aggregate function are allowed.

**Incorrect:** \`SELECT category, name, COUNT(*) FROM products GROUP BY category;\` — \`name\` is not in GROUP BY and not aggregated.

**Correct:** \`SELECT category, COUNT(*) FROM products GROUP BY category;\`

**Execution order:**
1. FROM — Select table
2. WHERE — Filter rows (before grouping)
3. GROUP BY — Group
4. HAVING — Filter groups (after grouping)
5. SELECT — Select columns
6. ORDER BY — Sort
7. LIMIT — Limit rows`,
            keyTakeaways: [
              "GROUP BY combines rows with the same values",
              "HAVING filters groups (after aggregation), WHERE filters rows (before aggregation)",
              "Only GROUP BY columns and aggregate functions allowed in SELECT",
              "Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
            ],
          },
        ],
      },
      {
        id: "null-werte",
        title: "NULL Values and Three-Valued Logic",
        estimatedMinutes: 12,
        sections: [
          {
            id: "null-grundlagen",
            title: "What is NULL?",
            sectionType: "theory",
            content: `**NULL** in SQL means "unknown" or "not present" — it is **not** a value, but the absence of a value.

**Three-valued logic:**
SQL uses three-valued logic with TRUE, FALSE, and UNKNOWN (NULL):

| A | B | A AND B | A OR B |
|---|---|---------|--------|
| TRUE | TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE | TRUE |
| TRUE | NULL | NULL | TRUE |
| FALSE | NULL | FALSE | NULL |
| NULL | NULL | NULL | NULL |

**Important rules:**
- \`NULL = NULL\` evaluates to **NULL** (not TRUE!)
- \`NULL <> 1\` evaluates to **NULL** (not TRUE!)
- \`NOT NULL\` evaluates to **NULL** (not TRUE!)
- Only \`IS NULL\` and \`IS NOT NULL\` return TRUE or FALSE`,
            keyTakeaways: [
              "NULL means 'unknown' or 'not present'",
              "NULL = NULL evaluates to NULL, not TRUE",
              "SQL uses three-valued logic (TRUE, FALSE, NULL)",
              "Always use IS NULL / IS NOT NULL instead of = NULL / <> NULL",
            ],
          },
          {
            id: "null-fallen",
            title: "NULL Pitfalls in Practice",
            sectionType: "example",
            content: `Here are the most common NULL pitfalls and how to avoid them:

**Pitfall 1: NULL comparisons with =**

---

\`\`\`sql
-- WRONG: Returns NO rows!
SELECT * FROM customers WHERE phone = NULL;

-- CORRECT:
SELECT * FROM customers WHERE phone IS NULL;
\`\`\`

---

Why? \`NULL = NULL\` evaluates to NULL (unknown), not TRUE. Only \`IS NULL\` and \`IS NOT NULL\` work reliably.

**Pitfall 2: NULL in aggregate functions**

---

\`\`\`sql
-- AVG ignores NULL values!
SELECT AVG(price) FROM products;  -- NULL values are NOT counted

-- If NULL should be treated as 0:
SELECT AVG(COALESCE(price, 0)) FROM products;
\`\`\`

---

**Pitfall 3: NULL in calculations**

---

\`\`\`sql
-- Any calculation with NULL results in NULL!
SELECT 100 + NULL;   -- Result: NULL
SELECT NULL * 2;     -- Result: NULL
SELECT NULL = NULL;  -- Result: NULL
\`\`\`

---

**Pitfall 4: NULL in NOT IN**

---

\`\`\`sql
-- WRONG: If the subquery contains NULL, NOT IN returns NO rows!
SELECT * FROM products
WHERE category NOT IN (SELECT category FROM products WHERE price > 100);
-- If a category is NULL, NOT IN evaluates to NULL for ALL rows!

-- CORRECT: Use NOT EXISTS instead of NOT IN
SELECT * FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM products p2
  WHERE p2.category = p.category AND p2.price > 100
);
\`\`\`

---

**Pitfall 5: COALESCE and IFNULL**

---

\`\`\`sql
-- COALESCE: Return the first non-NULL value
SELECT COALESCE(phone, email, 'No contact info') FROM customers;

-- IFNULL (SQLite-specific): Replace NULL with default value
SELECT IFNULL(price, 0) FROM products;

-- NULLIF: Generate NULL when two values are equal
SELECT NULLIF(price, 0) FROM products;  -- 0 becomes NULL
\`\`\`

---

**Summary of NULL rules:**
- Any arithmetic with NULL results in NULL
- Any comparison with NULL results in NULL (except IS NULL / IS NOT NULL)
- Aggregate functions (except COUNT(*)) ignore NULL
- NOT IN with NULL in the subquery returns no results
- COALESCE is the standard way to replace NULL values`,
            keyTakeaways: [
              "NULL = NULL evaluates to NULL — always use IS NULL / IS NOT NULL",
              "Arithmetic with NULL always results in NULL",
              "NOT IN with NULL in the subquery returns no results",
              "COALESCE() replaces NULL with a default value",
              "Aggregate functions ignore NULL (except COUNT(*))",
            ],
          },
        ],
      },
      {
        id: "sortieren-begrenzen",
        title: "Sorting and Limiting: ORDER BY, LIMIT, OFFSET",
        estimatedMinutes: 10,
        sections: [
          {
            id: "order-by",
            title: "ORDER BY — Sorting Results",
            sectionType: "theory",
            content: `**ORDER BY** is the clause that gives a query its order. Without ORDER BY, the order of results is **undefined** — the database can return rows in any order. This is one of the most common mistakes SQL beginners make: they assume results are automatically sorted by the primary key, but this is not guaranteed.

If you need a specific order — such as the most expensive products first or customers alphabetically — you must specify ORDER BY explicitly. Only then do you get a reliable, reproducible sort order.

---

\`\`\`sql
-- Ascending (default)
SELECT name, price FROM products ORDER BY price ASC;

-- Descending
SELECT name, price FROM products ORDER BY price DESC;

-- Sort by multiple columns
SELECT name, category, price FROM products
ORDER BY category ASC, price DESC;
\`\`\`

---

With multiple sort columns, the first column has the highest priority. Only when two rows have the same value in the first column does the second column decide. Imagine sorting a list of products first by category and then within each category by price descending — that's exactly what the above query does.

**Important rules you need to know:**
- \`ASC\` (ascending) is the default and can be omitted
- \`DESC\` (descending) must always be specified explicitly
- NULL values are sorted as the "smallest" values in SQLite — they appear at the beginning with ASC and at the end with DESC
- You can sort by column numbers (\`ORDER BY 2\`), but column names or aliases are more readable and robust

**Sorting by calculated values:**
Often you want to sort by a calculated value — such as the gross price or by an alias. This works by using the alias in the ORDER BY clause:

---

\`\`\`sql
-- Sort by calculated value
SELECT name, price * 1.19 AS gross FROM products
ORDER BY gross DESC;

-- Or with column number (less readable)
SELECT name, price * 1.19 AS gross FROM products
ORDER BY 2 DESC;
\`\`\`

---

**Performance note:** ORDER BY must sort the entire result set. With millions of rows and no index on the sort column, this can be very slow. Combine ORDER BY with LIMIT to limit the work.`,
            keyTakeaways: [
              "ORDER BY sorts results (ASC = ascending, DESC = descending)",
              "Multiple columns: First column has priority",
              "NULL values are sorted at the beginning in SQLite (with ASC)",
              "Sorting by alias or column number is possible",
            ],
          },
          {
            id: "limit-offset",
            title: "LIMIT and OFFSET — Limiting Results",
            sectionType: "example",
            content: `**LIMIT** limits the number of rows returned. **OFFSET** skips a specified number of rows. Together, they enable pagination — browsing through large result sets page by page.

Why is this important? Imagine a search engine displaying all 10 million results at once. That would be slow, memory-intensive, and unusable for the user. LIMIT and OFFSET solve this problem by delivering only the rows currently needed.

---

\`\`\`sql
-- The 10 most expensive products
SELECT name, price FROM products
ORDER BY price DESC LIMIT 10;

-- Products 11-20 (Pagination: page 2)
SELECT name, price FROM products
ORDER BY price DESC LIMIT 10 OFFSET 10;
\`\`\`

---

**Pagination — Display page by page:**
Pagination is one of the most common patterns in web applications. Each page shows a fixed number of entries, and OFFSET calculates the starting point:

---

\`\`\`sql
-- Page 1 (rows 1-10)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;

-- Page 2 (rows 11-20)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;

-- Page n (rows (n-1)*10+1 to n*10)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET (page_number - 1) * 10;
\`\`\`

---

**Top-N queries — Find the best entries:**
One of the most useful applications of LIMIT is the Top-N query: "Give me the 3 customers with the highest revenue" or "The 5 newest articles". Combined with ORDER BY, LIMIT delivers exactly the desired number of top results:

---

\`\`\`sql
-- The 3 customers with the highest revenue
SELECT c.name, SUM(o.amount) AS revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 3;
\`\`\`

---

**Important:** LIMIT without ORDER BY returns **arbitrary** rows — the order is not deterministic. Always use ORDER BY with LIMIT!`,
            keyTakeaways: [
              "LIMIT n: Return only the first n rows",
              "OFFSET m: Skip the first m rows",
              "LIMIT + OFFSET = Pagination",
              "ALWAYS use ORDER BY with LIMIT — otherwise arbitrary rows",
            ],
          },
        ],
      },
      {
        id: "logische-operatoren",
        title: "Logical Operators: AND, OR, NOT, IN, BETWEEN, LIKE",
        estimatedMinutes: 10,
        sections: [
          {
            id: "logische-ops",
            title: "Logical Operators in WHERE",
            sectionType: "theory",
            content: `**Logical operators** connect conditions in the WHERE clause and significantly expand filtering capabilities. While simple comparisons like \`=\` or \`>\` test only one condition, AND, OR, and NOT allow combining multiple conditions into complex filter expressions. There are also practical operators like IN, BETWEEN, and LIKE that simplify common filter patterns.

**AND — All conditions must be met:**
AND is strict: Both conditions must be true for the row to be included in the result. Imagine you're looking for electronic products under 50 euros — both criteria must be met simultaneously.

---

\`\`\`sql
SELECT * FROM products WHERE price > 50 AND category = 'Electronics';
\`\`\`

---

**OR — At least one condition must be met:**
OR is generous: It's enough if one of the conditions is true. You're looking for products that are either electronic or a book — both don't have to be true simultaneously.

---

\`\`\`sql
SELECT * FROM products WHERE category = 'Electronics' OR category = 'Book';
\`\`\`

---

**NOT — Negate a condition:**
NOT negates a condition. Instead of listing all categories except Electronics, you simply write NOT.

---

\`\`\`sql
SELECT * FROM products WHERE NOT category = 'Electronics';
\`\`\`

---

**IN — Check against a list of values:**
IN is the shorthand for multiple OR conditions. Instead of \`category = 'A' OR category = 'B' OR category = 'C'\`, you simply write \`category IN ('A', 'B', 'C')\`. It's shorter, more readable, and less error-prone.

---

\`\`\`sql
SELECT * FROM products WHERE category IN ('Electronics', 'Book', 'Clothing');
\`\`\`

---

**BETWEEN — Range check (inclusive):**
BETWEEN checks whether a value is within a range — inclusive of the boundaries. \`price BETWEEN 10 AND 50\` is the same as \`price >= 10 AND price <= 50\`. Note: The boundaries are always inclusive!

---

\`\`\`sql
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
-- Equivalent to: price >= 10 AND price <= 50
\`\`\`

---

**LIKE — Pattern matching:**
LIKE enables searching for patterns in strings. The wildcards are \`%\` (any number of characters) and \`_\` (exactly one character). LIKE is powerful, but with a leading \`%\` no index can be used — the search becomes slow.

---

\`\`\`sql
-- % = any number of characters
SELECT * FROM customers WHERE name LIKE 'A%';    -- starts with A
SELECT * FROM customers WHERE name LIKE '%er';   -- ends with er
SELECT * FROM customers WHERE name LIKE '%ann%'; -- contains ann

-- _ = exactly one character
SELECT * FROM customers WHERE name LIKE '_nna';  -- e.g., Anna
\`\`\`

---

**Operator precedence (highest first):**
Be careful when combining AND and OR! AND has higher precedence than OR. Without parentheses, this can lead to unexpected results:

1. NOT (highest precedence)
2. AND
3. OR (lowest precedence)

---

\`\`\`sql
-- Caution: AND has higher precedence than OR!
WHERE category = 'Electronics' OR category = 'Book' AND price > 50
-- Means: Electronics (all) OR (Book AND price > 50)

-- Intended: (Electronics OR Book) AND price > 50
WHERE (category = 'Electronics' OR category = 'Book') AND price > 50
\`\`\`

---

**Tip:** Always use parentheses when combining AND and OR — even if you're sure the precedence is correct. Parentheses make the code more readable and prevent errors.`,
            keyTakeaways: [
              "AND: All conditions must be met",
              "OR: At least one condition must be met",
              "IN: Check against a list of values (shorter than OR chain)",
              "BETWEEN: Range check (inclusive boundaries)",
              "LIKE: % = any characters, _ = exactly one character",
              "Use parentheses with AND/OR combinations!",
            ],
          },
        ],
      },
      {
        id: "distinct-aliase",
        title: "DISTINCT and Column Aliases",
        estimatedMinutes: 8,
        sections: [
          {
            id: "distinct",
            title: "DISTINCT — Removing Duplicate Rows",
            sectionType: "theory",
            content: `**DISTINCT** removes duplicate rows from the result set. In practice, it's common for a query to return many identical rows — for example, when you query all categories from a products table where each category appears multiple times. Without DISTINCT, you get each category as many times as there are products in it. With DISTINCT, you get each category exactly once.

---

\`\`\`sql
-- Without DISTINCT: All rows (including duplicates)
SELECT category FROM products;

-- With DISTINCT: Only unique values
SELECT DISTINCT category FROM products;

-- DISTINCT over multiple columns: Unique combinations
SELECT DISTINCT category, status FROM products;
\`\`\`

---

**Important properties of DISTINCT:**
- \`DISTINCT\` applies to the **entire row**, not individual columns — it only removes rows that are identical in all selected columns
- \`DISTINCT\` requires sorting the result set to detect duplicates → can be slow with large tables
- \`COUNT(DISTINCT column)\` counts unique values — a useful combination of aggregate function and DISTINCT
- \`SELECT DISTINCT *\` removes identical rows (rarely useful since primary keys make each row unique)

**DISTINCT vs. GROUP BY — when to use which?**
Both can remove duplicate rows, but they have different purposes:

---

\`\`\`sql
-- Both produce the same result:
SELECT DISTINCT category FROM products;
SELECT category FROM products GROUP BY category;
\`\`\`

---

DISTINCT is the simpler choice when you just want uniqueness. GROUP BY is more powerful because you can combine it with aggregate functions — like \`SELECT category, COUNT(*) FROM products GROUP BY category\`. As a rule of thumb: If you only need unique values, use DISTINCT. If you want to aggregate, use GROUP BY.

**Column aliases with AS — Making results readable:**
Aliases give columns or calculated values a meaningful name. This makes results more readable and enables referencing in ORDER BY:

---

\`\`\`sql
-- Rename column
SELECT name AS product_name FROM products;

-- Calculated column with alias
SELECT price * 1.19 AS gross_price FROM products;

-- Alias without AS (possible, but less readable)
SELECT name product_name FROM products;
\`\`\`

---

**Aliases in different clauses:**
- ORDER BY can use aliases: \`ORDER BY gross_price DESC\`
- WHERE cannot use aliases in SQLite (only in some DBMS)
- HAVING can use aliases in SQLite
- GROUP BY can use aliases in SQLite`,
            keyTakeaways: [
              "DISTINCT removes duplicate rows from the result set",
              "DISTINCT applies to the entire row",
              "DISTINCT is expensive — only when really needed",
              "AS creates column aliases for better readability",
            ],
          },
        ],
      },
      {
        id: "datentypen-sql",
        title: "SQL Data Types and Type Conversion",
        estimatedMinutes: 10,
        sections: [
          {
            id: "sql-datentypen",
            title: "Important SQL Data Types",
            sectionType: "theory",
            content: `**SQL data types** determine what kind of data can be stored in a column. They are the foundation for data integrity: An INTEGER field only accepts whole numbers, a VARCHAR(100) only strings up to 100 characters. Choosing the right data type prevents erroneous data and optimizes storage space and query speed.

Choosing the right data type is one of the most important design decisions when creating tables. A data type that's too small leads to data loss, one that's too large wastes storage and slows down queries.

**Numeric types — for numbers of any size:**

| Type | Description | Range |
|-----|-------------|---------|
| INTEGER / INT | Whole numbers | -2³¹ to 2³¹-1 |
| SMALLINT | Small integers | -32768 to 32767 |
| BIGINT | Large integers | -2⁶³ to 2⁶³-1 |
| DECIMAL(p,s) | Decimal number (p digits, s decimal places) | Precise |
| FLOAT / REAL | Floating point number | ~7 digits precision |
| DOUBLE | Double precision | ~15 digits precision |

**Especially important:** For monetary amounts, **always** use \`DECIMAL(10,2)\` and never FLOAT! FLOAT has rounding errors — 0.1 + 0.2 does not equal 0.3 in floating-point arithmetic. DECIMAL stores numbers exactly and is therefore indispensable for financial calculations.

**String types — for text:**

| Type | Description |
|-----|-------------|
| VARCHAR(n) | String with max n characters (variable length) |
| CHAR(n) | String with exactly n characters (fixed length) |
| TEXT | Unlimited string |

VARCHAR is the standard choice for most text columns — it stores only as many characters as actually used. CHAR is useful for values with always the same length like ZIP codes or country codes.

**Date/Time types — for temporal data:**

| Type | Description | Format |
|-----|-------------|--------|
| DATE | Date | '2024-01-15' |
| TIME | Time | '14:30:00' |
| DATETIME | Date and time | '2024-01-15 14:30:00' |
| TIMESTAMP | Timestamp | Unix time or ISO format |

**SQLite peculiarity:**
SQLite uses **dynamic typing** (Type Affinity). Each column has an "affinity" (TEXT, NUMERIC, INTEGER, REAL, BLOB), but SQLite does not strictly enforce the type. You can insert text into an INTEGER column — SQLite will automatically convert it or store it as text. This is convenient for flexibility, but can lead to subtle errors if you're not careful.`,
            keyTakeaways: [
              "INTEGER: Whole numbers, VARCHAR(n): Strings, DECIMAL(p,s): Decimal numbers",
              "DATE/DATETIME for date and time",
              "SQLite: dynamic typing — types are not strictly enforced",
              "DECIMAL instead of FLOAT for monetary amounts (precision!)",
            ],
          },
          {
            id: "cast-und-konvertierung",
            title: "Type Conversion with CAST",
            sectionType: "example",
            content: `**CAST** converts a value from one data type to another. In practice, it's common for data to not be in the desired format — for example, when a number is stored as text or a date as a string. CAST solves this problem by explicitly changing the type.

---

\`\`\`sql
-- Convert string to number
SELECT CAST('42' AS INTEGER);

-- Convert number to string
SELECT CAST(42 AS VARCHAR);

-- Format date as text
SELECT CAST(order_date AS VARCHAR) FROM orders;
\`\`\`

---

**Automatic type conversion (implicit):**
SQLite is lenient with types and converts automatically when it seems sensible. This is convenient, but can lead to unexpected results:

---

\`\`\`sql
-- SQLite converts automatically:
SELECT '42' + 8;        -- Result: 50 (Text → Integer)
SELECT 42 || ' pieces';  -- Result: '42 pieces' (Integer → Text)
\`\`\`

---

**Common conversions at a glance:**

| From | To | Syntax |
|-----|------|--------|
| Text → Number | INTEGER | \`CAST('42' AS INTEGER)\` |
| Number → Text | VARCHAR | \`CAST(42 AS VARCHAR)\` |
| Text → Date | DATE | \`CAST('2024-01-15' AS DATE)\` |
| Float → Integer | INTEGER | \`CAST(3.7 AS INTEGER)\` → 3 (truncated!) |

**Caution with conversions — these pitfalls await you:**
- \`CAST('abc' AS INTEGER)\` → 0 in SQLite (error in other DBMS!) — text that is not a number becomes 0
- \`CAST(3.7 AS INTEGER)\` → 3 — decimal places are truncated, not rounded
- \`CAST(NULL AS INTEGER)\` → NULL — NULL remains NULL, no matter what type you convert it to

**Best practice:** Always convert explicitly rather than relying on implicit conversion. This makes the code portable (it works in other DBMS too) and understandable (other developers can immediately see what's happening).`,
            keyTakeaways: [
              "CAST(value AS type) converts data types explicitly",
              "SQLite also converts implicitly (automatically)",
              "CAST('abc' AS INTEGER) → 0 in SQLite (caution!)",
              "Best practice: Always convert explicitly",
            ],
          },
        ],
      },
      {
        id: "berechnungen-sql",
        title: "Calculations in SQL: Arithmetic, CASE, COALESCE",
        estimatedMinutes: 12,
        sections: [
          {
            id: "arithmetik-case",
            title: "Arithmetic and CASE-WHEN",
            sectionType: "theory",
            content: `SQL can do more than just query data — you can also perform calculations directly in the query. Arithmetic operations allow you to add, subtract, multiply, and divide values. CASE-WHEN is SQL's version of if/else — it allows conditional calculations within a query. And COALESCE and NULLIF are indispensable helpers for dealing with NULL values.

**Arithmetic operations in SQL:**

| Operator | Description | Example |
|----------|-------------|----------|
| + | Addition | \`price + 5\` |
| - | Subtraction | \`price - discount\` |
| * | Multiplication | \`price * quantity\` |
| / | Division | \`revenue / 12\` |
| % | Modulo (remainder) | \`id % 2\` |

\`\`\`sql
-- Calculate gross price (net + 19% VAT)
SELECT name, price, price * 1.19 AS gross FROM products;

-- Calculate discount (10% off)
SELECT name, price, price * 0.9 AS discounted_price FROM products;
\`\`\`

---

**Caution with division:** In SQL, dividing an integer by an integer results in an integer — \`5 / 2\` equals 2, not 2.5! To get decimal places, at least one operand must be a decimal number: \`5.0 / 2\` equals 2.5.

**CASE-WHEN — Conditional calculations:**
CASE-WHEN is one of the most powerful tools in SQL. It allows you to calculate values based on conditions — like an if/else in other programming languages, but directly in the query. The WHEN conditions are evaluated from top to bottom — the first matching condition wins.

---

\`\`\`sql
-- Determine price category
SELECT name, price,
  CASE
    WHEN price < 10 THEN 'Cheap'
    WHEN price < 50 THEN 'Medium'
    WHEN price < 100 THEN 'Expensive'
    ELSE 'Very expensive'
  END AS price_category
FROM products;
\`\`\`

---

CASE-WHEN is constantly used in practice: for classifications, conditional aggregations, custom sort orders, and much more.

**CASE in ORDER BY — Custom sorting:**
\`\`\`sql
-- Sort products by custom order
SELECT * FROM products
ORDER BY
  CASE category
    WHEN 'Electronics' THEN 1
    WHEN 'Book' THEN 2
    ELSE 3
  END;
\`\`\`

---

**COALESCE — Replacing NULL values:**
COALESCE is a handy helper that returns the first non-NULL value from a list. It's the standard method for replacing NULL values with defaults:

---

\`\`\`sql
-- Return first non-NULL value
SELECT name, COALESCE(phone, email, 'No contact info') AS contact FROM customers;

-- Replace NULL in calculations (prevents NULL results)
SELECT name, price * COALESCE(discount, 0) AS discount_amount FROM products;
\`\`\`

---

**NULLIF — Generate NULL on equality:**
NULLIF returns NULL when both arguments are equal — otherwise the first argument. The most important use case: preventing division by zero.

---

\`\`\`sql
-- Prevent division by zero
SELECT revenue / NULLIF(employee_count, 0) AS revenue_per_employee
FROM departments;
\`\`\`

---

When \`employee_count\` is 0, NULLIF becomes NULL — and the division results in NULL instead of an error.`,
            keyTakeaways: [
              "Arithmetic: +, -, *, /, % usable directly in SELECT",
              "Integer division: 5/2 = 2, not 2.5 — at least one operand must be a decimal",
              "CASE-WHEN: Conditional calculations (like if/else)",
              "COALESCE: Return first non-NULL value",
              "NULLIF: Prevent division by zero",
            ],
          },
        ],
      },
      {
        id: "mengenoperationen-sql",
        title: "Set Operations: UNION, INTERSECT, EXCEPT",
        estimatedMinutes: 10,
        sections: [
          {
            id: "union-intersect-except-sql",
            title: "Set Operations in Practice",
            sectionType: "example",
            content: `Set operations combine the results of two or more SELECT queries. Instead of adding columns like JOINs, set operations add rows — they work vertically, not horizontally. UNION combines results, INTERSECT returns the intersection, and EXCEPT returns the difference. Important: Both queries must have the same number of columns with compatible data types. Column names always come from the first query.

**UNION — Combine results:**
\`\`\`sql
-- All persons (customers and suppliers)
SELECT name, city, 'Customer' AS role FROM customers
UNION
SELECT name, city, 'Supplier' AS role FROM suppliers;
\`\`\`

---

**UNION ALL — With duplicates:**
\`\`\`sql
-- All orders from both years (including duplicates)
SELECT * FROM orders_2023
UNION ALL
SELECT * FROM orders_2024;
\`\`\`

---

**INTERSECT — Intersection:**
\`\`\`sql
-- Products available in both branches
SELECT product_id FROM inventory_north
INTERSECT
SELECT product_id FROM inventory_south;
\`\`\`

---

**EXCEPT — Difference:**
\`\`\`sql
-- Products only in north inventory
SELECT product_id FROM inventory_north
EXCEPT
SELECT product_id FROM inventory_south;
\`\`\`

---

**Rules for set operations:**
1. Same number of columns in both queries
2. Compatible data types in corresponding columns
3. Column names come from the first query
4. UNION removes duplicates, UNION ALL keeps them
5. ORDER BY applies to the entire result (only at the end)

---

\`\`\`sql
-- ORDER BY at the end of the entire query
SELECT name FROM customers
UNION
SELECT name FROM suppliers
ORDER BY name;  -- Sorts the combined result
\`\`\``,
            keyTakeaways: [
              "UNION: Combine results (without duplicates)",
              "UNION ALL: Combine results (with duplicates, faster)",
              "INTERSECT: Common rows of both queries",
              "EXCEPT: Rows of the first query not in the second",
              "Same number of columns and compatible data types required",
            ],
          },
        ],
      },
      {
        id: "fehler-sql-grundlagen",
        title: "Common SQL Beginner Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "sql-fehler-liste",
            title: "The Most Common SQL Beginner Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: SELECT * in production code**
\`SELECT *\` returns all columns — even ones you don't need. It's slow and breaks when the table is changed.
**Correct:** \`SELECT name, price FROM products\`

**Mistake 2: Comparing NULL with =**
\`WHERE column = NULL\` doesn't work! NULL = NULL evaluates to NULL, not TRUE.
**Correct:** \`WHERE column IS NULL\`

**Mistake 3: LIKE with leading %**
\`WHERE name LIKE '%anna'\` cannot use an index → slow on large tables.
**Better:** Full-text search or \`WHERE name LIKE 'anna%'\` (index usable)

**Mistake 4: ORDER BY without LIMIT**
Without LIMIT, the entire table is sorted → very slow with millions of rows.
**Correct:** \`ORDER BY date DESC LIMIT 100\`

**Mistake 5: Unnecessary DISTINCT**
\`SELECT DISTINCT category FROM products\` is necessary. But \`SELECT DISTINCT id, name FROM customers\` is unnecessary if id is the primary key.

**Mistake 6: FLOAT for monetary amounts**
\`FLOAT\` has rounding errors! 0.1 + 0.2 ≠ 0.3 in floating-point arithmetic.
**Correct:** \`DECIMAL(10,2)\` for monetary amounts

**Mistake 7: Forgetting semicolons**
In some SQL clients, the semicolon at the end is mandatory.
**Correct:** \`SELECT * FROM customers;\`

**Mistake 8: String concatenation with +**
In SQL, strings are concatenated with \`||\`, not \`+\`.
**Correct:** \`SELECT first_name || ' ' || last_name AS full_name FROM customers;\`

**Mistake 9: Violating GROUP BY rule**
After GROUP BY, only GROUP BY columns and aggregate functions are allowed in SELECT.
**Wrong:** \`SELECT name, category, COUNT(*) FROM products GROUP BY category\` — name is not in GROUP BY!

**Mistake 10: Subqueries without alias**
Derived tables in the FROM clause always need an alias.
**Wrong:** \`SELECT * FROM (SELECT ...)\`
**Correct:** \`SELECT * FROM (SELECT ...) AS sub\``,
            keyTakeaways: [
              "Avoid SELECT * — explicitly specify needed columns",
              "Always check NULL with IS NULL / IS NOT NULL",
              "DECIMAL instead of FLOAT for monetary amounts",
              "GROUP BY rule: Only GROUP BY columns and aggregate functions in SELECT",
              "Derived tables always need an alias",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 5: Joins
  // ═══════════════════════════════════════════════════════════════
  {
    id: "joins",
    title: "Joins",
    description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, Self-Join, and how tables are linked.",
    icon: "merge",
    difficulty: "junior",
    articles: [
      {
        id: "join-grundlagen",
        title: "JOIN Basics",
        estimatedMinutes: 12,
        sections: [
          {
            id: "inner-join",
            title: "INNER JOIN",
            sectionType: "theory",
            content: `**INNER JOIN** is the most common JOIN type and links two tables based on a condition. It returns only the rows where the join condition is met in **both** tables — all rows that don't find a partner are excluded.

Imagine you have a customers table and an orders table. An INNER JOIN connects each customer with their orders. Customers without orders and orders without customers don't appear in the result — only the rows that find a partner in both tables.

\`\`\`sql
SELECT a.column, b.column
FROM table_a a
INNER JOIN table_b b ON a.fk = b.pk;
\`\`\`

---

**Venn diagram analogy:** Imagine two overlapping circles. INNER JOIN returns only the intersection — the area where both circles overlap. Everything that lies in only one circle is not returned.

**When to use INNER JOIN?**
- When you only need matching rows from both tables
- When missing matches should be ignored
- When you're sure you don't need "orphaned" records in the result

INNER JOIN is the default JOIN — if you simply write \`JOIN\`, SQL automatically means INNER JOIN.`,
            keyTakeaways: [
              "INNER JOIN returns only matching rows",
              "Corresponds to the intersection in a Venn diagram",
              "The most common JOIN type in practice",
            ],
          },
          {
            id: "left-join",
            title: "LEFT JOIN and RIGHT JOIN",
            sectionType: "example",
            content: `**LEFT JOIN** (LEFT OUTER JOIN) returns **all** rows from the left table and the matching rows from the right table. When there's no match, NULL values are inserted. This is the key difference from INNER JOIN: Even rows without a partner in the right table remain in the result.

Imagine you want to list all customers — even those who have never placed an order. With an INNER JOIN, these customers would simply disappear. With LEFT JOIN, they remain in the result, and the order columns show NULL.

---

\`\`\`sql
-- All customers with their orders (even without orders)
SELECT c.name, o.date, o.total_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
\`\`\`

---

**Result:**

| name | date | total_amount |
|------|-------|-------------|
| Anna | 2024-01-15 | 99.50 |
| Anna | 2024-02-01 | 45.00 |
| Ben | NULL | NULL |
| Clara | 2024-01-20 | 120.00 |

Ben has no orders — the right columns are NULL.

**Typical use cases for LEFT JOIN:**

1. **Find entries WITHOUT a match:**
\`\`\`sql
-- Customers without orders
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
\`\`\`

---

2. **Count with zero values:**
\`\`\`sql
-- Number of orders per customer (even 0)
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
\`\`\`

---

**Important:** \`COUNT(*)\` counts all rows (including NULL matches), \`COUNT(o.id)\` counts only non-NULL values.

**RIGHT JOIN** is equivalent to LEFT JOIN with swapped tables:
\`\`\`sql
-- These two queries are identical:
SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;
SELECT * FROM b RIGHT JOIN a ON a.id = b.a_id;
\`\`\`

---

In practice, RIGHT JOIN is rarely used — you simply put the table with all rows on the left side and use LEFT JOIN.`,
            keyTakeaways: [
              "LEFT JOIN returns all rows from the left table + matches on the right",
              "NULL values in right columns = no match",
              "WHERE right.id IS NULL finds entries without a match",
              "COUNT(*) vs COUNT(right.id) — note the NULL difference",
              "RIGHT JOIN = LEFT JOIN with swapped tables",
            ],
          },
        ],
      },
      {
        id: "weitere-joins",
        title: "RIGHT JOIN, FULL JOIN, and Self-Join",
        estimatedMinutes: 10,
        sections: [
          {
            id: "right-full-join",
            title: "RIGHT JOIN and FULL JOIN",
            sectionType: "theory",
            content: `**RIGHT JOIN** (RIGHT OUTER JOIN) is the mirror image of LEFT JOIN: It returns all rows from the **right** table and the matching rows from the left table. Where there's no match, NULL values are inserted. In practice, RIGHT JOIN is rarely used — you usually rewrite the query with LEFT JOIN by swapping the table order. This is more readable because the "important" table is always on the left.

---

\`\`\`sql
-- RIGHT JOIN: All orders, even without customers
SELECT c.name, o.date
FROM customers c
RIGHT JOIN orders o ON c.id = o.customer_id;

-- Same result with LEFT JOIN (recommended):
SELECT c.name, o.date
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id;
\`\`\`

---

**FULL JOIN** (FULL OUTER JOIN) returns **all** rows from both tables. Where there's a match, rows are connected. Where there's no match, NULL values are inserted. Imagine you have two tables and want to see which rows correspond and which are "orphaned" — FULL JOIN shows both.

---

\`\`\`sql
-- All customers and all orders, even without match
SELECT c.name, o.date
FROM customers c
FULL JOIN orders o ON c.id = o.customer_id;
\`\`\`

---

**Overview of JOIN types:**

| JOIN Type | What is returned? | Use case |
|----------|---------------------|---------------|
| INNER JOIN | Only matching rows | Standard — when both sides must exist |
| LEFT JOIN | All left + matching right | "All X with their Y, even without Y" |
| RIGHT JOIN | All right + matching left | Rare — usually rewritten as LEFT JOIN |
| FULL OUTER JOIN | All rows from both tables | "Show everything, even orphans" |

**Note:** SQLite does not support a native FULL OUTER JOIN. You can simulate it with a LEFT JOIN and a RIGHT JOIN (via UNION).`,
            keyTakeaways: [
              "RIGHT JOIN: All rows from the right table + matches on the left",
              "FULL OUTER JOIN: All rows from both tables",
              "RIGHT JOIN = LEFT JOIN with swapped tables",
              "SQLite does not support native FULL OUTER JOIN",
            ],
          },
          {
            id: "self-join",
            title: "Self-Join",
            sectionType: "example",
            content: `A **Self-Join** is a JOIN of a table with itself. This sounds unusual at first, but is very useful in practice — whenever rows within the same table need to be compared with each other. The trick: You give the table two different aliases, as if they were two different tables.

Typical use cases are hierarchical structures (employees and their supervisors), comparisons within a table (products with similar prices), and adjacency lists (nodes and their neighbors).

**Syntax:** You give the table two different aliases:

---

\`\`\`sql
SELECT a.name AS employee, b.name AS supervisor
FROM employees a
INNER JOIN employees b ON a.supervisor_id = b.id;
\`\`\`

---

**Example: Org chart**

| id | name | supervisor_id |
|----|------|----------------|
| 1 | Müller | NULL |
| 2 | Schmidt | 1 |
| 3 | Weber | 1 |
| 4 | Klein | 2 |

\`\`\`sql
-- Each employee with their supervisor
SELECT
  a.name AS employee,
  b.name AS supervisor
FROM employees a
LEFT JOIN employees b ON a.supervisor_id = b.id;
\`\`\`

---

**Result:**

| employee | supervisor |
|-------------|-------------|
| Müller | NULL |
| Schmidt | Müller |
| Weber | Müller |
| Klein | Schmidt |

**More use cases:**

1. **Find products with similar prices:**
\`\`\`sql
SELECT a.name, b.name, a.price
FROM products a
INNER JOIN products b ON a.category = b.category AND a.id != b.id
WHERE ABS(a.price - b.price) < 10;
\`\`\`

---

2. **Compare consecutive events:**
\`\`\`sql
SELECT a.date, a.value AS current_value, b.value AS previous_value
FROM measurements a
LEFT JOIN measurements b ON a.date = DATE(b.date, '+1 day');
\`\`\`

---

**Important:** Always use aliases (a, b) with self-joins to distinguish the two "copies" of the table. Without aliases, it would be unclear which table is meant.`,
            keyTakeaways: [
              "Self-Join = table is joined with itself",
              "Always use aliases (a, b) to distinguish the copies",
              "Typical applications: hierarchies, comparisons within a table",
              "LEFT JOIN for optional relationships (e.g., supervisor can be NULL)",
            ],
          },
        ],
      },
      {
        id: "cross-join",
        title: "CROSS JOIN and Cartesian Product",
        estimatedMinutes: 8,
        sections: [
          {
            id: "cross-join-theorie",
            title: "CROSS JOIN — The Cartesian Product",
            sectionType: "theory",
            content: `**CROSS JOIN** combines every row from the first table with every row from the second table. The result is the **Cartesian product** of both tables.

---

\`\`\`sql
-- Combine every customer with every product
SELECT c.name AS customer, p.name AS product
FROM customers c
CROSS JOIN products p;
\`\`\`

---

With 5 customers and 10 products, this JOIN returns 50 rows.

**When CROSS JOIN is useful:**
- Generate all combinations (e.g., all sizes × all colors)
- Calendar generation (all days × all departments)
- Generate test data

**When CROSS JOIN is dangerous:**
- Accidentally omitting a JOIN condition
- With large tables, the result set explodes
- 1,000 × 10,000 = 10,000,000 rows!

**CROSS JOIN vs. INNER JOIN without condition:**
\`\`\`sql
-- Both produce the same result:
SELECT * FROM customers CROSS JOIN products;
SELECT * FROM customers, products;
\`\`\`

---

**Practical example — Calendar generation:**
\`\`\`sql
-- All combinations of days and rooms
SELECT d.date, r.room_name
FROM days d
CROSS JOIN rooms r;
\`\`\``,
            keyTakeaways: [
              "CROSS JOIN: Every row × every row = Cartesian product",
              "Result size: Rows_A × Rows_B",
              "Useful for combinations, calendars, test data",
              "Dangerous with large tables — result set explodes",
            ],
          },
        ],
      },
      {
        id: "join-mehrere-tabellen",
        title: "Joins Across Multiple Tables",
        estimatedMinutes: 12,
        sections: [
          {
            id: "multi-join",
            title: "Linking Multiple Tables",
            sectionType: "theory",
            content: `In practice, you often need to link more than two tables. This is done through multiple JOINs in a single query.

**Example: Order with customer, items, and product**
\`\`\`sql
SELECT
  c.name AS customer,
  o.date AS order_date,
  p.name AS product,
  oi.quantity,
  oi.unit_price
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'shipped';
\`\`\`

---

**Order of JOINs:**
- SQL processes JOINs from left to right
- The order can affect performance
- With INNER JOIN, the order doesn't matter for the result
- With LEFT JOIN, the order matters!

**LEFT JOIN with multiple tables:**
\`\`\`sql
-- All customers with their orders and products
-- (even customers without orders)
SELECT c.name, o.date, p.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id;
\`\`\`

---

**Alias best practices:**
- Short, meaningful aliases (c for customers, o for orders)
- Use table alias in the SELECT clause for ambiguous column names
- Every table gets an alias`,
            keyTakeaways: [
              "Multiple JOINs link more than two tables",
              "INNER JOIN: Order doesn't matter for the result",
              "LEFT JOIN: Order matters!",
              "Use meaningful aliases for each table",
            ],
          },
        ],
      },
      {
        id: "join-bedingungen",
        title: "Join Conditions: Equi-Join and Theta-Join",
        estimatedMinutes: 10,
        sections: [
          {
            id: "equi-theta-join",
            title: "Equi-Join and Theta-Join",
            sectionType: "theory",
            content: `**Equi-Join** is a JOIN with an equality condition (ON a.id = b.id). This is the most common JOIN type.

---

\`\`\`sql
-- Equi-Join: Equality condition
SELECT c.name, o.date
FROM customers c
JOIN orders o ON c.id = o.customer_id;
\`\`\`

---

**Theta-Join** is a JOIN with any comparison condition (>, <, >=, <=, <>, BETWEEN).

---

\`\`\`sql
-- Theta-Join: Inequality condition
-- Find products more expensive than the average of their category
SELECT p.name, p.price, k.avg_price
FROM products p
JOIN (
  SELECT category, AVG(price) AS avg_price
  FROM products
  GROUP BY category
) k ON p.category = k.category AND p.price > k.avg_price;
\`\`\`

---

**USING clause (for columns with the same name):**
\`\`\`sql
-- Instead of ON customers.id = orders.customer_id
SELECT * FROM customers
JOIN orders USING (customer_id);
-- Prerequisite: Both tables have a column named customer_id
\`\`\`

---

**NATURAL JOIN (Caution!):**
\`\`\`sql
-- Automatically joins over all columns with the same name
SELECT * FROM customers
NATURAL JOIN orders;
\`\`\`

---

**Warning:** NATURAL JOIN is dangerous because it joins over all columns with the same name. If a column like "name" accidentally exists in both tables, it will be used as a join condition — often not intended!`,
            keyTakeaways: [
              "Equi-Join: Equality condition (ON a.id = b.id) — the standard",
              "Theta-Join: Any comparison condition — rarely used",
              "USING: Shorthand for same-named join columns",
              "NATURAL JOIN: Dangerous — joins over all same-named columns",
            ],
          },
        ],
      },
      {
        id: "join-vs-subquery",
        title: "JOIN vs. Subquery — When to Use Which?",
        estimatedMinutes: 10,
        sections: [
          {
            id: "join-vs-subquery-vergleich",
            title: "JOIN or Subquery?",
            sectionType: "theory",
            content: `Often the same task can be solved with either a JOIN or a subquery. When is which method better?

**Use JOIN when:**
- Data from multiple tables is needed simultaneously
- The result set should contain columns from multiple tables
- The query should be readable and performant

**Use Subquery when:**
- You only need to check whether something exists (EXISTS)
- A single value is needed as a filter (scalar subquery)
- The logic is easier to understand from inside out

**Example — Same task with JOIN and Subquery:**

---

\`\`\`sql
-- With JOIN
SELECT c.name, o.date
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.amount > 100;

-- With Subquery (EXISTS)
SELECT c.name
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.id AND o.amount > 100
);
\`\`\`

---

**Performance rules:**
- INNER JOIN is usually faster than IN subquery
- EXISTS is often faster than IN with large subqueries
- Correlated subqueries can be very slow → replace with JOIN
- The query optimizer can often rewrite subqueries as JOINs

**Readability rules:**
- Simple filters → Subquery is often more readable
- Data from multiple tables → JOIN is more natural
- EXISTS/NOT EXISTS → clearer than JOIN with NULL check`,
            keyTakeaways: [
              "JOIN: When data from multiple tables is needed",
              "Subquery: When only a value or existence check is needed",
              "INNER JOIN usually faster than IN subquery",
              "EXISTS often faster than IN with large subqueries",
            ],
          },
        ],
      },
      {
        id: "join-performance",
        title: "JOIN Performance and Optimization",
        estimatedMinutes: 10,
        sections: [
          {
            id: "join-perf",
            title: "Making JOINs Faster",
            sectionType: "theory",
            content: `**The most common performance problems with JOINs:**

**1. Missing indexes on join columns**
The most common performance killer. Without an index on the join column, the database must search every value in the table (full table scan).

---

\`\`\`sql
-- Create index on foreign key column
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
\`\`\`

---

**2. Too many JOINs**
Each JOIN increases complexity. With 5+ JOINs, you should reconsider the query.

**3. Avoid SELECT ***
Querying only the needed columns saves memory and bandwidth.

**4. LEFT JOIN instead of INNER JOIN when not needed**
LEFT JOIN must produce NULL values — if you only need matching rows, INNER JOIN is faster.

**5. Optimize subquery in JOIN**
\`\`\`sql
-- Slow: Subquery in JOIN
SELECT c.name, o.total
FROM customers c
JOIN (SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id) o
ON c.id = o.customer_id;

-- Faster: CTE or direct aggregation
WITH customer_revenue AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders GROUP BY customer_id
)
SELECT c.name, cr.total
FROM customers c
JOIN customer_revenue cr ON c.id = cr.customer_id;
\`\`\`

---

**6. Avoid Cartesian product**
Missing JOIN condition → CROSS JOIN → millions of rows!

**Use EXPLAIN:**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT c.name, o.date
FROM customers c
JOIN orders o ON c.id = o.customer_id;
\`\`\`

---

EXPLAIN shows whether indexes are used and how the query is executed.`,
            keyTakeaways: [
              "Create index on join columns — the most important performance tip",
              "Avoid SELECT * — query only needed columns",
              "INNER JOIN instead of LEFT JOIN when possible",
              "Use EXPLAIN QUERY PLAN to analyze execution",
            ],
          },
        ],
      },
      {
        id: "natuerlicher-join",
        title: "NATURAL JOIN and USING Clause",
        estimatedMinutes: 8,
        sections: [
          {
            id: "natural-join-using",
            title: "NATURAL JOIN and USING",
            sectionType: "theory",
            content: `**NATURAL JOIN** automatically links two tables over all columns with the same name.

---

\`\`\`sql
-- NATURAL JOIN: Joins over all same-named columns
SELECT * FROM customers
NATURAL JOIN orders;
-- Joins over customer_id (if present in both tables)
\`\`\`

---

**Advantages:**
- Short syntax
- No ON clause needed

**Disadvantages:**
- Unpredictable when table structure changes
- Joins over ALL same-named columns — even accidental ones like "name" or "id"
- Hard to debug
- **Not recommended in practice!**

**USING clause — The better alternative:**
\`\`\`sql
-- USING: Explicit specification of the join column
SELECT * FROM customers
JOIN orders USING (customer_id);
\`\`\`

---

**Advantages of USING:**
- Explicit — clear which column is joined
- Shorter than ON a.id = b.id
- The join column appears only once in the result

**Comparison:**
\`\`\`sql
-- ON clause (standard)
SELECT c.name, o.date
FROM customers c
JOIN orders o ON c.id = o.customer_id;

-- USING clause (shorter)
SELECT name, date
FROM customers
JOIN orders USING (customer_id);

-- NATURAL JOIN (not recommended!)
SELECT * FROM customers
NATURAL JOIN orders;
\`\`\`

---

**Recommendation:** Use ON clause (most explicit), USING as an alternative for same-named columns. Avoid NATURAL JOIN.`,
            keyTakeaways: [
              "NATURAL JOIN: Automatic over same-named columns — dangerous!",
              "USING: Explicit specification of join column — safer",
              "ON clause: Most explicit and safest",
              "Avoid NATURAL JOIN in practice",
            ],
          },
        ],
      },
      {
        id: "join-fehler",
        title: "Common JOIN Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "join-fehler-liste",
            title: "The Most Common JOIN Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: Missing JOIN condition → Cartesian product**
\`\`\`sql
-- WRONG: No ON clause → every customer × every order
SELECT * FROM customers, orders;

-- CORRECT: JOIN with condition
SELECT * FROM customers c
JOIN orders o ON c.id = o.customer_id;
\`\`\`

---

**Mistake 2: Wrong JOIN condition**
\`\`\`sql
-- WRONG: Wrong column linked
SELECT * FROM orders o
JOIN products p ON o.customer_id = p.id;  -- customer_id instead of product_id!

-- CORRECT:
SELECT * FROM order_items oi
JOIN products p ON oi.product_id = p.id;
\`\`\`

---

**Mistake 3: LEFT JOIN instead of INNER JOIN**
When you only need matching rows, LEFT JOIN is slower and can produce NULL values.

**Mistake 4: Multi-JOIN without aliases**
\`\`\`sql
-- WRONG: Ambiguous column names
SELECT name, name FROM customers
JOIN orders ON customers.id = orders.customer_id
JOIN products ON order_items.product_id = products.id;

-- CORRECT: Aliases and table prefix
SELECT c.name AS customer, p.name AS product
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
\`\`\`

---

**Mistake 5: COUNT(*) with LEFT JOIN**
\`\`\`sql
-- WRONG: Counts NULL values too
SELECT c.name, COUNT(*) AS count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;

-- CORRECT: Counts only non-NULL values
SELECT c.name, COUNT(o.id) AS count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
\`\`\`

---

**Mistake 6: OR in JOIN**
\`\`\`sql
-- SLOW: OR in JOIN
SELECT * FROM customers c
JOIN orders o ON c.id = o.customer_id OR c.email = o.email;

-- BETTER: Two separate JOINs or UNION
\`\`\``,
            keyTakeaways: [
              "Missing JOIN condition → Cartesian product (big mistake!)",
              "Wrong JOIN condition → wrong results",
              "LEFT JOIN only when NULL values are wanted",
              "Aliases and table prefix for multi-JOINs",
              "COUNT(*) vs COUNT(column) with LEFT JOIN — note the difference",
            ],
          },
        ],
      },
      {
        id: "join-praxisbeispiele",
        title: "JOIN Practice Examples",
        estimatedMinutes: 12,
        sections: [
          {
            id: "join-praxis",
            title: "Practical JOIN Examples",
            sectionType: "practice",
            content: `JOINs are the most important tool for combining data from multiple tables. In practice, you almost always need JOINs — rarely are all needed data in a single table. Here are the most common patterns: Multi-JOINs for order overviews, LEFT JOIN with IS NULL for "without" queries (customers without orders, products without sales), COALESCE for NULL-safe aggregations, and self-joins for hierarchical data.

**Example 1: Online shop — Orders with details**
\`\`\`sql
SELECT
  c.name AS customer,
  o.date AS order_date,
  p.name AS product,
  oi.quantity,
  oi.unit_price,
  oi.quantity * oi.unit_price AS total_price
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.date DESC;
\`\`\`

---

**Example 2: University — Grade overview**
\`\`\`sql
SELECT
  s.name AS student,
  c.name AS course,
  e.grade,
  e.semester
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
WHERE e.grade IS NOT NULL
ORDER BY s.name, c.name;
\`\`\`

---

**Example 3: Customers without orders (LEFT JOIN)**
\`\`\`sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
\`\`\`

---

**Example 4: Revenue per customer with NULL values**
\`\`\`sql
SELECT
  c.name,
  COALESCE(SUM(o.amount), 0) AS revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY revenue DESC;
\`\`\`

---

**Example 5: Self-Join — Employee with supervisor**
\`\`\`sql
SELECT
  e.name AS employee,
  s.name AS supervisor
FROM employees e
LEFT JOIN employees s ON e.supervisor_id = s.id;
\`\`\`

---

**Example 6: Products that have never been ordered**
\`\`\`sql
SELECT p.name
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.product_id IS NULL;
\`\`\``,
            keyTakeaways: [
              "Multi-JOINs link 3+ tables",
              "LEFT JOIN + WHERE ... IS NULL finds entries without a match",
              "COALESCE replaces NULL values in aggregations",
              "Self-Join for hierarchies (Employee → Supervisor)",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 6: DDL — Data Definition
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ddl",
    title: "DDL — Data Definition",
    description: "CREATE TABLE, data types, constraints, ALTER TABLE, DROP TABLE, and indexes.",
    icon: "building",
    difficulty: "junior",
    articles: [
      {
        id: "create-table",
        title: "CREATE TABLE",
        estimatedMinutes: 10,
        sections: [
          {
            id: "syntax-create-table",
            title: "Syntax and Data Types",
            sectionType: "theory",
            content: `**CREATE TABLE** creates a new table with columns, data types, and constraints.

\`\`\`sql
CREATE TABLE table_name (
  column1 data_type [constraint],
  column2 data_type [constraint],
  ...
  [table_constraint]
);
\`\`\`

---

**Important data types (MySQL):**

| Data Type | Description | Example |
|----------|-------------|----------|
| INTEGER / INT | Whole numbers | \`42\` |
| VARCHAR(n) | Strings (max n characters) | \`'Anna'\` |
| DECIMAL(p,s) | Decimal numbers | \`99.99\` |
| DATE | Date | \`'2024-01-15'\` |
| BOOLEAN | Boolean value | \`TRUE\` / \`FALSE\` |
| TEXT | Long texts | \`'Long text...'\` |
| DATETIME | Date and time | \`'2024-01-15 14:30:00'\` |

**Important constraints:**

| Constraint | Meaning | Example |
|------------|-----------|----------|
| PRIMARY KEY | Primary key | \`id INTEGER PRIMARY KEY\` |
| NOT NULL | Required field | \`name VARCHAR(50) NOT NULL\` |
| UNIQUE | Unique | \`email VARCHAR(100) UNIQUE\` |
| FOREIGN KEY | Foreign key | \`REFERENCES customers(id)\` |
| DEFAULT | Default value | \`status VARCHAR(20) DEFAULT 'active'\` |
| CHECK | Condition | \`CHECK (price > 0)\``,
            keyTakeaways: [
              "CREATE TABLE defines columns, data types, and constraints",
              "VARCHAR(n) for text, INTEGER for numbers, DATE for dates",
              "PRIMARY KEY = unique identification, NOT NULL = required field",
              "FOREIGN KEY creates relationships between tables",
            ],
          },
          {
            id: "create-table-beispiel",
            title: "CREATE TABLE in Practice",
            sectionType: "practice",
            content: `Here we create a complete database with multiple tables and relationships:

**Example: Online shop database**

---

\`\`\`sql
-- Customers table
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category VARCHAR(50) DEFAULT 'Other',
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  active BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'new',
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order items (n:m relationship)
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
\`\`\`

---

**Explanation of the constraints used:**

| Constraint | Usage | Purpose |
|-----------|-------------|-------|
| PRIMARY KEY AUTOINCREMENT | \`id\` in each table | Unique ID, automatically incremented |
| NOT NULL | \`first_name\`, \`last_name\`, \`email\` | Required fields |
| UNIQUE | \`email\` | No duplicate email addresses |
| CHECK | \`price > 0\`, \`quantity > 0\` | Restrict value ranges |
| DEFAULT | \`created_at\`, \`status\` | Default values for new rows |
| FOREIGN KEY | \`customer_id\`, \`order_id\` | Referential integrity |

**Best practices:**
- Always define PRIMARY KEY (usually INTEGER AUTOINCREMENT)
- NOT NULL for required fields
- CHECK constraints for value ranges (e.g., price > 0)
- DEFAULT for common default values
- FOREIGN KEY for all relationships
- UNIQUE for unique fields like email`,
            keyTakeaways: [
              "Always use PRIMARY KEY and NOT NULL for required fields",
              "CHECK constraints restrict value ranges",
              "DEFAULT values simplify INSERT statements",
              "FOREIGN KEY ensures referential integrity",
              "UNIQUE prevents duplicate values (e.g., email)",
            ],
          },
        ],
      },
      {
        id: "alter-drop-index",
        title: "ALTER TABLE, DROP TABLE, and Indexes",
        estimatedMinutes: 12,
        sections: [
          {
            id: "alter-drop",
            title: "ALTER TABLE and DROP TABLE",
            sectionType: "theory",
            content: `**ALTER TABLE** changes the structure of an existing table without deleting the data. It's the tool of choice when requirements change and you need to add, remove, or modify columns — without recreating the table.

---

\`\`\`sql
-- Add column
ALTER TABLE customers ADD COLUMN phone VARCHAR(20);

-- Remove column
ALTER TABLE customers DROP COLUMN phone;

-- Modify column (MySQL)
ALTER TABLE customers MODIFY COLUMN name VARCHAR(100);
\`\`\`

---

**Important notes about ALTER TABLE:**
- New columns are added at the end of the table — the position cannot be changed in SQLite
- In SQLite, \`DROP COLUMN\` is available from version 3.35.0 — older versions don't support it
- Changes to the table structure can affect existing queries that use \`SELECT *\`
- Always execute in a transaction to be able to roll back on errors

**DROP TABLE** deletes an entire table including all data and the table structure itself. This is irreversible — all data is permanently lost!

---

\`\`\`sql
DROP TABLE customers;
\`\`\`

---

**Caution:** DROP TABLE is irreversible! All data is lost. Always use \`DROP TABLE IF EXISTS\` to avoid errors when the table doesn't exist:

---

\`\`\`sql
DROP TABLE IF EXISTS customers;
\`\`\`

---

**ALTER TABLE vs. DROP TABLE — the important difference:**
- ALTER TABLE changes the structure, the data remains
- DROP TABLE deletes everything — structure and data
- ALTER TABLE is reversible (you can undo the change), DROP TABLE is not`,
            keyTakeaways: [
              "ALTER TABLE changes table structure (add/remove columns)",
              "DROP TABLE deletes the entire table including data",
              "DROP TABLE IF EXISTS prevents errors for non-existing tables",
              "ALTER TABLE is reversible, DROP TABLE is not!",
            ],
          },
          {
            id: "indizes",
            title: "Indexes for Performance",
            sectionType: "example",
            content: `**Indexes** are like a table of contents for your database. Without an index, the database must search the entire table on every query (full table scan) — with 1 million rows, that means checking 1 million rows. With an index on the search column, the database finds the sought rows in milliseconds by jumping directly to the right entry.

The price: Indexes slow down write operations (INSERT, UPDATE, DELETE) because the index must be updated with every change. And they consume additional storage space. You should use indexes selectively — not on every column, but only on those that are frequently searched.

---

\`\`\`sql
-- Create index
CREATE INDEX idx_customer_name ON customers(name);

-- Unique index (like UNIQUE, but as an index)
CREATE UNIQUE INDEX idx_customer_email ON customers(email);

-- Drop index
DROP INDEX idx_customer_name;
\`\`\`

---

**When indexes are useful — and when not:**

Indexes are worthwhile when the column frequently appears in WHERE clauses, JOIN conditions, or ORDER BY clauses. They are not worthwhile for very small tables (under 100 rows — a full table scan is just as fast), for columns with few unique values (e.g., a boolean column with only true/false), or for columns that are frequently updated (the index would need to be updated with every UPDATE).

**EXPLAIN QUERY PLAN — Check whether an index is being used:**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT * FROM customers WHERE name = 'Anna';
\`\`\`

---

If you see \`SCAN TABLE customers\`, no index is being used. If you see \`SEARCH TABLE customers USING INDEX idx_customer_name\`, the index is being used.`,
          },
        ],
      },
      {
        id: "datentypen-ddl",
        title: "SQL Data Types in Detail",
        estimatedMinutes: 12,
        sections: [
          {
            id: "ddl-datentypen",
            title: "Data Types and Their Properties",
            sectionType: "theory",
            content: `**Numeric data types:**

| Type | Description | Storage | Range |
|-----|-------------|---------------|---------|
| INTEGER | Whole numbers | 1-8 bytes | -2⁶³ to 2⁶³-1 |
| SMALLINT | Small integers | 2 bytes | -32768 to 32767 |
| BIGINT | Large integers | 8 bytes | -2⁶³ to 2⁶³-1 |
| REAL/FLOAT | Floating point | 4-8 bytes | ~7-15 digits |
| DECIMAL(p,s) | Decimal numbers | Variable | Precise |

**Important:** ALWAYS use DECIMAL for monetary amounts, never FLOAT!
- \`DECIMAL(10,2)\` = 10 digits total, 2 decimal places
- \`FLOAT\` has rounding errors: 0.1 + 0.2 ≠ 0.3

**String data types:**

| Type | Description | Max length |
|-----|-------------|-----------|
| VARCHAR(n) | Variable-length string | n characters |
| CHAR(n) | Fixed-length string | exactly n characters |
| TEXT | Unlimited string | Unlimited |

**When VARCHAR vs. CHAR:**
- \`VARCHAR\`: Variable length (names, email, descriptions) — saves storage
- \`CHAR\`: Fixed length (ZIP codes, country codes) — faster for exact-fit values

**Date/Time data types:**

| Type | Description | Format |
|-----|-------------|--------|
| DATE | Date | '2024-01-15' |
| TIME | Time | '14:30:00' |
| DATETIME | Date and time | '2024-01-15 14:30:00' |
| TIMESTAMP | Timestamp | Unix time or ISO |

**SQLite peculiarity:** SQLite has no real data types — it uses Type Affinity (TEXT, NUMERIC, INTEGER, REAL, BLOB). You can insert any value into any column.`,
            keyTakeaways: [
              "DECIMAL instead of FLOAT for monetary amounts",
              "VARCHAR for variable length, CHAR for fixed length",
              "DATE, TIME, DATETIME for date and time",
              "SQLite: dynamic typing (Type Affinity)",
            ],
          },
        ],
      },
      {
        id: "constraints",
        title: "Constraints in Detail",
        estimatedMinutes: 12,
        sections: [
          {
            id: "ddl-constraints",
            title: "All Constraints at a Glance",
            sectionType: "theory",
            content: `**Constraints** ensure data integrity at the table level.

**1. PRIMARY KEY — Unique identification**
\`\`\`sql
-- Simple primary key
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL
);

-- Composite primary key
CREATE TABLE enrollments (
  student_id INTEGER,
  course_id INTEGER,
  grade DECIMAL(3,1),
  PRIMARY KEY (student_id, course_id)
);
\`\`\`

---

**2. NOT NULL — Required field**
\`\`\`sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,  -- Required
  description TEXT             -- Optional (can be NULL)
);
\`\`\`

---

**3. UNIQUE — Uniqueness**
\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,  -- No duplicate emails
  username VARCHAR(50) UNIQUE          -- No duplicate usernames
);
\`\`\`

---

**4. FOREIGN KEY — Referential integrity**
\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
\`\`\`

---

**5. CHECK — Restrict value ranges**
\`\`\`sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  price DECIMAL(10,2) CHECK (price > 0),
  category VARCHAR(50) CHECK (category IN ('Electronics', 'Book', 'Clothing')),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0)
);
\`\`\`

---

**6. DEFAULT — Default values**
\`\`\`sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'new',
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

**Named constraints for better error messages:**
\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  email VARCHAR(100),
  CONSTRAINT uk_email UNIQUE (email),
  CONSTRAINT chk_email CHECK (email LIKE '%@%.%')
);
\`\`\``,
            keyTakeaways: [
              "PRIMARY KEY: Unique identification, NOT NULL implied",
              "NOT NULL: Required field, UNIQUE: Uniqueness",
              "FOREIGN KEY: Referential integrity with ON DELETE/UPDATE",
              "CHECK: Restrict value ranges",
              "DEFAULT: Default values for new rows",
            ],
          },
        ],
      },
      {
        id: "autoincrement-sequenzen",
        title: "Auto-Increment and IDs",
        estimatedMinutes: 10,
        sections: [
          {
            id: "autoincrement-ids",
            title: "Generating Automatic IDs",
            sectionType: "theory",
            content: `**AUTOINCREMENT** automatically generates unique IDs for new rows.

\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL
);

-- id is set automatically
INSERT INTO customers (name) VALUES ('Anna');  -- id = 1
INSERT INTO customers (name) VALUES ('Ben');   -- id = 2
\`\`\`

---

**AUTOINCREMENT vs. without AUTOINCREMENT in SQLite:**

| Property | With AUTOINCREMENT | Without AUTOINCREMENT |
|-------------|-------------------|-------------------|
| IDs are strictly monotonically increasing | Yes | Mostly, but not guaranteed |
| Deleted IDs are not reused | Yes | Yes (with INTEGER PRIMARY KEY) |
| Guarantee: New ID > all previous | Yes | No |
| Performance | Slightly slower | Slightly faster |

**Best practice:** Use AUTOINCREMENT when IDs really need to be unique and monotonically increasing (e.g., for audit trails). Without AUTOINCREMENT, INTEGER PRIMARY KEY is sufficient in most cases.

**Composite primary keys:**
\`\`\`sql
CREATE TABLE enrollments (
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade DECIMAL(3,1),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
\`\`\`

---

**UUIDs as primary key (alternative):**
\`\`\`sql
-- In SQLite: TEXT column with UUID
CREATE TABLE customers (
  id TEXT PRIMARY KEY,  -- e.g., '550e8400-e29b-41d4-a716-446655440000'
  name VARCHAR(100) NOT NULL
);
\`\`\`

---

Advantages of UUIDs: Globally unique, no AUTOINCREMENT needed, can be generated distributed.
Disadvantages: Larger storage requirement, slower with JOINs.`,
            keyTakeaways: [
              "AUTOINCREMENT: Automatically unique, monotonically increasing IDs",
              "INTEGER PRIMARY KEY without AUTOINCREMENT is sufficient in most cases",
              "Composite primary keys for n:m relationships",
              "UUIDs as alternative: globally unique, but slower with JOINs",
            ],
          },
        ],
      },
      {
        id: "views",
        title: "Creating and Using Views",
        estimatedMinutes: 10,
        sections: [
          {
            id: "views-theorie",
            title: "What are Views?",
            sectionType: "theory",
            content: `A **View** is a stored query that can be used like a table.

---

\`\`\`sql
-- Create view
CREATE VIEW customer_revenue AS
SELECT
  c.name AS customer,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;

-- Use view (like a table)
SELECT * FROM customer_revenue WHERE total_revenue > 1000;
\`\`\`

---

**Advantages of Views:**
1. **Simplification:** Store complex queries as views and query them simply
2. **Security:** Only expose certain columns/rows to users
3. **Consistency:** Central definition of frequently used queries
4. **Maintainability:** Change in one place affects all users

**Drop view:**
\`\`\`sql
DROP VIEW IF EXISTS customer_revenue;
\`\`\`

---

**Limitations of Views:**
- Views don't store data (they are only stored queries)
- Not all views are updatable (INSERT/UPDATE/DELETE)
- Only views based on a single table without aggregate functions are updatable

**Materialized Views (not natively supported in SQLite):**
Views that physically store their results. In SQLite, you can simulate this with a real table:
\`\`\`sql
CREATE TABLE customer_revenue_materialized AS
SELECT c.name, SUM(o.amount) AS revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;

-- Manually refresh
DELETE FROM customer_revenue_materialized;
INSERT INTO customer_revenue_materialized
SELECT c.name, SUM(o.amount) AS revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
\`\`\``,
            keyTakeaways: [
              "View = stored query used like a table",
              "Advantages: Simplification, security, consistency, maintainability",
              "Views don't store data — they are recalculated on every query",
              "Only simple views are updatable (INSERT/UPDATE/DELETE)",
            ],
          },
        ],
      },
      {
        id: "indizes-tiefer",
        title: "Indexes in Detail",
        estimatedMinutes: 12,
        sections: [
          {
            id: "indizes-detail",
            title: "Indexes: B-Tree, Composite Indexes, and Strategies",
            sectionType: "theory",
            content: `**How indexes work:**
An index is like an index in a book. Instead of flipping through all pages (full table scan), the index finds the relevant page directly.

**B-Tree Index (standard):**
Most databases use B-trees (Balanced Trees) as index structures. A B-tree keeps data sorted and enables logarithmic search time O(log n).

**Types of indexes:**

| Type | Description | Usage |
|-----|-------------|-----------|
| Simple | Index on one column | \`WHERE column = value\` |
| Unique | No duplicate values | PRIMARY KEY, UNIQUE |
| Composite | Index on multiple columns | \`WHERE a = x AND b = y\` |

**Composite indexes:**
\`\`\`sql
-- Index on (category, price)
CREATE INDEX idx_category_price ON products(category, price);

-- Used for:
WHERE category = 'Electronics'                    -- Yes (left column)
WHERE category = 'Electronics' AND price > 50      -- Yes (both columns)
WHERE price > 50                                    -- No! (only right column)
\`\`\`

---

**Rule: A composite index is used from left to right.** If the left column doesn't appear in the WHERE clause, the index is not used.

**When to create indexes:**
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns with high selectivity (many unique values)

**When NOT to create indexes:**
- Very small tables (< 100 rows)
- Columns with few unique values (e.g., boolean)
- Columns that are frequently updated (every UPDATE also updates the index)
- Tables with high write traffic

**Check index usage:**
\`\`\`sql
-- SQLite: Show indexes of a table
.indices products

-- Show execution plan
EXPLAIN QUERY PLAN SELECT * FROM products WHERE category = 'Electronics';
\`\`\``,
            keyTakeaways: [
              "Index = index for fast searching",
              "B-Tree: Standard index structure, logarithmic search time",
              "Composite indexes: Used from left to right",
              "Indexes speed up read access, slow down write access",
            ],
          },
        ],
      },
      {
        id: "tabellen-aendern",
        title: "ALTER TABLE in Detail",
        estimatedMinutes: 10,
        sections: [
          {
            id: "alter-table-detail",
            title: "Changing Table Structure",
            sectionType: "theory",
            content: `**ALTER TABLE** changes the structure of an existing table.

**Add column:**
\`\`\`sql
ALTER TABLE customers ADD COLUMN phone VARCHAR(20);
ALTER TABLE customers ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
\`\`\`

---

**Remove column (SQLite peculiarity):**
SQLite supports \`DROP COLUMN\` from version 3.35.0 (2021):
\`\`\`sql
ALTER TABLE customers DROP COLUMN phone;
\`\`\`

---

In older SQLite versions, you must recreate the table:
\`\`\`sql
-- 1. Create new table
CREATE TABLE customers_new (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

-- 2. Copy data
INSERT INTO customers_new SELECT id, name, email FROM customers;

-- 3. Drop old table
DROP TABLE customers;

-- 4. Rename new table
ALTER TABLE customers_new RENAME TO customers;
\`\`\`

---

**Rename table:**
\`\`\`sql
ALTER TABLE customers RENAME TO users;
\`\`\`

---

**Rename column (SQLite from 3.25.0):**
\`\`\`sql
ALTER TABLE customers RENAME COLUMN name TO full_name;
\`\`\`

---

**Best practices for table changes:**
1. Always create a backup before ALTER TABLE
2. Execute changes in a transaction
3. Recreate indexes and constraints after the change
4. Check dependent views and queries`,
            keyTakeaways: [
              "ALTER TABLE ADD COLUMN: Add column",
              "ALTER TABLE DROP COLUMN: Remove column (SQLite from 3.35.0)",
              "ALTER TABLE RENAME TO: Rename table",
              "ALTER TABLE RENAME COLUMN: Rename column (SQLite from 3.25.0)",
              "In older SQLite: Recreate table for complex changes",
            ],
          },
        ],
      },
      {
        id: "ddl-best-practices",
        title: "DDL Best Practices",
        estimatedMinutes: 10,
        sections: [
          {
            id: "ddl-namenskonventionen",
            title: "Naming Conventions and Design Decisions",
            sectionType: "theory",
            content: `**Naming conventions:**

| Element | Convention | Example |
|---------|-----------|----------|
| Table | Lowercase, plural | \`customers\`, \`orders\` |
| Column | Lowercase, singular | \`name\`, \`customer_id\` |
| Primary key | \`id\` or \`table_name_id\` | \`id\`, \`customer_id\` |
| Foreign key | referenced_table_id | \`customer_id\` |
| Index | \`idx_\` + table + column | \`idx_customers_email\` |
| View | Lowercase, descriptive | \`customer_revenue\` |

**Design decisions:**

**1. Primary key: Surrogate vs. Natural key**
- **Surrogate:** Artificial key (id INTEGER AUTOINCREMENT)
  - Advantage: Immutable, simple, consistent
  - Disadvantage: Additional column
- **Natural:** Existing attribute (email, isbn)
  - Advantage: No additional column, meaningful
  - Disadvantage: Can change, privacy (GDPR)

**2. NULL vs. NOT NULL**
- NOT NULL for required fields (Name, Email)
- NULL for optional fields (Phone, Description)
- Never NULL for primary keys!

**3. Choosing data types**
- INTEGER for IDs and counters
- VARCHAR(n) for text with known maximum length
- TEXT for long text (descriptions)
- DECIMAL(p,s) for monetary amounts
- DATE/DATETIME for date and time

**4. Normalize before denormalizing**
- First normalize (at least 3NF)
- Then selectively denormalize for performance issues`,
            keyTakeaways: [
              "Use consistent naming conventions (lowercase, snake_case)",
              "Prefer surrogate keys (id)",
              "NOT NULL for required fields, NULL for optional fields",
              "DECIMAL for monetary amounts, never FLOAT",
            ],
          },
        ],
      },
      {
        id: "ddl-fehler",
        title: "Common DDL Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "ddl-fehler-liste",
            title: "The Most Common DDL Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: No primary key**
Every table needs a primary key. Without it, you can't uniquely identify rows.
\`\`\`sql
-- WRONG
CREATE TABLE customers (name VARCHAR(100), email VARCHAR(100));

-- CORRECT
CREATE TABLE customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), email VARCHAR(100));
\`\`\`

---

**Mistake 2: FLOAT for monetary amounts**
FLOAT has rounding errors! 0.1 + 0.2 ≠ 0.3 in floating-point arithmetic.
\`\`\`sql
-- WRONG
CREATE TABLE products (price FLOAT);

-- CORRECT
CREATE TABLE products (price DECIMAL(10,2));
\`\`\`

---

**Mistake 3: Foreign keys without constraints**
Without ON DELETE/ON UPDATE, orphaned records can occur.
\`\`\`sql
-- WRONG (orphaned records possible)
FOREIGN KEY (customer_id) REFERENCES customers(id)

-- CORRECT (with cascade)
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
\`\`\`

---

**Mistake 4: Overly wide VARCHAR columns**
\`VARCHAR(9999)\` wastes storage and makes validation harder.
\`\`\`sql
-- WRONG
CREATE TABLE customers (email VARCHAR(9999));

-- CORRECT
CREATE TABLE customers (email VARCHAR(255));
\`\`\`

---

**Mistake 5: Missing CHECK constraints**
Value ranges should be secured at the database level.
\`\`\`sql
-- WRONG (negative prices possible)
CREATE TABLE products (price DECIMAL(10,2));

-- CORRECT
CREATE TABLE products (price DECIMAL(10,2) CHECK (price > 0));
\`\`\`

---

**Mistake 6: DROP TABLE without IF EXISTS**
\`\`\`sql
-- WRONG (error if table doesn't exist)
DROP TABLE customers;

-- CORRECT
DROP TABLE IF EXISTS customers;
\`\`\`

---

**Mistake 7: ALTER TABLE without backup**
Table changes can cause data loss. Always create a backup!`,
            keyTakeaways: [
              "Always define primary keys",
              "DECIMAL instead of FLOAT for monetary amounts",
              "Specify ON DELETE/ON UPDATE for foreign keys",
              "CHECK constraints for value ranges",
              "DROP TABLE IF EXISTS instead of DROP TABLE",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 7: Subqueries
  // ═══════════════════════════════════════════════════════════════
  {
    id: "subqueries",
    title: "Subqueries",
    description: "Subqueries in WHERE, FROM, SELECT, and with EXISTS — mastering nested queries.",
    icon: "search",
    difficulty: "intermediate",
    articles: [
      {
        id: "subquery-grundlagen",
        title: "Subquery Basics",
        estimatedMinutes: 12,
        sections: [
          {
            id: "was-sind-subqueries",
            title: "What are Subqueries?",
            sectionType: "theory",
            content: `A **subquery** (also called inner query or nested query) is a SELECT statement embedded within another SQL statement. Subqueries allow you to use the result of one query as input for another — like a function call in programming, where one function calls another.

Subqueries are a powerful tool for complex queries that cannot be solved with simple JOINs. They are particularly useful when you need a single value as a filter condition, want to check for existence, or need to calculate an intermediate result.

**Where subqueries can be used:**
- In the WHERE clause (most common)
- In the FROM clause (derived table)
- In the SELECT clause (scalar subquery)
- In the HAVING clause
- In INSERT, UPDATE, DELETE statements

**Basic syntax:**
\`\`\`sql
SELECT column1
FROM table1
WHERE column2 = (SELECT column3 FROM table2 WHERE condition);
\`\`\`

---

**Types of subqueries:**

| Type | Description | Returns |
|------|-------------|---------|
| Scalar | Single value | One row, one column |
| Row | Single row | One row, multiple columns |
| Column | Single column | Multiple rows, one column |
| Table | Multiple rows and columns | Multiple rows, multiple columns |

**Important rules:**
- Subqueries must always be enclosed in parentheses
- Scalar subqueries can be used wherever a single value is expected
- Column subqueries can be used with IN, ANY, ALL
- Table subqueries can be used in the FROM clause (with alias)`,
            keyTakeaways: [
              "Subquery = SELECT statement within another SQL statement",
              "4 types: Scalar, Row, Column, Table",
              "Always enclose in parentheses",
              "Scalar subqueries return exactly one value",
            ],
          },
          {
            id: "subquery-where",
            title: "Subqueries in WHERE",
            sectionType: "example",
            content: `Subqueries in the WHERE clause are the most common use case. They allow you to filter rows based on the result of another query.

**1. Scalar subquery (single value):**
\`\`\`sql
-- Products more expensive than the average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
\`\`\`

---

**2. Column subquery with IN:**
\`\`\`sql
-- Customers who have placed orders
SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders);
\`\`\`

---

**3. Column subquery with NOT IN:**
\`\`\`sql
-- Customers who have never placed an order
SELECT name
FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL);
\`\`\`

---

**4. EXISTS / NOT EXISTS:**
\`\`\`sql
-- Customers who have placed orders (with EXISTS)
SELECT name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- Customers who have never placed an order (with NOT EXISTS)
SELECT name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
\`\`\`

---

**EXISTS vs. IN — when to use which?**
- **EXISTS** is often faster with large subqueries (stops at first match)
- **IN** is simpler for small result sets
- **NOT EXISTS** is safer than NOT IN (no NULL problem)
- **EXISTS** checks for existence, IN checks for membership`,
            keyTakeaways: [
              "Scalar subquery: Single value as filter condition",
              "IN/NOT IN: Subquery returns a list of values",
              "EXISTS/NOT EXISTS: Checks for existence of rows",
              "NOT EXISTS is safer than NOT IN (no NULL problem)",
            ],
          },
        ],
      },
      {
        id: "subquery-in-from",
        title: "Subqueries in FROM (Derived Tables)",
        estimatedMinutes: 10,
        sections: [
          {
            id: "subquery-from",
            title: "Derived Tables in the FROM Clause",
            sectionType: "theory",
            content: `A subquery in the FROM clause creates a **derived table** (also called inline view). The result of the subquery is treated like a temporary table that exists only for the duration of the query.

**Important rules:**
- Derived tables must always have an alias
- The alias is used like a table name
- Derived tables can be used in JOINs, WHERE, GROUP BY, etc.

\`\`\`sql
-- Average order value per customer
SELECT avg_orders.customer_name, avg_orders.avg_amount
FROM (
  SELECT c.name AS customer_name, AVG(o.amount) AS avg_amount
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name
) AS avg_orders
WHERE avg_orders.avg_amount > 100;
\`\`\`

---

**Practical example — Top customers:**
\`\`\`sql
SELECT customer_name, total_revenue
FROM (
  SELECT c.name AS customer_name, SUM(o.amount) AS total_revenue
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name
) AS customer_totals
ORDER BY total_revenue DESC
LIMIT 5;
\`\`\`

---

**Derived tables vs. CTEs:**
- Derived tables: Defined inline in the FROM clause
- CTEs: Defined before the main query with WITH
- CTEs are more readable for complex queries
- Both produce the same result`,
            keyTakeaways: [
              "Derived table = subquery in the FROM clause",
              "Derived tables must always have an alias",
              "Useful for intermediate calculations",
              "CTEs are more readable than derived tables",
            ],
          },
        ],
      },
      {
        id: "subquery-in-select",
        title: "Subqueries in SELECT (Scalar Subqueries)",
        estimatedMinutes: 10,
        sections: [
          {
            id: "subquery-select",
            title: "Scalar Subqueries in the SELECT Clause",
            sectionType: "theory",
            content: `A **scalar subquery** in the SELECT clause returns exactly one value per row. It's like a calculated column that is computed from a subquery.

**Important:** The subquery must return exactly one row and one column. If it returns more, you get an error.

\`\`\`sql
-- Each product with the average price of its category
SELECT
  name,
  price,
  (SELECT AVG(price) FROM products p2 WHERE p2.category = p1.category) AS avg_category_price
FROM products p1;
\`\`\`

---

**Practical examples:**

\`\`\`sql
-- Each customer with their number of orders
SELECT
  c.name,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
FROM customers c;

-- Each order with the customer name
SELECT
  o.id,
  o.amount,
  (SELECT name FROM customers c WHERE c.id = o.customer_id) AS customer_name
FROM orders o;
\`\`\`

---

**Advantages of scalar subqueries:**
- Simple syntax for single values
- No JOIN needed for simple lookups
- Readable for simple calculations

**Disadvantages:**
- Can be slow with correlated subqueries (executed per row)
- Not suitable for multiple values
- Often replaceable with JOINs (which are usually faster)`,
            keyTakeaways: [
              "Scalar subquery in SELECT returns exactly one value per row",
              "Must return exactly one row and one column",
              "Can be slow with correlated subqueries",
              "Often replaceable with JOINs (usually faster)",
            ],
          },
        ],
      },
      {
        id: "subquery-mit-any-all",
        title: "Subqueries with ANY and ALL",
        estimatedMinutes: 10,
        sections: [
          {
            id: "any-all",
            title: "ANY and ALL Operators",
            sectionType: "theory",
            content: `**ANY** and **ALL** compare a value with the results of a subquery.

**ANY** — At least one match:
\`price > ANY (subquery)\` means: price is greater than at least one value from the subquery.

\`\`\`sql
-- Products more expensive than at least one product in the 'Book' category
SELECT name, price
FROM products
WHERE price > ANY (SELECT price FROM products WHERE category = 'Book');
\`\`\`

---

**ALL** — All matches:
\`price > ALL (subquery)\` means: price is greater than all values from the subquery.

\`\`\`sql
-- Products more expensive than ALL products in the 'Book' category
SELECT name, price
FROM products
WHERE price > ALL (SELECT price FROM products WHERE category = 'Book');
\`\`\`

---

**Comparison with IN and EXISTS:**

| Operator | Meaning | Equivalent |
|----------|---------|------------|
| = ANY | Equal to at least one | IN |
| <> ANY | Not equal to at least one | NOT IN (with NULL caveat) |
| > ANY | Greater than at least one | > MIN(subquery) |
| > ALL | Greater than all | > MAX(subquery) |
| < ALL | Less than all | < MIN(subquery) |

**Important:** \`= ANY\` is the same as \`IN\`. \`<> ALL\` is the same as \`NOT IN\`.`,
            keyTakeaways: [
              "ANY: At least one value from the subquery must satisfy the condition",
              "ALL: All values from the subquery must satisfy the condition",
              "= ANY is the same as IN",
              "> ALL is the same as > MAX(subquery)",
            ],
          },
        ],
      },
      {
        id: "subquery-vs-join",
        title: "Subquery vs. JOIN — When to Use Which?",
        estimatedMinutes: 10,
        sections: [
          {
            id: "subquery-join-entscheidung",
            title: "Decision Guide: Subquery or JOIN?",
            sectionType: "theory",
            content: `Often the same task can be solved with either a subquery or a JOIN. Here's a decision guide:

**Use subquery when:**
- You only need to check existence (EXISTS/NOT EXISTS)
- You need a single value as a filter (scalar subquery)
- The logic is easier to understand from inside out
- You need an aggregate value as a filter (e.g., > AVG)

**Use JOIN when:**
- You need columns from multiple tables in the result
- You need all rows from one table (LEFT JOIN)
- The query should be performant
- The logic is easier to understand with a flat structure

**Performance comparison:**

| Method | Performance | Readability |
|--------|-------------|-------------|
| INNER JOIN | Fast | Good |
| LEFT JOIN | Fast | Good |
| IN subquery | Medium | Simple |
| EXISTS | Fast (stops at first match) | Good |
| Correlated subquery | Slow (per row) | Complex |
| CTE | Fast | Very good |

**Rule of thumb:**
1. Need columns from multiple tables? → JOIN
2. Only checking existence? → EXISTS/NOT EXISTS
3. Need a single value as filter? → Scalar subquery
4. Complex intermediate calculation? → CTE
5. Simple list filter? → IN/NOT IN`,
            keyTakeaways: [
              "JOIN: When columns from multiple tables are needed",
              "EXISTS: When checking for existence",
              "Scalar subquery: When a single value is needed as filter",
              "CTE: For complex intermediate calculations",
              "IN: For simple list filters",
            ],
          },
        ],
      },
      {
        id: "subquery-fehler",
        title: "Common Subquery Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "subquery-fehler-liste",
            title: "The Most Common Subquery Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: Subquery returns more than one row**
Scalar subqueries must return exactly one value. If the subquery returns multiple rows, you get an error.
\`\`\`sql
-- WRONG: Subquery can return multiple rows
SELECT name FROM customers
WHERE id = (SELECT customer_id FROM orders);  -- Error if multiple orders!

-- CORRECT: Use IN instead
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders);
\`\`\`

---

**Mistake 2: NOT IN with NULL**
\`\`\`sql
-- WRONG: NOT IN returns no rows if subquery contains NULL!
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);  -- NULL problem!

-- CORRECT: Use NOT EXISTS
SELECT name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
\`\`\`

---

**Mistake 3: Missing alias for derived table**
\`\`\`sql
-- WRONG: Derived table without alias
SELECT * FROM (SELECT name, AVG(price) FROM products GROUP BY name);

-- CORRECT: With alias
SELECT * FROM (SELECT name, AVG(price) AS avg_price FROM products GROUP BY name) AS sub;
\`\`\`

---

**Mistake 4: Correlated subquery instead of JOIN**
\`\`\`sql
-- SLOW: Correlated subquery (executed per row)
SELECT name, (SELECT AVG(price) FROM products WHERE category = p.category) AS avg_price
FROM products p;

-- FASTER: JOIN with aggregation
SELECT p.name, avg_cat.avg_price
FROM products p
JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) avg_cat
ON p.category = avg_cat.category;
\`\`\`

---

**Mistake 5: Subquery in SELECT for multiple columns**
\`\`\`sql
-- SLOW: Multiple scalar subqueries
SELECT name,
  (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) AS order_count,
  (SELECT SUM(amount) FROM orders WHERE customer_id = c.id) AS total;

-- FASTER: Single JOIN with aggregation
SELECT c.name, COUNT(o.id) AS order_count, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
\`\`\``,
            keyTakeaways: [
              "Scalar subquery must return exactly one value",
              "NOT IN with NULL returns no rows — use NOT EXISTS",
              "Derived tables must always have an alias",
              "Correlated subqueries are often replaceable with JOINs",
              "Multiple scalar subqueries are often replaceable with a single JOIN",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 8: DML — Data Manipulation
  // ═══════════════════════════════════════════════════════════════
  {
    id: "dml",
    title: "DML — Data Manipulation",
    description: "INSERT, UPDATE, and DELETE — inserting, modifying, and deleting data in tables.",
    icon: "pencil",
    difficulty: "junior",
    articles: [
      {
        id: "dml-fehler",
        title: "Common DML Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "dml-fehler-liste",
            title: "The Most Common DML Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: INSERT without column names**
\`\`\`sql
-- WRONG: Order of columns may change
INSERT INTO customers VALUES (1, 'Anna', 'anna@email.com');

-- CORRECT: Explicit column names
INSERT INTO customers (id, name, email) VALUES (1, 'Anna', 'anna@email.com');
\`\`\`

---

**Mistake 2: UPDATE without WHERE**
\`\`\`sql
-- WRONG: Updates ALL rows!
UPDATE products SET price = price * 1.1;

-- CORRECT: Only update specific rows
UPDATE products SET price = price * 1.1 WHERE category = 'Electronics';
\`\`\`

---

**Mistake 3: DELETE without WHERE**
\`\`\`sql
-- WRONG: Deletes ALL rows!
DELETE FROM customers;

-- CORRECT: Only delete specific rows
DELETE FROM customers WHERE id = 5;
\`\`\`

---

**Mistake 4: String values without quotes**
\`\`\`sql
-- WRONG: Numbers don't need quotes, but strings do
INSERT INTO customers (id, name) VALUES (1, Anna);  -- Error!

-- CORRECT: Strings in single quotes
INSERT INTO customers (id, name) VALUES (1, 'Anna');
\`\`\`

---

**Mistake 5: Foreign key violations**
\`\`\`sql
-- WRONG: Customer doesn't exist
INSERT INTO orders (id, customer_id, amount) VALUES (1, 999, 100);  -- FK violation!

-- CORRECT: Insert customer first, then order
INSERT INTO customers (id, name) VALUES (999, 'New Customer');
INSERT INTO orders (id, customer_id, amount) VALUES (1, 999, 100);
\`\`\`

---

**Mistake 6: NULL handling in UPDATE**
\`\`\`sql
-- WRONG: Setting to NULL when you mean to keep the old value
UPDATE customers SET phone = NULL WHERE id = 1;

-- CORRECT: Only update the column you want to change
UPDATE customers SET phone = '123-456-7890' WHERE id = 1;
\`\`\`

---

**Best Practices:**
- Always use explicit column names in INSERT
- Always use WHERE with UPDATE and DELETE
- Use transactions for multiple related changes
- Test UPDATE/DELETE with SELECT first
- Back up data before bulk changes`,
            keyTakeaways: [
              "Always specify column names in INSERT",
              "Always use WHERE with UPDATE and DELETE",
              "Strings in single quotes",
              "Insert parent records before child records (FK order)",
              "Test UPDATE/DELETE with SELECT first",
            ],
          },
        ],
      },
      {
        id: "dml-best-practices",
        title: "DML Best Practices",
        estimatedMinutes: 10,
        sections: [
          {
            id: "dml-best-practices-liste",
            title: "Best Practices for INSERT, UPDATE, DELETE",
            sectionType: "theory",
            content: `**INSERT Best Practices:**

\`\`\`sql
-- 1. Always specify column names
INSERT INTO customers (name, email) VALUES ('Anna', 'anna@email.com');

-- 2. Multiple rows at once (faster than individual INSERTs)
INSERT INTO customers (name, email) VALUES
  ('Anna', 'anna@email.com'),
  ('Ben', 'ben@email.com'),
  ('Clara', 'clara@email.com');

-- 3. INSERT with SELECT (copy data)
INSERT INTO customers_archive (name, email)
SELECT name, email FROM customers WHERE created_at < '2023-01-01';
\`\`\`

---

**UPDATE Best Practices:**

\`\`\`sql
-- 1. Always use WHERE
UPDATE products SET price = price * 1.1 WHERE category = 'Electronics';

-- 2. Test with SELECT first
SELECT * FROM products WHERE category = 'Electronics';  -- Check which rows are affected

-- 3. UPDATE with JOIN (SQLite)
UPDATE products
SET price = price * 1.1
WHERE id IN (SELECT id FROM products WHERE category = 'Electronics');

-- 4. UPDATE with CASE
UPDATE products
SET price = CASE
  WHEN category = 'Electronics' THEN price * 1.1
  WHEN category = 'Book' THEN price * 1.05
  ELSE price
END;
\`\`\`

---

**DELETE Best Practices:**

\`\`\`sql
-- 1. Always use WHERE
DELETE FROM orders WHERE status = 'cancelled';

-- 2. Test with SELECT first
SELECT * FROM orders WHERE status = 'cancelled';  -- Check which rows are affected

-- 3. DELETE all rows (faster than row-by-row)
DELETE FROM temp_data;

-- 4. TRUNCATE (not in SQLite, but in MySQL/PostgreSQL)
-- TRUNCATE TABLE temp_data;  -- Faster than DELETE without WHERE
\`\`\`

---

**Transaction Best Practices:**
\`\`\`sql
BEGIN TRANSACTION;
  INSERT INTO orders (id, customer_id, amount) VALUES (1, 100, 50);
  INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 5, 2);
  UPDATE products SET stock = stock - 2 WHERE id = 5;
COMMIT;  -- Or ROLLBACK; on error
\`\`\``,
            keyTakeaways: [
              "INSERT: Always specify column names, use multi-row inserts",
              "UPDATE: Always use WHERE, test with SELECT first",
              "DELETE: Always use WHERE, test with SELECT first",
              "Use transactions for multiple related changes",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 9: Common Table Expressions (CTEs)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ctes",
    title: "Common Table Expressions (CTEs)",
    description: "Structure complex queries with WITH — and recursive CTEs for hierarchies.",
    icon: "refresh",
    difficulty: "intermediate",
    articles: [
      {
        id: "cte-grundlagen",
        title: "CTE Basics",
        estimatedMinutes: 12,
        sections: [
          {
            id: "was-sind-ctes",
            title: "What are CTEs?",
            sectionType: "theory",
            content: `A **Common Table Expression (CTE)** is a named temporary result set that exists only for the duration of a single query. CTEs are defined with the \`WITH\` keyword and make complex queries more readable and maintainable.

**Why CTEs instead of subqueries?**
- **Readability:** CTEs are defined before the main query, making the logic clear from top to bottom
- **Reusability:** A CTE can be referenced multiple times in the same query
- **Maintainability:** Changes only need to be made in one place
- **Performance:** The optimizer can often use CTEs more efficiently than nested subqueries

**Basic syntax:**
\`\`\`sql
WITH cte_name AS (
  SELECT ...
  FROM ...
  WHERE ...
)
SELECT * FROM cte_name;
\`\`\`

---

**Simple example:**
\`\`\`sql
WITH expensive_products AS (
  SELECT name, price, category
  FROM products
  WHERE price > 100
)
SELECT * FROM expensive_products
ORDER BY price DESC;
\`\`\`

---

**Multiple CTEs:**
\`\`\`sql
WITH
  expensive_products AS (
    SELECT name, price FROM products WHERE price > 100
  ),
  cheap_products AS (
    SELECT name, price FROM products WHERE price < 10
  )
SELECT 'expensive' AS type, name, price FROM expensive_products
UNION ALL
SELECT 'cheap' AS type, name, price FROM cheap_products;
\`\`\``,
            keyTakeaways: [
              "CTE = named temporary result set with WITH",
              "More readable than nested subqueries",
              "Can be referenced multiple times in the same query",
              "Defined before the main query (top-down logic)",
            ],
          },
          {
            id: "cte-beispiele",
            title: "CTE Examples in Practice",
            sectionType: "example",
            content: `**Example 1: Revenue per customer (with CTE)**
\`\`\`sql
WITH customer_revenue AS (
  SELECT
    c.name,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_revenue
  FROM customers c
  LEFT JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name
)
SELECT * FROM customer_revenue
WHERE total_revenue > 1000
ORDER BY total_revenue DESC;
\`\`\`

---

**Example 2: Products above average price (with CTE)**
\`\`\`sql
WITH category_avg AS (
  SELECT category, AVG(price) AS avg_price
  FROM products
  GROUP BY category
)
SELECT p.name, p.price, ca.avg_price
FROM products p
JOIN category_avg ca ON p.category = ca.category
WHERE p.price > ca.avg_price;
\`\`\`

---

**Example 3: Top 3 customers per category (with CTE)**
\`\`\`sql
WITH ranked_orders AS (
  SELECT
    c.name,
    c.category,
    o.amount,
    ROW_NUMBER() OVER (PARTITION BY c.category ORDER BY o.amount DESC) AS rank
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
)
SELECT name, category, amount
FROM ranked_orders
WHERE rank <= 3;
\`\`\`

---

**Example 4: Multiple CTEs for complex queries**
\`\`\`sql
WITH
  monthly_revenue AS (
    SELECT
      DATE(order_date, 'start of month') AS month,
      SUM(amount) AS revenue
    FROM orders
    GROUP BY DATE(order_date, 'start of month')
  ),
  avg_revenue AS (
    SELECT AVG(revenue) AS avg FROM monthly_revenue
  )
SELECT mr.month, mr.revenue, a.avg
FROM monthly_revenue mr, avg_revenue a
WHERE mr.revenue > a.avg;
\`\`\``,
            keyTakeaways: [
              "CTEs make complex queries readable",
              "Multiple CTEs can be chained with WITH ... AS, ... AS",
              "CTEs can be referenced multiple times",
              "CTEs are ideal for intermediate calculations",
            ],
          },
        ],
      },
      {
        id: "cte-vs-subquery",
        title: "CTE vs. Subquery",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-vs-subquery-vergleich",
            title: "CTE or Subquery?",
            sectionType: "theory",
            content: `**CTE vs. Subquery — Comparison:**

| Criterion | CTE | Subquery |
|-----------|-----|----------|
| Readability | Very good | Moderate |
| Reusability | Can be referenced multiple times | Must be repeated |
| Performance | Often better (optimizer) | Often worse (correlated) |
| Nesting depth | Flat (WITH ... AS) | Deep (nested parentheses) |
| Debugging | Easy (separate CTEs) | Hard (nested queries) |

**When CTE is better:**
- Complex queries with multiple intermediate steps
- When the same subquery is used multiple times
- When readability is important
- When debugging is needed

**When subquery is better:**
- Simple, single-line conditions (WHERE price > (SELECT AVG(price) FROM products))
- EXISTS/NOT EXISTS checks
- When the query is short and simple

**Example — Same query, different readability:**

\`\`\`sql
-- With subquery (hard to read)
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products WHERE category = (SELECT category FROM products WHERE id = 5));

-- With CTE (easy to read)
WITH target_category AS (
  SELECT category FROM products WHERE id = 5
),
category_avg AS (
  SELECT AVG(price) AS avg_price FROM products
  WHERE category = (SELECT category FROM target_category)
)
SELECT p.name, p.price
FROM products p, category_avg ca
WHERE p.price > ca.avg_price;
\`\`\``,
            keyTakeaways: [
              "CTEs are more readable than nested subqueries",
              "CTEs can be referenced multiple times",
              "Subqueries are simpler for single-line conditions",
              "Use CTEs for complex, multi-step queries",
            ],
          },
        ],
      },
      {
        id: "cte-mit-aggregation",
        title: "CTEs with Aggregation",
        estimatedMinutes: 12,
        sections: [
          {
            id: "cte-aggregation",
            title: "Aggregation with CTEs",
            sectionType: "practice",
            content: `CTEs are particularly powerful when combined with aggregations. They allow you to first calculate intermediate results and then filter, sort, or join them.

**Example 1: Customers above average revenue**
\`\`\`sql
WITH customer_totals AS (
  SELECT
    c.name,
    SUM(o.amount) AS total_revenue
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name
)
SELECT name, total_revenue
FROM customer_totals
WHERE total_revenue > (SELECT AVG(total_revenue) FROM customer_totals)
ORDER BY total_revenue DESC;
\`\`\`

---

**Example 2: Category with most products**
\`\`\`sql
WITH category_counts AS (
  SELECT category, COUNT(*) AS product_count
  FROM products
  GROUP BY category
)
SELECT category, product_count
FROM category_counts
WHERE product_count = (SELECT MAX(product_count) FROM category_counts);
\`\`\`

---

**Example 3: Year-over-year comparison**
\`\`\`sql
WITH yearly_revenue AS (
  SELECT
    STRFTIME('%Y', order_date) AS year,
    SUM(amount) AS revenue
  FROM orders
  GROUP BY STRFTIME('%Y', order_date)
)
SELECT
  curr.year,
  curr.revenue AS current_year,
  prev.revenue AS previous_year,
  ROUND((curr.revenue - prev.revenue) * 100.0 / prev.revenue, 2) AS growth_pct
FROM yearly_revenue curr
LEFT JOIN yearly_revenue prev ON curr.year = prev.year + 1
ORDER BY curr.year;
\`\`\``,
            keyTakeaways: [
              "CTEs + aggregation = powerful combination",
              "First aggregate, then filter with CTEs",
              "Year-over-year comparisons are easy with CTEs",
              "CTEs make complex aggregations readable",
            ],
          },
        ],
      },
      {
        id: "cte-mit-joins",
        title: "CTEs with JOINs",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-joins",
            title: "JOINs with CTEs",
            sectionType: "practice",
            content: `CTEs can be joined like regular tables. This is particularly useful for complex queries that require multiple intermediate steps.

**Example 1: Customer order statistics**
\`\`\`sql
WITH
  customer_orders AS (
    SELECT
      c.id,
      c.name,
      COUNT(o.id) AS order_count,
      SUM(o.amount) AS total_revenue
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id, c.name
  ),
  customer_categories AS (
    SELECT
      co.name,
      co.order_count,
      CASE
        WHEN co.total_revenue > 1000 THEN 'VIP'
        WHEN co.total_revenue > 500 THEN 'Regular'
        ELSE 'New'
      END AS customer_category
    FROM customer_orders co
  )
SELECT * FROM customer_categories
ORDER BY order_count DESC;
\`\`\`

---

**Example 2: Product sales statistics**
\`\`\`sql
WITH product_sales AS (
  SELECT
    p.name AS product,
    p.category,
    SUM(oi.quantity) AS total_sold,
    SUM(oi.quantity * oi.unit_price) AS revenue
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  GROUP BY p.id, p.name, p.category
)
SELECT
  product,
  category,
  total_sold,
  revenue,
  RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS category_rank
FROM product_sales
ORDER BY category, revenue DESC;
\`\`\``,
            keyTakeaways: [
              "CTEs can be joined like regular tables",
              "Multiple CTEs can be chained for complex logic",
              "CTEs + JOINs = readable complex queries",
              "Window functions can be used on CTE results",
            ],
          },
        ],
      },
      {
        id: "cte-performance",
        title: "CTE Performance",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-perf",
            title: "Performance Tips for CTEs",
            sectionType: "theory",
            content: `**CTE Performance in SQLite:**

SQLite materializes CTEs — that is, it computes the CTE result and stores it temporarily. This has advantages and disadvantages:

**Advantages:**
- CTE is computed only once, even if referenced multiple times
- The optimizer can use the materialized result efficiently
- Complex subqueries are computed once instead of multiple times

**Disadvantages:**
- Materialization costs memory and time
- For very simple CTEs, the overhead can be higher than a direct subquery
- Large CTE results consume memory

**Performance tips:**

1. **Use CTEs for complex queries, not simple ones**
\`\`\`sql
-- OVERKILL: Simple filter as CTE
WITH expensive AS (SELECT * FROM products WHERE price > 100)
SELECT * FROM expensive;

-- SIMPLER: Direct query
SELECT * FROM products WHERE price > 100;
\`\`\`

---

2. **Filter early in the CTE**
\`\`\`sql
-- SLOW: Filter after CTE
WITH all_orders AS (
  SELECT * FROM orders  -- All orders!
)
SELECT * FROM all_orders WHERE status = 'shipped';

-- FASTER: Filter in CTE
WITH shipped_orders AS (
  SELECT * FROM orders WHERE status = 'shipped'  -- Only shipped orders
)
SELECT * FROM shipped_orders;
\`\`\`

---

3. **Avoid unnecessary CTEs**
\`\`\`sql
-- UNNECESSARY: CTE for a simple aggregation
WITH avg_price AS (SELECT AVG(price) FROM products)
SELECT * FROM products WHERE price > (SELECT * FROM avg_price);

-- SIMPLER: Direct scalar subquery
SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products);
\`\`\`

---

4. **Use EXPLAIN QUERY PLAN**
\`\`\`sql
EXPLAIN QUERY PLAN
WITH customer_totals AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders GROUP BY customer_id
)
SELECT * FROM customer_totals WHERE total > 1000;
\`\`\``,
            keyTakeaways: [
              "SQLite materializes CTEs (computes them once)",
              "Use CTEs for complex queries, not simple ones",
              "Filter early in the CTE for better performance",
              "Avoid unnecessary CTEs for simple subqueries",
            ],
          },
        ],
      },
      {
        id: "cte-fehler",
        title: "Common CTE Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-fehler-liste",
            title: "The Most Common CTE Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: Missing comma between CTEs**
\`\`\`sql
-- WRONG: Missing comma
WITH cte1 AS (SELECT * FROM products)
cte2 AS (SELECT * FROM orders)  -- Error!

-- CORRECT: Comma between CTEs
WITH cte1 AS (SELECT * FROM products),
     cte2 AS (SELECT * FROM orders)
SELECT * FROM cte1;
\`\`\`

---

**Mistake 2: Referencing CTE before definition**
\`\`\`sql
-- WRONG: cte2 references cte1, but cte1 is defined after
WITH cte2 AS (SELECT * FROM cte1),  -- Error!
     cte1 AS (SELECT * FROM products)
SELECT * FROM cte2;

-- CORRECT: Define cte1 first
WITH cte1 AS (SELECT * FROM products),
     cte2 AS (SELECT * FROM cte1)
SELECT * FROM cte2;
\`\`\`

---

**Mistake 3: CTE without main query**
\`\`\`sql
-- WRONG: CTE without SELECT
WITH expensive AS (SELECT * FROM products WHERE price > 100);
-- Error: Missing main query!

-- CORRECT: CTE with main query
WITH expensive AS (SELECT * FROM products WHERE price > 100)
SELECT * FROM expensive;
\`\`\`

---

**Mistake 4: CTE name conflicts**
\`\`\`sql
-- WRONG: CTE name same as table name
WITH products AS (SELECT * FROM products WHERE price > 100)
SELECT * FROM products;  -- References CTE, not table!

-- CORRECT: Use different name
WITH expensive_products AS (SELECT * FROM products WHERE price > 100)
SELECT * FROM expensive_products;
\`\`\`

---

**Mistake 5: Overusing CTEs**
\`\`\`sql
-- OVERKILL: CTE for a simple filter
WITH cheap AS (SELECT * FROM products WHERE price < 10)
SELECT * FROM cheap;

-- SIMPLER: Direct query
SELECT * FROM products WHERE price < 10;
\`\`\``,
            keyTakeaways: [
              "Comma between multiple CTEs",
              "Define CTEs in order of dependency",
              "CTE must always be followed by a main query",
              "Avoid CTE name conflicts with table names",
              "Don't overuse CTEs for simple queries",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 10: Window Functions
  // ═══════════════════════════════════════════════════════════════
  {
    id: "window-functions",
    title: "Window Functions",
    description: "ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and running totals — mastering analytical functions.",
    icon: "bar-chart",
    difficulty: "intermediate",
    articles: [
      {
        id: "window-functions",
        title: "Window Functions Overview",
        estimatedMinutes: 15,
        sections: [
          {
            id: "window-grundlagen",
            title: "What are Window Functions?",
            sectionType: "theory",
            content: `**Window functions** perform calculations across a set of rows related to the current row — without collapsing the rows like GROUP BY. They are one of the most powerful SQL features and are indispensable for analytical queries.

**The difference to GROUP BY:**
- GROUP BY collapses rows — you get one row per group
- Window functions keep all rows — you get the calculation alongside the original data

**Basic syntax:**
\`\`\`sql
SELECT
  column1,
  column2,
  FUNCTION() OVER (PARTITION BY ... ORDER BY ...) AS alias
FROM table;
\`\`\`

---

**The most important window functions:**

| Function | Description | Example |
|----------|-------------|----------|
| ROW_NUMBER() | Sequential number | 1, 2, 3, 4, 5 |
| RANK() | Rank with gaps | 1, 2, 2, 4, 5 |
| DENSE_RANK() | Rank without gaps | 1, 2, 2, 3, 4 |
| LAG() | Previous row value | Previous row |
| LEAD() | Next row value | Next row |
| SUM() | Running total | Cumulative sum |
| AVG() | Moving average | Average over window |
| COUNT() | Count over window | Number of rows |
| FIRST_VALUE() | First value in window | First value |
| LAST_VALUE() | Last value in window | Last value |

**Key concepts:**
- **PARTITION BY**: Divides rows into groups (like GROUP BY, but without collapsing)
- **ORDER BY**: Sorts rows within each partition
- **Frame**: Defines which rows are included in the calculation`,
            keyTakeaways: [
              "Window functions calculate across rows without collapsing them",
              "PARTITION BY = grouping without collapsing",
              "ORDER BY = sorting within each partition",
              "ROW_NUMBER, RANK, DENSE_RANK are the most important ranking functions",
            ],
          },
          {
            id: "was-sind-window-functions",
            title: "ROW_NUMBER, RANK, DENSE_RANK",
            sectionType: "example",
            content: `**ROW_NUMBER()** assigns a unique sequential number to each row within a partition:

\`\`\`sql
SELECT name, price,
  ROW_NUMBER() OVER (ORDER BY price DESC) AS row_num
FROM products;
\`\`\`

---

| name | price | row_num |
|------|-------|---------|
| Product A | 100 | 1 |
| Product B | 80 | 2 |
| Product C | 80 | 3 |
| Product D | 50 | 4 |

**RANK()** assigns the same rank on ties, but skips numbers. The ranking has gaps:

\`\`\`sql
SELECT name, price,
  RANK() OVER (ORDER BY price DESC) AS rank
FROM products;
\`\`\`

---

| name | price | rank |
|------|-------|------|
| Product A | 100 | 1 |
| Product B | 80 | 2 |
| Product C | 80 | 2 |
| Product D | 50 | 4 | ← Rank 3 is skipped!

**DENSE_RANK()** assigns the same rank on ties, but doesn't skip numbers. The ranking is always gapless:

\`\`\`sql
SELECT name, price,
  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rank
FROM products;
\`\`\`

---

| name | price | dense_rank |
|------|-------|------------|
| Product A | 100 | 1 |
| Product B | 80 | 2 |
| Product C | 80 | 2 |
| Product D | 50 | 3 | ← No gap!

**Practical application: Top-N per category**

\`\`\`sql
WITH ranked AS (
  SELECT name, category, price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank
  FROM products
)
SELECT name, category, price
FROM ranked
WHERE rank <= 3;
\`\`\``,
            keyTakeaways: [
              "ROW_NUMBER: Unique sequential number (1, 2, 3, 4)",
              "RANK: Same rank on ties, gaps (1, 2, 2, 4)",
              "DENSE_RANK: Same rank on ties, no gaps (1, 2, 2, 3)",
              "Top-N per category: ROW_NUMBER with PARTITION BY",
            ],
          },
        ],
      },
      {
        id: "window-frames",
        title: "Window Frames and Running Totals",
        estimatedMinutes: 12,
        sections: [
          {
            id: "window-frames-detail",
            title: "Window Frames in Detail",
            sectionType: "theory",
            content: `A **window frame** defines which rows are included in the calculation of a window function. Without an explicit frame, the default is \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`.

**Frame syntax:**
\`\`\`sql
FUNCTION() OVER (
  PARTITION BY column
  ORDER BY column
  ROWS BETWEEN frame_start AND frame_end
)
\`\`\`

---

**Frame boundaries:**

| Boundary | Description |
|-----------|-------------|
| UNBOUNDED PRECEDING | From the beginning of the partition |
| N PRECEDING | N rows before the current row |
| CURRENT ROW | The current row |
| N FOLLOWING | N rows after the current row |
| UNBOUNDED FOLLOWING | To the end of the partition |

**Running total (cumulative sum):**
\`\`\`sql
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM orders
ORDER BY date;
\`\`\`

---

**Moving average (3-day):**
\`\`\`sql
SELECT
  date,
  amount,
  AVG(amount) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS moving_avg
FROM orders
ORDER BY date;
\`\`\`

---

**LAG and LEAD — Accessing previous and next rows:**
\`\`\`sql
SELECT
  date,
  amount,
  LAG(amount, 1) OVER (ORDER BY date) AS previous_amount,
  LEAD(amount, 1) OVER (ORDER BY date) AS next_amount,
  amount - LAG(amount, 1) OVER (ORDER BY date) AS change
FROM orders
ORDER BY date;
\`\`\``,
            keyTakeaways: [
              "Window frame defines which rows are included in the calculation",
              "Default: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
              "Running total: SUM() OVER (ORDER BY column)",
              "LAG/LEAD: Access previous/next row values",
            ],
          },
        ],
      },
      {
        id: "window-functions-praxis",
        title: "Window Functions in Practice",
        estimatedMinutes: 12,
        sections: [
          {
            id: "window-functions-beispiele",
            title: "Practical Window Function Examples",
            sectionType: "practice",
            content: `**Example 1: Revenue per customer with rank**
\`\`\`sql
SELECT
  c.name,
  SUM(o.amount) AS total_revenue,
  RANK() OVER (ORDER BY SUM(o.amount) DESC) AS revenue_rank
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY revenue_rank;
\`\`\`

---

**Example 2: Top 3 products per category**
\`\`\`sql
WITH ranked AS (
  SELECT
    name, category, price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank
  FROM products
)
SELECT name, category, price
FROM ranked
WHERE rank <= 3;
\`\`\`

---

**Example 3: Year-over-year comparison**
\`\`\`sql
WITH yearly AS (
  SELECT
    STRFTIME('%Y', order_date) AS year,
    SUM(amount) AS revenue
  FROM orders
  GROUP BY STRFTIME('%Y', order_date)
)
SELECT
  year,
  revenue,
  LAG(revenue) OVER (ORDER BY year) AS prev_revenue,
  revenue - LAG(revenue) OVER (ORDER BY year) AS change,
  ROUND((revenue - LAG(revenue) OVER (ORDER BY year)) * 100.0 / LAG(revenue) OVER (ORDER BY year), 2) AS growth_pct
FROM yearly
ORDER BY year;
\`\`\`

---

**Example 4: Percentage of total per category**
\`\`\`sql
SELECT
  category,
  SUM(price) AS category_total,
  SUM(price) * 100.0 / SUM(SUM(price)) OVER () AS pct_of_total
FROM products
GROUP BY category;
\`\`\``,
            keyTakeaways: [
              "RANK() for ranking with gaps",
              "ROW_NUMBER() with PARTITION BY for Top-N per group",
              "LAG() for year-over-year comparisons",
              "SUM() OVER () for percentage of total",
            ],
          },
        ],
      },
      {
        id: "window-functions-performance",
        title: "Window Function Performance",
        estimatedMinutes: 10,
        sections: [
          {
            id: "window-functions-performance-tipps",
            title: "Performance Tips for Window Functions",
            sectionType: "theory",
            content: `Window functions are powerful, but can be slow on large datasets. Here are tips for better performance:

**1. Filter early, not late**
\`\`\`sql
-- SLOW: Window function on all rows
SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
FROM products
WHERE rank <= 10;  -- Error: WHERE can't reference window function!

-- FASTER: Filter in CTE, then apply window function
WITH ranked AS (
  SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
  FROM products
  WHERE category = 'Electronics'  -- Filter early!
)
SELECT * FROM ranked WHERE rank <= 10;
\`\`\`

---

**2. Minimize the partition size**
\`\`\`sql
-- SLOW: Large partition
SELECT name, category, price,
  ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
FROM products;

-- FASTER: Smaller partitions
SELECT name, category, price,
  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank
FROM products;
\`\`\`

---

**3. Index the ORDER BY columns**
\`\`\`sql
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_category_price ON products(category, price);
\`\`\`

---

**4. Avoid unnecessary window functions**
\`\`\`sql
-- UNNECESSARY: Window function for simple aggregation
SELECT category, SUM(price) OVER (PARTITION BY category) AS total
FROM products;

-- SIMPLER: GROUP BY
SELECT category, SUM(price) AS total
FROM products
GROUP BY category;
\`\`\`

---

**5. Use EXPLAIN QUERY PLAN**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT name, ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
FROM products;
\`\`\``,
            keyTakeaways: [
              "Filter early with WHERE, not late with window function results",
              "Minimize partition size with PARTITION BY",
              "Index the ORDER BY columns",
              "Avoid window functions for simple aggregations",
              "Use EXPLAIN QUERY PLAN to analyze performance",
            ],
          },
        ],
      },
      {
        id: "window-functions-fehler",
        title: "Common Window Function Mistakes",
        estimatedMinutes: 10,
        sections: [
          {
            id: "window-functions-fehler-liste",
            title: "The Most Common Window Function Mistakes",
            sectionType: "theory",
            content: `**Mistake 1: Window function in WHERE clause**
\`\`\`sql
-- WRONG: Window functions can't be used in WHERE
SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
FROM products
WHERE rank <= 3;  -- Error!

-- CORRECT: Use CTE or subquery
WITH ranked AS (
  SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
  FROM products
)
SELECT * FROM ranked WHERE rank <= 3;
\`\`\`

---

**Mistake 2: Missing ORDER BY in window function**
\`\`\`sql
-- WRONG: ROW_NUMBER without ORDER BY (non-deterministic!)
SELECT name, ROW_NUMBER() OVER () AS rank FROM products;

-- CORRECT: Always specify ORDER BY
SELECT name, ROW_NUMBER() OVER (ORDER BY price DESC) AS rank FROM products;
\`\`\`

---

**Mistake 3: Confusing RANK and DENSE_RANK**
\`\`\`sql
-- RANK: 1, 2, 2, 4 (gaps)
-- DENSE_RANK: 1, 2, 2, 3 (no gaps)
-- Use DENSE_RANK when you want consecutive rankings
\`\`\`

---

**Mistake 4: LAST_VALUE without frame**
\`\`\`sql
-- WRONG: LAST_VALUE without frame returns the current row
SELECT name, price, LAST_VALUE(price) OVER (ORDER BY price) AS last_price
FROM products;

-- CORRECT: Specify frame
SELECT name, price, LAST_VALUE(price) OVER (ORDER BY price ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_price
FROM products;
\`\`\`

---

**Mistake 5: Overusing window functions**
\`\`\`sql
-- OVERKILL: Window function for simple aggregation
SELECT category, SUM(price) OVER (PARTITION BY category) AS total
FROM products;

-- SIMPLER: GROUP BY
SELECT category, SUM(price) AS total
FROM products
GROUP BY category;
\`\`\``,
            keyTakeaways: [
              "Window functions can't be used in WHERE — use CTE or subquery",
              "Always specify ORDER BY in window functions",
              "RANK has gaps, DENSE_RANK has no gaps",
              "LAST_VALUE needs explicit frame specification",
              "Don't overuse window functions for simple aggregations",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 11: Grouping & Aggregation
  // ═══════════════════════════════════════════════════════════════
  {
    id: "gruppierung-aggregation",
    title: "Grouping & Aggregation",
    description: "GROUP BY, HAVING, and aggregate functions: summarizing and analyzing data.",
    icon: "group",
    difficulty: "junior",
    articles: [
      {
        id: "was-sind-aggregatfunktionen",
        title: "What are Aggregate Functions?",
        estimatedMinutes: 10,
        sections: [
          {
            id: "aggregatfunktionen-ueberblick",
            title: "Aggregate Functions Overview",
            sectionType: "theory",
            content: `**Aggregate functions** compute a single value from multiple rows. They are the foundation for reports, statistics, and data analysis.

**The five aggregate functions:**

| Function | Description | Example |
|----------|-------------|----------|
| COUNT() | Number of rows | \`COUNT(*)\` — all rows |
| SUM() | Sum | \`SUM(price)\` — total price |
| AVG() | Average | \`AVG(price)\` — average price |
| MIN() | Minimum | \`MIN(price)\` — cheapest product |
| MAX() | Maximum | \`MAX(price)\` — most expensive product |

**Important nuances:**
- \`COUNT(*)\` counts all rows, including NULL values
- \`COUNT(column)\` counts only non-NULL values
- \`COUNT(DISTINCT column)\` counts only unique values
- \`SUM()\`, \`AVG()\`, \`MIN()\`, \`MAX()\` ignore NULL values
- \`AVG()\` divides by the number of non-NULL values

**GROUP BY — Grouping rows:**
\`\`\`sql
SELECT category, COUNT(*) AS count, AVG(price) AS avg_price
FROM products
GROUP BY category;
\`\`\`

---

**HAVING — Filtering groups:**
\`\`\`sql
SELECT category, COUNT(*) AS count
FROM products
GROUP BY category
HAVING COUNT(*) > 5;
\`\`\`

---

**Execution order:**
1. FROM — Select table
2. WHERE — Filter rows
3. GROUP BY — Group rows
4. HAVING — Filter groups
5. SELECT — Select columns
6. ORDER BY — Sort
7. LIMIT — Limit rows`,
            keyTakeaways: [
              "COUNT, SUM, AVG, MIN, MAX are the five aggregate functions",
              "GROUP BY groups rows, HAVING filters groups",
              "COUNT(*) counts all rows, COUNT(column) ignores NULL",
              "Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 12: Indexes & Performance
  // ═══════════════════════════════════════════════════════════════
  {
    id: "indizes-performance",
    title: "Indexes & Performance",
    description: "Index types, query optimization, and EXPLAIN: Making queries faster.",
    icon: "speed",
    difficulty: "intermediate",
    articles: [
      {
        id: "was-sind-indizes",
        title: "What are Indexes?",
        estimatedMinutes: 12,
        sections: [
          {
            id: "indizes-grundlagen",
            title: "Indexes — The Table of Contents for Your Database",
            sectionType: "theory",
            content: `An **index** is a data structure that speeds up data retrieval at the cost of additional storage and slower write operations. Think of it like the index in a book: instead of reading every page to find a term, you look it up in the index and jump directly to the right page.

**How an index works:**
Without an index, the database must scan every row in the table (full table scan) to find matching rows. With an index on the search column, the database can jump directly to the matching rows — like looking up a word in a book's index.

**When to create indexes:**
- Columns frequently used in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Columns with high selectivity (many unique values)

**When NOT to create indexes:**
- Very small tables (< 100 rows)
- Columns with few unique values (boolean, gender)
- Columns that are frequently updated
- Tables with heavy write traffic

**Creating and dropping indexes:**
\`\`\`sql
-- Create index
CREATE INDEX idx_customers_email ON customers(email);

-- Create unique index
CREATE UNIQUE INDEX idx_customers_name ON customers(name);

-- Drop index
DROP INDEX idx_customers_email;
\`\`\`

---

**EXPLAIN QUERY PLAN — Analyze query execution:**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT * FROM customers WHERE email = 'anna@example.com';
\`\`\`

---

If you see \`SCAN TABLE customers\`, no index is being used. If you see \`SEARCH TABLE customers USING INDEX idx_customers_email\`, the index is being used.`,
            keyTakeaways: [
              "Index = table of contents for fast searching",
              "Speeds up reads, slows down writes",
              "Create indexes on WHERE, JOIN, ORDER BY columns",
              "Don't index small tables or low-selectivity columns",
            ],
          },
        ],
      },
    ],
  },
];