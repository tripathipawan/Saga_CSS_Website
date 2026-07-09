import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Upload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/filter")({
  head: () => ({
    meta: [
      { title: "CSS Filter Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Combine blur, brightness, contrast, hue-rotate, saturate, sepia and drop-shadow filters live over an image and copy the generated CSS.",
      },
      { property: "og:title", content: "CSS Filter Generator — SagaCSS" },
      {
        property: "og:description",
        content:
          "Stack multiple CSS filters live on an image with instant CSS / Tailwind / Bootstrap output.",
      },
      { property: "og:url", content: "/tools/filter" },
    ],
    links: [{ rel: "canonical", href: "/tools/filter" }],
  }),
  component: FilterPage,
});

const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
      <defs>
        <linearGradient id='sky' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0' stop-color='#fbbf24'/><stop offset='.6' stop-color='#f472b6'/><stop offset='1' stop-color='#7c3aed'/>
        </linearGradient>
        <linearGradient id='mtn' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0' stop-color='#1e293b'/><stop offset='1' stop-color='#0f172a'/>
        </linearGradient>
      </defs>
      <rect width='800' height='500' fill='url(#sky)'/>
      <circle cx='620' cy='150' r='60' fill='#fef3c7'/>
      <polygon points='0,500 180,260 320,380 470,220 640,360 800,280 800,500' fill='url(#mtn)'/>
      <polygon points='0,500 120,340 260,420 380,320 520,440 700,340 800,410 800,500' fill='#0b1220' opacity='.85'/>
    </svg>`,
  );

type F = {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dsX: number;
  dsY: number;
  dsBlur: number;
  dsColor: string;
};

const DEFAULT: F = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
  dsX: 0,
  dsY: 0,
  dsBlur: 0,
  dsColor: "#000000",
};

const PRESETS: Record<string, Partial<F>> = {
  Vintage: { sepia: 40, contrast: 110, brightness: 105, saturate: 120, hueRotate: -10 },
  "B&W": { grayscale: 100, contrast: 110 },
  Cold: { hueRotate: 200, saturate: 120, brightness: 105 },
  Warm: { sepia: 20, saturate: 140, brightness: 105, hueRotate: -15 },
  Dreamy: { blur: 2, brightness: 110, saturate: 130, contrast: 90 },
  "High Contrast": { contrast: 160, brightness: 105, saturate: 110 },
};

function buildFilter(f: F) {
  const parts: string[] = [];
  if (f.blur) parts.push(`blur(${f.blur}px)`);
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
  if (f.grayscale) parts.push(`grayscale(${f.grayscale}%)`);
  if (f.hueRotate) parts.push(`hue-rotate(${f.hueRotate}deg)`);
  if (f.invert) parts.push(`invert(${f.invert}%)`);
  if (f.opacity !== 100) parts.push(`opacity(${f.opacity}%)`);
  if (f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`);
  if (f.sepia) parts.push(`sepia(${f.sepia}%)`);
  if (f.dsBlur || f.dsX || f.dsY)
    parts.push(`drop-shadow(${f.dsX}px ${f.dsY}px ${f.dsBlur}px ${f.dsColor})`);
  return parts.join(" ") || "none";
}

function FilterPage() {
  const [f, setF] = useState<F>(DEFAULT);
  const [src, setSrc] = useState<string>(SAMPLE_IMAGE);
  const inputRef = useRef<HTMLInputElement>(null);

  const filter = useMemo(() => buildFilter(f), [f]);
  const css = `filter: ${filter};`;
  const filterEsc = filter.replace(/\s+/g, "_");
  const tailwind = `<img src="..." class="[filter:${filterEsc}]" alt="" />`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: img-fluid, rounded -->\n<img src="..." class="craft-filter img-fluid rounded" alt="" />\n\n<!-- Bootstrap has no utility for: CSS filter (blur/brightness/contrast/etc.). -->\n@use "bootstrap/scss/utilities" as *;\n.craft-filter { filter: ${filter}; }`;

  const setKey = (k: keyof F, v: F[keyof F]) => setF((s) => ({ ...s, [k]: v }));

  const onUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && setSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const controls: {
    key: keyof F;
    label: string;
    min: number;
    max: number;
    step?: number;
    unit: string;
  }[] = [
    { key: "blur", label: "Blur", min: 0, max: 20, unit: "px" },
    { key: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
    { key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
    { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
    { key: "hueRotate", label: "Hue rotate", min: -180, max: 180, unit: "deg" },
    { key: "invert", label: "Invert", min: 0, max: 100, unit: "%" },
    { key: "opacity", label: "Opacity", min: 0, max: 100, unit: "%" },
    { key: "saturate", label: "Saturate", min: 0, max: 300, unit: "%" },
    { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="CSS Filter Generator"
        description="Stack multiple CSS filters live over any image and copy the combined filter value."
      />

      <div className="flex items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-4 md:p-6 max-h-[22rem]">
        <img
          src={src}
          alt="Filter preview"
          className="max-h-[18rem] w-auto max-w-full rounded-lg shadow"
          style={{ filter }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                aria-label="Upload image"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="gap-1.5"
              >
                <Upload className="h-4 w-4" /> Upload
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSrc(SAMPLE_IMAGE)}>
                Sample
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setF(DEFAULT)} className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {controls.map((c) => (
              <div key={c.key}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {f[c.key] as number}
                    {c.unit}
                  </span>
                </div>
                <Slider
                  value={[f[c.key] as number]}
                  min={c.min}
                  max={c.max}
                  step={c.step ?? 1}
                  onValueChange={(v) => setKey(c.key, (v[0] ?? 0) as F[keyof F])}
                  aria-label={c.label}
                />
              </div>
            ))}
          </div>

          <div className="rounded-md border border-border p-3">
            <div className="mb-2 text-xs font-medium">Drop shadow</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["dsX", "dsY", "dsBlur"] as const).map((k) => (
                <div key={k}>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">
                      {k === "dsX" ? "X" : k === "dsY" ? "Y" : "Blur"}
                    </Label>
                    <span className="font-mono text-xs text-muted-foreground">{f[k]}px</span>
                  </div>
                  <Slider
                    value={[f[k]]}
                    min={k === "dsBlur" ? 0 : -40}
                    max={40}
                    onValueChange={(v) => setKey(k, (v[0] ?? 0) as F[keyof F])}
                    aria-label={`Drop shadow ${k}`}
                  />
                </div>
              ))}
              <div>
                <Label className="mb-1 block text-xs">Color</Label>
                <input
                  type="color"
                  value={f.dsColor}
                  onChange={(e) => setKey("dsColor", e.target.value)}
                  aria-label="Drop shadow color"
                  className="h-8 w-full rounded border border-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRESETS).map(([name, p]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setF({ ...DEFAULT, ...p })}
                  className="rounded-md border border-border px-2 py-2 text-xs font-medium hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Apply ${name} preset`}
                >
                  {name}
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
