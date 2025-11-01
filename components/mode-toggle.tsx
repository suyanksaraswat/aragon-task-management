"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2">
        <Switch disabled />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="inline-flex justify-center items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
        aria-label="Toggle theme"
      />

      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
