// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDFF',
          100: '#CFFAFE',
          // Updated 500 to the specific hex you requested for main buttons
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        secondary: {
          500: '#4AC389',
        },
        midnight: '#0A0637', // Existing Dark Section Background
        slate: {
          900: '#111827', // Large Headings
          800: '#1F2937', // Logo text ("Little" part)
          700: '#374151', // Added for nav links and paragraphs
          600: '#4B5563', // Small text/badges
          300: '#D1D5DB',
          200: '#E5E7EB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAF9',
        },

        // --- NEW ADDITIONS BASED ON YOUR DESIGN ---

        // Logo specific colors
        logo: {
          sparks: '#06C5D4', // Bright Cyan for "Sparks"
        },
        // Sidebar specific colors
        sidebar: {
          bg: '#E4F7F7', // Light cyan background
          activeText: '#0891B2', // Hover/Active text color
          activeBg: '#CFFAFE', // Active background color
        },
        // Hero gradient background colors
        hero: {
          blue: '#DBEAFE',
          purple: '#F3E8FF',
          pink: '#FCE7F3',
        },
        // Parent <-> Staff messaging colors
        chat: {
          bubbleRight: '#00a8cc',
          bubbleLeft: '#ffffff',
          bg: '#8ba6b6',
        },
      },
      fontFamily: {
        // Updated font to Inter
        logo: ['Nunito', 'sans-serif'], // Specific font for logo if needed
        sans: ['Inter', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'], // Added for consistent use of Nunito across the app

      },
    },
  },
  plugins: [],
} satisfies Config;
