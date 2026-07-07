import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";
import os from "os";

test("Interview Prep exports a real PDF with questions", async ({ page }) => {
  await page.goto("/interview-prep");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /^PDF$/ }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download pdf/i }).click();
  const download = await downloadPromise;

  const tmpPath = path.join(os.tmpdir(), `interview-${Date.now()}.pdf`);
  await download.saveAs(tmpPath);
  const raw = readFileSync(tmpPath, "binary");
  expect(raw.startsWith("%PDF"), "output is a PDF").toBe(true);
  expect(raw.length).toBeGreaterThan(5_000);
});

test("Cheat Sheet PDF export contains expected chapter content", async ({ page }) => {
  await page.goto("/cheat-sheet");
  await page.waitForLoadState("networkidle");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download.*pdf/i }).first().click();
  const download = await downloadPromise;

  const tmpPath = path.join(os.tmpdir(), `cheat-sheet-${Date.now()}.pdf`);
  await download.saveAs(tmpPath);
  const raw = readFileSync(tmpPath, "binary");
  expect(raw.startsWith("%PDF"), "output is a PDF").toBe(true);
  expect(raw.length).toBeGreaterThan(20_000);
  expect(download.suggestedFilename()).toMatch(/cheat-sheet.*\.pdf$/i);
  // First and last chapter headers should be present in the PDF stream.
  expect(raw).toContain("(Chapter 1)");
  expect(raw).toContain("(Chapter 20)");
  // Brand and author appear in the cover / footer.
  expect(raw.toLowerCase()).toContain("sagacss");
});

test("Copy CSS button flips to 'Copied', shows a toast, and clipboard has valid CSS", async ({
  page,
  context,
  browserName,
  baseURL,
}) => {
  test.skip(browserName !== "chromium", "clipboard permissions only wired for chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: baseURL ?? "http://127.0.0.1:4173",
  });

  await page.goto("/tools/gradient");
  await page.waitForLoadState("networkidle");

  const copyBtn = page.getByRole("button", { name: /^copy( css)?$/i }).first();
  await copyBtn.click();

  // Visible success state on the button.
  await expect(copyBtn).toHaveText(/copied/i);
  // Sonner toast confirms the action.
  await expect(page.getByText(/copied/i).first()).toBeVisible();

  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip.length).toBeGreaterThan(10);
  // Gradient tool must emit a background-image gradient declaration.
  expect(clip).toMatch(/background(-image)?\s*:\s*[^;]*gradient\(/i);
});
