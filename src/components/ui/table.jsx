import { cn } from '../../lib/utils'

export function Table({ children, className }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className={cn('min-w-full divide-y divide-slate-200 bg-white text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function THead({ children }) {
  return <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-slate-200 text-slate-700">{children}</tbody>
}

export function TH({ children, className }) {
  return <th className={cn('px-4 py-3 text-left', className)}>{children}</th>
}

export function TR({ children, className }) {
  return <tr className={cn('hover:bg-slate-50', className)}>{children}</tr>
}

export function TD({ children, className }) {
  return <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>
}

