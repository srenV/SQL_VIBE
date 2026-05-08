/**
 * Lern-Inhalte fuer den Theorie-Hub der SQL-Trainer Plattform.
 *
 * Strukturierte Lernmodule mit Artikeln zu Normalisierung,
 * Relationenmodell, ERM, SQL-Grundlagen und mehr.
 * Jedes Modul hat einen Schwierigkeitsgrad, jeder Artikel hat
 * mehrere Abschnitte mit sectionType, keyTakeaways und optionalen
 * Widgets (ERM-Diagramm, NF-Checker, RM-to-SQL, Mini-Playground).
 *
 * English: Learning content for the theory hub of the SQL-Trainer platform.
 * Structured learning modules with articles on normalization,
 * relational model, ERM, SQL basics and more.
 */

import type { LearnModule } from "@/types/sandbox";

export const learnModules: LearnModule[] = [
  // ═══════════════════════════════════════════════════════════════
  // MODUL 1: Normalisierung
  // ═══════════════════════════════════════════════════════════════
  {
    id: "normalisierung",
    title: "Normalisierung",
    description: "Von der 1NF bis zur BCNF: Datenbankstrukturen optimieren und Anomalien vermeiden.",
    icon: "ruler",
    difficulty: "junior",
    articles: [
      {
        id: "was-ist-normalisierung",
        title: "Was ist Normalisierung?",
        estimatedMinutes: 12,
        sections: [
          {
            id: "einfuehrung",
            title: "Einführung in die Normalisierung",
            sectionType: "theory",
            content: `Normalisierung ist der Prozess der Strukturierung einer relationalen Datenbank, um **Datenredundanz** (mehrfache Speicherung gleicher Daten) und **Anomalien** (Fehler beim Einfügen, Ändern oder Löschen) zu reduzieren.

Die Normalisierung wurde von **Edgar F. Codd** 1970 eingeführt und ist bis heute eines der wichtigsten Konzepte im Datenbankdesign. Sie basiert auf sogenannten **Normalformen** (NF), die jeweils bestimmte Bedingungen an die Struktur einer Tabelle stellen.

Jede höhere Normalform setzt die vorherige voraus:

- **1NF** (Erste Normalform) — Atomare Werte, keine wiederholenden Gruppen
- **2NF** (Zweite Normalform) — Volle funktionale Abhängigkeit
- **3NF** (Dritte Normalform) — Keine transitiven Abhängigkeiten
- **BCNF** (Boyce-Codd-Normalform) — Erweiterte 3NF

Das Ziel der Normalisierung ist **Datenintegrität**: Jedes Fakt wird genau einmal gespeichert, wodurch Inkonsistenzen vermieden werden.`,
            keyTakeaways: [
              "Normalisierung reduziert Datenredundanz und Anomalien",
              "Jede Normalform baut auf der vorherigen auf",
              "Von Codd 1970 eingeführt, bis heute relevant",
              "Ziel: Datenintegrität durch einmalige Speicherung jedes Fakts",
            ],
          },
          {
            id: "warum-normalisierung",
            title: "Warum Normalisierung?",
            sectionType: "example",
            content: `Ohne Normalisierung können folgende **Anomalien** auftreten:

**Einfüge-Anomalie (Insert Anomaly):**
Neue Daten können nicht eingefügt werden, weil andere Pflichtfelder fehlen.
*Beispiel:* Ein neuer Mitarbeiter kann nicht erfasst werden, bevor er einem Projekt zugeordnet ist.

**Änderungs-Anomalie (Update Anomaly):**
Änderungen müssen an mehreren Stellen durchgeführt werden, was zu Inkonsistenzen führen kann.
*Beispiel:* Ändert sich die Adresse eines Kunden, muss sie in allen Bestellungen aktualisiert werden — vergisst man eine, sind die Daten inkonsistent.

**Lösch-Anomalie (Delete Anomaly):**
Das Löschen einer Zeile löscht versehentlich andere wichtige Informationen.
*Beispiel:* Wird das einzige Projekt eines Mitarbeiters gelöscht, geht auch die Mitarbeiter-Info verloren.

Diese Anomalien entstehen durch **Datenredundanz**: dieselbe Information wird an mehreren Stellen gespeichert, was zu Inkonsistenzen führt, wenn nicht alle Kopien synchron gehalten werden.`,
            keyTakeaways: [
              "Drei Anomalie-Typen: Einfüge-, Änderungs- und Lösch-Anomalie",
              "Ursache ist Datenredundanz — dieselbe Info an mehreren Stellen",
              "Normalisierung verhindert Anomalien durch Strukturierung",
            ],
          },
          {
            id: "normalisierung-ueberblick",
            title: "Überblick: Die Normalformen",
            sectionType: "summary",
            content: `Hier ist ein Überblick über die wichtigsten Normalformen und ihre Bedingungen:

| Normalform | Bedingung | Verhindert |
|------------|-----------|------------|
| 1NF | Atomare Werte, keine wiederholenden Gruppen | Listen in Zellen |
| 2NF | 1NF + volle funktionale Abhängigkeit | Partielle Abhängigkeiten |
| 3NF | 2NF + keine transitiven Abhängigkeiten | Indirekte Abhängigkeiten |
| BCNF | 3NF + jede Determinante ist Kandidatenschlüssel | Überlappende Kandidatenschlüssel |

In der Praxis werden die meisten Datenbanken bis zur **3NF** normalisiert. Die BCNF ist eine strengere Variante der 3NF, die in speziellen Fällen relevant wird.`,
          },
        ],
      },
      {
        id: "erste-normalform",
        title: "Erste Normalform (1NF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-1nf",
            title: "Definition der 1NF",
            sectionType: "theory",
            content: `Eine Tabelle befindet sich in der **1. Normalform**, wenn:

1. Jedes Attribut **atomare** (unteilbare) Werte enthält — keine Listen, Arrays oder verschachtelten Werte
2. Jede Zeile eindeutig identifizierbar ist (**Primärschlüssel**)
3. Keine wiederholenden Gruppen vorhanden sind (keine Spalten wie "Kurs1", "Kurs2", "Kurs3")
4. Die Reihenfolge der Zeilen und Spalten keine Bedeutung hat

**Atomar** bedeutet: Jede Zelle enthält genau einen Wert, der nicht weiter aufgeteilt werden sollte. Ein vollständiger Name "Anna Müller" ist atomar, wenn er als ein Konzept behandelt wird. Eine Liste "Mathematik, Physik, Chemie" in einer Zelle ist **nicht atomar**.`,
            keyTakeaways: [
              "1NF verlangt atomare (unteilbare) Werte in jeder Zelle",
              "Keine Listen, Arrays oder verschachtelten Werte",
              "Jede Zeile braucht einen eindeutigen Primärschlüssel",
              "Keine wiederholenden Gruppen (keine Spalten wie Kurs1, Kurs2, ...)",
            ],
          },
          {
            id: "beispiel-1nf",
            title: "Beispiel: Umwandlung in 1NF",
            sectionType: "example",
            content: `**Nicht in 1NF — Verletzung der Atomarität:**

| Student | Kurse |
|---------|-------|
| Anna | Mathematik, Physik, Chemie |
| Ben | Deutsch, Englisch |

Das Attribut "Kurse" enthält mehrere Werte → **Verletzung der 1NF**.

**Nicht in 1NF — Wiederholende Gruppen:**

| Student | Kurs1 | Kurs2 | Kurs3 |
|---------|-------|-------|-------|
| Anna | Mathe | Physik | Chemie |
| Ben | Deutsch | Englisch | NULL |

Die Spalten Kurs1, Kurs2, Kurs3 sind eine wiederholende Gruppe → **Verletzung der 1NF**.

**In 1NF — Korrekte Struktur:**

| Student | Kurs |
|---------|------|
| Anna | Mathematik |
| Anna | Physik |
| Anna | Chemie |
| Ben | Deutsch |
| Ben | Englisch |

Jede Zelle enthält genau einen Wert → **1NF erfüllt**.`,
          },
        ],
      },
      {
        id: "zweite-normalform",
        title: "Zweite Normalform (2NF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-2nf",
            title: "Definition der 2NF",
            sectionType: "theory",
            content: `Eine Tabelle befindet sich in der **2. Normalform**, wenn:

1. Sie in der **1NF** ist
2. Jedes Nicht-Schlüssel-Attribut **voll funktional abhängig** vom gesamten Primärschlüssel ist

**Volle funktionale Abhängigkeit** bedeutet: Wenn der Primärschlüssel aus mehreren Spalten besteht, darf kein Nicht-Schlüssel-Attribut von nur einem **Teil** des Schlüssels abhängen.

**Partielle Abhängigkeit** tritt nur auf, wenn der Primärschlüssel **zusammengesetzt** ist (aus mehreren Spalten besteht). Bei einem einfachen Primärschlüssel ist die 2NF automatisch erfüllt, wenn die 1NF gilt.`,
            keyTakeaways: [
              "2NF setzt 1NF voraus",
              "Keine partiellen Abhängigkeiten vom Primärschlüssel",
              "Partielle Abhängigkeiten treten nur bei zusammengesetzten Schlüsseln auf",
              "Lösung: Tabelle aufspalten, um Abhängigkeiten zu trennen",
            ],
          },
          {
            id: "beispiel-2nf",
            title: "Beispiel: Umwandlung in 2NF",
            sectionType: "example",
            content: `**In 1NF, aber nicht in 2NF:**

| Student_ID | Kurs_ID | Student_Name | Kurs_Name | Note |
|------------|---------|--------------|-----------|------|
| 1 | 101 | Anna | Mathematik | 1 |
| 1 | 102 | Anna | Physik | 2 |
| 2 | 101 | Ben | Mathematik | 3 |

- **Student_Name** hängt nur von **Student_ID** ab (partielle Abhängigkeit!)
- **Kurs_Name** hängt nur von **Kurs_ID** ab (partielle Abhängigkeit!)
- Nur **Note** hängt vom gesamten Schlüssel (Student_ID, Kurs_ID) ab

**In 2NF — Aufgespalten in drei Tabellen:**

Tabelle **studenten**: (Student_ID → Student_Name)
Tabelle **kurse**: (Kurs_ID → Kurs_Name)
Tabelle **noten**: (Student_ID, Kurs_ID → Note)`,
          },
        ],
      },
      {
        id: "dritte-normalform",
        title: "Dritte Normalform (3NF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-3nf",
            title: "Definition der 3NF",
            sectionType: "theory",
            content: `Eine Tabelle befindet sich in der **3. Normalform**, wenn:

1. Sie in der **2NF** ist
2. Kein Nicht-Schlüssel-Attribut **transitiv** vom Primärschlüssel abhängt

**Transitive Abhängigkeit** bedeutet: A → B → C. Wenn Attribut A das Attribut B bestimmt, und B wiederum das Attribut C bestimmt, dann hängt C **transitiv** von A ab.

Das Problem: Ändert sich B, müssen alle abhängigen C-Werte aktualisiert werden. Und: C könnte existieren, ohne dass es einen direkten Bezug zu A gibt.`,
            keyTakeaways: [
              "3NF setzt 2NF voraus",
              "Keine transitiven Abhängigkeiten (A → B → C)",
              "Jedes Nicht-Schlüssel-Attribut hängt direkt vom Primärschlüssel ab",
              "Lösung: Tabelle aufspalten, um indirekte Abhängigkeiten zu entfernen",
            ],
          },
          {
            id: "beispiel-3nf",
            title: "Beispiel: Umwandlung in 3NF",
            sectionType: "example",
            content: `**In 2NF, aber nicht in 3NF:**

| Student_ID | Name | PLZ | Stadt |
|------------|------|-----|-------|
| 1 | Anna | 10115 | Berlin |
| 2 | Ben | 80331 | München |

- **Stadt** hängt von **PLZ** ab (transitive Abhängigkeit!)
- PLZ → Stadt, und Student_ID → PLZ, also Student_ID → PLZ → Stadt

**In 3NF — Aufgespalten:**

Tabelle **studenten**: (Student_ID → Name, PLZ)
Tabelle **postleitzahlen**: (PLZ → Stadt)`,
          },
        ],
      },
      {
        id: "bcnf",
        title: "Boyce-Codd-Normalform (BCNF)",
        estimatedMinutes: 15,
        sections: [
          {
            id: "definition-bcnf",
            title: "Definition der BCNF",
            sectionType: "theory",
            content: `Die **Boyce-Codd-Normalform (BCNF)** ist eine strengere Variante der 3NF. Eine Tabelle befindet sich in der BCNF, wenn:

1. Sie in der **3NF** ist
2. Für jede funktionale Abhängigkeit X → Y gilt: **X ist ein Superschlüssel**

Anders gesagt: Jede **Determinante** (linke Seite einer funktionalen Abhängigkeit) muss ein **Kandidatenschlüssel** sein.

Die BCNF löst ein spezielles Problem der 3NF: Wenn eine Tabelle mehrere überlappende Kandidatenschlüssel hat, kann es in der 3NF noch zu Anomalien kommen.

**Wann ist BCNF relevant?**
- Wenn eine Tabelle mehrere Kandidatenschlüssel hat
- Wenn diese Kandidatenschlüssel sich überschneiden (überlappende Attribute)
- In der Praxis ist dieser Fall selten, aber wichtig zu kennen.`,
            keyTakeaways: [
              "BCNF ist eine strengere Variante der 3NF",
              "Jede Determinante muss ein Kandidatenschlüssel sein",
              "Relevant bei überlappenden Kandidatenschlüsseln",
              "In der Praxis meist automatisch erfüllt, wenn 3NF gilt",
            ],
          },
          {
            id: "beispiel-bcnf",
            title: "Beispiel: BCNF-Verletzung",
            sectionType: "example",
            content: `**In 3NF, aber nicht in BCNF:**

Ein Kurs kann von genau einem Dozenten unterrichtet werden, aber ein Dozent kann mehrere Kurse leiten. Ein Student hat für jeden Kurs genau einen Dozenten.

| Student | Kurs | Dozent |
|---------|------|--------|
| Anna | Mathe | Prof. Müller |
| Anna | Physik | Prof. Schmidt |
| Ben | Mathe | Prof. Müller |

**Funktionale Abhängigkeiten:**
- (Student, Kurs) → Dozent  ← Primärschlüssel
- Dozent → Kurs  ← Dozent bestimmt den Kurs, aber Dozent ist KEIN Kandidatenschlüssel!

**Problem:** Dozent → Kurs ist eine funktionale Abhängigkeit, bei der die Determinante (Dozent) kein Kandidatenschlüssel ist.

**In BCNF — Aufgespalten:**

Tabelle **belegungen**: (Student, Dozent) — Primärschlüssel
Tabelle **dozenten_kurse**: (Dozent → Kurs) — Dozent ist jetzt Primärschlüssel`,
          },
        ],
      },
      {
        id: "normalisierung-praxis",
        title: "Normalisierung in der Praxis",
        estimatedMinutes: 12,
        sections: [
          {
            id: "wann-normalisieren",
            title: "Wann normalisieren — und wann nicht?",
            sectionType: "theory",
            content: `In der Praxis wird **fast immer bis zur 3NF** normalisiert. Die BCNF wird nur in speziellen Fällen angestrebt. Aber es gibt auch gute Gründe, **bewusst zu denormalisieren**:

**Gründe für Denormalisierung:**
- **Performance**: JOINs über viele Tabellen können langsam sein. Eine denormalisierte Tabelle kann Abfragen beschleunigen.
- **Einfachere Abfragen**: Weniger JOINs bedeuten einfachere SQL-Statements.
- **Reporting**: Data Warehouses werden oft bewusst denormalisiert (Star-Schema, Snowflake-Schema).

**Gründe gegen Denormalisierung:**
- **Datenintegrität**: Redundanz führt zu Anomalien.
- **Wartbarkeit**: Änderungen müssen an mehreren Stellen durchgeführt werden.
- **Speicherplatz**: Redundante Daten benötigen mehr Speicher.

**Best Practice:**
1. Zuerst normalisieren (mindestens 3NF)
2. Dann gezielt denormalisieren, wenn Performance-Probleme auftreten
3. Denormalisierung dokumentieren und begründen`,
            keyTakeaways: [
              "In der Praxis: mindestens 3NF anstreben",
              "Denormalisierung kann Performance verbessern, aber Integrität gefährden",
              "Best Practice: Erst normalisieren, dann gezielt denormalisieren",
              "Data Warehouses nutzen bewusst denormalisierte Schemata",
            ],
          },
          {
            id: "normalisierung-prozess",
            title: "Der Normalisierungs-Prozess",
            sectionType: "summary",
            content: `Der Normalisierungs-Prozess folgt einem systematischen Ansatz:

**Schritt 1: Unnormalisierte Daten identifizieren**
Sammle alle Attribute und identifiziere wiederholende Gruppen und nicht-atomare Werte.

**Schritt 2: 1NF erreichen**
- Wiederholende Gruppen in separate Zeilen umwandeln
- Zusammengesetzte Attribute aufteilen
- Primärschlüssel definieren

**Schritt 3: 2NF erreichen**
- Partielle Abhängigkeiten identifizieren
- Tabelle aufspalten: Attribute, die nur von einem Teil des Schlüssels abhängen, in eigene Tabellen auslagern

**Schritt 4: 3NF erreichen**
- Transitive Abhängigkeiten identifizieren
- Tabelle aufspalten: Attribute, die von einem Nicht-Schlüssel-Attribut abhängen, in eigene Tabellen auslagern

**Schritt 5: BCNF prüfen**
- Überlappende Kandidatenschlüssel identifizieren
- Bei Bedarf weitere Aufspaltung vornehmen

Jeder Schritt baut auf dem vorherigen auf — man kann nicht 3NF erreichen, ohne zuerst 1NF und 2NF zu erfüllen.`,
            widget: {
              type: "nf-checker",
              data: {
                question: {
                  tableName: "Bestellungen",
                  columns: [
                    { name: "Bestell_ID", isPrimaryKey: true },
                    { name: "Kunde_ID", isForeignKey: true },
                    { name: "Kunde_Name" },
                    { name: "Kunde_PLZ" },
                    { name: "Kunde_Stadt" },
                    { name: "Produkt_ID", isForeignKey: true },
                    { name: "Menge" },
                    { name: "Bestelldatum" },
                  ],
                  rows: [
                    { Bestell_ID: "1", Kunde_ID: "K01", Kunde_Name: "Anna", Kunde_PLZ: "10115", Kunde_Stadt: "Berlin", Produkt_ID: "P01", Menge: "3", Bestelldatum: "2024-01-15" },
                    { Bestell_ID: "2", Kunde_ID: "K01", Kunde_Name: "Anna", Kunde_PLZ: "10115", Kunde_Stadt: "Berlin", Produkt_ID: "P02", Menge: "1", Bestelldatum: "2024-01-20" },
                    { Bestell_ID: "3", Kunde_ID: "K02", Kunde_Name: "Ben", Kunde_PLZ: "80331", Kunde_Stadt: "München", Produkt_ID: "P01", Menge: "5", Bestelldatum: "2024-02-01" },
                  ],
                  correctAnswer: "3NF",
                  explanation: "Die Tabelle verletzt die 3NF, weil Kunde_Stadt transitiv von Bestell_ID abhängt: Bestell_ID → Kunde_ID → (Kunde_Name, Kunde_PLZ, Kunde_Stadt). Kunde_Name, PLZ und Stadt hängen nur von Kunde_ID ab, nicht direkt vom Primärschlüssel Bestell_ID. Lösung: Aufspalten in Bestellungen, Kunden und Postleitzahlen.",
                },
              },
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 2: Relationenmodell
  // ═══════════════════════════════════════════════════════════════
  {
    id: "relationenmodell",
    title: "Relationenmodell",
    description: "Relationen, Schlüssel, Integritätsbedingungen und die mathematischen Grundlagen relationaler Datenbanken.",
    icon: "link",
    difficulty: "junior",
    articles: [
      {
        id: "grundbegriffe-rm",
        title: "Grundbegriffe des Relationenmodells",
        estimatedMinutes: 10,
        sections: [
          {
            id: "relation-attribut-tupel",
            title: "Relation, Attribut, Tupel",
            sectionType: "theory",
            content: `Das **Relationenmodell** wurde 1970 von Edgar F. Codd eingeführt und ist die theoretische Grundlage relationaler Datenbanken.

**Kernbegriffe:**

| RM-Begriff | SQL-Begriff | Umgangssprachlich |
|------------|-------------|-------------------|
| Relation | Tabelle | Tabelle |
| Attribut | Spalte | Feld |
| Tupel | Zeile | Datensatz |
| Domäne | Datentyp | Wertebereich |
| Primärschlüssel | PRIMARY KEY | Eindeutiger Schlüssel |

Eine **Relation** ist eine Menge von **Tupeln** (Zeilen) über einer Menge von **Attributen** (Spalten). Jedes Attribut hat eine **Domäne** (Wertebereich) — z.B. ist die Domäne von "Alter" die Menge der natürlichen Zahlen.

Wichtig: Eine Relation ist eine **Menge** — die Reihenfolge der Zeilen und Spalten hat keine Bedeutung. SQL garantiert diese Eigenschaft nicht immer (z.B. bei ORDER BY), aber das Relationenmodell setzt sie voraus.`,
            keyTakeaways: [
              "Relation = Tabelle, Tupel = Zeile, Attribut = Spalte",
              "Domäne = erlaubter Wertebereich eines Attributs",
              "Relationen sind Mengen — Reihenfolge ist irrelevant",
              "Von Codd 1970 eingeführt als mathematische Grundlage",
            ],
          },
          {
            id: "schluessel",
            title: "Schlüssel und Abhängigkeiten",
            sectionType: "theory",
            content: `**Superschlüssel (Super Key):**
Eine Menge von Attributen, die jedes Tupel eindeutig identifiziert. Jede Relation hat mindestens einen Superschlüssel (die Menge aller Attribute).

**Kandidatenschlüssel (Candidate Key):**
Ein minimaler Superschlüssel — kein Attribut kann entfernt werden, ohne die Eindeutigkeit zu verlieren. Eine Relation kann mehrere Kandidatenschlüssel haben.

**Primärschlüssel (Primary Key):**
Der vom Datenbankdesigner ausgewählte Kandidatenschlüssel. Er wird in SQL mit \`PRIMARY KEY\` definiert.

**Fremdschlüssel (Foreign Key):**
Ein Attribut (oder eine Attributkombination), das auf den Primärschlüssel einer anderen Relation verweist. Fremdschlüssel erstellen Beziehungen zwischen Tabellen.

**Funktionale Abhängigkeit:**
X → Y bedeutet: Wenn zwei Tupel in X übereinstimmen, stimmen sie auch in Y überein. Beispiel: Matrikelnummer → Name (die Matrikelnummer bestimmt eindeutig den Namen).`,
            keyTakeaways: [
              "Superschlüssel: Menge von Attributen, die ein Tupel eindeutig identifiziert",
              "Kandidatenschlüssel: Minimaler Superschlüssel",
              "Primärschlüssel: Vom Designer ausgewählter Kandidatenschlüssel",
              "Fremdschlüssel: Verweis auf den Primärschlüssel einer anderen Relation",
              "Funktionale Abhängigkeit X → Y: X bestimmt Y eindeutig",
            ],
          },
          {
            id: "relationale-operationen",
            title: "Relationale Operationen",
            sectionType: "theory",
            content: `Die relationale Algebra definiert Operationen auf Relationen, die die Grundlage für SQL bilden:

**Grundoperationen:**

| Operation | Symbol | SQL-Entsprechung | Beschreibung |
|-----------|--------|-----------------|---------------|
| Selektion | σ (sigma) | WHERE | Zeilen filtern |
| Projektion | π (pi) | SELECT spalten | Spalten auswählen |
| Kreuzprodukt | × | CROSS JOIN | Alle Kombinationen |
| Vereinigung | ∪ | UNION | Ergebnisse zusammenführen |
| Differenz | − | EXCEPT | Ergebnisse abziehen |
| Umbenennung | ρ (rho) | AS | Attribute umbenennen |

**Abgeleitete Operationen:**

| Operation | Symbol | SQL-Entsprechung | Beschreibung |
|-----------|--------|-----------------|---------------|
| Natürlicher Verbund | ⋈ | INNER JOIN | Verbund über gleiche Attribute |
| Schnitt | ∩ | INTERSECT | Gemeinsame Zeilen |

Beispiel: \`σ_{alter > 25}(π_{name, alter}(Studenten))\` entspricht \`SELECT name, alter FROM Studenten WHERE alter > 25\``,
            keyTakeaways: [
              "Selektion (σ) filtert Zeilen → WHERE in SQL",
              "Projektion (π) wählt Spalten → SELECT in SQL",
              "Natürlicher Verbund (⋈) verbindet Tabellen → INNER JOIN",
              "Jede SQL-Abfrage lässt sich als Ausdruck der relationalen Algebra darstellen",
            ],
          },
        ],
      },
      {
        id: "integritaetsbedingungen",
        title: "Integritätsbedingungen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "integritaet-grundlagen",
            title: "Drei Arten der Integrität",
            sectionType: "theory",
            content: `Integritätsbedingungen garantieren die Korrektheit und Konsistenz der Daten in einer relationalen Datenbank.

**1. Entity-Integrität (Entitäts-Integrität):**
Jede Relation muss einen Primärschlüssel haben, und kein Attribut des Primärschlüssels darf NULL sein.

\`\`\`sql
CREATE TABLE studenten (
  id INTEGER PRIMARY KEY,  -- Darf nicht NULL sein
  name VARCHAR(50) NOT NULL
);
\`\`\`

**2. Referenzielle Integrität:**
Ein Fremdschlüssel muss entweder NULL sein oder auf ein existierendes Tupel in der referenzierten Relation verweisen.

\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER REFERENCES kunden(id)  -- Muss in kunden existieren
);
\`\`\`

**3. Domänen-Integrität:**
Jedes Attribut muss Werte aus seiner Domäne annehmen. Constraints wie NOT NULL, CHECK und UNIQUE sichern dies.

\`\`\`sql
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  preis DECIMAL(10,2) CHECK (preis > 0),  -- Domänen-Constraint
  name VARCHAR(100) NOT NULL
);
\`\`\``,
            keyTakeaways: [
              "Entity-Integrität: Primärschlüssel darf nicht NULL sein",
              "Referenzielle Integrität: Fremdschlüssel muss existieren oder NULL sein",
              "Domänen-Integrität: Werte müssen innerhalb der erlaubten Domäne liegen",
              "Zusammen garantieren sie Datenkonsistenz",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 3: Entity-Relationship-Modell
  // ═══════════════════════════════════════════════════════════════
  {
    id: "erm",
    title: "Entity-Relationship-Modell",
    description: "Entitäten, Beziehungen, Kardinalitäten und die Transformation vom ERM zum Relationenmodell.",
    icon: "bar-chart",
    difficulty: "junior",
    articles: [
      {
        id: "erm-grundlagen",
        title: "ERM-Grundlagen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "entitaeten-attribute",
            title: "Entitäten und Attribute",
            sectionType: "theory",
            content: `Das **Entity-Relationship-Modell (ERM)** wurde 1976 von Peter Chen entwickelt und ist das wichtigste konzeptionelle Datenmodell.

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
Ein Attribut, das jede Entität eindeutig identifiziert (wird im ERM unterstrichen dargestellt).

**Attribute können sein:**
- **Einfach** (atomic): z.B. Alter
- **Zusammengesetzt**: z.B. Adresse (Straße, PLZ, Stadt)
- **Mehrwertig**: z.B. Telefonnummern (mehrere pro Kunde)
- **Abgeleitet**: z.B. Alter (abgeleitet aus Geburtsdatum)`,
            keyTakeaways: [
              "ERM von Peter Chen 1976 — konzeptionelles Datenmodell",
              "Entität = Objekt der realen Welt",
              "Attribut = Eigenschaft einer Entität",
              "Schlüsselattribut = eindeutige Identifikation (unterstrichen im ERM)",
            ],
          },
          {
            id: "beziehungen-kardinalitaeten",
            title: "Beziehungen und Kardinalitäten",
            sectionType: "theory",
            content: `**Beziehung (Relationship):**
Verknüpfung zwischen zwei oder mehr Entitäten.
*Beispiel:* "bestellt" verbindet Kunde und Produkt.

**Kardinalitäten** beschreiben, wie viele Entitäten einer Seite mit wie vielen der anderen Seite verknüpft sein können:

| Notation | Bedeutung | Beispiel |
|----------|-----------|----------|
| 1:1 | Ein-zu-Ein | Ein Kunde hat genau einen Ausweis |
| 1:n | Ein-zu-Viel | Ein Kunde hat viele Bestellungen |
| n:m | Viel-zu-Viel | Ein Student besucht viele Kurse, ein Kurs hat viele Studenten |

**Wichtig:** n:m-Beziehungen müssen im Relationenmodell durch eine **Verknüpfungstabelle** aufgelöst werden!

**Chen-Notation vs. Krähenfuß-Notation:**
- **Chen-Notation**: Beziehungen als Raute, Kardinalitäten als Zahlen (1, n, m)
- **Krähenfuß-Notation (Crow's Foot)**: Kardinalitäten als Symbole am Linienende (‖ = 1, ◇ = 0 oder 1, ∗ = viele)`,
            widget: {
              type: "erm-diagram",
              data: {
                entities: [
                  {
                    id: "kunde",
                    name: "Kunde",
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
                    name: "Bestellung",
                    attributes: [
                      { name: "id", isPrimaryKey: true },
                      { name: "datum" },
                      { name: "betrag" },
                      { name: "kunde_id", isForeignKey: true },
                    ],
                    x: 280,
                    y: 80,
                  },
                  {
                    id: "produkt",
                    name: "Produkt",
                    attributes: [
                      { name: "id", isPrimaryKey: true },
                      { name: "name" },
                      { name: "preis" },
                    ],
                    x: 510,
                    y: 80,
                  },
                ],
                relationships: [
                  {
                    id: "r1",
                    name: "gibt",
                    fromEntityId: "kunde",
                    toEntityId: "bestellung",
                    fromCardinality: "1",
                    toCardinality: "n",
                  },
                  {
                    id: "r2",
                    name: "enthält",
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
            title: "Transformation ERM → Relationenmodell",
            sectionType: "practice",
            content: `Die Transformation vom ERM zum Relationenmodell folgt festen Regeln:

**1. Entitätstyp → Tabelle**
Jeder Entitätstyp wird zu einer Tabelle. Die Attribute werden zu Spalten.

**2. 1:1-Beziehung → Fremdschlüssel**
Der Primärschlüssel einer Tabelle wird als Fremdschlüssel in die andere Tabelle übernommen.

**3. 1:n-Beziehung → Fremdschlüssel auf der n-Seite**
Der Primärschlüssel der "1-Seite" wird als Fremdschlüssel in die Tabelle der "n-Seite" eingefügt.

**4. n:m-Beziehung → Verknüpfungstabelle**
Eine neue Tabelle wird erstellt, die die Primärschlüssel beider Entitäten als Fremdschlüssel enthält.`,
            widget: {
              type: "rm-to-sql",
              data: {
                tables: [
                  {
                    name: "studenten",
                    columns: [
                      { name: "id", type: "INTEGER", isPrimaryKey: true },
                      { name: "name", type: "VARCHAR(100)", isNotNull: true },
                    ],
                  },
                  {
                    name: "kurse",
                    columns: [
                      { name: "id", type: "INTEGER", isPrimaryKey: true },
                      { name: "name", type: "VARCHAR(100)", isNotNull: true },
                    ],
                  },
                  {
                    name: "belegungen",
                    columns: [
                      { name: "student_id", type: "INTEGER", isNotNull: true, isForeignKey: true, references: "studenten(id)" },
                      { name: "kurs_id", type: "INTEGER", isNotNull: true, isForeignKey: true, references: "kurse(id)" },
                      { name: "semester", type: "VARCHAR(10)", isNotNull: true },
                    ],
                  },
                ],
                hint: "Erstelle drei Tabellen: studenten (id, name), kurse (id, name) und belegungen (student_id, kurs_id, semester) mit Fremdschlüsseln.",
              },
            },
          },
        ],
      },
      {
        id: "erm-notationen",
        title: "ERM-Notationen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "chen-notation",
            title: "Chen-Notation",
            sectionType: "theory",
            content: `Die **Chen-Notation** (auch Chen-Diagramm genannt) ist die ursprüngliche von Peter Chen 1976 eingeführte Darstellungsform:

**Elemente:**
- **Rechteck** = Entitätstyp
- **Ellipse** = Attribut (Schlüsselattribut mit unterstrichenem Text)
- **Raute** = Beziehungstyp
- **Linien** = Verbindungen zwischen Elementen
- **Kardinalitäten** = Zahlen (1, n, m) an den Linien

**Vorteile der Chen-Notation:**
- Klare Trennung von Entitäten, Attributen und Beziehungen
- Auch komplexe n:m-Beziehungen sind direkt darstellbar
- Gut für konzeptionelles Design

**Nachteile:**
- Bei vielen Entitäten und Beziehungen schnell unübersichtlich
- In der Praxis weniger verbreitet als die Krähenfuß-Notation`,
            keyTakeaways: [
              "Rechteck = Entität, Ellipse = Attribut, Raute = Beziehung",
              "Kardinalitäten als Zahlen (1, n, m) an den Linien",
              "Gut für konzeptionelles Design, weniger für physisches",
            ],
          },
          {
            id: "krahenfuss-notation",
            title: "Krähenfuß-Notation (Crow's Foot)",
            sectionType: "theory",
            content: `Die **Krähenfuß-Notation** (Crow's Foot Notation) ist die in der Praxis am weitesten verbreitete ERM-Darstellung:

**Symbole an den Linienenden:**

| Symbol | Bedeutung | Beschreibung |
|--------|-----------|-------------|
| ‖ | Genau eins | Ein und nur ein |
| ◇ | Null oder eins | Optional |
| ∗ | Viele | Eins oder mehr |
| ○ | Null oder viele | Kein oder mehr |

**Kombinationen:**
- ‖‖ = 1:1 (Genau eins zu genau eins)
- ‖∗ = 1:n (Genau eins zu viele)
- ○∗ = 0:n (Optional zu viele)

**Vorteile der Krähenfuß-Notation:**
- Kompakt und übersichtlich
- Direkt auf physische Tabellenstruktur übertragbar
- Standard in vielen CASE-Tools (MySQL Workbench, etc.)`,
            keyTakeaways: [
              "Krähenfuß-Notation ist der Praxis-Standard",
              "Symbole: ‖ (eins), ◇ (null/eins), ∗ (viele)",
              "Kompakter als Chen-Notation",
              "Direkt auf Tabellenstruktur übertragbar",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 4: SQL-Grundlagen
  // ═══════════════════════════════════════════════════════════════
  {
    id: "sql-grundlagen",
    title: "SQL-Grundlagen",
    description: "SELECT, WHERE, ORDER BY, LIMIT, Aggregation und die wichtigsten SQL-Klauseln.",
    icon: "code",
    difficulty: "beginner",
    articles: [
      {
        id: "select-where",
        title: "SELECT und WHERE",
        estimatedMinutes: 10,
        sections: [
          {
            id: "select-syntax",
            title: "SELECT-Syntax",
            sectionType: "theory",
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
- \`LIMIT n\` — Nur die ersten n Zeilen

**WHERE-Operatoren:**

| Operator | Bedeutung | Beispiel |
|----------|-----------|----------|
| = | Gleich | \`WHERE name = 'Anna'\` |
| != oder <> | Ungleich | \`WHERE status != 'inaktiv'\` |
| >, <, >=, <= | Vergleich | \`WHERE preis > 100\` |
| BETWEEN | Bereich | \`WHERE preis BETWEEN 10 AND 50\` |
| IN | Menge | \`WHERE kategorie IN ('A', 'B')\` |
| LIKE | Muster | \`WHERE name LIKE 'A%'\` |
| IS NULL | Null-Prüfung | \`WHERE email IS NULL\` |
| AND, OR, NOT | Logik | \`WHERE preis > 100 AND kategorie = 'A'\` |`,
            keyTakeaways: [
              "SELECT ist die grundlegendste SQL-Abfrage",
              "WHERE filtert Zeilen mit verschiedenen Operatoren",
              "DISTINCT entfernt Duplikate",
              "LIKE mit % (beliebig viele Zeichen) und _ (genau ein Zeichen)",
            ],
          },
          {
            id: "select-beispiele",
            title: "SELECT-Beispiele in der Praxis",
            sectionType: "example",
            content: `Lass uns die SELECT-Grundlagen mit konkreten Beispielen vertiefen. Wir arbeiten mit einer Produkttabelle.

**Einfache Abfragen:**

\`\`\`sql
-- Alle Spalten aller Produkte
SELECT * FROM produkte;

-- Nur Name und Preis
SELECT name, preis FROM produkte;

-- Eindeutige Kategorien
SELECT DISTINCT kategorie FROM produkte;
\`\`\`

**WHERE-Filter:**

\`\`\`sql
-- Produkte teurer als 50
SELECT name, preis FROM produkte WHERE preis > 50;

-- Produkte in bestimmten Kategorien
SELECT name, kategorie FROM produkte
WHERE kategorie IN ('Elektronik', 'Buch');

-- Produkte deren Name mit 'A' beginnt
SELECT name FROM produkte WHERE name LIKE 'A%';

-- Produkte ohne Preisangabe
SELECT name FROM produkte WHERE preis IS NULL;

-- Kombinierte Bedingungen
SELECT name, preis, kategorie FROM produkte
WHERE preis BETWEEN 10 AND 50
  AND kategorie = 'Elektronik'
  AND name IS NOT NULL;
\`\`\`

**Sortierung und Begrenzung:**

\`\`\`sql
-- Produkte nach Preis absteigend sortiert
SELECT name, preis FROM produkte ORDER BY preis DESC;

-- Die 5 teuersten Produkte
SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 5;

-- Produkte nach Kategorie, dann nach Preis sortiert
SELECT name, kategorie, preis FROM produkte
ORDER BY kategorie ASC, preis DESC;
\`\`\`

**Wichtige Hinweise:**
- \`SELECT *\` ist praktisch für Tests, aber in der Praxis solltest du immer die benötigten Spalten explizit angeben
- \`LIKE\` mit \`%\` am Anfang (\`%text\`) kann keinen Index nutzen — vermeide es bei großen Tabellen
- \`ORDER BY\` ohne \`LIMIT\` sortiert die gesamte Tabelle — bei großen Datenmengen langsam
- \`DISTINCT\` erfordert eine Sortierung — bei vielen Zeilen aufwendig`,
            keyTakeaways: [
              "SELECT * vermeiden — stattdessen benötigte Spalten explizit angeben",
              "LIKE mit führendem % kann keinen Index nutzen",
              "ORDER BY + LIMIT für Top-N-Abfragen nutzen",
              "DISTINCT ist aufwendig — nur wenn wirklich nötig",
            ],
          },
        ],
      },
      {
        id: "aggregation-groupby",
        title: "Aggregatfunktionen und GROUP BY",
        estimatedMinutes: 12,
        sections: [
          {
            id: "aggregatfunktionen",
            title: "Aggregatfunktionen",
            sectionType: "theory",
            content: `**Aggregatfunktionen** berechnen einen einzelnen Wert aus einer Menge von Werten:

| Funktion | Bedeutung | Beispiel |
|----------|-----------|----------|
| COUNT() | Anzahl der Zeilen | \`COUNT(*)\` — alle Zeilen |
| SUM() | Summe | \`SUM(preis)\` — Gesamtpreis |
| AVG() | Durchschnitt | \`AVG(preis)\` — Durchschnittspreis |
| MIN() | Minimum | \`MIN(preis)\` — günstigstes Produkt |
| MAX() | Maximum | \`MAX(preis)\` — teuerstes Produkt |

**Wichtig:**
- \`COUNT(*)\` zählt alle Zeilen inklusive NULL
- \`COUNT(spalte)\` zählt nur Nicht-NULL-Werte
- \`COUNT(DISTINCT spalte)\` zählt eindeutige Werte
- Aggregatfunktionen ignorieren NULL-Werte (außer COUNT(*))`,
            keyTakeaways: [
              "COUNT, SUM, AVG, MIN, MAX sind die fünf Aggregatfunktionen",
              "COUNT(*) zählt alle Zeilen, COUNT(spalte) ignoriert NULL",
              "Aggregatfunktionen liefern einen einzelnen Wert",
              "NULL-Werte werden von SUM, AVG, MIN, MAX ignoriert",
            ],
          },
          {
            id: "group-by",
            title: "GROUP BY und HAVING in der Praxis",
            sectionType: "example",
            content: `**GROUP BY** gruppiert Zeilen mit gleichen Werten in den angegebenen Spalten. Aggregatfunktionen werden dann pro Gruppe berechnet.

**Einfaches GROUP BY:**

\`\`\`sql
-- Anzahl Produkte pro Kategorie
SELECT kategorie, COUNT(*) AS anzahl
FROM produkte
GROUP BY kategorie;

-- Durchschnittspreis pro Kategorie
SELECT kategorie, AVG(preis) AS durchschnittspreis
FROM produkte
GROUP BY kategorie;

-- Umsatz pro Kunde
SELECT kunde_id, SUM(betrag) AS gesamtumsatz
FROM bestellungen
GROUP BY kunde_id;
\`\`\`

**GROUP BY mit mehreren Spalten:**

\`\`\`sql
-- Anzahl Produkte pro Kategorie und Status
SELECT kategorie, status, COUNT(*) AS anzahl
FROM produkte
GROUP BY kategorie, status;
\`\`\`

**HAVING — Gruppen filtern:**

\`\`\`sql
-- Nur Kategorien mit mehr als 5 Produkten
SELECT kategorie, COUNT(*) AS anzahl
FROM produkte
GROUP BY kategorie
HAVING COUNT(*) > 5;

-- Kategorien mit Durchschnittspreis über 100
SELECT kategorie, AVG(preis) AS durchschnitt
FROM produkte
GROUP BY kategorie
HAVING AVG(preis) > 100;
\`\`\`

**Wichtige Regel:** In der SELECT-Klausel dürfen nach GROUP BY nur Spalten stehen, die entweder in GROUP BY enthalten sind oder von einer Aggregatfunktion umschlossen werden.

**Fehlerhaft:** \`SELECT kategorie, name, COUNT(*) FROM produkte GROUP BY kategorie;\` — \`name\` ist nicht in GROUP BY und nicht aggregiert.

**Richtig:** \`SELECT kategorie, COUNT(*) FROM produkte GROUP BY kategorie;\`

**Ausführungsreihenfolge:**
1. FROM — Tabelle auswählen
2. WHERE — Zeilen filtern (vor der Gruppierung)
3. GROUP BY — Gruppieren
4. HAVING — Gruppen filtern (nach der Gruppierung)
5. SELECT — Spalten auswählen
6. ORDER BY — Sortieren
7. LIMIT — Zeilen begrenzen`,
            keyTakeaways: [
              "GROUP BY fasst Zeilen mit gleichen Werten zusammen",
              "HAVING filtert Gruppen (nach Aggregation), WHERE filtert Zeilen (vor Aggregation)",
              "Nur GROUP BY-Spalten und Aggregatfunktionen im SELECT erlaubt",
              "Ausführungsreihenfolge: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
            ],
          },
        ],
      },
      {
        id: "null-werte",
        title: "NULL-Werte und Dreiwertige Logik",
        estimatedMinutes: 12,
        sections: [
          {
            id: "null-grundlagen",
            title: "Was ist NULL?",
            sectionType: "theory",
            content: `**NULL** in SQL bedeutet "unbekannt" oder "nicht vorhanden" — es ist **kein** Wert, sondern die Abwesenheit eines Wertes.

**Dreiwertige Logik:**
SQL verwendet eine dreiwertige Logik mit TRUE, FALSE und UNKNOWN (NULL):

| A | B | A AND B | A OR B |
|---|---|---------|--------|
| TRUE | TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE | TRUE |
| TRUE | NULL | NULL | TRUE |
| FALSE | NULL | FALSE | NULL |
| NULL | NULL | NULL | NULL |

**Wichtige Regeln:**
- \`NULL = NULL\` ergibt **NULL** (nicht TRUE!)
- \`NULL <> 1\` ergibt **NULL** (nicht TRUE!)
- \`NOT NULL\` ergibt **NULL** (nicht TRUE!)
- Nur \`IS NULL\` und \`IS NOT NULL\` liefern TRUE oder FALSE`,
            keyTakeaways: [
              "NULL bedeutet 'unbekannt' oder 'nicht vorhanden'",
              "NULL = NULL ergibt NULL, nicht TRUE",
              "SQL verwendet dreiwertige Logik (TRUE, FALSE, NULL)",
              "Immer IS NULL / IS NOT NULL statt = NULL / <> NULL verwenden",
            ],
          },
          {
            id: "null-fallen",
            title: "NULL-Fallen in der Praxis",
            sectionType: "example",
            content: `Hier sind die häufigsten NULL-Fallen und wie man sie vermeidet:

**Falle 1: NULL-Vergleiche mit =**

\`\`\`sql
-- FALSCH: Liefert KEINE Zeilen!
SELECT * FROM kunden WHERE telefon = NULL;

-- RICHTIG:
SELECT * FROM kunden WHERE telefon IS NULL;
\`\`\`

Warum? \`NULL = NULL\` ergibt NULL (unbekannt), nicht TRUE. Nur \`IS NULL\` und \`IS NOT NULL\` funktionieren zuverlässig.

**Falle 2: NULL in Aggregatfunktionen**

\`\`\`sql
-- AVG ignoriert NULL-Werte!
SELECT AVG(preis) FROM produkte;  -- NULL-Werte werden NICHT gezählt

-- Wenn NULL als 0 behandelt werden soll:
SELECT AVG(COALESCE(preis, 0)) FROM produkte;
\`\`\`

**Falle 3: NULL in Berechnungen**

\`\`\`sql
-- Jede Berechnung mit NULL ergibt NULL!
SELECT 100 + NULL;   -- Ergebnis: NULL
SELECT NULL * 2;     -- Ergebnis: NULL
SELECT NULL = NULL;  -- Ergebnis: NULL
\`\`\`

**Falle 4: NULL in NOT IN**

\`\`\`sql
-- FALSCH: Wenn die Unterabfrage NULL enthält, liefert NOT IN KEINE Zeilen!
SELECT * FROM produkte
WHERE kategorie NOT IN (SELECT kategorie FROM produkte WHERE preis > 100);
-- Wenn eine kategorie NULL ist, ergibt NOT IN NULL für ALLE Zeilen!

-- RICHTIG: NOT EXISTS statt NOT IN
SELECT * FROM produkte p
WHERE NOT EXISTS (
  SELECT 1 FROM produkte p2
  WHERE p2.kategorie = p.kategorie AND p2.preis > 100
);
\`\`\`

**Falle 5: COALESCE und IFNULL**

\`\`\`sql
-- COALESCE: Ersten Nicht-NULL-Wert zurückgeben
SELECT COALESCE(telefon, email, 'Keine Kontaktinfo') FROM kunden;

-- IFNULL (MySQL-spezifisch): NULL durch Standardwert ersetzen
SELECT IFNULL(preis, 0) FROM produkte;

-- NULLIF: NULL erzeugen wenn zwei Werte gleich sind
SELECT NULLIF(preis, 0) FROM produkte;  -- 0 wird zu NULL
\`\`\`

**Zusammenfassung der NULL-Regeln:**
- Jede Arithmetik mit NULL ergibt NULL
- Jeder Vergleich mit NULL ergibt NULL (außer IS NULL / IS NOT NULL)
- Aggregatfunktionen (außer COUNT(*)) ignorieren NULL
- NOT IN mit NULL in der Unterabfrage liefert keine Ergebnisse
- COALESCE ist der Standardweg, um NULL-Werte zu ersetzen`,
            keyTakeaways: [
              "NULL = NULL ergibt NULL — immer IS NULL / IS NOT NULL verwenden",
              "Arithmetik mit NULL ergibt immer NULL",
              "NOT IN mit NULL in der Unterabfrage liefert keine Ergebnisse",
              "COALESCE() ersetzt NULL durch einen Standardwert",
              "Aggregatfunktionen ignorieren NULL (außer COUNT(*))",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 5: Joins
  // ═══════════════════════════════════════════════════════════════
  {
    id: "joins",
    title: "Joins",
    description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, Self-Join und wie Tabellen verknüpft werden.",
    icon: "merge",
    difficulty: "junior",
    articles: [
      {
        id: "join-grundlagen",
        title: "JOIN-Grundlagen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "inner-join",
            title: "INNER JOIN",
            sectionType: "theory",
            content: `**INNER JOIN** verknüpft zwei Tabellen und liefert nur die Zeilen, bei denen die Join-Bedingung in **beiden** Tabellen erfüllt ist.

\`\`\`sql
SELECT a.spalte, b.spalte
FROM tabelle_a a
INNER JOIN tabelle_b b ON a.fk = b.pk;
\`\`\`

**Venn-Diagramm-Vorstellung:** Nur die Schnittmenge beider Tabellen wird zurückgegeben.

**Wann INNER JOIN verwenden?**
- Wenn du nur übereinstimmende Zeilen aus beiden Tabellen brauchst
- Wenn fehlende Übereinstimmungen ignoriert werden sollen
- Der häufigste JOIN-Typ in der Praxis`,
            keyTakeaways: [
              "INNER JOIN liefert nur übereinstimmende Zeilen",
              "Entspricht der Schnittmenge im Venn-Diagramm",
              "Der häufigste JOIN-Typ in der Praxis",
            ],
          },
          {
            id: "left-join",
            title: "LEFT JOIN und RIGHT JOIN",
            sectionType: "example",
            content: `**LEFT JOIN** (LEFT OUTER JOIN) liefert **alle** Zeilen der linken Tabelle und die übereinstimmenden Zeilen der rechten Tabelle. Fehlt ein Match, werden NULL-Werte eingesetzt.

\`\`\`sql
-- Alle Kunden mit ihren Bestellungen (auch ohne)
SELECT k.name, b.datum, b.gesamtbetrag
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

**Ergebnis:**

| name | datum | gesamtbetrag |
|------|-------|-------------|
| Anna | 2024-01-15 | 99.50 |
| Anna | 2024-02-01 | 45.00 |
| Ben | NULL | NULL |
| Clara | 2024-01-20 | 120.00 |

Ben hat keine Bestellungen — die rechten Spalten sind NULL.

**Typische Anwendungsfälle für LEFT JOIN:**

1. **Finde Einträge OHNE Match:**
\`\`\`sql
-- Kunden ohne Bestellungen
SELECT k.name
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
WHERE b.id IS NULL;
\`\`\`

2. **Zähle mit Null-Werten:**
\`\`\`sql
-- Anzahl Bestellungen pro Kunde (auch 0)
SELECT k.name, COUNT(b.id) AS bestellanzahl
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;
\`\`\`

**Wichtig:** \`COUNT(*)\` zählt alle Zeilen (inklusive NULL-Matches), \`COUNT(b.id)\` zählt nur Nicht-NULL-Werte.

**RIGHT JOIN** ist äquivalent zu LEFT JOIN mit vertauschten Tabellen:
\`\`\`sql
-- Diese beiden Abfragen sind identisch:
SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;
SELECT * FROM b RIGHT JOIN a ON a.id = b.a_id;
\`\`\`

In der Praxis wird RIGHT JOIN selten verwendet — man schreibt die Tabelle mit allen Zeilen einfach auf die linke Seite und verwendet LEFT JOIN.`,
            keyTakeaways: [
              "LEFT JOIN liefert alle Zeilen der linken Tabelle + Matches rechts",
              "NULL-Werte in rechten Spalten = kein Match",
              "WHERE right.id IS NULL findet Einträge ohne Match",
              "COUNT(*) vs COUNT(right.id) — NULL-Unterschied beachten",
              "RIGHT JOIN = LEFT JOIN mit vertauschten Tabellen",
            ],
          },
        ],
      },
      {
        id: "weitere-joins",
        title: "RIGHT JOIN, FULL JOIN und Self-Join",
        estimatedMinutes: 10,
        sections: [
          {
            id: "right-full-join",
            title: "RIGHT JOIN und FULL JOIN",
            sectionType: "theory",
            content: `**RIGHT JOIN** (RIGHT OUTER JOIN) ist das Spiegelbild von LEFT JOIN: Alle Zeilen der **rechten** Tabelle werden geliefert, mit NULL-Werten für fehlende Matches in der linken Tabelle.

\`\`\`sql
SELECT a.spalte, b.spalte
FROM tabelle_a a
RIGHT JOIN tabelle_b b ON a.fk = b.pk;
\`\`\`

**FULL OUTER JOIN** liefert **alle** Zeilen beider Tabellen, mit NULL-Werten wo es keine Übereinstimmung gibt. In SQLite (und damit auch hier) wird FULL OUTER JOIN nicht direkt unterstützt, aber man kann es mit einem UNION aus LEFT JOIN und RIGHT JOIN simulieren.

**Übersicht der JOIN-Typen:**

| JOIN-Typ | Was wird geliefert? |
|----------|---------------------|
| INNER JOIN | Nur übereinstimmende Zeilen |
| LEFT JOIN | Alle Zeilen links + Matches rechts |
| RIGHT JOIN | Alle Zeilen rechts + Matches links |
| FULL OUTER JOIN | Alle Zeilen beider Tabellen |`,
            keyTakeaways: [
              "RIGHT JOIN: Alle Zeilen der rechten Tabelle + Matches links",
              "FULL OUTER JOIN: Alle Zeilen beider Tabellen",
              "RIGHT JOIN = LEFT JOIN mit vertauschten Tabellen",
              "SQLite unterstützt keinen nativen FULL OUTER JOIN",
            ],
          },
          {
            id: "self-join",
            title: "Self-Join",
            sectionType: "example",
            content: `Ein **Self-Join** ist ein JOIN einer Tabelle mit sich selbst. Man braucht ihn, wenn Zeilen innerhalb derselben Tabelle miteinander verglichen werden sollen.

**Syntax:** Man gibt der Tabelle zwei verschiedene Aliase:

\`\`\`sql
SELECT a.name AS mitarbeiter, b.name AS vorgesetzter
FROM mitarbeiter a
INNER JOIN mitarbeiter b ON a.vorgesetzter_id = b.id;
\`\`\`

**Beispiel: Organigramm**

| id | name | vorgesetzter_id |
|----|------|----------------|
| 1 | Müller | NULL |
| 2 | Schmidt | 1 |
| 3 | Weber | 1 |
| 4 | Klein | 2 |

\`\`\`sql
-- Jeden Mitarbeiter mit seinem Vorgesetzten
SELECT
  a.name AS mitarbeiter,
  b.name AS vorgesetzter
FROM mitarbeiter a
LEFT JOIN mitarbeiter b ON a.vorgesetzter_id = b.id;
\`\`\`

**Ergebnis:**

| mitarbeiter | vorgesetzter |
|-------------|-------------|
| Müller | NULL |
| Schmidt | Müller |
| Weber | Müller |
| Klein | Schmidt |

**Weitere Anwendungsfälle:**

1. **Produkte mit ähnlichem Preis finden:**
\`\`\`sql
SELECT a.name, b.name, a.preis
FROM produkte a
INNER JOIN produkte b ON a.kategorie = b.kategorie AND a.id != b.id
WHERE ABS(a.preis - b.preis) < 10;
\`\`\`

2. **Aufeinanderfolgende Ereignisse vergleichen:**
\`\`\`sql
SELECT a.datum, a.wert AS aktueller_wert, b.wert AS vorheriger_wert
FROM messungen a
LEFT JOIN messungen b ON a.datum = DATE(b.datum, '+1 day');
\`\`\`

**Wichtig:** Bei Self-Joins immer einen Alias verwenden (a, b), um die beiden „Kopien" der Tabelle zu unterscheiden. Ohne Alias wäre nicht klar, welche Tabelle gemeint ist.`,
            keyTakeaways: [
              "Self-Join = Tabelle wird mit sich selbst verknüpft",
              "Immer Aliase (a, b) verwenden, um die Kopien zu unterscheiden",
              "Typische Anwendungen: Hierarchien, Vergleiche innerhalb einer Tabelle",
              "LEFT JOIN für optionale Beziehungen (z.B. Vorgesetzter kann NULL sein)",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 6: DDL — Datendefinition
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ddl",
    title: "DDL — Datendefinition",
    description: "CREATE TABLE, Datentypen, Constraints, ALTER TABLE, DROP TABLE und Indizes.",
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
            title: "Syntax und Datentypen",
            sectionType: "theory",
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

| Datentyp | Beschreibung | Beispiel |
|----------|-------------|----------|
| INTEGER / INT | Ganzzahlen | \`42\` |
| VARCHAR(n) | Zeichenketten (max. n Zeichen) | \`'Anna'\` |
| DECIMAL(p,s) | Dezimalzahlen | \`99.99\` |
| DATE | Datum | \`'2024-01-15'\` |
| BOOLEAN | Wahrheitswert | \`TRUE\` / \`FALSE\` |
| TEXT | Lange Texte | \`'Langer Text...'\` |
| DATETIME | Datum und Uhrzeit | \`'2024-01-15 14:30:00'\` |

**Wichtige Constraints:**

| Constraint | Bedeutung | Beispiel |
|------------|-----------|----------|
| PRIMARY KEY | Primärschlüssel | \`id INTEGER PRIMARY KEY\` |
| NOT NULL | Pflichtfeld | \`name VARCHAR(50) NOT NULL\` |
| UNIQUE | Eindeutig | \`email VARCHAR(100) UNIQUE\` |
| FOREIGN KEY | Fremdschlüssel | \`REFERENCES kunden(id)\` |
| DEFAULT | Standardwert | \`status VARCHAR(20) DEFAULT 'aktiv'\` |
| CHECK | Bedingung | \`CHECK (preis > 0)\` |`,
            keyTakeaways: [
              "CREATE TABLE definiert Spalten, Datentypen und Constraints",
              "VARCHAR(n) für Text, INTEGER für Zahlen, DATE für Datum",
              "PRIMARY KEY = eindeutige Identifikation, NOT NULL = Pflichtfeld",
              "FOREIGN KEY erstellt Beziehungen zwischen Tabellen",
            ],
          },
          {
            id: "create-table-beispiel",
            title: "CREATE TABLE in der Praxis",
            sectionType: "practice",
            content: `Hier erstellen wir eine vollständige Datenbank mit mehreren Tabellen und Beziehungen:

**Beispiel: Online-Shop-Datenbank**

\`\`\`sql
-- Kundentabelle
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vorname VARCHAR(50) NOT NULL,
  nachname VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefon VARCHAR(20),
  erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Produkttabelle
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  beschreibung TEXT,
  preis DECIMAL(10, 2) NOT NULL CHECK (preis > 0),
  kategorie VARCHAR(50) DEFAULT 'Sonstiges',
  bestand INTEGER DEFAULT 0 CHECK (bestand >= 0),
  aktiv BOOLEAN DEFAULT TRUE
);

-- Bestellungstabelle
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kunde_id INTEGER NOT NULL,
  bestelldatum DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'neu',
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

-- Bestellpositionen (n:m-Beziehung)
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (bestellung_id) REFERENCES bestellungen(id),
  FOREIGN KEY (produkt_id) REFERENCES produkte(id)
);
\`\`\`

**Erklärung der verwendeten Constraints:**

| Constraint | Verwendung | Zweck |
|-----------|-------------|-------|
| PRIMARY KEY AUTOINCREMENT | \`id\` in jeder Tabelle | Eindeutige ID, automatisch hochgezählt |
| NOT NULL | \`vorname\`, \`nachname\`, \`email\` | Pflichtfelder |
| UNIQUE | \`email\` | Keine doppelten E-Mail-Adressen |
| CHECK | \`preis > 0\`, \`menge > 0\` | Wertebereiche einschränken |
| DEFAULT | \`erstellt_am\`, \`status\` | Standardwerte für neue Zeilen |
| FOREIGN KEY | \`kunde_id\`, \`bestellung_id\` | Referenzielle Integrität |

**Best Practices:**
- Immer PRIMARY KEY definieren (meist INTEGER AUTOINCREMENT)
- NOT NULL für Pflichtfelder
- CHECK-Constraints für Wertebereiche (z.B. Preis > 0)
- DEFAULT für häufige Standardwerte
- FOREIGN KEY für alle Beziehungen
- UNIQUE für eindeutige Felder wie E-Mail`,
            keyTakeaways: [
              "Immer PRIMARY KEY und NOT NULL für Pflichtfelder verwenden",
              "CHECK-Constraints schränken Wertebereiche ein",
              "DEFAULT-Werte vereinfachen INSERT-Statements",
              "FOREIGN KEY sichert referenzielle Integrität",
              "UNIQUE verhindert doppelte Werte (z.B. E-Mail)",
            ],
          },
        ],
      },
      {
        id: "alter-drop-index",
        title: "ALTER TABLE, DROP TABLE und Indizes",
        estimatedMinutes: 12,
        sections: [
          {
            id: "alter-drop",
            title: "ALTER TABLE und DROP TABLE",
            sectionType: "theory",
            content: `**ALTER TABLE** ändert die Struktur einer bestehenden Tabelle:

\`\`\`sql
-- Spalte hinzufuegen
ALTER TABLE kunden ADD COLUMN telefon VARCHAR(20);

-- Spalte entfernen
ALTER TABLE kunden DROP COLUMN telefon;

-- Spalte aendern (MySQL)
ALTER TABLE kunden MODIFY COLUMN name VARCHAR(100);
\`\`\`

**DROP TABLE** löscht eine gesamte Tabelle inklusive aller Daten:

\`\`\`sql
DROP TABLE kunden;
\`\`\`

**Achtung:** DROP TABLE ist irreversibel! Alle Daten gehen verloren.

**DROP TABLE IF EXISTS** verhindert Fehler, wenn die Tabelle nicht existiert:

\`\`\`sql
DROP TABLE IF EXISTS kunden;
\`\`\``,
            keyTakeaways: [
              "ALTER TABLE ändert Tabellenstruktur (Spalten hinzufügen/entfernen)",
              "DROP TABLE löscht die gesamte Tabelle inklusive Daten",
              "DROP TABLE IF EXISTS verhindert Fehler bei nicht-existierenden Tabellen",
              "ALTER TABLE ist reversibel, DROP TABLE nicht!",
            ],
          },
          {
            id: "indizes",
            title: "Indizes für Performance",
            sectionType: "example",
            content: `**Indizes** beschleunigen Abfragen auf häufig gefilterte Spalten, verlangsamen aber Schreiboperationen.

\`\`\`sql
-- Index erstellen
CREATE INDEX idx_kunde_name ON kunden(name);

-- Eindeutiger Index
CREATE UNIQUE INDEX idx_kunde_email ON kunden(email);

-- Index löschen
DROP INDEX idx_kunde_name;
\`\`\`

**Wann Indizes sinnvoll sind:**
- Spalten in WHERE-Klauseln
- Spalten in JOIN-Bedingungen
- Spalten in ORDER BY

**Wann Indizes nicht sinnvoll sind:**
- Sehr kleine Tabellen (< 100 Zeilen)
- Spalten mit wenigen eindeutigen Werten (z.B. boolean)
- Spalten, die häufig aktualisiert werden`,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 7: Subqueries
  // ═══════════════════════════════════════════════════════════════
  {
    id: "subqueries",
    title: "Subqueries",
    description: "Unterabfragen in WHERE, FROM, SELECT und mit EXISTS — verschachtelte Abfragen meistern.",
    icon: "search",
    difficulty: "intermediate",
    articles: [
      {
        id: "subquery-grundlagen",
        title: "Subquery-Grundlagen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "was-sind-subqueries",
            title: "Was sind Subqueries?",
            sectionType: "theory",
            content: `Eine **Subquery** (Unterabfrage) ist eine SELECT-Anweisung, die innerhalb einer anderen Abfrage verschachtelt ist.

**Drei Typen von Subqueries:**

1. **Skalar-Subquery** — Liefert genau einen Wert (eine Zeile, eine Spalte)
2. **Zeilen-Subquery** — Liefert eine Zeile mit mehreren Spalten
3. **Tabellen-Subquery** — Liefert eine Tabelle (mehrere Zeilen, mehrere Spalten)

**Einsatzorte:**
- In der WHERE-Klausel (Filtern)
- In der FROM-Klausel (als virtuelle Tabelle)
- In der SELECT-Klausel (als berechnete Spalte)
- Mit EXISTS / NOT EXISTS (Existenzprüfung)`,
            keyTakeaways: [
              "Subquery = verschachtelte SELECT-Anweisung",
              "Skalar-Subquery: ein Wert, Zeilen-Subquery: eine Zeile, Tabellen-Subquery: Tabelle",
              "Einsatz in WHERE, FROM, SELECT und mit EXISTS",
              "Subqueries können verschachtelt werden (Subquery in Subquery)",
            ],
          },
          {
            id: "subquery-where",
            title: "Subqueries in der WHERE-Klausel",
            sectionType: "example",
            content: `Subqueries in der WHERE-Klausel filtern Zeilen basierend auf Ergebnissen einer anderen Abfrage.

**1. Skalar-Subquery (ein einzelner Wert):**

\`\`\`sql
-- Produkte, die teurer als der Durchschnitt sind
SELECT name, preis
FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte);
\`\`\`

Die innere Abfrage \`SELECT AVG(preis) FROM produkte\` liefert genau einen Wert — den Durchschnittspreis. Die äußere Abfrage vergleicht jeden Preis damit.

**2. Subquery mit IN:**

\`\`\`sql
-- Kunden, die etwas bestellt haben
SELECT name FROM kunden
WHERE id IN (SELECT DISTINCT kunde_id FROM bestellungen);

-- Kunden, die NICHTS bestellt haben
SELECT name FROM kunden
WHERE id NOT IN (SELECT DISTINCT kunde_id FROM bestellungen);
\`\`\`

**Achtung:** \`NOT IN\` mit NULL-Werten in der Unterabfrage liefert **keine** Ergebnisse! Verwende stattdessen \`NOT EXISTS\`.

**3. Subquery mit Vergleichsoperatoren:**

\`\`\`sql
-- Das teuerste Produkt
SELECT name, preis FROM produkte
WHERE preis = (SELECT MAX(preis) FROM produkte);

-- Produkte aus der beliebtesten Kategorie
SELECT name, kategorie FROM produkte
WHERE kategorie = (
  SELECT kategorie
  FROM bestellpositionen bp
  JOIN produkte p ON bp.produkt_id = p.id
  GROUP BY kategorie
  ORDER BY COUNT(*) DESC
  LIMIT 1
);
\`\`\`

**4. Subquery in der FROM-Klausel (abgeleitete Tabelle):**

\`\`\`sql
-- Durchschnittsbestellwert pro Kunde
SELECT kunde_name, avg_total
FROM (
  SELECT k.name AS kunde_name, SUM(b.gesamtbetrag) AS total
  FROM kunden k
  JOIN bestellungen b ON k.id = b.kunde_id
  GROUP BY k.name
) AS kundenumsatz
WHERE avg_total > 100;
\`\`\`

**Wichtig:** Jede abgeleitete Tabelle braucht einen Alias (\`AS kundenumsatz\`).`,
            keyTakeaways: [
              "Skalar-Subquery: Ein einzelner Wert in WHERE",
              "IN-Subquery: Menge von Werten in WHERE",
              "NOT IN mit NULL ist gefährlich — NOT EXISTS verwenden",
              "Abgeleitete Tabellen brauchen immer einen Alias",
              "Subqueries können verschachtelt werden",
            ],
          },
        ],
      },
      {
        id: "correlated-subqueries",
        title: "Korrelierte Subqueries und EXISTS",
        estimatedMinutes: 10,
        sections: [
          {
            id: "correlated-subquery",
            title: "Korrelierte Subqueries",
            sectionType: "theory",
            content: `Eine **korrelierte Subquery** bezieht sich auf Spalten der äußeren Abfrage. Sie wird für **jede Zeile** der äußeren Abfrage einmal ausgeführt.

**Unterschied zur normalen Subquery:**
- Normale Subquery: Einmal ausgeführt, Ergebnis an äußere Abfrage übergeben
- Korrelierte Subquery: Für jede Zeile der äußeren Abfrage ausgeführt

**Syntax:**
\`\`\`sql
SELECT a.spalte
FROM tabelle_a a
WHERE bedingung (
  SELECT ...
  FROM tabelle_b b
  WHERE b.fk = a.pk  -- Bezug auf äußere Tabelle!
);
\`\`\`

**Performance-Hinweis:** Korrelierte Subqueries können langsam sein, da sie pro Zeile ausgeführt werden. Oft kann man sie durch JOINs ersetzen.`,
            keyTakeaways: [
              "Korrelierte Subquery bezieht sich auf äußere Abfrage",
              "Wird für jede Zeile der äußeren Abfrage ausgeführt",
              "Kann langsam sein — oft durch JOIN ersetzbar",
              "Erkennbar am Bezug auf äußere Tabelle (z.B. a.id in der inneren Abfrage)",
            ],
          },
          {
            id: "exists",
            title: "EXISTS und NOT EXISTS",
            sectionType: "example",
            content: `**EXISTS** prüft, ob eine Subquery mindestens eine Zeile zurückgibt. **NOT EXISTS** prüft das Gegenteil.

**EXISTS vs. IN — Wann was verwenden?**

\`\`\`sql
-- Mit IN: Kunden, die bestellt haben
SELECT name FROM kunden
WHERE id IN (SELECT kunde_id FROM bestellungen);

-- Mit EXISTS: Dasselbe Ergebnis
SELECT k.name FROM kunden k
WHERE EXISTS (
  SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id
);
\`\`\`

**Wann EXISTS besser ist als IN:**
- Bei großen Unterabfragen (EXISTS bricht ab, sobald ein Match gefunden wird)
- Bei NULL-Werten in der Unterabfrage (NOT IN mit NULL liefert keine Ergebnisse!)
- Bei korrelierten Unterabfragen

**NOT EXISTS — Die sichere Alternative zu NOT IN:**

\`\`\`sql
-- SICHER: Kunden ohne Bestellungen
SELECT k.name FROM kunden k
WHERE NOT EXISTS (
  SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id
);

-- GEFAHRLICH: NOT IN mit NULL
SELECT name FROM kunden
WHERE id NOT IN (SELECT kunde_id FROM bestellungen);
-- Wenn kunde_id NULL enthält, liefert das KEINE Ergebnisse!
\`\`\`

**EXISTS mit korrelierter Subquery:**

\`\`\`sql
-- Produkte, die mindestens einmal bestellt wurden
SELECT p.name FROM produkte p
WHERE EXISTS (
  SELECT 1 FROM bestellpositionen bp
  WHERE bp.produkt_id = p.id
);

-- Produkte, die noch nie bestellt wurden
SELECT p.name FROM produkte p
WHERE NOT EXISTS (
  SELECT 1 FROM bestellpositionen bp
  WHERE bp.produkt_id = p.id
);
\`\`\`

**Performance-Tipp:** EXISTS ist oft schneller als IN, weil die Subquery abbricht, sobald die erste Zeile gefunden wird. IN muss die gesamte Unterabfrage ausführen.`,
            keyTakeaways: [
              "EXISTS prüft, ob mindestens eine Zeile existiert",
              "NOT EXISTS ist sicherer als NOT IN (kein NULL-Problem)",
              "EXISTS bricht nach dem ersten Match ab — oft schneller als IN",
              "Korrelierte Subqueries referenzieren die äußere Tabelle",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 8: DML — Datenmanipulation
  // ═══════════════════════════════════════════════════════════════
  {
    id: "dml",
    title: "DML — Datenmanipulation",
    description: "INSERT, UPDATE und DELETE — Daten in Tabellen einfügen, ändern und löschen.",
    icon: "pencil",
    difficulty: "junior",
    articles: [
      {
        id: "insert",
        title: "INSERT — Daten einfügen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "insert-syntax",
            title: "INSERT-Syntax",
            sectionType: "theory",
            content: `**INSERT** fügt neue Zeilen in eine Tabelle ein.

**Variante 1: Einzelne Zeile mit Spaltennamen**
\`\`\`sql
INSERT INTO tabelle (spalte1, spalte2)
VALUES (wert1, wert2);
\`\`\`

**Variante 2: Alle Spalten (Reihenfolge muss stimmen)**
\`\`\`sql
INSERT INTO tabelle VALUES (wert1, wert2, wert3);
\`\`\`

**Variante 3: Mehrere Zeilen gleichzeitig**
\`\`\`sql
INSERT INTO tabelle (spalte1, spalte2)
VALUES
  (wert1a, wert2a),
  (wert1b, wert2b),
  (wert1c, wert2c);
\`\`\`

**Variante 4: Aus einer Abfrage**
\`\`\`sql
INSERT INTO tabelle (spalte1, spalte2)
SELECT spalte1, spalte2 FROM andere_tabelle;
\`\`\`

**Wichtig:** Spalten mit DEFAULT-Werten oder NULL können weggelassen werden.`,
            keyTakeaways: [
              "INSERT INTO ... VALUES fügt Zeilen ein",
              "Spaltennamen angeben ist Best Practice",
              "Mehrere Zeilen mit einem INSERT möglich",
              "INSERT ... SELECT kopiert Daten aus einer anderen Tabelle",
            ],
          },
          {
            id: "insert-beispiele",
            title: "INSERT-Beispiele in der Praxis",
            sectionType: "practice",
            content: `Praktische INSERT-Beispiele mit einer Kundentabelle:

**1. Einzelne Zeile einfügen:**

\`\`\`sql
-- Mit Spaltennamen (Best Practice)
INSERT INTO kunden (vorname, nachname, email)
VALUES ('Anna', 'Müller', 'anna@beispiel.de');

-- Ohne Spaltennamen (Reihenfolge muss stimmen!)
INSERT INTO kunden VALUES (1, 'Anna', 'Müller', 'anna@beispiel.de', NULL);
\`\`\`

**2. Mehrere Zeilen gleichzeitig:**

\`\`\`sql
INSERT INTO kunden (vorname, nachname, email)
VALUES
  ('Ben', 'Schmidt', 'ben@beispiel.de'),
  ('Clara', 'Weber', 'clara@beispiel.de'),
  ('David', 'Klein', 'david@beispiel.de');
\`\`\`

**3. Daten aus einer anderen Tabelle kopieren:**

\`\`\`sql
-- Alle Kunden aus bestellungen übernehmen, die noch nicht in kunden stehen
INSERT INTO kunden (vorname, nachname, email)
SELECT vorname, nachname, email
FROM bestellungen_Import
WHERE email NOT IN (SELECT email FROM kunden);
\`\`\`

**4. DEFAULT-Werte und NULL:**

\`\`\`sql
-- Spalten mit DEFAULT können weggelassen werden
INSERT INTO produkte (name, preis)
VALUES ('Neues Produkt', 29.99);
-- erstellt_am wird automatisch auf CURRENT_TIMESTAMP gesetzt

-- Explizit NULL setzen
INSERT INTO kunden (vorname, nachname, email, telefon)
VALUES ('Eva', 'Braun', 'eva@beispiel.de', NULL);
\`\`\`

**Häufige Fehler:**
- Spaltenreihenfolge stimmt nicht mit VALUES überein
- NOT NULL-Constraint verletzt (Pflichtfeld vergessen)
- UNIQUE-Constraint verletzt (doppelter Wert)
- FOREIGN KEY-Constraint verletzt (referenzierte Zeile existiert nicht)`,
            keyTakeaways: [
              "Immer Spaltennamen angeben — vermeidet Fehler bei Tabellenänderungen",
              "Mehrere Zeilen mit einem INSERT sind effizienter",
              "INSERT ... SELECT kopiert Daten zwischen Tabellen",
              "DEFAULT-Werte werden automatisch gesetzt wenn Spalte weggelassen",
            ],
          },
        ],
      },
      {
        id: "update-delete",
        title: "UPDATE und DELETE",
        estimatedMinutes: 12,
        sections: [
          {
            id: "update-syntax",
            title: "UPDATE — Daten ändern",
            sectionType: "theory",
            content: `**UPDATE** ändert bestehende Zeilen in einer Tabelle.

\`\`\`sql
UPDATE tabelle
SET spalte1 = wert1, spalte2 = wert2
WHERE bedingung;
\`\`\`

**WICHTIG:** Ohne WHERE-Klausel werden **ALLE** Zeilen aktualisiert!

**Beispiele:**
\`\`\`sql
-- Einen bestimmten Kunden aktualisieren
UPDATE kunden SET email = 'neu@mail.de' WHERE id = 1;

-- Alle Preise um 10% erhoehen
UPDATE produkte SET preis = preis * 1.10;
\`\`\``,
            keyTakeaways: [
              "UPDATE ändert bestehende Zeilen",
              "IMMER WHERE-Klausel verwenden (sonst alle Zeilen!)",
              "SET spalte = wert für jede zu ändernde Spalte",
              "Vorsicht: UPDATE ohne WHERE betrifft ALLE Zeilen",
            ],
          },
          {
            id: "delete-syntax",
            title: "DELETE — Daten löschen",
            sectionType: "example",
            content: `**DELETE** löscht Zeilen aus einer Tabelle.

\`\`\`sql
-- Bestimmte Zeilen löschen
DELETE FROM bestellungen WHERE status = 'storniert';

-- Alle Zeilen einer Tabelle löschen (Tabelle bleibt bestehen!)
DELETE FROM bestellungen;
\`\`\`

**WICHTIG:** Ohne WHERE-Klausel werden **ALLE** Zeilen gelöscht!

**DELETE vs. TRUNCATE vs. DROP:**

| Befehl | Wirkung | Rückgängig? | Geschwindigkeit |
|--------|---------|-------------|----------------|
| DELETE FROM tabelle | Löscht alle Zeilen | Ja (mit Transaktionen) | Langsam |
| TRUNCATE TABLE tabelle | Löscht alle Zeilen | Nein | Schnell |
| DROP TABLE tabelle | Löscht Tabelle + Daten | Nein | Schnell |

**Wann DELETE, wann TRUNCATE?**
- **DELETE**: Wenn du bestimmte Zeilen löschen willst (mit WHERE)
- **DELETE ohne WHERE**: Wenn du alle Zeilen löschen willst und ein Rollback brauchst
- **TRUNCATE**: Wenn du alle Zeilen löschen willst und kein Rollback brauchst (schneller)

**Sicheres Löschen mit Unterabfrage:**

\`\`\`sql
-- Alle Bestellungen von Kunden, die seit über 2 Jahren inaktiv sind
DELETE FROM bestellungen
WHERE kunde_id IN (
  SELECT id FROM kunden
  WHERE letzter_login < DATE('now', '-2 years')
);
\`\`\`

**Tipp:** Vor dem Löschen immer zuerst ein SELECT mit derselben WHERE-Klausel ausführen, um zu prüfen, welche Zeilen betroffen sind:

\`\`\`sql
-- Erst prüfen:
SELECT * FROM bestellungen WHERE status = 'storniert';
-- Dann löschen:
DELETE FROM bestellungen WHERE status = 'storniert';
\`\`\``,
            keyTakeaways: [
              "DELETE löscht bestimmte Zeilen (mit WHERE) oder alle Zeilen (ohne WHERE)",
              "IMMER WHERE-Klausel verwenden — sonst werden ALLE Zeilen gelöscht!",
              "TRUNCATE ist schneller als DELETE ohne WHERE, aber nicht rückgängig zu machen",
              "Vor dem Löschen: SELECT mit derselben WHERE-Klausel ausführen",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 9: CTEs
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ctes",
    title: "Common Table Expressions (CTEs)",
    description: "Komplexe Abfragen strukturieren mit WITH — und rekursive CTEs für Hierarchien.",
    icon: "refresh",
    difficulty: "intermediate",
    articles: [
      {
        id: "cte-grundlagen",
        title: "CTE-Grundlagen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "was-sind-ctes",
            title: "Was sind CTEs?",
            sectionType: "theory",
            content: `Eine **Common Table Expression (CTE)** ist eine benannte temporäre Ergebnismenge, die innerhalb einer SELECT-Anweisung definiert wird.

**Syntax:**
\`\`\`sql
WITH cte_name AS (
  SELECT ...
)
SELECT ... FROM cte_name;
\`\`\`

**Vorteile von CTEs gegenüber Subqueries:**
1. **Lesbarkeit**: Komplexe Abfragen werden in benannte Blöcke aufgeteilt
2. **Wiederverwendbarkeit**: Eine CTE kann mehrfach in derselben Abfrage referenziert werden
3. **Wartbarkeit**: Änderungen müssen nur an einer Stelle vorgenommen werden
4. **Performance**: Der Optimizer kann CTEs effizienter verarbeiten

**CTEs vs. Subqueries:**
- Subquery in FROM: Wird für jede Referenz neu ausgeführt
- CTE: Wird einmal definiert und kann mehrfach referenziert werden`,
            keyTakeaways: [
              "CTE = benannte temporäre Ergebnismenge mit WITH",
              "Verbessert Lesbarkeit, Wiederverwendbarkeit und Wartbarkeit",
              "Kann mehrfach in derselben Abfrage referenziert werden",
              "Alternative zu Subqueries in der FROM-Klausel",
            ],
          },
          {
            id: "cte-beispiele",
            title: "CTE-Beispiele in der Praxis",
            sectionType: "example",
            content: `Praktische CTE-Beispiele, die zeigen, wie CTEs komplexe Abfragen lesbarer machen:

**1. Einfache CTE — Durchschnittspreis pro Kategorie:**

\`\`\`sql
WITH kategorie_preis AS (
  SELECT kategorie, AVG(preis) AS durchschnitt
  FROM produkte
  GROUP BY kategorie
)
SELECT p.name, p.preis, kp.durchschnitt
FROM produkte p
JOIN kategorie_preis kp ON p.kategorie = kp.kategorie
WHERE p.preis > kp.durchschnitt;
\`\`\`

Ohne CTE müsste die Unterabfrage zweimal geschrieben werden — einmal im JOIN und einmal im WHERE.

**2. Mehrere CTEs in einer Abfrage:**

\`\`\`sql
WITH
  kunden_umsatz AS (
    SELECT kunde_id, SUM(betrag) AS gesamt
    FROM bestellungen
    GROUP BY kunde_id
  ),
  top_kunden AS (
    SELECT kunde_id FROM kunden_umsatz WHERE gesamt > 500
  )
SELECT k.name, ku.gesamt
FROM kunden k
JOIN kunden_umsatz ku ON k.id = ku.kunde_id
WHERE k.id IN (SELECT kunde_id FROM top_kunden);
\`\`\`

**3. CTE statt verschachtelter Subqueries:**

Ohne CTE (schwer lesbar):
\`\`\`sql
SELECT name FROM produkte
WHERE kategorie IN (
  SELECT kategorie FROM (
    SELECT kategorie, COUNT(*) AS anzahl
    FROM produkte GROUP BY kategorie
  ) WHERE anzahl > 5
);
\`\`\`

Mit CTE (klar strukturiert):
\`\`\`sql
WITH grosse_kategorien AS (
  SELECT kategorie
  FROM produkte
  GROUP BY kategorie
  HAVING COUNT(*) > 5
)
SELECT name FROM produkte
WHERE kategorie IN (SELECT kategorie FROM grosse_kategorien);
\`\`\`

**Vorteile von CTEs:**
- Die Abfrage ist von oben nach unten lesbar
- Jede CTE hat einen beschreibenden Namen
- Änderungen müssen nur an einer Stelle vorgenommen werden
- Der Optimizer kann CTEs effizienter verarbeiten`,
            keyTakeaways: [
              "CTEs machen komplexe Abfragen lesbarer und wartbarer",
              "Mehrere CTEs mit Komma trennen (WITH a AS (...), b AS (...))",
              "CTEs können andere CTEs in derselben Abfrage referenzieren",
              "CTE = benannte Subquery — aber lesbarer",
            ],
          },
        ],
      },
      {
        id: "rekursive-ctes",
        title: "Rekursive CTEs",
        estimatedMinutes: 10,
        sections: [
          {
            id: "rekursive-cte-theorie",
            title: "Rekursive CTEs für Hierarchien",
            sectionType: "theory",
            content: `**Rekursive CTEs** erlauben es, hierarchische Datenstrukturen wie Organigramme, Bäume oder Netzwerke abzufragen.

**Syntax:**
\`\`\`sql
WITH RECURSIVE cte_name AS (
  -- Anker: Startpunkt der Rekursion
  SELECT ... FROM ... WHERE bedingung

  UNION ALL

  -- Rekursiver Teil: verweist auf sich selbst
  SELECT ... FROM ... JOIN cte_name ON ...
)
SELECT * FROM cte_name;
\`\`\`

**Bestandteile:**
1. **Anker-Query**: Der Startpunkt (z.B. der CEO in einem Organigramm)
2. **UNION ALL**: Verbindet Anker mit rekursivem Teil
3. **Rekursive Query**: Verweist auf die CTE selbst und geht eine Ebene tiefer

**Abbruchbedingung:** Die Rekursion stoppt automatisch, wenn der rekursive Teil keine neuen Zeilen mehr liefert.`,
            keyTakeaways: [
              "Rekursive CTEs für hierarchische Daten (Bäume, Organigramme)",
              "Besteht aus Anker-Query + UNION ALL + rekursiver Query",
              "Rekursion stoppt automatisch bei leerem Ergebnis",
              "WITH RECURSIVE in SQLite/MySQL",
            ],
          },
          {
            id: "rekursive-cte-beispiel",
            title: "Rekursive CTE: Organigramm",
            sectionType: "practice",
            content: `Ein klassisches Beispiel: Alle Mitarbeiter in der Hierarchie unter dem CEO finden.

**Szenario:** Wir haben eine Mitarbeitertabelle mit einem Selbstverweis auf den Vorgesetzten:

\`\`\`sql
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  vorgesetzter_id INTEGER,
  abteilung VARCHAR(50)
);

INSERT INTO mitarbeiter VALUES
  (1, 'Müller (CEO)', NULL, 'Geschäftsführung'),
  (2, 'Schmidt', 1, 'Entwicklung'),
  (3, 'Weber', 1, 'Vertrieb'),
  (4, 'Klein', 2, 'Entwicklung'),
  (5, 'Braun', 2, 'Entwicklung'),
  (6, 'Fischer', 3, 'Vertrieb');
\`\`\`

**Rekursive CTE — Alle Untergebenen des CEOs:**

\`\`\`sql
WITH RECURSIVE hierarchie AS (
  -- Anker: Der CEO (kein Vorgesetzter)
  SELECT id, name, vorgesetzter_id, abteilung, 0 AS ebene
  FROM mitarbeiter
  WHERE vorgesetzter_id IS NULL

  UNION ALL

  -- Rekursiver Teil: Eine Ebene tiefer
  SELECT m.id, m.name, m.vorgesetzter_id, m.abteilung, h.ebene + 1
  FROM mitarbeiter m
  JOIN hierarchie h ON m.vorgesetzter_id = h.id
)
SELECT * FROM hierarchie ORDER BY ebene;
\`\`\`

**Ergebnis:**

| id | name | vorgesetzter_id | abteilung | ebene |
|----|------|-----------------|-----------|-------|
| 1 | Müller (CEO) | NULL | Geschäftsführung | 0 |
| 2 | Schmidt | 1 | Entwicklung | 1 |
| 3 | Weber | 1 | Vertrieb | 1 |
| 4 | Klein | 2 | Entwicklung | 2 |
| 5 | Braun | 2 | Entwicklung | 2 |
| 6 | Fischer | 3 | Vertrieb | 2 |

**Wie es funktioniert:**
1. **Anker-Query:** Findet den CEO (vorgesetzter_id IS NULL) — Ebene 0
2. **Rekursion:** Findet alle Mitarbeiter, deren Vorgesetzter in der aktuellen Ebene ist — Ebene + 1
3. **Abbruch:** Wenn keine neuen Mitarbeiter mehr gefunden werden, stoppt die Rekursion

**Weitere Anwendungen für rekursive CTEs:**
- Stücklisten (BOM — Bill of Materials)
- Freundesnetzwerke (Freunde von Freinden)
- Kalender-Generierung (alle Tage eines Monats)
- Pfadsuche in Graphen`,
            keyTakeaways: [
              "Anker-Query definiert den Startpunkt der Rekursion",
              "Rekursiver Teil verweist auf die CTE selbst",
              "UNION ALL verbindet Anker mit rekursivem Teil",
              "Rekursion stoppt automatisch bei leerem Ergebnis",
              "Ebene/Depth-Spalte zeigt die Hierarchie-Tiefe",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MODUL 10: Window Functions
  // ═══════════════════════════════════════════════════════════════
  {
    id: "window-functions",
    title: "Window Functions",
    description: "ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD und laufende Summen — analytische Funktionen meistern.",
    icon: "bar-chart",
    difficulty: "intermediate",
    articles: [
      {
        id: "window-grundlagen",
        title: "Window Function-Grundlagen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "was-sind-window-functions",
            title: "Was sind Window Functions?",
            sectionType: "theory",
            content: `**Window Functions** berechnen einen Wert über eine Menge von Zeilen, die mit der aktuellen Zeile zusammenhängen — ohne die Zeilen zu gruppieren (wie GROUP BY).

**Syntax:**
\`\`\`sql
funktion() OVER (
  PARTITION BY spalte
  ORDER BY spalte
  ROWS BETWEEN ... AND ...
)
\`\`\`

**Unterschied zu GROUP BY:**
- GROUP BY: Fasst Zeilen zusammen (eine Ergebniszeile pro Gruppe)
- Window Function: Behält alle Zeilen, fügt berechnete Spalten hinzu

**Wichtige Window Functions:**

| Funktion | Beschreibung |
|----------|-------------|
| ROW_NUMBER() | Fortlaufende Nummer pro Zeile |
| RANK() | Rang mit Lücken bei Gleichstand |
| DENSE_RANK() | Rang ohne Lücken bei Gleichstand |
| LAG() | Wert der vorherigen Zeile |
| LEAD() | Wert der nächsten Zeile |
| SUM() OVER | Laufende Summe |
| AVG() OVER | Laufender Durchschnitt |`,
            keyTakeaways: [
              "Window Functions berechnen Werte über Zeilenmengen ohne Gruppierung",
              "OVER() definiert das 'Fenster' (Partition + Sortierung)",
              "PARTITION BY = Gruppierung, ORDER BY = Sortierung im Fenster",
              "Im Gegensatz zu GROUP BY bleiben alle Zeilen erhalten",
            ],
          },
          {
            id: "row-number-rank",
            title: "ROW_NUMBER, RANK und DENSE_RANK",
            sectionType: "example",
            content: `Die drei Ranking-Funktionen im Vergleich:

**ROW_NUMBER()** — Fortlaufende Nummer ohne Ausnahme:

\`\`\`sql
SELECT name, kategorie, preis,
  ROW_NUMBER() OVER (ORDER BY preis DESC) AS zeilen_nr
FROM produkte;
\`\`\`

Jede Zeile bekommt eine eindeutige Nummer, auch bei gleichem Preis.

**RANK()** — Rang mit Lücken bei Gleichstand:

\`\`\`sql
SELECT name, preis,
  RANK() OVER (ORDER BY preis DESC) AS rang
FROM produkte;
\`\`\`

Bei gleichem Preis bekommen beide denselben Rang, aber der nächste Rang wird übersprungen.

| name | preis | rang |
|------|-------|------|
| Produkt A | 100 | 1 |
| Produkt B | 80 | 2 |
| Produkt C | 80 | 2 |
| Produkt D | 50 | 4 | ← Rang 3 wird übersprungen!

**DENSE_RANK()** — Rang ohne Lücken:

\`\`\`sql
SELECT name, preis,
  DENSE_RANK() OVER (ORDER BY preis DESC) AS dichter_rang
FROM produkte;
\`\`\`

| name | preis | dichter_rang |
|------|-------|-------------|
| Produkt A | 100 | 1 |
| Produkt B | 80 | 2 |
| Produkt C | 80 | 2 |
| Produkt D | 50 | 3 | ← Kein Sprung!

**Praktische Anwendung: Top-N pro Kategorie**

\`\`\`sql
-- Die 3 teuersten Produkte pro Kategorie
SELECT name, kategorie, preis
FROM (
  SELECT name, kategorie, preis,
    ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rn
  FROM produkte
) ranked
WHERE rn <= 3;
\`\`\`

**Wann welche Funktion?**
- **ROW_NUMBER**: Eindeutige Nummerierung, keine Gleichstände möglich
- **RANK**: Olympische Medaillenwertung (Gleichstand = gleicher Platz, Sprung danach)
- **DENSE_RANK**: Fortlaufende Platzierung ohne Lücken`,
            keyTakeaways: [
              "ROW_NUMBER: Jede Zeile bekommt eine eindeutige Nummer",
              "RANK: Gleichstand = gleicher Rang, nächster Rang wird übersprungen",
              "DENSE_RANK: Gleichstand = gleicher Rang, kein Sprung",
              "PARTITION BY für Top-N pro Gruppe",
            ],
          },
        ],
      },
      {
        id: "lag-lead-laufende-summen",
        title: "LAG, LEAD und laufende Summen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "lag-lead",
            title: "LAG und LEAD",
            sectionType: "example",
            content: `**LAG()** greift auf den Wert der vorherigen Zeile zu, **LEAD()** auf den Wert der nächsten Zeile.

\`\`\`sql
LAG(spalte, offset, standardwert) OVER (ORDER BY ...)
LEAD(spalte, offset, standardwert) OVER (ORDER BY ...)
\`\`\`

- **offset**: Wie viele Zeilen zurück/vor (Standard: 1)
- **standardwert**: Wert, wenn keine Zeile existiert (Standard: NULL)`,
          },
          {
            id: "laufende-summen",
            title: "Laufende Summen und Window Frames",
            sectionType: "practice",
            content: `**Laufende Summen (Running Totals)** berechnen eine kumulative Summe bis zur aktuellen Zeile:

\`\`\`sql
-- Laufende Summe der Bestellbeträge
SELECT
  bestelldatum,
  kunde_id,
  betrag,
  SUM(betrag) OVER (
    ORDER BY bestelldatum
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS laufende_summe
FROM bestellungen;
\`\`\`

**Ergebnis:**

| bestelldatum | kunde_id | betrag | laufende_summe |
|-------------|----------|--------|---------------|
| 2024-01-15 | 1 | 50.00 | 50.00 |
| 2024-01-20 | 2 | 30.00 | 80.00 |
| 2024-02-01 | 1 | 70.00 | 150.00 |
| 2024-02-15 | 3 | 20.00 | 170.00 |

**Window Frames — Das Fenster definieren:**

\`\`\`sql
ROWS BETWEEN start AND ende
\`\`\`

| Frame | Bedeutung |
|-------|----------|
| UNBOUNDED PRECEDING | Vom Anfang |
| CURRENT ROW | Aktuelle Zeile |
| UNBOUNDED FOLLOWING | Bis zum Ende |
| n PRECEDING | n Zeilen vorher |
| n FOLLOWING | n Zeilen nachher |

**Praktische Beispiele:**

\`\`\`sql
-- 3-Zeilen-Durchschnitt (aktuelle + 2 vorherige)
SELECT datum, wert,
  AVG(wert) OVER (ORDER BY datum ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
    AS gleitender_durchschnitt
FROM messungen;

-- Laufende Summe pro Kunde
SELECT bestelldatum, kunde_id, betrag,
  SUM(betrag) OVER (
    PARTITION BY kunde_id
    ORDER BY bestelldatum
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS kunden_summe
FROM bestellungen;

-- Differenz zum Vormonat
SELECT monat, umsatz,
  umsatz - LAG(umsatz, 1) OVER (ORDER BY monat) AS veraenderung
FROM monatlicher_umsatz;
\`\`\`

**Wichtig:** Wenn du \`ORDER BY\` ohne expliziten Frame verwendest, ist der Standard-Frame \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` — das ergibt eine laufende Summe. Ohne \`ORDER BY\` ist der Frame die gesamte Tabelle.`,
            keyTakeaways: [
              "Laufende Summe: SUM() OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING)",
              "Window Frames definieren den Bereich der Berechnung",
              "PARTITION BY + ORDER BY = laufende Summe pro Gruppe",
              "LAG() für Vergleiche mit der vorherigen Zeile",
              "ORDER BY ohne Frame ergibt laufende Aggregation",
            ],
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