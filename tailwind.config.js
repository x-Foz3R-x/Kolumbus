/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gordita: "var(--font-gordita)",
        adso: "var(--font-adso)",
        inter: "var(--font-inter)",
      },
      transitionTimingFunction: {
        "kolumb-overflow": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "kolumb-flow": "cubic-bezier(0.175, 0.885, 0.32, 1)",
      },
      boxShadow: {
        kolumbus:
          "rgba(15,15,15,.03) 0px 0px 0px 1px,rgba(15,15,15,.06) 0px 2px 4px,rgba(15,15,15,.03) 0px 5px 10px",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      kolumblue: {
        50: "hsla(210, 78%, 98%, 1)",
        100: "hsla(210, 78%, 94%, 1)",
        200: "hsla(210, 78%, 83%, 1)",
        300: "hsla(210, 78%, 75%, 1)",
        400: "hsla(210, 78%, 68%, 1)",
        500: "hsla(210, 78%, 60%, 1)",
        600: "hsla(210, 78%, 50%, 1)",
        700: "hsla(210, 78%, 40%, 1)",
        800: "hsla(210, 78%, 30%, 1)",
        900: "hsla(210, 78%, 18%, 1)",
        950: "hsla(210, 78%, 10%, 1)",
      },
      tintedGray: {
        50: "hsla(48, 3%, 98%, 1)",
        100: "hsla(48, 3%, 94%, 1)",
        200: "hsla(48, 3%, 90%, 1)",
        300: "hsla(48, 3%, 79%, 1)",
        400: "hsla(48, 3%, 63%, 1)",
        500: "hsla(48, 3%, 53%, 1)",
        600: "hsla(48, 3%, 43%, 1)",
        700: "hsla(48, 3%, 33%, 1)",
        800: "hsla(48, 3%, 23%, 1)",
        900: "hsla(48, 3%, 16%, 1)",
        950: "hsla(48, 3%, 10%, 1)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
