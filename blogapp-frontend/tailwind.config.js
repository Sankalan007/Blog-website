/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        handdrawn: "'Delicious Handrawn', cursive",
        merriweather: "'Merriweather', serif",
        maven: "'Maven Pro', sans-serif",
        yanone: "'Yanone Kaffeesatz', sans-serif",
        cormorant: "'Cormorant Garamond', serif",
      },
    },
  },
  plugins: [],
};
