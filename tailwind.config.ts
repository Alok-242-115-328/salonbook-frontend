import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
      boxShadow: {
        soft: "0 18px 50px -25px rgba(136, 19, 55, 0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(18px,-24px,0) scale(1.08)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-30px,18px,0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translate3d(0,0,0)" },
          "50%": { transform: "scale(1.08) translate3d(-1%,-1%,0)" },
          "100%": { transform: "scale(1) translate3d(0,0,0)" },
        },
      },
      animation: {
        float: "float 18s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        kenburns: "kenburns 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
