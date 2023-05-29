import * as Toggle from '@radix-ui/react-toggle'
import * as Tooltip from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { usePageContext } from '@/hooks'
import { activateTheme, THEME } from '@/utils/theme'

import * as s from './ThemeToggle.css'

export const ThemeToggle = () => {
  const { theme: initialTheme } = usePageContext()
  const [theme, setTheme] = useState(initialTheme ?? THEME.LIGHT)

  const onChange = (isDark: boolean) => {
    const newTheme = isDark ? THEME.DARK : THEME.LIGHT
    setTheme(newTheme)
    activateTheme(newTheme)
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const userPrefersDarkMode = window.matchMedia(
      '(prefers-color-scheme:dark)',
    ).matches
    if (!initialTheme) {
      onChange(userPrefersDarkMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tooltipText = `Change to ${
    theme === THEME.DARK ? 'light' : 'dark'
  } theme`

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Toggle.Root
          pressed={theme === THEME.DARK}
          onPressedChange={onChange}
          aria-label={tooltipText}
          className={classNames(s.toggle, {
            [s.toggleDark]: theme === THEME.DARK,
          })}
        />
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content className={s.tooltipContent}>
          {tooltipText}
          <Tooltip.Arrow className={s.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
