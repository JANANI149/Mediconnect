import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Modal } from '../../components/ui/modal'
import { patients } from '../../data/mockData'

const basePatient = patients[0]

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(basePatient)
  const [history] = useState(basePatient.appointments)
  const [modalOpen, setModalOpen] = useState(false)
  const form = useForm({
    defaultValues: {
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      address: profile.address,
    },
  })

  function onSubmit(values) {
    setProfile((prev) => ({ ...prev, ...values }))
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm text-slate-500">Patient profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">{profile.name}</h1>
          <p className="text-slate-600">
            {profile.age} yrs • {profile.gender}
          </p>
        </div>
        <Badge variant="info">Active</Badge>
        <div className="ml-auto">
          <Button onClick={() => setModalOpen(true)}>Edit Profile</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Name" value={profile.name} />
            <Detail label="Age" value={profile.age} />
            <Detail label="Gender" value={profile.gender} />
            <Detail label="Address" value={profile.address} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.notifications?.length
              ? profile.notifications.map((note) => (
                  <div key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <p className="font-semibold text-slate-900">{note.type === 'reminder' ? 'Reminder' : 'Update'}</p>
                    <p className="text-slate-700">{note.message}</p>
                  </div>
                ))
              : <p className="text-sm text-slate-500">No notifications right now.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment history</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {history.map((appt, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{appt.doctor}</p>
                  <p className="text-sm text-slate-600">{appt.hospital}</p>
                </div>
                <Badge variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'danger' : 'info'}>
                  {appt.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {appt.date} • {appt.time}
              </p>
              <p className="text-sm text-slate-500">{appt.reason}</p>
            </div>
          ))}
          {history.length === 0 ? <p className="text-sm text-slate-500">No appointments yet.</p> : null}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit profile"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>Save changes</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Name">
            <Input {...form.register('name', { required: true })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Age">
              <Input type="number" {...form.register('age', { required: true })} />
            </Field>
            <Field label="Gender">
              <Select {...form.register('gender')}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </Field>
          </div>
          <Field label="Address">
            <Input {...form.register('address', { required: true })} />
          </Field>
        </form>
      </Modal>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="text-sm text-slate-600">{value}</p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  )
}

