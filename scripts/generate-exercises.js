const fs = require("fs");
const path = require("path");

const DATASET_IDS = [
  "shop", "fitness", "hr", "tickets", "banking", "streaming", "logs"
];

const DATASET_TABLES = {
  shop: {
    tables: ["kunden", "kategorien", "produkte", "bestellungen", "bestellpositionen", "zahlungen"],
    columns: {
      kunden: ["id", "name", "email", "stadt", "registriert_am"],
      produkte: ["id", "name", "kategorie_id", "preis", "lagerbestand"],
      bestellungen: ["id", "kunde_id", "datum", "gesamtbetrag", "status"],
      bestellpositionen: ["id", "bestellung_id", "produkt_id", "menge", "einzelpreis"],
      zahlungen: ["id", "bestellung_id", "betrag", "zahlungsmittel", "zahlungsdatum"],
    },
    sampleValues: {
      stadt: ["Berlin", "Muenchen", "Hamburg", "Koeln"],
      status: ["abgeschlossen", "versendet", "bearbeitung", "storniert"],
      zahlungsmittel: ["Kreditkarte", "PayFlow", "Ueberweisung"],
    },
  },
  fitness: {
    tables: ["nutzer", "uebungen", "workouts", "saetze", "koerperdaten"],
    columns: {
      nutzer: ["id", "name", "email", "geburtsdatum", "gewicht_kg", "groesse_cm", "registriert_am"],
      uebungen: ["id", "name", "muskelgruppe", "kategorie"],
      workouts: ["id", "nutzer_id", "datum", "dauer_min", "kalorien_verbrannt"],
      saetze: ["id", "workout_id", "uebung_id", "wiederholungen", "gewicht_kg", "satz_nr"],
    },
    sampleValues: {
      muskelgruppe: ["Brust", "Beine", "Ruecken", "Schultern", "Arme"],
      kategorie: ["Kraft", "Cardio", "Flexibilitaet"],
    },
  },
  hr: {
    tables: ["abteilungen", "mitarbeiter", "urlaub", "bewerbungen"],
    columns: {
      abteilungen: ["id", "name", "standort", "budget"],
      mitarbeiter: ["id", "name", "abteilung_id", "position", "gehalt", "einstiegsdatum", "manager_id"],
      urlaub: ["id", "mitarbeiter_id", "startdatum", "enddatum", "tage", "genehmigt"],
      bewerbungen: ["id", "name", "email", "abteilung_id", "bewerbungsdatum", "status"],
    },
    sampleValues: {
      standort: ["Berlin", "Muenchen", "Hamburg", "Koeln"],
      status: ["eingegangen", "gespraech", "angebot", "abgelehnt"],
      position: ["Senior Developer", "Developer", "Sales Manager", "Sales Representative", "Marketing Manager"],
    },
  },
  tickets: {
    tables: ["agenten", "kategorien", "tickets", "kommentare"],
    columns: {
      agenten: ["id", "name", "email", "team", "aktiv"],
      tickets: ["id", "titel", "beschreibung", "kategorie_id", "agent_id", "prioritaet", "status", "erstellt_am", "geschlossen_am"],
      kommentare: ["id", "ticket_id", "autor", "nachricht", "erstellt_am"],
    },
    sampleValues: {
      team: ["Technik", "Buchhaltung", "Account"],
      prioritaet: ["niedrig", "mittel", "hoch", "kritisch"],
      status: ["offen", "bearbeitung", "abgeschlossen"],
    },
  },
  banking: {
    tables: ["kunden", "konten", "transaktionen", "betrugsfaelle"],
    columns: {
      kunden: ["id", "name", "geburtsdatum", "adresse", "registriert_am"],
      konten: ["id", "kunde_id", "kontonummer", "typ", "saldo", "eroeffnet_am"],
      transaktionen: ["id", "konto_id", "betrag", "typ", "beschreibung", "datum"],
      betrugsfaelle: ["id", "transaktion_id", "grund", "status", "gemeldet_am"],
    },
    sampleValues: {
      typ: ["Girokonto", "Sparkonto"],
      status: ["untersuchung", "abgeschlossen"],
    },
  },
  streaming: {
    tables: ["nutzer", "filme", "watch_history", "bewertungen"],
    columns: {
      nutzer: ["id", "name", "email", "abonnement", "registriert_am"],
      filme: ["id", "titel", "genre", "jahr", "dauer_min", "bewertung"],
      watch_history: ["id", "nutzer_id", "film_id", "geschaut_am", "fortschritt_prozent"],
      bewertungen: ["id", "nutzer_id", "film_id", "sterne", "kommentar", "bewertet_am"],
    },
    sampleValues: {
      abonnement: ["Basic", "Standard", "Premium"],
      genre: ["Drama", "Sci-Fi", "Krimi", "Action", "Thriller", "Musical"],
    },
  },
  logs: {
    tables: ["events", "sessions", "fehler"],
    columns: {
      events: ["id", "session_id", "event_typ", "seite", "zeitpunkt", "dauer_ms"],
      sessions: ["id", "nutzer_id", "ip_adresse", "browser", "startzeit", "endzeit"],
      fehler: ["id", "event_id", "fehlercode", "nachricht", "schweregrad"],
    },
    sampleValues: {
      event_typ: ["page_view", "click", "checkout"],
      browser: ["Chrome", "Firefox", "Safari", "Edge"],
      schweregrad: ["warnung", "kritisch"],
    },
  },
};

let globalId = 0;
function nextId(prefix) {
  globalId++;
  return `${prefix}_${String(globalId).padStart(4, "0")}`;
}

function makeHints(hints) {
  return hints.map((text, i) => `      { level: ${i + 1}, text: "${text}" }`).join(",\n");
}

function buildWrite(prefix, opts) {
  return `  makeWriteExercise("${prefix}", {
    title: ${JSON.stringify(opts.title)},
    description: ${JSON.stringify(opts.description)},
    difficulty: "${opts.difficulty}",
    category: "${opts.category}",
    datasetId: "${opts.datasetId}",
    referenceQuery: \`${opts.referenceQuery}\`,
    expectedResultText: ${JSON.stringify(opts.expectedResultText || "")},
    tags: [${opts.tags.map(t => `"${t}"`).join(", ")}],
    hints: [
${opts.hints.map(h => `      ${JSON.stringify(h)}`).join(",\n")}
    ],
    hiddenTestQuery: \`${opts.hiddenTestQuery}\`,
    hiddenTestMode: "${opts.hiddenTestMode || "rows"}",
  })`;
}

function buildDebug(prefix, opts) {
  return `  makeDebugExercise("${prefix}", {
    title: ${JSON.stringify(opts.title)},
    description: ${JSON.stringify(opts.description)},
    difficulty: "${opts.difficulty}",
    category: "${opts.category}",
    datasetId: "${opts.datasetId}",
    brokenQuery: \`${opts.brokenQuery}\`,
    referenceQuery: \`${opts.referenceQuery}\`,
    expectedResultText: ${JSON.stringify(opts.expectedResultText || "")},
    tags: [${opts.tags.map(t => `"${t}"`).join(", ")}],
    hints: [
${opts.hints.map(h => `      ${JSON.stringify(h)}`).join(",\n")}
    ],
    hiddenTestQuery: \`${opts.hiddenTestQuery}\`,
    hiddenTestMode: "${opts.hiddenTestMode || "rows"}",
  })`;
}

