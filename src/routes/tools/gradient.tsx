import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Plus, Shuffle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb, randomPleasantHex } from "@/lib/color";

export const Route = createFileRoute("/tools/gradient")({
  head: () => ({
    meta: [
      { title: "CSS Gradient Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design linear, radial and conic CSS gradients visually with multi-stop color control, live preview, presets and copy-ready code.",
      },
      { property: "og:title", content: "CSS Gradient Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Multi-stop, live-preview gradient generator with copy-ready CSS.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/gradient" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/gradient" }],
  }),
  component: GradientPage,
});

type GradientType = "linear" | "radial" | "conic";

type Stop = { id: string; color: string; position: number };

const uid = () => Math.random().toString(36).slice(2, 9);

const PRESETS: { name: string; type: GradientType; angle: number; stops: Stop[] }[] = [
  {
    name: "Sunset",
    type: "linear",
    angle: 135,
    stops: [
      { id: uid(), color: "#ff9966", position: 0 },
      { id: uid(), color: "#ff5e62", position: 100 },
    ],
  },
  {
    name: "Ocean",
    type: "linear",
    angle: 90,
    stops: [
      { id: uid(), color: "#2E3192", position: 0 },
      { id: uid(), color: "#1BFFFF", position: 100 },
    ],
  },
  {
    name: "Aurora",
    type: "linear",
    angle: 120,
    stops: [
      { id: uid(), color: "#00c6ff", position: 0 },
      { id: uid(), color: "#8e2de2", position: 50 },
      { id: uid(), color: "#ff0080", position: 100 },
    ],
  },
  {
    name: "Peach",
    type: "linear",
    angle: 45,
    stops: [
      { id: uid(), color: "#ffecd2", position: 0 },
      { id: uid(), color: "#fcb69f", position: 100 },
    ],
  },
  {
    name: "Grape",
    type: "linear",
    angle: 160,
    stops: [
      { id: uid(), color: "#5f2c82", position: 0 },
      { id: uid(), color: "#49a09d", position: 100 },
    ],
  },
  {
    name: "Fresh Mint",
    type: "linear",
    angle: 90,
    stops: [
      { id: uid(), color: "#00b09b", position: 0 },
      { id: uid(), color: "#96c93d", position: 100 },
    ],
  },
  {
    name: "Cosmic",
    type: "radial",
    angle: 0,
    stops: [
      { id: uid(), color: "#ff00cc", position: 0 },
      { id: uid(), color: "#333399", position: 100 },
    ],
  },
  {
    name: "Citrus",
    type: "conic",
    angle: 0,
    stops: [
      { id: uid(), color: "#f7971e", position: 0 },
      { id: uid(), color: "#ffd200", position: 100 },
    ],
  },
];

function buildGradient(type: GradientType, angle: number, stops: Stop[]) {
  const parts = [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${Math.round(s.position)}%`)
    .join(", ");
  if (type === "linear") return `linear-gradient(${angle}deg, ${parts})`;
  if (type === "radial") return `radial-gradient(circle at center, ${parts})`;
  return `conic-gradient(from ${angle}deg at center, ${parts})`;
}

function GradientPage() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: uid(), color: "#8b5cf6", position: 0 },
    { id: uid(), color: "#22d3ee", position: 100 },
  ]);
  const barRef = useRef<HTMLDivElement>(null);
  const draggingId = useRef<string | null>(null);

  const css = useMemo(() => buildGradient(type, angle, stops), [type, angle, stops]);

  const tailwind = useMemo(() => {
    const esc = css.replace(/\s+/g, "_");
    return `<div class="h-64 w-full rounded-2xl bg-[image:${esc}]">…</div>`;
  }, [css]);

  const bootstrap = useMemo(() => {
    // Bootstrap 5.3 ships `bg-gradient` as an overlay utility only — arbitrary
    // multi-stop gradients need a small SCSS extension. Lead with the markup
    // so the copy target is a Bootstrap utility-class snippet.
    return `<div class="bg-craft-gradient bg-gradient rounded-3 w-100 min-vh-25"></div>\n\n<!-- Register the utility once in your Bootstrap _custom.scss: -->\n@use "bootstrap/scss/utilities" as *;\n$utilities: map-merge($utilities, (\n  "background-craft": (\n    property: background,\n    class: bg,\n    values: (craft-gradient: ${css})\n  )\n));`;
  }, [css]);

  const updateStop = (id: string, patch: Partial<Stop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addStop = () => {
    setStops((prev) => {
      const pos = prev.length ? Math.min(100, Math.max(...prev.map((s) => s.position)) + 10) : 50;
      return [...prev, { id: uid(), color: randomPleasantHex(), position: pos }];
    });
  };

  const removeStop = (id: string) => {
    setStops((prev) => (prev.length <= 2 ? prev : prev.filter((s) => s.id !== id)));
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 2);
    const next: Stop[] = Array.from({ length: count }, (_, i) => ({
      id: uid(),
      color: randomPleasantHex(),
      position: Math.round((i / (count - 1)) * 100),
    }));
    setStops(next);
    setAngle(Math.floor(Math.random() * 360));
  };

  const onPointerDown = (id: string) => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingId.current = id;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingId.current || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    updateStop(draggingId.current, { position: pct });
  };
  const onPointerUp = () => {
    draggingId.current = null;
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Gradient Generator"
        description="Build linear, radial and conic CSS gradients with multi-stop control and copy the code in one click."
      />

      <div
        className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-border shadow-inner md:h-80"
        style={{ background: css }}
        aria-label="Gradient preview"
        role="img"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1 rounded-md border border-border p-1">
              {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={`rounded px-3 py-1.5 text-sm capitalize transition-colors ${
                    type === t
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={randomize} className="gap-1.5">
              <Shuffle className="h-4 w-4" /> Randomize
            </Button>
          </div>

          {(type === "linear" || type === "conic") && (
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="angle" className="text-sm">
                  {type === "linear" ? "Angle" : "Start angle"}
                </Label>
                <Input
                  id="angle"
                  type="number"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) =>
                    setAngle(Math.min(360, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="h-8 w-20 text-right"
                  aria-label="Gradient angle in degrees"
                />
              </div>
              <Slider
                value={[angle]}
                min={0}
                max={360}
                step={1}
                onValueChange={(v) => setAngle(v[0] ?? 0)}
                aria-label="Gradient angle slider"
              />
            </div>
          )}

          <div className="mb-3">
            <Label className="text-sm">Color stops</Label>
            <div
              ref={barRef}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="relative mt-2 h-10 rounded-full border border-border touch-none"
              style={{ background: buildGradient("linear", 90, stops) }}
              aria-label="Gradient stops track"
            >
              {stops.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onPointerDown={onPointerDown(s.id)}
                  aria-label={`Stop at ${Math.round(s.position)}% color ${s.color}`}
                  className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ left: `${s.position}%`, background: s.color }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {stops.map((s) => {
              const rgb = hexToRgb(s.color);
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 rounded-md border border-border bg-background/50 p-2"
                >
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateStop(s.id, { color: e.target.value })}
                    aria-label="Stop color"
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <Input
                    value={s.color}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) updateStop(s.id, { color: v });
                    }}
                    aria-label="Stop hex value"
                    className="h-8 font-mono text-sm"
                  />
                  <div className="flex items-center gap-1 rounded border border-border px-2 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">rgb</span>
                    <span className="font-mono">{rgb ? `${rgb.r},${rgb.g},${rgb.b}` : "—"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Math.round(s.position)}
                      onChange={(e) =>
                        updateStop(s.id, {
                          position: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      aria-label="Stop position percent"
                      className="h-8 w-16 text-right"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStop(s.id)}
                      aria-label="Remove stop"
                      disabled={stops.length <= 2}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" size="sm" onClick={addStop} className="gap-1.5 self-start">
              <Plus className="h-4 w-4" /> Add stop
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setType(p.type);
                    setAngle(p.angle);
                    setStops(p.stops.map((s) => ({ ...s, id: uid() })));
                  }}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Load preset ${p.name}`}
                >
                  <span
                    className="h-14 w-full"
                    style={{ background: buildGradient(p.type, p.angle, p.stops) }}
                  />
                  <span className="bg-card px-2 py-1 text-left text-xs font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <StickyCode code={`background: ${css};`} tailwind={tailwind} bootstrap={bootstrap} />
        </div>
      </div>
    </div>
  );
}
