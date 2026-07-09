import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/reset")({
  head: () => ({
    meta: [
      { title: "CSS Reset / Normalize Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Build a custom CSS reset. Toggle box-sizing, margin, list, link, form and media resets and copy a tailored global stylesheet.",
      },
      { property: "og:title", content: "CSS Reset / Normalize Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Pick exactly what to reset and copy a tailored CSS reset stylesheet.",
      },
      { property: "og:url", content: "/tools/reset" },
    ],
    links: [{ rel: "canonical", href: "/tools/reset" }],
  }),
  component: ResetPage,
});

type Key =
  | "boxSizing"
  | "marginPadding"
  | "lists"
  | "links"
  | "formControls"
  | "fontSmoothing"
  | "typography"
  | "headings"
  | "media"
  | "tables"
  | "formInherit";

const OPTIONS: { key: Key; label: string; desc: string; css: string }[] = [
  {
    key: "boxSizing",
    label: "Box-sizing reset",
    desc: "Border-box on every element and pseudo.",
    css: `*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}`,
  },
  {
    key: "marginPadding",
    label: "Zero margins & padding",
    desc: "Strip default margin/padding from all elements.",
    css: `* {\n  margin: 0;\n  padding: 0;\n}`,
  },
  {
    key: "headings",
    label: "Remove heading margins",
    desc: "Consistent baseline for h1–h6.",
    css: `h1, h2, h3, h4, h5, h6 {\n  margin: 0;\n  font-size: inherit;\n  font-weight: inherit;\n}`,
  },
  {
    key: "lists",
    label: "Remove list styles",
    desc: "ul/ol have no bullets or indent.",
    css: `ul,\nol {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}`,
  },
  {
    key: "links",
    label: "Reset link styles",
    desc: "Inherit color, drop underline.",
    css: `a {\n  color: inherit;\n  text-decoration: none;\n}`,
  },
  {
    key: "formControls",
    label: "Reset button & input appearance",
    desc: "Neutral buttons/inputs, no native chrome.",
    css: `button,\ninput,\nselect,\ntextarea {\n  appearance: none;\n  -webkit-appearance: none;\n  background: none;\n  border: none;\n  padding: 0;\n  color: inherit;\n  font: inherit;\n}\nbutton {\n  cursor: pointer;\n}`,
  },
  {
    key: "formInherit",
    label: "Form element font inheritance",
    desc: "Form controls inherit typography.",
    css: `input,\nbutton,\ntextarea,\nselect {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}`,
  },
  {
    key: "fontSmoothing",
    label: "Font smoothing",
    desc: "Crisper text on macOS/WebKit.",
    css: `html {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}`,
  },
  {
    key: "typography",
    label: "Base line-height & font inheritance",
    desc: "Sensible line-height and inherited fonts.",
    css: `html {\n  line-height: 1.5;\n  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;\n}\nbody {\n  min-height: 100vh;\n  line-height: inherit;\n  font-family: inherit;\n}`,
  },
  {
    key: "media",
    label: "Responsive media",
    desc: "img/video/svg block-level and fluid.",
    css: `img,\nvideo,\nsvg,\npicture,\ncanvas {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}`,
  },
  {
    key: "tables",
    label: "Consistent tables",
    desc: "Collapse borders, no cell spacing.",
    css: `table {\n  border-collapse: collapse;\n  border-spacing: 0;\n}`,
  },
];

const POPULAR: Record<Key, boolean> = {
  boxSizing: true,
  marginPadding: true,
  headings: true,
  lists: true,
  links: true,
  formControls: false,
  formInherit: true,
  fontSmoothing: true,
  typography: true,
  media: true,
  tables: false,
};

