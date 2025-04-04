import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: colors.gray[800],
        "primary-hover": colors.gray[600],
        "primary-focus": colors.gray[500],
      },
    },
  },
  plugins: [],
};
export default config;
