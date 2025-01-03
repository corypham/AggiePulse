/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx}",
    "./app/**/*.{js,jsx}",  // All files in app directory
    "./screens/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/components/**/*.{js,jsx}",
    "./app/screens/**/*.{js,jsx}",
    "./app/layout/**/*.{js,jsx}",
    "./app/forms/**/*.{js,jsx}",
    "./app/maps/**/*.{js,jsx}",
    "./app/navigation/**/*.{js,jsx}",
    "./app/services/**/*.{js,jsx}",
    "./app/store/**/*.{js,jsx}",
    "./app/theme/**/*.{js,jsx}",
    "./app/utils/**/*.{js,jsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}