import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
        inconsolata: "var(--font-inconsolata)",
        belanosima: "var(--font-belanosima)",
      },
    },
  },
  plugins: [],
} satisfies Config;
