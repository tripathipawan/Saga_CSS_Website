import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { AppFooter } from "./app-footer";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("sagacss.sidebarCollapsed");
      if (v === "1") setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("sagacss.sidebarCollapsed", next ? "1" : "0"); } catch {}
      return next;
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader onOpenMenu={() => setMobileOpen(true)} onToggleSidebar={toggleCollapsed} />
      <div className="flex flex-1 w-full">
        <aside
          className={`hidden lg:block shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 ${collapsed ? "w-16" : "w-64"}`}
        >
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)] overflow-y-auto">
            <AppSidebar collapsed={collapsed} />
          </div>
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar">
            <VisuallyHidden>
              <SheetTitle>Navigation menu</SheetTitle>
              <SheetDescription>Browse SagaCSS tools, design styles, and pages.</SheetDescription>
            </VisuallyHidden>
            <div className="h-full overflow-y-auto pt-4">
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</div>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}