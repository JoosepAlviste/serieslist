import { style } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

export const loadingContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const container = style({
  backgroundColor: vars.color.elevatedBackground,
  padding: '2rem',
  borderRadius: vars.radii.m,
})

export const title = style({
  marginBottom: '1rem',
})

export const separator = style({
  borderColor: vars.color.separator,
  borderWidth: 1,
  marginTop: '2rem',
  marginBottom: '2rem',
})

export const inputIconsContainer = style({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
})
