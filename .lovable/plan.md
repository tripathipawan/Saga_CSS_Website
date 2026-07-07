This is a large multi-part scope. Grouping into 4 workstreams. I'll build them in order and confirm along the way.

## 1. Shareable URLs (Interview Prep + Practice)
- `/interview-prep`: add `?q=<id>` search param via `validateSearch`. On mount, if present, scroll to and expand that question card, and apply an ephemeral highlight ring.
- Each question card gets a "Copy link" button (writes `location.origin + /interview-prep?q=<id>` to clipboard).
- `/practice`: add `?c=<id>` search param. On mount, auto-select that challenge. Add "Copy link" button on the active challenge header.

## 2. Practice — full automated checks + clear pass/fail
- Audit `src/lib/practice-challenges.ts`: every challenge gets at least one `check` (selector + property + expected value / matcher). Add missing ones so 100% coverage.
- Extend the check runner to support:
  - exact match, contains substring, regex, and numeric-with-tolerance matchers.
  - multiple checks per challenge, aggregated into pass/fail.
- Results panel: shows overall ✅ Passed / ❌ Failed banner, plus a per-check table with columns: Selector · Property · Expected · Actual · Result. Failures show red row with diff hint.

## 3. Filtered PDF export (Interview Prep)
- Replace current "export all" flow with a dialog/sheet before download:
  - Scope: All · Bookmarked · Reviewed · Current filter results
  - Languages: HTML / CSS (multi)
  - Levels: Beginner / Intermediate / Advanced (multi)
  - Live count preview ("Exporting 42 questions")
- Same jsPDF renderer, filtered input set. Filename encodes scope, e.g. `sagacss-interview-bookmarked-2026-07-06.pdf`.
- Practice: add analogous "Export selected/bookmarked as PDF" — add a bookmark toggle per challenge (localStorage), and a PDF export that includes prompt, starter, and solution CSS for the selected set.

## 4. Three new tools

### /tools/compatibility — Browser Compatibility Checker
- Local dataset in `src/lib/compat-data.ts`: ~120 features across properties, at-rules, pseudo-classes, functions. Each entry: `{ id, name, type, browsers: { chrome, firefox, safari, edge, opera, safari_ios, chrome_android }, prefixes?, notes?, fallback?, globalUsage? }`.
- UI: search input with autocomplete (Command component), results table with 7 browser columns and colored badges (green full / yellow partial / red none / prefix chip). Fallback tip block + estimated global usage.
- "Recently checked" list in localStorage. "Save to My Kit" as a formatted note snippet.

### /tools/specificity — CSS Specificity Visualizer
- Selector parser that tokenizes into: ID, class/attribute/pseudo-class, element/pseudo-element, and ignores universal + combinators. Handles `:not(...)`, `:is(...)`, `:where()` (zero), `::pseudo-element`, attribute selectors, and compound selectors.
- Output: 4-tuple `a-b-c-d` with color-coded chips per token and a stacked bar chart visualizing weight.
- Two-input compare mode with "Selector A wins / tie" verdict and reasoning.
- Reference legend, recent-selector history, "Save to My Kit".

### /tools/responsive — Responsive Preview Tester
- Two input modes: paste HTML+CSS, or pick from My Kit (dropdown lists kit entries).
- 4 iframes (375/768/1024/1440) rendered via `srcDoc`, scaled with CSS `transform: scale(...)` to fit side-by-side; label above each with px width.
- Checkboxes to toggle each breakpoint + a custom-width input.
- Sync-scroll toggle: listens to `scroll` on each iframe body and mirrors `scrollTop` across the others (guarded to avoid feedback loops).
- On narrow screens, frames stack vertically.

## Shared
- Add all 3 to `CORE_TOOLS` in `src/lib/tools.ts` and to icons in `src/components/layout/app-sidebar.tsx`.
- Add SEO `head()` to each new route (title/description/og/canonical).
- Add `/tools/compatibility`, `/tools/specificity`, `/tools/responsive` to `src/routes/sitemap[.]xml.ts`.
- Homepage `src/routes/index.tsx`: remove the three items from "Coming soon"; only "SagaCSS Blog / Articles" remains.

## Verification
- `bunx tsgo` typecheck + build.
- Manual smoke via preview: share link roundtrip, PDF export dialog counts, one compat search, one specificity comparison, one responsive render.

## Scope note
This is a large batch. If credits get tight I'll cut in this priority order (keep earlier, drop later): Shareable URLs → PDF filter dialog → Specificity → Compatibility → Responsive Tester → Practice full-coverage checks. I'll flag before stopping.
