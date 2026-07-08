import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/grid")({
  head: () => ({
    meta: [
      { title: "CSS Grid Layout Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design uniform CSS Grid layouts or asymmetric bento-box grids visually with a live preview and copy-ready code.",
      },
      { property: "og:title", content: "Grid Layout Generator — SagaCSS" },
      { property: "og:description", content: "Simple and bento CSS grid layouts in one tool." },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/grid" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/grid" }],
  }),
  component: GridPage,
});

const JUSTIFY_ITEMS = ["stretch", "start", "center", "end"] as const;
const ALIGN_ITEMS = ["stretch", "start", "center", "end"] as const;

function GridPage() {
  const [mode, setMode] = useState<"simple" | "bento">("simple");
  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Grid Layout Generator"
        description="Uniform CSS Grid or asymmetric bento boxes — two modes, one preview, one code panel."
      />
      <div className="flex gap-1 self-start rounded-md border border-border p-1">
        {(["simple", "bento"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded px-3 py-1.5 text-sm capitalize transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
          >
            {m === "simple" ? "Simple Grid" : "Bento / Asymmetric"}
          </button>
        ))}
      </div>
      {mode === "simple" ? <SimpleGrid /> : <BentoGrid />}
    </div>
  );
}

function SimpleGrid() {
  const [cols, setCols] = useState("repeat(3, 1fr)");
  const [rows, setRows] = useState("repeat(2, 1fr)");
  const [gap, setGap] = useState(12);
  const [justify, setJustify] = useState<(typeof JUSTIFY_ITEMS)[number]>("stretch");
  const [align, setAlign] = useState<(typeof ALIGN_ITEMS)[number]>("stretch");
  const [count, setCount] = useState(6);

  const css = `display: grid;
grid-template-columns: ${cols};
grid-template-rows: ${rows};
gap: ${gap}px;
justify-items: ${justify};
align-items: ${align};`;

  const colsEsc = cols.replace(/\s+/g, "_");
  const rowsEsc = rows.replace(/\s+/g, "_");
  const tailwind = `<div class="grid gap-[${gap}px] justify-items-${justify} items-${align} [grid-template-columns:${colsEsc}] [grid-template-rows:${rowsEsc}]">…</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: d-grid -->\n<div class="d-grid craft-grid">…</div>\n\n<!-- Bootstrap has no utility for: arbitrary grid-template-columns/rows, custom gap size, justify-items, align-items (grid). -->\n@use "bootstrap/scss/utilities" as *;\n.craft-grid {\n  grid-template-columns: ${cols};\n  grid-template-rows: ${rows};\n  gap: ${gap}px;\n  justify-items: ${justify};\n  align-items: ${align};\n}`;

  return (
    <>
      <div className="min-h-[16rem] max-h-[18rem] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div
          className="h-full w-full rounded-lg border border-dashed border-border p-2"
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gridTemplateRows: rows,
            gap,
            justifyItems: justify,
            alignItems: align,
          }}
        >
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="grid h-full min-h-[2.5rem] place-items-center rounded-md bg-primary/80 px-3 text-sm font-semibold text-primary-foreground"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs">grid-template-columns</Label>
              <Input
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                className="h-9 font-mono text-sm"
                aria-label="Grid template columns"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs">grid-template-rows</Label>
              <Input
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="h-9 font-mono text-sm"
                aria-label="Grid template rows"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs">justify-items</Label>
              <select
                value={justify}
                onChange={(e) => setJustify(e.target.value as (typeof JUSTIFY_ITEMS)[number])}
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                aria-label="Justify items"
              >
                {JUSTIFY_ITEMS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-1 block text-xs">align-items</Label>
              <select
                value={align}
                onChange={(e) => setAlign(e.target.value as (typeof ALIGN_ITEMS)[number])}
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                aria-label="Align items"
              >
                {ALIGN_ITEMS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">gap</Label>
                <span className="font-mono text-xs text-muted-foreground">{gap}px</span>
              </div>
              <Slider
                value={[gap]}
                min={0}
                max={48}
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
                max={16}
                step={1}
                onValueChange={(v) => setCount(v[0] ?? 1)}
                aria-label="Sample items"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {[
              "repeat(3, 1fr)",
              "repeat(auto-fit, minmax(80px, 1fr))",
              "1fr 2fr 1fr",
              "100px 1fr 100px",
            ].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCols(p)}
                className="rounded-md border border-border bg-background px-2 py-1 hover:bg-accent"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </>
  );
}

