import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  CornerDownRight,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Minimal CSS.escape polyfill for querySelector attribute values.
const cssEscape = (s: string) =>
  typeof (globalThis as any).CSS !== "undefined" && (globalThis as any).CSS.escape
    ? (globalThis as any).CSS.escape(s)
    : s.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);

export const Route = createFileRoute("/cheat-sheet")({
  head: () => ({
    meta: [
      { title: "CSS Cheat Sheet — Free Printable Reference — SagaCSS" },
      {
        name: "description",
        content:
          "Free, printable CSS cheat sheet — flexbox, grid, box model, selectors, units, colors and animation reference in one page.",
      },
      { property: "og:title", content: "CSS Cheat Sheet — SagaCSS" },
      {
        property: "og:description",
        content: "The essential CSS reference — flexbox, grid, selectors, units. Download as PDF.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/cheat-sheet" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/cheat-sheet" }],
  }),
  component: CheatSheetPage,
});

type Row = {
  prop: string;
  desc: string;
  example?: string;
  values?: { name: string; meaning: string }[];
  examples?: string[];
  gotcha?: string;
  support?: string;
};
type RealWorld = {
  title: string;
  description?: string;
  html: string;
  css: string;
};
type Section = {
  title: string;
  intro: string;
  longIntro?: string;
  rows: Row[];
  realWorld?: RealWorld;
};

const SECTIONS: Section[] = [
  {
    title: "Box Model",
    intro: "Every element is a rectangle: content, padding, border, and margin.",
    longIntro:
      "The CSS box model describes how every element is laid out as a rectangular box with four zones: content, padding, border, and margin. Understanding it is the single most important skill for stopping unexpected layout shifts, alignment bugs, and 'why is this wider than I set it to' moments. Modern layouts (Flexbox, Grid) still resolve down to boxes — get the model wrong and everything downstream fights you.",
    rows: [
      {
        prop: "width / height",
        desc: "Sets the size of the content box by default. With `box-sizing: border-box`, it sets the border box instead (includes padding + border).",
        example: "width: 320px;",
        values: [
          { name: "<length>", meaning: "px, rem, em, etc. Fixed size." },
          {
            name: "<percentage>",
            meaning: "Relative to the containing block's inline/block size.",
          },
          { name: "auto", meaning: "Browser computes based on content and context." },
          {
            name: "min-content / max-content / fit-content",
            meaning: "Intrinsic sizing keywords.",
          },
        ],
        examples: [
          "width: min(90vw, 640px); /* fluid but capped */",
          "height: auto; /* let content decide */",
        ],
        gotcha:
          "Setting height in % only works if the parent has an explicit height — otherwise it collapses to auto.",
        support:
          "Universal. Intrinsic keywords (min-content, fit-content) are widely supported in modern browsers.",
      },
      {
        prop: "padding",
        desc: "Inner space between the border and the content. Padding is always inside the element and adds to its rendered size unless `box-sizing: border-box` is set.",
        example: "padding: 12px 16px;",
        values: [
          { name: "1 value", meaning: "All four sides." },
          { name: "2 values", meaning: "vertical | horizontal." },
          { name: "3 values", meaning: "top | horizontal | bottom." },
          { name: "4 values", meaning: "top | right | bottom | left (clockwise)." },
        ],
        examples: [
          "padding-inline: 1rem; /* logical: left+right in LTR */",
          "padding-block: 0.5rem; /* logical: top+bottom */",
        ],
        gotcha:
          "Percentage padding is resolved against the parent's INLINE size (width) — even for padding-top/bottom.",
      },
      {
        prop: "margin",
        desc: "Outer space around the element. `margin: auto` on a block element with an explicit width horizontally centers it. Vertical margins between adjacent block elements collapse into a single margin.",
        example: "margin: 0 auto;",
        examples: [
          "margin-inline: auto; /* logical centering */",
          "margin-top: -8px; /* negative pulls element up */",
        ],
        gotcha:
          "Margin collapsing: two vertical margins between block siblings merge into the larger of the two (not the sum). Flex and grid children do NOT collapse margins.",
      },
      {
        prop: "border",
        desc: "Shorthand for `border-width border-style border-color`. Adds to the element's rendered size unless box-sizing is border-box.",
        example: "border: 1px solid #000;",
        values: [
          {
            name: "border-style",
            meaning: "none · solid · dashed · dotted · double · groove · ridge · inset · outset",
          },
        ],
        examples: [
          "border-block-end: 2px dashed currentColor;",
          "border: 0; /* remove all borders */",
        ],
        gotcha:
          "Forgetting `border-style` (defaults to none) makes width/color silently do nothing.",
      },
      {
        prop: "box-sizing",
        desc: "Controls whether width/height refer to the content box (default) or the border box (includes padding + border). `border-box` is almost always what you want — the size you set is the size you get.",
        example: "box-sizing: border-box;",
        values: [
          {
            name: "content-box",
            meaning: "Default. width/height = content only. Padding & border add on top.",
          },
          {
            name: "border-box",
            meaning: "width/height = content + padding + border. Recommended global default.",
          },
        ],
        examples: ["*, *::before, *::after { box-sizing: border-box; }"],
        gotcha:
          "Mixing content-box and border-box across a codebase makes layout math unpredictable — set border-box globally via a universal selector.",
        support: "Universal.",
      },
      {
        prop: "overflow",
        desc: "Controls what happens when content is too big for its box. Setting overflow on any axis to a non-visible value creates a new block formatting context (BFC) and can affect scroll containers and sticky positioning.",
        example: "overflow: hidden;",
        values: [
          { name: "visible", meaning: "Default. Content spills out and is still painted." },
          { name: "hidden", meaning: "Clipped, not scrollable, not accessible by keyboard." },
          { name: "clip", meaning: "Like hidden but disallows programmatic scrolling too." },
          { name: "scroll", meaning: "Always shows scrollbars, even when not needed." },
          { name: "auto", meaning: "Scrollbars appear only when content overflows." },
        ],
        gotcha:
          "`overflow: hidden` on an ancestor kills `position: sticky` on descendants — use `overflow: clip` when possible.",
      },
    ],
    realWorld: {
      title: "Product Card",
      description:
        "A card that uses border-box sizing, padding for internal breathing room, margin for spacing between cards, and a border-radius + subtle border.",
      html: `<article class="product-card">
  <h3 class="product-card__title">Ceramic Mug</h3>
  <p class="product-card__price">$18.00</p>
  <button class="product-card__cta">Add to cart</button>
</article>`,
      css: `.product-card {
  box-sizing: border-box;
  width: 260px;
  padding: 20px;
  margin: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
}
.product-card__title { margin: 0 0 8px; font-size: 1.125rem; }
.product-card__price { margin: 0 0 16px; color: #6b7280; }
.product-card__cta {
  width: 100%;
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #6d28d9;
  color: #fff;
  cursor: pointer;
}`,
    },
  },
  {
    title: "Display & Positioning",
    intro: "How elements flow and where they sit on the page.",
    rows: [
      {
        prop: "display",
        desc: "block · inline · inline-block · flex · grid · none.",
        example: "display: flex;",
      },
      { prop: "position: static", desc: "Default; ignores top/left/etc." },
      { prop: "position: relative", desc: "Offset from normal position; still occupies space." },
      { prop: "position: absolute", desc: "Positioned relative to nearest positioned ancestor." },
      { prop: "position: fixed", desc: "Positioned relative to the viewport." },
      {
        prop: "position: sticky",
        desc: "Scrolls until threshold, then sticks.",
        example: "position: sticky; top: 0;",
      },
      { prop: "top / right / bottom / left", desc: "Offsets for positioned elements." },
      { prop: "inset", desc: "Shorthand for top/right/bottom/left.", example: "inset: 0;" },
      { prop: "z-index", desc: "Stacking order among positioned elements." },
    ],
  },
  {
    title: "Flexbox",
    intro: "One-dimensional layout for rows or columns.",
    longIntro:
      "Flexbox is a one-dimensional layout system for arranging items along a single axis (row or column). Reach for it when you need to align, distribute, or reorder items in a single direction — navbars, toolbars, form rows, media objects, centering. Use Grid when you need two axes at once.",
    rows: [
      { prop: "display: flex", desc: "Turn the container into a flex layout." },
      {
        prop: "flex-direction",
        desc: "Sets the main axis: row (horizontal) or column (vertical). Also swaps what justify-content vs align-items control.",
        values: [
          { name: "row", meaning: "Default. Left → right." },
          { name: "row-reverse", meaning: "Right → left." },
          { name: "column", meaning: "Top → bottom." },
          { name: "column-reverse", meaning: "Bottom → top." },
        ],
        examples: ["flex-direction: column;", "flex-direction: row-reverse;"],
        gotcha:
          "When you switch to column, `justify-content` now controls vertical alignment and `align-items` controls horizontal.",
      },
      {
        prop: "flex-wrap",
        desc: "Whether items wrap onto multiple lines when they exceed the container's main-axis size.",
        values: [
          { name: "nowrap", meaning: "Default. Items shrink to fit or overflow." },
          { name: "wrap", meaning: "New lines added below (or right in column)." },
          { name: "wrap-reverse", meaning: "New lines added in the opposite direction." },
        ],
        example: "flex-wrap: wrap;",
      },
      {
        prop: "justify-content",
        desc: "Alignment along the MAIN axis. Distributes free space between/around items.",
        values: [
          { name: "flex-start / start", meaning: "Pack to the start of the main axis." },
          { name: "center", meaning: "Center along main axis." },
          { name: "flex-end / end", meaning: "Pack to the end." },
          { name: "space-between", meaning: "First/last hug edges, equal space between." },
          { name: "space-around", meaning: "Equal space around each item (edges get half)." },
          { name: "space-evenly", meaning: "Equal space including edges." },
        ],
        examples: [
          "justify-content: space-between; /* navbar left/right groups */",
          "justify-content: center;",
        ],
      },
      {
        prop: "align-items",
        desc: "Alignment along the CROSS axis for a single line of items.",
        values: [
          { name: "stretch", meaning: "Default. Items fill the cross axis." },
          { name: "center", meaning: "Center on the cross axis." },
          { name: "flex-start / flex-end", meaning: "Pack to top/bottom (in row)." },
          { name: "baseline", meaning: "Align text baselines." },
        ],
        example: "align-items: center;",
        gotcha: "`baseline` is invaluable for aligning labels with inputs of different font sizes.",
      },
      {
        prop: "align-content",
        desc: "Distributes free space between WRAPPED lines on the cross axis. Only has an effect when `flex-wrap: wrap` produces multiple lines.",
        values: [
          {
            name: "stretch / center / start / end / space-between / space-around / space-evenly",
            meaning: "Same semantics as justify-content but on the cross axis.",
          },
        ],
      },
      {
        prop: "gap",
        desc: "Space between items on both axes. Replaces the old margin-hack pattern. Works in flex, grid, and multi-column.",
        example: "gap: 12px;",
        examples: ["gap: 24px 8px; /* row-gap column-gap */", "row-gap: 12px; column-gap: 4px;"],
        support: "Flexbox `gap` widely supported since 2021 — safe to use.",
      },
      {
        prop: "flex",
        desc: "Shorthand for `flex-grow flex-shrink flex-basis`. Set how much a child should grow into free space, shrink under pressure, and what its starting size is.",
        example: "flex: 1 1 auto;",
        values: [
          { name: "flex: 1", meaning: "= 1 1 0. Grow equally, shrink equally, start from 0." },
          { name: "flex: auto", meaning: "= 1 1 auto. Grow/shrink from natural size." },
          { name: "flex: none", meaning: "= 0 0 auto. Fixed to its natural size." },
          { name: "flex: 0 0 200px", meaning: "Fixed 200px basis, no grow/shrink." },
        ],
        gotcha:
          "`flex: 1` uses basis 0 — sizes items purely by ratio. `flex: 1 1 auto` respects content size first, which changes distribution.",
      },
      {
        prop: "align-self",
        desc: "Overrides align-items for a single child.",
        example: "align-self: flex-end;",
      },
      {
        prop: "order",
        desc: "Reorder items visually without changing DOM order. Default 0; negative values move earlier.",
        example: "order: -1;",
        gotcha:
          "Affects visual order only — screen readers and Tab focus still follow DOM order. Avoid for anything content-critical.",
      },
    ],
    realWorld: {
      title: "Responsive Navbar",
      description:
        "Logo on the left, nav links centered, actions on the right — using flex + justify-content: space-between + gap.",
      html: `<nav class="nav">
  <a class="nav__logo" href="/">Brand</a>
  <ul class="nav__links">
    <li><a href="/">Home</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="/docs">Docs</a></li>
  </ul>
  <div class="nav__actions">
    <button class="nav__cta">Sign in</button>
  </div>
</nav>`,
      css: `.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
}
.nav__links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav__cta {
  padding: 8px 14px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  cursor: pointer;
}`,
    },
  },
  {
    title: "Grid",
    intro: "Two-dimensional layout for rows and columns together.",
    longIntro:
      "CSS Grid is the only native CSS layout system built for two-dimensional layouts. Use it whenever both rows and columns matter at once — page layouts, dashboards, card grids that need to align in both directions, image galleries. It coexists happily with Flexbox: Grid for the macro layout, Flex for one-axis pieces inside cells.",
    rows: [
      {
        prop: "display: grid",
        desc: "Turn the container into a grid formatting context.",
        example: "display: grid;",
      },
      {
        prop: "grid-template-columns",
        desc: "Defines column tracks. Accepts lengths, percentages, fr units, minmax(), repeat(), and named lines.",
        example: "grid-template-columns: repeat(3, 1fr);",
        values: [
          { name: "<length> / <%>", meaning: "Fixed or percentage track." },
          { name: "fr", meaning: "Fraction of the free space." },
          { name: "minmax(min, max)", meaning: "Track that flexes between bounds." },
          { name: "repeat(n, ...)", meaning: "Shorthand for repeating tracks." },
          {
            name: "auto-fill / auto-fit",
            meaning: "Create as many tracks as fit. auto-fit collapses empty ones.",
          },
        ],
        examples: [
          "grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));",
          "grid-template-columns: 200px 1fr 200px;",
        ],
        gotcha:
          "`1fr` distributes FREE space — items with min-content larger than their share can still overflow. Use `minmax(0, 1fr)` to allow shrinking below content width.",
      },
      {
        prop: "grid-template-rows",
        desc: "Same syntax as columns but defines row tracks.",
        example: "grid-template-rows: auto 1fr auto;",
      },
      {
        prop: "grid-template-areas",
        desc: "Draw the layout as a visual ASCII map. Children reference areas with `grid-area`. Makes complex layouts self-documenting.",
        example: "grid-template-areas: 'header header' 'nav main' 'footer footer';",
        gotcha: "All rows must have the same number of columns; use `.` for empty cells.",
      },
      {
        prop: "grid-auto-flow",
        desc: "How auto-placed items fill the grid.",
        values: [
          { name: "row", meaning: "Default. Fill rows left-to-right." },
          { name: "column", meaning: "Fill columns top-to-bottom." },
          {
            name: "dense",
            meaning: "Backfill gaps left by earlier items — visual order may not match DOM.",
          },
        ],
      },
      {
        prop: "gap / row-gap / column-gap",
        desc: "Space between tracks. Works identically to flex gap.",
        example: "gap: 16px 24px;",
      },
      {
        prop: "grid-column / grid-row",
        desc: "Place a child by line numbers or span. Line numbers count from 1; negative numbers count from the end.",
        example: "grid-column: 1 / span 2;",
        examples: ["grid-column: 1 / -1; /* full width */", "grid-row: 2 / 4;"],
      },
      {
        prop: "place-items",
        desc: "Shorthand for `align-items justify-items` — controls each item within its cell.",
        example: "place-items: center;",
      },
      {
        prop: "place-content",
        desc: "Shorthand for `align-content justify-content` — controls the entire grid inside the container.",
        example: "place-content: center;",
      },
    ],
    realWorld: {
      title: "Responsive Card Gallery",
      description:
        "Auto-fitting card grid that reflows from 1 to N columns based on available space, no media queries needed.",
      html: `<ul class="gallery">
  <li class="card">Card 1</li>
  <li class="card">Card 2</li>
  <li class="card">Card 3</li>
  <li class="card">Card 4</li>
</ul>`,
      css: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  min-height: 120px;
}`,
    },
  },
  {
    title: "Typography",
    intro: "Fonts, spacing, and text treatment.",
    longIntro:
      "Typography is 80% of how a UI feels. Get font-family, size, line-height, and measure right and the design suddenly feels intentional. Reach for the properties in this chapter for every text-heavy screen — blogs, docs, forms, dashboards.",
    rows: [
      {
        prop: "font-family",
        desc: "Comma-separated stack. Browser picks the first family it can load. Always end with a generic (`sans-serif`, `serif`, `monospace`) as the last-ditch fallback.",
        example: "font-family: 'Inter', system-ui, sans-serif;",
        gotcha: "Wrap multi-word family names in quotes: `'Times New Roman'`.",
      },
      {
        prop: "font-size",
        desc: "Size of text. Use `rem` for accessible sizing (scales with user root-font preference), `clamp()` for fluid typography.",
        example: "font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);",
        values: [
          { name: "<length>", meaning: "px, rem, em." },
          { name: "<percentage>", meaning: "Relative to parent font-size." },
          { name: "smaller / larger", meaning: "Relative keywords." },
          { name: "xx-small … xx-large", meaning: "Absolute keywords." },
        ],
        gotcha:
          "Setting size in `px` on the root breaks user zoom for accessibility — use `rem` for body text.",
      },
      {
        prop: "font-weight",
        desc: "Thickness of the glyphs. Numeric 100–900 or keywords normal (400) / bold (700). Variable fonts accept any numeric value in the range they define.",
        example: "font-weight: 600;",
        gotcha:
          "Weight only applies if the font actually ships that weight — otherwise the browser fakes it (synthetic bold), which looks worse.",
      },
      {
        prop: "font-style",
        desc: "normal · italic · oblique. Italic uses a designed italic face if available; oblique slants the regular face.",
        example: "font-style: italic;",
      },
      {
        prop: "line-height",
        desc: "Vertical space allocated per line. Use a UNITLESS number so it multiplies against the current font-size — safer for nested elements.",
        example: "line-height: 1.5;",
        gotcha:
          "`line-height: 20px` inherits as a fixed 20px even into children with a different font-size. `line-height: 1.5` inherits as the ratio.",
      },
      {
        prop: "letter-spacing",
        desc: "Extra space between characters. Tighten headings by a hair (~-0.02em), loosen small uppercase labels.",
        example: "letter-spacing: 0.05em;",
      },
      {
        prop: "text-align",
        desc: "Horizontal alignment inside a block. `start`/`end` respect writing direction; use them over `left`/`right` for i18n.",
        example: "text-align: start;",
      },
      {
        prop: "text-decoration",
        desc: "Shorthand for line, style, color, thickness.",
        example: "text-decoration: underline dotted 2px currentColor;",
        values: [
          { name: "line", meaning: "none · underline · line-through · overline." },
          { name: "style", meaning: "solid · dashed · dotted · double · wavy." },
        ],
      },
      {
        prop: "text-transform",
        desc: "uppercase · lowercase · capitalize. Purely visual — the underlying text stays as authored.",
        example: "text-transform: uppercase;",
      },
      {
        prop: "white-space",
        desc: "How whitespace and line breaks are handled.",
        values: [
          { name: "normal", meaning: "Collapse whitespace, wrap as needed." },
          { name: "nowrap", meaning: "Collapse whitespace, never wrap." },
          { name: "pre", meaning: "Preserve whitespace + newlines, no wrap." },
          { name: "pre-wrap", meaning: "Preserve whitespace, wrap." },
          { name: "pre-line", meaning: "Collapse whitespace, preserve newlines." },
        ],
      },
      {
        prop: "text-overflow",
        desc: "Only takes effect when the box has `overflow: hidden` AND `white-space: nowrap`.",
        example: "overflow: hidden; white-space: nowrap; text-overflow: ellipsis;",
        gotcha:
          "For multi-line truncation, use `display: -webkit-box; -webkit-line-clamp: N; -webkit-box-orient: vertical; overflow: hidden;`.",
      },
    ],
    realWorld: {
      title: "Readable Article Body",
      description:
        "Constrained measure, comfortable line-height, fluid font-size, and truncated multi-line title.",
      html: `<article class="prose">
  <h1 class="prose__title">The complete guide to CSS typography that ships in every design system</h1>
  <p>Typography is 80% of how a UI feels. Get font-family, size, line-height, and measure right and the design suddenly feels intentional.</p>
</article>`,
      css: `.prose {
  max-width: 65ch;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.7;
  color: #1f2937;
}
.prose__title {
  font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 0.5em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
    },
  },
  {
    title: "Colors & Backgrounds",
    intro: "Color spaces, backgrounds, and gradient syntax.",
    longIntro:
      "CSS gives you multiple color spaces — RGB, HSL, and the newer perceptual OKLCH/OKLab — plus layered backgrounds and rich gradient syntax. Prefer OKLCH for new work: equal steps of lightness LOOK equal, which makes generating accessible themes trivial.",
    rows: [
      {
        prop: "color",
        desc: "Foreground text color. Inherits by default; `currentColor` is the special keyword that resolves to the element's own color.",
        example: "color: currentColor;",
      },
      {
        prop: "rgb() / rgba()",
        desc: "Red-green-blue channels 0–255 (or 0–100%), optional alpha 0–1. Modern space-separated syntax is preferred.",
        example: "rgb(15 23 42 / 0.8)",
        examples: ["rgb(0, 128, 255)", "rgba(0, 128, 255, 0.5) /* legacy */"],
      },
      {
        prop: "hsl() / hsla()",
        desc: "Hue (0–360deg) · saturation (%) · lightness (%). Intuitive for tweaking a color without picking a new one.",
        example: "hsl(220 90% 55% / 0.9)",
        gotcha:
          "HSL lightness is NOT perceptually uniform — 50% yellow looks brighter than 50% blue. Use OKLCH for consistent contrast.",
      },
      {
        prop: "oklch() / oklab()",
        desc: "Perceptual color spaces. `oklch(L C H)` — lightness (0–1 or 0–100%), chroma (0–0.4-ish), hue (0–360). Best choice for theme generation.",
        example: "oklch(70% 0.15 250)",
        support: "Baseline widely supported since 2023 (Chrome 111+, Safari 15.4+, Firefox 113+).",
      },
      {
        prop: "color-mix()",
        desc: "Blend two colors in a chosen color space. Great for generating hover/muted variants from a single token.",
        example: "color-mix(in oklab, var(--brand) 80%, black)",
        examples: [
          "color-mix(in srgb, red, blue) /* purple */",
          "background: color-mix(in oklab, var(--brand) 12%, transparent);",
        ],
        support: "All modern browsers (2023+).",
      },
      {
        prop: "background-color",
        desc: "Solid fill painted BELOW background-image.",
        example: "background-color: #f8fafc;",
      },
      {
        prop: "background-image",
        desc: "Can be a URL or one/more gradients. Multiple images stack — first listed is on top.",
        example: "background-image: url('/hero.jpg'), linear-gradient(#0000, #000a);",
      },
      {
        prop: "background-size",
        desc: "How the image is scaled inside the box.",
        values: [
          { name: "auto", meaning: "Natural size." },
          { name: "cover", meaning: "Fill box, crop excess." },
          { name: "contain", meaning: "Fit entirely inside, letterbox." },
          { name: "<length> <length>", meaning: "Explicit width and height." },
        ],
      },
      {
        prop: "background-position",
        desc: "Anchor of the image. Two keywords or a length pair.",
        example: "background-position: center bottom;",
      },
      {
        prop: "background-repeat",
        desc: "repeat · no-repeat · repeat-x · repeat-y · round · space.",
      },
      {
        prop: "linear-gradient()",
        desc: "Straight-line gradient. First argument is the direction (`to bottom right`, `135deg`), then color stops.",
        example: "linear-gradient(135deg, #f0f, #0ff)",
        examples: ["linear-gradient(to bottom, #000 0%, transparent 60%)"],
      },
      {
        prop: "radial-gradient()",
        desc: "Circular or elliptical gradient. Shape and size are optional first args.",
        example: "radial-gradient(circle at 20% 20%, #fff, #0000 60%)",
      },
      {
        prop: "conic-gradient()",
        desc: "Sweep around a center point. Perfect for pie charts and color wheels.",
        example: "conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)",
      },
      {
        prop: "background-clip: text",
        desc: "Clip the background to the shape of the letters. Requires transparent text color.",
        example: "background-clip: text; -webkit-background-clip: text; color: transparent;",
        gotcha: "Still needs the `-webkit-` prefix in Safari for full support.",
      },
    ],
    realWorld: {
      title: "Gradient Text Hero",
      description:
        "Big hero title using linear-gradient + background-clip: text, over a soft radial-gradient background.",
      html: `<section class="hero">
  <h1 class="hero__title">Build faster with SagaCSS</h1>
  <p class="hero__sub">Ship polished UI without fighting the cascade.</p>
</section>`,
      css: `.hero {
  padding: 64px 24px;
  background:
    radial-gradient(circle at 20% 20%, #ede9fe, transparent 60%),
    radial-gradient(circle at 80% 90%, #dbeafe, transparent 60%),
    #f8fafc;
  text-align: center;
}
.hero__title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  background: linear-gradient(135deg, #6d28d9, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 12px;
}
.hero__sub { color: #475569; margin: 0; }`,
    },
  },
  {
    title: "Borders & Shadows",
    intro: "Borders, rounded corners, and depth via shadows.",
    rows: [
      {
        prop: "border-radius",
        desc: "Round the corners. Per-corner shorthand supported.",
        example: "border-radius: 12px;",
      },
      { prop: "border-width / style / color", desc: "Individual border components." },
      { prop: "outline", desc: "Draws outside the border and does not affect layout." },
      { prop: "outline-offset", desc: "Push outline away from the element." },
      {
        prop: "box-shadow",
        desc: "x y blur spread color · comma-list for multiple layers.",
        example: "box-shadow: 0 4px 12px rgb(0 0 0 / .2);",
      },
      {
        prop: "text-shadow",
        desc: "x y blur color for text.",
        example: "text-shadow: 0 1px 2px #000;",
      },
      {
        prop: "inset (box-shadow)",
        desc: "Inner shadow keyword.",
        example: "box-shadow: inset 0 2px 4px #0003;",
      },
    ],
  },
  {
    title: "Transforms & Transitions",
    intro: "Motion, rotation, scaling, and animated state changes.",
    rows: [
      {
        prop: "transform",
        desc: "translate · rotate · scale · skew · matrix.",
        example: "transform: translateY(-4px) scale(1.05);",
      },
      { prop: "transform-origin", desc: "Pivot point for transforms." },
      { prop: "perspective", desc: "3D depth applied to children." },
      {
        prop: "transition",
        desc: "Shorthand: property duration easing delay.",
        example: "transition: all .2s ease;",
      },
      {
        prop: "transition-timing-function",
        desc: "ease · linear · ease-in · ease-out · cubic-bezier().",
      },
      { prop: "animation", desc: "Shorthand: name duration easing delay iter direction fill." },
      {
        prop: "@keyframes",
        desc: "Define an animation sequence.",
        example: "@keyframes fade { from{opacity:0} to{opacity:1} }",
      },
      { prop: "animation-fill-mode", desc: "none · forwards · backwards · both." },
      { prop: "will-change", desc: "Hint GPU compositing.", example: "will-change: transform;" },
    ],
  },
  {
    title: "Selectors",
    intro: "How to target elements. Combinators, pseudo-classes, pseudo-elements.",
    longIntro:
      "Selectors decide WHICH elements a rule applies to, and their specificity decides which rule wins when several match. Combinators walk the DOM (child, sibling), pseudo-classes react to state, pseudo-elements inject virtual content. Understanding specificity — inline > id > class/attribute/pseudo-class > element — will save you from `!important` spirals.",
    rows: [
      {
        prop: ".class",
        desc: "Elements with the given class. Specificity 0,0,1,0. The workhorse selector.",
        example: ".btn-primary { … }",
      },
      {
        prop: "#id",
        desc: "Element with the given ID. Specificity 0,1,0,0 — very high. Avoid for styling; prefer classes.",
        example: "#header { … }",
      },
      {
        prop: "el, el",
        desc: "Group — each selector is evaluated independently and gets the same declarations.",
        example: "h1, h2, h3 { font-family: serif; }",
      },
      {
        prop: "a b",
        desc: "Descendant combinator — any depth. Broad and cheap-looking but easy to over-scope.",
        example: "article p { line-height: 1.7; }",
      },
      {
        prop: "a > b",
        desc: "Direct child only.",
        example: ".menu > li { display: inline-block; }",
      },
      {
        prop: "a + b",
        desc: "Adjacent sibling — B immediately after A.",
        example: "h2 + p { margin-top: 0; }",
      },
      {
        prop: "a ~ b",
        desc: "General sibling — any B after A at the same level.",
        example: "input:checked ~ label { color: green; }",
      },
      {
        prop: "[attr=value]",
        desc: "Attribute selectors. Multiple operators for substring matching.",
        values: [
          { name: "[attr]", meaning: "Has the attribute (any value)." },
          { name: "[attr=value]", meaning: "Exact match." },
          { name: "[attr^=value]", meaning: "Starts with value." },
          { name: "[attr$=value]", meaning: "Ends with value." },
          { name: "[attr*=value]", meaning: "Contains value." },
          { name: "[attr~=value]", meaning: "One of a space-separated list." },
          { name: "[attr|=value]", meaning: "Value or value-prefixed with hyphen." },
        ],
        examples: ["a[href^='https']", "input[type='email']", "img[alt='']"],
      },
      {
        prop: ":hover / :focus / :active",
        desc: "Interaction states. Pair `:focus-visible` with focus styles to avoid mouse-click focus rings.",
        example: "a:hover, a:focus-visible { text-decoration: underline; }",
      },
      {
        prop: ":nth-child(n)",
        desc: "Position among siblings. Accepts numbers, keywords (`odd`, `even`), and formulas (`an+b`).",
        example: ":nth-child(odd)",
        examples: [":nth-child(3n+1)", ":nth-child(-n+3) /* first three */"],
        gotcha:
          "Counts against ALL siblings regardless of type. Use `:nth-of-type()` to count within the same tag.",
      },
      {
        prop: ":not(sel)",
        desc: "Negation. Modern browsers accept complex selectors and lists.",
        example: "li:not(.disabled, :first-child) { … }",
      },
      {
        prop: ":is() / :where()",
        desc: "Group selectors more concisely. `:is()` takes the highest specificity among its arguments; `:where()` has ZERO specificity — great for low-priority defaults.",
        example: ":is(h1, h2, h3) { line-height: 1.2; }",
        examples: [":where(ul, ol) { padding-left: 1.5em; }"],
      },
      {
        prop: ":has(sel)",
        desc: "Relational selector — the parent matches if the selector inside matches a descendant. Unlocks patterns that used to require JavaScript.",
        example: "article:has(img) { padding-top: 0; }",
        support: "Supported in all evergreen browsers since late 2023.",
      },
      {
        prop: "::before / ::after",
        desc: "Pseudo-elements that inject a virtual first/last child. Must set `content` (even if empty) to render.",
        example: ".required::after { content: ' *'; color: red; }",
        gotcha: "Cannot be used on `<img>`, `<input>`, or other replaced elements.",
      },
      {
        prop: "::placeholder / ::selection",
        desc: "Style input placeholder text and user-highlighted text respectively.",
        example: "input::placeholder { color: #9ca3af; }",
      },
    ],
    realWorld: {
      title: "Form Field with Validation State",
      description:
        "Uses attribute selectors, :focus-visible, :has(), and ::before to style a labeled input based purely on its state.",
      html: `<label class="field">
  <span class="field__label">Email</span>
  <input type="email" required placeholder="you@example.com" />
</label>`,
      css: `.field { display: grid; gap: 4px; }
.field__label { font-size: 0.875rem; color: #374151; }
.field input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font: inherit;
}
.field input:focus-visible {
  outline: 2px solid #6d28d9;
  outline-offset: 2px;
}
.field:has(input:invalid:not(:placeholder-shown)) .field__label {
  color: #b91c1c;
}
.field:has(input:invalid:not(:placeholder-shown)) input {
  border-color: #b91c1c;
}`,
    },
  },
  {
    title: "Units & Values",
    intro: "Absolute vs relative units, and common value functions.",
    rows: [
      { prop: "px", desc: "Absolute pixels." },
      { prop: "%", desc: "Relative to the parent's corresponding dimension." },
      { prop: "em", desc: "Relative to the element's own font-size (compounds)." },
      { prop: "rem", desc: "Relative to the root font-size." },
      { prop: "vw / vh", desc: "1% of viewport width / height." },
      { prop: "svh / lvh / dvh", desc: "Small / large / dynamic viewport height." },
      { prop: "fr", desc: "Grid track fraction of leftover space." },
      { prop: "ch / ex", desc: "Width of `0` glyph / height of `x`." },
      { prop: "calc()", desc: "Mix units with math.", example: "calc(100% - 2rem)" },
      { prop: "clamp(min, ideal, max)", desc: "Fluid value bounded on both sides." },
      { prop: "min() / max()", desc: "Pick smaller / larger of arguments." },
      { prop: "var(--name, fallback)", desc: "Read a custom property." },
      { prop: "attr()", desc: "Read an HTML attribute (limited to content in most browsers)." },
    ],
  },
  {
    title: "Pseudo-Classes & Pseudo-Elements Deep Dive",
    intro: "Target elements by state or inject virtual elements without extra markup.",
    rows: [
      { prop: ":hover", desc: "Pointer is over the element.", example: "a:hover { color: red; }" },
      { prop: ":focus", desc: "Element has keyboard/programmatic focus." },
      {
        prop: ":focus-visible",
        desc: "Focus only when the UA thinks a ring is warranted (keyboard nav).",
      },
      { prop: ":active", desc: "Currently being activated (mousedown)." },
      {
        prop: ":nth-child(n)",
        desc: "Pick items by index / formula.",
        example: ":nth-child(2n+1)",
      },
      { prop: ":first-child / :last-child", desc: "First or last among siblings." },
      { prop: ":only-child", desc: "Element with no siblings." },
      { prop: ":empty", desc: "Element with no children (text counts)." },
      { prop: ":not(sel)", desc: "Negation pseudo-class." },
      { prop: ":checked / :disabled", desc: "Form control states." },
      {
        prop: "::before / ::after",
        desc: "Inject virtual children.",
        example: "::before { content: '★'; }",
      },
      { prop: "::placeholder", desc: "Style input placeholder text." },
      { prop: "::selection", desc: "Style user-highlighted text." },
      { prop: "::marker", desc: "Style list bullets / numbers." },
      { prop: "::first-letter / ::first-line", desc: "Drop-cap or first-line styling." },
    ],
  },
  {
    title: "CSS Variables (Custom Properties)",
    intro: "Declare tokens once, reference them everywhere, and theme with cascading scope.",
    rows: [
      { prop: "--name: value", desc: "Declare a custom property.", example: "--brand: #6d28d9;" },
      { prop: "var(--name)", desc: "Reference the value.", example: "color: var(--brand);" },
      { prop: "var(--name, fallback)", desc: "Use fallback when the variable is unset." },
      { prop: ":root { --x }", desc: "Global scope — everything inherits." },
      { prop: "Local scope", desc: "Declared on any selector; only cascades to descendants." },
      { prop: "Dynamic update", desc: "Set from JS: element.style.setProperty('--x', '12px')." },
      {
        prop: "@property",
        desc: "Register a typed custom property so it can animate.",
        example: "@property --hue { syntax:'<angle>'; inherits:true; initial-value:0deg; }",
      },
      {
        prop: "calc() with vars",
        desc: "Compose values.",
        example: "padding: calc(var(--gap) * 2);",
      },
      { prop: "Theming", desc: "Swap values under [data-theme='dark'] to re-skin the tree." },
    ],
  },
  {
    title: "Media Queries & Responsive Design",
    intro: "Adapt styles to viewport size, device features, and user preferences.",
    rows: [
      { prop: "@media (min-width: 768px)", desc: "Mobile-first breakpoint." },
      { prop: "@media (max-width: 767px)", desc: "Cap upper end of a range." },
      { prop: "@media (min-width: 640px) and (max-width: 1023px)", desc: "Range query." },
      {
        prop: "Common breakpoints",
        desc: "sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536 (Tailwind scale).",
      },
      { prop: "(orientation: portrait)", desc: "Portrait vs landscape." },
      {
        prop: "(prefers-color-scheme: dark)",
        desc: "Respect the OS theme.",
        example: "@media (prefers-color-scheme: dark) { … }",
      },
      { prop: "(prefers-reduced-motion: reduce)", desc: "Honor motion-sensitivity setting." },
      { prop: "(prefers-contrast: more)", desc: "Increase contrast for users who requested it." },
      { prop: "(hover: hover)", desc: "Only apply :hover on true pointer devices." },
      { prop: "(pointer: coarse)", desc: "Detect touch-primary devices." },
      { prop: "@media print", desc: "Rules that only apply when printing." },
    ],
  },
  {
    title: "CSS Functions Reference",
    intro: "Value-producing functions you can use inside declarations.",
    rows: [
      { prop: "calc()", desc: "Arithmetic across units.", example: "calc(100vh - 4rem)" },
      { prop: "clamp(min, val, max)", desc: "Fluid value with bounds." },
      { prop: "min() / max()", desc: "Pick the smallest / largest argument." },
      { prop: "var(--name, fb)", desc: "Read a custom property with fallback." },
      { prop: "repeat(n, track)", desc: "Grid track repetition.", example: "repeat(3, 1fr)" },
      { prop: "minmax(min, max)", desc: "Grid track that flexes between bounds." },
      { prop: "fit-content(limit)", desc: "Grid track that shrinks to content, capped." },
      { prop: "attr(name)", desc: "Read an HTML attribute." },
      {
        prop: "counter(name)",
        desc: "Read a CSS counter value.",
        example: "content: counter(step);",
      },
      { prop: "url()", desc: "Reference an external resource." },
      { prop: "env(safe-area-inset-top)", desc: "Read UA-provided environment values." },
      { prop: "color-mix(in oklab, a, b)", desc: "Blend two colors in a color space." },
    ],
  },
  {
    title: "Filters & Effects",
    intro: "Post-process rendered output with CSS filters and blending.",
    rows: [
      { prop: "filter: blur(px)", desc: "Gaussian blur.", example: "filter: blur(6px);" },
      { prop: "filter: brightness(%)", desc: "Lighten/darken. 100% = unchanged." },
      { prop: "filter: contrast(%)", desc: "Push/pull mid-tones." },
      { prop: "filter: grayscale(%)", desc: "Desaturate." },
      { prop: "filter: sepia(%)", desc: "Warm tint." },
      { prop: "filter: saturate(%)", desc: "Boost or mute color intensity." },
      { prop: "filter: hue-rotate(deg)", desc: "Shift hue around the color wheel." },
      { prop: "filter: invert(%)", desc: "Flip channel values." },
      {
        prop: "filter: drop-shadow()",
        desc: "Shadow that follows alpha, not the box.",
        example: "drop-shadow(0 4px 8px #0007)",
      },
      {
        prop: "backdrop-filter",
        desc: "Apply a filter to what is BEHIND the element (glass effect).",
      },
      {
        prop: "mix-blend-mode",
        desc: "Blend with the element beneath.",
        example: "mix-blend-mode: multiply;",
      },
      { prop: "background-blend-mode", desc: "Blend a background layer with the ones below it." },
      {
        prop: "isolation: isolate",
        desc: "Create a stacking context so blends do not leak upward.",
      },
    ],
  },
  {
    title: "Animations Deep Dive",
    intro: "Keyframe animations, timing functions, and playback control.",
    rows: [
      { prop: "@keyframes name { … }", desc: "Define stages: from/to or 0%–100%." },
      { prop: "animation-name", desc: "The @keyframes to run." },
      { prop: "animation-duration", desc: "Length of one cycle.", example: "300ms" },
      { prop: "animation-timing-function", desc: "Easing curve." },
      { prop: "animation-delay", desc: "Wait before starting." },
      { prop: "animation-iteration-count", desc: "Number · infinite." },
      { prop: "animation-direction", desc: "normal · reverse · alternate · alternate-reverse." },
      { prop: "animation-fill-mode", desc: "none · forwards · backwards · both." },
      { prop: "animation-play-state", desc: "running · paused." },
      {
        prop: "animation (shorthand)",
        desc: "name duration easing delay iter direction fill state.",
        example: "animation: spin 1s linear infinite;",
      },
      {
        prop: "Common easings",
        desc: "linear · ease · ease-in · ease-out · ease-in-out · cubic-bezier(.2,.8,.2,1) · steps(n).",
      },
    ],
  },
  {
    title: "CSS Grid Advanced",
    intro: "Named lines, template areas, and the implicit grid.",
    rows: [
      {
        prop: "grid-template-areas",
        desc: "Draw the layout as strings.",
        example: "'header header' 'nav main'",
      },
      { prop: "grid-area", desc: "Place a child into a named area." },
      { prop: "Named lines", desc: "grid-template-columns: [start] 1fr [mid] 2fr [end];" },
      {
        prop: "auto-fill",
        desc: "Create as many tracks as fit, even empty ones.",
        example: "repeat(auto-fill, minmax(200px, 1fr))",
      },
      {
        prop: "auto-fit",
        desc: "Like auto-fill but collapses empty tracks — items stretch to fill.",
      },
      {
        prop: "Explicit vs implicit",
        desc: "Explicit = defined by grid-template-*; implicit = created for overflow items.",
      },
      { prop: "grid-auto-rows / -columns", desc: "Size of implicit tracks." },
      { prop: "grid-auto-flow", desc: "row · column · dense (fill holes)." },
      { prop: "span keyword", desc: "grid-column: span 3;" },
      {
        prop: "subgrid",
        desc: "Inherit parent's tracks.",
        example: "grid-template-columns: subgrid;",
      },
    ],
  },
  {
    title: "Overflow, Scroll & Clipping",
    intro: "Control what happens when content exceeds its box, and shape the box itself.",
    rows: [
      { prop: "overflow", desc: "visible · hidden · clip · scroll · auto." },
      { prop: "overflow-x / overflow-y", desc: "Per-axis control." },
      { prop: "overscroll-behavior", desc: "auto · contain · none — stop scroll chaining." },
      { prop: "scroll-behavior", desc: "auto · smooth — for anchor jumps and JS scrolls." },
      {
        prop: "scroll-snap-type",
        desc: "x/y + mandatory/proximity.",
        example: "scroll-snap-type: x mandatory;",
      },
      { prop: "scroll-snap-align", desc: "start · center · end — on the children." },
      {
        prop: "scroll-padding / scroll-margin",
        desc: "Offset the snap area (e.g. under a sticky header).",
      },
      {
        prop: "scrollbar-gutter",
        desc: "Reserve space so layout does not shift when a scrollbar appears.",
      },
      {
        prop: "clip-path",
        desc: "Shape the visible region.",
        example: "clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);",
      },
      { prop: "mask-image", desc: "Use an image/gradient as an alpha mask." },
      { prop: "mask-size / mask-position / mask-repeat", desc: "Same pattern as backgrounds." },
    ],
  },
  {
    title: "Print & Accessibility CSS",
    intro: "Respect user preferences and make output usable in every context.",
    rows: [
      {
        prop: "@media print",
        desc: "Print-only rules — hide nav, unset backgrounds, force color.",
      },
      { prop: "page-break-inside: avoid", desc: "Keep a block together across pages." },
      { prop: "@page", desc: "Set page size and margins for print." },
      {
        prop: "prefers-reduced-motion",
        desc: "Disable non-essential animations for sensitive users.",
      },
      { prop: "prefers-contrast", desc: "more · less · custom — raise or lower contrast." },
      {
        prop: "forced-colors: active",
        desc: "Windows High Contrast mode is on — respect system colors.",
      },
      {
        prop: "forced-color-adjust",
        desc: "auto · none — opt out of forced-colors for specific elements.",
      },
      { prop: ":focus-visible", desc: "Only show focus rings when useful (keyboard nav)." },
      {
        prop: ".sr-only pattern",
        desc: "Visually hidden but readable to screen readers.",
        example: "position:absolute; width:1px; height:1px; overflow:hidden;",
      },
      {
        prop: "color-scheme",
        desc: "Tell the UA which schemes your page supports.",
        example: "color-scheme: light dark;",
      },
      { prop: "accent-color", desc: "Theme native form controls (checkbox/radio/range)." },
    ],
  },
  {
    title: "Modern CSS Features",
    intro: "Container queries, :has(), cascade layers, native nesting, and subgrid.",
    rows: [
      {
        prop: "container-type",
        desc: "Turn an element into a query container.",
        example: "container-type: inline-size;",
      },
      { prop: "container-name", desc: "Name the container for targeted queries." },
      {
        prop: "@container",
        desc: "Style based on the container's size, not the viewport.",
        example: "@container (min-width: 480px) { … }",
      },
      { prop: ":has(sel)", desc: "Parent/relational selector.", example: "article:has(img) { … }" },
      {
        prop: "@layer",
        desc: "Cascade layers — control which rules win regardless of source order.",
        example: "@layer base, components, utilities;",
      },
      {
        prop: "Native nesting",
        desc: "Nest selectors like Sass, directly in CSS.",
        example: ".card { & .title { font-weight: 700; } }",
      },
      { prop: "subgrid", desc: "Child grid uses the parent's tracks." },
      { prop: "color-mix() / oklch()", desc: "Modern color pipeline — perceptual mixing." },
      { prop: "@scope", desc: "Scoped selectors with proximity-based specificity." },
      {
        prop: "view-transitions",
        desc: "::view-transition-* pseudos + document.startViewTransition().",
      },
      {
        prop: "@property",
        desc: "Register typed custom properties so they can animate/interpolate.",
      },
    ],
  },
];

const LS_KEY = "cheat-sheet:chapter";

function CheatSheetPage() {
  const [current, setCurrent] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const deferredSearch = React.useDeferredValue(search);
  const [highlightedProp, setHighlightedProp] = React.useState<string | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const n = raw ? parseInt(raw, 10) : 0;
      if (!Number.isNaN(n) && n >= 0 && n < SECTIONS.length) setCurrent(n);
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, String(current));
    } catch {}
  }, [current]);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, i));
    setCurrent(clamped);
    setSearch("");
    setHighlightedProp(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Jump to a chapter from a cross-chapter search result. Keeps the query
  // so in-place highlighting still works, and scrolls to the matched row.
  const jumpToMatch = (chapterIdx: number, propKey: string | null) => {
    setCurrent(chapterIdx);
    setHighlightedProp(propKey);
    // Scroll after the new chapter has rendered.
    requestAnimationFrame(() => {
      if (!contentRef.current) return;
      if (propKey) {
        const el = contentRef.current.querySelector<HTMLElement>(
          `[data-row-prop="${cssEscape(propKey)}"]`,
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Clear highlight after a few seconds so the ring animation fades.
  React.useEffect(() => {
    if (!highlightedProp) return;
    const t = window.setTimeout(() => setHighlightedProp(null), 3000);
    return () => window.clearTimeout(t);
  }, [highlightedProp]);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewPages, setPreviewPages] = React.useState<number>(0);
  const [previewLoading, setPreviewLoading] = React.useState(false);

  const buildPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    return doc;
  };

  // Runs the full jsPDF pipeline and returns the finished doc.
  const renderPdf = async () => {
    const doc = await buildPdf();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;

    // Cover
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(38);
    doc.text("SagaCSS", pageW / 2, pageH / 2 - 40, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.text("CSS Reference Cheat Sheet", pageW / 2, pageH / 2, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(180, 180, 200);
    doc.text(`Generated ${new Date().toLocaleDateString()}`, pageW / 2, pageH / 2 + 30, {
      align: "center",
    });
    doc.text("sagacss.app", pageW / 2, pageH - margin, { align: "center" });

    const drawHeader = (chapterNum: string, title: string) => {
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(139, 92, 246);
      doc.text(chapterNum, margin, margin);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(title, margin, margin + 12);
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(2);
      doc.line(margin, margin + 20, margin + 60, margin + 20);
    };
    const drawFooter = () => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 150);
      doc.text("SagaCSS — sagacss.app", margin, pageH - 24);
    };
    const FOOTER_RESERVED = 48;

    // Table of contents page (links added after chapter pages are known).
    doc.addPage();
    const tocPageNumber = doc.getNumberOfPages();
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Contents", margin, margin + 12);
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(2);
    doc.line(margin, margin + 20, margin + 60, margin + 20);
    drawFooter();

    const tocEntries: { y: number; text: string }[] = [];
    const chapterPages: number[] = [];

    SECTIONS.forEach((section, idx) => {
      doc.addPage();
      chapterPages.push(doc.getNumberOfPages());
      tocEntries.push({
        y: margin + 56 + idx * 22,
        text: `Chapter ${idx + 1}  ·  ${section.title}`,
      });
      drawHeader(`Chapter ${idx + 1}`, section.title);
      let y = margin + 44;

      const contentW = pageW - margin * 2;
      const ensure = (needed: number) => {
        if (y + needed > pageH - FOOTER_RESERVED) {
          drawFooter();
          doc.addPage();
          drawHeader(`Chapter ${idx + 1}`, `${section.title} (cont.)`);
          // drawHeader leaves font at Helvetica bold 22pt / purple — restore
          // sane body defaults so continuation content doesn't render at
          // header scale on top of itself.
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 70);
          y = margin + 44;
        }
      };

      // Intro (long intro if present, else short).
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 110);
      const introText = section.longIntro ?? section.intro;
      const introLines = doc.splitTextToSize(introText, contentW);
      ensure(introLines.length * 12 + 14);
      doc.text(introLines, margin, y);
      y += introLines.length * 12 + 14;

      doc.setFontSize(10);
      for (const row of section.rows) {
        const { prop, desc, example, values, examples, gotcha, support } = row;
        const wrappedDesc = doc.splitTextToSize(desc, contentW);
        const wrappedEx = example ? doc.splitTextToSize(example, contentW) : [];
        ensure(14 + wrappedDesc.length * 12 + (example ? wrappedEx.length * 11 + 6 : 0) + 8);

        doc.setFont("courier", "bold");
        doc.setTextColor(139, 92, 246);
        doc.text(prop, margin, y);
        y += 14;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 70);
        doc.text(wrappedDesc, margin, y);
        y += wrappedDesc.length * 12 + 4;
        if (example) {
          doc.setFont("courier", "normal");
          doc.setTextColor(30, 64, 175);
          doc.text(wrappedEx, margin, y);
          y += wrappedEx.length * 11 + 4;
        }

        if (values && values.length > 0) {
          // Keep the "Values:" header on the same page as its first bullet
          // so it never orphans at the bottom of a page.
          const firstLine = `• ${values[0].name} — ${values[0].meaning}`;
          const firstWrapped = doc.splitTextToSize(firstLine, contentW - 12);
          ensure(14 + firstWrapped.length * 11 + 2);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(80, 80, 90);
          doc.text("Values:", margin, y);
          y += 12;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(70, 70, 80);
          for (const v of values) {
            const line = `• ${v.name} — ${v.meaning}`;
            const wrapped = doc.splitTextToSize(line, contentW - 12);
            ensure(wrapped.length * 11 + 2);
            doc.text(wrapped, margin + 12, y);
            y += wrapped.length * 11 + 2;
          }
          y += 4;
        }

        if (examples && examples.length > 0) {
          for (const ex of examples) {
            const wrapped = doc.splitTextToSize(ex, contentW - 12);
            ensure(wrapped.length * 11 + 4);
            doc.setFont("courier", "normal");
            doc.setTextColor(30, 64, 175);
            doc.text(wrapped, margin + 12, y);
            y += wrapped.length * 11 + 4;
          }
        }

        if (gotcha) {
          const wrapped = doc.splitTextToSize(`⚠ Gotcha: ${gotcha}`, contentW);
          ensure(wrapped.length * 11 + 6);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(180, 83, 9);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 11 + 4;
        }

        if (support) {
          const wrapped = doc.splitTextToSize(`Browser support: ${support}`, contentW);
          ensure(wrapped.length * 11 + 4);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(120, 120, 130);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 11 + 4;
        }

        y += 10;
      }

      // Real-world example section.
      if (section.realWorld) {
        // Keep the real-world title with its first content line.
        const rwFirst = section.realWorld.description
          ? doc.splitTextToSize(section.realWorld.description, contentW)
          : section.realWorld.html.split("\n").slice(0, 1);
        ensure(20 + rwFirst.length * 12 + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text(`Real-world example: ${section.realWorld.title}`, margin, y);
        y += 16;
        if (section.realWorld.description) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 110);
          const wrapped = doc.splitTextToSize(section.realWorld.description, contentW);
          ensure(wrapped.length * 12 + 4);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 12 + 6;
        }
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        for (const line of section.realWorld.html.split("\n")) {
          ensure(11);
          doc.text(line || " ", margin, y);
          y += 11;
        }
        y += 6;
        doc.setTextColor(30, 64, 175);
        for (const line of section.realWorld.css.split("\n")) {
          ensure(11);
          doc.text(line || " ", margin, y);
          y += 11;
        }
      }

      drawFooter();
    });

    // Render TOC entries with clickable links now that we know page numbers.
    doc.setPage(tocPageNumber);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const contentWToc = pageW - margin * 2;
    tocEntries.forEach((entry, i) => {
      const pageNum = chapterPages[i];
      const pageLabel = `p. ${pageNum}`;
      const labelW = doc.getTextWidth(pageLabel);
      // Title on the left (clickable).
      doc.setTextColor(30, 64, 175);
      doc.textWithLink(entry.text, margin, entry.y, { pageNumber: pageNum });
      // Dotted leader.
      doc.setTextColor(170, 170, 180);
      const titleW = doc.getTextWidth(entry.text);
      const leaderStart = margin + titleW + 6;
      const leaderEnd = margin + contentWToc - labelW - 6;
      if (leaderEnd > leaderStart) {
        const dots = ". ".repeat(Math.max(0, Math.floor((leaderEnd - leaderStart) / 3)));
        doc.text(dots, leaderStart, entry.y);
      }
      // Page number on the right (also clickable).
      doc.setTextColor(30, 64, 175);
      doc.textWithLink(pageLabel, margin + contentWToc - labelW, entry.y, { pageNumber: pageNum });
      // Expand hit area over the full row.
      doc.link(margin, entry.y - 10, contentWToc, 14, { pageNumber: pageNum });
    });

    return doc;
  };

  const download = async () => {
    try {
      const doc = await renderPdf();
      doc.save("sagacss-cheat-sheet.pdf");
      toast.success("Cheat sheet downloaded");
    } catch (e) {
      toast.error("PDF export failed");
      console.error(e);
    }
  };

  const openPreview = async () => {
    setPreviewLoading(true);
    try {
      const doc = await renderPdf();
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setPreviewPages(doc.getNumberOfPages());
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (e) {
      toast.error("Print preview failed");
      console.error(e);
    } finally {
      setPreviewLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const section = SECTIONS[current];
  const query = deferredSearch.trim().toLowerCase();
  const rowMatchesQuery = (row: Row, q: string) => {
    if (!q) return true;
    const hay = [
      row.prop,
      row.desc,
      row.example ?? "",
      row.gotcha ?? "",
      row.support ?? "",
      ...(row.examples ?? []),
      ...(row.values ?? []).flatMap((v) => [v.name, v.meaning]),
    ]
      .join(" \n ")
      .toLowerCase();
    return hay.includes(q);
  };
  const filteredRows = React.useMemo(() => {
    if (!query) return section.rows;
    return section.rows.filter((r) => rowMatchesQuery(r, query));
  }, [section, query]);

  // Cross-chapter search: group matches by chapter.
  const crossChapterResults = React.useMemo(() => {
    if (!query) return [] as { chapter: number; title: string; matches: Row[] }[];
    const out: { chapter: number; title: string; matches: Row[] }[] = [];
    SECTIONS.forEach((s, i) => {
      const matches = s.rows.filter((r) => rowMatchesQuery(r, query));
      if (matches.length > 0) out.push({ chapter: i, title: s.title, matches });
    });
    return out;
  }, [query]);
  const totalMatches = crossChapterResults.reduce((n, g) => n + g.matches.length, 0);

  const progressPct = ((current + 1) / SECTIONS.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="CSS Cheat Sheet"
        description="A printable, chapter-organized quick-reference covering the CSS you actually reach for."
      />

      {/* Progress + download bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Chapter <span className="font-semibold text-foreground">{current + 1}</span> of{" "}
              {SECTIONS.length}
            </span>
            <span className="tabular-nums">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <Button
            variant="outline"
            onClick={openPreview}
            disabled={previewLoading}
            className="gap-1.5"
          >
            {previewLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Print Preview
          </Button>
          <Button onClick={download} className="gap-1.5 shadow-sm">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <Dialog
        open={previewUrl !== null}
        onOpenChange={(open) => {
          if (!open) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
        }}
      >
        <DialogContent className="flex h-[92vh] w-[96vw] max-w-6xl flex-col gap-3 p-4 sm:p-5">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-primary" /> Print Preview
            </DialogTitle>
            <DialogDescription className="text-xs">
              Exact rendering of the exported PDF — {previewPages} page
              {previewPages === 1 ? "" : "s"}. Page breaks and "(cont.)" continuation markers appear
              where they will in the download.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/30">
            {previewUrl && (
              <iframe
                src={`${previewUrl}#toolbar=1&navpanes=1&view=FitH`}
                title="PDF print preview"
                className="h-full w-full"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={download} className="gap-1.5">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile chapter picker */}
      <div className="lg:hidden">
        <Select value={String(current)} onValueChange={(v) => goTo(parseInt(v, 10))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select chapter" />
          </SelectTrigger>
          <SelectContent>
            {SECTIONS.map((s, i) => (
              <SelectItem key={s.title} value={String(i)}>
                {i + 1}. {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        <aside
          className="hidden lg:block lg:sticky lg:top-4 lg:self-start"
          data-testid="cheat-sheet-nav"
          data-total-chapters={SECTIONS.length}
        >
          <nav
            aria-label="Cheat sheet chapters"
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/60 p-3 shadow-lg backdrop-blur"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent"
            />
            <div className="relative mb-2 flex items-center justify-between px-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Chapters
              </div>
              <div className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20">
                {SECTIONS.length}
              </div>
            </div>
            <ol className="relative grid gap-1 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SECTIONS.map((s, i) => {
                const active = i === current;
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? "page" : undefined}
                      data-chapter-nav={i}
                      className={
                        "group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                        (active
                          ? "bg-gradient-to-r from-primary/20 to-primary/5 font-semibold text-foreground shadow-sm ring-1 ring-primary/40"
                          : "text-muted-foreground hover:translate-x-0.5 hover:bg-accent hover:text-foreground")
                      }
                    >
                      <span
                        className={
                          "grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] transition-colors " +
                          (active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary")
                        }
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 truncate">{s.title}</span>
                      {active ? (
                        <ChevronRight
                          className="ml-auto h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          {/* Search */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all 20 chapters…"
              aria-label="Search all chapters"
              className="h-11 pl-9 pr-9"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}

            {query && crossChapterResults.length > 0 ? (
              <div
                data-testid="cheat-sheet-search-results"
                className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-2xl"
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {totalMatches} match{totalMatches === 1 ? "" : "es"} across{" "}
                  {crossChapterResults.length} chapter{crossChapterResults.length === 1 ? "" : "s"}
                </div>
                <ul className="grid gap-2">
                  {crossChapterResults.map((g) => (
                    <li
                      key={g.chapter}
                      className="rounded-lg border border-border/50 bg-background/50"
                    >
                      <button
                        type="button"
                        onClick={() => jumpToMatch(g.chapter, null)}
                        className={
                          "flex w-full items-center justify-between gap-2 rounded-t-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent " +
                          (g.chapter === current ? "bg-primary/5" : "")
                        }
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-primary/15 font-mono text-[10px] font-semibold text-primary">
                            {g.chapter + 1}
                          </span>
                          <span className="truncate font-semibold text-foreground">{g.title}</span>
                          {g.chapter === current ? (
                            <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                              current
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {g.matches.length} match{g.matches.length === 1 ? "" : "es"}
                        </span>
                      </button>
                      <ul className="border-t border-border/50">
                        {g.matches.slice(0, 5).map((m) => (
                          <li key={m.prop}>
                            <button
                              type="button"
                              onClick={() => jumpToMatch(g.chapter, m.prop)}
                              data-testid="cheat-sheet-search-result"
                              className="flex w-full items-start gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                            >
                              <CornerDownRight
                                className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block font-mono text-[12px] font-semibold text-primary">
                                  <Highlight text={m.prop} query={query} />
                                </span>
                                <span className="line-clamp-1 text-muted-foreground">
                                  <Highlight text={m.desc} query={query} />
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                        {g.matches.length > 5 ? (
                          <li className="px-3 py-1.5 text-[11px] text-muted-foreground">
                            + {g.matches.length - 5} more — open chapter to see all
                          </li>
                        ) : null}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div ref={contentRef}>
            <section
              key={section.title}
              id={slug(section.title)}
              data-testid="cheat-sheet-section"
              data-chapter-index={current}
              className="scroll-mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* Hero banner */}
              <header className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 sm:p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 0%, color-mix(in oklab, var(--primary) 30%, transparent) 0%, transparent 50%), radial-gradient(circle at 90% 100%, color-mix(in oklab, var(--primary) 20%, transparent) 0%, transparent 60%)",
                  }}
                />
                <div className="relative flex items-start gap-3 sm:gap-4">
                  <div
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary font-mono text-lg font-bold text-primary-foreground shadow-md sm:h-14 sm:w-14 sm:text-xl"
                  >
                    {String(current + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary sm:text-xs">
                      Chapter {current + 1} / {SECTIONS.length}
                    </div>
                    <h2
                      className="mt-0.5 text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl"
                      data-testid="cheat-sheet-title"
                    >
                      {section.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                      {section.longIntro ?? section.intro}
                    </p>
                  </div>
                </div>
              </header>

              <div className="p-4 sm:p-5">
                {filteredRows.length === 0 ? (
                  <div
                    role="status"
                    data-testid="cheat-sheet-no-results"
                    className="rounded-xl border border-dashed border-border bg-background/50 p-8 text-center text-sm text-muted-foreground"
                  >
                    <div className="text-base font-semibold text-foreground">
                      No matches in this chapter
                    </div>
                    <div className="mt-1.5">
                      Nothing in <span className="font-semibold">{section.title}</span> matches{" "}
                      <span className="font-mono text-primary">“{deferredSearch}”</span>.
                      <br className="hidden sm:block" />
                      Try clearing the search or checking another chapter.
                    </div>
                  </div>
                ) : (
                  <dl className="grid gap-3 md:grid-cols-2">
                    {filteredRows.map((row) => {
                      const { prop, desc, example, values, examples, gotcha, support } = row;
                      const isHighlighted = highlightedProp === prop;
                      const hasExtras = !!(values?.length || examples?.length || gotcha || support);
                      return (
                        <div
                          key={prop}
                          data-row-prop={prop}
                          className={
                            "group relative grid min-w-0 gap-1.5 overflow-hidden rounded-xl border bg-background/60 p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-4 " +
                            (isHighlighted
                              ? "border-primary ring-2 ring-primary/60 shadow-md"
                              : "border-border/60") +
                            (hasExtras ? " md:col-span-2" : "")
                          }
                        >
                          <span
                            aria-hidden="true"
                            className={
                              "absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/40 transition-opacity " +
                              (isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                            }
                          />
                          <dt className="break-words font-mono text-[13px] font-semibold text-primary">
                            <Highlight text={prop} query={query} />
                          </dt>
                          <dd className="text-sm leading-relaxed text-muted-foreground">
                            <Highlight text={desc} query={query} />
                          </dd>
                          {example ? (
                            <code className="mt-1 block overflow-x-auto rounded-md border border-border/50 bg-muted/70 px-2.5 py-1.5 font-mono text-[11px] leading-relaxed text-foreground">
                              <Highlight text={example} query={query} />
                            </code>
                          ) : null}
                          {values && values.length > 0 ? (
                            <div className="mt-1.5">
                              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Values
                              </div>
                              <ul className="grid gap-1">
                                {values.map((v) => (
                                  <li key={v.name} className="text-xs leading-relaxed">
                                    <span className="font-mono font-semibold text-foreground">
                                      <Highlight text={v.name} query={query} />
                                    </span>
                                    <span className="text-muted-foreground">
                                      {" "}
                                      — <Highlight text={v.meaning} query={query} />
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {examples && examples.length > 0 ? (
                            <div className="mt-1.5 grid gap-1">
                              {examples.map((ex, i) => (
                                <code
                                  key={i}
                                  className="block overflow-x-auto rounded-md border border-border/50 bg-muted/50 px-2.5 py-1.5 font-mono text-[11px] leading-relaxed text-foreground"
                                >
                                  <Highlight text={ex} query={query} />
                                </code>
                              ))}
                            </div>
                          ) : null}
                          {gotcha ? (
                            <div className="mt-1.5 rounded-md border border-amber-500/30 bg-amber-500/5 px-2.5 py-1.5 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                              <span className="font-semibold">⚠ Gotcha:</span>{" "}
                              <Highlight text={gotcha} query={query} />
                            </div>
                          ) : null}
                          {support ? (
                            <div className="mt-1 text-[11px] text-muted-foreground">
                              <span className="font-semibold uppercase tracking-wider">
                                Support:
                              </span>{" "}
                              <Highlight text={support} query={query} />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </dl>
                )}

                {section.realWorld ? (
                  <section className="mt-6 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                    <header className="border-b border-border/60 px-4 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Real-world example
                      </div>
                      <h3 className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
                        {section.realWorld.title}
                      </h3>
                      {section.realWorld.description ? (
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {section.realWorld.description}
                        </p>
                      ) : null}
                    </header>
                    <div className="grid gap-0 md:grid-cols-2">
                      <RealWorldPreview html={section.realWorld.html} css={section.realWorld.css} />
                      <div className="grid gap-2 border-t border-border/60 p-3 md:border-l md:border-t-0">
                        <div>
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            HTML
                          </div>
                          <pre className="max-h-48 overflow-auto rounded-md border border-border/50 bg-muted/60 p-2 font-mono text-[11px] leading-relaxed text-foreground">
                            <code>{section.realWorld.html}</code>
                          </pre>
                        </div>
                        <div>
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            CSS
                          </div>
                          <pre className="max-h-64 overflow-auto rounded-md border border-border/50 bg-muted/60 p-2 font-mono text-[11px] leading-relaxed text-foreground">
                            <code>{section.realWorld.css}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}
              </div>
            </section>
          </div>

          <nav
            aria-label="Chapter navigation"
            className="grid grid-cols-2 items-stretch gap-2 rounded-2xl border border-border bg-card/60 p-2 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-3 sm:p-2.5"
          >
            <Button
              variant="ghost"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              data-testid="cheat-sheet-prev"
              className="h-auto min-w-0 justify-start gap-2 rounded-xl px-2.5 py-2 hover:bg-accent sm:px-3 sm:py-2.5"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="flex min-w-0 flex-col items-start leading-tight">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Previous
                </span>
                <span className="min-w-0 max-w-full truncate text-xs font-medium">
                  {current > 0 ? `${current}. ${SECTIONS[current - 1].title}` : "Start of book"}
                </span>
              </span>
            </Button>
            <div
              data-testid="cheat-sheet-progress"
              className="order-first col-span-2 flex items-center justify-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium tabular-nums text-muted-foreground sm:order-none sm:col-span-1 sm:self-center"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Ch.
              </span>
              <span className="font-semibold text-foreground">{current + 1}</span>
              <span className="text-muted-foreground/60">/</span>
              <span>{SECTIONS.length}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => goTo(current + 1)}
              disabled={current === SECTIONS.length - 1}
              data-testid="cheat-sheet-next"
              className="h-auto min-w-0 justify-end gap-2 rounded-xl px-2.5 py-2 hover:bg-accent sm:px-3 sm:py-2.5"
            >
              <span className="flex min-w-0 flex-col items-end leading-tight">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Next
                </span>
                <span className="min-w-0 max-w-full truncate text-xs font-medium">
                  {current < SECTIONS.length - 1
                    ? `${current + 2}. ${SECTIONS[current + 1].title}`
                    : "End of book"}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const lower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const hit = lower.indexOf(query, i);
    if (hit === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (hit > i) parts.push(text.slice(i, hit));
    parts.push(
      <mark key={key++} className="rounded bg-primary/20 px-0.5 text-foreground">
        {text.slice(hit, hit + query.length)}
      </mark>,
    );
    i = hit + query.length;
  }
  return <>{parts}</>;
}

function RealWorldPreview({ html, css }: { html: string; css: string }) {
  const srcDoc = React.useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:16px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#111827;background:#fff;}
      ${css}
    </style></head><body>${html}</body></html>`,
    [html, css],
  );
  return (
    <div className="min-h-[180px] bg-white p-0 dark:bg-neutral-100">
      <iframe
        title="Real-world example preview"
        srcDoc={srcDoc}
        sandbox=""
        className="h-[280px] w-full border-0"
        loading="lazy"
      />
    </div>
  );
}
