import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Eco Kephyra palette
        "cream-green": "#F0F1DE", // fond, creamy green très clair
        "sage": "#A9C77A",        // vert crème, accents / boutons
        "sky": "#7FB8D9",         // bleu ciel, liens / accents secondaires
        "brown": "#6B4423",       // marron, titres / bordures
        "brown-dark": "#4A2F18",  // marron profond, texte fort
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
