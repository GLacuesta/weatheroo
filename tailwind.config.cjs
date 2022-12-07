/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    textColor: {
      white: "#FFF",
      black: "#000",
      blackLight: "rgb(51 65 85)",
    },
    extend: {},
  },
  plugins: [],
}
