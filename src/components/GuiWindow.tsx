import type { ReactNode } from 'react'

interface GuiWindowProps {
  title: string
  accent?: string
  toolbar?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export default function GuiWindow({
  title,
  accent = 'bg-sun',
  toolbar,
  footer,
  children,
  className = '',
}: GuiWindowProps) {
  return (
    <section className={`overflow-hidden rounded-[28px] border-[3px] border-ink bg-white gui-shadow-lg ${className}`}>
      <header className={`flex items-center gap-3 border-b-[3px] border-ink px-4 py-2.5 ${accent}`}>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-coral" />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-sun" />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-lime" />
        </div>
        <h2 className="font-display text-sm font-extrabold tracking-wide text-ink sm:text-base">{title}</h2>
        <div className="ml-auto hidden items-center gap-1 sm:flex">
          <span className="h-5 w-8 rounded-md border-2 border-ink bg-white/70" />
          <span className="h-5 w-8 rounded-md border-2 border-ink bg-white/70" />
          <span className="h-5 w-8 rounded-md border-2 border-ink bg-white/70" />
        </div>
      </header>
      {toolbar}
      <div>{children}</div>
      {footer}
    </section>
  )
}
