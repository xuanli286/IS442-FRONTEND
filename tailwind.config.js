const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        navy: {
          '50': '#f5f7fa',
          '100': '#ebeff4',
          '200': '#d0dce7',
          '300': '#a8bed1',
          '400': '#7a9cb8',
          '500': '#587e9d',
          '600': '#436584',
          '700': '#37526c',
          '800': '#2d455c',
          '900': '#192e47',
          '950': '#192e47', //bg and txt color
          '1000': '#1d2a3a',
        },
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