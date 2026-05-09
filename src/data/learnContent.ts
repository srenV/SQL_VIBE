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
            content: `Die Normalisierung ist ein schrittweiser Prozess, bei dem jede Stufe die Probleme der vorherigen beseitigt. Man beginnt mit unstrukturierten Daten und geht systematisch vor: Zuerst werden nicht-atomare Werte und wiederholende Gruppen eliminiert (1NF), dann partielle Abhängigkeiten vom Primärschlüssel (2NF), dann transitive Abhängigkeiten zwischen Nicht-Schlüssel-Attributen (3NF), und schließlich überlappende Kandidatenschlüssel (BCNF). Jede Stufe baut auf der vorherigen auf — man kann nicht 3NF erreichen, ohne zuerst 1NF und 2NF zu erfüllen.

Hier ist ein Überblick über die wichtigsten Normalformen und ihre Bedingungen:

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
            content: `Die Erste Normalform (1NF) ist die Grundvoraussetzung für eine saubere Datenbankstruktur. Sie verlangt, dass jedes Attribut genau einen atomaren Wert enthält — also keine Listen, keine verschachtelten Strukturen und keine wiederholenden Gruppen. In der Praxis bedeutet das: Wenn du in einer Zelle „Mathematik, Physik, Chemie" stehen hast, verletzt du die 1NF, weil mehrere Werte in einer Zelle stecken. Ebenso verletzt es die 1NF, wenn du Spalten wie Kurs1, Kurs2, Kurs3 anlegst, weil das eine wiederholende Gruppe ist.

**Nicht in 1NF — Verletzung der Atomarität:**

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
            content: `Die Zweite Normalform (2NF) beseitigt partielle Abhängigkeiten. Eine partielle Abhängigkeit liegt vor, wenn ein Nicht-Schlüssel-Attribut nur von einem Teil des Primärschlüssels abhängt — nicht vom gesamten Schlüssel. Das passiert nur bei zusammengesetzten Primärschlüsseln (aus mehreren Spalten). Die Lösung: Spalte die Tabelle auf, sodass jedes Nicht-Schlüssel-Attribut vom gesamten Primärschlüssel abhängt.

**In 1NF, aber nicht in 2NF:**

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
            content: `Die Dritte Normalform (3NF) beseitigt transitive Abhängigkeiten. Eine transitive Abhängigkeit liegt vor, wenn ein Nicht-Schlüssel-Attribut von einem anderen Nicht-Schlüssel-Attribut abhängt, nicht direkt vom Primärschlüssel. Das klassische Beispiel: Student_ID bestimmt die PLZ, und die PLZ bestimmt die Stadt. Damit hängt die Stadt transitiv von der Student_ID ab — über die PLZ als Zwischenglied. Das Problem: Wenn sich die Zuordnung PLZ → Stadt ändert, musst du alle Studenten mit dieser PLZ aktualisieren. In der 3NF spaltest du die Tabelle auf, sodass jede Abhängigkeit nur direkt von ihrem eigenen Schlüssel abhängt.

**In 2NF, aber nicht in 3NF:**

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
            content: `Die Boyce-Codd-Normalform (BCNF) ist eine Verschärfung der 3NF. Sie verlangt, dass für jede funktionale Abhängigkeit X → Y die Determinante X ein Kandidatenschlüssel sein muss. Das Problem der 3NF: Es kann funktionale Abhängigkeiten geben, bei denen die Determinante kein Kandidatenschlüssel ist — sogenannte überlappende Kandidatenschlüssel. Die BCNF schließt diese Lücke.

**In 3NF, aber nicht in BCNF:**

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
      {
        id: "normalisierungsziele",
        title: "Ziele der Normalisierung",
        estimatedMinutes: 10,
        sections: [
          {
            id: "warum-normalisieren-ziele",
            title: "Die Ziele der Normalisierung",
            sectionType: "theory",
            content: `Die Normalisierung verfolgt drei zentrale Ziele:

**1. Datenredundanz vermeiden**
Jedes Fakt wird genau einmal gespeichert. Redundanz führt zu Inkonsistenzen, wenn dieselbe Information an mehreren Stellen aktualisiert werden muss.

*Beispiel:* Ein Kundenname wird in jeder Bestellung gespeichert → ändert sich der Name, muss er in allen Bestellungen aktualisiert werden. Nach Normalisierung wird der Name nur in der Kundentabelle gespeichert.

**2. Anomalien verhindern**
- **Einfüge-Anomalie:** Daten können nicht eingefügt werden, weil andere Pflichtfelder fehlen
- **Änderungs-Anomalie:** Änderungen müssen an mehreren Stellen durchgeführt werden
- **Lösch-Anomalie:** Das Löschen einer Zeile löscht versehentlich andere Informationen

**3. Datenintegrität sicherstellen**
Durch Primärschlüssel, Fremdschlüssel und Constraints wird sichergestellt, dass die Daten konsistent und korrekt bleiben.

**Trade-offs der Normalisierung:**
- **Vorteil:** Konsistenz, keine Anomalien, weniger Speicherplatz
- **Nachteil:** Mehr Tabellen → mehr JOINs → potenziell langsamere Abfragen
- **Lösung:** Erst normalisieren, dann gezielt denormalisieren wo Performance es erfordert`,
            keyTakeaways: [
              "Datenredundanz vermeiden — jedes Fakt nur einmal speichern",
              "Anomalien verhindern — Einfüge-, Änderungs- und Lösch-Anomalien",
              "Datenintegrität sichern — durch Schlüssel und Constraints",
              "Trade-off: Normalisierung verbessert Konsistenz, kann aber Performance kosten",
            ],
          },
          {
            id: "normalisierung-vs-denormalisierung",
            title: "Normalisierung vs. Denormalisierung",
            sectionType: "example",
            content: `Die Entscheidung zwischen Normalisierung und Denormalisierung ist kein Entweder-Oder, sondern eine Abwägung zwischen Konsistenz und Performance. Normalisierung eliminiert Redundanz und Anomalien, erfordert aber mehr JOINs. Denormalisierung verbessert die Lese-Performance, riskiert aber Inkonsistenzen bei Schreibzugriffen. Die Faustregel: Erst konsequent normalisieren (mindestens 3NF), dann gezielt denormalisieren, wenn Performance-Engpässe nachgewiesen sind.

**Normalisieren (bis 3NF):**
- Operative Datenbanken (OLTP) mit vielen Schreibzugriffen
- Wenn Datenkonsistenz oberste Priorität hat
- Wenn mehrere Benutzer gleichzeitig Daten ändern

**Denormalisieren (bewusst):**
- Data Warehouses und Reporting (OLAP)
- Wenn Lese-Performance wichtiger ist als Schreib-Performance
- Wenn bestimmte Abfragen sehr häufig sind und viele JOINs erfordern

**Beispiel — Denormalisierung für Reporting:**

