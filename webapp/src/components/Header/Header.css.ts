import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

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
})

export const searchContainer = style({
  flex: 1,
})

export const search = style({
  maxWidth: '30rem',
})

export const headerRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
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

export const headerItemContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
  padding: '0.5rem',
  borderRadius: vars.radii.m,
  color: vars.color.text,
  textDecoration: 'none',

  ':hover': {
    backgroundColor: vars.color.inputSecondaryBackground,
  },

  selectors: {
    '&[data-state="open"]': {
      backgroundColor: vars.color.inputSecondaryBackground,
    },
  },
})

export const headerItemIcon = style({
  color: vars.color.icon,
})
