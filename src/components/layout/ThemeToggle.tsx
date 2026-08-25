"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { hydrateThemeStore, useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const tNav = useTranslations("Nav");
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    hydrateThemeStore();
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? tNav("switchToLight") : tNav("switchToDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] p-1 text-foreground transition hover:border-accent/40 dark:border-white/15 dark:bg-white/[0.06] ${className}`}
      aria-label={label}
      title={label}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
          !isDark ? "bg-white shadow-sm" : "text-muted"
        }`}
      >
        <SunIcon className="h-3.5 w-3.5" />
      </span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
          isDark ? "bg-black text-white shadow-sm" : "text-muted"
        }`}
      >
        <MoonIcon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}
