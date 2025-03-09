/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel colors as specified in requirements
        'brand-pink': {
          100: '#FFE5F0',
          200: '#FFB6D9',
          300: '#FF88C2',
          400: '#FF5AAB',
          500: '#FF2C94',
          600: '#E60077',
        },
        'brand-mint': {
          100: '#DFFFEF',
          200: '#B0FFD9',
          300: '#81FFC3',
          400: '#52FFAD',
          500: '#24FF97',
          600: '#00E676',
        },
        'brand-lavender': {
          100: '#EFE5FF',
          200: '#D6BDFF',
          300: '#BD95FF',
          400: '#A56DFF',
          500: '#8C45FF',
          600: '#6A1DE0',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        comic: ['Comic Neue', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('tailwindcss-gradients'),
  ],
}; 