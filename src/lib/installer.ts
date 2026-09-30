import type { AppSoftware } from '../data/apps'
import type { Tweak } from '../data/tweaks'
import { generateTweakScript } from './tweaks'

export type InstallMethod = 'auto' | 'winget' | 'choco' | 'scoop' | 'direct'

export interface GenerateOptions {
  method: InstallMethod
  includeTweaks: boolean
  tweaks: Tweak[]
  ps1Name?: string
}

const DEFAULT_PS1 = 'SoftInst-Installer.ps1'

function stamp(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

/** Single-quote a string for safe embedding inside a PowerShell script. */
const psq = (s: string): string => `'${s.replace(/'/g, "''")}'`

const ALL_METHODS: InstallMethod[] = ['winget', 'choco', 'scoop', 'direct']

function chainFor(method: InstallMethod): InstallMethod[] {
  if (method === 'auto') return [...ALL_METHODS]
  return [method, ...ALL_METHODS.filter((m) => m !== method)]
}

function methodLabel(method: InstallMethod): string {
  return method === 'direct' ? 'direct vendor installer' : method
}

function appObjects(apps: AppSoftware[]): string {
  if (apps.length === 0) return '  @()'
  const items = apps.map((a) => {
    const s = a.sources
    const fields = [
      `Id = ${psq(a.id)}`,
      `Name = ${psq(a.name)}`,
      `WingetId = ${psq(a.wingetId)}`,
      `ChocoId = ${psq(s.choco)}`,
      `ScoopId = ${psq(s.scoop)}`,
      `DirectUrl = ${psq(s.directUrl ?? '')}`,
      `DirectExe = ${psq(s.directExe ?? '')}`,
      `DirectArgs = ${psq(s.directArgs ?? '')}`,
      `Website = ${psq(a.website)}`,
    ]
    return '  [PSCustomObject]@{ ' + fields.join('; ') + ' }'
  })
  return '@(\n' + items.join(',\n') + '\n)'
}

function tweakBanner(tweaks: Tweak[]): string {
  return [
    'Write-Host ""',
    'Write-Host " ##############################################################" -ForegroundColor Magenta',
    'Write-Host " ##  T W E A K S                                             ##" -ForegroundColor Magenta',
    'Write-Host " ##############################################################" -ForegroundColor Magenta',
    'Write-Host ("  Applying " + $TweakList.Count + " tweak(s). Set $SoftInstRollback = $true to undo.") -ForegroundColor DarkGray',
    'Write-Host ""',
    ...tweaks.map(
      (t) =>
        `Write-Host ("  + " + ${psq(t.name)} + "  [" + ${psq(t.risk)} + "]") -ForegroundColor $SoftInstTweakColor`,
    ),
    'Write-Host ""',
  ].join('\n')
}

function detectionTable(chain: InstallMethod[]): string {
  const chosen = chain[0]
  return [
    'Write-Host " package managers detected on this PC" -ForegroundColor White',
    'Write-Host " ----------------------------------------" -ForegroundColor DarkGray',
    'if ($HasWinget) {',
    '  $wingetVer = (& winget --version 2>$null)',
    '  $wingetVer = ($wingetVer | Out-String).Trim()',
    '  Write-Host ("  winget : available (" + $wingetVer + ")") -ForegroundColor $SoftInstTweakColor',
    '} else {',
    '  Write-Host "  winget : not found" -ForegroundColor DarkGray',
    '}',
    'if ($HasChoco) {',
    '  $chocoVer = (& choco --version 2>$null)',
    '  $chocoVer = ($chocoVer | Out-String).Trim()',
    '  Write-Host ("  choco  : available (" + $chocoVer + ")") -ForegroundColor $SoftInstTweakColor',
    '} else {',
    '  Write-Host "  choco  : not found" -ForegroundColor DarkGray',
    '}',
    'if ($HasScoop) {',
    '  $scoopVer = (& scoop --version 2>$null)',
    '  $scoopVer = ($scoopVer | Out-String).Trim()',
    '  Write-Host ("  scoop  : available (" + $scoopVer + ")") -ForegroundColor DarkGray',
    '} else {',
    '  Write-Host "  scoop  : not found" -ForegroundColor DarkGray',
    '}',
    'Write-Host ("  method : ' + methodLabel(chosen) + ' first, then winget / choco / scoop / direct") -ForegroundColor Yellow',
    'Write-Host ""',
  ].join('\n')
}

const INSTALL_ROUTINE = [
  'function Install-App {',
  '  param($App, $Index, $Total)',
  '  $label = $App.Name + "  [" + $App.WingetId + "]"',
  '  Write-Host ""',
  '  Write-Host (" [" + $Index + "/" + $Total + "] " + $label) -ForegroundColor Cyan',
  '  $done = $false',
  '  $alreadyPresent = $false',
  '',
  '  if ($HasWinget -and $App.WingetId) {',
  '    try {',
  '      $wgArgs = @("install", "--id", $App.WingetId, "-e", "--silent",',
  '        "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity")',
  '      & winget @wgArgs',
  '      if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq -1978335189) {',
  '        $done = $true',
  '        if ($LASTEXITCODE -eq -1978335189) {',
  '          $alreadyPresent = $true',
  '          Write-Host "     already present (winget)" -ForegroundColor DarkGray',
  '        } else {',
  '          Write-Host "     installed (winget)" -ForegroundColor Green',
  '        }',
  '      } else {',
  '        Write-Host ("     winget failed (exit " + $LASTEXITCODE + "), trying next method") -ForegroundColor Yellow',
  '      }',
  '    } catch {',
  '      Write-Host "     winget threw, trying next method" -ForegroundColor Yellow',
  '    }',
  '  }',
  '',
  '  if (-not $done -and $HasChoco -and $App.ChocoId) {',
  '    try {',
  '      $chocoArgs = @("install", $App.ChocoId, "-y", "--no-progress")',
  '      & choco @chocoArgs',
  '      $chocoOut = ""',
  '      if ($LASTEXITCODE -eq 0) {',
  '        $done = $true',
  '        Write-Host "     installed (choco)" -ForegroundColor Green',
  '      } elseif ((& choco list --local-only --exact $App.ChocoId 2>$null | Out-String) -match [regex]::Escape($App.ChocoId)) {',
  '        $done = $true',
  '        $alreadyPresent = $true',
  '        Write-Host "     already present (choco)" -ForegroundColor DarkGray',
  '        $chocoOut = "matched"',
  '      } else {',
  '        Write-Host ("     choco failed (exit " + $LASTEXITCODE + "), trying next method") -ForegroundColor Yellow',
  '        $chocoOut = "failed"',
  '      }',
  '      $chocoOut | Out-Null',
  '    } catch {',
  '      Write-Host "     choco threw, trying next method" -ForegroundColor Yellow',
  '    }',
  '  }',
  '',
  '  if (-not $done -and $HasScoop -and $App.ScoopId) {',
  '    try {',
  '      $scoopArgs = @("install", $App.ScoopId)',
  '      & scoop @scoopArgs',
  '      if ($LASTEXITCODE -eq 0) {',
  '        $done = $true',
  '        Write-Host "     installed (scoop)" -ForegroundColor Green',
  '      } elseif ((& scoop list 2>$null | Out-String) -match [regex]::Escape($App.ScoopId)) {',
  '        $done = $true',
  '        $alreadyPresent = $true',
  '        Write-Host "     already present (scoop)" -ForegroundColor DarkGray',
  '      } else {',
  '        Write-Host ("     scoop failed (exit " + $LASTEXITCODE + "), trying next method") -ForegroundColor Yellow',
  '      }',
  '    } catch {',
  '      Write-Host "     scoop threw, trying next method" -ForegroundColor Yellow',
  '    }',
  '  }',
  '',
  '  if (-not $done -and $App.DirectUrl) {',
  '    try {',
  '      $exeName = $App.DirectExe',
  '      if (-not $exeName) { $exeName = [System.IO.Path]::GetFileName($App.DirectUrl) }',
  '      if (-not $exeName) { $exeName = "setup.exe" }',
  '      $stagingDir = Join-Path $env:TEMP "SoftInst"',
  '      if (-not (Test-Path $stagingDir)) { New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null }',
  '      $target = Join-Path $stagingDir $exeName',
  '      Write-Host ("     downloading " + $target) -ForegroundColor DarkGray',
  '      Invoke-WebRequest -Uri $App.DirectUrl -OutFile $target -UseBasicParsing -ErrorAction Stop',
  '      $directArgs = $App.DirectArgs',
  '      if ($directArgs) {',
  '        Start-Process -FilePath $target -ArgumentList $directArgs -Wait -ErrorAction Stop',
  '      } else {',
  '        Start-Process -FilePath $target -Wait -ErrorAction Stop',
  '      }',
  '      $done = $true',
  '      Write-Host "     installed (direct vendor installer)" -ForegroundColor Green',
  '    } catch {',
  '      Write-Host "     direct download or install failed" -ForegroundColor Yellow',
  '    }',
  '  }',
  '',
  '  if (-not $done) {',
  '    if ($App.Website) {',
  '      Write-Host "     no automated method worked. Install manually from:" -ForegroundColor Yellow',
  '      Write-Host ("       " + $App.Website) -ForegroundColor Yellow',
  '    } else {',
  '      Write-Host "     no automated method worked and no vendor link is known." -ForegroundColor Yellow',
  '    }',
  '    $script:Failed += $App.WingetId',
  '    return $false',
  '  }',
  '',
  '  if ($alreadyPresent) {',
  '    $script:Present += $App.WingetId',
  '  } else {',
  '    $script:Installed += $App.WingetId',
  '  }',
  '  return $true',
  '}',
].join('\n')

function tweakTracking(tweaks: Tweak[]): string {
  return [
    '$TweakList = @(',
    ...tweaks.map(
      (t) =>
        '  [PSCustomObject]@{ Name = ' +
        psq(t.name) +
        '; NeedsReboot = ' +
        (t.needsReboot ? '$true' : '$false') +
        ' }',
    ),
    ')',
  ].join('\n')
}

function buildScript(apps: AppSoftware[], opts: GenerateOptions, tweakBlock: string): string {
  const chain = chainFor(opts.method)
  const chosen = chain[0]
  const names = apps.map((a) => `  ${a.name}  [${a.wingetId}]`)
  const namesBlock =
    apps.length === 0
      ? 'Write-Host "  (nothing selected)" -ForegroundColor DarkGray'
      : names
          .map((n) => `Write-Host "  • ${n.replace(/"/g, "'")}" -ForegroundColor Gray`)
          .join('\n')
  const tweakCount = tweakBlock ? opts.tweaks.length : 0
  const rebootNeeded = tweakBlock && opts.tweaks.some((t) => t.needsReboot)

  return `# SoftInst Silent Multi-App Installer
# Generated ${stamp()}
# ${apps.length} app${apps.length === 1 ? '' : 's'} selected${tweakCount > 0 ? ` + ${tweakCount} tweak(s)` : ''}
#
# How to run
#   1. Double-click SoftInst-Installer.cmd (it elevates for you)
#      or right-click this file -> Run with PowerShell
#   2. Approve the Administrator prompt
#   3. Wait. Every package is installed silently from official sources.
#
# Requires Windows 10 (1809+) or Windows 11.
# Fallback order: winget -> choco -> scoop -> direct vendor installer.

$ErrorActionPreference = "Continue"
$SoftInstTweakColor = "Green"

function Test-Admin {
  $current = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($current)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
  Write-Host "SoftInst needs Administrator rights. Relaunching elevated..." -ForegroundColor Yellow
  Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $PSCommandPath)
  exit
}

try { Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null } catch {}

function Write-Banner {
  Clear-Host
  Write-Host ""
  Write-Host "   ███████╗ ██████╗ ███████╗████████╗██╗███╗   ██╗███████╗████████╗" -ForegroundColor Magenta
  Write-Host "   ██╔════╝██╔═══██╗██╔════╝╚══██╔══╝██║████╗  ██║██╔════╝╚══██╔══╝" -ForegroundColor Magenta
  Write-Host "   ███████╗██║   ██║█████╗     ██║   ██║██╔██╗ ██║███████╗   ██║   " -ForegroundColor Cyan
  Write-Host "   ╚════██║██║   ██║██╔══╝     ██║   ██║██║╚██╗██║╚════██║   ██║   " -ForegroundColor Cyan
  Write-Host "   ███████║╚██████╔╝██║        ██║   ██║██║ ╚████║███████║   ██║   " -ForegroundColor Yellow
  Write-Host "   ╚══════╝ ╚═════╝ ╚═╝        ╚═╝   ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   " -ForegroundColor Yellow
  Write-Host ""
  Write-Host "   Silent multi-app installer  ·  ${apps.length} package(s)  ·  ${stamp()}" -ForegroundColor White
  Write-Host "   Official sources only. No junkware, no bundled toolbars." -ForegroundColor DarkGray
  Write-Host ""
}

Write-Banner

# ---------------------------------------------------------------- app catalogue
$Apps = ${appObjects(apps)}

Write-Host " Selected software" -ForegroundColor White
Write-Host " -----------------" -ForegroundColor DarkGray
${namesBlock}
Write-Host ""

if ($Apps.Count -eq 0) {
  Write-Host " Nothing was selected, so there is nothing to install." -ForegroundColor Yellow
  Write-Host " SoftInst is done. You can close this window." -ForegroundColor Magenta
  Write-Host ""
  if ($Host.Name -match 'ConsoleHost') { Read-Host "Press Enter to exit" }
  exit 0
}

# ------------------------------------------------------- runtime detection
$HasWinget = [bool](Get-Command winget -ErrorAction SilentlyContinue)
$HasChoco = [bool](Get-Command choco -ErrorAction SilentlyContinue)
if (-not $HasChoco) {
  $chocoExe = Join-Path $env:ProgramData "chocolatey\\bin\\choco.exe"
  if (Test-Path $chocoExe) {
    $env:Path = (Join-Path $env:ProgramData "chocolatey\\bin") + ";" + $env:Path
    $HasChoco = $true
  }
}
$HasScoop = [bool](Get-Command scoop -ErrorAction SilentlyContinue)
if (-not $HasScoop) {
  $scoopShim = Join-Path $env:USERPROFILE "scoop\\shims\\scoop.cmd"
  $scoopPs1 = Join-Path $env:USERPROFILE "scoop\\shims\\scoop.ps1"
  if ((Test-Path $scoopShim) -or (Test-Path $scoopPs1)) {
    $scoopShimDir = Join-Path $env:USERPROFILE "scoop\\shims"
    $env:Path = $scoopShimDir + ";" + $env:Path
    $HasScoop = $true
  }
}

${detectionTable(chain)}

$SoftInstTweakColor = "Green"
$RequestedMethod = ${psq(chosen)}
if ($RequestedMethod -eq "direct" -and $HasWinget) {
  $SoftInstTweakColor = "Yellow"
  Write-Host " You asked for direct vendor installers, but nothing here forces that." -ForegroundColor Yellow
  Write-Host " Direct download is used only when winget, choco and scoop all fail." -ForegroundColor Yellow
  Write-Host ""
} elseif ($RequestedMethod -eq "winget" -and -not $HasWinget) {
  $SoftInstTweakColor = "Yellow"
  $fallback = if ($HasChoco) { "choco" } elseif ($HasScoop) { "scoop" } else { "direct vendor installer" }
  Write-Host " winget was requested but is not installed on this PC." -ForegroundColor Yellow
  Write-Host (" Falling back to: " + $fallback) -ForegroundColor Yellow
  Write-Host " Install App Installer from the Microsoft Store: https://aka.ms/getwinget" -ForegroundColor DarkGray
  Write-Host ""
} elseif ($RequestedMethod -eq "choco" -and -not $HasChoco) {
  $SoftInstTweakColor = "Yellow"
  Write-Host " choco was requested but is not installed on this PC." -ForegroundColor Yellow
  Write-Host " Falling back to winget / scoop / direct vendor installer." -ForegroundColor Yellow
  Write-Host ""
} elseif ($RequestedMethod -eq "scoop" -and -not $HasScoop) {
  $SoftInstTweakColor = "Yellow"
  Write-Host " scoop was requested but is not installed on this PC." -ForegroundColor Yellow
  Write-Host " Falling back to winget / choco / direct vendor installer." -ForegroundColor Yellow
  Write-Host ""
}
$SoftInstTweakColor = "Green"

if ($HasWinget) {
  Write-Host " Updating winget sources..." -ForegroundColor Cyan
  try { winget source update | Out-Null } catch {}
}

# ------------------------------------------------------------------ install
$script:Installed = @()
$script:Present = @()
$script:Failed = @()
$script:Methods = @()

${INSTALL_ROUTINE}

$i = 0
foreach ($app in $Apps) {
  $i++
  Install-App -App $app -Index $i -Total $Apps.Count | Out-Null
}

# ------------------------------------------------------------------- tweaks
$TweakList = @()
$script:AppliedTweaks = @()
$script:RebootNeeded = ${rebootNeeded ? '$true' : '$false'}
${tweakCount > 0 ? tweakTracking(opts.tweaks) : ''}
${tweakCount > 0 ? tweakBanner(opts.tweaks) : 'Write-Host " No tweaks selected." -ForegroundColor DarkGray'}
${tweakBlock}
${tweakCount > 0 ? '$script:AppliedTweaks = @($TweakList)' : ''}

# ------------------------------------------------------------------ summary
Write-Host ""
Write-Host " ============================== SUMMARY ==============================" -ForegroundColor White
Write-Host (" Apps handled                   : {0}" -f $Apps.Count) -ForegroundColor Green
Write-Host (" Installed                      : {0}" -f $script:Installed.Count) -ForegroundColor Green
Write-Host (" Already present                : {0}" -f $script:Present.Count) -ForegroundColor Cyan
Write-Host (" Failed                         : {0}" -f $script:Failed.Count) -ForegroundColor $(if ($script:Failed.Count -gt 0) { "Red" } else { "Green" })
if ($script:Failed.Count -gt 0) {
  Write-Host " Failed package ids:" -ForegroundColor Yellow
  $script:Failed | ForEach-Object { Write-Host ("  - " + $_) -ForegroundColor Yellow }
}
Write-Host (" Tweaks applied                 : {0}" -f $script:AppliedTweaks.Count) -ForegroundColor $(if ($script:AppliedTweaks.Count -gt 0) { "Green" } else { "DarkGray" })
if ($script:AppliedTweaks.Count -gt 0) {
  $script:AppliedTweaks | ForEach-Object { Write-Host ("  - " + $_.Name) -ForegroundColor DarkGray }
}
if ($script:RebootNeeded) {
  Write-Host ""
  Write-Host " REBOOT REQUIRED to finish the tweaks that were applied." -ForegroundColor Yellow
}
Write-Host " ====================================================================" -ForegroundColor White
Write-Host ""
Write-Host " SoftInst finished. You can close this window." -ForegroundColor Magenta
Write-Host ""
if ($Host.Name -match 'ConsoleHost') { Read-Host "Press Enter to exit" }
`
}

export function generatePowerShell(apps: AppSoftware[], opts: GenerateOptions): string {
  const tweakBlock =
    opts.includeTweaks && opts.tweaks.length > 0 ? generateTweakScript(opts.tweaks) : ''
  return buildScript(apps, opts, tweakBlock)
}

export function generateBatch(apps: AppSoftware[], opts: GenerateOptions): string {
  const ps1Name = opts.ps1Name || DEFAULT_PS1
  void apps
  return `@echo off
title SoftInst Silent Installer
cd /d "%~dp0"
net session >nul 2>&1
if %errorLevel% neq 0 (
  echo SoftInst needs Administrator rights. Prompting now...
  powershell -Command "Start-Process '%~f0' -Verb RunAs"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0${ps1Name}"
if errorlevel 1 (
  echo.
  echo Installer exited with an error. See the messages above.
  pause
)
`
}

export function generateOneLiner(apps: AppSoftware[], opts: GenerateOptions): string {
  if (apps.length === 0) {
    return 'Write-Host "Nothing selected - pick some apps first" -ForegroundColor Yellow'
  }

  if (opts.method === 'direct') {
    const lines = apps.map((a) => {
      const s = a.sources
      if (!s.directUrl) {
        return `Write-Host ${psq(a.name + ': no direct installer URL - use ' + a.website)} -ForegroundColor Yellow`
      }
      const exe = s.directExe || 'setup.exe'
      const dest = `$env:TEMP\\SoftInst\\${a.id}-${exe}`
      const tail = s.directArgs ? ` -ArgumentList '${s.directArgs.replace(/'/g, "''")}'` : ''
      return `$p="${dest}";New-Item -ItemType Directory -Force -Path (Split-Path $p)|Out-Null;Invoke-WebRequest -UseBasicParsing -Uri '${s.directUrl.replace(/'/g, "''")}' -OutFile $p;Start-Process $p -Wait${tail}`
    })
    return lines.join('; ')
  }

  if (opts.method === 'auto') {
    const wg = apps.map(
      (a) =>
        `winget install -e --id ${a.wingetId} --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`,
    )
    return [
      '# SoftInst: winget first, then the direct vendor URL printed by the store page',
      `if (-not (Get-Command winget -EA SilentlyContinue)) { Write-Host 'winget missing - install App Installer from https://aka.ms/getwinget' -ForegroundColor Yellow } else { ${wg.join('; ')} }`,
    ].join('; ')
  }

  const suffix = ' --silent --accept-package-agreements --accept-source-agreements --disable-interactivity'
  if (opts.method === 'winget') {
    return apps
      .map((a) => `winget install -e --id ${a.wingetId}${suffix}`)
      .join('; ')
  }
  if (opts.method === 'choco') {
    return apps.map((a) => `choco install ${a.sources.choco} -y --no-progress`).join('; ')
  }
  return apps.map((a) => `scoop install ${a.sources.scoop}`).join('; ')
}

export function downloadTextFile(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function slugFor(apps: AppSoftware[]): string {
  if (apps.length === 0) return 'empty'
  if (apps.length <= 3) return apps.map((a) => a.id).join('-')
  return `${apps.length}-apps`
}
