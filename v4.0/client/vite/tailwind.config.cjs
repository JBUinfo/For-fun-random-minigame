/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "change-background": {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "100% 50%" },
        },
      },
      animation: {
        "change-background": "change-background 0.5s ease forwards",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [],
};
