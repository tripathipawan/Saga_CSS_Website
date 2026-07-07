import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/styles/y2k")({
  head: () => ({
    meta: [
      { title: "Y2K / Retro Style Generator — SagaCSS" },
      { name: "description", content: "Design chrome text, bubble buttons and glossy gradients with the SagaCSS Y2K retro style generator." },
      { property: "og:title", content: "Y2K Retro Style — SagaCSS" },
      { property: "og:description", content: "Chrome text, bubble cards and glossy Y2K gradients with live preview." },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/y2k" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/y2k" }],
  }),
  component: Y2KPage,
});

function Y2KPage() {
  const [c1, setC1] = useState("#ff6ec7");
  const [c2, setC2] = useState("#7ee8fa");
  const [chrome1, setChrome1] = useState("#ffffff");
  const [chrome2, setChrome2] = useState("#c0d6ea");
  const [radius, setRadius] = useState(999);
  const [text, setText] = useState("Cyber Chic");
  const [glow, setGlow] = useState(20);

  const presets = [
    { name: "Bubblegum", c1: "#ff6ec7", c2: "#7ee8fa", chrome1: "#ffffff", chrome2: "#c0d6ea", radius: 999, glow: 20 },
    { name: "Chrome Silver", c1: "#94a3b8", c2: "#e2e8f0", chrome1: "#f8fafc", chrome2: "#64748b", radius: 24, glow: 30 },
    { name: "Vaporwave", c1: "#a855f7", c2: "#22d3ee", chrome1: "#fde68a", chrome2: "#ec4899", radius: 32, glow: 40 },
    { name: "Lime Fizz", c1: "#84cc16", c2: "#fde047", chrome1: "#ffffff", chrome2: "#a3e635", radius: 999, glow: 25 },
    { name: "Sunset Chrome", c1: "#f97316", c2: "#f43f5e", chrome1: "#fef3c7", chrome2: "#c2410c", radius: 40, glow: 35 },
  ];
  const applyPreset = (p: typeof presets[number]) => {
    setC1(p.c1); setC2(p.c2); setChrome1(p.chrome1); setChrome2(p.chrome2); setRadius(p.radius); setGlow(p.glow);
  };

  const css = useMemo(
    () => `background: linear-gradient(135deg, ${c1}, ${c2});
border-radius: ${radius}px;
padding: 2rem 2.5rem;
box-shadow: 0 8px 32px rgba(0,0,0,.15), inset 0 2px 0 rgba(255,255,255,.6), inset 0 -8px 24px rgba(0,0,0,.15);

.y2k-text {
  font-weight: 900;
  font-size: 3rem;
  background: linear-gradient(180deg, ${chrome1} 0%, ${chrome2} 50%, ${chrome1} 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px ${glow / 4}px rgba(255,255,255,.7), 0 -1px 0 rgba(0,0,0,.3);
}`,
    [c1, c2, chrome1, chrome2, radius, glow],
  );

  const tailwind = `<div class="[background:linear-gradient(135deg,${c1},${c2})] [border-radius:${radius}px] p-10 [box-shadow:0_8px_32px_rgba(0,0,0,.15),inset_0_2px_0_rgba(255,255,255,.6)]">
  <span class="[background:linear-gradient(180deg,${chrome1},${chrome2},${chrome1})] bg-clip-text text-transparent font-black text-5xl">${text}</span>
</div>`;

  const bootstrap = `<!-- markup — uses real Bootstrap utilities: p-5, text-center, fw-bolder, display-4 -->\n<div class="craft-y2k p-5 text-center shadow-lg rounded-4">\n  <span class="craft-y2k-chrome fw-bolder display-4">${text}</span>\n</div>\n\n<!-- Bootstrap has no utility for: custom gradient background, chrome text (background-clip: text). -->\n<!-- Extend via _custom.scss: -->\n@use "bootstrap/scss/utilities" as *;\n.craft-y2k {\n  background: linear-gradient(135deg, ${c1}, ${c2});\n}\n.craft-y2k-chrome {\n  background: linear-gradient(180deg, ${chrome1}, ${chrome2}, ${chrome1});\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n}`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Y2K / Retro Style" description="Chrome text, bubble borders and glossy gradients — instant early-2000s energy." />

      <div className="flex min-h-[18rem] items-center justify-center rounded-2xl border border-border bg-slate-100 p-8" style={{ background: "repeating-linear-gradient(45deg, #f8fafc, #f8fafc 8px, #eef2ff 8px, #eef2ff 16px)" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            borderRadius: radius,
            padding: "2rem 2.5rem",
            boxShadow:
              "0 8px 32px rgba(0,0,0,.15), inset 0 2px 0 rgba(255,255,255,.6), inset 0 -8px 24px rgba(0,0,0,.15)",
          }}
          aria-label="Y2K preview"
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: "3rem",
              backgroundImage: `linear-gradient(180deg, ${chrome1} 0%, ${chrome2} 50%, ${chrome1} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: `0 2px ${glow / 4}px rgba(255,255,255,.7)`,
            }}
          >
            {text || "\u00a0"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div>
            <Label className="mb-1 block text-xs">Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button key={p.name} type="button" onClick={() => applyPreset(p)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="y2k-text" className="text-xs">Text</Label>
            <Input id="y2k-text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ColorRow label="Gradient A" value={c1} onChange={setC1} />
            <ColorRow label="Gradient B" value={c2} onChange={setC2} />
            <ColorRow label="Chrome highlight" value={chrome1} onChange={setChrome1} />
            <ColorRow label="Chrome shadow" value={chrome2} onChange={setChrome2} />
          </div>
          <SR label="Border radius" value={radius} setValue={setRadius} min={0} max={999} unit="px" />
          <SR label="Chrome glow" value={glow} setValue={setGlow} min={0} max={80} unit="" />
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="mt-1 h-8 w-full rounded border border-input" />
    </div>
  );
}

function SR({ label, value, setValue, min, max, unit }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number; unit: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">{value}{unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={1} onValueChange={(v) => setValue(v[0] ?? 0)} aria-label={label} />
    </div>
  );
}