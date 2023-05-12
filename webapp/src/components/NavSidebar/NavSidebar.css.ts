import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const navItem = style({
  width: '3rem',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radii.m,
  backgroundColor: vars.color.slate100,
  color: vars.color.slate500,

  ':hover': {
    backgroundColor: vars.color.slate200,
  },
})

export const navItemIsActive = style({
  backgroundColor: vars.color.slate900,
  color: vars.color.slate100,

  ':hover': {
    backgroundColor: vars.color.slate900,
  },
})

export const navItemLogo = style([
  navItem,
  {
    backgroundImage: `linear-gradient(135deg, ${vars.color.indigo500} 10%, ${vars.color.indigo600})`,
    marginBottom: '2rem',

    ':hover': {
      backgroundColor: vars.color.indigo600,
      backgroundImage: 'none',
    },
  },
])

export const navItemIcon = style({
  width: '1.75rem',
  height: '1.75rem',
})

export const navItemIconLogo = style([
  navItemIcon,
  {
    width: '1.5rem',
    height: '1.5rem',
    color: 'white',
  },
])

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
  paddingRight: '2rem',
  minHeight: '100vh',
})
