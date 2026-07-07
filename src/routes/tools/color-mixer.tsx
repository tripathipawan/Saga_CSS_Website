import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb, rgbToHex } from "@/lib/color";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/color-mixer")({
  head: () => ({
    meta: [
      { title: "Color Mixer — Blend Two Colors | SagaCSS" },
      { name: "description", content: "Mix any two colors with adjustable ratio, switch between RGB and HSL mixing modes, click the spectrum bar to sample any midpoint." },
      { property: "og:title", content: "Color Mixer — SagaCSS" },
      { property: "og:description", content: "Blend colors visually with RGB or HSL interpolation." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/color-mixer" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/color-mixer" }],
  }),
  component: MixerPage,
});

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}
function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return { r: Math.round(hue(h + 1/3) * 255), g: Math.round(hue(h) * 255), b: Math.round(hue(h - 1/3) * 255) };
}

type Mode = "rgb" | "hsl";
function mix(a: string, b: string, t: number, mode: Mode) {
  const ca = hexToRgb(a) ?? { r: 0, g: 0, b: 0 };
  const cb = hexToRgb(b) ?? { r: 0, g: 0, b: 0 };
  if (mode === "rgb") {
    return rgbToHex(
      Math.round(ca.r + (cb.r - ca.r) * t),
      Math.round(ca.g + (cb.g - ca.g) * t),
      Math.round(ca.b + (cb.b - ca.b) * t),
    );
  }
  const ha = rgbToHsl(ca.r, ca.g, ca.b);
  const hb = rgbToHsl(cb.r, cb.g, cb.b);
  // shortest hue path
  let dh = hb.h - ha.h;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const h = (ha.h + dh * t + 360) % 360;
  const s = ha.s + (hb.s - ha.s) * t;
  const l = ha.l + (hb.l - ha.l) * t;
  const { r, g, b: bl } = hslToRgb(h, s, l);
  return rgbToHex(r, g, bl);
}

function MixerPage() {
  const [a, setA] = useState("#8b5cf6");
  const [b, setB] = useState("#22d3ee");
  const [ratio, setRatio] = useState(50);
  const [mode, setMode] = useState<Mode>("rgb");

  const t = ratio / 100;
  const result = useMemo(() => mix(a, b, t, mode), [a, b, t, mode]);

  const spectrum = useMemo(() => Array.from({ length: 24 }, (_, i) => mix(a, b, i / 23, mode)), [a, b, mode]);

  const css = `background: linear-gradient(90deg, ${a}, ${b});\ncolor: ${result};`;
  const tailwind = `<div class="bg-gradient-to-r from-[${a}] to-[${b}] text-[${result}]">…</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: p-3, rounded, fw-semibold -->\n<div class="craft-mix p-3 rounded fw-semibold">…</div>\n\n<!-- Bootstrap has no utility for: linear-gradient background with custom hex stops, custom text color. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-mix { background: linear-gradient(90deg, ${a}, ${b}); color: ${result}; }`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Color Mixer" description="Blend two colors with an adjustable ratio and switch between RGB and HSL interpolation modes." />

      <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-border p-6" style={{ background: `linear-gradient(135deg, ${a}22, ${b}22)` }}>
        <div className="grid w-full max-w-xl grid-cols-3 items-center gap-3">
          <div className="rounded-xl border border-border shadow-inner" style={{ background: a, aspectRatio: "1" }} aria-label={`Color A ${a}`} role="img" />
          <div className="rounded-xl border-2 border-primary shadow-lg" style={{ background: result, aspectRatio: "1" }} aria-label={`Mixed color ${result}`} role="img" />
          <div className="rounded-xl border border-border shadow-inner" style={{ background: b, aspectRatio: "1" }} aria-label={`Color B ${b}`} role="img" />
        </div>
        <div className="font-mono text-xl font-semibold" style={{ color: result }}>{result.toUpperCase()}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Label className="w-16 text-sm">Color A</Label>
            <input type="color" value={a} onChange={(e) => setA(e.target.value)} className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent" aria-label="Color A" />
            <Input value={a} onChange={(e) => setA(e.target.value)} className="font-mono" aria-label="Color A hex" />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-16 text-sm">Color B</Label>
            <input type="color" value={b} onChange={(e) => setB(e.target.value)} className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent" aria-label="Color B" />
            <Input value={b} onChange={(e) => setB(e.target.value)} className="font-mono" aria-label="Color B hex" />
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <Label>Mix ratio</Label>
              <span className="font-mono text-xs">{100 - ratio}% / {ratio}%</span>
            </div>
            <Slider value={[ratio]} min={0} max={100} step={1} onValueChange={(v) => setRatio(v[0])} aria-label="Mix ratio" />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm">Mode</Label>
            <div className="flex gap-1 rounded-md border border-border p-1">
              {(["rgb", "hsl"] as Mode[]).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
                  className={`rounded px-3 py-1 text-xs uppercase ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>{m}</button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm">Spectrum (click to sample)</Label>
            <div className="flex h-12 w-full overflow-hidden rounded-md border border-border">
              {spectrum.map((c, i) => (
                <button key={i} type="button" onClick={() => setRatio(Math.round((i / (spectrum.length - 1)) * 100))}
                  className="flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ background: c }}
                  aria-label={`Sample at ${Math.round((i / (spectrum.length - 1)) * 100)}%`} />
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success("Mixed color copied"); }} className="gap-2 self-start">
            <Copy className="h-4 w-4" /> Copy {result}
          </Button>
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}