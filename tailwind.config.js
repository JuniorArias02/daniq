/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update the content array to include your project paths
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./core/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D1117',
          card: '#161B22',
          border: '#30363D',
        },
        brand: {
          DEFAULT: '#22C55E', // verde accent
        }
      }
    },
  },
  plugins: [],
}
