import { style } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',

  vars: {
    [vars.color.inputSecondaryBackground]: vars.color.inputRaisedBackground,
  },
})
