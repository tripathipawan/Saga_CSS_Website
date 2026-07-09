import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/spinner")({
  head: () => ({
    meta: [
      { title: "CSS Loader / Spinner Generator — SagaCSS" },
      {
        name: "description",
        content:
          "23 pure-CSS loaders: rings, dots, bars, pulses, skeletons and more. Play/pause preview, tweak size, speed, colors and copy CSS + HTML.",
      },
      { property: "og:title", content: "CSS Loader / Spinner Generator — SagaCSS" },
      {
        property: "og:description",
        content:
          "23+ pure-CSS loaders with live play/pause preview and copy-ready CSS, Tailwind and Bootstrap.",
      },
      { property: "og:url", content: "/tools/spinner" },
    ],
    links: [{ rel: "canonical", href: "/tools/spinner" }],
  }),
  component: LoaderPage,
});

type LoaderType =
  | "ring"
  | "ring-dual"
  | "ring-dashed"
  | "ring-gradient"
  | "dots-pulse"
  | "dots-bounce"
  | "dots-wave"
  | "bars-eq"
  | "bars-grow"
  | "pulse"
  | "ripple"
  | "bounce"
  | "orbit"
  | "spin-square"
  | "flip"
  | "triangle"
  | "clock"
  | "grid-9"
  | "hourglass"
  | "heart"
  | "progress"
  | "skeleton"
  | "skeleton-card";

type Cfg = {
  type: LoaderType;
  size: number;
  primary: string;
  secondary: string;
  duration: number;
  count: number;
};

const CATALOG: { type: LoaderType; label: string; category: string; count?: boolean }[] = [
  { type: "ring", label: "Ring", category: "Rings" },
  { type: "ring-dual", label: "Dual Ring", category: "Rings" },
  { type: "ring-dashed", label: "Dashed Ring", category: "Rings" },
  { type: "ring-gradient", label: "Gradient Ring", category: "Rings" },
  { type: "dots-pulse", label: "Pulsing Dots", category: "Dots", count: true },
  { type: "dots-bounce", label: "Bouncing Dots", category: "Dots", count: true },
  { type: "dots-wave", label: "Wave Dots", category: "Dots", count: true },
  { type: "bars-eq", label: "Equalizer", category: "Bars", count: true },
  { type: "bars-grow", label: "Growing Bars", category: "Bars", count: true },
  { type: "pulse", label: "Pulse", category: "Pulse" },
  { type: "ripple", label: "Ripple", category: "Pulse" },
  { type: "bounce", label: "Ball Bounce", category: "Motion" },
  { type: "orbit", label: "Orbit", category: "Motion" },
  { type: "spin-square", label: "Spin Square", category: "Motion" },
  { type: "flip", label: "3D Flip", category: "Motion" },
  { type: "triangle", label: "Triangle", category: "Motion" },
  { type: "clock", label: "Clock", category: "Motion" },
  { type: "grid-9", label: "9-Grid", category: "Grid" },
  { type: "hourglass", label: "Hourglass", category: "Grid" },
  { type: "heart", label: "Heartbeat", category: "Fun" },
  { type: "progress", label: "Progress Bar", category: "Skeleton" },
  { type: "skeleton", label: "Shimmer Bar", category: "Skeleton" },
  { type: "skeleton-card", label: "Shimmer Card", category: "Skeleton" },
];

const DEFAULTS: Cfg = {
  type: "ring",
  size: 56,
  primary: "#8b5cf6",
  secondary: "#e5e7eb",
  duration: 1,
  count: 3,
};

