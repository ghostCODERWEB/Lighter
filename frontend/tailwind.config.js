/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Inter",
                    "system-ui",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "SF Pro Text",
                    "Segoe UI",
                    "sans-serif",
                ],
                mono: [
                    "JetBrains Mono",
                    "SFMono-Regular",
                    "Menlo",
                    "Monaco",
                    "Consolas",
                    "Liberation Mono",
                    "Courier New",
                    "monospace",
                ],
            },
            container: {
                center: true,
                padding: "1rem",
                screens: {
                    lg: "1200px",
                },
            },
        },
    },
    plugins: [],
};
