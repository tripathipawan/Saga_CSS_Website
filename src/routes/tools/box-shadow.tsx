import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb } from "@/lib/color";

export const Route = createFileRoute("/tools/box-shadow")({
  head: () => ({
    meta: [
      { title: "Box Shadow Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Layer multiple CSS box-shadows with per-layer offset, blur, spread, color, alpha and inset toggle. Live preview and copy-ready code.",
      },
      { property: "og:title", content: "Box Shadow Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Multi-layer box-shadow generator with live preview.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/box-shadow" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/box-shadow" }],
  }),
  component: BoxShadowPage,
});

type ShadowLayer = {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  alpha: number;
  inset: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const newLayer = (patch: Partial<ShadowLayer> = {}): ShadowLayer => ({
  id: uid(),
  x: 0,
  y: 10,
  blur: 20,
  spread: 0,
  color: "#000000",
  alpha: 0.25,
  inset: false,
  ...patch,
});

const PRESETS: { name: string; layers: Omit<ShadowLayer, "id">[] }[] = [
  {
    name: "Soft UI",
    layers: [{ x: 0, y: 4, blur: 12, spread: 0, color: "#0f172a", alpha: 0.12, inset: false }],
  },
  {
    name: "Hard Drop",
    layers: [{ x: 8, y: 8, blur: 0, spread: 0, color: "#0f172a", alpha: 1, inset: false }],
  },
  {
    name: "Long Shadow",
    layers: Array.from({ length: 8 }, (_, i) => ({
      x: i + 1,
      y: i + 1,
      blur: 0,
      spread: 0,
      color: "#8b5cf6",
      alpha: 0.9 - i * 0.09,
      inset: false,
    })),
  },
  {
    name: "Glow",
    layers: [
      { x: 0, y: 0, blur: 20, spread: 2, color: "#22d3ee", alpha: 0.8, inset: false },
      { x: 0, y: 0, blur: 40, spread: 8, color: "#22d3ee", alpha: 0.4, inset: false },
    ],
  },
  {
    name: "Layered Depth",
    layers: [
      { x: 0, y: 1, blur: 2, spread: 0, color: "#000000", alpha: 0.08, inset: false },
      { x: 0, y: 4, blur: 8, spread: 0, color: "#000000", alpha: 0.1, inset: false },
      { x: 0, y: 16, blur: 32, spread: -8, color: "#000000", alpha: 0.16, inset: false },
    ],
  },
];

function toCss(layer: ShadowLayer) {
  const rgb = hexToRgb(layer.color) ?? { r: 0, g: 0, b: 0 };
  const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.alpha})`;
  return `${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${color}`;
}

function BoxShadowPage() {
  const [layers, setLayers] = useState<ShadowLayer[]>([newLayer()]);

  const shadow = useMemo(() => layers.map(toCss).join(", "), [layers]);
  const css = `box-shadow: ${shadow};`;

  const tailwind = useMemo(() => {
    const esc = shadow.replace(/\s+/g, "_").replace(/,_/g, ",");
    return `<div class="w-56 h-40 rounded-2xl bg-white shadow-[${esc}]">…</div>`;
  }, [shadow]);

  const bootstrap = useMemo(() => {
    // Bootstrap only has shadow-{sm,''} and shadow-lg — no multi-layer / colored / inset support.
    if (layers.length === 1 && !layers[0].inset && layers[0].color.toLowerCase() === "#000000") {
      const l = layers[0];
      const cls = l.blur <= 4 ? "shadow-sm" : l.blur >= 20 ? "shadow-lg" : "shadow";
      return `<div class="${cls} bg-white rounded p-5 d-inline-block">&nbsp;</div>`;
    }
    return `<!-- markup — uses real Bootstrap utilities: bg-white, rounded, p-5, d-inline-block -->\n<div class="craft-shadow bg-white rounded p-5 d-inline-block">&nbsp;</div>\n\n<!-- Bootstrap has no utility for: multi-layer, colored or inset box-shadow (only shadow-sm/shadow/shadow-lg). -->\n@use "bootstrap/scss/utilities" as *;\n.craft-shadow { box-shadow: ${shadow}; }`;
  }, [layers, shadow]);

  const update = (id: string, patch: Partial<ShadowLayer>) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const remove = (id: string) =>
    setLayers((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Box Shadow Generator"
        description="Layer multiple shadows to design depth, glow and neumorphic effects — then copy the CSS."
      />

      <div className="flex min-h-[18rem] items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:min-h-[16rem] max-h-[18rem]">
        <div
          className="h-40 w-56 rounded-2xl bg-card md:h-48 md:w-64"
          style={{ boxShadow: shadow }}
          aria-label="Box shadow preview"
          role="img"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          {layers.map((l, idx) => (
            <div key={l.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Layer {idx + 1}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`inset-${l.id}`}
                      checked={l.inset}
                      onCheckedChange={(v) => update(l.id, { inset: v })}
                      aria-label="Inset shadow"
                    />
                    <Label htmlFor={`inset-${l.id}`} className="text-xs">
                      Inset
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => remove(l.id)}
                    aria-label="Remove layer"
                    disabled={layers.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { key: "x", label: "Offset X", min: -100, max: 100 },
                    { key: "y", label: "Offset Y", min: -100, max: 100 },
                    { key: "blur", label: "Blur", min: 0, max: 200 },
                    { key: "spread", label: "Spread", min: -50, max: 100 },
                  ] as const
                ).map(({ key, label, min, max }) => (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between">
                      <Label className="text-xs">{label}</Label>
                      <span className="font-mono text-xs text-muted-foreground">{l[key]}px</span>
                    </div>
                    <Slider
                      value={[l[key]]}
                      min={min}
                      max={max}
                      step={1}
                      onValueChange={(v) => update(l.id, { [key]: v[0] ?? 0 })}
                      aria-label={label}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <input
                  type="color"
                  value={l.color}
                  onChange={(e) => update(l.id, { color: e.target.value })}
                  aria-label="Shadow color"
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input
                  value={l.color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update(l.id, { color: v });
                  }}
                  aria-label="Shadow hex"
                  className="h-8 font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">α</Label>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={l.alpha}
                    onChange={(e) =>
                      update(l.id, { alpha: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })
                    }
                    aria-label="Alpha"
                    className="h-8 w-20 text-right"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayers((prev) => [...prev, newLayer()])}
            className="gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Add layer
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setLayers(p.layers.map((l) => ({ ...l, id: uid() })))}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Load ${p.name} preset`}
                >
                  <div
                    className="h-10 w-14 rounded-md bg-card"
                    style={{ boxShadow: p.layers.map((l) => toCss({ ...l, id: "" })).join(", ") }}
                  />
                  <span className="text-xs font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
          <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
        </div>
      </div>
    </div>
  );
}
