import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doctors, hospitals } from '../../data/mockData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'

export default function PatientDoctorList() {
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('all')
  const [hospitalId, setHospitalId] = useState('all')
  const [availability, setAvailability] = useState('all')
  const navigate = useNavigate()

  const specializations = Array.from(new Set(doctors.map((d) => d.specialization)))

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
      const matchesSpec = specialization === 'all' || d.specialization === specialization
      const matchesHosp = hospitalId === 'all' || d.hospitalId === hospitalId
      const matchesAvail = availability === 'all' || d.availability === availability
      return matchesSearch && matchesSpec && matchesHosp && matchesAvail
    })
  }, [search, specialization, hospitalId, availability])

  function reset() {
    setSearch('')
    setSpecialization('all')
    setHospitalId('all')
    setAvailability('all')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Doctors</h1>
          <p className="text-slate-600">Find specialists and book appointments.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center gap-3">
          <CardTitle>Search & Filters</CardTitle>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="w-48"
            />
            <Select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-44">
              <option value="all">All specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </Select>
            <Select value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} className="w-48">
              <option value="all">All hospitals</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
            <Select value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-40">
              <option value="all">Any availability</option>
              <option value="Available this week">Available this week</option>
              <option value="Accepting new patients">Accepting new patients</option>
              <option value="Limited slots">Limited slots</option>
            </Select>
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((doc) => {
          const hospital = hospitals.find((h) => h.id === doc.hospitalId)
          return (
            <Card key={doc.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{doc.name}</CardTitle>
                  <p className="text-sm text-slate-600">{doc.qualifications}</p>
                </div>
                <Badge variant="success">{doc.rating} ★</Badge>
              </div>
              <div className="text-sm text-slate-600">
                <p>{doc.specialization}</p>
                <p>{doc.experience} • {hospital?.name}</p>
                <p>Timings: {doc.consultationTimings}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/patient/doctors/${doc.id}`)}>
                  View Profile
                </Button>
                <Button onClick={() => navigate('/patient/book', { state: { hospitalId: doc.hospitalId, doctorId: doc.id } })}>
                  Book Now
                </Button>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 ? <p className="text-sm text-slate-500">No doctors match your filters.</p> : null}
      </div>
    </div>
  )
}

