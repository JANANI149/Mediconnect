import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { StatCard } from '../components/StatCard'
import { ChartCard } from '../components/ChartCard'
import { Skeleton } from '../components/ui/skeleton'
import { hospitals, doctors, patients, metrics } from '../data/mockData'

export default function Dashboard() {
  const [loading] = useState(false)

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="p-4">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-4 h-40 w-full" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Overview of your healthcare network and operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Hospitals"
          value={hospitals.length}
          change="+2.4%"
          helper="vs last month"
          positive
        />
        <StatCard
          title="Total Doctors"
          value={doctors.length}
          change="+1.8%"
          helper="added this quarter"
          positive
        />
        <StatCard
          title="Total Patients"
          value={patients.length}
          change="+6.2%"
          helper="registrations this quarter"
          positive
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Patient Registrations" description="Last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.patientRegistrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Doctor Additions" description="Per month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.doctorAdditions} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hospital Growth" description="Facilities onboarded">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.hospitalGrowth}>
              <defs>
                <linearGradient id="hospitalGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#hospitalGrowth)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="items-start">
            <CardTitle>Approve Hospitals</CardTitle>
            <p className="text-sm text-slate-500">Review and approve onboarding requests.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {hospitals
              .filter((h) => h.status === 'Pending')
              .map((hosp) => (
                <div key={hosp.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{hosp.name}</p>
                    <p className="text-sm text-slate-600">{hosp.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      View details
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-start">
            <CardTitle>Pending Requests</CardTitle>
            <p className="text-sm text-slate-500">Credentialing, access, and appointment requests.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { id: 'req-1', title: 'Doctor credentialing', meta: '3 requests in review' },
              { id: 'req-2', title: 'Patient record corrections', meta: '5 waiting' },
              { id: 'req-3', title: 'Scheduling conflicts', meta: '2 escalations' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.meta}</p>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

