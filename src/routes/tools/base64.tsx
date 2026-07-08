import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolHeader } from "@/components/tool-header";
import { CodeBlock } from "@/components/sticky-code";

export const Route = createFileRoute("/tools/base64")({
  head: () => ({
    meta: [
      { title: "Base64 Image Converter — SagaCSS" },
      {
        name: "description",
        content:
          "Convert any image to a Base64 data URI or decode a data URI back to a preview. Ideal for embedding small icons in CSS.",
      },
      { property: "og:title", content: "Base64 Image Converter — SagaCSS" },
      {
        property: "og:description",
        content: "Encode and decode Base64 image data URIs in the browser.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/tools/base64" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/tools/base64" }],
  }),
  component: Base64Page,
});

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function Base64Page() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [dataUri, setDataUri] = useState<string>("");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [decodeInput, setDecodeInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onUpload = (file: File | null) => {
    if (!file) return;
    setOriginalSize(file.size);
    const r = new FileReader();
    r.onload = () => typeof r.result === "string" && setDataUri(r.result);
    r.readAsDataURL(file);
  };

  const encodedSize = dataUri.length;
  const tooBig = encodedSize > 100_000;

  const cssSnippet = useMemo(
    () => (dataUri ? `background-image: url("${dataUri}");` : ""),
    [dataUri],
  );
  const htmlSnippet = useMemo(() => (dataUri ? `<img src="${dataUri}" alt="" />` : ""), [dataUri]);

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        title="Base64 Image Converter"
        description="Encode images to Base64 data URIs for inline embedding, or decode a data URI back to an image."
      />

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 rounded-md border border-border p-0.5">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded px-3 py-1 text-xs font-medium ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
            >
              {m === "encode" ? "Image → Base64" : "Base64 → Image"}
            </button>
          ))}
        </div>
      </div>

      {mode === "encode" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              aria-label="Upload image"
            />
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onUpload(e.dataTransfer.files?.[0] ?? null);
              }}
              className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-6 text-center"
            >
              {dataUri ? (
                <img src={dataUri} alt="Encoded preview" className="max-h-40 rounded" />
              ) : (
                <p className="text-sm text-muted-foreground">Drop an image here or click Upload.</p>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="gap-1.5"
              >
                <Upload className="h-4 w-4" /> Upload image
              </Button>
            </div>
            {dataUri && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-muted p-2">
                  <div className="text-muted-foreground">Original</div>
                  <div className="font-mono">{bytes(originalSize)}</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <div className="text-muted-foreground">Base64</div>
                  <div className="font-mono">{bytes(encodedSize)}</div>
                </div>
              </div>
            )}
            {tooBig && (
              <div
                role="alert"
                className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-2 text-xs text-yellow-700 dark:text-yellow-300"
              >
                This data URI is large ({bytes(encodedSize)}). Base64 embedding is best for small
                icons — larger images should stay as external files for caching and performance.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <CodeBlock code={dataUri || "/* upload an image to generate */"} label="Data URI" />
            <CodeBlock code={cssSnippet || "/* upload an image */"} label="CSS" />
            <CodeBlock code={htmlSnippet || "<!-- upload an image -->"} label="HTML" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="decode-in"
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              Paste Base64 data URI
            </Label>
            <Textarea
              id="decode-in"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0K..."
              className="min-h-[16rem] font-mono text-xs"
            />
          </div>
          <div className="flex min-h-[16rem] items-center justify-center rounded-xl border border-border bg-card p-4">
            {decodeInput.trim().startsWith("data:image") ? (
              <img
                src={decodeInput.trim()}
                alt="Decoded preview"
                className="max-h-72 max-w-full rounded"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Paste a valid image data URI to see the preview.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
