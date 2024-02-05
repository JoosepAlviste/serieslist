import { style } from '@vanilla-extract/css'

import { iconColorVar } from '../../cssVariables'
import { vars, zIndex } from '../../theme.css'

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: vars.color.inputSecondaryBackground,
  borderRadius: vars.radii.s,
  padding: '0.5rem 1rem',
  color: vars.color.textSecondary,

  vars: {
    [iconColorVar]: vars.color.inputIconColor,
  },
})

export const triangle = style({
  transform: 'rotate(90deg)',
})

export const content = style({
  background: vars.color.popoverBackground,
  boxShadow: vars.shadow.md,
  borderRadius: vars.radii.s,
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  zIndex: zIndex.layout.select,
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  paddingTop: '0.5rem',
  paddingRight: '0.5rem',
  paddingBottom: '0.5rem',
  paddingLeft: '2.25rem',
  cursor: 'pointer',
  userSelect: 'none',

  ':focus': {
    outline: 'none',
  },

  selectors: {
    [`&[data-highlighted]`]: {
      backgroundColor: vars.color.popoverHoverBackground,
    },
  },
})

export const itemCheck = style({
  position: 'absolute',
  left: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
})

export const itemCheckIcon = style({
  vars: {
    [iconColorVar]: vars.color.primary,
  },
})
