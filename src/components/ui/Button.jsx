import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variants = {
    primary:   'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900',
    secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    ghost:     'bg-transparent text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20',
    outline:   'border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
    </button>
  )
}

export default Button
