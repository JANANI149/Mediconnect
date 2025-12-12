import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { cn } from '../lib/utils'

export function StatCard({ title, value, change, helper, positive = true }) {
  return (
    <Card>
      <CardHeader className="items-start">
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>
        <div
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
          )}
        >
          {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}

