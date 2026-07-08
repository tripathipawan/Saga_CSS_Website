import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb, rgbToHex } from "@/lib/color";

export const Route = createFileRoute("/tools/contrast")({
  head: () => ({
    meta: [
      { title: "WCAG Contrast Checker — Accessibility Ratio | SagaCSS" },
      {
        name: "description",
        content:
          "Check text and background color contrast against WCAG 2.1 AA and AAA thresholds for normal and large text, with live suggestion to fix failing combinations.",
      },
      { property: "og:title", content: "Contrast Checker — SagaCSS" },
      {
        property: "og:description",
        content: "WCAG AA/AAA contrast checker with automatic fix suggestions.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/contrast" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/contrast" }],
  }),
  component: ContrastPage,
});

function lum(hex: string) {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const c = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(fg: string, bg: string) {
  const l1 = lum(fg),
    l2 = lum(bg);
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}
function adjustToPass(fg: string, bg: string, target: number) {
  // Nudge FG lightness up or down until ratio ≥ target (or ~50 iterations).
  const rgb = hexToRgb(fg) ?? { r: 0, g: 0, b: 0 };
  const bgLum = lum(bg);
  const darker = bgLum > 0.5; // background is light → darken fg
  let { r, g, b } = rgb;
  for (let i = 0; i < 60; i++) {
    const cur = ratio(rgbToHex(r, g, b), bg);
    if (cur >= target) return rgbToHex(r, g, b);
    const step = darker ? -6 : 6;
    r = Math.max(0, Math.min(255, r + step));
    g = Math.max(0, Math.min(255, g + step));
    b = Math.max(0, Math.min(255, b + step));
  }
  return rgbToHex(r, g, b);
}

function Badge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-3 ${pass ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-destructive/40 bg-destructive/10 text-destructive"}`}
    >
      {pass ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
      <div>
        <div className="text-xs uppercase tracking-wide">{label}</div>
        <div className="text-sm font-semibold">{pass ? "Pass" : "Fail"}</div>
      </div>
    </div>
  );
}

function ContrastPage() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#8b5cf6");
  const [sample, setSample] = useState("The quick brown fox jumps over the lazy dog.");

  const r = useMemo(() => ratio(fg, bg), [fg, bg]);
  const rounded = Math.round(r * 100) / 100;

  const passes = { aaNormal: r >= 4.5, aaLarge: r >= 3, aaaNormal: r >= 7, aaaLarge: r >= 4.5 };
  const suggested = r < 4.5 ? adjustToPass(fg, bg, 4.5) : null;

  const css = `color: ${fg};\nbackground: ${bg};\n/* contrast ratio: ${rounded}:1 */`;
  const tailwind = `<div class="text-[${fg}] bg-[${bg}]">…</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: p-3, rounded -->\n<div class="craft-contrast p-3 rounded">…</div>\n\n<!-- Bootstrap has no utility for: arbitrary custom hex text/background colors outside the theme palette. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-contrast { color: ${fg}; background-color: ${bg}; }`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Contrast Checker"
        description="Verify text and background pairings against WCAG 2.1 AA and AAA thresholds — with an automatic fix suggestion when a combination fails."
      />

      <div className="rounded-2xl border border-border p-6" style={{ background: bg }}>
        <p className="text-2xl font-normal" style={{ color: fg }}>
          {sample}
        </p>
        <p className="mt-2 text-4xl font-bold" style={{ color: fg }}>
          {sample}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Label className="w-28 text-sm">Foreground</Label>
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
              aria-label="Foreground color"
            />
            <Input
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="font-mono"
              aria-label="Foreground hex"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-28 text-sm">Background</Label>
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
              aria-label="Background color"
            />
            <Input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="font-mono"
              aria-label="Background hex"
            />
          </div>
          <div>
            <Label className="mb-1 block text-sm">Sample text</Label>
            <Input
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              aria-label="Sample text"
            />
          </div>

          <div className="mt-2 flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Contrast ratio
              </div>
              <div className="text-3xl font-bold">{rounded}:1</div>
            </div>
            {suggested && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Suggested {r < 4.5 ? "AA-pass" : ""} FG
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFg(suggested)}
                  className="mt-1 gap-2 font-mono"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-border"
                    style={{ background: suggested }}
                  />
                  {suggested}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Badge label="AA Normal (4.5:1)" pass={passes.aaNormal} />
            <Badge label="AA Large (3:1)" pass={passes.aaLarge} />
            <Badge label="AAA Normal (7:1)" pass={passes.aaaNormal} />
            <Badge label="AAA Large (4.5:1)" pass={passes.aaaLarge} />
          </div>
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
