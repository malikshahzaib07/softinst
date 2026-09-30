import { Download, MousePointerClick, ShieldCheck, VolumeX, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import GuiWindow from '../components/GuiWindow'

const steps = [
  {
    n: '01',
    color: 'bg-coral',
    icon: MousePointerClick,
    title: 'Tick real apps',
    body: 'The catalog is a TypeScript list of genuine Windows programs — Google Chrome, Mozilla Firefox, VLC, 7-Zip, Discord, Visual Studio Code, Steam, LibreOffice, and dozens more. Each entry carries an official winget ID, a Chocolatey package, a Scoop manifest or a direct vendor installer URL. Nothing local, nothing invented.',
  },
  {
    n: '02',
    color: 'bg-sun',
    icon: Download,
    title: 'Choose an install method',
    body: 'Leave it on auto-detect and the generated script probes the target PC for winget, Chocolatey and Scoop, then uses whichever it finds first. You can also force a single method, or go fully direct and fetch every vendor installer URL yourself.',
  },
  {
    n: '03',
    color: 'bg-lime',
    icon: VolumeX,
    title: 'Run the .cmd as Administrator',
    body: 'A batch file is always shipped next to the PowerShell script. Double-click it, approve UAC, and it relaunches PowerShell elevated for the current process only. Each app installs silently with --silent and --accept-package-agreements — no Next buttons, no bundled toolbars, and one failure does not abort the rest of the stack.',
  },
  {
    n: '04',
    color: 'bg-grape text-white',
    icon: Wrench,
    title: 'Optionally run PC tweaks',
    body: 'Tick a few cleanup, performance, network, privacy or system tweaks and they run after the apps finish. Every tweak you pick embeds its own rollback commands in the script, and any tweak that needs a restart says so up front.',
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

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[32px] border-[3px] border-ink bg-white p-5 gui-shadow-lg">
        {[
          { n: '1', t: 'Tick apps', c: 'bg-coral' },
          { n: '2', t: 'Pick a method', c: 'bg-sun' },
          { n: '3', t: 'Run the .cmd', c: 'bg-lime' },
          { n: '4', t: 'Add tweaks', c: 'bg-grape text-white' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-[3px] border-ink ${s.c}`}>
              <span className="font-display text-2xl font-black leading-none">{s.n}</span>
            </div>
            <span className="font-display text-sm font-black">{s.t}</span>
            {i < 3 && <span className="font-display text-xl font-black text-ink/30">→</span>}
          </div>
        ))}
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

      <div className="mt-10">
        <h2 className="font-display flex items-center gap-2 text-2xl font-black">
          <ShieldCheck className="h-6 w-6 text-teal" />
          What the browser can see
        </h2>
        <p className="mt-1 max-w-3xl text-sm font-bold text-ink/70">
          As soon as the page loads, SoftInst reads what the browser is willing to expose — CPU cores, an approximate
          RAM figure, the GPU renderer, OS and screen size — and compares it against the real minimums for every app in
          the catalog, so you see a compatibility chip on each card. This happens automatically, there is no scan button,
          and the values never leave your machine. If a browser blocks the readings, the chips simply disappear and
          everything else keeps working.
        </p>
      </div>

      <GuiWindow title="README.txt" accent="bg-sky" className="mt-10">
        <div className="space-y-4 p-5 text-sm font-bold leading-relaxed text-ink/80">
          <p>
            SoftInst does not ship binaries. The generated script is a shopping list for whichever package manager the
            target PC already has —{' '}
            <a className="text-grape underline" href="https://learn.microsoft.com/windows/package-manager/winget/" target="_blank" rel="noreferrer">
              Windows Package Manager
            </a>
            , Chocolatey or Scoop — with a direct vendor URL as the final fallback for apps no manager carries.
          </p>
          <p>
            That is why every card names a real package such as <code className="rounded bg-cream px-1">Google.Chrome</code> or{' '}
            <code className="rounded bg-cream px-1">VideoLAN.VLC</code>. If one manager is missing the script does not
            stop: it moves down the chain and reports which method it settled on, skipping only apps that genuinely have
            no install path anywhere.
          </p>
          <p>
            Execution policy is set for the process only. The script re-launches itself elevated, then installs packages
            one after another so a single failure does not abort the rest of the stack. Selected PC tweaks run last, and
            their rollback commands sit in the same file in case you want them.
          </p>
          <Link to="/" className="inline-block rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-base font-black text-white gui-shadow">
            Start picking apps
          </Link>
        </div>
      </GuiWindow>
    </div>
  )
}
