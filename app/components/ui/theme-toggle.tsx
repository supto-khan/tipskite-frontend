"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", nextTheme);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className={className} aria-label="Toggle theme">
        <span className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative h-4 w-4 flex items-center justify-center">
        <Sun
          className={`absolute h-4 w-4 text-amber-500 transition-all duration-200 ${
            theme === "dark"
              ? "scale-100 opacity-100 rotate-0"
              : "scale-75 opacity-0 -rotate-45"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 text-text-secondary transition-all duration-200 ${
            theme === "light"
              ? "scale-100 opacity-100 rotate-0"
              : "scale-75 opacity-0 rotate-45"
          }`}
        />
      </div>
    </Button>
  );
}
