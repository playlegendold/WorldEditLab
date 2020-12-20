module.exports = {
  purge: {
    enabled: true,
    content: [
      './views/**/*.ejs',
      './views/*.ejs',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
