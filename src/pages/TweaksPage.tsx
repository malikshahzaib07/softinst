import { RotateCcw, ShieldCheck, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import TweakPanel from '../components/TweakPanel'
import { useSoftInst } from '../context/SoftInstContext'

export default function TweaksPage() {
  const { selectedTweaks } = useSoftInst()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6">
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
        PC <span className="text-coral">tweaks</span>
      </h1>
      <p className="mt-3 max-w-2xl text-base font-bold leading-relaxed text-ink/70">
        Cleanup, performance, network, privacy and system tweaks that run on your own machine after the apps finish.
        The script asks for Administrator rights because these change real system settings — and every tweak you tick
        ships with its own rollback commands embedded in the same file.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-extrabold">
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Runs locally, as Administrator
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1">
          <RotateCcw className="h-3.5 w-3.5" />
          Rollback included
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1">
          <Wrench className="h-3.5 w-3.5" />
          {selectedTweaks.length} ticked
        </span>
      </div>

      <div className="mt-8">
        <TweakPanel />
      </div>

      <section className="mt-8 rounded-[28px] border-[3px] border-ink bg-white p-5 gui-shadow-lg">
        <h2 className="font-display flex items-center gap-2 text-xl font-black">
          <RotateCcw className="h-6 w-6 text-coral" />
          How to undo all of this
        </h2>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-ink/70">
          Nothing here is a one-way door. The generated script carries a <code className="rounded bg-cream px-1">$SoftInstRollback</code>{' '}
          switch, so re-running the very same file with{' '}
          <code className="rounded bg-cream px-1">$SoftInstRollback = $true</code> walks back every tweak it applied and
          restores the original settings. Open the file in a text editor, flip that one line to{' '}
          <code className="rounded bg-cream px-1">$true</code>, and run the .cmd again as Administrator. Tweaks that
          needed a restart to apply are undone the same way.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-display text-base font-black text-white gui-shadow"
          >
            Back to the app picker
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-display text-base font-black gui-shadow"
          >
            How it works
          </Link>
        </div>
      </section>
    </div>
  )
}
