import { useEffect, useMemo, useState } from "react";
import { Check, Code2, Copy, BookmarkPlus } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { addSnippet, sourceFromPath } from "@/lib/my-kit";

type Format = "css" | "tailwind" | "bootstrap";
const STORAGE_KEY = "sagacss.codeFormat";

type Extracted = {
  decls: [string, string][];
  keyframes: { name: string; body: string }[];
};

// Split declarations respecting parentheses (so commas/semicolons inside
// gradients, rgba(), cubic-bezier() etc. don't split values).
function splitDeclarations(block: string): [string, string][] {
  const decls: [string, string][] = [];
  let depth = 0;
  let buf = "";
  for (const ch of block) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === ";" && depth === 0) {
      pushDecl(decls, buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  pushDecl(decls, buf);
  return decls;
}

function pushDecl(out: [string, string][], raw: string) {
  const line = raw.trim();
  if (!line) return;
  const idx = line.indexOf(":");
  if (idx === -1) return;
  const prop = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();
  if (prop && value) out.push([prop, value]);
}

// Extract @keyframes and strip single-selector wrappers, returning the
// flat declaration list for the "main" element plus any keyframes blocks.
function extractCss(css: string): Extracted {
  const keyframes: { name: string; body: string }[] = [];
  // Pull out @keyframes blocks (balanced braces, single level of nesting).
  const kfRe = /@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g;
  const stripped = css.replace(kfRe, (_m, name: string, body: string) => {
    keyframes.push({ name, body: body.trim() });
    return "";
  });

  // If the remaining CSS is a single selector block ".foo { ... }" or has
  // top-level declarations mixed with wrappers, prefer the first block's body.
  const blockRe = /([^{}]*)\{([^{}]*)\}/g;
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  let hadBlock = false;
  while ((match = blockRe.exec(stripped)) !== null) {
    hadBlock = true;
    blocks.push(match[2]);
  }
  const source = hadBlock ? blocks.join(";") : stripped;
  const decls = splitDeclarations(source);
  return { decls, keyframes };
}

function tailwindArbitrary(prop: string, value: string): string {
  // Tailwind arbitrary values: spaces → underscores, real underscores escaped.
  const safe = value.replace(/_/g, "\\_").replace(/\s+/g, "_");
  return `[${prop}:${safe}]`;
}

function toTailwind(css: string): { code: string; note?: string } {
  const { decls, keyframes } = extractCss(css);
  if (keyframes.length) {
    // Build a real Tailwind config extension for each keyframes block plus
    // an animate-* class the user can drop on the element.
    const kfConfig = keyframes
      .map((k) => {
        const framesLines = k.body
          .split("}")
          .map((f) => f.trim())
          .filter(Boolean)
          .map((f) => {
            const [selector, ...rest] = f.split("{");
            const decls = splitDeclarations(rest.join("{"));
            const body = decls.map(([p, v]) => `        "${p}": "${v}"`).join(",\n");
            return `      "${selector.trim()}": {\n${body}\n      }`;
          })
          .join(",\n");
        return `    "${k.name}": {\n${framesLines}\n    }`;
      })
      .join(",\n");

    // Read any animation shorthand from the decls to build animation entry.
    const anim = decls.find(([p]) => p === "animation");
    const animName = keyframes[0].name;
    const animShort = anim ? anim[1] : `${animName} 1s ease-in-out infinite`;
    // Extract only the timing portion (drop the leading keyframes name).
    const restShorthand = animShort.replace(new RegExp(`^${animName}\\s*`), "");
    const utilityClass = `animate-${animName}`;

    const otherDecls = decls.filter(([p]) => p !== "animation");
    const otherClasses = otherDecls.map(([p, v]) => tailwindArbitrary(p, v)).join(" ");

    const code = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      keyframes: {\n${kfConfig}\n      },\n      animation: {\n        "${animName}": "${animName} ${restShorthand}"\n      }\n    }\n  }\n}\n\n<!-- markup -->\n<div class="${utilityClass}${otherClasses ? " " + otherClasses : ""}">…</div>`;
    return { code, note: "Tailwind config extension for the keyframes + animate-* utility class." };
  }
  if (!decls.length) {
    return {
      code: `<div class="[all:unset]">…</div>`,
      note: "No declarations detected.",
    };
  }
  const classes = decls.map(([p, v]) => tailwindArbitrary(p, v)).join(" ");
  return {
    code: `<div class="${classes}">…</div>`,
    note: "Tailwind arbitrary-value classes. Requires Tailwind JIT.",
  };
}

function toBootstrap(css: string): { code: string; note?: string } {
  const { decls, keyframes } = extractCss(css);
  if (keyframes.length) {
    // Bootstrap has no animation utilities — inline the keyframes and apply
    // an animation shorthand via inline style. Emitted as valid HTML markup.
    const kfCss = keyframes.map((k) => `@keyframes ${k.name} {\n${k.body}\n}`).join("\n\n");
    const anim = decls.find(([p]) => p === "animation");
    const animValue = anim ? anim[1] : `${keyframes[0].name} 1s ease-in-out infinite`;
    const otherInline = decls
      .filter(([p]) => p !== "animation")
      .map(([p, v]) => `${p}: ${v};`)
      .join(" ");
    const style = `animation: ${animValue};${otherInline ? " " + otherInline : ""}`;
    return {
      code: `<style>\n${kfCss}\n</style>\n<div style="${style}">…</div>`,
      note: "Bootstrap has no animation utilities — keyframes inlined in a <style> tag.",
    };
  }
  if (!decls.length) {
    return { code: `<div>…</div>`, note: "No declarations detected." };
  }
  const utilities: string[] = [];
  const leftover: [string, string][] = [];
  for (const [p, v] of decls) {
    const u = mapBootstrap(p, v);
    if (u) utilities.push(...u.split(" "));
    else leftover.push([p, v]);
  }
  const clsAttr = utilities.length ? ` class="${utilities.join(" ")}"` : "";
  const styleAttr = leftover.length
    ? ` style="${leftover.map(([p, v]) => `${p}: ${v};`).join(" ")}"`
    : "";
  const out = `<div${clsAttr}${styleAttr}>…</div>`;
  return {
    code: out,
    note: leftover.length
      ? "Bootstrap utilities + inline style for properties without a utility."
      : "Bootstrap 5 utility classes.",
  };
}

function mapBootstrap(prop: string, value: string): string | null {
  const v = value.trim();
  switch (prop) {
    case "border-radius": {
      if (v === "0" || v === "0px") return "rounded-0";
      if (v === "50%" || /^9999px$/.test(v)) return "rounded-circle";
      const px = parsePx(v);
      if (px !== null) {
        if (px <= 2) return "rounded-1";
        if (px <= 6) return "rounded-2";
        if (px <= 10) return "rounded-3";
        if (px <= 16) return "rounded-4";
        if (px <= 24) return "rounded-5";
        return "rounded-pill";
      }
      return "rounded";
    }
    case "box-shadow": {
      if (v === "none") return "shadow-none";
      // Only map simple single-layer neutral shadows
      if (/,/.test(v)) return null; // multi-layer → custom
      if (/inset/.test(v)) return null;
      const blur = parseFirstPx(v.split(/\s+/).slice(2).join(" "));
      if (blur === null) return "shadow";
      if (blur <= 6) return "shadow-sm";
      if (blur >= 20) return "shadow-lg";
      return "shadow";
    }
    case "display":
      if (v === "flex") return "d-flex";
      if (v === "inline-flex") return "d-inline-flex";
      if (v === "grid") return "d-grid";
      if (v === "block") return "d-block";
      if (v === "inline-block") return "d-inline-block";
      if (v === "none") return "d-none";
      return null;
    case "justify-content": {
      const m: Record<string, string> = {
        "flex-start": "justify-content-start",
        "flex-end": "justify-content-end",
        center: "justify-content-center",
        "space-between": "justify-content-between",
        "space-around": "justify-content-around",
        "space-evenly": "justify-content-evenly",
      };
      return m[v] ?? null;
    }
    case "align-items": {
      const m: Record<string, string> = {
        "flex-start": "align-items-start",
        "flex-end": "align-items-end",
        center: "align-items-center",
        baseline: "align-items-baseline",
        stretch: "align-items-stretch",
      };
      return m[v] ?? null;
    }
    case "flex-wrap":
      if (v === "wrap") return "flex-wrap";
      if (v === "nowrap") return "flex-nowrap";
      if (v === "wrap-reverse") return "flex-wrap-reverse";
      return null;
    case "gap": {
      const px = parsePx(v);
      if (px === null) return null;
      if (px === 0) return "gap-0";
      if (px <= 4) return "gap-1";
      if (px <= 8) return "gap-2";
      if (px <= 16) return "gap-3";
      if (px <= 24) return "gap-4";
      return "gap-5";
    }
    case "width":
      if (v === "100%") return "w-100";
      if (v === "auto") return "w-auto";
      return null;
    case "height":
      if (v === "100%") return "h-100";
      if (v === "auto") return "h-auto";
      return null;
    case "font-weight":
      if (v === "bold" || v === "700") return "fw-bold";
      if (v === "600") return "fw-semibold";
      if (v === "500") return "fw-medium";
      if (v === "400" || v === "normal") return "fw-normal";
      return null;
    case "text-align":
      if (v === "center") return "text-center";
      if (v === "left" || v === "start") return "text-start";
      if (v === "right" || v === "end") return "text-end";
      return null;
    case "color":
      if (v === "#fff" || v === "#ffffff" || v === "white") return "text-white";
      if (v === "#000" || v === "#000000" || v === "black") return "text-black";
      return null;
    case "border":
      if (v === "none" || v === "0") return "border-0";
      return "border";
    default:
      return null;
  }
}

function parsePx(v: string): number | null {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(v.trim());
  return m ? parseFloat(m[1]) : null;
}
function parseFirstPx(v: string): number | null {
  const m = /(-?\d+(?:\.\d+)?)px/.exec(v);
  return m ? parseFloat(m[1]) : null;
}

function getInitialFormat(): Format {
  if (typeof window === "undefined") return "css";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "tailwind" || v === "bootstrap" ? v : "css";
}

function CodePanel({
  code,
  tailwind,
  bootstrap,
  label = "CSS",
}: {
  code: string;
  tailwind?: string;
  bootstrap?: string;
  label?: string;
}) {
  const [format, setFormat] = useState<Format>("css");
  const [copied, setCopied] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setFormat(getInitialFormat());
  }, []);

  const outputs = useMemo(() => {
    return {
      css: { code, note: undefined as string | undefined },
      tailwind: tailwind !== undefined ? { code: tailwind, note: undefined } : toTailwind(code),
      bootstrap: bootstrap !== undefined ? { code: bootstrap, note: undefined } : toBootstrap(code),
    };
  }, [code, tailwind, bootstrap]);

  const active = outputs[format];

  const selectFormat = (f: Format) => {
    setFormat(f);
    try {
      window.localStorage.setItem(STORAGE_KEY, f);
    } catch {
      /* ignore */
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      toast.success(`${labelFor(format)} copied`);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleSave = () => {
    const source = sourceFromPath(pathname);
    const suggested = `${source} snippet`;
    const input =
      typeof window !== "undefined"
        ? window.prompt("Label this snippet for My Kit", suggested)
        : suggested;
    if (input === null) return;
    addSnippet({
      label: input.trim() || suggested,
      code: active.code,
      format,
      source,
      sourcePath: pathname,
    });
    toast.success("Saved to My Kit");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5 rounded-md border border-border p-0.5">
          {(["css", "tailwind", "bootstrap"] as Format[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => selectFormat(f)}
              aria-pressed={format === f}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                format === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {labelFor(f)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            aria-label="Save snippet to My Kit"
            title="Save to My Kit"
            className="h-7 gap-1.5 text-xs"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 gap-1.5 text-xs"
            aria-label={`Copy ${labelFor(format)} to clipboard`}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <pre
        tabIndex={0}
        className="max-h-[18rem] w-full max-w-full overflow-auto whitespace-pre-wrap break-all p-3 text-[11px] leading-relaxed font-mono text-foreground sm:max-h-[22rem] sm:text-xs"
      >
        <code className="block w-full">{active.code}</code>
      </pre>
      {active.note && (
        <div className="border-t border-border bg-muted/20 px-3 py-1.5 text-[11px] text-muted-foreground">
          {active.note}
        </div>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}

function labelFor(f: Format) {
  return f === "css" ? "CSS" : f === "tailwind" ? "Tailwind" : "Bootstrap";
}

export function StickyCode({
  code,
  tailwind,
  bootstrap,
  label = "CSS",
}: {
  code: string;
  tailwind?: string;
  bootstrap?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="hidden min-w-0 lg:block lg:sticky lg:top-20 lg:self-start">
        <CodePanel code={code} tailwind={tailwind} bootstrap={bootstrap} label={label} />
      </div>
      <div className="min-w-0 lg:hidden">
        <CodePanel code={code} tailwind={tailwind} bootstrap={bootstrap} label={label} />
      </div>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Copy code to clipboard"
        className="fixed bottom-4 right-4 z-40 h-12 gap-2 rounded-full shadow-lg lg:hidden"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Generated code</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <CodePanel code={code} tailwind={tailwind} bootstrap={bootstrap} label={label} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Re-export CodeBlock behaviour for any legacy imports.
export { CodePanel as CodeBlock };
