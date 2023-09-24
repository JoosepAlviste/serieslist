import { style } from '@vanilla-extract/css'

import { responsive, vars, zIndex } from '#/styles/theme.css'

export const container = style({
  display: 'flex',
  // Gradient is indigo-500, quite transparent
  background: `linear-gradient(143deg, rgba(99, 102, 241, 0) 70%, rgba(99, 102, 241, 0.2) 100%);`,
  flex: 1,
})

export const formSide = style({
  flex: 2,
  marginTop: 'auto',
  marginBottom: 'auto',
  padding: '1.75rem 1rem',
})

export const title = style({
  fontSize: '1.5rem',
  fontWeight: vars.fontWeight.medium,
  marginBottom: '2rem',
})

export const separatorContainer = style({
  marginTop: '2rem',
  marginBottom: '2rem',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
})

export const separator = style({
  height: 1,
  background: `linear-gradient(90deg, ${vars.color.pageBackground} 0%, ${vars.color.separator} 10%, ${vars.color.separator} 80%, ${vars.color.pageBackground} 100%);`,
  position: 'absolute',
  width: '100%',
  top: '50%',
})

export const separatorText = style({
  fontSize: '0.875rem',
  background: vars.color.pageBackground,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  zIndex: zIndex.authLayout.separator,
})

export const otherActionContainer = style({
  textAlign: 'center',
})

export const illustrationSide = style({
  flex: 4,
  padding: '1.75rem 1rem',
  marginTop: 'auto',
  marginBottom: 'auto',

  '@media': {
    [responsive.m]: {
      display: 'none',
    },
  },
})

export const illustration = style({
  width: '100%',
  height: 'auto',
  maxHeight: '30rem',
})
