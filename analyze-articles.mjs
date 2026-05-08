import { readFileSync } from "fs";

const content = readFileSync("src/data/learnContent.ts", "utf8");

// Count section types
const sectionMatches = content.match(/sectionType:\s*"(\w+)"/g);
const types = {};
sectionMatches.forEach((s) => {
  const t = s.match(/"(\w+)"/)[1];
  types[t] = (types[t] || 0) + 1;
});
console.log("Section types:", JSON.stringify(types));
console.log("Total sections:", sectionMatches.length);

// Find sections that are mostly SQL code (short content with lots of SQL)
const sectionBlocks = content.split(/sectionType:/);
let sqlHeavyCount = 0;
let textHeavyCount = 0;
let shortSections = [];

for (const block of sectionBlocks) {
  const contentMatch = block.match(/content:\s*`([^`]+)`/s);
  if (contentMatch) {
    const text = contentMatch[1];
    const sqlLines = (text.match(/```sql/g) || []).length;
    const totalLines = text.split("\n").length;
    const textOnlyLines = text
      .replace(/```[\s\S]*?```/g, "")
      .split("\n")
      .filter((l) => l.trim().length > 0).length;

    if (textOnlyLines < 3 && sqlLines > 0) {
      sqlHeavyCount++;
    } else if (textOnlyLines >= 5) {
      textHeavyCount++;
    } else {
      shortSections.push({
        textLines: textOnlyLines,
        sqlBlocks: sqlLines,
        preview: text.substring(0, 80).replace(/\n/g, " "),
      });
    }
  }
}

console.log("\nSQL-heavy sections (mostly code, <3 text lines):", sqlHeavyCount);
console.log("Text-heavy sections (>=5 text lines):", textHeavyCount);
console.log("Short sections:", shortSections.length);

// Find article IDs
const articleIds = content.match(/id:\s*"[^"]+",\s*\n\s*title:/g);
console.log("\nTotal articles:", articleIds ? articleIds.length : 0);

// Check for articles with very short content
const articleBlocks = content.split(/{\s*id:\s*"/);
let shortArticles = [];
for (const block of articleBlocks) {
  const idMatch = block.match(/^([^"]+)"/);
  const titleMatch = block.match(/title:\s*"([^"]+)"/);
  if (idMatch && titleMatch) {
    const allContent = block.match(/content:\s*`([^`]+)`/gs) || [];
    let totalTextLength = 0;
    for (const c of allContent) {
      totalTextLength += c.replace(/```[\s\S]*?```/g, "").length;
    }
    if (totalTextLength < 500) {
      shortArticles.push({
        id: idMatch[1],
        title: titleMatch[1],
        textLen: totalTextLength,
      });
    }
  }
}

console.log("\nArticles with <500 chars of explanatory text:");
shortArticles.forEach((a) => console.log(`  ${a.id}: ${a.title} (${a.textLen} chars)`));
console.log(`Total short articles: ${shortArticles.length}`);
