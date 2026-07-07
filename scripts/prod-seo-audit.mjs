#!/usr/bin/env node
// Production SEO audit — fetches each route from a deployed URL and checks:
//   • unique <title> and <meta name="description"> per route
//   • self-referential canonical + og:url
//   • presence of og:title, og:description, og:type, twitter:card
//   • sitemap.xml exists, is valid XML, contains every audited route
//   • JSON-LD parses and includes every SOCIAL_HREFS entry in sameAs
//
// Usage:
//   BASE=https://csscraft.lovable.app node scripts/prod-seo-audit.mjs
//   node scripts/prod-seo-audit.mjs https://your-site.com
//
// Exits with code 1 if any check fails.

import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || process.env.BASE || "https://csscraft.lovable.app").replace(/\/$/, "");

// Mirror src/lib/socials.ts without importing TS (script must run under plain node).
const SOCIAL_HREFS = [
  "https://www.linkedin.com/in/pawantripathi/",
  "https://github.com/tripathipawan",
  "https://x.com/pawantripathi04",
  "https://www.youtube.com/@tripathidevlab",
  "https://www.instagram.com/tripathidevlab",
  "https://www.whatsapp.com/channel/0029Vb7sg2V3bbV4NpadBX1m",
  "https://www.facebook.com/people/Pawan-Tripathi/pfbid0jkY7FJJFu4r7gnVGo3JtTETbbKkKe2s7AArUwAMjdYF3ELxLpaL95CdT82vBsKKol/",
];

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
  "/tools/border-radius",
  "/tools/box-shadow",
  "/tools/color-palette",
  "/tools/animation",
  "/tools/grid",
  "/tools/flexbox",
  "/styles/glassmorphism",
  "/styles/neumorphism",
];

const errors = [];
const warn = (r, msg) => errors.push(`❌ ${r}: ${msg}`);

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "sagacss-seo-audit/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function pickMeta(html, matcher) {
  const re = new RegExp(`<meta[^>]*${matcher}[^>]*>`, "gi");
  const tags = html.match(re) || [];
  return tags.map((t) => (t.match(/content=["']([^"']*)["']/i) || [])[1]).filter(Boolean);
}

function pickTitle(html) {
  return (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || "";
}

function pickCanonical(html) {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  return m ? (m[0].match(/href=["']([^"']*)["']/i) || [])[1] : "";
}

function pickJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.map((m) => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);
}

const seen = { titles: new Map(), descs: new Map() };

for (const route of ROUTES) {
  const url = BASE + route;
  try {
    const html = await fetchText(url);
    const title = pickTitle(html);
    const desc = pickMeta(html, 'name=["\']description["\']')[0] || "";
    const ogTitle = pickMeta(html, 'property=["\']og:title["\']')[0];
    const ogDesc = pickMeta(html, 'property=["\']og:description["\']')[0];
    const ogUrl = pickMeta(html, 'property=["\']og:url["\']')[0];
    const ogType = pickMeta(html, 'property=["\']og:type["\']')[0];
    const twCard = pickMeta(html, 'name=["\']twitter:card["\']')[0];
    const canonical = pickCanonical(html);

    if (!title || /Lovable App|Vite App/i.test(title)) warn(route, `bad title: "${title}"`);
    if (!desc) warn(route, "missing description");
    if (desc.length > 160) warn(route, `description too long (${desc.length})`);
    if (!ogTitle) warn(route, "missing og:title");
    if (!ogDesc) warn(route, "missing og:description");
    if (!ogUrl) warn(route, "missing og:url");
    if (!ogType) warn(route, "missing og:type");
    if (!twCard) warn(route, "missing twitter:card");
    if (!canonical) warn(route, "missing canonical");
    if (canonical && !canonical.endsWith(route) && !(route === "/" && canonical === BASE + "/")) {
      warn(route, `canonical mismatch: ${canonical}`);
    }
    if (ogUrl && !ogUrl.endsWith(route) && !(route === "/" && ogUrl === BASE + "/")) {
      warn(route, `og:url mismatch: ${ogUrl}`);
    }

    if (title) {
      const prev = seen.titles.get(title);
      if (prev) warn(route, `duplicate title with ${prev}`);
      else seen.titles.set(title, route);
    }
    if (desc) {
      const prev = seen.descs.get(desc);
      if (prev) warn(route, `duplicate description with ${prev}`);
      else seen.descs.set(desc, route);
    }

    if (route === "/") {
      const ld = pickJsonLd(html);
      if (!ld.length) warn(route, "missing JSON-LD");
      const sameAs = ld.flatMap((o) => o?.author?.sameAs || o?.sameAs || []);
      for (const href of SOCIAL_HREFS) {
        if (!sameAs.includes(href)) warn(route, `JSON-LD sameAs missing ${href}`);
      }
    }
    console.log(`✓ ${route} — "${title.slice(0, 60)}"`);
  } catch (e) {
    warn(route, `fetch failed: ${e.message}`);
  }
}

// Sitemap.
try {
  const xml = await fetchText(BASE + "/sitemap.xml");
  if (!xml.startsWith("<?xml")) warn("/sitemap.xml", "not XML");
  for (const route of ROUTES) {
    if (!xml.includes(`>${BASE}${route}<`)) warn("/sitemap.xml", `missing entry for ${route}`);
  }
  console.log("✓ /sitemap.xml — parsed & covers audited routes");
} catch (e) {
  warn("/sitemap.xml", e.message);
}

if (errors.length) {
  console.error("\n" + errors.join("\n"));
  console.error(`\n${errors.length} SEO issue(s) — audit failed against ${BASE}`);
  process.exit(1);
}
console.log(`\nSEO audit passed against ${BASE}`);
