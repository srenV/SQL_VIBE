/**
 * Unit-Tests fuer die Fehlererklaerungs-Engine (Error Explanation Engine).
 *
 * English: Unit tests for Error Explanation Engine.
 */

import { explainError } from "./errorExplanation";

describe("explainError", () => {
  it("explains syntax error", () => {
    const exp = explainError("near \"SLECT\": syntax error");
    expect(exp.category).toBe("Syntaxfehler");
    expect(exp.severity).toBe("error");
    expect(exp.userMessage).toContain("Syntaxfehler");
  });

  it("explains missing table", () => {
    const exp = explainError("no such table: usrs");
    expect(exp.category).toBe("Objekt nicht gefunden");
    expect(exp.userMessage).toContain("Tabelle existiert nicht");
  });

  it("explains missing column", () => {
    const exp = explainError("no such column: nme");
    expect(exp.category).toBe("Objekt nicht gefunden");
    expect(exp.userMessage).toContain("Spalte existiert nicht");
  });

  it("explains datatype mismatch", () => {
    const exp = explainError("datatype mismatch");
    expect(exp.category).toBe("Datentyp-Fehler");
    expect(exp.userMessage).toContain("Datentypen");
  });

  it("explains misuse of aggregate", () => {
    const exp = explainError("misuse of aggregate: MAX()");
    expect(exp.category).toBe("Aggregationsfehler");
    expect(exp.userMessage).toContain("Aggregatfunktion");
  });

  it("explains ambiguous column", () => {
    const exp = explainError("ambiguous column name: id");
    expect(exp.category).toBe("JOIN-Fehler");
    expect(exp.userMessage).toContain("mehrdeutig");
  });

  it("explains foreign key constraint failure", () => {
    const exp = explainError("FOREIGN KEY constraint failed");
    expect(exp.category).toBe("Fremdschlüssel-Fehler");
    expect(exp.userMessage).toContain("Fremdschlüssel");
  });

  it("explains division by zero", () => {
    const exp = explainError("division by zero");
    expect(exp.category).toBe("Mathematischer Fehler");
    expect(exp.userMessage).toContain("Division durch Null");
  });

  it("explains incomplete input", () => {
    const exp = explainError("incomplete input");
    expect(exp.category).toBe("Syntaxfehler");
    expect(exp.userMessage).toContain("unvollständig");
  });

  it("explains missing function", () => {
    const exp = explainError("no such function: ISNULL");
    expect(exp.category).toBe("Objekt nicht gefunden");
    expect(exp.userMessage).toContain("Funktion");
  });

  it("explains unsupported RIGHT JOIN", () => {
    const exp = explainError("RIGHT and FULL OUTER JOINs are not currently supported");
    expect(exp.category).toBe("Syntaxfehler");
    expect(exp.userMessage).toContain("RIGHT JOIN");
  });

  it("explains GROUP BY required", () => {
    const exp = explainError("a GROUP BY clause is required before HAVING");
    expect(exp.category).toBe("Aggregationsfehler");
    expect(exp.userMessage).toContain("GROUP BY");
  });

  it("explains LIMIT order error", () => {
    const exp = explainError("LIMIT clause should come after ORDER BY");
    expect(exp.category).toBe("Reihenfolge-Fehler");
    expect(exp.severity).toBe("warning");
  });

  it("falls back to generic for unknown errors", () => {
    const exp = explainError("some random unknown thing happened");
    expect(exp.category).toBe("Allgemeiner SQL-Fehler");
    expect(exp.severity).toBe("error");
    expect(exp.userMessage).toContain("SQL-Fehler");
  });

  it("explains UNIQUE constraint failure", () => {
    const exp = explainError("UNIQUE constraint failed: users.email");
    expect(exp.category).toBe("Einschränkung verletzt");
    expect(exp.userMessage).toContain("UNIQUE");
  });

  it("explains NOT NULL constraint failure", () => {
    const exp = explainError("NOT NULL constraint failed: users.name");
    expect(exp.category).toBe("Einschränkung verletzt");
    expect(exp.userMessage).toContain("NOT-NULL");
  });

  it("explains table already exists", () => {
    const exp = explainError("table users already exists");
    expect(exp.category).toBe("DDL-Fehler");
    expect(exp.userMessage).toContain("bereits");
  });

  it("explains store value type mismatch", () => {
    const exp = explainError("cannot store TEXT value in column id of type INTEGER");
    expect(exp.category).toBe("Datentyp-Fehler");
    expect(exp.userMessage).toContain("Datentyp");
  });

  it("explains HAVING without GROUP BY", () => {
    const exp = explainError("HAVING clause on a non-aggregate query");
    expect(exp.category).toBe("Aggregationsfehler");
    expect(exp.userMessage).toContain("HAVING");
  });

  it("explains string too big", () => {
    const exp = explainError("string or blob too big");
    expect(exp.category).toBe("Datenfehler");
    expect(exp.userMessage).toContain("groß");
  });
});
