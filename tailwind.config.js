module.exports = {
  purge: {
    enabled: true,
    content: [
      './views/**/*.ejs',
      './views/*.ejs',
    ],
    options: {
      safelist: ['modal-btn', 'modal-btn-primary']
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#F67036',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
