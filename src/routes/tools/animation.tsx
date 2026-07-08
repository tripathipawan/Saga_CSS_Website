import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/animation")({
  head: () => ({
    meta: [
      { title: "CSS Animation & Transition Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Build CSS transitions and keyframe animations with easing curve editor, live previews and copy-ready CSS.",
      },
      { property: "og:title", content: "Animation Generator — SagaCSS" },
      {
        property: "og:description",
        content: "Design CSS transitions and keyframe animations visually.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/animation" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/animation" }],
  }),
  component: AnimationPage,
});

const EASINGS = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"] as const;
type Easing = (typeof EASINGS)[number] | "custom";

function AnimationPage() {
  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Animation & Transition Generator"
        description="Design CSS transitions with an easing curve editor and preview keyframe presets on loop."
      />
      <Tabs defaultValue="transitions">
        <TabsList>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
          <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
        </TabsList>
        <TabsContent value="transitions">
          <TransitionsTab />
        </TabsContent>
        <TabsContent value="keyframes">
          <KeyframesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransitionsTab() {
  const [property, setProperty] = useState("transform");
  const [duration, setDuration] = useState(500);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState<Easing>("ease");
  const [bezier, setBezier] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1]);
  const [hovering, setHovering] = useState(false);

  const timing = easing === "custom" ? `cubic-bezier(${bezier.join(", ")})` : easing;
  const css = `transition: ${property} ${duration}ms ${timing} ${delay}ms;`;
  const timingTw = timing.replace(/\s+/g, "_");
  const tailwind = `<div class="transition-[${property}] duration-[${duration}ms] ease-[${timingTw}] delay-[${delay}ms]">…</div>`;
  const bootstrap = `<!-- markup — uses real Bootstrap utilities: d-inline-block -->\n<div class="craft-transition d-inline-block">…</div>\n\n<!-- Bootstrap has no utility for: transition (custom property/duration/timing/delay). -->\n@use "bootstrap/scss/utilities" as *;\n.craft-transition { transition: ${property} ${duration}ms ${timing} ${delay}ms; }`;

  const hoverStyle: React.CSSProperties = hovering
    ? property === "opacity"
      ? { opacity: 0.4 }
      : property === "background-color" || property === "color"
        ? { backgroundColor: "#22d3ee" }
        : { transform: "translateX(80px) scale(1.1) rotate(15deg)" }
    : {};

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs">Property</Label>
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                aria-label="Transition property"
              >
                {["transform", "opacity", "background-color", "color", "all"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-1 block text-xs">Easing</Label>
              <select
                value={easing}
                onChange={(e) => setEasing(e.target.value as Easing)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                aria-label="Easing"
              >
                {EASINGS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
                <option value="custom">custom cubic-bezier</option>
              </select>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Duration</Label>
                <span className="font-mono text-xs text-muted-foreground">{duration}ms</span>
              </div>
              <Slider
                value={[duration]}
                min={0}
                max={3000}
                step={50}
                onValueChange={(v) => setDuration(v[0] ?? 0)}
                aria-label="Duration"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Delay</Label>
                <span className="font-mono text-xs text-muted-foreground">{delay}ms</span>
              </div>
              <Slider
                value={[delay]}
                min={0}
                max={2000}
                step={50}
                onValueChange={(v) => setDelay(v[0] ?? 0)}
                aria-label="Delay"
              />
            </div>
          </div>

          {easing === "custom" && <BezierEditor value={bezier} onChange={setBezier} />}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
          <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Hover or click the box
          </div>
          <div className="relative h-40 overflow-hidden rounded-lg border border-border bg-background/50">
            <div
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onClick={() => setHovering((h) => !h)}
              role="button"
              tabIndex={0}
              aria-label="Transition preview"
              className="absolute left-4 top-1/2 h-16 w-16 -translate-y-1/2 cursor-pointer rounded-xl bg-primary"
              style={{
                transition: `${property} ${duration}ms ${timing} ${delay}ms`,
                ...hoverStyle,
              }}
            />
          </div>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}

function BezierEditor({
  value,
  onChange,
}: {
  value: [number, number, number, number];
  onChange: (v: [number, number, number, number]) => void;
}) {
  const size = 200;
  const [x1, y1, x2, y2] = value;
  const px = (x: number, y: number) => ({ cx: x * size, cy: size - y * size });
  const p1 = px(x1, y1);
  const p2 = px(x2, y2);

  const drag = (idx: 0 | 1) => (e: React.PointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (ev.clientX - rect.left) / size));
      const ny = Math.max(-0.5, Math.min(1.5, 1 - (ev.clientY - rect.top) / size));
      const next: [number, number, number, number] = [...value];
      next[idx * 2] = +nx.toFixed(2);
      next[idx * 2 + 1] = +ny.toFixed(2);
      onChange(next);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        className="rounded-md border border-border bg-background touch-none"
      >
        <line
          x1={0}
          y1={size}
          x2={p1.cx}
          y2={p1.cy}
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="4"
        />
        <line
          x1={size}
          y1={0}
          x2={p2.cx}
          y2={p2.cy}
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="4"
        />
        <path
          d={`M0 ${size} C ${p1.cx} ${p1.cy} ${p2.cx} ${p2.cy} ${size} 0`}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx={p1.cx}
          cy={p1.cy}
          r={8}
          fill="hsl(var(--primary))"
          onPointerDown={drag(0)}
          className="cursor-grab"
        />
        <circle
          cx={p2.cx}
          cy={p2.cy}
          r={8}
          fill="hsl(var(--accent))"
          onPointerDown={drag(1)}
          className="cursor-grab"
        />
      </svg>
      <div className="font-mono text-xs text-muted-foreground">
        cubic-bezier({value.join(", ")})
      </div>
    </div>
  );
}

type PresetCategory = "Entrances" | "Exits" | "Attention" | "Looping";
type Preset = {
  name: string;
  category: PresetCategory;
  keyframes: string;
  defaults: { duration: number; iterations: string };
};

const PRESETS: Preset[] = [
  // Entrances
  {
    name: "fadeIn",
    category: "Entrances",
    keyframes: `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`,
    defaults: { duration: 600, iterations: "1" },
  },
  {
    name: "fadeInUp",
    category: "Entrances",
    keyframes: `@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }`,
    defaults: { duration: 700, iterations: "1" },
  },
  {
    name: "fadeInDown",
    category: "Entrances",
    keyframes: `@keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px) } to { opacity: 1; transform: translateY(0) } }`,
    defaults: { duration: 700, iterations: "1" },
  },
  {
    name: "slideInLeft",
    category: "Entrances",
    keyframes: `@keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }`,
    defaults: { duration: 600, iterations: "1" },
  },
  {
    name: "slideInRight",
    category: "Entrances",
    keyframes: `@keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }`,
    defaults: { duration: 600, iterations: "1" },
  },
  {
    name: "zoomIn",
    category: "Entrances",
    keyframes: `@keyframes zoomIn { from { opacity: 0; transform: scale(.3) } to { opacity: 1; transform: scale(1) } }`,
    defaults: { duration: 500, iterations: "1" },
  },
  {
    name: "flipIn",
    category: "Entrances",
    keyframes: `@keyframes flipIn { from { opacity: 0; transform: perspective(400px) rotateY(90deg) } to { opacity: 1; transform: perspective(400px) rotateY(0) } }`,
    defaults: { duration: 700, iterations: "1" },
  },
  {
    name: "bounceIn",
    category: "Entrances",
    keyframes: `@keyframes bounceIn { 0% { opacity: 0; transform: scale(.3) } 50% { opacity: 1; transform: scale(1.1) } 80% { transform: scale(.95) } 100% { transform: scale(1) } }`,
    defaults: { duration: 800, iterations: "1" },
  },
  // Exits
  {
    name: "fadeOut",
    category: "Exits",
    keyframes: `@keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }`,
    defaults: { duration: 500, iterations: "1" },
  },
  {
    name: "slideOutLeft",
    category: "Exits",
    keyframes: `@keyframes slideOutLeft { from { transform: translateX(0) } to { transform: translateX(-100%) } }`,
    defaults: { duration: 500, iterations: "1" },
  },
  {
    name: "slideOutRight",
    category: "Exits",
    keyframes: `@keyframes slideOutRight { from { transform: translateX(0) } to { transform: translateX(100%) } }`,
    defaults: { duration: 500, iterations: "1" },
  },
  {
    name: "zoomOut",
    category: "Exits",
    keyframes: `@keyframes zoomOut { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(.3) } }`,
    defaults: { duration: 500, iterations: "1" },
  },
  // Attention
  {
    name: "pulse",
    category: "Attention",
    keyframes: `@keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.15) } }`,
    defaults: { duration: 900, iterations: "infinite" },
  },
  {
    name: "shake",
    category: "Attention",
    keyframes: `@keyframes shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-10px) } 40% { transform: translateX(10px) } 60% { transform: translateX(-8px) } 80% { transform: translateX(8px) } }`,
    defaults: { duration: 700, iterations: "1" },
  },
  {
    name: "wobble",
    category: "Attention",
    keyframes: `@keyframes wobble { 0%,100% { transform: none } 15% { transform: translateX(-25%) rotate(-5deg) } 30% { transform: translateX(20%) rotate(3deg) } 45% { transform: translateX(-15%) rotate(-3deg) } 60% { transform: translateX(10%) rotate(2deg) } 75% { transform: translateX(-5%) rotate(-1deg) } }`,
    defaults: { duration: 900, iterations: "1" },
  },
  {
    name: "heartbeat",
    category: "Attention",
    keyframes: `@keyframes heartbeat { 0% { transform: scale(1) } 14% { transform: scale(1.3) } 28% { transform: scale(1) } 42% { transform: scale(1.3) } 70% { transform: scale(1) } }`,
    defaults: { duration: 1500, iterations: "infinite" },
  },
  {
    name: "tada",
    category: "Attention",
    keyframes: `@keyframes tada { 0%,100% { transform: scale(1) } 10%,20% { transform: scale(.9) rotate(-3deg) } 30%,50%,70%,90% { transform: scale(1.1) rotate(3deg) } 40%,60%,80% { transform: scale(1.1) rotate(-3deg) } }`,
    defaults: { duration: 1000, iterations: "1" },
  },
  {
    name: "jello",
    category: "Attention",
    keyframes: `@keyframes jello { 0%,11.1%,100% { transform: none } 22.2% { transform: skewX(-12.5deg) skewY(-12.5deg) } 33.3% { transform: skewX(6.25deg) skewY(6.25deg) } 44.4% { transform: skewX(-3.125deg) skewY(-3.125deg) } 55.5% { transform: skewX(1.5deg) skewY(1.5deg) } 66.6% { transform: skewX(-.8deg) skewY(-.8deg) } }`,
    defaults: { duration: 1000, iterations: "1" },
  },
  {
    name: "rubberBand",
    category: "Attention",
    keyframes: `@keyframes rubberBand { 0%,100% { transform: scale(1) } 30% { transform: scaleX(1.25) scaleY(.75) } 40% { transform: scaleX(.75) scaleY(1.25) } 50% { transform: scaleX(1.15) scaleY(.85) } 65% { transform: scaleX(.95) scaleY(1.05) } 75% { transform: scaleX(1.05) scaleY(.95) } }`,
    defaults: { duration: 900, iterations: "1" },
  },
  // Looping
  {
    name: "spin",
    category: "Looping",
    keyframes: `@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`,
    defaults: { duration: 1200, iterations: "infinite" },
  },
  {
    name: "bounceLoop",
    category: "Looping",
    keyframes: `@keyframes bounceLoop { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-30px) } }`,
    defaults: { duration: 1000, iterations: "infinite" },
  },
  {
    name: "float",
    category: "Looping",
    keyframes: `@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }`,
    defaults: { duration: 2400, iterations: "infinite" },
  },
  {
    name: "blink",
    category: "Looping",
    keyframes: `@keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }`,
    defaults: { duration: 900, iterations: "infinite" },
  },
  {
    name: "glowPulse",
    category: "Looping",
    keyframes: `@keyframes glowPulse { 0%,100% { box-shadow: 0 0 10px hsl(var(--primary) / .4) } 50% { box-shadow: 0 0 24px 4px hsl(var(--primary) / .8) } }`,
    defaults: { duration: 1600, iterations: "infinite" },
  },
];

const CATEGORIES: PresetCategory[] = ["Entrances", "Exits", "Attention", "Looping"];

function KeyframesTab() {
  const [name, setName] = useState<string>("bounceIn");
  const [category, setCategory] = useState<PresetCategory>("Entrances");
  const [duration, setDuration] = useState(800);
  const [iterations, setIterations] = useState<string>("1");
  const [direction, setDirection] = useState("normal");
  const [playKey, setPlayKey] = useState(0);

  const preset = useMemo(() => PRESETS.find((p) => p.name === name) ?? PRESETS[0], [name]);
  const filtered = useMemo(() => PRESETS.filter((p) => p.category === category), [category]);

  const selectPreset = (p: Preset) => {
    setName(p.name);
    setDuration(p.defaults.duration);
    setIterations(p.defaults.iterations);
    setPlayKey((k) => k + 1);
  };

  const css = useMemo(
    () =>
      `${preset.keyframes}\n\n.animated {\n  animation: ${preset.name} ${duration}ms ease-in-out ${iterations} ${direction};\n}`,
    [preset, duration, iterations, direction],
  );
  const tailwind = useMemo(() => {
    const framesBody = preset.keyframes
      .replace(/^@keyframes\s+\w+\s*\{/, "")
      .replace(/\}\s*$/, "")
      .trim();
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      keyframes: {\n        "${preset.name}": { ${framesBody} }\n      },\n      animation: {\n        "${preset.name}": "${preset.name} ${duration}ms ease-in-out ${iterations} ${direction}"\n      }\n    }\n  }\n}\n\n<!-- markup -->\n<div class="animate-${preset.name}">…</div>`;
  }, [preset, duration, iterations, direction]);
  const bootstrap = useMemo(
    () =>
      `<!-- markup — uses real Bootstrap utilities: d-inline-block -->\n<div class="animate-${preset.name} d-inline-block">…</div>\n\n<!-- Bootstrap has no utility for: @keyframes definitions or the animation shorthand. -->\n@use "bootstrap/scss/utilities" as *;\n${preset.keyframes}\n.animate-${preset.name} {\n  animation: ${preset.name} ${duration}ms ease-in-out ${iterations} ${direction};\n}`,
    [preset, duration, iterations, direction],
  );

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 flex flex-wrap gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${category === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid max-h-56 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3">
            {filtered.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => selectPreset(p)}
                aria-pressed={name === p.name}
                className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${name === p.name ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs">Direction</Label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                aria-label="Direction"
              >
                {["normal", "reverse", "alternate", "alternate-reverse"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-1 block text-xs">Iterations</Label>
              <Input
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
                aria-label="Iteration count"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs">Duration</Label>
                <span className="font-mono text-xs text-muted-foreground">{duration}ms</span>
              </div>
              <Slider
                value={[duration]}
                min={100}
                max={4000}
                step={50}
                onValueChange={(v) => setDuration(v[0] ?? 1000)}
                aria-label="Duration"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 gap-1.5"
            onClick={() => setPlayKey((k) => k + 1)}
          >
            <Play className="h-4 w-4" /> Replay
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex min-h-[16rem] items-center justify-center rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
          <style>{preset.keyframes}</style>
          <div
            key={playKey}
            className="h-20 w-20 rounded-2xl bg-primary"
            style={{
              animation: `${preset.name} ${duration}ms ease-in-out ${iterations} ${direction}`,
            }}
            aria-label="Animation preview"
          />
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
