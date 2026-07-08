import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/clamp")({
  head: () => ({
    meta: [
      { title: "CSS clamp() Calculator — SagaCSS" },
      {
        name: "description",
        content:
          "Build fluid, responsive font-size and spacing with CSS clamp() — set min/max viewport widths and preview scaling live.",
      },
      { property: "og:title", content: "CSS clamp() Calculator — SagaCSS" },
      {
        property: "og:description",
        content: "Visual clamp() generator for fluid, responsive typography and spacing.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/clamp" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/clamp" }],
  }),
  component: ClampPage,
});

function ClampPage() {
  const [unit, setUnit] = useState<"px" | "rem">("rem");
  const [minVal, setMinVal] = useState(1); // rem
  const [maxVal, setMaxVal] = useState(2.5); // rem
  const [minVw, setMinVw] = useState(320);
  const [maxVw, setMaxVw] = useState(1280);
  const [simVw, setSimVw] = useState(768);

  const rootPx = 16;
  const minPx = unit === "px" ? minVal : minVal * rootPx;
  const maxPx = unit === "px" ? maxVal : maxVal * rootPx;

  const clamp = useMemo(() => {
    const slope = (maxPx - minPx) / (maxVw - minVw);
    const intercept = minPx - slope * minVw;
    const vw = (slope * 100).toFixed(3);
    const rem = (intercept / rootPx).toFixed(3);
    const minStr = unit === "px" ? `${minVal}px` : `${minVal}rem`;
    const maxStr = unit === "px" ? `${maxVal}px` : `${maxVal}rem`;
    return `clamp(${minStr}, ${vw}vw + ${rem}rem, ${maxStr})`;
  }, [minPx, maxPx, minVw, maxVw, unit, minVal, maxVal]);

  const previewPx = useMemo(() => {
    if (simVw <= minVw) return minPx;
    if (simVw >= maxVw) return maxPx;
    const t = (simVw - minVw) / (maxVw - minVw);
    return minPx + t * (maxPx - minPx);
  }, [simVw, minVw, maxVw, minPx, maxPx]);

  const css = `font-size: ${clamp};`;
  const clampEsc = clamp.replace(/\s+/g, "_");
  const tailwind = `<p class="[font-size:${clampEsc}]">Fluid text</p>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: fw-bold -->\n<p class="craft-fluid fw-bold">Fluid text</p>\n\n<!-- Bootstrap has no utility for: fluid font-size via clamp(). -->\n@use "bootstrap/scss/utilities" as *;\n.craft-fluid { font-size: ${clamp}; }`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="CSS clamp() Calculator"
        description="Fluid, responsive sizes that scale smoothly between two viewport widths."
      />

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-4 md:p-6">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Simulated viewport</span>
          <span className="font-mono">
            {simVw}px — computed: {previewPx.toFixed(1)}px
          </span>
        </div>
        <div
          className="mx-auto overflow-hidden rounded-lg border border-border bg-background shadow-sm"
          style={{ width: `min(100%, ${simVw}px)`, transition: "width 120ms ease" }}
        >
          <div className="p-6">
            <p style={{ fontSize: `${previewPx}px`, lineHeight: 1.2, margin: 0, fontWeight: 700 }}>
              Fluid Typography
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Drag the slider to preview how this value scales.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Unit</Label>
            <div className="flex gap-0.5 rounded-md border border-border p-0.5">
              {(["rem", "px"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  aria-pressed={unit === u}
                  className={`rounded px-2 py-1 text-xs ${unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SR
              label={`Min value (${unit})`}
              value={minVal}
              setValue={setMinVal}
              min={unit === "px" ? 8 : 0.5}
              max={unit === "px" ? 40 : 3}
              step={unit === "px" ? 1 : 0.05}
            />
            <SR
              label={`Max value (${unit})`}
              value={maxVal}
              setValue={setMaxVal}
              min={unit === "px" ? 12 : 1}
              max={unit === "px" ? 120 : 8}
              step={unit === "px" ? 1 : 0.05}
            />
            <SR
              label="Min viewport (px)"
              value={minVw}
              setValue={setMinVw}
              min={280}
              max={800}
              step={10}
            />
            <SR
              label="Max viewport (px)"
              value={maxVw}
              setValue={setMaxVw}
              min={800}
              max={1920}
              step={10}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <Label className="text-xs">Simulated viewport width</Label>
              <span className="font-mono text-xs text-muted-foreground">{simVw}px</span>
            </div>
            <Slider
              value={[simVw]}
              min={280}
              max={1920}
              step={1}
              onValueChange={(v) => setSimVw(v[0] ?? 320)}
              aria-label="Simulated viewport width"
            />
          </div>
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}

function SR({
  label,
  value,
  setValue,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => setValue(v[0] ?? min)}
        aria-label={label}
      />
    </div>
  );
}
