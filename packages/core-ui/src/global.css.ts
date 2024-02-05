import { globalStyle } from '@vanilla-extract/css'

import { base } from './layers.css'
import { SVG_COLOR_VAR } from './simpleCssVariables'
import { colorTransition, vars } from './theme.css'

globalStyle(':root', {
  vars: {
    [SVG_COLOR_VAR]: vars.color.icon,
  },
})

globalStyle('body', {
  '@layer': {
    [base]: {
      fontFamily: 'Inter, sans-serif',
      background: vars.color.pageBackground,
    },
  },
})

globalStyle('*', {
  '@layer': {
    [base]: {
      color: vars.color.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
      outlineColor: vars.color.primary,
      transition: `outline-width 100ms ease-in-out, ${colorTransition}, background-color 200ms ease-in-out, border-color 200ms ease-in-out, fill 200ms ease-in-out`,
    },
  },
})

globalStyle('*:focus-visible', {
  '@layer': {
    [base]: {
      outlineWidth: '2px',
    },
  },
})

globalStyle('button', {
  '@layer': {
    [base]: {
      color: vars.color.textSecondary,
    },
  },
})

globalStyle(
  `
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration
`,
  {
    '@layer': {
      [base]: {
        appearance: 'none',
      },
    },
  },
)
