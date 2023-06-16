import { globalStyle, style } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

export const container = style({})

globalStyle(`${container} > div`, {
  height: '100%',
})

export const navLink = style({
  width: '3rem',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radii.m,
  backgroundColor: vars.color.navIconBackground,
  color: vars.color.icon,

  ':hover': {
    backgroundColor: vars.color.navIconHoverBackground,
  },
})

export const navLinkIsActive = style({
  backgroundColor: vars.color.navIconActiveBackground,

  ':hover': {
    backgroundColor: vars.color.navIconActiveBackground,
  },

  vars: {
    [iconColorVar]: vars.color.navIconActiveColor,
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
    transition: 'none',

    ':hover': {
      backgroundColor: vars.color.indigo600,
      backgroundImage: 'none',
    },

    vars: {
      [iconColorVar]: vars.color.white,
    },
  },
])

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  padding: '1rem',
  paddingRight: '2rem',
})

export const spacer = style({
  flex: 1,
})
