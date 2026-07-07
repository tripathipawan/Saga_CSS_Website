import { test, expect } from "@playwright/test";

/**
 * Footer regression checks:
 *  - the footer shows the correct support email on every public route
 *  - the "Contact us" mailto button uses sagacss.ind@gmail.com
 */

const ROUTES = ["/", "/about", "/blog", "/contact", "/faq", "/tools/gradient"];

const EXPECTED_EMAIL = "sagacss.ind@gmail.com";

for (const path of ROUTES) {
  test(`footer on ${path} shows ${EXPECTED_EMAIL}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    const footer = page.locator("footer");
    await expect(footer).toContainText(EXPECTED_EMAIL);

    const mailtoLink = footer.locator(`a[href="mailto:${EXPECTED_EMAIL}"]`).first();
    await expect(mailtoLink).toBeVisible();

    const contactButton = footer.getByRole("link", { name: "Contact us", exact: true });
    await expect(contactButton).toHaveAttribute("href", `mailto:${EXPECTED_EMAIL}`);
  });
}
