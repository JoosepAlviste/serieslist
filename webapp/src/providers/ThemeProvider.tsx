import React, { useState, type ReactNode, useEffect } from 'react'

import { ThemeContext } from '#/context'
import { usePageContext } from '#/hooks'
import { THEME, type Theme, activateTheme } from '#/utils/theme'

type ThemeProviderProps = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme: initialTheme } = usePageContext()
  const [theme, setTheme] = useState(initialTheme ?? THEME.LIGHT)

  const onChange = (newTheme: Theme) => {
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
      onChange(userPrefersDarkMode ? 'dark' : 'light')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        activateTheme: onChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
