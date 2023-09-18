const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        navy: '#192E47',
        graybrown: '#7C7370'

      },
      fontFamily: {
        mono: ["Consolas"],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    }
  },
  variants: {
    extend: {
    },
  },
  plugins: [
    
  ]
};