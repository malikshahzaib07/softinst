import { memo } from 'react'
import { motion } from 'framer-motion'
import type { AppSoftware } from '../data/apps'
import { useSoftInst } from '../context/SoftInstContext'
import { checkCompat, formatBytesHint } from '../lib/specs'
import Logo from './Logo'

const badge: Record<string, string> = {
  ok: 'bg-lime text-ink',
  warn: 'bg-sun text-ink',
  no: 'bg-coral text-white',
  unknown: 'bg-white text-ink/60',
}

const badgeText: Record<string, string> = {
  ok: 'Can run',
  warn: 'Tight',
  no: 'No',
  unknown: '?',
}

function AppCard({ app }: { app: AppSoftware }) {
  const { isSelected, toggle, specs } = useSoftInst()
  const on = isSelected(app.id)
  const compat = checkCompat(app, specs)

  return (
    <motion.button
      type="button"
      layout
      whileTap={{ scale: 0.97 }}
      onClick={() => toggle(app.id)}
      aria-pressed={on}
      aria-label={`${app.name}${on ? ', selected' : ''}`}
      className={`group relative flex w-full flex-col items-start rounded-2xl border-[3px] p-3 text-left transition ${
        on ? 'border-ink bg-white gui-shadow' : 'border-ink/20 bg-white/80 hover:border-ink'
      }`}
      style={{ backgroundImage: on ? `linear-gradient(180deg, ${app.color}22, transparent 55%)` : undefined }}
    >
      <span
        className={`absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-md border-[3px] border-ink text-xs font-black ${
          on ? 'bg-lime' : 'bg-white'
        }`}
      >
        {on ? '✓' : ''}
      </span>

      {/* Always the real product mark: Logo walks bundled SVG -> vendor favicon ->
          monogram. The generic lucide glyph is a last resort behind all three. */}
      <Logo
        src={app.logo}
        fallbackSrc={app.logoFallback}
        alt={app.name}
        brand={app.color}
        size={44}
        className="mb-2"
      />

      <span className="pr-6 font-display text-[15px] font-extrabold leading-tight">{app.name}</span>
      <span className="mt-0.5 text-xs font-bold text-ink/50">{app.vendor}</span>
      <span className="mt-2 line-clamp-2 text-[11px] font-semibold leading-snug text-ink/70">{app.description}</span>

      <div className="mt-auto flex w-full flex-wrap items-center gap-1 pt-2">
        <span className="rounded-md border-2 border-ink/15 bg-cream px-1.5 py-0.5 text-[10px] font-extrabold">
          {formatBytesHint(app.minDiskMB)}
        </span>
        <span className="rounded-md border-2 border-ink/15 bg-cream px-1.5 py-0.5 text-[10px] font-extrabold">
          {app.minRamGB}+ GB RAM
        </span>
        {specs && (
          <span className={`rounded-md border-2 border-ink px-1.5 py-0.5 text-[10px] font-black ${badge[compat.level]}`}>
            {badgeText[compat.level]}
          </span>
        )}
      </div>
    </motion.button>
  )
}

export default memo(AppCard)
