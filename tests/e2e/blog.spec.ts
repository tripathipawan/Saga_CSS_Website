import { test, expect } from "@playwright/test";

/**
 * Blog-specific e2e coverage:
 *  - tag filtering (URL + rendered posts + empty state)
 *  - active tag reflected in <title> and <h1>
 *  - canonical + rel=prev/next link tags on listing and paginated routes
 *  - Open Graph metadata on each individual post page
 */

const POST_SLUGS = ["why-sagacss", "gradients-that-do-not-look-muddy", "shadow-layering"];

test.describe("blog post share buttons", () => {
  test("share links carry the page's URL, title, and description", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const slug = "why-sagacss";
    await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" });

    const meta = await page.evaluate(() => ({
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
      description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      origin: window.location.origin,
    }));

    const expectedUrl = `${meta.origin}/blog/${slug}`;
    const encodedUrl = encodeURIComponent(expectedUrl);
    // ShareButtons component uses the raw post.title (h1), not the branded document.title.
    const encodedTitle = encodeURIComponent(meta.h1);

    const x = page.getByRole("link", { name: "Share on X" });
    const linkedin = page.getByRole("link", { name: "Share on LinkedIn" });
    const facebook = page.getByRole("link", { name: "Share on Facebook" });
    const whatsapp = page.getByRole("link", { name: "Share on WhatsApp" });

    await expect(x).toHaveAttribute(
      "href",
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    );
    await expect(linkedin).toHaveAttribute(
      "href",
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    );
    await expect(facebook).toHaveAttribute(
      "href",
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedTitle}`,
    );
    await expect(whatsapp).toHaveAttribute(
      "href",
      `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    );

    // All share links open in a new tab with safe rel attributes.
    for (const link of [x, linkedin, facebook, whatsapp]) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }

    // Copy-link button (no native share in headless) writes the canonical URL.
    // Force navigator.share undefined so the fallback clipboard path runs.
    await page.evaluate(() => {
      // @ts-expect-error test override
      delete (window.navigator as unknown as { share?: unknown }).share;
    });
    await page.getByRole("button", { name: "Copy link to this post" }).click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe(expectedUrl);

    // Sanity: meta description exists and is what SEO tooling would surface.
    expect(meta.description).toBeTruthy();
    expect(meta.ogTitle).toContain(meta.h1);
  });
});

test.describe("blog category filter", () => {
  test("filters posts by category and reflects it in title + heading", async ({ page }) => {
    await page.goto("/blog?category=Layout", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("Layout");
    await expect(page).toHaveTitle(/Layout/);
    await expect(page.getByRole("link", { name: /Flexbox vs Grid/i }).first()).toBeVisible();
  });

  test("shows empty state with clear-filters action for unknown category", async ({ page }) => {
    await page.goto("/blog?category=DoesNotExist", { waitUntil: "domcontentloaded" });
    const empty = page.getByTestId("blog-empty-state");
    await expect(empty).toBeVisible();
    const clear = empty.getByRole("link", { name: /clear filters/i });
    await expect(clear).toBeVisible();
    await clear.click();
    await expect(page).toHaveURL(/\/blog\/?$/);
  });
});

test.describe("blog pagination link tags", () => {
  test("/blog has canonical and rel=next but no rel=prev", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    const links = await page.evaluate(() =>
      Array.from(document.head.querySelectorAll("link")).map((l) => ({
        rel: l.getAttribute("rel"),
        href: l.getAttribute("href"),
      })),
    );
    const canonical = links.filter((l) => l.rel === "canonical");
    const next = links.filter((l) => l.rel === "next");
    const prev = links.filter((l) => l.rel === "prev");
    expect(canonical).toHaveLength(1);
    expect(canonical[0].href).toBe("/blog");
    expect(next).toHaveLength(1);
    expect(next[0].href).toContain("/blog/page/2");
    expect(prev).toHaveLength(0);
  });

  test("/blog/page/2 has canonical + rel=prev pointing back to /blog", async ({ page }) => {
    await page.goto("/blog/page/2", { waitUntil: "domcontentloaded" });
    const links = await page.evaluate(() =>
      Array.from(document.head.querySelectorAll("link")).map((l) => ({
        rel: l.getAttribute("rel"),
        href: l.getAttribute("href"),
      })),
    );
    expect(links.find((l) => l.rel === "canonical")?.href).toBe("/blog/page/2");
    const prev = links.find((l) => l.rel === "prev");
    expect(prev, "missing rel=prev on /blog/page/2").toBeTruthy();
    expect(prev!.href).toMatch(/\/blog(\?|$)/);
  });
});

test.describe("blog post OpenGraph metadata", () => {
  for (const slug of POST_SLUGS) {
    test(`/blog/${slug} exposes complete OG + canonical`, async ({ page }) => {
      const resp = await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" });
      expect(resp?.ok()).toBeTruthy();

      const meta = await page.evaluate(() => {
        const q = (sel: string) => document.head.querySelector(sel);
        const c = (el: Element | null) => el?.getAttribute("content") ?? null;
        return {
          title: document.title,
          ogTitle: c(q('meta[property="og:title"]')),
          ogDescription: c(q('meta[property="og:description"]')),
          ogType: c(q('meta[property="og:type"]')),
          ogUrl: c(q('meta[property="og:url"]')),
          twitterCard: c(q('meta[name="twitter:card"]')),
          canonical: q('link[rel="canonical"]')?.getAttribute("href") ?? null,
          articlePublished: c(q('meta[property="article:published_time"]')),
        };
      });

      expect(meta.title).toMatch(/SagaCSS/);
      expect(meta.ogTitle).toBeTruthy();
      expect(meta.ogDescription).toBeTruthy();
      expect(meta.ogType).toBe("article");
      expect(meta.ogUrl).toBe(`/blog/${slug}`);
      expect(meta.twitterCard).toBe("summary_large_image");
      expect(meta.canonical).toBe(`/blog/${slug}`);
      // No dates are rendered anywhere on the blog — content is evergreen.
      expect(meta.articlePublished).toBeNull();
    });
  }
});