function buildPredict(prefix, opts) {
  const options = opts.options.map((o, i) => `      { text: ${JSON.stringify(o.text)}, isCorrect: ${o.isCorrect} }`).join(",\n");
  return `  makePredictExercise("${prefix}", {
    title: ${JSON.stringify(opts.title)},
    description: ${JSON.stringify(opts.description)},
    difficulty: "${opts.difficulty}",
    category: "${opts.category}",
    datasetId: "${opts.datasetId}",
    question: ${JSON.stringify(opts.question)},
    options: [
${options}
    ],
    expectedResultText: ${JSON.stringify(opts.expectedResultText || "")},
    tags: [${opts.tags.map(t => `"${t}"`).join(", ")}],
    hints: [
${opts.hints.map(h => `      ${JSON.stringify(h)}`).join(",\n")}
    ],
  })`;
}

function buildSchema(prefix, opts) {
  const options = opts.options.map((o, i) => `      { text: ${JSON.stringify(o.text)}, isCorrect: ${o.isCorrect} }`).join(",\n");
  return `  makeSchemaExercise("${prefix}", {
    title: ${JSON.stringify(opts.title)},
    description: ${JSON.stringify(opts.description)},
    difficulty: "${opts.difficulty}",
    category: "${opts.category}",
    datasetId: "${opts.datasetId}",
    question: ${JSON.stringify(opts.question)},
    options: [
${options}
    ],
    expectedResultText: ${JSON.stringify(opts.expectedResultText || "")},
    tags: [${opts.tags.map(t => `"${t}"`).join(", ")}],
    hints: [
${opts.hints.map(h => `      ${JSON.stringify(h)}`).join(",\n")}
    ],
  })`;
}

// ============================================================
// WHERE / FILTER LOGIC
// ============================================================
function generateWhereExercises() {
  const exercises = [];
  const datasets = Object.keys(DATASET_TABLES);

  const whereTemplates = [
    {
      title: (table, col, val) => `${table} filtern nach ${col}`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` den Wert '${val}' hat.`,
      query: (table, col, val) => `SELECT * FROM ${table} WHERE ${col} = '${val}';`,
      hint1: (table, col, val) => `Verwende \`WHERE ${col} = '${val}'\`.`,
      hint2: (table, col) => `Die Tabelle heisst \`${table}\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col, val) => `${table} mit numerischem Filter`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` groesser als ${val} ist.`,
      query: (table, col, val) => `SELECT * FROM ${table} WHERE ${col} > ${val};`,
      hint1: (table, col, val) => `Verwende \`WHERE ${col} > ${val}\`.`,
      hint2: () => `Fuer Zahlen brauchst du keine Anfuehrungszeichen.`,
      difficulty: "beginner",
    },
    {
      title: (table, col, val) => `Negation in ${table}`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` ungleich '${val}' ist.`,
      query: (table, col, val) => `SELECT * FROM ${table} WHERE ${col} <> '${val}';`,
      hint1: (table, col, val) => `Verwende \`<>\` oder \`!=\` fuer Ungleich.`,
      hint2: () => `\`<>\` ist der SQL-Standard.`,
      difficulty: "beginner",
    },
    {
      title: (table, col, val) => `Bereichssuche in ${table}`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` zwischen ${val} und einem groesseren Wert liegt.`,
      query: (table, col, val) => `SELECT * FROM ${table} WHERE ${col} BETWEEN ${val} AND ${parseInt(val) + 1000};`,
      hint1: (table, col, val) => `Verwende \`BETWEEN ${val} AND ${parseInt(val) + 1000}\`.`,
      hint2: () => `BETWEEN ist inklusiv.`,
      difficulty: "junior",
    },
    {
      title: (table, col, val) => `Liste von Werten in ${table}`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` in einer Liste ist.`,
      query: (table, col, val) => {
        const vals = val.split(",").map(v => `'${v.trim()}'`).join(", ");
        return `SELECT * FROM ${table} WHERE ${col} IN (${vals});`;
      },
      hint1: () => `Verwende \`IN (... )\`.`,
      hint2: () => `Trenne die Werte durch Kommas.`,
      difficulty: "junior",
    },
    {
      title: (table, col, val) => `Muster-Suche in ${table}`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` mit '${val}' beginnt.`,
      query: (table, col, val) => `SELECT * FROM ${table} WHERE ${col} LIKE '${val}%';`,
      hint1: () => `Verwende \`LIKE\` mit \`%\` als Platzhalter.`,
      hint2: (table, col, val) => `\`${val}%\` bedeutet: beginnt mit '${val}'.`,
      difficulty: "junior",
    },
    {
      title: (table, col, val) => `IS NULL in ${table}`,
      desc: (table, col, val) => `Zeige alle Zeilen aus \`${table}\`, bei denen \`${col}\` NULL ist.`,
      query: (table, col) => `SELECT * FROM ${table} WHERE ${col} IS NULL;`,
      hint1: () => `Verwende \`IS NULL\` statt \`= NULL\`.`,
      hint2: () => `In SQL ist NULL ein spezieller Wert.`,
      difficulty: "beginner",
    },
  ];

  let count = 0;
  for (const dsId of datasets) {
    const ds = DATASET_TABLES[dsId];
    for (const table of ds.tables.slice(0, 3)) {
      const cols = ds.columns[table];
      if (!cols) continue;
      const col = cols[Math.floor(Math.random() * cols.length)];
      const sampleVals = ds.sampleValues;
      let val = "1";
      if (sampleVals && sampleVals[col]) {
        const arr = sampleVals[col];
        val = arr[Math.floor(Math.random() * arr.length)];
      } else if (col === "id") {
        val = "2";
      } else if (col.includes("preis") || col.includes("betrag") || col.includes("saldo") || col.includes("gehalt")) {
        val = "500";
      } else if (col.includes("jahr")) {
        val = "2010";
      } else if (col.includes("dauer") || col.includes("min") || col.includes("tage")) {
        val = "30";
      }

      const tmpl = whereTemplates[count % whereTemplates.length];
      exercises.push(buildWrite("whr", {
        title: tmpl.title(table, col, val),
        description: tmpl.desc(table, col, val),
        difficulty: tmpl.difficulty,
        category: "WHERE",
        datasetId: dsId,
        referenceQuery: tmpl.query(table, col, val),
        tags: ["WHERE", "Filter"],
        hints: [tmpl.hint1(table, col, val), tmpl.hint2(table, col)],
        hiddenTestQuery: tmpl.query(table, col, val),
        hiddenTestMode: "rows",
      }));
      count++;
      if (count >= 35) break;
    }
    if (count >= 35) break;
  }
  return exercises;
}

