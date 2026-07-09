import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/3d-shapes")({
  head: () => ({
    meta: [
      { title: "3D CSS Shape Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Build rotatable CSS 3D cubes with per-face colors, perspective and auto-spin. Copy production-ready transform CSS.",
      },
      { property: "og:title", content: "3D Shape Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Interactive CSS-only 3D cube preview with copy-ready code.",
      },
      { property: "og:url", content: "/tools/3d-shapes" },
    ],
    links: [{ rel: "canonical", href: "/tools/3d-shapes" }],
  }),
  component: ThreeDPage,
});

const FACES = [
  { key: "front", label: "Front", transform: "translateZ(var(--half))" },
  { key: "back", label: "Back", transform: "rotateY(180deg) translateZ(var(--half))" },
  { key: "right", label: "Right", transform: "rotateY(90deg) translateZ(var(--half))" },
  { key: "left", label: "Left", transform: "rotateY(-90deg) translateZ(var(--half))" },
  { key: "top", label: "Top", transform: "rotateX(90deg) translateZ(var(--half))" },
  { key: "bottom", label: "Bottom", transform: "rotateX(-90deg) translateZ(var(--half))" },
] as const;

function ThreeDPage() {
  const [rx, setRx] = useState(-20);
  const [ry, setRy] = useState(30);
  const [rz, setRz] = useState(0);
  const [size, setSize] = useState(140);
  const [perspective, setPerspective] = useState(800);
  const [spin, setSpin] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({
    front: "#8b5cf6",
    back: "#22d3ee",
    right: "#ec4899",
    left: "#f59e0b",
    top: "#10b981",
    bottom: "#ef4444",
  });

  const presets = [
    {
      name: "Isometric",
      rx: -20,
      ry: 30,
      rz: 0,
      perspective: 800,
      colors: {
        front: "#8b5cf6",
        back: "#22d3ee",
        right: "#ec4899",
        left: "#f59e0b",
        top: "#10b981",
        bottom: "#ef4444",
      },
    },
    {
      name: "Flip Card",
      rx: 0,
      ry: 180,
      rz: 0,
      perspective: 1200,
      colors: {
        front: "#0ea5e9",
        back: "#f43f5e",
        right: "#334155",
        left: "#334155",
        top: "#334155",
        bottom: "#334155",
      },
    },
    {
      name: "Spinning Die",
      rx: -25,
      ry: 45,
      rz: 0,
      perspective: 600,
      colors: {
        front: "#f8fafc",
        back: "#f8fafc",
        right: "#f8fafc",
        left: "#f8fafc",
        top: "#f8fafc",
        bottom: "#f8fafc",
      },
    },
    {
      name: "Neon Cube",
      rx: -30,
      ry: 45,
      rz: 0,
      perspective: 900,
      colors: {
        front: "#22d3ee",
        back: "#a855f7",
        right: "#ec4899",
        left: "#22c55e",
        top: "#fde047",
        bottom: "#f97316",
      },
    },
    {
      name: "Monochrome",
      rx: -15,
      ry: 25,
      rz: 0,
      perspective: 1000,
      colors: {
        front: "#1f2937",
        back: "#4b5563",
        right: "#374151",
        left: "#4b5563",
        top: "#111827",
        bottom: "#6b7280",
      },
    },
  ];
  const apply = (p: (typeof presets)[number]) => {
    setRx(p.rx);
    setRy(p.ry);
    setRz(p.rz);
    setPerspective(p.perspective);
    setColors(p.colors);
  };

  useEffect(() => {
    if (!spin) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      setRy((y) => (y + dt * 0.06) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spin]);

  const css = `.scene { perspective: ${perspective}px; }
.cube {
  position: relative;
  width: ${size}px; height: ${size}px;
  transform-style: preserve-3d;
  transform: rotateX(${rx.toFixed(0)}deg) rotateY(${ry.toFixed(0)}deg) rotateZ(${rz.toFixed(0)}deg);
}
.face { position: absolute; inset: 0; }
${FACES.map((f) => `.face.${f.key} { background: ${colors[f.key]}; transform: ${f.transform.replace("var(--half)", `${size / 2}px`)}; }`).join("\n")}`;

  const transform = `rotateX(${rx.toFixed(0)}deg)_rotateY(${ry.toFixed(0)}deg)_rotateZ(${rz.toFixed(0)}deg)`;
  const tailwind = `<div class="[perspective:${perspective}px]">\n  <div class="relative [transform-style:preserve-3d] [width:${size}px] [height:${size}px] [transform:${transform}]">\n${FACES.map((f) => `    <div class="absolute inset-0 [background:${colors[f.key]}] [transform:${f.transform.replace("var(--half)", `${size / 2}px`).replace(/\s+/g, "_")}]"></div>`).join("\n")}\n  </div>\n</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: position-relative, position-absolute, top-0, start-0, w-100, h-100 -->\n<div class="craft-scene">\n  <div class="craft-cube position-relative">\n${FACES.map((f) => `    <div class="craft-face-${f.key} position-absolute top-0 start-0 w-100 h-100"></div>`).join("\n")}\n  </div>\n</div>\n\n<!-- Bootstrap has no utility for: perspective, transform-style, arbitrary 3D transforms, custom face colors, arbitrary width/height in px. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-scene { perspective: ${perspective}px; }\n.craft-cube {\n  width: ${size}px; height: ${size}px;\n  transform-style: preserve-3d;\n  transform: rotateX(${rx.toFixed(0)}deg) rotateY(${ry.toFixed(0)}deg) rotateZ(${rz.toFixed(0)}deg);\n}\n${FACES.map((f) => `.craft-face-${f.key} {\n  background: ${colors[f.key]};\n  transform: ${f.transform.replace("var(--half)", `${size / 2}px`)};\n}`).join("\n")}`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="3D Shape Generator"
        description="Rotate a CSS 3D cube on X/Y/Z, customize each face, and copy the transform stack."
      />

      <div
        className="relative flex min-h-[16rem] max-h-[18rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6"
        style={{ perspective: `${perspective}px` }}
      >
        <div
          className="relative"
          style={{
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
            transition: spin ? "none" : "transform 200ms",
          }}
        >
          {FACES.map((f) => (
            <div
              className="absolute inset-0 border border-white/20 flex items-center justify-center"
              style={{
                background: colors[f.key],
                transform: f.transform.replace("var(--half)", `${size / 2}px`),
              }}
            >
              <span className="rounded bg-black/70 px-1.5 py-0.5 text-sm font-medium text-white">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="mb-3">
            <Label className="mb-1 block text-xs">Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => apply(p)}
                  className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                { label: "Rotate X", val: rx, set: setRx, min: -180, max: 180, unit: "deg" },
                { label: "Rotate Y", val: ry, set: setRy, min: -180, max: 180, unit: "deg" },
                { label: "Rotate Z", val: rz, set: setRz, min: -180, max: 180, unit: "deg" },
                { label: "Size", val: size, set: setSize, min: 60, max: 180, unit: "px" },
                {
                  label: "Perspective",
                  val: perspective,
                  set: setPerspective,
                  min: 400,
                  max: 2000,
                  unit: "px",
                },
              ] as const
            ).map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {Math.round(c.val)}
                    {c.unit}
                  </span>
                </div>
                <Slider
                  value={[c.val]}
                  min={c.min}
                  max={c.max}
                  step={1}
                  onValueChange={(v) => c.set(v[0] ?? 0)}
                  aria-label={c.label}
                />
              </div>
            ))}
            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch id="spin" checked={spin} onCheckedChange={setSpin} aria-label="Auto spin" />
              <Label htmlFor="spin" className="text-sm">
                Auto-spin
              </Label>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setRx(-20);
                  setRy(30);
                  setRz(0);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-2 block text-xs">Face colors</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FACES.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center gap-2 rounded-md border border-border p-2"
                >
                  <input
                    type="color"
                    value={colors[f.key]}
                    onChange={(e) => setColors((c) => ({ ...c, [f.key]: e.target.value }))}
                    aria-label={`${f.label} color`}
                    className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <span className="text-xs">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
