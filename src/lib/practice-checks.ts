import type { Challenge } from "./practice-challenges";

export type Matcher = { kind: "exact" | "contains" | "regex" | "near"; value: string; tolerance?: number };
export type ResolvedCheck = { selector: string; prop: string; matcher: Matcher; label?: string };

/**
 * Return the challenge's explicit `checks` when present, otherwise derive
 * a set of checks by parsing the `solutionCss` for declarations against
 * the primary selectors (#target, #stage, .card, etc).
 */
export function resolveChecks(challenge: Challenge): ResolvedCheck[] {
  if (challenge.checks && challenge.checks.length > 0) {
    return challenge.checks.map((c) => ({
      selector: c.selector,
      prop: c.prop,
      matcher: buildMatcher(c.expected),
    }));
  }
  return deriveFromCss(challenge.solutionCss);
}

function buildMatcher(expected: string): Matcher {
  const trimmed = expected.trim();
  // Numeric tolerance for px values
  const px = trimmed.match(/^([\d.]+)px$/);
  if (px) return { kind: "near", value: trimmed, tolerance: 1 };
  return { kind: "exact", value: trimmed };
}

/**
 * Very small CSS parser: extract `selector { prop: value; }` blocks and,
 * for a curated list of "layout-signal" properties, emit checks that we
 * can reliably compare via getComputedStyle.
 */
const CHECKABLE_PROPS = new Set([
  "display", "position", "flex-direction", "flex-wrap", "justify-content", "align-items", "align-content",
  "align-self", "gap", "row-gap", "column-gap", "grid-template-columns", "grid-template-rows",
  "grid-auto-flow", "place-items", "place-content", "text-align", "text-transform", "text-decoration-line",
  "font-weight", "font-style", "letter-spacing", "line-height", "white-space", "overflow", "overflow-x", "overflow-y",
  "object-fit", "aspect-ratio", "border-radius", "opacity", "visibility", "z-index",
  "cursor", "pointer-events", "user-select", "text-overflow", "word-break", "writing-mode",
  "transform", "transition-property", "animation-name", "backdrop-filter", "filter",
  "box-shadow", "background-color", "background-image", "color", "flex-grow", "flex-shrink", "flex-basis",
]);

function deriveFromCss(css: string): ResolvedCheck[] {
  const checks: ResolvedCheck[] = [];
  const seen = new Set<string>();
  const ruleRe = /([^{}]+)\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = ruleRe.exec(css))) {
    const selector = m[1].trim();
    // skip complex selectors we can't safely query in iframe
    if (!selector || selector.includes("@") || /::|:hover|:focus|:active|:checked/.test(selector)) continue;
    // handle simple comma-lists by taking the first
    const primary = selector.split(",")[0].trim();
    const body = m[2];
    for (const decl of body.split(";")) {
      const [pRaw, vRaw] = decl.split(":");
      if (!pRaw || vRaw == null) continue;
      const prop = pRaw.trim().toLowerCase();
      const value = vRaw.trim();
      if (!CHECKABLE_PROPS.has(prop)) continue;
      const key = `${primary}|${prop}`;
      if (seen.has(key)) continue;
      seen.add(key);
      checks.push({ selector: primary, prop, matcher: buildMatcher(value) });
    }
  }
  return checks;
}

export type CheckResult = {
  check: ResolvedCheck;
  actual: string | null;
  pass: boolean;
  reason?: string;
};

export function runChecks(iframe: HTMLIFrameElement, checks: ResolvedCheck[]): CheckResult[] {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) return checks.map((c) => ({ check: c, actual: null, pass: false, reason: "Preview not ready" }));
  return checks.map((check) => {
    let el: Element | null = null;
    try { el = doc.querySelector(check.selector); } catch { /* invalid selector */ }
    if (!el) return { check, actual: null, pass: false, reason: "Element not found" };
    const actual = win.getComputedStyle(el).getPropertyValue(check.prop).trim();
    return matchCheck(check, actual);
  });
}

function matchCheck(check: ResolvedCheck, actual: string): CheckResult {
  const { matcher } = check;
  const norm = (v: string) => v.replace(/\s+/g, " ").trim();
  const a = norm(actual);
  const v = norm(matcher.value);
  switch (matcher.kind) {
    case "exact":
      return { check, actual, pass: a === v || a.startsWith(v) };
    case "contains":
      return { check, actual, pass: a.includes(v) };
    case "regex":
      return { check, actual, pass: new RegExp(v).test(a) };
    case "near": {
      const expectedNum = parseFloat(v);
      const actualNum = parseFloat(a);
      if (isNaN(expectedNum) || isNaN(actualNum)) return { check, actual, pass: a === v };
      const tol = matcher.tolerance ?? 1;
      return { check, actual, pass: Math.abs(actualNum - expectedNum) <= tol };
    }
  }
}