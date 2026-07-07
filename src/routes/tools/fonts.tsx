import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/fonts")({
  head: () => ({
    meta: [
      { title: "Font Pairing & Google Fonts Explorer | SagaCSS" },
      { name: "description", content: "Browse curated Google Fonts by category, pair heading and body fonts, and copy the <link>, CSS font-family and Tailwind config snippets in one click." },
      { property: "og:title", content: "Font Pairing — SagaCSS" },
      { property: "og:description", content: "Curated Google Fonts explorer with proven pairing suggestions." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/fonts" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/fonts" }],
  }),
  component: FontsPage,
});

type FontDef = { name: string; category: "Serif" | "Sans-serif" | "Display" | "Monospace" | "Handwriting"; family: string };
const FONTS: FontDef[] = [
  { name: "Inter", category: "Sans-serif", family: "Inter" },
  { name: "Roboto", category: "Sans-serif", family: "Roboto" },
  { name: "Poppins", category: "Sans-serif", family: "Poppins" },
  { name: "Montserrat", category: "Sans-serif", family: "Montserrat" },
  { name: "Work Sans", category: "Sans-serif", family: "Work Sans" },
  { name: "DM Sans", category: "Sans-serif", family: "DM Sans" },
  { name: "Playfair Display", category: "Serif", family: "Playfair Display" },
  { name: "Merriweather", category: "Serif", family: "Merriweather" },
  { name: "Lora", category: "Serif", family: "Lora" },
  { name: "Cormorant Garamond", category: "Serif", family: "Cormorant Garamond" },
  { name: "Bebas Neue", category: "Display", family: "Bebas Neue" },
  { name: "Abril Fatface", category: "Display", family: "Abril Fatface" },
  { name: "Anton", category: "Display", family: "Anton" },
  { name: "JetBrains Mono", category: "Monospace", family: "JetBrains Mono" },
  { name: "Fira Code", category: "Monospace", family: "Fira Code" },
  { name: "Space Mono", category: "Monospace", family: "Space Mono" },
  { name: "Caveat", category: "Handwriting", family: "Caveat" },
  { name: "Dancing Script", category: "Handwriting", family: "Dancing Script" },
];

const PAIRINGS: { heading: string; body: string; note: string }[] = [
  { heading: "Playfair Display", body: "Inter", note: "Editorial serif + neutral sans — classic magazine look." },
  { heading: "Poppins", body: "Roboto", note: "Modern geometric sans pairing — great for SaaS." },
  { heading: "Bebas Neue", body: "Work Sans", note: "Bold display + friendly sans — punchy landing pages." },
  { heading: "Abril Fatface", body: "Lora", note: "High-contrast serif + humanist serif — elegant and readable." },
  { heading: "Montserrat", body: "Merriweather", note: "Geometric sans headings + traditional serif body." },
  { heading: "DM Sans", body: "DM Sans", note: "Same-family pairing with weight contrast — safe and modern." },
  { heading: "Anton", body: "Roboto", note: "Condensed display + neutral body — bold and clean." },
  { heading: "Cormorant Garamond", body: "Montserrat", note: "Classical serif headings + modern sans body." },
];

function useLoadFonts(families: string[]) {
  useEffect(() => {
    if (!families.length) return;
    const spec = families
      .filter((f, i, a) => a.indexOf(f) === i)
      .map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700`)
      .join("&");
    const href = `https://fonts.googleapis.com/css2?${spec}&display=swap`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [families.join("|")]);
}

function FontsPage() {
  const [category, setCategory] = useState<string>("All");
  const [heading, setHeading] = useState("Playfair Display");
  const [body, setBody] = useState("Inter");
  const [preview, setPreview] = useState("The quick brown fox jumps over the lazy dog");

  const filtered = useMemo(() => FONTS.filter((f) => category === "All" || f.category === category), [category]);

  useLoadFonts([heading, body, ...filtered.map((f) => f.family)]);

  const categories = ["All", "Serif", "Sans-serif", "Display", "Monospace", "Handwriting"];

  const linkTag = `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(heading)}:wght@400;700&family=${encodeURIComponent(body)}:wght@400;600&display=swap" rel="stylesheet">`;
  const css = `${linkTag}\n\n/* CSS */\nh1, h2, h3 { font-family: "${heading}", serif; }\nbody { font-family: "${body}", sans-serif; }`;
  const tailwind = `// tailwind.config.ts\nextend: {\n  fontFamily: {\n    heading: ['"${heading}"', 'serif'],\n    body: ['"${body}"', 'sans-serif'],\n  },\n}\n\n// Usage\n<h1 class="font-heading">Title</h1>\n<p class="font-body">Body copy</p>`;
  const bootstrap = `<!-- HTML head — load fonts -->\n${linkTag}\n\n<!-- Bootstrap has no font-family utility; override the Sass variables before importing Bootstrap. -->\n@use "bootstrap/scss/utilities" as *;\n$headings-font-family: "${heading}", serif;\n$font-family-base: "${body}", sans-serif;`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Font Pairing & Google Fonts" description="Browse curated Google Fonts, load proven heading + body pairings, then copy the link tag and CSS in one shot." />

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <h2 className="text-4xl font-bold leading-tight" style={{ fontFamily: `"${heading}", serif` }}>{preview}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground" style={{ fontFamily: `"${body}", sans-serif` }}>{preview}. This paragraph uses the body font while the heading above uses the display face — the pairing shows up as visual hierarchy and typographic contrast.</p>
        <Input value={preview} onChange={(e) => setPreview(e.target.value)} className="mt-4" aria-label="Preview text" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <Label className="mb-2 block text-sm font-semibold">Suggested pairings</Label>
            <div className="grid gap-2">
              {PAIRINGS.map((p) => (
                <button key={p.heading + p.body} type="button" onClick={() => { setHeading(p.heading); setBody(p.body); }}
                  className={`rounded-md border p-2.5 text-left transition-colors ${heading === p.heading && body === p.body ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  aria-label={`Load pairing ${p.heading} + ${p.body}`}>
                  <div className="text-sm font-semibold">{p.heading} + {p.body}</div>
                  <div className="text-xs text-muted-foreground">{p.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-semibold">Browse fonts</Label>
            <div className="mb-2 flex flex-wrap gap-1">
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c}
                  className={`rounded-full border px-2.5 py-1 text-xs ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}>{c}</button>
              ))}
            </div>
            <div className="grid max-h-64 grid-cols-1 gap-1 overflow-auto pr-1">
              {filtered.map((f) => (
                <div key={f.name} className="flex items-center justify-between rounded-md border border-border bg-background p-2">
                  <span className="truncate text-lg" style={{ fontFamily: `"${f.family}", ${f.category === "Serif" ? "serif" : f.category === "Monospace" ? "monospace" : "sans-serif"}` }}>{f.name}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setHeading(f.family)} className="rounded border border-border px-2 py-0.5 text-xs hover:bg-accent" aria-label={`Use ${f.name} as heading`}>H</button>
                    <button type="button" onClick={() => setBody(f.family)} className="rounded border border-border px-2 py-0.5 text-xs hover:bg-accent" aria-label={`Use ${f.name} as body`}>B</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}