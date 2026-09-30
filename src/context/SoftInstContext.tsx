import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { APPS, type AppSoftware, type CategoryId } from '../data/apps'
import { TWEAKS, type Tweak } from '../data/tweaks'
import type { InstallMethod } from '../lib/installer'
import { detectPCSpecs, type PCSpecs } from '../lib/specs'

interface SoftInstContextValue {
  selected: Set<string>
  selectedApps: AppSoftware[]
  toggle: (id: string) => void
  selectMany: (ids: string[], mode?: 'add' | 'set' | 'remove') => void
  clear: () => void
  isSelected: (id: string) => boolean

  specs: PCSpecs | null
  scanning: boolean
  specsError: string | null
  rescan: () => Promise<void>

  query: string
  setQuery: (q: string) => void
  category: CategoryId | 'all'
  setCategory: (c: CategoryId | 'all') => void

  tweaks: Set<string>
  selectedTweaks: Tweak[]
  toggleTweak: (id: string) => void
  setTweaks: (ids: string[], mode?: 'add' | 'set' | 'remove') => void
  clearTweaks: () => void

  method: InstallMethod
  setMethod: (m: InstallMethod) => void
  includeTweaks: boolean
  setIncludeTweaks: (v: boolean) => void

  installerOpen: boolean
  setInstallerOpen: (v: boolean) => void

  hasWork: boolean
}

const SoftInstContext = createContext<SoftInstContextValue | null>(null)

export function SoftInstProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [specs, setSpecs] = useState<PCSpecs | null>(null)
  const [scanning, setScanning] = useState(false)
  const [specsError, setSpecsError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [tweakSel, setTweakSel] = useState<Set<string>>(new Set())
  const [method, setMethod] = useState<InstallMethod>('auto')
  const [includeTweaks, setIncludeTweaks] = useState(false)
  const [installerOpen, setInstallerOpen] = useState(false)

  // StrictMode double-invokes effects in dev; the ref guard keeps detection to one run.
  const detected = useRef(false)

  const rescan = useCallback(async () => {
    setScanning(true)
    setSpecsError(null)
    try {
      setSpecs(await detectPCSpecs())
    } catch (err) {
      setSpecs(null)
      setSpecsError(err instanceof Error ? err.message : 'Could not read PC details from this browser.')
    } finally {
      setScanning(false)
    }
  }, [])

  useEffect(() => {
    if (detected.current) return
    detected.current = true
    void rescan()
  }, [rescan])

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectMany = useCallback((ids: string[], mode: 'add' | 'set' | 'remove' = 'add') => {
    setSelected((prev) => {
      if (mode === 'set') return new Set(ids)
      const next = new Set(prev)
      for (const id of ids) {
        if (mode === 'remove') next.delete(id)
        else next.add(id)
      }
      return next
    })
  }, [])

  const clear = useCallback(() => setSelected(new Set()), [])

  const selectedApps = useMemo(() => APPS.filter((a) => selected.has(a.id)), [selected])

  const isSelected = useCallback((id: string) => selected.has(id), [selected])

  const toggleTweak = useCallback((id: string) => {
    setTweakSel((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const setTweaks = useCallback((ids: string[], mode: 'add' | 'set' | 'remove' = 'add') => {
    setTweakSel((prev) => {
      if (mode === 'set') return new Set(ids)
      const next = new Set(prev)
      for (const id of ids) {
        if (mode === 'remove') next.delete(id)
        else next.add(id)
      }
      return next
    })
  }, [])

  const clearTweaks = useCallback(() => {
    setTweakSel(new Set())
    setIncludeTweaks(false)
  }, [])

  const selectedTweaks = useMemo(() => TWEAKS.filter((t) => tweakSel.has(t.id)), [tweakSel])

  // Derived, not synchronised: the switch can never read as "on" with nothing behind it.
  const tweaksActive = includeTweaks && selectedTweaks.length > 0

  const hasWork = selectedApps.length > 0 || selectedTweaks.length > 0

  const value = useMemo(
    () => ({
      selected,
      selectedApps,
      toggle,
      selectMany,
      clear,
      isSelected,
      specs,
      scanning,
      specsError,
      rescan,
      query,
      setQuery,
      category,
      setCategory,
      tweaks: tweakSel,
      selectedTweaks,
      toggleTweak,
      setTweaks,
      clearTweaks,
      method,
      setMethod,
      includeTweaks: tweaksActive,
      setIncludeTweaks,
      installerOpen,
      setInstallerOpen,
      hasWork,
    }),
    [
      selected,
      selectedApps,
      toggle,
      selectMany,
      clear,
      isSelected,
      specs,
      scanning,
      specsError,
      rescan,
      query,
      category,
      setCategory,
      tweakSel,
      selectedTweaks,
      toggleTweak,
      setTweaks,
      clearTweaks,
      method,
      tweaksActive,
      installerOpen,
      hasWork,
    ],
  )

  return <SoftInstContext.Provider value={value}>{children}</SoftInstContext.Provider>
}

// The provider and its hook intentionally live in one module: the hook is only
// meaningful alongside the provider, and splitting them would add a file for
// no benefit.
// eslint-disable-next-line react-refresh/only-export-components
export function useSoftInst() {
  const ctx = useContext(SoftInstContext)
  if (!ctx) throw new Error('useSoftInst must be used inside SoftInstProvider')
  return ctx
}
