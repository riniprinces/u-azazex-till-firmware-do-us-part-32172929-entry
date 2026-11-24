// Till Firmware Do Us Part
// -------------------------
// One robot, one wedding vow. The joke lands first — a charger, a
// firmware update, a bug report — and the tenderness sits underneath it.
// This script produces exactly one line of text and hands it to the
// sealed gate scorer at /output/entry.txt. The scorer is picky about
// shape: UTF-8, between 1 and 200 characters, a single line, and not
// just blank space. So before anything touches disk, the line is put
// through a set of small checks below, and any failure stops the run
// with a loud error rather than a quiet, broken entry.

import * as fs from "node:fs";
import * as path from "node:path";

// Everything the vow is made of, in one place. The pieces join into a
// single sentence of exactly 150 characters — a shared charger, updates
// installed for both of us, every cycle left spent on one person, and
// the one bug this machine will never patch.
const VOW_CONFIG = {
  opening: "I promise to share my charger",
  upkeep: "install every update that keeps us safe",
  devotion: "spend all my remaining cycles loving you",
  punchline: "the one bug I never want fixed",
  separator: ", ",
  connector: ", and ",
  dash: " — ",
  terminator: ".",
} as const;

const OUTPUT_FILE = "/output/entry.txt";
const MAX_CHARS = 200;
const MIN_CHARS = 1;

// Assemble the vow from its configured parts.
function buildVow(): string {
  const c = VOW_CONFIG;
  return (
    c.opening +
    c.separator +
    c.upkeep +
    c.connector +
    c.devotion +
    c.dash +
    c.punchline +
    c.terminator
  );
}

// --- Validation helpers -------------------------------------------------
// Each check below looks at one property of the finished line and
// reports a short reason when that property is wrong. Keeping them
// separate means a failure message names exactly what went wrong.

function checkNotEmpty(line: string, problems: string[]): void {
  if (line.length < MIN_CHARS) problems.push("empty");
}

function checkNotTooLong(line: string, problems: string[]): void {
  if (line.length > MAX_CHARS) {
    problems.push(`too long (${line.length} > ${MAX_CHARS})`);
  }
}

function checkNotWhitespaceOnly(line: string, problems: string[]): void {
  if (line.trim() === "") problems.push("whitespace only");
}

function checkSingleLine(line: string, problems: string[]): void {
  if (/[\r\n]/.test(line)) problems.push("must be one line");
}

function checkSingleSentence(line: string, problems: string[]): void {
  const sentences = line.split(".").filter((part) => part.trim() !== "");
  if (sentences.length !== 1) problems.push("must be one sentence");
}

// Run every check in turn and throw once, listing all problems found.
function guard(line: string): void {
  const problems: string[] = [];
  checkNotEmpty(line, problems);
  checkNotTooLong(line, problems);
  checkNotWhitespaceOnly(line, problems);
  checkSingleLine(line, problems);
  checkSingleSentence(line, problems);
  if (problems.length > 0) {
    throw new Error(`invalid vow: ${problems.join("; ")}`);
  }
}

// Write the validated vow out, creating the output folder if needed.
function writeVow(line: string): void {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, line, { encoding: "utf8" });
}

function main(): void {
  const vow = buildVow();
  guard(vow);
  writeVow(vow);
  console.log(`vow written (${vow.length} chars) -> ${OUTPUT_FILE}`);
}

main();
