import { cn } from '../../lib/utils'

export function Avatar({ initials, className }) {
  const display = initials || 'AD'
  return (
    <div
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700',
        className,
      )}
    >
      {display}
    </div>
  )
}

