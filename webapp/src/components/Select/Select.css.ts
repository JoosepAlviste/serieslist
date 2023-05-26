import { style } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: vars.color.slate100,
  borderRadius: vars.radii.s,
  padding: '0.5rem 1rem',
  color: vars.color.slate700,

  vars: {
    [iconColorVar]: vars.color.slate400,
  },
})

export const triangle = style({
  transform: 'rotate(90deg)',
  width: '0.75rem',
  height: '0.75rem',
})

export const content = style({
  background: vars.color.white,
  boxShadow: vars.shadow.md,
  borderRadius: vars.radii.s,
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  paddingTop: '0.5rem',
  paddingRight: '0.5rem',
  paddingBottom: '0.5rem',
  paddingLeft: '2rem',
  cursor: 'pointer',
  userSelect: 'none',

  ':focus': {
    outline: 'none',
  },

  selectors: {
    [`&[data-highlighted]`]: {
      backgroundColor: vars.color.slate100,
    },
  },
})

export const itemCheck = style({
  position: 'absolute',
  left: '0.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
})

export const itemCheckIcon = style({
  width: '1rem',
  height: '1rem',
  color: vars.color.indigo500,
})
