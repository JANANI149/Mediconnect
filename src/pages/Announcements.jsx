import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Calendar, Pencil, Trash2 } from 'lucide-react'
import { announcements as initialAnnouncements } from '../data/mockData'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import { Modal } from '../components/ui/modal'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const form = useForm({ defaultValues: { title: '', message: '', date: '', scheduled: false } })

  function openCreate() {
    setEditing(null)
    form.reset({ title: '', message: '', date: '', scheduled: false })
    setModalOpen(true)
  }

  function openEdit(record) {
    setEditing(record)
    form.reset(record)
    setModalOpen(true)
  }

  function onSubmit(values) {
    if (editing) {
      setAnnouncements((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...values } : a)))
    } else {
      setAnnouncements((prev) => [...prev, { ...values, id: crypto.randomUUID() }])
    }
    setModalOpen(false)
  }

  function onDelete(id) {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Announcements</h1>
          <p className="text-slate-600">Broadcast updates and scheduled notices to your network.</p>
        </div>
        <div className="ml-auto">
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {announcements.map((item) => (
          <Card key={item.id}>
            <CardHeader className="items-start">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-sm text-slate-600">{item.message}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                  <Badge variant={item.scheduled ? 'info' : 'success'}>
                    {item.scheduled ? 'Scheduled' : 'Published'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => onDelete(item.id)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {announcements.length === 0 ? <p className="text-sm text-slate-500">No announcements yet.</p> : null}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Announcement' : 'New Announcement'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>{editing ? 'Save changes' : 'Publish'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <Input {...form.register('title', { required: true })} placeholder="Announcement title" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Message</label>
            <Textarea rows={4} {...form.register('message', { required: true })} placeholder="Details to share..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Schedule date</label>
              <Input type="date" {...form.register('date')} />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-sm font-medium text-slate-700">Schedule</span>
              <Switch checked={form.watch('scheduled')} onChange={(checked) => form.setValue('scheduled', checked)} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

