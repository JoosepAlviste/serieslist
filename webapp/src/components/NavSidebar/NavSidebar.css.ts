import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const navLink = style({
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

export const navLinkIsActive = style({
  backgroundColor: vars.color.slate900,
  color: vars.color.slate100,

  ':hover': {
    backgroundColor: vars.color.slate900,
  },
})

export const navItemLogo = style({
  marginBottom: '2rem',
})

export const navLinkLogo = style([
  navLink,
  {
    backgroundImage: `linear-gradient(135deg, ${vars.color.indigo500} 10%, ${vars.color.indigo600})`,
    outlineColor: vars.color.indigo200,

    ':hover': {
      backgroundColor: vars.color.indigo600,
      backgroundImage: 'none',
    },
  },
])

export const navIcon = style({
  width: '1.75rem',
  height: '1.75rem',
})

export const navIconLogo = style([
  navIcon,
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
