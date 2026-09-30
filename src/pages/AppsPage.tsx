import { useMemo } from 'react'
import { Search } from 'lucide-react'
import AppCard from '../components/AppCard'
import GuiWindow from '../components/GuiWindow'
import { APPS, CATEGORIES } from '../data/apps'
import { useSoftInst } from '../context/SoftInstContext'

export default function AppsPage() {
  const { query, setQuery, category, setCategory, selectedApps, selectMany, specs } = useSoftInst()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return APPS.filter((app) => {
      if (category !== 'all' && app.category !== category) return false
      if (!q) return true
      return (
        app.name.toLowerCase().includes(q) ||
        app.vendor.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.wingetId.toLowerCase().includes(q)
      )
    })
  }, [category, query])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const app of APPS) map.set(app.category, (map.get(app.category) ?? 0) + 1)
    return map
  }, [])

  const activeCategory = category === 'all' ? null : CATEGORIES.find((c) => c.id === category) ?? null
  const activeIds = useMemo(
    () => (activeCategory ? APPS.filter((a) => a.category === activeCategory.id).map((a) => a.id) : []),
    [activeCategory],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6">
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
        App <span className="text-teal">picker</span>
      </h1>
      <p className="mt-3 max-w-2xl text-base font-bold leading-relaxed text-ink/70">
        Tick the software you want. Every entry is a real Windows program with a real package behind it, and your
        selection is kept while you browse the tweaks page — you can come back and add more at any time.
      </p>

      {specs && (
        <section className="mt-8">
          <GuiWindow title="SystemInformation.exe" accent="bg-sun">
            <div className="border-b-[3px] border-ink bg-cream px-4 py-2">
              <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-ink/70">
                <span className="rounded-md border-2 border-ink bg-lime px-1.5 py-0.5 text-[10px] font-black uppercase">
                  auto
                </span>
                Read locally in your browser from navigator, screen and storage APIs. Never uploaded, never stored.
              </p>
            </div>
            <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
              <SpecCell
                label="Operating system"
                value={`${specs.osName} ${specs.osVersion}`.trim()}
                hint={specs.isWindows ? 'Installer compatible' : 'Installer needs Windows'}
              />
              <SpecCell
                label="CPU cores"
                value={specs.cores ? String(specs.cores) : 'Unknown'}
                hint="navigator.hardwareConcurrency"
              />
              <SpecCell
                label="Memory"
                value={specs.ramGB ? `~${specs.ramGB} GB` : 'Hidden'}
                hint={
                  specs.ramSource === 'deviceMemory'
                    ? 'navigator.deviceMemory (a floor, not exact)'
                    : 'Browser did not expose RAM'
                }
              />
              <SpecCell label="GPU" value={specs.gpu} hint={specs.gpuVendor} />
              <SpecCell
                label="Display"
                value={`${specs.screen} @ ${specs.pixelRatio}x`}
                hint={specs.touch ? 'Touch available' : 'No touch'}
              />
              <SpecCell
                label="Network"
                value={specs.connection}
                hint={specs.downlinkMbps != null ? `~${specs.downlinkMbps} Mbps downlink hint` : specs.browser}
              />
            </div>
          </GuiWindow>
        </section>
      )}

      <section className="mt-8">
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
                  aria-label="Search apps"
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
              {CATEGORIES.map((c) => (
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
                  <span className="text-[10px] text-ink/50">{counts.get(c.id) ?? 0}</span>
                </button>
              ))}
              {activeCategory && (
                <button
                  type="button"
                  onClick={() => selectMany(activeIds, 'add')}
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

function SpecCell({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">{label}</p>
      <p className="font-display mt-1 text-lg font-black leading-snug">{value}</p>
      {hint && <p className="mt-1 text-xs font-bold text-ink/50">{hint}</p>}
    </div>
  )
}
