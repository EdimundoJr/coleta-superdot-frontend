import type { Config } from "tailwindcss";
const { mauve, violet, red, blackA } = require('@radix-ui/colors');

export default {
    content: ["./src/**/*.{html,ts,tsx}"],
    theme: {
        extend: {
            width: {
                'wrapper': '100%',
            },
            fontFamily: {
                roboto: ['Roboto', 'sans-serif'],
            },
            screens: {
                'xl': '1020px',
                'md': '1019px',
            },
            colors: {
                primary: "#6e56cf",
                "off-white": "#fbfaff",
                'primary-reverse': '#b8cf57',
                "primary-text": "#1B1B1B",
                "alternative-text": "#FFFFFF",
                secondary: "#7d66d9",
                "primary-light": "#B57CFF",
                "neutral-dark": "#737373",
                "neutral-light": "#C9C9C9",
                ...mauve,
                ...violet,
                ...red,
                ...blackA,
                confirm: "#3DD68C",
            },
            backgroundImage: {
                "default-bg": "url('/default-bg.png')",
                'default-bg-mobo': "url('/default-bg-mobo.png')",
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                floatXY: {
                    '0%, 100%': {
                        transform: 'translateX(0px) translateY(0px)',
                    },
                    '50%': {
                        transform: 'translateX(-10px) translateY(-20px)',
                    },


                },
                pulse: {
                    '0%, 100%': { opacity: "1" },
                    '50%': { opacity: "0.5" },
                },
                overlayShow: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
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
                }, slideDown: {
                    from: { height: '0px' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                slideUp: {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0px' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                growWidth: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },
                bounceIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.8)',
                    },
                    '50%': {
                        transform: 'scale(1.05)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)',
                    },
                },

            },

        },
        animation: {
            float: 'float 6s ease-in-out infinite',
            floatXY: 'floatXY 6s ease-in-out infinite',
            'float-delayed': 'float 6s ease-in-out 2s infinite',
            pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            hide: "hide 100ms ease-in",
            slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            swipeOut: "swipeOut 100ms ease-out",
            overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
            slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
            gradient: 'gradient 8s linear infinite',
            'fade-in': 'fadeIn 0.5s ease-out',
            'grow-width': 'growWidth 0.6s ease-in-out',
            'bounce-in': 'bounceIn 0.6s ease-out',
        },
        transitionProperty: {
            'transform': 'transform',
            'all': 'all',
        },
    },

    plugins: [
        function ({ addComponents }) {
            addComponents({
                '.wrapper': {
                    width: '100%',
                    '@screen sm': { width: '100%' },
                    '@screen md': { width: '75%' },
                    '@screen lg': { width: '50%' },
                    '@screen xl': { width: '90%' },
                    "@screen 2xl": { width: '70%' },
                }
            })
        }
    ],
} satisfies Config;
