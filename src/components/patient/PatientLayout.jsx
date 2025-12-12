import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Activity, CalendarDays, Home, Hospital, Stethoscope, User } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

const links = [
  { to: '/patient/profile', label: 'Profile', icon: User },
  { to: '/patient/hospitals', label: 'Hospitals', icon: Hospital },
  { to: '/patient/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/patient/book', label: 'Book', icon: CalendarDays },
  { to: '/patient/appointments', label: 'History', icon: Home },
]

export function PatientLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Patient</p>
              <p className="text-sm font-semibold text-slate-900">MediConnect</p>
            </div>
          </NavLink>
          <nav className="ml-auto flex items-center gap-2 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-700 hover:bg-slate-100',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <Button asChild size="sm" variant="outline">
            <NavLink to="/admin">Admin</NavLink>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

