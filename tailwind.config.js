module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],

}