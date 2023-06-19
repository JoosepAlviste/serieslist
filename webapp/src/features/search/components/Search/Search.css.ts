import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  borderRadius: vars.radii.m,
  backgroundColor: vars.color.inputSecondaryBackground,
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
  lineHeight: 1,
  color: vars.color.text,

  ':focus-visible': {
    outlineWidth: 0,
  },

  '::placeholder': {
    color: vars.color.textSecondary,
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
  color: vars.color.inputAccessoryColor,
  backgroundColor: vars.color.inputAccessoryBackground,
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  fontWeight: vars.fontWeight.bold,
})

export const popoverContent = style({
  maxHeight: '80vh',
  backgroundColor: vars.color.popoverBackground,
  boxShadow: vars.shadow.xl,
  borderRadius: vars.radii.m,
  width: '30rem',
  maxWidth: '100vw',
  overflowY: 'auto',
  zIndex: 2,
})

export const searchTitle = style({
  paddingTop: '1rem',
  paddingRight: '1.25rem',
  paddingBottom: '0.25rem',
  paddingLeft: '1.25rem',
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textTertiary,
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
  color: vars.color.text,
  // When using `.scrollIntoView()`, leave a lot of space above the item in the
  // dropdown
  scrollMarginTop: '40vh',
})

export const searchResultActive = style({
  backgroundColor: vars.color.searchHighlightBackground,

  '::before': {
    content: '',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 3,
    height: '100%',
    backgroundColor: vars.color.primary,
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
  backgroundColor: vars.color.textHighlightedBackground,
  color: vars.color.text,

  selectors: {
    [`${searchResultActive} &`]: {
      backgroundColor: vars.color.textHighlightedBackgroundDarker,
    },
  },
})

export const searchResultDetails = style({
  color: vars.color.textTertiary,
  fontSize: '0.875rem',
})

export const emptyState = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '5rem',
  color: vars.color.textTertiary,
})
