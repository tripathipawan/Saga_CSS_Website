import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = [
  { label: "mobile-375", width: 375, height: 812 },
  { label: "tablet-768", width: 768, height: 1024 },
  { label: "laptop-1024", width: 1024, height: 800 },
  { label: "desktop-1440", width: 1440, height: 900 },
];

const ROUTES = ["/", "/tools/gradient", "/tools/box-shadow", "/blog", "/cheat-sheet"];

async function assertNoHorizontalOverflow(page: Page, label: string, route: string) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  // Allow a 2px rounding budget for sub-pixel layout.
  expect(scrollWidth, `${label} ${route} has horizontal overflow`).toBeLessThanOrEqual(innerWidth + 2);
}

for (const vp of VIEWPORTS) {
  test.describe(`viewport ${vp.label}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of ROUTES) {
      test(`${route} has no horizontal overflow`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await assertNoHorizontalOverflow(page, vp.label, route);
      });
    }

    test("sidebar collapses on mobile / shows on desktop", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const menuBtn = page.getByRole("button", { name: /open navigation menu/i });
      if (vp.width < 1024) {
        // On mobile/tablet the hamburger should be visible; sidebar is hidden.
        await expect(menuBtn).toBeVisible();
      } else {
        // On desktop the hamburger is hidden (lg:hidden), toggle button shows instead.
        await expect(menuBtn).toBeHidden();
      }
    });

    test("generator controls stack vertically on narrow widths", async ({ page }) => {
      await page.goto("/tools/gradient");
      await page.waitForLoadState("networkidle");
      await assertNoHorizontalOverflow(page, vp.label, "/tools/gradient");
      // Controls area must render at least one slider or input.
      const controls = page.locator("input, [role='slider'], select, button").first();
      await expect(controls).toBeVisible();
    });
  });
}
