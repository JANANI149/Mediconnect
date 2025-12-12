import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hospitals, doctors } from '../../data/mockData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function PatientHospitalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hospital = hospitals.find((h) => h.id === id)
  const hospitalDoctors = useMemo(() => doctors.filter((d) => d.hospitalId === id), [id])

  if (!hospital) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Hospital not found.</p>
        <Button variant="outline" onClick={() => navigate('/patient/hospitals')}>
          Back to hospitals
        </Button>
      </div>
    )
  }

  function book(doctorId) {
    navigate('/patient/book', { state: { hospitalId: hospital.id, doctorId } })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm text-slate-500">Hospital</p>
          <h1 className="text-2xl font-semibold text-slate-900">{hospital.name}</h1>
          <p className="text-slate-600">{hospital.location}</p>
        </div>
        <Badge variant="success">{hospital.rating} ★</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate('/patient/hospitals')}>
            Back
          </Button>
          <Button onClick={() => book(hospital.doctors[0])}>Book at this hospital</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-100 p-6 text-sm text-slate-600">
            Map placeholder for {hospital.address}
          </div>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{hospital.address}</p>
            <a className="text-sm font-semibold text-sky-600" href={hospital.mapLink}>
              Open in Maps
            </a>
            <div>
              <p className="text-sm font-medium text-slate-700">Contact</p>
              <p className="text-sm text-slate-600">{hospital.phone}</p>
              <p className="text-sm text-slate-600">{hospital.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Working hours</p>
              <div className="space-y-1 text-sm text-slate-600">
                {hospital.workingHours.map((wh) => (
                  <p key={wh.day}>
                    {wh.day}: {wh.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {hospital.services.map((svc) => (
            <Badge key={svc}>{svc}</Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doctors at {hospital.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {hospitalDoctors.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{doc.name}</p>
                  <p className="text-sm text-slate-600">{doc.specialization}</p>
                </div>
                <Badge variant="success">{doc.rating} ★</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">Experience: {doc.experience}</p>
              <p className="text-sm text-slate-600">Timings: {doc.consultationTimings}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/patient/doctors/${doc.id}`)}>
                  View Profile
                </Button>
                <Button onClick={() => book(doc.id)}>Book Appointment</Button>
              </div>
            </div>
          ))}
          {hospitalDoctors.length === 0 ? <p className="text-sm text-slate-500">No doctors listed.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

