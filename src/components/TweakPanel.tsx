import { useState } from 'react'
import {
  Eraser,
  Gauge,
  Globe,
  Lock,
  Power,
  RotateCcw,
  Trash2,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { TWEAKS, type Tweak, type TweakCategory } from '../data/tweaks'
import { useSoftInst } from '../context/SoftInstContext'
import GuiWindow from './GuiWindow'

const CATEGORY_META: Record<TweakCategory, { name: string; blurb: string; color: string; icon: LucideIcon }> = {
  cleanup: { name: 'Cleanup', blurb: 'Reclaim disk and drop leftovers', color: 'bg-peach', icon: Eraser },
  performance: { name: 'Performance', blurb: 'Trim startup and background work', color: 'bg-sky', icon: Gauge },
  network: { name: 'Network', blurb: 'Network stack and DNS sanity', color: 'bg-teal', icon: Globe },
  privacy: { name: 'Privacy', blurb: 'Cut telemetry and ad noise', color: 'bg-grape text-white', icon: Lock },
  system: { name: 'System', blurb: 'Power, services and maintenance', color: 'bg-grape text-white', icon: Power },
}

const CATEGORY_ORDER: TweakCategory[] = ['cleanup', 'performance', 'network', 'privacy', 'system']

const TWEAK_ICONS: Record<string, LucideIcon> = {
  Eraser,
  Gauge,
  Globe,
  Lock,
  Power,
  Wrench,
  Trash2,
  RotateCcw,
}

const RISK_STYLE: Record<Tweak['risk'], string> = {
  safe: 'bg-lime text-ink',
  moderate: 'bg-sun text-ink',
  reboot: 'bg-coral text-white',
}

const RISK_LABEL: Record<Tweak['risk'], string> = {
  safe: 'Safe',
  moderate: 'Moderate',
  reboot: 'Needs reboot',
}

export default function TweakPanel() {
  const { tweaks, toggleTweak, setTweaks, clearTweaks, selectedTweaks } = useSoftInst()
  const [open, setOpen] = useState<string | null>(null)

  const groups = CATEGORY_ORDER.map((id) => {
    const items = TWEAKS.filter((t) => t.category === id)
    return { id, items }
  }).filter((g) => g.items.length > 0)

  const rebootCount = selectedTweaks.filter((t) => t.needsReboot).length

  return (
    <section id="tweaks" className="mt-12 scroll-mt-24">
      <GuiWindow
        title="SoftInstTweaks.exe"
        accent="bg-sun"
        toolbar={
          <div className="flex flex-wrap items-center gap-3 border-b-[3px] border-ink bg-cream px-4 py-3">
            <p className="font-display text-base font-black">
              {selectedTweaks.length} tweak{selectedTweaks.length === 1 ? '' : 's'} selected
            </p>
            <span
              className={`rounded-lg border-2 border-ink px-2 py-0.5 text-[10px] font-black ${
                rebootCount > 0 ? 'bg-coral text-white' : 'bg-white text-ink/60'
              }`}
            >
              {rebootCount} need a reboot
            </span>
            <button
              type="button"
              onClick={clearTweaks}
              disabled={selectedTweaks.length === 0}
              className="ml-auto flex items-center gap-1.5 rounded-xl border-2 border-ink bg-white px-3 py-1.5 text-xs font-black transition hover:bg-sun disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear tweaks
            </button>
          </div>
        }
      >
        <div className="divide-y-[3px] divide-ink">
          {groups.map(({ id, items }) => {
            const meta = CATEGORY_META[id]
            const GroupIcon = meta.icon
            const ids = items.map((t) => t.id)
            const ticked = ids.filter((tid) => tweaks.has(tid)).length

            return (
              <div key={id}>
                <div className={`flex flex-wrap items-center gap-3 px-4 py-3 ${meta.color}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink bg-white">
                    <GroupIcon className="h-4 w-4 text-ink" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-black leading-tight">{meta.name}</h3>
                    <p className="text-xs font-bold opacity-70">{meta.blurb}</p>
                  </div>
                  <span className="rounded-lg border-2 border-ink bg-white px-2 py-0.5 text-[10px] font-black text-ink">
                    {ticked}/{items.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTweaks(ids, ticked === ids.length ? 'remove' : 'add')}
                    className="ml-auto rounded-xl border-2 border-ink bg-white px-3 py-1.5 text-xs font-black text-ink transition hover:bg-sun"
                  >
                    {ticked === ids.length ? 'Untick group' : 'Tick all in this group'}
                  </button>
                </div>

                <ul>
                  {items.map((t) => {
                    const on = tweaks.has(t.id)
                    const expanded = open === t.id
                    const Icon = TWEAK_ICONS[t.icon] || Wrench
                    return (
                      <li key={t.id} className="border-t-2 border-ink/10 bg-white">
                        <button
                          type="button"
                          onClick={() => {
                            toggleTweak(t.id)
                            setOpen((prev) => (prev === t.id ? null : t.id))
                          }}
                          aria-expanded={expanded}
                          aria-pressed={on}
                          aria-label={`${t.name}${on ? ', selected' : ''}`}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-cream"
                        >
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[3px] border-ink text-xs font-black ${
                              on ? 'bg-lime' : 'bg-white'
                            }`}
                          >
                            {on ? '✓' : ''}
                          </span>
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink bg-sun text-ink">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="font-display block text-[15px] font-extrabold leading-tight">
                              {t.name}
                            </span>
                            <span className="mt-0.5 block text-[11px] font-bold leading-snug text-ink/60">
                              {t.blurb}
                            </span>
                          </span>
                          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
                            <span
                              className={`rounded-md border-2 border-ink px-1.5 py-0.5 text-[10px] font-black ${RISK_STYLE[t.risk]}`}
                            >
                              {RISK_LABEL[t.risk]}
                            </span>
                          </span>
                        </button>

                        {expanded && (
                          <div className="border-t-2 border-dashed border-ink/20 bg-cream px-4 py-3">
                            <p className="text-xs font-bold leading-relaxed text-ink/75">{t.detail}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <span
                                className={`rounded-md border-2 border-ink px-1.5 py-0.5 text-[10px] font-black ${RISK_STYLE[t.risk]}`}
                              >
                                {RISK_LABEL[t.risk]}
                              </span>
                              {t.needsReboot && (
                                <span className="rounded-md border-2 border-ink bg-coral px-1.5 py-0.5 text-[10px] font-black text-white">
                                  Restart after install
                                </span>
                              )}
                            </div>
                            {on && (
                              <p className="mt-2 flex items-start gap-1.5 text-[11px] font-bold text-ink/60">
                                <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                {t.rollback.length} rollback command
                                {t.rollback.length === 1 ? '' : 's'} ship inside the generated script.
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        <p className="border-t-[3px] border-ink bg-ink px-4 py-3 text-[11px] font-bold leading-relaxed text-cream/70">
          Honest warning: these tweaks run with Administrator rights on your own machine and change real system
          settings. Nothing is uploaded and nothing is sent anywhere. Every tweak you pick ships with its rollback
          commands embedded in the generated script, and you can untick any of them before you download.
        </p>
      </GuiWindow>
    </section>
  )
}