// ============================================================
// ORDER BY / LIMIT
// ============================================================
function generateOrderLimitExercises() {
  const exercises = [];
  const datasets = Object.keys(DATASET_TABLES);
  const templates = [
    {
      title: (table, col) => `${table} sortieren nach ${col}`,
      desc: (table, col) => `Gib alle Zeilen aus \`${table}\` aus, sortiert nach \`${col}\` aufsteigend.`,
      query: (table, col) => `SELECT * FROM ${table} ORDER BY ${col} ASC;`,
      hint1: (col) => `Verwende \`ORDER BY ${col} ASC\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `${table} absteigend sortieren`,
      desc: (table, col) => `Gib alle Zeilen aus \`${table}\` aus, sortiert nach \`${col}\` absteigend.`,
      query: (table, col) => `SELECT * FROM ${table} ORDER BY ${col} DESC;`,
      hint1: (col) => `Verwende \`ORDER BY ${col} DESC\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Top 5 aus ${table}`,
      desc: (table, col) => `Gib die ersten 5 Zeilen aus \`${table}\` aus, sortiert nach \`${col}\` absteigend.`,
      query: (table, col) => `SELECT * FROM ${table} ORDER BY ${col} DESC LIMIT 5;`,
      hint1: () => `Verwende \`LIMIT 5\` nach \`ORDER BY\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Erste 3 Eintraege aus ${table}`,
      desc: (table, col) => `Gib die ersten 3 Zeilen aus \`${table}\` aus, sortiert nach \`${col}\` aufsteigend.`,
      query: (table, col) => `SELECT * FROM ${table} ORDER BY ${col} ASC LIMIT 3;`,
      hint1: () => `Verwende \`LIMIT 3\` nach \`ORDER BY\`.`,
      difficulty: "beginner",
    },
  ];

  let count = 0;
  for (const dsId of datasets) {
    const ds = DATASET_TABLES[dsId];
    for (const table of ds.tables.slice(0, 2)) {
      const cols = ds.columns[table];
      if (!cols) continue;
      const col = cols[Math.floor(Math.random() * cols.length)];
      const tmpl = templates[count % templates.length];
      exercises.push(buildWrite("ord", {
        title: tmpl.title(table, col),
        description: tmpl.desc(table, col),
        difficulty: tmpl.difficulty,
        category: "ORDER BY / LIMIT",
        datasetId: dsId,
        referenceQuery: tmpl.query(table, col),
        tags: ["ORDER BY", "LIMIT", "Sortieren"],
        hints: [tmpl.hint1(col)],
        hiddenTestQuery: tmpl.query(table, col),
        hiddenTestMode: "exact",
      }));
      count++;
      if (count >= 25) break;
    }
    if (count >= 25) break;
  }
  return exercises;
}

// ============================================================
// AGGREGATION
// ============================================================
function generateAggregationExercises() {
  const exercises = [];
  const datasets = Object.keys(DATASET_TABLES);
  const templates = [
    {
      title: (table, col) => `Anzahl der Zeilen in ${table}`,
      desc: (table, col) => `Zaehle alle Zeilen in der Tabelle \`${table}\`.`,
      query: (table, col) => `SELECT COUNT(*) AS anzahl FROM ${table};`,
      hint1: () => `Verwende \`COUNT(*)\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Summe von ${col}`,
      desc: (table, col) => `Berechne die Summe der Spalte \`${col}\` in \`${table}\`.`,
      query: (table, col) => `SELECT SUM(${col}) AS gesamt FROM ${table};`,
      hint1: (col) => `Verwende \`SUM(${col})\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Durchschnitt von ${col}`,
      desc: (table, col) => `Berechne den Durchschnitt der Spalte \`${col}\` in \`${table}\`.`,
      query: (table, col) => `SELECT AVG(${col}) AS durchschnitt FROM ${table};`,
      hint1: (col) => `Verwende \`AVG(${col})\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Maximum von ${col}`,
      desc: (table, col) => `Finde den hoechsten Wert der Spalte \`${col}\` in \`${table}\`.`,
      query: (table, col) => `SELECT MAX(${col}) AS maximum FROM ${table};`,
      hint1: (col) => `Verwende \`MAX(${col})\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Minimum von ${col}`,
      desc: (table, col) => `Finde den niedrigsten Wert der Spalte \`${col}\` in \`${table}\`.`,
      query: (table, col) => `SELECT MIN(${col}) AS minimum FROM ${table};`,
      hint1: (col) => `Verwende \`MIN(${col})\`.`,
      difficulty: "beginner",
    },
    {
      title: (table, col) => `Gruppieren nach ${col}`,
      desc: (table, col) => `Zaehle die Zeilen in \`${table}\` gruppiert nach \`${col}\`.`,
      query: (table, col) => `SELECT ${col}, COUNT(*) AS anzahl FROM ${table} GROUP BY ${col};`,
      hint1: (col) => `Verwende \`GROUP BY ${col}\`.`,
      hint2: () => `COUNT(*) zaehlt die Zeilen pro Gruppe.`,
      difficulty: "junior",
    },
    {
      title: (table, col) => `HAVING in ${table}`,
      desc: (table, col) => `Gruppiere \`${table}\` nach \`${col}\` und zeige nur Gruppen mit mehr als einem Eintrag.`,
      query: (table, col) => `SELECT ${col}, COUNT(*) AS anzahl FROM ${table} GROUP BY ${col} HAVING COUNT(*) > 1;`,
      hint1: () => `Verwende \`HAVING\` nach \`GROUP BY\`.`,
      hint2: () => `HAVING filtert Gruppen, WHERE filtert Zeilen.`,
      difficulty: "junior",
    },
  ];

  let count = 0;
  for (const dsId of datasets) {
    const ds = DATASET_TABLES[dsId];
    for (const table of ds.tables.slice(0, 2)) {
      const cols = ds.columns[table];
      if (!cols) continue;
      const numericCols = cols.filter(c =>
        c.includes("preis") || c.includes("betrag") || c.includes("saldo") || c.includes("gehalt") ||
        c.includes("gewicht") || c.includes("dauer") || c.includes("min") || c.includes("tage") ||
        c.includes("jahr") || c.includes("anzahl") || c.includes("menge") || c.includes("sterne") ||
        c.includes("prozent") || c.includes("kalorien")
      );
      const groupCols = cols.filter(c =>
        !c.includes("id") && !c.includes("datum") && !c.includes("name") && !c.includes("titel") && !c.includes("beschreibung")
      );
      const col = (numericCols.length ? numericCols : cols)[0];
      const groupCol = groupCols.length ? groupCols[0] : cols[0];

      const tmpl = templates[count % templates.length];
      const testTitle = tmpl.title(table, col);
      const useCol = testTitle.includes("Gruppieren") || testTitle.includes("HAVING") ? groupCol : col;
      exercises.push(buildWrite("agg", {
        title: tmpl.title(table, useCol),
        description: tmpl.desc(table, useCol),
        difficulty: tmpl.difficulty,
        category: "Aggregation",
        datasetId: dsId,
        referenceQuery: tmpl.query(table, useCol),
        tags: ["Aggregation", "GROUP BY", "HAVING"],
        hints: [tmpl.hint1(useCol), tmpl.hint2 ? tmpl.hint2() : ""].filter(Boolean),
        hiddenTestQuery: tmpl.query(table, useCol),
        hiddenTestMode: "rows",
      }));
      count++;
      if (count >= 40) break;
    }
    if (count >= 40) break;
  }
  return exercises;
}

