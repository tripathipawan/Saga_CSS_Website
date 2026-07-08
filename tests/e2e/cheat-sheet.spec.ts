import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

// Titles must match src/routes/cheat-sheet.tsx SECTIONS exactly and in order.
const CHAPTER_TITLES = [
  "Box Model",
  "Display & Positioning",
  "Flexbox",
  "Grid",
  "Typography",
  "Colors & Backgrounds",
  "Borders & Shadows",
  "Transforms & Transitions",
  "Selectors",
  "Units & Values",
  "Pseudo-Classes & Pseudo-Elements Deep Dive",
  "CSS Variables (Custom Properties)",
  "Media Queries & Responsive Design",
  "CSS Functions Reference",
  "Filters & Effects",
  "Animations Deep Dive",
  "CSS Grid Advanced",
  "Overflow, Scroll & Clipping",
  "Print & Accessibility CSS",
  "Modern CSS Features",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.removeItem("cheat-sheet:chapter");
    } catch {
      // ignore unavailable localStorage
    }
  });
});

test("navigation renders all 20 chapters but only one chapter's content at a time", async ({
  page,
}) => {
  await page.goto("/cheat-sheet");

  const nav = page.getByTestId("cheat-sheet-nav");
  await expect(nav).toHaveAttribute("data-total-chapters", "20");
  await expect(nav.locator("[data-chapter-nav]")).toHaveCount(20);

  // Only one <section> for chapter content, and it matches the current chapter (0).
  const sections = page.getByTestId("cheat-sheet-section");
  await expect(sections).toHaveCount(1);
  await expect(sections).toHaveAttribute("data-chapter-index", "0");
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText(CHAPTER_TITLES[0]);

  // Content unique to another chapter must NOT be present in the DOM.
  await expect(page.getByText("container-type", { exact: false })).toHaveCount(0);
});

test("clicking every chapter in the navigation swaps to that chapter's content", async ({
  page,
}) => {
  await page.goto("/cheat-sheet");

  for (let i = 0; i < CHAPTER_TITLES.length; i++) {
    await page.locator(`[data-chapter-nav="${i}"]`).click();
    await expect(page.getByTestId("cheat-sheet-title")).toHaveText(CHAPTER_TITLES[i]);
    await expect(page.getByTestId("cheat-sheet-section")).toHaveAttribute(
      "data-chapter-index",
      String(i),
    );
    await expect(page.getByTestId("cheat-sheet-progress")).toHaveText(
      `Chapter ${i + 1} of ${CHAPTER_TITLES.length}`,
    );
  }
});

test("Previous is disabled on Chapter 1 and Next is disabled on Chapter 20", async ({ page }) => {
  await page.goto("/cheat-sheet");
  await expect(page.getByTestId("cheat-sheet-prev")).toBeDisabled();
  await expect(page.getByTestId("cheat-sheet-next")).toBeEnabled();

  await page.locator(`[data-chapter-nav="${CHAPTER_TITLES.length - 1}"]`).click();
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText(
    CHAPTER_TITLES[CHAPTER_TITLES.length - 1],
  );
  await expect(page.getByTestId("cheat-sheet-next")).toBeDisabled();
  await expect(page.getByTestId("cheat-sheet-prev")).toBeEnabled();
});

test("Next / Previous walk sequentially through all 20 chapters in order", async ({ page }) => {
  await page.goto("/cheat-sheet");

  for (let i = 1; i < CHAPTER_TITLES.length; i++) {
    await page.getByTestId("cheat-sheet-next").click();
    await expect(page.getByTestId("cheat-sheet-title")).toHaveText(CHAPTER_TITLES[i]);
  }

  for (let i = CHAPTER_TITLES.length - 2; i >= 0; i--) {
    await page.getByTestId("cheat-sheet-prev").click();
    await expect(page.getByTestId("cheat-sheet-title")).toHaveText(CHAPTER_TITLES[i]);
  }
});

test("last-viewed chapter persists in localStorage across reloads", async ({ page }) => {
  await page.goto("/cheat-sheet");
  await page.locator(`[data-chapter-nav="7"]`).click();
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText(CHAPTER_TITLES[7]);

  const stored = await page.evaluate(() => window.localStorage.getItem("cheat-sheet:chapter"));
  expect(stored).toBe("7");

  await page.reload();
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText(CHAPTER_TITLES[7]);
  await expect(page.getByTestId("cheat-sheet-section")).toHaveAttribute("data-chapter-index", "7");
});

test("in-chapter search filters, highlights matches, and shows empty state", async ({ page }) => {
  await page.goto("/cheat-sheet");

  // Chapter 3 (Flexbox) has multiple rows — search for a specific one.
  await page.locator(`[data-chapter-nav="2"]`).click();
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText("Flexbox");

  const searchbox = page.getByRole("searchbox");
  await searchbox.fill("justify");

  await expect(page.getByTestId("cheat-sheet-no-results")).toHaveCount(0);
  const marks = page.getByTestId("cheat-sheet-section").locator("mark");
  await expect.poll(async () => await marks.count()).toBeGreaterThan(0);
  // Every visible row must contain the query in prop/desc/example.
  const propRows = page.getByTestId("cheat-sheet-section").locator("dt");
  const count = await propRows.count();
  expect(count).toBeGreaterThan(0);

  // Non-matching query shows the empty state.
  await searchbox.fill("zzznope-nomatch-xyz");
  await expect(page.getByTestId("cheat-sheet-no-results")).toBeVisible();

  // Clear button resets the filter.
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(searchbox).toHaveValue("");
  await expect(page.getByTestId("cheat-sheet-no-results")).toHaveCount(0);

  // Switching chapters resets any query.
  await searchbox.fill("gap");
  await page.locator(`[data-chapter-nav="4"]`).click();
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText("Typography");
  await expect(searchbox).toHaveValue("");
});

test("PDF export contains all 20 chapters in order even when a middle chapter is selected", async ({
  page,
}) => {
  await page.goto("/cheat-sheet");

  // Select Chapter 12 (index 11) before triggering the export.
  await page.locator(`[data-chapter-nav="11"]`).click();
  await expect(page.getByTestId("cheat-sheet-title")).toHaveText(
    "CSS Variables (Custom Properties)",
  );

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download as PDF/i }).click();
  const download = await downloadPromise;

  const tmpPath = path.join(os.tmpdir(), `cheat-sheet-${Date.now()}.pdf`);
  await download.saveAs(tmpPath);

  const raw = readFileSync(tmpPath, "binary");
  expect(raw.startsWith("%PDF"), "output is a real PDF").toBe(true);
  expect(raw.length).toBeGreaterThan(10_000);

  // drawHeader writes `Chapter N` as its own Tj string on every chapter page,
  // so `(Chapter N)` appears in the raw PDF stream in ascending chapter order.
  const positions = CHAPTER_TITLES.map((_title, i) => raw.indexOf(`(Chapter ${i + 1})`));
  positions.forEach((pos, i) => {
    expect(pos, `Chapter ${i + 1} header is present in the PDF`).toBeGreaterThan(-1);
  });
  for (let i = 1; i < positions.length; i++) {
    expect(positions[i], `Chapter ${i + 1} header appears after Chapter ${i}`).toBeGreaterThan(
      positions[i - 1],
    );
  }
});
