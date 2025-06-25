const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#102542",
        primaryOrange: "#f87060",
        primaryGrey: "#cdd7d6",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },
      objectPosition: {
        "center-top": "center top",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
