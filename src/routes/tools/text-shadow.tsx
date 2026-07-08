import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb } from "@/lib/color";

export const Route = createFileRoute("/tools/text-shadow")({
  head: () => ({
    meta: [
      { title: "Text Shadow Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design layered CSS text-shadows with neon, 3D and retro presets. Live preview with custom text.",
      },
      { property: "og:title", content: "Text Shadow Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Multi-layer text-shadow generator with live preview.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/text-shadow" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/text-shadow" }],
  }),
  component: TextShadowPage,
});

type Layer = { id: string; x: number; y: number; blur: number; color: string; alpha: number };
const uid = () => Math.random().toString(36).slice(2, 9);
const nl = (p: Partial<Layer> = {}): Layer => ({
  id: uid(),
  x: 2,
  y: 2,
  blur: 4,
  color: "#000000",
  alpha: 0.5,
  ...p,
});

const PRESETS: { name: string; color?: string; bg?: string; layers: Omit<Layer, "id">[] }[] = [
  {
    name: "Neon Glow",
    color: "#ffffff",
    bg: "#0f172a",
    layers: [
      { x: 0, y: 0, blur: 6, color: "#22d3ee", alpha: 1 },
      { x: 0, y: 0, blur: 16, color: "#22d3ee", alpha: 0.8 },
      { x: 0, y: 0, blur: 32, color: "#0ea5e9", alpha: 0.6 },
    ],
  },
  {
    name: "3D Extruded",
    color: "#fbbf24",
    bg: "#1e1b4b",
    layers: Array.from({ length: 8 }, (_, i) => ({
      x: i + 1,
      y: i + 1,
      blur: 0,
      color: "#7c3aed",
      alpha: 1,
    })),
  },
  {
    name: "Soft Drop",
    color: "#0f172a",
    bg: "#f1f5f9",
    layers: [{ x: 0, y: 4, blur: 12, color: "#000000", alpha: 0.2 }],
  },
  {
    name: "Retro Duotone",
    color: "#fef3c7",
    bg: "#7c2d12",
    layers: [
      { x: 3, y: 3, blur: 0, color: "#ec4899", alpha: 1 },
      { x: 6, y: 6, blur: 0, color: "#8b5cf6", alpha: 1 },
    ],
  },
  {
    name: "Outline",
    color: "#ffffff",
    bg: "#0f172a",
    layers: [
      { x: -1, y: -1, blur: 0, color: "#000000", alpha: 1 },
      { x: 1, y: -1, blur: 0, color: "#000000", alpha: 1 },
      { x: -1, y: 1, blur: 0, color: "#000000", alpha: 1 },
      { x: 1, y: 1, blur: 0, color: "#000000", alpha: 1 },
    ],
  },
];

function toCss(l: Layer) {
  const rgb = hexToRgb(l.color) ?? { r: 0, g: 0, b: 0 };
  return `${l.x}px ${l.y}px ${l.blur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${l.alpha})`;
}

function TextShadowPage() {
  const [layers, setLayers] = useState<Layer[]>([nl()]);
  const [text, setText] = useState("SagaCSS");
  const [color, setColor] = useState("#0f172a");
  const [bg, setBg] = useState("#f1f5f9");
  const [size, setSize] = useState(96);

  const shadow = useMemo(() => layers.map(toCss).join(", "), [layers]);
  const css = `text-shadow: ${shadow};\ncolor: ${color};`;
  const shadowTw = shadow.replace(/\s+/g, "_");
  const tailwind = `<span class="[text-shadow:${shadowTw}] [color:${color}] text-6xl font-bold">${text || "Text"}</span>`;
  const sizeCls =
    size >= 80
      ? "display-1"
      : size >= 64
        ? "display-2"
        : size >= 48
          ? "display-3"
          : size >= 40
            ? "display-4"
            : size >= 32
              ? "display-5"
              : size >= 24
                ? "display-6"
                : "fs-4";
  const bootstrap = `<span class="text-craft-shadow ${sizeCls} fw-bold">${text || "Text"}</span>\n\n<!-- Register the utility once in your Bootstrap _custom.scss (Bootstrap has no text-shadow utility): -->\n@use "bootstrap/scss/utilities" as *;\n$utilities: map-merge($utilities, (\n  "text-craft-shadow": (\n    property: text-shadow color,\n    class: text-craft-shadow,\n    values: (default: (${shadow}) ${color})\n  )\n));`;

  const update = (id: string, patch: Partial<Layer>) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) =>
    setLayers((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Text Shadow Generator"
        description="Design neon glows, 3D extrusions and retro type effects with layered text-shadows."
      />

      <div
        className="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-2xl border border-border p-6 md:min-h-[15rem] max-h-[17rem]"
        style={{ background: bg }}
      >
        <span
          className="text-center font-bold leading-none"
          style={{ color, textShadow: shadow, fontSize: `${size}px` }}
        >
          {text || "Type…"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="tx" className="mb-1 block text-xs">
                  Preview text
                </Label>
                <Input id="tx" value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Text color</Label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  aria-label="Text color"
                  className="h-9 w-full cursor-pointer rounded border border-border bg-transparent"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Background</Label>
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  aria-label="Background color"
                  className="h-9 w-full cursor-pointer rounded border border-border bg-transparent"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">Font size</Label>
                  <span className="font-mono text-xs text-muted-foreground">{size}px</span>
                </div>
                <Slider
                  value={[size]}
                  min={24}
                  max={200}
                  step={1}
                  onValueChange={(v) => setSize(v[0] ?? 96)}
                  aria-label="Font size"
                />
              </div>
            </div>
          </div>

          {layers.map((l, idx) => (
            <div key={l.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Layer {idx + 1}</div>
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
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { key: "x", label: "X", min: -50, max: 50 },
                    { key: "y", label: "Y", min: -50, max: 50 },
                    { key: "blur", label: "Blur", min: 0, max: 80 },
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
                  aria-label="Layer color"
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input
                  value={l.color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update(l.id, { color: v });
                  }}
                  aria-label="Layer hex"
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
            onClick={() => setLayers((p) => [...p, nl()])}
            className="gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Add layer
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setLayers(p.layers.map((l) => ({ ...l, id: uid() })));
                    if (p.color) setColor(p.color);
                    if (p.bg) setBg(p.bg);
                  }}
                  className="flex items-center justify-center overflow-hidden rounded-lg border border-border p-4 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ background: p.bg }}
                  aria-label={`Load ${p.name} preset`}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: p.color,
                      textShadow: p.layers.map((l) => toCss({ ...l, id: "" })).join(", "),
                    }}
                  >
                    {p.name}
                  </span>
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
