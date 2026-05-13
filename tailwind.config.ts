import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          500: '#1D9E75',
          700: '#0F6E56',
          900: '#04342C',
        },
        sidebar: {
          dark: '#2d848a', // Custom dark teal based on the image
          active: '#ffffff',
          hover: '#246b70',
        },
        chat: {
          bubbleRight: '#00a8cc', // Cyan-like color for right bubbles
          bubbleLeft: '#ffffff',
          bg: '#8ba6b6', // Chat background gradient approximate start
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