function ResetPage() {
  const [enabled, setEnabled] = useState<Record<Key, boolean>>(POPULAR);
  const [showBefore, setShowBefore] = useState(false);

  const css = useMemo(() => {
    const parts = OPTIONS.filter((o) => enabled[o.key]).map((o) => `/* ${o.label} */\n${o.css}`);
    return parts.length ? parts.join("\n\n") : "/* No resets selected. */";
  }, [enabled]);

  const activeCss = showBefore ? "" : css;

  const toggle = (k: Key) => setEnabled((s) => ({ ...s, [k]: !s[k] }));
  const setAll = (v: boolean) => {
    const next = {} as Record<Key, boolean>;
    OPTIONS.forEach((o) => (next[o.key] = v));
    setEnabled(next);
  };

  const nonComponentNote = `/* A CSS reset is a global base layer, not a set of component utility classes.\n   Drop the CSS into your project's root stylesheet (e.g. src/styles.css) so it\n   applies globally. */\n\n${css}`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="CSS Reset / Normalize Generator"
        description="Toggle the resets you want and copy a tailored global stylesheet."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAll(true)}
                aria-label="Select all resets"
              >
                Select all
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAll(false)}
                aria-label="Clear all resets"
              >
                Select none
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEnabled(POPULAR)}
                aria-label="Load popular preset"
              >
                Popular preset
              </Button>
            </div>
            <ul className="flex flex-col gap-2.5">
              {OPTIONS.map((o) => (
                <li
                  key={o.key}
                  className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3"
                >
                  <Checkbox
                    id={`opt-${o.key}`}
                    checked={enabled[o.key]}
                    onCheckedChange={() => toggle(o.key)}
                    aria-label={o.label}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <Label htmlFor={`opt-${o.key}`} className="cursor-pointer text-sm font-medium">
                      {o.label}
                    </Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold">Live preview</div>
              <div className="flex gap-1 rounded-md border border-border p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setShowBefore(false)}
                  aria-pressed={!showBefore}
                  className={`rounded px-2 py-1 ${!showBefore ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  After (reset applied)
                </button>
                <button
                  type="button"
                  onClick={() => setShowBefore(true)}
                  aria-pressed={showBefore}
                  className={`rounded px-2 py-1 ${showBefore ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Before (defaults)
                </button>
              </div>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <style
                dangerouslySetInnerHTML={{
                  __html: `
/* Sandbox: strip all inherited/framework styles so browser defaults show. */
.reset-preview-scope, .reset-preview-scope * { all: revert; }
.reset-preview-scope { color: hsl(var(--foreground)); font-family: ui-sans-serif, system-ui, sans-serif; }
/* Apply user-selected resets, scoped via CSS nesting. */
.reset-preview-scope { ${activeCss} }
                  `,
                }}
              />
              <div className="reset-preview-scope">
                <h1>Sample H1 heading</h1>
                <h3>Sample H3 heading</h3>
                <p>
                  Paragraph with a <a href="#preview">sample link</a> and a{" "}
                  <strong>bold word</strong>.
                </p>
                <ul>
                  <li>Unordered list item one</li>
                  <li>Unordered list item two</li>
                </ul>
                <ol>
                  <li>Ordered item</li>
                </ol>
                <button type="button">Native Button</button>{" "}
                <input type="text" placeholder="Native input" />
                <table>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid" }}>A</td>
                      <td style={{ border: "1px solid" }}>B</td>
                    </tr>
                  </tbody>
                </table>
                <img
                  alt="placeholder"
                  width={200}
                  height={80}
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='160'><rect width='100%25' height='100%25' fill='%238b5cf6'/><text x='50%25' y='55%25' fill='white' font-family='sans-serif' font-size='28' text-anchor='middle'>image</text></svg>"
                />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Sandboxed with <code>all: revert</code> so it approximates browser defaults, then your
              selected resets are layered on top. Toggle checkboxes to see the difference between
              "Before" and "After".
            </p>
          </div>
        </div>

        <StickyCode
          code={css}
          tailwind={`/* A CSS reset is a global base layer, not a set of component utility classes.\n   Paste this into your Tailwind entry file (e.g. src/index.css) — Tailwind's own\n   Preflight already covers most of these; use custom picks to extend it. */\n\n${css}`}
          bootstrap={nonComponentNote}
          label="CSS Reset"
        />
      </div>
    </div>
  );
}
