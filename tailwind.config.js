/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
        gordita: "var(--font-gordita)",
        adso: "var(--font-adso)",
        inconsolata: "var(--font-inconsolata)",
      },
      animation: {
        popUp: "popUp 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        appear: "appear 700ms cubic-bezier(0.175, 0.75, 0.32, 1)",
        slideIn: "slideIn 400ms cubic-bezier(0.175, 0.75, 0.32, 1)",
        fadeIn: "fadeIn 400ms ease",
      },
      keyframes: {
        popUp: {
          "0%": { scale: 0, opacity: 0 },
          "100%": { scale: 1, opacity: 1 },
        },
        appear: {
          "0%": {
            opacity: "0",
            transform: "translateY(5rem)",
            transformOrigin: "bottom",
          },
          "50%": {
            opacity: "0.6",
            transform: "matrix(1.02,0.02,0.08,1.00,0,0)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            transformOrigin: "bottom",
          },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      transitionTimingFunction: {
        "kolumb-overflow": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "kolumb-flow": "cubic-bezier(0.175, 0.885, 0.32, 1)",
        "kolumb-out": "cubic-bezier(0.885, 0.175, 0.5, 1)",
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },
      width: {
        4.5: "1.125rem",
      },
      height: {
        4.5: "1.125rem",
      },
      padding: {
        4.5: "1.125rem",
      },
    },
    boxShadow: {
      none: "0 0 #000000",
      border: "0 0 0 1px hsl(232, 9%, 90%)",
      borderDark: "0 0 0 1px hsl(232, 9%, 34%)",
      borderError: "0 0 0 1px hsla(354, 90%, 60%)",
      focus: "0 0 0 1px hsla(210, 78%, 60%), 0 0 0 3px hsla(210, 78%, 60%, 0.3)",
      focusError: "0 0 0 1px hsla(354, 90%, 60%), 0 0 0 3px hsla(354, 90%, 60%, 0.3)",
      soft: "0px 1px 4px rgba(15, 15, 15, 0.1)",
      softSm: "0px 1px 2px rgba(15, 15, 15, 0.1)",

      button: "0px 0px 0px 1px rgba(15,15,15,0.05), 0px 2px 4px rgba(15,15,15,0.1), 0px 5px 10px rgba(15,15,15,0.05)",
      select:
        "0 0px 3px rgba(15,15,15,0.05), 0 1px 1px rgba(15,15,15,0.02), 0 2px 2px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.01), 0 5px 6px rgba(15,15,15,0.01), 0 6px 8px rgba(15,15,15,0.01)",

      xs: "0 1px 2px rgba(15,15,15,0.02), 0 2px 2px rgba(15,15,15,0.01), 0 2px 3px rgba(15,15,15,0.01)",
      sm: "0 2px 2px rgba(15,15,15,0.02), 0 3px 3px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.02)",
      smI: "0 -2px 2px rgba(15,15,15,0.01), 0 -3px 3px rgba(15,15,15,0.02), 0 -4px 4px rgba(15,15,15,0.01)",
      md: "0 0 5px rgba(15,15,15,0.05), 0 2px 2px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.02), 0 8px 8px rgba(15,15,15,0.02), 0 12px 12px rgba(15,15,15,0.01)",
      lg: "0 0 5px rgba(15,15,15,0.05), 0 2px 2px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.02), 0 8px 8px rgba(15,15,15,0.02), 0 12px 12px rgba(15,15,15,0.01)",
      xl: "0 0 5px rgba(15,15,15,0.02), 0 2px 2px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.02), 0 8px 8px rgba(15,15,15,0.02), 0 16px 16px rgba(15,15,15,0.02)",
      "2xl":
        "0 0 5px rgba(15,15,15,0.05), 0 2px 2px rgba(15,15,15,0.03), 0 4px 4px rgba(15,15,15,0.03), 0 8px 8px rgba(15,15,15,0.03), 0 12px 12px rgba(15,15,15,0.03), 0 16px 16px rgba(15,15,15,0.03)",
      "3xl":
        "0 0 5px rgba(15,15,15,0.1), 0 2px 2px rgba(15,15,15,0.03), 0 4px 4px rgba(15,15,15,0.03), 0 8px 8px rgba(15,15,15,0.03), 0 12px 12px rgba(15,15,15,0.03), 0 16px 16px rgba(15,15,15,0.05), 0 20px 20px rgba(15,15,15,0.03), 0 24px 24px rgba(15,15,15,0.02)",

      splashXL:
        "0 0 5px rgba(15,15,15,0.03), 0 4px 4px rgba(15,15,15,0.03), 0 8px 8px rgba(15,15,15,0.03), 0 16px 16px rgba(15,15,15,0.03), 0 24px 24px rgba(15,15,15,0.02), 4px 0 4px rgba(15,15,15,0.02), 8px 0 8px rgba(15,15,15,0.02), -4px 0 4px rgba(15,15,15,0.02), -8px 0 8px rgba(15,15,15,0.02)",

      borderXS: "0 0 0 1px rgba(15,15,15,0.1), 0 1px 2px rgba(15,15,15,0.02), 0 2px 2px rgba(15,15,15,0.01), 0 2px 3px rgba(15,15,15,0.01)",
      borderXL:
        "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(15,15,15,0.02), 0 2px 2px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.02), 0 8px 8px rgba(15,15,15,0.02), 0 16px 16px rgba(15,15,15,0.02)",
      border2XL:
        "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(15,15,15,0.03), 0 2px 2px rgba(15,15,15,0.03), 0 4px 4px rgba(15,15,15,0.03), 0 8px 8px rgba(15,15,15,0.03), 0 12px 12px rgba(15,15,15,0.03), 0 16px 16px rgba(15,15,15,0.03)",
      border3XL:
        "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(15,15,15,0.1), 0 2px 2px rgba(15,15,15,0.05), 0 4px 4px rgba(15,15,15,0.05), 0 8px 8px rgba(15,15,15,0.05), 0 12px 12px rgba(15,15,15,0.05), 0 16px 16px rgba(15,15,15,0.05), 0 20px 20px rgba(15,15,15,0.05), 0 24px 24px rgba(15,15,15,0.05)",

      borderXLDark:
        "0 0 0 1px hsl(232, 9%, 34%), 0 0 5px rgba(15,15,15,0.02), 0 2px 2px rgba(15,15,15,0.02), 0 4px 4px rgba(15,15,15,0.02), 0 8px 8px rgba(15,15,15,0.02), 0 16px 16px rgba(15,15,15,0.02)",
      border2XLDark:
        "0 0 0 1px hsl(232, 9%, 34%), 0 0 5px rgba(15,15,15,0.03), 0 2px 2px rgba(15,15,15,0.03), 0 4px 4px rgba(15,15,15,0.03), 0 8px 8px rgba(15,15,15,0.03), 0 12px 12px rgba(15,15,15,0.03), 0 16px 16px rgba(15,15,15,0.03)",
      border3XLDark:
        "0 0 0 1px hsl(232, 9%, 34%), 0 0 5px rgba(15,15,15,0.1), 0 2px 2px rgba(15,15,15,0.05), 0 4px 4px rgba(15,15,15,0.05), 0 8px 8px rgba(15,15,15,0.05), 0 12px 12px rgba(15,15,15,0.05), 0 16px 16px rgba(15,15,15,0.05), 0 20px 20px rgba(15,15,15,0.05), 0 24px 24px rgba(15,15,15,0.05)",

      borderSplashXl:
        "0 0 0 1px hsla(232, 9%, 90%, 0.4), 0 0 5px rgba(15,15,15,0.03), 0 4px 4px rgba(15,15,15,0.03), 0 8px 8px rgba(15,15,15,0.03), 0 16px 16px rgba(15,15,15,0.03), 0 24px 24px rgba(15,15,15,0.02), 4px 0 4px rgba(15,15,15,0.02), 8px 0 8px rgba(15,15,15,0.02), -4px 0 4px rgba(15,15,15,0.02), -8px 0 8px rgba(15,15,15,0.02)",

      insetSm:
        "inset 0 0px 5px rgba(15,15,15,.02), inset 0 1px 1px rgba(15,15,15,.02), inset 0 1px 2px rgba(15,15,15,.02), inset 0 2px 4px rgba(15,15,15,.02)",
      inset:
        "inset 0 0px 5px rgba(15,15,15,.02), inset 0 1px 1px rgba(15,15,15,.02), inset 0 1px 2px rgba(15,15,15,.02), inset 0 2px 4px rgba(15,15,15,.02), inset 0 3px 6px rgba(15,15,15,.02), inset 0 4px 8px rgba(15,15,15,.02)",

      //
      // TO BE REMOVED
      //
      kolumblue: "0 1px 2px 1px hsla(210, 78%, 90%, 0.1), 0 2px 4px rgba(15,15,15,.06)",
      kolumblueInset:
        "inset 0 0px 5px rgba(15,15,15,.02), inset 0 1px 1px hsla(210, 78%, 75%, 0.1), inset 0 1px 2px rgba(15,15,15,.02), inset 0 2px 4px rgba(15,15,15,.02), inset 0 3px 6px rgba(15,15,15,.02), inset 0 4px 8px hsla(210, 78%, 90%, 0.1)",
      kolumblueSelected: "0px 0px 0px 1px hsla(210, 78%, 84%, 0.3), 0px 2px 4px rgba(15,15,15,.06), 0px 5px 10px rgba(15,15,15,.03)",
      kolumblueHover: "0px 0px 0px 1px hsla(210, 78%, 90%, 0.3), 0px 2px 4px rgba(15,15,15,.06), 0px 5px 10px rgba(15,15,15,.03)",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#ffffff",
      kolumblue: {
        50: "hsl(210, 78%, 98%)",
        100: "hsl(210, 78%, 94%)",
        200: "hsl(210, 78%, 90%)",
        300: "hsl(210, 78%, 84%)",
        400: "hsl(210, 78%, 71%)",
        500: "hsl(210, 78%, 60%)",
        550: "hsl(210, 78%, 54%)",
        600: "hsl(210, 78%, 46%)",
        700: "hsl(210, 78%, 34%)",
        800: "hsl(210, 78%, 27%)",
        900: "hsl(210, 78%, 17%)",
        1000: "hsl(210, 78%, 11%)",
      },
      gray: {
        50: "hsl(232, 9%, 98%)",
        100: "hsl(232, 9%, 94%)",
        200: "hsl(232, 9%, 90%)",
        300: "hsl(232, 9%, 84%)",
        400: "hsl(232, 9%, 71%)",
        500: "hsl(232, 9%, 60%)",
        600: "hsl(232, 9%, 46%)",
        650: "hsl(232, 9%, 40%)",
        700: "hsl(232, 9%, 34%)",
        800: "hsl(232, 9%, 27%)",
        900: "hsl(232, 9%, 17%)",
        1000: "hsl(232, 9%, 11%)",
      },
      tintedGray: {
        50: "hsl(48, 6%, 98%)",
        100: "hsl(48, 6%, 94%)",
        200: "hsl(48, 6%, 90%)",
        300: "hsl(48, 6%, 84%)",
        400: "hsl(48, 6%, 71%)",
        500: "hsl(48, 6%, 60%)",
        600: "hsl(48, 6%, 46%)",
        700: "hsl(48, 6%, 34%)",
        800: "hsl(48, 6%, 27%)",
        900: "hsl(48, 6%, 17%)",
        1000: "hsl(48, 6%, 11%)",
      },
      red: {
        50: "hsl(354, 90%, 98%)",
        100: "hsl(354, 90%, 94%)",
        200: "hsl(354, 90%, 90%)",
        300: "hsl(354, 90%, 84%)",
        400: "hsl(354, 90%, 71%)",
        450: "hsl(354, 90%, 67%)",
        500: "hsl(354, 90%, 60%)",
        600: "hsl(354, 90%, 46%)",
        700: "hsl(354, 90%, 34%)",
        800: "hsl(354, 90%, 27%)",
        900: "hsl(354, 90%, 17%)",
        1000: "hsl(354, 90%, 11%)",
      },
      orange: {
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
        1000: "hsl(41, 88%, 11%)",
      },
      yellow: {
        50: "hsl(59, 96%, 98%)",
        100: "hsl(59, 96%, 94%)",
        200: "hsl(59, 96%, 90%)",
        300: "hsl(59, 96%, 84%)",
        400: "hsl(59, 96%, 71%)",
        500: "hsl(59, 96%, 60%)",
        600: "hsl(59, 96%, 46%)",
        700: "hsl(59, 96%, 34%)",
        800: "hsl(59, 96%, 27%)",
        900: "hsl(59, 96%, 17%)",
        1000: "hsl(59, 96%, 11%)",
      },
      green: {
        50: "hsl(120, 78%, 98%)",
        100: "hsl(120, 78%, 94%)",
        200: "hsl(120, 78%, 90%)",
        300: "hsl(120, 78%, 84%)",
        400: "hsl(120, 78%, 71%)",
        450: "hsl(120, 78%, 67%)",
        500: "hsl(120, 78%, 60%)",
        600: "hsl(120, 78%, 46%)",
        700: "hsl(120, 78%, 34%)",
        800: "hsl(120, 78%, 27%)",
        900: "hsl(120, 78%, 17%)",
        1000: "hsl(120, 78%, 11%)",
      },
    },
  },
  plugins: [],
  experimental: {
    classRegex: [["clsx\\(([^)]*)\\)"], ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]],
  },
};
