/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx}",
    "./frontend/**/*.{js,jsx}",  // All files in app directory
    "./screens/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./frontend/components/**/*.{js,jsx}",
    "./frontend/screens/**/*.{js,jsx}",
    "./frontend/layout/**/*.{js,jsx}",
    "./frontend/forms/**/*.{js,jsx}",
    "./frontend/maps/**/*.{js,jsx}",
    "./frontend/navigation/**/*.{js,jsx}",
    "./frontend/services/**/*.{js,jsx}",
    "./frontend/store/**/*.{js,jsx}",
    "./frontend/theme/**/*.{js,jsx}",
    "./frontend/utils/**/*.{js,jsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}