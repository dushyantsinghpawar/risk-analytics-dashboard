import { cn } from '../../lib/cn'

function Card({ children, className }) {
  return (
    <div className={cn(
      'bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700',
      className
    )}>
      {children}
    </div>
  )
}

function CardHeader({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-b border-neutral-200 dark:border-neutral-700', className)}>
      {children}
    </div>
  )
}

function CardBody({ children, className }) {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  )
}

function CardFooter({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-t border-neutral-200 dark:border-neutral-700', className)}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
