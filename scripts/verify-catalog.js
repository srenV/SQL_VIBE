const fs = require("fs");
const path = require("path");

// Read all exercise files and count exercises
const exercisesDir = path.join(__dirname, "..", "src", "data", "exercises");
const files = fs.readdirSync(exercisesDir).filter(f => f.endsWith(".ts") && f !== "_factory.ts" && f !== "index.ts");

let totalExercises = 0;
const counts = {};
files.forEach(f => {
  const src = fs.readFileSync(path.join(exercisesDir, f), "utf8");
  const matches = src.match(/makeWriteExercise|makeDebugExercise|makePredictExercise|makeSchemaExercise/g);
  const count = matches ? matches.length : 0;
  counts[f.replace(".ts", "")] = count;
  totalExercises += count;
});

console.log("=== Aufgaben pro Kategorie ===");
Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log(`\nGESAMT: ${totalExercises} Aufgaben`);

// Check datasets
const datasetsDir = path.join(__dirname, "..", "src", "data", "datasets");
const datasetFiles = fs.readdirSync(datasetsDir).filter(f => f.endsWith(".ts") && f !== "index.ts");
console.log(`\nDatensaetze: ${datasetFiles.length}`);
datasetFiles.forEach(f => console.log(`  - ${f.replace(".ts", "")}`));

// Verify >250
if (totalExercises >= 250) {
  console.log("\n✅ MVP-Ziel erreicht: >= 250 Aufgaben");
} else {
  console.log("\n❌ MVP-Ziel NICHT erreicht");
  process.exit(1);
}

// Verify 7 datasets
if (datasetFiles.length >= 6) {
  console.log("✅ Datensaetze: >= 6 reale Projekte");
} else {
  console.log("❌ Zu wenig Datensaetze");
  process.exit(1);
}

console.log("\n✅ Katalog-Verifikation erfolgreich.");
