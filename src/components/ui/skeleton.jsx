import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('h-4 w-full animate-pulse rounded bg-slate-200', className)} />
}

