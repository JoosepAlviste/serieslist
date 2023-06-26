import * as Toggle from '@radix-ui/react-toggle'
import classNames from 'classnames'
import React from 'react'

import { Tooltip } from '@/components'
import { useTheme } from '@/hooks'
import { THEME } from '@/utils/theme'

import * as s from './ThemeToggle.css'

export const ThemeToggle = () => {
  const { theme, activateTheme } = useTheme()

  const tooltipText = `Change to ${
    theme === THEME.DARK ? 'light' : 'dark'
  } theme`

  return (
    <Tooltip text={tooltipText}>
      <Toggle.Root
        pressed={theme === THEME.DARK}
        onPressedChange={(isDark) => {
          activateTheme(isDark ? THEME.DARK : THEME.LIGHT)
        }}
        aria-label={tooltipText}
        className={classNames(s.toggle, {
          [s.toggleDark]: theme === THEME.DARK,
        })}
      />
    </Tooltip>
  )
}
