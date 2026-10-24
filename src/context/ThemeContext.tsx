import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with 'light' on both SSR and initial client render to guarantee zero hydration mismatch,
  // while the inline <head> script already handles the `html.dark` class before first paint.
  const [theme, setThemeState] = useState<Theme>('light')
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('papa_theme') as Theme | null
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved)
    } else if (document.documentElement.classList.contains('dark')) {
      setThemeState('dark')
    }
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('papa_theme', theme)
  }, [theme, hasHydrated])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
