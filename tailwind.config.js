/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0f172a',
        primary: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          hover: '#e2e8f0',
          foreground: '#0f172a'
        },
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#64748b'
        },
        border: '#e2e8f0'
      }
    },
  },
  plugins: [],
};