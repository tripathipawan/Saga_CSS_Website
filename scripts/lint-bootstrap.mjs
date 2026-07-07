#!/usr/bin/env node
// Fails if any `bootstrap` code-panel snippet in src/routes/**/*.tsx
// contains an inline style="…" attribute. Bootstrap panels must emit
// utility-class markup only (optional _custom.scss for gaps).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["src/routes/tools", "src/routes/styles"];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(p);
  }
  return out;
}

// Extract every template literal assigned/passed as a `bootstrap` value.
// Handles `bootstrap = \`...\``, `bootstrap: \`...\``, `bootstrap={\`...\`}`,
// including a leading `useMemo(() => \`...\`, …)` wrapper. Backticks inside
// ${…} interpolations are not supported (none exist in this codebase).
function extractBootstrapLiterals(src) {
  const literals = [];
  const re = /\bbootstrap\s*[:=]\s*(?:\{\s*)?(?:useMemo\s*\(\s*\(\s*\)\s*=>\s*)?`/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    let i = re.lastIndex; // position after the opening backtick
    let depth = 0;
    const start = i;
    while (i < src.length) {
      const ch = src[i];
      if (ch === "\\") { i += 2; continue; }
      if (ch === "$" && src[i + 1] === "{") { depth++; i += 2; continue; }
      if (ch === "}" && depth > 0) { depth--; i++; continue; }
      if (ch === "`" && depth === 0) break;
      i++;
    }
    literals.push({ text: src.slice(start, i), index: start });
    re.lastIndex = i + 1;
  }
  return literals;
}

let failed = 0;
for (const dir of SCAN_DIRS) {
  const abs = join(ROOT, dir);
  for (const file of walk(abs)) {
    const src = readFileSync(file, "utf8");
    for (const { text, index } of extractBootstrapLiterals(src)) {
      if (/\bstyle\s*=\s*"/.test(text)) {
        const line = src.slice(0, index).split("\n").length;
        console.error(
          `\u274c ${relative(ROOT, file)}:${line} — Bootstrap snippet contains inline style="…". Use utility classes or a _custom.scss block instead.`,
        );
        failed++;
      }
    }
  }
}

if (failed) {
  console.error(`\nlint:bootstrap failed with ${failed} violation(s).`);
  process.exit(1);
}
console.log("\u2705 lint:bootstrap — no inline style attributes in Bootstrap snippets.");