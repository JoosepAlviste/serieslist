import { createTheme } from '@vanilla-extract/css'

const colors = {
  white: '#ffffff',

  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate500: '#64748b',
  slate900: '#0f172a',

  indigo500: '#6366f1',
  indigo600: '#4f46e5',
}

export const [themeClass, vars] = createTheme({
  color: {
    ...colors,

    icon: colors.slate500,
  },

  radii: {
    s: '0.5rem',
    m: '0.75rem',
    xl: '1.25rem',
  },

  shadow: {
    xl: '0 5px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
})
