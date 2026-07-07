import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb } from "@/lib/color";

export const Route = createFileRoute("/styles/claymorphism")({
  head: () => ({
    meta: [
      { title: "Claymorphism Generator — SagaCSS" },
      { name: "description", content: "Design puffy, pastel clay-style UI with combined inner and outer shadows and copy-ready CSS." },
      { property: "og:title", content: "Claymorphism — SagaCSS" },
      { property: "og:description", content: "Puffy pastel clay-style CSS generator." },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/claymorphism" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/claymorphism" }],
  }),
  component: ClayPage,
});

const PASTELS = ["#fecaca", "#fed7aa", "#fde68a", "#bbf7d0", "#a5f3fc", "#c7d2fe", "#f5d0fe", "#fbcfe8"];

function shift(hex: string, amt: number) {
  const rgb = hexToRgb(hex) ?? { r: 240, g: 240, b: 240 };
  const c = (n: number) => Math.max(0, Math.min(255, n + amt));
  return `rgb(${c(rgb.r)}, ${c(rgb.g)}, ${c(rgb.b)})`;
}

function ClayPage() {
  const [bg, setBg] = useState("#c7d2fe");
  const [radius, setRadius] = useState(48);
  const [intensity, setIntensity] = useState(35);

  const presets = [
    { name: "Lavender Puff", bg: "#c7d2fe", radius: 48, intensity: 35 },
    { name: "Peach Squish", bg: "#fed7aa", radius: 60, intensity: 40 },
    { name: "Mint Cushion", bg: "#bbf7d0", radius: 40, intensity: 30 },
    { name: "Sky Bubble", bg: "#a5f3fc", radius: 80, intensity: 45 },
    { name: "Blush Pill", bg: "#fbcfe8", radius: 100, intensity: 30 },
  ];
  const apply = (p: typeof presets[number]) => { setBg(p.bg); setRadius(p.radius); setIntensity(p.intensity); };

  const highlight = shift(bg, 60);
  const shade = shift(bg, -40);

  const shadow = `${intensity}px ${intensity}px ${intensity * 2}px ${shade}, inset -8px -8px 16px ${shade}, inset 8px 8px 24px ${highlight}`;

  const css = useMemo(
    () => `background: ${bg};
border: 1px solid ${highlight};
border-radius: ${radius}px;
box-shadow: ${shadow};`,
    [bg, radius, shadow, highlight],
  );

  const radiusCls = radius === 0 ? "rounded-0" : radius <= 8 ? "rounded-2" : radius <= 16 ? "rounded-3" : radius <= 32 ? "rounded-4" : "rounded-5";
  const bootstrap = useMemo(
    () => `<!-- markup — uses real Bootstrap utilities: ${radiusCls}, p-5, d-inline-block, border -->\n<div class="craft-clay border ${radiusCls} p-5 d-inline-block">…</div>\n\n<!-- Bootstrap has no utility for: custom pastel background, custom border color, combined inner+outer box-shadow. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-clay {\n  background: ${bg};\n  border-color: ${highlight};\n  box-shadow: ${shadow};\n}`,
    [bg, shadow, highlight, radiusCls],
  );

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Claymorphism Generator" description="Design puffy, pastel clay-like elements with combined inner and outer shadows." />

      <div className="flex min-h-[16rem] max-h-[18rem] items-center justify-center rounded-2xl border border-border bg-slate-50 p-10 dark:bg-slate-900">
        <div className="h-40 w-56 md:h-48 md:w-72" style={{ background: bg, borderRadius: radius, boxShadow: shadow, border: `1px solid ${highlight}` }} aria-label="Claymorphism preview" role="img" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="mb-3">
            <Label className="mb-1 block text-xs">Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button key={p.name} type="button" onClick={() => apply(p)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">{p.name}</button>
              ))}
            </div>
          </div>
          <div className="mb-3 grid grid-cols-[auto_1fr] items-center gap-3">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background color" className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent" />
            <div className="text-xs text-muted-foreground">Pastel background — softer hues work best</div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {PASTELS.map((p) => (
              <button key={p} type="button" onClick={() => setBg(p)} aria-label={`Pastel ${p}`} className="h-8 w-8 rounded-full border border-border" style={{ background: p }} />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {([{ label: "Radius", val: radius, set: setRadius, min: 0, max: 100 },
               { label: "Puff intensity", val: intensity, set: setIntensity, min: 5, max: 60 }] as const).map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">{c.val}</span>
                </div>
                <Slider value={[c.val]} min={c.min} max={c.max} step={1} onValueChange={(v) => c.set(v[0] ?? 0)} aria-label={c.label} />
              </div>
            ))}
          </div>
        </div>

        <StickyCode code={css} bootstrap={bootstrap} />
      </div>
    </div>
  );
}