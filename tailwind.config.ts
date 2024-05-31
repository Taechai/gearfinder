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
        dark: "#004377",
        "light-dark": "#60B8C6",
        light: "#D9F4F7",
        "primary-light": "#E3F2FD",
        "primary-main": "#90CAF9",
        "primary-dark": "#42A5F7",
        "secondary-light": "#F4E4F5",
        "secondary-main": "#CE93D8",
        "secondary-dark": "#AB47BC",
        "success-light": "#81C784",
        "success-main": "#66BB6A",
        "success-dark": "#388E3C",
        "error-light": "#E57373",
        "error-main": "#F44336",
        "error-dark": "#D3302F",
        "warning-light": "#FFB74D",
        "warning-main": "#FFA726",
        "warning-dark": "#F47D02",
      },
      fontSize: {
        sm: "11px",
        md: "13px",
        lg: "20px",
        xl: "35px",
      },
      spacing: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      screens: {
        "max-sm": { max: "639px" },
      },
    },
  },
  plugins: [],
};
export default config;
