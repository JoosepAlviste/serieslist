import { style } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

export const label = style({
  display: 'block',
})

export const labelText = style({
  marginBottom: '0.25rem',
  color: vars.color.textSecondary,
})

export const inputContainer = style({
  borderRadius: vars.radii.m,
  backgroundColor: vars.color.inputBackground,
  borderColor: vars.color.inputBorder,
  borderWidth: 1,
  borderStyle: 'solid',
  paddingTop: '0.5rem',
  paddingRight: '0.75rem',
  paddingBottom: '0.5rem',
  paddingLeft: '0.75rem',
  cursor: 'text',

  ':focus-within': {
    borderColor: vars.color.primary,
  },
})

export const inputContainerHasError = style({
  borderColor: vars.color.error,
})

export const input = style({
  color: vars.color.text,

  ':focus': {
    outline: 'none',
  },
})

export const error = style({
  marginTop: '0.5rem',
  // If there is no error message, then we want to show an empty space the
  // same size as the error
  minHeight: '1.3125rem',
})
