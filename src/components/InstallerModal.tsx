import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Copy, Download, FileCode, Terminal, Wrench, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSoftInst } from '../context/SoftInstContext'
import {
  downloadTextFile,
  generateBatch,
  generateOneLiner,
  generatePowerShell,
  slugFor,
  type GenerateOptions,
  type InstallMethod,
} from '../lib/installer'
import { checkCompat, formatBytesHint } from '../lib/specs'

const METHODS: { id: InstallMethod; label: string; blurb: string; color: string }[] = [
  {
    id: 'auto',
    label: 'Auto-detect',
    blurb: 'Recommended. Probes the target PC for winget, Chocolatey and Scoop, then uses the first one present.',
    color: 'bg-lime',
  },
  {
    id: 'winget',
    label: 'winget',
    blurb: 'Force Windows Package Manager. Best coverage for Microsoft Store and App Installer packages.',
    color: 'bg-sky',
  },
  {
    id: 'choco',
    label: 'Chocolatey',
    blurb: 'Force the community choco CLI. Skips apps with no Chocolatey package.',
    color: 'bg-peach',
  },
  {
    id: 'scoop',
    label: 'Scoop',
    blurb: 'Force Scoop, the per-user Windows package manager. Fast, but only for apps it carries.',
    color: 'bg-grape text-white',
  },
  {
    id: 'direct',
    label: 'Direct from vendor',
    blurb: 'Bypass package managers and fetch the vendor installer URL for each app directly.',
    color: 'bg-sun',
  },
]

