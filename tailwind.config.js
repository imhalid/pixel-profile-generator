/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
      },
      colors: {
        void: 'var(--void)',
        stone: {
          900: 'var(--stone-900)',
          800: 'var(--stone-800)',
          700: 'var(--stone-700)',
          600: 'var(--stone-600)',
          500: 'var(--stone-500)',
        },
        parchment: 'var(--parchment)',
        dim: 'var(--dim)',
        torch: 'var(--torch)',
        ember: 'var(--ember)',
        moss: 'var(--moss)',
        blood: 'var(--blood)',
        mana: 'var(--mana)',
      },
    },
  },
  plugins: [],
};
