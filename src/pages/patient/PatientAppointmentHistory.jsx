import { useMemo, useState } from 'react'
import { patients } from '../../data/mockData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Select } from '../../components/ui/select'
import { Input } from '../../components/ui/input'

const baseAppointments = patients[0].appointments

export default function PatientAppointmentHistory() {
  const [status, setStatus] = useState('all')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [appointments, setAppointments] = useState(baseAppointments)

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchStatus = status === 'all' || appt.status === status
      const apptDate = new Date(appt.date)
      const matchStart = start ? apptDate >= new Date(start) : true
      const matchEnd = end ? apptDate <= new Date(end) : true
      return matchStatus && matchStart && matchEnd
    })
  }, [appointments, status, start, end])

  function cancel(index) {
    setAppointments((prev) => prev.map((a, i) => (i === index ? { ...a, status: 'Cancelled' } : a)))
  }

  function reschedule(index) {
    setAppointments((prev) =>
      prev.map((a, i) => (i === index ? { ...a, status: 'Booked', date: a.date, time: a.time } : a)),
    )
  }

  function reset() {
    setStatus('all')
    setStart('')
    setEnd('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Appointment history</h1>
          <p className="text-slate-600">View, reschedule, or cancel your appointments.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center gap-3">
          <CardTitle>Filters</CardTitle>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
              <option value="all">All statuses</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          {filtered.map((appt, idx) => (
            <div
              key={`${appt.date}-${appt.doctor}-${idx}`}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{appt.doctor}</p>
                <p className="text-sm text-slate-600">{appt.hospital}</p>
                <p className="text-sm text-slate-600">
                  {appt.date} • {appt.time}
                </p>
                <p className="text-sm text-slate-500">{appt.reason}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'danger' : 'info'}>
                  {appt.status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => reschedule(idx)}>
                  Reschedule
                </Button>
                <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => cancel(idx)}>
                  Cancel
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 ? <p className="text-sm text-slate-500">No appointments in this range.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