// ============================================================
// JOIN
// ============================================================
function generateJoinExercises() {
  const exercises = [];
  const joinPairs = [
    { ds: "shop", t1: "kunden", t2: "bestellungen", on: "kunden.id = bestellungen.kunde_id", col1: "name", col2: "gesamtbetrag" },
    { ds: "shop", t1: "produkte", t2: "kategorien", on: "produkte.kategorie_id = kategorien.id", col1: "produkte.name", col2: "kategorien.name" },
    { ds: "shop", t1: "bestellungen", t2: "zahlungen", on: "bestellungen.id = zahlungen.bestellung_id", col1: "status", col2: "betrag" },
    { ds: "fitness", t1: "nutzer", t2: "workouts", on: "nutzer.id = workouts.nutzer_id", col1: "nutzer.name", col2: "dauer_min" },
    { ds: "fitness", t1: "workouts", t2: "saetze", on: "workouts.id = saetze.workout_id", col1: "datum", col2: "wiederholungen" },
    { ds: "hr", t1: "mitarbeiter", t2: "abteilungen", on: "mitarbeiter.abteilung_id = abteilungen.id", col1: "mitarbeiter.name", col2: "abteilungen.name" },
    { ds: "hr", t1: "mitarbeiter", t2: "urlaub", on: "mitarbeiter.id = urlaub.mitarbeiter_id", col1: "name", col2: "tage" },
    { ds: "tickets", t1: "tickets", t2: "agenten", on: "tickets.agent_id = agenten.id", col1: "tickets.titel", col2: "agenten.name" },
    { ds: "tickets", t1: "tickets", t2: "kategorien", on: "tickets.kategorie_id = kategorien.id", col1: "tickets.titel", col2: "kategorien.name" },
    { ds: "banking", t1: "kunden", t2: "konten", on: "kunden.id = konten.kunde_id", col1: "kunden.name", col2: "saldo" },
    { ds: "banking", t1: "konten", t2: "transaktionen", on: "konten.id = transaktionen.konto_id", col1: "kontonummer", col2: "betrag" },
    { ds: "streaming", t1: "nutzer", t2: "watch_history", on: "nutzer.id = watch_history.nutzer_id", col1: "nutzer.name", col2: "fortschritt_prozent" },
    { ds: "streaming", t1: "filme", t2: "bewertungen", on: "filme.id = bewertungen.film_id", col1: "filme.titel", col2: "sterne" },
    { ds: "logs", t1: "events", t2: "sessions", on: "events.session_id = sessions.id", col1: "event_typ", col2: "browser" },
  ];

  const templates = [
    {
      title: (pair) => `${pair.t1} und ${pair.t2} verbinden`,
      desc: (pair) => `Zeige ${pair.col1} und ${pair.col2} durch einen INNER JOIN zwischen \`${pair.t1}\` und \`${pair.t2}\`.`,
      query: (pair) => `SELECT ${pair.col1}, ${pair.col2} FROM ${pair.t1} INNER JOIN ${pair.t2} ON ${pair.on};`,
      hint1: () => `Verwende \`INNER JOIN ... ON\`.`,
      difficulty: "junior",
    },
    {
      title: (pair) => `LEFT JOIN zwischen ${pair.t1} und ${pair.t2}`,
      desc: (pair) => `Zeige alle Zeilen aus \`${pair.t1}\` und passende aus \`${pair.t2}\` (auch wenn keine Uebereinstimmung).`,
      query: (pair) => `SELECT ${pair.col1}, ${pair.col2} FROM ${pair.t1} LEFT JOIN ${pair.t2} ON ${pair.on};`,
      hint1: () => `Verwende \`LEFT JOIN ... ON\`.`,
      difficulty: "junior",
    },
    {
      title: (pair) => `RIGHT JOIN zwischen ${pair.t1} und ${pair.t2}`,
      desc: (pair) => `Zeige alle Zeilen aus \`${pair.t2}\` und passende aus \`${pair.t1}\`.`,
      query: (pair) => `SELECT ${pair.col1}, ${pair.col2} FROM ${pair.t1} RIGHT JOIN ${pair.t2} ON ${pair.on};`,
      hint1: () => `Verwende \`RIGHT JOIN ... ON\`.`,
      difficulty: "intermediate",
    },
    {
      title: (pair) => `Anzahl pro Gruppe nach JOIN`,
      desc: (pair) => `Zaehle, wie viele Zeilen aus \`${pair.t2}\` zu jeder Zeile aus \`${pair.t1}\` passen.`,
      query: (pair) => {
        const pk = pair.t1 + ".id";
        return `SELECT ${pk}, COUNT(*) AS anzahl FROM ${pair.t1} INNER JOIN ${pair.t2} ON ${pair.on} GROUP BY ${pk};`;
      },
      hint1: () => `Kombiniere JOIN mit GROUP BY und COUNT.`,
      difficulty: "intermediate",
    },
    {
      title: (pair) => `Self-Join in ${pair.t1}`,
      desc: (pair) => `Verbinde \`${pair.t1}\` mit sich selbst, um hierarchische Beziehungen zu zeigen.`,
      query: (pair) => {
        const alias1 = pair.t1 + "1";
        const alias2 = pair.t1 + "2";
        return `SELECT ${alias1}.name, ${alias2}.name FROM ${pair.t1} AS ${alias1} INNER JOIN ${pair.t1} AS ${alias2} ON ${alias1}.id = ${alias2}.manager_id;`;
      },
      hint1: () => `Verwende Aliase fuer die gleiche Tabelle.`,
      difficulty: "intermediate",
    },
  ];

  let count = 0;
  for (const pair of joinPairs) {
    for (let i = 0; i < 4; i++) {
      const tmpl = templates[i % templates.length];
      if (tmpl.title(pair).includes("Self-Join") && pair.ds !== "hr") continue;
      if (tmpl.title(pair).includes("RIGHT JOIN") && pair.ds === "logs") continue;
      exercises.push(buildWrite("joi", {
        title: tmpl.title(pair),
        description: tmpl.desc(pair),
        difficulty: tmpl.difficulty,
        category: "JOIN",
        datasetId: pair.ds,
        referenceQuery: tmpl.query(pair),
        tags: ["JOIN", "INNER JOIN", "LEFT JOIN"],
        hints: [tmpl.hint1()],
        hiddenTestQuery: tmpl.query(pair),
        hiddenTestMode: "rows",
      }));
      count++;
      if (count >= 50) break;
    }
    if (count >= 50) break;
  }
  return exercises;
}

