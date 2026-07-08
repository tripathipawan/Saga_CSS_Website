export type ChallengeLevel = "Basic" | "Medium" | "Advanced";
export type ChallengeCategory =
  | "Layout"
  | "Positioning"
  | "Typography"
  | "Animations"
  | "Responsive"
  | "Visual Effects"
  | "Selectors";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  level: ChallengeLevel;
  category: ChallengeCategory;
  html: string;
  starterCss: string;
  solutionCss: string;
  explanation: string;
  /** Optional key computed styles on `#target` to compare against user's `#target`. */
  checks?: { selector: string; prop: string; expected: string }[];
};

const c = (x: Challenge): Challenge => x;

export const CHALLENGES: Challenge[] = [
  // ============ LAYOUT (Flexbox / Grid) ============
  c({
    id: "center-flex",
    title: "Center a box with Flexbox",
    description: "Center `#target` both horizontally and vertically inside `#stage` using Flexbox.",
    level: "Basic",
    category: "Layout",
    html: `<div id="stage"><div id="target">Center me</div></div>`,
    starterCss: `#stage {\n  height: 200px;\n  background: #f1f5f9;\n  /* your code here */\n}\n#target {\n  padding: 12px 20px;\n  background: #6366f1;\n  color: white;\n  border-radius: 8px;\n}`,
    solutionCss: `#stage {\n  height: 200px;\n  background: #f1f5f9;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n#target {\n  padding: 12px 20px;\n  background: #6366f1;\n  color: white;\n  border-radius: 8px;\n}`,
    explanation:
      "Setting `display: flex` turns `#stage` into a flex container. `justify-content: center` centers on the main axis (horizontal by default) and `align-items: center` centers on the cross axis.",
    checks: [
      { selector: "#stage", prop: "display", expected: "flex" },
      { selector: "#stage", prop: "justify-content", expected: "center" },
      { selector: "#stage", prop: "align-items", expected: "center" },
    ],
  }),
  c({
    id: "center-grid",
    title: "Center a box with Grid",
    description: "Use CSS Grid `place-items` to center `#target` inside `#stage`.",
    level: "Basic",
    category: "Layout",
    html: `<div id="stage"><div id="target">Grid center</div></div>`,
    starterCss: `#stage { height: 200px; background: #f1f5f9; }\n#target { padding: 12px 20px; background: #10b981; color: white; border-radius: 8px; }`,
    solutionCss: `#stage { height: 200px; background: #f1f5f9; display: grid; place-items: center; }\n#target { padding: 12px 20px; background: #10b981; color: white; border-radius: 8px; }`,
    explanation:
      "`place-items: center` is shorthand for `align-items: center` + `justify-items: center`. In a single-child grid, it centers the child in both axes with one line.",
    checks: [
      { selector: "#stage", prop: "display", expected: "grid" },
      { selector: "#stage", prop: "place-items", expected: "center" },
    ],
  }),
  c({
    id: "three-col-grid",
    title: "Three equal columns",
    description: "Lay out three cards in equal-width columns with a 16px gap.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><div class="card">A</div><div class="card">B</div><div class="card">C</div></div>`,
    starterCss: `#target { /* your code */ }\n.card { padding: 24px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }`,
    solutionCss: `#target { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n.card { padding: 24px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }`,
    explanation:
      "`repeat(3, 1fr)` creates three columns that each take an equal share of leftover space. `gap` adds spacing between tracks without adding it outside the grid.",
    checks: [
      { selector: "#target", prop: "display", expected: "grid" },
      { selector: "#target", prop: "gap", expected: "16px" },
    ],
  }),
  c({
    id: "responsive-cards",
    title: "Responsive card grid (no media queries)",
    description:
      "Build a grid that fits as many 200px cards per row as possible, filling any leftover space.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="card">1</div><div class="card">2</div><div class="card">3</div><div class="card">4</div><div class="card">5</div></div>`,
    starterCss: `#target { /* your code */ }\n.card { padding: 24px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }`,
    solutionCss: `#target { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }\n.card { padding: 24px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }`,
    explanation:
      "`auto-fit` makes as many tracks as fit at min 200px each, and `1fr` lets remaining cards stretch to fill leftover space. No breakpoints needed.",
  }),
  c({
    id: "sidebar-layout",
    title: "Sidebar + main layout",
    description: "Build a two-column layout: a 200px sidebar and a flexible main area.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><aside>Sidebar</aside><main>Main content</main></div>`,
    starterCss: `#target { min-height: 200px; /* your code */ }\naside { background: #1e293b; color: white; padding: 16px; }\nmain { background: #f1f5f9; padding: 16px; }`,
    solutionCss: `#target { min-height: 200px; display: grid; grid-template-columns: 200px 1fr; }\naside { background: #1e293b; color: white; padding: 16px; }\nmain { background: #f1f5f9; padding: 16px; }`,
    explanation:
      "`200px 1fr` gives a fixed sidebar and lets `main` absorb the rest. Grid handles this in one line without floats or margins.",
  }),
  c({
    id: "holy-grail",
    title: "Holy grail layout",
    description: "Header, footer, and three columns (nav / main / aside) using named grid areas.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><header>Header</header><nav>Nav</nav><main>Main</main><aside>Aside</aside><footer>Footer</footer></div>`,
    starterCss: `#target { min-height: 300px; /* your code */ }\nheader, footer { background: #6366f1; color: white; padding: 10px; }\nnav, aside { background: #e2e8f0; padding: 10px; }\nmain { background: #f8fafc; padding: 10px; }`,
    solutionCss: `#target {\n  min-height: 300px;\n  display: grid;\n  grid-template-columns: 120px 1fr 120px;\n  grid-template-rows: auto 1fr auto;\n  grid-template-areas: 'header header header' 'nav main aside' 'footer footer footer';\n  gap: 8px;\n}\nheader { grid-area: header; background: #6366f1; color: white; padding: 10px; }\nnav { grid-area: nav; background: #e2e8f0; padding: 10px; }\nmain { grid-area: main; background: #f8fafc; padding: 10px; }\naside { grid-area: aside; background: #e2e8f0; padding: 10px; }\nfooter { grid-area: footer; background: #6366f1; color: white; padding: 10px; }`,
    explanation:
      "Named areas make complex layouts self-documenting. The template strings visually match the layout, and each region is placed with `grid-area`.",
  }),
  c({
    id: "space-between-row",
    title: "Header row: logo left, nav right",
    description: "Push the logo to the left and the nav to the right using Flexbox.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><div class="logo">Logo</div><nav>Home · About · Contact</nav></div>`,
    starterCss: `#target { padding: 12px; background: #0f172a; color: white; /* your code */ }`,
    solutionCss: `#target { padding: 12px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: space-between; }`,
    explanation:
      "`justify-content: space-between` pushes the first item to the start and the last to the end, distributing any remainder evenly between siblings.",
    checks: [{ selector: "#target", prop: "justify-content", expected: "space-between" }],
  }),
  c({
    id: "equal-height-cards",
    title: "Equal-height cards",
    description: "Make three cards the same height even though their content lengths differ.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><div class="card">Short</div><div class="card">Medium content here that is a bit longer.</div><div class="card">A</div></div>`,
    starterCss: `#target { /* your code */ }\n.card { flex: 1; padding: 16px; background: #6366f1; color: white; border-radius: 8px; }`,
    solutionCss: `#target { display: flex; gap: 12px; align-items: stretch; }\n.card { flex: 1; padding: 16px; background: #6366f1; color: white; border-radius: 8px; }`,
    explanation:
      "The default `align-items` for a flex container is already `stretch`, which makes every child fill the cross axis — giving equal heights automatically.",
  }),
  c({
    id: "wrap-flex",
    title: "Wrapping tag list",
    description: "Make the tag row wrap to multiple lines when it overflows.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><span class="tag">css</span><span class="tag">html</span><span class="tag">layout</span><span class="tag">grid</span><span class="tag">flex</span><span class="tag">responsive</span><span class="tag">animation</span></div>`,
    starterCss: `#target { /* your code */ }\n.tag { padding: 4px 10px; background: #6366f1; color: white; border-radius: 999px; font-size: 12px; }`,
    solutionCss: `#target { display: flex; flex-wrap: wrap; gap: 8px; }\n.tag { padding: 4px 10px; background: #6366f1; color: white; border-radius: 999px; font-size: 12px; }`,
    explanation:
      "`flex-wrap: wrap` allows items to flow onto multiple lines when they run out of space. `gap` on flex works exactly like grid.",
    checks: [{ selector: "#target", prop: "flex-wrap", expected: "wrap" }],
  }),
  c({
    id: "sticky-footer",
    title: "Sticky footer",
    description: "Push the footer to the bottom of the stage regardless of content length.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><header>Header</header><main>Not much content.</main><footer>Footer</footer></div>`,
    starterCss: `#target { min-height: 250px; /* your code */ }\nheader, footer { background: #6366f1; color: white; padding: 10px; }\nmain { padding: 10px; }`,
    solutionCss: `#target { min-height: 250px; display: flex; flex-direction: column; }\nheader, footer { background: #6366f1; color: white; padding: 10px; }\nmain { padding: 10px; flex: 1; }`,
    explanation:
      "Column flex plus `flex: 1` on `main` makes it absorb all leftover space, pinning the footer to the bottom without absolute positioning.",
  }),

  // ============ POSITIONING ============
  c({
    id: "badge-corner",
    title: "Badge on a card corner",
    description: "Place the badge in the top-right corner of the card.",
    level: "Basic",
    category: "Positioning",
    html: `<div id="target"><div class="card">Card<span class="badge">NEW</span></div></div>`,
    starterCss: `.card { padding: 24px; background: #f1f5f9; border-radius: 8px; /* your code */ }\n.badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 999px; font-size: 10px; /* your code */ }`,
    solutionCss: `.card { padding: 24px; background: #f1f5f9; border-radius: 8px; position: relative; }\n.badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 999px; font-size: 10px; position: absolute; top: 8px; right: 8px; }`,
    explanation:
      "The card gets `position: relative` to become the positioning context. The badge gets `position: absolute` so its `top` and `right` anchor to the card, not the page.",
  }),
  c({
    id: "sticky-header",
    title: "Sticky section header",
    description: "Make the header stick to the top of the scroll area.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="target" style="max-height:180px;overflow:auto;"><header>Sticky</header><p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p></div>`,
    starterCss: `header { background: #6366f1; color: white; padding: 8px; /* your code */ }\np { padding: 8px; margin: 0; }`,
    solutionCss: `header { background: #6366f1; color: white; padding: 8px; position: sticky; top: 0; }\np { padding: 8px; margin: 0; }`,
    explanation:
      "`position: sticky` combined with `top: 0` pins the header to the top of its scrolling ancestor once the user scrolls past it, then releases at the parent's edge.",
  }),
  c({
    id: "overlay-modal",
    title: "Full-cover overlay",
    description: "Cover the entire stage with a translucent overlay pinned to all four edges.",
    level: "Basic",
    category: "Positioning",
    html: `<div id="target" style="position:relative;height:220px;background:#e2e8f0;"><div class="overlay">Overlay</div></div>`,
    starterCss: `.overlay { background: rgba(15, 23, 42, 0.7); color: white; padding: 12px; display: grid; place-items: center; /* your code */ }`,
    solutionCss: `.overlay { background: rgba(15, 23, 42, 0.7); color: white; padding: 12px; display: grid; place-items: center; position: absolute; inset: 0; }`,
    explanation:
      "`inset: 0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`. Combined with `position: absolute`, the element stretches to fill its positioned ancestor.",
  }),
  c({
    id: "z-index-fix",
    title: "Stack a menu above content",
    description: "The dropdown is being clipped by the row below. Make it appear on top.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="target"><div class="row"><div class="menu">Dropdown</div></div><div class="row bottom">Row below</div></div>`,
    starterCss: `#target { position: relative; }\n.row { padding: 12px; background: #f1f5f9; }\n.row.bottom { background: #cbd5e1; }\n.menu { padding: 8px; background: white; border: 1px solid #ccc; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* your code */ }`,
    solutionCss: `#target { position: relative; }\n.row { padding: 12px; background: #f1f5f9; position: relative; z-index: 1; }\n.row.bottom { background: #cbd5e1; position: relative; z-index: 0; }\n.menu { padding: 8px; background: white; border: 1px solid #ccc; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: absolute; z-index: 10; }`,
    explanation:
      "`z-index` only works on positioned elements. Add `position: relative` to the parent rows and give the menu a higher `z-index` so it sits above the bottom row.",
  }),

  // ============ TYPOGRAPHY ============
  c({
    id: "gradient-text",
    title: "Gradient text",
    description: "Fill the heading text with a linear gradient from indigo to cyan.",
    level: "Medium",
    category: "Typography",
    html: `<h1 id="target">Beautiful gradient text</h1>`,
    starterCss: `#target { font-size: 32px; font-weight: 800; /* your code */ }`,
    solutionCss: `#target { font-size: 32px; font-weight: 800; background: linear-gradient(90deg, #6366f1, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }`,
    explanation:
      "Paint a gradient as the background, clip it to the text with `background-clip: text`, then make the text transparent so the gradient shows through.",
  }),
  c({
    id: "truncate-1-line",
    title: "Truncate to a single line",
    description: "Cut the text at one line with an ellipsis.",
    level: "Basic",
    category: "Typography",
    html: `<div id="target">This paragraph should be cut off with an ellipsis if it does not fit.</div>`,
    starterCss: `#target { max-width: 240px; padding: 8px; background: #f1f5f9; /* your code */ }`,
    solutionCss: `#target { max-width: 240px; padding: 8px; background: #f1f5f9; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }`,
    explanation:
      "You need all three: `overflow: hidden` to hide overflow, `white-space: nowrap` to prevent wrapping, and `text-overflow: ellipsis` to add the three dots.",
  }),
  c({
    id: "clamp-2-lines",
    title: "Truncate to two lines",
    description: "Show at most two lines, then ellipsize.",
    level: "Medium",
    category: "Typography",
    html: `<div id="target">A longer paragraph with multiple sentences. It should be limited to two lines and then trail off with an ellipsis so the layout stays predictable.</div>`,
    starterCss: `#target { max-width: 240px; padding: 8px; background: #f1f5f9; /* your code */ }`,
    solutionCss: `#target { max-width: 240px; padding: 8px; background: #f1f5f9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`,
    explanation:
      "The old `-webkit-box` model with `-webkit-line-clamp` is the standard way to clamp multi-line text. Widely supported across modern browsers.",
  }),
  c({
    id: "fluid-heading",
    title: "Fluid heading with clamp()",
    description: "Make the heading size scale from 1.5rem to 3rem based on viewport width.",
    level: "Medium",
    category: "Typography",
    html: `<h1 id="target">Fluid title</h1>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { font-size: clamp(1.5rem, 2vw + 1rem, 3rem); }`,
    explanation:
      "`clamp(min, preferred, max)` scales the value with the viewport but never exceeds the bounds — fluid typography without media queries.",
  }),
  c({
    id: "small-caps",
    title: "Uppercase labels with tracking",
    description: "Style the label as small, uppercase, tracked, muted text.",
    level: "Basic",
    category: "Typography",
    html: `<div id="target">Section label</div>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #64748b; font-weight: 600; }`,
    explanation:
      "This is a very common heading treatment for section eyebrows and form field groups. `letter-spacing` in `em` scales with the font size.",
  }),

  // ============ ANIMATIONS ============
  c({
    id: "hover-lift",
    title: "Hover: lift and shadow",
    description: "On hover, translate the card up 4px and add a stronger shadow, both animated.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">Hover me</div>`,
    starterCss: `#target { padding: 24px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; cursor: pointer; /* your code */ }`,
    solutionCss: `#target { padding: 24px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; cursor: pointer; transition: transform 200ms ease, box-shadow 200ms ease; }\n#target:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.15); }`,
    explanation:
      "Animating `transform` and `box-shadow` produces a satisfying, GPU-accelerated hover. Always declare the `transition` on the base state so the animation runs in both directions.",
  }),
  c({
    id: "spin-loader",
    title: "Spinner animation",
    description: "Make the loader rotate continuously at 1 second per revolution.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target"></div>`,
    starterCss: `#target { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; /* your code */ }`,
    solutionCss: `#target { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }`,
    explanation:
      "A `@keyframes` block defines the animation; `animation` applies it. `linear` keeps the rotation smooth (no ease-in/out), and `infinite` loops it.",
  }),
  c({
    id: "fade-in",
    title: "Fade-in on load",
    description: "Fade the box in from opacity 0 to 1 over 500ms.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">Hello</div>`,
    starterCss: `#target { padding: 24px; background: #6366f1; color: white; text-align: center; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { padding: 24px; background: #6366f1; color: white; text-align: center; border-radius: 8px; animation: fadeIn 500ms ease forwards; opacity: 0; }\n@keyframes fadeIn { to { opacity: 1; } }`,
    explanation:
      "Start at `opacity: 0`, animate to 1 with `forwards` so the end state persists. `forwards` is essential — without it, the box snaps back to invisible.",
  }),
  c({
    id: "pulse-dot",
    title: "Pulsing dot",
    description: "Make a small dot pulse continuously to signal activity.",
    level: "Medium",
    category: "Animations",
    html: `<div id="target"></div>`,
    starterCss: `#target { width: 12px; height: 12px; border-radius: 50%; background: #10b981; /* your code */ }`,
    solutionCss: `#target { width: 12px; height: 12px; border-radius: 50%; background: #10b981; animation: pulse 1.5s ease-in-out infinite; }\n@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.5; } }`,
    explanation:
      "A three-stop keyframe gives smooth pulsing. Animating `transform: scale` and `opacity` keeps it cheap.",
  }),
  c({
    id: "button-shine",
    title: "Shiny button on hover",
    description: "Underline animates from 0 to 100% width on hover.",
    level: "Medium",
    category: "Animations",
    html: `<a id="target" href="#">Hover for underline</a>`,
    starterCss: `#target { font-weight: 600; color: #0f172a; text-decoration: none; position: relative; padding-bottom: 4px; /* your code */ }`,
    solutionCss: `#target { font-weight: 600; color: #0f172a; text-decoration: none; position: relative; padding-bottom: 4px; }\n#target::after { content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 100%; background: #6366f1; transform: scaleX(0); transform-origin: left; transition: transform 250ms ease; }\n#target:hover::after { transform: scaleX(1); }`,
    explanation:
      "Animate `scaleX` instead of `width` for smooth GPU-accelerated motion. `transform-origin: left` anchors the growth to the left side.",
  }),
  c({
    id: "bounce",
    title: "Bouncing arrow",
    description: "Move the arrow up and down repeatedly to hint at scrolling.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">↓</div>`,
    starterCss: `#target { font-size: 32px; text-align: center; /* your code */ }`,
    solutionCss: `#target { font-size: 32px; text-align: center; animation: bounce 1.2s ease-in-out infinite; }\n@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }`,
    explanation:
      "A two-stop keyframe with matching start/end states creates a smooth loop. `ease-in-out` gives the natural bounce feel.",
  }),

  // ============ RESPONSIVE ============
  c({
    id: "hide-on-mobile",
    title: "Hide element on small screens",
    description: "Hide `#target` on viewports narrower than 640px.",
    level: "Basic",
    category: "Responsive",
    html: `<div id="target">Desktop-only banner</div>`,
    starterCss: `#target { padding: 12px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }\n/* your code */`,
    solutionCss: `#target { padding: 12px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }\n@media (max-width: 640px) { #target { display: none; } }`,
    explanation:
      "A max-width media query targets small screens. Prefer min-width (mobile-first) in production, but max-width is fine for hiding a small number of desktop-only elements.",
  }),
  c({
    id: "stack-on-mobile",
    title: "Stack columns on mobile",
    description: "Show two columns side by side on ≥ 768px, stacked vertically below.",
    level: "Medium",
    category: "Responsive",
    html: `<div id="target"><div class="col">A</div><div class="col">B</div></div>`,
    starterCss: `#target { display: flex; flex-direction: column; gap: 12px; }\n.col { padding: 20px; background: #6366f1; color: white; border-radius: 8px; flex: 1; }\n/* your code */`,
    solutionCss: `#target { display: flex; flex-direction: column; gap: 12px; }\n.col { padding: 20px; background: #6366f1; color: white; border-radius: 8px; flex: 1; }\n@media (min-width: 768px) { #target { flex-direction: row; } }`,
    explanation:
      "Mobile-first: default to a stacked column layout, then flip to a row above the breakpoint. This is the safest pattern for responsive layouts.",
  }),
  c({
    id: "responsive-image",
    title: "Full-width responsive image",
    description: "Make the image fill the container width without exceeding its natural size.",
    level: "Basic",
    category: "Responsive",
    html: `<img id="target" src="https://picsum.photos/800/300" alt="demo">`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { max-width: 100%; height: auto; display: block; }`,
    explanation:
      "`max-width: 100%` prevents overflow, `height: auto` preserves aspect ratio, and `display: block` avoids the default inline whitespace under the image.",
  }),
  c({
    id: "aspect-ratio-video",
    title: "16:9 video container",
    description: "Lock the box to a 16:9 aspect ratio at any width.",
    level: "Basic",
    category: "Responsive",
    html: `<div id="target">16:9</div>`,
    starterCss: `#target { width: 100%; background: #6366f1; color: white; display: grid; place-items: center; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { width: 100%; background: #6366f1; color: white; display: grid; place-items: center; border-radius: 8px; aspect-ratio: 16 / 9; }`,
    explanation:
      "`aspect-ratio` locks width-to-height. It replaces the old padding-hack for responsive video and image wrappers.",
  }),

  // ============ VISUAL EFFECTS ============
  c({
    id: "linear-gradient-bg",
    title: "Diagonal gradient background",
    description: "Fill the box with a diagonal gradient from indigo to pink.",
    level: "Basic",
    category: "Visual Effects",
    html: `<div id="target"></div>`,
    starterCss: `#target { height: 160px; border-radius: 12px; /* your code */ }`,
    solutionCss: `#target { height: 160px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #ec4899); }`,
    explanation:
      "The angle `135deg` runs from top-left to bottom-right. Adding more color stops or angles unlocks richer gradients.",
  }),
  c({
    id: "soft-shadow",
    title: "Soft elevated shadow",
    description: "Add a soft, spread-out shadow that suggests a floating card.",
    level: "Basic",
    category: "Visual Effects",
    html: `<div id="target">Elevated</div>`,
    starterCss: `#target { padding: 24px; background: white; border-radius: 12px; text-align: center; /* your code */ }`,
    solutionCss: `#target { padding: 24px; background: white; border-radius: 12px; text-align: center; box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.25); }`,
    explanation:
      "A large blur, negative spread, and low opacity produce a soft, natural shadow rather than a hard drop shadow.",
  }),
  c({
    id: "glass-card",
    title: "Glassmorphism card",
    description: "Make the card look like frosted glass over its background.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target" style="height:200px;background:linear-gradient(135deg,#6366f1,#22d3ee);display:grid;place-items:center;border-radius:12px;padding:24px;"><div class="glass">Glass</div></div>`,
    starterCss: `.glass { padding: 24px 32px; border-radius: 12px; color: white; font-weight: 600; /* your code */ }`,
    solutionCss: `.glass { padding: 24px 32px; border-radius: 12px; color: white; font-weight: 600; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.3); }`,
    explanation:
      "The frosted-glass effect: a translucent background, `backdrop-filter` to blur what's behind, and a subtle border to catch light.",
  }),
  c({
    id: "neumorphic",
    title: "Neumorphic button",
    description: "Make the button look extruded from the surface with a soft dual shadow.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div style="background:#e0e5ec;padding:40px;border-radius:12px;display:grid;place-items:center;"><button id="target">Press</button></div>`,
    starterCss: `#target { padding: 14px 28px; border: none; border-radius: 12px; background: #e0e5ec; font-weight: 600; cursor: pointer; /* your code */ }`,
    solutionCss: `#target { padding: 14px 28px; border: none; border-radius: 12px; background: #e0e5ec; font-weight: 600; cursor: pointer; box-shadow: 6px 6px 12px #bec3c9, -6px -6px 12px #ffffff; }`,
    explanation:
      "Two opposing shadows — dark bottom-right and white top-left — create the illusion of a raised surface above a matching background.",
  }),
  c({
    id: "conic-gradient",
    title: "Conic gradient chart",
    description: "Create a pie-chart-like circle with three colored segments.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target"></div>`,
    starterCss: `#target { width: 140px; height: 140px; border-radius: 50%; /* your code */ }`,
    solutionCss: `#target { width: 140px; height: 140px; border-radius: 50%; background: conic-gradient(#6366f1 0 40%, #22d3ee 0 70%, #ec4899 0 100%); }`,
    explanation:
      "`conic-gradient` sweeps color around a center point. Setting `<start> <end>%` per stop draws crisp pie slices.",
  }),
  c({
    id: "text-shadow-glow",
    title: "Neon glow text",
    description: "Make the text glow like a neon sign.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target" style="background:#0f172a;padding:24px;border-radius:12px;text-align:center;"><span class="glow">NEON</span></div>`,
    starterCss: `.glow { color: #22d3ee; font-size: 32px; font-weight: 800; letter-spacing: 0.1em; /* your code */ }`,
    solutionCss: `.glow { color: #22d3ee; font-size: 32px; font-weight: 800; letter-spacing: 0.1em; text-shadow: 0 0 8px #22d3ee, 0 0 16px #22d3ee, 0 0 32px rgba(34, 211, 238, 0.6); }`,
    explanation:
      "Stack multiple `text-shadow` layers of the same color at increasing blur radii to build up a soft glow.",
  }),
  c({
    id: "clip-path-shape",
    title: "Diagonal-cut section",
    description: "Use `clip-path` to cut the bottom of the banner into a diagonal.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="target">Banner</div>`,
    starterCss: `#target { height: 140px; background: linear-gradient(135deg,#6366f1,#22d3ee); color: white; display: grid; place-items: center; font-weight: 700; /* your code */ }`,
    solutionCss: `#target { height: 140px; background: linear-gradient(135deg,#6366f1,#22d3ee); color: white; display: grid; place-items: center; font-weight: 700; clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%); }`,
    explanation:
      "`polygon()` takes vertex coordinates. Dropping the bottom-right corner higher than the bottom-left produces a diagonal slice.",
  }),
  c({
    id: "backdrop-tint",
    title: "Tinted overlay",
    description: "Overlay the image with a semi-transparent indigo tint.",
    level: "Basic",
    category: "Visual Effects",
    html: `<div id="target" style="position:relative;height:160px;background:url('https://picsum.photos/600/300') center/cover;border-radius:12px;overflow:hidden;"><div class="tint"></div></div>`,
    starterCss: `.tint { /* your code */ }`,
    solutionCss: `.tint { position: absolute; inset: 0; background: rgba(99, 102, 241, 0.5); }`,
    explanation:
      "An absolutely positioned layer with `inset: 0` fills the parent. A translucent background creates the tint.",
  }),
  c({
    id: "invert-filter",
    title: "Grayscale on hover, color on default",
    description: "Make the image color on default and grayscale on hover with a smooth transition.",
    level: "Medium",
    category: "Visual Effects",
    html: `<img id="target" src="https://picsum.photos/id/1015/300/200" alt="demo">`,
    starterCss: `#target { width: 300px; border-radius: 8px; display: block; /* your code */ }`,
    solutionCss: `#target { width: 300px; border-radius: 8px; display: block; transition: filter 300ms ease; }\n#target:hover { filter: grayscale(1); }`,
    explanation:
      "The `filter: grayscale(1)` desaturates the image. Transitioning `filter` produces a smooth crossfade between the two states.",
  }),

  // ============ SELECTORS ============
  c({
    id: "first-child-style",
    title: "Style the first list item",
    description: "Make only the first `<li>` bold.",
    level: "Basic",
    category: "Selectors",
    html: `<ul id="target"><li>One</li><li>Two</li><li>Three</li></ul>`,
    starterCss: `#target { padding-left: 20px; }\n/* your code */`,
    solutionCss: `#target { padding-left: 20px; }\n#target li:first-child { font-weight: 700; }`,
    explanation:
      "`:first-child` matches when the element is the first child of its parent. Cleaner than adding a `.first` class.",
  }),
  c({
    id: "nth-alternate",
    title: "Alternate row shading",
    description: "Give every other row a light background (zebra striping).",
    level: "Basic",
    category: "Selectors",
    html: `<ul id="target"><li>Row 1</li><li>Row 2</li><li>Row 3</li><li>Row 4</li><li>Row 5</li></ul>`,
    starterCss: `#target { list-style: none; padding: 0; }\n#target li { padding: 8px 12px; }\n/* your code */`,
    solutionCss: `#target { list-style: none; padding: 0; }\n#target li { padding: 8px 12px; }\n#target li:nth-child(even) { background: #f1f5f9; }`,
    explanation:
      "`:nth-child(even)` matches every second sibling. `odd`, formulas like `3n+1`, and `nth-of-type` variants unlock more advanced patterns.",
  }),
  c({
    id: "attr-selector",
    title: "Style external links",
    description: "Add a small arrow after any link whose href starts with `https://`.",
    level: "Medium",
    category: "Selectors",
    html: `<div id="target"><a href="/internal">Internal</a><br><a href="https://example.com">External</a></div>`,
    starterCss: `#target a { color: #6366f1; margin-right: 8px; }\n/* your code */`,
    solutionCss: `#target a { color: #6366f1; margin-right: 8px; }\n#target a[href^="https://"]::after { content: ' ↗'; font-size: 0.8em; }`,
    explanation:
      "`[attr^=value]` matches when the attribute starts with the value. Combined with `::after`, you can annotate external links without adding classes.",
  }),
  c({
    id: "has-selector",
    title: "Highlight cards containing an image",
    description: "Give a colored border to any card that has an `<img>` child.",
    level: "Advanced",
    category: "Selectors",
    html: `<div id="target"><div class="card"><img src="https://picsum.photos/80/40" alt=""></div><div class="card">No image</div></div>`,
    starterCss: `#target { display: flex; gap: 12px; }\n.card { padding: 12px; border-radius: 8px; background: #f1f5f9; }\n/* your code */`,
    solutionCss: `#target { display: flex; gap: 12px; }\n.card { padding: 12px; border-radius: 8px; background: #f1f5f9; }\n.card:has(img) { border: 2px solid #6366f1; }`,
    explanation:
      "`:has()` is the parent selector: `.card:has(img)` matches any card that contains an image, no JS required.",
  }),
  c({
    id: "focus-within",
    title: "Highlight the row containing focused input",
    description: "Change the row's background when its input is focused.",
    level: "Medium",
    category: "Selectors",
    html: `<label id="target"><span>Email</span><input type="email"></label>`,
    starterCss: `#target { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 8px; background: #f8fafc; /* your code */ }\n#target input { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; }`,
    solutionCss: `#target { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 8px; background: #f8fafc; transition: background 150ms ease; }\n#target:focus-within { background: #e0e7ff; }\n#target input { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; }`,
    explanation:
      "`:focus-within` matches when the element or any of its descendants has focus. Great for highlighting form rows or dropdown containers.",
  }),
  c({
    id: "not-last-divider",
    title: "Divider between rows (not after last)",
    description: "Draw a bottom border on every list item except the last.",
    level: "Medium",
    category: "Selectors",
    html: `<ul id="target"><li>One</li><li>Two</li><li>Three</li></ul>`,
    starterCss: `#target { list-style: none; padding: 0; }\n#target li { padding: 10px 0; }\n/* your code */`,
    solutionCss: `#target { list-style: none; padding: 0; }\n#target li { padding: 10px 0; }\n#target li:not(:last-child) { border-bottom: 1px solid #e2e8f0; }`,
    explanation:
      "`:not(:last-child)` skips the last item, avoiding a trailing border. Cleaner than setting the border on all and then removing it from the last.",
  }),

  // Extra fillers
  c({
    id: "toggle-checkbox",
    title: "Custom checkbox with :checked",
    description: "Style a checkbox: light when unchecked, indigo with a check when checked.",
    level: "Advanced",
    category: "Selectors",
    html: `<label id="target"><input type="checkbox"><span class="box"></span>Accept</label>`,
    starterCss: `#target { display: inline-flex; gap: 8px; align-items: center; cursor: pointer; }\n#target input { position: absolute; opacity: 0; pointer-events: none; }\n.box { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 4px; display: grid; place-items: center; /* your code */ }`,
    solutionCss: `#target { display: inline-flex; gap: 8px; align-items: center; cursor: pointer; }\n#target input { position: absolute; opacity: 0; pointer-events: none; }\n.box { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 4px; display: grid; place-items: center; transition: all 150ms; }\n#target input:checked + .box { background: #6366f1; border-color: #6366f1; }\n#target input:checked + .box::after { content: '✓'; color: white; font-size: 12px; font-weight: bold; }`,
    explanation:
      "Hide the native checkbox visually but keep it accessible. Use `:checked + .box` (adjacent sibling) to style the custom UI when the input is checked.",
  }),
  c({
    id: "grid-auto-flow",
    title: "Featured card spans 2 columns",
    description: "In a 3-column grid, make the first card span 2 columns and 2 rows.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="card feat">Featured</div><div class="card">2</div><div class="card">3</div><div class="card">4</div><div class="card">5</div></div>`,
    starterCss: `#target { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n.card { padding: 20px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }\n.feat { background: #ec4899; /* your code */ }`,
    solutionCss: `#target { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n.card { padding: 20px; background: #6366f1; color: white; border-radius: 8px; text-align: center; }\n.feat { background: #ec4899; grid-column: span 2; grid-row: span 2; }`,
    explanation:
      "`span 2` in grid-column/grid-row expands the item across 2 tracks. Other items flow around it automatically.",
  }),
  c({
    id: "flexbox-order",
    title: "Reorder items visually",
    description: "Show the third box first without changing the HTML order.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="box">1</div><div class="box">2</div><div class="box a">3</div></div>`,
    starterCss: `#target { display: flex; gap: 8px; }\n.box { padding: 16px; background: #6366f1; color: white; border-radius: 8px; flex: 1; text-align: center; }\n/* your code */`,
    solutionCss: `#target { display: flex; gap: 8px; }\n.box { padding: 16px; background: #6366f1; color: white; border-radius: 8px; flex: 1; text-align: center; }\n.a { order: -1; }`,
    explanation:
      "`order` changes the visual position without altering DOM order. Note: this can confuse screen readers, so use sparingly and only for visual reordering.",
  }),
  c({
    id: "hover-shift",
    title: "Image hover zoom",
    description: "Zoom the image slightly on hover, clipping any overflow.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target"><img src="https://picsum.photos/id/1025/300/180" alt=""></div>`,
    starterCss: `#target { width: 300px; height: 180px; overflow: hidden; border-radius: 12px; }\n#target img { width: 100%; height: 100%; object-fit: cover; display: block; /* your code */ }`,
    solutionCss: `#target { width: 300px; height: 180px; overflow: hidden; border-radius: 12px; }\n#target img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 400ms ease; }\n#target:hover img { transform: scale(1.08); }`,
    explanation:
      "The parent hides overflow so the image can scale beyond its box. Animating `transform` keeps the effect smooth.",
  }),
  c({
    id: "container-query",
    title: "Component-driven layout with container queries",
    description: "Switch the card to a two-column layout when its own width is ≥ 320px.",
    level: "Advanced",
    category: "Responsive",
    html: `<div id="wrap" style="resize:horizontal;overflow:auto;width:360px;border:1px dashed #cbd5e1;padding:8px;"><div id="target"><img src="https://picsum.photos/120/120" alt=""><div>Card body with a title and description.</div></div></div>`,
    starterCss: `#wrap { /* your code */ }\n#target { background: #f1f5f9; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }\n#target img { width: 100%; border-radius: 6px; }`,
    solutionCss: `#wrap { container-type: inline-size; }\n#target { background: #f1f5f9; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }\n#target img { width: 100%; border-radius: 6px; }\n@container (min-width: 320px) { #target { flex-direction: row; align-items: center; } #target img { width: 120px; } }`,
    explanation:
      "`container-type: inline-size` on the parent enables `@container` queries scoped to that element's width. Resize the outer box to see the layout adapt.",
  }),
  c({
    id: "custom-scrollbar",
    title: "Style the scrollbar",
    description: "Make the scrollbar thin and indigo (WebKit browsers).",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target"><p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p></div>`,
    starterCss: `#target { height: 150px; overflow-y: auto; padding: 8px; background: #f8fafc; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { height: 150px; overflow-y: auto; padding: 8px; background: #f8fafc; border-radius: 8px; scrollbar-width: thin; scrollbar-color: #6366f1 #e2e8f0; }\n#target::-webkit-scrollbar { width: 8px; }\n#target::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }\n#target::-webkit-scrollbar-track { background: #e2e8f0; }`,
    explanation:
      "Use the standard `scrollbar-width` and `scrollbar-color` for Firefox and modern Chrome, plus `::-webkit-scrollbar` pseudo-elements for older WebKit-based browsers.",
  }),
  c({
    id: "radial-gradient",
    title: "Spotlight radial gradient",
    description: "Create a spotlight effect that fades from center to edges.",
    level: "Basic",
    category: "Visual Effects",
    html: `<div id="target">Spotlight</div>`,
    starterCss: `#target { height: 160px; color: white; display: grid; place-items: center; border-radius: 12px; /* your code */ }`,
    solutionCss: `#target { height: 160px; color: white; display: grid; place-items: center; border-radius: 12px; background: radial-gradient(circle at center, #6366f1, #0f172a 70%); }`,
    explanation:
      "`radial-gradient()` produces circular or elliptical gradients. `circle at center` gives a symmetric spotlight; move `at 30% 40%` for off-center effects.",
  }),
  c({
    id: "text-columns",
    title: "Multi-column text",
    description: "Split the paragraph into 2 columns with a 24px gap.",
    level: "Medium",
    category: "Typography",
    html: `<p id="target">Multi-column layout can turn long-form text into a magazine-style flow. CSS handles balancing and hyphenation automatically. Try it on articles, sidebars, or dense reference material where a single column would feel overwhelming.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { column-count: 2; column-gap: 24px; }`,
    explanation:
      "`column-count` splits text across N columns, `column-gap` sets the gutter. Use `column-rule` for a divider between columns.",
  }),
  c({
    id: "flex-column",
    title: "Flex column stack",
    description: "Stack three cards vertically with a 12px gap.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><div class="c">A</div><div class="c">B</div><div class="c">C</div></div>`,
    starterCss: `#target { /* your code */ }
.c { padding: 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    solutionCss: `#target { display: flex; flex-direction: column; gap: 12px; }
.c { padding: 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    explanation:
      "`flex-direction: column` switches the main axis to vertical. `gap` spaces items evenly without margins.",
    checks: [
      { selector: "#target", prop: "display", expected: "flex" },
      { selector: "#target", prop: "flex-direction", expected: "column" },
      { selector: "#target", prop: "gap", expected: "12px" },
    ],
  }),
  c({
    id: "two-col-sidebar",
    title: "200px sidebar + fluid main",
    description:
      "Build a two-column layout with a 200px sidebar and a main region that fills the rest.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><aside>Nav</aside><main>Content</main></div>`,
    starterCss: `#target { /* your code */ }
aside { background: #6366f1; color: white; padding: 12px; }
main { background: #f1f5f9; padding: 12px; }`,
    solutionCss: `#target { display: grid; grid-template-columns: 200px 1fr; gap: 12px; }
aside { background: #6366f1; color: white; padding: 12px; }
main { background: #f1f5f9; padding: 12px; }`,
    explanation:
      "`grid-template-columns: 200px 1fr` fixes the first column and gives the remaining space to the second.",
    checks: [
      { selector: "#target", prop: "display", expected: "grid" },
      { selector: "#target", prop: "grid-template-columns", expected: "200px 1fr" },
    ],
  }),
  c({
    id: "center-abs",
    title: "Absolute-center a box",
    description: "Center `#target` in `#stage` using `position: absolute` and `transform`.",
    level: "Medium",
    category: "Layout",
    html: `<div id="stage"><div id="target">Centered</div></div>`,
    starterCss: `#stage { position: relative; height: 200px; background: #f1f5f9; }
#target { padding: 12px 20px; background: #10b981; color: white; border-radius: 8px; /* your code */ }`,
    solutionCss: `#stage { position: relative; height: 200px; background: #f1f5f9; }
#target { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 12px 20px; background: #10b981; color: white; border-radius: 8px; }`,
    explanation:
      "50%/50% aligns the element's top-left corner to the center. `translate(-50%, -50%)` shifts it back by half its own size, centering it exactly.",
  }),
  c({
    id: "grid-12",
    title: "12-column grid",
    description: "Turn `#target` into a 12-column grid with a 16px gap.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><div class="cell">1</div><div class="cell">2</div><div class="cell">3</div></div>`,
    starterCss: `#target { /* your code */ }
.cell { grid-column: span 4; padding: 16px; background: #6366f1; color: white; text-align: center; border-radius: 6px; }`,
    solutionCss: `#target { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
.cell { grid-column: span 4; padding: 16px; background: #6366f1; color: white; text-align: center; border-radius: 6px; }`,
    explanation:
      "`repeat(12, 1fr)` creates twelve equal tracks. Children opt into widths with `grid-column: span N`.",
    checks: [
      { selector: "#target", prop: "display", expected: "grid" },
      { selector: "#target", prop: "grid-template-columns", expected: "repeat(12, 1fr)" },
    ],
  }),
  c({
    id: "masonry-columns",
    title: "Masonry with CSS columns",
    description: "Split the items into a 3-column masonry layout using `column-count`.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="i" style="height:60px">1</div><div class="i" style="height:100px">2</div><div class="i" style="height:40px">3</div><div class="i" style="height:80px">4</div><div class="i" style="height:120px">5</div></div>`,
    starterCss: `#target { /* your code */ }
.i { background: #6366f1; color: white; margin: 0 0 8px; padding: 8px; border-radius: 6px; break-inside: avoid; }`,
    solutionCss: `#target { column-count: 3; column-gap: 8px; }
.i { background: #6366f1; color: white; margin: 0 0 8px; padding: 8px; border-radius: 6px; break-inside: avoid; }`,
    explanation:
      "`column-count` flows items into columns like a newspaper. `break-inside: avoid` stops an item from splitting across two columns.",
  }),
  c({
    id: "center-margin-auto",
    title: "Center a fixed-width block",
    description: "Center `#target` horizontally inside `#stage` with `margin: auto`.",
    level: "Basic",
    category: "Layout",
    html: `<div id="stage"><div id="target">Boxed</div></div>`,
    starterCss: `#stage { background: #f1f5f9; padding: 12px; }
#target { width: 200px; padding: 12px; background: #6366f1; color: white; border-radius: 6px; /* your code */ }`,
    solutionCss: `#stage { background: #f1f5f9; padding: 12px; }
#target { width: 200px; padding: 12px; background: #6366f1; color: white; border-radius: 6px; margin: 0 auto; }`,
    explanation:
      "`margin: 0 auto` distributes remaining horizontal space equally to both sides, centering a block with an explicit width.",
  }),
  c({
    id: "flex-1-2-1",
    title: "1fr/2fr/1fr flex row",
    description: "Create three flex items where the middle one is twice as wide.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="x a">A</div><div class="x b">B</div><div class="x c">C</div></div>`,
    starterCss: `#target { display: flex; gap: 8px; }
.x { padding: 12px; color: white; text-align: center; border-radius: 6px; }
.a { background: #6366f1; /* code */ }
.b { background: #10b981; /* code */ }
.c { background: #f97316; /* code */ }`,
    solutionCss: `#target { display: flex; gap: 8px; }
.x { padding: 12px; color: white; text-align: center; border-radius: 6px; }
.a { background: #6366f1; flex: 1; }
.b { background: #10b981; flex: 2; }
.c { background: #f97316; flex: 1; }`,
    explanation:
      "`flex: 1` and `flex: 2` distribute leftover space in a 1:2:1 ratio without setting explicit widths.",
  }),
  c({
    id: "min-content-nav",
    title: "Nav that wraps at min-content",
    description:
      "Make `#target` a flex container whose items shrink but never below their content size.",
    level: "Advanced",
    category: "Layout",
    html: `<nav id="target"><a>Home</a><a>Documentation</a><a>Pricing</a></nav>`,
    starterCss: `#target { display: flex; gap: 12px; }
a { padding: 6px 10px; background: #6366f1; color: white; border-radius: 6px; /* your code */ }`,
    solutionCss: `#target { display: flex; gap: 12px; flex-wrap: wrap; }
a { padding: 6px 10px; background: #6366f1; color: white; border-radius: 6px; min-width: min-content; }`,
    explanation:
      "`flex-wrap: wrap` allows overflow to move onto a new line. `min-width: min-content` prevents items from shrinking smaller than their text.",
  }),
  c({
    id: "grid-named-lines",
    title: "Grid named line placement",
    description: "Place `#target` between the lines named `main-start` and `main-end`.",
    level: "Advanced",
    category: "Layout",
    html: `<div id="stage"><div id="target">Main</div></div>`,
    starterCss: `#stage { display: grid; grid-template-columns: [side-start] 80px [main-start] 1fr [main-end]; gap: 8px; background: #f1f5f9; padding: 8px; }
#target { background: #6366f1; color: white; padding: 12px; border-radius: 6px; /* your code */ }`,
    solutionCss: `#stage { display: grid; grid-template-columns: [side-start] 80px [main-start] 1fr [main-end]; gap: 8px; background: #f1f5f9; padding: 8px; }
#target { background: #6366f1; color: white; padding: 12px; border-radius: 6px; grid-column: main-start / main-end; }`,
    explanation:
      "Named lines make grid placement self-documenting. `grid-column: a / b` places the item between those lines.",
  }),
  c({
    id: "grid-dense",
    title: "Grid `dense` packing",
    description: "Enable `dense` packing so smaller items backfill gaps.",
    level: "Advanced",
    category: "Layout",
    html: `<div id="target"><div class="a">A</div><div class="b">B</div><div class="c">C</div><div class="d">D</div></div>`,
    starterCss: `#target { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; /* your code */ }
.a, .b, .c, .d { padding: 12px; background: #6366f1; color: white; text-align: center; border-radius: 6px; }
.b { grid-column: span 2; }`,
    solutionCss: `#target { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; grid-auto-flow: row dense; }
.a, .b, .c, .d { padding: 12px; background: #6366f1; color: white; text-align: center; border-radius: 6px; }
.b { grid-column: span 2; }`,
    explanation:
      "`grid-auto-flow: dense` lets later items fill earlier holes, at the cost of visual order.",
    checks: [{ selector: "#target", prop: "grid-auto-flow", expected: "dense" }],
  }),
  c({
    id: "place-content",
    title: "Distribute rows with place-content",
    description: "Center content vertically and space rows with `place-content`.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="r">Row A</div><div class="r">Row B</div></div>`,
    starterCss: `#target { display: grid; height: 200px; background: #f1f5f9; /* your code */ }
.r { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    solutionCss: `#target { display: grid; height: 200px; background: #f1f5f9; place-content: center; gap: 8px; }
.r { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    explanation:
      "`place-content` is shorthand for `align-content` + `justify-content`, controlling the whole track group at once.",
  }),
  c({
    id: "aspect-square-card",
    title: "Square card with aspect-ratio",
    description: "Give `#target` a perfect 1:1 aspect ratio.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target">Square</div>`,
    starterCss: `#target { width: 50%; background: #6366f1; color: white; display: grid; place-items: center; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { width: 50%; background: #6366f1; color: white; display: grid; place-items: center; border-radius: 8px; aspect-ratio: 1 / 1; }`,
    explanation:
      "`aspect-ratio` sets height automatically from width, keeping the box perfectly square as the container resizes.",
    checks: [{ selector: "#target", prop: "aspect-ratio", expected: "1 / 1" }],
  }),
  c({
    id: "gap-column",
    title: "Flex column gap",
    description: "Add vertical spacing between wrapped rows.",
    level: "Basic",
    category: "Layout",
    html: `<div id="target"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span></div>`,
    starterCss: `#target { display: flex; flex-wrap: wrap; width: 140px; /* your code */ }
span { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    solutionCss: `#target { display: flex; flex-wrap: wrap; width: 140px; gap: 8px; }
span { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    explanation:
      "`gap` on flex containers spaces items both along and across the axis when they wrap, without collapsing margins.",
    checks: [{ selector: "#target", prop: "gap", expected: "8px" }],
  }),
  c({
    id: "justify-self-item",
    title: "Grid item horizontal align",
    description: "Push `#target` to the right of its grid cell using `justify-self`.",
    level: "Medium",
    category: "Layout",
    html: `<div id="stage"><div id="target">Right</div></div>`,
    starterCss: `#stage { display: grid; grid-template-columns: 1fr; background: #f1f5f9; padding: 12px; }
#target { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; /* your code */ }`,
    solutionCss: `#stage { display: grid; grid-template-columns: 1fr; background: #f1f5f9; padding: 12px; }
#target { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; justify-self: end; }`,
    explanation:
      "`justify-self` positions a single grid item along the row axis without affecting siblings.",
    checks: [{ selector: "#target", prop: "justify-self", expected: "end" }],
  }),
  c({
    id: "align-baseline",
    title: "Baseline-align mixed sizes",
    description: "Align items of different font sizes to a common text baseline.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><span class="big">42</span><span class="small">%</span></div>`,
    starterCss: `#target { display: flex; gap: 4px; background: #f1f5f9; padding: 12px; /* your code */ }
.big { font-size: 32px; font-weight: 700; }
.small { font-size: 14px; color: #64748b; }`,
    solutionCss: `#target { display: flex; gap: 4px; background: #f1f5f9; padding: 12px; align-items: baseline; }
.big { font-size: 32px; font-weight: 700; }
.small { font-size: 14px; color: #64748b; }`,
    explanation:
      "`align-items: baseline` snaps items to their text baseline instead of the box edges — ideal when mixing large numbers with unit labels.",
    checks: [{ selector: "#target", prop: "align-items", expected: "baseline" }],
  }),
  c({
    id: "order-reverse",
    title: "Reverse row visually",
    description: "Reverse the visual order of `#target`'s items without changing HTML.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div>1</div><div>2</div><div>3</div></div>`,
    starterCss: `#target { display: flex; gap: 8px; /* your code */ }
#target > div { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    solutionCss: `#target { display: flex; gap: 8px; flex-direction: row-reverse; }
#target > div { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; }`,
    explanation:
      "`flex-direction: row-reverse` mirrors the main axis. Use `order` for one-off overrides on individual items.",
    checks: [{ selector: "#target", prop: "flex-direction", expected: "row-reverse" }],
  }),
  c({
    id: "full-bleed",
    title: "Full-bleed section inside container",
    description:
      "Break `#target` out of its padded container to span the full width using negative margins.",
    level: "Advanced",
    category: "Layout",
    html: `<div id="container"><p>Above</p><div id="target">Full bleed</div><p>Below</p></div>`,
    starterCss: `#container { width: 300px; padding: 0 32px; background: #f1f5f9; }
#target { padding: 16px; background: #6366f1; color: white; text-align: center; /* your code */ }`,
    solutionCss: `#container { width: 300px; padding: 0 32px; background: #f1f5f9; }
#target { padding: 16px; background: #6366f1; color: white; text-align: center; margin-inline: -32px; }`,
    explanation:
      "Negative margins equal to the parent's padding pull the element outward to touch the container edges.",
  }),
  c({
    id: "nested-grid",
    title: "Nested grid card list",
    description: "Nest a 2-column grid inside a card and center each cell.",
    level: "Medium",
    category: "Layout",
    html: `<div id="target"><div class="cell">1</div><div class="cell">2</div><div class="cell">3</div><div class="cell">4</div></div>`,
    starterCss: `#target { padding: 12px; background: #f1f5f9; border-radius: 8px; /* your code */ }
.cell { padding: 12px; background: #6366f1; color: white; border-radius: 6px; text-align: center; }`,
    solutionCss: `#target { padding: 12px; background: #f1f5f9; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cell { padding: 12px; background: #6366f1; color: white; border-radius: 6px; text-align: center; }`,
    explanation:
      "Grids nest freely — a `display: grid` element remains a normal block for its parent while defining a new grid formatting context for its children.",
  }),
  c({
    id: "tooltip-arrow",
    title: "Tooltip with CSS arrow",
    description: "Add a downward-pointing arrow below `#target` using a `::after` pseudo-element.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="stage"><span id="target">Save</span></div>`,
    starterCss: `#stage { padding: 40px; background: #f1f5f9; text-align: center; }
#target { position: relative; display: inline-block; padding: 6px 12px; background: #0f172a; color: white; border-radius: 4px; /* your code */ }`,
    solutionCss: `#stage { padding: 40px; background: #f1f5f9; text-align: center; }
#target { position: relative; display: inline-block; padding: 6px 12px; background: #0f172a; color: white; border-radius: 4px; }
#target::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: #0f172a; }`,
    explanation:
      "Transparent borders on a zero-sized element create triangular shapes. Positioning it just below the tooltip yields a classic arrow.",
  }),
  c({
    id: "fixed-fab",
    title: "Fixed floating action button",
    description: "Pin `#target` to the bottom-right of the viewport, 16px from each edge.",
    level: "Basic",
    category: "Positioning",
    html: `<div id="target">+</div>`,
    starterCss: `#target { width: 48px; height: 48px; border-radius: 50%; background: #6366f1; color: white; display: grid; place-items: center; font-size: 24px; /* your code */ }`,
    solutionCss: `#target { width: 48px; height: 48px; border-radius: 50%; background: #6366f1; color: white; display: grid; place-items: center; font-size: 24px; position: fixed; right: 16px; bottom: 16px; }`,
    explanation:
      "`position: fixed` anchors the element to the viewport. It stays put while the page scrolls beneath it.",
    checks: [{ selector: "#target", prop: "position", expected: "fixed" }],
  }),
  c({
    id: "z-stack-modal",
    title: "Modal above overlay",
    description: "Ensure `#target` sits above the overlay by using `z-index`.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="stage"><div class="overlay"></div><div id="target">Modal</div></div>`,
    starterCss: `#stage { position: relative; height: 200px; background: #f1f5f9; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
#target { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: white; border-radius: 8px; /* your code */ }`,
    solutionCss: `#stage { position: relative; height: 200px; background: #f1f5f9; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
#target { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: white; border-radius: 8px; z-index: 2; }`,
    explanation:
      "`z-index` only takes effect on positioned elements. Higher values paint on top within the same stacking context.",
  }),
  c({
    id: "sticky-sidebar",
    title: "Sticky sidebar section",
    description: "Make `#target` stick 16px from the top as its parent scrolls.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="stage"><aside id="target">Sticky</aside><div style="height:400px;background:#f1f5f9;padding:12px">Long content...</div></div>`,
    starterCss: `#stage { display: grid; grid-template-columns: 100px 1fr; gap: 12px; height: 200px; overflow: auto; }
#target { padding: 12px; background: #6366f1; color: white; border-radius: 6px; /* your code */ }`,
    solutionCss: `#stage { display: grid; grid-template-columns: 100px 1fr; gap: 12px; height: 200px; overflow: auto; }
#target { padding: 12px; background: #6366f1; color: white; border-radius: 6px; position: sticky; top: 16px; }`,
    explanation:
      "`position: sticky` needs a threshold (`top: 16px`) and a scrollable ancestor with enough height for scrolling to occur.",
  }),
  c({
    id: "inset-shorthand",
    title: "Inset shorthand fill",
    description: "Cover `#stage` with `#target` using the `inset` shorthand.",
    level: "Basic",
    category: "Positioning",
    html: `<div id="stage"><div id="target"></div></div>`,
    starterCss: `#stage { position: relative; height: 120px; background: #f1f5f9; }
#target { background: #6366f1; opacity: 0.7; /* your code */ }`,
    solutionCss: `#stage { position: relative; height: 120px; background: #f1f5f9; }
#target { background: #6366f1; opacity: 0.7; position: absolute; inset: 0; }`,
    explanation:
      "`inset: 0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`, stretching an absolutely positioned element to fill its containing block.",
    checks: [
      { selector: "#target", prop: "top", expected: "0px" },
      { selector: "#target", prop: "right", expected: "0px" },
      { selector: "#target", prop: "bottom", expected: "0px" },
      { selector: "#target", prop: "left", expected: "0px" },
    ],
  }),
  c({
    id: "badge-notification",
    title: "Notification badge on button",
    description: "Position a small red badge on the top-right corner of `#target`.",
    level: "Medium",
    category: "Positioning",
    html: `<button id="target">Inbox<span class="badge">3</span></button>`,
    starterCss: `#target { position: relative; padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; }
.badge { background: #ef4444; color: white; font-size: 10px; border-radius: 999px; padding: 2px 6px; /* your code */ }`,
    solutionCss: `#target { position: relative; padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; }
.badge { background: #ef4444; color: white; font-size: 10px; border-radius: 999px; padding: 2px 6px; position: absolute; top: -6px; right: -6px; }`,
    explanation:
      "A positioned parent + absolutely positioned child with negative offsets creates a floating badge that overlaps the corner cleanly.",
  }),
  c({
    id: "stacking-context",
    title: "New stacking context with opacity",
    description:
      "Create a new stacking context on `#target` using `opacity` so its `z-index` doesn't escape.",
    level: "Advanced",
    category: "Positioning",
    html: `<div id="target"><div class="child">inside</div></div>`,
    starterCss: `#target { position: relative; padding: 20px; background: #6366f1; color: white; border-radius: 8px; /* your code */ }
.child { background: white; color: #0f172a; padding: 4px 8px; border-radius: 4px; }`,
    solutionCss: `#target { position: relative; padding: 20px; background: #6366f1; color: white; border-radius: 8px; opacity: 0.99; }
.child { background: white; color: #0f172a; padding: 4px 8px; border-radius: 4px; }`,
    explanation:
      "Any element with `opacity < 1`, `transform`, `filter`, or `isolation: isolate` becomes its own stacking context. Children can't paint above elements outside the parent.",
  }),
  c({
    id: "center-flex-corner",
    title: "Center inside pinned box",
    description: "Absolutely position a 100px box and center content inside it.",
    level: "Basic",
    category: "Positioning",
    html: `<div id="stage"><div id="target">Hi</div></div>`,
    starterCss: `#stage { position: relative; height: 160px; background: #f1f5f9; }
#target { position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: #6366f1; color: white; border-radius: 8px; /* your code */ }`,
    solutionCss: `#stage { position: relative; height: 160px; background: #f1f5f9; }
#target { position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: #6366f1; color: white; border-radius: 8px; display: grid; place-items: center; }`,
    explanation:
      "You can combine any layout mode inside a positioned box — here grid centers the content while `position: absolute` pins the whole box.",
  }),
  c({
    id: "negative-margin-overlap",
    title: "Overlap sections with negative margin",
    description: "Pull `#target` up 20px to overlap the section above.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="stage"><div class="top">Above</div><div id="target">Overlapping</div></div>`,
    starterCss: `#stage { background: #f1f5f9; padding: 12px; }
.top { padding: 24px; background: #6366f1; color: white; border-radius: 8px; }
#target { padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); /* your code */ }`,
    solutionCss: `#stage { background: #f1f5f9; padding: 12px; }
.top { padding: 24px; background: #6366f1; color: white; border-radius: 8px; }
#target { padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-top: -20px; position: relative; }`,
    explanation:
      "Negative top margin pulls a block into the previous sibling. Add `position: relative` and a background so it paints on top.",
  }),
  c({
    id: "dropdown-menu-pos",
    title: "Dropdown menu positioning",
    description: "Position `#target` directly below the trigger with the same left edge.",
    level: "Medium",
    category: "Positioning",
    html: `<div id="stage"><button class="trigger">Menu</button><ul id="target"><li>One</li><li>Two</li></ul></div>`,
    starterCss: `#stage { position: relative; padding: 12px; }
.trigger { padding: 6px 10px; background: #6366f1; color: white; border: none; border-radius: 6px; }
#target { list-style: none; margin: 0; padding: 6px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 6px; /* your code */ }`,
    solutionCss: `#stage { position: relative; padding: 12px; }
.trigger { padding: 6px 10px; background: #6366f1; color: white; border: none; border-radius: 6px; }
#target { list-style: none; margin: 0; padding: 6px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 6px; position: absolute; top: 42px; left: 12px; }`,
    explanation:
      "For simple dropdowns, `position: absolute` with fixed offsets works. Use CSS Anchor Positioning for adaptive placement.",
  }),
  c({
    id: "hero-overlay",
    title: "Hero image overlay",
    description: "Cover `#stage` with a semi-transparent dark overlay so the text is readable.",
    level: "Basic",
    category: "Positioning",
    html: `<div id="stage"><div id="target"></div><h3 class="cap">Read me</h3></div>`,
    starterCss: `#stage { position: relative; height: 120px; background: url('https://picsum.photos/400/200') center/cover; color: white; }
.cap { position: relative; padding: 12px; margin: 0; }
#target { background: rgba(0,0,0,0.5); /* your code */ }`,
    solutionCss: `#stage { position: relative; height: 120px; background: url('https://picsum.photos/400/200') center/cover; color: white; }
.cap { position: relative; padding: 12px; margin: 0; }
#target { background: rgba(0,0,0,0.5); position: absolute; inset: 0; }`,
    explanation:
      "A dark overlay layer between the image and the text ensures WCAG contrast without editing the image itself.",
  }),
  c({
    id: "uppercase-track",
    title: "Uppercase with letter spacing",
    description: "Style `#target` as uppercase with 0.1em letter spacing.",
    level: "Basic",
    category: "Typography",
    html: `<h4 id="target">Section label</h4>`,
    starterCss: `#target { /* your code */ margin: 0; color: #6366f1; }`,
    solutionCss: `#target { text-transform: uppercase; letter-spacing: 0.1em; margin: 0; color: #6366f1; }`,
    explanation:
      "Uppercase eyebrow labels feel more balanced with slight `letter-spacing`, since capitals sit tighter than lowercase glyphs.",
    checks: [
      { selector: "#target", prop: "text-transform", expected: "uppercase" },
      { selector: "#target", prop: "letter-spacing", expected: "1.4px" },
    ],
  }),
  c({
    id: "line-height-comfy",
    title: "Comfortable line-height",
    description: "Set line-height to 1.7 on `#target` for body copy.",
    level: "Basic",
    category: "Typography",
    html: `<p id="target">Comfortable body copy usually uses a line-height of 1.5-1.8 to give paragraphs breathing room and improve scan-ability of long-form text.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { line-height: 1.7; }`,
    explanation:
      "Unitless `line-height` is preferred so nested elements inherit a ratio rather than a fixed pixel value.",
  }),
  c({
    id: "text-align-justify",
    title: "Justify text",
    description: "Justify `#target` so both edges align.",
    level: "Basic",
    category: "Typography",
    html: `<p id="target">This paragraph should stretch to align its right edge with the container. Justify works best on wide columns with hyphenation enabled.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { text-align: justify; hyphens: auto; }`,
    explanation:
      "`text-align: justify` distributes extra space between words. Combine with `hyphens: auto` and `lang` so browsers can break words and avoid rivers of whitespace.",
    checks: [{ selector: "#target", prop: "text-align", expected: "justify" }],
  }),
  c({
    id: "first-letter-drop",
    title: "Drop cap",
    description: "Enlarge the first letter of `#target` with `::first-letter`.",
    level: "Medium",
    category: "Typography",
    html: `<p id="target">Once upon a time in a codebase far, far away, developers still fought over tabs and spaces.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target::first-letter { font-size: 3em; float: left; line-height: 0.9; padding-right: 6px; color: #6366f1; font-weight: 700; }`,
    explanation:
      "`::first-letter` targets the initial character of a block, letting you build magazine-style drop caps with only CSS.",
  }),
  c({
    id: "break-word",
    title: "Break long URLs",
    description: "Prevent an overly long word from overflowing `#target`.",
    level: "Medium",
    category: "Typography",
    html: `<p id="target">https://verylongdomainnamethatwilloverflowanycontainerunlesswehandleit.example.com/path</p>`,
    starterCss: `#target { width: 200px; background: #f1f5f9; padding: 8px; /* your code */ }`,
    solutionCss: `#target { width: 200px; background: #f1f5f9; padding: 8px; overflow-wrap: anywhere; }`,
    explanation:
      "`overflow-wrap: anywhere` allows the browser to break inside long unbreakable strings such as URLs, keeping layout intact.",
    checks: [{ selector: "#target", prop: "overflow-wrap", expected: "anywhere" }],
  }),
  c({
    id: "font-feature-numeric",
    title: "Tabular figures",
    description: "Enable tabular numerals so numbers align in columns.",
    level: "Advanced",
    category: "Typography",
    html: `<pre id="target">1.230
45.600
789.000</pre>`,
    starterCss: `#target { font-family: system-ui, sans-serif; /* your code */ }`,
    solutionCss: `#target { font-family: system-ui, sans-serif; font-variant-numeric: tabular-nums; }`,
    explanation:
      "`tabular-nums` forces monospaced digit widths, essential for tables, receipts, and scoreboards where columns must line up.",
    checks: [{ selector: "#target", prop: "font-variant-numeric", expected: "tabular-nums" }],
  }),
  c({
    id: "text-balance",
    title: "Balanced headline",
    description:
      "Distribute the words of `#target` evenly across lines using `text-wrap: balance`.",
    level: "Advanced",
    category: "Typography",
    html: `<h2 id="target" style="width:220px">A perfectly balanced headline of medium length</h2>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { text-wrap: balance; }`,
    explanation:
      "`text-wrap: balance` asks the browser to distribute words across lines evenly, avoiding orphan words on the last line of a heading.",
  }),
  c({
    id: "text-pretty",
    title: "Prevent orphan words",
    description:
      "Use `text-wrap: pretty` on `#target` so a single word never gets stranded on the last line.",
    level: "Advanced",
    category: "Typography",
    html: `<p id="target" style="width:220px">Prevents the last line of a paragraph from being a single word that looks awkward.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { text-wrap: pretty; }`,
    explanation:
      "`text-wrap: pretty` optimizes the last few lines for readability, adding a tiny render cost in exchange for better typography.",
  }),
  c({
    id: "small-caps-real",
    title: "Real small-caps",
    description: "Render `#target` as true small caps with `font-variant`.",
    level: "Medium",
    category: "Typography",
    html: `<p id="target">Small caps used to require a fake webfont.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { font-variant-caps: small-caps; }`,
    explanation:
      "`font-variant-caps` triggers OpenType small-caps glyphs when the font provides them, avoiding the ugly scaled-up capitals of the CSS `text-transform` fallback.",
    checks: [{ selector: "#target", prop: "font-variant-caps", expected: "small-caps" }],
  }),
  c({
    id: "gradient-underline",
    title: "Custom gradient underline",
    description: "Add a 2px gradient underline that sits 6px below `#target`.",
    level: "Advanced",
    category: "Typography",
    html: `<a id="target">Learn more</a>`,
    starterCss: `#target { color: #6366f1; text-decoration: none; /* your code */ }`,
    solutionCss: `#target { color: #6366f1; text-decoration: none; background: linear-gradient(90deg, #6366f1, #22d3ee) bottom / 100% 2px no-repeat; padding-bottom: 6px; }`,
    explanation:
      "A background gradient shorthand with fixed height and `no-repeat` mimics an underline, but with full color and thickness control that `text-decoration` can't match.",
  }),
  c({
    id: "var-font-weight",
    title: "Variable font weight animation",
    description: "Animate `#target`'s weight from 400 to 800 on hover.",
    level: "Advanced",
    category: "Typography",
    html: `<span id="target">Hover me</span>`,
    starterCss: `#target { font: 700 24px system-ui; font-variation-settings: 'wght' 400; transition: font-variation-settings 250ms ease; }
#target:hover { /* your code */ }`,
    solutionCss: `#target { font: 700 24px system-ui; font-variation-settings: 'wght' 400; transition: font-variation-settings 250ms ease; }
#target:hover { font-variation-settings: 'wght' 800; }`,
    explanation:
      "Variable fonts expose axes like weight, width, and slant. Animate `font-variation-settings` for smooth transitions between styles.",
  }),
  c({
    id: "text-stroke",
    title: "Stroked outline text",
    description: "Give `#target` a 2px indigo outline with a transparent fill.",
    level: "Advanced",
    category: "Typography",
    html: `<h2 id="target">Outline</h2>`,
    starterCss: `#target { font-size: 40px; margin: 0; /* your code */ }`,
    solutionCss: `#target { font-size: 40px; margin: 0; color: transparent; -webkit-text-stroke: 2px #6366f1; }`,
    explanation:
      "`-webkit-text-stroke` paints an outline on glyphs. Combined with `color: transparent` it produces hollow letters — great for hero headlines.",
  }),
  c({
    id: "word-spacing",
    title: "Wider word spacing",
    description: "Increase the space between words in `#target` by 0.4em.",
    level: "Basic",
    category: "Typography",
    html: `<p id="target">Spread these words out.</p>`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { word-spacing: 0.4em; }`,
    explanation:
      "`word-spacing` widens gaps between words without touching letter spacing. Use sparingly — it can quickly hurt readability.",
    checks: [{ selector: "#target", prop: "word-spacing", expected: "6.4px" }],
  }),
  c({
    id: "hanging-punctuation",
    title: "Hanging punctuation",
    description: "Let the opening quote of `#target` hang outside its box.",
    level: "Advanced",
    category: "Typography",
    html: `<blockquote id="target">"Design is intelligence made visible."</blockquote>`,
    starterCss: `#target { /* your code */ padding: 12px; background: #f1f5f9; border-radius: 6px; }`,
    solutionCss: `#target { hanging-punctuation: first; padding: 12px; background: #f1f5f9; border-radius: 6px; }`,
    explanation:
      "`hanging-punctuation: first` pushes the opening quote character into the margin so the actual text edge aligns cleanly. Supported in Safari today.",
  }),
  c({
    id: "slide-in",
    title: "Slide-in from left",
    description: "Animate `#target` sliding in from the left over 400ms.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">Slide</div>`,
    starterCss: `#target { padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; display: inline-block; /* your code */ }
@keyframes slide { /* code */ }`,
    solutionCss: `#target { padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; display: inline-block; animation: slide 400ms ease both; }
@keyframes slide { from { transform: translateX(-40px); opacity: 0; } to { transform: none; opacity: 1; } }`,
    explanation:
      "`animation-fill-mode: both` (via the `both` shorthand) keeps the element hidden before the animation runs and holds the final state after.",
  }),
  c({
    id: "rotate-hover",
    title: "Rotate on hover",
    description: "Rotate `#target` 15 degrees on hover.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">Tilt me</div>`,
    starterCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; transition: transform 200ms ease; }
#target:hover { /* your code */ }`,
    solutionCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; transition: transform 200ms ease; }
#target:hover { transform: rotate(15deg); }`,
    explanation:
      "`rotate` on a `transform` runs on the compositor, so it stays smooth even on lower-end devices.",
  }),
  c({
    id: "scale-hover",
    title: "Scale on hover",
    description: "Scale `#target` to 1.05× on hover with a 150ms ease.",
    level: "Basic",
    category: "Animations",
    html: `<img id="target" src="https://picsum.photos/120" width="120" height="120" style="border-radius:12px">`,
    starterCss: `#target { display: block; /* your code */ }
#target:hover { /* your code */ }`,
    solutionCss: `#target { display: block; transition: transform 150ms ease; }
#target:hover { transform: scale(1.05); }`,
    explanation:
      "Small hover scales feel premium without being distracting. Keep them under 1.1 to avoid clipping neighbours.",
  }),
  c({
    id: "keyframe-shake",
    title: "Shake animation",
    description: "Add a horizontal shake keyframe animation to `#target`, lasting 400ms.",
    level: "Medium",
    category: "Animations",
    html: `<div id="target">Wrong</div>`,
    starterCss: `#target { display: inline-block; padding: 12px 20px; background: #ef4444; color: white; border-radius: 8px; /* your code */ }
@keyframes shake { /* code */ }`,
    solutionCss: `#target { display: inline-block; padding: 12px 20px; background: #ef4444; color: white; border-radius: 8px; animation: shake 400ms ease-in-out; }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }`,
    explanation:
      "A shake is symmetrical — same distance in both directions — so users perceive it as a rejection cue.",
  }),
  c({
    id: "stagger-fade",
    title: "Staggered fade-in",
    description: "Fade in the three list items with 100ms staggered delays.",
    level: "Advanced",
    category: "Animations",
    html: `<ul id="target"><li>One</li><li>Two</li><li>Three</li></ul>`,
    starterCss: `#target { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
#target li { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; /* your code */ }
@keyframes fade { /* code */ }`,
    solutionCss: `#target { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
#target li { padding: 8px 12px; background: #6366f1; color: white; border-radius: 6px; opacity: 0; animation: fade 300ms ease forwards; }
#target li:nth-child(1) { animation-delay: 0ms; }
#target li:nth-child(2) { animation-delay: 100ms; }
#target li:nth-child(3) { animation-delay: 200ms; }
@keyframes fade { to { opacity: 1; } }`,
    explanation:
      "Manual `nth-child` delays are the pure-CSS answer to staggered animations. Sass loops or `--i` custom properties scale better for long lists.",
  }),
  c({
    id: "skew",
    title: "Skew a card",
    description: "Skew `#target` by 8 degrees on the X axis.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">Skew</div>`,
    starterCss: `#target { padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; display: inline-block; /* your code */ }`,
    solutionCss: `#target { padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; display: inline-block; transform: skewX(8deg); }`,
    explanation:
      "`skew` deforms coordinate axes. Use tiny amounts (5-10°) for stylized decorative shapes such as sale ribbons.",
    checks: [
      { selector: "#target", prop: "transform", expected: "matrix(1, 0, 0.140541, 1, 0, 0)" },
    ],
  }),
  c({
    id: "progress-bar",
    title: "Indeterminate progress bar",
    description: "Animate `#target`'s inner bar sliding across as an indeterminate loader.",
    level: "Advanced",
    category: "Animations",
    html: `<div id="target"><span class="bar"></span></div>`,
    starterCss: `#target { position: relative; overflow: hidden; height: 6px; background: #e2e8f0; border-radius: 999px; }
.bar { position: absolute; inset-block: 0; width: 30%; background: #6366f1; border-radius: 999px; /* your code */ }
@keyframes ind { /* code */ }`,
    solutionCss: `#target { position: relative; overflow: hidden; height: 6px; background: #e2e8f0; border-radius: 999px; }
.bar { position: absolute; inset-block: 0; width: 30%; background: #6366f1; border-radius: 999px; animation: ind 1.4s ease-in-out infinite; }
@keyframes ind { 0% { left: -30%; } 100% { left: 100%; } }`,
    explanation:
      "Indeterminate loaders animate a small bar across the full track continuously, communicating activity without committing to a percentage.",
  }),
  c({
    id: "card-flip",
    title: "3D card flip",
    description: "Flip `#target` around its Y axis on hover.",
    level: "Advanced",
    category: "Animations",
    html: `<div class="scene"><div id="target"><div class="face front">Front</div><div class="face back">Back</div></div></div>`,
    starterCss: `.scene { perspective: 600px; }
#target { width: 120px; height: 80px; position: relative; transform-style: preserve-3d; transition: transform 500ms; /* your code */ }
.face { position: absolute; inset: 0; display: grid; place-items: center; color: white; border-radius: 8px; backface-visibility: hidden; }
.front { background: #6366f1; }
.back { background: #10b981; transform: rotateY(180deg); }`,
    solutionCss: `.scene { perspective: 600px; }
#target { width: 120px; height: 80px; position: relative; transform-style: preserve-3d; transition: transform 500ms; }
#target:hover { transform: rotateY(180deg); }
.face { position: absolute; inset: 0; display: grid; place-items: center; color: white; border-radius: 8px; backface-visibility: hidden; }
.front { background: #6366f1; }
.back { background: #10b981; transform: rotateY(180deg); }`,
    explanation:
      "A card flip needs `perspective` on the scene, `preserve-3d` on the flipper, and `backface-visibility: hidden` on each face so only one side shows at a time.",
  }),
  c({
    id: "typewriter",
    title: "Typewriter effect",
    description: "Reveal `#target`'s text like a typewriter over 2 seconds.",
    level: "Advanced",
    category: "Animations",
    html: `<div id="target">Hello, terminal.</div>`,
    starterCss: `#target { font-family: monospace; overflow: hidden; white-space: nowrap; width: 15ch; border-right: 2px solid #6366f1; /* your code */ }
@keyframes type { /* code */ }`,
    solutionCss: `#target { font-family: monospace; overflow: hidden; white-space: nowrap; width: 0; border-right: 2px solid #6366f1; animation: type 2s steps(15) forwards, blink 700ms step-end infinite; }
@keyframes type { to { width: 15ch; } }
@keyframes blink { 50% { border-color: transparent; } }`,
    explanation:
      "`steps(N)` yields the choppy tick of a typewriter. Pair with a `ch` unit width equal to the character count so the cursor lands exactly at the end.",
  }),
  c({
    id: "hover-glow",
    title: "Glow on hover",
    description: "Add a glowing shadow around `#target` on hover.",
    level: "Basic",
    category: "Animations",
    html: `<div id="target">Glow</div>`,
    starterCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; transition: box-shadow 250ms; }
#target:hover { /* your code */ }`,
    solutionCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; transition: box-shadow 250ms; }
#target:hover { box-shadow: 0 0 20px rgba(99, 102, 241, 0.7); }`,
    explanation:
      "A large blurred shadow with a partially transparent color mimics neon glow on hover.",
  }),
  c({
    id: "wobble",
    title: "Wobble animation",
    description: "Wobble `#target` back and forth on hover.",
    level: "Medium",
    category: "Animations",
    html: `<div id="target">Wobble</div>`,
    starterCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; }
#target:hover { /* your code */ }
@keyframes wobble { /* code */ }`,
    solutionCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; }
#target:hover { animation: wobble 500ms; }
@keyframes wobble { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-6deg); } 40% { transform: rotate(4deg); } 60% { transform: rotate(-3deg); } 80% { transform: rotate(2deg); } }`,
    explanation:
      "Multiple rotation keyframes with decreasing amplitude produce a playful wobble that damps to rest.",
  }),
  c({
    id: "cubic-bezier",
    title: "Custom cubic-bezier easing",
    description: "Use a custom `cubic-bezier` easing on `#target`'s transition so it snaps.",
    level: "Medium",
    category: "Animations",
    html: `<div id="target">Snap</div>`,
    starterCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; transition: transform 300ms /* your code */; }
#target:hover { transform: translateX(20px); }`,
    solutionCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1); }