// ----- Bento mode -----
type Cell = { id: string; colStart: number; colSpan: number; rowStart: number; rowSpan: number };
const uid = () => Math.random().toString(36).slice(2, 9);
const BENTO_PRESETS: { name: string; cols: number; rows: number; cells: Omit<Cell, "id">[] }[] = [
  {
    name: "Classic 4x3",
    cols: 4,
    rows: 3,
    cells: [
      { colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 2 },
      { colStart: 3, colSpan: 2, rowStart: 1, rowSpan: 1 },
      { colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 2 },
      { colStart: 4, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { colStart: 1, colSpan: 1, rowStart: 3, rowSpan: 1 },
      { colStart: 2, colSpan: 1, rowStart: 3, rowSpan: 1 },
      { colStart: 4, colSpan: 1, rowStart: 3, rowSpan: 1 },
    ],
  },
  {
    name: "Hero + Grid",
    cols: 3,
    rows: 3,
    cells: [
      { colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 2 },
      { colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { colStart: 1, colSpan: 1, rowStart: 3, rowSpan: 1 },
      { colStart: 2, colSpan: 1, rowStart: 3, rowSpan: 1 },
      { colStart: 3, colSpan: 1, rowStart: 3, rowSpan: 1 },
    ],
  },
  {
    name: "Magazine",
    cols: 4,
    rows: 2,
    cells: [
      { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 1 },
      { colStart: 4, colSpan: 1, rowStart: 1, rowSpan: 2 },
      { colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { colStart: 2, colSpan: 2, rowStart: 2, rowSpan: 1 },
    ],
  },
];
const CELL_TONES = [
  "from-primary/70 to-primary/40",
  "from-accent/70 to-accent/40",
  "from-fuchsia-500/70 to-fuchsia-400/40",
  "from-amber-500/70 to-amber-400/40",
  "from-emerald-500/70 to-emerald-400/40",
  "from-sky-500/70 to-sky-400/40",
  "from-rose-500/70 to-rose-400/40",
];

function BentoGrid() {
  const [cols, setCols] = useState(4);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(12);
  const [radius, setRadius] = useState(16);
  const [cells, setCells] = useState<Cell[]>(
    BENTO_PRESETS[0].cells.map((c) => ({ ...c, id: uid() })),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const sel = cells.find((c) => c.id === selected);
  const update = (id: string, patch: Partial<Cell>) =>
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const remove = (id: string) => setCells((prev) => prev.filter((c) => c.id !== id));
  const addCell = () =>
    setCells((prev) => [...prev, { id: uid(), colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 }]);

  const css = useMemo(() => {
    const items = cells
      .map(
        (c, i) =>
          `.bento-item-${i + 1} {\n  grid-column: ${c.colStart} / span ${c.colSpan};\n  grid-row: ${c.rowStart} / span ${c.rowSpan};\n}`,
      )
      .join("\n\n");
    return `.bento {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, minmax(120px, 1fr));\n  gap: ${gap}px;\n}\n\n.bento > * { border-radius: ${radius}px; }\n\n${items}`;
  }, [cells, cols, rows, gap, radius]);

  const tailwind = useMemo(() => {
    const items = cells
      .map(
        (c, i) =>
          `  <div class="[grid-column:${c.colStart}_/_span_${c.colSpan}] [grid-row:${c.rowStart}_/_span_${c.rowSpan}] rounded-[${radius}px] bg-primary/70">${i + 1}</div>`,
      )
      .join("\n");
    return `<div class="grid grid-cols-${cols} gap-[${gap}px] [grid-template-rows:repeat(${rows},minmax(120px,1fr))]">\n${items}\n</div>`;
  }, [cells, cols, rows, gap, radius]);

  const bootstrap = (() => {
    const itemRules = cells
      .map(
        (c, i) =>
          `.bento-item-${i + 1} { grid-column: ${c.colStart} / span ${c.colSpan}; grid-row: ${c.rowStart} / span ${c.rowSpan}; }`,
      )
      .join("\n");
    const items = cells
      .map(
        (c, i) =>
          `  <div class="bento-item-${i + 1} bg-primary text-white rounded d-flex align-items-center justify-content-center">${i + 1}</div>`,
      )
      .join("\n");
    return `<!-- markup — uses real Bootstrap utilities: d-grid, bg-primary, text-white, rounded, d-flex, align-items-center, justify-content-center -->\n<div class="d-grid craft-bento">\n${items}\n</div>\n\n<!-- Bootstrap has no utility for: arbitrary grid-template-columns/rows, custom gap size, arbitrary border-radius, per-item grid-column/row spans. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-bento {\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, minmax(120px, 1fr));\n  gap: ${gap}px;\n}\n.craft-bento > * { border-radius: ${radius}px; }\n${itemRules}`;
  })();

  return (
    <>
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-3">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, minmax(60px, 1fr))`,
            gap,
          }}
        >
          {cells.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={`bg-gradient-to-br ${CELL_TONES[i % CELL_TONES.length]} text-primary-foreground text-sm font-medium flex items-center justify-center transition-all focus:outline-none ${selected === c.id ? "ring-2 ring-ring" : ""}`}
              style={{
                gridColumn: `${c.colStart} / span ${c.colSpan}`,
                gridRow: `${c.rowStart} / span ${c.rowSpan}`,
                borderRadius: radius,
              }}
              aria-label={`Cell ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { label: "Columns", val: cols, set: setCols, min: 1, max: 6 },
                  { label: "Rows", val: rows, set: setRows, min: 1, max: 6 },
                  { label: "Gap", val: gap, set: setGap, min: 0, max: 40 },
                  { label: "Radius", val: radius, set: setRadius, min: 0, max: 40 },
                ] as const
              ).map((c) => (
                <div key={c.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <Label className="text-xs">{c.label}</Label>
                    <span className="font-mono text-xs text-muted-foreground">{c.val}</span>
                  </div>
                  <Slider
                    value={[c.val]}
                    min={c.min}
                    max={c.max}
                    step={1}
                    onValueChange={(v) => c.set(v[0] ?? 0)}
                    aria-label={c.label}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={addCell}>
                Add cell
              </Button>
              {sel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    remove(sel.id);
                    setSelected(null);
                  }}
                >
                  Remove selected
                </Button>
              )}
            </div>
            {sel && (
              <div className="mt-4 rounded-md border border-border p-3">
                <div className="mb-2 text-xs font-semibold">Selected cell</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "colStart" as const, label: "Col start", max: cols },
                    { k: "colSpan" as const, label: "Col span", max: cols },
                    { k: "rowStart" as const, label: "Row start", max: rows },
                    { k: "rowSpan" as const, label: "Row span", max: rows },
                  ].map((f) => (
                    <div key={f.k}>
                      <div className="mb-1 flex items-center justify-between">
                        <Label className="text-xs">{f.label}</Label>
                        <span className="font-mono text-xs text-muted-foreground">{sel[f.k]}</span>
                      </div>
                      <Slider
                        value={[sel[f.k]]}
                        min={1}
                        max={f.max}
                        step={1}
                        onValueChange={(v) => update(sel.id, { [f.k]: v[0] ?? 1 })}
                        aria-label={f.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 text-sm font-semibold">Presets</div>
            <div className="grid grid-cols-3 gap-2">
              {BENTO_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setCols(p.cols);
                    setRows(p.rows);
                    setCells(p.cells.map((c) => ({ ...c, id: uid() })));
                    setSelected(null);
                  }}
                  className="rounded-md border border-border p-2 text-left text-xs hover:bg-accent"
                  aria-label={`Load ${p.name}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </>
  );
}
