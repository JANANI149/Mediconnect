import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Pencil, Trash2, Eye } from 'lucide-react'
import { doctors as initialDoctors, hospitals } from '../data/mockData'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Modal } from '../components/ui/modal'
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState(initialDoctors)
  const [search, setSearch] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { name: '', specialization: '', hospitalId: hospitals[0]?.id ?? '', experience: '', qualifications: '' },
  })

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
      const matchesHospital = hospitalFilter === 'all' || d.hospitalId === hospitalFilter
      return matchesSearch && matchesHospital
    })
  }, [doctors, search, hospitalFilter])

  function openCreate() {
    setEditing(null)
    form.reset({ name: '', specialization: '', hospitalId: hospitals[0]?.id ?? '', experience: '', qualifications: '' })
    setModalOpen(true)
  }

  function openEdit(record) {
    setEditing(record)
    form.reset(record)
    setModalOpen(true)
  }

  function onSubmit(values) {
    if (editing) {
      setDoctors((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)))
    } else {
      setDoctors((prev) => [...prev, { ...values, id: crypto.randomUUID(), schedule: [] }])
    }
    setModalOpen(false)
  }

  function onDelete(id) {
    setDoctors((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Doctor Management</h1>
        <p className="text-slate-600">Track and maintain provider records and schedules.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center gap-3">
          <CardTitle>Doctors</CardTitle>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="border-none p-0 shadow-none"
              >
                <option value="all">All hospitals</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialty"
              className="w-56"
            />
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="table-scroll">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Specialization</TH>
                <TH>Hospital</TH>
                <TH>Experience</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((doctor) => (
                <TR key={doctor.id}>
                  <TD className="font-semibold text-slate-900">{doctor.name}</TD>
                  <TD>{doctor.specialization}</TD>
                  <TD>{hospitals.find((h) => h.id === doctor.hospitalId)?.name ?? 'N/A'}</TD>
                  <TD>{doctor.experience}</TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/doctors/${doctor.id}`)}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(doctor)}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => onDelete(doctor.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">No doctors match the current filters.</p>
          ) : null}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Doctor' : 'Add Doctor'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>{editing ? 'Save changes' : 'Create doctor'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <Input {...form.register('name', { required: true })} placeholder="Doctor name" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Specialization</label>
            <Input {...form.register('specialization', { required: true })} placeholder="Cardiology, Neurology..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Hospital</label>
              <Select {...form.register('hospitalId')}>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Experience</label>
              <Input {...form.register('experience')} placeholder="e.g. 10 yrs" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Qualifications</label>
            <Input {...form.register('qualifications')} placeholder="MD, FACC" />
          </div>
        </form>
      </Modal>
    </div>
  )
}

