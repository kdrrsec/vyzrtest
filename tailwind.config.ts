import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: [
    "font-mono",
    "uppercase",
    "text-accent",
    "text-muted",
    "text-[10px]",
    "text-[11px]",
    "tracking-[0.18em]",
    "tracking-[0.2em]",
    "hover:scale-[1.28]",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        foreground: "#0A0A0A",
        accent: "#E01E1E",
        muted: "rgba(10, 10, 10, 0.65)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
