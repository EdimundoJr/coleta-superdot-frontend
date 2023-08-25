import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#5300B8",
                "primary-text": "#1B1B1B",
                "alternative-text": "#FFFFFF",
                secondary: "#A256FF",
                "primary-light": "#B57CFF",
                "neutral-dark": "#737373",
                "neutral-light": "#C9C9C9",
            },
            backgroundImage: {
                "default-bg": "url('/default-bg.png')",
            },
            keyframes: {
                overlayShow: {
                    from: { opacity: "0" },
                    to: { opacity: ".8" },
                },
                contentShow: {
                    from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
                    to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
                },
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
                overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            },
        },
    },
    plugins: [],
} satisfies Config;
