import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export function ChartCard({ title, description, children, action }) {
  return (
    <Card>
      <CardHeader className="items-start gap-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  )
}

