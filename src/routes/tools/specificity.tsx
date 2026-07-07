import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Bookmark, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "@/components/tool-header";
import { specificity, compare, fmt, type Token } from "@/lib/specificity";
import { addSnippet } from "@/lib/my-kit";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/specificity")({
  head: () => ({
    meta: [
      { title: "CSS Specificity Visualizer — Debug Selector Conflicts — SagaCSS" },
      { name: "description", content: "Paste any CSS selector to see its specificity score broken down visually. Compare two selectors side by side to know which one wins a conflict." },
      { property: "og:title", content: "CSS Specificity Visualizer — SagaCSS" },
      { property: "og:description", content: "Visual specificity calculator for CSS selectors, with side-by-side comparison." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/specificity" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/specificity" }],
  }),
  component: SpecificityPage,
});

const HISTORY_KEY = "sagacss.spec.history";

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}
function saveHistory(list: string[]) {
  try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 10))); } catch { /* ignore */ }
}

function SpecificityPage() {
  const [a, setA] = React.useState("#header .nav > ul li:hover");
  const [b, setB] = React.useState(".btn.primary[data-active]");
  const [history, setHistory] = React.useState<string[]>(() => loadHistory());

  const spA = React.useMemo(() => a.trim() ? specificity(a) : null, [a]);
  const spB = React.useMemo(() => b.trim() ? specificity(b) : null, [b]);

  const push = (sel: string) => {
    const next = [sel, ...history.filter((s) => s !== sel)].slice(0, 10);
    setHistory(next);
    saveHistory(next);
  };

  const saveA = () => {
    if (!spA) return;
    addSnippet({ label: `Specificity: ${a}`, code: `/* Selector: ${a}\nSpecificity: ${fmt(spA)}\n*/`, format: "css", source: "Specificity Visualizer", sourcePath: "/tools/specificity" });
    toast.success("Saved to My Kit");
  };

  const verdict = spA && spB
    ? compare(spA, spB) > 0 ? "A" : compare(spA, spB) < 0 ? "B" : "TIE"
    : null;

  return (
    <div className="mx-auto max-w-4xl">
      <ToolHeader
        title="CSS Specificity Visualizer"
        description="Understand which CSS rule wins. Paste a selector to see its specificity broken down, then compare two selectors side by side."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SelectorPanel
          label="Selector A"
          value={a}
          onChange={(v) => { setA(v); if (v.trim()) push(v); }}
          sp={spA}
          onSave={saveA}
        />
        <SelectorPanel
          label="Selector B (optional)"
          value={b}
          onChange={(v) => { setB(v); if (v.trim()) push(v); }}
          sp={spB}
          onSave={() => {
            if (!spB) return;
            addSnippet({ label: `Specificity: ${b}`, code: `/* Selector: ${b}\nSpecificity: ${fmt(spB)}\n*/`, format: "css", source: "Specificity Visualizer", sourcePath: "/tools/specificity" });
            toast.success("Saved to My Kit");
          }}
        />
      </div>

      {verdict && (
        <div className="mt-4 rounded-xl border border-border bg-card p-4 text-center">
          {verdict === "TIE" && <div className="text-sm">Both selectors have equal specificity <strong className="font-semibold">({fmt(spA!)})</strong>. The rule declared <em>later</em> in the cascade wins.</div>}
          {verdict === "A" && <div className="text-sm inline-flex items-center gap-2 flex-wrap justify-center"><ArrowLeft className="h-4 w-4 text-primary" /> <strong className="font-semibold text-primary">Selector A wins</strong> — <span className="text-muted-foreground">{fmt(spA!)}</span> beats <span className="text-muted-foreground">{fmt(spB!)}</span></div>}
          {verdict === "B" && <div className="text-sm inline-flex items-center gap-2 flex-wrap justify-center"><strong className="font-semibold text-primary">Selector B wins</strong> <ArrowRight className="h-4 w-4 text-primary" /> — <span className="text-muted-foreground">{fmt(spB!)}</span> beats <span className="text-muted-foreground">{fmt(spA!)}</span></div>}
        </div>
      )}

      <section className="mt-6 rounded-xl border border-border bg-card p-4 text-sm">
        <h2 className="mb-2 font-semibold">How specificity works</h2>
        <p className="text-muted-foreground">CSS specificity is a 3-part score <code className="rounded bg-muted px-1 py-0.5 text-xs">A,B,C</code>:</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li><span className="mr-2 inline-block h-2 w-2 rounded-full bg-rose-500" /> <strong className="text-foreground">A</strong> — IDs (<code className="text-xs">#foo</code>)</li>
          <li><span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" /> <strong className="text-foreground">B</strong> — classes, attributes, pseudo-classes (<code className="text-xs">.foo</code>, <code className="text-xs">[type]</code>, <code className="text-xs">:hover</code>)</li>
          <li><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" /> <strong className="text-foreground">C</strong> — elements and pseudo-elements (<code className="text-xs">div</code>, <code className="text-xs">::before</code>)</li>
        </ul>
        <p className="mt-2 text-muted-foreground"><code className="text-xs">:where()</code> contributes zero. <code className="text-xs">:is()</code>, <code className="text-xs">:not()</code>, and <code className="text-xs">:has()</code> take the highest specificity of their arguments. Inline styles add another level above everything (<code className="text-xs">1,0,0,0</code>).</p>
      </section>

      {history.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Recent selectors</div>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button key={h} onClick={() => setA(h)} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-mono hover:border-primary/40">
                {h}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const KIND_COLORS: Record<Token["kind"], string> = {
  id: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  class: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  attr: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  "pseudo-class": "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  "pseudo-element": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  element: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  universal: "bg-muted text-muted-foreground border-border",
  combinator: "bg-muted text-muted-foreground border-border",
  "not-inner": "bg-primary/10 text-primary border-primary/30",
  "is-inner": "bg-primary/10 text-primary border-primary/30",
};

function SelectorPanel({ label, value, onChange, sp, onSave }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  sp: ReturnType<typeof specificity> | null;
  onSave: () => void;
}) {
  const total = sp ? sp.a * 100 + sp.b * 10 + sp.c : 0;
  const maxScale = 200;
  const aPct = sp ? Math.min(100, (sp.a * 100 / maxScale) * 100) : 0;
  const bPct = sp ? Math.min(100 - aPct, (sp.b * 10 / maxScale) * 100) : 0;
  const cPct = sp ? Math.min(100 - aPct - bPct, (sp.c / maxScale) * 100) : 0;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-sm" placeholder="e.g. #header .nav > ul li:hover" />
      {sp && (
        <>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="font-mono text-2xl font-bold">{fmt(sp)}</div>
            <div className="text-xs text-muted-foreground">weight ≈ {total}</div>
            <Button size="sm" variant="ghost" onClick={onSave} aria-label="Save selector to My Kit" className="h-7 gap-1 px-2 text-xs">
              <Bookmark className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div className="bg-rose-500" style={{ width: `${aPct}%` }} />
            <div className="bg-amber-500" style={{ width: `${bPct}%` }} />
            <div className="bg-emerald-500" style={{ width: `${cPct}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sp.parts.map((t, i) => (
              <span key={i} className={`rounded border px-1.5 py-0.5 text-xs font-mono ${KIND_COLORS[t.kind]}`} title={t.kind}>
                {t.text}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded bg-rose-500/10 py-1"><div className="font-semibold">{sp.a}</div><div className="text-muted-foreground">IDs</div></div>
            <div className="rounded bg-amber-500/10 py-1"><div className="font-semibold">{sp.b}</div><div className="text-muted-foreground">Class/Attr/Pseudo</div></div>
            <div className="rounded bg-emerald-500/10 py-1"><div className="font-semibold">{sp.c}</div><div className="text-muted-foreground">Elements</div></div>
          </div>
        </>
      )}
    </div>
  );
}