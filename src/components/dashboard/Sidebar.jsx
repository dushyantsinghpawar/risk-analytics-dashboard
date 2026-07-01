import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Star,
  Bell, FileText, Settings,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Portfolio',  icon: Briefcase,       to: '/portfolio' },
  { label: 'Ratings',   icon: Star,             to: null         },
  { label: 'Alerts',    icon: Bell,             to: '/alerts'    },
  { label: 'Reports',   icon: FileText,         to: null         },
  { label: 'Settings',  icon: Settings,         to: null         },
]

function Sidebar({ isOpen }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (item) => item.to ? pathname.startsWith(item.to) : false

  return (
    <aside className={cn(
      'fixed md:static z-20 top-16 left-0 h-full w-64',
      'bg-white dark:bg-neutral-800',
      'border-r border-neutral-200 dark:border-neutral-700',
      'transform transition-transform duration-300 print:hidden',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    )}>
      <nav className="flex flex-col p-3 gap-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <button
            key={label}
            onClick={() => to && navigate(to)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left w-full',
              isActive({ to })
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700',
              !to && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Icon size={17} className="shrink-0" />
            <span>{label}</span>
            {!to && (
              <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">Soon</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
