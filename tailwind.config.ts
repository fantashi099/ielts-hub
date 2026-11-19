import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f7fb',
          100: '#eceef7',
          200: '#d9ddee',
          300: '#b9c0dd',
          400: '#8e98c4',
          500: '#6b75ac',
          600: '#545c8f',
          700: '#454a74',
          800: '#3a3e61',
          900: '#23263c',
          950: '#161827',
        },
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bfd4ff',
          300: '#93b6ff',
          400: '#5f8dff',
          500: '#3b66f6',
          600: '#2547eb',
          700: '#1d35d8',
          800: '#1e2eaf',
          900: '#1e2c8a',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.12)',
        lift: '0 2px 4px rgba(16,24,40,.05), 0 18px 40px -18px rgba(16,24,40,.22)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .35s ease both',
        pop: 'pop .18s ease-out both',
        shake: 'shake .5s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
