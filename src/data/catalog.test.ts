/**
 * Katalog-Tests – Prueft Integritaet und Vollstaendigkeit des Uebungskatalogs.
 * Ueberprueft Datensaetze, Lektionen, Uebungsverknuepfungen und IDs.
 */
import { catalog, allExerciseIds, allLessonIds } from "@/data/catalog";

describe("Catalog", () => {
  it("should contain all 18 datasets (10 standard + 8 story)", () => {
    expect(Object.keys(catalog.datasets)).toHaveLength(18);
    expect(catalog.datasets["shop"]).toBeDefined();
    expect(catalog.datasets["fitness"]).toBeDefined();
    expect(catalog.datasets["hr"]).toBeDefined();
    expect(catalog.datasets["tickets"]).toBeDefined();
    expect(catalog.datasets["banking"]).toBeDefined();
    expect(catalog.datasets["streaming"]).toBeDefined();
    expect(catalog.datasets["logs"]).toBeDefined();
    expect(catalog.datasets["university"]).toBeDefined();
    expect(catalog.datasets["ecommerce"]).toBeDefined();
    expect(catalog.datasets["hospital"]).toBeDefined();
    // Story-exklusive Datensaetze
    expect(catalog.datasets["story-anna7"]).toBeDefined();
    expect(catalog.datasets["story-nexusmarkt"]).toBeDefined();
    expect(catalog.datasets["story-helpcore"]).toBeDefined();
    expect(catalog.datasets["story-neuronale-luecke"]).toBeDefined();
    expect(catalog.datasets["story-systemfehler-delta"]).toBeDefined();
    expect(catalog.datasets["story-rote-zone"]).toBeDefined();
    expect(catalog.datasets["story-ghost-protocol"]).toBeDefined();
    expect(catalog.datasets["story-geldstrom-omega"]).toBeDefined();
  });

  it("should contain at least 400 exercises", () => {
    expect(Object.keys(catalog.exercises).length).toBeGreaterThanOrEqual(400);
  });

  it("every exercise should reference a valid dataset", () => {
    for (const ex of Object.values(catalog.exercises)) {
      expect(catalog.datasets[ex.datasetId]).toBeDefined();
    }
  });

  it("every lesson should reference existing exercises", () => {
    for (const lesson of Object.values(catalog.lessons)) {
      for (const exId of lesson.exercises) {
        expect(catalog.exercises[exId]).toBeDefined();
      }
    }
  });

  it("should have 15 lessons", () => {
    expect(Object.keys(catalog.lessons)).toHaveLength(15);
  });

  it("allExerciseIds should match exercise count", () => {
    expect(allExerciseIds.length).toBe(Object.keys(catalog.exercises).length);
  });

  it("all exercise IDs should be unique", () => {
    const ids = Object.keys(catalog.exercises);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all exercises should have German descriptions", () => {
    for (const ex of Object.values(catalog.exercises)) {
      expect(ex.description.length).toBeGreaterThan(10);
      expect(ex.title.length).toBeGreaterThan(3);
      expect(ex.hints.length).toBeGreaterThanOrEqual(1);
      expect(ex.tags.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("all write-type exercises should have a hiddenTestQuery", () => {
    for (const ex of Object.values(catalog.exercises)) {
      if (ex.type === "write" || ex.type === "debug") {
        expect(ex.hiddenTests.length).toBeGreaterThanOrEqual(1);
        expect(ex.hiddenTests[0].query.length).toBeGreaterThan(5);
      }
    }
  });
});