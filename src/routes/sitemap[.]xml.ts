import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BLOG_POSTS } from "@/lib/blog";

const BASE_URL = "https://csscraft.lovable.app";

const PATHS = [
  "/",
  "/about",
  "/faq",
  "/contact",
  "/blog",
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
  "/privacy",
  "/terms",
  "/cookies",
  "/settings",
  "/tools/gradient",
  "/tools/border-radius",
  "/tools/box-shadow",
  "/tools/text-shadow",
  "/tools/animation",
  "/tools/3d-shapes",
  "/tools/box-sizing",
  "/tools/color-palette",
  "/tools/color-converter",
  "/tools/color-mixer",
  "/tools/contrast",
  "/tools/clip-path",
  "/tools/flexbox",
  "/tools/grid",
  "/tools/svg",
  "/tools/button",
  "/tools/bezier",
  "/tools/fonts",
  "/tools/filter",
  "/tools/image-text",
  "/tools/preprocessor",
  "/tools/base64",
  "/tools/clamp",
  "/tools/theme-variables",
  "/tools/reset",
  "/tools/scrollbar",
  "/tools/spinner",
  "/tools/theme",
  "/tools/compatibility",
  "/tools/specificity",
  "/tools/responsive",
  "/styles/neumorphism",
  "/styles/glassmorphism",
  "/styles/claymorphism",
  "/styles/neubrutalism",
  "/styles/y2k",
  "/styles/cyberpunk",
  "/styles/art-deco",
  "/my-kit",
  "/cheat-sheet",
  "/interview-prep",
  "/practice",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = PATHS.map((p) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${p}</loc>`,
            `    <changefreq>weekly</changefreq>`,
            `    <priority>${p === "/" ? "1.0" : "0.7"}</priority>`,
            `  </url>`,
          ].join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
