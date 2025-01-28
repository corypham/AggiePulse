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
          selected: "#0038FF",
          unselected: "#848484",
          primary: "#0038FF",
          secondary: "#919191",
          background: "#e1eef4",
          textPrimary: "#000000",
          textSecondary: "#8e8e93",
          closed: "#FF0000",
          open: "#338456",
      },
      fontFamily: {
        'aileron-black': ['Aileron-Black'],
        'aileron-black-italic': ['Aileron-BlackItalic'],
        'aileron-bold': ['Aileron-Bold'],
        'aileron-bold-italic': ['Aileron-BoldItalic'],
        'aileron-heavy': ['Aileron-Heavy'],
        'aileron-heavy-italic': ['Aileron-HeavyItalic'],
        'aileron-italic': ['Aileron-Italic'],
        'aileron-light': ['Aileron-Light'],
        'aileron-light-italic': ['Aileron-LightItalic'],
        'aileron': ['Aileron-Regular'],
        'aileron-semibold': ['Aileron-SemiBold'],
        'aileron-semibold-italic': ['Aileron-SemiBoldItalic'],
        'aileron-thin': ['Aileron-Thin'],
        'aileron-thin-italic': ['Aileron-ThinItalic'],
        'aileron-ultra-light': ['Aileron-UltraLight'],
        'aileron-ultra-light-italic': ['Aileron-UltraLightItalic'],
      },
      fontSize: {
        sm: "0.875rem",  // 14px
        base: "1rem",    // 16px
        lg: "1.125rem",  // 18px
        xl: "1.25rem",   // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
      },
      spacing: {
        0: "0px",
        1: "0.25rem", // 4px
        2: "0.5rem",  // 8px
        4: "1rem",    // 16px
        8: "2rem",    // 32px
        16: "4rem",   // 64px
      },
    },
  },
  plugins: [],
}