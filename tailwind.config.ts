import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,ts,tsx}"],
    theme: {
        extend: {
            colors: { primary: "#7C2AE8", primaryLight: "#B57CFF", neutralDark: "#737373", neutralLight: "#C9C9C9" },
            keyframes: {
                hide: {
                    from: { opacity: "1" },
                    to: { opacity: "0" },
                },
                slideIn: {
                    from: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
                    to: { transform: "translateX(0)" },
                },
                swipeOut: {
                    from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
                    to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
                },
            },
            animation: {
                hide: "hide 100ms ease-in",
                slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                swipeOut: "swipeOut 100ms ease-out",
            },
        },
    },
    plugins: [],
} satisfies Config;
