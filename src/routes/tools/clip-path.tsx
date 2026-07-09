import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/clip-path")({
  head: () => ({
    meta: [
      { title: "CSS Clip Path Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Visual polygon clip-path editor with draggable points and preset shapes like triangle, hexagon, star and arrow.",
      },
      { property: "og:title", content: "Clip Path Generator — SagaCSS" },
      { property: "og:description", content: "Design CSS clip-path polygons visually." },
      { property: "og:url", content: "/tools/clip-path" },
    ],
    links: [{ rel: "canonical", href: "/tools/clip-path" }],
  }),
  component: ClipPathPage,
});

type Pt = { x: number; y: number };
const PRESETS: { name: string; points: Pt[] }[] = [
  {
    name: "Triangle",
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
  },
  {
    name: "Rhombus",
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 50 },
      { x: 50, y: 100 },
      { x: 0, y: 50 },
    ],
  },
  {
    name: "Pentagon",
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 38 },
      { x: 82, y: 100 },
      { x: 18, y: 100 },
      { x: 0, y: 38 },
    ],
  },
  {
    name: "Hexagon",
    points: [
      { x: 25, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 50 },
      { x: 75, y: 100 },
      { x: 25, y: 100 },
      { x: 0, y: 50 },
    ],
  },
  {
    name: "Star",
    points: [
      { x: 50, y: 0 },
      { x: 61, y: 35 },
      { x: 98, y: 35 },
      { x: 68, y: 57 },
      { x: 79, y: 91 },
      { x: 50, y: 70 },
      { x: 21, y: 91 },
      { x: 32, y: 57 },
      { x: 2, y: 35 },
      { x: 39, y: 35 },
    ],
  },
  {
    name: "Arrow",
    points: [
      { x: 0, y: 20 },
      { x: 60, y: 20 },
      { x: 60, y: 0 },
      { x: 100, y: 50 },
      { x: 60, y: 100 },
      { x: 60, y: 80 },
      { x: 0, y: 80 },
    ],
  },
  {
    name: "Chevron",
    points: [
      { x: 75, y: 0 },
      { x: 100, y: 50 },
      { x: 75, y: 100 },
      { x: 0, y: 100 },
      { x: 25, y: 50 },
      { x: 0, y: 0 },
    ],
  },
];

function ClipPathPage() {
  const [points, setPoints] = useState<Pt[]>(PRESETS[4].points);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const clip = useMemo(
    () => `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`,
    [points],
  );
  const css = `clip-path: ${clip};\n-webkit-clip-path: ${clip};`;
  const clipEsc = clip.replace(/\s+/g, "_");
  const tailwind = `<div class="[clip-path:${clipEsc}] [-webkit-clip-path:${clipEsc}] w-56 h-56 bg-gradient-to-br from-violet-500 to-cyan-400">…</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: d-inline-block -->\n<div class="craft-clip d-inline-block"></div>\n\n<!-- Bootstrap has no utility for: clip-path, custom gradient background, arbitrary rem sizing. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-clip {\n  width: 14rem; height: 14rem;\n  background: linear-gradient(135deg, #8b5cf6, #22d3ee);\n  clip-path: ${clip};\n  -webkit-clip-path: ${clip};\n}`;

  const onPointerMove = (i: number) => (e: React.PointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPoints((prev) => prev.map((p, j) => (j === i ? { x, y } : p)));
  };

  const nudge = (i: number, dx: number, dy: number) => {
    setPoints((prev) =>
      prev.map((p, j) =>
        j === i
          ? { x: Math.max(0, Math.min(100, p.x + dx)), y: Math.max(0, Math.min(100, p.y + dy)) }
          : p,
      ),
    );
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent<SVGCircleElement>) => {
    const step = e.shiftKey ? 10 : 1;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        nudge(i, 0, -step);
        break;
      case "ArrowDown":
        e.preventDefault();
        nudge(i, 0, step);
        break;
      case "ArrowLeft":
        e.preventDefault();
        nudge(i, -step, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        nudge(i, step, 0);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Clip Path Generator"
        description="Drag vertices to shape a CSS polygon clip-path. Load preset shapes and copy production-ready code."
      />

      <div className="relative flex min-h-[16rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div className="relative h-56 w-56">
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary to-accent"
            style={{ clipPath: clip, WebkitClipPath: clip }}
            aria-label="Clip path preview"
            role="img"
          />
          <svg
            className="absolute inset-0 h-full w-full touch-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.4}
              className="text-primary/60"
              vectorEffect="non-scaling-stroke"
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={focusedIndex === i ? 3.6 : 2.6}
                tabIndex={0}
                role="slider"
                aria-label={`Vertex ${i + 1} of ${points.length} at ${Math.round(p.x)}% ${Math.round(p.y)}%. Use arrow keys to move, shift+arrow for larger steps.`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(p.x)}
                className={`cursor-grab fill-primary stroke-white focus:outline-none ${focusedIndex === i ? "stroke-ring" : ""}`}
                strokeWidth={focusedIndex === i ? 1.4 : 0.8}
                vectorEffect="non-scaling-stroke"
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex((f) => (f === i ? null : f))}
                onKeyDown={onKeyDown(i)}
                onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
                onPointerMove={onPointerMove(i)}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <Label className="mb-2 block text-sm font-semibold">Presets</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setPoints(p.points)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-xs hover:bg-accent"
                aria-label={`Load ${p.name} preset`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Tip: drag the dots on the preview to reshape the polygon.
          </p>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
