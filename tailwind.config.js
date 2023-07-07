/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gordita: "var(--font-gordita)",
        adso: "var(--font-adso)",
        inter: "var(--font-inter)",
        inconsolata: "var(--font-inconsolata)",
      },
      animation: {
        horizontalScaleIn:
          "horizontalScaleIn 300ms cubic-bezier(0.175, 0.885, 0.32, 1)",
      },
      keyframes: {
        horizontalScaleIn: {
          "0%": { transform: "scale(0, 1)" },
          "100%": { transform: "scale(1, 1)" },
        },
      },
      transitionTimingFunction: {
        "kolumb-overflow": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "kolumb-flow": "cubic-bezier(0.175, 0.885, 0.32, 1)",
        "kolumb-leave": "cubic-bezier(0.885, 0.175, 0.5, 1)",
      },
      boxShadow: {
        default:
          "0px 0px 0px 1px rgba(15,15,15,.03), 0px 2px 4px rgba(15,15,15,.1), 0px 5px 10px rgba(15,15,15,.05)",
        kolumblue:
          "0 1px 2px 1px hsla(210, 78%, 90%, 0.1), 0 2px 4px 0 rgba(15,15,15,.06)",
        kolumblueInset:
          "inset 0 1px 2px 1px hsla(210, 78%, 90%, 0.1),inset 0 2px 4px 0 rgba(15,15,15,.06)",
        kolumblueSelected:
          "0px 0px 0px 1px hsla(210, 78%, 84%, 0.3), 0px 2px 4px rgba(15,15,15,.06), 0px 5px 10px rgba(15,15,15,.03)",
        kolumblueHover:
          "0px 0px 0px 1px hsla(210, 78%, 90%, 0.3), 0px 2px 4px rgba(15,15,15,.06), 0px 5px 10px rgba(15,15,15,.03)",
        soft: "0px 1px 2px rgba(15, 15, 15, 0.05)",
        focus: "0 0 0 1px hsla(210, 78%, 50%, 0.3)",
        button:
          "0px 0px 0px 1px rgba(15,15,15,.02), 0px 2px 4px rgba(15,15,15,.1), 0px 5px 10px rgba(15,15,15,.05)",
        modal:
          "0 0px 1px rgba(15,15,15,0.05),0 1px 1px rgba(15,15,15,0.05), 0 2px 2px rgba(15,15,15,0.05), 0 4px 4px rgba(15,15,15,0.05), 0 8px 8px rgba(15,15,15,0.05), 0 16px 16px rgba(15,15,15,0.05), 0 24px 24px rgba(15,15,15,0.03)",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      kolumblue: {
        50: "hsl(210, 78%, 98%)",
        100: "hsl(210, 78%, 94%)",
        200: "hsl(210, 78%, 90%)",
        300: "hsl(210, 78%, 84%)",
        400: "hsl(210, 78%, 71%)",
        500: "hsl(210, 78%, 60%)",
        600: "hsl(210, 78%, 46%)",
        700: "hsl(210, 78%, 34%)",
        800: "hsl(210, 78%, 27%)",
        900: "hsl(210, 78%, 17%)",
        950: "hsl(210, 78%, 11%)",
      },
      kolumbGray: {
        50: "hsl(232, 9%, 98%)",
        100: "hsl(232, 9%, 94%)",
        200: "hsl(232, 9%, 90%)",
        300: "hsl(232, 9%, 84%)",
        400: "hsl(232, 9%, 71%)",
        500: "hsl(232, 9%, 60%)",
        600: "hsl(232, 9%, 46%)",
        700: "hsl(232, 9%, 34%)",
        800: "hsl(232, 9%, 27%)",
        900: "hsl(232, 9%, 17%)",
        950: "hsl(232, 9%, 11%)",
      },
      tintedGray: {
        50: "hsl(48, 6%, 98%)",
        100: "hsl(48, 6%, 94%)",
        200: "hsl(48, 6%, 90%)",
        300: "hsl(48, 6%, 84%)",
        400: "hsl(48, 6%, 71%)",
        500: "hsl(48, 6%, 67%)",
        600: "hsl(48, 6%, 46%)",
        700: "hsl(48, 6%, 34%)",
        800: "hsl(48, 6%, 27%)",
        900: "hsl(48, 6%, 17%)",
        950: "hsl(48, 6%, 11%)",
      },
      red: {
        50: "hsl(354, 91%, 98%)",
        100: "hsl(354, 91%, 94%)",
        200: "hsl(354, 91%, 90%)",
        300: "hsl(354, 91%, 84%)",
        400: "hsl(354, 91%, 71%)",
        500: "hsl(354, 91%, 60%)",
        600: "hsl(354, 91%, 46%)",
        700: "hsl(354, 91%, 34%)",
        800: "hsl(354, 91%, 27%)",
        900: "hsl(354, 91%, 17%)",
        950: "hsl(354, 91%, 11%)",
      },
      yellow: {
        50: "hsl(41, 88%, 98%)",
        100: "hsl(41, 88%, 94%)",
        200: "hsl(41, 88%, 90%)",
        300: "hsl(41, 88%, 84%)",
        400: "hsl(41, 88%, 71%)",
        500: "hsl(41, 88%, 60%)",
        600: "hsl(41, 88%, 46%)",
        700: "hsl(41, 88%, 34%)",
        800: "hsl(41, 88%, 27%)",
        900: "hsl(41, 88%, 17%)",
        950: "hsl(41, 88%, 11%)",
      },
      green: {
        50: "hsl(120, 78%, 98%)",
        100: "hsl(120, 78%, 94%)",
        200: "hsl(120, 78%, 90%)",
        300: "hsl(120, 78%, 84%)",
        400: "hsl(120, 78%, 71%)",
        500: "hsl(120, 78%, 60%)",
        600: "hsl(120, 78%, 46%)",
        700: "hsl(120, 78%, 34%)",
        800: "hsl(120, 78%, 27%)",
        900: "hsl(120, 78%, 17%)",
        950: "hsl(120, 78%, 11%)",
      },
    },
  },
  plugins: [],
  darkMode: "darkMode",
};
