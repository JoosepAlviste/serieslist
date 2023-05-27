import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  borderRadius: vars.radii.m,
  backgroundColor: vars.color.slate100,
  paddingTop: '0.5rem',
  paddingRight: '0.75rem',
  paddingBottom: '0.5rem',
  paddingLeft: '0.75rem',
  cursor: 'text',

  ':focus-within': {
    outlineWidth: 2,
  },
})

export const input = style({
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  lineHeight: 1,

  ':focus-visible': {
    outlineWidth: 0,
  },

  '::placeholder': {
    color: vars.color.slate700,
  },
})

export const inputAddonContainer = style({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const searchShortcut = style({
  width: '1.375rem',
  height: '1.375rem',
  borderRadius: vars.radii.s,
  color: vars.color.slate500,
  backgroundColor: vars.color.slate200,
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  fontWeight: vars.fontWeight.bold,
})

export const popoverContent = style({
  maxHeight: '80vh',
  backgroundColor: vars.color.white,
  boxShadow: vars.shadow.xl,
  borderRadius: vars.radii.m,
  width: '30rem',
  overflowY: 'auto',
})

export const searchTitle = style({
  paddingTop: '1rem',
  paddingRight: '1.25rem',
  paddingBottom: '0.25rem',
  paddingLeft: '1.25rem',
  fontWeight: vars.fontWeight.medium,
  color: vars.color.slate500,
  fontSize: '0.875rem',
})

export const searchResultsList = style({
  paddingBottom: '0.5rem',
})

export const searchResult = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  gap: '0.75rem',
  paddingTop: '0.75rem',
  paddingRight: '1.25rem',
  paddingBottom: '0.75rem',
  paddingLeft: '1.25rem',
  textDecoration: 'none',
  color: vars.color.slate900,
  // When using `.scrollIntoView()`, leave a lot of space above the item in the
  // dropdown
  scrollMarginTop: '40vh',
})

export const searchResultActive = style({
  backgroundColor: vars.color.indigo50,

  '::before': {
    content: '',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 3,
    height: '100%',
    backgroundColor: vars.color.indigo500,
  },
})

export const posterContainer = style({
  height: '4rem',
  aspectRatio: '2 / 3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const poster = style({
  borderRadius: vars.radii.s,
})

export const searchResultTitle = style({
  fontWeight: vars.fontWeight.medium,
})

export const titleHighlight = style({
  backgroundColor: vars.color.indigo100,

  selectors: {
    [`${searchResultActive} &`]: {
      backgroundColor: vars.color.indigo200,
    },
  },
})

export const searchResultDetails = style({
  color: vars.color.slate500,
  fontSize: '0.875rem',
})

export const emptyState = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '5rem',
  color: vars.color.slate500,
})
