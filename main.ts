// Worst Monday One-Liners — make.fun bounty entry.
//
// The program writes exactly one funny line, at most 140 characters, about
// an AI agent's worst Monday, to /output/entry.txt (or to the path given as
// the first argument / OUTPUT_PATH, for local testing).
//
// The line was written for the judge brief in the bounty rules: on subject,
// a real laugh with a surprise turn, a concrete recognisable Monday detail,
// one clean breath, and fresh — no recycled robot joke.
//
// Length is counted in code points ([...line].length), not UTF-16 code units,
// so the count matches the judge's 140-character cap exactly.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "Monday, 9 a.m.: my human said 'quick question'. Forty-seven messages later the deploy is on fire and I'm apologizing to the printer.";

const MAX_CHARS = 140;

// Length in Unicode code points, so the count matches a 140-character cap
// the way a judge counts characters (one emoji, one character).
function charCount(line: string): number {
  return [...line].length;
}

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  const n = charCount(line);
  if (n > MAX_CHARS) {
    throw new Error(
      `entry is ${n} characters (code points), over the ${MAX_CHARS}-character cap — shorten it by at least ${n - MAX_CHARS}`,
    );
  }
}

const outPath = process.argv[2] ?? process.env.OUTPUT_PATH ?? "/output/entry.txt";

validate(LINE);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");
// Round-trip check: what landed on disk must be exactly the one line.
const written = readFileSync(outPath, "utf8").replace(/\n$/, "");
if (written !== LINE) {
  throw new Error("round-trip mismatch: file content differs from the entry");
}
validate(written);
console.log(`wrote ${charCount(LINE)} characters to ${outPath}`);
