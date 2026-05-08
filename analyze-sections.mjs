import { readFileSync } from "fs";

const content = readFileSync("src/data/learnContent.ts", "utf8");

// Find all section content blocks
const sectionRegex =
  /id:\s*"([^"]+)"[^}]*?sectionType:\s*"(\w+)"[^}]*?content:\s*`([\s\S]*?)`/g;
let match;
const sections = [];

while ((match = sectionRegex.exec(content)) !== null) {
  const id = match[1];
  const type = match[2];
  const text = match[3];
  // Remove SQL code blocks
  const textOnly = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\|/g, "")
    .trim();
  const lines = textOnly.split("\n").filter((l) => l.trim().length > 0).length;
  if (lines < 8) {
    sections.push({
      id,
      type,
      lines,
      preview: textOnly.substring(0, 100).replace(/\n/g, " "),
    });
  }
}

sections.sort((a, b) => a.lines - b.lines);
console.log("Sections with <8 text lines:", sections.length);
sections.forEach((s) =>
  console.log(`${s.lines} lines | ${s.type} | ${s.id} | ${s.preview}`)
);
