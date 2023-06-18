import { keyframes, style } from '@vanilla-extract/css'

import { responsive, vars } from '@/styles/theme.css'

const slideUpAndFade = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(2px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  paddingTop: '1rem',
  paddingRight: '1.5rem',
  paddingBottom: '1rem',
  gap: '1rem',

  '@media': {
    [responsive.m]: {
      justifyContent: 'space-between',
      paddingLeft: '1.5rem',
    },
  },
})

export const searchContainer = style({
  flex: 1,

  '@media': {
    [responsive.m]: {
      display: 'none',
    },
  },
})

export const search = style({
  maxWidth: '30rem',
})

export const headerRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  '@media': {
    [responsive.m]: {
      display: 'none',
    },
  },
})

export const dropdownIcon = style({
  transform: 'rotate(90deg)',
})

export const dropdownContent = style({
  minWidth: '14rem',
  backgroundColor: vars.color.popoverBackground,
  borderRadius: vars.radii.s,
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  boxShadow: vars.shadow.xl,
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: ['transform', 'opacity'],

  selectors: {
    '&[data-state="open"]': {
      animationName: slideUpAndFade,
    },
  },
})

export const dropdownItem = style({
  paddingTop: '0.5rem',
  paddingRight: '1rem',
  paddingBottom: '0.5rem',
  paddingLeft: '1rem',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: vars.color.popoverHoverBackground,
    outline: 'none',
  },

  selectors: {
    '&[data-highlighted]': {
      backgroundColor: vars.color.popoverHoverBackground,
      outline: 'none',
    },
  },
})

export const mobileOnly = style({
  display: 'none',

  '@media': {
    [responsive.m]: {
      display: 'block',
    },
  },
})
