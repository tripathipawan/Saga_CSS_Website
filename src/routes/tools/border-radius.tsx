import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/border-radius")({
  head: () => ({
    meta: [
      { title: "Border Radius Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design smooth CSS border-radius corners and organic blob shapes with independent per-corner control and copy-ready code.",
      },
      { property: "og:title", content: "Border Radius Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Per-corner radius + organic blob mode with live preview and copy-ready CSS.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/border-radius" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/border-radius" }],
  }),
  component: BorderRadiusPage,
});

type Corners = { tl: number; tr: number; br: number; bl: number };
type Organic = { tlh: number; trh: number; brh: number; blh: number; tlv: number; trv: number; brv: number; blv: number };

const DEFAULT_CORNERS: Corners = { tl: 30, tr: 30, br: 30, bl: 30 };
const DEFAULT_ORGANIC: Organic = {
  tlh: 30, trh: 70, brh: 70, blh: 30,
  tlv: 30, trv: 30, brv: 70, blv: 70,
};

const PRESETS = {
  Circle: { organic: false, corners: { tl: 50, tr: 50, br: 50, bl: 50 } as Corners },
  Squircle: { organic: false, corners: { tl: 24, tr: 24, br: 24, bl: 24 } as Corners },
  Leaf: { organic: false, corners: { tl: 50, tr: 0, br: 50, bl: 0 } as Corners },
  Teardrop: { organic: false, corners: { tl: 50, tr: 50, br: 50, bl: 0 } as Corners },
  Blob: {
    organic: true,
    organicVals: { tlh: 63, trh: 37, brh: 45, blh: 55, tlv: 30, trv: 30, brv: 70, blv: 70 } as Organic,
  },
  "Soft Blob": {
    organic: true,
    organicVals: { tlh: 40, trh: 60, brh: 50, blh: 50, tlv: 50, trv: 30, brv: 70, blv: 50 } as Organic,
  },
} as const;

