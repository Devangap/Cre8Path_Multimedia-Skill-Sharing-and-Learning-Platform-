/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ Correct path
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),      // ✅ Better forms (inputs, buttons)
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide') , // ✅ Beautiful text formatting (headings, paragraphs)
  ],
}