// ============================================================
// SUBQUERY
// ============================================================
function generateSubqueryExercises() {
  const exercises = [];
  const subqueryItems = [
    { ds: "shop", outer: "produkte", inner: "bestellpositionen", outerCol: "id", innerCol: "produkt_id", select: "name, preis" },
    { ds: "shop", outer: "kunden", inner: "bestellungen", outerCol: "id", innerCol: "kunde_id", select: "name, email" },
    { ds: "fitness", outer: "nutzer", inner: "workouts", outerCol: "id", innerCol: "nutzer_id", select: "name" },
    { ds: "hr", outer: "abteilungen", inner: "mitarbeiter", outerCol: "id", innerCol: "abteilung_id", select: "name, standort" },
    { ds: "tickets", outer: "agenten", inner: "tickets", outerCol: "id", innerCol: "agent_id", select: "name, team" },
    { ds: "banking", outer: "kunden", inner: "konten", outerCol: "id", innerCol: "kunde_id", select: "name" },
    { ds: "streaming", outer: "filme", inner: "watch_history", outerCol: "id", innerCol: "film_id", select: "titel, genre" },
  ];

  const templates = [
    {
      title: (item) => `Produkte mit EXISTS (Subquery)`,
      desc: (item) => `Zeige alle Zeilen aus \`${item.outer}\`, fuer die es mindestens eine passende Zeile in \`${item.inner}\` gibt.`,
      query: (item) => `SELECT ${item.select} FROM ${item.outer} WHERE EXISTS (SELECT 1 FROM ${item.inner} WHERE ${item.inner}.${item.innerCol} = ${item.outer}.${item.outerCol});`,
      hint1: () => `Verwende \`EXISTS (SELECT 1 FROM ... WHERE ...)\`.`,
      difficulty: "intermediate",
    },
    {
      title: (item) => `Subquery in WHERE mit IN`,
      desc: (item) => `Zeige Zeilen aus \`${item.outer}\`, deren \`${item.outerCol}\` in einer Liste aus \`${item.inner}\` vorkommt.`,
      query: (item) => `SELECT ${item.select} FROM ${item.outer} WHERE ${item.outerCol} IN (SELECT ${item.innerCol} FROM ${item.inner});`,
      hint1: () => `Verwende \`IN (SELECT ... )\`.`,
      difficulty: "intermediate",
    },
    {
      title: (item) => `Subquery in FROM (Inline-View)`,
      desc: (item) => `Nutze eine Subquery als Datenquelle und gib das Ergebnis aus.`,
      query: (item) => `SELECT * FROM (SELECT ${item.select} FROM ${item.outer}) AS sub;`,
      hint1: () => `Schreibe die Subquery in Klammern nach \`FROM\`.`,
      difficulty: "intermediate",
    },
    {
      title: (item) => `Subquery in SELECT (korreliert)`,
      desc: (item) => `Zaehle fuer jede Zeile in \`${item.outer}\` die zugehoerigen Zeilen in \`${item.inner}\`.`,
      query: (item) => `SELECT ${item.select}, (SELECT COUNT(*) FROM ${item.inner} WHERE ${item.inner}.${item.innerCol} = ${item.outer}.${item.outerCol}) AS anzahl FROM ${item.outer};`,
      hint1: () => `Platziere die Subquery direkt im SELECT.`,
      difficulty: "advanced",
    },
  ];

  let count = 0;
  for (const item of subqueryItems) {
    for (let i = 0; i < 5; i++) {
      const tmpl = templates[i % templates.length];
      exercises.push(buildWrite("sub", {
        title: tmpl.title(item),
        description: tmpl.desc(item),
        difficulty: tmpl.difficulty,
        category: "Subquery",
        datasetId: item.ds,
        referenceQuery: tmpl.query(item),
        tags: ["Subquery", "EXISTS", "IN", "korreliert"],
        hints: [tmpl.hint1()],
        hiddenTestQuery: tmpl.query(item),
        hiddenTestMode: "rows",
      }));
      count++;
      if (count >= 35) break;
    }
    if (count >= 35) break;
  }
  return exercises;
}

// ============================================================
// DEBUGGING
// ============================================================
function generateDebugExercises() {
  const exercises = [];
  const debugItems = [
    {
      ds: "shop", table: "kunden",
      broken: "SELECT name, stadt FROM kunden WHERE stadt = 'Berlin' AND stadt = 'Muenchen';",
      fixed: "SELECT name, stadt FROM kunden WHERE stadt = 'Berlin' OR stadt = 'Muenchen';",
    },
    {
      ds: "shop", table: "produkte",
      broken: "SELECT name FROM produkte WHERE preis > 100 ORDER preis DESC;",
      fixed: "SELECT name FROM produkte WHERE preis > 100 ORDER BY preis DESC;",
    },
    {
      ds: "fitness", table: "workouts",
      broken: "SELECT nutzer_id, SUM(dauer_min) FROM workouts GROUP nutzer_id;",
      fixed: "SELECT nutzer_id, SUM(dauer_min) FROM workouts GROUP BY nutzer_id;",
    },
    {
      ds: "hr", table: "mitarbeiter",
      broken: "SELECT name, position FROM mitarbeiter HAVING gehalt > 50000;",
      fixed: "SELECT name, position FROM mitarbeiter WHERE gehalt > 50000;",
    },
    {
      ds: "tickets", table: "tickets",
      broken: "SELECT titel, status FROM tickets WHERE status = 'offen' OR status = 'bearbeitung' AND prioritaet = 'hoch';",
      fixed: "SELECT titel, status FROM tickets WHERE (status = 'offen' OR status = 'bearbeitung') AND prioritaet = 'hoch';",
    },
    {
      ds: "banking", table: "transaktionen",
      broken: "SELECT konto_id, SUM(betrag) FROM transaktionen WHERE typ = 'ausgang';",
      fixed: "SELECT konto_id, SUM(betrag) FROM transaktionen WHERE typ = 'ausgang' GROUP BY konto_id;",
    },
    {
      ds: "streaming", table: "filme",
      broken: "SELECT titel FROM filme WHERE jahr > 2000 AND genre = 'Drama' OR genre = 'Action';",
      fixed: "SELECT titel FROM filme WHERE jahr > 2000 AND (genre = 'Drama' OR genre = 'Action');",
    },
    {
      ds: "logs", table: "events",
      broken: "SELECT session_id, COUNT(*) FROM events GROUP BY session_id HAVING COUNT > 5;",
      fixed: "SELECT session_id, COUNT(*) AS anzahl FROM events GROUP BY session_id HAVING COUNT(*) > 5;",
    },
  ];

  let count = 0;
  for (const item of debugItems) {
    exercises.push(buildDebug("dbg", {
      title: `Query in ${item.table} reparieren`,
      description: `Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: \`${item.broken}\``,
      difficulty: "junior",
      category: "Debugging",
      datasetId: item.ds,
      brokenQuery: item.broken,
      referenceQuery: item.fixed,
      tags: ["Debugging", "Syntax"],
      hints: ["Vergleiche die fehlerhafte Query mit SQL-Syntax-Regeln.", "Achte auf fehlende Schluesselwoerter wie BY oder AS."],
      hiddenTestQuery: item.fixed,
      hiddenTestMode: "rows",
    }));
    count++;
    if (count >= 15) break;
  }

  // Add 7 more with varied errors
  const moreDebug = [
    { ds: "shop", broken: "SELECT * FROM kunden ORDER BY name;", fixed: "SELECT * FROM kunden ORDER BY name ASC;", note: "ASC ist optional, aber korrekt." },
    { ds: "hr", broken: "SELECT abteilung_id, AVG(gehalt) FROM mitarbeiter;", fixed: "SELECT abteilung_id, AVG(gehalt) FROM mitarbeiter GROUP BY abteilung_id;", note: "GROUP BY fehlt." },
    { ds: "fitness", broken: "SELECT name FROM nutzer WHERE gewicht_kg = NULL;", fixed: "SELECT name FROM nutzer WHERE gewicht_kg IS NULL;", note: "IS NULL statt = NULL." },
    { ds: "tickets", broken: "SELECT titel FROM tickets WHERE prioritaet IN ('hoch', 'kritisch';", fixed: "SELECT titel FROM tickets WHERE prioritaet IN ('hoch', 'kritisch');", note: "Klammer nicht geschlossen." },
    { ds: "banking", broken: "SELECT k.name, k.saldo FROM kunden k JOIN konten k ON k.id = k.kunde_id;", fixed: "SELECT k.name, ko.saldo FROM kunden k JOIN konten ko ON k.id = ko.kunde_id;", note: "Alias doppelt verwendet." },
    { ds: "streaming", broken: "SELECT * FROM filme WHERE bewertung > 4.5;", fixed: "SELECT * FROM filme WHERE bewertung > 4.5;", note: "Nur als Kontrollaufgabe." },
    { ds: "logs", broken: "SELECT event_typ FROM events WHERE dauer_ms > 200 AND < 400;", fixed: "SELECT event_typ FROM events WHERE dauer_ms > 200 AND dauer_ms < 400;", note: "Spaltenname fehlt im zweiten Teil." },
  ];

  for (const item of moreDebug) {
    exercises.push(buildDebug("dbg", {
      title: `Query reparieren (${item.ds})`,
      description: `Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: \`${item.broken}\``,
      difficulty: "junior",
      category: "Debugging",
      datasetId: item.ds,
      brokenQuery: item.broken,
      referenceQuery: item.fixed,
      tags: ["Debugging", "Syntax"],
      hints: [item.note, "Achte auf Syntaxfehler wie fehlende Klammern oder falsch verwendete Vergleiche."],
      hiddenTestQuery: item.fixed,
      hiddenTestMode: "rows",
    }));
    count++;
    if (count >= 15) break;
  }

  return exercises;
}

