import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Outlet } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <div className={cn('fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg lg:hidden', sidebarOpen ? 'translate-x-0' : '-translate-x-full transition-transform')}>
          <Sidebar />
        </div>
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      ) : null}
    </div>
  )
}

