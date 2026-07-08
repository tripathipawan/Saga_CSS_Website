import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/styles/art-deco")({
  head: () => ({
    meta: [
      { title: "Art Deco Style Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design elegant Art Deco cards with gold-on-black palettes, geometric corner accents and serif typography.",
      },
      { property: "og:title", content: "Art Deco — SagaCSS" },
      {
        property: "og:description",
        content: "Elegant Art Deco card generator with symmetrical corner accents.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/styles/art-deco" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/styles/art-deco" }],
  }),
  component: ArtDecoPage,
});

function ArtDecoPage() {
  const [bg, setBg] = useState("#0f0d0a");
  const [gold, setGold] = useState("#d4af37");
  const [thickness, setThickness] = useState(2);
  const [corner, setCorner] = useState(24);
  const [serif, setSerif] = useState(true);
  const [title, setTitle] = useState("The Gilded Age");
  const [subtitle, setSubtitle] = useState("EST · MMXXV");

  const presets = [
    { name: "Classic Gold", bg: "#0f0d0a", gold: "#d4af37", thickness: 2, corner: 24 },
    { name: "Rose Gold", bg: "#1a0d10", gold: "#f4a2a2", thickness: 3, corner: 32 },
    { name: "Emerald", bg: "#052e2b", gold: "#c8ad7f", thickness: 2, corner: 28 },
    { name: "Cream & Ink", bg: "#f5f1e8", gold: "#0f0d0a", thickness: 3, corner: 30 },
    { name: "Sapphire", bg: "#0a1a3a", gold: "#e0c674", thickness: 2, corner: 24 },
  ];
  const apply = (p: (typeof presets)[number]) => {
    setBg(p.bg);
    setGold(p.gold);
    setThickness(p.thickness);
    setCorner(p.corner);
  };

  const css = useMemo(
    () => `background: ${bg};
color: ${gold};
padding: 3rem 2.5rem;
border: ${thickness}px solid ${gold};
outline: ${thickness}px solid ${gold};
outline-offset: ${thickness * 3}px;
font-family: ${serif ? '"Playfair Display", Georgia, serif' : "system-ui, sans-serif"};
text-align: center;
position: relative;

/* Symmetrical corner accents */
&::before, &::after {
  content: "";
  position: absolute;
  width: ${corner}px;
  height: ${corner}px;
  border: ${thickness}px solid ${gold};
}
&::before { top: ${corner / 3}px; left: ${corner / 3}px; border-right: 0; border-bottom: 0; }
&::after { bottom: ${corner / 3}px; right: ${corner / 3}px; border-left: 0; border-top: 0; }`,
    [bg, gold, thickness, corner, serif],
  );

  const tailwind = `<div class="text-center p-12 [background:${bg}] [color:${gold}] [border:${thickness}px_solid_${gold}] [outline:${thickness}px_solid_${gold}] [outline-offset:${thickness * 3}px] ${serif ? "font-serif" : ""}">
  <h3 class="text-3xl">${title}</h3>
  <p class="mt-2 tracking-[.4em] text-sm">${subtitle}</p>
</div>`;

  const bootstrap = `<!-- markup — uses real Bootstrap utilities: text-center, p-5, fs-2, mt-2 -->\n<div class="craft-deco text-center p-5">\n  <h3 class="fs-2">${title}</h3>\n  <p class="craft-deco-sub mt-2">${subtitle}</p>\n</div>\n\n<!-- Bootstrap has no utility for: custom border color/width, outline + outline-offset, custom font-family, letter-spacing. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-deco {\n  background: ${bg};\n  color: ${gold};\n  border: ${thickness}px solid ${gold};\n  outline: ${thickness}px solid ${gold};\n  outline-offset: ${thickness * 3}px;\n  font-family: ${serif ? "'Playfair Display', Georgia, serif" : "system-ui"};\n}\n.craft-deco-sub {\n  letter-spacing: .4em;\n  font-size: .85rem;\n}`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Art Deco Style"
        description="Symmetrical corner accents, gold-on-black palettes and elegant serif typography."
      />

      <div
        className="flex min-h-[20rem] items-center justify-center rounded-2xl border border-border p-10"
        style={{ background: "#1a1712" }}
      >
        <div
          className="relative"
          style={{
            background: bg,
            color: gold,
            padding: "3rem 2.5rem",
            border: `${thickness}px solid ${gold}`,
            outline: `${thickness}px solid ${gold}`,
            outlineOffset: thickness * 3,
            fontFamily: serif ? '"Playfair Display", Georgia, serif' : "system-ui, sans-serif",
            textAlign: "center",
            minWidth: 260,
          }}
          aria-label="Art Deco preview"
        >
          <span
            style={{
              position: "absolute",
              top: corner / 3,
              left: corner / 3,
              width: corner,
              height: corner,
              borderTop: `${thickness}px solid ${gold}`,
              borderLeft: `${thickness}px solid ${gold}`,
            }}
          />
          <span
            style={{
              position: "absolute",
              top: corner / 3,
              right: corner / 3,
              width: corner,
              height: corner,
              borderTop: `${thickness}px solid ${gold}`,
              borderRight: `${thickness}px solid ${gold}`,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: corner / 3,
              left: corner / 3,
              width: corner,
              height: corner,
              borderBottom: `${thickness}px solid ${gold}`,
              borderLeft: `${thickness}px solid ${gold}`,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: corner / 3,
              right: corner / 3,
              width: corner,
              height: corner,
              borderBottom: `${thickness}px solid ${gold}`,
              borderRight: `${thickness}px solid ${gold}`,
            }}
          />
          <h3 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>{title || "\u00a0"}</h3>
          <p
            style={{
              marginTop: "0.75rem",
              letterSpacing: ".4em",
              fontSize: ".8rem",
              opacity: 0.85,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div>
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ad-title" className="text-xs">
                Title
              </Label>
              <Input
                id="ad-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ad-sub" className="text-xs">
                Subtitle
              </Label>
              <Input
                id="ad-sub"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Background</Label>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                aria-label="Background"
                className="mt-1 h-8 w-full rounded border border-input"
              />
            </div>
            <div>
              <Label className="text-xs">Gold accent</Label>
              <input
                type="color"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                aria-label="Gold"
                className="mt-1 h-8 w-full rounded border border-input"
              />
            </div>
          </div>
          <SR
            label="Border thickness"
            value={thickness}
            setValue={setThickness}
            min={1}
            max={6}
            unit="px"
          />
          <SR
            label="Corner accent size"
            value={corner}
            setValue={setCorner}
            min={12}
            max={60}
            unit="px"
          />
          <div className="flex items-center gap-2">
            <Switch id="serif" checked={serif} onCheckedChange={setSerif} aria-label="Serif font" />
            <Label htmlFor="serif" className="text-sm">
              Serif font
            </Label>
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
  unit,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(v) => setValue(v[0] ?? 0)}
        aria-label={label}
      />
    </div>
  );
}
