/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f4fbf5',
          100: '#e5f6e8',
          200: '#ceeed4',
          300: '#a5e0b0',
          400: '#73cb85',
          500: '#48ae5d',
          600: '#358e47',
          700: '#2b703a',
          800: '#265931',
          900: '#204a2a',
        },
        sky: {
          glow: '#dbeafe',
          horizon: '#fed7aa',
          dusk: '#38bdf8',
          deep: '#0369a1',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.45)',
          border: 'rgba(255, 255, 255, 0.35)',
          dark: 'rgba(15, 23, 42, 0.65)',
          darkBorder: 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
        'glass-dark': '0 12px 40px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glow-emerald': '0 0 25px rgba(52, 211, 153, 0.35)',
        'glow-amber': '0 0 25px rgba(251, 191, 36, 0.35)',
        'glow-sky': '0 0 25px rgba(56, 189, 248, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
