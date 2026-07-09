import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/svg")({
  head: () => ({
    meta: [
      { title: "SVG Shape Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Generate circles, rectangles, stars, organic blobs and wave dividers as SVG or CSS background data-URIs.",
      },
      { property: "og:title", content: "SVG Generator — SagaCSS" },
      { property: "og:description", content: "Design production-ready SVG shapes visually." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/svg" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/svg" }],
  }),
  component: SvgPage,
});

type ShapeType = "circle" | "rectangle" | "star" | "blob" | "wave";

function starPoints(cx: number, cy: number, r1: number, r2: number, points: number) {
  const step = Math.PI / points;
  const out: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = i * step - Math.PI / 2;
    out.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return out.join(" ");
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function blobPath(seed: number, complexity: number, size = 200) {
  const rand = mulberry32(seed);
  const cx = size / 2;
  const cy = size / 2;
  const base = size * 0.36;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < complexity; i++) {
    const a = (i / complexity) * Math.PI * 2;
    const r = base + (rand() - 0.5) * base * 0.7;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  // Catmull-Rom-ish smooth close via quadratic beziers between midpoints.
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const n = pts[(i + 1) % pts.length];
    const mx = (p.x + n.x) / 2;
    const my = (p.y + n.y) / 2;
    if (i === 0) d += `M ${mx.toFixed(1)} ${my.toFixed(1)} `;
    else d += `Q ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)} `;
  }
  d += "Z";
  return d;
}

function wavePath(width: number, height: number, amplitude: number, frequency: number) {
  const steps = 40;
  const pts: string[] = [`M 0 ${height / 2}`];
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = height / 2 + Math.sin((i / steps) * Math.PI * 2 * frequency) * amplitude;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push(`L ${width} ${height}`);
  pts.push(`L 0 ${height}`);
  pts.push(`Z`);
  return pts.join(" ");
}

