import { cn } from '../../lib/cn'

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  id,
  leftIcon,
  error,
  helperText,
  className,
  autoComplete,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={cn(
            'w-full border rounded-md py-2 text-sm transition-colors duration-150',
            'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
            leftIcon ? 'pl-9 pr-3' : 'px-3',
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-neutral-300 dark:border-neutral-600',
            className
          )}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input
