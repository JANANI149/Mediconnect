import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ChartCard } from '../components/ChartCard'
import { metrics } from '../data/mockData'
import { FileText, Download } from 'lucide-react'

export default function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600">Insights across hospitals, doctors, and patient activity.</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Hospital performance" description="Appointments and satisfaction">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.hospitalPerformance} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="satisfaction" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Doctor appointment outcomes" description="Completed vs cancelled">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.doctorAppointments} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cancelled" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patient activity</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.patientActivity}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#0ea5e9"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              { title: 'Top hospital', value: 'Sunrise General', meta: '94% satisfaction' },
              { title: 'Most active doctor', value: 'Dr. Marco Silva', meta: '82 completed appts' },
              { title: 'Peak patient day', value: 'Monday', meta: '21% of weekly volume' },
              { title: 'Exportable data', value: 'CSV & PDF ready', meta: 'UI-only demo' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">{item.title}</p>
                <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-600">{item.meta}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

