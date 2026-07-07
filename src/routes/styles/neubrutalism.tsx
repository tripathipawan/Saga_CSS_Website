import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/styles/neubrutalism")({
  head: () => ({
    meta: [
      { title: "Neubrutalism Generator — SagaCSS" },
      { name: "description", content: "Design bold neubrutalist buttons and cards with thick borders, hard offset shadows and shadow-shift hover interaction." },
      { property: "og:title", content: "Neubrutalism — SagaCSS" },
      { property: "og:description", content: "Bold, high-contrast neubrutalist CSS generator." },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/neubrutalism" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/neubrutalism" }],
  }),
  component: NeubrutalPage,
});

function NeubrutalPage() {
  const [bg, setBg] = useState("#fef08a");
  const [border, setBorder] = useState("#0f172a");
  const [borderWidth, setBorderWidth] = useState(3);
  const [offX, setOffX] = useState(6);
  const [offY, setOffY] = useState(6);
  const [radius, setRadius] = useState(6);
  const [weight, setWeight] = useState(800);

  const presets = [
    { name: "Classic Yellow", bg: "#fef08a", border: "#0f172a", borderWidth: 3, offX: 6, offY: 6, radius: 6 },
    { name: "Hot Pink", bg: "#fbcfe8", border: "#0f172a", borderWidth: 4, offX: 8, offY: 8, radius: 12 },
    { name: "Lime Punch", bg: "#bef264", border: "#0f172a", borderWidth: 3, offX: 5, offY: 5, radius: 0 },
    { name: "Sky Card", bg: "#7dd3fc", border: "#0f172a", borderWidth: 4, offX: 8, offY: 8, radius: 16 },
    { name: "Inverse", bg: "#0f172a", border: "#fbbf24", borderWidth: 3, offX: 6, offY: 6, radius: 8 },
  ];
  const apply = (p: typeof presets[number]) => {
    setBg(p.bg); setBorder(p.border); setBorderWidth(p.borderWidth); setOffX(p.offX); setOffY(p.offY); setRadius(p.radius);
  };

  const css = useMemo(
    () => `background: ${bg};
color: ${border};
border: ${borderWidth}px solid ${border};
border-radius: ${radius}px;
box-shadow: ${offX}px ${offY}px 0 0 ${border};
font-weight: ${weight};
transition: transform 120ms ease, box-shadow 120ms ease;

/* Hover: shadow flattens */
&:hover {
  transform: translate(${Math.round(offX / 2)}px, ${Math.round(offY / 2)}px);
  box-shadow: ${Math.round(offX / 2)}px ${Math.round(offY / 2)}px 0 0 ${border};
}`,
    [bg, border, borderWidth, offX, offY, radius, weight],
  );

  const radiusCls = radius === 0 ? "rounded-0" : radius <= 4 ? "rounded-1" : radius <= 8 ? "rounded-2" : radius <= 16 ? "rounded-3" : "rounded-4";
  // Bootstrap 5.3 font-weight utilities: fw-lighter, fw-light, fw-normal, fw-medium, fw-semibold, fw-bold, fw-bolder.
  const weightCls = weight >= 800 ? "fw-bolder" : weight >= 700 ? "fw-bold" : weight >= 600 ? "fw-semibold" : weight >= 500 ? "fw-medium" : "fw-normal";
  const bootstrap = useMemo(
    () => `<!-- markup — uses real Bootstrap utilities: ${radiusCls}, ${weightCls}, px-4, py-2, fs-5 -->\n<button type="button" class="craft-brutal ${radiusCls} ${weightCls} px-4 py-2 fs-5">Click me</button>\n\n<!-- Bootstrap has no utility for: custom background/border colors, hard-offset box-shadow (0-blur), hover translate. -->\n<!-- Extend Bootstrap's utility API in _custom.scss: -->\n@use "bootstrap/scss/utilities" as *;\n.craft-brutal {\n  background: ${bg};\n  color: ${border};\n  border: ${borderWidth}px solid ${border};\n  box-shadow: ${offX}px ${offY}px 0 0 ${border};\n  transition: transform 120ms ease, box-shadow 120ms ease;\n}\n.craft-brutal:hover {\n  transform: translate(${Math.round(offX / 2)}px, ${Math.round(offY / 2)}px);\n  box-shadow: ${Math.round(offX / 2)}px ${Math.round(offY / 2)}px 0 0 ${border};\n}`,
    [bg, border, borderWidth, offX, offY, radiusCls, weightCls],
  );

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Neubrutalism Generator" description="Design bold, high-contrast components with thick borders and hard shadows that shift on hover." />

      <div className="flex min-h-[15rem] max-h-[17rem] items-center justify-center rounded-2xl border border-border bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#e2e8f0_10px,#e2e8f0_20px)] p-8 dark:bg-[repeating-linear-gradient(45deg,#0f172a,#0f172a_10px,#1e293b_10px,#1e293b_20px)]">
        <button
          type="button"
          className="px-6 py-3 text-lg transition-all"
          style={{
            background: bg, color: border, border: `${borderWidth}px solid ${border}`, borderRadius: radius,
            boxShadow: `${offX}px ${offY}px 0 0 ${border}`, fontWeight: weight,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = `translate(${offX / 2}px, ${offY / 2}px)`;
            el.style.boxShadow = `${offX / 2}px ${offY / 2}px 0 0 ${border}`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translate(0, 0)";
            el.style.boxShadow = `${offX}px ${offY}px 0 0 ${border}`;
          }}
        >
          Click me — hover to shift
        </button>
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs">Background</Label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background" className="h-9 w-full cursor-pointer rounded border border-border bg-transparent" />
            </div>
            <div>
              <Label className="mb-1 block text-xs">Border / shadow color</Label>
              <input type="color" value={border} onChange={(e) => setBorder(e.target.value)} aria-label="Border color" className="h-9 w-full cursor-pointer rounded border border-border bg-transparent" />
            </div>
            {([{ label: "Border width", val: borderWidth, set: setBorderWidth, min: 0, max: 10, step: 1 },
               { label: "Shadow X", val: offX, set: setOffX, min: 0, max: 20, step: 1 },
               { label: "Shadow Y", val: offY, set: setOffY, min: 0, max: 20, step: 1 },
               { label: "Radius", val: radius, set: setRadius, min: 0, max: 30, step: 1 },
               { label: "Font weight", val: weight, set: setWeight, min: 400, max: 900, step: 100 }] as const).map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">{c.label}</Label>
                  <span className="font-mono text-xs text-muted-foreground">{c.val}</span>
                </div>
                <Slider value={[c.val]} min={c.min} max={c.max} step={c.step} onValueChange={(v) => c.set(v[0] ?? 0)} aria-label={c.label} />
              </div>
            ))}
          </div>
        </div>
        <StickyCode code={css} bootstrap={bootstrap} />
      </div>
    </div>
  );
}