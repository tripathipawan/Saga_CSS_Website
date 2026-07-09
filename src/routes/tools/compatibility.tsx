import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Search, X, Bookmark, Check, AlertTriangle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "@/components/tool-header";
import {
  COMPAT_FEATURES,
  BROWSER_LABELS,
  getSupportBadge,
  type CompatFeature,
  type BrowserId,
} from "@/lib/compat-data";
import { addSnippet } from "@/lib/my-kit";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/compatibility")({
  head: () => ({
    meta: [
      { title: "Browser Compatibility Checker — CSS Support Lookup — SagaCSS" },
      {
        name: "description",
        content:
          "Look up any CSS property, pseudo-class, function or at-rule and instantly see browser support across Chrome, Firefox, Safari, Edge, Opera and mobile, with vendor prefixes and fallbacks.",
      },
      { property: "og:title", content: "Browser Compatibility Checker — SagaCSS" },
      {
        property: "og:description",
        content:
          "Instant CSS compatibility lookup across major desktop and mobile browsers, with fallback tips.",
      },
      { property: "og:url", content: "/tools/compatibility" },
    ],
    links: [{ rel: "canonical", href: "/tools/compatibility" }],
  }),
  component: CompatibilityPage,
});

const HISTORY_KEY = "sagacss.compat.history";
const BROWSERS: BrowserId[] = [
  "chrome",
  "firefox",
  "safari",
  "edge",
  "opera",
  "safari_ios",
  "chrome_android",
];

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveHistory(ids: string[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(ids.slice(0, 8)));
  } catch {
    /* ignore */
  }
}

function CompatibilityPage() {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<CompatFeature | null>(null);
  const [history, setHistory] = React.useState<string[]>(() => loadHistory());
  const [showSuggest, setShowSuggest] = React.useState(false);

  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return COMPAT_FEATURES.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.id.includes(q) ||
        (f.keywords ?? []).some((k) => k.toLowerCase().includes(q)),
    ).slice(0, 10);
  }, [query]);

  const historyItems = React.useMemo(
    () =>
      history
        .map((id) => COMPAT_FEATURES.find((f) => f.id === id))
        .filter(Boolean) as CompatFeature[],
    [history],
  );

  const pick = (f: CompatFeature) => {
    setSelected(f);
    setQuery(f.name);
    setShowSuggest(false);
    const next = [f.id, ...history.filter((x) => x !== f.id)].slice(0, 8);
    setHistory(next);
    saveHistory(next);
  };

  const saveToKit = (f: CompatFeature) => {
    const supportSummary = BROWSERS.map((b) => {
      const sup = f.browsers[b];
      const label = BROWSER_LABELS[b];
      const state = sup.since ? `${sup.since}+${sup.partial ? " (partial)" : ""}` : "not supported";
      return `${label}: ${state}`;
    }).join("\n");
    const code = `/* ${f.name} — browser support (SagaCSS)\n${supportSummary}${f.prefixes ? "\nPrefixes: " + f.prefixes.join(" ") : ""}${f.fallback ? "\nFallback: " + f.fallback : ""}\n*/`;
    addSnippet({
      label: `${f.name} compatibility`,
      code,
      format: "css",
      source: "Browser Compatibility",
      sourcePath: "/tools/compatibility",
    });
    toast.success("Saved to My Kit");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ToolHeader
        title="Browser Compatibility Checker"
        description="Search any CSS property, function, pseudo-class, or at-rule to see support across desktop and mobile browsers, with vendor prefixes and graceful-fallback suggestions."
      />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggest(true);
          }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          placeholder="Search: backdrop-filter, :has(), container queries, subgrid…"
          className="pl-9"
          aria-label="Search CSS feature"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSelected(null);
            }}
            aria-label="Clear"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {showSuggest && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border bg-popover shadow-md">
            {suggestions.map((f) => (
              <li key={f.id}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(f)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <span className="min-w-0 truncate">{f.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {f.type}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!selected && historyItems.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Recently checked
          </div>
          <div className="flex flex-wrap gap-2">
            {historyItems.map((f) => (
              <button
                key={f.id}
                onClick={() => pick(f)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-primary/40"
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!selected && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Start typing to search {COMPAT_FEATURES.length}+ CSS features.
        </div>
      )}

      {selected && <FeatureCard feature={selected} onSave={() => saveToKit(selected)} />}
    </div>
  );
}

function FeatureCard({ feature, onSave }: { feature: CompatFeature; onSave: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] uppercase">
              {feature.type}
            </Badge>
            {feature.globalUsage != null && (
              <Badge variant="outline" className="text-[10px]">
                ~{feature.globalUsage}% global support (est.)
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight">{feature.name}</h2>
        </div>
        <Button size="sm" variant="outline" onClick={onSave} className="gap-1.5">
          <Bookmark className="h-4 w-4" /> Save to My Kit
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-2 text-left font-medium">Browser</th>
              <th className="p-2 text-left font-medium">Support</th>
              <th className="p-2 text-left font-medium">Since</th>
            </tr>
          </thead>
          <tbody>
            {BROWSERS.map((b) => {
              const sup = feature.browsers[b];
              const badge = getSupportBadge(sup);
              return (
                <tr key={b} className="border-t border-border">
                  <td className="p-2 font-medium">{BROWSER_LABELS[b]}</td>
                  <td className="p-2">
                    {badge === "full" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                        <Check className="h-3 w-3" /> Full
                      </span>
                    )}
                    {badge === "partial" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="h-3 w-3" /> Partial
                      </span>
                    )}
                    {badge === "none" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-xs text-rose-700 dark:text-rose-300">
                        <XCircle className="h-3 w-3" /> None
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-muted-foreground">{sup.since ? `v${sup.since}` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {feature.prefixes && feature.prefixes.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
          <div className="font-medium text-amber-700 dark:text-amber-300">Vendor prefixes</div>
          <div className="mt-1 text-muted-foreground">
            Include these for wider legacy support:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {feature.prefixes.join(" ")}
            </code>
          </div>
        </div>
      )}

      {feature.fallback && (
        <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <div className="font-medium text-primary">Fallback suggestion</div>
          <p className="mt-1 text-foreground/80">{feature.fallback}</p>
        </div>
      )}

      {feature.notes && <p className="mt-3 text-xs text-muted-foreground">{feature.notes}</p>}

      <p className="mt-4 text-[11px] text-muted-foreground">
        Support data is an approximate snapshot for quick reference. For authoritative data, check{" "}
        <a
          className="underline"
          href={`https://caniuse.com/?search=${encodeURIComponent(feature.name)}`}
          target="_blank"
          rel="noreferrer"
        >
          caniuse.com
        </a>
        .
      </p>
    </div>
  );
}
