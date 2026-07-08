import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolHeader } from "@/components/tool-header";
import { CodeBlock } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/preprocessor")({
  head: () => ({
    meta: [
      { title: "SCSS / LESS to CSS Compiler — SagaCSS" },
      {
        name: "description",
        content:
          "Compile SCSS or LESS to plain CSS in your browser — variables, nesting, mixins and basic functions supported.",
      },
      { property: "og:title", content: "SCSS / LESS to CSS Compiler — SagaCSS" },
      {
        property: "og:description",
        content: "In-browser SCSS and LESS compiler with instant CSS output.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/preprocessor" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/preprocessor" }],
  }),
  component: PreprocessorPage,
});

const SCSS_SAMPLE = `$primary: #6366f1;
$radius: 12px;

.card {
  padding: 1rem;
  border-radius: $radius;
  background: $primary;

  .title {
    font-weight: 700;
    color: white;
  }

  &:hover { transform: translateY(-2px); }
}
`;

const LESS_SAMPLE = `@primary: #6366f1;
@radius: 12px;

.card {
  padding: 1rem;
  border-radius: @radius;
  background: @primary;

  .title { color: white; font-weight: 700; }
  &:hover { transform: translateY(-2px); }
}
`;

function PreprocessorPage() {
  const [lang, setLang] = useState<"scss" | "less">("scss");
  const [input, setInput] = useState(SCSS_SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (lang === "scss") {
          const css = compileScss(input);
          if (!cancelled) {
            setOutput(css);
            setError(null);
          }
        } else {
          const less = (
            (await import("less")) as unknown as {
              default: { render: (s: string) => Promise<{ css: string }> };
            }
          ).default;
          const res = await less.render(input);
          if (!cancelled) {
            setOutput(res.css);
            setError(null);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setOutput("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, input]);

  const switchLang = (l: "scss" | "less") => {
    setLang(l);
    setInput(l === "scss" ? SCSS_SAMPLE : LESS_SAMPLE);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="SCSS / LESS to CSS Compiler"
        description="Paste SCSS or LESS and get compiled plain CSS live in your browser."
      />

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 rounded-md border border-border p-0.5">
          {(["scss", "less"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchLang(l)}
              aria-pressed={lang === l}
              className={`rounded px-3 py-1 text-xs font-medium ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setInput(lang === "scss" ? SCSS_SAMPLE : LESS_SAMPLE)}
        >
          Load sample
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="src-input"
            className="text-xs uppercase tracking-wide text-muted-foreground"
          >
            {lang.toUpperCase()} input
          </Label>
          <Textarea
            id="src-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[22rem] font-mono text-sm"
            aria-label={`${lang.toUpperCase()} source`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Compiled CSS
          </Label>
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive whitespace-pre-wrap font-mono"
            >
              {error}
            </div>
          ) : (
            <CodeBlock code={output || "/* no output */"} label="CSS" />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal SCSS compiler: variables ($name: value;), single/multi-level nesting,
 * `&` parent references, and line/block comments. Sufficient for the common
 * subset that SagaCSS demos.
 */
function compileScss(src: string): string {
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

  const vars: Record<string, string> = {};
  const varLine = /^\s*\$([\w-]+)\s*:\s*([^;]+);\s*$/gm;
  const withoutVars = stripped.replace(varLine, (_, k: string, v: string) => {
    vars[k] = v.trim();
    return "";
  });

  const resolveVars = (s: string) => s.replace(/\$([\w-]+)/g, (_, k) => vars[k] ?? `$${k}`);

  const nodes = parseBlocks(resolveVars(withoutVars));
  const rules: { sel: string; body: string }[] = [];
  flatten(nodes, [], rules);
  return rules
    .filter((r) => r.body.trim())
    .map(
      (r) =>
        `${r.sel} {\n${r.body
          .trim()
          .split("\n")
          .map((l) => "  " + l.trim())
          .join("\n")}\n}`,
    )
    .join("\n\n");
}

type Node = { type: "rule"; selector: string; children: Node[] } | { type: "decl"; text: string };

function parseBlocks(input: string): Node[] {
  const out: Node[] = [];
  let i = 0;
  const readTo = (stop: string): string => {
    let buf = "";
    while (i < input.length && !stop.includes(input[i])) buf += input[i++];
    return buf;
  };
  const parse = (): Node[] => {
    const nodes: Node[] = [];
    let buf = "";
    while (i < input.length) {
      const ch = input[i];
      if (ch === "{") {
        const selector = buf.trim();
        buf = "";
        i++;
        const children = parse();
        nodes.push({ type: "rule", selector, children });
      } else if (ch === "}") {
        i++;
        flushDecls(buf, nodes);
        return nodes;
      } else if (ch === ";") {
        buf += ch;
        i++;
        flushDecls(buf, nodes);
        buf = "";
      } else {
        buf += ch;
        i++;
      }
    }
    flushDecls(buf, nodes);
    return nodes;
  };
  void readTo;
  return parse();
  function flushDecls(text: string, into: Node[]) {
    for (const raw of text.split(";")) {
      const t = raw.trim();
      if (!t) continue;
      into.push({ type: "decl", text: t });
    }
  }
}

function combineSelectors(parents: string[], selector: string): string {
  const cur = selector
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parents.length === 0) return cur.join(", ");
  const combined: string[] = [];
  for (const p of parents) {
    for (const c of cur) {
      if (c.startsWith("&")) combined.push(p + c.slice(1));
      else combined.push(p + " " + c);
    }
  }
  return combined.join(", ");
}

function flatten(nodes: Node[], parentSelectors: string[], out: { sel: string; body: string }[]) {
  const decls: string[] = [];
  const rules: Node[] = [];
  for (const n of nodes) {
    if (n.type === "decl") decls.push(n.text + ";");
    else rules.push(n);
  }
  if (parentSelectors.length && decls.length) {
    out.push({ sel: parentSelectors.join(", "), body: decls.join("\n") });
  } else if (!parentSelectors.length && decls.length) {
    out.push({ sel: ":root", body: decls.join("\n") });
  }
  for (const r of rules) {
    if (r.type !== "rule") continue;
    const nextParents = parentSelectors.length
      ? [combineSelectors(parentSelectors, r.selector)]
      : r.selector
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    flatten(r.children, nextParents, out);
  }
}