#target:hover { transform: translateX(20px); }`,
    explanation:
      "Overshoot easings (bezier control points above 1) give a springy snap that pure `ease-out` can't produce.",
  }),
  c({
    id: "infinite-marquee",
    title: "Infinite marquee",
    description: "Continuously scroll `#target` horizontally forever.",
    level: "Advanced",
    category: "Animations",
    html: `<div id="stage"><div id="target"><span>News · </span><span>News · </span><span>News · </span><span>News · </span></div></div>`,
    starterCss: `#stage { overflow: hidden; background: #f1f5f9; padding: 8px 0; }
#target { display: flex; gap: 24px; width: max-content; /* your code */ }
@keyframes scroll { /* code */ }`,
    solutionCss: `#stage { overflow: hidden; background: #f1f5f9; padding: 8px 0; }
#target { display: flex; gap: 24px; width: max-content; animation: scroll 6s linear infinite; }
@keyframes scroll { to { transform: translateX(-50%); } }`,
    explanation:
      "Duplicate the content so translating by `-50%` looks seamless. `linear` keeps motion constant end-to-end.",
  }),
  c({
    id: "bounce-in",
    title: "Bounce-in on load",
    description: "Animate `#target` bouncing into view on page load.",
    level: "Medium",
    category: "Animations",
    html: `<div id="target">Bounce</div>`,
    starterCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; /* your code */ }
@keyframes bounceIn { /* code */ }`,
    solutionCss: `#target { display: inline-block; padding: 12px 20px; background: #6366f1; color: white; border-radius: 8px; animation: bounceIn 600ms ease both; }
@keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }`,
    explanation:
      "A brief overshoot past the resting scale creates the perceived bounce without a physics simulation.",
  }),
  c({
    id: "scale-active",
    title: "Press-down active state",
    description: "Scale `#target` to 0.95 while it is being clicked.",
    level: "Basic",
    category: "Animations",
    html: `<button id="target">Press</button>`,
    starterCss: `#target { padding: 10px 18px; background: #6366f1; color: white; border: none; border-radius: 8px; transition: transform 100ms ease; }
#target:active { /* your code */ }`,
    solutionCss: `#target { padding: 10px 18px; background: #6366f1; color: white; border: none; border-radius: 8px; transition: transform 100ms ease; }
#target:active { transform: scale(0.95); }`,
    explanation:
      "A brief `scale-down` on `:active` gives physical feedback so users feel the click land.",
  }),
  c({
    id: "reduced-motion",
    title: "Respect prefers-reduced-motion",
    description: "Disable `#target`'s spin when the user prefers reduced motion.",
    level: "Advanced",
    category: "Animations",
    html: `<div id="target"></div>`,
    starterCss: `#target { width: 32px; height: 32px; border: 4px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
/* your media query */`,
    solutionCss: `#target { width: 32px; height: 32px; border: 4px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { #target { animation: none; } }`,
    explanation:
      "Always gate movement behind `prefers-reduced-motion` to accommodate users with vestibular disorders.",
  }),
  c({
    id: "gradient-move",
    title: "Animated gradient",
    description: "Animate a background gradient sliding across `#target`.",
    level: "Advanced",
    category: "Animations",
    html: `<div id="target">Animated</div>`,
    starterCss: `#target { padding: 20px; color: white; border-radius: 8px; text-align: center; /* your code */ }
@keyframes bg { /* code */ }`,
    solutionCss: `#target { padding: 20px; color: white; border-radius: 8px; text-align: center; background: linear-gradient(90deg, #6366f1, #22d3ee, #10b981, #6366f1); background-size: 300% 100%; animation: bg 4s linear infinite; }
@keyframes bg { to { background-position: 300% 0; } }`,
    explanation:
      "Enlarge `background-size` and animate `background-position` so the gradient appears to flow. Loop by matching first and last colors.",
  }),
  c({
    id: "count-up",
    title: "Number count-up with CSS",
    description: "Animate `--n` from 0 to 100 using `@property` so `#target` visibly counts up.",
    level: "Advanced",
    category: "Animations",
    html: `<div id="target">0</div>`,
    starterCss: `@property --n { syntax: '<integer>'; inherits: false; initial-value: 0; }
#target { counter-reset: n var(--n); font-size: 32px; font-weight: 700; color: #6366f1; /* your code */ }
#target::after { content: counter(n); }
@keyframes count { /* code */ }`,
    solutionCss: `@property --n { syntax: '<integer>'; inherits: false; initial-value: 0; }
#target { counter-reset: n var(--n); font-size: 32px; font-weight: 700; color: #6366f1; animation: count 2s forwards; }
#target::after { content: counter(n); }
@keyframes count { to { --n: 100; } }`,
    explanation:
      "Registered custom properties can be animated. Combined with `counter()`, you can produce a numeric count-up entirely in CSS.",
  }),
  c({
    id: "mobile-first",
    title: "Mobile-first breakpoint",
    description: "Stack columns on mobile, side-by-side on 640px and up.",
    level: "Basic",
    category: "Responsive",
    html: `<div id="target"><div class="a">A</div><div class="b">B</div></div>`,
    starterCss: `#target { /* your code */ }
.a, .b { padding: 16px; color: white; border-radius: 6px; }
.a { background: #6366f1; }
.b { background: #10b981; }
@media (min-width: 640px) { /* your code */ }`,
    solutionCss: `#target { display: grid; grid-template-columns: 1fr; gap: 8px; }
.a, .b { padding: 16px; color: white; border-radius: 6px; }
.a { background: #6366f1; }
.b { background: #10b981; }
@media (min-width: 640px) { #target { grid-template-columns: 1fr 1fr; } }`,
    explanation:
      "Mobile-first CSS starts with the narrow layout and enhances upward with `min-width` queries — usually resulting in less overriding.",
  }),
  c({
    id: "fluid-space",
    title: "Fluid spacing with clamp",
    description: "Give `#target` padding that scales from 12px on mobile to 48px on wide screens.",
    level: "Medium",
    category: "Responsive",
    html: `<div id="target">Fluid</div>`,
    starterCss: `#target { background: #6366f1; color: white; border-radius: 8px; text-align: center; /* your code */ }`,
    solutionCss: `#target { background: #6366f1; color: white; border-radius: 8px; text-align: center; padding: clamp(12px, 4vw, 48px); }`,
    explanation:
      "`clamp(min, preferred, max)` produces smoothly scaling values without media queries — great for typography and spacing.",
  }),
  c({
    id: "container-query-card",
    title: "Container-query card",
    description:
      "Switch `#target` from stacked to horizontal when its container is at least 400px wide.",
    level: "Advanced",
    category: "Responsive",
    html: `<div id="parent"><div id="target"><img src="https://picsum.photos/80" width="80" height="80"><div class="body"><h4>Title</h4><p>Body</p></div></div></div>`,
    starterCss: `#parent { container-type: inline-size; }
#target { display: flex; flex-direction: column; gap: 8px; padding: 12px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; }
/* your code */`,
    solutionCss: `#parent { container-type: inline-size; }
#target { display: flex; flex-direction: column; gap: 8px; padding: 12px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; }
@container (min-width: 400px) { #target { flex-direction: row; align-items: center; } }`,
    explanation:
      "Container queries let a card decide its own layout based on the space it has been given, without knowing the viewport size.",
  }),
  c({
    id: "hide-below",
    title: "Hide below breakpoint",
    description: "Hide `#target` on screens below 768px.",
    level: "Basic",
    category: "Responsive",
    html: `<div id="target">Desktop only</div>`,
    starterCss: `#target { padding: 12px; background: #6366f1; color: white; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { padding: 12px; background: #6366f1; color: white; border-radius: 8px; }
@media (max-width: 767px) { #target { display: none; } }`,
    explanation:
      "Toggle `display: none` with a media query for elements that don't make sense on small screens (like sidebars or dense tables).",
  }),
  c({
    id: "orientation",
    title: "Landscape-only banner",
    description: "Show `#target` only when the device is in landscape orientation.",
    level: "Medium",
    category: "Responsive",
    html: `<div id="target">Landscape</div>`,
    starterCss: `#target { padding: 12px; background: #6366f1; color: white; border-radius: 8px; display: none; }
/* your code */`,
    solutionCss: `#target { padding: 12px; background: #6366f1; color: white; border-radius: 8px; display: none; }
@media (orientation: landscape) { #target { display: block; } }`,
    explanation:
      "`orientation` media queries respond to viewport shape rather than a fixed width — useful for landscape-only banners on phones.",
  }),
  c({
    id: "dark-mode",
    title: "Dark mode support",
    description: "Style `#target` differently when the user prefers a dark color scheme.",
    level: "Medium",
    category: "Responsive",
    html: `<div id="target">Adapt</div>`,
    starterCss: `#target { padding: 12px; background: white; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; }
/* your code */`,
    solutionCss: `#target { padding: 12px; background: white; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; }
@media (prefers-color-scheme: dark) { #target { background: #0f172a; color: white; border-color: #334155; } }`,
    explanation:
      "`prefers-color-scheme` reflects the user's OS-level dark-mode preference, letting sites adapt without a manual toggle.",
  }),
  c({
    id: "high-contrast",
    title: "Forced-colors mode",
    description: "Ensure `#target` remains visible under Windows High Contrast mode.",
    level: "Advanced",
    category: "Responsive",
    html: `<button id="target">Button</button>`,
    starterCss: `#target { padding: 8px 16px; background: #6366f1; color: white; border: 1px solid transparent; border-radius: 6px; }
/* your code */`,
    solutionCss: `#target { padding: 8px 16px; background: #6366f1; color: white; border: 1px solid transparent; border-radius: 6px; }
@media (forced-colors: active) { #target { border-color: CanvasText; } }`,
    explanation:
      "Forced-colors mode overrides your palette. Adding a visible border ensures buttons remain identifiable when your background is replaced with system colors.",
  }),
  c({
    id: "pointer-coarse",
    title: "Larger tap targets on touch",
    description: "Enlarge `#target` on touch devices with `pointer: coarse`.",
    level: "Medium",
    category: "Responsive",
    html: `<button id="target">Tap</button>`,
    starterCss: `#target { padding: 4px 8px; background: #6366f1; color: white; border: none; border-radius: 6px; }
/* your code */`,
    solutionCss: `#target { padding: 4px 8px; background: #6366f1; color: white; border: none; border-radius: 6px; }
@media (pointer: coarse) { #target { padding: 12px 20px; min-height: 44px; } }`,
    explanation:
      "`pointer: coarse` detects touch inputs and lets you enforce the WCAG-recommended 44×44 tap target minimum.",
  }),
  c({
    id: "responsive-typography",
    title: "Fluid heading",
    description: "Give `#target` a font-size that scales from 24px to 56px.",
    level: "Medium",
    category: "Responsive",
    html: `<h1 id="target">Fluid heading</h1>`,
    starterCss: `#target { margin: 0; /* your code */ }`,
    solutionCss: `#target { margin: 0; font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem); }`,
    explanation:
      "`clamp()` plus a `vw + rem` preferred value grows type in step with viewport width but respects the user's root font-size preference.",
  }),
  c({
    id: "aspect-1x1-mobile",
    title: "Aspect swap by breakpoint",
    description: "Make `#target` square on mobile and 16:9 on wide screens.",
    level: "Medium",
    category: "Responsive",
    html: `<div id="target">Aspect</div>`,
    starterCss: `#target { background: #6366f1; color: white; display: grid; place-items: center; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { background: #6366f1; color: white; display: grid; place-items: center; border-radius: 8px; aspect-ratio: 1 / 1; }
@media (min-width: 640px) { #target { aspect-ratio: 16 / 9; } }`,
    explanation:
      "`aspect-ratio` responds to media queries just like other properties. Switch ratios per breakpoint for hero art that adapts to screen shape.",
  }),
  c({
    id: "box-shadow-elevation",
    title: "Material-style elevation",
    description: "Layer two shadows to produce a subtle Material-style card elevation.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target">Card</div>`,
    starterCss: `#target { padding: 20px; background: white; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12); }`,
    explanation:
      "Stack a tight shadow for edge definition and a wider soft shadow for depth. Realistic elevation almost always uses two or more shadows.",
  }),
  c({
    id: "inner-shadow",
    title: "Inset shadow",
    description: "Give `#target` an inset shadow to look pressed in.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target">Pressed</div>`,
    starterCss: `#target { padding: 20px; background: #f1f5f9; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { padding: 20px; background: #f1f5f9; border-radius: 8px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.15); }`,
    explanation:
      "Prefix `box-shadow` with `inset` to render inside the box. Great for input wells and pressed states.",
  }),
  c({
    id: "stripe-pattern",
    title: "Diagonal stripes",
    description: "Fill `#target` with 8px diagonal stripes using a repeating linear gradient.",
    level: "Medium",
    category: "Visual Effects",
    html: `<div id="target" style="height:80px"></div>`,
    starterCss: `#target { border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { border-radius: 8px; background: repeating-linear-gradient(45deg, #6366f1 0 8px, #a5b4fc 8px 16px); }`,
    explanation:
      "`repeating-linear-gradient` with stops at fixed pixel positions produces crisp patterns like stripes and chevrons.",
  }),
  c({
    id: "checkerboard",
    title: "Checkerboard background",
    description: "Create a checkerboard pattern using two linear gradients.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="target" style="height:100px"></div>`,
    starterCss: `#target { border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { border-radius: 8px; background: linear-gradient(45deg, #cbd5e1 25%, transparent 25%) 0 0/16px 16px, linear-gradient(-45deg, #cbd5e1 25%, transparent 25%) 0 0/16px 16px, linear-gradient(45deg, transparent 75%, #cbd5e1 75%) 8px 8px/16px 16px, linear-gradient(-45deg, transparent 75%, #cbd5e1 75%) 8px 8px/16px 16px, white; }`,
    explanation:
      "Two pairs of offset 45°/135° gradients yield the alternating diagonals that form a checkerboard.",
  }),
  c({
    id: "noise-texture",
    title: "Noise overlay via SVG",
    description: "Add subtle noise texture with an inline SVG data URL.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="target">Textured</div>`,
    starterCss: `#target { padding: 20px; color: white; border-radius: 8px; background: #6366f1; /* your code */ }`,
    solutionCss: `#target { padding: 20px; color: white; border-radius: 8px; background: #6366f1 url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.15'/></svg>"); }`,
    explanation:
      "SVG feTurbulence generates procedural noise. Overlaying it at low opacity gives flat colors a tactile, print-like grain.",
  }),
  c({
    id: "cutout-text",
    title: "Text cut out of gradient",
    description: "Cut the text out of a gradient so it acts as a mask.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<h2 id="target">MASKED</h2>`,
    starterCss: `#target { font-size: 40px; font-weight: 800; margin: 0; /* your code */ }`,
    solutionCss: `#target { font-size: 40px; font-weight: 800; margin: 0; background: linear-gradient(90deg, #6366f1, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }`,
    explanation:
      "`background-clip: text` fills the glyph shapes with the background. Combined with `color: transparent`, the text becomes a window onto the gradient.",
  }),
  c({
    id: "border-gradient",
    title: "Gradient border",
    description: "Give `#target` a 2px gradient border using the `border-image` shorthand.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="target">Bordered</div>`,
    starterCss: `#target { padding: 20px; background: white; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target { padding: 20px; background: white; border-radius: 8px; border: 2px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(90deg, #6366f1, #22d3ee) border-box; }`,
    explanation:
      "Layer two backgrounds — the inner fills the padding box, the gradient fills the border box — for a gradient border that still keeps rounded corners.",
  }),
  c({
    id: "skeleton-shimmer",
    title: "Skeleton shimmer",
    description: "Animate a shimmer across `#target` as a loading skeleton.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="target" style="height:16px"></div>`,
    starterCss: `#target { border-radius: 6px; /* your code */ }
@keyframes shine { /* code */ }`,
    solutionCss: `#target { border-radius: 6px; background: linear-gradient(90deg, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%); background-size: 200% 100%; animation: shine 1.4s linear infinite; }
@keyframes shine { to { background-position: -200% 0; } }`,
    explanation:
      'A wide gradient scrolled across the element gives the classic "shimmer" loading effect without any images.',
  }),
  c({
    id: "mix-blend-multiply",
    title: "Multiply blend title",
    description: "Overlay `#target` on the image below and blend using `multiply`.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div class="scene"><img src="https://picsum.photos/200" width="200" height="120"><h3 id="target">HELLO</h3></div>`,
    starterCss: `.scene { position: relative; }
#target { position: absolute; inset: 0; margin: 0; color: yellow; font-size: 48px; text-align: center; display: grid; place-items: center; /* your code */ }`,
    solutionCss: `.scene { position: relative; }
#target { position: absolute; inset: 0; margin: 0; color: yellow; font-size: 48px; text-align: center; display: grid; place-items: center; mix-blend-mode: multiply; }`,
    explanation:
      "`mix-blend-mode` blends an element with what's behind it using classic Photoshop math. `multiply` yields dark, poster-like combinations.",
    checks: [{ selector: "#target", prop: "mix-blend-mode", expected: "multiply" }],
  }),
  c({
    id: "hue-rotate",
    title: "Hue-rotate image",
    description: "Apply a 120deg hue-rotate to `#target`.",
    level: "Basic",
    category: "Visual Effects",
    html: `<img id="target" src="https://picsum.photos/120" width="120" height="120">`,
    starterCss: `#target { border-radius: 12px; /* your code */ }`,
    solutionCss: `#target { border-radius: 12px; filter: hue-rotate(120deg); }`,
    explanation:
      "`hue-rotate` shifts colors around the hue wheel while preserving lightness, an easy way to theme images.",
    checks: [{ selector: "#target", prop: "filter", expected: "hue-rotate(120deg)" }],
  }),
  c({
    id: "grayscale-hover",
    title: "Grayscale until hover",
    description: "Show `#target` in grayscale by default, full color on hover.",
    level: "Basic",
    category: "Visual Effects",
    html: `<img id="target" src="https://picsum.photos/120" width="120" height="120">`,
    starterCss: `#target { border-radius: 12px; transition: filter 200ms; /* your code */ }
#target:hover { /* your code */ }`,
    solutionCss: `#target { border-radius: 12px; transition: filter 200ms; filter: grayscale(1); }
#target:hover { filter: grayscale(0); }`,
    explanation:
      "Team pages often use this trick — desaturated portraits pop when the user hovers, guiding attention.",
  }),
  c({
    id: "clip-inset",
    title: "Rounded clip-path",
    description: "Clip `#target` into a rounded rectangle using `clip-path: inset()`.",
    level: "Medium",
    category: "Visual Effects",
    html: `<img id="target" src="https://picsum.photos/160/120" width="160" height="120">`,
    starterCss: `#target { /* your code */ }`,
    solutionCss: `#target { clip-path: inset(0 round 24px); }`,
    explanation:
      "`inset(0 round 24px)` clips to the box with rounded corners — handy for cropping images inside animated masks that `border-radius` can't achieve.",
  }),
  c({
    id: "blur-focus",
    title: "Blur unfocused elements",
    description: "Blur all siblings of the hovered `#target`.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="stage"><div class="item">A</div><div id="target">Focus</div><div class="item">C</div></div>`,
    starterCss: `#stage { display: flex; gap: 8px; padding: 12px; background: #f1f5f9; }
.item, #target { padding: 12px 20px; background: #6366f1; color: white; border-radius: 6px; transition: filter 200ms; }
/* your code */`,
    solutionCss: `#stage { display: flex; gap: 8px; padding: 12px; background: #f1f5f9; }
.item, #target { padding: 12px 20px; background: #6366f1; color: white; border-radius: 6px; transition: filter 200ms; }
#stage:hover > *:not(:hover) { filter: blur(2px); opacity: 0.6; }`,
    explanation:
      '`:hover` on the parent combined with `:not(:hover)` on siblings creates the classic "spotlight" effect where only the pointed-at element stays sharp.',
  }),
  c({
    id: "gradient-conic-ring",
    title: "Conic gradient ring",
    description: "Create a colorful circular progress ring using `conic-gradient`.",
    level: "Advanced",
    category: "Visual Effects",
    html: `<div id="target"></div>`,
    starterCss: `#target { width: 80px; height: 80px; border-radius: 50%; /* your code */ }`,
    solutionCss: `#target { width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#6366f1 0 70%, #e2e8f0 70% 100%); mask: radial-gradient(circle, transparent 55%, black 56%); }`,
    explanation:
      "A conic gradient acts like a pie chart. Masking the center produces a ring — the base of many progress-donut components.",
  }),
  c({
    id: "adjacent-sibling",
    title: "Adjacent sibling `+` selector",
    description: "Style the paragraph immediately after a heading using `+`.",
    level: "Medium",
    category: "Selectors",
    html: `<div id="target"><h4>Title</h4><p>First para</p><p>Second para</p></div>`,
    starterCss: `#target h4 + p { /* your code */ }`,
    solutionCss: `#target h4 + p { color: #6366f1; font-weight: 600; }`,
    explanation:
      'The adjacent sibling combinator `A + B` matches a `B` immediately following an `A`, useful for spacing rules like "first paragraph after a heading".',
  }),
  c({
    id: "general-sibling",
    title: "General sibling `~` selector",
    description: "Style all list items that follow the first `.done`.",
    level: "Advanced",
    category: "Selectors",
    html: `<ul id="target"><li>A</li><li class="done">B</li><li>C</li><li>D</li></ul>`,
    starterCss: `#target .done ~ li { /* your code */ }`,
    solutionCss: `#target .done ~ li { text-decoration: line-through; color: #94a3b8; }`,
    explanation:
      '`A ~ B` matches every `B` after an `A` that shares a parent. Ideal for cascading state like "anything past this marker is disabled".',
  }),
  c({
    id: "attribute-starts-with",
    title: "Attribute starts-with selector",
    description: "Style links whose href starts with `https://` with a lock icon.",
    level: "Medium",
    category: "Selectors",
    html: `<div id="target"><a href="https://a.com">Secure</a> <a href="http://b.com">Insecure</a></div>`,
    starterCss: `#target a[href^="https://"] { /* your code */ }`,
    solutionCss: `#target a[href^="https://"]::before { content: '🔒 '; color: #10b981; }`,
    explanation:
      '`[attr^="..."]` matches attributes starting with a value. Pair with `::before` for icon markers without cluttering HTML.',
  }),
  c({
    id: "attribute-ends-with",
    title: "Attribute ends-with selector",
    description: "Style links to `.pdf` files as document icons.",
    level: "Medium",
    category: "Selectors",
    html: `<div id="target"><a href="guide.pdf">Guide</a> <a href="about.html">About</a></div>`,
    starterCss: `#target a[href$=".pdf"]::after { /* your code */ }`,
    solutionCss: `#target a[href$=".pdf"]::after { content: ' 📄'; color: #ef4444; }`,
    explanation:
      '`[attr$="..."]` matches attributes ending with a value — a clean way to annotate file downloads based on extension.',
  }),
  c({
    id: "attribute-contains",
    title: "Attribute contains selector",
    description: "Style any input whose name contains `email`.",
    level: "Basic",
    category: "Selectors",
    html: `<form id="target"><input name="user_email" placeholder="email"><input name="phone" placeholder="phone"></form>`,
    starterCss: `#target input[name*="email"] { /* your code */ }`,
    solutionCss: `#target input[name*="email"] { border: 2px solid #6366f1; }`,
    explanation:
      '`[attr*="..."]` matches any substring in the attribute value, forgiving different naming conventions.',
  }),
  c({
    id: "nth-child-formula",
    title: "nth-child formula",
    description: "Style every third card starting from the first: 1, 4, 7…",
    level: "Advanced",
    category: "Selectors",
    html: `<div id="target"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div></div>`,
    starterCss: `#target { display: flex; gap: 8px; }
#target > div { padding: 12px; background: #e2e8f0; border-radius: 6px; }
/* your code */`,
    solutionCss: `#target { display: flex; gap: 8px; }
#target > div { padding: 12px; background: #e2e8f0; border-radius: 6px; }
#target > div:nth-child(3n+1) { background: #6366f1; color: white; }`,
    explanation:
      "`nth-child(An+B)` matches every An-th element offset by B. `3n+1` starts at 1 and steps by 3, giving 1, 4, 7…",
  }),
  c({
    id: "only-child",
    title: "only-child fallback",
    description: "Add a border when a card is the only child of its parent.",
    level: "Advanced",
    category: "Selectors",
    html: `<div id="stage"><div id="target">Solo</div></div>`,
    starterCss: `#target { padding: 20px; background: #f1f5f9; border-radius: 8px; /* your code */ }`,
    solutionCss: `#target:only-child { padding: 20px; background: #f1f5f9; border-radius: 8px; border: 2px dashed #6366f1; }`,
    explanation:
      '`:only-child` targets an element that is the sole child of its parent, useful for `"empty state"` layouts.',
  }),
  c({
    id: "empty-state",
    title: "empty pseudo-class",
    description: "Show a placeholder inside an empty list.",
    level: "Medium",
    category: "Selectors",
    html: `<ul id="target"></ul>`,
    starterCss: `#target { list-style: none; padding: 20px; background: #f1f5f9; border-radius: 8px; min-height: 60px; /* your code */ }
/* your code */`,
    solutionCss: `#target { list-style: none; padding: 20px; background: #f1f5f9; border-radius: 8px; min-height: 60px; }
#target:empty::before { content: 'No items yet'; color: #94a3b8; font-style: italic; }`,
    explanation:
      "`:empty` matches elements with no children (including text). Combine with a `::before` message for lightweight empty states.",
  }),
  c({
    id: "placeholder-shown",
    title: "placeholder-shown floating label",
    description: "Push a label up when the input has a value using `:placeholder-shown`.",
    level: "Advanced",
    category: "Selectors",
    html: `<div id="target" style="position:relative"><input placeholder=" "><label>Name</label></div>`,
    starterCss: `#target input { padding: 16px 8px 4px; border: 1px solid #cbd5e1; border-radius: 6px; width: 200px; }
#target label { position: absolute; top: 4px; left: 8px; font-size: 12px; color: #6366f1; transition: 200ms; }
#target input:placeholder-shown + label { /* your code */ }`,
    solutionCss: `#target input { padding: 16px 8px 4px; border: 1px solid #cbd5e1; border-radius: 6px; width: 200px; }
#target label { position: absolute; top: 4px; left: 8px; font-size: 12px; color: #6366f1; transition: 200ms; }
#target input:placeholder-shown + label { top: 12px; font-size: 14px; color: #94a3b8; }`,
    explanation:
      "`:placeholder-shown` matches while the input is still empty (showing its placeholder). This is the pure-CSS pattern behind floating labels.",
  }),
  c({
    id: "target-highlight",
    title: "target pseudo-class",
    description: "Highlight `#target` when its ID is the URL fragment.",
    level: "Medium",
    category: "Selectors",
    html: `<div id="target">Scroll target</div>`,
    starterCss: `#target { padding: 12px; background: #f1f5f9; border-radius: 8px; transition: background 200ms; /* your code */ }`,
    solutionCss: `#target { padding: 12px; background: #f1f5f9; border-radius: 8px; transition: background 200ms; }
#target:target { background: #fef08a; }`,
    explanation:
      "`:target` matches an element whose ID equals the current URL hash — great for highlighting a jumped-to section without JS.",
  }),
  c({
    id: "root-vars",
    title: "root pseudo-class",
    description: "Define brand tokens on `:root` and use them on `#target`.",
    level: "Basic",
    category: "Selectors",
    html: `<div id="target">Themed</div>`,
    starterCss: `/* your code */
#target { padding: 12px 20px; border-radius: 8px; /* your code */ }`,
    solutionCss: `:root { --brand: #6366f1; --ink: white; }
#target { padding: 12px 20px; border-radius: 8px; background: var(--brand); color: var(--ink); }`,
    explanation:
      "`:root` matches the `<html>` element. It's the conventional place to declare global custom-property tokens.",
  }),
  c({
    id: "focus-visible-ring",
    title: "focus-visible ring",
    description: "Show a visible ring on `#target` only for keyboard focus.",
    level: "Advanced",
    category: "Selectors",
    html: `<button id="target">Focus</button>`,
    starterCss: `#target { padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; outline: none; }
#target:focus-visible { /* your code */ }`,
    solutionCss: `#target { padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; outline: none; }
#target:focus-visible { outline: 2px solid #22d3ee; outline-offset: 2px; }`,
    explanation:
      "`:focus-visible` shows focus rings only when the browser thinks the user needs them (keyboard/tab), avoiding annoying rings after mouse clicks.",
  }),
  c({
    id: "scope-selector",
    title: "`:scope` in `querySelector`",
    description: "Style only direct child list items of `#target`.",
    level: "Advanced",
    category: "Selectors",
    html: `<ul id="target"><li>Top<ul><li>Nested</li></ul></li><li>Sibling</li></ul>`,
    starterCss: `#target > li { /* your code */ }`,
    solutionCss: `#target > li { color: #6366f1; font-weight: 700; }`,
    explanation:
      "The child combinator `>` restricts a rule to direct descendants. Prevents nested elements from inheriting the same style.",
  }),
];

export const CHALLENGE_CATEGORIES = [
  "Layout",
  "Positioning",
  "Typography",
  "Animations",
  "Responsive",
  "Visual Effects",
  "Selectors",
] as const;
