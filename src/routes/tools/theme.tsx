import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/theme")({
  head: () => ({
    meta: [
      { title: "CSS Variables Theme Builder — SagaCSS" },
      {
        name: "description",
        content:
          "Design a full design-token system — colors, spacing, typography and radius — and export CSS custom properties, Tailwind config or Bootstrap Sass overrides.",
      },
      { property: "og:title", content: "CSS Variables Theme Builder — SagaCSS" },
      {
        property: "og:description",
        content:
          "Design tokens for colors, spacing, typography and radius with copy-ready CSS, Tailwind and Bootstrap output.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/theme" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/theme" }],
  }),
  component: ThemePage,
});

type ColorKey =
  | "primary"
  | "secondary"
  | "accent"
  | "background"
  | "surface"
  | "text"
  | "border"
  | "success"
  | "warning"
  | "error";
type ColorSet = Record<ColorKey, string>;
type Spacing = { xs: string; sm: string; md: string; lg: string; xl: string; "2xl": string };
type FontSizes = {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
};
type Radius = { sm: string; md: string; lg: string; full: string };

const LIGHT: ColorSet = {
  primary: "#8b5cf6",
  secondary: "#0ea5e9",
  accent: "#f59e0b",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};
const DARK: ColorSet = {
  primary: "#a78bfa",
  secondary: "#38bdf8",
  accent: "#fbbf24",
  background: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  border: "#334155",
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
};

const DEFAULT_SPACING: Spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
};
const DEFAULT_FONTS: FontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
};
const DEFAULT_RADIUS: Radius = { sm: "4px", md: "8px", lg: "16px", full: "9999px" };

