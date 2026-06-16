import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef8f1",
          100: "#d8f0df",
          500: "#2f8c57",
          600: "#237547",
          700: "#1f5d3b",
          900: "#123522"
        },
        clay: {
          100: "#f4ece0",
          500: "#b66a37",
          700: "#7f4322"
        }
      },
      boxShadow: {
        soft: "0 16px 45px rgba(18, 53, 34, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
