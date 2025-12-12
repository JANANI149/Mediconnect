import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/table'
import { patients, doctors, hospitals } from '../data/mockData'

export default function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const patient = patients.find((p) => p.id === id)
  const doctor = doctors.find((d) => d.id === patient?.doctorId)
  const hospital = hospitals.find((h) => h.id === patient?.hospitalId)

  if (!patient) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-slate-600">Patient not found.</p>
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
          <p className="text-sm text-slate-500">Patient profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">{patient.name}</h1>
          <p className="text-slate-600">
            {patient.age} yrs • {patient.gender}
          </p>
        </div>
        <Badge variant="info">{hospital?.name ?? 'No hospital'}</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate('/patients')}>
            Back to list
          </Button>
          <Button>Edit profile</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Appointment History</CardTitle>
          </CardHeader>
          <CardContent className="table-scroll">
            <Table>
              <THead>
                <TR>
                  <TH>Date</TH>
                  <TH>Doctor</TH>
                  <TH>Reason</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {patient.appointments.map((appt, idx) => (
                  <TR key={idx}>
                    <TD>{appt.date}</TD>
                    <TD>{appt.doctor}</TD>
                    <TD>{appt.reason}</TD>
                    <TD>
                      <Badge variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'danger' : 'info'}>
                        {appt.status}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {patient.appointments.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">No appointments recorded.</p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Care Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-600">Primary doctor</p>
            <p className="font-semibold text-slate-900">{doctor?.name ?? 'Unassigned'}</p>
            <p className="text-sm text-slate-600">{doctor?.specialization}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {patient.records.map((record, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {record}
            </div>
          ))}
          {patient.records.length === 0 ? (
            <p className="text-sm text-slate-500">No records uploaded.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

