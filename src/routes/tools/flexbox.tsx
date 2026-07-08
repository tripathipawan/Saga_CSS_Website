import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/flexbox")({
  head: () => ({
    meta: [
      { title: "Flexbox Playground — SagaCSS" },
      {
        name: "description",
        content:
          "Interactive Flexbox playground: visualize justify-content, align-items, flex-direction, wrap and gap with live preview and copy-ready CSS.",
      },
      { property: "og:title", content: "Flexbox Playground — SagaCSS" },
      { property: "og:description", content: "Design flex layouts visually." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/flexbox" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/flexbox" }],
  }),
  component: FlexPage,
});

const DIRECTIONS = ["row", "row-reverse", "column", "column-reverse"] as const;
const JUSTIFY = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
] as const;
const ALIGN = ["stretch", "flex-start", "center", "flex-end", "baseline"] as const;
const WRAP = ["nowrap", "wrap", "wrap-reverse"] as const;

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FlexPage() {
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>("row");
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>("flex-start");
  const [align, setAlign] = useState<(typeof ALIGN)[number]>("stretch");
  const [wrap, setWrap] = useState<(typeof WRAP)[number]>("nowrap");
  const [gap, setGap] = useState(12);
  const [count, setCount] = useState(5);

  const presets = [
    {
      name: "Navbar",
      direction: "row" as const,
      justify: "space-between" as const,
      align: "center" as const,
      wrap: "nowrap" as const,
      gap: 16,
      count: 3,
    },
    {
      name: "Card Row",
      direction: "row" as const,
      justify: "flex-start" as const,
      align: "stretch" as const,
      wrap: "wrap" as const,
      gap: 16,
      count: 4,
    },
    {
      name: "Centered",
      direction: "row" as const,
      justify: "center" as const,
      align: "center" as const,
      wrap: "nowrap" as const,
      gap: 12,
      count: 1,
    },
    {
      name: "Space Between",
      direction: "row" as const,
      justify: "space-between" as const,
      align: "center" as const,
      wrap: "nowrap" as const,
      gap: 8,
      count: 3,
    },
    {
      name: "Sidebar + Main",
      direction: "row" as const,
      justify: "flex-start" as const,
      align: "stretch" as const,
      wrap: "nowrap" as const,
      gap: 24,
      count: 2,
    },
    {
      name: "Stacked Column",
      direction: "column" as const,
      justify: "flex-start" as const,
      align: "stretch" as const,
      wrap: "nowrap" as const,
      gap: 12,
      count: 4,
    },
  ];
  const apply = (p: (typeof presets)[number]) => {
    setDirection(p.direction);
    setJustify(p.justify);
    setAlign(p.align);
    setWrap(p.wrap);
    setGap(p.gap);
    setCount(p.count);
  };

  const css = `display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
flex-wrap: ${wrap};
gap: ${gap}px;`;

  const dirCls =
    direction === "row"
      ? ""
      : direction === "row-reverse"
        ? "flex-row-reverse"
        : direction === "column"
          ? "flex-column"
          : "flex-column-reverse";
  const justifyCls = `justify-content-${justify === "flex-start" ? "start" : justify === "flex-end" ? "end" : justify.replace("space-", "")}`;
  const alignCls = `align-items-${align === "flex-start" ? "start" : align === "flex-end" ? "end" : align}`;
  const wrapCls =
    wrap === "nowrap" ? "flex-nowrap" : wrap === "wrap" ? "flex-wrap" : "flex-wrap-reverse";
  const gapCls =
    gap === 0
      ? "gap-0"
      : gap <= 4
        ? "gap-1"
        : gap <= 8
          ? "gap-2"
          : gap <= 16
            ? "gap-3"
            : gap <= 24
              ? "gap-4"
              : "gap-5";
  const flexClasses = ["d-flex", dirCls, justifyCls, alignCls, wrapCls, gapCls]
    .filter(Boolean)
    .join(" ");
  const bootstrap = `<div class="${flexClasses}">\n${Array.from({ length: count }, (_, i) => `  <div class="p-3 bg-primary text-white rounded">${i + 1}</div>`).join("\n")}\n</div>`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Flexbox Playground"
        description="Toggle Flexbox properties and see the layout update live. Copy the CSS for any configuration."
      />

      <div className="min-h-[16rem] max-h-[18rem] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div
          className="h-full w-full rounded-lg border border-dashed border-border p-2"
          style={{
            display: "flex",
            flexDirection: direction,
            justifyContent: justify,
            alignItems: align,
            flexWrap: wrap,
            gap,
          }}
        >
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="grid h-14 min-w-[3.5rem] place-items-center rounded-md bg-primary/80 px-3 text-sm font-semibold text-primary-foreground"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
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
            <Select
              label="flex-direction"
              value={direction}
              options={DIRECTIONS}
              onChange={setDirection}
            />
            <Select
              label="justify-content"
              value={justify}
              options={JUSTIFY}
              onChange={setJustify}
            />
            <Select label="align-items" value={align} options={ALIGN} onChange={setAlign} />
            <Select label="flex-wrap" value={wrap} options={WRAP} onChange={setWrap} />
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">gap</Label>
                <span className="font-mono text-xs text-muted-foreground">{gap}px</span>
              </div>
              <Slider
                value={[gap]}
                min={0}
                max={64}
                step={1}
                onValueChange={(v) => setGap(v[0] ?? 0)}
                aria-label="Gap"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Sample items</Label>
                <span className="font-mono text-xs text-muted-foreground">{count}</span>
              </div>
              <Slider
                value={[count]}
                min={1}
                max={12}
                step={1}
                onValueChange={(v) => setCount(v[0] ?? 1)}
                aria-label="Sample items"
              />
            </div>
          </div>
        </div>
        <StickyCode code={css} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