function ThemePage() {
  const [light, setLight] = useState<ColorSet>(LIGHT);
  const [dark, setDark] = useState<ColorSet>(DARK);
  const [spacing, setSpacing] = useState<Spacing>(DEFAULT_SPACING);
  const [fonts, setFonts] = useState<FontSizes>(DEFAULT_FONTS);
  const [radius, setRadius] = useState<Radius>(DEFAULT_RADIUS);
  const [mode, setMode] = useState<"light" | "dark">("light");

  const active = mode === "light" ? light : dark;
  const setActive = (patch: Partial<ColorSet>) => {
    if (mode === "light") setLight({ ...light, ...patch });
    else setDark({ ...dark, ...patch });
  };

  const css = useMemo(
    () => buildCss({ light, dark, spacing, fonts, radius }),
    [light, dark, spacing, fonts, radius],
  );
  const tailwind = useMemo(
    () => buildTailwind({ light, dark, spacing, fonts, radius }),
    [light, dark, spacing, fonts, radius],
  );
  const bootstrap = useMemo(
    () => buildBootstrap({ light, dark, spacing, fonts, radius }),
    [light, dark, spacing, fonts, radius],
  );
  const json = useMemo(
    () =>
      JSON.stringify(
        { colors: { light, dark }, spacing, fontSize: fonts, borderRadius: radius },
        null,
        2,
      ),
    [light, dark, spacing, fonts, radius],
  );

  const downloadJson = () => {
    if (typeof window === "undefined") return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-tokens.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="CSS Variables Theme Builder"
        description="Define your full design-token system — colors, spacing, typography, radius — and export CSS, Tailwind or Bootstrap Sass."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {/* Preview card */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Live preview</div>
              <div className="flex gap-1 rounded-md border border-border p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("light")}
                  aria-pressed={mode === "light"}
                  className={`rounded px-2 py-1 ${mode === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setMode("dark")}
                  aria-pressed={mode === "dark"}
                  className={`rounded px-2 py-1 ${mode === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Dark
                </button>
              </div>
            </div>
            <div
              className="rounded-lg p-6"
              style={{
                background: active.background,
                color: active.text,
                border: `1px solid ${active.border}`,
                fontSize: fonts.base,
              }}
            >
              <div
                style={{
                  background: active.surface,
                  border: `1px solid ${active.border}`,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                }}
              >
                <div style={{ fontSize: fonts["2xl"], fontWeight: 700, marginBottom: spacing.xs }}>
                  Heading example
                </div>
                <div style={{ fontSize: fonts.sm, opacity: 0.8, marginBottom: spacing.md }}>
                  Body text uses the base font size and text color token.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: spacing.sm,
                    flexWrap: "wrap",
                    marginBottom: spacing.md,
                  }}
                >
                  <span
                    style={{
                      background: active.primary,
                      color: "#fff",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: radius.sm,
                      fontSize: fonts.xs,
                    }}
                  >
                    Primary
                  </span>
                  <span
                    style={{
                      background: active.secondary,
                      color: "#fff",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: radius.sm,
                      fontSize: fonts.xs,
                    }}
                  >
                    Secondary
                  </span>
                  <span
                    style={{
                      background: active.accent,
                      color: "#fff",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: radius.sm,
                      fontSize: fonts.xs,
                    }}
                  >
                    Accent
                  </span>
                  <span
                    style={{
                      background: active.success,
                      color: "#fff",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: radius.sm,
                      fontSize: fonts.xs,
                    }}
                  >
                    Success
                  </span>
                  <span
                    style={{
                      background: active.warning,
                      color: "#fff",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: radius.sm,
                      fontSize: fonts.xs,
                    }}
                  >
                    Warning
                  </span>
                  <span
                    style={{
                      background: active.error,
                      color: "#fff",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: radius.sm,
                      fontSize: fonts.xs,
                    }}
                  >
                    Error
                  </span>
                </div>
                <button
                  type="button"
                  style={{
                    background: active.primary,
                    color: "#fff",
                    padding: `${spacing.sm} ${spacing.lg}`,
                    borderRadius: radius.md,
                    border: "none",
                    fontSize: fonts.sm,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Button
                </button>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Colors ({mode})</div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => (mode === "light" ? setLight(LIGHT) : setDark(DARK))}
              >
                Reset
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(active) as ColorKey[]).map((k) => (
                <ColorField
                  key={k}
                  label={k}
                  value={active[k]}
                  onChange={(v) => setActive({ [k]: v } as Partial<ColorSet>)}
                />
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 text-sm font-semibold">Spacing scale</div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(spacing) as (keyof Spacing)[]).map((k) => (
                <TextField
                  key={k}
                  label={k}
                  value={spacing[k]}
                  onChange={(v) => setSpacing({ ...spacing, [k]: v })}
                />
              ))}
            </div>
          </div>

          {/* Font sizes */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 text-sm font-semibold">Font-size scale</div>
            <div className="grid gap-3 sm:grid-cols-4">
              {(Object.keys(fonts) as (keyof FontSizes)[]).map((k) => (
                <TextField
                  key={k}
                  label={k}
                  value={fonts[k]}
                  onChange={(v) => setFonts({ ...fonts, [k]: v })}
                />
              ))}
            </div>
          </div>

          {/* Radius */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Border radius scale</div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={downloadJson}
                aria-label="Export tokens as JSON"
              >
                Export JSON
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {(Object.keys(radius) as (keyof Radius)[]).map((k) => (
                <TextField
                  key={k}
                  label={k}
                  value={radius[k]}
                  onChange={(v) => setRadius({ ...radius, [k]: v })}
                />
              ))}
            </div>
          </div>
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} label="Theme tokens" />
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs capitalize">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
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

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 font-mono text-xs"
        aria-label={label}
      />
    </div>
  );
}

type Tokens = {
  light: ColorSet;
  dark: ColorSet;
  spacing: Spacing;
  fonts: FontSizes;
  radius: Radius;
};

function colorVars(prefix: string, c: ColorSet): string {
  return (Object.keys(c) as ColorKey[]).map((k) => `  --${prefix}${k}: ${c[k]};`).join("\n");
}

function buildCss({ light, dark, spacing, fonts, radius }: Tokens): string {
  const spacingLines = (Object.keys(spacing) as (keyof Spacing)[])
    .map((k) => `  --space-${k}: ${spacing[k]};`)
    .join("\n");
  const fontLines = (Object.keys(fonts) as (keyof FontSizes)[])
    .map((k) => `  --text-${k}: ${fonts[k]};`)
    .join("\n");
  const radiusLines = (Object.keys(radius) as (keyof Radius)[])
    .map((k) => `  --radius-${k}: ${radius[k]};`)
    .join("\n");
  return `:root {
${colorVars("color-", light)}
${spacingLines}
${fontLines}
${radiusLines}
}

/* Dark mode: toggled via [data-theme="dark"] or prefers-color-scheme. */
[data-theme="dark"] {
${colorVars("color-", dark)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${colorVars("color-", dark).replace(/^/gm, "  ")}
  }
}`;
}

function buildTailwind({ light, spacing, fonts, radius }: Tokens): string {
  const colorEntries = (Object.keys(light) as ColorKey[])
    .map((k) => `        ${k}: "var(--color-${k})"`)
    .join(",\n");
  const spacingEntries = (Object.keys(spacing) as (keyof Spacing)[])
    .map((k) => `        "${k}": "var(--space-${k})"`)
    .join(",\n");
  const fontEntries = (Object.keys(fonts) as (keyof FontSizes)[])
    .map((k) => `        "${k}": "var(--text-${k})"`)
    .join(",\n");
  const radiusEntries = (Object.keys(radius) as (keyof Radius)[])
    .map((k) => `        "${k}": "var(--radius-${k})"`)
    .join(",\n");
  return `// tailwind.config.js — theme.extend snippet.
// First paste the :root { ... } block from the CSS tab into your global stylesheet
// so these CSS variables actually exist, then reference them from Tailwind:
module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
      spacing: {
${spacingEntries}
      },
      fontSize: {
${fontEntries}
      },
      borderRadius: {
${radiusEntries}
      },
    },
  },
};`;
}

function buildBootstrap({ light, spacing, radius }: Tokens): string {
  return `// Bootstrap 5 Sass overrides — place BEFORE @import "bootstrap/scss/bootstrap".
// Bootstrap maps these to its own theme colors, spacer scale and radius tokens.
$primary:   ${light.primary};
$secondary: ${light.secondary};
$success:   ${light.success};
$warning:   ${light.warning};
$danger:    ${light.error};
$body-bg:   ${light.background};
$body-color: ${light.text};
$border-color: ${light.border};

// Spacer scale (Bootstrap's $spacers map).
$spacer: ${spacing.md};
$spacers: (
  0: 0,
  1: ${spacing.xs},
  2: ${spacing.sm},
  3: ${spacing.md},
  4: ${spacing.lg},
  5: ${spacing.xl},
  6: ${spacing["2xl"]},
);

// Radius tokens.
$border-radius-sm: ${radius.sm};
$border-radius:    ${radius.md};
$border-radius-lg: ${radius.lg};
$border-radius-pill: ${radius.full};

/* For tokens without a Bootstrap Sass equivalent (accent color, custom fonts, etc.),
   use the :root { --var } CSS from the CSS tab as a supplement. */`;
}
