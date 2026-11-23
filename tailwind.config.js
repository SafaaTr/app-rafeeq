const { colors } = require("./src/constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        "primary-dark": colors.primaryDark,
        secondary: colors.secondary,
        "bg-main": colors.bgMain,
        "text-main": colors.textMain,
        "text-muted": colors.textMuted,
      },
    },
  },
  plugins: [],
};