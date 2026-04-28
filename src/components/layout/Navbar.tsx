import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LINKS = [
  { to: '/summary',      label: 'Summary' },
  { to: '/assets',       label: 'Assets' },
  { to: '/incomes',      label: 'Incomes' },
  { to: '/expenses',     label: 'Expenses' },
  { to: '/subscription', label: 'Email' },
  { to: '/profile',      label: 'Profile' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-mint' : 'text-white/80 hover:text-white'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive ? 'bg-white/10 text-mint' : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`

  return (
    <>
      <nav className="bg-navy sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/summary" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Financial Hub" className="w-8 h-8" />
            <span className="text-white font-semibold text-sm hidden sm:block">Financial Hub</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors ml-2"
            >
              Sign out
            </button>
          </div>

          {/* Hamburger button (mobile) */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-navy shadow-xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Financial Hub" className="w-7 h-7" />
            <span className="text-white font-semibold text-sm">Financial Hub</span>
          </div>
          <button
            className="text-white/70 hover:text-white p-1"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={mobileLinkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Sign out */}
        <div className="px-2 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
