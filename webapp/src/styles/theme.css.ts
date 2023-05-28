import { createTheme } from '@vanilla-extract/css'

const colors = {
  white: '#ffffff',

  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate700: '#334155',
  slate900: '#0f172a',

  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',

  green100: '#dcfce7',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
}

export const [themeClass, vars] = createTheme({
  color: {
    ...colors,

    icon: colors.slate500,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },

  radii: {
    s: '0.5rem',
    m: '0.75rem',
    xl: '1.25rem',
  },

  shadow: {
    md: 'rgba(0, 0, 0, 0.2) 0px 18px 50px -10px',
    xl: '0 5px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
})
