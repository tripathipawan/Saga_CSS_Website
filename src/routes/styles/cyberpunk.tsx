import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/styles/cyberpunk")({
  head: () => ({
    meta: [
      { title: "Cyberpunk / Neon UI Generator — SagaCSS" },
      { name: "description", content: "Design neon-glow cards, buttons and scanline backgrounds with the SagaCSS cyberpunk UI generator." },
      { property: "og:title", content: "Cyberpunk Neon UI — SagaCSS" },
      { property: "og:description", content: "Layered neon glow shadows, scanlines and grid textures with live preview." },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/cyberpunk" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/cyberpunk" }],
  }),
  component: CyberpunkPage,
});

function CyberpunkPage() {
  const [bg, setBg] = useState("#0b0221");
  const [neon, setNeon] = useState("#ff2bd6");
  const [glow, setGlow] = useState(30);
  const [radius, setRadius] = useState(12);
  const [scanlines, setScanlines] = useState(true);
  const [grid, setGrid] = useState(false);
  const [text, setText] = useState("ACCESS GRANTED");

  const presets = [
    { name: "Hot Pink", bg: "#0b0221", neon: "#ff2bd6", glow: 30, scanlines: true, grid: false },
    { name: "Cyan Terminal", bg: "#000814", neon: "#22d3ee", glow: 40, scanlines: true, grid: true },
    { name: "Toxic Green", bg: "#000000", neon: "#22c55e", glow: 25, scanlines: false, grid: true },
    { name: "Blood Orange", bg: "#0a0a0a", neon: "#f97316", glow: 50, scanlines: true, grid: false },
    { name: "Ultraviolet", bg: "#1a0033", neon: "#a855f7", glow: 45, scanlines: false, grid: true },
  ];
  const apply = (p: typeof presets[number]) => {
    setBg(p.bg); setNeon(p.neon); setGlow(p.glow); setScanlines(p.scanlines); setGrid(p.grid);
  };

  const shadow = useMemo(
    () => `0 0 ${glow / 4}px ${neon}, 0 0 ${glow / 2}px ${neon}, 0 0 ${glow}px ${neon}, inset 0 0 ${glow / 2}px ${neon}66`,
    [glow, neon],
  );
  const textShadow = `0 0 ${glow / 6}px ${neon}, 0 0 ${glow / 3}px ${neon}, 0 0 ${glow}px ${neon}`;

  const bgLayers: string[] = [];
  if (scanlines) bgLayers.push("repeating-linear-gradient(to bottom, rgba(255,255,255,.03) 0 2px, transparent 2px 4px)");
  if (grid) bgLayers.push("linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)");
  bgLayers.push(bg);
  const bgSize = grid ? "auto, 32px 32px, 32px 32px, auto" : undefined;

  const css = `background: ${bgLayers.join(", ")};
${grid ? `background-size: ${bgSize};\n` : ""}color: ${neon};
border: 1px solid ${neon};
border-radius: ${radius}px;
padding: 1.5rem 2rem;
box-shadow: ${shadow};
text-shadow: ${textShadow};
font-family: "JetBrains Mono", ui-monospace, monospace;
letter-spacing: .08em;`;

  const tailwind = `<div class="p-6 [border-radius:${radius}px] [border:1px_solid_${neon}] [color:${neon}] [box-shadow:${shadow.replace(/\s+/g, "_")}]">${text}</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: p-4, fw-bold, border -->\n<div class="craft-cyber border p-4 fw-bold">${text}</div>\n\n<!-- Bootstrap has no utility for: custom dark background, neon color/border color, arbitrary radius, neon glow box-shadow. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-cyber {\n  background: ${bg};\n  color: ${neon};\n  border-color: ${neon};\n  border-radius: ${radius}px;\n  box-shadow: ${shadow};\n}`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader title="Cyberpunk / Neon UI" description="Layered neon glow, scanlines and cyber-grid textures for dark UI vibes." />

      <div className="flex min-h-[18rem] items-center justify-center rounded-2xl border border-border p-8" style={{ background: bg }}>
        <div
          style={{
            background: bgLayers.join(", "),
            backgroundSize: bgSize,
            color: neon,
            border: `1px solid ${neon}`,
            borderRadius: radius,
            padding: "1.5rem 2rem",
            boxShadow: shadow,
            textShadow,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            letterSpacing: ".08em",
            fontWeight: 700,
            fontSize: "1.5rem",
          }}
          aria-label="Cyberpunk preview"
        >
          {text || "\u00a0"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div>
            <Label className="mb-1 block text-xs">Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button key={p.name} type="button" onClick={() => apply(p)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">{p.name}</button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="cp-text" className="text-xs">Text</Label>
            <Input id="cp-text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Background</Label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background" className="mt-1 h-8 w-full rounded border border-input" />
            </div>
            <div>
              <Label className="text-xs">Neon color</Label>
              <input type="color" value={neon} onChange={(e) => setNeon(e.target.value)} aria-label="Neon color" className="mt-1 h-8 w-full rounded border border-input" />
            </div>
          </div>
          <SR label="Glow intensity" value={glow} setValue={setGlow} min={5} max={80} unit="" />
          <SR label="Border radius" value={radius} setValue={setRadius} min={0} max={40} unit="px" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="scan" checked={scanlines} onCheckedChange={setScanlines} aria-label="Scanlines" />
              <Label htmlFor="scan" className="text-sm">Scanlines</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="grid" checked={grid} onCheckedChange={setGrid} aria-label="Cyber grid" />
              <Label htmlFor="grid" className="text-sm">Cyber grid</Label>
            </div>
          </div>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
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