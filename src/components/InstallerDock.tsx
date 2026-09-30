import { Download, Trash2, Wrench, X } from 'lucide-react'
import { useSoftInst } from '../context/SoftInstContext'

export default function InstallerDock() {
  const {
    selectedApps,
    selectedTweaks,
    toggle,
    toggleTweak,
    clear,
    clearTweaks,
    setInstallerOpen,
    hasWork,
  } = useSoftInst()

  if (!hasWork) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col gap-2 rounded-2xl border-[3px] border-ink bg-ink p-3 text-cream gui-shadow-lg sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-thin">
            {selectedApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => toggle(app.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-white/20 bg-white/10 px-2.5 py-1 text-xs font-extrabold hover:bg-coral"
                title={`Remove ${app.name}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: app.color }} />
                {app.name}
                <X className="h-3 w-3 opacity-70" />
              </button>
            ))}
          </div>
          {selectedTweaks.length > 0 && (
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-thin">
              {selectedTweaks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTweak(t.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-sun/40 bg-sun/15 px-2.5 py-1 text-xs font-extrabold text-sun hover:bg-coral hover:text-white"
                  title={`Remove tweak ${t.name}`}
                >
                  <Wrench className="h-3 w-3" />
                  {t.name}
                  <X className="h-3 w-3 opacity-70" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              clear()
              clearTweaks()
            }}
            className="flex items-center gap-1 rounded-xl border-2 border-white/20 px-3 py-2 text-xs font-black hover:bg-white/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => setInstallerOpen(true)}
            className="flex items-center gap-2 rounded-xl border-[3px] border-sun bg-coral px-4 py-2 text-sm font-black text-white"
          >
            <Download className="h-4 w-4" />
            Get SoftInst
            <span className="rounded-md bg-ink px-1.5 text-sun">
              {selectedApps.length + selectedTweaks.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
