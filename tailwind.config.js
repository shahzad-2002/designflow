/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2430",
          light: "#26313F",
          dashed: "#3A4656",
        },
        paper: "#FAF8F3",
        panel: "#FFFFFF",
        border: "#E6E1D6",
        ochre: {
          DEFAULT: "#B8742A",
          dark: "#96601F",
          light: "#F3E3CE",
        },
        teal: {
          DEFAULT: "#2F6F6B",
          light: "#E1EDEC",
        },
        ink2: "#2B2B26",
        muted: "#6B6558",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
