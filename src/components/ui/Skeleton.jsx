import { cn } from '../../lib/cn'

function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />
}

function SkeletonText({ lines = 1, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-neutral-100 dark:border-neutral-700">
      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
      <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
    </tr>
  )
}

Skeleton.Text = SkeletonText
Skeleton.Row = SkeletonRow

export default Skeleton
