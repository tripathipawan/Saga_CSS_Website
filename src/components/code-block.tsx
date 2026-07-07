import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CodeBlock({ code, label = "CSS" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          aria-label="Copy CSS to clipboard"
          className="h-7 gap-1.5 text-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="max-h-72 overflow-auto p-4 text-sm leading-relaxed font-mono text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}