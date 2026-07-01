module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        glass: 'rgba(255,255,255,0.06)'
      }
    },
  },
  plugins: [],
};
