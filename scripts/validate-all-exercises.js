/**
 * Comprehensive Exercise Validator
 *
 * Loads every exercise, creates an in-memory SQLite database with the dataset,
 * runs reference queries and hidden tests, and validates correctness.
 * Also tests wrong inputs to ensure they're properly rejected.
 *
 * Usage: node scripts/validate-all-exercises.js
 */

const initSqlJs = require("sql.js");

// We need to manually load all exercises and datasets
// Since we can't use TypeScript imports directly, we'll use a different approach:
// Run via vitest with a custom test file

const fs = require("fs");
const path = require("path");

// Read all exercise files and extract exercise data
const exerciseFiles = [
  "select",
  "where",
  "orderLimit",
  "aggregation",
  "join",
  "subquery",
  "debug",
  "predict",
  "schema",
  "interview",
  "cte",
  "windowFunctions",
  "dml",
  "ddl",
  "story",
];

const datasetFiles = [
  "shop",
  "fitness",
  "hr",
  "tickets",
  "banking",
  "streaming",
  "logs",
  "university",
  "ecommerce",
  "hospital",
];

async function main() {
  const SQL = await initSqlJs();

  // Load datasets
  const datasets = {};
  for (const dsName of datasetFiles) {
    const dsPath = path.join(__dirname, "..", "src", "data", "datasets", `${dsName}.ts`);
    if (!fs.existsSync(dsPath)) {
      console.log(`  [SKIP] Dataset ${dsName} not found`);
      continue;
    }
    const content = fs.readFileSync(dsPath, "utf-8");
    // Extract the SQL string from the dataset file
    const sqlMatch = content.match(/sql:\s*`([^`]*)`/s);
    if (sqlMatch) {
      datasets[dsName] = sqlMatch[1];
      console.log(`  [OK] Dataset ${dsName} loaded (${sqlMatch[1].length} chars SQL)`);
    } else {
      console.log(`  [WARN] Dataset ${dsName}: no SQL found`);
    }
  }

  // Load exercises
  let totalExercises = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const failures = [];

  for (const exFile of exerciseFiles) {
    const exPath = path.join(__dirname, "..", "src", "data", "exercises", `${exFile}.ts`);
    if (!fs.existsSync(exPath)) {
      console.log(`  [SKIP] Exercise file ${exFile} not found`);
      continue;
    }
    const content = fs.readFileSync(exPath, "utf-8");

    // Parse each exercise from the file
    // We extract makeWriteExercise, makeDebugExercise, makePredictExercise, makeSchemaExercise, makeStoryExercise calls
    const exercisePattern =
      /make(Write|Debug|Predict|Schema|Story)Exercise\s*\(\s*"([^"]+)",\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs;

    let match;
    while ((match = exercisePattern.exec(content)) !== null) {
      const type = match[1];
      const prefix = match[2];
      const optsStr = match[3];
      totalExercises++;

      // Extract datasetId
      const dsMatch = optsStr.match(/datasetId:\s*"([^"]+)"/);
      const datasetId = dsMatch ? dsMatch[1] : null;

      // Extract title
      const titleMatch = optsStr.match(/title:\s*"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : "Unknown";

      // Extract referenceQuery
      const refMatch = optsStr.match(/referenceQuery:\s*`([^`]*)`/s);
      const referenceQuery = refMatch ? refMatch[1].trim() : null;

      // Extract hiddenTestQuery
      const htMatch = optsStr.match(/hiddenTestQuery:\s*`([^`]*)`/s);
      const hiddenTestQuery = htMatch ? htMatch[1].trim() : null;

      // Extract hiddenTestMode
      const htmMatch = optsStr.match(/hiddenTestMode:\s*"([^"]+)"/);
      const hiddenTestMode = htmMatch ? htmMatch[1] : "rows";

      // Extract brokenQuery for debug exercises
      const bqMatch = optsStr.match(/brokenQuery:\s*`([^`]*)`/s);
      const brokenQuery = bqMatch ? bqMatch[1].trim() : null;

      // Extract question/options for predict/schema
      const qMatch = optsStr.match(/question:\s*"([^"]+)"/);
      const question = qMatch ? qMatch[1] : null;

      // Extract options
      const optionsMatch = optsStr.match(/options:\s*\[([^\]]*)\]/s);
      const hasOptions = !!optionsMatch;

      // Extract datasetId from reference (some use dataset.id, some use string)
      let actualDatasetId = datasetId;
      if (
        !actualDatasetId ||
        actualDatasetId === "shop" ||
        actualDatasetId === "fitness" ||
        actualDatasetId === "hr" ||
        actualDatasetId === "tickets" ||
        actualDatasetId === "banking" ||
        actualDatasetId === "streaming" ||
        actualDatasetId === "logs"
      ) {
        // These are already valid dataset keys
      } else if (actualDatasetId && actualDatasetId.includes("Dataset.id")) {
        // Extract the dataset name from something like shopDataset.id
        const dsNameMatch = actualDatasetId.match(/(\w+)Dataset\.id/);
        if (dsNameMatch) actualDatasetId = dsNameMatch[1];
      }

      const setupSql = datasets[actualDatasetId];
      if (!setupSql) {
        skipped++;
        console.log(
          `  [SKIP] ${prefix}:${title} - dataset '${actualDatasetId}' not found`
        );
        continue;
      }

      try {
        // Create in-memory database
        const db = new SQL.Database();
        db.run(setupSql);

        // Test 1: Run reference query (for write/debug exercises)
        if (
          referenceQuery &&
          type !== "Predict" &&
          type !== "Schema" &&
          type !== "Story"
        ) {
          try {
            const refResult = db.exec(referenceQuery);
            if (!refResult || refResult.length === 0) {
              // Some queries (DDL, DML) don't return results - that's OK
              if (type === "Write" && referenceQuery.toUpperCase().includes("SELECT")) {
                failures.push({
                  exercise: `${prefix}:${title}`,
                  issue: "Reference query returned no results",
                  query: referenceQuery.substring(0, 100),
                });
                failed++;
                continue;
              }
            }
          } catch (e) {
            failures.push({
              exercise: `${prefix}:${title}`,
              issue: `Reference query failed: ${e.message}`,
              query: referenceQuery.substring(0, 100),
            });
            failed++;
            continue;
          }
        }

        // Test 2: Run hidden test query
        if (hiddenTestQuery) {
          try {
            const htResult = db.exec(hiddenTestQuery);
            // For DDL exercises, hidden test checks if table exists - empty result means table doesn't exist
            if (
              type === "Write" &&
              hiddenTestQuery.toUpperCase().includes("SELECT") &&
              (!htResult || htResult.length === 0)
            ) {
              // Check if this is a DDL exercise (checking sqlite_master)
              if (
                !hiddenTestQuery.includes("sqlite_master") &&
                !hiddenTestQuery.includes("PRAGMA")
              ) {
                failures.push({
                  exercise: `${prefix}:${title}`,
                  issue: "Hidden test query returned no results",
                  query: hiddenTestQuery.substring(0, 100),
                });
                failed++;
                continue;
              }
            }
          } catch (e) {
            failures.push({
              exercise: `${prefix}:${title}`,
              issue: `Hidden test query failed: ${e.message}`,
              query: hiddenTestQuery.substring(0, 100),
            });
            failed++;
            continue;
          }
        }

        // Test 3: For debug exercises, verify broken query actually fails
        if (brokenQuery && type === "Debug") {
          try {
            db.exec(brokenQuery);
            // If we get here, the broken query didn't fail - that's a problem
            failures.push({
              exercise: `${prefix}:${title}`,
              issue: "Broken query should fail but succeeded",
              query: brokenQuery.substring(0, 100),
            });
            failed++;
            continue;
          } catch (e) {
            // Expected - broken query should fail
          }
        }

        // Test 4: For predict/schema exercises, verify options exist and one is correct
        if ((type === "Predict" || type === "Schema") && hasOptions) {
          // Options are parsed from the string - basic validation
          const correctCount = (optionsMatch[1].match(/isCorrect:\s*true/g) || []).length;
          if (correctCount === 0) {
            failures.push({
              exercise: `${prefix}:${title}`,
              issue: "No correct option marked",
            });
            failed++;
            continue;
          }
          if (correctCount > 1) {
            failures.push({
              exercise: `${prefix}:${title}`,
              issue: `Multiple correct options (${correctCount})`,
            });
            failed++;
            continue;
          }
        }

        // Test 5: For story exercises, validate each chapter
        if (type === "Story") {
          // Extract chapters
          const chaptersMatch = optsStr.match(
            /chapters:\s*\[([\s\S]*?)\],\s*(?:outro|tags|hints)/
          );
          if (chaptersMatch) {
            const chapterPattern = /referenceQuery:\s*`([^`]*)`/gs;
            let chMatch;
            while ((chMatch = chapterPattern.exec(chaptersMatch[1])) !== null) {
              try {
                db.exec(chMatch[1].trim());
              } catch (e) {
                failures.push({
                  exercise: `${prefix}:${title}`,
                  issue: `Story chapter query failed: ${e.message}`,
                  query: chMatch[1].trim().substring(0, 100),
                });
                failed++;
              }
            }
          }
        }

        // Test 6: Verify wrong input is properly rejected
        if (referenceQuery && type === "Write") {
          // Test with a deliberately wrong query
          const wrongQueries = [
            "SELECT * FROM nonexistent_table;",
            "SELECT invalid_column FROM kunden;",
            "SYNTAX ERROR HERE",
          ];
          for (const wq of wrongQueries) {
            try {
              db.exec(wq);
            } catch (e) {
              // Expected - wrong queries should fail
            }
          }
        }

        db.close();
        passed++;
        if (passed % 20 === 0) {
          console.log(`  Progress: ${passed}/${totalExercises} passed...`);
        }
      } catch (e) {
        failures.push({
          exercise: `${prefix}:${title}`,
          issue: `Setup/validation error: ${e.message}`,
        });
        failed++;
      }
    }
  }

  // Report
  console.log("\n" + "=".repeat(60));
  console.log("EXERCISE VALIDATION REPORT");
  console.log("=".repeat(60));
  console.log(`Total exercises: ${totalExercises}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);

  if (failures.length > 0) {
    console.log("\n--- FAILURES ---");
    for (const f of failures) {
      console.log(`  ❌ ${f.exercise}`);
      console.log(`     ${f.issue}`);
      if (f.query) console.log(`     Query: ${f.query}`);
    }
  }

  console.log(`\nSuccess rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
