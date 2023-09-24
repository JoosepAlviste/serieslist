import { createTheme } from '@vanilla-extract/css'

const colors = {
  white: '#ffffff',
  black: '#000000',
  blackA5: 'rgba(0, 0, 0, 0.5)',

  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',

  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo300: '#a5b4fc',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo800: '#3730a3',
  indigo900: '#312e81',
  indigo950: '#1e1b4b',

  green100: '#dcfce7',
  green400: '#4ade80',
  green600: '#16a34a',
  green950: '#052e16',

  red100: '#fee2e2',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red950: '#450a0a',

  yellow500: '#eab308',
}

const generalVariables = {
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

  easing: {
    base: 'cubic-bezier(0.1, 0.9, 0, 1.2)',
  },
}

export const [lightThemeClass, vars] = createTheme({
  ...generalVariables,

  color: {
    ...colors,

    pageBackground: colors.white,
    text: colors.slate900,
    textSecondary: colors.slate700,
    textTertiary: colors.slate500,
    textSuccess: colors.green600,
    textError: colors.red600,
    textHighlightedBackground: colors.indigo100,
    textHighlightedBackgroundDarker: colors.indigo200,

    primary: colors.indigo500,
    error: colors.red500,

    link: colors.indigo500,
    linkHover: colors.indigo600,

    separator: colors.slate200,

    popoverBackground: colors.white,
    popoverHoverBackground: colors.slate100,

    inputBackground: colors.white,
    inputBorder: colors.slate300,
    inputSecondaryBackground: colors.slate100,
    inputRaisedBackground: colors.slate200,
    inputAccessoryBackground: colors.slate200,
    inputAccessoryColor: colors.slate500,
    inputIconColor: colors.slate400,

    buttonPrimaryHoverBackground: colors.indigo600,
    buttonPrimaryDisabledBackground: colors.indigo400,
    buttonSecondaryBackground: colors.slate200,
    buttonSecondaryHoverBackground: colors.slate300,

    icon: colors.slate500,

    tooltipBackground: colors.black,
    tooltipText: colors.white,

    navIconBackground: colors.slate100,
    navIconHoverBackground: colors.slate200,
    navIconActiveBackground: colors.slate200,
    navIconActiveColor: colors.slate500,

    iconButtonColor: colors.slate400,
    iconButtonHoverColor: colors.slate500,
    iconButtonPrimaryHoverColor: colors.indigo600,

    searchHighlightBackground: colors.indigo50,

    toastSuccessAccessory: colors.green100,
    toastErrorAccessory: colors.red100,

    drawingColor: colors.slate300,

    pillBackground: colors.indigo100,
    pillText: colors.indigo500,
  },
})

export const darkThemeClass = createTheme(vars, {
  ...generalVariables,

  color: {
    ...colors,

    pageBackground: colors.black,
    text: colors.white,
    textSecondary: colors.slate200,
    textTertiary: colors.slate400,
    textSuccess: colors.green400,
    textError: colors.red400,
    textHighlightedBackground: colors.indigo900,
    textHighlightedBackgroundDarker: colors.indigo800,

    separator: colors.slate800,

    primary: colors.indigo400,
    error: colors.red400,

    link: colors.indigo400,
    linkHover: colors.indigo300,

    popoverBackground: colors.slate900,
    popoverHoverBackground: colors.slate800,

    inputBackground: colors.slate900,
    inputBorder: colors.slate900,
    inputSecondaryBackground: colors.slate900,
    inputRaisedBackground: colors.slate800,
    inputAccessoryBackground: colors.slate800,
    inputAccessoryColor: colors.slate400,
    inputIconColor: colors.slate500,

    buttonPrimaryHoverBackground: colors.indigo500,
    buttonPrimaryDisabledBackground: colors.indigo300,
    buttonSecondaryBackground: colors.slate800,
    buttonSecondaryHoverBackground: colors.slate700,

    icon: colors.slate400,

    tooltipBackground: colors.slate800,
    tooltipText: colors.white,

    iconButtonColor: colors.slate500,
    iconButtonHoverColor: colors.slate400,
    iconButtonPrimaryHoverColor: colors.indigo300,

    navIconBackground: colors.slate900,
    navIconHoverBackground: colors.slate800,
    navIconActiveBackground: colors.slate700,
    navIconActiveColor: colors.slate100,

    searchHighlightBackground: colors.indigo950,

    toastSuccessAccessory: colors.green950,
    toastErrorAccessory: colors.red950,

    drawingColor: colors.slate700,

    pillBackground: colors.indigo950,
    pillText: colors.indigo400,
  },
})

export const responsive = {
  s: 'screen and (max-width: 320px)',
  m: 'screen and (max-width: 768px)',
  l: 'screen and (max-width: 1200px)',
}

const base = 1
const above = 1
const below = -1

const zLayoutHeader = above + base
const zLayoutToast = above + zLayoutHeader
const zLayoutSelect = above + zLayoutHeader
const zHomePageBackground = below + base
const zAuthLayoutSeparator = base
const zSearchPopover = above + zLayoutHeader

export const zIndex = {
  layout: {
    header: zLayoutHeader,
    toast: zLayoutToast,
    select: zLayoutSelect,
  },
  homePage: {
    background: zHomePageBackground,
  },
  authLayout: {
    separator: zAuthLayoutSeparator,
  },
  search: {
    popover: zSearchPopover,
  },
}
