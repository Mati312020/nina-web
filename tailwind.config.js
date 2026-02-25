/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#009688",
                secondary: "#FF7F50",
                background: "#F9FAFB",
                text: "#374151",
                success: "#10B981",
                danger: "#EF4444",
                muted: "#F3F4F6",
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                nunito: ["Nunito", "sans-serif"],
                comfortaa: ["Comfortaa", "cursive"],
            },
            borderRadius: {
                button: "12px",
                card: "16px",
            },
        },
    },
    plugins: [],
}