function SvgPage() {
  const [shape, setShape] = useState<ShapeType>("blob");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [fill, setFill] = useState("#8b5cf6");
  const [stroke, setStroke] = useState("#0f172a");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [rectRadius, setRectRadius] = useState(16);
  const [starPointsN, setStarPointsN] = useState(5);
  const [starInner, setStarInner] = useState(45);
  const [blobSeed, setBlobSeed] = useState(42);
  const [blobComplexity, setBlobComplexity] = useState(8);
  const [waveAmp, setWaveAmp] = useState(20);
  const [waveFreq, setWaveFreq] = useState(2);

  const inner = useMemo(() => {
    const strokeAttrs = strokeWidth > 0 ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : "";
    switch (shape) {
      case "circle": {
        const r = Math.min(width, height) / 2 - strokeWidth / 2;
        return `<circle cx="${width / 2}" cy="${height / 2}" r="${r}" fill="${fill}"${strokeAttrs} />`;
      }
      case "rectangle":
        return `<rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${width - strokeWidth}" height="${height - strokeWidth}" rx="${rectRadius}" fill="${fill}"${strokeAttrs} />`;
      case "star": {
        const r1 = Math.min(width, height) / 2 - strokeWidth / 2;
        const r2 = r1 * (starInner / 100);
        return `<polygon points="${starPoints(width / 2, height / 2, r1, r2, starPointsN)}" fill="${fill}"${strokeAttrs} />`;
      }
      case "blob":
        return `<path d="${blobPath(blobSeed, blobComplexity, Math.min(width, height))}" fill="${fill}"${strokeAttrs} />`;
      case "wave":
        return `<path d="${wavePath(width, height, waveAmp, waveFreq)}" fill="${fill}"${strokeAttrs} />`;
    }
  }, [
    shape,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
    rectRadius,
    starPointsN,
    starInner,
    blobSeed,
    blobComplexity,
    waveAmp,
    waveFreq,
  ]);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n  ${inner}\n</svg>`;
  const dataUri = `background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}");\nbackground-repeat: no-repeat;\nbackground-size: contain;`;

  const preferWave = shape === "wave";

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="SVG Generator"
        description="Generate circles, rectangles, stars, organic blobs and wave dividers. Copy as SVG or CSS background."
      />

      <div className="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div dangerouslySetInnerHTML={{ __html: svg }} role="img" aria-label="SVG preview" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex flex-wrap gap-1 rounded-md border border-border p-1">
            {(["circle", "rectangle", "star", "blob", "wave"] as ShapeType[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setShape(s);
                  if (s === "wave") {
                    setWidth(600);
                    setHeight(120);
                  } else {
                    setWidth(200);
                    setHeight(200);
                  }
                }}
                aria-pressed={shape === s}
                className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors ${shape === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Width</Label>
                <span className="font-mono text-xs text-muted-foreground">{width}</span>
              </div>
              <Slider
                value={[width]}
                min={40}
                max={preferWave ? 1200 : 400}
                step={4}
                onValueChange={(v) => setWidth(v[0] ?? 200)}
                aria-label="Width"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Height</Label>
                <span className="font-mono text-xs text-muted-foreground">{height}</span>
              </div>
              <Slider
                value={[height]}
                min={40}
                max={400}
                step={4}
                onValueChange={(v) => setHeight(v[0] ?? 200)}
                aria-label="Height"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Fill</Label>
              <input
                type="color"
                value={fill}
                onChange={(e) => setFill(e.target.value)}
                aria-label="Fill color"
                className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Stroke</Label>
              <input
                type="color"
                value={stroke}
                onChange={(e) => setStroke(e.target.value)}
                aria-label="Stroke color"
                className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Stroke width</Label>
                <span className="font-mono text-xs text-muted-foreground">{strokeWidth}</span>
              </div>
              <Slider
                value={[strokeWidth]}
                min={0}
                max={20}
                step={1}
                onValueChange={(v) => setStrokeWidth(v[0] ?? 0)}
                aria-label="Stroke width"
              />
            </div>

            {shape === "rectangle" && (
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">Corner radius</Label>
                  <span className="font-mono text-xs text-muted-foreground">{rectRadius}</span>
                </div>
                <Slider
                  value={[rectRadius]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(v) => setRectRadius(v[0] ?? 0)}
                  aria-label="Corner radius"
                />
              </div>
            )}
            {shape === "star" && (
              <>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">Points</Label>
                    <span className="font-mono text-xs text-muted-foreground">{starPointsN}</span>
                  </div>
                  <Slider
                    value={[starPointsN]}
                    min={3}
                    max={12}
                    step={1}
                    onValueChange={(v) => setStarPointsN(v[0] ?? 5)}
                    aria-label="Star points"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">Inner radius %</Label>
                    <span className="font-mono text-xs text-muted-foreground">{starInner}</span>
                  </div>
                  <Slider
                    value={[starInner]}
                    min={10}
                    max={90}
                    step={1}
                    onValueChange={(v) => setStarInner(v[0] ?? 45)}
                    aria-label="Inner radius"
                  />
                </div>
              </>
            )}
            {shape === "blob" && (
              <>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">Complexity</Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {blobComplexity}
                    </span>
                  </div>
                  <Slider
                    value={[blobComplexity]}
                    min={4}
                    max={16}
                    step={1}
                    onValueChange={(v) => setBlobComplexity(v[0] ?? 8)}
                    aria-label="Blob complexity"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setBlobSeed(Math.floor(Math.random() * 100000))}
                  >
                    <Shuffle className="h-4 w-4" /> Randomize
                  </Button>
                </div>
              </>
            )}
            {shape === "wave" && (
              <>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">Amplitude</Label>
                    <span className="font-mono text-xs text-muted-foreground">{waveAmp}</span>
                  </div>
                  <Slider
                    value={[waveAmp]}
                    min={0}
                    max={80}
                    step={1}
                    onValueChange={(v) => setWaveAmp(v[0] ?? 20)}
                    aria-label="Wave amplitude"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">Frequency</Label>
                    <span className="font-mono text-xs text-muted-foreground">{waveFreq}</span>
                  </div>
                  <Slider
                    value={[waveFreq]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={(v) => setWaveFreq(v[0] ?? 2)}
                    aria-label="Wave frequency"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <StickyCode
          code={svg}
          tailwind={`{/* Inline SVG works anywhere in a React/Tailwind app */}\n${svg}\n\n{/* Or use as a Tailwind background utility */}\n<div class="bg-no-repeat bg-contain bg-[url('data:image/svg+xml;utf8,${encodeURIComponent(svg).replace(/'/g, "%27")}')]" />`}
          bootstrap={`<!-- Raw SVG — paste directly into HTML -->\n${svg}\n\n<!-- Or apply as a background — markup uses real Bootstrap utilities: d-inline-block, w-100, h-100 -->\n<div class="craft-svg d-inline-block w-100 h-100"></div>\n\n<!-- Bootstrap has no utility for: inline SVG data-URI background-image. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-svg {\n  ${dataUri.replace(/\n/g, "\n  ")}\n  background-repeat: no-repeat;\n  background-size: contain;\n}`}
        />
      </div>
    </div>
  );
}
