# 🎨 SagaCSS — Free Visual CSS Toolkit for Developers

> Design gradients, shadows, animations, palettes, and layouts visually — then copy production-ready CSS, Tailwind, or Bootstrap code. No sign-up, no paywall, all client-side.

🌐 **Live:** [https://sagacss.vercel.app/](https://sagacss.vercel.app/)
💻 **GitHub:** [https://github.com/tripathipawan/Saga_CSS_Website](https://github.com/tripathipawan/Saga_CSS_Website)

---

## 📌 Table of Contents

1. [What is SagaCSS?](#what-is-sagacss)
2. [Why I Built This](#why-i-built-this)
3. [What It Can Do](#what-it-can-do)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Features In Detail](#features-in-detail)
7. [Testing & CI](#testing--ci)
8. [Getting Started](#getting-started)
9. [Available Scripts](#available-scripts)
10. [Known Limitations](#known-limitations)
11. [Challenges & How I Solved Them](#challenges--how-i-solved-them)
12. [What I Learned](#what-i-learned)

---

## 🧠 What is SagaCSS?

**SagaCSS** is a free, all-in-one visual CSS toolkit for frontend developers. Instead of memorizing syntax for gradients, box-shadows, clip-paths, cubic-bezier curves, or CSS Grid, you design everything visually with live sliders and previews — and the tool generates clean, copy-ready code for you in CSS, Tailwind, and Bootstrap formats.

Beyond the generators, SagaCSS also bundles a design-style showcase library (glassmorphism, neumorphism, cyberpunk, etc.), a full interview-prep question bank, hands-on CSS practice challenges with automated pass/fail checks, and a personal "My Kit" snippet saver — making it as much a learning platform as it is a utility toolkit.

---

## 💡 Why I Built This

As a frontend developer, I kept bouncing between a dozen different single-purpose CSS generator websites — one for gradients, another for box-shadows, another for cubic-bezier curves — each with a different UI, ad-heavy pages, and no consistency. There was no single place that combined generation, learning, and reference in one clean, fast tool.

I built SagaCSS to fix that: one toolkit, one design system, over 30 tools, zero backend dependency, and genuinely useful learning resources (interview prep + practice challenges) baked into the same product — built and shipped end-to-end by me, from architecture to deployment to CI/CD.

---

## ✅ What It Can Do

- 🎨 **30+ CSS generators** — gradients, shadows, borders, animations, 3D shapes, filters, clip-path, grid, flexbox, and more — all with live visual previews
- 🖌️ **7 design-style showcases** — glassmorphism, neumorphism, claymorphism, neubrutalism, Y2K/retro, cyberpunk neon, and art deco, each with ready-to-copy code snippets
- 📋 **Copy-ready output** in raw CSS, Tailwind utility classes, and Bootstrap where applicable
- 🧰 **My Kit** — save favorite snippets locally and revisit them anytime, no account needed
- 📖 **CSS Cheat Sheet** — quick reference for common properties and values
- 🎓 **Interview Prep** — a searchable, filterable question bank (HTML/CSS, by difficulty level) with shareable deep-links and a filtered PDF export
- 🏋️ **Practice Challenges** — hands-on CSS exercises with an automated checker that validates your solution against expected selectors/properties and gives instant pass/fail feedback
- 📱 **Responsive Preview Tester** — render your HTML+CSS across 4 breakpoints (375 / 768 / 1024 / 1440) side-by-side with synced scrolling
- 🌐 **Browser Compatibility Checker** — look up support for ~120 CSS features across Chrome, Firefox, Safari, Edge, Opera, and mobile browsers
- 🎯 **CSS Specificity Visualizer** — parses selectors into their specificity tuple and compares two selectors head-to-head
- 📝 **Blog** — articles on CSS techniques, with tags, pagination, and Open Graph metadata
- 🌙 **Dark / Light mode**, fully responsive layout, and a persistent sidebar navigation
- 🔍 **SEO-optimized** — per-route meta tags, canonical URLs, JSON-LD structured data, sitemap, and Core Web Vitals reporting

---

## ⚙️ Tech Stack

| Category            | Technology                                  |
| -------------------- | -------------------------------------------- |
| Framework            | React 19 + TanStack Start (SSR) + TanStack Router |
| Language              | TypeScript                                   |
| Build Tool            | Vite 8 (via Nitro server target)             |
| Styling               | Tailwind CSS v4                              |
| UI Components         | shadcn/ui + Radix UI primitives              |
| Animations            | Framer Motion                                |
| Data Fetching         | TanStack Query                               |
| Forms & Validation    | React Hook Form + Zod                        |
| Charts                | Recharts                                     |
| PDF Export            | jsPDF                                        |
| CSS Preprocessing     | Less (in-browser SCSS/LESS compiler tool)    |
| Icons                 | Lucide React                                 |
| Package Manager       | Bun                                           |
| E2E Testing           | Playwright + @axe-core/playwright (accessibility) |
| Performance Auditing  | Lighthouse CI                                |
| Linting/Formatting    | ESLint + Prettier                            |
| Deployment            | Vercel                                       |
| CI/CD                 | GitHub Actions                               |


# 🎨 SagaCSS — Free Visual CSS Toolkit for Developers

> Design gradients, shadows, animations, palettes, and layouts visually — then copy production-ready CSS, Tailwind, or Bootstrap code. No sign-up, no paywall, all client-side.

🌐 **Live:** [https://sagacss.vercel.app/](https://sagacss.vercel.app/)
💻 **GitHub:** [https://github.com/tripathipawan/Saga_CSS_Website](https://github.com/tripathipawan/Saga_CSS_Website)

---

## 📌 Table of Contents

1. [What is SagaCSS?](#what-is-sagacss)
2. [Why I Built This](#why-i-built-this)
3. [What It Can Do](#what-it-can-do)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Features In Detail](#features-in-detail)
7. [Testing & CI](#testing--ci)
8. [Getting Started](#getting-started)
9. [Available Scripts](#available-scripts)
10. [Known Limitations](#known-limitations)
11. [Challenges & How I Solved Them](#challenges--how-i-solved-them)
12. [What I Learned](#what-i-learned)

---

## 🧠 What is SagaCSS?

**SagaCSS** is a free, all-in-one visual CSS toolkit for frontend developers. Instead of memorizing syntax for gradients, box-shadows, clip-paths, cubic-bezier curves, or CSS Grid, you design everything visually with live sliders and previews — and the tool generates clean, copy-ready code for you in CSS, Tailwind, and Bootstrap formats.

Beyond the generators, SagaCSS also bundles a design-style showcase library (glassmorphism, neumorphism, cyberpunk, etc.), a full interview-prep question bank, hands-on CSS practice challenges with automated pass/fail checks, and a personal "My Kit" snippet saver — making it as much a learning platform as it is a utility toolkit.

---

## 💡 Why I Built This

As a frontend developer, I kept bouncing between a dozen different single-purpose CSS generator websites — one for gradients, another for box-shadows, another for cubic-bezier curves — each with a different UI, ad-heavy pages, and no consistency. There was no single place that combined generation, learning, and reference in one clean, fast tool.

I built SagaCSS to fix that: one toolkit, one design system, over 30 tools, zero backend dependency, and genuinely useful learning resources (interview prep + practice challenges) baked into the same product — built and shipped end-to-end by me, from architecture to deployment to CI/CD.

---

## ✅ What It Can Do

- 🎨 **30+ CSS generators** — gradients, shadows, borders, animations, 3D shapes, filters, clip-path, grid, flexbox, and more — all with live visual previews
- 🖌️ **7 design-style showcases** — glassmorphism, neumorphism, claymorphism, neubrutalism, Y2K/retro, cyberpunk neon, and art deco, each with ready-to-copy code snippets
- 📋 **Copy-ready output** in raw CSS, Tailwind utility classes, and Bootstrap where applicable
- 🧰 **My Kit** — save favorite snippets locally and revisit them anytime, no account needed
- 📖 **CSS Cheat Sheet** — quick reference for common properties and values
- 🎓 **Interview Prep** — a searchable, filterable question bank (HTML/CSS, by difficulty level) with shareable deep-links and a filtered PDF export
- 🏋️ **Practice Challenges** — hands-on CSS exercises with an automated checker that validates your solution against expected selectors/properties and gives instant pass/fail feedback
- 📱 **Responsive Preview Tester** — render your HTML+CSS across 4 breakpoints (375 / 768 / 1024 / 1440) side-by-side with synced scrolling
- 🌐 **Browser Compatibility Checker** — look up support for ~120 CSS features across Chrome, Firefox, Safari, Edge, Opera, and mobile browsers
- 🎯 **CSS Specificity Visualizer** — parses selectors into their specificity tuple and compares two selectors head-to-head
- 📝 **Blog** — articles on CSS techniques, with tags, pagination, and Open Graph metadata
- 🌙 **Dark / Light mode**, fully responsive layout, and a persistent sidebar navigation
- 🔍 **SEO-optimized** — per-route meta tags, canonical URLs, JSON-LD structured data, sitemap, and Core Web Vitals reporting

---

## ⚙️ Tech Stack

| Category            | Technology                                  |
| -------------------- | -------------------------------------------- |
| Framework            | React 19 + TanStack Start (SSR) + TanStack Router |
| Language              | TypeScript                                   |
| Build Tool            | Vite 8 (via Nitro server target)             |
| Styling               | Tailwind CSS v4                              |
| UI Components         | shadcn/ui + Radix UI primitives              |
| Animations            | Framer Motion                                |
| Data Fetching         | TanStack Query                               |
| Forms & Validation    | React Hook Form + Zod                        |
| Charts                | Recharts                                     |
| PDF Export            | jsPDF                                        |
| CSS Preprocessing     | Less (in-browser SCSS/LESS compiler tool)    |
| Icons                 | Lucide React                                 |
| Package Manager       | Bun                                           |
| E2E Testing           | Playwright + @axe-core/playwright (accessibility) |
| Performance Auditing  | Lighthouse CI                                |
| Linting/Formatting    | ESLint + Prettier                            |
| Deployment            | Vercel                                       |
| CI/CD                 | GitHub Actions                               |

---

## 📁 Project Structure

```
Saga_CSS_Website/
├── src/
│   ├── routes/                       # File-based routing (TanStack Router)
│   │   ├── index.tsx                 # Homepage
│   │   ├── about.tsx / contact.tsx / faq.tsx
│   │   ├── privacy.tsx / terms.tsx / cookies.tsx
│   │   ├── cheat-sheet.tsx           # CSS quick-reference page
│   │   ├── interview-prep.tsx        # Interview question bank
│   │   ├── practice.tsx              # Practice challenges + checker
│   │   ├── my-kit.tsx                # Saved snippets page
│   │   ├── settings.tsx
│   │   ├── sitemap[.]xml.ts          # Dynamic sitemap generation
│   │   ├── blog.index.tsx / blog.$slug.tsx / blog.page.$page.tsx
│   │   ├── api/public/vitals.ts      # Web Vitals reporting endpoint
│   │   ├── styles/                   # Design-style showcase pages
│   │   │   ├── glassmorphism.tsx
│   │   │   ├── neumorphism.tsx
│   │   │   ├── claymorphism.tsx
│   │   │   ├── neubrutalism.tsx
│   │   │   ├── y2k.tsx
│   │   │   ├── cyberpunk.tsx
│   │   │   └── art-deco.tsx
│   │   └── tools/                    # 30+ individual CSS tool pages
│   │       ├── gradient.tsx / box-shadow.tsx / text-shadow.tsx
│   │       ├── grid.tsx / flexbox.tsx / box-sizing.tsx
│   │       ├── color-palette.tsx / color-converter.tsx / color-mixer.tsx / contrast.tsx
│   │       ├── clip-path.tsx / border-radius.tsx / svg.tsx / 3d-shapes.tsx
│   │       ├── animation.tsx / bezier.tsx / filter.tsx / image-text.tsx
│   │       ├── button.tsx / fonts.tsx / spinner.tsx / scrollbar.tsx
│   │       ├── theme.tsx / theme-variables.tsx / reset.tsx / clamp.tsx
│   │       ├── preprocessor.tsx / base64.tsx
│   │       ├── compatibility.tsx     # Browser support checker
│   │       ├── specificity.tsx       # Specificity visualizer
│   │       └── responsive.tsx        # Multi-breakpoint preview tester
│   ├── components/
│   │   ├── layout/
│   │   │   ├── app-header.tsx        # Top nav with theme toggle
│   │   │   ├── app-sidebar.tsx       # Tool navigation sidebar
│   │   │   ├── app-footer.tsx
│   │   │   └── app-shell.tsx         # Page wrapper
│   │   ├── blog/
│   │   │   ├── blog-listing.tsx
│   │   │   └── share-buttons.tsx
│   │   ├── ui/                       # shadcn/ui primitives (accordion, dialog, etc.)
│   │   ├── tool-header.tsx           # Shared header for every tool page
│   │   ├── sticky-code.tsx           # Sticky "copy code" panel used across tools
│   │   ├── code-block.tsx            # Syntax-highlighted code output
│   │   ├── theme-provider.tsx / theme-toggle.tsx
│   │   └── coming-soon.tsx
│   ├── lib/
│   │   ├── tools.ts                  # Central registry of every tool/style/route
│   │   ├── palettes.ts               # Color palette dataset
│   │   ├── color.ts                  # Color conversion utilities
│   │   ├── specificity.ts            # Selector specificity parser
│   │   ├── compat-data.ts            # Browser compatibility dataset (~120 features)
│   │   ├── interview-questions.ts    # Interview prep question bank
│   │   ├── practice-challenges.ts / practice-checks.ts  # Challenges + checker logic
│   │   ├── my-kit.ts                 # localStorage snippet save/load
│   │   ├── blog.ts / blog-posts.ts   # Blog content + helpers
│   │   ├── storage-migration.ts      # localStorage schema migrations
│   │   ├── web-vitals-client.ts      # Core Web Vitals reporting
│   │   └── utils.ts                  # cn() class utility
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── router.tsx                    # Router instance
│   ├── server.ts / start.ts          # SSR entry points (TanStack Start / Nitro)
│   └── styles.css
├── tests/
│   └── e2e/                          # Playwright test suites
│       ├── tools.spec.ts / generators.spec.ts
│       ├── a11y.spec.ts              # Accessibility (axe-core)
│       ├── seo.spec.ts / social-jsonld.spec.ts
│       ├── blog.spec.ts / footer.spec.ts
│       ├── pdf-and-clipboard.spec.ts / my-kit.spec.ts
│       ├── responsive-viewports.spec.ts
│       └── prod-smoke.spec.ts        # Post-deploy smoke tests
├── scripts/
│   ├── prod-seo-audit.mjs            # SEO audit against a live URL
│   └── lint-bootstrap.mjs
├── .github/workflows/
│   ├── ci.yml                        # Lint, build, E2E, a11y, SEO tests on every push/PR
│   └── prod-audit.yml                # Manual Lighthouse + smoke audit against a deployed URL
├── lighthouserc.json                 # Lighthouse CI config
├── public/
├── vite.config.ts
└── package.json
```


---

## 🔬 Features In Detail

### 🎨 CSS Generators (30+ tools)

Every tool under `/tools/*` follows the same pattern: adjust values with sliders/inputs, see a **live preview** update instantly, and get **copy-ready code** in one click. Covers layout (Grid, Flexbox, Box Sizing), visual effects (Gradient, Box Shadow, Text Shadow, Filter, Clip Path, 3D Shapes), color (Palette, Converter, Mixer, Contrast Checker), motion (Animation, Cubic Bezier), and utility generators (CSS Reset, Clamp Calculator, Base64 Image Converter, SCSS/LESS Compiler, Scrollbar Styler, Loader/Spinner).

### 🖌️ Design Style Showcases

Seven dedicated pages (`/styles/*`) demonstrate popular UI aesthetics — glassmorphism, neumorphism, claymorphism, neubrutalism, Y2K/retro, cyberpunk neon, art deco — each with live component examples and the exact CSS needed to recreate the look.

### 🎓 Interview Prep

A searchable, filterable HTML/CSS interview question bank at `/interview-prep`, with difficulty levels (Beginner / Intermediate / Advanced), bookmarking, shareable deep-links (`?q=<id>`) that scroll to and highlight a specific question, and a filtered PDF export (scope, language, and level selectable before download).

### 🏋️ Practice Challenges

Hands-on CSS exercises at `/practice` where users write CSS against a prompt and get **automated pass/fail feedback** — the checker runner validates the solution against expected selectors, properties, and values (supporting exact match, substring, regex, and numeric-tolerance checks), with a detailed per-check results table.

### 🌐 Browser Compatibility Checker

`/tools/compatibility` — a searchable local dataset of ~120 CSS features mapped to support across 7 browsers/platforms, with color-coded support badges, vendor-prefix notes, fallback tips, and estimated global usage.

### 🎯 CSS Specificity Visualizer

`/tools/specificity` — parses any CSS selector (including `:not()`, `:is()`, `:where()`, attribute selectors, pseudo-elements) into its specificity tuple, visualizes the weight as a color-coded bar chart, and supports a two-selector comparison mode with a clear "which one wins" verdict.

### 📱 Responsive Preview Tester

`/tools/responsive` — paste HTML+CSS (or pull from My Kit) and preview it simultaneously across 4 breakpoints (375 / 768 / 1024 / 1440) with optional synced scrolling across all frames.

### 🧰 My Kit

A personal snippet library (`/my-kit`) — save any generated CSS from any tool and revisit it later. Stored entirely in `localStorage`, no account or backend required.

### 📝 Blog

A lightweight blog system with listing, pagination, tag filtering, individual post pages, and social share buttons — built for SEO with per-post Open Graph tags and JSON-LD.

### 🔍 SEO & Performance

Every route ships its own `<title>`, meta description, canonical URL, and Open Graph tags. The site also generates a dynamic `sitemap.xml`, reports Core Web Vitals to a custom API route, and is regularly audited with Lighthouse CI for performance, accessibility, best practices, and SEO scores.

---

## 🧪 Testing & CI

This project takes testing seriously for a personal project — every push and PR to `main` runs a full GitHub Actions pipeline (`ci.yml`):

- **Lint** — ESLint across the codebase
- **Build** — production build via Vite/Nitro
- **E2E tests (Playwright)** — tool functionality, generator + copy behavior, accessibility (axe-core), SEO metadata, blog flows, footer, PDF export, clipboard, My Kit, and responsive viewport regression (375/768/1024/1440)
- **SEO / JSON-LD sameAs regression** — verifies structured data stays correct

A separate manually-triggered workflow (`prod-audit.yml`) runs **Lighthouse CI** and Playwright smoke tests against the real deployed production URL after every release, so performance/SEO scores are always checked against what users actually see — not a stale or hardcoded URL.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest)
- Node.js 18+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tripathipawan/Saga_CSS_Website.git
cd Saga_CSS_Website

# 2. Install dependencies
bun install

# 3. Start the dev server
bun run dev
```

The app will be available at `http://localhost:3000` (or the port Vite assigns).

### Build for Production

```bash
bun run build
```

---

## 📜 Available Scripts

| Script                  | Description                                          |
| ------------------------ | ----------------------------------------------------- |
| `bun run dev`             | Start the local development server                   |
| `bun run build`           | Production build                                      |
| `bun run lint`            | Run ESLint                                             |
| `bun run format`          | Format code with Prettier                              |
| `bun run test:e2e`        | Run the full Playwright E2E suite                       |
| `bun run test:a11y`       | Run accessibility tests only                            |
| `bun run test:lh`         | Run Lighthouse CI locally                               |
| `bun run test:responsive` | Run responsive-viewport regression tests                |
| `bun run seo:audit`       | Run the SEO audit script against a given URL             |
| `bun run smoke:prod`      | Run production smoke tests against a deployed URL        |

---

## ⚠️ Known Limitations

| Limitation                     | Details                                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **No backend / database**        | All user data (My Kit snippets, bookmarks, theme preference) is stored in the browser via `localStorage`. Clearing browser data or switching devices loses saved data. |
| **No user accounts**             | By design — everything works instantly with zero friction, but there's no cross-device sync.                |
| **Compatibility dataset is static** | The browser-support data in the Compatibility Checker is a curated local dataset, not a live API — it needs manual updates as browsers evolve. |
| **SSR + Nitro preview mismatch**  | `vite preview` doesn't currently serve the TanStack Start/Nitro server output correctly in this setup, so local E2E tests run against the dev server instead of a production build. |

---

## 🧩 Challenges & How I Solved Them

### 1. 🖥️ Keeping 30+ Tool Pages Consistent

With so many generator pages, keeping the UI, copy behavior, and code-output format consistent was a real risk. I solved this by extracting shared building blocks — `tool-header.tsx` for every tool's header, `sticky-code.tsx` for the persistent "copy code" panel, and a central `tools.ts` registry that every navigation surface (sidebar, homepage, sitemap) reads from — so adding a new tool means registering it once, not touching five different files.

### 2. 🧮 Building an Accurate CSS Specificity Parser

Writing a selector parser that correctly tokenizes `:not()`, `:is()`, `:where()` (which has zero specificity), attribute selectors, and compound selectors — without pulling in a heavy CSS parsing library — took several iterations. I built a small tokenizer in `specificity.ts` that walks the selector string, classifies each token, and accumulates the `a-b-c-d` specificity tuple, with dedicated handling for zero-specificity pseudo-classes.

### 3. 🔁 Automated Pass/Fail Checking for Practice Challenges

Practice challenges needed a way to verify a user's CSS solution automatically rather than just showing a static answer. I designed a check-runner that supports multiple matcher types (exact, substring, regex, numeric-with-tolerance) per challenge, so each challenge can validate the exact selector/property/value combination and return a clear per-check pass/fail table instead of a single opaque result.

### 4. 🌐 CI Testing Against a Stale Hardcoded URL

The CI pipeline originally ran Lighthouse CI against a hardcoded live URL that eventually went offline, breaking every single CI run regardless of code changes. I restructured the workflow so **Lighthouse/performance auditing runs separately**, as a manually-triggered `prod-audit.yml` workflow that accepts the real deployed URL as an input — decoupling the correctness of every-push CI from the uptime of any one external URL.

### 5. 🔗 Shareable Deep-Links for Interview Questions & Challenges

Users wanted to share a link directly to one interview question or practice challenge. I used TanStack Router's `validateSearch` to add typed `?q=<id>` / `?c=<id>` search params, and on mount, scroll to and highlight the matching card with an ephemeral ring animation — plus a "Copy link" button on every item that writes the full shareable URL to the clipboard.

### 6. 📱 Synced Scrolling Across Multiple Preview Iframes

The Responsive Preview Tester renders the same content in 4 separate iframes at different widths. Getting scroll position to stay in sync across all of them (without triggering an infinite feedback loop of scroll events) required carefully guarding each iframe's scroll listener so it ignores scroll events it triggered itself while mirroring the others.

---

## 📚 What I Learned

Working on this project pushed me deeper into several areas:

- **TanStack Start (SSR) + TanStack Router** — file-based routing, typed search params, and server-rendered routes in a real production app, beyond the more common Next.js/Vite SPA setup
- **Building a design-system-driven codebase at scale** — keeping 30+ near-identical tool pages consistent and maintainable through shared components and a central registry, instead of copy-pasting each one
- **Writing a CSS parser from scratch** — implementing specificity calculation without external dependencies deepened my understanding of the CSS cascade
- **CI/CD pipeline design** — structuring GitHub Actions so that fast, deterministic checks (lint, build, E2E) run on every push, while slower or environment-dependent checks (Lighthouse against a live URL) run separately and don't block development
- **Accessibility testing at scale** — integrating `axe-core` into Playwright to catch a11y regressions automatically across dozens of pages, not just spot-checking manually
- **SEO for a multi-route SSR app** — per-route meta tags, dynamic sitemap generation, JSON-LD structured data, and Core Web Vitals reporting done properly across 40+ routes

---

## 📬 Contact

**Pawan Tripathi**
GitHub: [@tripathipawan](https://github.com/tripathipawan)

---

> Built to make writing CSS faster, and to make learning it a little less painful. 🎨
