import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/box-sizing")({
  head: () => ({
    meta: [
      { title: "Box Model & Sizing Tool — SagaCSS" },
      {
        name: "description",
        content:
          "Visualize the CSS box model with live width, padding, margin and border controls and copy the CSS.",
      },
      { property: "og:title", content: "Box Sizing Tool — SagaCSS" },
      {
        property: "og:description",
        content: "Interactive CSS box model visualizer with copy-ready code.",
      },
      { property: "og:url", content: "/tools/box-sizing" },
    ],
    links: [{ rel: "canonical", href: "/tools/box-sizing" }],
  }),
  component: BoxSizingPage,
});

const UNITS = ["px", "%", "rem", "vw", "vh"] as const;
type Unit = (typeof UNITS)[number];

const UNIT_RANGES: Record<Unit, { min: number; max: number; defaultW: number; defaultH: number }> =
  {
    px: { min: 20, max: 500, defaultW: 240, defaultH: 140 },
    "%": { min: 1, max: 100, defaultW: 60, defaultH: 40 },
    rem: { min: 1, max: 30, defaultW: 15, defaultH: 9 },
    vw: { min: 1, max: 50, defaultW: 30, defaultH: 18 },
    vh: { min: 1, max: 50, defaultW: 30, defaultH: 18 },
  };

function rescale(val: number, from: Unit, to: Unit) {
  const f = UNIT_RANGES[from];
  const t = UNIT_RANGES[to];
  const ratio = (val - f.min) / (f.max - f.min || 1);
  return Math.round((t.min + ratio * (t.max - t.min)) * 10) / 10;
}

function BoxSizingPage() {
  const [unit, setUnit] = useState<Unit>("px");
  const [w, setW] = useState(240);
  const [h, setH] = useState(140);
  const [pad, setPad] = useState(16);
  const [margin, setMargin] = useState(16);
  const [border, setBorder] = useState(2);

  const changeUnit = (next: Unit) => {
    if (next === unit) return;
    setW((prev) => rescale(prev, unit, next));
    setH((prev) => rescale(prev, unit, next));
    setUnit(next);
  };

  const css = useMemo(
    () => `width: ${w}${unit};
height: ${h}${unit};
padding: ${pad}px;
margin: ${margin}px;
border: ${border}px solid #8b5cf6;
box-sizing: border-box;`,
    [w, h, pad, margin, border, unit],
  );

  const sizeStep = (n: number) =>
    n === 0 ? "0" : n <= 4 ? "1" : n <= 8 ? "2" : n <= 16 ? "3" : n <= 24 ? "4" : "5";
  const borderCls =
    border === 0
      ? "border-0"
      : border <= 2
        ? "border"
        : border <= 3
          ? "border border-2"
          : border <= 4
            ? "border border-3"
            : border <= 5
              ? "border border-4"
              : "border border-5";
  const bootstrap = useMemo(
    () =>
      `<!-- markup — uses real Bootstrap utilities: m-${sizeStep(margin)}, p-${sizeStep(pad)}, ${borderCls} -->\n<div class="m-${sizeStep(margin)}">\n  <div class="craft-box p-${sizeStep(pad)} ${borderCls}">…</div>\n</div>\n\n<!-- Bootstrap has no utility for: arbitrary width/height values, custom border color. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-box {\n  width: ${w}${unit};\n  height: ${h}${unit};\n  border-color: #8b5cf6;\n}`,
    [w, h, pad, margin, border, unit, borderCls],
  );

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Box Model & Sizing"
        description="Adjust width, padding, margin and border, then copy the CSS with the DevTools-style box diagram."
      />

      <div className="flex min-h-[16rem] max-h-[18rem] max-h-[32rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div
          className="relative max-w-full max-h-full overflow-hidden rounded-md"
          style={{ padding: margin, background: "rgba(251, 191, 36, 0.15)" }}
        >
          <div className="absolute left-1 top-1 text-[10px] font-mono text-yellow-700 dark:text-yellow-300">
            margin {margin}px
          </div>
          <div style={{ border: `${border}px solid #8b5cf6` }}>
            <div
              className="relative"
              style={{ padding: pad, background: "rgba(34, 211, 238, 0.15)" }}
            >
              <div className="absolute left-1 top-1 text-[10px] font-mono text-cyan-700 dark:text-cyan-300">
                padding {pad}px
              </div>
              <div
                className="flex items-center justify-center overflow-hidden rounded bg-primary/80 text-primary-foreground font-mono text-xs"
                style={{
                  width: `${w}${unit}`,
                  height: `${h}${unit}`,
                  maxWidth: "100%",
                  maxHeight: "24rem",
                }}
              >
                content {w}
                {unit} × {h}
                {unit}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Label className="text-xs">Unit for width/height</Label>
            <div className="flex gap-1 rounded-md border border-border p-1">
              {UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => changeUnit(u)}
                  aria-pressed={unit === u}
                  className={`rounded px-2 py-1 text-xs ${unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                {
                  label: "Width",
                  val: w,
                  set: setW,
                  min: UNIT_RANGES[unit].min,
                  max: UNIT_RANGES[unit].max,
                  step: unit === "px" ? 1 : 0.5,
                },
                {
                  label: "Height",
                  val: h,
                  set: setH,
                  min: UNIT_RANGES[unit].min,
                  max: UNIT_RANGES[unit].max,
                  step: unit === "px" ? 1 : 0.5,
                },
                { label: "Padding", val: pad, set: setPad, min: 0, max: 80, step: 1 },
                { label: "Margin", val: margin, set: setMargin, min: 0, max: 80, step: 1 },
                { label: "Border", val: border, set: setBorder, min: 0, max: 20, step: 1 },
              ] as const
            ).map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.val}
                    {c.label === "Width" || c.label === "Height" ? unit : "px"}
                  </span>
                </div>
                <Slider
                  value={[c.val]}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  onValueChange={(v) => c.set(v[0] ?? 0)}
                  aria-label={c.label}
                />
              </div>
            ))}
          </div>
        </div>
        <StickyCode code={css} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
