import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Copy, Download, FileCode, Terminal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSoftInst } from '../context/SoftInstContext'
import { downloadTextFile, generateBatch, generatePowerShell, generateWingetOneLiner, slugFor } from '../lib/installer'
import { checkCompat, formatBytesHint } from '../lib/specs'

export default function InstallerModal() {
  const { installerOpen, setInstallerOpen, selectedApps, specs } = useSoftInst()
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<'ps1' | 'oneliner'>('ps1')

  const script = useMemo(() => generatePowerShell(selectedApps), [selectedApps])
  const oneliner = useMemo(() => generateWingetOneLiner(selectedApps), [selectedApps])
  const totalDisk = selectedApps.reduce((s, a) => s + a.minDiskMB, 0)

  const issues = selectedApps
    .map((a) => ({ app: a, compat: checkCompat(a, specs) }))
    .filter((x) => x.compat.level === 'no' || x.compat.level === 'warn')

  function grabInstaller() {
    const slug = slugFor(selectedApps)
    downloadTextFile(`SoftInst-Installer.ps1`, script)
    downloadTextFile(`SoftInst-${slug}.cmd`, generateBatch(selectedApps))
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
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-[calc(92vh-56px)] overflow-y-auto p-5 scrollbar-thin">
              <p className="text-sm font-bold leading-relaxed text-ink/70">
                SoftInst builds a silent Windows installer for the {selectedApps.length} app
                {selectedApps.length === 1 ? '' : 's'} you ticked. The script uses official{' '}
                <a className="text-grape underline" href="https://learn.microsoft.com/windows/package-manager/winget/" target="_blank" rel="noreferrer">
                  winget
                </a>{' '}
                IDs — Chrome, VLC, 7-Zip, VS Code, Steam, and the rest are pulled from their publishers, not from us.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Stat label="Packages" value={String(selectedApps.length)} color="bg-coral" />
                <Stat label="Disk needed" value={formatBytesHint(totalDisk)} color="bg-teal" />
                <Stat label="Target OS" value="Windows 10/11" color="bg-sun" />
              </div>

              <ol className="mt-5 space-y-2 text-sm font-bold">
                <li className="rounded-xl border-2 border-ink bg-cream px-3 py-2">1. Download the installer (PowerShell + helper .cmd).</li>
                <li className="rounded-xl border-2 border-ink bg-cream px-3 py-2">2. Right-click the .cmd → Run as administrator.</li>
                <li className="rounded-xl border-2 border-ink bg-cream px-3 py-2">3. Approve UAC. Each app installs silently, no extra toolbars.</li>
              </ol>

              {issues.length > 0 && (
                <div className="mt-4 rounded-2xl border-[3px] border-ink bg-sun/40 p-3">
                  <p className="flex items-center gap-2 font-display font-black">
                    <AlertTriangle className="h-4 w-4" /> Specs warnings for this PC
                  </p>
                  <ul className="mt-2 space-y-1 text-xs font-bold">
                    {issues.map(({ app, compat }) => (
                      <li key={app.id}>
                        <span className="text-coral">{app.name}:</span> {compat.reasons[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedApps.map((a) => (
                  <span key={a.id} className="rounded-lg border-2 border-ink px-2 py-1 text-xs font-extrabold" style={{ background: `${a.color}22` }}>
                    {a.name}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={grabInstaller}
                  className="flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-base font-black text-white gui-shadow hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <Download className="h-5 w-5" />
                  Download silent installer
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
