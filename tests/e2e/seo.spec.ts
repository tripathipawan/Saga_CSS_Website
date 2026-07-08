import { test, expect } from "@playwright/test";

/**
 * SEO / metadata regression check.
 *
 * For every public route, verifies:
 *  - a non-default <title> ending in "— SagaCSS"
 *  - a non-empty <meta name="description"> under 160 chars
 *  - matching og:title, og:description, og:type
 *  - exactly one <link rel="canonical"> (root has none — sitewide default lives elsewhere)
 *  - valid JSON-LD (parses, has @context + @type)
 *  - no leftover "CSS Craft" branding in any head tag
 */

const ROUTES = [
  "/",
  "/about",
  "/blog",
  "/blog/why-sagacss",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/settings",
  "/my-kit",
  "/cheat-sheet",
  "/tools/gradient",
  "/tools/border-radius",
  "/tools/box-shadow",
  "/tools/animation",
  "/tools/color-palette",
  "/tools/svg",
  "/tools/text-shadow",
  "/tools/3d-shapes",
  "/tools/box-sizing",
  "/tools/grid",
  "/tools/flexbox",
  "/tools/clip-path",
  "/tools/filter",
  "/tools/bezier",
  "/tools/button",
  "/tools/fonts",
  "/tools/clamp",
  "/tools/color-mixer",
  "/tools/color-converter",
  "/tools/contrast",
  "/styles/glassmorphism",
  "/styles/neumorphism",
];

const BAD_TITLES = new Set(["", "Lovable App", "Lovable Generated Project"]);

for (const path of ROUTES) {
  test(`seo ${path} — head metadata is complete and consistent`, async ({ page }) => {
    const resp = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(resp?.ok(), `${path} returned ${resp?.status()}`).toBeTruthy();

    const meta = await page.evaluate(() => {
      const q = (sel: string) => document.head.querySelector(sel);
      const qa = (sel: string) => Array.from(document.head.querySelectorAll(sel));
      const c = (el: Element | null) => el?.getAttribute("content") ?? null;
      return {
        title: document.title,
        description: c(q('meta[name="description"]')),
        ogTitle: c(q('meta[property="og:title"]')),
        ogDesc: c(q('meta[property="og:description"]')),
        ogType: c(q('meta[property="og:type"]')),
        twitterCard: c(q('meta[name="twitter:card"]')),
        canonicals: qa('link[rel="canonical"]').map((l) => l.getAttribute("href")),
        ldJson: qa('script[type="application/ld+json"]').map((s) => s.textContent ?? ""),
        rawHead: document.head.innerHTML,
      };
    });

    // Title
    expect(BAD_TITLES.has(meta.title), `default title on ${path}`).toBe(false);
    expect(meta.title, `title should be branded on ${path}`).toMatch(/SagaCSS/);

    // Description
    expect(meta.description, `missing description on ${path}`).toBeTruthy();
    expect((meta.description ?? "").length).toBeGreaterThan(20);
    expect((meta.description ?? "").length).toBeLessThanOrEqual(180);

    // Open Graph
    expect(meta.ogTitle, `missing og:title on ${path}`).toBeTruthy();
    expect(meta.ogDesc, `missing og:description on ${path}`).toBeTruthy();
    expect(meta.ogType, `missing og:type on ${path}`).toBeTruthy();
    expect(meta.twitterCard, `missing twitter:card on ${path}`).toBe("summary_large_image");

    // Canonical: leaf routes should carry exactly one; root defers to sitewide default.
    if (path !== "/") {
      expect(meta.canonicals.length, `canonical count on ${path}`).toBe(1);
      expect(meta.canonicals[0], `canonical value on ${path}`).toBeTruthy();
    } else {
      expect(meta.canonicals.length, `duplicate canonicals on ${path}`).toBeLessThanOrEqual(1);
    }

    // JSON-LD parses and has schema.org shape
    expect(meta.ldJson.length, `missing JSON-LD on ${path}`).toBeGreaterThan(0);
    for (const raw of meta.ldJson) {
      const parsed = JSON.parse(raw);
      expect(parsed["@context"]).toMatch(/schema\.org/);
      expect(parsed["@type"]).toBeTruthy();
    }

    // No stale brand strings anywhere in the head. Only match the branded form
    // ("CSS Craft" / "CSSCraft" with capital C's), not the lowercase noun
    // phrase "CSS craft" used in some post descriptions.
    expect(meta.rawHead, `stale "CSS Craft" branding on ${path}`).not.toMatch(/CSS\s?Craft\b/);
  });
}
