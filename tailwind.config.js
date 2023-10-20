const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false,
  theme: {
    extend: {
      screens: {
        'mobile': '480px',
      },
      colors: {
        navy: {
          '50': '#f5f7fa',
          '100': '#ebeff4',
          '150': "#CDDCF8",
          '200': '#d0dce7',
          '300': '#a8bed1',
          '400': '#7a9cb8',
          '500': '#587e9d',
          '600': '#436584',
          '700': '#37526c',
          '800': '#2d455c',
          '900': '#255E93',
          '950': '#192e47', //bg and txt color
          '1000': '#1d2a3a',
        },
        graybrown: '#7C7370',
        black: {
          DEFAULT: colors.black,
          50: "#373737",
        },
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
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