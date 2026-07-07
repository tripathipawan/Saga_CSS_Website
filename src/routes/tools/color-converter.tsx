import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "@/components/tool-header";
import { hexToRgb, rgbToHex } from "@/lib/color";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/color-converter")({
  head: () => ({
    meta: [
      { title: "Color Converter — HEX RGB HSL HWB CMYK LCH | SagaCSS" },
      { name: "description", content: "Convert any color between HEX, RGB, RGBA, HSL, HSLA, HWB, CMYK, LCH, XYZ and named CSS colors with live sync between picker, sliders and hex input." },
      { property: "og:title", content: "Color Converter — SagaCSS" },
      { property: "og:description", content: "Convert colors between every major CSS format with live preview." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/color-converter" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/color-converter" }],
  }),
  component: ColorConverterPage,
});

// --- conversions ---
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
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function rgbToHwb(r: number, g: number, b: number) {
  const { h } = rgbToHsl(r, g, b);
  const w = Math.min(r, g, b) / 255;
  const bl = 1 - Math.max(r, g, b) / 255;
  return { h, w: Math.round(w * 100), b: Math.round(bl * 100) };
}
function rgbToCmyk(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}
function srgbToLinear(v: number) {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function rgbToXyz(r: number, g: number, b: number) {
  const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
  return {
    x: +(R * 0.4124564 + G * 0.3575761 + B * 0.1804375).toFixed(4) * 100,
    y: +(R * 0.2126729 + G * 0.7151522 + B * 0.0721750).toFixed(4) * 100,
    z: +(R * 0.0193339 + G * 0.1191920 + B * 0.9503041).toFixed(4) * 100,
  };
}
function rgbToLch(r: number, g: number, b: number) {
  const { x, y, z } = rgbToXyz(r, g, b);
  // D65 reference white
  const Xn = 95.047, Yn = 100.000, Zn = 108.883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116));
  const L = 116 * f(y / Yn) - 16;
  const a = 500 * (f(x / Xn) - f(y / Yn));
  const bb = 200 * (f(y / Yn) - f(z / Zn));
  const c = Math.sqrt(a * a + bb * bb);
  let h = Math.atan2(bb, a) * (180 / Math.PI);
  if (h < 0) h += 360;
  return { l: +L.toFixed(2), c: +c.toFixed(2), h: +h.toFixed(2) };
}

const NAMED: Record<string, string> = {
  black: "#000000", white: "#ffffff", red: "#ff0000", lime: "#00ff00", blue: "#0000ff",
  yellow: "#ffff00", cyan: "#00ffff", magenta: "#ff00ff", silver: "#c0c0c0", gray: "#808080",
  maroon: "#800000", olive: "#808000", green: "#008000", purple: "#800080", teal: "#008080",
  navy: "#000080", orange: "#ffa500", pink: "#ffc0cb", brown: "#a52a2a", gold: "#ffd700",
  indigo: "#4b0082", violet: "#ee82ee", tomato: "#ff6347", coral: "#ff7f50", salmon: "#fa8072",
  turquoise: "#40e0d0", tan: "#d2b48c", khaki: "#f0e68c", plum: "#dda0dd", orchid: "#da70d6",
  crimson: "#dc143c", chocolate: "#d2691e", "sky blue": "#87ceeb", "hot pink": "#ff69b4",
};
function nearestNamed(r: number, g: number, b: number) {
  let best = "", bestD = Infinity;
  for (const [name, hex] of Object.entries(NAMED)) {
    const rgb = hexToRgb(hex)!;
    const d = (rgb.r - r) ** 2 + (rgb.g - g) ** 2 + (rgb.b - b) ** 2;
    if (d < bestD) { bestD = d; best = name; }
  }
  return best;
}

function copy(text: string) {
  navigator.clipboard.writeText(text).then(() => toast.success("Copied"), () => toast.error("Copy failed"));
}

function Row({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background/50 p-2">
      <div className="w-20 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <code className="flex-1 truncate font-mono text-sm">{value}</code>
      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => { copy(value); setOk(true); setTimeout(() => setOk(false), 1200); }} aria-label={`Copy ${label} value`}>
        {ok ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

function ColorConverterPage() {
  const [hex, setHex] = useState("#8b5cf6");
  const rgb = useMemo(() => hexToRgb(hex) ?? { r: 139, g: 92, b: 246 }, [hex]);

  const update = (r: number, g: number, b: number) => setHex(rgbToHex(
    Math.round(Math.max(0, Math.min(255, r))),
    Math.round(Math.max(0, Math.min(255, g))),
    Math.round(Math.max(0, Math.min(255, b))),
  ));

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  const lch = rgbToLch(rgb.r, rgb.g, rgb.b);
  const named = nearestNamed(rgb.r, rgb.g, rgb.b);

  const values = {
    HEX: hex.toUpperCase(),
    RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    RGBA: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    HSLA: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
    HWB: `hwb(${hwb.h} ${hwb.w}% ${hwb.b}%)`,
    CMYK: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    LCH: `lch(${lch.l}% ${lch.c} ${lch.h})`,
    XYZ: `xyz(${xyz.x.toFixed(2)} ${xyz.y.toFixed(2)} ${xyz.z.toFixed(2)})`,
    Named: named,
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Color Converter" description="Convert any color between HEX, RGB, HSL, HWB, CMYK, LCH, XYZ and the nearest CSS named color — all synced." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-border shadow-inner" style={{ background: hex }} aria-label={`Color preview ${hex}`} role="img">
            <span className="rounded-md bg-black/40 px-3 py-1 font-mono text-sm text-white backdrop-blur-sm">{hex.toUpperCase()}</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent" aria-label="Color picker" />
              <Input value={hex} onChange={(e) => { const v = e.target.value; if (/^#?[0-9a-fA-F]{0,6}$/.test(v)) setHex(v.startsWith("#") ? v : `#${v}`); }} className="font-mono" aria-label="Hex value" />
            </div>

            <div className="mt-4 space-y-3">
              {(["r", "g", "b"] as const).map((k) => (
                <div key={k}>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wide">{k}</Label>
                    <span className="font-mono text-xs">{rgb[k]}</span>
                  </div>
                  <Slider value={[rgb[k]]} min={0} max={255} step={1} aria-label={`${k.toUpperCase()} channel`}
                    onValueChange={(v) => update(k === "r" ? v[0] : rgb.r, k === "g" ? v[0] : rgb.g, k === "b" ? v[0] : rgb.b)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {Object.entries(values).map(([k, v]) => <Row key={k} label={k} value={v} />)}
        </div>
      </div>
    </div>
  );
}