function LoaderPage() {
  const [cfg, setCfg] = useState<Cfg>(DEFAULTS);
  const [playing, setPlaying] = useState(true);
  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const meta = CATALOG.find((c) => c.type === cfg.type) ?? CATALOG[0];
  const { css, html } = useMemo(() => build(cfg), [cfg]);
  const previewCss = playing
    ? css
    : `${css}\n.craft-loader, .craft-loader *, .craft-loader::before, .craft-loader::after { animation-play-state: paused !important; }`;
  const output = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`;
  const tailwind = useMemo(() => buildTailwind(cfg, css, html), [cfg, css, html]);
  const bootstrap = useMemo(() => buildBootstrap(cfg, css, html), [cfg, css, html]);

  const categories = Array.from(new Set(CATALOG.map((c) => c.category)));

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="CSS Loader / Spinner Generator"
        description="23 pure-CSS loaders with a live play/pause preview and copy-ready code."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{meta.label}</div>
                <div className="text-[11px] text-muted-foreground">{meta.category} loader</div>
              </div>
              <Button
                size="sm"
                variant={playing ? "outline" : "default"}
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause animation" : "Play animation"}
                className="gap-1.5"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "Pause" : "Play"}
              </Button>
            </div>
            <div className="relative flex min-h-[240px] items-center justify-center bg-[radial-gradient(circle_at_50%_20%,hsl(var(--muted)/0.4),transparent_70%)] p-6">
              <style dangerouslySetInnerHTML={{ __html: previewCss }} />
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="text-sm font-semibold">Loader library</div>
              <div className="text-[11px] text-muted-foreground">{CATALOG.length} loaders</div>
            </div>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <div key={cat}>
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CATALOG.filter((c) => c.category === cat).map((c) => {
                      const active = c.type === cfg.type;
                      return (
                        <button
                          key={c.type}
                          type="button"
                          onClick={() => set("type", c.type)}
                          aria-pressed={active}
                          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground/80 hover:border-primary/50 hover:bg-accent"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberControl
                label="Size (px)"
                value={cfg.size}
                min={8}
                max={320}
                onChange={(v) => set("size", v)}
              />
              <NumberControl
                label="Speed (s)"
                value={cfg.duration}
                min={0.2}
                max={4}
                step={0.1}
                onChange={(v) => set("duration", v)}
              />
              <ColorControl
                label="Primary color"
                value={cfg.primary}
                onChange={(v) => set("primary", v)}
              />
              <ColorControl
                label="Secondary color"
                value={cfg.secondary}
                onChange={(v) => set("secondary", v)}
              />
              {meta.count && (
                <NumberControl
                  label="Element count"
                  value={cfg.count}
                  min={2}
                  max={8}
                  onChange={(v) => set("count", v)}
                />
              )}
            </div>
          </div>
        </div>

        <StickyCode code={output} tailwind={tailwind} bootstrap={bootstrap} label="Loader" />
      </div>
    </div>
  );
}

function NumberControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? min)}
        aria-label={label}
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-8 w-10 shrink-0 cursor-pointer rounded border border-border bg-background"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 font-mono text-xs"
          aria-label={`${label} value`}
        />
      </div>
    </div>
  );
}

function build(cfg: Cfg): { css: string; html: string } {
  const s = cfg.size,
    d = cfg.duration,
    p = cfg.primary,
    sc = cfg.secondary,
    n = cfg.count;
  const border = Math.max(2, Math.round(s / 8));
  const spans = (count: number, delay: (i: number) => string) =>
    Array.from({ length: count })
      .map((_, i) => `  <span style="animation-delay: ${delay(i)}s"></span>`)
      .join("\n");

  switch (cfg.type) {
    case "ring":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px;\n  border: ${border}px solid ${sc};\n  border-top-color: ${p};\n  border-radius: 50%;\n  animation: craft-spin ${d}s linear infinite;\n}\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    case "ring-dual":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader { width: ${s}px; height: ${s}px; position: relative; }\n.craft-loader::before, .craft-loader::after {\n  content: ""; position: absolute; border-radius: 50%; border: ${border}px solid transparent;\n}\n.craft-loader::before { inset: 0; border-top-color: ${p}; animation: craft-spin ${d}s linear infinite; }\n.craft-loader::after { inset: ${border * 2}px; border-bottom-color: ${sc}; animation: craft-spin ${(d * 1.4).toFixed(2)}s linear infinite reverse; }\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    case "ring-dashed":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px;\n  border: ${border}px dashed ${p};\n  border-radius: 50%;\n  animation: craft-spin ${d}s linear infinite;\n}\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    case "ring-gradient":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px; border-radius: 50%;\n  background: conic-gradient(from 0deg, ${sc}, ${p});\n  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - ${border}px), #000 0);\n          mask: radial-gradient(farthest-side, transparent calc(100% - ${border}px), #000 0);\n  animation: craft-spin ${d}s linear infinite;\n}\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    case "dots-pulse": {
      const dot = Math.max(6, Math.round(s / 3));
      const items = spans(n, (i) => ((i * d) / n / 2).toFixed(2));
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n${items}\n</div>`,
        css: `.craft-loader { display: inline-flex; gap: ${Math.round(dot / 2)}px; }\n.craft-loader span {\n  width: ${dot}px; height: ${dot}px; border-radius: 50%; background: ${p};\n  animation: craft-dot-pulse ${d}s ease-in-out infinite both;\n}\n@keyframes craft-dot-pulse {\n  0%, 80%, 100% { transform: scale(0.3); opacity: 0.4; }\n  40% { transform: scale(1); opacity: 1; }\n}`,
      };
    }
    case "dots-bounce": {
      const dot = Math.max(6, Math.round(s / 3));
      const items = spans(n, (i) => ((i * d) / n / 2).toFixed(2));
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n${items}\n</div>`,
        css: `.craft-loader { display: inline-flex; align-items: center; gap: ${Math.round(dot / 2)}px; height: ${dot * 2}px; }\n.craft-loader span {\n  width: ${dot}px; height: ${dot}px; border-radius: 50%; background: ${p};\n  animation: craft-dot-bounce ${d}s ease-in-out infinite;\n}\n@keyframes craft-dot-bounce {\n  0%, 80%, 100% { transform: translateY(0); }\n  40% { transform: translateY(-${dot}px); }\n}`,
      };
    }
    case "dots-wave": {
      const dot = Math.max(6, Math.round(s / 4));
      const items = spans(n, (i) => ((i * d) / n / 1.5).toFixed(2));
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n${items}\n</div>`,
        css: `.craft-loader { display: inline-flex; align-items: center; gap: ${Math.round(dot / 2)}px; height: ${s}px; }\n.craft-loader span {\n  width: ${dot}px; height: ${dot}px; border-radius: 50%; background: ${p};\n  animation: craft-dot-wave ${d}s ease-in-out infinite;\n}\n@keyframes craft-dot-wave {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-${Math.round(s / 3)}px); }\n}`,
      };
    }
    case "bars-eq": {
      const barW = Math.max(3, Math.round(s / 8));
      const items = spans(n, (i) => ((i * d) / n / 2).toFixed(2));
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n${items}\n</div>`,
        css: `.craft-loader { display: inline-flex; align-items: end; gap: ${Math.round(barW / 2)}px; height: ${s}px; }\n.craft-loader span {\n  display: block; width: ${barW}px; height: 100%;\n  background: ${p}; border-radius: ${Math.round(barW / 3)}px;\n  animation: craft-eq ${d}s ease-in-out infinite;\n  transform-origin: bottom;\n}\n@keyframes craft-eq {\n  0%, 100% { transform: scaleY(0.3); }\n  50% { transform: scaleY(1); }\n}`,
      };
    }
    case "bars-grow": {
      const barW = Math.max(3, Math.round(s / 8));
      const items = spans(n, (i) => ((i * d) / n).toFixed(2));
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n${items}\n</div>`,
        css: `.craft-loader { display: inline-flex; align-items: end; gap: ${Math.round(barW / 2)}px; height: ${s}px; }\n.craft-loader span {\n  display: block; width: ${barW}px; height: 100%;\n  background: ${p}; border-radius: ${Math.round(barW / 3)}px;\n  transform-origin: bottom; transform: scaleY(0);\n  animation: craft-grow ${d}s ease-in-out infinite;\n}\n@keyframes craft-grow {\n  0%, 100% { transform: scaleY(0); }\n  50% { transform: scaleY(1); }\n}`,
      };
    }
    case "pulse":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px; border-radius: 50%; background: ${p};\n  animation: craft-ping ${d}s cubic-bezier(0, 0, 0.2, 1) infinite;\n}\n@keyframes craft-ping {\n  0% { transform: scale(0.4); opacity: 1; }\n  100% { transform: scale(1); opacity: 0; }\n}`,
      };
    case "ripple":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n  <span></span>\n  <span></span>\n</div>`,
        css: `.craft-loader { position: relative; width: ${s}px; height: ${s}px; }\n.craft-loader span {\n  position: absolute; inset: 0; border: ${border}px solid ${p}; border-radius: 50%; opacity: 1;\n  animation: craft-ripple ${d}s cubic-bezier(0, 0.2, 0.8, 1) infinite;\n}\n.craft-loader span:nth-child(2) { animation-delay: ${(-d / 2).toFixed(2)}s; }\n@keyframes craft-ripple {\n  0% { transform: scale(0); opacity: 1; }\n  100% { transform: scale(1); opacity: 0; }\n}`,
      };
    case "bounce":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px; border-radius: 50%; background: ${p};\n  animation: craft-bounce ${d}s cubic-bezier(0.5, 0.05, 0.5, 0.95) infinite alternate;\n}\n@keyframes craft-bounce {\n  from { transform: translateY(0); }\n  to { transform: translateY(-${Math.round(s * 1.2)}px); }\n}`,
      };
    case "orbit": {
      const dot = Math.max(6, Math.round(s / 5));
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader { position: relative; width: ${s}px; height: ${s}px; animation: craft-spin ${d}s linear infinite; }\n.craft-loader::before, .craft-loader::after {\n  content: ""; position: absolute; width: ${dot}px; height: ${dot}px; border-radius: 50%;\n  left: calc(50% - ${dot / 2}px);\n}\n.craft-loader::before { top: 0; background: ${p}; }\n.craft-loader::after { bottom: 0; background: ${sc}; }\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    }
    case "spin-square":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px;\n  border: ${border}px solid ${sc};\n  border-top-color: ${p};\n  animation: craft-spin ${d}s linear infinite;\n}\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    case "flip":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${s}px; background: ${p};\n  animation: craft-flip ${d}s ease-in-out infinite;\n}\n@keyframes craft-flip {\n  0% { transform: perspective(120px) rotateX(0) rotateY(0); }\n  50% { transform: perspective(120px) rotateX(-180deg) rotateY(0); }\n  100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); }\n}`,
      };
    case "triangle": {
      const half = Math.round(s / 2);
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: 0; height: 0;\n  border-left: ${half}px solid transparent;\n  border-right: ${half}px solid transparent;\n  border-bottom: ${s}px solid ${p};\n  transform-origin: 50% 66%;\n  animation: craft-spin ${d}s linear infinite;\n}\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    }
    case "clock":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n  <span class="craft-hour"></span>\n  <span class="craft-min"></span>\n</div>`,
        css: `.craft-loader {\n  position: relative; width: ${s}px; height: ${s}px;\n  border: 2px solid ${p}; border-radius: 50%;\n}\n.craft-loader span {\n  position: absolute; left: 50%; top: 50%; width: 2px; background: ${p}; transform-origin: 50% 100%;\n}\n.craft-loader .craft-hour { height: ${Math.round(s * 0.3)}px; margin-top: -${Math.round(s * 0.3)}px; margin-left: -1px; animation: craft-spin ${(d * 6).toFixed(2)}s linear infinite; }\n.craft-loader .craft-min { height: ${Math.round(s * 0.42)}px; margin-top: -${Math.round(s * 0.42)}px; margin-left: -1px; background: ${sc}; animation: craft-spin ${d}s linear infinite; }\n@keyframes craft-spin { to { transform: rotate(360deg); } }`,
      };
    case "grid-9": {
      const cell = Math.round(s / 3);
      const gap = Math.max(2, Math.round(cell / 6));
      const items = Array.from({ length: 9 })
        .map((_, i) => {
          const delay = (((i % 3) + Math.floor(i / 3)) * (d / 6)).toFixed(2);
          return `  <span style="animation-delay: ${delay}s"></span>`;
        })
        .join("\n");
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading">\n${items}\n</div>`,
        css: `.craft-loader {\n  display: grid; grid-template-columns: repeat(3, 1fr); gap: ${gap}px;\n  width: ${s}px; height: ${s}px;\n}\n.craft-loader span {\n  background: ${p}; border-radius: ${gap}px;\n  animation: craft-fade ${d}s ease-in-out infinite;\n}\n@keyframes craft-fade {\n  0%, 100% { opacity: 0.2; transform: scale(0.7); }\n  50% { opacity: 1; transform: scale(1); }\n}`,
      };
    }
    case "hourglass":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: 0; height: 0;\n  border: ${Math.round(s / 2)}px solid ${p};\n  border-color: ${p} transparent;\n  animation: craft-hg ${d}s ease-in-out infinite;\n}\n@keyframes craft-hg {\n  0%, 100% { transform: rotate(0); }\n  50% { transform: rotate(180deg); }\n}`,
      };
    case "heart": {
      const half = Math.round(s / 2);
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  position: relative; width: ${s}px; height: ${s}px;\n  animation: craft-beat ${d}s ease-in-out infinite;\n}\n.craft-loader::before, .craft-loader::after {\n  content: ""; position: absolute; top: 0; width: ${half}px; height: ${Math.round(s * 0.8)}px;\n  background: ${p}; border-radius: ${half}px ${half}px 0 0;\n}\n.craft-loader::before { left: ${half}px; transform: rotate(-45deg); transform-origin: 0 100%; }\n.craft-loader::after { left: 0; transform: rotate(45deg); transform-origin: 100% 100%; }\n@keyframes craft-beat {\n  0%, 100% { transform: scale(1); }\n  30% { transform: scale(1.15); }\n  60% { transform: scale(0.95); }\n}`,
      };
    }
    case "progress":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${Math.max(4, Math.round(s / 12))}px;\n  background: ${sc}; border-radius: ${Math.max(2, Math.round(s / 24))}px;\n  position: relative; overflow: hidden;\n}\n.craft-loader::before {\n  content: ""; position: absolute; top: 0; left: -40%; width: 40%; height: 100%;\n  background: ${p}; border-radius: inherit;\n  animation: craft-progress ${d}s cubic-bezier(0.4, 0, 0.2, 1) infinite;\n}\n@keyframes craft-progress {\n  0% { left: -40%; }\n  100% { left: 100%; }\n}`,
      };
    case "skeleton":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading" aria-live="polite"></div>`,
        css: `.craft-loader {\n  width: ${s}px; height: ${Math.round(s / 3)}px; border-radius: 8px;\n  background: linear-gradient(90deg, ${p} 0%, ${sc} 50%, ${p} 100%);\n  background-size: 200% 100%;\n  animation: craft-shimmer ${d}s linear infinite;\n}\n@keyframes craft-shimmer {\n  0% { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}`,
      };
    case "skeleton-card":
      return {
        html: `<div class="craft-loader" role="status" aria-label="Loading" aria-live="polite">\n  <span class="craft-line craft-line-lg"></span>\n  <span class="craft-line"></span>\n  <span class="craft-line craft-line-sm"></span>\n</div>`,
        css: `.craft-loader {\n  width: ${s}px; padding: ${Math.round(s / 16)}px;\n  display: flex; flex-direction: column; gap: ${Math.round(s / 24)}px;\n  background: ${sc}; border-radius: 12px;\n}\n.craft-loader .craft-line {\n  height: ${Math.max(8, Math.round(s / 22))}px; border-radius: 6px;\n  background: linear-gradient(90deg, ${sc} 0%, ${p} 50%, ${sc} 100%);\n  background-size: 200% 100%;\n  animation: craft-shimmer ${d}s linear infinite;\n}\n.craft-loader .craft-line-lg { height: ${Math.max(14, Math.round(s / 12))}px; }\n.craft-loader .craft-line-sm { width: 60%; }\n@keyframes craft-shimmer {\n  0% { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}`,
      };
  }
}

