import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/scrollbar")({
  head: () => ({
    meta: [
      { title: "Scrollbar Styler — SagaCSS" },
      {
        name: "description",
        content:
          "Design custom browser scrollbars visually. Tune width, thumb, track, radius and hover — copy WebKit and Firefox CSS.",
      },
      { property: "og:title", content: "Scrollbar Styler — SagaCSS" },
      {
        property: "og:description",
        content: "Live custom scrollbar preview with copy-ready WebKit + Firefox CSS.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/scrollbar" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/scrollbar" }],
  }),
  component: ScrollbarPage,
});

type Cfg = {
  width: number;
  track: string;
  thumb: string;
  thumbHover: string;
  thumbRadius: number;
  trackRadius: number;
  border: boolean;
  borderColor: string;
  hidden: boolean;
};

const PRESETS: { name: string; cfg: Cfg }[] = [
  {
    name: "Minimal Thin",
    cfg: {
      width: 6,
      track: "#00000000",
      thumb: "#9ca3af",
      thumbHover: "#6b7280",
      thumbRadius: 8,
      trackRadius: 0,
      border: false,
      borderColor: "#ffffff",
      hidden: false,
    },
  },
  {
    name: "Rounded Pill",
    cfg: {
      width: 12,
      track: "#f1f5f9",
      thumb: "#8b5cf6",
      thumbHover: "#7c3aed",
      thumbRadius: 999,
      trackRadius: 999,
      border: true,
      borderColor: "#f1f5f9",
      hidden: false,
    },
  },
  {
    name: "Bold Colorful",
    cfg: {
      width: 16,
      track: "#fde68a",
      thumb: "#ef4444",
      thumbHover: "#b91c1c",
      thumbRadius: 4,
      trackRadius: 4,
      border: false,
      borderColor: "#ffffff",
      hidden: false,
    },
  },
  {
    name: "Dark Mode Subtle",
    cfg: {
      width: 10,
      track: "#1f2937",
      thumb: "#374151",
      thumbHover: "#4b5563",
      thumbRadius: 6,
      trackRadius: 6,
      border: false,
      borderColor: "#111827",
      hidden: false,
    },
  },
  {
    name: "Invisible / Hidden",
    cfg: {
      width: 0,
      track: "#00000000",
      thumb: "#00000000",
      thumbHover: "#00000000",
      thumbRadius: 0,
      trackRadius: 0,
      border: false,
      borderColor: "#ffffff",
      hidden: true,
    },
  },
];

