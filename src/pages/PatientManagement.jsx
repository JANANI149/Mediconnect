import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Pencil, Trash2, Eye } from 'lucide-react'
import { patients as initialPatients, hospitals, doctors } from '../data/mockData'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Modal } from '../components/ui/modal'
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function PatientManagement() {
  const [patients, setPatients] = useState(initialPatients)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { name: '', age: '', gender: 'Male', hospitalId: hospitals[0]?.id ?? '', doctorId: doctors[0]?.id ?? '' },
  })

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesGender = genderFilter === 'all' || p.gender === genderFilter
      return matchesSearch && matchesGender
    })
  }, [patients, search, genderFilter])

  function openCreate() {
    setEditing(null)
    form.reset({ name: '', age: '', gender: 'Male', hospitalId: hospitals[0]?.id ?? '', doctorId: doctors[0]?.id ?? '' })
    setModalOpen(true)
  }

  function openEdit(record) {
    setEditing(record)
    form.reset(record)
    setModalOpen(true)
  }

  function onSubmit(values) {
    if (editing) {
      setPatients((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...values } : p)))
    } else {
      setPatients((prev) => [
        ...prev,
        { ...values, id: crypto.randomUUID(), appointments: [], records: [] },
      ])
    }
    setModalOpen(false)
  }

  function onDelete(id) {
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Patient Management</h1>
        <p className="text-slate-600">Manage patient records, appointments, and continuity of care.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center gap-3">
          <CardTitle>Patients</CardTitle>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="border-none p-0 shadow-none"
              >
                <option value="all">All genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="w-56"
            />
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="table-scroll">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Age</TH>
                <TH>Gender</TH>
                <TH>Primary Doctor</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((patient) => (
                <TR key={patient.id}>
                  <TD className="font-semibold text-slate-900">{patient.name}</TD>
                  <TD>{patient.age}</TD>
                  <TD>{patient.gender}</TD>
                  <TD>{doctors.find((d) => d.id === patient.doctorId)?.name ?? 'N/A'}</TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/patients/${patient.id}`)}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(patient)}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => onDelete(patient.id)}>
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
            <p className="px-4 py-6 text-sm text-slate-500">No patients match the current filters.</p>
          ) : null}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Patient' : 'Add Patient'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>{editing ? 'Save changes' : 'Create patient'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <Input {...form.register('name', { required: true })} placeholder="Patient name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Age</label>
              <Input type="number" {...form.register('age', { required: true })} placeholder="32" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Gender</label>
              <Select {...form.register('gender')}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
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
              <label className="text-sm font-medium text-slate-700">Primary doctor</label>
              <Select {...form.register('doctorId')}>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

