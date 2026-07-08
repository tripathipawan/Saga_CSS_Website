import { test, expect, type Page } from "@playwright/test";

/**
 * Focused generator coverage — preset -> CSS output -> clipboard.
 *
 * The Tools + Copy suite in `tools.spec.ts` proves every tool renders CSS /
 * Tailwind / Bootstrap with distinct output and that Gradient's copy button
 * writes the visible code. These tests pin down the *semantic* correctness
 * of the Border Radius and Gradient generators: after clicking a preset,
 * the generated CSS matches the well-known shape for that preset, and the
 * copy button places that exact CSS on the clipboard.
 */

async function readVisibleCss(page: Page) {
  return (await page.locator("pre code:visible").first().innerText()).trim();
}

async function copyAndReadClipboard(page: Page) {
  await page
    .getByRole("button", { name: "Copy CSS to clipboard" })
    .locator("visible=true")
    .first()
    .click();
  return (await page.evaluate(() => navigator.clipboard.readText())).trim();
}

test.describe("Border Radius Generator presets", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("Circle preset emits 50% on every corner and copies verbatim", async ({ page }) => {
    await page.goto("/tools/border-radius");
    await page.getByRole("button", { name: "Load Circle preset" }).click();

    const css = await readVisibleCss(page);
    expect(css).toBe("border-radius: 50% 50% 50% 50%;");

    const clipboard = await copyAndReadClipboard(page);
    expect(clipboard).toBe(css);
  });

  test("Squircle preset emits uniform 24% corners", async ({ page }) => {
    await page.goto("/tools/border-radius");
    await page.getByRole("button", { name: "Load Squircle preset" }).click();
    const css = await readVisibleCss(page);
    expect(css).toBe("border-radius: 24% 24% 24% 24%;");
  });

  test("Leaf preset emits opposite-corner asymmetry", async ({ page }) => {
    await page.goto("/tools/border-radius");
    await page.getByRole("button", { name: "Load Leaf preset" }).click();
    const css = await readVisibleCss(page);
    expect(css).toBe("border-radius: 50% 0% 50% 0%;");
  });

  test("Blob preset emits organic slash-notation radius", async ({ page }) => {
    await page.goto("/tools/border-radius");
    await page.getByRole("button", { name: "Load Blob preset" }).click();
    const css = await readVisibleCss(page);
    // Organic mode uses the four-h / four-v syntax.
    expect(css).toMatch(/^border-radius:\s*\d+% \d+% \d+% \d+%\s*\/\s*\d+% \d+% \d+% \d+%;$/);
    expect(css).toContain(" / ");
  });
});

test.describe("Gradient Generator presets", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("Sunset preset produces a linear 135deg gradient and copies it", async ({ page }) => {
    await page.goto("/tools/gradient");
    await page.getByRole("button", { name: "Load preset Sunset" }).click();

    const css = await readVisibleCss(page);
    expect(css).toBe("background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);");

    const clipboard = await copyAndReadClipboard(page);
    expect(clipboard).toBe(css);
  });

  test("switching presets updates the CSS output", async ({ page }) => {
    await page.goto("/tools/gradient");

    await page.getByRole("button", { name: "Load preset Sunset" }).click();
    const sunset = await readVisibleCss(page);
    expect(sunset).toContain("linear-gradient(135deg");
    expect(sunset).toContain("#ff9966");

    await page.getByRole("button", { name: "Load preset Ocean" }).click();
    const ocean = await readVisibleCss(page);
    expect(ocean).toContain("linear-gradient(90deg");
    expect(ocean).toContain("#2E3192");
    expect(ocean).not.toBe(sunset);

    await page.getByRole("button", { name: "Load preset Cosmic" }).click();
    const cosmic = await readVisibleCss(page);
    expect(cosmic).toContain("radial-gradient(circle at center");
    expect(cosmic).toContain("#ff00cc");

    await page.getByRole("button", { name: "Load preset Citrus" }).click();
    const citrus = await readVisibleCss(page);
    expect(citrus).toContain("conic-gradient(from 0deg at center");
    expect(citrus).toContain("#f7971e");
  });

  test("changing the angle updates the CSS output in place", async ({ page }) => {
    await page.goto("/tools/gradient");
    await page.getByRole("button", { name: "Load preset Sunset" }).click();
    const before = await readVisibleCss(page);
    expect(before).toContain("linear-gradient(135deg");

    const angleInput = page.getByLabel("Gradient angle in degrees");
    await angleInput.fill("270");
    await angleInput.blur();

    const after = await readVisibleCss(page);
    expect(after).toContain("linear-gradient(270deg");
    expect(after).not.toBe(before);

    const clipboard = await copyAndReadClipboard(page);
    expect(clipboard).toBe(after);
  });
});
