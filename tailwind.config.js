/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        wave: 'wave 1.2s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { height: '1rem' },
          '50%': { height: '1.5rem' },
        },
      },
    },
  },
  plugins: [],
}
