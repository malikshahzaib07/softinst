import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { APPS, PRESETS, type AppSoftware, type CategoryId } from '../data/apps'
import { detectPCSpecs, type PCSpecs } from '../lib/specs'

interface SoftInstContextValue {
  selected: Set<string>
  toggle: (id: string) => void
  selectMany: (ids: string[], mode?: 'add' | 'set' | 'remove') => void
  clear: () => void
  isSelected: (id: string) => boolean
  selectedApps: AppSoftware[]
  applyPreset: (presetId: string) => void
  specs: PCSpecs | null
  scanning: boolean
  scanError: string | null
  scan: () => Promise<void>
  query: string
  setQuery: (q: string) => void
  category: CategoryId | 'all'
  setCategory: (c: CategoryId | 'all') => void
  installerOpen: boolean
  setInstallerOpen: (v: boolean) => void
}

const SoftInstContext = createContext<SoftInstContextValue | null>(null)

export function SoftInstProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [specs, setSpecs] = useState<PCSpecs | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [installerOpen, setInstallerOpen] = useState(false)

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

  const isSelected = useCallback((id: string) => selected.has(id), [selected])

  const selectedApps = useMemo(
    () => APPS.filter((a) => selected.has(a.id)),
    [selected],
  )

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setSelected(new Set(preset.appIds.filter((id) => APPS.some((a) => a.id === id))))
  }, [])

  const scan = useCallback(async () => {
    setScanning(true)
    setScanError(null)
    try {
      await new Promise((r) => setTimeout(r, 700))
      const result = await detectPCSpecs()
      setSpecs(result)
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Could not read PC details from this browser.')
    } finally {
      setScanning(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      selected,
      toggle,
      selectMany,
      clear,
      isSelected,
      selectedApps,
      applyPreset,
      specs,
      scanning,
      scanError,
      scan,
      query,
      setQuery,
      category,
      setCategory,
      installerOpen,
      setInstallerOpen,
    }),
    [
      selected,
      toggle,
      selectMany,
      clear,
      isSelected,
      selectedApps,
      applyPreset,
      specs,
      scanning,
      scanError,
      scan,
      query,
      category,
      installerOpen,
    ],
  )

  return <SoftInstContext.Provider value={value}>{children}</SoftInstContext.Provider>
}

export function useSoftInst() {
  const ctx = useContext(SoftInstContext)
  if (!ctx) throw new Error('useSoftInst must be used inside SoftInstProvider')
  return ctx
}