function labelFor(type: LoaderType): string {
  return CATALOG.find((c) => c.type === type)?.label ?? type;
}

function buildTailwind(cfg: Cfg, css: string, html: string): string {
  const name = labelFor(cfg.type);
  if (cfg.type === "ring") {
    return `<!-- Tailwind — ${name}: use built-in animate-spin with arbitrary colors. -->\n<div\n  role="status"\n  aria-label="Loading"\n  class="animate-spin rounded-full border-[${Math.max(2, Math.round(cfg.size / 8))}px] border-[${cfg.secondary}] border-t-[${cfg.primary}]"\n  style="width:${cfg.size}px;height:${cfg.size}px;animation-duration:${cfg.duration}s"\n></div>`;
  }
  if (cfg.type === "pulse") {
    return `<!-- Tailwind — ${name}: closest built-in is animate-ping. -->\n<div class="relative" style="width:${cfg.size}px;height:${cfg.size}px">\n  <span class="absolute inset-0 rounded-full opacity-75 animate-ping" style="background:${cfg.primary};animation-duration:${cfg.duration}s"></span>\n  <span class="absolute inset-2 rounded-full" style="background:${cfg.primary}"></span>\n</div>`;
  }
  if (cfg.type === "skeleton" || cfg.type === "skeleton-card") {
    return `<!-- Tailwind — ${name}: animate-pulse is built-in. For the shimmer sweep effect, paste the CSS tab. -->\n<div class="animate-pulse rounded-lg bg-gray-200" style="width:${cfg.size}px;height:${Math.round(cfg.size / 3)}px"></div>`;
  }
  return `<!-- Tailwind — ${name}: no built-in utility for this loader.\n     Paste the CSS below into a global stylesheet (e.g. src/styles.css),\n     then use the markup below. -->\n\n<!-- HTML -->\n${html}\n\n<style>\n${css}\n</style>`;
}

