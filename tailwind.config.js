/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx}",
    "./src/**/*.{js,jsx}",  // All files in src directory
    "./screens/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/screens/**/*.{js,jsx}",
    "./src/layout/**/*.{js,jsx}",
    "./src/forms/**/*.{js,jsx}",
    "./src/maps/**/*.{js,jsx}",
    "./src/navigation/**/*.{js,jsx}",
    "./src/services/**/*.{js,jsx}",
    "./src/store/**/*.{js,jsx}",
    "./src/theme/**/*.{js,jsx}",
    "./src/utils/**/*.{js,jsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}