import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

/**
 * Theme toggle design inspiration from https://codepen.io/anurag94/pen/MWYBWoN
 */
export const toggle = style({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  background: vars.color.yellow500,
  transition: 'all 0.3s ease-in-out',
})

export const toggleDark = style({
  background: 'transparent',
  boxShadow: `inset -5px -4px 1px 1px ${vars.color.white}`,
})

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

const slideRightAndFade = keyframes({
  from: {
    opacity: 0,
    transform: 'translateX(-2px)',
  },
  to: {
    opacity: 1,
    transform: 'translateX(0)',
  },
})

const slideDownAndFade = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(-2px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

const slideLeftAndFade = keyframes({
  from: {
    opacity: 0,
    transform: 'translateX(2px)',
  },
  to: {
    opacity: 1,
    transform: 'translateX(0)',
  },
})

export const tooltipContent = style({
  borderRadius: vars.radii.s,
  padding: '0.75rem 1.25rem',
  fontSize: '0.875rem',
  lineHeight: 1,
  color: vars.color.tooltipText,
  backgroundColor: vars.color.tooltipBackground,
  boxShadow: [
    '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '0 2px 4px -2px rgb(0 0 0 / 0.1)',
  ],
  userSelect: 'none',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: ['transform', 'opacity'],

  selectors: {
    '&[data-state="delayed-open"][data-side="top"]': {
      animationName: slideDownAndFade,
    },
    '&[data-state="delayed-open"][data-side="right"]': {
      animationName: slideLeftAndFade,
    },
    '&[data-state="delayed-open"][data-side="bottom"]': {
      animationName: slideUpAndFade,
    },
    '&[data-state="delayed-open"][data-side="left"]': {
      animationName: slideRightAndFade,
    },
  },
})

export const tooltipArrow = style({
  fill: vars.color.tooltipBackground,
})
