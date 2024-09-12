/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(1, 12, 31)',
      },
      gridTemplateRows: {
        editor: '0.9fr 0.1fr',
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0%' },
          '70%': { width: '100%' },
          '100%': { width: '0%' },
        },
        blink: {
          '0%, 100%': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'black' },
        },
        typing: {
          '0%': { content: '"this is one"' },
          '50%': { content: '"this is one"' },
          '100%': { content: '"this is two"' },
        },
      },
      animation: {
        typewriter:
          'typewriter 4s steps(20) 1s infinite both, blink 1s infinite',
        retyping: 'typing 8s steps(20) infinite normal, blink 1s infinite',
      },
    },
  },
  plugins: [],
}
