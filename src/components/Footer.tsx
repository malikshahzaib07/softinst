import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t-[3px] border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src="/images/mascot.png" alt="" className="h-10 w-10" />
            <span className="font-display text-2xl font-black">
              <span className="text-coral">Soft</span>
              <span className="text-teal">Inst</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm font-semibold leading-relaxed text-cream/70">
            Pick real apps. Download one silent installer. SoftInst talks to Windows Package Manager — no accounts, no
            catalog database, nothing fake.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-black uppercase tracking-widest text-sun">Explore</p>
          <div className="mt-3 flex flex-col gap-2 font-extrabold">
            <Link to="/" className="hover:text-sun">App picker</Link>
            <Link to="/specs" className="hover:text-sun">PC specs checker</Link>
            <Link to="/how-it-works" className="hover:text-sun">How it works</Link>
            <Link to="/about" className="hover:text-sun">About</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-sm font-black uppercase tracking-widest text-sun">Fine print</p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-cream/70">
            SoftInst does not host software binaries. Each package is fetched from its official winget source on your
            PC. Trademarks belong to their owners. Windows 10/11 required for the installer.
          </p>
        </div>
      </div>
      <div className="border-t-2 border-white/10 px-5 py-4 text-center text-xs font-bold text-cream/50">
        SoftInst · standalone silent installer · catalog stored in the client · {new Date().getFullYear()}
      </div>
    </footer>
  )
}
