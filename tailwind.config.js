/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'mvc-pattern': "url('./src/assets/mvcimage.png')",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      colors: {
        'burnt-orange': {
          50: '#fff3e5',
          100: '#ffe1cc',
          500: '#cc5500',  // Main burnt orange
          600: '#b84c00',
          700: '#a34300',
        },
        'brand-green': {
          50: '#e6f0eb',
          100: '#cce0d6',
          500: '#006400',  // Main dark green
          600: '#005a00',
          700: '#004f00',
        }
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

