import { Menu, Sun, Moon, LogOut, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useTheme from '../../hooks/useTheme'
import Button from '../ui/Button'

function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-6 shrink-0">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Toggle menu"
          className="md:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-700 dark:text-blue-400" />
          <span className="font-bold text-blue-700 dark:text-blue-400 text-lg tracking-tight">Moody's</span>
        </div>
        <span className="hidden sm:block text-sm text-neutral-400 dark:text-neutral-500 font-medium">
          Risk Analytics
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          leftIcon={theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        >
          <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </Button>
        <span className="hidden sm:block text-sm text-neutral-600 dark:text-neutral-300 font-medium px-1">
          John Analyst
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          leftIcon={<LogOut size={14} />}
        >
          Logout
        </Button>
      </div>

    </header>
  )
}

export default Navbar