// ============================================================
// PREDICT
// ============================================================
function generatePredictExercises() {
  const exercises = [];
  const predictItems = [
    {
      ds: "shop", table: "produkte",
      query: "SELECT COUNT(*) FROM produkte WHERE preis > 50;",
      question: "Wie viele Produkte haben einen Preis ueber 50?",
      options: [
        { text: "4", isCorrect: false },
        { text: "5", isCorrect: false },
        { text: "6", isCorrect: true },
        { text: "7", isCorrect: false },
      ],
    },
    {
      ds: "fitness", table: "nutzer",
      query: "SELECT AVG(gewicht_kg) FROM nutzer;",
      question: "Was ist das durchschnittliche Gewicht aller Nutzer?",
      options: [
        { text: "65.0", isCorrect: false },
        { text: "70.81", isCorrect: true },
        { text: "75.0", isCorrect: false },
        { text: "80.0", isCorrect: false },
      ],
    },
    {
      ds: "hr", table: "mitarbeiter",
      query: "SELECT COUNT(*) FROM mitarbeiter WHERE gehalt > 60000;",
      question: "Wie viele Mitarbeiter verdienen mehr als 60000?",
      options: [
        { text: "3", isCorrect: true },
        { text: "4", isCorrect: false },
        { text: "5", isCorrect: false },
        { text: "6", isCorrect: false },
      ],
    },
    {
      ds: "tickets", table: "tickets",
      query: "SELECT COUNT(*) FROM tickets WHERE status = 'offen';",
      question: "Wie viele Tickets haben den Status 'offen'?",
      options: [
        { text: "3", isCorrect: false },
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "6", isCorrect: false },
      ],
    },
    {
      ds: "banking", table: "transaktionen",
      query: "SELECT SUM(betrag) FROM transaktionen WHERE typ = 'eingang';",
      question: "Wie hoch ist die Summe aller Eingaenge?",
      options: [
        { text: "14500.00", isCorrect: false },
        { text: "15600.00", isCorrect: false },
        { text: "16600.00", isCorrect: true },
        { text: "17000.00", isCorrect: false },
      ],
    },
    {
      ds: "streaming", table: "filme",
      query: "SELECT COUNT(*) FROM filme WHERE genre = 'Drama';",
      question: "Wie viele Filme sind im Genre 'Drama'?",
      options: [
        { text: "2", isCorrect: false },
        { text: "3", isCorrect: false },
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
      ],
    },
    {
      ds: "logs", table: "fehler",
      query: "SELECT COUNT(*) FROM fehler WHERE schweregrad = 'kritisch';",
      question: "Wie viele Fehler sind kritisch?",
      options: [
        { text: "4", isCorrect: false },
        { text: "5", isCorrect: true },
        { text: "6", isCorrect: false },
        { text: "7", isCorrect: false },
      ],
    },
    {
      ds: "shop", table: "bestellungen",
      query: "SELECT AVG(gesamtbetrag) FROM bestellungen;",
      question: "Was ist der durchschnittliche Bestellwert?",
      options: [
        { text: "250.00", isCorrect: false },
        { text: "312.13", isCorrect: true },
        { text: "350.00", isCorrect: false },
        { text: "400.00", isCorrect: false },
      ],
    },
    {
      ds: "fitness", table: "workouts",
      query: "SELECT MAX(kalorien_verbrannt) FROM workouts;",
      question: "Wie viele Kalorien wurden maximal bei einem Workout verbrannt?",
      options: [
        { text: "600", isCorrect: false },
        { text: "650", isCorrect: false },
        { text: "720", isCorrect: true },
        { text: "750", isCorrect: false },
      ],
    },
    {
      ds: "hr", table: "urlaub",
      query: "SELECT SUM(tage) FROM urlaub WHERE genehmigt = 1;",
      question: "Wie viele Urlaubstage wurden insgesamt genehmigt?",
      options: [
        { text: "60", isCorrect: false },
        { text: "72", isCorrect: true },
        { text: "80", isCorrect: false },
        { text: "90", isCorrect: false },
      ],
    },
    {
      ds: "banking", table: "konten",
      query: "SELECT COUNT(*) FROM konten WHERE typ = 'Girokonto';",
      question: "Wie viele Girokonten gibt es?",
      options: [
        { text: "6", isCorrect: false },
        { text: "7", isCorrect: true },
        { text: "8", isCorrect: false },
        { text: "9", isCorrect: false },
      ],
    },
    {
      ds: "streaming", table: "bewertungen",
      query: "SELECT AVG(sterne) FROM bewertungen;",
      question: "Wie hoch ist die durchschnittliche Sternebewertung?",
      options: [
        { text: "3.5", isCorrect: false },
        { text: "3.85", isCorrect: true },
        { text: "4.0", isCorrect: false },
        { text: "4.2", isCorrect: false },
      ],
    },
    {
      ds: "shop", table: "produkte",
      query: "SELECT MAX(preis) FROM produkte;",
      question: "Was ist der hoechste Produktpreis?",
      options: [
        { text: "599.00", isCorrect: false },
        { text: "899.00", isCorrect: true },
        { text: "999.00", isCorrect: false },
        { text: "129.00", isCorrect: false },
      ],
    },
    {
      ds: "tickets", table: "kommentare",
      query: "SELECT COUNT(*) FROM kommentare WHERE autor LIKE 'Max%';",
      question: "Wie viele Kommentare stammen von einem Autor, dessen Name mit 'Max' beginnt?",
      options: [
        { text: "1", isCorrect: false },
        { text: "2", isCorrect: true },
        { text: "3", isCorrect: false },
        { text: "4", isCorrect: false },
      ],
    },
    {
      ds: "logs", table: "events",
      query: "SELECT COUNT(*) FROM events WHERE event_typ = 'checkout';",
      question: "Wie viele Checkout-Events gibt es?",
      options: [
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "6", isCorrect: false },
        { text: "7", isCorrect: false },
      ],
    },
  ];

  let count = 0;
  for (const item of predictItems) {
    exercises.push(buildPredict("prd", {
      title: `Ergebnis vorhersagen: ${item.table}`,
      description: `Gegeben ist folgende Query:\n\n\`${item.query}\`\n\n${item.question}`,
      difficulty: count < 5 ? "beginner" : "junior",
      category: "Ergebnis-Vorhersage",
      datasetId: item.ds,
      question: item.question,
      options: item.options,
      tags: ["Ergebnis-Vorhersage", "Aggregation"],
      hints: ["Fuehre die Query mental aus oder schreibe sie auf Papier.", "Zaehle Zeilen oder berechne Summen/Durchschnitte."],
    }));
    count++;
    if (count >= 15) break;
  }
  return exercises;
}

// ============================================================
// SCHEMA
// ============================================================
function generateSchemaExercises() {
  const exercises = [];
  const schemaItems = [
    {
      ds: "shop",
      question: "Welche Tabellen muessen verbunden werden, um den Namen eines Kunden und den Namen des gekauften Produkts anzuzeigen?",
      options: [
        { text: "kunden, bestellungen, bestellpositionen, produkte", isCorrect: true },
        { text: "kunden, produkte", isCorrect: false },
        { text: "bestellungen, produkte", isCorrect: false },
        { text: "kunden, bestellungen, produkte", isCorrect: false },
      ],
    },
    {
      ds: "fitness",
      question: "Welche Tabelle enthaelt Informationen ueber die durchgefuehrten Saetze?",
      options: [
        { text: "workouts", isCorrect: false },
        { text: "uebungen", isCorrect: false },
        { text: "saetze", isCorrect: true },
        { text: "nutzer", isCorrect: false },
      ],
    },
    {
      ds: "hr",
      question: "Welche Spalte in `mitarbeiter` verweist auf den Vorgesetzten?",
      options: [
        { text: "abteilung_id", isCorrect: false },
        { text: "manager_id", isCorrect: true },
        { text: "position", isCorrect: false },
        { text: "id", isCorrect: false },
      ],
    },
    {
      ds: "tickets",
      question: "Welche Tabelle speichert die Kommentare zu einem Ticket?",
      options: [
        { text: "tickets", isCorrect: false },
        { text: "agenten", isCorrect: false },
        { text: "kommentare", isCorrect: true },
        { text: "kategorien", isCorrect: false },
      ],
    },
    {
      ds: "banking",
      question: "Welche Spalte verbindet `transaktionen` mit `konten`?",
      options: [
        { text: "kunde_id", isCorrect: false },
        { text: "konto_id", isCorrect: true },
        { text: "id", isCorrect: false },
        { text: "kontonummer", isCorrect: false },
      ],
    },
    {
      ds: "streaming",
      question: "Welche Tabellen braucht man, um zu sehen, welcher Nutzer welchen Film geschaut hat?",
      options: [
        { text: "nutzer, filme", isCorrect: false },
        { text: "nutzer, watch_history, filme", isCorrect: true },
        { text: "watch_history, bewertungen", isCorrect: false },
        { text: "nutzer, bewertungen", isCorrect: false },
      ],
    },
    {
      ds: "logs",
      question: "Welche Spalte in `events` verweist auf die Session?",
      options: [
        { text: "id", isCorrect: false },
        { text: "session_id", isCorrect: true },
        { text: "nutzer_id", isCorrect: false },
        { text: "seite", isCorrect: false },
      ],
    },
    {
      ds: "shop",
      question: "Welche Spalte in `produkte` verweist auf die Kategorie?",
      options: [
        { text: "id", isCorrect: false },
        { text: "name", isCorrect: false },
        { text: "kategorie_id", isCorrect: true },
        { text: "preis", isCorrect: false },
      ],
    },
    {
      ds: "hr",
      question: "Welche Tabelle speichert die Urlaubsantraege?",
      options: [
        { text: "mitarbeiter", isCorrect: false },
        { text: "abteilungen", isCorrect: false },
        { text: "urlaub", isCorrect: true },
        { text: "bewerbungen", isCorrect: false },
      ],
    },
    {
      ds: "fitness",
      question: "Welche Spalte in `koerperdaten` speichert den Body-Fat-Prozentsatz?",
      options: [
        { text: "gewicht_kg", isCorrect: false },
        { text: "koerperfett_prozent", isCorrect: true },
        { text: "groesse_cm", isCorrect: false },
        { text: "datum", isCorrect: false },
      ],
    },
  ];

  let count = 0;
  for (const item of schemaItems) {
    exercises.push(buildSchema("sch", {
      title: `Schema-Verstaendnis: ${item.ds}`,
      description: "Analysiere das Schema und beantworte die Frage.",
      difficulty: "beginner",
      category: "Schema-Verstaendnis",
      datasetId: item.ds,
      question: item.question,
      options: item.options,
      tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
      hints: ["Schau dir die Tabellen- und Spaltendefinitionen an.", "Achte auf Foreign-Key-Beziehungen."],
    }));
    count++;
    if (count >= 10) break;
  }
  return exercises;
}

