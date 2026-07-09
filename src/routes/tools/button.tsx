import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/button")({
  head: () => ({
    meta: [
      { title: "CSS Button Style Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design custom CSS buttons visually — padding, radius, gradients, shadow and hover interaction. Copy production-ready CSS.",
      },
      { property: "og:title", content: "Button Style Generator — SagaCSS" },
      { property: "og:description", content: "Design custom CSS buttons with live hover preview." },
      { property: "og:url", content: "/tools/button" },
    ],
    links: [{ rel: "canonical", href: "/tools/button" }],
  }),
  component: ButtonPage,
});

function ButtonPage() {
  const [label, setLabel] = useState("Click me");
  const [padX, setPadX] = useState(20);
  const [padY, setPadY] = useState(12);
  const [radius, setRadius] = useState(10);
  const [color1, setColor1] = useState("#8b5cf6");
  const [color2, setColor2] = useState("#22d3ee");
  const [gradient, setGradient] = useState(true);
  const [textColor, setTextColor] = useState("#ffffff");
  const [shadow, setShadow] = useState(20);
  const [hoverLift, setHoverLift] = useState(3);

  const presets = [
    {
      name: "Primary Gradient",
      padX: 20,
      padY: 12,
      radius: 10,
      color1: "#8b5cf6",
      color2: "#22d3ee",
      gradient: true,
      textColor: "#ffffff",
      shadow: 20,
      hoverLift: 3,
    },
    {
      name: "Ghost Outline",
      padX: 18,
      padY: 10,
      radius: 8,
      color1: "#ffffff",
      color2: "#ffffff",
      gradient: false,
      textColor: "#111827",
      shadow: 0,
      hoverLift: 0,
    },
    {
      name: "Neon Pop",
      padX: 24,
      padY: 14,
      radius: 999,
      color1: "#22d3ee",
      color2: "#a855f7",
      gradient: true,
      textColor: "#ffffff",
      shadow: 50,
      hoverLift: 4,
    },
    {
      name: "Neumorphic",
      padX: 24,
      padY: 12,
      radius: 14,
      color1: "#e0e5ec",
      color2: "#e0e5ec",
      gradient: false,
      textColor: "#334155",
      shadow: 30,
      hoverLift: 0,
    },
    {
      name: "Sunset CTA",
      padX: 28,
      padY: 14,
      radius: 12,
      color1: "#f97316",
      color2: "#ef4444",
      gradient: true,
      textColor: "#ffffff",
      shadow: 30,
      hoverLift: 4,
    },
    {
      name: "Ink Pill",
      padX: 22,
      padY: 10,
      radius: 999,
      color1: "#0f172a",
      color2: "#0f172a",
      gradient: false,
      textColor: "#ffffff",
      shadow: 14,
      hoverLift: 2,
    },
  ];
  const apply = (p: (typeof presets)[number]) => {
    setPadX(p.padX);
    setPadY(p.padY);
    setRadius(p.radius);
    setColor1(p.color1);
    setColor2(p.color2);
    setGradient(p.gradient);
    setTextColor(p.textColor);
    setShadow(p.shadow);
    setHoverLift(p.hoverLift);
  };

  const bg = gradient ? `linear-gradient(135deg, ${color1}, ${color2})` : color1;

  const css = useMemo(
    () => `.btn {
  background: ${bg};
  color: ${textColor};
  padding: ${padY}px ${padX}px;
  border: 0;
  border-radius: ${radius}px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 ${Math.round(shadow / 2)}px ${shadow}px -${Math.round(shadow / 3)}px ${color1}55;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.btn:hover {
  transform: translateY(-${hoverLift}px);
  box-shadow: 0 ${Math.round(shadow / 2) + hoverLift * 2}px ${shadow + 8}px -${Math.round(shadow / 3)}px ${color1}66;
}`,
    [bg, textColor, padX, padY, radius, shadow, hoverLift, color1],
  );

  const tailwind = useMemo(() => {
    const bgClass = gradient
      ? `bg-[linear-gradient(135deg,${color1},${color2})]`
      : `bg-[${color1}]`;
    const shadowStr = `0_${Math.round(shadow / 2)}px_${shadow}px_-${Math.round(shadow / 3)}px_${color1}55`;
    const hover = hoverLift > 0 ? ` hover:-translate-y-[${hoverLift}px]` : "";
    return `<button class="px-[${padX}px] py-[${padY}px] rounded-[${radius}px] font-semibold text-[${textColor}] ${bgClass} shadow-[${shadowStr}] transition-transform duration-200${hover}">\n  ${label || "Click me"}\n</button>`;
  }, [gradient, color1, color2, padX, padY, radius, textColor, shadow, hoverLift, label]);

  const bootstrap = useMemo(() => {
    const radiusCls = radius >= 24 ? "rounded-5" : radius >= 12 ? "rounded-3" : "rounded-2";
    const shadowStyle = `0 ${Math.round(shadow / 2)}px ${shadow}px -${Math.round(shadow / 3)}px ${color1}55`;
    const shadowCls =
      shadow >= 24
        ? "shadow-lg"
        : shadow >= 8
          ? "shadow"
          : shadow > 0
            ? "shadow-sm"
            : "shadow-none";
    const paddingCls = padY >= 20 ? "py-4" : padY >= 14 ? "py-3" : padY >= 10 ? "py-2" : "py-1";
    const paddingXCls = padX >= 32 ? "px-5" : padX >= 24 ? "px-4" : padX >= 16 ? "px-3" : "px-2";
    return `<!-- markup — uses real Bootstrap utilities: btn, fw-semibold, border-0, ${radiusCls}, ${shadowCls}, ${paddingCls}, ${paddingXCls} -->\n<button class="btn craft-btn fw-semibold border-0 ${radiusCls} ${shadowCls} ${paddingCls} ${paddingXCls}">${label || "Click me"}</button>\n\n<!-- Bootstrap has no utility for: custom hex background/gradient, custom text color, exact colored box-shadow. -->\n@use "bootstrap/scss/utilities" as *;\n.craft-btn { background: ${bg}; color: ${textColor}; box-shadow: ${shadowStyle}; }`;
  }, [bg, textColor, shadow, color1, hoverLift, radius, padX, padY, label]);

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Button Style Generator"
        description="Compose a custom CSS button with padding, radius, gradient background, shadow and hover lift — hover the preview to try it."
      />

      <div className="flex min-h-[16rem] max-h-[18rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <button
          type="button"
          style={{
            background: bg,
            color: textColor,
            padding: `${padY}px ${padX}px`,
            border: 0,
            borderRadius: radius,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: `0 ${Math.round(shadow / 2)}px ${shadow}px -${Math.round(shadow / 3)}px ${color1}55`,
            transition: "transform 180ms ease, box-shadow 180ms ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.transform = `translateY(-${hoverLift}px)`;
            el.style.boxShadow = `0 ${Math.round(shadow / 2) + hoverLift * 2}px ${shadow + 8}px -${Math.round(shadow / 3)}px ${color1}66`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = "";
            el.style.boxShadow = `0 ${Math.round(shadow / 2)}px ${shadow}px -${Math.round(shadow / 3)}px ${color1}55`;
          }}
        >
          {label || "Click me"}
        </button>
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
          <div className="mb-3">
            <Label className="mb-1 block text-xs">Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-9"
              aria-label="Button label"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { label: "Padding X", val: padX, set: setPadX, min: 8, max: 60 },
                { label: "Padding Y", val: padY, set: setPadY, min: 4, max: 40 },
                { label: "Radius", val: radius, set: setRadius, min: 0, max: 40 },
                { label: "Shadow", val: shadow, set: setShadow, min: 0, max: 60 },
                { label: "Hover lift", val: hoverLift, set: setHoverLift, min: 0, max: 10 },
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
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="grad"
                  checked={gradient}
                  onCheckedChange={setGradient}
                  aria-label="Use gradient background"
                />
                <Label htmlFor="grad" className="text-sm">
                  Gradient
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <Label className="text-xs">Color 1</Label>
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="h-8 w-9 cursor-pointer rounded border border-border bg-transparent"
                  aria-label="Color 1"
                />
              </div>
              <div className="flex items-center gap-1">
                <Label className="text-xs">Color 2</Label>
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="h-8 w-9 cursor-pointer rounded border border-border bg-transparent"
                  aria-label="Color 2"
                />
              </div>
              <div className="flex items-center gap-1">
                <Label className="text-xs">Text</Label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-9 cursor-pointer rounded border border-border bg-transparent"
                  aria-label="Text color"
                />
              </div>
            </div>
          </div>
        </div>
        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} />
      </div>
    </div>
  );
}
