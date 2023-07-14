import { globalStyle, style } from '@vanilla-extract/css'

import { iconColorVar } from '#/styles/cssVariables'
import { responsive, vars } from '#/styles/theme.css'

export const ANIMATION_DURATION_MS = 200

export const mobileMenu = style({
  display: 'none',
  flexDirection: 'column',
  position: 'fixed',
  inset: 0,
  // Height of the header
  top: 80,
  background: vars.color.pageBackground,
  padding: '1.5rem',
  zIndex: 2,

  '@media': {
    [responsive.m]: {
      display: 'flex',
    },
  },
})

globalStyle(`${mobileMenu} > div:nth-child(2)`, {
  flex: 1,
})

export const mobileMenuEnter = style({
  transform: 'translateX(-100%)',
})

export const mobileMenuEnterActive = style({
  transform: 'translateX(0)',
  transition: `transform ${ANIMATION_DURATION_MS}ms ease-in-out`,
})

export const mobileMenuExit = style({
  transform: 'translateX(0)',
})

export const mobileMenuExitActive = style({
  transform: 'translateX(-100%)',
  transition: `transform ${ANIMATION_DURATION_MS}ms ease-in-out`,
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  height: '100%',
  paddingTop: '1rem',
  paddingBottom: '2rem',
})

export const link = style({
  color: vars.color.textSecondary,
  fontSize: '1.125rem',

  ':hover': {
    color: vars.color.text,

    vars: {
      [iconColorVar]: vars.color.text,
    },
  },
})

export const separator = style({
  flex: 1,
})

export const footer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
})
