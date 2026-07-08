import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/settings",
  "/blog",
  "/blog/why-sagacss",
  "/tools/gradient",
  "/tools/border-radius",
  "/tools/box-shadow",
  "/tools/text-shadow",
  "/tools/animation",
  "/tools/3d-shapes",
  "/tools/box-sizing",
  "/tools/grid",
  "/tools/color-palette",
  "/tools/clip-path",
  "/tools/flexbox",
  "/tools/svg",
  "/tools/button",
  "/styles/neumorphism",
  "/styles/glassmorphism",
  "/styles/claymorphism",
  "/styles/neubrutalism",
];

for (const path of ROUTES) {
  test(`a11y ${path} — no serious or critical WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (blocking.length) {
      // Pretty-print for the CI log.
      console.log(
        `\naxe violations on ${path}:\n` +
          blocking
            .map(
              (v) =>
                `  [${v.impact}] ${v.id} — ${v.help}\n    ${v.nodes
                  .slice(0, 3)
                  .map((n) => n.target.join(" "))
                  .join("\n    ")}`,
            )
            .join("\n"),
      );
    }

    expect(blocking, `serious/critical axe violations on ${path}`).toEqual([]);
  });
}
