import { Link, useRouterState } from "@tanstack/react-router";
import { CORE_TOOLS, DESIGN_STYLES, EXTRAS, LEARN, type ToolItem } from "@/lib/tools";
import {
  Blend,
  BoxSelect,
  Box,
  Circle,
  Layers,
  Move3d,
  Palette,
  Shapes,
  Sparkles,
  Square,
  SquareDashed,
  Type,
  Wand2,
  Zap,
  LayoutGrid,
  Scissors,
  Rows3,
  MousePointerClick,
  Droplet,
  PenTool,
  Pipette,
  Beaker,
  Contrast,
  Spline,
  CaseSensitive,
  SlidersHorizontal,
  ImageIcon,
  FileCode2,
  FileImage,
  Ruler,
  Sparkle,
  Crown,
  Bookmark,
  BookOpen,
  RotateCcw,
  ArrowUpDown,
  Loader2,
  Variable,
  GraduationCap,
  Target,
  Globe2,
  Layers3,
  Smartphone,
} from "lucide-react";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "/tools/gradient": Blend,
  "/tools/border-radius": Circle,
  "/tools/box-shadow": Square,
  "/tools/text-shadow": Type,
  "/tools/animation": Zap,
  "/tools/3d-shapes": Move3d,
  "/tools/box-sizing": BoxSelect,
  "/tools/color-palette": Droplet,
  "/tools/color-converter": Pipette,
  "/tools/color-mixer": Beaker,
  "/tools/contrast": Contrast,
  "/tools/clip-path": Scissors,
  "/tools/flexbox": Rows3,
  "/tools/grid": LayoutGrid,
  "/tools/svg": PenTool,
  "/tools/button": MousePointerClick,
  "/tools/bezier": Spline,
  "/tools/fonts": CaseSensitive,
  "/tools/filter": SlidersHorizontal,
  "/tools/image-text": ImageIcon,
  "/tools/preprocessor": FileCode2,
  "/tools/base64": FileImage,
  "/tools/clamp": Ruler,
  "/tools/theme-variables": Palette,
  "/tools/reset": RotateCcw,
  "/tools/scrollbar": ArrowUpDown,
  "/tools/spinner": Loader2,
  "/tools/theme": Variable,
  "/tools/compatibility": Globe2,
  "/tools/specificity": Layers3,
  "/tools/responsive": Smartphone,
  "/styles/neumorphism": Layers,
  "/styles/glassmorphism": SquareDashed,
  "/styles/claymorphism": Shapes,
  "/styles/neubrutalism": Box,
  "/styles/y2k": Sparkle,
  "/styles/cyberpunk": Zap,
  "/styles/art-deco": Crown,
  "/my-kit": Bookmark,
  "/cheat-sheet": BookOpen,
  "/interview-prep": GraduationCap,
  "/practice": Target,
};

function Group({
  title,
  items,
  onNavigate,
  activePath,
  collapsed,
}: {
  title: string;
  items: ToolItem[];
  onNavigate?: () => void;
  activePath: string;
  collapsed?: boolean;
}) {
  return (
    <div className="px-3 py-2">
      {!collapsed && (
        <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      )}
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = ICONS[item.path] ?? Palette;
          const active = activePath === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onNavigate}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${collapsed ? "justify-center" : ""} ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="min-w-0 truncate">{item.name}</span>}
                {!collapsed && item.comingSoon && (
                  <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Soon
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AppSidebar({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Primary" className="py-3">
      <div
        className={`mb-2 flex items-center gap-2 px-5 text-sm font-semibold text-sidebar-foreground lg:hidden`}
      >
        <Sparkles className="h-4 w-4 text-primary" />
        SagaCSS
      </div>
      <Group
        title="Core Tools"
        items={CORE_TOOLS}
        onNavigate={onNavigate}
        activePath={pathname}
        collapsed={collapsed}
      />
      <Group
        title="Design Styles"
        items={DESIGN_STYLES}
        onNavigate={onNavigate}
        activePath={pathname}
        collapsed={collapsed}
      />
      <Group
        title="Learn"
        items={LEARN}
        onNavigate={onNavigate}
        activePath={pathname}
        collapsed={collapsed}
      />
      <Group
        title="Extras"
        items={EXTRAS}
        onNavigate={onNavigate}
        activePath={pathname}
        collapsed={collapsed}
      />
      {!collapsed && (
        <div className="mx-5 mt-4 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/80">
          <div className="mb-1 flex items-center gap-1.5 font-medium">
            <Wand2 className="h-3.5 w-3.5" /> More tools shipping soon
          </div>
          Curated CSS utilities for modern UI work.
        </div>
      )}
    </nav>
  );
}
