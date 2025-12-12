/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#10b981', // emerald-500
        'primary-blue': '#3b82f6', // blue-500
        'primary-orange': '#f97316', // orange-500
        'eco-dark': '#065f46', // emerald-800
        'eco-light': '#d1fae5', // emerald-100
      },
    },
  },
  plugins: [],
}
