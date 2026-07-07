import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookmarkPlus, Trash2, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ToolHeader } from "@/components/tool-header";
import { CodeBlock } from "@/components/sticky-code";
import {
  clearKit,
  loadKit,
  removeSnippet,
  type KitSnippet,
} from "@/lib/my-kit";
import { toast } from "sonner";

export const Route = createFileRoute("/my-kit")({
  head: () => ({
    meta: [
      { title: "My Kit — Saved CSS Snippets — SagaCSS" },
      { name: "description", content: "Your personal collection of saved CSS, Tailwind and Bootstrap snippets — combine and export as a single stylesheet." },
      { property: "og:title", content: "My Kit — SagaCSS" },
      { property: "og:description", content: "Save, preview and combine your favourite SagaCSS snippets." },
      { property: "og:url", content: "https://csscraft.lovable.app/my-kit" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/my-kit" }],
  }),
  component: MyKitPage,
});

function MyKitPage() {
  const [items, setItems] = useState<KitSnippet[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const sync = () => setItems(loadKit());
    sync();
    window.addEventListener("sagacss:kit-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sagacss:kit-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const download = (contents: string, filename: string, mime: string) => {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRawCss = () => {
    const chosen = items.filter((i) => selected.has(i.id));
    if (chosen.length === 0) return toast.error("Select at least one snippet");
    const body = chosen
      .map((s) => `/* ${s.label} — from ${s.source} (${s.format.toUpperCase()}) */\n${s.code}`)
      .join("\n\n");
    const header = `/* SagaCSS — My Kit export\n * ${chosen.length} snippet${chosen.length === 1 ? "" : "s"} · ${new Date().toISOString()}\n */\n\n`;
    download(header + body, "my-kit.css", "text/css");
    toast.success(`Exported ${chosen.length} snippet${chosen.length === 1 ? "" : "s"}`);
  };

  const exportTabStyleHtml = () => {
    const chosen = items.filter((i) => selected.has(i.id));
    if (chosen.length === 0) return toast.error("Select at least one snippet");
    const escape = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
    const tabs = chosen
      .map(
        (s, i) => `<input type="radio" name="ktab" id="ktab-${i}" ${i === 0 ? "checked" : ""}/><label for="ktab-${i}">${escape(s.label)}<span class="fmt">${s.format.toUpperCase()}</span></label>`,
      )
      .join("\n");
    const panels = chosen
      .map((s, i) => `<pre class="panel panel-${i}" data-idx="${i}"><code>${escape(s.code)}</code></pre>`)
      .join("\n");
    const rules = chosen
      .map((_, i) => `#ktab-${i}:checked ~ .panels .panel-${i} { display: block; }\n#ktab-${i}:checked ~ .tabs label[for="ktab-${i}"] { background: #111827; color: #fff; }`)
      .join("\n");
    const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><title>My Kit — Combined Snippets</title>
<style>
  body{font:14px/1.5 ui-sans-serif,system-ui;margin:0;padding:2rem;background:#f8fafc;color:#111827}
  .kit{max-width:900px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
  .kit input[type=radio]{position:absolute;opacity:0;pointer-events:none}
  .tabs{display:flex;flex-wrap:wrap;gap:2px;padding:8px;background:#f1f5f9;border-bottom:1px solid #e5e7eb}
  .tabs label{cursor:pointer;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;background:#fff;border:1px solid #e5e7eb;display:inline-flex;align-items:center;gap:6px}
  .tabs label .fmt{font-size:10px;opacity:.6}
  .panels .panel{display:none;margin:0;padding:1rem 1.25rem;background:#0f172a;color:#e2e8f0;overflow:auto;font-family:ui-monospace,Menlo,monospace;font-size:12px}
  ${rules}
</style>
<div class="kit">
  ${tabs}
  <div class="tabs">${chosen.map((s, i) => `<label for="ktab-${i}">${escape(s.label)}<span class="fmt">${s.format.toUpperCase()}</span></label>`).join("")}</div>
  <div class="panels">${panels}</div>
</div>
</html>`;
    download(html, "my-kit-tabs.html", "text/html");
    toast.success(`Exported ${chosen.length} snippet${chosen.length === 1 ? "" : "s"} as tabs`);
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearKit();
    setSelected(new Set());
    setConfirmClear(false);
    toast.success("My Kit cleared");
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="My Kit" description="Your saved CSS snippets — organize, combine and export them as a personal starter stylesheet." />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <BookmarkPlus className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold">Your kit is empty</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Open any tool and click <strong>Save</strong> next to the Copy button to add a snippet here. Everything is stored locally in your browser.
          </p>
          <Link to="/tools/gradient" className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Try the Gradient Generator
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3">
            <div className="text-sm text-muted-foreground">
              {items.length} snippet{items.length === 1 ? "" : "s"} · {selected.size} selected
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Download className="h-4 w-4" /> Combine &amp; export <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportRawCss}>Raw CSS (.css)</DropdownMenuItem>
                  <DropdownMenuItem onClick={exportTabStyleHtml}>Tabbed HTML (.html)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="sm"
                variant={confirmClear ? "destructive" : "outline"}
                onClick={handleClearAll}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                {confirmClear ? "Confirm clear" : "Clear all"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {items.map((s) => (
              <KitCard key={s.id} snippet={s} selected={selected.has(s.id)} onToggle={toggle} onDelete={() => removeSnippet(s.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function KitCard({ snippet, selected, onToggle, onDelete }: { snippet: KitSnippet; selected: boolean; onToggle: (id: string) => void; onDelete: () => void }) {
  const previewStyle = useMemo(() => {
    if (snippet.format !== "css") return null;
    if (/[{}]/.test(snippet.code)) return null;
    return snippet.code;
  }, [snippet]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggle(snippet.id)}
            aria-label={`Select ${snippet.label}`}
            className="mt-1"
          />
          <div>
            <div className="font-medium">{snippet.label}</div>
            <div className="text-xs text-muted-foreground">
              {snippet.source} · {snippet.format.toUpperCase()} · {new Date(snippet.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete snippet" className="h-8 w-8">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {previewStyle && (
        <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-3">
          <CssPreview css={previewStyle} />
        </div>
      )}

      <CodeBlock code={snippet.code} label={snippet.format.toUpperCase()} />
    </div>
  );
}

function CssPreview({ css }: { css: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.cssText = `width:64px;height:64px;background:linear-gradient(135deg,#8b5cf6,#22d3ee);${css}`;
  }, [css]);
  return <div ref={ref} aria-hidden="true" />;
}