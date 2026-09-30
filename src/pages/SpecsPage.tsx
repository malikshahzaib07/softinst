import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Cpu, HelpCircle, Radar, RefreshCw, XCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import GuiWindow from '../components/GuiWindow'
import { APPS } from '../data/apps'
import { useSoftInst } from '../context/SoftInstContext'
import { checkCompat, formatBytesHint, type CompatLevel } from '../lib/specs'

const levelStyle: Record<CompatLevel, string> = {
  ok: 'bg-lime border-ink',
  warn: 'bg-sun border-ink',
  no: 'bg-coral text-white border-ink',
  unknown: 'bg-white border-ink/30',
}

export default function SpecsPage() {
  const { specs, scanning, scanError, scan, selectedApps, toggle } = useSoftInst()

  useEffect(() => {
    if (!specs && !scanning) void scan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const list = selectedApps.length > 0 ? selectedApps : APPS.filter((a) => a.popular)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-grape px-3 py-1 text-xs font-black text-white">
            <Radar className="h-3.5 w-3.5" />
            Hardware probe
          </p>
          <h1 className="font-display mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Will it run
            <span className="text-teal"> on this PC?</span>
          </h1>
          <p className="mt-4 max-w-lg text-base font-bold leading-relaxed text-ink/70">
            SoftInst reads what the browser is allowed to see — CPU cores, approximate RAM, GPU, OS, screen — then
            compares it against real minimums for every app in the catalog. Nothing is uploaded. Nothing is stored on a
            server.
          </p>
          <button
            type="button"
            onClick={() => void scan()}
            disabled={scanning}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-teal px-5 py-3 font-display text-lg font-black text-ink gui-shadow disabled:opacity-60"
          >
            <RefreshCw className={`h-5 w-5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning…' : specs ? 'Scan again' : 'Scan this PC'}
          </button>
        </div>
        <div className="overflow-hidden rounded-[32px] border-[3px] border-ink gui-shadow-lg">
          <img src="/images/specs-illustration.png" alt="PC hardware diagnostics" className="w-full" />
        </div>
      </div>

      <div className="relative mt-10">
        <GuiWindow title="SystemInformation.exe" accent="bg-sun">
          {scanning && (
            <div className="relative overflow-hidden bg-ink p-10 text-center text-sun">
              <div className="scan-line pointer-events-none absolute inset-x-8 h-12 rounded-full bg-lime/40 blur-md" />
              <Cpu className="mx-auto h-10 w-10 animate-pulse" />
              <p className="font-display mt-3 text-xl font-black">Reading hardware…</p>
              <p className="text-sm font-bold text-cream/70">Cores, RAM hint, GPU renderer, OS, storage quota</p>
            </div>
          )}

          {!scanning && scanError && (
            <p className="p-6 font-bold text-coral">{scanError}</p>
          )}

          {!scanning && specs && (
            <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              <SpecCell label="Operating system" value={`${specs.osName} ${specs.osVersion}`.trim()} hint={specs.isWindows ? 'Installer compatible' : 'Installer needs Windows'} />
              <SpecCell label="CPU cores" value={specs.cores ? String(specs.cores) : 'Unknown'} hint="navigator.hardwareConcurrency" />
              <SpecCell
                label="Memory"
                value={specs.ramGB ? `~${specs.ramGB} GB` : 'Hidden'}
                hint={specs.ramSource === 'deviceMemory' ? 'navigator.deviceMemory (Chrome hint, often a floor)' : 'Browser did not expose RAM'}
              />
              <SpecCell label="Architecture" value={specs.architecture} hint={specs.platform} />
              <SpecCell label="GPU" value={specs.gpu} hint={specs.gpuVendor} wide />
              <SpecCell label="Display" value={`${specs.screen} @ ${specs.pixelRatio}x`} hint={specs.touch ? 'Touch available' : 'No touch'} />
              <SpecCell
                label="Network"
                value={specs.connection}
                hint={specs.downlinkMbps != null ? `~${specs.downlinkMbps} Mbps downlink hint` : specs.browser}
              />
              <SpecCell
                label="Storage quota"
                value={specs.storageQuotaGB != null ? `${specs.storageQuotaGB} GB` : 'Unknown'}
                hint={specs.storageUsageGB != null ? `${specs.storageUsageGB} GB used by this origin` : 'navigator.storage.estimate'}
              />
            </div>
          )}
        </GuiWindow>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-black">Compatibility board</h2>
            <p className="text-sm font-bold text-ink/60">
              {selectedApps.length > 0
                ? 'Checking the apps you ticked in the picker.'
                : 'No apps ticked yet — showing popular titles. Tick apps on the picker for a custom report.'}
            </p>
          </div>
          <Link to="/" className="rounded-xl border-[3px] border-ink bg-white px-3 py-2 text-sm font-black gui-shadow">
            Back to picker
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((app) => {
            const c = checkCompat(app, specs)
            const Icon = c.level === 'ok' ? CheckCircle2 : c.level === 'no' ? XCircle : c.level === 'warn' ? AlertTriangle : HelpCircle
            return (
              <motion.button
                key={app.id}
                type="button"
                layout
                onClick={() => toggle(app.id)}
                className={`rounded-2xl border-[3px] p-4 text-left ${levelStyle[c.level]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg font-black">{app.name}</p>
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                <p className="text-xs font-bold opacity-70">{app.vendor} · {formatBytesHint(app.minDiskMB)} · {app.minRamGB}+ GB RAM</p>
                <ul className="mt-2 space-y-1 text-xs font-bold">
                  {c.reasons.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </motion.button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SpecCell({
  label,
  value,
  hint,
  wide,
}: {
  label: string
  value: string
  hint?: string
  wide?: boolean
}) {
  return (
    <div className={`bg-white p-4 ${wide ? 'sm:col-span-2' : ''}`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">{label}</p>
      <p className="font-display mt-1 text-lg font-black leading-snug">{value}</p>
      {hint && <p className="mt-1 text-xs font-bold text-ink/50">{hint}</p>}
    </div>
  )
}
