"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    // Save theme preference
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
    );
  }

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
      {themes.map(({ id, label, icon: Icon }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(id as Theme)}
          className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === id
              ? "bg-white text-purple-600 shadow-lg"
              : "text-white hover:text-yellow-200 hover:bg-white/20"
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
