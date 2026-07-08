import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/bezier")({
  head: () => ({
    meta: [
      { title: "Cubic Bezier & Easing Curve Generator | SagaCSS" },
      {
        name: "description",
        content:
          "Design custom CSS cubic-bezier easing curves with a draggable control-point editor, animated preview and a library of named easings.",
      },
      { property: "og:title", content: "Cubic Bezier Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Interactive cubic-bezier editor with live animated preview.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/bezier" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/bezier" }],
  }),
  component: BezierPage,
});

type Pt = { x: number; y: number };
const PRESETS: { name: string; p1: Pt; p2: Pt }[] = [
  { name: "ease", p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
  { name: "linear", p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } },
  { name: "ease-in", p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
  { name: "ease-out", p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
  { name: "ease-in-out", p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
  { name: "easeInOutBack", p1: { x: 0.68, y: -0.55 }, p2: { x: 0.27, y: 1.55 } },
  { name: "easeOutBack", p1: { x: 0.34, y: 1.56 }, p2: { x: 0.64, y: 1 } },
  { name: "easeOutBounce", p1: { x: 0.34, y: 1.9 }, p2: { x: 0.7, y: 0.9 } },
  { name: "easeInExpo", p1: { x: 0.7, y: 0 }, p2: { x: 0.84, y: 0 } },
  { name: "easeOutExpo", p1: { x: 0.16, y: 1 }, p2: { x: 0.3, y: 1 } },
];

function BezierPage() {
  const [p1, setP1] = useState<Pt>({ x: 0.42, y: 0 });
  const [p2, setP2] = useState<Pt>({ x: 0.58, y: 1 });
  const [tick, setTick] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<null | "p1" | "p2">(null);

  const bezier = `cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;

  // SVG coords: 0..200, y flipped (0 at top = 1.0 progress)
  const toSvg = (p: Pt) => ({ x: p.x * 200, y: 200 - p.y * 200 });
  const fromSvg = (x: number, y: number): Pt => ({
    x: Math.max(-0.5, Math.min(1.5, x / 200)),
    y: Math.max(-0.5, Math.min(1.5, 1 - y / 200)),
  });

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const y = ((e.clientY - rect.top) / rect.height) * 200;
    const pt = fromSvg(x, y);
    if (drag.current === "p1") setP1(pt);
    else setP2(pt);
  };

  const path = useMemo(() => {
    const a = toSvg({ x: 0, y: 0 });
    const c1 = toSvg(p1);
    const c2 = toSvg(p2);
    const b = toSvg({ x: 1, y: 1 });
    return `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
  }, [p1, p2]);

  const s1 = toSvg(p1),
    s2 = toSvg(p2);

  const css = `transition: transform 0.6s ${bezier};\n/* or */\nanimation-timing-function: ${bezier};`;
  const tailwind = `<div class="transition-transform duration-500 ease-[${bezier.replace(/\s+/g, "_")}]">…</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: d-inline-block -->\n<div class="craft-ease d-inline-block">…</div>\n\n<!-- Bootstrap has no utility for: transition-timing-function with custom cubic-bezier(). -->\n@use "bootstrap/scss/utilities" as *;\n.craft-ease { transition: transform 0.6s ${bezier}; }`;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Cubic Bezier & Easing Curves"
        description="Design custom CSS easing curves visually — drag the control points, preview on a live animation and load named presets."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <Label className="text-sm font-semibold">Curve editor</Label>
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{bezier}</code>
          </div>
          <svg
            ref={svgRef}
            viewBox="-40 -40 280 280"
            className="aspect-square w-full touch-none rounded-md border border-border bg-background"
            onPointerMove={onMove}
            onPointerUp={() => (drag.current = null)}
            onPointerLeave={() => (drag.current = null)}
            aria-label="Cubic bezier control graph"
          >
            {/* grid */}
            {[0, 50, 100, 150, 200].map((g) => (
              <g key={g}>
                <line x1={0} y1={g} x2={200} y2={g} stroke="currentColor" strokeOpacity="0.08" />
                <line x1={g} y1={0} x2={g} y2={200} stroke="currentColor" strokeOpacity="0.08" />
              </g>
            ))}
            {/* axis box */}
            <rect
              x={0}
              y={0}
              width={200}
              height={200}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            {/* handles */}
            <line
              x1={0}
              y1={200}
              x2={s1.x}
              y2={s1.y}
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeDasharray="3 3"
            />
            <line
              x1={200}
              y1={0}
              x2={s2.x}
              y2={s2.y}
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeDasharray="3 3"
            />
            {/* curve */}
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="text-primary"
            />
            {/* points */}
            <circle
              cx={s1.x}
              cy={s1.y}
              r={8}
              role="button"
              className="cursor-grab fill-primary outline-none focus-visible:stroke-primary focus-visible:[stroke-width:3]"
              onPointerDown={() => (drag.current = "p1")}
              tabIndex={0}
              onKeyDown={(e) => {
                const s = e.shiftKey ? 0.1 : 0.02;
                if (e.key === "ArrowUp") setP1((p) => ({ ...p, y: Math.min(1.5, p.y + s) }));
                if (e.key === "ArrowDown") setP1((p) => ({ ...p, y: Math.max(-0.5, p.y - s) }));
                if (e.key === "ArrowLeft") setP1((p) => ({ ...p, x: Math.max(-0.5, p.x - s) }));
                if (e.key === "ArrowRight") setP1((p) => ({ ...p, x: Math.min(1.5, p.x + s) }));
              }}
              aria-label={`Control point P1 at ${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}. Arrow keys to nudge.`}
            />
            <circle
              cx={s2.x}
              cy={s2.y}
              r={8}
              role="button"
              className="cursor-grab fill-accent outline-none focus-visible:stroke-accent focus-visible:[stroke-width:3]"
              onPointerDown={() => (drag.current = "p2")}
              tabIndex={0}
              onKeyDown={(e) => {
                const s = e.shiftKey ? 0.1 : 0.02;
                if (e.key === "ArrowUp") setP2((p) => ({ ...p, y: Math.min(1.5, p.y + s) }));
                if (e.key === "ArrowDown") setP2((p) => ({ ...p, y: Math.max(-0.5, p.y - s) }));
                if (e.key === "ArrowLeft") setP2((p) => ({ ...p, x: Math.max(-0.5, p.x - s) }));
                if (e.key === "ArrowRight") setP2((p) => ({ ...p, x: Math.min(1.5, p.x + s) }));
              }}
              aria-label={`Control point P2 at ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)}. Arrow keys to nudge.`}
            />
            {/* labels */}
            <text x={-6} y={205} fontSize={10} textAnchor="end" fill="currentColor" opacity="0.5">
              0,0
            </text>
            <text x={205} y={-2} fontSize={10} fill="currentColor" opacity="0.5">
              1,1
            </text>
          </svg>

          <div className="mt-4">
            <Label className="mb-2 block text-sm font-semibold">Presets</Label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setP1(p.p1);
                    setP2(p.p2);
                  }}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-left text-xs font-mono hover:bg-accent"
                  aria-label={`Load ${p.name} preset`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm font-semibold">Live preview</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTick((t) => t + 1)}
                className="gap-1.5"
              >
                <Play className="h-4 w-4" /> Replay
              </Button>
            </div>
            <div className="relative h-16 overflow-hidden rounded-md border border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div
                key={tick + bezier}
                className="absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg"
                style={{ animation: `bezierRun 1.4s ${bezier} infinite alternate` }}
              />
            </div>
            <style>{`@keyframes bezierRun { from { left: 4px } to { left: calc(100% - 44px) } }`}</style>
            <p className="mt-2 text-xs text-muted-foreground">
              Ball travels using your current easing curve, alternating each cycle.
            </p>
          </div>

          <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
        </div>
      </div>
    </div>
  );
}
