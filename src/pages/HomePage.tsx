import { motion } from 'framer-motion'
import {
  Check,
  Cpu,
  Download,
  Search,
  Sparkles,
  VolumeX,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AppCard from '../components/AppCard'
import GuiWindow from '../components/GuiWindow'
import { APPS, CATEGORIES, PRESETS } from '../data/apps'
import { useSoftInst } from '../context/SoftInstContext'

export default function HomePage() {
  const { query, setQuery, category, setCategory, applyPreset, selectedApps, selectMany } = useSoftInst()

  const filtered = APPS.filter((app) => {
    if (category !== 'all' && app.category !== category) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      app.name.toLowerCase().includes(q) ||
      app.vendor.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.wingetId.toLowerCase().includes(q)
    )
  })

  const popular = APPS.filter((a) => a.popular)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6">
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-3 py-1 text-xs font-black">
            <Sparkles className="h-3.5 w-3.5" />
            Silent multi-app installer for Windows
          </div>
          <h1 className="font-display mt-4 text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Tick the apps.
            <br />
            <span className="text-coral">Get one installer.</span>
            <br />
            Walk away.
          </h1>
          <p className="mt-5 max-w-xl text-base font-bold leading-relaxed text-ink/70 sm:text-lg">
            SoftInst is a colorful, Ninite-style picker. Choose real software — Chrome, VLC, 7-Zip, Discord, VS Code,
            Steam — then download a silent installer that talks to Windows Package Manager. No toolbars, no accounts,
            no fake catalog.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#picker"
              className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-lg font-black text-white gui-shadow"
            >
              <Download className="h-5 w-5" />
              Open the picker
            </a>
            <Link
              to="/specs"
              className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-display text-lg font-black gui-shadow"
            >
              <Cpu className="h-5 w-5" />
              Check PC specs
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-extrabold">
            {[
              { icon: VolumeX, t: 'Silent installs' },
              { icon: Check, t: 'Official winget IDs' },
              { icon: Cpu, t: 'Specs compatibility' },
            ].map((b) => (
              <span key={b.t} className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1">
                <b.icon className="h-3.5 w-3.5" />
                {b.t}
              </span>
            ))}
          </div>
        </div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
          <div className="overflow-hidden rounded-[32px] border-[3px] border-ink bg-white gui-shadow-lg">
            <img src="/images/hero-install.png" alt="SoftInst installing many apps at once" className="h-auto w-full" />
          </div>
          <img
            src="/images/mascot.png"
            alt=""
            className="absolute -bottom-8 -left-6 h-28 w-28 drop-shadow-[6px_6px_0_#1a1a2e] sm:h-36 sm:w-36"
          />
        </motion.div>
      </section>

      <div className="mt-10 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink py-2">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4 font-display text-sm font-black text-sun">
          {[...popular, ...popular].map((a, i) => (
            <span key={a.id + i} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
              {a.name}
            </span>
          ))}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-black">One-click kits</h2>
        <p className="mt-1 text-sm font-bold text-ink/60">Drop a whole starter stack into the picker.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              className="rounded-2xl border-[3px] border-ink bg-white p-4 text-left gui-shadow hover:-translate-y-0.5"
            >
              <span className="inline-block rounded-lg border-2 border-ink px-2 py-0.5 text-[10px] font-black uppercase" style={{ background: p.color }}>
                {p.appIds.length} apps
              </span>
              <p className="font-display mt-2 text-lg font-black">{p.name}</p>
              <p className="text-xs font-bold text-ink/60">{p.blurb}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="picker" className="mt-12 scroll-mt-24">
        <GuiWindow
          title="SoftInst App Picker.exe"
          accent="bg-teal"
          toolbar={
            <div className="flex flex-col gap-3 border-b-[3px] border-ink bg-cream p-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Chrome, VLC, 7-Zip, VS Code…"
                  className="w-full rounded-xl border-[3px] border-ink bg-white py-2 pl-9 pr-3 text-sm font-bold outline-none"
                />
              </div>
              <p className="shrink-0 text-xs font-extrabold text-ink/60">
                {filtered.length} shown · {selectedApps.length} ticked · {APPS.length} real apps in catalog
              </p>
            </div>
          }
        >
          <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
            <aside className="border-b-[3px] border-ink bg-white p-3 lg:border-b-0 lg:border-r-[3px]">
              <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest text-ink/40">Categories</p>
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm font-extrabold ${
                  category === 'all' ? 'border-2 border-ink bg-sun' : 'hover:bg-cream'
                }`}
              >
                All software
              </button>
              {CATEGORIES.map((c) => {
                const count = APPS.filter((a) => a.category === c.id).length
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-extrabold ${
                      category === c.id ? 'border-2 border-ink bg-white' : 'hover:bg-cream'
                    }`}
                    style={category === c.id ? { background: `${c.color}55` } : undefined}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-ink/50">{count}</span>
                  </button>
                )
              })}
              {category !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    const ids = APPS.filter((a) => a.category === category).map((a) => a.id)
                    selectMany(ids, 'add')
                  }}
                  className="mt-3 w-full rounded-xl border-2 border-ink bg-lime px-3 py-2 text-xs font-black"
                >
                  Tick entire category
                </button>
              )}
            </aside>
            <div className="bg-white p-3">
              {filtered.length === 0 ? (
                <p className="p-8 text-center font-extrabold text-ink/50">Nothing matches that search.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </GuiWindow>
      </section>
    </div>
  )
}
