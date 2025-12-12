import { NavLink } from 'react-router-dom'
import { Activity, Bell, FileBarChart, Home, Hospital, Megaphone, Stethoscope, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

const links = [
  { to: '/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/hospitals', label: 'Hospitals', icon: Hospital },
  { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/admin/patients', label: 'Patients', icon: Users },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: FileBarChart },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
]

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:flex">
      <div className="flex w-full flex-col gap-6 px-4 py-6">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Admin</p>
            <p className="text-lg font-semibold text-slate-900">MediConnect</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100',
                  isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700',
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Need help?</p>
          <p className="mt-1 text-slate-600">Visit the admin guide or contact support.</p>
          <a className="mt-3 inline-flex items-center text-sm font-semibold text-sky-600" href="#">
            Open guide
          </a>
        </div>
      </div>
    </aside>
  )
}

