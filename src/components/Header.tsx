import { Cpu, Download, HelpCircle, Menu, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSoftInst } from '../context/SoftInstContext'

const links = [
  { to: '/', label: 'Picker', icon: Download },
  { to: '/specs', label: 'PC Specs', icon: Cpu },
  { to: '/how-it-works', label: 'How it works', icon: Sparkles },
  { to: '/about', label: 'About', icon: HelpCircle },
]

export default function Header() {
  const { selectedApps, setInstallerOpen } = useSoftInst()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-2xl border-[3px] border-ink bg-white px-3 py-2 gui-shadow">
        <Link to="/" className="flex items-center gap-2 pl-1">
          <img src="/images/mascot.png" alt="" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-black tracking-tight">
            <span className="text-coral">Soft</span>
            <span className="text-teal">Inst</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-sm font-extrabold transition ${
                  isActive
                    ? 'border-ink bg-sun text-ink'
                    : 'border-transparent text-ink/70 hover:border-ink hover:bg-cream'
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => selectedApps.length > 0 && setInstallerOpen(true)}
            className="hidden items-center gap-2 rounded-xl border-[3px] border-ink bg-coral px-3 py-1.5 text-sm font-black text-white gui-shadow sm:flex hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0_#1a1a2e]"
          >
            <Download className="h-4 w-4" />
            Get installer
            <span className="rounded-md bg-ink px-1.5 py-0.5 text-xs text-sun">{selectedApps.length}</span>
          </button>
          <button
            type="button"
            className="rounded-xl border-[3px] border-ink bg-sun p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border-[3px] border-ink bg-white p-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 font-extrabold ${
                  isActive ? 'bg-sun' : 'hover:bg-cream'
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
