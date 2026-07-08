import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative"
    >
      <Sun
        className={`h-5 w-5 transition-all ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
      />
    </Button>
  );
}
