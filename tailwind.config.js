/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
   presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#01e81cff", // Blue
        secondary: "#F59E0B", // Yellow
        accent: "#10B981", // Green
        background: "#F3F4F6", // Light Gray
        text: "#111827", // Dark Gray
        border: "#D1D5DB", // Gray
        card: "#FFFFFF", // White
        danger: "#EF4444", // Red
        success: "#10B981", // Green
        warning: "#F59E0B", // Yellow
        info: "#3B82F6", // Blue
      },
    },
  },
  plugins: [],
}

