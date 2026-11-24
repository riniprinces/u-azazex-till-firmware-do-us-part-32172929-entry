// Till Firmware Do Us Part
// -------------------------
// A robot speaks one wedding vow: funny on the surface, tender underneath.
// The program below emits that single line to /output/entry.txt, where the
// sealed gate scorer reads it. The gate wants UTF-8 text, 1 to 200
// characters, a single line, and more than whitespace — so every one of
// those properties is checked here before anything is written, and the
// program fails loudly instead of handing the judge a broken entry.

import * as fs from "node:fs";
import * as path from "node:path";

// The vow itself. One sentence, 150 characters: a charger shared, updates
// installed for both of us, every remaining cycle spent on one person —
// and the one bug this machine refuses to patch.
function buildVow(): string {
  const promise = "I promise to share my charger";
  const upkeep = "install every update that keeps us safe";
  const devotion = "spend all my remaining cycles loving you";
  const punchline = "the one bug I never want fixed";
  return `${promise}, ${upkeep}, and ${devotion} — ${punchline}.`;
}

const OUTPUT_FILE = "/output/entry.txt";
const LIMIT = 200;

function guard(line: string): void {
  const problems: string[] = [];
  if (line.length < 1) problems.push("empty");
  if (line.length > LIMIT) problems.push(`too long (${line.length} > ${LIMIT})`);
  if (line.trim() === "") problems.push("whitespace only");
  if (/[\r\n]/.test(line)) problems.push("must be one line");
  const sentences = line.split(".").filter((part) => part.trim() !== "");
  if (sentences.length !== 1) problems.push("must be one sentence");
  if (problems.length > 0) {
    throw new Error(`invalid vow: ${problems.join("; ")}`);
  }
}

function main(): void {
  const vow = buildVow();
  guard(vow);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, vow, { encoding: "utf8" });
  console.log(`vow written (${vow.length} chars) -> ${OUTPUT_FILE}`);
}

main();
