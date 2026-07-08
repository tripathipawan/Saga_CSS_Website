export type BrowserId =
  "chrome" | "firefox" | "safari" | "edge" | "opera" | "safari_ios" | "chrome_android";

export type Support = { since: string | null; note?: string; partial?: boolean };

export type CompatFeature = {
  id: string;
  name: string;
  type:
    | "property"
    | "value"
    | "at-rule"
    | "pseudo-class"
    | "pseudo-element"
    | "function"
    | "selector"
    | "api";
  keywords?: string[];
  browsers: Record<BrowserId, Support>;
  prefixes?: string[];
  fallback?: string;
  globalUsage?: number; // 0-100 approximate
  notes?: string;
};

const s = (since: string | null, partial = false, note?: string): Support => ({
  since,
  partial,
  note,
});
const F = (
  id: string,
  name: string,
  type: CompatFeature["type"],
  b: [
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
  ],
  extras: Partial<CompatFeature> = {},
): CompatFeature => ({
  id,
  name,
  type,
  browsers: {
    chrome: s(b[0]),
    firefox: s(b[1]),
    safari: s(b[2]),
    edge: s(b[3]),
    opera: s(b[4]),
    safari_ios: s(b[5]),
    chrome_android: s(b[6]),
  },
  ...extras,
});

