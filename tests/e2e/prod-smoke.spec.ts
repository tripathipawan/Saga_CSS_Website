import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

// Smoke test the deployed production URL. Enabled only when PROD_URL is set:
//   PROD_URL=https://csscraft.lovable.app bunx playwright test tests/e2e/prod-smoke.spec.ts
const PROD_URL = process.env.PROD_URL;

test.skip(!PROD_URL, "PROD_URL is not set — skipping prod smoke tests");

test.use({ baseURL: PROD_URL || undefined });

const ROUTES = [
  "/",
  "/about",
  "/faq",
  "/contact",
  "/blog",
  "/cheat-sheet",
  "/interview-prep",
  "/my-kit",
  "/tools/gradient",
  "/tools/box-shadow",
  "/tools/color-palette",
  "/tools/animation",
  "/styles/glassmorphism",
];

for (const route of ROUTES) {
  test(`prod route responds 200: ${route}`, async ({ page }) => {
    const resp = await page.goto(route);
    expect(resp?.status(), `expected 200 on ${route}`).toBeLessThan(400);
    // Body should contain the SagaCSS brand string somewhere.
    await expect(page.locator("body")).toContainText(/sagacss/i, { timeout: 10_000 });
  });
}

test("prod: copy-to-clipboard on gradient tool", async ({ page, context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(baseURL!).origin,
  });
  await page.goto("/tools/gradient");
  await page.waitForLoadState("networkidle");
  const copyBtn = page.getByRole("button", { name: /^copy( css)?$/i }).first();
  await copyBtn.click();
  await expect(copyBtn).toHaveText(/copied/i);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toMatch(/gradient\(/i);
});

test("prod: Cheat Sheet PDF downloads", async ({ page }) => {
  await page.goto("/cheat-sheet");
  await page.waitForLoadState("networkidle");
  const downloadPromise = page.waitForEvent("download", { timeout: 45_000 });
  await page.getByRole("button", { name: /download.*pdf/i }).first().click();
  const download = await downloadPromise;
  const tmpPath = path.join(os.tmpdir(), `prod-cheat-${Date.now()}.pdf`);
  await download.saveAs(tmpPath);
  const raw = readFileSync(tmpPath, "binary");
  expect(raw.startsWith("%PDF")).toBe(true);
  expect(raw.length).toBeGreaterThan(20_000);
});
