module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C0027', // TCU Purple
          light: '#6A0136',
          dark: '#35001C',
        },
        secondary: {
          DEFAULT: '#E6B325', // TCU Gold
          light: '#F7C337',
          dark: '#D4A010',
        }
      },
    },
  },
  plugins: [],
} 