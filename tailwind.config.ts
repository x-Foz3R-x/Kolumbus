import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
// @ts-expect-error - TailwindCSS is not typed, works normally
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
        inconsolata: "var(--font-inconsolata)",
        belanosima: "var(--font-belanosima)",
      },
      colors: {
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
        gray: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
      animation: {
        popUp: "popUp 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        slideIn: "slideIn 250ms ease",
        levitate: "levitate 10s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "caret-blink": "caretBlink 1.2s ease-in-out infinite",
      },
      keyframes: {
        popUp: {
          "0%": { scale: "0", opacity: "0" },
          "100%": { scale: "1", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        levitate: {
          "0%": { translate: "0" },
          "30%": { translate: "0 -0.625rem" },
          "50%": { translate: "0 0.5rem" },
          "70%": { translate: "0 -0.75rem" },
          "100%": { translate: "0" },
        },
        pulse: {
          "0%": { opacity: "1" },
          "50%": { opacity: ".75" },
          "100%": { opacity: "1" },
        },
        caretBlink: {
          "0%,60%,100%": { opacity: "1" },
          "20%,40%": { opacity: "0" },
        },
      },
      transitionDuration: { 250: "250ms", 400: "400ms" },
      transitionTimingFunction: {
        "kolumb-overflow": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "kolumb-flow": "cubic-bezier(0.175, 0.885, 0.32, 1)",
        "kolumb-out": "cubic-bezier(0.885, 0.175, 0.5, 1)",
      },
      boxShadow: {
        border: "0 0 0 1px hsl(232, 9%, 90%)",
        borderError: "0 0 0 1px hsla(354, 90%, 60%)",
        focus: "0 0 0 1px hsla(210, 78%, 60%), 0 0 0 3px hsla(210, 78%, 60%, 0.3)",
        focusError: "0 0 0 1px hsla(354, 90%, 60%), 0 0 0 3px hsla(354, 90%, 60%, 0.3)",
        soft: "0px 1px 4px rgba(0, 0, 0, 0.1)",
        softSm: "0px 1px 2px rgba(0, 0, 0, 0.1)",

        smoothBorder: "0 0 2px rgba(0,0,0,0.2), 0 -1px 0 rgba(0,0,0,0.02)",
        smoothBorderBottom: "0 2px 4px rgba(0,0,0,0.15)",
        floating: "0 2px 4px rgba(0,0,0,0.15), 0 -1px 0 rgba(0,0,0,0.02)",
        floatingHover:
          "0 2px 4px rgba(0,0,0,0.05), 0 2px 10px rgba(0,0,0,0.15), 0 -1px 0 rgba(0,0,0,0.02)",

        button:
          "0 0px 3px rgba(0,0,0,0.05), 0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.01), 0 5px 6px rgba(0,0,0,0.01), 0 6px 8px rgba(0,0,0,0.01)",

        xs: "0 1px 2px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.01), 0 2px 3px rgba(0,0,0,0.01)",
        md: "0 0 5px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 12px 12px rgba(0,0,0,0.01)",
        lg: "0 0 5px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 12px 12px rgba(0,0,0,0.01)",
        xl: "0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02)",

        borderXS:
          "0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.01), 0 2px 3px rgba(0,0,0,0.01)",
        borderXL:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02)",

        borderSplashXl:
          "0 0 0 1px hsla(232, 9%, 90%, 0.4), 0 0 5px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 16px 16px rgba(0,0,0,0.03), 0 24px 24px rgba(0,0,0,0.02), 4px 0 4px rgba(0,0,0,0.02), 8px 0 8px rgba(0,0,0,0.02), -4px 0 4px rgba(0,0,0,0.02), -8px 0 8px rgba(0,0,0,0.02)",

        kolumblueInset:
          "inset 0 0px 5px rgba(0,0,0,.02), inset 0 1px 1px hsla(210, 78%, 75%, 0.1), inset 0 1px 2px rgba(0,0,0,.02), inset 0 2px 4px rgba(0,0,0,.02), inset 0 3px 6px rgba(0,0,0,.02), inset 0 4px 8px hsla(210, 78%, 90%, 0.1)",
        kolumblueSelected:
          "0px 0px 0px 1px hsla(210, 78%, 84%, 0.3), 0px 2px 4px rgba(0,0,0,.06), 0px 5px 10px rgba(0,0,0,.03)",
        kolumblueHover:
          "0px 0px 0px 1px hsla(210, 78%, 90%, 0.3), 0px 2px 4px rgba(0,0,0,.06), 0px 5px 10px rgba(0,0,0,.03)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${value}'%3e%3cpath d='M0 .5h31.5V32'/%3e%3c/svg%3e")`,
          }),
          "bg-grid-small": (value) => ({
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='8' height='8' fill='none' stroke='${value}'%3e%3cpath d='M0 .5h31.5V32'/%3e%3c/svg%3e")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3e%3ccircle cx='10' cy='10' r='1.62574' fill='${value}'/%3e%3c/svg%3e")`,
          }),
          "bg-stripe": (value) => ({
            backgroundImage: `repeating-linear-gradient(0deg, ${value}, ${value} 1px, transparent 1px, transparent 5px)`,
          }),
          "bg-stripe-30": (value) => ({
            backgroundImage: `repeating-linear-gradient(30deg, ${value}, ${value} 1px, transparent 1px, transparent 5px)`,
          }),
          "bg-stripe-45": (value) => ({
            backgroundImage: `repeating-linear-gradient(45deg, ${value}, ${value} 1px, transparent 1px, transparent 5px)`,
          }),
          "bg-stripe-60": (value) => ({
            backgroundImage: `repeating-linear-gradient(60deg, ${value}, ${value} 1px, transparent 1px, transparent 5px)`,
          }),
          "bg-stripe-90": (value) => ({
            backgroundImage: `repeating-linear-gradient(90deg, ${value}, ${value} 1px, transparent 1px, transparent 5px)`,
          }),
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" },
      );
    }),
  ],
} satisfies Config;