// ============================================================
// INTERVIEW CHALLENGES
// ============================================================
function generateInterviewExercises() {
  const exercises = [];
  const interviewItems = [
    {
      ds: "shop",
      title: "Top 3 umsatzstaerkste Kunden",
      desc: "Finde die 3 Kunden mit dem hoechsten Gesamtumsatz ueber alle Bestellungen. Gib den Namen und die Summe aus.",
      query: `SELECT k.name, SUM(b.gesamtbetrag) AS umsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name ORDER BY umsatz DESC LIMIT 3;`,
      difficulty: "intermediate",
    },
    {
      ds: "shop",
      title: "Produkte, die nie bestellt wurden",
      desc: "Zeige alle Produkte, die in keiner Bestellung vorkommen.",
      query: `SELECT p.name FROM produkte p LEFT JOIN bestellpositionen bp ON p.id = bp.produkt_id WHERE bp.produkt_id IS NULL;`,
      difficulty: "intermediate",
    },
    {
      ds: "fitness",
      title: "Nutzer mit mehr als 5 Workouts",
      desc: "Zeige alle Nutzer, die mehr als 5 Workouts absolviert haben, sortiert nach Anzahl absteigend.",
      query: `SELECT n.name, COUNT(w.id) AS workout_anzahl FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id GROUP BY n.id, n.name HAVING COUNT(w.id) > 5 ORDER BY workout_anzahl DESC;`,
      difficulty: "intermediate",
    },
    {
      ds: "hr",
      title: "Abteilungen mit hoechstem Durchschnittsgehalt",
      desc: "Zeige die Abteilung mit dem hoechsten Durchschnittsgehalt.",
      query: `SELECT a.name, AVG(m.gehalt) AS durchschnitt FROM abteilungen a INNER JOIN mitarbeiter m ON a.id = m.abteilung_id GROUP BY a.id, a.name ORDER BY durchschnitt DESC LIMIT 1;`,
      difficulty: "intermediate",
    },
    {
      ds: "tickets",
      title: "Agenten mit offenen Tickets",
      desc: "Zeige alle Agenten und wie viele offene Tickets sie aktuell haben.",
      query: `SELECT a.name, COUNT(t.id) AS offene_tickets FROM agenten a LEFT JOIN tickets t ON a.id = t.agent_id AND t.status = 'offen' GROUP BY a.id, a.name ORDER BY offene_tickets DESC;`,
      difficulty: "intermediate",
    },
    {
      ds: "banking",
      title: "Kunden mit negativem Saldo",
      desc: "Finde Kunden, deren Gesamtsaldo ueber alle Konten negativ ist.",
      query: `SELECT ku.name, SUM(k.saldo) AS gesamt_saldo FROM kunden ku INNER JOIN konten k ON ku.id = k.kunde_id GROUP BY ku.id, ku.name HAVING SUM(k.saldo) < 0;`,
      difficulty: "intermediate",
    },
    {
      ds: "streaming",
      title: "Filme mit Durchschnittsbewertung ueber 4",
      desc: "Zeige alle Filme, deren Durchschnittsbewertung ueber 4 Sterne liegt.",
      query: `SELECT f.titel, AVG(b.sterne) AS avg_sterne FROM filme f INNER JOIN bewertungen b ON f.id = b.film_id GROUP BY f.id, f.titel HAVING AVG(b.sterne) > 4;`,
      difficulty: "intermediate",
    },
    {
      ds: "logs",
      title: "Sessions mit mehr als 3 Events",
      desc: "Zeige alle Session-IDs, die mehr als 3 Events haben, und die Anzahl.",
      query: `SELECT session_id, COUNT(*) AS event_anzahl FROM events GROUP BY session_id HAVING COUNT(*) > 3 ORDER BY event_anzahl DESC;`,
      difficulty: "junior",
    },
    {
      ds: "shop",
      title: "Monatlicher Umsatz",
      desc: "Berechne den Gesamtumsatz pro Monat (basierend auf Bestelldatum).",
      query: `SELECT strftime('%Y-%m', datum) AS monat, SUM(gesamtbetrag) AS umsatz FROM bestellungen GROUP BY monat ORDER BY monat;`,
      difficulty: "advanced",
    },
    {
      ds: "fitness",
      title: "Persoenlicher Rekord pro Uebung",
      desc: "Finde fuer jeden Nutzer und jede Uebung das maximale Gewicht.",
      query: `SELECT n.name, u.name AS uebung, MAX(s.gewicht_kg) AS max_gewicht FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id INNER JOIN saetze s ON w.id = s.workout_id INNER JOIN uebungen u ON s.uebung_id = u.id GROUP BY n.id, n.name, u.id, u.name ORDER BY n.name, max_gewicht DESC;`,
      difficulty: "advanced",
    },
    {
      ds: "hr",
      title: "Mitarbeiter ohne Urlaub in 2024",
      desc: "Zeige alle Mitarbeiter, die im Jahr 2024 keinen Urlaub beantragt haben.",
      query: `SELECT m.name FROM mitarbeiter m WHERE m.id NOT IN (SELECT mitarbeiter_id FROM urlaub WHERE startdatum LIKE '2024-%');`,
      difficulty: "intermediate",
    },
    {
      ds: "tickets",
      title: "Durchschnittliche Bearbeitungszeit",
      desc: "Berechne die durchschnittliche Bearbeitungszeit (in Stunden) fuer abgeschlossene Tickets.",
      query: `SELECT AVG((julianday(geschlossen_am) - julianday(erstellt_am)) * 24) AS avg_stunden FROM tickets WHERE status = 'abgeschlossen';`,
      difficulty: "advanced",
    },
    {
      ds: "banking",
      title: "Verdacht auf Betrug",
      desc: "Zeige alle Kunden, die mehr als 2 Betrugsfaelle haben.",
      query: `SELECT ku.name, COUNT(bf.id) AS faelle FROM kunden ku INNER JOIN konten ko ON ku.id = ko.kunde_id INNER JOIN transaktionen t ON ko.id = t.konto_id INNER JOIN betrugsfaelle bf ON t.id = bf.transaktion_id GROUP BY ku.id, ku.name HAVING COUNT(bf.id) > 2;`,
      difficulty: "advanced",
    },
    {
      ds: "streaming",
      title: "Nutzer, die alle Filme geschaut haben",
      desc: "Finde Nutzer, die mindestens 5 verschiedene Filme zu 100% geschaut haben.",
      query: `SELECT n.name, COUNT(DISTINCT wh.film_id) AS filme_geschaut FROM nutzer n INNER JOIN watch_history wh ON n.id = wh.nutzer_id WHERE wh.fortschritt_prozent = 100 GROUP BY n.id, n.name HAVING COUNT(DISTINCT wh.film_id) >= 5;`,
      difficulty: "advanced",
    },
    {
      ds: "logs",
      title: "Fehler pro Session",
      desc: "Zeige Sessions, die mindestens 2 Fehler enthalten.",
      query: `SELECT s.id, s.browser, COUNT(f.id) AS fehler_anzahl FROM sessions s INNER JOIN events e ON s.id = e.session_id INNER JOIN fehler f ON e.id = f.event_id GROUP BY s.id, s.browser HAVING COUNT(f.id) >= 2;`,
      difficulty: "intermediate",
    },
  ];

  let count = 0;
  for (const item of interviewItems) {
    exercises.push(buildWrite("int", {
      title: item.title,
      description: item.desc,
      difficulty: item.difficulty,
      category: "Interview-Challenge",
      datasetId: item.ds,
      referenceQuery: item.query,
      tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
      hints: ["Zerlege die Aufgabe in kleine Schritte.", "Welche Tabellen brauchst du? Welche Aggregate?"],
      hiddenTestQuery: item.query,
      hiddenTestMode: "rows",
    }));
    count++;
    if (count >= 15) break;
  }
  return exercises;
}

// ============================================================
// WRITE ALL FILES
// ============================================================
const baseDir = path.join(__dirname, "..", "src", "data", "exercises");

function writeFile(name, exercises) {
  const header = `import { makeWriteExercise, makeDebugExercise, makePredictExercise, makeSchemaExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const ${name}Exercises: Exercise[] = [];
resetCounter();
${name}Exercises.push(
${exercises.join(",\n\n")}
);
`;
  fs.writeFileSync(path.join(baseDir, `${name}.ts`), header, "utf8");
  console.log(`Wrote ${exercises.length} exercises to ${name}.ts`);
}

writeFile("where", generateWhereExercises());
writeFile("orderLimit", generateOrderLimitExercises());
writeFile("aggregation", generateAggregationExercises());
writeFile("join", generateJoinExercises());
writeFile("subquery", generateSubqueryExercises());
writeFile("debug", generateDebugExercises());
writeFile("predict", generatePredictExercises());
writeFile("schema", generateSchemaExercises());
writeFile("interview", generateInterviewExercises());

console.log("Done generating all exercise files!");