function buildBootstrap(cfg: Cfg, css: string, html: string): string {
  const name = labelFor(cfg.type);
  if (
    cfg.type === "ring" ||
    cfg.type === "ring-dashed" ||
    cfg.type === "ring-dual" ||
    cfg.type === "ring-gradient" ||
    cfg.type === "spin-square"
  ) {
    return `<!-- Bootstrap — ${name}: closest built-in is the border spinner (.spinner-border). -->\n<div class="spinner-border" role="status" style="width:${cfg.size}px;height:${cfg.size}px;color:${cfg.primary}">\n  <span class="visually-hidden">Loading...</span>\n</div>`;
  }
  if (cfg.type === "pulse" || cfg.type === "ripple") {
    return `<!-- Bootstrap — ${name}: closest built-in is the grow spinner (.spinner-grow). -->\n<div class="spinner-grow" role="status" style="width:${cfg.size}px;height:${cfg.size}px;color:${cfg.primary}">\n  <span class="visually-hidden">Loading...</span>\n</div>`;
  }
  return `<!-- Bootstrap — ${name}: no matching Bootstrap utility (built-ins are only .spinner-border and .spinner-grow).\n     Paste the CSS below into your global stylesheet, then use the markup below. -->\n\n<!-- HTML -->\n${html}\n\n<style>\n${css}\n</style>`;
}
