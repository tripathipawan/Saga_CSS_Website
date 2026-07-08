import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tool-header";
import { StickyCode } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/image-text")({
  head: () => ({
    meta: [
      { title: "Clipped Text / Image Fill Text Generator — SagaCSS" },
      {
        name: "description",
        content:
          "Design trendy text with an image or gradient clipped inside the letters using background-clip: text. Copy production-ready CSS.",
      },
      { property: "og:title", content: "Clipped Text Effect — SagaCSS" },
      {
        property: "og:description",
        content: "Fill text with an image or gradient using background-clip: text.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/image-text" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/image-text" }],
  }),
  component: ImageTextPage,
});

const SAMPLE_IMAGES: { name: string; url: string }[] = [
  {
    name: "Aurora",
    url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#0ea5e9'/><stop offset='.5' stop-color='#8b5cf6'/><stop offset='1' stop-color='#ec4899'/></linearGradient></defs><rect width='1200' height='600' fill='url(#g)'/><circle cx='260' cy='180' r='160' fill='#fef3c7' opacity='.55'/><circle cx='980' cy='460' r='220' fill='#0f172a' opacity='.35'/></svg>`,
      ),
  },
  {
    name: "Sunset",
    url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><defs><linearGradient id='s' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#fbbf24'/><stop offset='.5' stop-color='#f97316'/><stop offset='1' stop-color='#7c1d6f'/></linearGradient></defs><rect width='1200' height='600' fill='url(#s)'/><circle cx='600' cy='420' r='140' fill='#fde68a' opacity='.7'/></svg>`,
      ),
  },
  {
    name: "Forest",
    url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><defs><linearGradient id='f' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#065f46'/><stop offset='1' stop-color='#84cc16'/></linearGradient></defs><rect width='1200' height='600' fill='url(#f)'/><circle cx='300' cy='500' r='260' fill='#052e16' opacity='.5'/><circle cx='900' cy='150' r='120' fill='#a7f3d0' opacity='.5'/></svg>`,
      ),
  },
  {
    name: "Neon Grid",
    url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><defs><linearGradient id='n' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#0f172a'/><stop offset='1' stop-color='#4c1d95'/></linearGradient><pattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'><path d='M40 0H0V40' fill='none' stroke='#22d3ee' stroke-opacity='.6'/></pattern></defs><rect width='1200' height='600' fill='url(#n)'/><rect width='1200' height='600' fill='url(#p)'/></svg>`,
      ),
  },
];

const GRADIENT_PRESETS: { name: string; value: string }[] = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff9966, #ff5e62, #7c1d6f)" },
  { name: "Aurora", value: "linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899)" },
  { name: "Lime Pop", value: "linear-gradient(135deg, #84cc16, #22d3ee)" },
  { name: "Mango", value: "linear-gradient(135deg, #fbbf24, #f97316, #ef4444)" },
  { name: "Iridescent", value: "linear-gradient(135deg, #a5f3fc, #c4b5fd, #fbcfe8, #fde68a)" },
  { name: "Deep Ocean", value: "linear-gradient(180deg, #0f172a, #1e40af, #22d3ee)" },
];

