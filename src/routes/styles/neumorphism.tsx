import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb } from "@/lib/color";

export const Route = createFileRoute("/styles/neumorphism")({
  head: () => ({
    meta: [
      { title: "Neumorphism Generator — SagaCSS" },
      { name: "description", content: "Design raised and pressed neumorphic elements with dual-shadow controls, light/dark presets, and copy-ready CSS." },
      { property: "og:title", content: "Neumorphism — SagaCSS" },
      { property: "og:description", content: "Neumorphic UI generator with live preview." },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/neumorphism" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/neumorphism" }],
  }),
  component: NeumorphismPage,
});

function shift(hex: string, amt: number) {
  const rgb = hexToRgb(hex) ?? { r: 200, g: 200, b: 200 };
  const c = (n: number) => Math.max(0, Math.min(255, n + amt));
  return `rgb(${c(rgb.r)}, ${c(rgb.g)}, ${c(rgb.b)})`;
}

function NeumorphismPage() {
  const [bg, setBg] = useState("#e0e5ec");
  const [distance, setDistance] = useState(12);
  const [blur, setBlur] = useState(24);
  const [intensity, setIntensity] = useState(30);
  const [radius, setRadius] = useState(24);
  const [pressed, setPressed] = useState(false);

  const light = shift(bg, intensity);
  const dark = shift(bg, -intensity);

  const shadow = pressed
    ? `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`
    : `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`;

  const css = `background: ${bg};
border-radius: ${radius}px;
box-shadow: ${shadow};`;

  const radiusCls = radius === 0 ? "rounded-0" : radius <= 4 ? "rounded-1" : radius <= 8 ? "rounded-2" : radius <= 12 ? "rounded-3" : radius <= 20 ? "rounded-4" : "rounded-5";
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: ${radiusCls}, p-5, d-inline-block -->\n<div class="craft-neu ${radiusCls} p-5 d-inline-block">…</div>\n\n<!-- Bootstrap has no utility for: custom surface background, dual light+dark box-shadow. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-neu {\n  background: ${bg};\n  box-shadow: ${shadow};\n}`;

  const presets = [
    { name: "Light Soft", bg: "#e0e5ec", intensity: 30, distance: 12, blur: 24, radius: 24 },
    { name: "Dark Room", bg: "#2d3748", intensity: 24, distance: 12, blur: 24, radius: 24 },
    { name: "Pastel Mint", bg: "#d4e9dc", intensity: 25, distance: 10, blur: 20, radius: 32 },
    { name: "Warm Sand", bg: "#e8dcc4", intensity: 28, distance: 14, blur: 28, radius: 20 },
    { name: "Deep Space", bg: "#1a202c", intensity: 20, distance: 8, blur: 16, radius: 12 },
  ];
  const applyPreset = (p: typeof presets[number]) => {
    setBg(p.bg); setIntensity(p.intensity); setDistance(p.distance); setBlur(p.blur); setRadius(p.radius);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Neumorphism Generator" description="Design soft, extruded UI with dual light/dark shadows. Toggle raised vs pressed for interactive states." />

      <div className="flex min-h-[15rem] max-h-[17rem] items-center justify-center rounded-2xl border border-border p-10" style={{ background: bg }}>
        <div className="h-40 w-40 md:h-48 md:w-48" style={{ background: bg, borderRadius: radius, boxShadow: shadow }} aria-label="Neumorphism preview" role="img" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="mb-4 grid grid-cols-[auto_1fr] items-center gap-3">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Base color" className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent" />
            <div className="text-xs text-muted-foreground">Base color — the surface the element sits on</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {([{ label: "Distance", val: distance, set: setDistance, min: 2, max: 40 },
               { label: "Blur", val: blur, set: setBlur, min: 0, max: 100 },
               { label: "Intensity", val: intensity, set: setIntensity, min: 5, max: 60 },
               { label: "Radius", val: radius, set: setRadius, min: 0, max: 80 }] as const).map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">{c.val}</span>
                </div>
                <Slider value={[c.val]} min={c.min} max={c.max} step={1} onValueChange={(v) => c.set(v[0] ?? 0)} aria-label={c.label} />
              </div>
            ))}
            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch id="pressed" checked={pressed} onCheckedChange={setPressed} aria-label="Pressed state" />
              <Label htmlFor="pressed" className="text-sm">Pressed (inset)</Label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button key={p.name} type="button" onClick={() => applyPreset(p)} className="rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent">{p.name}</button>
            ))}
          </div>
        </div>

        <StickyCode code={css} bootstrap={bootstrap} />
      </div>
    </div>
  );
}