Normalisiert (3 Tabellen):
\`\`\`
kunden(id, name, stadt)
bestellungen(id, kunde_id, datum, betrag)
produkte(id, name, preis)
\`\`\`

---

Denormalisiert für Reporting (1 Tabelle):
\`\`\`
bestellreport(id, kunde_name, kunde_stadt, bestelldatum, produkt_name, betrag)
\`\`\`

---

**Best Practice:**
1. Zuerst konsequent normalisieren (mindestens 3NF)
2. Performance messen
3. Nur bei nachgewiesenen Engpässen gezielt denormalisieren
4. Denormalisierung dokumentieren und begründen`,
            keyTakeaways: [
              "OLTP → normalisieren, OLAP → denormalisieren",
              "Erst normalisieren, dann gezielt denormalisieren",
              "Denormalisierung immer dokumentieren und begründen",
              "Performance-Engpässe messen, nicht vermuten",
            ],
          },
        ],
      },
      {
        id: "funktionale-abhaengigkeiten",
        title: "Funktionale Abhängigkeiten",
        estimatedMinutes: 12,
        sections: [
          {
            id: "fd-definition",
            title: "Was sind funktionale Abhängigkeiten?",
            sectionType: "theory",
            content: `Eine **funktionale Abhängigkeit (FD)** ist die Grundlage der Normalisierungstheorie. Sie beschreibt, welche Attribute andere Attribute bestimmen.

**Definition:** X → Y (gelesen: „X bestimmt Y" oder „Y hängt funktional von X ab")
bedeutet: Wenn zwei Tupel in den Attributen von X übereinstimmen, dann stimmen sie auch in den Attributen von Y überein.

**Beispiel:**
In einer Tabelle Studenten(Matrikelnummer, Name, Studiengang):
- Matrikelnummer → Name (die Matrikelnummer bestimmt den Namen)
- Matrikelnummer → Studiengang (die Matrikelnummer bestimmt den Studiengang)
- Name → Matrikelnummer? Nein! Zwei Studenten können denselben Namen haben.

**Arten funktionaler Abhängigkeiten:**

| Art | Beschreibung | Beispiel |
|-----|-------------|----------|
| Voll funktional | Y hängt vom gesamten X ab | (Student_ID, Kurs_ID) → Note |
| Partiell | Y hängt nur von einem Teil von X ab | (Student_ID, Kurs_ID) → Student_Name |
| Transitiv | X → Y → Z | PLZ → Stadt |
| Trivial | Y ist Teilmenge von X | (Name, PLZ) → Name |

**Wichtig:** Funktionale Abhängigkeiten sind Eigenschaften der **realen Welt**, nicht der Tabelle! Man muss verstehen, welche Abhängigkeiten in der Domäne gelten, um richtig zu normalisieren.`,
            keyTakeaways: [
              "X → Y: X bestimmt Y eindeutig",
              "Volle funktionale Abhängigkeit: Y hängt vom gesamten Schlüssel ab",
              "Partielle Abhängigkeit: Y hängt nur von einem Teil des Schlüssels ab → 2NF-Verletzung",
              "Transitive Abhängigkeit: X → Y → Z → 3NF-Verletzung",
              "FDs sind Eigenschaften der realen Welt, nicht der Tabelle",
            ],
          },
          {
            id: "fd-bestimmen",
            title: "Funktionale Abhängigkeiten bestimmen",
            sectionType: "practice",
            content: `Wie findet man funktionale Abhängigkeiten in einer gegebenen Tabelle?

**Schritt 1: Alle Attribute auflisten**
Beispiel-Tabelle Bestellungen:
Bestell_ID, Kunde_ID, Kunde_Name, Kunde_PLZ, Kunde_Stadt, Produkt_ID, Menge, Produkt_Name, Preis

**Schritt 2: Für jedes Attribut prüfen: Was bestimmt es?**
- Bestell_ID → alle anderen Attribute? Nein, nicht direkt (nur Kunde_ID, Produkt_ID, Menge)
- Kunde_ID → Kunde_Name, Kunde_PLZ, Kunde_Stadt
- Produkt_ID → Produkt_Name, Preis
- (Bestell_ID) → Kunde_ID, Produkt_ID, Menge

**Schritt 3: FDs notieren**
- Bestell_ID → Kunde_ID, Produkt_ID, Menge
- Kunde_ID → Kunde_Name, Kunde_PLZ, Kunde_Stadt
- Produkt_ID → Produkt_Name, Preis

**Schritt 4: Abhängigkeiten klassifizieren**
- Bestell_ID → Kunde_ID: volle Abhängigkeit (vom Primärschlüssel)
- Kunde_ID → Kunde_Name: transitive Abhängigkeit (über Kunde_ID)
- Produkt_ID → Produkt_Name: transitive Abhängigkeit (über Produkt_ID)

**Schritt 5: Normalform bestimmen**
- 1NF? Ja (alle Werte atomar)
- 2NF? Ja (keine partiellen Abhängigkeiten, da einfacher Primärschlüssel)
- 3NF? Nein (transitive Abhängigkeiten: Kunde_ID → Kunde_Name, Produkt_ID → Produkt_Name)

**Übung:** Bestimme die funktionalen Abhängigkeiten für:
Mitarbeiter(ID, Name, Abteilung, Abteilungsleiter, Gehalt, Gehaltsstufe)

Lösung:
- ID → Name, Abteilung, Gehalt, Gehaltsstufe
- Abteilung → Abteilungsleiter
- Gehaltsstufe → Gehalt (oder umgekehrt, je nach Domäne)`,
            keyTakeaways: [
              "FDs systematisch bestimmen: Attribute auflisten → Abhängigkeiten prüfen → notieren",
              "Jede FD ist eine Aussage über die reale Welt",
              "Transitive Abhängigkeiten erkennen: A → B → C",
              "Partielle Abhängigkeiten erkennen: Y hängt nur von einem Teil des Schlüssels ab",
            ],
          },
        ],
      },
      {
        id: "normalisierung-schritt-fuer-schritt",
        title: "Normalisierung Schritt für Schritt",
        estimatedMinutes: 15,
        sections: [
          {
            id: "nf-schritt-1nf",
            title: "Von der unnormalisierten Tabelle zur 1NF",
            sectionType: "theory",
            content: `Wir normalisieren eine unnormalisierte Tabelle Schritt für Schritt bis zur 3NF.

**Ausgangstabelle (UNF — Unnormalized Form):**

| Bestell_ID | Kunde | Produkte | Lieferadresse |
|------------|-------|----------|---------------|
| 1 | Anna, Berlin | (Laptop, 999€), (Maus, 29€) | Berlin, Hauptstr. 1 |
| 2 | Ben, München | (Tastatur, 79€) | München, Markt 5 |

**Probleme:**
- „Kunde" enthält Name UND Stadt (nicht atomar)
- „Produkte" enthält mehrere Werte (nicht atomar)
- „Lieferadresse" enthält Straße UND Stadt (nicht atomar)

**Schritt 1: 1NF erreichen — Alle Werte atomar machen**

| Bestell_ID | Kunde_Name | Kunde_Stadt | Produkt | Preis | Liefer_Strasse | Liefer_Stadt |
|------------|-----------|-------------|---------|-------|---------------|-------------|
| 1 | Anna | Berlin | Laptop | 999 | Hauptstr. 1 | Berlin |
| 1 | Anna | Berlin | Maus | 29 | Hauptstr. 1 | Berlin |
| 2 | Ben | München | Tastatur | 79 | Markt 5 | München |

Jetzt ist jede Zelle atomar. Der Primärschlüssel ist (Bestell_ID, Produkt).`,
            keyTakeaways: [
              "UNF: Unnormalisierte Tabelle mit wiederholenden Gruppen und nicht-atomaren Werten",
              "1NF: Jede Zelle enthält genau einen atomaren Wert",
              "Wiederholende Gruppen werden in separate Zeilen aufgelöst",
              "Primärschlüssel kann sich durch die Umwandlung ändern",
            ],
          },
          {
            id: "nf-schritt-2nf-3nf",
            title: "Von der 1NF zur 2NF und 3NF",
            sectionType: "practice",
            content: `**Ausgangspunkt: 1NF-Tabelle**

| Bestell_ID | Kunde_Name | Kunde_Stadt | Produkt | Preis | Liefer_Strasse | Liefer_Stadt |
|------------|-----------|-------------|---------|-------|---------------|-------------|

Primärschlüssel: (Bestell_ID, Produkt)

**Schritt 2: 2NF erreichen — Partielle Abhängigkeiten entfernen**

Partielle Abhängigkeiten:
- Kunde_Name hängt nur von Bestell_ID ab (nicht von Produkt)
- Kunde_Stadt hängt nur von Bestell_ID ab
- Preis hängt nur von Produkt ab (nicht von Bestell_ID)
- Liefer_Strasse und Liefer_Stadt hängen nur von Bestell_ID ab

**Aufspaltung:**

Bestellungen(Bestell_ID, Kunde_Name, Kunde_Stadt, Liefer_Strasse, Liefer_Stadt)
Bestellpositionen(Bestell_ID, Produkt, Preis)

**Schritt 3: 3NF erreichen — Transitive Abhängigkeiten entfernen**

In der Tabelle Bestellungen:
- Bestell_ID → Kunde_Name, Kunde_Stadt, Liefer_Strasse, Liefer_Stadt
- Aber: Kunde_Stadt hängt von Kunde_Name ab? Nein, besser: Wir brauchen eine Kunde_ID!

**Korrigierte Aufspaltung:**

Kunden(Kunde_ID, Kunde_Name, Kunde_Stadt)
Bestellungen(Bestell_ID, Kunde_ID, Liefer_Strasse, Liefer_Stadt)
Bestellpositionen(Bestell_ID, Produkt, Preis)
Produkte(Produkt_ID, Produkt_Name, Preis)

Jetzt ist jede Tabelle in 3NF:
- Jedes Nicht-Schlüssel-Attribut hängt direkt vom Primärschlüssel ab
- Keine transitiven Abhängigkeiten
- Keine partiellen Abhängigkeiten

**Zusammenfassung der Normalisierungsschritte:**

| Schritt | Problem | Lösung |
|---------|---------|--------|
| UNF → 1NF | Nicht-atomare Werte, wiederholende Gruppen | Werte atomar machen |
| 1NF → 2NF | Partielle Abhängigkeiten | Tabelle aufspalten |
| 2NF → 3NF | Transitive Abhängigkeiten | Tabelle aufspalten |`,
            keyTakeaways: [
              "1NF → 2NF: Partielle Abhängigkeiten in eigene Tabellen auslagern",
              "2NF → 3NF: Transitive Abhängigkeiten in eigene Tabellen auslagern",
              "Jeder Schritt baut auf dem vorherigen auf",
              "Fremdschlüssel sichern die Beziehungen zwischen den aufgespaltenen Tabellen",
            ],
          },
        ],
      },
      {
        id: "denormalisierung",
        title: "Denormalisierung — Wann weniger Normalform besser ist",
        estimatedMinutes: 10,
        sections: [
          {
            id: "wann-denormalisieren",
            title: "Wann Denormalisierung sinnvoll ist",
            sectionType: "theory",
            content: `**Denormalisierung** ist die bewusste Rückkehr zu einer niedrigeren Normalform, um die Lese-Performance zu verbessern.

**Gute Gründe für Denormalisierung:**

1. **Performance bei häufigen JOINs**
   Wenn eine Abfrage 5+ Tabellen JOINen muss und sehr häufig ausgeführt wird, kann eine denormalisierte Tabelle deutlich schneller sein.

2. **Berechnete Spalten cachen**
   Statt \`SUM(betrag)\` bei jeder Abfrage neu zu berechnen, kann ein \`gesamtbetrag\` in der Tabelle gespeichert werden.

3. **Data Warehousing**
   In OLAP-Systemen (Analyse, Reporting) ist Denormalisierung Standard. Star-Schema und Snowflake-Schema sind bewusst denormalisiert.

4. **Historische Daten**
   Wenn der historische Zustand einer Entität gespeichert werden soll (z.B. Preis zum Zeitpunkt der Bestellung).

**Schlechte Gründe für Denormalisierung:**
- „JOINs sind kompliziert" → Lerne JOINs statt zu denormalisieren
- „Ich brauche nur eine Tabelle" → Das ist ein Designfehler
- „Es ist schneller zu implementieren" → Technische Schuld

**Denormalisierungs-Strategien:**

| Strategie | Beschreibung | Beispiel |
|-----------|-------------|----------|
| Redundante Spalte | Häufig benötigte Spalte duplizieren | \`kunde_name\` in Bestellungen |
| Vorberechnete Spalte | Aggregationsergebnis speichern | \`anzahl_bestellungen\` in Kunden |
| Zusammengefasste Tabelle | Mehrere Tabellen zusammenführen | Bestell-Report-Tabelle |
| Snapshot | Historischen Zustand einfrieren | \`preis_zur_bestellung\` |`,
            keyTakeaways: [
              "Denormalisierung = bewusste Rückkehr zu niedrigerer Normalform",
              "Gut für: häufige JOINs, berechnete Spalten, OLAP, Historisierung",
              "Schlecht für: OLTP, wenn Konsistenz wichtiger ist als Performance",
              "Immer erst normalisieren, dann gezielt denormalisieren",
            ],
          },
          {
            id: "denormalisierung-beispiel",
            title: "Denormalisierung in der Praxis",
            sectionType: "example",
            content: `**Beispiel: Online-Shop mit Bestell-Reporting**

**Normalisiert (3NF):**
\`\`\`sql
-- 4 Tabellen, 3 JOINs für eine Bestellübersicht
SELECT k.name, b.datum, p.name AS produkt, bp.menge, bp.einzelpreis
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
JOIN bestellpositionen bp ON b.id = bp.bestellung_id
JOIN produkte p ON bp.produkt_id = p.id;
\`\`\`

---

**Denormalisiert (für Reporting):**
\`\`\`sql
-- 1 Tabelle, kein JOIN
SELECT kunde_name, bestelldatum, produkt_name, menge, einzelpreis
FROM bestellreport;
\`\`\`

---

**Wann welche Version?**

| Szenario | Empfehlung |
|----------|-----------|
| Online-Bestellung (OLTP) | Normalisiert — Konsistenz ist wichtig |
| Tagesreport (OLAP) | Denormalisiert — Performance ist wichtig |
| Kunden-Dashboard | Normalisiert mit View |
| Monatsabschluss-Report | Denormalisiert als Materialized View |

**Wichtig:** Denormalisierung bedeutet **nicht**, dass man die normalisierten Tabellen löscht! Man behält die normalisierten Tabellen für Schreibzugriffe und erstellt zusätzliche denormalisierte Tabellen/Views für Lesezugriffe.

**Trigger für automatische Synchronisation:**
\`\`\`sql
-- Bei jeder neuen Bestellung den Bestellreport aktualisieren
CREATE TRIGGER update_report
AFTER INSERT ON bestellpositionen
BEGIN
  INSERT OR REPLACE INTO bestellreport (...)
  SELECT ... FROM ... ;
END;
\`\`\`

---

So bleibt die Denormalisierung konsistent, ohne dass manuelle Updates nötig sind.`,
            keyTakeaways: [
              "Normalisierte Tabellen behalten, denormalisierte zusätzlich erstellen",
              "OLTP = normalisiert, OLAP = denormalisiert",
              "Trigger können denormalisierte Tabellen automatisch synchronisieren",
              "Denormalisierung ist eine bewusste Design-Entscheidung, kein Notbehelf",
            ],
          },
        ],
      },
      {
        id: "normalisierung-fehler",
        title: "Häufige Normalisierungs-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "nf-fehler-liste",
            title: "Die häufigsten Fehler bei der Normalisierung",
            sectionType: "theory",
            content: `**Fehler 1: Zu früh denormalisieren**
Viele Entwickler denormalisieren aus Performance-Gründen, bevor sie überhaupt ein Performance-Problem haben. **Richtig:** Erst normalisieren, dann bei nachgewiesenen Engpässen gezielt denormalisieren.

**Fehler 2: 1NF-Verletzungen übersehen**
- Listen in einer Zelle („Mathe, Physik, Chemie")
- Wiederholende Gruppen (Spalte1, Spalte2, Spalte3)
- Zusammengesetzte Werte („Anna Müller" statt Vorname/Nachname)

**Fehler 3: Zusammengesetzte Schlüssel nicht erkennen**
Wenn der Primärschlüssel aus mehreren Spalten besteht, muss man auf partielle Abhängigkeiten prüfen. Häufig wird dies übersehen.

**Fehler 4: Transitive Abhängigkeiten übersehen**
\`Kunde_ID → PLZ → Stadt\` — PLZ bestimmt die Stadt, aber die Stadt wird trotzdem in der Kundentabelle gespeichert.

**Fehler 5: BCNF-Verletzungen in der Praxis**
Bei überlappenden Kandidatenschlüsseln kann 3NF erreicht sein, aber BCNF nicht. Beispiel: (Student, Kurs) → Dozent und Dozent → Kurs.

**Fehler 6: Normalisierung als Ziel statt als Mittel**
Normalisierung ist ein Werkzeug zur Vermeidung von Anomalien, kein Selbstzweck. Manchmal ist eine niedrigere Normalform bewusst besser.

**Fehler 7: Fremdschlüssel vergessen**
Nach dem Aufspalten von Tabellen müssen Fremdschlüssel definiert werden, um die Beziehungen zu sichern.`,
            keyTakeaways: [
              "Nicht zu früh denormalisieren — erst bei nachgewiesenen Engpässen",
              "1NF-Verletzungen: Listen, wiederholende Gruppen, zusammengesetzte Werte",
              "Zusammengesetzte Schlüssel erfordern Prüfung auf partielle Abhängigkeiten",
              "Transitive Abhängigkeiten: A → B → C erkennen und auflösen",
              "Fremdschlüssel nach dem Aufspalten nicht vergessen",
            ],
          },
          {
            id: "nf-fehler-uebungen",
            title: "Fehler erkennen und korrigieren",
            sectionType: "practice",
            content: `**Übung 1: Welche Normalform wird verletzt?**

Tabelle: Buchungen(Buchung_ID, Raum_Nummer, Raum_Typ, Raum_Preis, Gast_ID, Gast_Name, Check_in, Check_out)

- Raum_Typ hängt von Raum_Nummer ab → **Transitive Abhängigkeit** → 3NF-Verletzung
- Raum_Preis hängt von Raum_Nummer ab → **Transitive Abhängigkeit** → 3NF-Verletzung
- Gast_Name hängt von Gast_ID ab → **Transitive Abhängigkeit** → 3NF-Verletzung

**Korrektur:** Aufspalten in:
- Buchungen(Buchung_ID, Raum_Nummer, Gast_ID, Check_in, Check_out)
- Räume(Raum_Nummer, Raum_Typ, Raum_Preis)
- Gäste(Gast_ID, Gast_Name)

---

**Übung 2: 1NF-Verletzung erkennen**

Tabelle: Studenten(ID, Name, Kurse)
| ID | Name | Kurse |
|----|------|-------|
| 1 | Anna | Mathe, Physik |
| 2 | Ben | Deutsch |

**Problem:** Die Spalte „Kurse" enthält mehrere Werte → 1NF-Verletzung

**Korrektur:**
Studenten(ID, Name)
Belegungen(Student_ID, Kurs)

---

**Übung 3: 2NF-Verletzung erkennen**

Tabelle: Noten(Student_ID, Kurs_ID, Student_Name, Note)
Primärschlüssel: (Student_ID, Kurs_ID)

**Problem:** Student_Name hängt nur von Student_ID ab → Partielle Abhängigkeit → 2NF-Verletzung

**Korrektur:**
Studenten(Student_ID, Student_Name)
Noten(Student_ID, Kurs_ID, Note)

---

**Übung 4: BCNF-Verletzung erkennen**

Tabelle: Stundenplan(Student, Kurs, Dozent)
- (Student, Kurs) → Dozent (Primärschlüssel)
- Dozent → Kurs (Dozent bestimmt den Kurs)

**Problem:** Dozent ist keine Determinante, die ein Kandidatenschlüssel ist → BCNF-Verletzung

**Korrektur:**
Belegungen(Student, Dozent)
Dozenten_Kurse(Dozent, Kurs)`,
            keyTakeaways: [
              "Transitive Abhängigkeiten: Nicht-Schlüssel-Attribute, die von anderen Nicht-Schlüssel-Attributen abhängen",
              "1NF-Verletzung: Listen oder wiederholende Gruppen in einer Zelle",
              "2NF-Verletzung: Attribute, die nur von einem Teil des Schlüssels abhängen",
              "BCNF-Verletzung: Determinante ist kein Kandidatenschlüssel",
            ],
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
            content: `Integritätsbedingungen sind die Regeln, die sicherstellen, dass die Daten in einer Datenbank korrekt und konsistent bleiben. Ohne Integritätsbedingungen könnten fehlerhafte Daten eingefügt werden — etwa eine Bestellung für einen Kunden, der gar nicht existiert, oder ein negativer Preis. Es gibt drei Arten von Integrität, die zusammen die Datenqualität garantieren: Entity-Integrität stellt sicher, dass jede Zeile eindeutig identifizierbar ist, referenzielle Integrität stellt sicher, dass Beziehungen zwischen Tabellen konsistent sind, und Domänen-Integrität stellt sicher, dass jede Spalte nur gültige Werte enthält.

**1. Entity-Integrität (Entitäts-Integrität):**
Jede Relation muss einen Primärschlüssel haben, und kein Attribut des Primärschlüssels darf NULL sein.

---

\`\`\`sql
CREATE TABLE studenten (
  id INTEGER PRIMARY KEY,  -- Darf nicht NULL sein
  name VARCHAR(50) NOT NULL
);
\`\`\`

---

**2. Referenzielle Integrität:**
Ein Fremdschlüssel muss entweder NULL sein oder auf ein existierendes Tupel in der referenzierten Relation verweisen.

---

\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER REFERENCES kunden(id)  -- Muss in kunden existieren
);
\`\`\`

---

**3. Domänen-Integrität:**
Jedes Attribut muss Werte aus seiner Domäne annehmen. Constraints wie NOT NULL, CHECK und UNIQUE sichern dies.

---

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
      {
        id: "relationale-algebra",
        title: "Relationale Algebra",
        estimatedMinutes: 12,
        sections: [
          {
            id: "relationale-algebra-grundlagen",
            title: "Die Operationen der relationalen Algebra",
            sectionType: "theory",
            content: `Die relationale Algebra ist die formale Grundlage für SQL — sie definiert Operationen auf Relationen (Tabellen), die zu neuen Relationen führen. Jede SQL-Abfrage lässt sich als Ausdruck der relationalen Algebra darstellen und umgekehrt. Die sechs Grundoperationen nach Codd sind: Selektion (Zeilen filtern), Projektion (Spalten auswählen), Kreuzprodukt (alle Kombinationen), Vereinigung (Ergebnisse zusammenführen), Differenz (Ergebnisse abziehen) und Umbenennung (Attribute benennen). Daraus leiten sich weitere Operationen ab: der natürliche Verbund (JOIN), die Schnittmenge (INTERSECT) und die Division.

**Die 6 Grundoperationen (nach Codd):**

| Operation | Symbol | SQL | Beschreibung |
|-----------|--------|-----|-------------|
| Selektion | σ (sigma) | WHERE | Zeilen filtern nach Bedingung |
| Projektion | π (pi) | SELECT | Spalten auswählen |
| Kreuzprodukt | × | CROSS JOIN | Alle Kombinationen zweier Tabellen |
| Vereinigung | ∪ | UNION | Zeilen aus beiden Tabellen zusammenführen |
| Differenz | − | EXCEPT | Zeilen aus Tabelle A, die nicht in B sind |
| Umbenennung | ρ (rho) | AS | Attribute umbenennen |

**Zusätzlich wichtige Operationen:**

| Operation | Symbol | SQL | Beschreibung |
|-----------|--------|-----|-------------|
| Natürlicher Verbund | ⋈ | NATURAL JOIN | Verbund über gleiche Attribute |
| Schnitt | ∩ | INTERSECT | Gemeinsame Zeilen beider Tabellen |
| Division | ÷ | — | „Für alle"-Abfragen |

**Beispiel — Selektion und Projektion kombiniert:**
\`σ_{alter > 25}(π_{name, alter}(Studenten))\`
entspricht:
\`\`\`sql
SELECT name, alter FROM Studenten WHERE alter > 25;
\`\`\`

---

**Eigenschaften der relationalen Algebra:**
- **Abgeschlossenheit:** Jede Operation auf einer Relation liefert wieder eine Relation
- **Komposition:** Operationen können verschachtelt werden (wie in SQL)
- **Jede SQL-Abfrage lässt sich als Ausdruck der relationalen Algebra darstellen**`,
            keyTakeaways: [
              "6 Grundoperationen: Selektion, Projektion, Kreuzprodukt, Vereinigung, Differenz, Umbenennung",
              "σ = WHERE, π = SELECT, × = CROSS JOIN, ∪ = UNION",
              "Jede SQL-Abfrage lässt sich als relationaler Algebra-Ausdruck darstellen",
              "Operationen sind komponierbar und abgeschlossen",
            ],
          },
          {
            id: "relationale-algebra-beispiele",
            title: "Relationale Algebra in SQL übersetzen",
            sectionType: "example",
            content: `Die relationale Algebra ist die theoretische Grundlage für SQL. Jede SQL-Abfrage lässt sich als Ausdruck der relationalen Algebra darstellen — und umgekehrt. Das Verständnis dieser Übersetzung hilft dir, SQL-Abfragen systematisch aufzubauen statt nur aus dem Bauch heraus zu tippen. Die Zuordnung ist direkt: Selektion wird zu WHERE, Projektion zu SELECT Spalten, der Verbund zu JOIN, Vereinigung zu UNION und Differenz zu EXCEPT.

**1. Selektion (σ) — Zeilen filtern:**
\`σ_{preis > 50}(Produkte)\` →
\`\`\`sql
SELECT * FROM produkte WHERE preis > 50;
\`\`\`

---

**2. Projektion (π) — Spalten auswählen:**
\`π_{name, preis}(Produkte)\` →
\`\`\`sql
SELECT name, preis FROM produkte;
\`\`\`

---

**3. Kreuzprodukt (×) — Alle Kombinationen:**
\`Kunden × Produkte\` →
\`\`\`sql
SELECT * FROM kunden CROSS JOIN produkte;
\`\`\`

---

**4. Natürlicher Verbund (⋈) — Verbund über gleiche Attribute:**
\`Kunden ⋈ Bestellungen\` →
\`\`\`sql
SELECT * FROM kunden NATURAL JOIN bestellungen;
\`\`\`

---

**5. Vereinigung (∪) — Ergebnisse zusammenführen:**
\`Aktive_Kunden ∪ Inaktive_Kunden\` →
\`\`\`sql
SELECT * FROM aktive_kunden
UNION
SELECT * FROM inaktive_kunden;
\`\`\`

---

**6. Differenz (−) — Ergebnisse abziehen:**
\`Alle_Kunden − Aktive_Kunden\` →
\`\`\`sql
SELECT * FROM alle_kunden
EXCEPT
SELECT * FROM aktive_kunden;
\`\`\`

---

**7. Kombiniertes Beispiel:**
\`π_{name}(σ_{kategorie = 'Elektronik'}(Produkte ⋈ Bestellungen))\` →
\`\`\`sql
SELECT p.name
FROM produkte p
JOIN bestellungen b ON p.id = b.produkt_id
WHERE p.kategorie = 'Elektronik';
\`\`\``,
            keyTakeaways: [
              "σ (Selektion) → WHERE in SQL",
              "π (Projektion) → SELECT in SQL",
              "⋈ (Verbund) → JOIN in SQL",
              "∪ (Vereinigung) → UNION, − (Differenz) → EXCEPT",
              "Operationen können frei kombiniert werden",
            ],
          },
        ],
      },
      {
        id: "schluessel-und-abhaengigkeiten",
        title: "Schlüssel und Abhängigkeiten",
        estimatedMinutes: 12,
        sections: [
          {
            id: "schluesselarten",
            title: "Schlüsselarten im Detail",
            sectionType: "theory",
            content: `**Superschlüssel (Super Key)**
Eine Menge von Attributen, die jedes Tupel eindeutig identifiziert. Jede Relation hat mindestens einen Superschlüssel — die Menge aller Attribute.

*Beispiel:* In Studenten(ID, Name, Matrikelnummer, Studiengang) sind Superschlüssel:
- {ID}
- {Matrikelnummer}
- {ID, Name}
- {ID, Matrikelnummer}
- {ID, Name, Matrikelnummer, Studiengang}

**Kandidatenschlüssel (Candidate Key)**
Ein **minimaler** Superschlüssel — kein Attribut kann entfernt werden, ohne die Eindeutigkeit zu verlieren.

Aus den obigen Superschlüsseln sind nur {ID} und {Matrikelnummer} Kandidatenschlüssel, da sie minimal sind.

**Primärschlüssel (Primary Key)**
Der vom Datenbankdesigner **ausgewählte** Kandidatenschlüssel. In SQL mit \`PRIMARY KEY\` definiert.

**Fremdschlüssel (Foreign Key)**
Ein Attribut (oder eine Attributkombination), das auf den Primärschlüssel einer anderen Relation verweist.



\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER REFERENCES kunden(id)  -- Fremdschlüssel
);
\`\`\`

---

**Alternativschlüssel (Alternate Key)**
Alle Kandidatenschlüssel, die nicht als Primärschlüssel ausgewählt wurden. In SQL mit \`UNIQUE\` definiert.

---

\`\`\`sql
CREATE TABLE studenten (
  id INTEGER PRIMARY KEY,
  matrikelnummer VARCHAR(10) UNIQUE  -- Alternativschlüssel
);
\`\`\`

---

**Zusammengesetzter Schlüssel (Composite Key)**
Ein Schlüssel, der aus mehreren Attributen besteht.

---

\`\`\`sql
CREATE TABLE belegungen (
  student_id INTEGER,
  kurs_id INTEGER,
  note DECIMAL(3,1),
  PRIMARY KEY (student_id, kurs_id)  -- Zusammengesetzter Schlüssel
);
\`\`\``,
            keyTakeaways: [
              "Superschlüssel: Menge von Attributen, die ein Tupel eindeutig identifiziert",
              "Kandidatenschlüssel: Minimaler Superschlüssel",
              "Primärschlüssel: Vom Designer ausgewählter Kandidatenschlüssel",
              "Fremdschlüssel: Verweis auf den Primärschlüssel einer anderen Tabelle",
              "Zusammengesetzter Schlüssel: Aus mehreren Attributen bestehend",
            ],
          },
          {
            id: "funktionale-abhaengigkeiten-rm",
            title: "Funktionale Abhängigkeiten im Relationenmodell",
            sectionType: "practice",
            content: `**Funktionale Abhängigkeiten (FDs)** sind das zentrale Konzept der Normalisierungstheorie.

**Definition:** X → Y bedeutet: Wenn zwei Tupel in den Attributen von X übereinstimmen, dann stimmen sie auch in Y überein.

**Armen-Regeln (Armstrong-Axiome):**

1. **Reflexivität:** Wenn Y ⊆ X, dann X → Y
   (Jede Attributmenge bestimmt sich selbst)

2. **Augmentation:** Wenn X → Y, dann XZ → YZ
   (Beide Seiten um dieselben Attribute erweitern)

3. **Transitivität:** Wenn X → Y und Y → Z, dann X → Z
   (Verkettung von Abhängigkeiten)

**Abgeleitete Regeln:**

4. **Vereinigung:** Wenn X → Y und X → Z, dann X → YZ
5. **Dekomposition:** Wenn X → YZ, dann X → Y und X → Z
6. **Pseudotransitivität:** Wenn X → Y und YW → Z, dann XW → Z

**Beispiel — FDs für eine Bestelltabelle:**

Bestellungen(Bestell_ID, Kunde_ID, Datum, Produkt_ID, Menge, Preis)

FDs:
- Bestell_ID → Kunde_ID, Datum
- Produkt_ID → Preis
- (Bestell_ID, Produkt_ID) → Menge

**Schlüssel bestimmen:**
1. Starte mit der Menge aller Attribute: {Bestell_ID, Kunde_ID, Datum, Produkt_ID, Menge, Preis}
2. Finde die minimale Menge, die alle Attribute bestimmt
3. (Bestell_ID, Produkt_ID) bestimmt: Bestell_ID → Kunde_ID, Datum; Produkt_ID → Preis; (Bestell_ID, Produkt_ID) → Menge
4. Also ist (Bestell_ID, Produkt_ID) ein Kandidatenschlüssel`,
            keyTakeaways: [
              "X → Y: X bestimmt Y eindeutig",
              "Armstrong-Axiome: Reflexivität, Augmentation, Transitivität",
              "Kandidatenschlüssel = minimale Attributmenge, die alle Attribute bestimmt",
              "FDs systematisch bestimmen und Schlüssel ableiten",
            ],
          },
        ],
      },
      {
        id: "fremdschluessel-referenzielle-integritaet",
        title: "Fremdschlüssel und referenzielle Integrität",
        estimatedMinutes: 12,
        sections: [
          {
            id: "fremdschluessel-detail",
            title: "Fremdschlüssel im Detail",
            sectionType: "theory",
            content: `Ein **Fremdschlüssel (Foreign Key)** ist ein Attribut (oder eine Attributkombination), das auf den Primärschlüssel einer anderen Tabelle verweist und so Beziehungen zwischen Tabellen herstellt.

**Deklaration in SQL:**
\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER,
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);
\`\`\`

---

**Referenzielle Integrität** bedeutet: Ein Fremdschlüsselwert muss entweder NULL sein oder in der referenzierten Tabelle als Primärschlüsselwert existieren.

**Verletzungen der referenziellen Integrität:**
1. Einfügen eines Fremdschlüsselwerts, der nicht in der referenzierten Tabelle existiert
2. Löschen eines Primärschlüsselwerts, auf den noch Fremdschlüssel verweisen
3. Ändern eines Primärschlüsselwerts, auf den Fremdschlüssel verweisen

**Lösungsstrategien für Lösch- und Änderungsoperationen:**

| Aktion | Beschreibung | SQL |
|--------|-------------|-----|
| CASCADE | Abhängige Zeilen werden mitgelöscht/geändert | \`ON DELETE CASCADE\` |
| SET NULL | Fremdschlüssel wird auf NULL gesetzt | \`ON DELETE SET NULL\` |
| SET DEFAULT | Fremdschlüssel wird auf den Standardwert gesetzt | \`ON DELETE SET DEFAULT\` |
| RESTRICT | Löschung wird verhindert (Fehler) | \`ON DELETE RESTRICT\` |
| NO ACTION | Wie RESTRICT (Standard) | \`ON DELETE NO ACTION\` |

**Beispiel mit CASCADE:**
\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER,
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
    ON DELETE CASCADE    -- Wenn Kunde gelöscht wird, werden auch seine Bestellungen gelöscht
    ON UPDATE CASCADE    -- Wenn Kunden-ID geändert wird, wird auch in Bestellungen geändert
);
\`\`\``,
            keyTakeaways: [
              "Fremdschlüssel verweisen auf den Primärschlüssel einer anderen Tabelle",
              "Referenzielle Integrität: FK-Wert muss NULL sein oder in der referenzierten Tabelle existieren",
              "CASCADE: Abhängige Zeilen werden mitgelöscht/geändert",
              "RESTRICT/NO ACTION: Löschung wird verhindert",
              "SET NULL: FK wird auf NULL gesetzt bei Löschung",
            ],
          },
          {
            id: "fremdschluessel-praxis",
            title: "Fremdschlüssel in der Praxis",
            sectionType: "example",
            content: `**Beispiel: Online-Shop mit referenzieller Integrität**



\`\`\`sql
-- Kundentabelle
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Produkttabelle
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  preis DECIMAL(10,2) NOT NULL CHECK (preis > 0)
);

-- Bestellungen mit Fremdschlüsseln
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kunde_id INTEGER NOT NULL,
  datum DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Bestellpositionen mit zwei Fremdschlüsseln
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL CHECK (menge > 0),
  FOREIGN KEY (bestellung_id) REFERENCES bestellungen(id)
    ON DELETE CASCADE,
  FOREIGN KEY (produkt_id) REFERENCES produkte(id)
    ON DELETE RESTRICT
);
\`\`\`

---

**Wann welche Aktion wählen?**

| Beziehung | ON DELETE | Begründung |
|-----------|----------|-----------|
| Kunde → Bestellungen | CASCADE | Bestellungen ohne Kunde sind sinnlos |
| Produkt → Bestellpositionen | RESTRICT | Produkt kann nicht gelöscht werden, solange es in Bestellungen referenziert wird |
| Kategorie → Produkte | SET NULL | Produkte ohne Kategorie sind erlaubt |
| Abteilung → Mitarbeiter | RESTRICT | Abteilung kann nicht gelöscht werden, solang es Mitarbeiter gibt |

**Häufige Fehler:**
1. Fremdschlüssel vergessen → Dateninkonsistenz
2. Falsche CASCADE-Aktion → Versehentliches Löschen von Daten
3. Zirkuläre Fremdschlüssel → Tabelle A referenziert B und B referenziert A`,
            keyTakeaways: [
              "CASCADE für abhängige Daten (Bestellungen ohne Kunde sind sinnlos)",
              "RESTRICT für referenzierte Daten (Produkt nicht löschen wenn in Bestellung)",
              "SET NULL für optionale Beziehungen",
              "Fremdschlüssel immer definieren — sonst Dateninkonsistenz",
            ],
          },
        ],
      },
      {
        id: "domaenen-constraints",
        title: "Domänen und Constraints",
        estimatedMinutes: 10,
        sections: [
          {
            id: "domaenen-und-constraints",
            title: "Domänen-Integrität und Constraints",
            sectionType: "theory",
            content: `**Domänen-Integrität** stellt sicher, dass jedes Attribut nur Werte aus seinem erlaubten Wertebereich (Domäne) annimmt.

**Arten von Constraints:**

| Constraint | Beschreibung | Beispiel |
|-----------|-------------|----------|
| NOT NULL | Pflichtfeld | \`name VARCHAR(100) NOT NULL\` |
| UNIQUE | Eindeutigkeit | \`email VARCHAR(100) UNIQUE\` |
| PRIMARY KEY | Eindeutige Identifikation | \`id INTEGER PRIMARY KEY\` |
| FOREIGN KEY | Referenzielle Integrität | \`REFERENCES kunden(id)\` |
| CHECK | Wertebereich einschränken | \`CHECK (preis > 0)\` |
| DEFAULT | Standardwert | \`status VARCHAR(20) DEFAULT 'neu'\` |

**CHECK-Constraints im Detail:**
\`\`\`sql
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  preis DECIMAL(10,2) CHECK (preis > 0),
  kategorie VARCHAR(50) CHECK (kategorie IN ('Elektronik', 'Buch', 'Kleidung', 'Sonstiges')),
  bestand INTEGER DEFAULT 0 CHECK (bestand >= 0),
  bewertung INTEGER CHECK (bewertung BETWEEN 1 AND 5)
);
\`\`\`

---

**Domänen-Integrität durch Datentypen:**
- \`INTEGER\` — Nur ganze Zahlen
- \`DECIMAL(10,2)\` — Dezimalzahlen mit 2 Nachkommastellen
- \`VARCHAR(100)\` — Zeichenketten bis 100 Zeichen
- \`DATE\` — Datumswerte
- \`BOOLEAN\` — Nur TRUE/FALSE

**Benutzerdefinierte Domänen (SQL-Standard, nicht in SQLite):**
\`\`\`sql
-- SQL-Standard (nicht SQLite)
CREATE DOMAIN email_type VARCHAR(100)
  CHECK (VALUE LIKE '%@%.%');

CREATE DOMAIN positiv_decimal DECIMAL(10,2)
  CHECK (VALUE > 0);
\`\`\`

---

In SQLite erreicht man denselben Effekt mit CHECK-Constraints.`,
            keyTakeaways: [
              "NOT NULL, UNIQUE, CHECK, DEFAULT sind die wichtigsten Constraints",
              "CHECK-Constraints schränken den Wertebereich ein",
              "Datentypen sichern die Domänen-Integrität",
              "In SQLite: CHECK statt benutzerdefinierter Domänen",
            ],
          },
        ],
      },
      {
        id: "relationale-vs-nicht-relationale",
        title: "Relationale vs. nicht-relationale Datenbanken",
        estimatedMinutes: 10,
        sections: [
          {
            id: "relational-vs-nosql",
            title: "Vergleich: Relationale vs. NoSQL-Datenbanken",
            sectionType: "theory",
            content: `**Relationale Datenbanken (RDBMS)** speichern Daten in Tabellen mit festem Schema. **NoSQL-Datenbanken** verwenden flexible Datenmodelle.

| Eigenschaft | Relational (SQL) | NoSQL |
|------------|-----------------|-------|
| Datenmodell | Tabellen mit Zeilen und Spalten | Dokumente, Schlüssel-Wert, Graph, Spalten |
| Schema | Fest definiert | Flexibel / Schema-los |
| Abfragesprache | SQL | Datenbank-spezifisch |
| Skalierung | Vertikal (größere Server) | Horizontal (mehr Server) |
| Transaktionen | ACID-garantiert | Oft nur eventual consistency |
| Beziehungen | Fremdschlüssel, JOINs | Oft denormalisiert, eingebettet |
| Normalisierung | Bis 3NF empfohlen | Oft bewusst denormalisiert |

**Arten von NoSQL-Datenbanken:**

| Typ | Beispiel | Anwendungsfall |
|------|----------|---------------|
| Dokument | MongoDB | Flexible Datenstrukturen, CMS |
| Schlüssel-Wert | Redis | Caching, Sessions |
| Spaltenfamilie | Cassandra | Zeitreihen, IoT-Daten |
| Graph | Neo4j | Soziale Netzwerke, Empfehlungen |

**Wann relationale Datenbanken?**
- Daten haben klare Struktur und Beziehungen
- Datenintegrität ist wichtig (ACID)
- Komplexe Abfragen mit JOINs
- Transaktionssicherheit erforderlich

**Wann NoSQL-Datenbanken?**
- Datenstruktur ändert sich häufig
- Sehr große Datenmengen (Big Data)
- Hohe Schreibrate, einfache Lesezugriffe
- Flexible Schema-Anforderungen

**Wichtig:** Die Wahl ist nicht Entweder-Oder. Viele moderne Systeme nutzen beide — relational für kritische Daten, NoSQL für Caching und Analytics.`,
            keyTakeaways: [
              "Relational: Tabellen, festes Schema, SQL, ACID, JOINs",
              "NoSQL: Flexible Datenmodelle, horizontale Skalierung, eventual consistency",
              "4 NoSQL-Typen: Dokument, Schlüssel-Wert, Spaltenfamilie, Graph",
              "Wahl hängt vom Anwendungsfall ab — oft werden beide kombiniert",
            ],
          },
        ],
      },
      {
        id: "mengenoperationen",
        title: "Mengenoperationen in SQL",
        estimatedMinutes: 10,
        sections: [
          {
            id: "union-intersect-except",
            title: "UNION, INTERSECT und EXCEPT",
            sectionType: "theory",
            content: `Mengenoperationen kombinieren die Ergebnisse zweier SELECT-Abfragen. Im Gegensatz zu JOINs, die Spalten hinzufügen, fügen Mengenoperationen Zeilen hinzu — sie arbeiten vertikal, nicht horizontal. UNION vereinigt Ergebnisse (wie die Mengenlehre-Vereinigung ∪), INTERSECT liefert die Schnittmenge (∩) und EXCEPT die Differenz (∖). Wichtig: Beide Abfragen müssen kompatibel sein — gleiche Anzahl Spalten und kompatible Datentypen. Die Spaltennamen stammen immer aus der ersten Abfrage.

**UNION — Vereinigung:**
\`\`\`sql
-- Alle Kunden und Lieferanten (ohne Duplikate)
SELECT name, stadt FROM kunden
UNION
SELECT name, stadt FROM lieferanten;

-- Mit Duplikaten (UNION ALL)
SELECT name, stadt FROM kunden
UNION ALL
SELECT name, stadt FROM lieferanten;
\`\`\`

---

**INTERSECT — Schnittmenge:**
\`\`\`sql
-- Kunden, die auch Lieferanten sind
SELECT name, stadt FROM kunden
INTERSECT
SELECT name, stadt FROM lieferanten;
\`\`\`

---

**EXCEPT — Differenz:**
\`\`\`sql
-- Kunden, die keine Lieferanten sind
SELECT name, stadt FROM kunden
EXCEPT
SELECT name, stadt FROM lieferanten;
\`\`\`

---

**Wichtige Regeln:**
- Beide Abfragen müssen dieselbe Anzahl Spalten haben
- Die Spalten müssen kompatible Datentypen haben
- Die Spaltennamen stammen aus der ersten Abfrage
- \`UNION\` entfernt Duplikate, \`UNION ALL\` behält sie
- \`INTERSECT\` und \`EXCEPT\` entfernen automatisch Duplikate`,
            keyTakeaways: [
              "UNION: Vereinigung zweier Ergebnismengen (ohne Duplikate)",
              "UNION ALL: Vereinigung mit Duplikaten (schneller)",
              "INTERSECT: Schnittmenge beider Ergebnismengen",
              "EXCEPT: Differenz — Zeilen in A, die nicht in B sind",
              "Beide Abfragen müssen kompatible Spalten haben",
            ],
          },
          {
            id: "mengenoperationen-beispiele",
            title: "Mengenoperationen in der Praxis",
            sectionType: "example",
            content: `Mengenoperationen sind besonders nützlich, wenn du Daten aus verschiedenen Quellen zusammenführen, vergleichen oder abziehen musst. UNION ALL ist die häufigste Operation — sie kombiniert Zeilen aus verschiedenen Tabellen, etwa aktive und inaktive Kunden in einer Liste. INTERSECT findet Gemeinsamkeiten (welche Produkte sind in beiden Filialen?), EXCEPT findet Unterschiede (welche Produkte gibt es nur im Nord-Bestand?). Im Gegensatz zu JOINs, die Spalten hinzufügen, fügen Mengenoperationen Zeilen hinzu.

**Beispiel 1: Aktive und inaktive Kunden zusammenführen**
\`\`\`sql
SELECT id, name, 'aktiv' AS status FROM aktive_kunden
UNION ALL
SELECT id, name, 'inaktiv' AS status FROM inaktive_kunden;
\`\`\`

---

**Beispiel 2: Produkte, die in beiden Filialen verfügbar sind**
\`\`\`sql
SELECT produkt_id FROM filiale_nord_bestand
INTERSECT
SELECT produkt_id FROM filiale_sued_bestand;
\`\`\`

---

**Beispiel 3: Produkte, die nur im Nord-Bestand sind**
\`\`\`sql
SELECT produkt_id FROM filiale_nord_bestand
EXCEPT
SELECT produkt_id FROM filiale_sued_bestand;
\`\`\`

---

**UNION vs. JOIN — Wann was verwenden?**

| UNION | JOIN |
|-------|------|
| Kombiniert Zeilen aus verschiedenen Tabellen | Kombiniert Spalten aus verschiedenen Tabellen |
| Beide Abfragen müssen gleiche Spaltenstruktur haben | Beliebige Spaltenstruktur |
| Erhöht die Zeilenzahl | Erhöht die Spaltenanzahl |
| Vertikal kombinieren | Horizontal kombinieren |

**Häufige Fehler:**
1. Spaltenanzahl stimmt nicht überein → Fehler
2. Datentypen inkompatibel → Fehler
3. \`UNION\` statt \`UNION ALL\` wenn Duplikate gewollt sind → fehlende Zeilen
4. Spaltennamen kommen aus der ersten Abfrage → verwirrend bei unterschiedlichen Tabellen`,
            keyTakeaways: [
              "UNION kombiniert Zeilen (vertikal), JOIN kombiniert Spalten (horizontal)",
              "UNION ALL ist schneller als UNION (kein Duplikat-Check)",
              "Spaltenanzahl und Datentypen müssen übereinstimmen",
              "Spaltennamen stammen aus der ersten Abfrage",
            ],
          },
        ],
      },
      {
        id: "normalformen-ueberblick",
        title: "Normalformen im Überblick",
        estimatedMinutes: 10,
        sections: [
          {
            id: "nf-ueberblick-tabelle",
            title: "Alle Normalformen auf einen Blick",
            sectionType: "theory",
            content: `Die Normalformen bauen aufeinander auf: Jede höhere Normalform setzt die vorherige voraus und beseitigt zusätzliche Probleme. Von der 1NF (atomare Werte) über die 2NF (keine partiellen Abhängigkeiten) und 3NF (keine transitiven Abhängigkeiten) bis zur BCNF (jede Determinante ist Kandidatenschlüssel) wird die Datenstruktur Schritt für Schritt verfeinert. In der Praxis reicht meist die 3NF — die BCNF und höher sind Spezialfälle, die nur in bestimmten Konstellationen relevant werden.

**Überblick über die wichtigsten Normalformen:**

| NF | Bedingung | Verhindert | Beispiel-Verletzung |
|----|-----------|-----------|---------------------|
| 1NF | Atomare Werte, kein wiederholendes Gruppen | Listen in Zellen, wiederholende Spalten | "Mathe, Physik" in einer Zelle |
| 2NF | 1NF + volle funktionale Abhängigkeit | Partielle Abhängigkeiten | Name hängt nur von Teil des Schlüssels ab |
| 3NF | 2NF + keine transitiven Abhängigkeiten | Indirekte Abhängigkeiten | PLZ → Stadt (über PLZ) |
| BCNF | 3NF + jede Determinante ist Kandidatenschlüssel | Überlappende Kandidatenschlüssel | Dozent → Kurs, aber Dozent kein Schlüssel |
| 4NF | BCNF + keine mehrwertigen Abhängigkeiten | Mehrwertige Abhängigkeiten | Ein Dozent unterrichtet mehrere Kurse und hat mehrere Räume |
| 5NF | 4NF + keine Join-Abhängigkeiten | Zerlegungsverluste | Drei-tabellige Join-Abhängigkeit |

**In der Praxis relevant:**
- **1NF, 2NF, 3NF** — Standard für operative Datenbanken
- **BCNF** — In speziellen Fällen relevant
- **4NF, 5NF** — Sehr selten relevant, meist automatisch erfüllt

**Normalform bestimmen — Schritt für Schritt:**

1. **1NF prüfen:** Sind alle Werte atomar? Keine Listen, keine wiederholenden Gruppen?
2. **2NF prüfen:** Gibt es zusammengesetzte Schlüssel? Hängen Attribute nur von einem Teil des Schlüssels ab?
3. **3NF prüfen:** Gibt es Attribute, die von anderen Nicht-Schlüssel-Attributen abhängen?
4. **BCNF prüfen:** Gibt es funktionale Abhängigkeiten, bei denen die Determinante kein Kandidatenschlüssel ist?

**Faustregel:** In der Praxis reicht es, bis zur 3NF zu normalisieren. BCNF und höhere Normalformen sind nur in speziellen Fällen relevant.`,
            keyTakeaways: [
              "1NF: Atomare Werte, keine Listen in Zellen",
              "2NF: Keine partiellen Abhängigkeiten vom Schlüssel",
              "3NF: Keine transitiven Abhängigkeiten",
              "BCNF: Jede Determinante ist Kandidatenschlüssel",
              "In der Praxis: 3NF reicht meistens",
            ],
          },
        ],
      },
      {
        id: "relationenmodell-praxis",
        title: "Vom Relationenmodell zur SQL-Tabelle",
        estimatedMinutes: 12,
        sections: [
          {
            id: "rm-zu-sql-prozess",
            title: "Transformation: Relationenmodell → SQL",
            sectionType: "practice",
            content: `Die Transformation vom Relationenmodell zur SQL-Tabelle folgt klaren Regeln: Jede Relation wird zu einer Tabelle, jedes Attribut zu einer Spalte, und die Domäne bestimmt den Datentyp plus CHECK-Constraints. Primärschlüssel werden zu PRIMARY KEY, Fremdschlüssel zu FOREIGN KEY REFERENCES. Beziehungen werden durch Fremdschlüssel auf der n-Seite abgebildet, n:m-Beziehungen durch Verknüpfungstabellen aufgelöst. Der Prozess ist systematisch: Erst die Tabellen und Spalten definieren, dann Primärschlüssel setzen, dann Fremdschlüssel für Beziehungen anlegen, und schließlich Constraints für Integrität sorgen.

Der Weg vom Relationenmodell zur fertigen SQL-Tabelle:

**Schritt 1: Relation identifizieren**
Jede Relation wird zu einer Tabelle. Attribute werden zu Spalten.

**Schritt 2: Datentypen wählen**
\`\`\`sql
-- Aus dem RM: Studenten(Matrikelnummer: INTEGER, Name: VARCHAR, Studiengang: VARCHAR, Semester: INTEGER)
CREATE TABLE studenten (
  matrikelnummer INTEGER,
  name VARCHAR(100) NOT NULL,
  studiengang VARCHAR(50),
  semester INTEGER CHECK (semester > 0)
);
\`\`\`

---

**Schritt 3: Primärschlüssel definieren**
\`\`\`sql
CREATE TABLE studenten (
  matrikelnummer INTEGER PRIMARY KEY,  -- Primärschlüssel
  name VARCHAR(100) NOT NULL,
  studiengang VARCHAR(50),
  semester INTEGER CHECK (semester > 0)
);
\`\`\`

---

**Schritt 4: Fremdschlüssel und Beziehungen**
\`\`\`sql
-- 1:n-Beziehung: Ein Studiengang hat viele Studenten
CREATE TABLE studiengaenge (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE studenten (
  matrikelnummer INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  studiengang_id INTEGER,
  semester INTEGER CHECK (semester > 0),
  FOREIGN KEY (studiengang_id) REFERENCES studiengaenge(id)
);
\`\`\`

---

**Schritt 5: Constraints hinzufügen**
\`\`\`sql
CREATE TABLE studenten (
  matrikelnummer INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  studiengang_id INTEGER,
  semester INTEGER DEFAULT 1 CHECK (semester > 0),
  FOREIGN KEY (studiengang_id) REFERENCES studiengaenge(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
\`\`\`

---

**Zusammenfassung der Transformation:**

| RM-Konzept | SQL-Konzept |
|-----------|-------------|
| Relation | Tabelle (CREATE TABLE) |
| Attribut | Spalte (Column) |
| Domäne | Datentyp + CHECK-Constraint |
| Tupel | Zeile (Row) |
| Primärschlüssel | PRIMARY KEY |
| Fremdschlüssel | FOREIGN KEY REFERENCES |
| Integritätsbedingung | CHECK, NOT NULL, UNIQUE |`,
            keyTakeaways: [
              "Relation → Tabelle, Attribut → Spalte, Tupel → Zeile",
              "Primärschlüssel mit PRIMARY KEY definieren",
              "Fremdschlüssel mit FOREIGN KEY REFERENCES definieren",
              "Constraints (NOT NULL, UNIQUE, CHECK) sichern die Integrität",
              "ON DELETE/ON UPDATE für Fremdschlüssel-Aktionen festlegen",
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
      {
        id: "entitaetstypen-attributtypen",
        title: "Entitätstypen und Attributtypen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "entitaetstypen",
            title: "Entitätstypen im Detail",
            sectionType: "theory",
            content: `**Entitätstypen** beschreiben Klassen von Objekten der realen Welt mit gleichen Attributen.

**Reguläre Entitätstypen:**
Existieren unabhängig von anderen Entitäten.
*Beispiele:* Kunde, Produkt, Mitarbeiter

**Schwache Entitätstypen:**
Existieren nur in Abhängigkeit von einem anderen (starken) Entitätstyp. Sie haben keinen eigenen Primärschlüssel, sondern einen **partiellen Schlüssel** in Kombination mit dem Fremdschlüssel des starken Entitätstyps.

*Beispiel:* Ein „Zimmer" existiert nur im Kontext eines „Gebäudes". Ohne Gebäude gibt es kein Zimmer.

**Identifizierende Beziehung:**
Die Beziehung, die einen schwachen Entitätstyp mit seinem starken Entitätstyp verbindet. Der Primärschlüssel des starken Entitätstyps wird Teil des Primärschlüssels des schwachen Entitätstyps.

---

\`\`\`sql
-- Stark: Gebäude
CREATE TABLE gebaeude (
  gebaeude_id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

-- Schwach: Zimmer (abhängig von Gebäude)
CREATE TABLE zimmer (
  gebaeude_id INTEGER,
  zimmer_nr INTEGER,
  groesse DECIMAL(5,2),
  PRIMARY KEY (gebaeude_id, zimmer_nr),
  FOREIGN KEY (gebaeude_id) REFERENCES gebaeude(gebaeude_id)
);
\`\`\`

---

**Attributtypen:**

| Typ | Beschreibung | Beispiel |
|-----|-------------|----------|
| Einfach | Ein einzelner Wert | Alter, Preis |
| Zusammengesetzt | Mehrere Bestandteile | Adresse (Straße, PLZ, Stadt) |
| Mehrwertig | Mehrere Werte pro Entität | Telefonnummern |
| Abgeleitet | Aus anderen Attributen berechenbar | Alter (aus Geburtsdatum) |
| Schlüssel | Identifiziert die Entität eindeutig | Matrikelnummer |`,
            keyTakeaways: [
              "Reguläre Entitätstypen existieren unabhängig",
              "Schwache Entitätstypen hängen von einem starken Entitätstyp ab",
              "Identifizierende Beziehung verbindet schwachen mit starkem Entitätstyp",
              "5 Attributtypen: einfach, zusammengesetzt, mehrwertig, abgeleitet, Schlüssel",
            ],
          },
        ],
      },
      {
        id: "beziehungsarten",
        title: "Beziehungsarten im ERM",
        estimatedMinutes: 12,
        sections: [
          {
            id: "1-zu-1",
            title: "1:1-Beziehung",
            sectionType: "theory",
            content: `**1:1-Beziehung (Ein-zu-Eins)**
Jede Entität auf der einen Seite steht mit genau einer Entität auf der anderen Seite in Beziehung.

*Beispiele:*
- Ein Kunde hat genau einen Ausweis
- Ein Mitarbeiter hat genau ein Büro
- Ein User hat genau ein Profil

**Umsetzung im Relationenmodell:**
\`\`\`sql
-- Option 1: Fremdschlüssel in einer Tabelle
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE ausweise (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER UNIQUE,  -- UNIQUE erzwingt 1:1
  nummer VARCHAR(50),
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

-- Option 2: Beide Tabellen zusammenführen (wenn es sich um dieselbe Entität handelt)
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  ausweis_nummer VARCHAR(50) UNIQUE
);
\`\`\`

---

**Wann 1:1 sinnvoll ist:**
- Wenn eine Tabelle sehr viele Spalten hätte (horizontale Partitionierung)
- Wenn bestimmte Attribute selten ausgefüllt sind (NULL-Einsparung)
- Wenn unterschiedliche Zugriffsrechte gelten sollen`,
            keyTakeaways: [
              "1:1: Jede Entität steht mit genau einer anderen in Beziehung",
              "UNIQUE-Constraint auf dem Fremdschlüssel erzwingt 1:1",
              "Oft können 1:1-Beziehungen auch in einer Tabelle zusammengefasst werden",
              "Sinnvoll bei horizontaler Partitionierung oder NULL-Einsparung",
            ],
          },
          {
            id: "1-zu-n",
            title: "1:n-Beziehung",
            sectionType: "example",
            content: `**1:n-Beziehung (Ein-zu-Viele)**
Eine Entität auf der einen Seite steht mit mehreren Entitäten auf der anderen Seite in Beziehung.

*Beispiele:*
- Ein Kunde hat viele Bestellungen
- Eine Abteilung hat viele Mitarbeiter
- Ein Autor hat viele Bücher

**Umsetzung im Relationenmodell:**
Der Primärschlüssel der „1-Seite" wird als Fremdschlüssel auf der „n-Seite" eingefügt.

---

\`\`\`sql
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER,  -- Fremdschlüssel auf der n-Seite
  datum DATE,
  betrag DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);
\`\`\`

---

**Wichtig:** Der Fremdschlüssel kommt **immer auf die n-Seite**! Auf der 1-Seite (Kunde) gibt es keine Referenz auf Bestellungen.`,
            keyTakeaways: [
              "1:n: Eine Entität hat viele zugehörige Entitäten",
              "Fremdschlüssel kommt immer auf die n-Seite",
              "Häufigster Beziehungstyp in der Praxis",
            ],
          },
          {
            id: "n-zu-m",
            title: "n:m-Beziehung",
            sectionType: "example",
            content: `**n:m-Beziehung (Viel-zu-Viele)**
Mehrere Entitäten auf der einen Seite stehen mit mehreren Entitäten auf der anderen Seite in Beziehung.

*Beispiele:*
- Studenten besuchen viele Kurse, Kurse haben viele Studenten
- Produkte gehören zu vielen Kategorien, Kategorien haben viele Produkte
- Autoren schreiben viele Bücher, Bücher haben viele Autoren

**Umsetzung im Relationenmodell:**
Eine **Verknüpfungstabelle** (Assoziationstabelle) wird erstellt, die die Primärschlüssel beider Entitäten als Fremdschlüssel enthält.

---

\`\`\`sql
CREATE TABLE studenten (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE kurse (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

-- Verknüpfungstabelle
CREATE TABLE belegungen (
  student_id INTEGER,
  kurs_id INTEGER,
  semester VARCHAR(20),
  note DECIMAL(3,1),
  PRIMARY KEY (student_id, kurs_id),
  FOREIGN KEY (student_id) REFERENCES studenten(id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(id)
);
\`\`\`

---

**Die Verknüpfungstabelle hat:**
- Zwei Fremdschlüssel (je einen pro Entität)
- Einen zusammengesetzten Primärschlüssel aus beiden Fremdschlüsseln
- Optional: Weitere Attribute der Beziehung (z.B. Note, Semester)

**Häufiger Fehler:** n:m-Beziehungen nicht auflösen und stattdessen Listen in einer Zelle speichern (verletzt 1NF!).`,
            keyTakeaways: [
              "n:m: Beide Seiten haben viele zugehörige Entitäten",
              "Verknüpfungstabelle mit zwei Fremdschlüsseln erstellen",
              "Zusammengesetzter Primärschlüssel aus beiden FKs",
              "Beziehungsattribute (Note, Semester) kommen in die Verknüpfungstabelle",
            ],
          },
        ],
      },
      {
        id: "kardinalitaeten-bestimmen",
        title: "Kardinalitäten bestimmen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "kardinalitaet-methodik",
            title: "Wie man Kardinalitäten bestimmt",
            sectionType: "theory",
            content: `**Kardinalitäten** beschreiben, wie viele Entitäten einer Seite mit wie vielen der anderen Seite verknüpft sein können.

**Methode zum Bestimmen der Kardinalität:**

Stelle zwei Fragen:
1. „Kann ein A mit mehreren B in Beziehung stehen?" → Antwort für die B-Seite
2. „Kann ein B mit mehreren A in Beziehung stehen?" → Antwort für die A-Seite

**Beispiel: Kunde — bestellt — Produkt**
- Kann ein Kunde mehrere Produkte bestellen? → Ja → n auf der Produkt-Seite
- Kann ein Produkt von mehreren Kunden bestellt werden? → Ja → m auf der Kunden-Seite
- Ergebnis: **n:m-Beziehung**

**Beispiel: Abteilung — hat — Mitarbeiter**
- Kann eine Abteilung mehrere Mitarbeiter haben? → Ja → n auf der Mitarbeiter-Seite
- Kann ein Mitarbeiter in mehreren Abteilungen sein? → Nein (in diesem Modell) → 1 auf der Abteilungs-Seite
- Ergebnis: **1:n-Beziehung**

**Min/Max-Notation (Chen):**
Statt nur 1, n, m kann man auch Min/Max-Kardinalitäten angeben:
- (1,1) = genau ein
- (0,1) = null oder eins
- (1,n) = mindestens eins, beliebig viele
- (0,n) = beliebig viele

**Beispiel mit Min/Max:**
Kunde (1,n) — bestellt — (0,n) Bestellung
- Ein Kunde hat mindestens 1 bis beliebig viele Bestellungen
- Eine Bestellung gehört zu genau 0 oder 1 Kunden`,
            keyTakeaways: [
              "Zwei Fragen stellen: 'Kann ein A mehrere B haben?' und umgekehrt",
              "1:1, 1:n, n:m sind die drei Grundtypen",
              "Min/Max-Notation für präzisere Kardinalitäten",
              "Kardinalitäten bestimmen die Tabellenstruktur im RM",
            ],
          },
        ],
      },
      {
        id: "erm-zu-sql",
        title: "ERM zu SQL: Transformation Schritt für Schritt",
        estimatedMinutes: 12,
        sections: [
          {
            id: "erm-zu-sql-regeln",
            title: "Transformationsregeln",
            sectionType: "theory",
            content: `**Regeln für die Transformation vom ERM zum Relationenmodell:**

**1. Entitätstyp → Tabelle**
Jeder Entitätstyp wird zu einer Tabelle. Attribute werden zu Spalten.

**2. 1:1-Beziehung → Fremdschlüssel (eine Seite)**
Der Primärschlüssel einer Tabelle wird als Fremdschlüssel in die andere Tabelle übernommen. UNIQUE-Constraint auf dem Fremdschlüssel sichert die 1:1-Beziehung.

**3. 1:n-Beziehung → Fremdschlüssel auf der n-Seite**
Der Primärschlüssel der „1-Seite" wird als Fremdschlüssel in die Tabelle der „n-Seite" eingefügt.

**4. n:m-Beziehung → Verknüpfungstabelle**
Eine neue Tabelle wird erstellt, die die Primärschlüssel beider Entitäten als Fremdschlüssel enthält.

**5. Zusammengesetzte Attribute → Aufteilen**
Ein zusammengesetztes Attribut wie „Adresse" wird in einzelne Spalten aufgeteilt: straße, plz, stadt.

**6. Mehrwertige Attribute → Eigene Tabelle**
Ein mehrwertiges Attribut wie „Telefonnummern" wird in eine eigene Tabelle ausgelagert.

**7. Abgeleitete Attribute → Nicht speichern**
Abgeleitete Attribute (z.B. Alter aus Geburtsdatum) werden nicht gespeichert, sondern bei Bedarf berechnet.`,
            keyTakeaways: [
              "Entitätstyp → Tabelle",
              "1:1 → Fremdschlüssel mit UNIQUE",
              "1:n → Fremdschlüssel auf der n-Seite",
              "n:m → Verknüpfungstabelle",
              "Zusammengesetzte Attribute → aufteilen",
              "Mehrwertige Attribute → eigene Tabelle",
            ],
          },
          {
            id: "erm-zu-sql-beispiel",
            title: "Komplettes Beispiel: Online-Shop",
            sectionType: "practice",
            content: `**ERM für einen Online-Shop:**

Entitäten: Kunde, Produkt, Bestellung, Kategorie
Beziehungen:
- Kunde (1) — bestellt — (n) Bestellung
- Bestellung (n) — enthält — (m) Produkt
- Produkt (n) — gehört zu — (1) Kategorie

**Schritt 1: Entitäten zu Tabellen**
\`\`\`sql
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE produkte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  preis DECIMAL(10,2) NOT NULL CHECK (preis > 0),
  kategorie_id INTEGER
);

CREATE TABLE kategorien (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);
\`\`\`

---

**Schritt 2: 1:n-Beziehung (Kunde → Bestellung)**
\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kunde_id INTEGER NOT NULL,
  datum DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);
\`\`\`

---

**Schritt 3: n:m-Beziehung (Bestellung ↔ Produkt)**
\`\`\`sql
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (bestellung_id) REFERENCES bestellungen(id),
  FOREIGN KEY (produkt_id) REFERENCES produkte(id)
);
\`\`\`

---

**Schritt 4: 1:n-Beziehung (Kategorie → Produkt)**
\`\`\`sql
-- Fremdschlüssel in produkte-Tabelle ergänzen
ALTER TABLE produkte ADD COLUMN kategorie_id INTEGER REFERENCES kategorien(id);
\`\`\`

---

**Fertig!** Das ERM wurde in ein vollständiges SQL-Schema transformiert.`,
            keyTakeaways: [
              "ERM-Transformation: Entitäten → Tabellen, Beziehungen → Fremdschlüssel",
              "1:n: FK auf der n-Seite",
              "n:m: Verknüpfungstabelle mit zwei FKs",
              "Immer Constraints (NOT NULL, CHECK, UNIQUE) definieren",
            ],
          },
        ],
      },
      {
        id: "schwache-entitaeten",
        title: "Schwache Entitäten und identifizierende Beziehungen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "schwache-entitaeten-detail",
            title: "Schwache Entitätstypen",
            sectionType: "theory",
            content: `Ein **schwacher Entitätstyp** hat keinen eigenen Primärschlüssel und ist von einem **starken Entitätstyp** (Owner) abhängig.

**Eigenschaften schwacher Entitätstypen:**
1. Existenzabhängig: Ohne den Owner kann die schwache Entität nicht existieren
2. Kein eigener Primärschlüssel: Nur in Kombination mit dem Owner eindeutig
3. Verbunden durch eine **identifizierende Beziehung**

**Beispiel: Gebäude und Zimmer**
- Gebäude (stark): Hat einen eigenen Primärschlüssel (gebaeude_id)
- Zimmer (schwach): Hat nur einen partiellen Schlüssel (zimmer_nr)
- Der Primärschlüssel von Zimmer ist (gebaeude_id, zimmer_nr)

---

\`\`\`sql
CREATE TABLE gebaeude (
  gebaeude_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  adresse VARCHAR(200)
);

CREATE TABLE zimmer (
  gebaeude_id INTEGER NOT NULL,
  zimmer_nr INTEGER NOT NULL,
  groesse DECIMAL(5,2),
  PRIMARY KEY (gebaeude_id, zimmer_nr),
  FOREIGN KEY (gebaeude_id) REFERENCES gebaeude(gebaeude_id)
    ON DELETE CASCADE  -- Zimmer wird mitgelöscht
);
\`\`\`

---

**Weitere Beispiele:**
- Rechnung (stark) → Rechnungsposition (schwach)
- Abteilung (stark) → Projekt (schwach, wenn projektnummer nur pro Abteilung eindeutig)
- Kunde (stark) → Auftrag (schwach, wenn auftragsnummer nur pro Kunde eindeutig)

**Im ERM:** Schwache Entitätstypen werden mit einem doppelten Rechteck dargestellt, die identifizierende Beziehung mit einer doppelten Raute.`,
            keyTakeaways: [
              "Schwache Entitätstypen haben keinen eigenen Primärschlüssel",
              "Sie sind existenzabhängig von einem starken Entitätstyp (Owner)",
              "Primärschlüssel = Owner-PK + partieller Schlüssel",
              "ON DELETE CASCADE sichert die Existenzabhängigkeit",
            ],
          },
        ],
      },
      {
        id: "erm-erweitert",
        title: "Erweiterte ERM-Konzepte",
        estimatedMinutes: 12,
        sections: [
          {
            id: "isa-hierarchie",
            title: "ISA-Hierarchien (Vererbung)",
            sectionType: "theory",
            content: `**ISA-Hierarchien** („is a") modellieren Vererbung im ERM — ähnlich wie Klassenvererbung in der Objektorientierung.

**Beispiel:** Mitarbeiter ist die Oberklasse, Angestellter und Freelancer sind Unterklassen.

**Drei Umsetzungsstrategien im Relationenmodell:**

**1. Eine Tabelle für alle (Single Table Inheritance):**
\`\`\`sql
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  typ VARCHAR(20) NOT NULL CHECK (typ IN ('angestellter', 'freelancer')),
  gehalt DECIMAL(10,2),       -- nur für Angestellter
  stundensatz DECIMAL(10,2),  -- nur für Freelancer
  urlaubstage INTEGER          -- nur für Angestellter
);
\`\`\`
Vorteil: Einfache Abfragen, kein JOIN
Nachteil: Viele NULL-Werte, keine NOT NULL-Constraints für Unterklassen-Attribute

**2. Eine Tabelle pro Unterklasse (Class Table Inheritance):**
\`\`\`sql
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  typ VARCHAR(20) NOT NULL
);

CREATE TABLE angestellter (
  mitarbeiter_id INTEGER PRIMARY KEY REFERENCES mitarbeiter(id),
  gehalt DECIMAL(10,2) NOT NULL,
  urlaubstage INTEGER NOT NULL
);

CREATE TABLE freelancer (
  mitarbeiter_id INTEGER PRIMARY KEY REFERENCES mitarbeiter(id),
  stundensatz DECIMAL(10,2) NOT NULL
);
\`\`\`
Vorteil: Keine NULL-Werte, NOT NULL-Constraints möglich
Nachteil: JOINs für vollständige Daten

**3. Nur Unterklassen-Tabellen (Concrete Table Inheritance):**
\`\`\`sql
CREATE TABLE angestellter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gehalt DECIMAL(10,2) NOT NULL,
  urlaubstage INTEGER NOT NULL
);

CREATE TABLE freelancer (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stundensatz DECIMAL(10,2) NOT NULL
);
\`\`\`
Vorteil: Keine JOINs, keine NULL-Werte
Nachteil: Gemeinsame Abfragen (alle Mitarbeiter) benötigen UNION`,
            keyTakeaways: [
              "ISA-Hierarchien modellieren Vererbung im ERM",
              "Single Table: Eine Tabelle, viele NULL-Werte",
              "Class Table: Ober- und Unterklassen-Tabellen, JOINs nötig",
              "Concrete Table: Nur Unterklassen-Tabellen, UNION für gemeinsame Abfragen",
            ],
          },
          {
            id: "erm-aggregation",
            title: "Aggregation und Rekursion im ERM",
            sectionType: "theory",
            content: `**Aggregation** modelliert Beziehungen zwischen Beziehungen und Entitäten.

*Beispiel:* Ein Projekt besteht aus mehreren Arbeitspaketen. Ein Mitarbeiter arbeitet an einem Arbeitspaket. Die Beziehung „arbeitet an" bezieht sich auf das Arbeitspaket, nicht auf das Projekt direkt.

Im ERM wird die Aggregation als Rechteck um die aggregierte Beziehung dargestellt.

**Rekursive Beziehungen:**
Eine Entität steht in Beziehung zu sich selbst.

*Beispiele:*
- Mitarbeiter → Vorgesetzter (Hierarchie)
- Teil → besteht aus Teilen (Stückliste)
- Freund → ist befreundet mit Freund (Netzwerk)

---

\`\`\`sql
-- Rekursive Beziehung: Mitarbeiter mit Vorgesetztem
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  vorgesetzter_id INTEGER,
  FOREIGN KEY (vorgesetzter_id) REFERENCES mitarbeiter(id)
);

-- Stückliste: Teil besteht aus anderen Teilen
CREATE TABLE teile (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE stueckliste (
  oberteil_id INTEGER NOT NULL,
  unterteil_id INTEGER NOT NULL,
  menge INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (oberteil_id, unterteil_id),
  FOREIGN KEY (oberteil_id) REFERENCES teile(id),
  FOREIGN KEY (unterteil_id) REFERENCES teile(id)
);
\`\`\`

---

**Ternäre Beziehungen:**
Beziehungen zwischen drei Entitäten.

*Beispiel:* Ein Dozent unterrichtet ein Fach in einem bestimmten Semester.
\`\`\`sql
CREATE TABLE unterrichtet (
  dozent_id INTEGER,
  fach_id INTEGER,
  semester_id INTEGER,
  PRIMARY KEY (dozent_id, fach_id, semester_id),
  FOREIGN KEY (dozent_id) REFERENCES dozenten(id),
  FOREIGN KEY (fach_id) REFERENCES faecher(id),
  FOREIGN KEY (semester_id) REFERENCES semester(id)
);
\`\`\``,
            keyTakeaways: [
              "Aggregation: Beziehungen zwischen Beziehungen und Entitäten",
              "Rekursive Beziehungen: Entität verweist auf sich selbst",
              "Ternäre Beziehungen: Drei Entitäten in einer Beziehung",
              "Stücklisten sind ein klassisches Beispiel für Rekursion",
            ],
          },
        ],
      },
      {
        id: "erm-fehler",
        title: "Häufige ERM-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "erm-fehler-liste",
            title: "Die häufigsten ERM-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: n:m-Beziehungen nicht auflösen**
n:m-Beziehungen MÜSSEN im Relationenmodell durch eine Verknüpfungstabelle aufgelöst werden. Listen in einer Zelle verletzen die 1NF.

**Fehler 2: Attribute an der falschen Entität**
„Preis" gehört zum Produkt, nicht zur Bestellung. „Menge" gehört zur Bestellposition, nicht zum Produkt.

**Fehler 3: Redundante Attribute**
„Kundenname" in der Bestellungstabelle ist redundant — er gehört in die Kundentabelle und wird per JOIN abgefragt.

**Fehler 4: Kardinalitäten falsch bestimmen**
Häufig wird 1:n als n:m modelliert oder umgekehrt. Immer beide Fragen stellen: „Kann ein A mehrere B haben?" und umgekehrt.

**Fehler 5: Schwache Entitäten übersehen**
Zimmernummer ist nur innerhalb eines Gebäudes eindeutig — der Fremdschlüssel zum Gebäude MUSS Teil des Primärschlüssels sein.

**Fehler 6: Beziehungsattribute vergessen**
Bei n:m-Beziehungen gehören Attribute der Beziehung (z.B. „Note" bei Student↔Kurs) in die Verknüpfungstabelle, nicht in eine der Entitätstabellen.

**Fehler 7: ISA-Hierarchien falsch umsetzen**
Vererbung muss explizit modelliert werden — entweder als eine Tabelle mit Typ-Spalte oder als separate Tabellen mit Fremdschlüsseln.

**Fehler 8: Identifizierende Beziehungen ignorieren**
Wenn eine schwache Entität ohne ihren Owner nicht existieren kann, muss ON DELETE CASCADE gesetzt werden.`,
            keyTakeaways: [
              "n:m-Beziehungen IMMER durch Verknüpfungstabelle auflösen",
              "Attribute an der richtigen Entität platzieren",
              "Kardinalitäten durch zwei Fragen bestimmen",
              "Beziehungsattribute gehören in die Verknüpfungstabelle",
              "Schwache Entitäten und ON DELETE CASCADE nicht vergessen",
            ],
          },
        ],
      },
      {
        id: "erm-praxisbeispiel",
        title: "ERM-Praxisbeispiel: Online-Shop",
        estimatedMinutes: 15,
        sections: [
          {
            id: "erm-praxis-anforderung",
            title: "Anforderungsanalyse",
            sectionType: "theory",
            content: `**Szenario:** Ein Online-Shop soll modelliert werden.

**Anforderungen:**
1. Kunden können mehrere Bestellungen aufgeben
2. Jede Bestellung enthält mehrere Produkte mit Menge und Preis
3. Produkte gehören zu genau einer Kategorie
4. Kategorien können mehrere Produkte enthalten
5. Kunden haben Name, E-Mail und Adresse (Straße, PLZ, Stadt)
6. Produkte haben Name, Preis und Beschreibung
7. Bestellungen haben Datum und Status

**Schritt 1: Entitäten identifizieren**
- Kunde (id, name, email, straße, plz, stadt)
- Produkt (id, name, preis, beschreibung)
- Kategorie (id, name)
- Bestellung (id, datum, status)

**Schritt 2: Beziehungen identifizieren**
- Kunde → Bestellung: 1:n (ein Kunde, viele Bestellungen)
- Bestellung → Produkt: n:m (eine Bestellung, viele Produkte; ein Produkt, viele Bestellungen)
- Kategorie → Produkt: 1:n (eine Kategorie, viele Produkte)

**Schritt 3: Kardinalitäten notieren**
- Kunde (1) — bestellt — (n) Bestellung
- Bestellung (n) — enthält — (m) Produkt
- Kategorie (1) — gehört zu — (n) Produkt`,
            keyTakeaways: [
              "Anforderungsanalyse: Was muss gespeichert werden?",
              "Entitäten identifizieren: Hauptobjekte der Domäne",
              "Beziehungen identifizieren: Wie hängen Entitäten zusammen?",
              "Kardinalitäten bestimmen: 1:1, 1:n oder n:m?",
            ],
          },
          {
            id: "erm-praxis-sql",
            title: "Vom ERM zum SQL-Schema",
            sectionType: "practice",
            content: `Der letzte Schritt der Datenbankmodellierung ist die Übersetzung des ERM in ein ausführbares SQL-Schema. Jede Entität wird zu einer Tabelle, jedes Attribut zu einer Spalte, und jede Beziehung wird durch Fremdschlüssel oder Verknüpfungstabellen abgebildet. Zusammengesetzte Attribute wie „Adresse" werden in einzelne Spalten (Straße, PLZ, Stadt) aufgeteilt. Beziehungsattribute wie „Menge" oder „Einzelpreis" landen in der Verknüpfungstabelle, nicht in den Entitätstabellen.

**Schritt 4: SQL-Schema erstellen**



\`\`\`sql
-- Kategorien
CREATE TABLE kategorien (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);

-- Kunden (zusammengesetztes Attribut Adresse aufgeteilt)
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  strasse VARCHAR(200),
  plz VARCHAR(10),
  stadt VARCHAR(100)
);

-- Produkte (1:n mit Kategorie)
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  beschreibung TEXT,
  preis DECIMAL(10,2) NOT NULL CHECK (preis > 0),
  kategorie_id INTEGER,
  FOREIGN KEY (kategorie_id) REFERENCES kategorien(id)
);

-- Bestellungen (1:n mit Kunde)
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kunde_id INTEGER NOT NULL,
  datum DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'neu' CHECK (status IN ('neu', 'bearbeitet', 'versendet', 'storniert')),
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

-- Bestellpositionen (n:m Verknüpfungstabelle)
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (bestellung_id) REFERENCES bestellungen(id),
  FOREIGN KEY (produkt_id) REFERENCES produkte(id)
);
\`\`\`

---

**Schritt 5: Schema überprüfen**
- ✓ Alle Entitäten als Tabellen umgesetzt
- ✓ 1:n-Beziehungen mit Fremdschlüsseln auf der n-Seite
- ✓ n:m-Beziehung durch Verknüpfungstabelle aufgelöst
- ✓ Zusammengesetztes Attribut (Adresse) aufgeteilt
- ✓ Beziehungsattribute (Menge, Einzelpreis) in der Verknüpfungstabelle
- ✓ CHECK-Constraints für Wertebereiche
- ✓ NOT NULL für Pflichtfelder`,
            keyTakeaways: [
              "Entitäten → Tabellen, Beziehungen → Fremdschlüssel",
              "Zusammengesetzte Attribute in einzelne Spalten aufteilen",
              "Beziehungsattribute in die Verknüpfungstabelle",
              "CHECK und NOT NULL Constraints nicht vergessen",
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
            content: `**SELECT** ist die grundlegendste SQL-Anweisung und der Einstiegspunkt für jede Datenbankabfrage. Mit SELECT holst du Daten aus einer oder mehreren Tabellen und kannst sie filtern, sortieren und aggregieren. SQL-Anfänger beginnen hier — und auch erfahrene Datenbankentwickler nutzen SELECT täglich.

Die Grundstruktur einer SELECT-Anweisung folgt einem festen Muster, das an einen natürlichen Satz erinnert: „Wähle diese Spalten aus dieser Tabelle, wobei diese Bedingung erfüllt ist, sortiert nach dieser Spalte."

---

\`\`\`sql
SELECT spalte1, spalte2, ...
FROM tabelle
WHERE bedingung;
\`\`\`

---

Jede Klausel hat eine bestimmte Aufgabe: \`SELECT\` bestimmt, welche Spalten im Ergebnis erscheinen. \`FROM\` gibt die Tabelle an, aus der die Daten stammen. \`WHERE\` filtert die Zeilen nach Bedingungen. Darüber hinaus gibt es weitere Klauseln, die du nach und nach kennenlernen wirst.

**Wichtige Klauseln im Überblick:**
- \`SELECT *\` — Alle Spalten abfragen (praktisch zum Explorieren, aber in produktivem Code vermeiden)
- \`DISTINCT\` — Doppelte Zeilen entfernen
- \`WHERE\` — Zeilen filtern nach Bedingungen
- \`ORDER BY\` — Ergebnisse sortieren (ASC = aufsteigend, DESC = absteigend)
- \`LIMIT n\` — Nur die ersten n Zeilen zurückgeben

**WHERE-Operatoren — dein Werkzeugkasten zum Filtern:**

Die WHERE-Klausel ist das Herzstück jeder Abfrage. Du kannst Zeilen mit verschiedenen Operatoren filtern — von einfachen Vergleichen bis hin zu Mustern und Bereichen:

| Operator | Bedeutung | Beispiel |
|----------|-----------|----------|
| = | Gleich | \`WHERE name = 'Anna'\` |
| != oder <> | Ungleich | \`WHERE status != 'inaktiv'\` |
| >, <, >=, <= | Vergleich | \`WHERE preis > 100\` |
| BETWEEN | Bereich | \`WHERE preis BETWEEN 10 AND 50\` |
| IN | Menge | \`WHERE kategorie IN ('A', 'B')\` |
| LIKE | Muster | \`WHERE name LIKE 'A%'\` |
| IS NULL | Null-Prüfung | \`WHERE email IS NULL\` |
| AND, OR, NOT | Logik | \`WHERE preis > 100 AND kategorie = 'A'\` |

Ein wichtiger Hinweis: \`WHERE\` wird **vor** der Gruppierung (GROUP BY) angewendet. Wenn du Gruppen filtern willst, brauchst du \`HAVING\` — dazu mehr im Artikel über Aggregatfunktionen.`,
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

---

\`\`\`sql
-- Alle Spalten aller Produkte
SELECT * FROM produkte;

-- Nur Name und Preis
SELECT name, preis FROM produkte;

-- Eindeutige Kategorien
SELECT DISTINCT kategorie FROM produkte;
\`\`\`

---

**WHERE-Filter:**

---

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

---

**Sortierung und Begrenzung:**

---

\`\`\`sql
-- Produkte nach Preis absteigend sortiert
SELECT name, preis FROM produkte ORDER BY preis DESC;

-- Die 5 teuersten Produkte
SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 5;

-- Produkte nach Kategorie, dann nach Preis sortiert
SELECT name, kategorie, preis FROM produkte
ORDER BY kategorie ASC, preis DESC;
\`\`\`

---

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
            content: `**Aggregatfunktionen** sind das Werkzeug, um aus vielen Zeilen einen einzigen zusammenfassenden Wert zu berechnen. Statt jede Zeile einzeln zu betrachten, verdichten Aggregatfunktionen die Daten auf eine Kennzahl — wie viele Zeilen gibt es, wie hoch ist der Durchschnitt, was ist der größte Wert? Diese Funktionen sind unverzichtbar für Berichte, Statistiken und Auswertungen jeder Art.

Stell dir vor, du hast eine Tabelle mit 10.000 Bestellungen und möchtest wissen: Wie hoch ist der Gesamtumsatz? Wie viele Bestellungen gibt es? Was ist der Durchschnittsbestellwert? Ohne Aggregatfunktionen müsstest du alle Zeilen einzeln durchgehen — mit Aggregatfunktionen reicht eine einzige Abfrage.

**Die fünf Aggregatfunktionen im Überblick:**

| Funktion | Bedeutung | Beispiel |
|----------|-----------|----------|
| COUNT() | Anzahl der Zeilen | \`COUNT(*)\` — alle Zeilen |
| SUM() | Summe | \`SUM(preis)\` — Gesamtpreis |
| AVG() | Durchschnitt | \`AVG(preis)\` — Durchschnittspreis |
| MIN() | Minimum | \`MIN(preis)\` — günstigstes Produkt |
| MAX() | Maximum | \`MAX(preis)\` — teuerstes Produkt |

**Wichtige Feinheiten, die oft übersehen werden:**
- \`COUNT(*)\` zählt **alle** Zeilen, inklusive Zeilen mit NULL-Werten — es ist die einfachste Art, die Gesamtzahl der Zeilen zu ermitteln
- \`COUNT(spalte)\` zählt nur Zeilen, in denen die angegebene Spalte **nicht NULL** ist — praktisch, wenn du wissen willst, wie viele Zeilen einen Wert haben
- \`COUNT(DISTINCT spalte)\` zählt nur **einzigartige** Werte — nützlich, um die Anzahl verschiedener Kategorien zu ermitteln
- \`SUM()\`, \`AVG()\`, \`MIN()\` und \`MAX()\` **ignorieren NULL-Werte** — sie werden bei der Berechnung einfach übergangen
- \`AVG()\` teilt die Summe durch die Anzahl der **Nicht-NULL-Werte**, nicht durch alle Zeilen — ein häufiger Stolperstein`,
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

---

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

---

**GROUP BY mit mehreren Spalten:**

---

\`\`\`sql
-- Anzahl Produkte pro Kategorie und Status
SELECT kategorie, status, COUNT(*) AS anzahl
FROM produkte
GROUP BY kategorie, status;
\`\`\`

---

**HAVING — Gruppen filtern:**

---

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

---

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

---

\`\`\`sql
-- FALSCH: Liefert KEINE Zeilen!
SELECT * FROM kunden WHERE telefon = NULL;

-- RICHTIG:
SELECT * FROM kunden WHERE telefon IS NULL;
\`\`\`

---

Warum? \`NULL = NULL\` ergibt NULL (unbekannt), nicht TRUE. Nur \`IS NULL\` und \`IS NOT NULL\` funktionieren zuverlässig.

**Falle 2: NULL in Aggregatfunktionen**

---

\`\`\`sql
-- AVG ignoriert NULL-Werte!
SELECT AVG(preis) FROM produkte;  -- NULL-Werte werden NICHT gezählt

-- Wenn NULL als 0 behandelt werden soll:
SELECT AVG(COALESCE(preis, 0)) FROM produkte;
\`\`\`

---

**Falle 3: NULL in Berechnungen**

---

\`\`\`sql
-- Jede Berechnung mit NULL ergibt NULL!
SELECT 100 + NULL;   -- Ergebnis: NULL
SELECT NULL * 2;     -- Ergebnis: NULL
SELECT NULL = NULL;  -- Ergebnis: NULL
\`\`\`

---

**Falle 4: NULL in NOT IN**

---

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

---

**Falle 5: COALESCE und IFNULL**

---

\`\`\`sql
-- COALESCE: Ersten Nicht-NULL-Wert zurückgeben
SELECT COALESCE(telefon, email, 'Keine Kontaktinfo') FROM kunden;

-- IFNULL (MySQL-spezifisch): NULL durch Standardwert ersetzen
SELECT IFNULL(preis, 0) FROM produkte;

-- NULLIF: NULL erzeugen wenn zwei Werte gleich sind
SELECT NULLIF(preis, 0) FROM produkte;  -- 0 wird zu NULL
\`\`\`

---

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
      {
        id: "sortieren-begrenzen",
        title: "Sortieren und Begrenzen: ORDER BY, LIMIT, OFFSET",
        estimatedMinutes: 10,
        sections: [
          {
            id: "order-by",
            title: "ORDER BY — Ergebnisse sortieren",
            sectionType: "theory",
            content: `**ORDER BY** ist die Klausel, die einer Abfrage ihre Ordnung gibt. Ohne ORDER BY ist die Reihenfolge der Ergebnisse **nicht definiert** — die Datenbank kann die Zeilen in beliebiger Reihenfolge zurückgeben. Das ist einer der häufigsten Fehler von SQL-Anfängern: Sie gehen davon aus, dass die Ergebnisse automatisch nach dem Primärschlüssel sortiert sind, aber das ist nicht garantiert.

Wenn du eine bestimmte Reihenfolge brauchst — etwa die teuersten Produkte zuerst oder Kunden alphabetisch — musst du ORDER BY explizit angeben. Nur so bekommst du eine verlässliche, reproduzierbare Sortierung.

---

\`\`\`sql
-- Aufsteigend (Standard)
SELECT name, preis FROM produkte ORDER BY preis ASC;

-- Absteigend
SELECT name, preis FROM produkte ORDER BY preis DESC;

-- Nach mehreren Spalten sortieren
SELECT name, kategorie, preis FROM produkte
ORDER BY kategorie ASC, preis DESC;
\`\`\`

---

Bei mehreren Sortierspalten gilt: Die erste Spalte hat die höchste Priorität. Nur wenn zwei Zeilen in der ersten Spalte denselben Wert haben, entscheidet die zweite Spalte. Stell dir vor, du sortierst eine Liste von Produkten erst nach Kategorie und dann innerhalb jeder Kategorie nach Preis absteigend — genau das macht die obige Abfrage.

**Wichtige Regeln, die du kennen musst:**
- \`ASC\` (ascending = aufsteigend) ist der Standard und kann weggelassen werden
- \`DESC\` (descending = absteigend) muss immer explizit angegeben werden
- NULL-Werte werden in SQLite als „kleinste" Werte sortiert — sie erscheinen am Anfang bei ASC und am Ende bei DESC
- Du kannst nach Spaltennummern sortieren (\`ORDER BY 2\`), aber Spaltennamen oder Aliase sind lesbarer und robuster

**Sortierung nach berechneten Werten:**
Oft möchtest du nach einem berechneten Wert sortieren — etwa nach dem Bruttopreis oder nach einem Alias. Das geht, indem du den Alias in der ORDER BY-Klausel verwendest:

---

\`\`\`sql
-- Nach berechnetem Wert sortieren
SELECT name, preis * 1.19 AS brutto FROM produkte
ORDER BY brutto DESC;

-- Oder mit Spaltennummer (weniger lesbar)
SELECT name, preis * 1.19 AS brutto FROM produkte
ORDER BY 2 DESC;
\`\`\`

---

**Performance-Hinweis:** ORDER BY muss die gesamte Ergebnismenge sortieren. Bei Millionen Zeilen ohne Index auf der Sortierspalte kann das sehr langsam werden. Kombiniere ORDER BY mit LIMIT, um die Arbeit zu begrenzen.`,
            keyTakeaways: [
              "ORDER BY sortiert Ergebnisse (ASC = aufsteigend, DESC = absteigend)",
              "Mehrere Spalten: Erste Spalte hat Priorität",
              "NULL-Werte werden in SQLite am Anfang sortiert (bei ASC)",
              "Sortierung nach Alias oder Spaltennummer möglich",
            ],
          },
          {
            id: "limit-offset",
            title: "LIMIT und OFFSET — Ergebnisse begrenzen",
            sectionType: "example",
            content: `**LIMIT** begrenzt die Anzahl der zurückgegebenen Zeilen. **OFFSET** überspringt eine bestimmte Anzahl Zeilen. Zusammen ermöglichen sie Paginierung — das seitenweise Durchblättern großer Ergebnismengen.

Warum ist das wichtig? Stell dir vor, eine Suchmaschine würde alle 10 Millionen Ergebnisse auf einmal anzeigen. Das wäre langsam, speicherintensiv und für den Nutzer unbrauchbar. LIMIT und OFFSET lösen dieses Problem, indem sie nur die Zeilen liefern, die gerade benötigt werden.

---

\`\`\`sql
-- Die 10 teuersten Produkte
SELECT name, preis FROM produkte
ORDER BY preis DESC LIMIT 10;

-- Produkte 11-20 (Paginierung: Seite 2)
SELECT name, preis FROM produkte
ORDER BY preis DESC LIMIT 10 OFFSET 10;
\`\`\`

---

**Paginierung — Seite für Seite anzeigen:**
Paginierung ist eines der häufigsten Muster in Webanwendungen. Jede Seite zeigt eine feste Anzahl von Einträgen, und OFFSET berechnet den Startpunkt:

---

\`\`\`sql
-- Seite 1 (Zeilen 1-10)
SELECT * FROM produkte ORDER BY id LIMIT 10 OFFSET 0;

-- Seite 2 (Zeilen 11-20)
SELECT * FROM produkte ORDER BY id LIMIT 10 OFFSET 10;

-- Seite n (Zeilen (n-1)*10+1 bis n*10)
SELECT * FROM produkte ORDER BY id LIMIT 10 OFFSET (seitennummer - 1) * 10;
\`\`\`

---

**Top-N-Abfragen — die besten Einträge finden:**
Eine der nützlichsten Anwendungen von LIMIT ist die Top-N-Abfrage: „Gib mir die 3 umsatzstärksten Kunden" oder „Die 5 neuesten Artikel". Kombiniert mit ORDER BY liefert LIMIT genau die gewünschte Anzahl von Top-Ergebnissen:

---

\`\`\`sql
-- Die 3 umsatzstärksten Kunden
SELECT k.name, SUM(b.betrag) AS umsatz
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name
ORDER BY umsatz DESC
LIMIT 3;
\`\`\`

---

**Wichtig:** LIMIT ohne ORDER BY liefert **beliebige** Zeilen — die Reihenfolge ist nicht deterministisch. Immer ORDER BY mit LIMIT verwenden!`,
            keyTakeaways: [
              "LIMIT n: Nur die ersten n Zeilen zurückgeben",
              "OFFSET m: Die ersten m Zeilen überspringen",
              "LIMIT + OFFSET = Paginierung",
              "IMMER ORDER BY mit LIMIT verwenden — sonst beliebige Zeilen",
            ],
          },
        ],
      },
      {
        id: "logische-operatoren",
        title: "Logische Operatoren: AND, OR, NOT, IN, BETWEEN, LIKE",
        estimatedMinutes: 10,
        sections: [
          {
            id: "logische-ops",
            title: "Logische Operatoren im WHERE",
            sectionType: "theory",
            content: `**Logische Operatoren** verknüpfen Bedingungen in der WHERE-Klausel und erweitern die Filtermöglichkeiten erheblich. Während einfache Vergleiche wie \`=\` oder \`>\` nur eine Bedingung prüfen, erlauben AND, OR und NOT die Kombination mehrerer Bedingungen zu komplexen Filterausdrücken. Daneben gibt es praktische Operatoren wie IN, BETWEEN und LIKE, die häufige Filtermuster vereinfachen.

**AND — Alle Bedingungen müssen erfüllt sein:**
AND ist streng: Beide Bedingungen müssen zutreffen, damit die Zeile ins Ergebnis kommt. Stell dir vor, du suchst nach elektronischen Produkten unter 50 Euro — beide Kriterien müssen gleichzeitig erfüllt sein.

---

\`\`\`sql
SELECT * FROM produkte WHERE preis > 50 AND kategorie = 'Elektronik';
\`\`\`

---

**OR — Mindestens eine Bedingung muss erfüllt sein:**
OR ist großzügig: Es reicht, wenn eine der Bedingungen zutrifft. Du suchst nach Produkten, die entweder elektronisch sind oder ein Buch — beides muss nicht gleichzeitig gelten.

---

\`\`\`sql
SELECT * FROM produkte WHERE kategorie = 'Elektronik' OR kategorie = 'Buch';
\`\`\`

---

**NOT — Bedingung umkehren:**
NOT negiert eine Bedingung. Statt alle Kategorien außer Elektronik aufzuzählen, schreibst du einfach NOT.

---

\`\`\`sql
SELECT * FROM produkte WHERE NOT kategorie = 'Elektronik';
\`\`\`

---

**IN — Prüfung gegen eine Werteliste:**
IN ist die Kurzform für mehrere OR-Bedingungen. Statt \`kategorie = 'A' OR kategorie = 'B' OR kategorie = 'C'\` schreibst du einfach \`kategorie IN ('A', 'B', 'C')\`. Das ist kürzer, lesbarer und weniger fehleranfällig.

---

\`\`\`sql
SELECT * FROM produkte WHERE kategorie IN ('Elektronik', 'Buch', 'Kleidung');
\`\`\`

---

**BETWEEN — Bereichsprüfung (inklusive):**
BETWEEN prüft, ob ein Wert innerhalb eines Bereichs liegt — inklusive der Grenzen. \`preis BETWEEN 10 AND 50\` ist dasselbe wie \`preis >= 10 AND preis <= 50\`. Achtung: Die Grenzen sind immer inklusive!

---

\`\`\`sql
SELECT * FROM produkte WHERE preis BETWEEN 10 AND 50;
-- Entspricht: preis >= 10 AND preis <= 50
\`\`\`

---

**LIKE — Mustersuche:**
LIKE ermöglicht die Suche nach Mustern in Zeichenketten. Die Platzhalter sind \`%\` (beliebig viele Zeichen) und \`_\` (genau ein Zeichen). LIKE ist mächtig, aber bei führendem \`%\` kann kein Index genutzt werden — die Suche wird langsam.

---

\`\`\`sql
-- % = beliebig viele Zeichen
SELECT * FROM kunden WHERE name LIKE 'A%';    -- beginnt mit A
SELECT * FROM kunden WHERE name LIKE '%er';   -- endet auf er
SELECT * FROM kunden WHERE name LIKE '%ann%'; -- enthält ann

-- _ = genau ein Zeichen
SELECT * FROM kunden WHERE name LIKE '_nna';  -- z.B. Anna
\`\`\`

---

**Operator-Priorität (höchste zuerst):**
Achtung bei Kombinationen von AND und OR! AND hat eine höhere Priorität als OR. Ohne Klammern kann das zu unerwarteten Ergebnissen führen:

1. NOT (höchste Priorität)
2. AND
3. OR (niedrigste Priorität)

---

\`\`\`sql
-- Achtung: AND hat höhere Priorität als OR!
WHERE kategorie = 'Elektronik' OR kategorie = 'Buch' AND preis > 50
-- Bedeutet: Elektronik (alle) ODER (Buch UND preis > 50)

-- Gewollt: (Elektronik ODER Buch) UND preis > 50
WHERE (kategorie = 'Elektronik' OR kategorie = 'Buch') AND preis > 50
\`\`\`

---

**Tipp:** Verwende immer Klammern, wenn du AND und OR kombinierst — auch wenn du dir sicher bist, dass die Priorität stimmt. Klammern machen den Code lesbarer und verhindern Fehler.`,
            keyTakeaways: [
              "AND: Alle Bedingungen müssen erfüllt sein",
              "OR: Mindestens eine Bedingung muss erfüllt sein",
              "IN: Prüfung gegen eine Werteliste (kürzer als OR-Kette)",
              "BETWEEN: Bereichsprüfung (inklusive Grenzen)",
              "LIKE: % = beliebige Zeichen, _ = genau ein Zeichen",
              "Klammern setzen bei AND/OR-Kombinationen!",
            ],
          },
        ],
      },
      {
        id: "distinct-aliase",
        title: "DISTINCT und Spaltenaliase",
        estimatedMinutes: 8,
        sections: [
          {
            id: "distinct",
            title: "DISTINCT — Doppelte Zeilen entfernen",
            sectionType: "theory",
            content: `**DISTINCT** entfernt doppelte Zeilen aus der Ergebnismenge. In der Praxis kommt es häufig vor, dass eine Abfrage viele identische Zeilen liefert — etwa wenn du alle Kategorien aus einer Produkttabelle abfragst, in der jede Kategorie mehrfach vorkommt. Ohne DISTINCT bekommst du jede Kategorie so oft, wie es Produkte in ihr gibt. Mit DISTINCT bekommst du jede Kategorie genau einmal.

---

\`\`\`sql
-- Ohne DISTINCT: Alle Zeilen (inklusive Duplikate)
SELECT kategorie FROM produkte;

-- Mit DISTINCT: Nur eindeutige Werte
SELECT DISTINCT kategorie FROM produkte;

-- DISTINCT über mehrere Spalten: Eindeutige Kombinationen
SELECT DISTINCT kategorie, status FROM produkte;
\`\`\`

---

**Wichtige Eigenschaften von DISTINCT:**
- \`DISTINCT\` bezieht sich auf die **gesamte Zeile**, nicht auf einzelne Spalten — es entfernt also nur Zeilen, die in allen ausgewählten Spalten identisch sind
- \`DISTINCT\` erfordert eine Sortierung der Ergebnismenge, um Duplikate zu erkennen → bei großen Tabellen kann das langsam sein
- \`COUNT(DISTINCT spalte)\` zählt eindeutige Werte — eine nützliche Kombination aus Aggregatfunktion und DISTINCT
- \`SELECT DISTINCT *\` entfernt identische Zeilen (selten sinnvoll, da Primärschlüssel jede Zeile eindeutig machen)

**DISTINCT vs. GROUP BY — wann was verwenden?**
Beide können doppelte Zeilen entfernen, aber sie haben unterschiedliche Zwecke:

---

\`\`\`sql
-- Beide liefern dasselbe Ergebnis:
SELECT DISTINCT kategorie FROM produkte;
SELECT kategorie FROM produkte GROUP BY kategorie;
\`\`\`

---

DISTINCT ist die einfachere Wahl, wenn du nur Eindeutigkeit willst. GROUP BY ist mächtiger, weil du es mit Aggregatfunktionen kombinieren kannst — etwa \`SELECT kategorie, COUNT(*) FROM produkte GROUP BY kategorie\`. Als Faustregel: Wenn du nur eindeutige Werte brauchst, nimm DISTINCT. Wenn du aggregieren willst, nimm GROUP BY.

**Spaltenaliase mit AS — Ergebnisse lesbar machen:**
Aliase geben Spalten oder berechneten Werten einen aussagekräftigen Namen. Das macht die Ergebnisse lesbarer und ermöglicht die Referenzierung in ORDER BY:

---

\`\`\`sql
-- Spalte umbenennen
SELECT name AS produktname FROM produkte;

-- Berechnete Spalte mit Alias
SELECT preis * 1.19 AS bruttopreis FROM produkte;

-- Alias ohne AS (möglich, aber weniger lesbar)
SELECT name produktname FROM produkte;
\`\`\`

---

**Aliase in verschiedenen Klauseln:**
- ORDER BY kann Aliase verwenden: \`ORDER BY bruttopreis DESC\`
- WHERE kann Aliase in SQLite **nicht** verwenden (nur in einigen DBMS)
- HAVING kann Aliase in SQLite verwenden
- GROUP BY kann Aliase in SQLite verwenden`,
            keyTakeaways: [
              "DISTINCT entfernt doppelte Zeilen aus der Ergebnismenge",
              "DISTINCT bezieht sich auf die gesamte Zeile",
              "DISTINCT ist aufwendig — nur wenn wirklich nötig",
              "AS erstellt Spaltenaliase für bessere Lesbarkeit",
            ],
          },
        ],
      },
      {
        id: "datentypen-sql",
        title: "SQL-Datentypen und Typkonvertierung",
        estimatedMinutes: 10,
        sections: [
          {
            id: "sql-datentypen",
            title: "Wichtige SQL-Datentypen",
            sectionType: "theory",
            content: `**SQL-Datentypen** bestimmen, welche Art von Daten in einer Spalte gespeichert werden kann. Sie sind die Grundlage für Datenintegrität: Ein INTEGER-Feld akzeptiert nur ganze Zahlen, ein VARCHAR(100) nur Zeichenketten bis 100 Zeichen. Die richtige Wahl des Datentyps verhindert fehlerhafte Daten und optimiert Speicherplatz sowie Abfragegeschwindigkeit.

Die Wahl des richtigen Datentyps ist eine der wichtigsten Designentscheidungen beim Erstellen von Tabellen. Ein zu kleiner Datentyp führt zu Datenverlust, ein zu großer verschwendet Speicher und verlangsamt Abfragen.

**Numerische Typen — für Zahlen jeder Größe:**

| Typ | Beschreibung | Bereich |
|-----|-------------|---------|
| INTEGER / INT | Ganze Zahlen | -2³¹ bis 2³¹-1 |
| SMALLINT | Kleine Ganzzahlen | -32768 bis 32767 |
| BIGINT | Große Ganzzahlen | -2⁶³ bis 2⁶³-1 |
| DECIMAL(p,s) | Dezimalzahl (p Stellen, s Nachkommastellen) | Präzise |
| FLOAT / REAL | Gleitkommazahl | ~7 Stellen Genauigkeit |
| DOUBLE | Doppelte Genauigkeit | ~15 Stellen Genauigkeit |

**Besonders wichtig:** Für Geldbeträge verwende **immer** \`DECIMAL(10,2)\` und niemals FLOAT! FLOAT hat Rundungsfehler — 0.1 + 0.2 ergibt nicht 0.3 in Gleitkomma-Arithmetik. DECIMAL speichert Zahlen exakt und ist daher für finanzielle Berechnungen unverzichtbar.

**Zeichenketten-Typen — für Text:**

| Typ | Beschreibung |
|-----|-------------|
| VARCHAR(n) | Zeichenkette mit max. n Zeichen (variable Länge) |
| CHAR(n) | Zeichenkette mit genau n Zeichen (feste Länge) |
| TEXT | Unbegrenzte Zeichenkette |

VARCHAR ist die Standardwahl für die meisten Textspalten — es speichert nur so viele Zeichen, wie tatsächlich verwendet werden. CHAR ist sinnvoll für Werte mit immer gleicher Länge wie PLZ oder Ländercodes.

**Datum/Zeit-Typen — für zeitliche Daten:**

| Typ | Beschreibung | Format |
|-----|-------------|--------|
| DATE | Datum | '2024-01-15' |
| TIME | Uhrzeit | '14:30:00' |
| DATETIME | Datum und Uhrzeit | '2024-01-15 14:30:00' |
| TIMESTAMP | Zeitstempel | Unix-Zeit oder ISO-Format |

**SQLite-Besonderheit:**
SQLite verwendet **dynamische Typisierung** (Type Affinity). Jede Spalte hat eine „Affinität" (TEXT, NUMERIC, INTEGER, REAL, BLOB), aber SQLite erzwingt den Typ nicht streng. Man kann z.B. Text in eine INTEGER-Spalte einfügen — SQLite konvertiert ihn automatisch oder speichert ihn als Text. Das ist praktisch für Flexibilität, kann aber zu subtilen Fehlern führen, wenn man nicht aufpasst.`,
            keyTakeaways: [
              "INTEGER: Ganze Zahlen, VARCHAR(n): Zeichenketten, DECIMAL(p,s): Dezimalzahlen",
              "DATE/DATETIME für Datum und Uhrzeit",
              "SQLite: dynamische Typisierung — Typen werden nicht streng erzwungen",
              "DECIMAL statt FLOAT für Geldbeträge (Präzision!)",
            ],
          },
          {
            id: "cast-und-konvertierung",
            title: "Typkonvertierung mit CAST",
            sectionType: "example",
            content: `**CAST** konvertiert einen Wert von einem Datentyp in einen anderen. In der Praxis kommt es häufig vor, dass Daten nicht im gewünschten Format vorliegen — etwa wenn eine Zahl als Text gespeichert wurde oder ein Datum als Zeichenkette. CAST löst dieses Problem, indem es den Typ explizit ändert.

---

\`\`\`sql
-- Zeichenkette in Zahl umwandeln
SELECT CAST('42' AS INTEGER);

-- Zahl in Zeichenkette umwandeln
SELECT CAST(42 AS VARCHAR);

-- Datum als Text formatieren
SELECT CAST(bestelldatum AS VARCHAR) FROM bestellungen;
\`\`\`

---

**Automatische Typkonvertierung (implizit):**
SQLite ist nachsichtig mit Typen und konvertiert automatisch, wenn es sinnvoll erscheint. Das ist praktisch, kann aber zu unerwarteten Ergebnissen führen:

---

\`\`\`sql
-- SQLite konvertiert automatisch:
SELECT '42' + 8;        -- Ergebnis: 50 (Text → Integer)
SELECT 42 || ' Stück';  -- Ergebnis: '42 Stück' (Integer → Text)
\`\`\`

---

**Häufige Konvertierungen im Überblick:**

| Von | Nach | Syntax |
|-----|------|--------|
| Text → Zahl | INTEGER | \`CAST('42' AS INTEGER)\` |
| Zahl → Text | VARCHAR | \`CAST(42 AS VARCHAR)\` |
| Text → Datum | DATE | \`CAST('2024-01-15' AS DATE)\` |
| Float → Integer | INTEGER | \`CAST(3.7 AS INTEGER)\` → 3 (abschneiden!) |

**Vorsicht bei Konvertierungen — diese Stolpersteine erwarten dich:**
- \`CAST('abc' AS INTEGER)\` → 0 in SQLite (Fehler in anderen DBMS!) — Text, der keine Zahl ist, wird zu 0
- \`CAST(3.7 AS INTEGER)\` → 3 — Nachkommastellen werden abgeschnitten, nicht gerundet
- \`CAST(NULL AS INTEGER)\` → NULL — NULL bleibt NULL, egal in welchen Typ du es konvertierst

**Best Practice:** Immer explizit konvertieren statt sich auf implizite Konvertierung zu verlassen. Das macht den Code portabel (er funktioniert auch in anderen DBMS) und verständlich (andere Entwickler sehen sofort, was passiert).`,
            keyTakeaways: [
              "CAST(wert AS typ) konvertiert Datentypen explizit",
              "SQLite konvertiert auch implizit (automatisch)",
              "CAST('abc' AS INTEGER) → 0 in SQLite (Vorsicht!)",
              "Best Practice: Immer explizit konvertieren",
            ],
          },
        ],
      },
      {
        id: "berechnungen-sql",
        title: "Berechnungen in SQL: Arithmetik, CASE, COALESCE",
        estimatedMinutes: 12,
        sections: [
          {
            id: "arithmetik-case",
            title: "Arithmetik und CASE-WHEN",
            sectionType: "theory",
            content: `SQL kann mehr als nur Daten abfragen — du kannst auch Berechnungen direkt in der Abfrage durchführen. Arithmetische Operationen erlauben dir, Werte zu addieren, subtrahieren, multiplizieren und dividieren. CASE-WHEN ist SQLs Version von if/else — es erlaubt bedingte Berechnungen innerhalb einer Abfrage. Und COALESCE und NULLIF sind unverzichtbare Helfer für den Umgang mit NULL-Werten.

**Arithmetische Operationen in SQL:**

| Operator | Beschreibung | Beispiel |
|----------|-------------|----------|
| + | Addition | \`preis + 5\` |
| - | Subtraktion | \`preis - rabatt\` |
| * | Multiplikation | \`preis * menge\` |
| / | Division | \`umsatz / 12\` |
| % | Modulo (Rest) | \`id % 2\` |



\`\`\`sql
-- Bruttopreis berechnen (Netto + 19% MwSt)
SELECT name, preis, preis * 1.19 AS brutto FROM produkte;

-- Rabatt berechnen (10% Rabatt)
SELECT name, preis, preis * 0.9 AS rabattpreis FROM produkte;
\`\`\`

---

**Achtung bei der Division:** In SQL teilt eine Ganzzahl durch eine Ganzzahl wieder eine Ganzzahl — \`5 / 2\` ergibt 2, nicht 2.5! Um Kommastellen zu bekommen, muss mindestens ein Operand eine Kommazahl sein: \`5.0 / 2\` ergibt 2.5.

**CASE-WHEN — Bedingte Berechnungen:**
CASE-WHEN ist eines der mächtigsten Werkzeuge in SQL. Es erlaubt dir, Werte basierend auf Bedingungen zu berechnen — wie ein if/else in anderen Programmiersprachen, aber direkt in der Abfrage. Die WHEN-Bedingungen werden von oben nach unten ausgewertet — die erste zutreffende Bedingung gewinnt.

---

\`\`\`sql
-- Preis-Kategorie bestimmen
SELECT name, preis,
  CASE
    WHEN preis < 10 THEN 'Günstig'
    WHEN preis < 50 THEN 'Mittel'
    WHEN preis < 100 THEN 'Teuer'
    ELSE 'Sehr teuer'
  END AS preiskategorie
FROM produkte;
\`\`\`

---

CASE-WHEN wird in der Praxis ständig eingesetzt: für Klassifizierungen, bedingte Aggregationen, benutzerdefinierte Sortierungen und vieles mehr.

**CASE in ORDER BY — Benutzerdefinierte Sortierung:**
\`\`\`sql
-- Produkte nach benutzerdefinierter Reihenfolge sortieren
SELECT * FROM produkte
ORDER BY
  CASE kategorie
    WHEN 'Elektronik' THEN 1
    WHEN 'Buch' THEN 2
    ELSE 3
  END;
\`\`\`

---

**COALESCE — NULL-Werte ersetzen:**
COALESCE ist ein praktischer Helfer, der den ersten Nicht-NULL-Wert aus einer Liste zurückgibt. Es ist die Standardmethode, um NULL-Werte durch Standardwerte zu ersetzen:

---

\`\`\`sql
-- Ersten Nicht-NULL-Wert zurückgeben
SELECT name, COALESCE(telefon, email, 'Keine Kontaktinfo') AS kontakt FROM kunden;

-- NULL in Berechnungen ersetzen (verhindert NULL-Ergebnisse)
SELECT name, preis * COALESCE(rabatt, 0) AS rabattbetrag FROM produkte;
\`\`\`

---

**NULLIF — NULL erzeugen bei Gleichheit:**
NULLIF gibt NULL zurück, wenn beide Argumente gleich sind — andernfalls das erste Argument. Der wichtigste Anwendungsfall: Division durch Null verhindern.

---

\`\`\`sql
-- Division durch Null vermeiden
SELECT umsatz / NULLIF(mitarbeiterzahl, 0) AS umsatz_pro_mitarbeiter
FROM abteilungen;
\`\`\`

---

Wenn \`mitarbeiterzahl\` 0 ist, wird NULLIF zu NULL — und die Division ergibt NULL statt eines Fehlers.`,
            keyTakeaways: [
              "Arithmetik: +, -, *, /, % direkt in SELECT verwendbar",
              "Ganzzahldivision: 5/2 = 2, nicht 2.5 — mindestens ein Operand muss Kommazahl sein",
              "CASE-WHEN: Bedingte Berechnungen (wie if/else)",
              "COALESCE: Ersten Nicht-NULL-Wert zurückgeben",
              "NULLIF: Division durch Null vermeiden",
            ],
          },
        ],
      },
      {
        id: "mengenoperationen-sql",
        title: "Mengenoperationen: UNION, INTERSECT, EXCEPT",
        estimatedMinutes: 10,
        sections: [
          {
            id: "union-intersect-except-sql",
            title: "Mengenoperationen in der Praxis",
            sectionType: "example",
            content: `Mengenoperationen verbinden die Ergebnisse zweier oder mehrerer SELECT-Abfragen. Statt Spalten hinzuzufügen wie bei JOINs, fügen Mengenoperationen Zeilen hinzu — sie arbeiten vertikal, nicht horizontal. UNION vereinigt Ergebnisse, INTERSECT liefert die Schnittmenge und EXCEPT die Differenz. Wichtig: Beide Abfragen müssen die gleiche Anzahl Spalten mit kompatiblen Datentypen haben. Die Spaltennamen stammen immer aus der ersten Abfrage.

**UNION — Ergebnisse zusammenführen:**
\`\`\`sql
-- Alle Personen (Kunden und Lieferanten)
SELECT name, stadt, 'Kunde' AS rolle FROM kunden
UNION
SELECT name, stadt, 'Lieferant' AS rolle FROM lieferanten;
\`\`\`

---

**UNION ALL — Mit Duplikaten:**
\`\`\`sql
-- Alle Bestellungen beider Jahre (inklusive Duplikate)
SELECT * FROM bestellungen_2023
UNION ALL
SELECT * FROM bestellungen_2024;
\`\`\`

---

**INTERSECT — Schnittmenge:**
\`\`\`sql
-- Produkte, die in beiden Filialen verfügbar sind
SELECT produkt_id FROM bestand_nord
INTERSECT
SELECT produkt_id FROM bestand_sued;
\`\`\`

---

**EXCEPT — Differenz:**
\`\`\`sql
-- Produkte, die nur im Nord-Bestand sind
SELECT produkt_id FROM bestand_nord
EXCEPT
SELECT produkt_id FROM bestand_sued;
\`\`\`

---

**Regeln für Mengenoperationen:**
1. Gleiche Anzahl Spalten in beiden Abfragen
2. Kompatible Datentypen in entsprechenden Spalten
3. Spaltennamen stammen aus der ersten Abfrage
4. UNION entfernt Duplikate, UNION ALL behält sie
5. ORDER BY gilt für das Gesamtergebnis (nur am Ende)

---

\`\`\`sql
-- ORDER BY am Ende der gesamten Abfrage
SELECT name FROM kunden
UNION
SELECT name FROM lieferanten
ORDER BY name;  -- Sortiert das kombinierte Ergebnis
\`\`\``,
            keyTakeaways: [
              "UNION: Kombiniert Ergebnisse (ohne Duplikate)",
              "UNION ALL: Kombiniert Ergebnisse (mit Duplikaten, schneller)",
              "INTERSECT: Gemeinsame Zeilen beider Abfragen",
              "EXCEPT: Zeilen der ersten Abfrage, die nicht in der zweiten sind",
              "Gleiche Spaltenanzahl und kompatible Datentypen erforderlich",
            ],
          },
        ],
      },
      {
        id: "fehler-sql-grundlagen",
        title: "Häufige SQL-Anfängerfehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "sql-fehler-liste",
            title: "Die häufigsten SQL-Anfängerfehler",
            sectionType: "theory",
            content: `**Fehler 1: SELECT * in produktivem Code**
\`SELECT *\` liefert alle Spalten — auch solche, die man nicht braucht. Das ist langsam und bricht, wenn die Tabelle geändert wird.
**Richtig:** \`SELECT name, preis FROM produkte\`

**Fehler 2: NULL mit = vergleichen**
\`WHERE spalte = NULL\` funktioniert nicht! NULL = NULL ergibt NULL, nicht TRUE.
**Richtig:** \`WHERE spalte IS NULL\`

**Fehler 3: LIKE mit führendem %**
\`WHERE name LIKE '%anna'\` kann keinen Index nutzen → langsam bei großen Tabellen.
**Besser:** Volltextsuche oder \`WHERE name LIKE 'anna%'\` (Index nutzbar)

**Fehler 4: ORDER BY ohne LIMIT**
Ohne LIMIT wird die gesamte Tabelle sortiert → bei Millionen Zeilen sehr langsam.
**Richtig:** \`ORDER BY datum DESC LIMIT 100\`

**Fehler 5: DISTINCT überflüssig**
\`SELECT DISTINCT kategorie FROM produkte\` ist nötig. Aber \`SELECT DISTINCT id, name FROM kunden\` ist überflüssig, wenn id der Primärschlüssel ist.

**Fehler 6: FLOAT für Geldbeträge**
\`FLOAT\` hat Rundungsfehler! 0.1 + 0.2 ≠ 0.3 in Gleitkomma-Arithmetik.
**Richtig:** \`DECIMAL(10,2)\` für Geldbeträge

**Fehler 7: Semikolon vergessen**
In einigen SQL-Clients ist das Semikolon am Ende obligatorisch.
**Richtig:** \`SELECT * FROM kunden;\`

**Fehler 8: String-Konkatenation mit +**
In SQL werden Strings mit \`||\` konkateniert, nicht mit \`+\`.
**Richtig:** \`SELECT vorname || ' ' || nachname AS voller_name FROM kunden;\`

**Fehler 9: GROUP BY-Regel verletzt**
Nach GROUP BY dürfen im SELECT nur GROUP BY-Spalten und Aggregatfunktionen stehen.
**Falsch:** \`SELECT name, kategorie, COUNT(*) FROM produkte GROUP BY kategorie\` — name ist nicht in GROUP BY!

**Fehler 10: Unterabfragen ohne Alias**
Abgeleitete Tabellen in der FROM-Klausel brauchen immer einen Alias.
**Falsch:** \`SELECT * FROM (SELECT ...) \`
**Richtig:** \`SELECT * FROM (SELECT ...) AS sub\``,
            keyTakeaways: [
              "SELECT * vermeiden — benötigte Spalten explizit angeben",
              "NULL immer mit IS NULL / IS NOT NULL prüfen",
              "DECIMAL statt FLOAT für Geldbeträge",
              "GROUP BY-Regel: Nur GROUP BY-Spalten und Aggregatfunktionen im SELECT",
              "Abgeleitete Tabellen brauchen immer einen Alias",
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
            content: `**INNER JOIN** ist der häufigste JOIN-Typ und verknüpft zwei Tabellen anhand einer Bedingung. Er liefert nur die Zeilen, bei denen die Join-Bedingung in **beiden** Tabellen erfüllt ist — alle Zeilen, die keinen Partner finden, fallen heraus.

Stell dir vor, du hast eine Kundentabelle und eine Bestellungstabelle. Ein INNER JOIN verbindet jeden Kunden mit seinen Bestellungen. Kunden ohne Bestellungen und Bestellungen ohne Kunden erscheinen nicht im Ergebnis — nur die Zeilen, die in beiden Tabellen einen Partner finden.



\`\`\`sql
SELECT a.spalte, b.spalte
FROM tabelle_a a
INNER JOIN tabelle_b b ON a.fk = b.pk;
\`\`\`

---

**Venn-Diagramm-Vorstellung:** Stell dir zwei überlappende Kreise vor. INNER JOIN liefert nur die Schnittmenge — den Bereich, in dem beide Kreise überlappen. Alles, was nur in einem Kreis liegt, wird nicht zurückgegeben.

**Wann INNER JOIN verwenden?**
- Wenn du nur übereinstimmende Zeilen aus beiden Tabellen brauchst
- Wenn fehlende Übereinstimmungen ignoriert werden sollen
- Wenn du sicher bist, dass du keine „verwaisten" Datensätze im Ergebnis brauchst

INNER JOIN ist der Standard-JOIN — wenn du einfach \`JOIN\` schreibst, meint SQL automatisch INNER JOIN.`,
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
            content: `**LEFT JOIN** (LEFT OUTER JOIN) liefert **alle** Zeilen der linken Tabelle und die übereinstimmenden Zeilen der rechten Tabelle. Fehlt ein Match, werden NULL-Werte eingesetzt. Das ist der Schlüsselunterschied zum INNER JOIN: Auch Zeilen ohne Partner in der rechten Tabelle bleiben im Ergebnis.

Stell dir vor, du willst alle Kunden auflisten — auch die, die noch nie etwas bestellt haben. Mit einem INNER JOIN würden diese Kunden einfach verschwinden. Mit LEFT JOIN bleiben sie im Ergebnis, und die Bestellspalten zeigen NULL.

---

\`\`\`sql
-- Alle Kunden mit ihren Bestellungen (auch ohne)
SELECT k.name, b.datum, b.gesamtbetrag
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

---

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

---

2. **Zähle mit Null-Werten:**
\`\`\`sql
-- Anzahl Bestellungen pro Kunde (auch 0)
SELECT k.name, COUNT(b.id) AS bestellanzahl
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;
\`\`\`

---

**Wichtig:** \`COUNT(*)\` zählt alle Zeilen (inklusive NULL-Matches), \`COUNT(b.id)\` zählt nur Nicht-NULL-Werte.

**RIGHT JOIN** ist äquivalent zu LEFT JOIN mit vertauschten Tabellen:
\`\`\`sql
-- Diese beiden Abfragen sind identisch:
SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;
SELECT * FROM b RIGHT JOIN a ON a.id = b.a_id;
\`\`\`

---

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
            content: `**RIGHT JOIN** (RIGHT OUTER JOIN) ist das Spiegelbild von LEFT JOIN: Es liefert alle Zeilen der **rechten** Tabelle und die übereinstimmenden Zeilen der linken Tabelle. Wo es keinen Match gibt, werden NULL-Werte eingesetzt. In der Praxis wird RIGHT JOIN selten verwendet — meistens schreibt man die Abfrage einfach mit LEFT JOIN, indem man die Tabellenreihenfolge vertauscht. Das ist lesbarer, weil die „wichtige" Tabelle immer links steht.

---

\`\`\`sql
-- RIGHT JOIN: Alle Bestellungen, auch ohne Kunden
SELECT k.name, b.datum
FROM kunden k
RIGHT JOIN bestellungen b ON k.id = b.kunde_id;

-- Dasselbe Ergebnis mit LEFT JOIN (empfohlen):
SELECT k.name, b.datum
FROM bestellungen b
LEFT JOIN kunden k ON k.id = b.kunde_id;
\`\`\`

---

**FULL JOIN** (FULL OUTER JOIN) liefert **alle** Zeilen aus beiden Tabellen. Wo es einen Match gibt, werden die Zeilen verbunden. Wo es keinen Match gibt, werden NULL-Werte eingesetzt. Stell dir vor, du hast zwei Tabellen und willst sehen, welche Zeilen sich entsprechen und welche „verwaist" sind — FULL JOIN zeigt beides.

---

\`\`\`sql
-- Alle Kunden und alle Bestellungen, auch ohne Match
SELECT k.name, b.datum
FROM kunden k
FULL JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

---

**Übersicht der JOIN-Typen:**

| JOIN-Typ | Was wird geliefert? | Anwendungsfall |
|----------|---------------------|---------------|
| INNER JOIN | Nur übereinstimmende Zeilen | Standard — wenn beide Seiten existieren müssen |
| LEFT JOIN | Alle linken + passende rechte | „Alle X mit ihren Y, auch ohne Y" |
| RIGHT JOIN | Alle rechten + passende linke | Selten — meist als LEFT JOIN umgeschrieben |
| FULL OUTER JOIN | Alle Zeilen beider Tabellen | „Zeige alles, auch Verwaiste" |

**Hinweis:** SQLite unterstützt keinen echten FULL OUTER JOIN. Du kannst ihn mit einem LEFT JOIN und einem RIGHT JOIN (über UNION) simulieren.`,
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
            content: `Ein **Self-Join** ist ein JOIN einer Tabelle mit sich selbst. Das klingt zunächst ungewöhnlich, ist aber in der Praxis sehr nützlich — immer dann, wenn Zeilen innerhalb derselben Tabelle miteinander verglichen werden sollen. Der Trick: Man gibt der Tabelle zwei verschiedene Aliase, als wären es zwei verschiedene Tabellen.

Typische Anwendungsfälle sind hierarchische Strukturen (Mitarbeiter und ihre Vorgesetzten), Vergleiche innerhalb einer Tabelle (Produkte mit ähnlichem Preis) und Adjazenzlisten (Knoten und ihre Nachbarn).

**Syntax:** Man gibt der Tabelle zwei verschiedene Aliase:

---

\`\`\`sql
SELECT a.name AS mitarbeiter, b.name AS vorgesetzter
FROM mitarbeiter a
INNER JOIN mitarbeiter b ON a.vorgesetzter_id = b.id;
\`\`\`

---

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

---

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

---

2. **Aufeinanderfolgende Ereignisse vergleichen:**
\`\`\`sql
SELECT a.datum, a.wert AS aktueller_wert, b.wert AS vorheriger_wert
FROM messungen a
LEFT JOIN messungen b ON a.datum = DATE(b.datum, '+1 day');
\`\`\`

---

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
      {
        id: "cross-join",
        title: "CROSS JOIN und kartesisches Produkt",
        estimatedMinutes: 8,
        sections: [
          {
            id: "cross-join-theorie",
            title: "CROSS JOIN — Das kartesische Produkt",
            sectionType: "theory",
            content: `**CROSS JOIN** verknüpft jede Zeile der ersten Tabelle mit jeder Zeile der zweiten Tabelle. Das Ergebnis ist das **kartesische Produkt** beider Tabellen.

---

\`\`\`sql
-- Jeden Kunden mit jedem Produkt kombinieren
SELECT k.name AS kunde, p.name AS produkt
FROM kunden k
CROSS JOIN produkte p;
\`\`\`

---

Bei 5 Kunden und 10 Produkten liefert dieser JOIN 50 Zeilen.

**Wann CROSS JOIN sinnvoll ist:**
- Alle Kombinationen generieren (z.B. alle Größen × alle Farben)
- Kalender-Generierung (alle Tage × alle Abteilungen)
- Testdaten erzeugen

**Wann CROSS JOIN gefährlich ist:**
- Aus Versehen keine JOIN-Bedingung angegeben
- Bei großen Tabellen explodiert die Ergebnismenge
- 1.000 × 10.000 = 10.000.000 Zeilen!

**CROSS JOIN vs. INNER JOIN ohne Bedingung:**
\`\`\`sql
-- Beide liefern dasselbe Ergebnis:
SELECT * FROM kunden CROSS JOIN produkte;
SELECT * FROM kunden, produkte;
\`\`\`

---

**Praktisches Beispiel — Kalender-Generierung:**
\`\`\`sql
-- Alle Kombinationen aus Tagen und Räumen
SELECT t.datum, r.raum_name
FROM tage t
CROSS JOIN raeume r;
\`\`\``,
            keyTakeaways: [
              "CROSS JOIN: Jede Zeile × jede Zeile = kartesisches Produkt",
              "Ergebnisgröße: Zeilen_A × Zeilen_B",
              "Sinnvoll für Kombinationen, Kalender, Testdaten",
              "Gefährlich bei großen Tabellen — Ergebnismenge explodiert",
            ],
          },
        ],
      },
      {
        id: "join-mehrere-tabellen",
        title: "Joins über mehrere Tabellen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "multi-join",
            title: "Mehrere Tabellen verknüpfen",
            sectionType: "theory",
            content: `In der Praxis müssen oft mehr als zwei Tabellen verknüpft werden. Das geht durch mehrere JOINs in einer Abfrage.

**Beispiel: Bestellung mit Kunde, Positionen und Produkt**
\`\`\`sql
SELECT
  k.name AS kunde,
  b.datum AS bestelldatum,
  p.name AS produkt,
  bp.menge,
  bp.einzelpreis
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
JOIN bestellpositionen bp ON b.id = bp.bestellung_id
JOIN produkte p ON bp.produkt_id = p.id
WHERE b.status = 'versendet';
\`\`\`

---

**Reihenfolge der JOINs:**
- SQL verarbeitet JOINs von links nach rechts
- Die Reihenfolge kann die Performance beeinflussen
- Mit INNER JOIN ist die Reihenfolge für das Ergebnis egal
- Mit LEFT JOIN ist die Reihenfolge wichtig!

**LEFT JOIN mit mehreren Tabellen:**
\`\`\`sql
-- Alle Kunden mit ihren Bestellungen und Produkten
-- (auch Kunden ohne Bestellungen)
SELECT k.name, b.datum, p.name
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
LEFT JOIN bestellpositionen bp ON b.id = bp.bestellung_id
LEFT JOIN produkte p ON bp.produkt_id = p.id;
\`\`\`

---

**Alias-Best Practices:**
- Kurze, aussagekräftige Aliase (k für kunden, b für bestellungen)
- Tabellen-Alias in der SELECT-Klausel verwenden bei mehrdeutigen Spaltennamen
- Jede Tabelle bekommt einen Alias`,
            keyTakeaways: [
              "Mehrere JOINs verknüpfen mehr als zwei Tabellen",
              "INNER JOIN: Reihenfolge für Ergebnis egal",
              "LEFT JOIN: Reihenfolge wichtig!",
              "Aussagekräftige Aliase für jede Tabelle verwenden",
            ],
          },
        ],
      },
      {
        id: "join-bedingungen",
        title: "Join-Bedingungen: Equi-Join und Theta-Join",
        estimatedMinutes: 10,
        sections: [
          {
            id: "equi-theta-join",
            title: "Equi-Join und Theta-Join",
            sectionType: "theory",
            content: `**Equi-Join** ist ein JOIN mit einer Gleichheitsbedingung (ON a.id = b.id). Das ist der häufigste JOIN-Typ.

---

\`\`\`sql
-- Equi-Join: Gleichheitsbedingung
SELECT k.name, b.datum
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

---

**Theta-Join** ist ein JOIN mit einer beliebigen Vergleichsbedingung (>, <, >=, <=, <>, BETWEEN).

---

\`\`\`sql
-- Theta-Join: Ungleichheitsbedingung
-- Finde Produkte, die teurer sind als der Durchschnitt ihrer Kategorie
SELECT p.name, p.preis, k.avg_preis
FROM produkte p
JOIN (
  SELECT kategorie, AVG(preis) AS avg_preis
  FROM produkte
  GROUP BY kategorie
) k ON p.kategorie = k.kategorie AND p.preis > k.avg_preis;
\`\`\`

---

**USING-Klausel (bei gleichnamigen Spalten):**
\`\`\`sql
-- Statt ON kunden.id = bestellungen.kunde_id
SELECT * FROM kunden
JOIN bestellungen USING (kunde_id);
-- Voraussetzung: Beide Tabellen haben eine Spalte namens kunde_id
\`\`\`

---

**NATURAL JOIN (Vorsicht!):**
\`\`\`sql
-- Verknüpft automatisch über alle gleichnamigen Spalten
SELECT * FROM kunden
NATURAL JOIN bestellungen;
\`\`\`

---

**Warnung:** NATURAL JOIN ist gefährlich, weil er alle gleichnamigen Spalten verknüpft. Wenn versehentlich eine Spalte wie „name" in beiden Tabellen existiert, wird sie als Join-Bedingung verwendet — oft nicht beabsichtigt!`,
            keyTakeaways: [
              "Equi-Join: Gleichheitsbedingung (ON a.id = b.id) — der Standard",
              "Theta-Join: Beliebige Vergleichsbedingung — selten verwendet",
              "USING: Kurzform bei gleichnamigen Join-Spalten",
              "NATURAL JOIN: Gefährlich — verknüpft über alle gleichnamigen Spalten",
            ],
          },
        ],
      },
      {
        id: "join-vs-subquery",
        title: "JOIN vs. Subquery — wann was verwenden?",
        estimatedMinutes: 10,
        sections: [
          {
            id: "join-vs-subquery-vergleich",
            title: "JOIN oder Subquery?",
            sectionType: "theory",
            content: `Oft kann man dieselbe Aufgabe mit einem JOIN oder einer Subquery lösen. Wann welche Methode besser ist:

**JOIN verwenden, wenn:**
- Daten aus mehreren Tabellen gleichzeitig benötigt werden
- Die Ergebnismenge Spalten aus mehreren Tabellen enthalten soll
- Die Abfrage lesbar und performant sein soll

**Subquery verwenden, wenn:**
- Nur geprüft werden soll, ob etwas existiert (EXISTS)
- Ein einzelner Wert als Filter benötigt wird (Skalar-Subquery)
- Die Logik von innen nach außen leichter zu verstehen ist

**Beispiel — Dasselbe mit JOIN und Subquery:**

---

\`\`\`sql
-- Mit JOIN
SELECT k.name, b.datum
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
WHERE b.betrag > 100;

-- Mit Subquery (EXISTS)
SELECT k.name
FROM kunden k
WHERE EXISTS (
  SELECT 1 FROM bestellungen b
  WHERE b.kunde_id = k.id AND b.betrag > 100
);
\`\`\`

---

**Performance-Regeln:**
- INNER JOIN ist meist schneller als IN-Subquery
- EXISTS ist oft schneller als IN bei großen Unterabfragen
- Korrelierte Subqueries können sehr langsam sein → durch JOIN ersetzen
- Der Query-Optimizer kann oft Subqueries in JOINs umschreiben

**Lesbarkeits-Regeln:**
- Einfache Filter → Subquery ist oft lesbarer
- Daten aus mehreren Tabellen → JOIN ist natürlicher
- EXISTS/NOT EXISTS → klarer als JOIN mit NULL-Check`,
            keyTakeaways: [
              "JOIN: Wenn Daten aus mehreren Tabellen benötigt werden",
              "Subquery: Wenn nur ein Wert oder eine Existenzprüfung nötig ist",
              "INNER JOIN meist schneller als IN-Subquery",
              "EXISTS oft schneller als IN bei großen Unterabfragen",
            ],
          },
        ],
      },
      {
        id: "join-performance",
        title: "JOIN-Performance und Optimierung",
        estimatedMinutes: 10,
        sections: [
          {
            id: "join-perf",
            title: "JOINs schneller machen",
            sectionType: "theory",
            content: `**Die häufigsten Performance-Probleme bei JOINs:**

**1. Fehlende Indizes auf Join-Spalten**
Der häufigste Performance-Killer. Ohne Index auf der Join-Spalte muss die Datenbank jeden Wert in der Tabelle durchsuchen (Full Table Scan).

---

\`\`\`sql
-- Index auf Fremdschlüssel-Spalte erstellen
CREATE INDEX idx_bestellungen_kunde_id ON bestellungen(kunde_id);
\`\`\`

---

**2. Zu viele JOINs**
Jeder JOIN erhöht die Komplexität. Bei 5+ JOINs sollte man die Abfrage überdenken.

**3. SELECT * vermeiden**
Nur die benötigten Spalten abfragen spart Speicher und Bandbreite.

**4. LEFT JOIN statt INNER JOIN wenn nicht nötig**
LEFT JOIN muss NULL-Werte produzieren — wenn man nur übereinstimmende Zeilen braucht, ist INNER JOIN schneller.

**5. Subquery im JOIN optimieren**
\`\`\`sql
-- Langsam: Subquery im JOIN
SELECT k.name, b.gesamt
FROM kunden k
JOIN (SELECT kunde_id, SUM(betrag) AS gesamt FROM bestellungen GROUP BY kunde_id) b
ON k.id = b.kunde_id;

-- Schneller: CTE oder direkte Aggregation
WITH kundenumsatz AS (
  SELECT kunde_id, SUM(betrag) AS gesamt
  FROM bestellungen GROUP BY kunde_id
)
SELECT k.name, ku.gesamt
FROM kunden k
JOIN kundenumsatz ku ON k.id = ku.kunde_id;
\`\`\`

---

**6. Kartesisches Produkt vermeiden**
Fehlende JOIN-Bedingung → CROSS JOIN → Millionen Zeilen!

**EXPLAIN nutzen:**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT k.name, b.datum
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

---

EXPLAIN zeigt, ob Indizes verwendet werden und wie die Abfrage ausgeführt wird.`,
            keyTakeaways: [
              "Index auf Join-Spalten erstellen — der wichtigste Performance-Tipp",
              "SELECT * vermeiden — nur benötigte Spalten abfragen",
              "INNER JOIN statt LEFT JOIN wenn möglich",
              "EXPLAIN QUERY PLAN nutzen, um die Ausführung zu analysieren",
            ],
          },
        ],
      },
      {
        id: "natuerlicher-join",
        title: "NATURAL JOIN und USING-Klausel",
        estimatedMinutes: 8,
        sections: [
          {
            id: "natural-join-using",
            title: "NATURAL JOIN und USING",
            sectionType: "theory",
            content: `**NATURAL JOIN** verknüpft zwei Tabellen automatisch über alle gleichnamigen Spalten.

---

\`\`\`sql
-- NATURAL JOIN: Verknüpft über alle gleichnamigen Spalten
SELECT * FROM kunden
NATURAL JOIN bestellungen;
-- Verknüpft über kunde_id (wenn in beiden Tabellen vorhanden)
\`\`\`

---

**Vorteile:**
- Kurze Syntax
- Keine ON-Klausel nötig

**Nachteile:**
- Unvorhersehbar, wenn Tabellenstruktur sich ändert
- Verknüpft über ALLE gleichnamigen Spalten — auch versehentliche wie „name" oder „id"
- Schwer zu debuggen
- **In der Praxis nicht empfohlen!**

**USING-Klausel — Die bessere Alternative:**
\`\`\`sql
-- USING: Explizite Angabe der Join-Spalte
SELECT * FROM kunden
JOIN bestellungen USING (kunde_id);
\`\`\`

---

**Vorteile von USING:**
- Explizit — klar, welche Spalte verknüpft wird
- Kürzer als ON a.id = b.id
- Die Join-Spalte erscheint nur einmal im Ergebnis

**Vergleich:**
\`\`\`sql
-- ON-Klausel (Standard)
SELECT k.name, b.datum
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id;

-- USING-Klausel (kürzer)
SELECT name, datum
FROM kunden
JOIN bestellungen USING (kunde_id);

-- NATURAL JOIN (nicht empfohlen!)
SELECT * FROM kunden
NATURAL JOIN bestellungen;
\`\`\`

---

**Empfehlung:** ON-Klausel verwenden (am explizitesten), USING bei gleichnamigen Spalten als Alternative. NATURAL JOIN vermeiden.`,
            keyTakeaways: [
              "NATURAL JOIN: Automatisch über gleichnamige Spalten — gefährlich!",
              "USING: Explizite Angabe der Join-Spalte — sicherer",
              "ON-Klausel: Am explizitesten und am sichersten",
              "NATURAL JOIN in der Praxis vermeiden",
            ],
          },
        ],
      },
      {
        id: "join-fehler",
        title: "Häufige JOIN-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "join-fehler-liste",
            title: "Die häufigsten JOIN-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: Fehlende JOIN-Bedingung → kartesisches Produkt**
\`\`\`sql
-- FALSCH: Keine ON-Klausel → jeder Kunde × jede Bestellung
SELECT * FROM kunden, bestellungen;

-- RICHTIG: JOIN mit Bedingung
SELECT * FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

---

**Fehler 2: Falsche JOIN-Bedingung**
\`\`\`sql
-- FALSCH: Falsche Spalte verknüpft
SELECT * FROM bestellungen b
JOIN produkte p ON b.kunde_id = p.id;  -- kunde_id statt produkt_id!

-- RICHTIG:
SELECT * FROM bestellpositionen bp
JOIN produkte p ON bp.produkt_id = p.id;
\`\`\`

---

**Fehler 3: LEFT JOIN statt INNER JOIN**
Wenn man nur übereinstimmende Zeilen braucht, ist LEFT JOIN langsamer und kann NULL-Werte produzieren.

**Fehler 4: Mehrfach-JOIN ohne Alias**
\`\`\`sql
-- FALSCH: Mehrdeutige Spaltennamen
SELECT name, name FROM kunden
JOIN bestellungen ON kunden.id = bestellungen.kunde_id
JOIN produkte ON bestellpositionen.produkt_id = produkte.id;

-- RICHTIG: Aliase und Tabellen-Präfix
SELECT k.name AS kunde, p.name AS produkt
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
JOIN bestellpositionen bp ON b.id = bp.bestellung_id
JOIN produkte p ON bp.produkt_id = p.id;
\`\`\`

---

**Fehler 5: COUNT(*) mit LEFT JOIN**
\`\`\`sql
-- FALSCH: Zählt NULL-Werte mit
SELECT k.name, COUNT(*) AS anzahl
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;

-- RICHTIG: Zählt nur Nicht-NULL-Werte
SELECT k.name, COUNT(b.id) AS anzahl
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;
\`\`\`

---

**Fehler 6: OR im JOIN**
\`\`\`sql
-- LANGSAM: OR im JOIN
SELECT * FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id OR k.email = b.email;

-- BESSER: Zwei separate JOINs oder UNION
\`\`\``,
            keyTakeaways: [
              "Fehlende JOIN-Bedingung → kartesisches Produkt (großer Fehler!)",
              "Falsche JOIN-Bedingung → falsche Ergebnisse",
              "LEFT JOIN nur wenn NULL-Werte gewollt sind",
              "Aliase und Tabellen-Präfix bei Mehrfach-JOINs",
              "COUNT(*) vs COUNT(spalte) bei LEFT JOIN beachten",
            ],
          },
        ],
      },
      {
        id: "join-praxisbeispiele",
        title: "JOIN-Praxisbeispiele",
        estimatedMinutes: 12,
        sections: [
          {
            id: "join-praxis",
            title: "Praktische JOIN-Beispiele",
            sectionType: "practice",
            content: `JOINs sind das wichtigste Werkzeug, um Daten aus mehreren Tabellen zusammenzuführen. In der Praxis brauchst du fast immer JOINs — selten stehen alle benötigten Daten in einer einzigen Tabelle. Hier sind die häufigsten Muster: Mehrfach-JOINs für Bestellübersichten, LEFT JOIN mit IS NULL für „ohne"-Abfragen (Kunden ohne Bestellungen, Produkte ohne Verkäufe), COALESCE für NULL-sichere Aggregationen und Self-Joins für hierarchische Daten.

**Beispiel 1: Online-Shop — Bestellungen mit Details**
\`\`\`sql
SELECT
  k.name AS kunde,
  b.datum AS bestelldatum,
  p.name AS produkt,
  bp.menge,
  bp.einzelpreis,
  bp.menge * bp.einzelpreis AS gesamtpreis
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
JOIN bestellpositionen bp ON b.id = bp.bestellung_id
JOIN produkte p ON bp.produkt_id = p.id
ORDER BY b.datum DESC;
\`\`\`

---

**Beispiel 2: Universität — Notenübersicht**
\`\`\`sql
SELECT
  s.name AS student,
  k.name AS kurs,
  b.note,
  b.semester
FROM studenten s
JOIN belegungen b ON s.id = b.student_id
JOIN kurse k ON b.kurs_id = k.id
WHERE b.note IS NOT NULL
ORDER BY s.name, k.name;
\`\`\`

---

**Beispiel 3: Kunden ohne Bestellungen (LEFT JOIN)**
\`\`\`sql
SELECT k.name
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
WHERE b.id IS NULL;
\`\`\`

---

**Beispiel 4: Umsatz pro Kunde mit NULL-Werten**
\`\`\`sql
SELECT
  k.name,
  COALESCE(SUM(b.betrag), 0) AS umsatz
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name
ORDER BY umsatz DESC;
\`\`\`

---

**Beispiel 5: Self-Join — Mitarbeiter mit Vorgesetztem**
\`\`\`sql
SELECT
  m.name AS mitarbeiter,
  v.name AS vorgesetzter
FROM mitarbeiter m
LEFT JOIN mitarbeiter v ON m.vorgesetzter_id = v.id;
\`\`\`

---

**Beispiel 6: Produkte, die noch nie bestellt wurden**
\`\`\`sql
SELECT p.name
FROM produkte p
LEFT JOIN bestellpositionen bp ON p.id = bp.produkt_id
WHERE bp.produkt_id IS NULL;
\`\`\``,
            keyTakeaways: [
              "Mehrfach-JOINs verknüpfen 3+ Tabellen",
              "LEFT JOIN + WHERE ... IS NULL findet Einträge ohne Match",
              "COALESCE ersetzt NULL-Werte in Aggregationen",
              "Self-Join für Hierarchien (Mitarbeiter → Vorgesetzter)",
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

---

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

---

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

---

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
            content: `**ALTER TABLE** ändert die Struktur einer bestehenden Tabelle, ohne die Daten zu löschen. Es ist das Werkzeug der Wahl, wenn sich Anforderungen ändern und du Spalten hinzufügen, entfernen oder modifizieren musst — ohne die Tabelle neu zu erstellen.

---

\`\`\`sql
-- Spalte hinzufuegen
ALTER TABLE kunden ADD COLUMN telefon VARCHAR(20);

-- Spalte entfernen
ALTER TABLE kunden DROP COLUMN telefon;

-- Spalte aendern (MySQL)
ALTER TABLE kunden MODIFY COLUMN name VARCHAR(100);
\`\`\`

---

**Wichtige Hinweise zu ALTER TABLE:**
- Neue Spalten werden am Ende der Tabelle hinzugefügt — die Position kann in SQLite nicht geändert werden
- In SQLite ist \`DROP COLUMN\` ab Version 3.35.0 verfügbar — ältere Versionen unterstützen es nicht
- Änderungen an der Tabellenstruktur können bestehende Abfragen beeinflussen, die \`SELECT *\` verwenden
- Immer in einer Transaktion ausführen, um bei Fehlern zurückrollen zu können

**DROP TABLE** löscht eine gesamte Tabelle inklusive aller Daten und der Tabellenstruktur selbst. Das ist irreversibel — alle Daten gehen unwiderruflich verloren!

---

\`\`\`sql
DROP TABLE kunden;
\`\`\`

---

**Achtung:** DROP TABLE ist irreversibel! Alle Daten gehen verloren. Verwende immer \`DROP TABLE IF EXISTS\`, um Fehler zu vermeiden, wenn die Tabelle nicht existiert:

---

\`\`\`sql
DROP TABLE IF EXISTS kunden;
\`\`\`

---

**ALTER TABLE vs. DROP TABLE — der wichtige Unterschied:**
- ALTER TABLE ändert die Struktur, die Daten bleiben erhalten
- DROP TABLE löscht alles — Struktur und Daten
- ALTER TABLE ist reversibel (man kann die Änderung rückgängig machen), DROP TABLE nicht`,
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
            content: `**Indizes** sind wie ein Inhaltsverzeichnis für deine Datenbank. Ohne Index muss die Datenbank bei jeder Suche die gesamte Tabelle durchsuchen (Full Table Scan) — bei 1 Million Zeilen bedeutet das, 1 Million Zeilen zu prüfen. Mit einem Index auf der Suchspalte findet die Datenbank die gesuchten Zeilen in Millisekunden, indem sie direkt zum richtigen Eintrag springt.

Der Preis: Indizes verlangsamen Schreiboperationen (INSERT, UPDATE, DELETE), weil bei jeder Änderung auch der Index aktualisiert werden muss. Und sie verbrauchen zusätzlichen Speicherplatz. Du solltest Indizes also gezielt einsetzen — nicht auf jede Spalte, sondern nur auf die, die häufig durchsucht werden.

---

\`\`\`sql
-- Index erstellen
CREATE INDEX idx_kunde_name ON kunden(name);

-- Eindeutiger Index (wie UNIQUE, aber als Index)
CREATE UNIQUE INDEX idx_kunde_email ON kunden(email);

-- Index löschen
DROP INDEX idx_kunde_name;
\`\`\`

---

**Wann Indizes sinnvoll sind — und wann nicht:**

Indizes lohnen sich, wenn die Spalte häufig in WHERE-Klauseln, JOIN-Bedingungen oder ORDER BY-Klauseln vorkommt. Sie lohnen sich nicht bei sehr kleinen Tabellen (unter 100 Zeilen — da ist ein Full Table Scan genauso schnell), bei Spalten mit wenigen eindeutigen Werten (z.B. eine boolean-Spalte mit nur true/false) oder bei Spalten, die häufig aktualisiert werden (der Index müsste bei jedem UPDATE mitgeändert werden).

**EXPLAIN QUERY PLAN — Überprüfen, ob ein Index genutzt wird:**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT * FROM kunden WHERE name = 'Anna';
\`\`\`

---

Wenn du \`SCAN TABLE kunden\` siehst, wird kein Index genutzt. Wenn du \`SEARCH TABLE kunden USING INDEX idx_kunde_name\` siehst, wird der Index verwendet.`,
          },
        ],
      },
      {
        id: "datentypen-ddl",
        title: "SQL-Datentypen im Detail",
        estimatedMinutes: 12,
        sections: [
          {
            id: "ddl-datentypen",
            title: "Datentypen und ihre Eigenschaften",
            sectionType: "theory",
            content: `**Numerische Datentypen:**

| Typ | Beschreibung | Speicherbedarf | Bereich |
|-----|-------------|---------------|---------|
| INTEGER | Ganze Zahlen | 1-8 Bytes | -2⁶³ bis 2⁶³-1 |
| SMALLINT | Kleine Ganzzahlen | 2 Bytes | -32768 bis 32767 |
| BIGINT | Große Ganzzahlen | 8 Bytes | -2⁶³ bis 2⁶³-1 |
| REAL/FLOAT | Gleitkommazahlen | 4-8 Bytes | ~7-15 Stellen |
| DECIMAL(p,s) | Dezimalzahlen | Variabel | Präzise |

**Wichtig:** Für Geldbeträge IMMER DECIMAL verwenden, niemals FLOAT!
- \`DECIMAL(10,2)\` = 10 Stellen insgesamt, 2 Nachkommastellen
- \`FLOAT\` hat Rundungsfehler: 0.1 + 0.2 ≠ 0.3

**Zeichenketten-Datentypen:**

| Typ | Beschreibung | Max. Länge |
|-----|-------------|-----------|
| VARCHAR(n) | Zeichenkette variabler Länge | n Zeichen |
| CHAR(n) | Zeichenkette fester Länge | genau n Zeichen |
| TEXT | Unbegrenzte Zeichenkette | Unbegrenzt |

**Wann VARCHAR vs. CHAR:**
- \`VARCHAR\`: Variable Länge (Namen, E-Mail, Beschreibungen) — spart Speicher
- \`CHAR\`: Feste Länge (PLZ, Ländercode) — schneller für exakt passende Werte

**Datum/Zeit-Datentypen:**

| Typ | Beschreibung | Format |
|-----|-------------|--------|
| DATE | Datum | '2024-01-15' |
| TIME | Uhrzeit | '14:30:00' |
| DATETIME | Datum und Uhrzeit | '2024-01-15 14:30:00' |
| TIMESTAMP | Zeitstempel | Unix-Zeit oder ISO |

**SQLite-Besonderheit:** SQLite hat keine echten Datentypen — es verwendet Type Affinity (TEXT, NUMERIC, INTEGER, REAL, BLOB). Man kann jeden Wert in jede Spalte einfügen.`,
            keyTakeaways: [
              "DECIMAL statt FLOAT für Geldbeträge",
              "VARCHAR für variable Länge, CHAR für feste Länge",
              "DATE, TIME, DATETIME für Datum und Uhrzeit",
              "SQLite: dynamische Typisierung (Type Affinity)",
            ],
          },
        ],
      },
      {
        id: "constraints",
        title: "Constraints im Detail",
        estimatedMinutes: 12,
        sections: [
          {
            id: "ddl-constraints",
            title: "Alle Constraints im Überblick",
            sectionType: "theory",
            content: `**Constraints** sichern die Datenintegrität auf Tabellenebene.

**1. PRIMARY KEY — Eindeutige Identifikation**
\`\`\`sql
-- Einfacher Primärschlüssel
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL
);

-- Zusammengesetzter Primärschlüssel
CREATE TABLE belegungen (
  student_id INTEGER,
  kurs_id INTEGER,
  note DECIMAL(3,1),
  PRIMARY KEY (student_id, kurs_id)
);
\`\`\`

---

**2. NOT NULL — Pflichtfeld**
\`\`\`sql
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,  -- Pflichtfeld
  beschreibung TEXT             -- Optional (kann NULL sein)
);
\`\`\`

---

**3. UNIQUE — Eindeutigkeit**
\`\`\`sql
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,  -- Keine doppelten E-Mails
  benutzername VARCHAR(50) UNIQUE      -- Keine doppelten Benutzernamen
);
\`\`\`

---

**4. FOREIGN KEY — Referenzielle Integrität**
\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
\`\`\`

---

**5. CHECK — Wertebereiche einschränken**
\`\`\`sql
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  preis DECIMAL(10,2) CHECK (preis > 0),
  kategorie VARCHAR(50) CHECK (kategorie IN ('Elektronik', 'Buch', 'Kleidung')),
  bestand INTEGER DEFAULT 0 CHECK (bestand >= 0)
);
\`\`\`

---

**6. DEFAULT — Standardwerte**
\`\`\`sql
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'neu',
  datum DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

**Constraint-Namen für bessere Fehlermeldungen:**
\`\`\`sql
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  email VARCHAR(100),
  CONSTRAINT uk_email UNIQUE (email),
  CONSTRAINT chk_email CHECK (email LIKE '%@%.%')
);
\`\`\``,
            keyTakeaways: [
              "PRIMARY KEY: Eindeutige Identifikation, NOT NULL implizit",
              "NOT NULL: Pflichtfeld, UNIQUE: Eindeutigkeit",
              "FOREIGN KEY: Referenzielle Integrität mit ON DELETE/UPDATE",
              "CHECK: Wertebereiche einschränken",
              "DEFAULT: Standardwerte für neue Zeilen",
            ],
          },
        ],
      },
      {
        id: "autoincrement-sequenzen",
        title: "Auto-Increment und IDs",
        estimatedMinutes: 10,
        sections: [
          {
            id: "autoincrement-ids",
            title: "Automatische IDs generieren",
            sectionType: "theory",
            content: `**AUTOINCREMENT** generiert automatisch eindeutige IDs für neue Zeilen.



\`\`\`sql
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL
);

-- id wird automatisch gesetzt
INSERT INTO kunden (name) VALUES ('Anna');  -- id = 1
INSERT INTO kunden (name) VALUES ('Ben');   -- id = 2
\`\`\`

---

**AUTOINCREMENT vs. ohne AUTOINCREMENT in SQLite:**

| Eigenschaft | Mit AUTOINCREMENT | Ohne AUTOINCREMENT |
|-------------|-------------------|-------------------|
| IDs sind streng monoton steigend | Ja | Meistens, aber nicht garantiert |
| Gelöschte IDs werden nicht wiederverwendet | Ja | Ja (bei INTEGER PRIMARY KEY) |
| Garantie: Neue ID > alle bisherigen | Ja | Nein |
| Performance | Leicht langsamer | Leicht schneller |

**Best Practice:** AUTOINCREMENT verwenden, wenn IDs wirklich eindeutig und monoton steigend sein müssen (z.B. für Audit-Trails). Ohne AUTOINCREMENT reicht INTEGER PRIMARY KEY in den meisten Fällen.

**Zusammengesetzte Primärschlüssel:**
\`\`\`sql
CREATE TABLE belegungen (
  student_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  note DECIMAL(3,1),
  PRIMARY KEY (student_id, kurs_id),
  FOREIGN KEY (student_id) REFERENCES studenten(id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(id)
);
\`\`\`

---

**UUIDs als Primärschlüssel (Alternative):**
\`\`\`sql
-- In SQLite: TEXT-Spalte mit UUID
CREATE TABLE kunden (
  id TEXT PRIMARY KEY,  -- z.B. '550e8400-e29b-41d4-a716-446655440000'
  name VARCHAR(100) NOT NULL
);
\`\`\`

---

Vorteile von UUIDs: Global eindeutig, kein AUTOINCREMENT nötig, verteilt generierbar.
Nachteile: Größerer Speicherbedarf, langsamer bei JOINs.`,
            keyTakeaways: [
              "AUTOINCREMENT: Automatisch eindeutige, monoton steigende IDs",
              "INTEGER PRIMARY KEY ohne AUTOINCREMENT reicht meistens",
              "Zusammengesetzte Primärschlüssel für n:m-Beziehungen",
              "UUIDs als Alternative: global eindeutig, aber langsamer bei JOINs",
            ],
          },
        ],
      },
      {
        id: "views",
        title: "Views (Sichten) erstellen und nutzen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "views-theorie",
            title: "Was sind Views?",
            sectionType: "theory",
            content: `Eine **View** (Sicht) ist eine gespeicherte Abfrage, die wie eine Tabelle verwendet werden kann.

---

\`\`\`sql
-- View erstellen
CREATE VIEW kunden_umsatz AS
SELECT
  k.name AS kunde,
  COUNT(b.id) AS anzahl_bestellungen,
  COALESCE(SUM(b.betrag), 0) AS gesamtumsatz
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;

-- View verwenden (wie eine Tabelle)
SELECT * FROM kunden_umsatz WHERE gesamtumsatz > 1000;
\`\`\`

---

**Vorteile von Views:**
1. **Vereinfachung:** Komplexe Abfragen als View speichern und einfach abfragen
2. **Sicherheit:** Nur bestimmte Spalten/Zeilen für Benutzer freigeben
3. **Konsistenz:** Zentrale Definition von häufig verwendeten Abfragen
4. **Wartbarkeit:** Änderung an einer Stelle wirkt auf alle Verwender

**View löschen:**
\`\`\`sql
DROP VIEW IF EXISTS kunden_umsatz;
\`\`\`

---

**Einschränkungen von Views:**
- Views speichern keine Daten (sie sind nur gespeicherte Abfragen)
- Nicht alle Views sind aktualisierbar (INSERT/UPDATE/DELETE)
- Aktualisierbar sind nur Views, die auf eine einzige Tabelle basieren und keine Aggregatfunktionen verwenden

**Materialized Views (nicht in SQLite nativ unterstützt):**
Views, die ihre Ergebnisse physisch speichern. In SQLite kann man dies mit einer echten Tabelle simulieren:
\`\`\`sql
CREATE TABLE kunden_umsatz_materialized AS
SELECT k.name, SUM(b.betrag) AS umsatz
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;

-- Manuell aktualisieren
DELETE FROM kunden_umsatz_materialized;
INSERT INTO kunden_umsatz_materialized
SELECT k.name, SUM(b.betrag) AS umsatz
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;
\`\`\``,
            keyTakeaways: [
              "View = gespeicherte Abfrage, die wie eine Tabelle verwendet wird",
              "Vorteile: Vereinfachung, Sicherheit, Konsistenz, Wartbarkeit",
              "Views speichern keine Daten — sie werden bei jeder Abfrage neu berechnet",
              "Nur einfache Views sind aktualisierbar (INSERT/UPDATE/DELETE)",
            ],
          },
        ],
      },
      {
        id: "indizes-tiefer",
        title: "Indizes im Detail",
        estimatedMinutes: 12,
        sections: [
          {
            id: "indizes-detail",
            title: "Indizes: B-Baum, zusammengesetzte Indizes und Strategien",
            sectionType: "theory",
            content: `**Wie Indizes funktionieren:**
Ein Index ist wie ein Stichwortverzeichnis in einem Buch. Statt alle Seiten durchzublättern (Full Table Scan), sucht der Index die relevante Seite direkt.

**B-Baum-Index (Standard):**
Die meisten Datenbanken verwenden B-Bäume (Balanced Trees) als Index-Struktur. Ein B-Baum hält die Daten sortiert und ermöglicht logarithmische Suchzeit O(log n).

**Arten von Indizes:**

| Art | Beschreibung | Verwendung |
|-----|-------------|-----------|
| Einfach | Index auf einer Spalte | \`WHERE spalte = wert\` |
| Eindeutig | Keine doppelten Werte | PRIMARY KEY, UNIQUE |
| Zusammengesetzt | Index auf mehreren Spalten | \`WHERE a = x AND b = y\` |

**Zusammengesetzte Indizes:**
\`\`\`sql
-- Index auf (kategorie, preis)
CREATE INDEX idx_kategorie_preis ON produkte(kategorie, preis);

-- Wird genutzt für:
WHERE kategorie = 'Elektronik'                    -- Ja (linke Spalte)
WHERE kategorie = 'Elektronik' AND preis > 50      -- Ja (beide Spalten)
WHERE preis > 50                                    -- Nein! (nur rechte Spalte)
\`\`\`

---

**Regel: Ein zusammengesetzter Index wird von links nach rechts genutzt.** Wenn die linke Spalte nicht in der WHERE-Klausel vorkommt, wird der Index nicht verwendet.

**Wann Indizes erstellen:**
- Spalten in WHERE-Klauseln
- Spalten in JOIN-Bedingungen
- Spalten in ORDER BY
- Spalten mit hoher Selektivität (viele eindeutige Werte)

**Wann KEINE Indizes erstellen:**
- Sehr kleine Tabellen (< 100 Zeilen)
- Spalten mit wenigen eindeutigen Werten (z.B. boolean)
- Spalten, die häufig aktualisiert werden (jedes UPDATE aktualisiert auch den Index)
- Tabellen mit hohem Schreibzugriff

**Index prüfen:**
\`\`\`sql
-- SQLite: Zeige Indizes einer Tabelle
.indices produkte

-- Zeige den Ausführungsplan
EXPLAIN QUERY PLAN SELECT * FROM produkte WHERE kategorie = 'Elektronik';
\`\`\``,
            keyTakeaways: [
              "Index = Stichwortverzeichnis für schnelle Suche",
              "B-Baum: Standard-Index-Struktur, logarithmische Suchzeit",
              "Zusammengesetzte Indizes: Von links nach rechts nutzen",
              "Indizes beschleunigen Lesezugriffe, verlangsamen Schreibzugriffe",
            ],
          },
        ],
      },
      {
        id: "tabellen-aendern",
        title: "ALTER TABLE im Detail",
        estimatedMinutes: 10,
        sections: [
          {
            id: "alter-table-detail",
            title: "Tabellenstruktur ändern",
            sectionType: "theory",
            content: `**ALTER TABLE** ändert die Struktur einer bestehenden Tabelle.

**Spalte hinzufügen:**
\`\`\`sql
ALTER TABLE kunden ADD COLUMN telefon VARCHAR(20);
ALTER TABLE kunden ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
\`\`\`

---

**Spalte entfernen (SQLite-Besonderheit):**
SQLite unterstützt \`DROP COLUMN\` ab Version 3.35.0 (2021):
\`\`\`sql
ALTER TABLE kunden DROP COLUMN telefon;
\`\`\`

---

In älteren SQLite-Versionen muss man die Tabelle neu erstellen:
\`\`\`sql
-- 1. Neue Tabelle erstellen
CREATE TABLE kunden_neu (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

-- 2. Daten kopieren
INSERT INTO kunden_neu SELECT id, name, email FROM kunden;

-- 3. Alte Tabelle löschen
DROP TABLE kunden;

-- 4. Neue Tabelle umbenennen
ALTER TABLE kunden_neu RENAME TO kunden;
\`\`\`

---

**Tabelle umbenennen:**
\`\`\`sql
ALTER TABLE kunden RENAME TO users;
\`\`\`

---

**Spalte umbenennen (SQLite ab 3.25.0):**
\`\`\`sql
ALTER TABLE kunden RENAME COLUMN name TO voller_name;
\`\`\`

---

**Best Practices für Tabellenänderungen:**
1. Immer ein Backup erstellen vor ALTER TABLE
2. Änderungen in einer Transaktion durchführen
3. Indizes und Constraints nach der Änderung neu erstellen
4. Abhängige Views und Abfragen prüfen`,
            keyTakeaways: [
              "ALTER TABLE ADD COLUMN: Spalte hinzufügen",
              "ALTER TABLE DROP COLUMN: Spalte entfernen (SQLite ab 3.35.0)",
              "ALTER TABLE RENAME TO: Tabelle umbenennen",
              "ALTER TABLE RENAME COLUMN: Spalte umbenennen (SQLite ab 3.25.0)",
              "In älteren SQLite: Tabelle neu erstellen für komplexe Änderungen",
            ],
          },
        ],
      },
      {
        id: "ddl-best-practices",
        title: "DDL-Best Practices",
        estimatedMinutes: 10,
        sections: [
          {
            id: "ddl-namenskonventionen",
            title: "Namenskonventionen und Design-Entscheidungen",
            sectionType: "theory",
            content: `**Namenskonventionen:**

| Element | Konvention | Beispiel |
|---------|-----------|----------|
| Tabelle | Kleinbuchstaben, Plural | \`kunden\`, \`bestellungen\` |
| Spalte | Kleinbuchstaben, Singular | \`name\`, \`kunde_id\` |
| Primärschlüssel | \`id\` oder \`tabellenname_id\` | \`id\`, \`kunde_id\` |
| Fremdschlüssel | Referenztabelle_id | \`kunde_id\` |
| Index | \`idx_\` + Tabelle + Spalte | \`idx_kunden_email\` |
| View | Kleinbuchstaben, beschreibend | \`kunden_umsatz\` |

**Design-Entscheidungen:**

**1. Primärschlüssel: Surrogat vs. Natürlicher Schlüssel**
- **Surrogat:** Künstlicher Schlüssel (id INTEGER AUTOINCREMENT)
  - Vorteil: Unveränderlich, einfach, einheitlich
  - Nachteil: Zusätzliche Spalte
- **Natürlich:** Existierendes Attribut (email, isbn)
  - Vorteil: Keine zusätzliche Spalte, aussagekräftig
  - Nachteil: Kann sich ändern, Datenschutz (DSGVO)

**2. NULL vs. NOT NULL**
- NOT NULL für Pflichtfelder (Name, E-Mail)
- NULL für optionale Felder (Telefon, Beschreibung)
- Niemals NULL für Primärschlüssel!

**3. Datentyp wählen**
- INTEGER für IDs und Zähler
- VARCHAR(n) für Text mit bekannter Maximallänge
- TEXT für lange Texte (Beschreibungen)
- DECIMAL(p,s) für Geldbeträge
- DATE/DATETIME für Datum und Uhrzeit

**4. Normalisierung vor Denormalisierung**
- Erst normalisieren (mindestens 3NF)
- Dann gezielt denormalisieren bei Performance-Problemen`,
            keyTakeaways: [
              "Konsistente Namenskonventionen verwenden (Kleinbuchstaben, snake_case)",
              "Surrogat-Schlüssel (id) bevorzugen",
              "NOT NULL für Pflichtfelder, NULL für optionale Felder",
              "DECIMAL für Geldbeträge, niemals FLOAT",
            ],
          },
        ],
      },
      {
        id: "ddl-fehler",
        title: "Häufige DDL-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "ddl-fehler-liste",
            title: "Die häufigsten DDL-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: Kein Primärschlüssel**
Jede Tabelle braucht einen Primärschlüssel. Ohne ihn kann man Zeilen nicht eindeutig identifizieren.
\`\`\`sql
-- FALSCH
CREATE TABLE kunden (name VARCHAR(100), email VARCHAR(100));

-- RICHTIG
CREATE TABLE kunden (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), email VARCHAR(100));
\`\`\`

---

**Fehler 2: FLOAT für Geldbeträge**
FLOAT hat Rundungsfehler! 0.1 + 0.2 ≠ 0.3 in Gleitkomma-Arithmetik.
\`\`\`sql
-- FALSCH
CREATE TABLE produkte (preis FLOAT);

-- RICHTIG
CREATE TABLE produkte (preis DECIMAL(10,2));
\`\`\`

---

**Fehler 3: Fremdschlüssel ohne Constraints**
Ohne ON DELETE/ON UPDATE können verwaiste Datensätze entstehen.
\`\`\`sql
-- FALSCH (verwaiste Datensätze möglich)
FOREIGN KEY (kunde_id) REFERENCES kunden(id)

-- RICHTIG (mit Löschweitergabe)
FOREIGN KEY (kunde_id) REFERENCES kunden(id) ON DELETE CASCADE
\`\`\`

---

**Fehler 4: Zu breite VARCHAR-Spalten**
\`VARCHAR(9999)\` verschwendet Speicher und erschwert die Validierung.
\`\`\`sql
-- FALSCH
CREATE TABLE kunden (email VARCHAR(9999));

-- RICHTIG
CREATE TABLE kunden (email VARCHAR(255));
\`\`\`

---

**Fehler 5: Fehlende CHECK-Constraints**
Wertebereiche sollten auf Datenbankebene gesichert werden.
\`\`\`sql
-- FALSCH (negative Preise möglich)
CREATE TABLE produkte (preis DECIMAL(10,2));

-- RICHTIG
CREATE TABLE produkte (preis DECIMAL(10,2) CHECK (preis > 0));
\`\`\`

---

**Fehler 6: DROP TABLE ohne IF EXISTS**
\`\`\`sql
-- FALSCH (Fehler wenn Tabelle nicht existiert)
DROP TABLE kunden;

-- RICHTIG
DROP TABLE IF EXISTS kunden;
\`\`\`

---

**Fehler 7: ALTER TABLE ohne Backup**
Tabellenänderungen können Datenverlust verursachen. Immer Backup erstellen!`,
            keyTakeaways: [
              "Immer Primärschlüssel definieren",
              "DECIMAL statt FLOAT für Geldbeträge",
              "ON DELETE/ON UPDATE bei Fremdschlüsseln angeben",
              "CHECK-Constraints für Wertebereiche",
              "DROP TABLE IF EXISTS statt DROP TABLE",
            ],
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
            content: `Subqueries in der WHERE-Klausel sind die häufigste Form von Unterabfragen. Sie filtern Zeilen basierend auf Ergebnissen einer anderen Abfrage — etwa „alle Produkte, die teurer als der Durchschnitt sind" oder „alle Kunden, die etwas bestellt haben". Die innere Abfrage wird zuerst ausgeführt und liefert Werte, die die äußere Abfrage als Filterkriterium verwendet.

**1. Skalar-Subquery (ein einzelner Wert):**
Skalar-Subqueries liefern genau einen Wert und werden mit Vergleichsoperatoren wie =, >, < verwendet. Sie sind besonders nützlich, wenn du einen berechneten Wert als Filter brauchst.

---

\`\`\`sql
-- Produkte, die teurer als der Durchschnitt sind
SELECT name, preis
FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte);
\`\`\`

---

Die innere Abfrage \`SELECT AVG(preis) FROM produkte\` liefert genau einen Wert — den Durchschnittspreis. Die äußere Abfrage vergleicht jeden Preis damit.

**2. Subquery mit IN:**
IN-Subqueries liefern eine Liste von Werten, die die äußere Abfrage als Filter verwendet. Sie sind nützlich, wenn du Zeilen finden willst, die in einer anderen Tabelle existieren.

---

\`\`\`sql
-- Kunden, die etwas bestellt haben
SELECT name FROM kunden
WHERE id IN (SELECT DISTINCT kunde_id FROM bestellungen);

-- Kunden, die NICHTS bestellt haben
SELECT name FROM kunden
WHERE id NOT IN (SELECT DISTINCT kunde_id FROM bestellungen);
\`\`\`

---

**Achtung:** \`NOT IN\` mit NULL-Werten in der Unterabfrage liefert **keine** Ergebnisse! Verwende stattdessen \`NOT EXISTS\`.

**3. Subquery mit Vergleichsoperatoren:**

---

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

---

**4. Subquery in der FROM-Klausel (abgeleitete Tabelle):**

---

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

---

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

---

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

---

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

---

**Wann EXISTS besser ist als IN:**
- Bei großen Unterabfragen (EXISTS bricht ab, sobald ein Match gefunden wird)
- Bei NULL-Werten in der Unterabfrage (NOT IN mit NULL liefert keine Ergebnisse!)
- Bei korrelierten Unterabfragen

**NOT EXISTS — Die sichere Alternative zu NOT IN:**

---

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

---

**EXISTS mit korrelierter Subquery:**

---

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

---

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
      {
        id: "skalar-subqueries",
        title: "Skalar-Subqueries",
        estimatedMinutes: 10,
        sections: [
          {
            id: "skalar-subquery-detail",
            title: "Skalar-Subqueries in WHERE und SELECT",
            sectionType: "theory",
            content: `Eine **Skalar-Subquery** liefert genau einen Wert (eine Zeile, eine Spalte). Sie kann überall verwendet werden, wo ein einzelner Wert erwartet wird.

**In der WHERE-Klausel:**
\`\`\`sql
-- Produkte, die teurer als der Durchschnitt sind
SELECT name, preis
FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte);

-- Kunden mit dem höchsten Umsatz
SELECT name FROM kunden
WHERE id = (
  SELECT kunde_id FROM bestellungen
  GROUP BY kunde_id
  ORDER BY SUM(betrag) DESC
  LIMIT 1
);
\`\`\`

---

**In der SELECT-Klausel:**
\`\`\`sql
-- Jedes Produkt mit dem Durchschnittspreis zum Vergleich
SELECT name, preis,
  (SELECT AVG(preis) FROM produkte) AS durchschnitt,
  preis - (SELECT AVG(preis) FROM produkte) AS differenz
FROM produkte;
\`\`\`

---

**In der HAVING-Klausel:**
\`\`\`sql
-- Kategorien mit überdurchschnittlichem Preis
SELECT kategorie, AVG(preis) AS avg_preis
FROM produkte
GROUP BY kategorie
HAVING AVG(preis) > (SELECT AVG(preis) FROM produkte);
\`\`\`

---

**Wichtig:** Eine Skalar-Subquery MUSS genau einen Wert zurückgeben. Wenn sie keine Zeile liefert, ist das Ergebnis NULL. Wenn sie mehrere Zeilen liefert, gibt es einen Fehler.`,
            keyTakeaways: [
              "Skalar-Subquery: Liefert genau einen Wert",
              "Verwendbar in WHERE, SELECT, HAVING",
              "MUSS genau eine Zeile und eine Spalte zurückgeben",
              "Leere Ergebnismenge → NULL, mehrere Zeilen → Fehler",
            ],
          },
        ],
      },
      {
        id: "subquery-in-from",
        title: "Abgeleitete Tabellen (Subqueries in FROM)",
        estimatedMinutes: 10,
        sections: [
          {
            id: "derived-tables",
            title: "Abgeleitete Tabellen",
            sectionType: "theory",
            content: `Eine **abgeleitete Tabelle** (Derived Table) ist eine Subquery in der FROM-Klausel. Sie wird wie eine temporäre Tabelle behandelt, die nur für die Dauer der Abfrage existiert. Abgeleitete Tabellen sind nützlich, wenn du Zwischenergebnisse brauchst, die du dann weiter filtern oder mit anderen Tabellen verknüpfen willst.

**Grundprinzip:** Die innere Abfrage erzeugt eine Ergebnismenge, die die äußere Abfrage wie eine normale Tabelle verwenden kann. Das Ergebnis der inneren Abfrage wird materialisiert — es wird also tatsächlich als temporäre Tabelle im Speicher erstellt.

---

\`\`\`sql
-- Durchschnittspreis pro Kategorie, gefiltert nach Kategorien mit >5 Produkten
SELECT kategorie, avg_preis
FROM (
  SELECT kategorie, AVG(preis) AS avg_preis, COUNT(*) AS anzahl
  FROM produkte
  GROUP BY kategorie
) AS kategorie_stats
WHERE anzahl > 5;
\`\`\`

---

Ohne die abgeleitete Tabelle könntest du nicht nach \`anzahl\` filtern, weil Aggregatfunktionen in der WHERE-Klausel nicht erlaubt sind. Die abgeleitete Tabelle löst dieses Problem, indem sie die Aggregation zuerst durchführt und das Ergebnis als Tabelle zur Verfügung stellt.

**Wichtig:** Jede abgeleitete Tabelle MUSS einen Alias haben!

---

\`\`\`sql
-- FALSCH: Ohne Alias
SELECT * FROM (SELECT kategorie, AVG(preis) FROM produkte GROUP BY kategorie);

-- RICHTIG: Mit Alias
SELECT * FROM (SELECT kategorie, AVG(preis) FROM produkte GROUP BY kategorie) AS stats;
\`\`\`

---

**Praktisches Beispiel — Top-Kunden:**
\`\`\`sql
SELECT k.name, ku.gesamtumsatz
FROM kunden k
JOIN (
  SELECT kunde_id, SUM(betrag) AS gesamtumsatz
  FROM bestellungen
  GROUP BY kunde_id
) AS ku ON k.id = ku.kunde_id
WHERE ku.gesamtumsatz > 1000
ORDER BY ku.gesamtumsatz DESC;
\`\`\`

---

**Abgeleitete Tabellen vs. CTEs:**
- Abgeleitete Tabelle: Inline in der FROM-Klausel, nicht wiederverwendbar
- CTE: Mit WITH definiert, lesbarer und wiederverwendbar

Beide liefern dasselbe Ergebnis, aber CTEs sind bei komplexen Abfragen vorzuziehen.`,
            keyTakeaways: [
              "Abgeleitete Tabelle = Subquery in der FROM-Klausel",
              "MUSS immer einen Alias haben (AS name)",
              "Wird wie eine temporäre Tabelle behandelt",
              "CTEs sind oft lesbarer als abgeleitete Tabellen",
            ],
          },
        ],
      },
      {
        id: "subquery-in-select",
        title: "Korrelierte Subqueries in SELECT",
        estimatedMinutes: 10,
        sections: [
          {
            id: "correlated-select",
            title: "Korrelierte Subqueries in der SELECT-Klausel",
            sectionType: "example",
            content: `Korrelierte Subqueries in der SELECT-Klausel berechnen einen Wert für jede Zeile der äußeren Abfrage.

**Beispiel: Anteil am Gesamtpreis**
\`\`\`sql
SELECT name, preis,
  ROUND(preis * 100.0 / (SELECT SUM(preis) FROM produkte), 1) AS anteil_prozent
FROM produkte;
\`\`\`

---

**Beispiel: Rang innerhalb der Kategorie**
\`\`\`sql
SELECT p.name, p.kategorie, p.preis,
  (SELECT COUNT(*) FROM produkte p2
   WHERE p2.kategorie = p.kategorie AND p2.preis > p.preis) + 1 AS rang
FROM produkte p
ORDER BY kategorie, rang;
\`\`\`

---

**Beispiel: Letzte Bestellung pro Kunde**
\`\`\`sql
SELECT k.name,
  (SELECT MAX(b.datum) FROM bestellungen b WHERE b.kunde_id = k.id) AS letzte_bestellung
FROM kunden k;
\`\`\`

---

**Performance-Hinweis:** Korrelierte Subqueries in der SELECT-Klausel werden für JEDZE Zeile der äußeren Abfrage ausgeführt. Bei großen Tabellen kann das sehr langsam sein. In solchen Fällen ist ein JOIN oder eine Window Function oft schneller.

**Alternative mit LEFT JOIN (schneller):**
\`\`\`sql
SELECT k.name, MAX(b.datum) AS letzte_bestellung
FROM kunden k
LEFT JOIN bestellungen b ON k.id = b.kunde_id
GROUP BY k.name;
\`\`\``,
            keyTakeaways: [
              "Korrelierte Subqueries in SELECT berechnen einen Wert pro Zeile",
              "Werden für jede Zeile der äußeren Abfrage ausgeführt",
              "Performance: Können langsam sein bei großen Tabellen",
              "Alternative: JOIN oder Window Function oft schneller",
            ],
          },
        ],
      },
      {
        id: "subquery-mit-any-all",
        title: "ANY und ALL mit Subqueries",
        estimatedMinutes: 8,
        sections: [
          {
            id: "any-all",
            title: "ANY und ALL — Vergleich mit Mengen",
            sectionType: "theory",
            content: `**ANY** und **ALL** vergleichen einen Wert mit allen Werten einer Subquery.

**ANY — Mindestens ein Wert muss die Bedingung erfüllen:**
\`\`\`sql
-- Produkte, die teurer sind als MINDESTENS ein Produkt in 'Elektronik'
SELECT name, preis FROM produkte
WHERE preis > ANY (SELECT preis FROM produkte WHERE kategorie = 'Elektronik');

-- Entspricht: preis > (SELECT MIN(preis) FROM produkte WHERE kategorie = 'Elektronik')
\`\`\`

---

**ALL — Alle Werte müssen die Bedingung erfüllen:**
\`\`\`sql
-- Produkte, die teurer sind als ALLE Produkte in 'Buch'
SELECT name, preis FROM produkte
WHERE preis > ALL (SELECT preis FROM produkte WHERE kategorie = 'Buch');

-- Entspricht: preis > (SELECT MAX(preis) FROM produkte WHERE kategorie = 'Buch')
\`\`\`

---

**Vergleich:**

| Operator | Bedeutung | Entspricht |
|----------|-----------|-----------|
| > ANY (...) | Größer als mindestens einer | > MIN(...) |
| > ALL (...) | Größer als alle | > MAX(...) |
| < ANY (...) | Kleiner als mindestens einer | < MAX(...) |
| < ALL (...) | Kleiner als alle | < MIN(...) |
| = ANY (...) | Gleich einem | IN (...) |

**Praktisches Beispiel — Top-Produkte:**
\`\`\`sql
-- Produkte, die teurer sind als alle Produkte der Kategorie 'Buch'
SELECT name, preis FROM produkte
WHERE preis > ALL (SELECT preis FROM produkte WHERE kategorie = 'Buch');
\`\`\`

---

**Hinweis:** ANY und ALL sind selten und können oft durch MIN/MAX-Subqueries oder JOINs ersetzt werden, die lesbarer sind.`,
            keyTakeaways: [
              "ANY: Mindestens ein Wert muss die Bedingung erfüllen",
              "ALL: Alle Werte müssen die Bedingung erfüllen",
              "> ANY = > MIN, > ALL = > MAX",
              "= ANY ist dasselbe wie IN",
              "Oft lesbarer mit MIN/MAX-Subqueries statt ANY/ALL",
            ],
          },
        ],
      },
      {
        id: "exists-vs-in",
        title: "EXISTS vs. IN — Performance und Semantik",
        estimatedMinutes: 10,
        sections: [
          {
            id: "exists-in-vergleich",
            title: "EXISTS vs. IN — Wann was verwenden?",
            sectionType: "theory",
            content: `**IN** und **EXISTS** können oft dasselbe Ergebnis liefern, unterscheiden sich aber in Performance und Semantik.

**IN — Prüft auf Mitgliedschaft in einer Menge:**
\`\`\`sql
SELECT name FROM kunden
WHERE id IN (SELECT kunde_id FROM bestellungen);
\`\`\`

---

**EXISTS — Prüft auf Existenz mindestens einer Zeile:**
\`\`\`sql
SELECT k.name FROM kunden k
WHERE EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id);
\`\`\`

---

**Wann EXISTS besser ist:**
1. **Große Unterabfragen:** EXISTS bricht nach dem ersten Match ab
2. **NULL-Werte:** NOT EXISTS ist sicherer als NOT IN
3. **Korrelierte Unterabfragen:** EXISTS ist natürlicher

**Wann IN besser ist:**
1. **Kleine Unterabfragen:** IN ist einfacher zu lesen
2. **Nicht-korrelierte Unterabfragen:** IN kann effizienter sein
3. **Einfache Mitgliedschaftsprüfung:** IN ist intuitiver

**NOT IN vs. NOT EXISTS — Der NULL-Falle:**
\`\`\`sql
-- GEFAHRLICH: NOT IN mit NULL
SELECT name FROM kunden
WHERE id NOT IN (SELECT kunde_id FROM bestellungen);
-- Wenn kunde_id NULL enthält, liefert das KEINE Ergebnisse!

-- SICHER: NOT EXISTS
SELECT k.name FROM kunden k
WHERE NOT EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id);
-- Funktioniert korrekt, auch mit NULL-Werten
\`\`\`

---

**Performance-Regel:**
- Kleine äußere Tabelle, große innere Tabelle → EXISTS
- Große äußere Tabelle, kleine innere Tabelle → IN
- Im Zweifel: Beide testen und mit EXPLAIN vergleichen`,
            keyTakeaways: [
              "IN: Prüft Mitgliedschaft in einer Menge",
              "EXISTS: Prüft Existenz mindestens einer Zeile",
              "NOT EXISTS ist sicherer als NOT IN (kein NULL-Problem)",
              "EXISTS bricht nach dem ersten Match ab — oft schneller",
            ],
          },
        ],
      },
      {
        id: "verschachtelte-subqueries",
        title: "Verschachtelte Subqueries",
        estimatedMinutes: 10,
        sections: [
          {
            id: "nested-subqueries",
            title: "Subqueries in Subqueries",
            sectionType: "example",
            content: `Subqueries können verschachtelt werden — eine Subquery kann eine weitere Subquery enthalten.

**Beispiel: Produkte, die teurer als der Durchschnitt der teuersten Kategorie sind**
\`\`\`sql
SELECT name, preis FROM produkte
WHERE preis > (
  -- Durchschnittspreis der teuersten Kategorie
  SELECT AVG(preis) FROM produkte
  WHERE kategorie = (
    -- Kategorie mit dem höchsten Durchschnittspreis
    SELECT kategorie FROM produkte
    GROUP BY kategorie
    ORDER BY AVG(preis) DESC
    LIMIT 1
  )
);
\`\`\`

---

**Beispiel: Kunden mit überdurchschnittlichen Bestellungen**
\`\`\`sql
SELECT k.name FROM kunden k
WHERE k.id IN (
  -- Kunden-IDs mit hohem Umsatz
  SELECT kunde_id FROM bestellungen
  WHERE betrag > (
    -- Durchschnittlicher Bestellwert
    SELECT AVG(betrag) FROM bestellungen
  )
);
\`\`\`

---

**Wann verschachtelte Subqueries sinnvoll sind:**
- Wenn die Logik von innen nach außen natürlich ist
- Wenn Zwischenergebnisse nicht wiederverwendet werden

**Wann CTEs besser sind:**
- Wenn die Abfrage mehr als 2 Ebenen tief ist
- Wenn Zwischenergebnisse wiederverwendet werden
- Wenn die Lesbarkeit leidet

**Dasselbe mit CTE (lesbarer):**
\`\`\`sql
WITH durchschnittspreis AS (
  SELECT AVG(preis) AS avg_preis FROM produkte
),
teuerste_kategorie AS (
  SELECT kategorie FROM produkte
  GROUP BY kategorie
  ORDER BY AVG(preis) DESC
  LIMIT 1
)
SELECT name, preis FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte WHERE kategorie = (SELECT kategorie FROM teuerste_kategorie));
\`\`\``,
            keyTakeaways: [
              "Subqueries können verschachtelt werden (Subquery in Subquery)",
              "Mehr als 2 Ebenen werden schnell unlesbar",
              "CTEs sind bei tiefer Verschachtelung die bessere Alternative",
              "Verschachtelte Subqueries von innen nach außen lesen",
            ],
          },
        ],
      },
      {
        id: "subquery-vs-join",
        title: "Subquery vs. JOIN — Wann was verwenden?",
        estimatedMinutes: 10,
        sections: [
          {
            id: "subquery-join-entscheidung",
            title: "Entscheidungshilfe: Subquery oder JOIN?",
            sectionType: "theory",
            content: `Oft kann man dieselbe Aufgabe mit einer Subquery oder einem JOIN lösen. Hier ist eine Entscheidungshilfe:

**Subquery verwenden, wenn:**
- Nur geprüft werden soll, ob etwas existiert (EXISTS)
- Ein einzelner Wert als Filter benötigt wird
- Die Logik von innen nach außen natürlich ist
- Das Ergebnis keine Spalten aus der Unterabfrage enthält

**JOIN verwenden, wenn:**
- Spalten aus mehreren Tabellen im Ergebnis benötigt werden
- Die Abfrage lesbarer als JOIN ist
- Performance wichtig ist (JOINs sind oft schneller)

**Entscheidungsmatrix:**

| Aufgabe | Besser mit | Alternative |
|--------|-----------|-------------|
| Daten aus 2+ Tabellen anzeigen | JOIN | — |
| Existenz prüfen | EXISTS | LEFT JOIN + IS NULL |
| Nicht-Existenz prüfen | NOT EXISTS | LEFT JOIN + IS NULL |
| Einzelnen Wert filtern | Skalar-Subquery | JOIN mit Aggregation |
| Top-N pro Gruppe | Window Function | Korrelierte Subquery |
| Menge filtern | IN-Subquery | JOIN |

**Beispiel — Dasselbe mit Subquery und JOIN:**



\`\`\`sql
-- Mit Subquery: Kunden mit Bestellungen
SELECT name FROM kunden
WHERE id IN (SELECT kunde_id FROM bestellungen);

-- Mit JOIN: Dasselbe Ergebnis
SELECT DISTINCT k.name FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id;
\`\`\`

---

**Performance-Tipp:** Der Query-Optimizer kann oft Subqueries in JOINs umschreiben. Bei großen Tabellen sollte man beide Varianten mit EXPLAIN vergleichen.`,
            keyTakeaways: [
              "Subquery: Wenn nur Existenz oder ein einzelner Wert geprüft wird",
              "JOIN: Wenn Spalten aus mehreren Tabellen benötigt werden",
              "EXISTS/NOT EXISTS für Existenzprüfungen",
              "Bei Performance-Zweifeln: EXPLAIN nutzen und vergleichen",
            ],
          },
        ],
      },
      {
        id: "subquery-fehler",
        title: "Häufige Subquery-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "subquery-fehler-liste",
            title: "Die häufigsten Subquery-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: Skalar-Subquery liefert mehrere Zeilen**
\`\`\`sql
-- FALSCH: Subquery kann mehrere Zeilen zurückgeben
SELECT name FROM produkte
WHERE preis > (SELECT preis FROM produkte WHERE kategorie = 'Elektronik');
-- Fehler: Subquery liefert mehrere Zeilen, aber Skalarwert erwartet

-- RICHTIG: Aggregatfunktion verwenden
SELECT name FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte WHERE kategorie = 'Elektronik');

-- ODER: ANY/ALL verwenden
SELECT name FROM produkte
WHERE preis > ALL (SELECT preis FROM produkte WHERE kategorie = 'Elektronik');
\`\`\`

---

**Fehler 2: NOT IN mit NULL**
\`\`\`sql
-- FALSCH: Liefert KEINE Ergebnisse wenn kunde_id NULL enthält
SELECT name FROM kunden
WHERE id NOT IN (SELECT kunde_id FROM bestellungen WHERE kunde_id IS NOT NULL);

-- RICHTIG: NOT EXISTS verwenden
SELECT k.name FROM kunden k
WHERE NOT EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id);
\`\`\`

---

**Fehler 3: Fehlender Alias bei abgeleiteter Tabelle**
\`\`\`sql
-- FALSCH: Ohne Alias
SELECT * FROM (SELECT kategorie, AVG(preis) FROM produkte GROUP BY kategorie);

-- RICHTIG: Mit Alias
SELECT * FROM (SELECT kategorie, AVG(preis) FROM produkte GROUP BY kategorie) AS stats;
\`\`\`

---

**Fehler 4: Korrelierte Subquery in WHERE statt JOIN**
\`\`\`sql
-- LANGSAM: Korrelierte Subquery
SELECT name FROM produkte p
WHERE kategorie_id IN (SELECT id FROM kategorien WHERE name = 'Elektronik');

-- SCHNELLER: JOIN
SELECT p.name FROM produkte p
JOIN kategorien k ON p.kategorie_id = k.id
WHERE k.name = 'Elektronik';
\`\`\`

---

**Fehler 5: Subquery in GROUP BY**
Nach GROUP BY dürfen nur GROUP BY-Spalten und Aggregatfunktionen im SELECT stehen. Subqueries im SELECT, die nicht aggregiert sind, verursachen Fehler.`,
            keyTakeaways: [
              "Skalar-Subquery MUSS genau einen Wert zurückgeben",
              "NOT IN mit NULL ist gefährlich — NOT EXISTS verwenden",
              "Abgeleitete Tabellen brauchen immer einen Alias",
              "Korrelierte Subqueries können langsam sein — JOIN prüfen",
              "Subqueries in GROUP BY beachten die gleichen Regeln wie Spalten",
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

---

**Variante 2: Alle Spalten (Reihenfolge muss stimmen)**
\`\`\`sql
INSERT INTO tabelle VALUES (wert1, wert2, wert3);
\`\`\`

---

**Variante 3: Mehrere Zeilen gleichzeitig**
\`\`\`sql
INSERT INTO tabelle (spalte1, spalte2)
VALUES
  (wert1a, wert2a),
  (wert1b, wert2b),
  (wert1c, wert2c);
\`\`\`

---

**Variante 4: Aus einer Abfrage**
\`\`\`sql
INSERT INTO tabelle (spalte1, spalte2)
SELECT spalte1, spalte2 FROM andere_tabelle;
\`\`\`

---

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

---

\`\`\`sql
-- Mit Spaltennamen (Best Practice)
INSERT INTO kunden (vorname, nachname, email)
VALUES ('Anna', 'Müller', 'anna@beispiel.de');

-- Ohne Spaltennamen (Reihenfolge muss stimmen!)
INSERT INTO kunden VALUES (1, 'Anna', 'Müller', 'anna@beispiel.de', NULL);
\`\`\`

---

**2. Mehrere Zeilen gleichzeitig:**

---

\`\`\`sql
INSERT INTO kunden (vorname, nachname, email)
VALUES
  ('Ben', 'Schmidt', 'ben@beispiel.de'),
  ('Clara', 'Weber', 'clara@beispiel.de'),
  ('David', 'Klein', 'david@beispiel.de');
\`\`\`

---

**3. Daten aus einer anderen Tabelle kopieren:**

---

\`\`\`sql
-- Alle Kunden aus bestellungen übernehmen, die noch nicht in kunden stehen
INSERT INTO kunden (vorname, nachname, email)
SELECT vorname, nachname, email
FROM bestellungen_Import
WHERE email NOT IN (SELECT email FROM kunden);
\`\`\`

---

**4. DEFAULT-Werte und NULL:**

---

\`\`\`sql
-- Spalten mit DEFAULT können weggelassen werden
INSERT INTO produkte (name, preis)
VALUES ('Neues Produkt', 29.99);
-- erstellt_am wird automatisch auf CURRENT_TIMESTAMP gesetzt

-- Explizit NULL setzen
INSERT INTO kunden (vorname, nachname, email, telefon)
VALUES ('Eva', 'Braun', 'eva@beispiel.de', NULL);
\`\`\`

---

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
            content: `**UPDATE** ändert bestehende Zeilen in einer Tabelle. Es ist eines der wichtigsten DML-Statements und gleichzeitig eines der gefährlichsten: Ein UPDATE ohne WHERE-Klausel ändert **alle** Zeilen der Tabelle — ein Fehler, der sich nicht ohne Backup rückgängig machen lässt.

---

\`\`\`sql
UPDATE tabelle
SET spalte1 = wert1, spalte2 = wert2
WHERE bedingung;
\`\`\`

---

**WICHTIG:** Ohne WHERE-Klausel werden **ALLE** Zeilen aktualisiert! Mache immer zuerst ein SELECT mit derselben WHERE-Klausel, um zu prüfen, welche Zeilen betroffen sind, bevor du das UPDATE ausführst.

**Beispiele:**
\`\`\`sql
-- Einen bestimmten Kunden aktualisieren
UPDATE kunden SET email = 'neu@mail.de' WHERE id = 1;

-- Alle Preise um 10% erhoehen
UPDATE produkte SET preis = preis * 1.10;
\`\`\`

---

**UPDATE mit Unterabfrage:**
Du kannst UPDATE auch mit einer Unterabfrage kombinieren, um Werte aus einer anderen Tabelle zu übernehmen:

---

\`\`\`sql
-- Preis aktualisieren basierend auf dem Durchschnitt der Kategorie
UPDATE produkte
SET preis = (SELECT AVG(preis) FROM produkte p2 WHERE p2.kategorie = produkte.kategorie)
WHERE preis IS NULL;
\`\`\`

---

**Best Practices für UPDATE:**
1. Immer WHERE-Klausel verwenden — sonst werden alle Zeilen geändert
2. Vor dem UPDATE ein SELECT mit derselben WHERE-Klausel ausführen
3. Bei kritischen Updates: In einer Transaktion arbeiten (BEGIN/COMMIT/ROLLBACK)
4. LIMIT in SQLite nicht direkt mit UPDATE kombinierbar — stattdessen Unterabfrage verwenden`,
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
            content: `**DELETE** löscht Zeilen aus einer Tabelle. Wie bei UPDATE ist die WHERE-Klausel entscheidend: Ohne sie werden **alle** Zeilen gelöscht — die Tabelle bleibt bestehen, aber sie ist leer. Das ist ein häufiger Fehler, der sich nur mit einem Backup rückgängig machen lässt.

---

\`\`\`sql
-- Bestimmte Zeilen löschen
DELETE FROM bestellungen WHERE status = 'storniert';

-- Alle Zeilen einer Tabelle löschen (Tabelle bleibt bestehen!)
DELETE FROM bestellungen;
\`\`\`

---

**WICHTIG:** Ohne WHERE-Klausel werden **ALLE** Zeilen gelöscht! Führe immer zuerst ein SELECT mit derselben WHERE-Klausel aus, um zu prüfen, welche Zeilen gelöscht werden.

**DELETE vs. TRUNCATE vs. DROP — drei Arten, Daten zu entfernen:**

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

---

\`\`\`sql
-- Alle Bestellungen von Kunden, die seit über 2 Jahren inaktiv sind
DELETE FROM bestellungen
WHERE kunde_id IN (
  SELECT id FROM kunden
  WHERE letzter_login < DATE('now', '-2 years')
);
\`\`\`

---

**Tipp:** Vor dem Löschen immer zuerst ein SELECT mit derselben WHERE-Klausel ausführen, um zu prüfen, welche Zeilen betroffen sind:

---

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
      {
        id: "insert-mehrere-zeilen",
        title: "Mehrere Zeilen einfügen und INSERT ... SELECT",
        estimatedMinutes: 10,
        sections: [
          {
            id: "batch-insert",
            title: "Batch-Inserts und INSERT ... SELECT",
            sectionType: "theory",
            content: `**Mehrere Zeilen mit einem INSERT einfügen:**
\`\`\`sql
-- Mehrere Zeilen gleichzeitig (effizienter als einzelne INSERTs)
INSERT INTO kunden (name, email) VALUES
  ('Anna', 'anna@beispiel.de'),
  ('Ben', 'ben@beispiel.de'),
  ('Clara', 'clara@beispiel.de');
\`\`\`

---

**INSERT ... SELECT — Daten aus einer anderen Tabelle kopieren:**
\`\`\`sql
-- Alle Kunden aus der Import-Tabelle übernehmen
INSERT INTO kunden (name, email)
SELECT name, email FROM kunden_import
WHERE email NOT IN (SELECT email FROM kunden);

-- Archiv-Tabelle befüllen
INSERT INTO bestellungen_archiv
SELECT * FROM bestellungen
WHERE datum < DATE('now', '-1 year');
\`\`\`

---

**INSERT ... SELECT mit Aggregation:**
\`\`\`sql
-- Zusammenfassungstabelle befüllen
INSERT INTO kunden_umsatz (kunde_id, gesamtumsatz, anzahl_bestellungen)
SELECT kunde_id, SUM(betrag), COUNT(*)
FROM bestellungen
GROUP BY kunde_id;
\`\`\`

---

**Performance-Tipps:**
- Batch-Inserts sind deutlich schneller als einzelne INSERTs
- Bei sehr großen Datenmengen: In Batches von 100-1000 Zeilen aufteilen
- Transaktionen verwenden: \`BEGIN; INSERT...; INSERT...; COMMIT;\`
- Indizes vor dem Bulk-Insert deaktivieren und danach reaktivieren`,
            keyTakeaways: [
              "Batch-Inserts: Mehrere Zeilen mit einem INSERT sind effizienter",
              "INSERT ... SELECT: Daten aus einer anderen Tabelle kopieren",
              "Transaktionen für mehrere INSERTs verwenden",
              "Bei großen Datenmengen: Indizes vorübergehend deaktivieren",
            ],
          },
        ],
      },
      {
        id: "update-mit-join",
        title: "UPDATE mit JOIN und Unterabfragen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "update-join",
            title: "UPDATE mit Unterabfragen",
            sectionType: "theory",
            content: `**UPDATE mit Skalar-Subquery:**
\`\`\`sql
-- Produktpreise um 10% erhöhen, wenn die Kategorie 'Elektronik' ist
UPDATE produkte
SET preis = preis * 1.10
WHERE kategorie_id = (SELECT id FROM kategorien WHERE name = 'Elektronik');
\`\`\`

---

**UPDATE mit korrelierter Subquery:**
\`\`\`sql
-- Rabatt auf 0 setzen für Kunden ohne Bestellungen
UPDATE kunden
SET rabatt = 0
WHERE NOT EXISTS (
  SELECT 1 FROM bestellungen WHERE kunde_id = kunden.id
);
\`\`\`

---

**UPDATE mit berechnetem Wert:**
\`\`\`sql
-- Gesamtbetrag einer Bestellung aktualisieren
UPDATE bestellungen
SET gesamtbetrag = (
  SELECT SUM(menge * einzelpreis)
  FROM bestellpositionen
  WHERE bestellung_id = bestellungen.id
);
\`\`\`

---

**UPDATE mit CASE:**
\`\`\`sql
-- Rabatt basierend auf Kundentyp aktualisieren
UPDATE kunden
SET rabatt = CASE
  WHEN kundentyp = 'premium' THEN 0.15
  WHEN kundentyp = 'standard' THEN 0.05
  ELSE 0
END;
\`\`\`

---

**SQLite-Besonderheit:** SQLite unterstützt kein \`UPDATE ... JOIN\`. Stattdessen muss man korrelierte Subqueries verwenden.

**Sicherheitstipp:** Immer zuerst ein SELECT mit derselben WHERE-Klausel ausführen, um zu prüfen, welche Zeilen betroffen sind!`,
            keyTakeaways: [
              "UPDATE mit Subquery: Skalar-Subquery in SET oder WHERE",
              "Korrelierte Subquery: Für jede Zeile einzeln ausgewertet",
              "SQLite: Kein UPDATE ... JOIN — Subqueries verwenden",
              "IMMER zuerst SELECT prüfen, dann UPDATE ausführen",
            ],
          },
        ],
      },
      {
        id: "delete-mit-subquery",
        title: "DELETE mit Unterabfragen",
        estimatedMinutes: 8,
        sections: [
          {
            id: "delete-subquery",
            title: "DELETE mit Unterabfragen",
            sectionType: "example",
            content: `**DELETE mit Skalar-Subquery:**
\`\`\`sql
-- Alle Bestellungen von inaktiven Kunden löschen
DELETE FROM bestellungen
WHERE kunde_id IN (
  SELECT id FROM kunden WHERE status = 'inaktiv'
);
\`\`\`

---

**DELETE mit NOT EXISTS:**
\`\`\`sql
-- Produkte löschen, die nie bestellt wurden
DELETE FROM produkte
WHERE NOT EXISTS (
  SELECT 1 FROM bestellpositionen bp
  WHERE bp.produkt_id = produkte.id
);
\`\`\`

---

**DELETE mit korrelierter Subquery:**
\`\`\`sql
-- Alle Bestellungen löschen, deren Betrag unter dem Durchschnitt liegt
DELETE FROM bestellungen
WHERE betrag < (SELECT AVG(betrag) FROM bestellungen);
\`\`\`

---

**Sicheres Löschen in 3 Schritten:**
\`\`\`sql
-- 1. Prüfen: Welche Zeilen werden gelöscht?
SELECT * FROM bestellungen WHERE status = 'storniert';

-- 2. In einer Transaktion löschen
BEGIN;
DELETE FROM bestellungen WHERE status = 'storniert';
-- 3. Bei Fehler: ROLLBACK; Bei Erfolg: COMMIT;
COMMIT;
\`\`\`

---

**Wichtig:** DELETE mit Subquery kann langsam sein, wenn die Unterabfrage viele Zeilen zurückgibt. Bei großen Datenmengen kann es effizienter sein, die zu behaltenden Zeilen in eine neue Tabelle zu kopieren und die alte zu löschen.`,
            keyTakeaways: [
              "DELETE mit IN-Subquery: Zeilen basierend auf einer anderen Tabelle löschen",
              "DELETE mit NOT EXISTS: Zeilen ohne Referenz löschen",
              "Immer in Transaktionen löschen (BEGIN/COMMIT/ROLLBACK)",
              "Vor dem DELETE: SELECT mit derselben WHERE-Klausel ausführen",
            ],
          },
        ],
      },
      {
        id: "upsert",
        title: "INSERT ... ON CONFLICT (UPSERT)",
        estimatedMinutes: 10,
        sections: [
          {
            id: "upsert-sqlite",
            title: "UPSERT in SQLite",
            sectionType: "theory",
            content: `**UPSERT** (UPDATE or INSERT) fügt eine Zeile ein oder aktualisiert sie, wenn sie bereits existiert.

---

\`\`\`sql
-- SQLite UPSERT (ab 3.24.0)
INSERT INTO kunden (id, name, email)
VALUES (1, 'Anna', 'anna@neu.de')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  email = excluded.email;
\`\`\`

---

**Wie es funktioniert:**
1. Versuche INSERT
2. Wenn UNIQUE- oder PRIMARY KEY-Constraint verletzt wird → UPDATE statt Fehler
3. \`excluded\` referenziert die neuen Werte aus dem INSERT

**Beispiel — Produkt-Preis aktualisieren oder einfügen:**
\`\`\`sql
INSERT INTO produkte (id, name, preis)
VALUES (1, 'Laptop', 999.99)
ON CONFLICT(id) DO UPDATE SET
  preis = excluded.preis;
\`\`\`

---

**Beispiel — Nur bestimmte Spalten aktualisieren:**
\`\`\`sql
-- Nur den Preis aktualisieren, Name bleibt unverändert
INSERT INTO produkte (id, name, preis)
VALUES (1, 'Laptop', 899.99)
ON CONFLICT(id) DO UPDATE SET
  preis = excluded.preis;
-- name wird NICHT aktualisiert!
\`\`\`

---

**ON CONFLICT DO NOTHING — Einfügen oder ignorieren:**
\`\`\`sql
-- Einfügen, aber bei Konflikt einfach ignorieren (kein Fehler, kein Update)
INSERT INTO kunden (id, name, email)
VALUES (1, 'Anna', 'anna@beispiel.de')
ON CONFLICT(id) DO NOTHING;
\`\`\`

---

**Alternative (älteres SQLite): INSERT OR REPLACE:**
\`\`\`sql
-- ACHTUNG: Löscht die alte Zeile und fügt eine neue ein!
-- Alle nicht angegebenen Spalten werden auf NULL/DEFAULT gesetzt
INSERT OR REPLACE INTO kunden (id, name)
VALUES (1, 'Anna Updated');
-- email wird NULL! Vorherige Werte gehen verloren!
\`\`\`

---

**Empfehlung:** \`ON CONFLICT DO UPDATE\` statt \`INSERT OR REPLACE\` verwenden, da letzteres die gesamte Zeile ersetzt.`,
            keyTakeaways: [
              "UPSERT: Einfügen oder Aktualisieren bei Konflikt",
              "ON CONFLICT(column) DO UPDATE SET ... = excluded.spalte",
              "excluded referenziert die neuen Werte aus dem INSERT",
              "ON CONFLICT DO NOTHING: Bei Konflikt ignorieren",
              "INSERT OR REPLACE ist gefährlich (ersetzt gesamte Zeile!)",
            ],
          },
        ],
      },
      {
        id: "transaktionen-grundlagen",
        title: "Transaktionsgrundlagen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "transaktionen",
            title: "BEGIN, COMMIT und ROLLBACK",
            sectionType: "theory",
            content: `Eine **Transaktion** ist eine Folge von SQL-Operationen, die als eine atomare Einheit ausgeführt werden — entweder alle oder keine.

---

\`\`\`sql
-- Transaktion starten
BEGIN;

-- Geld überweisen: Konto A abbuchen
UPDATE konto SET saldo = saldo - 100 WHERE id = 1;

-- Geld überweisen: Konto B gutschreiben
UPDATE konto SET saldo = saldo + 100 WHERE id = 2;

-- Alles OK? → Änderungen speichern
COMMIT;

-- Fehler aufgetreten? → Änderungen rückgängig machen
-- ROLLBACK;
\`\`\`

---

**ACID-Prinzipien:**

| Eigenschaft | Bedeutung | Beispiel |
|-------------|-----------|----------|
| **A**tomicity | Alles oder nichts | Überweisung komplett oder gar nicht |
| **C**onsistency | Datenbank bleibt konsistent | Saldo-Summe bleibt gleich |
| **I**solation | Transaktionen stören sich nicht | Gleichzeitige Überweisungen |
| **D**urability | Gespeicherte Daten gehen nicht verloren | COMMIT überlebt Stromausfall |

**Wann Transaktionen verwenden:**
- Mehrere zusammenhängende INSERT/UPDATE/DELETE
- Geldtransaktionen, Bestellungen, Reservierungen
- Wenn Datenkonsistenz wichtig ist

**Autocommit-Modus:**
Ohne \`BEGIN\` ist SQLite im Autocommit-Modus: Jedes SQL-Statement wird sofort committet. Mit \`BEGIN\` wird der Autocommit-Modus deaktiviert, bis \`COMMIT\` oder \`ROLLBACK\` aufgerufen wird.`,
            keyTakeaways: [
              "Transaktion: Atomare Einheit — alles oder nichts",
              "BEGIN: Transaktion starten",
              "COMMIT: Änderungen speichern",
              "ROLLBACK: Änderungen rückgängig machen",
              "ACID: Atomicity, Consistency, Isolation, Durability",
            ],
          },
        ],
      },
      {
        id: "transaktionen-isolation",
        title: "Isolationslevel und ACID",
        estimatedMinutes: 10,
        sections: [
          {
            id: "isolation-levels",
            title: "Isolationslevel und Anomalien",
            sectionType: "theory",
            content: `**Isolationslevel** bestimmen, wie stark sich gleichzeitige Transaktionen beeinflussen.

**Mögliche Anomalien bei gleichzeitigen Transaktionen:**

| Anomalie | Beschreibung | Beispiel |
|----------|-------------|----------|
| Dirty Read | Unverbindliche Daten einer anderen Transaktion lesen | T1 liest T2's uncommitted Änderung |
| Non-Repeatable Read | Dasselbe SELECT liefert unterschiedliche Ergebnisse | T1 liest, T2 ändert, T1 liest wieder |
| Phantom Read | Neue Zeilen tauchen in wiederholtem SELECT auf | T1 liest, T2 fügt ein, T1 liest wieder |

**Isolationslevel (SQL-Standard):**

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-----------|---------------------|-------------|
| READ UNCOMMITTED | Ja | Ja | Ja |
| READ COMMITTED | Nein | Ja | Ja |
| REPEATABLE READ | Nein | Nein | Ja |
| SERIALIZABLE | Nein | Nein | Nein |

**SQLite-Besonderheit:**
SQLite unterstützt nur **SERIALIZABLE** (strengstes Level). Das bedeutet: In SQLite gibt es keine Anomalien bei gleichzeitigen Transaktionen. Wenn eine Transaktion schreibt, müssen andere Transaktionen warten.

**Praktische Konsequenz:**
- SQLite ist sehr sicher, aber bei vielen gleichzeitigen Schreibzugriffen können Wartezeiten entstehen
- Für Web-Anwendungen mit vielen gleichzeitigen Schreibzugriffen kann PostgreSQL/MySQL besser sein
- Für Lesezugriffe und moderate Schreibzugriffe reicht SQLite problemlos`,
            keyTakeaways: [
              "4 Isolationslevel: READ UNCOMMITTED bis SERIALIZABLE",
              "3 Anomalien: Dirty Read, Non-Repeatable Read, Phantom Read",
              "SQLite: Nur SERIALIZABLE (strengstes Level)",
              "SQLite blockiert Schreibzugriffe bei aktiven Schreibtransaktionen",
            ],
          },
        ],
      },
      {
        id: "dml-fehler",
        title: "Häufige DML-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "dml-fehler-liste",
            title: "Die häufigsten DML-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: UPDATE/DELETE ohne WHERE**
\`\`\`sql
-- FALSCH: Alle Zeilen werden aktualisiert/gelöscht!
UPDATE produkte SET preis = 0;
DELETE FROM bestellungen;

-- RICHTIG: Immer WHERE-Klausel verwenden
UPDATE produkte SET preis = 0 WHERE id = 1;
DELETE FROM bestellungen WHERE status = 'storniert';
\`\`\`

---

**Fehler 2: Constraint-Verletzung beim INSERT**
\`\`\`sql
-- NOT NULL verletzt
INSERT INTO kunden (email) VALUES ('anna@beispiel.de');  -- name fehlt!

-- UNIQUE verletzt
INSERT INTO kunden (name, email) VALUES ('Anna', 'anna@beispiel.de');  -- email existiert schon!

-- FOREIGN KEY verletzt
INSERT INTO bestellungen (kunde_id, datum) VALUES (999, '2024-01-15');  -- kunde_id 999 existiert nicht!
\`\`\`

---

**Fehler 3: Falsche Spaltenreihenfolge**
\`\`\`sql
-- FALSCH: Reihenfolge stimmt nicht mit VALUES überein
INSERT INTO kunden (name, email) VALUES ('anna@beispiel.de', 'Anna');

-- RICHTIG: Spalten und Werte müssen übereinstimmen
INSERT INTO kunden (name, email) VALUES ('Anna', 'anna@beispiel.de');
\`\`\`

---

**Fehler 4: UPDATE ändert den Primärschlüssel**
\`\`\`sql
-- FALSCH: Primärschlüssel ändern kann Fremdschlüssel-Beziehungen zerstören
UPDATE kunden SET id = 999 WHERE id = 1;

-- RICHTIG: Primärschlüssel nie ändern (oder ON UPDATE CASCADE verwenden)
\`\`\`

---

**Fehler 5: DELETE ohne Transaktion**
\`\`\`sql
-- FALSCH: Kein Rollback möglich
DELETE FROM bestellungen WHERE status = 'storniert';

-- RICHTIG: In Transaktion ausführen
BEGIN;
DELETE FROM bestellungen WHERE status = 'storniert';
-- Prüfen, dann COMMIT oder ROLLBACK
\`\`\`

---

**Fehler 6: INSERT mit falschen Datentypen**
\`\`\`sql
-- FALSCH: String statt Zahl
INSERT INTO produkte (name, preis) VALUES ('Laptop', 'teuer');

-- RICHTIG: Korrekter Datentyp
INSERT INTO produkte (name, preis) VALUES ('Laptop', 999.99);
\`\`\``,
            keyTakeaways: [
              "IMMER WHERE-Klausel bei UPDATE/DELETE",
              "Constraints beachten: NOT NULL, UNIQUE, FOREIGN KEY",
              "Spaltenreihenfolge bei INSERT prüfen",
              "Primärschlüssel nie ändern",
              "DELETE in Transaktionen ausführen",
            ],
          },
        ],
      },
      {
        id: "dml-best-practices",
        title: "DML-Best Practices",
        estimatedMinutes: 10,
        sections: [
          {
            id: "dml-best-practices-liste",
            title: "Sicheres und effizientes DML",
            sectionType: "theory",
            content: `**1. Immer Spaltennamen bei INSERT angeben**
\`\`\`sql
-- FALSCH: Reihenfolge kann sich ändern
INSERT INTO kunden VALUES (1, 'Anna', 'anna@beispiel.de');

-- RICHTIG: Explizite Spaltennamen
INSERT INTO kunden (name, email) VALUES ('Anna', 'anna@beispiel.de');
\`\`\`

---

**2. Vor UPDATE/DELETE immer SELECT ausführen**
\`\`\`sql
-- Erst prüfen
SELECT * FROM bestellungen WHERE status = 'storniert';
-- Dann ändern
DELETE FROM bestellungen WHERE status = 'storniert';
\`\`\`

---

**3. Transaktionen für zusammenhängende Operationen**
\`\`\`sql
BEGIN;
INSERT INTO bestellungen (kunde_id, datum) VALUES (1, CURRENT_TIMESTAMP);
INSERT INTO bestellpositionen (bestellung_id, produkt_id, menge)
  VALUES (last_insert_rowid(), 5, 2);
COMMIT;
\`\`\`

---

**4. Batch-Inserts für Performance**
\`\`\`sql
-- Langsam: Einzelne INSERTs
INSERT INTO kunden (name) VALUES ('Anna');
INSERT INTO kunden (name) VALUES ('Ben');
INSERT INTO kunden (name) VALUES ('Clara');

-- Schnell: Ein Batch-Insert
INSERT INTO kunden (name) VALUES ('Anna'), ('Ben'), ('Clara');
\`\`\`

---

**5. UPSERT statt INSERT + UPDATE prüfen**
\`\`\`sql
-- Statt: Erst prüfen, dann INSERT oder UPDATE
-- Einfach: UPSERT
INSERT INTO kunden (id, name, email)
VALUES (1, 'Anna', 'anna@neu.de')
ON CONFLICT(id) DO UPDATE SET email = excluded.email;
\`\`\`

---

**6. LIMIT bei UPDATE/DELETE (Vorsicht!)**
\`\`\`sql
-- Nur die ersten 100 Zeilen aktualisieren
UPDATE produkte SET preis = preis * 1.10
WHERE preis < 10 LIMIT 100;
\`\`\`

---

**7. Soft Delete statt Hard Delete**
\`\`\`sql
-- Statt Zeile zu löschen: Als gelöscht markieren
UPDATE kunden SET geloescht = 1, geloescht_am = CURRENT_TIMESTAMP
WHERE id = 5;

-- Abfragen: Nur aktive Kunden
SELECT * FROM kunden WHERE geloescht = 0;
\`\`\``,
            keyTakeaways: [
              "Spaltennamen bei INSERT immer explizit angeben",
              "Vor UPDATE/DELETE: SELECT mit gleicher WHERE-Klausel",
              "Transaktionen für zusammenhängende Operationen",
              "Batch-Inserts für Performance",
              "Soft Delete statt Hard Delete für wichtige Daten",
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
            content: `Eine **Common Table Expression (CTE)** ist eine benannte temporäre Ergebnismenge, die innerhalb einer SELECT-Anweisung definiert wird. Stell dir eine CTE als eine benannte Unterabfrage vor, die du im Voraus definierst und dann mehrfach verwenden kannst — wie eine Variable für Abfragen. CTEs machen komplexe Abfragen deutlich lesbarer, weil sie die Logik in benannte, verständliche Blöcke aufteilen.

**Syntax:**
\`\`\`sql
WITH cte_name AS (
  SELECT ...
)
SELECT ... FROM cte_name;
\`\`\`

---

**Vorteile von CTEs gegenüber Subqueries:**
1. **Lesbarkeit**: Komplexe Abfragen werden in benannte Blöcke aufgeteilt — statt verschachtelter Unterabfragen liest man die Abfrage von oben nach unten
2. **Wiederverwendbarkeit**: Eine CTE kann mehrfach in derselben Abfrage referenziert werden — keine Duplikation von Code
3. **Wartbarkeit**: Änderungen müssen nur an einer Stelle vorgenommen werden
4. **Performance**: Der Optimizer kann CTEs effizienter verarbeiten als verschachtelte Unterabfragen

**CTEs vs. Subqueries — der direkte Vergleich:**
- Subquery in FROM: Wird für jede Referenz neu ausgeführt — bei mehrfacher Nutzung ineffizient
- CTE: Wird einmal definiert und kann mehrfach referenziert werden — effizienter und lesbarer`,
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

---

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

---

Ohne CTE müsste die Unterabfrage zweimal geschrieben werden — einmal im JOIN und einmal im WHERE.

**2. Mehrere CTEs in einer Abfrage:**

---

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

---

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

---

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

---

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

---

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

---

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

---

**Rekursive CTE — Alle Untergebenen des CEOs:**

---

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

---

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
      {
        id: "cte-vs-subquery",
        title: "CTE vs. Subquery — Vor- und Nachteile",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-vs-subquery-vergleich",
            title: "Wann CTE, wann Subquery?",
            sectionType: "theory",
            content: `**CTE vs. Subquery — Direktvergleich:**

| Eigenschaft | CTE | Subquery |
|------------|-----|----------|
| Lesbarkeit | Hoch (von oben nach unten) | Niedrig (von innen nach außen) |
| Wiederverwendbarkeit | Ja (mehrfach referenzierbar) | Nein (muss wiederholt werden) |
| Performance | Gleich oder besser | Gleich oder schlechter |
| Verschachtelungstiefe | Flach | Tief (schwer lesbar) |
| Rekursion | Ja (WITH RECURSIVE) | Nein |

**Beispiel — Dasselbe mit CTE und Subquery:**

---

\`\`\`sql
-- Mit Subquery (schwer lesbar)
SELECT name, preis, kategorie, avg_preis
FROM (
  SELECT name, preis, kategorie,
    (SELECT AVG(preis) FROM produkte p2 WHERE p2.kategorie = p1.kategorie) AS avg_preis
  FROM produkte p1
) AS sub
WHERE preis > avg_preis;

-- Mit CTE (lesbar)
WITH kategorie_avg AS (
  SELECT kategorie, AVG(preis) AS avg_preis
  FROM produkte
  GROUP BY kategorie
)
SELECT p.name, p.preis, p.kategorie
FROM produkte p
JOIN kategorie_avg ka ON p.kategorie = ka.kategorie
WHERE p.preis > ka.avg_preis;
\`\`\`

---

**Wann CTE verwenden:**
- Komplexe Abfragen mit mehreren Schritten
- Wenn Zwischenergebnisse wiederverwendet werden
- Wenn die Lesbarkeit wichtig ist
- Für rekursive Abfragen

**Wann Subquery verwenden:**
- Einfache Filterbedingungen (WHERE ... IN)
- Skalar-Subqueries (ein einzelner Wert)
- Wenn die Abfrage kurz und übersichtlich ist`,
            keyTakeaways: [
              "CTE: Lesbarer, wiederverwendbar, flache Struktur",
              "Subquery: Kompakt für einfache Filterungen",
              "Komplexe Abfragen → CTE, einfache Filter → Subquery",
              "CTE kann mehrfach referenziert werden, Subquery nicht",
            ],
          },
        ],
      },
      {
        id: "mehrere-ctes",
        title: "Mehrere CTEs kombinieren",
        estimatedMinutes: 10,
        sections: [
          {
            id: "multiple-ctes",
            title: "WITH ... AS, ... AS — Mehrere CTEs",
            sectionType: "example",
            content: `Mehrere CTEs werden mit Komma getrennt. Jede CTE kann auf vorherige CTEs zugreifen.

---

\`\`\`sql
WITH
  -- CTE 1: Umsatz pro Kunde
  kunden_umsatz AS (
    SELECT kunde_id, SUM(betrag) AS gesamtumsatz
    FROM bestellungen
    GROUP BY kunde_id
  ),
  -- CTE 2: Durchschnittlicher Umsatz
  avg_umsatz AS (
    SELECT AVG(gesamtumsatz) AS durchschnitt
    FROM kunden_umsatz
  ),
  -- CTE 3: Top-Kunden (referenziert CTE 1 und 2)
  top_kunden AS (
    SELECT ku.kunde_id, ku.gesamtumsatz
    FROM kunden_umsatz ku, avg_umsatz av
    WHERE ku.gesamtumsatz > av.durchschnitt
  )
-- Hauptabfrage
SELECT k.name, tk.gesamtumsatz
FROM kunden k
JOIN top_kunden tk ON k.id = tk.kunde_id
ORDER BY tk.gesamtumsatz DESC;
\`\`\`

---

**Reihenfolge ist wichtig:**
- CTEs werden von oben nach unten definiert
- Eine CTE kann nur auf vorher definierte CTEs zugreifen
- Die Hauptabfrage kann auf alle CTEs zugreifen

**Praktisches Beispiel — Monatsvergleich:**
\`\`\`sql
WITH
  aktueller_monat AS (
    SELECT kategorie, SUM(umsatz) AS umsatz
    FROM verkaufszahlen
    WHERE datum >= DATE('now', 'start of month')
    GROUP BY kategorie
  ),
  vorheriger_monat AS (
    SELECT kategorie, SUM(umsatz) AS umsatz
    FROM verkaufszahlen
    WHERE datum >= DATE('now', 'start of month', '-1 month')
      AND datum < DATE('now', 'start of month')
    GROUP BY kategorie
  )
SELECT
  a.kategorie,
  a.umsatz AS aktueller_umsatz,
  v.umsatz AS vorheriger_umsatz,
  ROUND((a.umsatz - v.umsatz) * 100.0 / v.umsatz, 1) AS veraenderung_prozent
FROM aktueller_monat a
JOIN vorheriger_monat v ON a.kategorie = v.kategorie;
\`\`\``,
            keyTakeaways: [
              "Mehrere CTEs mit Komma trennen",
              "Jede CTE kann auf vorherige CTEs zugreifen",
              "Reihenfolge ist wichtig: CTEs werden von oben nach unten definiert",
              "Hauptabfrage kann auf alle CTEs zugreifen",
            ],
          },
        ],
      },
      {
        id: "cte-mit-aggregation",
        title: "CTEs mit Aggregation und Filterung",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-aggregation",
            title: "Aggregation und Filterung mit CTEs",
            sectionType: "example",
            content: `CTEs eignen sich hervorragend, um aggregierte Daten vorzubereiten und dann zu filtern.

**Beispiel 1: Top-Kunden nach Umsatz**
\`\`\`sql
WITH kunden_umsatz AS (
  SELECT
    k.name,
    COUNT(b.id) AS anzahl_bestellungen,
    SUM(b.betrag) AS gesamtumsatz
  FROM kunden k
  LEFT JOIN bestellungen b ON k.id = b.kunde_id
  GROUP BY k.name
)
SELECT name, anzahl_bestellungen, gesamtumsatz
FROM kunden_umsatz
WHERE gesamtumsatz > 500
ORDER BY gesamtumsatz DESC;
\`\`\`

---

**Beispiel 2: Kategorien mit Durchschnittspreis und Anzahl**
\`\`\`sql
WITH kategorie_stats AS (
  SELECT
    kategorie,
    COUNT(*) AS anzahl,
    AVG(preis) AS durchschnittspreis,
    MIN(preis) AS min_preis,
    MAX(preis) AS max_preis
  FROM produkte
  GROUP BY kategorie
)
SELECT kategorie, anzahl, durchschnittspreis, min_preis, max_preis
FROM kategorie_stats
WHERE anzahl > 3
ORDER BY durchschnittspreis DESC;
\`\`\`

---

**Beispiel 3: Bestellungen pro Monat mit Trend**
\`\`\`sql
WITH monatlich AS (
  SELECT
    strftime('%Y-%m', datum) AS monat,
    COUNT(*) AS anzahl_bestellungen,
    SUM(betrag) AS umsatz
  FROM bestellungen
  GROUP BY strftime('%Y-%m', datum)
)
SELECT
  monat,
  anzahl_bestellungen,
  umsatz,
  umsatz - LAG(umsatz) OVER (ORDER BY monat) AS veraenderung
FROM monatlich
ORDER BY monat;
\`\`\`

---

**Warum CTE statt direkter Abfrage?**
- Die Aggregation wird in der CTE berechnet
- Die Filterung (WHERE) wird in der Hauptabfrage angewendet
- Die Abfrage ist lesbarer und wartbarer`,
            keyTakeaways: [
              "CTEs eignen sich für mehrstufige Aggregationen",
              "Aggregation in der CTE, Filterung in der Hauptabfrage",
              "Klarere Trennung von Berechnung und Filterung",
              "Kombinierbar mit Window Functions für Trends",
            ],
          },
        ],
      },
      {
        id: "cte-mit-joins",
        title: "CTEs mit JOINs kombinieren",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-joins",
            title: "CTEs und JOINs zusammen verwenden",
            sectionType: "example",
            content: `CTEs können mit JOINs kombiniert werden, um komplexe Abfragen lesbar zu strukturieren.

**Beispiel: Bestellübersicht mit Kundendetails**
\`\`\`sql
WITH kunden_umsatz AS (
  SELECT kunde_id, SUM(betrag) AS gesamtumsatz
  FROM bestellungen
  GROUP BY kunde_id
)
SELECT k.name, k.email, ku.gesamtumsatz
FROM kunden k
LEFT JOIN kunden_umsatz ku ON k.id = ku.kunde_id
ORDER BY ku.gesamtumsatz DESC NULLS LAST;
\`\`\`

---

**Beispiel: Produkte mit Kategorie-Statistiken**
\`\`\`sql
WITH kategorie_stats AS (
  SELECT kategorie, AVG(preis) AS avg_preis, COUNT(*) AS anzahl
  FROM produkte
  GROUP BY kategorie
)
SELECT p.name, p.preis, ks.kategorie, ks.avg_preis, ks.anzahl
FROM produkte p
JOIN kategorie_stats ks ON p.kategorie = ks.kategorie
WHERE p.preis > ks.avg_preis;
\`\`\`

---

**Beispiel: Mehrstufige Analyse**
\`\`\`sql
WITH
  bestellpositionen_details AS (
    SELECT
      bp.bestellung_id,
      bp.produkt_id,
      bp.menge * bp.einzelpreis AS positionswert
    FROM bestellpositionen bp
  ),
  bestellung_umsatz AS (
    SELECT
      bestellung_id,
      SUM(positionswert) AS bestellwert
    FROM bestellpositionen_details
    GROUP BY bestellung_id
  )
SELECT
  k.name AS kunde,
  b.datum AS bestelldatum,
  bu.bestellwert
FROM kunden k
JOIN bestellungen b ON k.id = b.kunde_id
JOIN bestellung_umsatz bu ON b.id = bu.bestellung_id
WHERE bu.bestellwert > 100
ORDER BY bu.bestellwert DESC;
\`\`\``,
            keyTakeaways: [
              "CTEs mit JOINs kombinieren für komplexe Abfragen",
              "LEFT JOIN für optionale Beziehungen (Kunden ohne Bestellungen)",
              "Mehrstufige Analysen: CTEs verketten und mit JOINs verbinden",
              "Jede CTE hat einen klaren Zweck — lesbarer als verschachtelte Subqueries",
            ],
          },
        ],
      },
      {
        id: "rekursive-cte-baum",
        title: "Rekursive CTEs für Baumstrukturen",
        estimatedMinutes: 12,
        sections: [
          {
            id: "rekursive-cte-baum-theorie",
            title: "Hierarchien mit rekursiven CTEs",
            sectionType: "theory",
            content: `**Baumstrukturen** sind eine der häufigsten Anwendungen für rekursive CTEs. Beispiele: Organigramme, Stücklisten, Menüstrukturen.

**Aufbau einer Baumstruktur:**
- Wurzel (Root): Knoten ohne Vorgänger (parent_id IS NULL)
- Innere Knoten: Haben sowohl Vorgänger als auch Nachfolger
- Blätter (Leaf): Knoten ohne Nachfolger

**Rekursive CTE für einen Baum:**
\`\`\`sql
WITH RECURSIVE baum AS (
  -- Anker: Wurzelknoten
  SELECT id, name, parent_id, 0 AS ebene, name AS pfad
  FROM kategorien
  WHERE parent_id IS NULL

  UNION ALL

  -- Rekursiver Teil: Kinderknoten
  SELECT k.id, k.name, k.parent_id, b.ebene + 1,
    b.pfad || ' > ' || k.name
  FROM kategorien k
  JOIN baum b ON k.parent_id = b.id
)
SELECT * FROM baum ORDER BY pfad;
\`\`\`

---

**Ergebnis:**

| id | name | ebene | pfad |
|----|------|-------|------|
| 1 | Elektronik | 0 | Elektronik |
| 2 | Computer | 1 | Elektronik > Computer |
| 5 | Laptops | 2 | Elektronik > Computer > Laptops |
| 6 | Desktops | 2 | Elektronik > Computer > Desktops |
| 3 | Handys | 1 | Elektronik > Handys |
| 4 | Bücher | 0 | Bücher |

**Pfad-Spalte:** Die Pfad-Spalte zeigt den vollständigen Pfad von der Wurzel zum Knoten. Dies wird durch String-Konkatenation (\`||\`) im rekursiven Teil erreicht.`,
            keyTakeaways: [
              "Baumstrukturen: Wurzel, innere Knoten, Blätter",
              "Anker: Wurzelknoten (parent_id IS NULL)",
              "Rekursiver Teil: Kinderknoten (JOIN auf parent_id)",
              "Pfad-Spalte zeigt den vollständigen Hierarchiepfad",
            ],
          },
        ],
      },
      {
        id: "rekursive-cte-graph",
        title: "Rekursive CTEs für Graphen und Netzwerke",
        estimatedMinutes: 12,
        sections: [
          {
            id: "rekursive-cte-graph-theorie",
            title: "Graphen und Netzwerke mit rekursiven CTEs",
            sectionType: "practice",
            content: `**Graphen** bestehen aus Knoten und Kanten. Rekursive CTEs können Pfade in Graphen finden.

**Beispiel: Flugrouten (Kürzester Pfad)**
\`\`\`sql
CREATE TABLE flugrouten (
  von VARCHAR(50),
  nach VARCHAR(50),
  distanz INTEGER
);

INSERT INTO flugrouten VALUES
  ('Berlin', 'München', 600),
  ('Berlin', 'Hamburg', 300),
  ('München', 'Hamburg', 800),
  ('Hamburg', 'Köln', 400),
  ('München', 'Köln', 500);
\`\`\`

---

**Alle Routen von Berlin:**
\`\`\`sql
WITH RECURSIVE routen AS (
  -- Anker: Direktflüge von Berlin
  SELECT von, nach, distanz, von || ' → ' || nach AS pfad
  FROM flugrouten
  WHERE von = 'Berlin'

  UNION ALL

  -- Rekursiv: Weiterflüge
  SELECT r.von, f.nach, r.distanz + f.distanz,
    r.pfad || ' → ' || f.nach
  FROM flugrouten f
  JOIN routen r ON f.von = r.nach
  WHERE r.pfad NOT LIKE '% → ' || f.nach || '% → %'  -- Zyklen vermeiden
)
SELECT * FROM routen ORDER BY distanz;
\`\`\`

---

**Beispiel: Freundesnetzwerk (Freunde von Freunden)**
\`\`\`sql
WITH RECURSIVE freundeskreis AS (
  -- Anker: Direkte Freunde von Anna
  SELECT person2 AS freund, 1 AS entfernung
  FROM freunde WHERE person1 = 'Anna'

  UNION ALL

  -- Rekursiv: Freunde von Freunden
  SELECT f.person2, fk.entfernung + 1
  FROM freunde f
  JOIN freundeskreis fk ON f.person1 = fk.freund
  WHERE fk.entfernung < 3  -- Maximal 3 Ebenen
    AND f.person2 != 'Anna'  -- Keine Zyklen
)
SELECT DISTINCT freund, MIN(entfernung) AS entfernung
FROM freundeskreis
GROUP BY freund
ORDER BY entfernung;
\`\`\`

---

**Wichtig:** Bei Graphen muss man Zyklen vermeiden! Die \`NOT LIKE\`-Bedingung oder eine Tiefenbegrenzung (\`entfernung < 3\`) verhindert Endlosschleifen.`,
            keyTakeaways: [
              "Graphen: Knoten und Kanten (z.B. Flugrouten, Freundesnetzwerke)",
              "Pfad-Spalte zeigt die Route (String-Konkatenation)",
              "Zyklen vermeiden: NOT LIKE oder Tiefenbegrenzung",
              "DISTINCT und MIN(entfernung) für kürzeste Pfade",
            ],
          },
        ],
      },
      {
        id: "cte-performance",
        title: "CTE-Performance und Optimierung",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-perf",
            title: "CTE-Performance-Tipps",
            sectionType: "theory",
            content: `**CTE-Performance in SQLite vs. anderen Datenbanken:**

In SQLite werden CTEs **nicht materialisiert** — sie werden bei jeder Referenz neu ausgeführt. In PostgreSQL können CTEs mit \`MATERIALIZED\` materialisiert werden.

**Performance-Tipps:**

**1. CTE nicht mehrfach referenzieren (in SQLite)**
\`\`\`sql
-- In SQLite: kunden_umsatz wird ZWEIMAL ausgeführt!
WITH kunden_umsatz AS (
  SELECT kunde_id, SUM(betrag) FROM bestellungen GROUP BY kunde_id
)
SELECT * FROM kunden_umsatz WHERE summe > 100
UNION ALL
SELECT * FROM kunden_umsatz WHERE summe <= 100;

-- Besser: Temporäre Tabelle oder Window Function
\`\`\`

---

**2. Einfache Filterungen brauchen keine CTE**
\`\`\`sql
-- Überflüssige CTE
WITH teure_produkte AS (
  SELECT * FROM produkte WHERE preis > 100
)
SELECT * FROM teure_produkte WHERE kategorie = 'Elektronik';

-- Einfacher: Direkte Abfrage
SELECT * FROM produkte WHERE preis > 100 AND kategorie = 'Elektronik';
\`\`\`

---

**3. CTEs für mehrstufige Aggregationen**
\`\`\`sql
-- CTE ist hier sinnvoll: Aggregation + Filter auf Aggregation
WITH kategorie_stats AS (
  SELECT kategorie, AVG(preis) AS avg_preis, COUNT(*) AS anzahl
  FROM produkte
  GROUP BY kategorie
)
SELECT * FROM kategorie_stats WHERE anzahl > 5;
\`\`\`

---

**4. EXPLAIN QUERY PLAN nutzen**
\`\`\`sql
EXPLAIN QUERY PLAN
WITH kunden_umsatz AS (...)
SELECT * FROM kunden_umsatz;
\`\`\`

---

**Faustregel:** CTEs verwenden, wenn sie die Lesbarkeit verbessern. Bei Performance-Problemen mit mehrfach referenzierten CTEs in SQLite: Temporäre Tabelle oder Window Function in Betracht ziehen.`,
            keyTakeaways: [
              "SQLite: CTEs werden bei jeder Referenz neu ausgeführt (nicht materialisiert)",
              "Einfache Filterungen brauchen keine CTE",
              "CTEs sinnvoll für mehrstufige Aggregationen",
              "EXPLAIN QUERY PLAN für Performance-Analyse nutzen",
            ],
          },
        ],
      },
      {
        id: "cte-fehler",
        title: "Häufige CTE-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "cte-fehler-liste",
            title: "Die häufigsten CTE-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: Komma statt WITH bei mehreren CTEs**
\`\`\`sql
-- FALSCH: WITH vor jeder CTE
WITH kunden_umsatz AS (...)
WITH kategorie_stats AS (...)  -- Syntaxfehler!

-- RICHTIG: Komma zwischen CTEs
WITH
  kunden_umsatz AS (...),
  kategorie_stats AS (...)
SELECT ...
\`\`\`

---

**Fehler 2: CTE nach der Hauptabfrage**
\`\`\`sql
-- FALSCH: CTE nach SELECT
SELECT * FROM kunden_umsatz;
WITH kunden_umsatz AS (...);  -- Syntaxfehler!

-- RICHTIG: CTE vor der Hauptabfrage
WITH kunden_umsatz AS (...)
SELECT * FROM kunden_umsatz;
\`\`\`

---

**Fehler 3: Vorwärtsreferenz auf CTE**
\`\`\`sql
-- FALSCH: CTE referenziert eine später definierte CTE
WITH
  kategorie_stats AS (
    SELECT * FROM kunden_umsatz  -- kunden_umsatz ist noch nicht definiert!
  ),
  kunden_umsatz AS (...)
SELECT ...;

-- RICHTIG: CTEs in der richtigen Reihenfolge definieren
WITH
  kunden_umsatz AS (...),
  kategorie_stats AS (SELECT * FROM kunden_umsatz)  -- Jetzt definiert
SELECT ...;
\`\`\`

---

**Fehler 4: Fehlendes UNION ALL bei rekursiver CTE**
\`\`\`sql
-- FALSCH: UNION statt UNION ALL
WITH RECURSIVE baum AS (
  SELECT ... FROM kategorien WHERE parent_id IS NULL
  UNION  -- FALSCH! UNION entfernt Duplikate und kann Performance-Probleme verursachen
  SELECT ... FROM kategorien JOIN baum ...
)

-- RICHTIG: UNION ALL
WITH RECURSIVE baum AS (
  SELECT ... FROM kategorien WHERE parent_id IS NULL
  UNION ALL  -- RICHTIG
  SELECT ... FROM kategorien JOIN baum ...
)
\`\`\`

---

**Fehler 5: Endlosschleife bei rekursiver CTE**
Ohne Zyklus-Erkennung oder Tiefenbegrenzung kann eine rekursive CTE endlos laufen. Immer eine Abbruchbedingung einbauen!`,
            keyTakeaways: [
              "Komma zwischen mehreren CTEs, nicht WITH",
              "CTE muss VOR der Hauptabfrage stehen",
              "CTEs können nur vorher definierte CTEs referenzieren",
              "UNION ALL statt UNION bei rekursiven CTEs",
              "Immer Abbruchbedingung bei rekursiven CTEs einbauen",
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
            content: `**Window Functions** sind eine der mächtigsten Erweiterungen von SQL. Sie berechnen Werte über eine Gruppe von Zeilen (ein „Fenster"), ohne die Zeilen wie GROUP BY zu einer einzigen Zeile zusammenzufassen. Statt das Ergebnis zu verdichten, bleibt jede Zeile erhalten — aber jede Zeile bekommt zusätzliche Informationen, die aus ihrem Kontext berechnet werden: Rang, Durchschnitt, laufende Summe, Vergleich mit der vorherigen Zeile und vieles mehr.

Stell dir vor, du willst für jeden Kunden den Umsatz und gleichzeitig den Durchschnittsumsatz aller Kunden anzeigen. Ohne Window Functions müsstest du eine Unterabfrage oder einen JOIN schreiben. Mit Window Functions geht das in einer einzigen Abfrage:

---

\`\`\`sql
SELECT name, umsatz,
  AVG(umsatz) OVER () AS durchschnitt
FROM kunden;
\`\`\`

---

**Der entscheidende Unterschied zu GROUP BY:** GROUP BY verdichtet die Zeilen — du bekommst eine Zeile pro Gruppe. Window Functions berechnen Werte über Gruppen, aber jede Zeile bleibt erhalten. Das ist wie ein Fenster, durch das du die umliegenden Zeilen siehst, ohne sie zu verschmelzen.

**Syntax:**
\`\`\`sql
funktion() OVER (
  PARTITION BY spalte
  ORDER BY spalte
  ROWS BETWEEN ... AND ...
)
\`\`\`

---

- **PARTITION BY**: Teilt die Zeilen in Gruppen (wie GROUP BY, aber ohne Verdichtung)
- **ORDER BY**: Bestimmt die Reihenfolge innerhalb der Partition
- **ROWS BETWEEN**: Definiert den Fensterbereich (welche Zeilen in die Berechnung einfließen)

**Wichtige Window Functions im Überblick:**

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
            content: `Die drei Ranking-Funktionen nummerieren Zeilen, aber sie unterscheiden sich im Umgang mit Gleichständen. ROW_NUMBER vergibt immer eine eindeutige Nummer, RANK lässt Lücken bei Gleichstand, und DENSE_RANK nummeriert lückenlos durch.

---

**ROW_NUMBER()** vergibt eine fortlaufende, eindeutige Nummer an jede Zeile — auch bei gleichem Preis bekommt jede Zeile eine andere Nummer:

---

\`\`\`sql
SELECT name, kategorie, preis,
  ROW_NUMBER() OVER (ORDER BY preis DESC) AS zeilen_nr
FROM produkte;
\`\`\`

---

**RANK()** vergibt denselben Rang bei Gleichstand, überspringt aber die folgende Nummer. Das ist wie bei der Olympiade: Zwei Goldmedaillen, dann kommt Bronze:

---

\`\`\`sql
SELECT name, preis,
  RANK() OVER (ORDER BY preis DESC) AS rang
FROM produkte;
\`\`\`

---

**DENSE_RANK()** vergibt denselben Rang bei Gleichstand, überspringt aber keine Nummern. Die Platzierung ist immer lückenlos:

| name | preis | rang |
|------|-------|------|
| Produkt A | 100 | 1 |
| Produkt B | 80 | 2 |
| Produkt C | 80 | 2 |
| Produkt D | 50 | 4 | ← Rang 3 wird übersprungen!

**DENSE_RANK()** — Rang ohne Lücken:

---

\`\`\`sql
SELECT name, preis,
  DENSE_RANK() OVER (ORDER BY preis DESC) AS dichter_rang
FROM produkte;
\`\`\`

---

| name | preis | dichter_rang |
|------|-------|-------------|
| Produkt A | 100 | 1 |
| Produkt B | 80 | 2 |
| Produkt C | 80 | 2 |
| Produkt D | 50 | 3 | ← Kein Sprung!

**Praktische Anwendung: Top-N pro Kategorie**

---

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

---

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
            content: `**LAG()** greift auf den Wert einer vorherigen Zeile zu, **LEAD()** auf den Wert einer folgenden Zeile. Diese Funktionen sind unverzichtbar, wenn du Werte zwischen benachbarten Zeilen vergleichen willst — etwa den Umsatz des Vormonats, die Differenz zum Vorgänger oder den Trend zwischen zwei Zeitpunkten.

Stell dir vor, du hast eine Tabelle mit monatlichen Umsätzen und willst für jeden Monat den Umsatz des Vormonats anzeigen. Ohne LAG müsstest du die Tabelle mit sich selbst JOINen — eine komplexe und fehleranfällige Operation. Mit LAG geht es in einer einzigen Zeile.

---

\`\`\`sql
LAG(spalte, offset, standardwert) OVER (ORDER BY ...)
LEAD(spalte, offset, standardwert) OVER (ORDER BY ...)
\`\`\`

---

- **offset**: Wie viele Zeilen zurück/vor (Standard: 1)
- **standardwert**: Wert, wenn keine Zeile existiert (Standard: NULL)

**Praktisches Beispiel — Monatlicher Umsatz mit Vormonat:**
\`\`\`sql
SELECT monat, umsatz,
  LAG(umsatz, 1) OVER (ORDER BY monat) AS vormonat,
  umsatz - LAG(umsatz, 1) OVER (ORDER BY monat) AS veraenderung
FROM monatlicher_umsatz;
\`\`\`

---

**LEAD — Blick in die Zukunft:**
\`\`\`sql
SELECT monat, umsatz,
  LEAD(umsatz, 1) OVER (ORDER BY monat) AS naechster_monat
FROM monatlicher_umsatz;
\`\`\`

---

**Wichtige Hinweise:**
- LAG und LEAD benötigen immer ein ORDER BY im OVER() — sonst ist die Reihenfolge undefiniert
- LAG(1) greift auf die direkt vorherige Zeile, LAG(2) auf die vorletzte usw.
- Der Standardwert wird eingesetzt, wenn es keine vorherige/folgende Zeile gibt (z.B. LAG in der ersten Zeile)`,
          },
          {
            id: "laufende-summen",
            title: "Laufende Summen und Window Frames",
            sectionType: "practice",
            content: `**Laufende Summen (Running Totals)** berechnen eine kumulative Summe bis zur aktuellen Zeile:

---

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

---

**Ergebnis:**

| bestelldatum | kunde_id | betrag | laufende_summe |
|-------------|----------|--------|---------------|
| 2024-01-15 | 1 | 50.00 | 50.00 |
| 2024-01-20 | 2 | 30.00 | 80.00 |
| 2024-02-01 | 1 | 70.00 | 150.00 |
| 2024-02-15 | 3 | 20.00 | 170.00 |

**Window Frames — Das Fenster definieren:**

---

\`\`\`sql
ROWS BETWEEN start AND ende
\`\`\`

---

| Frame | Bedeutung |
|-------|----------|
| UNBOUNDED PRECEDING | Vom Anfang |
| CURRENT ROW | Aktuelle Zeile |
| UNBOUNDED FOLLOWING | Bis zum Ende |
| n PRECEDING | n Zeilen vorher |
| n FOLLOWING | n Zeilen nachher |

**Praktische Beispiele:**

---

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

---

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
      {
        id: "partition-by",
        title: "PARTITION BY im Detail",
        estimatedMinutes: 10,
        sections: [
          {
            id: "partition-by-detail",
            title: "PARTITION BY — Gruppierung innerhalb von Window Functions",
            sectionType: "theory",
            content: `**PARTITION BY** teilt die Ergebnismenge in Partitionen (Gruppen), und die Window Function wird für jede Partition separat berechnet. Stell dir vor, du willst den Rang jedes Produkts innerhalb seiner Kategorie wissen — nicht global, sondern pro Kategorie. Genau das macht PARTITION BY.

Ohne PARTITION BY wird die Window Function über die gesamte Ergebnismenge berechnet. Mit PARTITION BY wird die Ergebnismenge in Gruppen geteilt, und die Berechnung startet für jede Gruppe von vorn. Das ist wie GROUP BY, aber ohne die Zeilen zu verdichten — jede Zeile bleibt erhalten und bekommt ihren gruppenbezogenen Wert.

---

\`\`\`sql
-- Rang pro Kategorie
SELECT name, kategorie, preis,
  RANK() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rang
FROM produkte;
\`\`\`

---

**Ergebnis:**

| name | kategorie | preis | rang |
|------|-----------|-------|------|
| Laptop | Elektronik | 999 | 1 |
| Tablet | Elektronik | 599 | 2 |
| Smartphone | Elektronik | 399 | 3 |
| Roman | Buch | 15 | 1 |
| Sachbuch | Buch | 25 | 2 |

**PARTITION BY vs. GROUP BY:**

| Eigenschaft | PARTITION BY | GROUP BY |
|-------------|-------------|---------|
| Zeilen erhalten | Ja | Nein (gruppiert) |
| Ergebnis pro Zeile | Ja | Eine Zeile pro Gruppe |
| Aggregation | Über Partition | Über Gruppe |
| Kombinierbar | Mit anderen Spalten | Nur GROUP BY-Spalten |

**Mehrere PARTITION BY in einer Abfrage:**
\`\`\`sql
SELECT
  name,
  kategorie,
  preis,
  RANK() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rang_kategorie,
  RANK() OVER (ORDER BY preis DESC) AS rang_gesamt,
  SUM(preis) OVER (PARTITION BY kategorie) AS summe_kategorie,
  SUM(preis) OVER () AS summe_gesamt
FROM produkte;
\`\`\`

---

**Wichtig:** Jede Window Function hat ihr eigenes OVER() — verschiedene Partitionen und Sortierungen sind möglich!`,
            keyTakeaways: [
              "PARTITION BY teilt die Ergebnismenge in Gruppen",
              "Window Function wird für jede Partition separat berechnet",
              "PARTITION BY behält alle Zeilen (im Gegensatz zu GROUP BY)",
              "Mehrere PARTITION BY in einer Abfrage möglich",
            ],
          },
        ],
      },
      {
        id: "window-frames",
        title: "Window Frames: ROWS, RANGE, GROUPS",
        estimatedMinutes: 12,
        sections: [
          {
            id: "window-frames-detail",
            title: "Window Frames im Detail",
            sectionType: "theory",
            content: `Ein **Window Frame** definiert, welche Zeilen für die Berechnung einer Window Function berücksichtigt werden. Ohne expliziten Frame verwendet SQL einen Standard-Frame, der je nach Funktion unterschiedlich ist. Wenn du die Berechnung genauer steuern willst — etwa eine gleitende Durchschnitt über die letzten 3 Zeilen oder eine laufende Summe — musst du den Frame explizit angeben.

---

\`\`\`sql
FUNKTION() OVER (
  PARTITION BY spalte
  ORDER BY spalte
  ROWS BETWEEN start AND ende
)
\`\`\`

---

**Frame-Spezifikationen — die wichtigsten Grenzen:**

| Frame | Bedeutung |
|-------|-----------|
| UNBOUNDED PRECEDING | Vom Anfang der Partition |
| N PRECEDING | N Zeilen vor der aktuellen Zeile |
| CURRENT ROW | Aktuelle Zeile |
| N FOLLOWING | N Zeilen nach der aktuellen Zeile |
| UNBOUNDED FOLLOWING | Bis zum Ende der Partition |

**ROWS vs. RANGE vs. GROUPS — drei Frame-Modi:**

| Modus | Beschreibung |
|-------|-------------|
| ROWS | Basiert auf physischer Zeilennummer — zählt Zeilen unabhängig von Werten |
| RANGE | Basiert auf logischem Wertebereich — gleiche ORDER BY-Werte werden als Einheit behandelt |
| GROUPS | Basiert auf Gruppen gleicher ORDER BY-Werte — zählt Gruppen statt Zeilen |

**Praktische Beispiele:**

---

\`\`\`sql
-- Laufende Summe (Standard bei ORDER BY)
SUM(betrag) OVER (ORDER BY datum
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- Gleitender 3-Zeilen-Durchschnitt
AVG(betrag) OVER (ORDER BY datum
  ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)

-- Summe der aktuellen und vorherigen Zeile
SUM(betrag) OVER (ORDER BY datum
  ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)

-- Summe aller Zeilen (kein ORDER BY = gesamte Partition)
SUM(betrag) OVER (PARTITION BY kategorie)

-- Kumulative Summe pro Kategorie
SUM(betrag) OVER (
  PARTITION BY kategorie
  ORDER BY datum
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
\`\`\`

---

**Standard-Frame — was passiert, wenn du keinen Frame angibst:**
- Mit \`ORDER BY\`: \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` — ergibt eine laufende Aggregation
- Ohne \`ORDER BY\`: \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\` — gesamte Partition fließt in die Berechnung ein`,
            keyTakeaways: [
              "Window Frame definiert den Bereich der Berechnung",
              "ROWS: Physische Zeilen, RANGE: Logischer Wertebereich",
              "UNBOUNDED PRECEDING bis CURRENT ROW = laufende Summe",
              "Mit ORDER BY: Standard-Frame ist laufende Summe",
              "Ohne ORDER BY: Standard-Frame ist gesamte Partition",
            ],
          },
        ],
      },
      {
        id: "aggregate-window",
        title: "Aggregatfunktionen als Window Functions",
        estimatedMinutes: 10,
        sections: [
          {
            id: "aggregate-window-detail",
            title: "SUM, AVG, COUNT, MIN, MAX als Window Functions",
            sectionType: "example",
            content: `Alle Aggregatfunktionen (SUM, AVG, COUNT, MIN, MAX) können auch als Window Functions verwendet werden. Der Unterschied: Als normale Aggregatfunktion mit GROUP BY verdichten sie die Zeilen zu einer pro Gruppe. Als Window Function mit OVER() behalten sie alle Zeilen und fügen die Aggregation als zusätzliche Spalte hinzu.

Stell dir vor, du willst für jedes Produkt den Preis und gleichzeitig den Durchschnittspreis anzeigen. Ohne Window Functions müsstest du eine Unterabfrage schreiben. Mit OVER() geht es in einer einzigen Zeile.

**SUM als Window Function — Laufende Summe:**
\`\`\`sql
-- Laufende Summe pro Kunde
SELECT bestelldatum, kunde_id, betrag,
  SUM(betrag) OVER (
    PARTITION BY kunde_id
    ORDER BY bestelldatum
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS laufende_summe
FROM bestellungen;
\`\`\`

---

**AVG als Window Function — Gleitender Durchschnitt:**
\`\`\`sql
-- Gleitender 3-Zeilen-Durchschnitt
SELECT datum, umsatz,
  AVG(umsatz) OVER (ORDER BY datum ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)
    AS gleitender_durchschnitt
FROM tagesumsatz;
\`\`\`

---

**COUNT als Window Function — Zeilennummer und Anzahl:**
\`\`\`sql
-- Zeilennummer und Anzahl pro Kategorie
SELECT name, kategorie,
  ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS nr,
  COUNT(*) OVER (PARTITION BY kategorie) AS anzahl_kategorie
FROM produkte;
\`\`\`

---

**MIN und MAX als Window Function — Differenz zum Extremwert:**
\`\`\`sql
-- Differenz zum günstigsten/teuersten Produkt pro Kategorie
SELECT name, kategorie, preis,
  preis - MIN(preis) OVER (PARTITION BY kategorie) AS differenz_zum_min,
  MAX(preis) OVER (PARTITION BY kategorie) - preis AS differenz_zum_max
FROM produkte;
\`\`\`

---

**Prozentualer Anteil:**
\`\`\`sql
-- Umsatzanteil pro Bestellung
SELECT bestelldatum, kunde_id, betrag,
  ROUND(betrag * 100.0 / SUM(betrag) OVER (), 1) AS anteil_prozent
FROM bestellungen;
\`\`\``,
            keyTakeaways: [
              "Alle Aggregatfunktionen (SUM, AVG, COUNT, MIN, MAX) als Window Function nutzbar",
              "OVER() ohne Argument = gesamte Tabelle",
              "PARTITION BY + ORDER BY = laufende Aggregation pro Gruppe",
              "Prozentualer Anteil: betrag / SUM(betrag) OVER ()",
            ],
          },
        ],
      },
      {
        id: "first-value-last-value",
        title: "FIRST_VALUE, LAST_VALUE und NTH_VALUE",
        estimatedMinutes: 10,
        sections: [
          {
            id: "first-last-nth",
            title: "FIRST_VALUE, LAST_VALUE und NTH_VALUE",
            sectionType: "theory",
            content: `Diese Funktionen greifen auf bestimmte Werte innerhalb eines Window Frames zu.

**FIRST_VALUE — Erster Wert im Frame:**
\`\`\`sql
SELECT name, kategorie, preis,
  FIRST_VALUE(preis) OVER (PARTITION BY kategorie ORDER BY preis DESC)
    AS teuerster_preis
FROM produkte;
\`\`\`

---

**LAST_VALUE — Letzter Wert im Frame:**
\`\`\`sql
-- ACHTUNG: LAST_VALUE braucht einen expliziten Frame!
SELECT name, kategorie, preis,
  LAST_VALUE(preis) OVER (
    PARTITION BY kategorie
    ORDER BY preis
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS guenstigster_preis
FROM produkte;
\`\`\`

---

**Warum braucht LAST_VALUE einen expliziten Frame?**
Ohne expliziten Frame ist der Standard \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. LAST_VALUE würde dann immer den aktuellen Wert zurückgeben, nicht den letzten der Partition.

**NTH_VALUE — N-ter Wert im Frame:**
\`\`\`sql
-- Zweit-teuerstes Produkt pro Kategorie
SELECT name, kategorie, preis,
  NTH_VALUE(preis, 2) OVER (
    PARTITION BY kategorie
    ORDER BY preis DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS zweit_teuerstes
FROM produkte;
\`\`\`

---

**Praktisches Beispiel — Erster und letzter Wert pro Kunde:**
\`\`\`sql
SELECT
  kunde_id,
  bestelldatum,
  betrag,
  FIRST_VALUE(betrag) OVER (PARTITION BY kunde_id ORDER BY bestelldatum)
    AS erste_bestellung,
  FIRST_VALUE(betrag) OVER (PARTITION BY kunde_id ORDER BY bestelldatum DESC)
    AS letzte_bestellung
FROM bestellungen;
\`\`\``,
            keyTakeaways: [
              "FIRST_VALUE: Erster Wert im Frame",
              "LAST_VALUE: Letzter Wert im Frame — braucht expliziten Frame!",
              "NTH_VALUE(n): N-ter Wert im Frame",
              "Immer ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING für LAST_VALUE",
            ],
          },
        ],
      },
      {
        id: "ntile",
        title: "NTILE und PERCENT_RANK für Quantile",
        estimatedMinutes: 10,
        sections: [
          {
            id: "ntile-percent",
            title: "NTILE, PERCENT_RANK und CUME_DIST",
            sectionType: "theory",
            content: `**NTILE(n) — Zeilen in n gleich große Gruppen aufteilen:**
\`\`\`sql
-- Produkte in 4 Preis-Quartile aufteilen
SELECT name, preis,
  NTILE(4) OVER (ORDER BY preis) AS quartil
FROM produkte;
\`\`\`

---

**Ergebnis:**

| name | preis | quartil |
|------|-------|---------|
| Buch A | 10 | 1 |
| Buch B | 15 | 1 |
| T-Shirt | 25 | 2 |
| Hose | 40 | 2 |
| Schuhe | 80 | 3 |
| Laptop | 999 | 3 |
| TV | 1200 | 4 |

**PERCENT_RANK — Prozentualer Rang:**
\`\`\`sql
SELECT name, preis,
  PERCENT_RANK() OVER (ORDER BY preis) AS prozent_rang
FROM produkte;
\`\`\`

---

PERCENT_RANK gibt Werte zwischen 0 und 1 zurück. Der erste Wert ist immer 0.

**CUME_DIST — Kumulative Verteilung:**
\`\`\`sql
SELECT name, preis,
  CUME_DIST() OVER (ORDER BY preis) AS kum_verteilung
FROM produkte;
\`\`\`

---

CUME_DIST gibt den Anteil der Zeilen zurück, die kleiner oder gleich der aktuellen Zeile sind.

**Unterschied PERCENT_RANK vs. CUME_DIST:**

| Funktion | Formel | Bereich |
|----------|--------|---------|
| PERCENT_RANK | (Rang - 1) / (N - 1) | 0 bis 1 |
| CUME_DIST | Anzahl ≤ aktueller / N | 0 bis 1 |

**Praktisches Beispiel — Gehaltsquartile:**
\`\`\`sql
SELECT name, gehalt,
  NTILE(4) OVER (ORDER BY gehalt) AS gehalts_quartil,
  PERCENT_RANK() OVER (ORDER BY gehalt) AS prozent_rang
FROM mitarbeiter
ORDER BY gehalt;
\`\`\``,
            keyTakeaways: [
              "NTILE(n): Teilt Zeilen in n gleich große Gruppen",
              "PERCENT_RANK: Prozentualer Rang (0 bis 1)",
              "CUME_DIST: Kumulative Verteilung (Anteil ≤ aktueller Zeile)",
              "NTILE(4) = Quartile, NTILE(10) = Dezile",
            ],
          },
        ],
      },
      {
        id: "window-functions-praxis",
        title: "Window Functions in der Praxis",
        estimatedMinutes: 12,
        sections: [
          {
            id: "wf-praxis",
            title: "Praktische Anwendungsfälle",
            sectionType: "practice",
            content: `**1. Top-N pro Gruppe:**
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

---

**2. Running Total (Laufende Summe):**
\`\`\`sql
SELECT bestelldatum, betrag,
  SUM(betrag) OVER (ORDER BY bestelldatum
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS kumuliert
FROM bestellungen;
\`\`\`

---

**3. Gap Analysis (Lücken finden):**
\`\`\`sql
-- Fehlende Bestellnummern finden
SELECT id, NEXT_ID,
  CASE WHEN NEXT_ID - id > 1 THEN 'Lücke: ' || (NEXT_ID - id - 1) || ' fehlend'
       ELSE 'Keine Lücke' END AS luecke
FROM (
  SELECT id,
    LEAD(id) OVER (ORDER BY id) AS NEXT_ID
  FROM bestellungen
);
\`\`\`

---

**4. Jahr-über-Jahr-Vergleich:**
\`\`\`sql
SELECT jahr, umsatz,
  LAG(umsatz) OVER (ORDER BY jahr) AS vorjahr,
  umsatz - LAG(umsatz) OVER (ORDER BY jahr) AS differenz,
  ROUND((umsatz - LAG(umsatz) OVER (ORDER BY jahr)) * 100.0 /
    LAG(umsatz) OVER (ORDER BY jahr), 1) AS wachstum_prozent
FROM jahresumsatz;
\`\`\`

---

**5. Median berechnen:**
\`\`\`sql
WITH ranked AS (
  SELECT preis,
    ROW_NUMBER() OVER (ORDER BY preis) AS rn,
    COUNT(*) OVER () AS total
  FROM produkte
)
SELECT AVG(preis) AS median
FROM ranked
WHERE rn IN (total / 2, (total + 1) / 2);
\`\`\`

---

**6. Deduplizierung (Duplikate entfernen):**
\`\`\`sql
-- Nur die neueste Bestellung pro Kunde
SELECT kunde_id, bestelldatum, betrag
FROM (
  SELECT kunde_id, bestelldatum, betrag,
    ROW_NUMBER() OVER (PARTITION BY kunde_id ORDER BY bestelldatum DESC) AS rn
  FROM bestellungen
) ranked
WHERE rn = 1;
\`\`\``,
            keyTakeaways: [
              "Top-N: ROW_NUMBER() + WHERE rn <= N",
              "Running Total: SUM() OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING)",
              "Gap Analysis: LAG/LEAD für Lücken finden",
              "Jahr-über-Jahr: LAG für Vorjahresvergleich",
              "Deduplizierung: ROW_NUMBER() + WHERE rn = 1",
            ],
          },
        ],
      },
      {
        id: "window-functions-performance",
        title: "Window Functions Performance",
        estimatedMinutes: 10,
        sections: [
          {
            id: "wf-perf",
            title: "Performance-Tipps für Window Functions",
            sectionType: "theory",
            content: `**Window Functions können langsam sein** — besonders bei großen Datenmengen. Hier sind Performance-Tipps:

**1. Indizes auf ORDER BY-Spalten**
\`\`\`sql
-- Window Function mit ORDER BY
SELECT name, preis,
  ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn
FROM produkte;

-- Index erstellen für bessere Performance
CREATE INDEX idx_produkte_preis ON produkte(preis);
\`\`\`

---

**2. PARTITION BY statt Unterabfragen**
\`\`\`sql
-- LANGSAM: Korrelierte Unterabfrage
SELECT name, preis,
  (SELECT AVG(preis) FROM produkte p2 WHERE p2.kategorie = p1.kategorie)
FROM produkte p1;

-- SCHNELLER: Window Function
SELECT name, preis,
  AVG(preis) OVER (PARTITION BY kategorie) AS avg_preis
FROM produkte;
\`\`\`

---

**3. Window Functions reduzieren**
\`\`\`sql
-- LANGSAM: Mehrere Window Functions mit unterschiedlichen Partitionen
SELECT name, kategorie, preis,
  ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rn_kat,
  ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn_gesamt,
  AVG(preis) OVER (PARTITION BY kategorie) AS avg_kat,
  AVG(preis) OVER () AS avg_gesamt
FROM produkte;

-- SCHNELLER: Gleiche Partitionen zusammenfassen
-- (rn_kat und avg_kat haben dieselbe Partition)
\`\`\`

---

**4. Filtern VOR der Window Function**
\`\`\`sql
-- LANGSAM: Window Function über alle Zeilen, dann filtern
SELECT * FROM (
  SELECT name, preis, kategorie,
    ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rn
  FROM produkte
) WHERE rn <= 3;

-- SCHNELLER: Erst filtern, dann Window Function
SELECT * FROM (
  SELECT name, preis, kategorie,
    ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rn
  FROM produkte
  WHERE preis > 0  -- Filter VOR der Window Function
) WHERE rn <= 3;
\`\`\`

---

**5. EXPLAIN QUERY PLAN nutzen**
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT name, ROW_NUMBER() OVER (ORDER BY preis) FROM produkte;
\`\`\``,
            keyTakeaways: [
              "Indizes auf ORDER BY-Spalten verbessern die Performance",
              "PARTITION BY statt korrelierte Unterabfragen",
              "Gleiche Partitionen zusammenfassen",
              "Filtern VOR der Window Function (WHERE statt nachträglicher Filter)",
              "EXPLAIN QUERY PLAN für Performance-Analyse",
            ],
          },
        ],
      },
      {
        id: "window-functions-fehler",
        title: "Häufige Window Function-Fehler",
        estimatedMinutes: 10,
        sections: [
          {
            id: "wf-fehler-liste",
            title: "Die häufigsten Window Function-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: Window Function in WHERE verwenden**
\`\`\`sql
-- FALSCH: Window Function in WHERE
SELECT name, preis,
  ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn
FROM produkte
WHERE rn <= 3;  -- Fehler! rn ist in WHERE nicht verfügbar

-- RICHTIG: Unterabfrage verwenden
SELECT * FROM (
  SELECT name, preis,
    ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn
  FROM produkte
) ranked
WHERE rn <= 3;
\`\`\`

---

**Fehler 2: LAST_VALUE ohne expliziten Frame**
\`\`\`sql
-- FALSCH: LAST_VALUE gibt den aktuellen Wert zurück
SELECT name, preis,
  LAST_VALUE(preis) OVER (ORDER BY preis) AS letzter
FROM produkte;

-- RICHTIG: Expliziten Frame angeben
SELECT name, preis,
  LAST_VALUE(preis) OVER (
    ORDER BY preis
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS letzter
FROM produkte;
\`\`\`

---

**Fehler 3: RANK vs. ROW_NUMBER verwechseln**
\`\`\`sql
-- ROW_NUMBER: Jede Zeile bekommt eine eindeutige Nummer
-- RANK: Gleichstand = gleicher Rang, nächster Rang wird übersprungen
-- DENSE_RANK: Gleichstand = gleicher Rang, kein Sprung

-- Für "Top 3 pro Kategorie" ist ROW_NUMBER richtig:
SELECT * FROM (
  SELECT name, kategorie, preis,
    ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rn
  FROM produkte
) WHERE rn <= 3;
\`\`\`

---

**Fehler 4: PARTITION BY vergessen**
\`\`\`sql
-- FALSCH: Rang über alle Produkte (nicht pro Kategorie)
SELECT name, kategorie, preis,
  ROW_NUMBER() OVER (ORDER BY preis DESC) AS rang
FROM produkte;

-- RICHTIG: Rang pro Kategorie
SELECT name, kategorie, preis,
  ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rang
FROM produkte;
\`\`\`

---

**Fehler 5: ORDER BY im OVER() vergessen**
\`\`\`sql
-- FALSCH: Ohne ORDER BY ist die Reihenfolge undefiniert
SELECT name, ROW_NUMBER() OVER () AS rn FROM produkte;

-- RICHTIG: ORDER BY angeben
SELECT name, ROW_NUMBER() OVER (ORDER BY name) AS rn FROM produkte;
\`\`\``,
            keyTakeaways: [
              "Window Functions nicht in WHERE verwenden — Unterabfrage nötig",
              "LAST_VALUE braucht expliziten Frame (UNBOUNDED FOLLOWING)",
              "ROW_NUMBER vs. RANK vs. DENSE_RANK verstehen",
              "PARTITION BY nicht vergessen für gruppierte Berechnungen",
              "ORDER BY im OVER() angeben für deterministische Ergebnisse",
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // MODUL 11: Gruppierung & Aggregation
  // ═══════════════════════════════════════════════════════════════
  {
    id: "gruppierung-aggregation",
    title: "Gruppierung & Aggregation",
    description: "GROUP BY, HAVING und Aggregatfunktionen: Daten zusammenfassen und analysieren.",
    icon: "group",
    difficulty: "junior",
    articles: [
      {
        id: "aggregatfunktionen",
        title: "Aggregatfunktionen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "was-sind-aggregatfunktionen",
            title: "Was sind Aggregatfunktionen?",
            sectionType: "theory",
            content: `Aggregatfunktionen berechnen einen **einzelnen Wert** aus einer Menge von Zeilen. Sie sind das Werkzeug der Wahl, wenn du **Zusammenfassungen** brauchst — wie Durchschnitte, Summen oder Anzahlen.

Die wichtigsten Aggregatfunktionen in SQL:

| Funktion | Beschreibung | Beispiel |
|----------|-------------|----------|
| \`COUNT()\` | Anzahl der Zeilen | \`COUNT(*)\` — alle Zeilen zählen |
| \`SUM()\` | Summe einer Spalte | \`SUM(preis)\` — Gesamtpreis |
| \`AVG()\` | Durchschnittswert | \`AVG(gehalt)\` — Durchschnittsgehalt |
| \`MIN()\` | Kleinster Wert | \`MIN(datum)\` — frühestes Datum |
| \`MAX()\` | Größter Wert | \`MAX(umsatz)\` — höchster Umsatz |

---

\`\`\`sql
-- Wie viele Mitarbeiter gibt es?
SELECT COUNT(*) AS anzahl_mitarbeiter
FROM mitarbeiter;

-- Durchschnittsgehalt und höchstes Gehalt
SELECT
  AVG(gehalt) AS durchschnitt,
  MAX(gehalt) AS maximum
FROM mitarbeiter;
\`\`\`

**Wichtig:** \`COUNT(spalte)\` zählt nur Zeilen, in denen die Spalte **nicht NULL** ist. \`COUNT(*)\` zählt alle Zeilen.`,
            keyTakeaways: [
              "Aggregatfunktionen berechnen einen Wert aus vielen Zeilen",
              "COUNT(*) zählt alle Zeilen, COUNT(spalte) ignoriert NULL",
              "SUM, AVG, MIN, MAX arbeiten mit numerischen Werten",
              "Aggregatfunktionen ohne GROUP BY berechnen über die gesamte Tabelle",
            ],
          },
          {
            id: "aggregatfunktionen-null",
            title: "Aggregatfunktionen und NULL",
            sectionType: "theory",
            content: `NULL-Werte verhalten sich bei Aggregatfunktionen **besonders**:

- **\`COUNT(*)\`** zählt alle Zeilen, auch solche mit NULL
- **\`COUNT(spalte)\`** ignoriert Zeilen, in denen die Spalte NULL ist
- **\`SUM()\`**, **\`AVG()\`**, **\`MIN()\`**, **\`MAX()\`** ignorieren NULL-Werte komplett
- **\`AVG()\`** teilt nur durch die Anzahl der Nicht-NULL-Werte

---

\`\`\`sql
-- Beispiel: commission hat NULL-Werte
SELECT
  COUNT(*) AS alle_zeilen,          -- 10 (alle)
  COUNT(commission) AS mit_wert,    -- 7 (nur Nicht-NULL)
  AVG(commission) AS durchschnitt,  -- Durchschnitt der 7 Werte
  SUM(commission) AS summe          -- Summe der 7 Werte
FROM mitarbeiter;
\`\`\`

**Fallstrick:** \`AVG()\` berechnet den Durchschnitt nur über Nicht-NULL-Werte. Wenn du NULL als 0 behandeln willst, nutze \`COALESCE\`:

\`\`\`sql
SELECT AVG(COALESCE(commission, 0)) AS durchschnitt_mit_null
FROM mitarbeiter;
\`\`\``,
            keyTakeaways: [
              "COUNT(*) zählt alle Zeilen, COUNT(spalte) ignoriert NULL",
              "SUM, AVG, MIN, MAX ignorieren NULL-Werte",
              "AVG teilt nur durch Nicht-NULL-Zeilen — COALESCE für NULL=0",
              "Immer überlegen: Sollen NULL-Werte als 0 gezählt werden?",
            ],
          },
        ],
      },
      {
        id: "group-by",
        title: "GROUP BY — Daten gruppieren",
        estimatedMinutes: 12,
        sections: [
          {
            id: "group-by-grundlagen",
            title: "Grundlagen von GROUP BY",
            sectionType: "theory",
            content: `**GROUP BY** gruppiert Zeilen mit gleichen Werten in bestimmten Spalten. Für jede Gruppe wird **eine Ergebniszeile** erzeugt.

\`\`\`sql
-- Umsatz pro Kategorie
SELECT kategorie, SUM(umsatz) AS gesamtumsatz
FROM verkaeufe
GROUP BY kategorie;
\`\`\`

Ohne GROUP BY berechnet die Aggregatfunktion einen Wert über **alle** Zeilen. Mit GROUP BY berechnet sie einen Wert pro **Gruppe**.

---

\`\`\`sql
-- Anzahl Mitarbeiter pro Abteilung
SELECT abteilung, COUNT(*) AS anzahl
FROM mitarbeiter
GROUP BY abteilung
ORDER BY anzahl DESC;
\`\`\`

**Regel:** Jede Spalte im SELECT, die **keine** Aggregatfunktion ist, muss auch in GROUP BY stehen.`,
            keyTakeaways: [
              "GROUP BY erzeugt eine Zeile pro Gruppe gleicher Werte",
              "Alle Nicht-Aggregat-Spalten im SELECT müssen in GROUP BY stehen",
              "GROUP BY kann nach mehreren Spalten gruppieren",
              "Ohne GROUP BY berechnet die Aggregatfunktion über alle Zeilen",
            ],
          },
          {
            id: "group-by-mehrere-spalten",
            title: "Gruppierung nach mehreren Spalten",
            sectionType: "example",
            content: `Du kannst nach **mehreren Spalten** gleichzeitig gruppieren. Jede eindeutige Kombination bildet eine Gruppe.

\`\`\`sql
-- Umsatz pro Kategorie und Jahr
SELECT
  kategorie,
  jahr,
  SUM(umsatz) AS gesamt,
  AVG(umsatz) AS durchschnitt
FROM verkaeufe
GROUP BY kategorie, jahr
ORDER BY kategorie, jahr;
\`\`\`

---

\`\`\`sql
-- Mitarbeiter-Anzahl pro Abteilung und Standort
SELECT
  abteilung,
  standort,
  COUNT(*) AS anzahl,
  AVG(gehalt) AS avg_gehalt
FROM mitarbeiter
GROUP BY abteilung, standort
HAVING COUNT(*) > 1;
\`\`\`

Die Reihenfolge im GROUP BY bestimmt die Sortierung der Gruppen. Die Gruppierung nach \`kategorie, jahr\` ergibt andere Gruppen als \`jahr, kategorie\` — die Ergebnisse sind aber äquivalent, nur anders sortiert.`,
            keyTakeaways: [
              "GROUP BY kann nach mehreren Spalten gruppieren",
              "Jede eindeutige Kombination der GROUP BY-Spalten bildet eine Gruppe",
              "Reihenfolge im GROUP BY beeinflusst die Sortierung",
              "Aggregatfunktionen berechnen pro Gruppe",
            ],
          },
        ],
      },
      {
        id: "having",
        title: "HAVING — Gruppen filtern",
        estimatedMinutes: 10,
        sections: [
          {
            id: "having-grundlagen",
            title: "HAVING vs. WHERE",
            sectionType: "theory",
            content: `**HAVING** filtert **Gruppen** nach der Aggregation. **WHERE** filtert **Zeilen** vor der Aggregation.

\`\`\`sql
-- FALSCH: Aggregatfunktion in WHERE geht nicht!
SELECT abteilung, COUNT(*) AS anzahl
FROM mitarbeiter
WHERE COUNT(*) > 5  -- ❌ Fehler!
GROUP BY abteilung;

-- RICHTIG: HAVING für Gruppenfilter
SELECT abteilung, COUNT(*) AS anzahl
FROM mitarbeiter
GROUP BY abteilung
HAVING COUNT(*) > 5;  -- ✅
\`\`\`

---

**Die SQL-Ausführungsreihenfolge:**

1. \`FROM\` — Tabelle laden
2. \`WHERE\` — Zeilen filtern
3. \`GROUP BY\` — Gruppen bilden
4. \`HAVING\` — Gruppen filtern
5. \`SELECT\` — Spalten auswählen
6. \`ORDER BY\` — Sortieren

\`\`\`sql
-- Kombination: WHERE + GROUP BY + HAVING
SELECT kategorie, SUM(umsatz) AS gesamt
FROM verkaeufe
WHERE jahr = 2024          -- Zeilen vor Gruppierung filtern
GROUP BY kategorie
HAVING SUM(umsatz) > 10000; -- Gruppen nach Aggregation filtern
\`\`\``,
            keyTakeaways: [
              "HAVING filtert Gruppen, WHERE filtert Zeilen",
              "Aggregatfunktionen gehören in HAVING, nicht in WHERE",
              "Ausführungsreihenfolge: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
              "WHERE und HAVING können kombiniert werden",
            ],
          },
        ],
      },
      {
        id: "group-by-fallen",
        title: "Häufige Fehler bei GROUP BY",
        estimatedMinutes: 8,
        sections: [
          {
            id: "group-by-fehler-liste",
            title: "Die häufigsten GROUP BY-Fehler",
            sectionType: "theory",
            content: `**Fehler 1: Spalte im SELECT, aber nicht in GROUP BY**

\`\`\`sql
-- ❌ FALSCH: name ist nicht in GROUP BY
SELECT abteilung, name, COUNT(*)
FROM mitarbeiter
GROUP BY abteilung;

-- ✅ RICHTIG: name in GROUP BY aufnehmen oder weglassen
SELECT abteilung, COUNT(*)
FROM mitarbeiter
GROUP BY abteilung;
\`\`\`

---

**Fehler 2: Aggregatfunktion in WHERE**

\`\`\`sql
-- ❌ FALSCH
WHERE COUNT(*) > 5

-- ✅ RICHTIG
HAVING COUNT(*) > 5
\`\`\`

---

**Fehler 3: NULL-Werte in GROUP BY**

\`\`\`sql
-- NULL bildet eine eigene Gruppe!
SELECT abteilung, COUNT(*)
FROM mitarbeiter
GROUP BY abteilung;
-- Wenn abteilung NULL ist → eigene Gruppe "NULL"
\`\`\`

---

**Fehler 4: Falsche Reihenfolge**

\`\`\`sql
-- ❌ FALSCH: HAVING vor GROUP BY
HAVING COUNT(*) > 5
GROUP BY abteilung

-- ✅ RICHTIG: GROUP BY vor HAVING
GROUP BY abteilung
HAVING COUNT(*) > 5
\`\`\``,
            keyTakeaways: [
              "Nicht-Aggregat-Spalten müssen in GROUP BY stehen",
              "Aggregatfunktionen gehören in HAVING, nicht WHERE",
              "NULL-Werte bilden eine eigene Gruppe bei GROUP BY",
              "GROUP BY muss vor HAVING stehen",
            ],
          },
        ],
      },
      {
        id: "aggregation-praxis",
        title: "Aggregation in der Praxis",
        estimatedMinutes: 10,
        sections: [
          {
            id: "aggregation-praxis-beispiele",
            title: "Praktische Beispiele",
            sectionType: "example",
            content: `**Beispiel 1: Umsatzanalyse pro Kunde**

\`\`\`sql
SELECT
  kunde_id,
  COUNT(*) AS bestellungen,
  SUM(gesamtpreis) AS umsatz,
  AVG(gesamtpreis) AS durchschnittsbestellwert
FROM bestellungen
GROUP BY kunde_id
HAVING SUM(gesamtpreis) > 500
ORDER BY umsatz DESC;
\`\`\`

---

**Beispiel 2: Monatlicher Umsatzbericht**

\`\`\`sql
SELECT
  strftime('%Y-%m', bestelldatum) AS monat,
  COUNT(*) AS anzahl_bestellungen,
  SUM(gesamtpreis) AS monatsumsatz
FROM bestellungen
WHERE bestelldatum >= '2024-01-01'
GROUP BY strftime('%Y-%m', bestelldatum)
ORDER BY monat;
\`\`\`

---

**Beispiel 3: Top-Produkte**

\`\`\`sql
SELECT
  produktname,
  kategorie,
  SUM(menge) AS verkauft,
  SUM(menge * einzelpreis) AS umsatz
FROM bestellpositionen
GROUP BY produktname, kategorie
ORDER BY umsatz DESC
LIMIT 10;
\`\`\``,
            keyTakeaways: [
              "Aggregatfunktionen kombinierbar: COUNT + SUM + AVG in einer Abfrage",
              "strftime() für Datums-Gruppierung nutzen",
              "HAVING für Gruppenfilter, WHERE für Zeilenfilter",
              "ORDER BY + LIMIT für Top-N-Abfragen",
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // MODUL 12: Indizes & Performance
  // ═══════════════════════════════════════════════════════════════
  {
    id: "indizes-performance",
    title: "Indizes & Performance",
    description: "Index-Typen, Query-Optimierung und EXPLAIN: Abfragen schneller machen.",
    icon: "speed",
    difficulty: "intermediate",
    articles: [
      {
        id: "was-sind-indizes",
        title: "Was sind Indizes?",
        estimatedMinutes: 10,
        sections: [
          {
            id: "index-einfuehrung",
            title: "Indizes — Der Katalog einer Datenbank",
            sectionType: "theory",
            content: `Ein **Index** ist wie das Inhaltsverzeichnis eines Buchs: Statt alle Seiten durchzublättern, schlägst du im Verzeichnis nach und weißt sofort, wo du suchen musst.

Ohne Index muss die Datenbank bei einer Suche **jede Zeile** durchgehen (**Full Table Scan**). Mit Index springt sie direkt zur richtigen Stelle.

---

\`\`\`sql
-- Index erstellen
CREATE INDEX idx_mitarbeiter_name ON mitarbeiter(name);

-- Index nutzen (die Datenbank entscheidet selbst)
SELECT * FROM mitarbeiter WHERE name = 'Müller';
\`\`\`

**Wann Indizes helfen:**
- Suchen mit \`WHERE\` auf indizierte Spalten
- \`JOIN\`-Operationen über indizierte Fremdschlüssel
- \`ORDER BY\` auf indizierte Spalten
- \`GROUP BY\` auf indizierte Spalten

**Wann Indizes nicht helfen:**
- Kleine Tabellen (< 100 Zeilen)
- Abfragen, die die meiste Tabelle zurückgeben
- Spalten mit sehr wenigen unterschiedlichen Werten (niedrige Selektivität)`,
            keyTakeaways: [
              "Ein Index ist wie ein Inhaltsverzeichnis — beschleunigt die Suche",
              "Ohne Index: Full Table Scan (jede Zeile wird geprüft)",
              "Indizes helfen bei WHERE, JOIN, ORDER BY, GROUP BY",
              "Nicht jede Spalte braucht einen Index",
            ],
          },
          {
            id: "index-vor-nachteile",
            title: "Vor- und Nachteile von Indizes",
            sectionType: "theory",
            content: `**Vorteile von Indizes:**
- Schnellere \`SELECT\`-Abfragen (Faktor 10-1000x möglich)
- Schnellere \`JOIN\`-Operationen
- Eindeutigkeits-Constraint (\`UNIQUE INDEX\`)

**Nachteile von Indizes:**
- Zusätzlicher Speicherplatz (10-30% der Tabellengröße)
- Langsamere \`INSERT\`, \`UPDATE\`, \`DELETE\` (Index muss mitgepflegt werden)
- Overhead bei der Abfrageoptimierung

---

\`\`\`sql
-- Index mit Eindeutigkeit
CREATE UNIQUE INDEX idx_email ON benutzer(email);

-- Index wieder löschen
DROP INDEX idx_email;
\`\`\`

**Faustregel:** Erstelle Indizes für Spalten, die häufig in \`WHERE\`-Klauseln, \`JOIN\`-Bedingungen oder \`ORDER BY\` vorkommen. Vermeide zu viele Indizes — jeder Index kostet bei Schreiboperationen.`,
            keyTakeaways: [
              "Indizes beschleunigen Lesezugriff um Faktor 10-1000x",
              "Indizes verlangsamen Schreiboperationen (INSERT, UPDATE, DELETE)",
              "Indizes benötigen zusätzlichen Speicherplatz",
              "Faustregel: Index für häufig gefilterte/verknüpfte Spalten",
            ],
          },
        ],
      },
      {
        id: "index-typen",
        title: "Index-Typen",
        estimatedMinutes: 10,
        sections: [
          {
            id: "index-typen-uebersicht",
            title: "Arten von Indizes",
            sectionType: "theory",
            content: `**B-Tree-Index** (Standard)
Der häufigste Index-Typ. Geeignet für Gleichheit (\`=\`), Bereich (\`<\`, \`>\`, \`BETWEEN\`) und Präfix-Suchen (\`LIKE 'abc%'\`).

\`\`\`sql
CREATE INDEX idx_name ON kunden(name);
\`\`\`

---

**Unique Index**
Stellt sicher, dass kein doppelter Wert in der Spalte vorkommt.

\`\`\`sql
CREATE UNIQUE INDEX idx_email ON benutzer(email);
\`\`\`

---

**Composite Index** (Mehrspaltiger Index)
Index über mehrere Spalten. Die Reihenfolge der Spalten ist wichtig!

\`\`\`sql
-- Index über (nachname, vorname)
CREATE INDEX idx_name ON kunden(nachname, vorname);

-- ✅ Nutzt den Index: WHERE nachname = 'Müller'
-- ✅ Nutzt den Index: WHERE nachname = 'Müller' AND vorname = 'Anna'
-- ❌ Nutzt den Index NICHT: WHERE vorname = 'Anna'
\`\`\`

**Regel:** Die linke Spalte (Leading Column) muss in der WHERE-Klausel vorkommen.

---

**Covering Index**
Ein Index, der alle abgefragten Spalten enthält — die Datenbank muss gar nicht auf die Tabelle zugreifen.

\`\`\`sql
CREATE INDEX idx_covering ON bestellungen(kunde_id, bestelldatum, gesamtpreis);

-- Diese Abfrage wird komplett aus dem Index beantwortet:
SELECT bestelldatum, gesamtpreis
FROM bestellungen
WHERE kunde_id = 42;
\`\`\``,
            keyTakeaways: [
              "B-Tree: Standard-Index für =, <, >, BETWEEN, LIKE-Präfix",
              "Unique Index: Verhindert doppelte Werte",
              "Composite Index: Mehrere Spalten, Reihenfolge wichtig",
              "Covering Index: Alle abgefragten Spalten im Index",
            ],
          },
        ],
      },
      {
        id: "explain-analyse",
        title: "EXPLAIN — Abfragen analysieren",
        estimatedMinutes: 10,
        sections: [
          {
            id: "explain-grundlagen",
            title: "EXPLAIN und EXPLAIN QUERY PLAN",
            sectionType: "theory",
            content: `**EXPLAIN** zeigt dir, wie die Datenbank eine Abfrage ausführt — bevor sie wirklich ausgeführt wird.

\`\`\`sql
-- SQLite: Query-Plan anzeigen
EXPLAIN QUERY PLAN
SELECT * FROM mitarbeiter WHERE abteilung = 'IT';
\`\`\`

**Mögliche Ausgabe:**

| id | parent | notused | detail |
|----|--------|---------|--------|
| 2 | 0 | 0 | SEARCH mitarbeiter USING INDEX idx_abteilung |
| 3 | 0 | 0 | **SCAN** mitarbeiter |

---

**Wichtige Begriffe:**

- **SCAN** = Full Table Scan (kein Index genutzt) — langsam bei großen Tabellen
- **SEARCH** = Index wird genutzt — schnell
- **USING INDEX** = Welcher Index verwendet wird

\`\`\`sql
-- Ohne Index: SCAN
EXPLAIN QUERY PLAN SELECT * FROM kunden WHERE stadt = 'Berlin';
-- → SCAN TABLE kunden

-- Mit Index: SEARCH
CREATE INDEX idx_stadt ON kunden(stadt);
EXPLAIN QUERY PLAN SELECT * FROM kunden WHERE stadt = 'Berlin';
-- → SEARCH TABLE kunden USING INDEX idx_stadt
\`\`\`

**Tipp:** Nutze EXPLAIN QUERY PLAN regelmäßig, um zu prüfen, ob deine Indizes auch wirklich verwendet werden.`,
            keyTakeaways: [
              "EXPLAIN QUERY PLAN zeigt den Ausführungsplan einer Abfrage",
              "SCAN = Full Table Scan (langsam), SEARCH = Index genutzt (schnell)",
              "Indizes werden nicht immer automatisch genutzt",
              "EXPLAIN regelmäßig nutzen, um Abfragen zu optimieren",
            ],
          },
        ],
      },
      {
        id: "index-best-practices",
        title: "Index-Best-Practices",
        estimatedMinutes: 10,
        sections: [
          {
            id: "index-tipps",
            title: "Tipps für den Umgang mit Indizes",
            sectionType: "theory",
            content: `**1. Indexe für WHERE-Klauseln erstellen**

\`\`\`sql
-- Häufige Abfrage:
SELECT * FROM bestellungen WHERE status = 'offen';
-- → Index erstellen:
CREATE INDEX idx_status ON bestellungen(status);
\`\`\`

---

**2. Fremdschlüssel indizieren**

\`\`\`sql
-- JOIN über kunde_id → Index auf kunde_id
CREATE INDEX idx_bestellung_kunde ON bestellungen(kunde_id);
\`\`\`

---

**3. Selektivität beachten**

Ein Index ist am effektivsten, wenn die Spalte viele **verschiedene** Werte hat. Eine Spalte mit nur 2 Werten (z.B. \`geschlecht\`) profitiert kaum von einem Index.

---

**4. Nicht zu viele Indizes**

Jeder Index kostet bei \`INSERT\`, \`UPDATE\` und \`DELETE\`. Als Faustregel: **3-5 Indizes pro Tabelle** sind meist ausreichend.

---

**5. Composite Index: Reihenfolge beachten**

\`\`\`sql
-- Index: (nachname, vorname)
-- ✅ WHERE nachname = 'Müller' → nutzt Index
-- ✅ WHERE nachname = 'Müller' AND vorname = 'Anna' → nutzt Index
-- ❌ WHERE vorname = 'Anna' → nutzt Index NICHT
\`\`\`

Die **linke** Spalte muss immer in der WHERE-Klausel vorkommen (Leftmost Prefix Rule).`,
            keyTakeaways: [
              "Indizes für häufige WHERE-Klauseln und JOIN-Spalten erstellen",
              "Fremdschlüssel sollten immer indiziert sein",
              "Hohe Selektivität = guter Index (viele verschiedene Werte)",
              "3-5 Indizes pro Tabelle als Faustregel",
              "Bei Composite Index: Reihenfolge beachten (Leftmost Prefix Rule)",
            ],
          },
        ],
      },
      {
        id: "performance-fehler",
        title: "Häufige Performance-Fallen",
        estimatedMinutes: 8,
        sections: [
          {
            id: "performance-anti-patterns",
            title: "Performance-Anti-Patterns",
            sectionType: "theory",
            content: `**Anti-Pattern 1: Funktion auf indizierte Spalte**

\`\`\`sql
-- ❌ Index wird NICHT genutzt
SELECT * FROM kunden WHERE LOWER(name) = 'müller';

-- ✅ Index wird genutzt
SELECT * FROM kunden WHERE name = 'Müller';
\`\`\`

---

**Anti-Pattern 2: LIKE mit Wildcard am Anfang**

\`\`\`sql
-- ❌ Index wird NICHT genutzt
SELECT * FROM kunden WHERE name LIKE '%ller';

-- ✅ Index wird genutzt (Präfix-Suche)
SELECT * FROM kunden WHERE name LIKE 'Mül%';
\`\`\`

---

**Anti-Pattern 3: OR mit verschiedenen Spalten**

\`\`\`sql
-- ❌ Oft langsamer als UNION
SELECT * FROM kunden WHERE stadt = 'Berlin' OR plz = '10115';

-- ✅ Besser: UNION ALL
SELECT * FROM kunden WHERE stadt = 'Berlin'
UNION ALL
SELECT * FROM kunden WHERE plz = '10115' AND stadt != 'Berlin';
\`\`\`

---

**Anti-Pattern 4: SELECT \***

\`\`\`sql
-- ❌ Alle Spalten laden (auch ungenutzte)
SELECT * FROM kunden WHERE stadt = 'Berlin';

-- ✅ Nur benötigte Spalten laden
SELECT id, name, email FROM kunden WHERE stadt = 'Berlin';
\`\`\`

---

**Anti-Pattern 5: Implizite Typumwandlung**

\`\`\`sql
-- ❌ Spalte ist INTEGER, Vergleich mit STRING → kein Index
SELECT * FROM bestellungen WHERE kunde_id = '42';

-- ✅ Richtiger Typ
SELECT * FROM bestellungen WHERE kunde_id = 42;
\`\`\``,
            keyTakeaways: [
              "Keine Funktionen auf indizierte Spalten in WHERE anwenden",
              "LIKE '%...' nutzt keinen Index — LIKE 'prefix%' schon",
              "SELECT * vermeiden — nur benötigte Spalten abfragen",
              "Implizite Typumwandlung verhindert Index-Nutzung",
              "OR mit verschiedenen Spalten oft durch UNION ALL lösbar",
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