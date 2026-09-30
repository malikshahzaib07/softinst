import type { AppSoftware } from '../data/apps'

function stamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

export function generatePowerShell(apps: AppSoftware[]): string {
  const ids = apps.map((a) => a.wingetId)
  const names = apps.map((a) => `${a.name}  [${a.wingetId}]`)

  return `# SoftInst Silent Multi-App Installer
# Generated ${stamp()}
# ${apps.length} app${apps.length === 1 ? '' : 's'} selected
#
# How to run
#   1. Right-click this file → Run with PowerShell
#   2. Approve the Administrator prompt
#   3. Wait. Winget installs each app silently, no extra toolbars.
#
# Requires Windows 10 (1809+) or Windows 11 with App Installer / winget.

$ErrorActionPreference = "Continue"

function Test-Admin {
  $current = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($current)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
  Write-Host "SoftInst needs Administrator rights. Relaunching elevated..." -ForegroundColor Yellow
  $arg = "-NoProfile -ExecutionPolicy Bypass -File \`"$PSCommandPath\`""
  Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList $arg
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
  Write-Host "   Official sources via Windows Package Manager (winget). No junkware." -ForegroundColor DarkGray
  Write-Host ""
}

Write-Banner

Write-Host " Selected software" -ForegroundColor White
Write-Host " -----------------" -ForegroundColor DarkGray
${names.map((n) => `Write-Host "  • ${n.replace(/"/g, "'")}" -ForegroundColor Gray`).join('\n')}
Write-Host ""

$winget = Get-Command winget -ErrorAction SilentlyContinue
if (-not $winget) {
  Write-Host " winget was not found on this PC." -ForegroundColor Red
  Write-Host " Install 'App Installer' from the Microsoft Store, then re-run SoftInst." -ForegroundColor Yellow
  Write-Host " Store link: https://aka.ms/getwinget" -ForegroundColor Yellow
  Write-Host ""
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host " Updating winget source..." -ForegroundColor Cyan
winget source update | Out-Null

$packages = @(
${ids.map((id) => `  "${id}"`).join(',\n')}
)

$ok = @()
$fail = @()
$i = 0

foreach ($id in $packages) {
  $i++
  Write-Host ""
  Write-Host (" [{0}/{1}] Installing {2}  (silent)" -f $i, $packages.Count, $id) -ForegroundColor Cyan
  $args = @(
    "install",
    "--id", $id,
    "-e",
    "--silent",
    "--accept-package-agreements",
    "--accept-source-agreements",
    "--disable-interactivity"
  )
  & winget @args
  if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq -1978335189) {
    # 0 = success, -1978335189 = already installed
    $ok += $id
    Write-Host "     OK" -ForegroundColor Green
  } else {
    $fail += $id
    Write-Host ("     FAILED (exit {0})" -f $LASTEXITCODE) -ForegroundColor Red
  }
}

Write-Host ""
Write-Host " ============================== SUMMARY ==============================" -ForegroundColor White
Write-Host (" Installed / already present : {0}" -f $ok.Count) -ForegroundColor Green
Write-Host (" Failed                      : {0}" -f $fail.Count) -ForegroundColor $(if ($fail.Count -gt 0) { "Red" } else { "Green" })
if ($fail.Count -gt 0) {
  Write-Host " Failed IDs:" -ForegroundColor Yellow
  $fail | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}
Write-Host " ====================================================================" -ForegroundColor White
Write-Host ""
Write-Host " SoftInst finished. You can close this window." -ForegroundColor Magenta
Write-Host ""
Read-Host "Press Enter to exit"
`
}

export function generateBatch(apps: AppSoftware[]): string {
  return `@echo off
title SoftInst Silent Installer
cd /d "%~dp0"
net session >nul 2>&1
if %errorLevel% neq 0 (
  echo SoftInst needs Administrator rights. Prompting now...
  powershell -Command "Start-Process '%~f0' -Verb RunAs"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0SoftInst-Installer.ps1"
if errorlevel 1 pause
`
}

export function generateWingetOneLiner(apps: AppSoftware[]): string {
  const installs = apps
    .map(
      (a) =>
        `winget install -e --id ${a.wingetId} --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`,
    )
    .join('; ')
  return installs
}

export function downloadTextFile(filename: string, contents: string) {
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

export function slugFor(apps: AppSoftware[]) {
  if (apps.length === 0) return 'empty'
  if (apps.length <= 3) return apps.map((a) => a.id).join('-')
  return `${apps.length}-apps`
}
