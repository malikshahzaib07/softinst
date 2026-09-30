export default function BlobBg() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-coral/50 blur-3xl blob" />
      <div className="absolute top-24 right-[-80px] h-96 w-96 rounded-full bg-sky/50 blur-3xl blob blob-delay" />
      <div className="absolute bottom-[-80px] left-1/4 h-72 w-72 rounded-full bg-sun/60 blur-3xl blob" />
      <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-grape/40 blur-3xl blob blob-delay" />
      <div className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-lime/40 blur-3xl blob" />
    </div>
  )
}
