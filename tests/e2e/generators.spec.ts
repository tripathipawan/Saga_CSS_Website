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

/**
 * Preset buttons are only wired up once client-side hydration finishes.
 * On SSR-rendered pages a click that lands before hydration completes is a
 * silent no-op (no handler attached yet), leaving the pre-hydration default
 * CSS in place. Retry the click until the visible CSS actually satisfies
 * the expected condition, same pattern as `readTab` in tools.spec.ts.
 */
async function clickPresetUntil(
  page: Page,
  buttonName: string,
  isApplied: (css: string) => boolean,
) {
  const btn = page.getByRole("button", { name: buttonName });
  await expect(btn).toBeVisible();

  const deadline = Date.now() + 25000;
  let applied = false;
  let css = await readVisibleCss(page);
  while (!applied && Date.now() < deadline) {
    await btn.click();
    try {
      await page.waitForFunction(
        () => {
          const el = document.querySelector("pre code:not([hidden])");
          return Boolean(el && el.textContent && el.textContent.trim().length > 0);
        },
        undefined,
        { polling: 100, timeout: 1000 },
      );
    } catch {
      // ignore — we check the actual condition below regardless
    }
    css = await readVisibleCss(page);
    applied = isApplied(css);
  }
  expect(applied, `preset "${buttonName}" should apply (last seen: ${css})`).toBe(true);
  return css;
}

test.describe("Border Radius Generator presets", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("Circle preset emits 50% on every corner and copies verbatim", async ({ page }) => {
    await page.goto("/tools/border-radius");
    const css = await clickPresetUntil(
      page,
      "Load Circle preset",
      (c) => c === "border-radius: 50% 50% 50% 50%;",
    );
    expect(css).toBe("border-radius: 50% 50% 50% 50%;");

    await page
      .getByRole("button", { name: "Copy CSS to clipboard" })
      .locator("visible=true")
      .first()
      .click();
    const clipboard = (await page.evaluate(() => navigator.clipboard.readText())).trim();
    expect(clipboard).toBe(css);
  });

  test("Squircle preset emits uniform 24% corners", async ({ page }) => {
    await page.goto("/tools/border-radius");
    const css = await clickPresetUntil(
      page,
      "Load Squircle preset",
      (c) => c === "border-radius: 24% 24% 24% 24%;",
    );
    expect(css).toBe("border-radius: 24% 24% 24% 24%;");
  });

  test("Leaf preset emits opposite-corner asymmetry", async ({ page }) => {
    await page.goto("/tools/border-radius");
    const css = await clickPresetUntil(
      page,
      "Load Leaf preset",
      (c) => c === "border-radius: 50% 0% 50% 0%;",
    );
    expect(css).toBe("border-radius: 50% 0% 50% 0%;");
  });

  test("Blob preset emits organic slash-notation radius", async ({ page }) => {
    await page.goto("/tools/border-radius");
    const pattern = /^border-radius:\s*\d+% \d+% \d+% \d+%\s*\/\s*\d+% \d+% \d+% \d+%;$/;
    const css = await clickPresetUntil(page, "Load Blob preset", (c) => pattern.test(c));
    // Organic mode uses the four-h / four-v syntax.
    expect(css).toMatch(pattern);
    expect(css).toContain(" / ");
  });
});

test.describe("Gradient Generator presets", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("Sunset preset produces a linear 135deg gradient and copies it", async ({ page }) => {
    await page.goto("/tools/gradient");
    const css = await clickPresetUntil(
      page,
      "Load preset Sunset",
      (c) => c === "background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);",
    );
    expect(css).toBe("background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);");

    await page
      .getByRole("button", { name: "Copy CSS to clipboard" })
      .locator("visible=true")
      .first()
      .click();
    const clipboard = (await page.evaluate(() => navigator.clipboard.readText())).trim();
    expect(clipboard).toBe(css);
  });

  test("switching presets updates the CSS output", async ({ page }) => {
    await page.goto("/tools/gradient");

    const sunset = await clickPresetUntil(page, "Load preset Sunset", (c) => c.includes("#ff9966"));
    expect(sunset).toContain("linear-gradient(135deg");
    expect(sunset).toContain("#ff9966");

    const ocean = await clickPresetUntil(page, "Load preset Ocean", (c) => c.includes("#2E3192"));
    expect(ocean).toContain("linear-gradient(90deg");
    expect(ocean).toContain("#2E3192");
    expect(ocean).not.toBe(sunset);

    const cosmic = await clickPresetUntil(page, "Load preset Cosmic", (c) => c.includes("#ff00cc"));
    expect(cosmic).toContain("radial-gradient(circle at center");
    expect(cosmic).toContain("#ff00cc");

    const citrus = await clickPresetUntil(page, "Load preset Citrus", (c) => c.includes("#f7971e"));
    expect(citrus).toContain("conic-gradient(from 0deg at center");
    expect(citrus).toContain("#f7971e");
  });

  test("changing the angle updates the CSS output in place", async ({ page }) => {
    await page.goto("/tools/gradient");
    const before = await clickPresetUntil(page, "Load preset Sunset", (c) =>
      c.includes("linear-gradient(135deg"),
    );
    expect(before).toContain("linear-gradient(135deg");

    const angleInput = page.getByLabel("Gradient angle in degrees");

    const deadline = Date.now() + 25000;
    let after = before;
    while (!after.includes("linear-gradient(270deg") && Date.now() < deadline) {
      await angleInput.fill("270");
      await angleInput.blur();
      after = await readVisibleCss(page);
    }
    expect(after).toContain("linear-gradient(270deg");
    expect(after).not.toBe(before);

    await page
      .getByRole("button", { name: "Copy CSS to clipboard" })
      .locator("visible=true")
      .first()
      .click();
    const clipboard = (await page.evaluate(() => navigator.clipboard.readText())).trim();
    expect(clipboard).toBe(after);
  });
});
