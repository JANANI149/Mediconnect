import { cn } from '../../lib/utils'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  default:
    'bg-sky-600 text-white hover:bg-sky-700 border-transparent focus-visible:outline-sky-500',
  outline:
    'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 focus-visible:outline-sky-500',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 border-transparent focus-visible:outline-sky-500',
  destructive:
    'bg-rose-600 text-white hover:bg-rose-700 border-transparent focus-visible:outline-rose-500',
  secondary:
    'bg-slate-900 text-white hover:bg-slate-800 border-transparent focus-visible:outline-slate-700',
}

const sizes = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  lg: 'h-11 px-5 text-base',
  icon: 'h-10 w-10 p-0',
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  ...props
}) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

