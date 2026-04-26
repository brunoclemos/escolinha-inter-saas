import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Sport Club Internacional palette
        inter: {
          red: "#C8102E",
          "red-dark": "#9A0C23",
          "red-soft": "#FFEDEE",
          black: "#0F0F0F",
          graphite: "#1A1A1A",
          slate: "#2C2C2C",
          line: "#E5E5E5",
          mute: "#6B6B66",
          subtle: "#9A9A95",
          bg: "#FAFAF8",
          elev: "#FFFFFF",
        },
        ok: "#1B5A37",
        warn: "#7A4D0A",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,15,15,0.04), 0 1px 0 rgba(15,15,15,0.02)",
        card: "0 4px 24px -8px rgba(15,15,15,0.08), 0 1px 0 rgba(15,15,15,0.03)",
      },
    },
  },
  plugins: [],
} satisfies Config;
