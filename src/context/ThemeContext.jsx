import { useState, useEffect } from 'react'
import { ThemeContext } from './themeContextValue'

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider