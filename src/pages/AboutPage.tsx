import { Ban, Database, Lock, Sparkles } from 'lucide-react'
import GuiWindow from '../components/GuiWindow'
import { APPS } from '../data/apps'

const pledges = [
  { icon: Ban, title: 'No login', body: 'There is no account, no sign-in, no email capture. Tick boxes and download.' },
  { icon: Database, title: 'No database', body: 'The catalog is a TypeScript module compiled into the site. Refreshing the page is the whole backend.' },
  { icon: Lock, title: 'No fake apps', body: 'Every title is a real, publicly distributed Windows program with an official winget package ID and vendor site.' },
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
            Windows Package Manager do the fetching.
          </p>
        </div>
        <div className="overflow-hidden rounded-[32px] border-[3px] border-ink gui-shadow-lg">
          <img src="/images/hero-workspace.jpg" alt="Colorful workspace" className="h-64 w-full object-cover sm:h-80" />
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
            developer tools, runtimes, and gaming launchers. Trademarks belong to their owners. SoftInst is not
            affiliated with Ninite, Microsoft, or any listed publisher.
          </p>
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
