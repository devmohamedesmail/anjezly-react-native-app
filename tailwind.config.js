/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#01e81cff", // Blue
        secondary: "#F59E0B", // Yellow
        accent: "#10B981", // Green
        
        // Light mode colors
        background: "#F3F4F6", // Light Gray
        text: "#111827", // Dark Gray
        border: "#D1D5DB", // Gray
        card: "#FFFFFF", // White
        
        // Dark mode colors
        'dark-background': "#111827", // Dark Gray
        'dark-text': "#F9FAFB", // Light Gray
        'dark-border': "#374151", // Dark Border
        'dark-card': "#1F2937", // Dark Card
        
        // Status colors (same for both modes)
        danger: "#EF4444", // Red
        success: "#10B981", // Green
        warning: "#F59E0B", // Yellow
        info: "#3B82F6", // Blue
      },
    },
  },
  plugins: [],
}

