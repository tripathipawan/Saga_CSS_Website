import { test, expect } from "@playwright/test";

test.describe("My Kit", () => {
  test.beforeEach(async ({ context }) => {
    // Auto-accept prompt() dialog with a snippet label.
    context.on("page", (p) => {
      p.on("dialog", (d) => d.accept("Test snippet"));
    });
  });

  test("save from multiple tools, select, and combine-export", async ({ page }) => {
    page.on("dialog", (d) => d.accept("Test snippet"));

    // 1. Save a snippet from the Border Radius tool
    await page.goto("/tools/border-radius");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /save snippet to my kit/i }).first().click();

    // 2. Save a snippet from the Box Shadow tool
    await page.goto("/tools/box-shadow");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /save snippet to my kit/i }).first().click();

    // 3. Navigate to My Kit — both snippets should appear
    await page.goto("/my-kit");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/2 snippets/i)).toBeVisible();

    // 4. Select both snippets
    const checkboxes = page.getByRole("checkbox");
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) await checkboxes.nth(i).click();

    await expect(page.getByText(/2 selected/i)).toBeVisible();

    // 5. Trigger combine & export (raw CSS)
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      (async () => {
        await page.getByRole("button", { name: /combine.*export/i }).click();
        await page.getByRole("menuitem", { name: /raw css/i }).click();
      })(),
    ]);
    expect(download.suggestedFilename()).toBe("my-kit.css");

    // 6. Delete one snippet
    await page.getByRole("button", { name: /delete snippet/i }).first().click();
    await expect(page.getByText(/1 snippet/i)).toBeVisible();

    // 7. Clear all (two-step confirm)
    await page.getByRole("button", { name: /^clear all$/i }).click();
    await page.getByRole("button", { name: /confirm clear/i }).click();
    await expect(page.getByText(/your kit is empty/i)).toBeVisible();
  });

  test("tabbed HTML export produces valid file", async ({ page }) => {
    page.on("dialog", (d) => d.accept("Test"));
    await page.goto("/tools/gradient");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /save snippet to my kit/i }).first().click();

    await page.goto("/my-kit");
    await page.waitForLoadState("networkidle");
    await page.getByRole("checkbox").first().click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      (async () => {
        await page.getByRole("button", { name: /combine.*export/i }).click();
        await page.getByRole("menuitem", { name: /tabbed html/i }).click();
      })(),
    ]);
    expect(download.suggestedFilename()).toBe("my-kit-tabs.html");

    // Cleanup for isolation.
    await page.getByRole("button", { name: /^clear all$/i }).click();
    await page.getByRole("button", { name: /confirm clear/i }).click();
  });
});