export type Specificity = { a: number; b: number; c: number; parts: Token[] };
export type Token = { text: string; kind: "id" | "class" | "attr" | "pseudo-class" | "pseudo-element" | "element" | "universal" | "combinator" | "not-inner" | "is-inner" };

/**
 * Compute CSS specificity for a single (non-comma) selector.
 * Returns [a, b, c] where a = IDs, b = classes/attrs/pseudo-classes, c = elements/pseudo-elements.
 * Handles :not(), :is(), :where() (zero), attribute selectors, pseudo-elements.
 */
export function specificity(selectorRaw: string): Specificity {
  let a = 0, b = 0, c = 0;
  const parts: Token[] = [];
  const s = selectorRaw.trim();
  let i = 0;
  const len = s.length;

  const readBalanced = (): string => {
    // Read from '(' to matching ')'
    let depth = 0;
    let out = "";
    while (i < len) {
      const ch = s[i];
      out += ch;
      if (ch === "(") depth++;
      else if (ch === ")") { depth--; if (depth === 0) { i++; return out; } }
      i++;
    }
    return out;
  };

  while (i < len) {
    const ch = s[i];

    if (/\s/.test(ch) || ch === ">" || ch === "+" || ch === "~") {
      parts.push({ text: ch === " " ? "␣" : ch, kind: "combinator" });
      i++;
      continue;
    }

    if (ch === "*") {
      parts.push({ text: "*", kind: "universal" });
      i++;
      continue;
    }

    if (ch === "#") {
      let id = "#";
      i++;
      while (i < len && /[\w-]/.test(s[i])) { id += s[i++]; }
      a++;
      parts.push({ text: id, kind: "id" });
      continue;
    }

    if (ch === ".") {
      let cls = ".";
      i++;
      while (i < len && /[\w-]/.test(s[i])) { cls += s[i++]; }
      b++;
      parts.push({ text: cls, kind: "class" });
      continue;
    }

    if (ch === "[") {
      let attr = "";
      while (i < len && s[i] !== "]") { attr += s[i++]; }
      if (i < len) { attr += s[i++]; }
      b++;
      parts.push({ text: attr, kind: "attr" });
      continue;
    }

    if (ch === ":") {
      // pseudo-element ::x
      if (s[i + 1] === ":") {
        let pe = "::";
        i += 2;
        while (i < len && /[\w-]/.test(s[i])) { pe += s[i++]; }
        c++;
        parts.push({ text: pe, kind: "pseudo-element" });
        continue;
      }
      // pseudo-class :x or :x(...)
      let pc = ":";
      i++;
      while (i < len && /[\w-]/.test(s[i])) { pc += s[i++]; }
      const lowered = pc.toLowerCase();
      // legacy pseudo-elements without ::
      const legacyPE = new Set([":before", ":after", ":first-line", ":first-letter"]);
      let inner = "";
      if (s[i] === "(") {
        inner = readBalanced();
        pc += inner;
      }
      if (legacyPE.has(lowered)) {
        c++;
        parts.push({ text: pc, kind: "pseudo-element" });
        continue;
      }
      if (lowered === ":where") {
        // Adds 0
        parts.push({ text: pc, kind: "pseudo-class" });
        continue;
      }
      if (lowered === ":is" || lowered === ":not" || lowered === ":has") {
        // Uses highest specificity of args
        const argSrc = inner.slice(1, -1); // strip ( )
        let best: Specificity | null = null;
        for (const alt of splitSelectorList(argSrc)) {
          const sp = specificity(alt);
          if (!best || compare(sp, best) > 0) best = sp;
        }
        if (best) { a += best.a; b += best.b; c += best.c; }
        parts.push({ text: pc, kind: lowered === ":not" ? "not-inner" : "is-inner" });
        continue;
      }
      if (lowered === ":nth-child" || lowered === ":nth-last-child" || lowered === ":nth-of-type" || lowered === ":nth-last-of-type") {
        b++;
        parts.push({ text: pc, kind: "pseudo-class" });
        continue;
      }
      b++;
      parts.push({ text: pc, kind: "pseudo-class" });
      continue;
    }

    if (/[a-zA-Z_-]/.test(ch)) {
      let el = "";
      while (i < len && /[\w-]/.test(s[i])) { el += s[i++]; }
      c++;
      parts.push({ text: el, kind: "element" });
      continue;
    }

    // Unknown, skip
    i++;
  }

  return { a, b, c, parts };
}

export function compare(x: Specificity, y: Specificity): number {
  if (x.a !== y.a) return x.a - y.a;
  if (x.b !== y.b) return x.b - y.b;
  return x.c - y.c;
}

export function fmt(sp: { a: number; b: number; c: number }): string {
  return `${sp.a},${sp.b},${sp.c}`;
}

function splitSelectorList(src: string): string[] {
  const out: string[] = [];
  let depth = 0, buf = "";
  for (const ch of src) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(buf.trim()); buf = ""; }
    else buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}