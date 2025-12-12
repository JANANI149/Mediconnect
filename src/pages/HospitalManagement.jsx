import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Pencil, Trash2, Eye } from 'lucide-react'
import { hospitals as initialHospitals } from '../data/mockData'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Modal } from '../components/ui/modal'
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState(initialHospitals)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: { name: '', location: '', status: 'Active', phone: '', email: '' },
  })

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || h.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [hospitals, search, statusFilter])

  function openCreate() {
    setEditing(null)
    form.reset({ name: '', location: '', status: 'Active', phone: '', email: '' })
    setModalOpen(true)
  }

  function openEdit(record) {
    setEditing(record)
    form.reset(record)
    setModalOpen(true)
  }

  function onSubmit(values) {
    if (editing) {
      setHospitals((prev) => prev.map((h) => (h.id === editing.id ? { ...h, ...values } : h)))
    } else {
      setHospitals((prev) => [...prev, { ...values, id: crypto.randomUUID(), services: [], doctors: [], appointments: 0 }])
    }
    setModalOpen(false)
  }

  function onDelete(id) {
    setHospitals((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Hospital Management</h1>
        <p className="text-slate-600">Administer hospital onboarding, visibility, and profiles.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center gap-3">
          <CardTitle>Hospitals</CardTitle>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border-none p-0 shadow-none">
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </Select>
            </div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location"
              className="w-56"
            />
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Hospital
            </Button>
          </div>
        </CardHeader>
        <CardContent className="table-scroll">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Location</TH>
                <TH>Status</TH>
                <TH>Appointments</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((hospital) => (
                <TR key={hospital.id}>
                  <TD className="font-semibold text-slate-900">{hospital.name}</TD>
                  <TD>{hospital.location}</TD>
                  <TD>
                    <Badge variant={hospital.status === 'Active' ? 'success' : 'warning'}>{hospital.status}</Badge>
                  </TD>
                  <TD>{hospital.appointments}</TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/hospitals/${hospital.id}`)}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(hospital)}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => onDelete(hospital.id)}>
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
            <p className="px-4 py-6 text-sm text-slate-500">No hospitals match the current filters.</p>
          ) : null}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Hospital' : 'Add Hospital'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>{editing ? 'Save changes' : 'Create hospital'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <Input {...form.register('name', { required: true })} placeholder="Hospital name" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Location</label>
            <Input {...form.register('location', { required: true })} placeholder="City, State" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select {...form.register('status')}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <Input {...form.register('phone')} placeholder="(555) 123-4567" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input type="email" {...form.register('email')} placeholder="admin@hospital.com" />
          </div>
        </form>
      </Modal>
    </div>
  )
}

