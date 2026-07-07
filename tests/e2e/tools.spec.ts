import { test, expect, type Page } from "@playwright/test";

const TOOLS = [
  "/tools/gradient",
  "/tools/border-radius",
  "/tools/box-shadow",
  "/tools/text-shadow",
  "/tools/animation",
  "/tools/3d-shapes",
  "/tools/box-sizing",
  "/tools/grid",
  "/tools/color-palette",
  "/tools/color-mixer",
  "/tools/contrast",
  "/tools/clip-path",
  "/tools/flexbox",
  "/tools/svg",
  "/tools/button",
  "/tools/bezier",
  "/tools/fonts",
  "/tools/filter",
  "/tools/clamp",
  "/styles/neumorphism",
  "/styles/glassmorphism",
  "/styles/claymorphism",
  "/styles/neubrutalism",
];

async function readTab(page: Page, name: "CSS" | "Tailwind" | "Bootstrap") {
  // Click the visible tab button inside the sticky code panel.
  const btn = page
    .getByRole("button", { name, exact: true })
    .locator("visible=true")
    .first();
  await btn.click();
  // Wait one animation frame for React to flush.
  await page.waitForFunction((n) => {
    const b = [...document.querySelectorAll('button[aria-pressed="true"]')]
      .find((el) => el.textContent?.trim() === n);
    return Boolean(b);
  }, name);
  const code = await page.locator("pre code:visible").first().innerText();
  return code.trim();
}

for (const path of TOOLS) {
  test(`tool ${path} renders CSS / Tailwind / Bootstrap with distinct output`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(path);
    await expect(page.locator("pre code:visible").first()).toBeVisible();

    const css = await readTab(page, "CSS");
    const tailwind = await readTab(page, "Tailwind");
    const bootstrap = await readTab(page, "Bootstrap");

    expect(css.length, "CSS output should not be empty").toBeGreaterThan(0);
    expect(tailwind.length, "Tailwind output should not be empty").toBeGreaterThan(0);
    expect(bootstrap.length, "Bootstrap output should not be empty").toBeGreaterThan(0);

    // Tailwind and Bootstrap should read as markup (contain a tag), not raw CSS rulesets.
    expect(tailwind, "Tailwind output should contain HTML markup").toMatch(/<\w+/);
    expect(bootstrap, "Bootstrap output should contain HTML markup").toMatch(/<\w+/);

    // At least two of the three outputs must differ.
    const distinct = new Set([css, tailwind, bootstrap]).size;
    expect(distinct, "outputs should be distinct across formats").toBeGreaterThanOrEqual(2);

    expect(errors, `no page errors on ${path}`).toEqual([]);
  });
}

test("copy-to-clipboard writes the visible code (Gradient / Tailwind)", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/tools/gradient");
  await readTab(page, "Tailwind");
  const expected = (await page.locator("pre code:visible").first().innerText()).trim();
  await page
    .getByRole("button", { name: /^Copy .* to clipboard$/ })
    .locator("visible=true")
    .first()
    .click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.trim()).toBe(expected);
});

test("color-converter renders every format row with a working copy button", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("/tools/color-converter");

  const formats = ["HEX", "RGB", "RGBA", "HSL", "HSLA", "HWB", "CMYK", "LCH", "XYZ", "Named"];
  for (const label of formats) {
    const row = page.locator("div", { hasText: new RegExp(`^${label}\\s`) }).first();
    await expect(row, `${label} row visible`).toBeVisible();
  }

  const hexRow = page.locator("div").filter({ hasText: /^HEX/ }).first();
  const value = (await hexRow.locator("code").first().innerText()).trim();
  expect(value.length, "HEX value non-empty").toBeGreaterThan(0);

  await page.getByRole("button", { name: "Copy HEX value" }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.trim()).toBe(value);

  expect(errors, "no page errors on color-converter").toEqual([]);
});