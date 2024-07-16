/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          950: '#0077FF',
        },
        gray: {
          55: '#D9D9D9'
        }
      }
    },
  },
  plugins: [],
}

