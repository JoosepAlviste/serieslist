import { iconColorVar } from '@serieslist/core-ui'
import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

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

  ':hover': {
    backgroundColor: vars.color.navIconHoverBackground,
  },

  vars: {
    [iconColorVar]: vars.color.icon,
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
  marginBottom: '1rem',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  height: '100%',
  padding: '1rem',
  paddingRight: '2rem',
})

export const spacer = style({
  flex: 1,
})
