/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgMain: "#1E2A5E",
        bgSec: "#55679C",
        textCol: "#E1D7B7",
      },
    },
  },
  plugins: [],
};
