import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ToolHeader } from "@/components/tool-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadKit, type KitSnippet } from "@/lib/my-kit";

export const Route = createFileRoute("/tools/responsive")({
  head: () => ({
    meta: [
      { title: "Responsive Preview Tester — Multi-Device Live Preview — SagaCSS" },
      {
        name: "description",
        content:
          "Preview your HTML and CSS across mobile, tablet, laptop and desktop widths simultaneously. Toggle breakpoints, add custom widths and sync-scroll across frames.",
      },
      { property: "og:title", content: "Responsive Preview Tester — SagaCSS" },
      {
        property: "og:description",
        content:
          "Side-by-side multi-device preview for HTML+CSS, with sync-scroll and custom breakpoints.",
      },
      { property: "og:url", content: "/tools/responsive" },
    ],
    links: [{ rel: "canonical", href: "/tools/responsive" }],
  }),
  component: ResponsivePage,
});

type Bp = { id: string; label: string; width: number; enabled: boolean };
const DEFAULT_BPS: Bp[] = [
  { id: "mobile", label: "Mobile", width: 375, enabled: true },
  { id: "tablet", label: "Tablet", width: 768, enabled: true },
  { id: "laptop", label: "Laptop", width: 1024, enabled: true },
  { id: "desktop", label: "Desktop", width: 1440, enabled: true },
];

const DEFAULT_HTML = `<div class="card">
  <h2>Responsive card</h2>
  <p>Edit HTML or CSS to see how this renders across viewports.</p>
  <button>Click me</button>
</div>`;

const DEFAULT_CSS = `body { font-family: system-ui, sans-serif; padding: 24px; margin: 0; background: #f8fafc; }
.card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgb(0 0 0 / 0.06); max-width: 480px; margin: 0 auto; }
h2 { margin: 0 0 8px; }
button { margin-top: 12px; padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; }
@media (max-width: 500px) { .card { padding: 16px; } h2 { font-size: 18px; } }`;

function ResponsivePage() {
  const [html, setHtml] = React.useState(DEFAULT_HTML);
  const [css, setCss] = React.useState(DEFAULT_CSS);
  const [bps, setBps] = React.useState<Bp[]>(DEFAULT_BPS);
  const [customW, setCustomW] = React.useState("");
  const [syncScroll, setSyncScroll] = React.useState(true);
  const [kit, setKit] = React.useState<KitSnippet[]>([]);
  const [pickId, setPickId] = React.useState<string>("");

  React.useEffect(() => {
    setKit(loadKit().filter((k) => k.format === "css" || k.format === "html"));
  }, []);

  const srcDoc = React.useMemo(
    () =>
      `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`,
    [html, css],
  );

  const activeBps = bps.filter((b) => b.enabled);
  const custom =
    customW && !isNaN(Number(customW))
      ? { id: `custom-${customW}`, label: "Custom", width: Number(customW), enabled: true }
      : null;
  const shown: Bp[] = custom ? [...activeBps, custom] : activeBps;

  const loadFromKit = (id: string) => {
    setPickId(id);
    const item = kit.find((k) => k.id === id);
    if (!item) return;
    if (item.format === "html") setHtml(item.code);
    else setCss(item.code);
  };

  const toggleBp = (id: string) =>
    setBps((p) => p.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));

  return (
    <div className="mx-auto max-w-7xl">
      <ToolHeader
        title="Responsive Preview Tester"
        description="Render HTML + CSS side by side across mobile, tablet, laptop and desktop widths. Toggle breakpoints, add a custom width, and sync-scroll to compare layouts."
      />

      <section className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            HTML
          </label>
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="min-h-[140px] font-mono text-xs"
            spellCheck={false}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            CSS
          </label>
          <Textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="min-h-[140px] font-mono text-xs"
            spellCheck={false}
          />
        </div>
      </section>

      <section className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap gap-2">
          {bps.map((b) => (
            <label
              key={b.id}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs"
            >
              <input
                type="checkbox"
                checked={b.enabled}
                onChange={() => toggleBp(b.id)}
                className="accent-primary"
              />
              {b.label} <span className="text-muted-foreground">{b.width}px</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Custom width</label>
          <Input
            value={customW}
            onChange={(e) => setCustomW(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="e.g. 600"
            className="h-8 w-24 text-xs"
          />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={syncScroll}
            onChange={(e) => setSyncScroll(e.target.checked)}
            className="accent-primary"
          />
          Sync scroll
        </label>
        {kit.length > 0 && (
          <Select value={pickId} onValueChange={loadFromKit}>
            <SelectTrigger className="ml-auto h-8 w-56 text-xs" aria-label="Load from My Kit">
              <SelectValue placeholder="Load from My Kit…" />
            </SelectTrigger>
            <SelectContent>
              {kit.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.label} <span className="ml-1 text-muted-foreground">({k.format})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setHtml(DEFAULT_HTML);
            setCss(DEFAULT_CSS);
          }}
          className="h-8 text-xs"
        >
          Reset
        </Button>
      </section>

      <FramesGrid frames={shown} srcDoc={srcDoc} syncScroll={syncScroll} />
    </div>
  );
}

function FramesGrid({
  frames,
  srcDoc,
  syncScroll,
}: {
  frames: Bp[];
  srcDoc: string;
  syncScroll: boolean;
}) {
  const refs = React.useRef<Record<string, HTMLIFrameElement | null>>({});
  const guard = React.useRef(false);

  React.useEffect(() => {
    if (!syncScroll) return;
    const handlers: (() => void)[] = [];
    for (const f of frames) {
      const el = refs.current[f.id];
      const doc = el?.contentDocument;
      const win = el?.contentWindow;
      if (!doc || !win) continue;
      const onScroll = () => {
        if (guard.current) return;
        guard.current = true;
        const y = doc.documentElement.scrollTop || doc.body.scrollTop;
        for (const other of frames) {
          if (other.id === f.id) continue;
          const oel = refs.current[other.id];
          const odoc = oel?.contentDocument;
          const owin = oel?.contentWindow;
          if (!odoc || !owin) continue;
          owin.scrollTo(0, y);
        }
        requestAnimationFrame(() => {
          guard.current = false;
        });
      };
      win.addEventListener("scroll", onScroll);
      handlers.push(() => win.removeEventListener("scroll", onScroll));
    }
    return () => handlers.forEach((h) => h());
  }, [frames, syncScroll, srcDoc]);

  if (frames.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Enable at least one breakpoint to preview.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {frames.map((f) => (
        <FrameCard
          key={f.id}
          bp={f}
          srcDoc={srcDoc}
          iframeRef={(el) => {
            refs.current[f.id] = el;
          }}
        />
      ))}
    </div>
  );
}

function FrameCard({
  bp,
  srcDoc,
  iframeRef,
}: {
  bp: Bp;
  srcDoc: string;
  iframeRef: (el: HTMLIFrameElement | null) => void;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / bp.width));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bp.width]);

  const frameH = 460;
  const scaledH = frameH * scale;

  return (
    <div className="rounded-xl border border-border bg-card p-2">
      <div className="mb-2 flex items-center justify-between px-1 text-xs">
        <span className="font-medium">{bp.label}</span>
        <span className="text-muted-foreground">{bp.width}px</span>
      </div>
      <div
        ref={wrapRef}
        className="w-full overflow-hidden rounded-md border border-border bg-white"
        style={{ height: scaledH }}
      >
        <iframe
          ref={iframeRef}
          title={`${bp.label} preview at ${bp.width}px`}
          srcDoc={srcDoc}
          sandbox="allow-same-origin"
          style={{
            width: bp.width,
            height: frameH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: 0,
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
