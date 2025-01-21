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
    extend: {},
  },
  plugins: [],
}