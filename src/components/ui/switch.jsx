import { cn } from '../../lib/utils'

export function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-200 transition">
        <input
          type="checkbox"
          className="peer absolute h-full w-full opacity-0"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          className={cn(
            'absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4 peer-checked:bg-sky-600',
          )}
        />
        <span className="absolute inset-0 rounded-full border border-slate-300 peer-checked:border-sky-600 peer-checked:bg-sky-100/70" />
      </span>
      {label ? <span className="text-sm text-slate-700">{label}</span> : null}
    </label>
  )
}

