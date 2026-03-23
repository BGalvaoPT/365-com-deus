import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf8ed",
          100: "#f9edcc",
          200: "#f2d994",
          300: "#ebc25c",
          400: "#e5ad35",
          500: "#c9a96e",
          600: "#8b6914",
          700: "#6f5210",
          800: "#5c4314",
          900: "#4d3816",
        },
        parchment: {
          50: "#faf8f4",
          100: "#f5f0e8",
          200: "#e9e0d0",
          300: "#d9ccb4",
          400: "#c4b08f",
          500: "#b39b74",
          600: "#a68a65",
          700: "#8a7154",
          800: "#715e49",
          900: "#5e4e3e",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
