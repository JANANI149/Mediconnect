import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hospitals, doctors, patients } from '../data/mockData'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/table'

export default function HospitalProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hospital = hospitals.find((h) => h.id === id)
  const hospitalDoctors = useMemo(() => doctors.filter((d) => d.hospitalId === id), [id])
  const hospitalPatients = useMemo(() => patients.filter((p) => p.hospitalId === id), [id])

  if (!hospital) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-slate-600">Hospital not found.</p>
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
          <p className="text-sm text-slate-500">Hospital profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">{hospital.name}</h1>
          <p className="text-slate-600">{hospital.location}</p>
        </div>
        <Badge variant={hospital.status === 'Active' ? 'success' : 'warning'}>{hospital.status}</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate('/hospitals')}>
            Back to list
          </Button>
          <Button>Edit details</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-700">Contact</p>
              <p className="mt-1 text-sm text-slate-600">{hospital.phone}</p>
              <p className="text-sm text-slate-600">{hospital.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Services</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.services.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Appointments</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{hospital.appointments}</p>
              <p className="text-sm text-slate-500">Last 30 days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Doctors</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{hospitalDoctors.length}</p>
              <p className="text-sm text-slate-500">Active providers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline">Generate report</Button>
            <Button variant="outline">Approve onboarding</Button>
            <Button variant="outline">Manage access</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctors</CardTitle>
        </CardHeader>
        <CardContent className="table-scroll">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Specialization</TH>
                <TH>Experience</TH>
              </TR>
            </THead>
            <TBody>
              {hospitalDoctors.map((doc) => (
                <TR key={doc.id}>
                  <TD>{doc.name}</TD>
                  <TD>{doc.specialization}</TD>
                  <TD>{doc.experience}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          {hospitalDoctors.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">No doctors assigned.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients & Appointments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Patients</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{hospitalPatients.length}</p>
            <p className="text-sm text-slate-500">Under this facility</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Upcoming appointments</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{hospital.appointments}</p>
            <p className="text-sm text-slate-500">Scheduled this month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