function BorderRadiusPage() {
  const [organic, setOrganic] = useState(false);
  const [corners, setCorners] = useState<Corners>(DEFAULT_CORNERS);
  const [organicVals, setOrganicVals] = useState<Organic>(DEFAULT_ORGANIC);
  const [unit, setUnit] = useState<"px" | "%">("%");

  const radius = useMemo(() => {
    if (organic) {
      const { tlh, trh, brh, blh, tlv, trv, brv, blv } = organicVals;
      return `${tlh}% ${trh}% ${brh}% ${blh}% / ${tlv}% ${trv}% ${brv}% ${blv}%`;
    }
    const u = unit;
    return `${corners.tl}${u} ${corners.tr}${u} ${corners.br}${u} ${corners.bl}${u}`;
  }, [organic, corners, organicVals, unit]);

  const css = `border-radius: ${radius};`;

  const tailwind = useMemo(() => {
    if (organic) {
      const esc = radius.replace(/\s+/g, "_");
      return `<div class="w-48 h-48 bg-gradient-to-br from-violet-500 to-cyan-400 [border-radius:${esc}]">…</div>`;
    }
    const u = unit;
    const { tl, tr, br, bl } = corners;
    // Try uniform first
    if (tl === tr && tr === br && br === bl) {
      return `<div class="w-48 h-48 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-[${tl}${u}]">…</div>`;
    }
    return `<div class="w-48 h-48 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-tl-[${tl}${u}] rounded-tr-[${tr}${u}] rounded-br-[${br}${u}] rounded-bl-[${bl}${u}]">…</div>`;
  }, [organic, radius, corners, unit]);

  const bootstrap = useMemo(() => {
    // Map any px/% value to the closest Bootstrap 5 rounded-{0..5|circle|pill} step.
    const toStep = (v: number, u: "px" | "%"): string => {
      if (u === "%") {
        if (v >= 50) return "rounded-circle";
        if (v >= 30) return "rounded-5";
        if (v >= 20) return "rounded-4";
        if (v >= 12) return "rounded-3";
        if (v >= 6) return "rounded-2";
        if (v >= 2) return "rounded-1";
        return "rounded-0";
      }
      if (v === 0) return "rounded-0";
      if (v <= 4) return "rounded-1";
      if (v <= 8) return "rounded-2";
      if (v <= 12) return "rounded-3";
      if (v <= 20) return "rounded-4";
      if (v <= 40) return "rounded-5";
      return "rounded-pill";
    };
    if (organic) {
      // Organic blobs have no direct Bootstrap utility — rounded-5 is the closest fit.
      return `<div class="rounded-5 bg-primary p-5 d-inline-block">&nbsp;</div>`;
    }
    const { tl, tr, br, bl } = corners;
    if (tl === tr && tr === br && br === bl) {
      return `<div class="${toStep(tl, unit)} bg-primary p-5 d-inline-block">&nbsp;</div>`;
    }
    // Per-side classes are the closest Bootstrap gets to per-corner control.
    const top = toStep(Math.max(tl, tr), unit).replace("rounded-", "rounded-top-");
    const end = toStep(Math.max(tr, br), unit).replace("rounded-", "rounded-end-");
    const bottom = toStep(Math.max(br, bl), unit).replace("rounded-", "rounded-bottom-");
    const start = toStep(Math.max(bl, tl), unit).replace("rounded-", "rounded-start-");
    return `<div class="${top} ${end} ${bottom} ${start} bg-primary p-5 d-inline-block">&nbsp;</div>`;
  }, [organic, corners, unit, radius]);

  const randomize = () => {
    if (organic) {
      const rnd = () => Math.floor(20 + Math.random() * 60);
      setOrganicVals({
        tlh: rnd(), trh: rnd(), brh: rnd(), blh: rnd(),
        tlv: rnd(), trv: rnd(), brv: rnd(), blv: rnd(),
      });
    } else {
      const rnd = () => Math.floor(Math.random() * 60);
      setCorners({ tl: rnd(), tr: rnd(), br: rnd(), bl: rnd() });
    }
  };

  const setAll = (v: number) => setCorners({ tl: v, tr: v, br: v, bl: v });

  const cornerLabels: { key: keyof Corners; label: string }[] = [
    { key: "tl", label: "Top-left" },
    { key: "tr", label: "Top-right" },
    { key: "br", label: "Bottom-right" },
    { key: "bl", label: "Bottom-left" },
  ];

  const organicPairs: { hKey: keyof Organic; vKey: keyof Organic; label: string }[] = [
    { hKey: "tlh", vKey: "tlv", label: "Top-left" },
    { hKey: "trh", vKey: "trv", label: "Top-right" },
    { hKey: "brh", vKey: "brv", label: "Bottom-right" },
    { hKey: "blh", vKey: "blv", label: "Bottom-left" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Border Radius Generator"
        description="Fine-tune each corner or switch to organic blob mode for wavy, hand-drawn shapes."
      />

      <div className="flex min-h-[18rem] items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6 md:min-h-[16rem] max-h-[18rem]">
        <div
          className="h-48 w-48 bg-gradient-to-br from-primary to-accent shadow-lg transition-[border-radius] duration-150 md:h-64 md:w-64"
          style={{ borderRadius: radius }}
          aria-label="Border radius preview"
          role="img"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="organic"
                checked={organic}
                onCheckedChange={setOrganic}
                aria-label="Toggle organic blob mode"
              />
              <Label htmlFor="organic" className="text-sm">
                Organic blob mode
              </Label>
            </div>
            <div className="flex items-center gap-2">
              {!organic && (
                <div className="flex gap-1 rounded-md border border-border p-1">
                  {(["%", "px"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      aria-pressed={unit === u}
                      className={`rounded px-2 py-1 text-xs ${
                        unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={randomize} className="gap-1.5">
                <Shuffle className="h-4 w-4" /> Random
              </Button>
            </div>
          </div>

          {!organic ? (
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm">Uniform</Label>
                  <span className="text-xs text-muted-foreground">Applies to all corners</span>
                </div>
                <Slider
                  value={[corners.tl]}
                  min={0}
                  max={unit === "%" ? 50 : 200}
                  step={1}
                  onValueChange={(v) => setAll(v[0] ?? 0)}
                  aria-label="Uniform border radius"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {cornerLabels.map(({ key, label }) => (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between">
                      <Label className="text-xs">{label}</Label>
                      <span className="font-mono text-xs text-muted-foreground">
                        {corners[key]}
                        {unit}
                      </span>
                    </div>
                    <Slider
                      value={[corners[key]]}
                      min={0}
                      max={unit === "%" ? 50 : 200}
                      step={1}
                      onValueChange={(v) => setCorners((c) => ({ ...c, [key]: v[0] ?? 0 }))}
                      aria-label={`${label} radius`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {organicPairs.map(({ hKey, vKey, label }) => (
                <div key={label} className="rounded-md border border-border p-3">
                  <div className="mb-2 text-xs font-medium">{label}</div>
                  <div className="mb-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Horizontal</span>
                      <span className="font-mono">{organicVals[hKey]}%</span>
                    </div>
                    <Slider
                      value={[organicVals[hKey]]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(v) => setOrganicVals((o) => ({ ...o, [hKey]: v[0] ?? 0 }))}
                      aria-label={`${label} horizontal radius`}
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Vertical</span>
                      <span className="font-mono">{organicVals[vKey]}%</span>
                    </div>
                    <Slider
                      value={[organicVals[vKey]]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(v) => setOrganicVals((o) => ({ ...o, [vKey]: v[0] ?? 0 }))}
                      aria-label={`${label} vertical radius`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
              {Object.entries(PRESETS).map(([name, p]) => {
                const previewRadius = p.organic
                  ? `${p.organicVals!.tlh}% ${p.organicVals!.trh}% ${p.organicVals!.brh}% ${p.organicVals!.blh}% / ${p.organicVals!.tlv}% ${p.organicVals!.trv}% ${p.organicVals!.brv}% ${p.organicVals!.blv}%`
                  : `${p.corners!.tl}% ${p.corners!.tr}% ${p.corners!.br}% ${p.corners!.bl}%`;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      if (p.organic) {
                        setOrganic(true);
                        setOrganicVals(p.organicVals!);
                      } else {
                        setOrganic(false);
                        setUnit("%");
                        setCorners(p.corners!);
                      }
                    }}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Load ${name} preset`}
                  >
                    <div
                      className="h-12 w-12 bg-gradient-to-br from-primary to-accent"
                      style={{ borderRadius: previewRadius }}
                    />
                    <span className="text-xs font-medium">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
        </div>
      </div>
    </div>
  );
}