import { Download, MousePointerClick, ShieldCheck, VolumeX } from 'lucide-react'
import { Link } from 'react-router-dom'
import GuiWindow from '../components/GuiWindow'

const steps = [
  {
    n: '01',
    color: 'bg-coral',
    icon: MousePointerClick,
    title: 'Tick real apps',
    body: 'The catalog is a TypeScript list of genuine Windows programs with official winget package IDs — Google Chrome, Mozilla Firefox, VLC, 7-Zip, Discord, Visual Studio Code, Steam, LibreOffice, and dozens more. Nothing local, nothing invented.',
  },
  {
    n: '02',
    color: 'bg-sun',
    icon: Download,
    title: 'Download one installer',
    body: 'SoftInst writes a PowerShell script plus a helper .cmd. On your PC it elevates to Administrator, then loops winget install --silent for every selected ID. Winget pulls the latest version from the publisher.',
  },
  {
    n: '03',
    color: 'bg-lime',
    icon: VolumeX,
    title: 'Silent, no junk',
    body: 'Each install uses --silent --accept-package-agreements --disable-interactivity. You do not click Next, you do not get bundled toolbars, you do not babysit fifty wizards.',
  },
  {
    n: '04',
    color: 'bg-grape text-white',
    icon: ShieldCheck,
    title: 'Check the hardware first',
    body: 'The PC Specs page reads CPU cores, RAM hints, GPU, OS, and storage quota right in the browser, then flags apps that look too heavy — Blender, Docker Desktop, Visual Studio — before you download anything.',
  },
]

export default function HowPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
        How SoftInst <span className="text-coral">actually works</span>
      </h1>
      <p className="mt-3 max-w-2xl text-base font-bold text-ink/70">
        Inspired by Ninite: pick a pile of software, run one installer, go make coffee. SoftInst is a static website —
        the catalog lives in the code, the installer is generated in your browser.
      </p>

      <div className="mt-8 overflow-hidden rounded-[32px] border-[3px] border-ink gui-shadow-lg">
        <img src="/images/how-it-works.png" alt="Select, download, install silently" className="w-full" />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {steps.map((s) => (
          <div key={s.n} className={`rounded-[28px] border-[3px] border-ink p-5 gui-shadow ${s.color}`}>
            <p className="font-display text-4xl font-black opacity-40">{s.n}</p>
            <s.icon className="mt-2 h-8 w-8" />
            <h2 className="font-display mt-2 text-2xl font-black">{s.title}</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <GuiWindow title="README.txt" accent="bg-sky" className="mt-10">
        <div className="space-y-4 p-5 text-sm font-bold leading-relaxed text-ink/80">
          <p>
            SoftInst does not ship binaries. The generated script is a shopping list for{' '}
            <a className="text-grape underline" href="https://learn.microsoft.com/windows/package-manager/winget/" target="_blank" rel="noreferrer">
              Windows Package Manager
            </a>
            , which is built into modern Windows 10/11 (or available as App Installer from the Microsoft Store).
          </p>
          <p>
            That is why every card shows a real winget ID such as <code className="rounded bg-cream px-1">Google.Chrome</code> or{' '}
            <code className="rounded bg-cream px-1">VideoLAN.VLC</code>. If winget is missing, the script prints the official
            store link and stops.
          </p>
          <p>
            Execution policy is set for the process only. The script re-launches itself elevated, then installs packages
            one after another so a single failure does not abort the rest of the stack.
          </p>
          <Link to="/" className="inline-block rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-base font-black text-white gui-shadow">
            Start picking apps
          </Link>
        </div>
      </GuiWindow>
    </div>
  )
}
