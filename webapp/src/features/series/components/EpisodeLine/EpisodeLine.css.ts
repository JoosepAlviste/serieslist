import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const episode = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: vars.color.inputSecondaryBackground,
  color: vars.color.textSecondary,
  borderRadius: vars.radii.s,
  paddingTop: '0.5rem',
  paddingRight: '1rem',
  paddingBottom: '0.5rem',
  paddingLeft: '1rem',
})

export const episodeNumber = style({
  fontWeight: vars.fontWeight.bold,
})

export const episodeTitle = style({
  flex: 1,
})
