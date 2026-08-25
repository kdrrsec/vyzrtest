import { create } from "zustand";

export type SiteTheme = "light" | "dark";

const STORAGE_KEY = "vyzr-theme";

function applyThemeClass(theme: SiteTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStoredTheme(): SiteTheme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

type ThemeState = {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
      applyThemeClass(theme);
    }
  },
  toggleTheme: () => {
    get().setTheme(get().theme === "dark" ? "light" : "dark");
  },
}));

/** Syncs the store with whatever the no-flash inline script already applied to <html>. */
export function hydrateThemeStore() {
  const theme = readStoredTheme();
  useThemeStore.setState({ theme });
}
