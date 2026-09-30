import { useState } from 'react'

/** primary = `src`, fallback = `fallbackSrc`, monogram = last-resort initials. */
type Stage = 'primary' | 'fallback' | 'monogram'

interface LogoProps {
  src: string
  /** Second chance when `src` fails, e.g. the vendor's remote favicon. */
  fallbackSrc?: string
  alt?: string
  brand?: string
  size?: number
  className?: string
}

function monogramOf(alt: string | undefined): string {
  const source = (alt ?? '').trim()
  if (!source) return '?'
  const words = source.split(/[\s._-]+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export default function Logo({ src, fallbackSrc, alt, brand = '#1a1a2e', size = 44, className = '' }: LogoProps) {
  // 'primary' -> 'fallback' -> monogram. Never renders a broken-image icon.
  const [img, setImg] = useState<{ key: string; stage: Stage }>({ key: '', stage: 'primary' })

  // The app grid re-renders and reuses these nodes for different apps, so a stale
  // 'fallback'/'monogram' stage would stick the wrong image onto the new card.
  // Adjusting state during render is React's recommended alternative to an effect
  // here: it resets in the same paint, before the browser can paint the old mark.
  // Apps with no bundled brand mark ship an empty `logo`, so the starting stage has
  // to skip straight to the favicon instead of waiting for an error that never comes.
  const firstStage: Stage = src ? 'primary' : fallbackSrc ? 'fallback' : 'monogram'
  // Key on both sources: 26 apps ship an empty `logo`, so `src` alone cannot tell
  // two different cards apart and would let one card's failure state leak to another.
  const key = src + '|' + (fallbackSrc ?? '')
  if (img.key !== key) setImg({ key, stage: firstStage })
  const stage = img.key === key ? img.stage : firstStage

  const currentSrc = stage === 'primary' ? src : fallbackSrc
  const showImage = stage !== 'monogram' && Boolean(currentSrc)

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] border-ink ${className}`}
      style={{ width: size, height: size, background: brand }}
    >
      {showImage ? (
        <img
          src={currentSrc}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImg({ key, stage: stage === 'primary' && fallbackSrc ? 'fallback' : 'monogram' })}
          className="h-[70%] w-[70%] object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-display select-none font-black leading-none text-white"
          style={{ fontSize: Math.round(size * 0.36) }}
        >
          {monogramOf(alt)}
        </span>
      )}
    </span>
  )
}

/**
 * Inline mascot mark. Replaces the old `/images/mascot.png` asset, which never existed
 * in the build output. Same chunky language: hard ink border, offset shadow, loud palette.
 */
export function BrandMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-sun gui-shadow ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        viewBox="0 0 32 32"
        fill="none"
        stroke="#1a1a2e"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="6" width="26" height="19" rx="4" fill="#fff4e4" />
        <path d="M3 12h26" />
        <path d="M10 30l6-5 6 5" />
        <circle cx="9" cy="9" r="1" fill="#ff5a5f" />
        <circle cx="13" cy="9" r="1" fill="#7dde92" />
        <path d="M11 18l3 3 6-6" stroke="#00c2b8" />
      </svg>
    </span>
  )
}
