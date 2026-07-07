import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
        <Sparkles className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">
        This tool is coming soon. In the meantime, try the Gradient or Border Radius generators.
      </p>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link to="/tools/gradient">Try Gradient Generator</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/tools/border-radius">Border Radius</Link>
        </Button>
      </div>
    </div>
  );
}