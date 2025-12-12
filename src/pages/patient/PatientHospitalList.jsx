import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hospitals } from '../../data/mockData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'

export default function PatientHospitalList() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('all')
  const [service, setService] = useState('all')
  const [rating, setRating] = useState('all')
  const navigate = useNavigate()

  const locations = Array.from(new Set(hospitals.map((h) => h.location)))
  const services = Array.from(new Set(hospitals.flatMap((h) => h.services)))

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase())
      const matchesLocation = location === 'all' || h.location === location
      const matchesService = service === 'all' || h.services.includes(service)
      const matchesRating = rating === 'all' || h.rating >= Number(rating)
      return matchesSearch && matchesLocation && matchesService && matchesRating
    })
  }, [search, location, service, rating])

  function reset() {
    setSearch('')
    setLocation('all')
    setService('all')
    setRating('all')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Hospitals</h1>
          <p className="text-slate-600">Search and filter hospitals to book your next visit.</p>
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
            <Select value={location} onChange={(e) => setLocation(e.target.value)} className="w-40">
              <option value="all">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
            <Select value={service} onChange={(e) => setService(e.target.value)} className="w-44">
              <option value="all">All services</option>
              {services.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </Select>
            <Select value={rating} onChange={(e) => setRating(e.target.value)} className="w-36">
              <option value="all">Any rating</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </Select>
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((hosp) => (
          <Card key={hosp.id} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{hosp.name}</CardTitle>
                  <p className="text-sm text-slate-600">{hosp.location}</p>
                </div>
                <Badge variant="success">{hosp.rating} ★</Badge>
              </div>
              <p className="text-sm text-slate-600">{hosp.description}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {hosp.services.map((svc) => (
                  <Badge key={svc}>{svc}</Badge>
                ))}
              </div>
              <Button onClick={() => navigate(`/patient/hospitals/${hosp.id}`)}>View Details</Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 ? <p className="text-sm text-slate-500">No hospitals match your filters.</p> : null}
      </div>
    </div>
  )
}

