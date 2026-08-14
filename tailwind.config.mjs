/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  safelist: [
    'text-gray-500', 'dark:text-gray-400',
    'text-amber-700', 'dark:text-amber-500',
    'text-orange-500', 'dark:text-orange-400',
    'text-yellow-600', 'dark:text-yellow-400',
    'text-emerald-600', 'dark:text-emerald-400',
    'text-sky-500', 'dark:text-sky-400',
    'text-purple-500', 'dark:text-purple-400',
    'text-pink-500', 'dark:text-pink-400',
    'text-red-500', 'dark:text-red-400',
    'bg-gray-200', 'dark:bg-gray-800',
    'bg-amber-100', 'dark:bg-amber-900/40',
    'bg-orange-100', 'dark:bg-orange-900/40',
    'bg-yellow-100', 'dark:bg-yellow-900/40',
    'bg-emerald-100', 'dark:bg-emerald-900/40',
    'bg-sky-100', 'dark:bg-sky-900/40',
    'bg-purple-100', 'dark:bg-purple-900/40',
    'bg-pink-100', 'dark:bg-pink-900/40',
    'bg-red-100', 'dark:bg-red-900/40',
    'px-1.5', 'py-0.5', 'rounded', 'font-semibold',
  ],
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