import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Star, Copy, Shuffle, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { PALETTES, CATEGORIES, type Palette } from "@/lib/palettes";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/color-palette")({
  head: () => ({
    meta: [
      { title: "Color Palette Library — SagaCSS" },
      {
        name: "description",
        content:
          "Browse 400+ curated color palettes, save favorites, or build your own and export as CSS custom properties, Tailwind config or Bootstrap SCSS.",
      },
      { property: "og:title", content: "Color Palette Library — SagaCSS" },
      { property: "og:description", content: "Curated palettes with multi-format export." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/color-palette" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/color-palette" }],
  }),
  component: PalettePage,
});

const FAV_KEY = "sagacss.paletteFavorites";
const PAGE_SIZE = 24;

type Format = "css" | "tailwind" | "bootstrap";
function formatPalette(palette: Palette, format: Format): string {
  const slug = palette.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (format === "css") {
    return `:root {\n${palette.colors.map((c, i) => `  --${slug}-${i + 1}: ${c};`).join("\n")}\n}`;
  }
  if (format === "tailwind") {
    return `// tailwind.config.ts\nextend: {\n  colors: {\n    "${slug}": {\n${palette.colors.map((c, i) => `      ${(i + 1) * 100}: "${c}",`).join("\n")}\n    }\n  }\n}`;
  }
  const scssVars = palette.colors.map((c, i) => `$${slug}-${i + 1}: ${c};`).join("\n");
  const swatches = palette.colors
    .map((c) => `  <div class="flex-fill" style="background:${c}"></div>`)
    .join("\n");
  return `// _variables.scss\n${scssVars}\n\n<!-- swatch preview -->\n<div class="d-flex rounded overflow-hidden">\n${swatches}\n</div>`;
}

function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAV_KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  const toggle = (name: string) => {
    setFavs((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      try {
        window.localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  return { favs, toggle };
}

function copy(text: string, msg: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success(msg),
    () => toast.error("Copy failed"),
  );
}

function PalettePage() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Palette>(PALETTES[0]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [custom, setCustom] = useState<string[]>([
    "#8b5cf6",
    "#22d3ee",
    "#ec4899",
    "#f59e0b",
    "#10b981",
  ]);
  const [customName, setCustomName] = useState("My Palette");
  const { favs, toggle } = useFavorites();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PALETTES.filter((p) => {
      if (category === "Favorites") return favs.includes(p.name);
      if (category !== "All" && p.category !== category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, query, favs]);

  useEffect(() => {
    setPage(0);
  }, [category, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const activePalette: Palette = showBuilder
    ? { name: customName || "My Palette", category: "Vibrant", colors: custom }
    : selected;

  const cssCode = useMemo(() => formatPalette(activePalette, "css"), [activePalette]);
  const tailwindCode = useMemo(() => formatPalette(activePalette, "tailwind"), [activePalette]);
  const bootstrapCode = useMemo(() => formatPalette(activePalette, "bootstrap"), [activePalette]);

  const randomize = () => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)] ?? PALETTES[0];
    setSelected(pick);
    setShowBuilder(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Color Palette Library"
        description="Browse curated color palettes, save favorites, or build your own — then export in CSS, Tailwind or Bootstrap format."
      />

      <div className="flex flex-col gap-3">
        <div className="relative -mx-4 sm:mx-0">
          <div
            className="scrollbar-none flex gap-1 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:overflow-visible sm:px-0"
            role="tablist"
            aria-label="Palette categories"
          >
            {(["All", "Favorites", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search palettes…"
            aria-label="Search palettes"
            className="h-9 min-w-0 flex-1 sm:max-w-xs"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={randomize}
            className="gap-1.5"
            aria-label="Shuffle random palette"
          >
            <Shuffle className="h-4 w-4" /> Random
          </Button>
          <Button
            variant={showBuilder ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBuilder((s) => !s)}
          >
            {showBuilder ? "Browse library" : "Build your own"}
          </Button>
        </div>
      </div>

      {showBuilder && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Label className="text-sm font-semibold">Custom palette</Label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="h-8 w-48"
              aria-label="Custom palette name"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustom((c) => [...c, "#94a3b8"])}
              disabled={custom.length >= 8}
            >
              <Plus className="h-4 w-4" /> Add color
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {custom.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border border-border bg-background p-1.5"
              >
                <input
                  type="color"
                  value={c}
                  onChange={(e) =>
                    setCustom((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                  aria-label={`Custom color ${i + 1}`}
                />
                <span className="font-mono text-xs">{c}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    setCustom((prev) => (prev.length > 2 ? prev.filter((_, j) => j !== i) : prev))
                  }
                  aria-label={`Remove color ${i + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          {!showBuilder && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paged.map((p) => {
                  const isFav = favs.includes(p.name);
                  const isSelected = selected.name === p.name;
                  return (
                    <article
                      key={p.name}
                      className={`group rounded-xl border p-3 transition-colors ${isSelected ? "border-primary" : "border-border hover:border-primary/50"} bg-card`}
                    >
                      <button
                        type="button"
                        className="flex w-full overflow-hidden rounded-md"
                        onClick={() => setSelected(p)}
                        aria-label={`Select palette ${p.name}`}
                      >
                        {p.colors.map((c, i) => (
                          <span
                            key={i}
                            role="button"
                            tabIndex={0}
                            aria-label={`Copy color ${c}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              copy(c, `${c} copied`);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.stopPropagation();
                                copy(c, `${c} copied`);
                              }
                            }}
                            className="h-14 flex-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            style={{ background: c }}
                          />
                        ))}
                      </button>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{p.name}</div>
                          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {p.category}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggle(p.name)}
                          aria-label={isFav ? `Unfavorite ${p.name}` : `Favorite ${p.name}`}
                          className="rounded-md p-1 hover:bg-accent"
                        >
                          <Star
                            className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => copy(p.colors.join(", "), "All colors copied")}
                          aria-label={`Copy all colors from ${p.name}`}
                          className="rounded-md p-1 hover:bg-accent"
                        >
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </article>
                  );
                })}
                {paged.length === 0 && (
                  <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No palettes match your filters.
                  </div>
                )}
              </div>

              {pageCount > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {page + 1} of {pageCount} · {filtered.length} palettes
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={page >= pageCount - 1}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <StickyCode
          code={cssCode}
          tailwind={tailwindCode}
          bootstrap={bootstrapCode}
          label="Palette Export"
        />
      </div>
    </div>
  );
}
