import { useCallback, useRef, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/cn'
import { ToastContext } from './toastContextValue'

const ICONS = {
  success: <CheckCircle size={16} />,
  error:   <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info:    <Info size={16} />,
}

const STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
  error:   'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300',
  info:    'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
}

function ToastItem({ id, message, type = 'info', onRemove }) {
  return (
    <div
      role="alert"
      className={cn(
        'animate-slide-up flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md text-sm min-w-72 max-w-sm',
        STYLES[type]
      )}
    >
      <span className="shrink-0 mt-0.5">{ICONS[type]}</span>
      <p className="flex-1 leading-snug">{message}</p>
      <button
        onClick={() => onRemove(id)}
        aria-label="Dismiss"
        className="shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timerRef = useRef({})

  const remove = useCallback((id) => {
    clearTimeout(timerRef.current[id])
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    timerRef.current[id] = setTimeout(() => remove(id), duration)
  }, [remove])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 items-start"
      >
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
