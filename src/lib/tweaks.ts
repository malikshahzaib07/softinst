import { TWEAKS, type Tweak, type TweakCategory } from '../data/tweaks'

export type { Tweak, TweakCategory }

const ORDER: TweakCategory[] = ['cleanup', 'performance', 'network', 'privacy', 'system']

export function getTweaks(ids: string[]): Tweak[] {
  const wanted = new Set(ids)
  return TWEAKS.filter((t) => wanted.has(t.id))
}

export function tweaksByCategory(ids: string[]): Record<TweakCategory, Tweak[]> {
  const selected = getTweaks(ids)
  const out = {} as Record<TweakCategory, Tweak[]>
  for (const cat of ORDER) out[cat] = selected.filter((t) => t.category === cat)
  return out
}

export function countRisk(items: { risk: string }[]): { safe: number; moderate: number; reboot: number } {
  let safe = 0
  let moderate = 0
  let reboot = 0
  for (const item of items) {
    if (item.risk === 'safe') safe++
    else if (item.risk === 'moderate') moderate++
    else reboot++
  }
  return { safe, moderate, reboot }
}

const psq = (s: string): string => `'${s.replace(/'/g, "''")}'`

const ROLLBACK_HEADER = [
  '# -----------------------------------------------------------------------------',
  '# SoftInst tweak stage',
  '# -----------------------------------------------------------------------------',
  '#',
  '# Everything below is driven by a single switch. Set',
  '#   $SoftInstRollback = $true',
  '# and re-run this same file to UNDO the tweaks listed underneath. Tweaks that',
  '# have no true inverse simply say so instead of pretending.',
  '#',
  '$SoftInstRollback = $false   # set to $true to undo every tweak below',
  '',
].join('\n')

function block(name: string, script: string[], rollback: string[]): string {
  const indent = (lines: string[]) => lines.map((l) => (l.trim() ? '    ' + l : ''))
  return [
    'Write-Host ""',
    'Write-Host ' + psq(' > ' + name) + ' -ForegroundColor Cyan',
    'if ($SoftInstRollback) {',
    '  try {',
    ...indent(rollback),
    '  } catch { Write-Host "   rollback failed" -ForegroundColor Yellow }',
    '} else {',
    '  try {',
    ...indent(script),
    '  } catch { Write-Host "   skipped" -ForegroundColor DarkGray }',
    '}',
    'Write-Host "   done" -ForegroundColor Green',
  ].join('\n')
}

export function generateTweakScript(tweaks: Tweak[]): string {
  if (tweaks.length === 0) return ''
  return (
    ROLLBACK_HEADER + '\n' + tweaks.map((t) => block(t.name, t.script, t.rollback)).join('\n\n') + '\n'
  )
}