const FONT_FAMILIES = [
  { label: "Sans (system)", value: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" },
  { label: "Serif", value: 'Georgia, "Times New Roman", serif' },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  { label: "Display", value: '"Helvetica Neue", Impact, sans-serif' },
];

type Mode = "image" | "gradient";

function ImageTextPage() {
  const [mode, setMode] = useState<Mode>("gradient");
  const [text, setText] = useState("BOLD.");
  const [size, setSize] = useState(120);
  const [weight, setWeight] = useState(900);
  const [letterSpacing, setLetterSpacing] = useState(-2);
  const [family, setFamily] = useState(FONT_FAMILIES[3].value);
  const [fallback, setFallback] = useState("#111827");

  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [bgSize, setBgSize] = useState(140);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);

  const [gradient, setGradient] = useState(GRADIENT_PRESETS[0].value);
  const inputRef = useRef<HTMLInputElement>(null);

  const onUpload = (file: File | null) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === "string") {
        setImageUrl(r.result);
        setMode("image");
      }
    };
    r.readAsDataURL(file);
  };

  const previewStyle: React.CSSProperties = {
    display: "inline-block",
    fontFamily: family,
    fontWeight: weight,
    fontSize: `${size}px`,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: 1.1,
    backgroundImage: mode === "image" ? `url("${imageUrl}")` : gradient,
    backgroundSize: mode === "image" ? `${bgSize}%` : "100% 100%",
    backgroundPosition: mode === "image" ? `${posX}% ${posY}%` : "center",
    backgroundRepeat: "no-repeat",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };

  const css = useMemo(() => {
    const bgProps =
      mode === "image"
        ? `background-image: url("your-image.jpg");\n  background-size: ${bgSize}%;\n  background-position: ${posX}% ${posY}%;\n  background-repeat: no-repeat;`
        : `background-image: ${gradient};\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;`;
    return `.clipped-text {
  display: inline-block;
  font-family: ${family};
  font-weight: ${weight};
  font-size: ${size}px;
  letter-spacing: ${letterSpacing}px;
  line-height: 1.1;
  ${bgProps}
  color: transparent; /* fallback for browsers without background-clip: text */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}`;
  }, [mode, gradient, posX, posY, bgSize, family, weight, size, letterSpacing]);

  const tailwind = useMemo(() => {
    const bgClass =
      mode === "image"
        ? `[background:url('your-image.jpg')_${posX}%_${posY}%_/_${bgSize}%_no-repeat]`
        : `[background-image:${gradient.replace(/\s+/g, "_")}]`;
    return `<span class="bg-clip-text text-transparent font-black tracking-tight ${bgClass}" style="font-size:${size}px; font-weight:${weight}">\n  ${text || "…"}\n</span>`;
  }, [mode, gradient, posX, posY, bgSize, size, weight, text]);

  const bootstrap = useMemo(
    () =>
      `<!-- markup — uses real Bootstrap utilities: d-inline-block, fw-bolder, text-center -->\n<span class="clipped-text d-inline-block fw-bolder text-center">${text || "…"}</span>\n\n<!-- Bootstrap has no utility for: background-clip: text, custom font-family, arbitrary font-size/letter-spacing, custom background image/gradient. -->\n<!-- Extend via _custom.scss: -->\n@use "bootstrap/scss/utilities" as *;\n.clipped-text {\n${css.split("\n").slice(1, -1).join("\n")}\n}`,
    [css, text],
  );

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Clipped Text Effect"
        description="Fill text with an image or gradient using background-clip: text — the trendy Behance/Instagram look."
      />

      <div className="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div
          role="img"
          aria-label={`Clipped text preview: ${text}`}
          style={{
            ...previewStyle,
            fontSize: `clamp(2.5rem, ${size / 8}vw, ${size}px)`,
            textAlign: "center",
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {text || "\u00a0"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
          <div>
            <Label htmlFor="clip-text" className="text-xs">
              Text
            </Label>
            <Input
              id="clip-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SliderRow
              label="Font size"
              value={size}
              setValue={setSize}
              min={24}
              max={220}
              unit="px"
            />
            <SliderRow
              label="Weight"
              value={weight}
              setValue={setWeight}
              min={100}
              max={900}
              step={100}
              unit=""
            />
            <SliderRow
              label="Letter spacing"
              value={letterSpacing}
              setValue={setLetterSpacing}
              min={-10}
              max={20}
              unit="px"
            />
            <div>
              <Label htmlFor="clip-font" className="text-xs">
                Font family
              </Label>
              <select
                id="clip-font"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                aria-label="Font family"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Fallback color</Label>
              <input
                type="color"
                value={fallback}
                onChange={(e) => setFallback(e.target.value)}
                aria-label="Fallback color"
                className="mt-1 h-8 w-full rounded border border-input"
              />
            </div>
          </div>

          <div className="flex gap-1 rounded-md border border-border p-0.5">
            {(["gradient", "image"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`flex-1 rounded px-3 py-1.5 text-xs font-medium capitalize ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {m} fill
              </button>
            ))}
          </div>

          {mode === "gradient" ? (
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 text-xs font-medium">Gradient presets</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {GRADIENT_PRESETS.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => setGradient(g.value)}
                    aria-pressed={gradient === g.value}
                    className={`flex flex-col items-stretch gap-1 rounded-md border p-1 text-left text-[11px] ${
                      gradient === g.value
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className="h-8 w-full rounded"
                      style={{ background: g.value }}
                      aria-hidden="true"
                    />
                    <span className="px-1">{g.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <Label htmlFor="grad-custom" className="text-xs">
                  Custom gradient CSS
                </Label>
                <Input
                  id="grad-custom"
                  value={gradient}
                  onChange={(e) => setGradient(e.target.value)}
                  className="mt-1 font-mono text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-medium">Image fill</div>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                    aria-label="Upload image"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="h-7 gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </Button>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SAMPLE_IMAGES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setImageUrl(s.url)}
                    aria-pressed={imageUrl === s.url}
                    aria-label={`Use ${s.name} sample`}
                    className={`h-14 rounded border ${imageUrl === s.url ? "border-primary" : "border-border hover:border-primary/50"}`}
                    style={{ background: `url("${s.url}") center/cover` }}
                  />
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <SliderRow
                  label="Zoom"
                  value={bgSize}
                  setValue={setBgSize}
                  min={50}
                  max={400}
                  unit="%"
                />
                <SliderRow
                  label="Pan X"
                  value={posX}
                  setValue={setPosX}
                  min={0}
                  max={100}
                  unit="%"
                />
                <SliderRow
                  label="Pan Y"
                  value={posY}
                  setValue={setPosY}
                  min={0}
                  max={100}
                  unit="%"
                />
              </div>
            </div>
          )}
        </div>

        <StickyCode code={css} tailwind={tailwind} bootstrap={bootstrap} label="CSS" />
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  setValue,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step ?? 1}
        onValueChange={(v) => setValue(v[0] ?? 0)}
        aria-label={label}
      />
    </div>
  );
}
