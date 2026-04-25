import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class", 
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ["#0D9488"]: {
          DEFAULT: "#14A085",
          dark: "#0d7a65",
          light: "#e6f7f4",
          lighter: "#f0faf8",
        },
      },
      fontFamily: {
        degular: ["var(--font-degular)", "sans-serif"],
      },
    },
  },
};
export default config;
