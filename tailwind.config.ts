import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0e7ff",
          100: "#e0cfff",
          200: "#c19fff",
          300: "#a26fff",
          400: "#833fff",
          500: "#6400ff",
          600: "#5000cc",
          700: "#3c0099",
          800: "#280066",
          900: "#140033",
        },
        accent: {
          50: "#fff0e7",
          100: "#ffe0cf",
          200: "#ffc19f",
          300: "#ffa26f",
          400: "#ff833f",
          500: "#ff6400",
          600: "#cc5000",
          700: "#993c00",
          800: "#662800",
          900: "#331400",
        },
        dark: {
          50: "#1a1a1a",
          100: "#2d2d2d",
          200: "#404040",
          300: "#525252",
          400: "#656565",
          500: "#787878",
          600: "#8b8b8b",
          700: "#9e9e9e",
          800: "#b1b1b1",
          900: "#c4c4c4",
        },
      },
    },
  },
  plugins: [],
};
export default config;

