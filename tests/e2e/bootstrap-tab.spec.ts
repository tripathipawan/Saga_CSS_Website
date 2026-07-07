import { test, expect, type Page } from "@playwright/test";

// Tools whose Bootstrap tab is authored explicitly and must emit valid
// Bootstrap markup (utility classes + optional custom SCSS block) with
// zero inline `style="…"` attributes on the markup lines.
const BOOTSTRAP_TOOLS = [
  "/tools/gradient",
  "/tools/border-radius",
  "/tools/box-shadow",
  "/tools/text-shadow",
  "/tools/animation",
  "/tools/3d-shapes",
  "/tools/grid",
  "/tools/color-palette",
  "/tools/color-mixer",
  "/tools/contrast",
  "/tools/clip-path",
  "/tools/button",
  "/tools/bezier",
  "/tools/fonts",
  "/tools/filter",
  "/tools/clamp",
  "/tools/image-text",
  "/tools/theme-variables",
  "/styles/art-deco",
  "/styles/y2k",
  "/styles/cyberpunk",
];

async function selectBootstrap(page: Page) {
  const btn = page.getByRole("button", { name: "Bootstrap", exact: true }).locator("visible=true").first();
  await btn.click();
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll('button[aria-pressed="true"]')]
      .find((el) => el.textContent?.trim() === "Bootstrap");
    return Boolean(b);
  });
}

for (const path of BOOTSTRAP_TOOLS) {
  test(`bootstrap tab on ${path} contains no inline style attributes on markup lines`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("pre code:visible").first()).toBeVisible();
    await selectBootstrap(page);

    const code = (await page.locator("pre code:visible").first().innerText()).trim();
    expect(code.length).toBeGreaterThan(0);

    // Look at markup lines only (starting with `<` and NOT a CSS/HTML comment).
    const markupLines = code
      .split(/\r?\n/)
      .filter((l) => /^\s*<[a-zA-Z]/.test(l));
    const withInlineStyle = markupLines.filter((l) => /\sstyle="/.test(l));
    expect(withInlineStyle, `inline style= should not appear on markup in ${path}`).toEqual([]);

    // Bootstrap output should include at least one Bootstrap utility class
    // (d-*, p-*, m-*, rounded*, bg-*, text-*, fw-*, w-*, h-*, position-*, animate-*, craft-*).
    expect(code).toMatch(/class="[^"]*(?:d-|p-|m-|rounded|bg-|text-|fw-|w-|h-|position-|border|craft-|animate-|img-)/);
  });
}

const VIEWPORTS: Array<{ w: number; h: number; name: string }> = [
  { w: 375, h: 812, name: "mobile" },
  { w: 768, h: 1024, name: "tablet" },
  { w: 1024, h: 900, name: "laptop" },
  { w: 1440, h: 900, name: "desktop" },
];

for (const vp of VIEWPORTS) {
  test(`code panel does not overflow horizontally at ${vp.name} (${vp.w}px)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto("/tools/gradient");
    const pre = page.locator("pre").first();
    await expect(pre).toBeVisible();
    const box = await pre.boundingBox();
    expect(box).not.toBeNull();
    // Panel must fit within the viewport (allow 4px slack for scrollbars).
    expect(box!.width).toBeLessThanOrEqual(vp.w + 4);
    // No horizontal page scroll.
    const scrolls = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(scrolls).toBeLessThanOrEqual(1);
  });
}