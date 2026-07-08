import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb } from "@/lib/color";

export const Route = createFileRoute("/styles/glassmorphism")({
  head: () => ({
    meta: [
      { title: "Glassmorphism Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design frosted glass CSS cards with backdrop-filter blur, opacity, and border controls. Live preview with copy-ready CSS.",
      },
      { property: "og:title", content: "Glassmorphism — SagaCSS" },
      { property: "og:description", content: "Frosted-glass CSS generator with live preview." },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/glassmorphism" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/glassmorphism" }],
  }),
  component: GlassPage,
});

const BACKDROPS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
];

function GlassPage() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.2);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [radius, setRadius] = useState(16);
  const [bgIdx, setBgIdx] = useState(0);
  const [tint, setTint] = useState("#ffffff");

  const rgbObj = hexToRgb(tint) ?? { r: 255, g: 255, b: 255 };
  const rgb = `${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}`;

  const css = useMemo(
    () => `background: rgba(${rgb}, ${opacity});
backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
border-radius: ${radius}px;`,
    [rgb, opacity, blur, borderOpacity, radius],
  );

  const radiusCls =
    radius === 0
      ? "rounded-0"
      : radius <= 4
        ? "rounded-1"
        : radius <= 8
          ? "rounded-2"
          : radius <= 12
            ? "rounded-3"
            : radius <= 20
              ? "rounded-4"
              : "rounded-5";
  const bootstrap = useMemo(
    () =>
      `<!-- markup — uses real Bootstrap utilities: ${radiusCls}, p-4, text-white, border, fs-5, fw-semibold, mb-0, small -->\n<div class="craft-glass border ${radiusCls} p-4 text-white">\n  <h3 class="fs-5 fw-semibold">Frosted glass</h3>\n  <p class="mb-0 small">Preview of your glassmorphic surface.</p>\n</div>\n\n<!-- Bootstrap has no utility for: backdrop-filter, rgba tint background, translucent border color. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-glass {\n  background: rgba(${rgb}, ${opacity});\n  backdrop-filter: blur(${blur}px);\n  -webkit-backdrop-filter: blur(${blur}px);\n  border-color: rgba(255, 255, 255, ${borderOpacity});\n}`,
    [rgb, opacity, blur, borderOpacity, radiusCls],
  );

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Glassmorphism Generator"
        description="Design frosted-glass cards with backdrop-filter blur and translucent surfaces."
      />

      <div
        className="relative flex min-h-[16rem] max-h-[18rem] items-center justify-center overflow-hidden rounded-2xl border border-border p-6"
        style={{ background: BACKDROPS[bgIdx] }}
      >
        <div
          className="w-full max-w-sm p-8 text-white shadow-xl backdrop-blur-md"
          style={{
            background: `rgba(${rgb}, ${opacity})`,
            backdropFilter: `blur(${blur}px)`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
            borderRadius: radius,
          }}
        >
          <h3 className="text-lg font-semibold">Frosted glass</h3>
          <p className="mt-1 text-sm text-white/85">
            Preview of your glassmorphic surface floating above a colorful backdrop.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                { label: "Blur", val: blur, set: setBlur, min: 0, max: 40, step: 1, unit: "px" },
                {
                  label: "Background opacity",
                  val: opacity,
                  set: setOpacity,
                  min: 0,
                  max: 1,
                  step: 0.05,
                  unit: "",
                },
                {
                  label: "Border opacity",
                  val: borderOpacity,
                  set: setBorderOpacity,
                  min: 0,
                  max: 1,
                  step: 0.05,
                  unit: "",
                },
                {
                  label: "Radius",
                  val: radius,
                  set: setRadius,
                  min: 0,
                  max: 60,
                  step: 1,
                  unit: "px",
                },
              ] as const
            ).map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.step < 1 ? c.val.toFixed(2) : c.val}
                    {c.unit}
                  </span>
                </div>
                <Slider
                  value={[c.val]}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  onValueChange={(v) => (c.set as (n: number) => void)(v[0] ?? 0)}
                  aria-label={c.label}
                />
              </div>
            ))}
            <div>
              <Label className="mb-1 block text-xs">Tint color</Label>
              <input
                type="color"
                value={tint}
                onChange={(e) => setTint(e.target.value)}
                aria-label="Tint color"
                className="h-9 w-full cursor-pointer rounded border border-border bg-transparent"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs">Backdrop</Label>
              <div className="flex gap-2">
                {BACKDROPS.map((b, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBgIdx(i)}
                    aria-pressed={bgIdx === i}
                    aria-label={`Backdrop ${i + 1}`}
                    className={`h-8 w-8 rounded-md border-2 ${bgIdx === i ? "border-ring" : "border-border"}`}
                    style={{ background: b }}
                  />
                ))}
              </div>
            </div>
          </div>

          <TooltipProvider>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Browser support info"
                    className="inline-flex items-center gap-1"
                  >
                    <Info className="h-3.5 w-3.5" /> Browser support
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  backdrop-filter works in all modern browsers. Tailwind's build adds Safari's
                  -webkit- prefix automatically.
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <StickyCode code={css} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
