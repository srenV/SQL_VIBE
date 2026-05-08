/**
 * Lern-Inhalte fuer den Theorie-Hub der SQL-Trainer Plattform.
 *
 * Strukturierte Lernmodule mit Artikeln zu Normalisierung,
 * Relationenmodell, ERM, SQL-Grundlagen und mehr.
 *
 * English: Learning content for the theory hub of the SQL-Trainer platform.
 * Structured learning modules with articles on normalization,
 * relational model, ERM, SQL basics and more.
 */

import type { LearnModule } from "@/types/sandbox";

export const learnModules: LearnModule[] = [
  {
    id: "normalisierung",
    title: "Normalisierung",
    description: "Von der 1NF bis zur BCNF: Datenbankstrukturen optimieren und Anomalien vermeiden.",
    icon: "📐",
    articles: [
      {
        id: "was-ist-normalisierung",
        title: "Was ist Normalisierung?",
        estimatedMinutes: 5,
        sections: [
          {
            id: "einfuehrung",
            title: "Einführung",
            content: `Normalisierung ist der Prozess der Strukturierung einer relationalen Datenbank, um **Datenredundanz** (mehrfache Speicherung gleicher Daten) und **Anomalien** (Fehler beim Einfügen, Ändern oder Löschen) zu reduzieren.

Die Normalisierung basiert auf sogenannten **Normalformen** (NF), die jeweils bestimmte Bedingungen an die Struktur einer Tabelle stellen. Jede höhere Normalform setzt die vorherige voraus.

Die wichtigsten Normalformen sind:
- **1NF** (Erste Normalform) — Atomare Werte
- **2NF** (Zweite Normalform) — Volle funktionale Abhängigkeit
- **3NF** (Dritte Normalform) — Keine transitiven Abhängigkeiten
- **BCNF** (Boyce-Codd-Normalform) — Erweiterte 3NF`,
          },
          {
            id: "warum-normalisierung",
            title: "Warum Normalisierung?",
            content: `Ohne Normalisierung können folgende **Anomalien** auftreten:

**Einfüge-Anomalie (Insert Anomaly):**
Neue Daten können nicht eingefügt werden, weil andere Pflichtfelder fehlen.
*Beispiel:* Ein neuer Mitarbeiter kann nicht erfasst werden, bevor er einem Projekt zugeordnet ist.

**Änderungs-Anomalie (Update Anomaly):**
Änderungen müssen an mehreren Stellen durchgeführt werden, was zu Inkonsistenzen führen kann.
*Beispiel:* Ändert sich die Adresse eines Kunden, muss sie in allen Bestellungen aktualisiert werden.

**Lösch-Anomalie (Delete Anomaly):**
Das Löschen einer Zeile löscht versehentlich andere wichtige Informationen.
*Beispiel:* Wird das einzige Projekt eines Mitarbeiters gelöscht, geht auch die Mitarbeiter-Info verloren.`,
          },
        ],
      },
      {
        id: "erste-normalform",
        title: "Erste Normalform (1NF)",
        estimatedMinutes: 8,
        sections: [
          {
            id: "definition-1nf",
            title: "Definition",
            content: `Eine Tabelle befindet sich in der **1. Normalform**, wenn:

1. Jedes Attribut **atomare** (unteilbare) Werte enthält
2. Jede Zeile eindeutig identifizierbar ist (Primärschlüssel)
3. Keine wiederholenden Gruppen vorhanden sind
4. Die Reihenfolge der Zeilen und Spalten keine Bedeutung hat`,
          },
          {
            id: "beispiel-1nf",
            title: "Beispiel",
            content: `**Nicht in 1NF:**

| Student | Kurse |
|---------|-------|
| Anna | Mathematik, Physik, Chemie |
| Ben | Deutsch, Englisch |

Das Attribut "Kurse" enthält mehrere Werte → **Verletzung der 1NF**.

**In 1NF:**

| Student | Kurs |
|---------|------|
| Anna | Mathematik |
| Anna | Physik |
| Anna | Chemie |
| Ben | Deutsch |
| Ben | Englisch |

Jede Zelle enthält genau einen Wert → **1NF erfüllt**.`,
            sqlExample: `-- Beispiel: Tabelle in 1NF umwandeln
CREATE TABLE student_kurs (
  student VARCHAR(50) NOT NULL,
  kurs VARCHAR(50) NOT NULL,
  PRIMARY KEY (student, kurs)
);

INSERT INTO student_kurs VALUES
  ('Anna', 'Mathematik'),
  ('Anna', 'Physik'),
  ('Anna', 'Chemie'),
  ('Ben', 'Deutsch'),
  ('Ben', 'Englisch');`,
            setupSql: ``,
          },
        ],
      },
      {
        id: "zweite-normalform",
        title: "Zweite Normalform (2NF)",
        estimatedMinutes: 8,
        sections: [
          {
            id: "definition-2nf",
            title: "Definition",
            content: `Eine Tabelle befindet sich in der **2. Normalform**, wenn:

1. Sie in der **1NF** ist
2. Jedes Nicht-Schlüssel-Attribut **voll funktional abhängig** vom gesamten Primärschlüssel ist (keine partiellen Abhängigkeiten)

Das bedeutet: Wenn der Primärschlüssel aus mehreren Spalten besteht, darf kein Nicht-Schlüssel-Attribut von nur einem Teil des Schlüssels abhängen.`,
          },
          {
            id: "beispiel-2nf",
            title: "Beispiel",
            content: `**In 1NF, aber nicht in 2NF:**

| Student_ID | Kurs_ID | Student_Name | Kurs_Name | Note |
|------------|---------|--------------|-----------|------|
| 1 | 101 | Anna | Mathematik | 1 |
| 1 | 102 | Anna | Physik | 2 |
| 2 | 101 | Ben | Mathematik | 3 |

- **Student_Name** hängt nur von **Student_ID** ab (partielle Abhängigkeit!)
- **Kurs_Name** hängt nur von **Kurs_ID** ab (partielle Abhängigkeit!)

**In 2NF (aufgespalten):**

Tabelle **studenten**: (Student_ID → Student_Name)
Tabelle **kurse**: (Kurs_ID → Kurs_Name)
Tabelle **noten**: (Student_ID, Kurs_ID → Note)`,
            sqlExample: `-- 2NF: Tabellen aufspalten
CREATE TABLE studenten (
  student_id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE kurse (
  kurs_id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE noten (
  student_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  note INTEGER NOT NULL,
  PRIMARY KEY (student_id, kurs_id)
);`,
            setupSql: ``,
          },
        ],
      },
      {
        id: "dritte-normalform",
        title: "Dritte Normalform (3NF)",
        estimatedMinutes: 8,
        sections: [
          {
            id: "definition-3nf",
            title: "Definition",
            content: `Eine Tabelle befindet sich in der **3. Normalform**, wenn:

1. Sie in der **2NF** ist
2. Kein Nicht-Schlüssel-Attribut **transitiv** vom Primärschlüssel abhängt

Transitive Abhängigkeit: A → B → C (wenn A B bestimmt und B C bestimmt, dann hängt C transitiv von A ab).`,
          },
          {
            id: "beispiel-3nf",
            title: "Beispiel",
            content: `**In 2NF, aber nicht in 3NF:**

| Student_ID | Name | PLZ | Stadt |
|------------|------|-----|-------|
| 1 | Anna | 10115 | Berlin |
| 2 | Ben | 80331 | München |

- **Stadt** hängt von **PLZ** ab (transitive Abhängigkeit!)
- PLZ → Stadt, und Student_ID → PLZ, also Student_ID → PLZ → Stadt

**In 3NF (aufgespalten):**

Tabelle **studenten**: (Student_ID → Name, PLZ)
Tabelle **postleitzahlen**: (PLZ → Stadt)`,
            sqlExample: `-- 3NF: Transitive Abhängigkeit auflösen
CREATE TABLE postleitzahlen (
  plz VARCHAR(5) PRIMARY KEY,
  stadt VARCHAR(50) NOT NULL
);

CREATE TABLE studenten_3nf (
  student_id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  plz VARCHAR(5) NOT NULL
);`,
            setupSql: ``,
          },
        ],
      },
    ],
  },
  {
    id: "relationenmodell",
    title: "Relationenmodell",
    description: "Relationen, Schlüssel, Integritätsbedingungen und die mathematischen Grundlagen relationaler Datenbanken.",
    icon: "🔗",
    articles: [
      {
        id: "grundbegriffe-rm",
        title: "Grundbegriffe des Relationenmodells",
        estimatedMinutes: 6,
        sections: [
          {
            id: "relation-attribut-tupel",
            title: "Relation, Attribut, Tupel",
            content: `Das **Relationenmodell** wurde 1970 von Edgar F. Codd eingeführt und ist die theoretische Grundlage relationaler Datenbanken.

**Kernbegriffe:**

| RM-Begriff | SQL-Begriff | Umgangssprachlich |
|------------|-------------|-------------------|
| Relation | Tabelle | Tabelle |
| Attribut | Spalte | Feld |
| Tupel | Zeile | Datensatz |
| Domäne | Datentyp | Wertebereich |
| Primärschlüssel | PRIMARY KEY | Eindeutiger Schlüssel |

Eine **Relation** ist eine Menge von **Tupeln** (Zeilen) über einer Menge von **Attributen** (Spalten). Jedes Attribut hat eine **Domäne** (Wertebereich).`,
          },
          {
            id: "schluessel",
            title: "Schlüssel",
            content: `**Superschlüssel (Super Key):**
Eine Menge von Attributen, die jedes Tupel eindeutig identifiziert.

**Kandidatenschlüssel (Candidate Key):**
Ein minimaler Superschlüssel — kein Attribut kann entfernt werden, ohne die Eindeutigkeit zu verlieren.

**Primärschlüssel (Primary Key):**
Der vom Datenbankdesigner ausgewählte Kandidatenschlüssel.

**Fremdschlüssel (Foreign Key):**
Ein Attribut (oder eine Attributkombination), das auf den Primärschlüssel einer anderen Relation verweist.`,
          },
        ],
      },
    ],
  },
  {
    id: "erm",
    title: "Entity-Relationship-Modell",
    description: "Entitäten, Beziehungen, Kardinalitäten und die Transformation vom ERM zum Relationenmodell.",
    icon: "📊",
    articles: [
      {
        id: "erm-grundlagen",
        title: "ERM-Grundlagen",
        estimatedMinutes: 7,
        sections: [
          {
            id: "entitaeten-attribute",
            title: "Entitäten und Attribute",
            content: `Das **Entity-Relationship-Modell (ERM)** wurde 1976 von Peter Chen entwickelt und ist das wichtigste Konzeptuelle Datenmodell.

**Entität (Entity):**
Ein Objekt der realen Welt, das im Datenmodell abgebildet werden soll.
*Beispiele:* Kunde, Produkt, Bestellung

**Attribut (Attribute):**
Eine Eigenschaft einer Entität.
*Beispiele:* Name, Preis, Datum

**Entitätstyp (Entity Type):**
Die Klasse aller Entitäten mit gleichen Attributen.
*Beispiel:* "Kunde" ist der Entitätstyp, "Anna Müller" ist eine konkrete Entität.

**Schlüsselattribut (Key Attribute):**
Ein Attribut, das jede Entität eindeutig identifiziert (wird im ERM unterstrichen dargestellt).`,
          },
          {
            id: "beziehungen-kardinalitaeten",
            title: "Beziehungen und Kardinalitäten",
            content: `**Beziehung (Relationship):**
Verknüpfung zwischen zwei oder mehr Entitäten.
*Beispiel:* "bestellt" verbindet Kunde und Produkt.

**Kardinalitäten** beschreiben, wie viele Entitäten einer Seite mit wie vielen der anderen Seite verknüpft sein können:

| Notation | Bedeutung | Beispiel |
|----------|-----------|----------|
| 1:1 | Ein-zu-Ein | Ein Kunde hat genau einen Ausweis |
| 1:n | Ein-zu-Viel | Ein Kunde hat viele Bestellungen |
| n:m | Viel-zu-Viel | Ein Student besucht viele Kurse, ein Kurs hat viele Studenten |

**Wichtig:** n:m-Beziehungen müssen im Relationenmodell durch eine **Verknüpfungstabelle** aufgelöst werden!`,
          },
          {
            id: "erm-zu-rm",
            title: "Transformation ERM → Relationenmodell",
            content: `Die Transformation vom ERM zum Relationenmodell folgt festen Regeln:

**1. Entitätstyp → Tabelle**
Jeder Entitätstyp wird zu einer Tabelle. Die Attribute werden zu Spalten.

**2. 1:1-Beziehung → Fremdschlüssel**
Der Primärschlüssel einer Tabelle wird als Fremdschlüssel in die andere Tabelle übernommen.

**3. 1:n-Beziehung → Fremdschlüssel auf der n-Seite**
Der Primärschlüssel der "1-Seite" wird als Fremdschlüssel in die Tabelle der "n-Seite" eingefügt.

**4. n:m-Beziehung → Verknüpfungstabelle**
Eine neue Tabelle wird erstellt, die die Primärschlüssel beider Entitäten als Fremdschlüssel enthält.`,
            sqlExample: `-- ERM zu SQL: n:m-Beziehung
-- Student ←n:m→ Kurs

-- Entität: Student
CREATE TABLE studenten (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Entität: Kurs
CREATE TABLE kurse (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- n:m-Beziehung → Verknüpfungstabelle
CREATE TABLE belegungen (
  student_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  semester VARCHAR(10) NOT NULL,
  PRIMARY KEY (student_id, kurs_id)
);`,
            setupSql: ``,
          },
        ],
      },
    ],
  },
  {
    id: "sql-grundlagen",
    title: "SQL-Grundlagen",
    description: "SELECT, WHERE, ORDER BY, Aggregation und die wichtigsten SQL-Klauseln.",
    icon: "💻",
    articles: [
      {
        id: "select-where",
        title: "SELECT und WHERE",
        estimatedMinutes: 6,
        sections: [
          {
            id: "select-syntax",
            title: "SELECT-Syntax",
            content: `**SELECT** ist die grundlegendste SQL-Anweisung zum Abfragen von Daten.

\`\`\`sql
SELECT spalte1, spalte2, ...
FROM tabelle
WHERE bedingung;
\`\`\`

**Wichtige Klauseln:**
- \`SELECT *\` — Alle Spalten
- \`DISTINCT\` — Doppelte Zeilen entfernen
- \`WHERE\` — Zeilen filtern
- \`ORDER BY\` — Sortieren (ASC/DESC)
- \`LIMIT n\` — Nur die ersten n Zeilen`,
            sqlExample: `SELECT name, preis
FROM produkte
WHERE kategorie_id = 1
ORDER BY preis DESC
LIMIT 10;`,
            setupSql: `CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kategorie_id INTEGER NOT NULL,
  preis DECIMAL(10,2) NOT NULL
);
INSERT INTO produkte VALUES
  (1, 'Laptop', 1, 999.99),
  (2, 'Maus', 1, 29.99),
  (3, 'Tastatur', 1, 79.99),
  (4, 'Monitor', 2, 349.99),
  (5, 'Kabel', 2, 12.99);`,
          },
        ],
      },
    ],
  },
  {
    id: "joins",
    title: "Joins",
    description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, Self-Join und wie Tabellen verknüpft werden.",
    icon: "🔀",
    articles: [
      {
        id: "join-grundlagen",
        title: "JOIN-Grundlagen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "inner-join",
            title: "INNER JOIN",
            content: `**INNER JOIN** verknüpft zwei Tabellen und liefert nur die Zeilen, bei denen die Join-Bedingung in **beiden** Tabellen erfüllt ist.

\`\`\`sql
SELECT a.spalte, b.spalte
FROM tabelle_a a
INNER JOIN tabelle_b b ON a.fk = b.pk;
\`\`\`

**Venn-Diagramm-Vorstellung:** Nur die Schnittmenge beider Tabellen wird zurückgegeben.`,
            sqlExample: `SELECT k.name, b.datum, b.gesamtbetrag
FROM kunden k
INNER JOIN bestellungen b ON k.id = b.kunde_id
ORDER BY b.datum DESC;`,
            setupSql: `CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  gesamtbetrag DECIMAL(10,2) NOT NULL
);
INSERT INTO kunden VALUES (1, 'Anna'), (2, 'Ben'), (3, 'Clara');
INSERT INTO bestellungen VALUES
  (1, 1, '2024-01-15', 99.99),
  (2, 1, '2024-02-20', 149.50),
  (3, 2, '2024-03-10', 59.99);`,
          },
          {
            id: "left-join",
            title: "LEFT JOIN",
            content: `**LEFT JOIN** (LEFT OUTER JOIN) liefert **alle** Zeilen der linken Tabelle und die übereinstimmenden Zeilen der rechten Tabelle. Fehlt ein Match, werden NULL-Werte eingesetzt.

\`\`\`sql
SELECT a.spalte, b.spalte
FROM tabelle_a a
LEFT JOIN tabelle_b b ON a.fk = b.pk;
\`\`\`

**Praktischer Nutzen:** Finde alle Kunden, auch die ohne Bestellungen.`,
            sqlExample: `SELECT k.name, b.datum, b.gesamtbetrag
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
ORDER BY k.name;`,
            setupSql: `CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  gesamtbetrag DECIMAL(10,2) NOT NULL
);
INSERT INTO kunden VALUES (1, 'Anna'), (2, 'Ben'), (3, 'Clara');
INSERT INTO bestellungen VALUES
  (1, 1, '2024-01-15', 99.99),
  (2, 2, '2024-03-10', 59.99);`,
          },
        ],
      },
    ],
  },
  {
    id: "ddl",
    title: "DDL — Datendefinition",
    description: "CREATE TABLE, Datentypen, Constraints, ALTER TABLE und DROP TABLE.",
    icon: "🏗️",
    articles: [
      {
        id: "create-table",
        title: "CREATE TABLE",
        estimatedMinutes: 8,
        sections: [
          {
            id: "syntax-create-table",
            title: "Syntax",
            content: `**CREATE TABLE** erstellt eine neue Tabelle mit Spalten, Datentypen und Constraints.

\`\`\`sql
CREATE TABLE tabellenname (
  spalte1 datentyp [constraint],
  spalte2 datentyp [constraint],
  ...
  [tabellen_constraint]
);
\`\`\`

**Wichtige Datentypen (MySQL):**
- \`INTEGER\` / \`INT\` — Ganzzahlen
- \`VARCHAR(n)\` — Zeichenketten (max. n Zeichen)
- \`DECIMAL(p,s)\` — Dezimalzahlen
- \`DATE\` — Datum
- \`BOOLEAN\` — Wahrheitswert
- \`TEXT\` — Lange Texte

**Wichtige Constraints:**
- \`PRIMARY KEY\` — Primärschlüssel
- \`NOT NULL\` — Pflichtfeld
- \`UNIQUE\` — Eindeutig
- \`FOREIGN KEY\` — Fremdschlüssel
- \`DEFAULT\` — Standardwert
- \`CHECK\` — Bedingung`,
            sqlExample: `CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  vorname VARCHAR(50) NOT NULL,
  nachname VARCHAR(50) NOT NULL,
  abteilung_id INTEGER NOT NULL,
  gehalt DECIMAL(10,2) DEFAULT 0,
  eingestellt_am DATE NOT NULL
);`,
            setupSql: ``,
          },
        ],
      },
    ],
  },
];

/** Alle Modul-IDs. */
export const allModuleIds = learnModules.map((m) => m.id);

/** Findet ein Modul anhand der ID. */
export function getModuleById(id: string): LearnModule | undefined {
  return learnModules.find((m) => m.id === id);
}

/** Findet einen Artikel anhand von Modul-ID und Artikel-ID. */
export function getArticle(moduleId: string, articleId: string) {
  const mod = getModuleById(moduleId);
  if (!mod) return undefined;
  return mod.articles.find((a) => a.id === articleId);
}

/** Gesamtzahl der Artikel in allen Modulen. */
export const totalArticles = learnModules.reduce(
  (sum, mod) => sum + mod.articles.length,
  0
);

/** Alle Artikel-Pfade als { moduleId, articleId } fuer generateStaticParams. */
export const allArticlePaths = learnModules.flatMap((mod) =>
  mod.articles.map((article) => ({
    moduleId: mod.id,
    articleId: article.id,
  }))
);