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
    extend: {
      colors: {
        prime: '#F67036',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
