import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Github, Menu, Palette, PanelLeft, Search, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { TOOL_INDEX } from "@/lib/tools";
import { useMemo, useState } from "react";

export function AppHeader({ onOpenMenu, onToggleSidebar }: { onOpenMenu: () => void; onToggleSidebar?: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TOOL_INDEX.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-2 px-3 md:px-5">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}

        <Link
          to="/"
          className="flex items-center gap-2 font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
          aria-label="SagaCSS home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
            <Palette className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">SagaCSS</span>
        </Link>

        <div className="relative mx-2 flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            aria-label="Search tools"
            className="h-9 pl-8"
          />
          {matches.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
              {matches.map((m) => (
                <li key={m.path}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setQuery("");
                      navigate({ to: m.path });
                    }}
                  >
                    <span>{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <a
            href="https://x.com/pawantripathi04"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="X (Twitter)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/tripathipawan"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
      <span className="sr-only">Current path: {pathname}</span>
    </header>
  );
}