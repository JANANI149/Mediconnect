import { Menu, Bell, LogOut, Search, Settings } from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState } from 'react'

export function Topbar({ onToggleSidebar }) {
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="relative hidden w-80 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm sm:flex">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search across hospitals, doctors, patients..."
          className="border-none bg-transparent px-0 py-0 shadow-none focus-visible:outline-none"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
          <Avatar initials="AD" />
          <div className="hidden text-left text-sm leading-tight sm:block">
            <p className="font-semibold text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">System Admin</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" aria-label="Logout">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}

