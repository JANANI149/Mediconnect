import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { availableSlots, doctors, hospitals } from '../../data/mockData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Select } from '../../components/ui/select'

export default function PatientDoctorDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = doctors.find((d) => d.id === id)
  const hospital = hospitals.find((h) => h.id === doctor?.hospitalId)
  const doctorSlots = availableSlots[id] ?? {}
  const dates = Object.keys(doctorSlots)
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? '')
  const slotsForDate = useMemo(() => (selectedDate ? doctorSlots[selectedDate] ?? [] : []), [doctorSlots, selectedDate])

  if (!doctor) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Doctor not found.</p>
        <Button variant="outline" onClick={() => navigate('/patient/doctors')}>
          Back to doctors
        </Button>
      </div>
    )
  }

  function startBooking(slot) {
    navigate('/patient/book', {
      state: { hospitalId: doctor.hospitalId, doctorId: doctor.id, date: selectedDate, slot },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm text-slate-500">Doctor profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">{doctor.name}</h1>
          <p className="text-slate-600">{doctor.specialization}</p>
        </div>
        <Badge variant="success">{doctor.rating} ★</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate('/patient/doctors')}>
            Back
          </Button>
          <Button onClick={() => startBooking(slotsForDate[0])}>Book now</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>Age: {doctor.age}</p>
            <p>Gender: {doctor.gender}</p>
            <p>Qualifications: {doctor.qualifications}</p>
            <p>Experience: {doctor.experience}</p>
            <p>Hospital: {hospital?.name}</p>
            <p>Consultation timings: {doctor.consultationTimings}</p>
            <p>Availability: {doctor.availability}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Available slots</CardTitle>
            <Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44">
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {slotsForDate.map((slot) => (
              <button
                key={slot}
                onClick={() => startBooking(slot)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-sky-500 hover:bg-sky-50"
              >
                {slot}
              </button>
            ))}
            {slotsForDate.length === 0 ? <p className="text-sm text-slate-500">No slots for this date.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

