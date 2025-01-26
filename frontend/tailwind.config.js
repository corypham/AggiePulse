/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./frontend/**/*.{js,jsx,ts,tsx}",  // All files in app directory
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./frontend/components/**/*.{js,jsx,ts,tsx}",
    "./frontend/screens/**/*.{js,jsx,ts,tsx}",
    "./frontend/layout/**/*.{js,jsx,ts,tsx}",
    "./frontend/forms/**/*.{js,jsx,ts,tsx}",
    "./frontend/maps/**/*.{js,jsx,ts,tsx}",
    "./frontend/navigation/**/*.{js,jsx,ts,tsx}",
    "./frontend/services/**/*.{js,jsx,ts,tsx}",
    "./frontend/store/**/*.{js,jsx,ts,tsx}",
    "./frontend/theme/**/*.{js,jsx,ts,tsx}",
    "./frontend/utils/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
          primary: "#007aff",
          secondary: "#5856d6",
          background: "#ffffff",
          textPrimary: "#000000",
          textSecondary: "#8e8e93",
      },
      fontFamily: {
        'aileron': ['Aileron-Regular'],
        'aileron-bold': ['Aileron-Bold'],
        'aileron-light': ['Aileron-Light'],
        'aileron-italic': ['Aileron-Italic'],
        'aileron-semibold': ['Aileron-SemiBold'],
      },
      fontSize: {
        sm: "0.875rem", // 14px
        base: "1rem",   // 16px
        lg: "1.25rem",  // 20px
        xl: "1.5rem",   // 24px
        "2xl": "2rem",  // 32px
      },
    },
  },
  plugins: [],
}