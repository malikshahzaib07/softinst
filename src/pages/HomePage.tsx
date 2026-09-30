import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Cpu,
  Download,
  MousePointerClick,
  PackageCheck,
  Sparkles,
  Terminal,
  VolumeX,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/Logo'
import { APPS } from '../data/apps'
import { useSoftInst } from '../context/SoftInstContext'

const STEPS = [
  {
    n: '01',
    color: 'bg-coral',
    icon: MousePointerClick,
    title: 'Pick your apps',
    body: 'Tick real software from a catalog of genuine Windows programs. Each one names an official winget ID, a Chocolatey package, a Scoop manifest or a direct vendor installer URL.',
    to: '/apps',
    cta: 'Browse apps',
  },
  {
    n: '02',
    color: 'bg-sun',
    icon: Download,
    title: 'Choose a method',
    body: 'Leave it on auto-detect and the script probes the target PC for winget, Chocolatey and Scoop, then uses whichever it finds first. You can also force one method, or go fully direct.',
    to: '/apps',
    cta: 'Set it in the modal',
  },
  {
    n: '03',
    color: 'bg-lime',
    icon: Terminal,
    title: 'Run the .cmd',
    body: 'A batch file always ships next to the PowerShell script. Right-click it, approve UAC, and every app installs silently. No Next buttons, no bundled toolbars.',
    to: '/how-it-works',
    cta: 'How it works',
  },
]

export default function HomePage() {
  const { selectedApps, selectedTweaks } = useSoftInst()

  const popular = useMemo(() => APPS.filter((a) => a.popular), [])

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
            Steam — then download a silent installer that finds winget, Chocolatey or Scoop on the target PC and uses
            whichever is available. Optional PC tweaks ship in the same script, with rollback commands included.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-lg font-black text-white gui-shadow"
            >
              <Download className="h-5 w-5" />
              Browse apps
            </Link>
            <Link
              to="/tweaks"
              className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-display text-lg font-black gui-shadow"
            >
              <Wrench className="h-5 w-5" />
              PC tweaks
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-extrabold">
            {[
              { icon: VolumeX, t: 'Silent installs' },
              { icon: PackageCheck, t: 'winget · choco · scoop' },
              { icon: Cpu, t: 'Auto spec check' },
            ].map((b) => (
              <span key={b.t} className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1">
                <b.icon className="h-3.5 w-3.5" />
                {b.t}
              </span>
            ))}
          </div>
        </div>

        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
          <div className="rounded-[32px] border-[3px] border-ink bg-white p-6 gui-shadow-lg">
            <div className="flex items-center gap-2 border-b-[3px] border-ink pb-3">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-coral" />
              <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-sun" />
              <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-lime" />
              <span className="ml-2 font-display text-xs font-black text-ink/50">SoftInst-Installer.ps1</span>
            </div>
            <div className="terminal mt-4 space-y-2 text-[12px] leading-relaxed text-ink">
              <p className="text-ink/50"># resolving package manager…</p>
              <p className="font-black text-teal">winget  → available (v1.8.1911)</p>
              <p className="font-black text-ink/50">choco   → not found, skipping</p>
              <p className="font-black text-ink/50">scoop   → not found, skipping</p>
              <p className="mt-3 text-ink/50"># installing {selectedApps.length || 'your'} app(s) silently…</p>
              {selectedApps.length > 0 ? (
                selectedApps.slice(0, 5).map((a) => (
                  <p key={a.id} className="font-black text-ink">
                    ✓ {a.name}
                  </p>
                ))
              ) : (
                <p className="text-ink/40">✓ Google.Chrome · VideoLAN.VLC · 7zip.7zip …</p>
              )}
              {selectedTweaks.length > 0 && (
                <p className="font-black text-coral">+ {selectedTweaks.length} PC tweak(s) with rollback</p>
              )}
              <p className="mt-3 font-black text-lime">Done. 0 errors.</p>
            </div>
          </div>
          <BrandMark size={112} className="absolute -bottom-8 -left-6 hidden sm:flex" />
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

      <section className="mt-12">
        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Three steps, <span className="text-teal">one script</span>
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className={`flex flex-col rounded-[28px] border-[3px] border-ink p-5 gui-shadow ${s.color}`}>
              <p className="font-display text-4xl font-black opacity-40">{s.n}</p>
              <s.icon className="mt-2 h-8 w-8" />
              <h3 className="font-display mt-2 text-xl font-black">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm font-bold leading-relaxed">{s.body}</p>
              <Link
                to={s.to}
                className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl border-[3px] border-ink bg-white px-3 py-1.5 text-xs font-black"
              >
                {s.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border-[3px] border-ink bg-white p-5 gui-shadow-lg">
        <h2 className="font-display flex items-center gap-2 text-xl font-black">
          <PackageCheck className="h-6 w-6 text-teal" />
          How your install method actually gets decided
        </h2>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-ink/70">
          The generated script runs on your own PC. Before it installs anything it detects whether winget, Chocolatey or
          Scoop is present, and falls back down the chain automatically if the first choice is missing — finishing with
          direct vendor installer URLs for apps no package manager carries. It reports which method it settled on. A
          batch file is always shipped next to the PowerShell script, so you are never stuck with one file type.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-base font-black text-white gui-shadow"
          >
            <Download className="h-5 w-5" />
            Browse apps
          </Link>
          <Link
            to="/tweaks"
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-display text-base font-black gui-shadow"
          >
            <Wrench className="h-5 w-5" />
            PC tweaks
          </Link>
        </div>
      </section>
    </div>
  )
}
