import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";
import { hexToRgb } from "@/lib/color";

export const Route = createFileRoute("/tools/theme-variables")({
  head: () => ({
    meta: [
      { title: "Dark Mode CSS Variables Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Generate matching light and dark CSS custom properties from a base palette, plus a Tailwind config snippet.",
      },
      { property: "og:title", content: "Dark Mode CSS Variables — SagaCSS" },
      {
        property: "og:description",
        content: "Auto-derive dark mode variables from your palette with a live UI preview.",
      },
      { property: "og:url", content: "/tools/theme-variables" },
    ],
    links: [{ rel: "canonical", href: "/tools/theme-variables" }],
  }),
  component: ThemeVarsPage,
});

type Palette = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
};

const DEFAULT_LIGHT: Palette = {
  primary: "#6366f1",
  secondary: "#0ea5e9",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  border: "#e2e8f0",
};

function hexToHsl(hex: string) {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function autoDark(p: Palette): Palette {
  const flip = (hex: string) => {
    const { h, s, l } = hexToHsl(hex);
    return hslToHex(h, s, 100 - l);
  };
  const shift = (hex: string, target: number) => {
    const { h, s } = hexToHsl(hex);
    return hslToHex(h, s, target);
  };
  return {
    primary: shift(p.primary, Math.min(70, hexToHsl(p.primary).l + 10)),
    secondary: shift(p.secondary, Math.min(70, hexToHsl(p.secondary).l + 10)),
    background: flip(p.background),
    surface: flip(p.surface),
    text: flip(p.text),
    border: flip(p.border),
  };
}

const LABELS: Record<keyof Palette, string> = {
  primary: "Primary",
  secondary: "Secondary",
  background: "Background",
  surface: "Surface",
  text: "Text",
  border: "Border",
};

function ThemeVarsPage() {
  const [light, setLight] = useState<Palette>(DEFAULT_LIGHT);
  const [dark, setDark] = useState<Palette>(() => autoDark(DEFAULT_LIGHT));
  const [darkPreview, setDarkPreview] = useState(false);

  const regenDark = (next: Palette) => setDark(autoDark(next));

  const setLightVal = (k: keyof Palette, v: string) => {
    const next = { ...light, [k]: v };
    setLight(next);
    regenDark(next);
  };

  const active = darkPreview ? dark : light;

  const css = useMemo(
    () => `:root {
  --primary: ${light.primary};
  --secondary: ${light.secondary};
  --background: ${light.background};
  --surface: ${light.surface};
  --text: ${light.text};
  --border: ${light.border};
}

[data-theme="dark"], .dark {
  --primary: ${dark.primary};
  --secondary: ${dark.secondary};
  --background: ${dark.background};
  --surface: ${dark.surface};
  --text: ${dark.text};
  --border: ${dark.border};
}`,
    [light, dark],
  );

  const tailwind = `// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--text)",
        border: "var(--border)",
      },
    },
  },
};`;

  const bootstrap = `/* Bootstrap 5.3 supports [data-bs-theme]. Reuse the same variable names: */
[data-bs-theme="light"] { --bs-primary: ${light.primary}; --bs-body-bg: ${light.background}; --bs-body-color: ${light.text}; }
[data-bs-theme="dark"] { --bs-primary: ${dark.primary}; --bs-body-bg: ${dark.background}; --bs-body-color: ${dark.text}; }`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Dark Mode CSS Variables"
        description="Pick a base palette; get matching light and dark CSS custom properties with a live UI preview."
      />

      <div
        className="rounded-2xl border border-border p-6"
        style={{ background: active.background, color: active.text, borderColor: active.border }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide opacity-70">Preview</div>
          <div className="flex items-center gap-2">
            <Label htmlFor="dark-preview" className="text-xs" style={{ color: active.text }}>
              Dark preview
            </Label>
            <Switch
              id="dark-preview"
              checked={darkPreview}
              onCheckedChange={setDarkPreview}
              aria-label="Toggle dark preview"
            />
          </div>
        </div>
        <div
          className="rounded-xl p-5"
          style={{ background: active.surface, border: `1px solid ${active.border}` }}
        >
          <h3 className="mb-1 text-xl font-semibold">Themed card</h3>
          <p className="mb-4 text-sm opacity-80">
            This card renders using only your generated CSS variables.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={{ background: active.primary, color: active.background }}
            >
              Primary action
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={{ background: active.secondary, color: active.background }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div>
            <h2 className="mb-3 text-sm font-semibold">Light palette (base)</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(light) as (keyof Palette)[]).map((k) => (
                <div key={k}>
                  <Label className="text-xs">{LABELS[k]}</Label>
                  <input
                    type="color"
                    value={light[k]}
                    onChange={(e) => setLightVal(k, e.target.value)}
                    aria-label={`Light ${LABELS[k]}`}
                    className="mt-1 h-8 w-full rounded border border-input"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Dark palette (auto — fine-tune)</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(dark) as (keyof Palette)[]).map((k) => (
                <div key={k}>
                  <Label className="text-xs">{LABELS[k]}</Label>
                  <input
                    type="color"
                    value={dark[k]}
                    onChange={(e) => setDark({ ...dark, [k]: e.target.value })}
                    aria-label={`Dark ${LABELS[k]}`}
                    className="mt-1 h-8 w-full rounded border border-input"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDark(autoDark(light))}
              className="mt-3 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent"
            >
              Re-auto from light
            </button>
          </div>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
