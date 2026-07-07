import { test, expect } from "@playwright/test";
import { SOCIAL_HREFS } from "../../src/lib/socials";

/**
 * Regression guard: every social profile listed in src/lib/socials.ts
 * MUST appear in the site-wide JSON-LD `sameAs` array AND be linked from
 * the rendered footer, so future edits can't silently drop a profile.
 */
test("JSON-LD sameAs and footer contain every SOCIAL_HREF", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // JSON-LD block from the root route.
  const ldJson = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(ldJson, "root JSON-LD script exists").toBeTruthy();
  const parsed = JSON.parse(ldJson!);
  const sameAs: string[] = parsed?.author?.sameAs ?? [];
  expect(Array.isArray(sameAs)).toBe(true);

  for (const href of SOCIAL_HREFS) {
    expect(sameAs, `sameAs is missing ${href}`).toContain(href);
    // Footer link count for this href — should be exactly one.
    const linkCount = await page.locator(`footer a[href="${href}"]`).count();
    expect(linkCount, `footer is missing link to ${href}`).toBeGreaterThan(0);
  }
});
