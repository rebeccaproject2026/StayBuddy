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
          DEFAULT: '#1E40AF',
          dark: '#1E3A8A',
          light: '#DBEAFE',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFEDD5',
        },
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
