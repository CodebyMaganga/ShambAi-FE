import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F7F3EE',
        foreground: '#1F1F1F',
        card: {
          DEFAULT: '#FDFCFB',
          foreground: '#1F1F1F',
        },
        popover: {
          DEFAULT: '#FDFCFB',
          foreground: '#1F1F1F',
        },
        primary: {
          DEFAULT: '#8A6A44',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#EFE6D8',
          foreground: '#1F1F1F',
        },
        muted: {
          DEFAULT: '#EFE6D8',
          foreground: '#6B6B6B',
        },
        accent: {
          DEFAULT: '#4F6B4F',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#E53935',
          foreground: '#FFFFFF',
        },
        border: '#E5DED0',
        input: '#E5DED0',
        ring: '#8A6A44',
        success: '#4F6B4F',
        warning: '#D4A84B',
        info: '#2196F3',
        earth: {
          DEFAULT: '#8A6A44',
          light: '#A88B5E',
        },
        agriculture: {
          DEFAULT: '#4F6B4F',
          light: '#6B8A6B',
        },
        sand: {
          DEFAULT: '#EFE6D8',
          warm: '#F7F3EE',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