export default function InstallerModal() {
  const {
    installerOpen,
    setInstallerOpen,
    selectedApps,
    selectedTweaks,
    specs,
    method,
    setMethod,
    includeTweaks,
    setIncludeTweaks,
    hasWork,
  } = useSoftInst()
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<'ps1' | 'oneliner'>('ps1')

  const ps1Name = 'SoftInst-Installer.ps1'

  const opts = useMemo<GenerateOptions>(
    () => ({
      method,
      includeTweaks,
      tweaks: includeTweaks ? selectedTweaks : [],
      ps1Name,
    }),
    [method, includeTweaks, selectedTweaks, ps1Name],
  )

  const script = useMemo(() => generatePowerShell(selectedApps, opts), [selectedApps, opts])
  const oneliner = useMemo(() => generateOneLiner(selectedApps, opts), [selectedApps, opts])
  const batch = useMemo(() => generateBatch(selectedApps, opts), [selectedApps, opts])

  const totalDisk = selectedApps.reduce((s, a) => s + a.minDiskMB, 0)
  const slug = useMemo(() => slugFor(selectedApps), [selectedApps])

  const issues = useMemo(
    () =>
      selectedApps
        .map((a) => ({ app: a, compat: checkCompat(a, specs) }))
        .filter((x) => x.compat.level === 'no' || x.compat.level === 'warn'),
    [selectedApps, specs],
  )

  if (!hasWork) return null

  function grabInstaller() {
    // Browsers can collapse rapid-fire downloads, so stagger them.
    downloadTextFile(ps1Name, script)
    setTimeout(() => {
      downloadTextFile(`SoftInst-${slug}.cmd`, batch)
    }, 350)
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {installerOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setInstallerOpen(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[28px] border-[3px] border-ink bg-white gui-shadow-lg"
          >
            <header className="flex items-center gap-3 border-b-[3px] border-ink bg-grape px-4 py-3 text-white">
              <div className="flex gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-coral" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-sun" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-lime" />
              </div>
              <h3 className="font-display text-lg font-black">Get your SoftInst installer</h3>
              <button
                type="button"
                onClick={() => setInstallerOpen(false)}
                className="ml-auto rounded-lg border-2 border-ink bg-white p-1 text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-[calc(92vh-56px)] overflow-y-auto p-5 scrollbar-thin">
              <p className="text-sm font-bold leading-relaxed text-ink/70">
                SoftInst builds a silent Windows installer for {selectedApps.length} app
                {selectedApps.length === 1 ? '' : 's'}
                {selectedTweaks.length > 0 && ` plus ${selectedTweaks.length} PC tweak${selectedTweaks.length === 1 ? '' : 's'}`}.
                Packages are pulled from official publishers — winget, Chocolatey, Scoop or the vendor's own installer
                URL — not from us. A batch file is always shipped alongside the PowerShell script.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Stat label="Packages" value={String(selectedApps.length)} color="bg-coral" />
                <Stat label="Disk needed" value={formatBytesHint(totalDisk)} color="bg-teal" />
                <Stat label="Target OS" value="Windows 10/11" color="bg-sun" />
              </div>

              <section className="mt-5">
                <h4 className="font-display text-base font-black">Install method</h4>
                <p className="mt-0.5 text-xs font-bold text-ink/60">
                  The generated script checks what is actually installed on the target PC and falls back through the
                  chain automatically, so <b>Auto-detect</b> is the safe default. Pick a specific one only if you know
                  the machine already has it.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {METHODS.map((m) => {
                    const on = method === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        aria-pressed={on}
                        className={`rounded-2xl border-[3px] border-ink p-3 text-left transition ${
                          on ? `${m.color} gui-shadow` : 'bg-white hover:bg-cream'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md border-[3px] border-ink text-[10px] font-black ${
                              on ? 'bg-lime' : 'bg-white'
                            }`}
                          >
                            {on ? '✓' : ''}
                          </span>
                          <span className="font-display text-sm font-black">{m.label}</span>
                        </span>
                        <span className="mt-1 block text-[11px] font-bold leading-snug text-ink/70">{m.blurb}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="mt-5">
                <h4 className="font-display text-base font-black">PC tweaks</h4>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeTweaks}
                  disabled={selectedTweaks.length === 0}
                  onClick={() => setIncludeTweaks(!includeTweaks)}
                  className={`mt-2 flex w-full items-center gap-3 rounded-2xl border-[3px] border-ink p-3 text-left transition disabled:opacity-50 ${
                    includeTweaks ? 'bg-sun gui-shadow' : 'bg-white hover:bg-cream'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink text-xs font-black ${
                      includeTweaks ? 'bg-lime' : 'bg-white'
                    }`}
                  >
                    {includeTweaks ? '✓' : ''}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-sm font-black">
                      Also run {selectedTweaks.length} PC tweak{selectedTweaks.length === 1 ? '' : 's'}
                    </span>
                    <span className="block text-[11px] font-bold text-ink/70">
                      {selectedTweaks.length > 0
                        ? 'Runs after the apps, as Administrator, with rollback commands embedded.'
                        : 'No tweaks ticked yet.'}
                    </span>
                  </span>
                  {selectedTweaks.length > 0 && (
                    <Link
                      to="/tweaks"
                      onClick={() => {
                        setInstallerOpen(false)
                        window.scrollTo({ top: 0 })
                      }}
                      className="shrink-0 rounded-xl border-2 border-ink bg-white px-2.5 py-1 text-[11px] font-black"
                    >
                      <Wrench className="mr-1 inline h-3 w-3" />
                      pick tweaks
                    </Link>
                  )}
                </button>
              </section>

              <ol className="mt-5 space-y-2 text-sm font-bold">
                <li className="rounded-xl border-2 border-ink bg-cream px-3 py-2">
                  1. Download the installer — {ps1Name} plus the SoftInst-{slug}.cmd wrapper.
                </li>
                <li className="rounded-xl border-2 border-ink bg-cream px-3 py-2">
                  2. Right-click the .cmd → Run as administrator. It relaunches PowerShell elevated for you.
                </li>
                <li className="rounded-xl border-2 border-ink bg-cream px-3 py-2">
                  3. Approve UAC. Each app installs silently, no extra toolbars.
                </li>
              </ol>

              {issues.length > 0 && (
                <div className="mt-4 rounded-2xl border-[3px] border-ink bg-sun/40 p-3">
                  <p className="flex items-center gap-2 font-display font-black">
                    <AlertTriangle className="h-4 w-4" /> Specs warnings for this PC
                  </p>
                  <ul className="mt-2 space-y-1 text-xs font-bold">
                    {issues.map(({ app, compat }) => (
                      <li key={app.id}>
                        <span className="text-coral">{app.name}:</span>
                        <ul className="mt-0.5 list-disc pl-4">
                          {compat.reasons.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedApps.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedApps.map((a) => (
                    <span
                      key={a.id}
                      className="rounded-lg border-2 border-ink px-2 py-1 text-xs font-extrabold"
                      style={{ background: `${a.color}22` }}
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              )}

              {selectedTweaks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTweaks.map((t) => (
                    <span
                      key={t.id}
                      className={`rounded-lg border-2 border-ink px-2 py-1 text-xs font-extrabold ${
                        includeTweaks ? 'bg-sun' : 'bg-cream text-ink/50'
                      }`}
                    >
                      <Wrench className="mr-1 inline h-3 w-3" />
                      {t.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={grabInstaller}
                  className="flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-base font-black text-white gui-shadow hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <Download className="h-5 w-5" />
                  Download .ps1 + .cmd
                </button>
                <button
                  type="button"
                  onClick={() => copy(tab === 'ps1' ? script : oneliner)}
                  className="flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white px-4 py-3 font-display font-black gui-shadow"
                >
                  {copied ? <Check className="h-5 w-5 text-teal" /> : <Copy className="h-5 w-5" />}
                  {copied ? 'Copied' : 'Copy script'}
                </button>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab('ps1')}
                  className={`flex items-center gap-1 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${tab === 'ps1' ? 'border-ink bg-ink text-sun' : 'border-ink/20'}`}
                >
                  <FileCode className="h-3.5 w-3.5" /> PowerShell
                </button>
                <button
                  type="button"
                  onClick={() => setTab('oneliner')}
                  className={`flex items-center gap-1 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${tab === 'oneliner' ? 'border-ink bg-ink text-sun' : 'border-ink/20'}`}
                >
                  <Terminal className="h-3.5 w-3.5" /> One-liner
                </button>
              </div>

              <pre className="terminal mt-3 max-h-56 overflow-auto rounded-2xl border-[3px] border-ink bg-ink p-3 text-[11px] leading-relaxed text-lime">
                {tab === 'ps1' ? script : oneliner}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-2xl border-[3px] border-ink ${color} px-3 py-2`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-ink/70">{label}</p>
      <p className="font-display text-lg font-black">{value}</p>
    </div>
  )
}
