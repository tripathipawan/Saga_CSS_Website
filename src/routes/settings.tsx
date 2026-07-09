import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToolHeader } from "@/components/tool-header";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SagaCSS" },
      {
        name: "description",
        content: "Adjust SagaCSS preferences: theme, default code format and reset saved data.",
      },
      { property: "og:title", content: "Settings — SagaCSS" },
      {
        property: "og:description",
        content: "Configure theme and default code format for SagaCSS.",
      },
      { property: "og:url", content: "/settings" },
    ],
    links: [{ rel: "canonical", href: "/settings" }],
  }),
  component: SettingsPage,
});

type Format = "css" | "tailwind" | "bootstrap";
const FORMAT_KEY = "sagacss.codeFormat";

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [format, setFormat] = useState<Format>("css");

  useEffect(() => {
    const v = window.localStorage.getItem(FORMAT_KEY);
    if (v === "tailwind" || v === "bootstrap" || v === "css") setFormat(v);
  }, []);

  const saveFormat = (f: Format) => {
    setFormat(f);
    window.localStorage.setItem(FORMAT_KEY, f);
    toast.success(`Default code format set to ${f.toUpperCase()}`);
  };

  const resetAll = () => {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith("sagacss."))
        .forEach((k) => window.localStorage.removeItem(k));
      setTheme("dark");
      setFormat("css");
      toast.success("All preferences reset");
    } catch {
      toast.error("Could not reset preferences");
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <ToolHeader title="Settings" description="Personal preferences saved on this device only." />

      <section className="rounded-xl border border-border bg-card p-5">
        <Label className="text-sm font-semibold">Theme</Label>
        <p className="mt-1 text-xs text-muted-foreground">Choose light or dark.</p>
        <div className="mt-3 flex gap-2">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              aria-pressed={theme === t}
              className={`rounded-md border px-3 py-1.5 text-sm capitalize transition-colors ${
                theme === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <Label className="text-sm font-semibold">Default code format</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          The format tab that opens by default on every tool.
        </p>
        <div className="mt-3 flex gap-2">
          {(["css", "tailwind", "bootstrap"] as Format[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => saveFormat(f)}
              aria-pressed={format === f}
              className={`rounded-md border px-3 py-1.5 text-sm capitalize transition-colors ${
                format === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <Label className="text-sm font-semibold">Reset preferences</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Clears theme, code format, sidebar state and any other locally-saved settings.
        </p>
        <div className="mt-3">
          <Button variant="outline" onClick={resetAll}>
            Reset all saved preferences
          </Button>
        </div>
      </section>
    </div>
  );
}