function ScrollbarPage() {
  const [cfg, setCfg] = useState<Cfg>(PRESETS[1].cfg);
  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const scopeClass = "craft-scrollbar";

  // Preview CSS: WebKit-only. Chromium IGNORES ::-webkit-scrollbar-* rules
  // when scrollbar-color/scrollbar-width are set on the same element, so we
  // omit the standard properties from the preview to guarantee the custom
  // scrollbar is actually rendered. The exported CSS still ships both.
  const previewCss = useMemo(() => buildCss(cfg, `.${scopeClass}`, { webkitOnly: true }), [cfg]);
  const outputCss = useMemo(() => buildCss(cfg, ".your-scroll-container"), [cfg]);

  const tailwind = useMemo(
    () =>
      `<!-- Tailwind has no built-in scrollbar utilities.\n     Option A: install the tailwind-scrollbar plugin, then use the utilities below.\n     Option B: paste the CSS from the CSS tab into a global stylesheet. -->\n\n<div class="overflow-y-auto\n            scrollbar-thin\n            scrollbar-thumb-[${cfg.thumb}]\n            scrollbar-track-[${cfg.track === "#00000000" ? "transparent" : cfg.track}]\n            [&::-webkit-scrollbar]:w-[${cfg.width}px]\n            [&::-webkit-scrollbar-thumb]:rounded-[${cfg.thumbRadius}px]\n            [&::-webkit-scrollbar-track]:rounded-[${cfg.trackRadius}px]">\n  …\n</div>\n\n/* Requires: bun add -D tailwind-scrollbar  (optional — the arbitrary\n   [&::-webkit-scrollbar]:*] variants work without the plugin). */`,
    [cfg],
  );

  const bootstrap = useMemo(
    () =>
      `<!-- Bootstrap 5 has NO scrollbar utilities. Use plain CSS: -->\n<style>\n${outputCss}\n</style>\n<div class="your-scroll-container overflow-auto" style="max-height: 240px;">\n  …\n</div>`,
    [outputCss],
  );

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Scrollbar Styler"
        description="Design a custom scrollbar with live WebKit + Firefox output."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 text-sm font-semibold">Live preview</div>
            <style dangerouslySetInnerHTML={{ __html: previewCss }} />
            <div
              className={`${scopeClass} rounded-md border border-border bg-background p-3`}
              style={{ height: 240, overflowY: "scroll" }}
              tabIndex={0}
              aria-label="Scrollbar preview area"
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <p key={i} className="text-sm">
                  Line {i + 1} — scroll to see the custom scrollbar in action.
                </p>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Preview uses WebKit rules only (Chromium ignores <code>::-webkit-scrollbar</code> when
              standard
              <code> scrollbar-color</code> is set on the same element). The exported CSS ships both
              for full Firefox + WebKit coverage.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <Button
                  key={p.name}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setCfg(p.cfg)}
                  aria-label={`Apply ${p.name} preset`}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberControl
                label="Width (px)"
                value={cfg.width}
                min={0}
                max={24}
                onChange={(v) => set("width", v)}
              />
              <NumberControl
                label="Thumb radius (px)"
                value={cfg.thumbRadius}
                min={0}
                max={999}
                onChange={(v) => set("thumbRadius", v)}
              />
              <NumberControl
                label="Track radius (px)"
                value={cfg.trackRadius}
                min={0}
                max={999}
                onChange={(v) => set("trackRadius", v)}
              />
              <ColorControl
                label="Track color"
                value={cfg.track}
                onChange={(v) => set("track", v)}
              />
              <ColorControl
                label="Thumb color"
                value={cfg.thumb}
                onChange={(v) => set("thumb", v)}
              />
              <ColorControl
                label="Thumb hover"
                value={cfg.thumbHover}
                onChange={(v) => set("thumbHover", v)}
              />
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="sb-border"
                  checked={cfg.border}
                  onCheckedChange={(v) => set("border", Boolean(v))}
                  aria-label="Thumb border"
                />
                <Label htmlFor="sb-border" className="cursor-pointer text-xs">
                  Thumb border
                </Label>
              </div>
              {cfg.border && (
                <ColorControl
                  label="Border color"
                  value={cfg.borderColor}
                  onChange={(v) => set("borderColor", v)}
                />
              )}
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="sb-hidden"
                  checked={cfg.hidden}
                  onCheckedChange={(v) => set("hidden", Boolean(v))}
                  aria-label="Hide scrollbar entirely"
                />
                <Label htmlFor="sb-hidden" className="cursor-pointer text-xs">
                  Hide scrollbar entirely
                </Label>
              </div>
            </div>
          </div>
        </div>

        <StickyCode
          code={outputCss}
          tailwind={tailwind}
          bootstrap={bootstrap}
          label="Scrollbar CSS"
        />
      </div>
    </div>
  );
}

function NumberControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
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
        step={1}
        onValueChange={(v) => onChange(v[0] ?? 0)}
        aria-label={label}
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isTransparent = value === "#00000000" || value === "transparent";
  const colorValue = isTransparent ? "#ffffff" : value.length === 9 ? value.slice(0, 7) : value;
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={colorValue}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-8 w-10 shrink-0 cursor-pointer rounded border border-border bg-background"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 font-mono text-xs"
          aria-label={`${label} value`}
        />
      </div>
    </div>
  );
}

function buildCss(cfg: Cfg, selector: string, opts: { webkitOnly?: boolean } = {}): string {
  if (cfg.hidden) {
    return `/* Hide scrollbar (Firefox + WebKit). Content still scrolls. */\n${selector} {\n  scrollbar-width: none;          /* Firefox */\n  -ms-overflow-style: none;       /* IE 10+ */\n}\n${selector}::-webkit-scrollbar {\n  display: none;                  /* Chrome, Safari, Edge */\n}`;
  }
  const border = cfg.border
    ? `\n  border: 2px solid ${cfg.borderColor};\n  background-clip: padding-box;`
    : "";
  const track = cfg.track === "#00000000" ? "transparent" : cfg.track;
  const webkit = `${selector}::-webkit-scrollbar {\n  width: ${cfg.width}px;\n  height: ${cfg.width}px;\n}\n${selector}::-webkit-scrollbar-track {\n  background: ${track};\n  border-radius: ${cfg.trackRadius}px;\n}\n${selector}::-webkit-scrollbar-thumb {\n  background: ${cfg.thumb};\n  border-radius: ${cfg.thumbRadius}px;${border}\n}\n${selector}::-webkit-scrollbar-thumb:hover {\n  background: ${cfg.thumbHover};\n}`;
  if (opts.webkitOnly) {
    return `/* Chrome / Edge / Safari (WebKit) */\n${webkit}`;
  }
  return `/* Firefox (standard) */\n${selector} {\n  scrollbar-width: ${cfg.width <= 8 ? "thin" : "auto"};\n  scrollbar-color: ${cfg.thumb} ${track};\n}\n\n/* Chrome / Edge / Safari (WebKit) */\n${webkit}`;
}
