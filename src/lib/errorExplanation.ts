/**
 * Fehlererklaerungs-Engine (Error Explanation Engine)
 *
 * Uebersetzt gaengige SQL-/SQLite-Fehlermeldungen in benutzerfreundliche
 * deutsche Erklaerungen, kategorisiert nach Schweregrad.
 *
 * English: Translates common SQL/SQLite error messages into user-friendly
 * German explanations, categorised by severity.
 */

import type { SqlErrorExplanation } from "@/types/playground";

/** Fehlermuster mit Regex, Kategorie, Schweregrad und deutscher Benutzermeldung. */
interface ErrorPattern {
  pattern: RegExp;
  category: string;
  severity: "error" | "warning" | "info";
  userMessage: string;
}

/** Liste aller Fehlermuster, geordnet von spezifisch bis generisch. */
const patterns: ErrorPattern[] = [
  // Syntaxfehler
  {
    pattern: /near\s+".*?":\s*syntax\s*error/i,
    category: "Syntaxfehler",
    severity: "error",
    userMessage: "Es gibt einen Syntaxfehler in deiner Abfrage. Prüfe, ob alle Schlüsselwörter (z. B. SELECT, FROM, WHERE) korrekt geschrieben sind und alle Klammern geschlossen sind.",
  },
  // MySQL-artige Syntaxfehler (vom mysqlCompat Error-Mapper)
  {
    pattern: /You have an error in your SQL syntax/i,
    category: "Syntaxfehler",
    severity: "error",
    userMessage: "Es gibt einen Syntaxfehler in deiner Abfrage. Prüfe, ob alle Schlüsselwörter korrekt geschrieben sind, alle Klammern geschlossen sind und Kommas an der richtigen Stelle stehen.",
  },
  {
    pattern: /unrecognized\s*token/i,
    category: "Syntaxfehler",
    severity: "error",
    userMessage: "Ein Wort oder Zeichen in deiner Abfrage wird nicht erkannt. Achte auf Tippfehler bei Tabellennamen oder SQL-Schlüsselwörtern.",
  },
  {
    pattern: /incomplete\s*input/i,
    category: "Syntaxfehler",
    severity: "error",
    userMessage: "Die Abfrage scheint unvollständig zu sein. Vielleicht fehlt ein Semikolon am Ende oder ein wichtiger Teil wie das Schlüsselwort FROM.",
  },
  {
    pattern: /RIGHT\s+and\s+FULL\s+OUTER\s+JOINs\s+are\s+not\s+currently\s+supported/i,
    category: "Syntaxfehler",
    severity: "error",
    userMessage: "RIGHT JOIN wird automatisch zu LEFT JOIN umgeschrieben. FULL OUTER JOIN wird nicht unterstützt — verwende stattdessen einen UNION von zwei LEFT JOINs.",
  },
  // Fehlende/unbekannte Objekte
  {
    pattern: /Unknown\s+column\s+'[^']*kunden_id[^']*'/i,
    category: "Objekt nicht gefunden",
    severity: "error",
    userMessage: "Die Spalte 'kunden_id' existiert nicht. Der korrekte Fremdschlüsselname lautet 'kunde_id' (ohne 'n') – prüfe deinen JOIN-Ausdruck.",
  },
  {
    pattern: /Table\s+'.*?'\s+doesn't\s+exist/i,
    category: "Objekt nicht gefunden",
    severity: "error",
    userMessage: "Die angegebene Tabelle existiert nicht in der aktuellen Datenbank. Prüfe den Tabellennamen auf Tippfehler.",
  },
  {
    pattern: /Unknown\s+column\s+'/i,
    category: "Objekt nicht gefunden",
    severity: "error",
    userMessage: "Die angegebene Spalte existiert nicht in dieser Tabelle. Prüfe den Spaltennamen auf Tippfehler oder verwende einen Alias.",
  },
  {
    pattern: /no\s+such\s+table/i,
    category: "Objekt nicht gefunden",
    severity: "error",
    userMessage: "Die angegebene Tabelle existiert nicht in der aktuellen Datenbank. Prüfe den Tabellennamen auf Tippfehler und achte auf Groß-/Kleinschreibung.",
  },
  {
    pattern: /no\s+such\s+column/i,
    category: "Objekt nicht gefunden",
    severity: "error",
    userMessage: "Die angegebene Spalte existiert nicht in dieser Tabelle. Prüfe den Spaltennamen auf Tippfehler oder verwende einen Alias aus einer Unterabfrage.",
  },
  {
    pattern: /no\s+such\s+function/i,
    category: "Objekt nicht gefunden",
    severity: "error",
    userMessage: "Die verwendete Funktion existiert nicht. Prüfe den Funktionsnamen auf Tippfehler oder ob sie verfügbar ist.",
  },
  // Datentyp-Fehler
  {
    pattern: /datatype\s*mismatch/i,
    category: "Datentyp-Fehler",
    severity: "error",
    userMessage: "Du vergleichst Werte unterschiedlicher Datentypen (z. B. Text mit Zahl). Stelle sicher, dass beide Seiten des Vergleichs den gleichen Typ haben.",
  },
  {
    pattern: /cannot\s*store\s*.*?\s*value\s*in\s*column/i,
    category: "Datentyp-Fehler",
    severity: "error",
    userMessage: "Du versuchst, einen Wert in eine Spalte zu speichern, der nicht zum Datentyp der Spalte passt (z. B. Text in eine Zahlenspalte).",
  },
  // Aggregationsfehler
  {
    pattern: /misuse\s+of\s+aggregate/i,
    category: "Aggregationsfehler",
    severity: "error",
    userMessage: "Du verwendest eine Aggregatfunktion (z. B. SUM, COUNT) falsch. Achte darauf, dass Spalten ohne Aggregatfunktion im GROUP BY stehen.",
  },
  {
    pattern: /a\s*GROUP\s*BY\s*clause\s*is\s*required/i,
    category: "Aggregationsfehler",
    severity: "error",
    userMessage: "Wenn du Aggregatfunktionen und normale Spalten gleichzeitig abfragst, musst du die normalen Spalten im GROUP BY auflisten.",
  },
  {
    pattern: /HAVING\s*clause\s*on\s*a\s*non-aggregate\s*query/i,
    category: "Aggregationsfehler",
    severity: "error",
    userMessage: "HAVING darf nur in Verbindung mit GROUP BY verwendet werden. Für einfache Filter nutze stattdessen WHERE.",
  },
  // JOIN-Fehler
  {
    pattern: /ambiguous\s+column\s+name/i,
    category: "JOIN-Fehler",
    severity: "error",
    userMessage: "Ein Spaltenname ist mehrdeutig, weil er in mehreren Tabellen vorkommt. Gib den Spaltennamen mit dem Tabellennamen oder Alias an (z. B. tabelle.spalte).",
  },
  {
    pattern: /ON\s+CLAUSE/i,
    category: "JOIN-Fehler",
    severity: "error",
    userMessage: "Bei einem JOIN fehlt oder ist die ON-Bedingung falsch. Prüfe, ob du die richtigen Spalten zum Verknüpfen der Tabellen angegeben hast.",
  },
  // Unterabfrage-Fehler
  {
    pattern: /subquery\s+returns\s+more\s+than\s+one\s+row/i,
    category: "Unterabfrage-Fehler",
    severity: "error",
    userMessage: "Eine Unterabfrage liefert mehrere Zeilen zurück, dort aber nur eine erlaubt ist. Nutze IN, EXISTS oder eine Aggregatfunktion, um das zu beheben.",
  },
  {
    pattern: /subquery\s+misuse/i,
    category: "Unterabfrage-Fehler",
    severity: "error",
    userMessage: "Die Unterabfrage ist an dieser Stelle nicht erlaubt. Prüfe, ob du = statt IN verwendest oder die Unterabfrage in der richtigen Klausel steht.",
  },
  // Division / mathematische Fehler
  {
    pattern: /division\s+by\s+zero/i,
    category: "Mathematischer Fehler",
    severity: "error",
    userMessage: "Division durch Null ist nicht erlaubt. Füge eine Bedingung hinzu, die sicherstellt, dass der Divisor nicht null ist.",
  },
  {
    pattern: /string\s+or\s+blob\s+too\s+big/i,
    category: "Datenfehler",
    severity: "error",
    userMessage: "Ein Text oder Blob ist zu groß für die Operation. Prüfe, ob du versehentlich sehr große Werte vergleichst oder verkettest.",
  },
  // Einschraenkung / Fremdschluessel-Fehler (spezifisch vor generisch)
  {
    pattern: /Duplicate entry for key/i,
    category: "Einschränkung verletzt",
    severity: "error",
    userMessage: "Ein UNIQUE-Constraint oder PRIMARY KEY wurde verletzt. Es gibt bereits einen Datensatz mit dem gleichen Wert. Prüfe, ob du einen doppelten Wert einfügst.",
  },
  {
    pattern: /Column\s+'.*?'\s+cannot\s+be\s+null/i,
    category: "Einschränkung verletzt",
    severity: "error",
    userMessage: "Eine NOT-NULL-Spalte darf nicht leer sein. Stelle sicher, dass du für alle Pflichtspalten einen Wert angibst.",
  },
  {
    pattern: /Cannot add or update a child row.*foreign key/i,
    category: "Fremdschlüssel-Fehler",
    severity: "error",
    userMessage: "Ein Fremdschlüssel wurde verletzt. Stelle sicher, dass der referenzierte Datensatz in der Zieltabelle existiert.",
  },
  {
    pattern: /UNIQUE\s+constraint\s+failed/i,
    category: "Einschränkung verletzt",
    severity: "error",
    userMessage: "Ein UNIQUE-Constraint wurde verletzt. Es gibt bereits einen Datensatz mit dem gleichen Wert. Prüfe, ob du einen doppelten Wert einfügst.",
  },
  {
    pattern: /NOT\s+NULL\s+constraint\s+failed/i,
    category: "Einschränkung verletzt",
    severity: "error",
    userMessage: "Eine NOT-NULL-Spalte darf nicht leer sein. Stelle sicher, dass du für alle Pflichtspalten einen Wert angibst.",
  },
  {
    pattern: /foreign\s+key\s+constraint\s+failed/i,
    category: "Fremdschlüssel-Fehler",
    severity: "error",
    userMessage: "Ein Fremdschlüssel wurde verletzt. Stelle sicher, dass der referenzierte Datensatz in der Zieltabelle existiert.",
  },
  {
    pattern: /Check constraint violation/i,
    category: "Einschränkung verletzt",
    severity: "error",
    userMessage: "Ein CHECK-Constraint wurde verletzt. Prüfe, ob der eingefügte Wert die definierte Bedingung erfüllt.",
  },
  {
    pattern: /constraint\s+failed/i,
    category: "Einschränkung verletzt",
    severity: "error",
    userMessage: "Eine Regel der Datenbank wurde verletzt (z. B. NOT NULL oder UNIQUE). Prüfe, ob du alle Pflichtspalten mit gültigen Werten versorgst.",
  },
  // DDL-Fehler
  {
    pattern: /Table\s+'.*?'\s+already\s+exists/i,
    category: "DDL-Fehler",
    severity: "error",
    userMessage: "Eine Tabelle mit diesem Namen existiert bereits. Verwende einen anderen Namen oder DROP TABLE vor dem Erstellen.",
  },
  {
    pattern: /table\s+\S+\s+already\s+exists/i,
    category: "DDL-Fehler",
    severity: "error",
    userMessage: "Eine Tabelle mit diesem Namen existiert bereits. Verwende einen anderen Namen oder DROP TABLE vor dem Erstellen.",
  },
  {
    pattern: /index\s+\S+\s+already\s+exists/i,
    category: "DDL-Fehler",
    severity: "error",
    userMessage: "Ein Index mit diesem Namen existiert bereits. Verwende einen anderen Namen oder DROP INDEX vor dem Erstellen.",
  },
  // SELECT/DISTINCT-Fehler
  {
    pattern: /SELECT\s+DISTINCT/i,
    category: "Syntaxfehler",
    severity: "info",
    userMessage: "Prüfe, ob du DISTINCT korrekt verwendest. Es gehört direkt nach SELECT: SELECT DISTINCT spalte FROM tabelle.",
  },
  // ORDER BY / LIMIT
  {
    pattern: /ORDER\s+BY\s+should\s+appear/i,
    category: "Reihenfolge-Fehler",
    severity: "warning",
    userMessage: "ORDER BY muss nach GROUP BY und vor LIMIT stehen. Prüfe die Reihenfolge deiner SQL-Klauseln.",
  },
  {
    pattern: /LIMIT\s+clause\s+should\s+come\s+after/i,
    category: "Reihenfolge-Fehler",
    severity: "warning",
    userMessage: "LIMIT muss nach ORDER BY stehen. Prüfe die Reihenfolge deiner SQL-Klauseln.",
  },
  // Auffangregel fuer nicht spezifisch erkannte Fehler
  {
    pattern: /.*/,
    category: "Allgemeiner SQL-Fehler",
    severity: "error",
    userMessage: "Es ist ein SQL-Fehler aufgetreten. Lies die Fehlermeldung sorgfältig und prüfe Syntax, Tabellennamen und Spaltennamen.",
  },
];

/**
 * Erkennt den Fehlertyp und liefert eine benutzerfreundliche deutsche Erklaerung.
 * @param originalError - Die urspruengliche SQLite-Fehlermeldung.
 * @returns Strukturierte Fehlererklaerung mit Kategorie, Schweregrad und deutschem Hinweis.
 */
export function explainError(originalError: string): SqlErrorExplanation {
  for (const p of patterns) {
    if (p.pattern.test(originalError)) {
      return {
        originalError,
        userMessage: p.userMessage,
        severity: p.severity,
        category: p.category,
      };
    }
  }
  // Sollte wegen der Auffangregel nie erreicht werden, aber als Sicherheit beibehalten
  return {
    originalError,
    userMessage: "Ein unbekannter Fehler ist aufgetreten. Versuche die Abfrage zu vereinfachen und Schritt für Schritt zu testen.",
    severity: "error",
    category: "Unbekannt",
  };
}
