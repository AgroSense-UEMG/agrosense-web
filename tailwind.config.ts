/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E8F5E9',
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
        },
        agrossense: {
          accent: '#C8E6C9',
          error: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}