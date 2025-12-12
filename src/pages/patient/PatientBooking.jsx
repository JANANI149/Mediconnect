import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { availableSlots, doctors, hospitals } from '../../data/mockData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'

const steps = ['Select Hospital', 'Select Doctor', 'Select Date', 'Select Time Slot']

export default function PatientBooking() {
  const location = useLocation()
  const preset = location.state || {}
  const [step, setStep] = useState(0)
  const [hospitalId, setHospitalId] = useState(preset.hospitalId || '')
  const [doctorId, setDoctorId] = useState(preset.doctorId || '')
  const [date, setDate] = useState(preset.date || '')
  const [slot, setSlot] = useState(preset.slot || '')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const doctorsForHospital = useMemo(
    () => doctors.filter((d) => (hospitalId ? d.hospitalId === hospitalId : true)),
    [hospitalId],
  )

  const availableDates = useMemo(() => Object.keys(availableSlots[doctorId] || {}), [doctorId])
  const slotsForDate = useMemo(() => (date ? availableSlots[doctorId]?.[date] ?? [] : []), [doctorId, date])

  useEffect(() => {
    if (hospitalId && doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId)
      if (doctor && doctor.hospitalId !== hospitalId) {
        setDoctorId('')
      }
    }
  }, [hospitalId, doctorId])

  useEffect(() => {
    if (doctorId && !availableDates.includes(date)) {
      setDate(availableDates[0] || '')
      setSlot('')
    }
  }, [doctorId, availableDates, date])

  useEffect(() => {
    if (slot && !slotsForDate.includes(slot)) {
      setSlot('')
    }
  }, [slot, slotsForDate])

  function canProceed(currentStep) {
    if (currentStep === 0) return Boolean(hospitalId)
    if (currentStep === 1) return Boolean(doctorId)
    if (currentStep === 2) return Boolean(date)
    if (currentStep === 3) return Boolean(slot)
    return false
  }

  function next() {
    if (step < steps.length - 1 && canProceed(step)) {
      setStep((s) => s + 1)
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1)
  }

  function confirm() {
    if (!slot) return
    setConfirmed(true)
  }

  const selectedHospital = hospitals.find((h) => h.id === hospitalId)
  const selectedDoctor = doctors.find((d) => d.id === doctorId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Appointment booking</h1>
          <p className="text-slate-600">Complete the 4-step booking flow.</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-2 px-4 py-3">
          {steps.map((label, idx) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Badge variant={idx === step ? 'info' : idx < step ? 'success' : 'default'}>{idx + 1}</Badge>
              <span className={idx === step ? 'text-slate-900' : 'text-slate-600'}>{label}</span>
              {idx < steps.length - 1 ? <span className="text-slate-400">›</span> : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{steps[step]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Choose a hospital to continue.</p>
                <Select value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
                  <option value="">Select hospital</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.location})
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Select a doctor from the chosen hospital.</p>
                <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                  <option value="">Select doctor</option>
                  {doctorsForHospital.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} • {d.specialization}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Pick a date from available slots.</p>
                <Select value={date} onChange={(e) => setDate(e.target.value)}>
                  <option value="">Select date</option>
                  {availableDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Choose a time slot for the selected date.</p>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {slotsForDate.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        slot === s
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-sky-500 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  {slotsForDate.length === 0 ? (
                    <p className="text-sm text-slate-500">No slots for this date.</p>
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Notes (optional)</p>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reason for visit, symptoms, preferences..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={prev} disabled={step === 0}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={next} disabled={!canProceed(step)}>
                  Next
                </Button>
              ) : (
                <Button onClick={confirm} disabled={!slot}>
                  Confirm Appointment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-800">Hospital:</span>{' '}
              {selectedHospital?.name || 'Not selected'}
            </p>
            <p>
              <span className="font-medium text-slate-800">Doctor:</span>{' '}
              {selectedDoctor?.name || 'Not selected'}
            </p>
            <p>
              <span className="font-medium text-slate-800">Date:</span> {date || 'Not selected'}
            </p>
            <p>
              <span className="font-medium text-slate-800">Time slot:</span> {slot || 'Not selected'}
            </p>
            {notes ? (
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Notes:</span> {notes}
              </p>
            ) : null}
            {confirmed ? (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Appointment confirmed! A confirmation has been sent.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