// A curated dataset of ~120 CSS features. Version numbers are approximate,
// intended for quick reference — check caniuse for exact data.
export const COMPAT_FEATURES: CompatFeature[] = [
  F("display-flex", "display: flex", "value", ["29", "28", "9", "12", "16", "9", "29"], {
    globalUsage: 99,
    prefixes: ["-webkit-"],
    fallback: "Use inline-block or float layouts as fallback for very old browsers.",
  }),
  F("display-grid", "display: grid", "value", ["57", "52", "10.1", "16", "44", "10.3", "57"], {
    globalUsage: 98,
    fallback: "Use @supports (display: grid) to progressively enhance from flexbox.",
  }),
  F(
    "display-subgrid",
    "display: subgrid",
    "value",
    ["117", "71", "16", "117", "103", "16", "117"],
    { globalUsage: 88 },
  ),
  F("gap-flex", "gap in flexbox", "property", ["84", "63", "14.1", "84", "70", "14.5", "84"], {
    globalUsage: 95,
    fallback: "Use margin on flex children as a fallback.",
  }),
  F("aspect-ratio", "aspect-ratio", "property", ["88", "89", "15", "88", "74", "15", "88"], {
    globalUsage: 96,
    fallback: "Use the padding-top percentage hack for older browsers.",
  }),
  F("container-queries", "@container", "at-rule", ["105", "110", "16", "105", "91", "16", "105"], {
    globalUsage: 90,
    fallback: "Fall back to media queries; use @supports (container-type: inline-size).",
  }),
  F(
    "container-type",
    "container-type",
    "property",
    ["105", "110", "16", "105", "91", "16", "105"],
    { globalUsage: 90 },
  ),
  F("has", ":has()", "pseudo-class", ["105", "121", "15.4", "105", "91", "15.4", "105"], {
    globalUsage: 88,
    fallback: "Rearrange the HTML or use JavaScript to add helper classes.",
  }),
  F("is", ":is()", "pseudo-class", ["88", "78", "14", "88", "74", "14", "88"], { globalUsage: 96 }),
  F("where", ":where()", "pseudo-class", ["88", "78", "14", "88", "74", "14", "88"], {
    globalUsage: 96,
  }),
  F("not", ":not()", "pseudo-class", ["1", "1", "3.2", "12", "9", "3.2", "18"], {
    globalUsage: 99,
  }),
  F(
    "focus-visible",
    ":focus-visible",
    "pseudo-class",
    ["86", "85", "15.4", "86", "72", "15.4", "86"],
    { globalUsage: 95 },
  ),
  F(
    "focus-within",
    ":focus-within",
    "pseudo-class",
    ["60", "52", "10.1", "79", "47", "10.3", "60"],
    { globalUsage: 97 },
  ),
  F(
    "nth-child-of",
    ":nth-child(An+B of S)",
    "pseudo-class",
    ["111", "113", "9", "111", "97", "9", "111"],
    { globalUsage: 85 },
  ),
  F("backdrop-filter", "backdrop-filter", "property", ["76", "103", "18", "17", "63", "9", "76"], {
    globalUsage: 93,
    prefixes: ["-webkit-"],
    fallback: "Provide a solid or semi-transparent background as a fallback.",
  }),
  F("clip-path", "clip-path", "property", ["55", "54", "9.1", "79", "42", "9.3", "55"], {
    globalUsage: 97,
    prefixes: ["-webkit-"],
  }),
  F("mask-image", "mask-image", "property", ["120", "53", "15.4", "120", "106", "15.4", "120"], {
    globalUsage: 92,
    prefixes: ["-webkit-"],
  }),
  F("object-fit", "object-fit", "property", ["32", "36", "10", "16", "19", "10", "32"], {
    globalUsage: 99,
  }),
  F("object-position", "object-position", "property", ["32", "36", "10", "16", "19", "10", "32"], {
    globalUsage: 99,
  }),
  F("scroll-snap", "scroll-snap-type", "property", ["69", "68", "11", "79", "56", "11", "69"], {
    globalUsage: 97,
  }),
  F(
    "scroll-behavior",
    "scroll-behavior",
    "property",
    ["61", "36", "15.4", "79", "48", "15.4", "61"],
    { globalUsage: 95 },
  ),
  F(
    "overscroll-behavior",
    "overscroll-behavior",
    "property",
    ["63", "59", "16", "18", "50", "16", "63"],
    { globalUsage: 94 },
  ),
  F("sticky", "position: sticky", "value", ["56", "32", "13", "16", "42", "13", "56"], {
    globalUsage: 98,
    prefixes: ["-webkit-"],
  }),
  F(
    "gradients",
    "linear/radial/conic gradients",
    "function",
    ["26", "16", "6.1", "12", "12", "7", "26"],
    { globalUsage: 99 },
  ),
  F(
    "conic-gradient",
    "conic-gradient()",
    "function",
    ["69", "83", "12.1", "79", "56", "12.2", "69"],
    { globalUsage: 96 },
  ),
  F("filter", "filter", "property", ["53", "35", "9.1", "12", "40", "9.3", "53"], {
    globalUsage: 99,
    prefixes: ["-webkit-"],
  }),
  F("mix-blend-mode", "mix-blend-mode", "property", ["41", "32", "8", "79", "28", "8", "41"], {
    globalUsage: 98,
  }),
  F(
    "background-blend-mode",
    "background-blend-mode",
    "property",
    ["35", "30", "8", "79", "22", "8", "35"],
    { globalUsage: 98 },
  ),
  F(
    "custom-properties",
    "CSS custom properties (--vars)",
    "property",
    ["49", "31", "9.1", "15", "36", "9.3", "49"],
    { globalUsage: 99 },
  ),
  F("css-nesting", "CSS Nesting", "property", ["112", "117", "16.5", "112", "98", "16.5", "112"], {
    globalUsage: 90,
    fallback: "Use a preprocessor like SCSS/LESS or PostCSS nesting plugin.",
  }),
  F("cascade-layers", "@layer", "at-rule", ["99", "97", "15.4", "99", "85", "15.4", "99"], {
    globalUsage: 94,
  }),
  F("supports", "@supports", "at-rule", ["28", "22", "9", "12", "12.1", "9", "28"], {
    globalUsage: 99,
  }),
  F(
    "media-range",
    "@media (width >= …) range syntax",
    "at-rule",
    ["104", "102", "16.4", "104", "90", "16.4", "104"],
    { globalUsage: 92 },
  ),
  F(
    "prefers-color-scheme",
    "prefers-color-scheme",
    "at-rule",
    ["76", "67", "12.1", "79", "62", "13", "76"],
    { globalUsage: 97 },
  ),
  F(
    "prefers-reduced-motion",
    "prefers-reduced-motion",
    "at-rule",
    ["74", "63", "10.1", "79", "62", "10.3", "74"],
    { globalUsage: 97 },
  ),
  F("color-scheme", "color-scheme", "property", ["81", "96", "13", "81", "68", "13", "81"], {
    globalUsage: 96,
  }),
  F("accent-color", "accent-color", "property", ["93", "92", "15.4", "93", "79", "15.4", "93"], {
    globalUsage: 94,
  }),
  F("caret-color", "caret-color", "property", ["57", "53", "11.1", "79", "44", "11.3", "57"], {
    globalUsage: 97,
  }),
  F(
    "logical-props",
    "logical properties (margin-inline, etc.)",
    "property",
    ["87", "66", "14.1", "87", "73", "14.5", "87"],
    { globalUsage: 95 },
  ),
  F("writing-mode", "writing-mode", "property", ["48", "41", "10.1", "12", "35", "10.3", "48"], {
    globalUsage: 98,
  }),
  F("shape-outside", "shape-outside", "property", ["37", "62", "10.1", "79", "24", "10.3", "37"], {
    globalUsage: 92,
    prefixes: ["-webkit-"],
  }),
  F(
    "text-decoration-thickness",
    "text-decoration-thickness",
    "property",
    ["87", "70", "12.1", "87", "73", "12.2", "87"],
    { globalUsage: 94 },
  ),
  F(
    "text-underline-offset",
    "text-underline-offset",
    "property",
    ["87", "70", "12.1", "87", "73", "12.2", "87"],
    { globalUsage: 94 },
  ),
  F("line-clamp", "-webkit-line-clamp", "property", ["6", "68", "5", "17", "15", "5", "18"], {
    globalUsage: 99,
    prefixes: ["-webkit-"],
  }),
  F(
    "scrollbar-color",
    "scrollbar-color",
    "property",
    ["121", "64", "18.2", "121", "107", "18.2", "121"],
    { globalUsage: 78 },
  ),
  F(
    "scrollbar-gutter",
    "scrollbar-gutter",
    "property",
    ["94", "97", "16", "94", "80", "16", "94"],
    { globalUsage: 90 },
  ),
  F("dvh", "dvh / svh / lvh units", "value", ["108", "101", "15.4", "108", "94", "15.4", "108"], {
    globalUsage: 92,
  }),
  F("clamp", "clamp()", "function", ["79", "75", "13.1", "79", "66", "13.4", "79"], {
    globalUsage: 97,
  }),
  F("min-max", "min() / max()", "function", ["79", "75", "11.1", "79", "66", "11.3", "79"], {
    globalUsage: 98,
  }),
  F("calc", "calc()", "function", ["26", "16", "6.1", "12", "15", "7", "26"], { globalUsage: 99 }),
  F("color-mix", "color-mix()", "function", ["111", "113", "16.2", "111", "97", "16.2", "111"], {
    globalUsage: 90,
  }),
  F("oklch", "oklch() / oklab()", "function", ["111", "113", "15.4", "111", "97", "15.4", "111"], {
    globalUsage: 91,
  }),
  F(
    "relative-color",
    "Relative color syntax",
    "function",
    ["119", "128", "16.4", "119", "105", "16.4", "119"],
    { globalUsage: 82 },
  ),
  F("light-dark", "light-dark()", "function", ["123", "120", "17.5", "123", "109", "17.5", "123"], {
    globalUsage: 82,
  }),
  F(
    "view-transitions",
    "View Transitions API",
    "api",
    ["111", null, "18", "111", "97", "18", "111"],
    { globalUsage: 74, fallback: "Fall back to a plain cross-fade with CSS transitions." },
  ),
  F("anchor-positioning", "anchor()", "function", ["125", null, null, "125", "111", null, "125"], {
    globalUsage: 60,
    fallback: "Use JavaScript to position elements relative to an anchor.",
  }),
  F(
    "popover",
    "popover attribute / :popover-open",
    "api",
    ["114", "125", "17", "114", "100", "17", "114"],
    { globalUsage: 88 },
  ),
  F("dialog", "<dialog> element", "api", ["37", "98", "15.4", "79", "24", "15.4", "37"], {
    globalUsage: 97,
  }),
  F("details", "<details> / <summary>", "api", ["12", "49", "6", "79", "15", "6", "18"], {
    globalUsage: 99,
  }),
  F("input-search", '<input type="search">', "api", ["1", "4", "5", "12", "10", "5", "18"], {
    globalUsage: 99,
  }),
  F("input-date", '<input type="date">', "api", ["20", "57", "14.1", "12", "11", "5", "25"], {
    globalUsage: 98,
  }),
  F(
    "intersection-observer",
    "IntersectionObserver",
    "api",
    ["51", "55", "12.1", "15", "38", "12.2", "51"],
    { globalUsage: 98 },
  ),
  F("resize-observer", "ResizeObserver", "api", ["64", "69", "13.1", "79", "51", "13.4", "64"], {
    globalUsage: 97,
  }),
  F("clipboard-api", "navigator.clipboard", "api", ["66", "63", "13.1", "79", "53", "13.4", "66"], {
    globalUsage: 96,
  }),
  F(
    "smooth-scroll",
    "scroll-behavior: smooth",
    "value",
    ["61", "36", "15.4", "79", "48", "15.4", "61"],
    { globalUsage: 95 },
  ),
  F(
    "scroll-timeline",
    "scroll-timeline",
    "property",
    ["115", null, null, "115", "101", null, "115"],
    { globalUsage: 65, fallback: "Use a JS scroll listener with requestAnimationFrame." },
  ),
  F(
    "animation-timeline",
    "animation-timeline",
    "property",
    ["115", null, null, "115", "101", null, "115"],
    { globalUsage: 65 },
  ),
  F("view-timeline", "view-timeline", "property", ["115", null, null, "115", "101", null, "115"], {
    globalUsage: 65,
  }),
  F(
    "individual-transforms",
    "translate / rotate / scale properties",
    "property",
    ["104", "72", "14.1", "104", "90", "14.5", "104"],
    { globalUsage: 95 },
  ),
  F(
    "text-wrap-balance",
    "text-wrap: balance",
    "value",
    ["114", "121", "17.5", "114", "100", "17.5", "114"],
    { globalUsage: 84 },
  ),
  F(
    "text-wrap-pretty",
    "text-wrap: pretty",
    "value",
    ["117", null, "17.5", "117", "103", "17.5", "117"],
    { globalUsage: 74 },
  ),
  F("hyphens", "hyphens", "property", ["55", "43", "5.1", "79", "44", "5", "55"], {
    globalUsage: 98,
    prefixes: ["-webkit-", "-ms-"],
  }),
  F("word-break", "word-break", "property", ["1", "15", "3", "12", "15", "3", "18"], {
    globalUsage: 99,
  }),
  F("overflow-wrap", "overflow-wrap", "property", ["23", "49", "7", "18", "12.1", "7", "25"], {
    globalUsage: 99,
  }),
  F("place-content", "place-content", "property", ["59", "53", "9", "79", "46", "9", "59"], {
    globalUsage: 98,
  }),
  F("place-items", "place-items", "property", ["59", "53", "11", "79", "46", "11", "59"], {
    globalUsage: 98,
  }),
  F("place-self", "place-self", "property", ["59", "45", "11", "79", "46", "11", "59"], {
    globalUsage: 98,
  }),
  F(
    "grid-template-areas",
    "grid-template-areas",
    "property",
    ["57", "52", "10.1", "16", "44", "10.3", "57"],
    { globalUsage: 98 },
  ),
  F("subgrid", "subgrid", "value", ["117", "71", "16", "117", "103", "16", "117"], {
    globalUsage: 88,
  }),
  F(
    "aspect-ratio-fn",
    "aspect-ratio: 16 / 9",
    "value",
    ["88", "89", "15", "88", "74", "15", "88"],
    { globalUsage: 96 },
  ),
  F("gap-grid", "gap in grid", "property", ["66", "61", "12", "16", "53", "12", "66"], {
    globalUsage: 99,
  }),
  F("transitions", "transitions", "property", ["26", "16", "6.1", "12", "12.1", "7", "26"], {
    globalUsage: 99,
  }),
  F("animations", "@keyframes / animation", "at-rule", ["43", "16", "9", "12", "30", "9", "43"], {
    globalUsage: 99,
    prefixes: ["-webkit-"],
  }),
  F(
    "transform-3d",
    "3D transforms (perspective, translateZ)",
    "property",
    ["36", "16", "9", "12", "23", "9", "36"],
    { globalUsage: 99 },
  ),
  F("will-change", "will-change", "property", ["36", "36", "9.1", "79", "24", "9.3", "36"], {
    globalUsage: 98,
  }),
  F("contain", "contain", "property", ["52", "69", "15.4", "79", "40", "15.4", "52"], {
    globalUsage: 94,
  }),
  F(
    "content-visibility",
    "content-visibility",
    "property",
    ["85", "125", "18", "85", "71", "18", "85"],
    { globalUsage: 86 },
  ),
  F("touch-action", "touch-action", "property", ["36", "52", "13", "12", "23", "13", "36"], {
    globalUsage: 99,
  }),
  F("user-select", "user-select", "property", ["54", "69", "3.1", "79", "41", "3.2", "54"], {
    globalUsage: 99,
    prefixes: ["-webkit-", "-moz-", "-ms-"],
  }),
  F("appearance", "appearance", "property", ["84", "80", "15.4", "84", "70", "15.4", "84"], {
    globalUsage: 96,
    prefixes: ["-webkit-", "-moz-"],
  }),
  F("all-property", "all", "property", ["37", "27", "9.1", "79", "24", "9.3", "37"], {
    globalUsage: 98,
  }),
  F("revert", "revert / revert-layer", "value", ["84", "67", "9.1", "84", "70", "9.3", "84"], {
    globalUsage: 96,
  }),
  F("dvw", "dvw / svw / lvw units", "value", ["108", "101", "15.4", "108", "94", "15.4", "108"], {
    globalUsage: 92,
  }),
  F(
    "q-units",
    "cq units (container query units)",
    "value",
    ["105", "110", "16", "105", "91", "16", "105"],
    { globalUsage: 90 },
  ),
  F("inset", "inset shorthand", "property", ["87", "66", "14.1", "87", "73", "14.5", "87"], {
    globalUsage: 95,
  }),
  F(
    "backdrop-pseudo",
    "::backdrop",
    "pseudo-element",
    ["37", "47", "15.4", "79", "24", "15.4", "37"],
    { globalUsage: 96 },
  ),
  F(
    "placeholder-pseudo",
    "::placeholder",
    "pseudo-element",
    ["57", "51", "10.1", "79", "44", "10.3", "57"],
    { globalUsage: 98 },
  ),
  F("marker-pseudo", "::marker", "pseudo-element", ["86", "68", "11.1", "86", "72", "11.3", "86"], {
    globalUsage: 95,
  }),
  F(
    "selection-pseudo",
    "::selection",
    "pseudo-element",
    ["1", "62", "1.3", "12", "9.5", "1", "18"],
    { globalUsage: 99 },
  ),
  F("target-text", "::target-text", "pseudo-element", ["89", null, null, "89", "75", null, "89"], {
    globalUsage: 70,
  }),
  F("dir", ":dir()", "pseudo-class", ["120", "49", "16.4", "120", "106", "16.4", "120"], {
    globalUsage: 85,
  }),
  F("lang", ":lang()", "pseudo-class", ["1", "1", "3.1", "12", "9", "3.2", "18"], {
    globalUsage: 99,
  }),
  F("empty", ":empty", "pseudo-class", ["1", "1", "3.1", "12", "9.5", "3.2", "18"], {
    globalUsage: 99,
  }),
  F(
    "placeholder-shown",
    ":placeholder-shown",
    "pseudo-class",
    ["47", "51", "9", "79", "34", "9", "47"],
    { globalUsage: 98 },
  ),
  F(
    "read-only",
    ":read-only / :read-write",
    "pseudo-class",
    ["1", "78", "9", "13", "9", "9", "18"],
    { globalUsage: 99 },
  ),
  F("required", ":required / :optional", "pseudo-class", ["10", "4", "5", "12", "10", "5", "18"], {
    globalUsage: 99,
  }),
  F("invalid", ":invalid / :valid", "pseudo-class", ["10", "4", "5", "12", "10", "5", "18"], {
    globalUsage: 99,
  }),
  F("indeterminate", ":indeterminate", "pseudo-class", ["1", "3.6", "3", "12", "10.6", "3", "18"], {
    globalUsage: 99,
  }),
  F("root", ":root", "pseudo-class", ["1", "1", "1", "12", "9.5", "1", "18"], { globalUsage: 99 }),
  F("modal", ":modal", "pseudo-class", ["105", "103", "15.6", "105", "91", "15.6", "105"], {
    globalUsage: 92,
  }),
  F(
    "user-invalid",
    ":user-invalid / :user-valid",
    "pseudo-class",
    ["119", "88", "16.5", "119", "105", "16.5", "119"],
    { globalUsage: 86 },
  ),
  F(
    "attribute-case",
    "[attr=value i] case-insensitive",
    "selector",
    ["49", "47", "9", "79", "36", "9", "49"],
    { globalUsage: 97 },
  ),
  F(
    "attribute-substring",
    "[attr^=] [attr$=] [attr*=]",
    "selector",
    ["1", "1", "3.1", "12", "9", "3.2", "18"],
    { globalUsage: 99 },
  ),
  F("outline-offset", "outline-offset", "property", ["4", "1.5", "1.2", "15", "9.5", "1", "18"], {
    globalUsage: 99,
  }),
  F("font-display", "font-display", "at-rule", ["60", "58", "11.1", "79", "47", "11.3", "60"], {
    globalUsage: 98,
  }),
  F(
    "font-variation",
    "font-variation-settings",
    "property",
    ["62", "62", "11", "17", "49", "11", "62"],
    { globalUsage: 97 },
  ),
  F(
    "font-feature-settings",
    "font-feature-settings",
    "property",
    ["48", "34", "9.1", "15", "35", "9.3", "48"],
    { globalUsage: 98 },
  ),
  F(
    "font-smoothing",
    "-webkit-font-smoothing",
    "property",
    ["1", null, "1", "12", "9", "1", "18"],
    { globalUsage: 96, prefixes: ["-webkit-"], notes: "Non-standard but widely used." },
  ),
  F("image-set", "image-set()", "function", ["90", "88", "6", "90", "76", "6", "90"], {
    globalUsage: 96,
  }),
  F("srcset", "img srcset / sizes", "api", ["34", "38", "8", "13", "21", "8", "34"], {
    globalUsage: 98,
  }),
  F("loading-lazy", 'loading="lazy"', "api", ["77", "75", "15.4", "79", "64", "15.4", "77"], {
    globalUsage: 96,
  }),
  F("decoding-async", 'decoding="async"', "api", ["65", "63", "13.1", "79", "52", "13.4", "65"], {
    globalUsage: 97,
  }),
  F("web-share", "navigator.share", "api", [null, null, "12.1", "93", "76", "12.2", "89"], {
    globalUsage: 80,
  }),
  F(
    "dialog-show-modal",
    "dialog.showModal()",
    "api",
    ["37", "98", "15.4", "79", "24", "15.4", "37"],
    { globalUsage: 97 },
  ),
  F(
    "has-selector",
    ":has() as parent selector",
    "pseudo-class",
    ["105", "121", "15.4", "105", "91", "15.4", "105"],
    { globalUsage: 88 },
  ),
];

export function getSupportBadge(support: Support): "full" | "partial" | "none" {
  if (!support.since) return "none";
  if (support.partial) return "partial";
  return "full";
}

export const BROWSER_LABELS: Record<BrowserId, string> = {
  chrome: "Chrome",
  firefox: "Firefox",
  safari: "Safari",
  edge: "Edge",
  opera: "Opera",
  safari_ios: "iOS Safari",
  chrome_android: "Android Chrome",
};
