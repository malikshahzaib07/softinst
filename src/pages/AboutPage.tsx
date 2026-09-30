import { Ban, Database, Layers, Lock, PackageCheck, Sparkles } from 'lucide-react'
import GuiWindow from '../components/GuiWindow'
import { APPS } from '../data/apps'

const pledges = [
  { icon: Ban, title: 'No login', body: 'There is no account, no sign-in, no email capture. Tick boxes and download.' },
  { icon: Database, title: 'No database', body: 'The catalog is a TypeScript module compiled into the site. Refreshing the page is the whole backend.' },
  { icon: PackageCheck, title: 'Multiple install methods', body: 'Every app ships winget, Chocolatey, Scoop and direct vendor URLs. The generated script picks whatever the target PC has, and a batch file always comes with it.' },
  { icon: Lock, title: 'Local-only spec detection', body: 'Hardware readings happen automatically in your browser, on load, with no scan button and no separate page. Nothing is uploaded, and there is nothing to opt into.' },
  { icon: Sparkles, title: 'Colorful GUI', body: 'Window chrome, chunky shadows, loud palettes — SoftInst should feel like software, not a blog.' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Built like a <span className="text-grape">desktop app</span>, served as a website.
          </h1>
          <p className="mt-4 text-base font-bold leading-relaxed text-ink/70">
            SoftInst exists for the same job Ninite nailed: standing up a fresh Windows PC without clicking through
            fifty install wizards. We generate a silent installer from a hard-coded list of real software and let
            whatever package manager the machine already has do the fetching — with optional, reversible PC tweaks
            bundled into the same script.
          </p>
        </div>
        <div className="rounded-[32px] border-[3px] border-ink bg-white p-6 gui-shadow-lg">
          <div className="flex items-center gap-2 border-b-[3px] border-ink pb-3">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-coral" />
            <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-sun" />
            <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-lime" />
            <span className="ml-2 font-display text-xs font-black text-ink/50">about.properties</span>
          </div>
          <ul className="terminal mt-4 space-y-1.5 text-[12px] font-bold text-ink">
            <li>
              <span className="text-ink/50">name</span> = SoftInst
            </li>
            <li>
              <span className="text-ink/50">catalog</span> = compiled TypeScript
            </li>
            <li>
              <span className="text-ink/50">methods</span> ={' '}
              <span className="text-teal">winget, choco, scoop, direct</span>
            </li>
            <li>
              <span className="text-ink/50">always_ships</span> = SoftInst-*.cmd
            </li>
            <li>
              <span className="text-ink/50">tweaks</span> = <span className="text-grape">reversible, rollback included</span>
            </li>
            <li>
              <span className="text-ink/50">specs</span> = read locally, auto, never uploaded
            </li>
            <li>
              <span className="text-ink/50">telemetry</span> = <span className="text-coral">none</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {pledges.map((p) => (
          <div key={p.title} className="rounded-3xl border-[3px] border-ink bg-white p-5 gui-shadow">
            <p.icon className="h-8 w-8 text-coral" />
            <h2 className="font-display mt-3 text-xl font-black">{p.title}</h2>
            <p className="mt-1 text-sm font-bold text-ink/70">{p.body}</p>
          </div>
        ))}
      </div>

      <GuiWindow title="Catalog.txt" accent="bg-pink" className="mt-10">
        <div className="p-5">
          <p className="text-sm font-bold text-ink/70">
            {APPS.length} real apps across browsers, messaging, media, imaging, documents, security, cloud, utilities,
            developer tools, runtimes, and gaming launchers. Every entry lists the install paths that actually exist, so
            the same download works on a winget-only PC and on a Chocolatey or Scoop machine. Trademarks belong to
            their owners. SoftInst is not affiliated with Ninite, Microsoft, or any listed publisher.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold">
            {[
              { icon: Layers, t: 'winget' },
              { icon: PackageCheck, t: 'choco' },
              { icon: PackageCheck, t: 'scoop' },
              { icon: PackageCheck, t: 'direct vendor URL' },
            ].map((m) => (
              <span key={m.t} className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-cream px-3 py-1">
                <m.icon className="h-3.5 w-3.5" />
                {m.t}
              </span>
            ))}
          </div>
          <div className="mt-4 columns-2 gap-3 text-xs font-extrabold sm:columns-3">
            {APPS.map((a) => (
              <a
                key={a.id}
                href={a.website}
                target="_blank"
                rel="noreferrer"
                className="mb-1 block truncate hover:text-coral"
              >
                {a.name}
              </a>
            ))}
          </div>
        </div>
      </GuiWindow>
    </div>
  )
}
