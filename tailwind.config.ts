import type { Config } from "tailwindcss";
import { blackA, violet, mauve } from "@radix-ui/colors";
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: { colors: { ...blackA, ...violet, ...mauve } },
  },
  plugins: [],
} satisfies Config;
