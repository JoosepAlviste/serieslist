import { style } from '@vanilla-extract/css'

import { responsive, vars } from '#/styles/theme.css'

export const burgerContainer = style({
  padding: '0.5rem',
  borderRadius: vars.radii.m,
})

export const burger = style({
  display: 'none',
  position: 'relative',
  width: '2rem',
  height: '2rem',

  '@media': {
    [responsive.m]: {
      display: 'block',
    },
  },
})

export const burgerOpen = style({})

const line = style({
  position: 'absolute',
  width: '100%',
  height: '12%',
  background: vars.color.textTertiary,
  boxShadow: `0 0 0 3px ${vars.color.pageBackground}`,
  borderRadius: '2rem',
  transition: `all 0.5s ${vars.easing.base}`,

  selectors: {
    [`${burgerContainer}:hover &`]: {
      background: vars.color.text,
    },
  },
})

export const burgerBunTop = style([
  line,
  {
    top: '10%',
    right: 0,

    selectors: {
      [`${burgerOpen} &`]: {
        width: 0,
      },
    },
  },
])

export const burgerBunBottom = style([
  line,
  {
    bottom: '10%',
    left: 0,

    selectors: {
      [`${burgerOpen} &`]: {
        width: 0,
      },
    },
  },
])

const burgerPatty = style([
  line,
  {
    top: '50%',
    transform: 'translateY(-50%)',
  },
])

export const burgerPattyOne = style([
  burgerPatty,
  {
    selectors: {
      [`${burgerOpen} &`]: {
        transform: 'rotate(135deg)',
      },
    },
  },
])

export const burgerPattyTwo = style([
  burgerPatty,
  {
    selectors: {
      [`${burgerOpen} &`]: {
        transform: 'rotate(45deg)',
        boxShadow: vars.color.pageBackground,
      },
    },
  },
])
