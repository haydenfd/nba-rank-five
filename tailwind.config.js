const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
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
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
