import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctors, hospitals, patients } from '../data/mockData'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/table'

export default function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = doctors.find((d) => d.id === id)
  const hospital = hospitals.find((h) => h.id === doctor?.hospitalId)
  const doctorPatients = useMemo(() => patients.filter((p) => p.doctorId === id), [id])

  if (!doctor) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-slate-600">Doctor not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm text-slate-500">Doctor profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">{doctor.name}</h1>
          <p className="text-slate-600">{doctor.specialization}</p>
        </div>
        <Badge variant="info">{hospital?.name ?? 'Unassigned'}</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate('/doctors')}>
            Back to list
          </Button>
          <Button>Edit profile</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-600">Qualifications</p>
            <p className="font-semibold text-slate-900">{doctor.qualifications}</p>
            <p className="text-sm text-slate-600">Experience</p>
            <p className="font-semibold text-slate-900">{doctor.experience}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {doctor.schedule.map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="font-semibold text-slate-900">{slot.day}</span>
                <span className="text-sm text-slate-600">{slot.time}</span>
              </div>
            ))}
            {doctor.schedule.length === 0 ? <p className="text-sm text-slate-500">No schedule assigned.</p> : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent className="table-scroll">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Age</TH>
                <TH>Gender</TH>
              </TR>
            </THead>
            <TBody>
              {doctorPatients.map((patient) => (
                <TR key={patient.id}>
                  <TD>{patient.name}</TD>
                  <TD>{patient.age}</TD>
                  <TD>{patient.gender}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          {doctorPatients.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">No patients assigned.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

