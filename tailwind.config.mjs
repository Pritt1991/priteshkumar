/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Dark mode card surface
          900: '#0f172a', // Headings / Dark mode elevated surface
          950: '#0b0f19', // Dark mode main background
        },
        accent: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          400: '#38bdf8', // Sky Blue glow / links
          500: '#06b6d4', // Electric Cyan gradient accent
          600: '#0284c7', // Primary CTA fill
          700: '#0369a1',
        },
        amber: {
          400: '#fbbf24', // Warm Amber accent highlight
          500: '#f59e0b', // Hero pill dot highlight
          600: '#d97706',
        },
      },
    },
  },
  plugins: [],
};