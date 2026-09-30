import type { AppSoftware } from '../data/apps'

export type CompatLevel = 'ok' | 'warn' | 'no' | 'unknown'

export interface PCSpecs {
  scannedAt: string
  osName: string
  osVersion: string
  platform: string
  isWindows: boolean
  architecture: string
  bitness: string
  cores: number
  ramGB: number | null
  ramSource: 'deviceMemory' | 'unknown'
  gpu: string
  gpuVendor: string
  screen: string
  pixelRatio: number
  touch: boolean
  language: string
  connection: string
  downlinkMbps: number | null
  storageQuotaGB: number | null
  storageUsageGB: number | null
  userAgent: string
  browser: string
}

export interface CompatResult {
  level: CompatLevel
  reasons: string[]
}

function parseBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Microsoft Edge'
  if (/OPR\//.test(ua) || /Opera/.test(ua)) return 'Opera'
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Google Chrome'
  if (/Firefox\//.test(ua)) return 'Mozilla Firefox'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Unknown browser'
}

function readGpu(): { gpu: string; vendor: string } {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      return { gpu: 'WebGL unavailable', vendor: 'Unknown' }
    }
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    if (info) {
      const renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '')
      const vendor = String(gl.getParameter(info.UNMASKED_VENDOR_WEBGL) || '')
      return { gpu: renderer || 'Unknown GPU', vendor: vendor || 'Unknown' }
    }
    return {
      gpu: String(gl.getParameter(gl.RENDERER) || 'Unknown GPU'),
      vendor: String(gl.getParameter(gl.VENDOR) || 'Unknown'),
    }
  } catch {
    return { gpu: 'Blocked by browser', vendor: 'Unknown' }
  }
}

export async function detectPCSpecs(): Promise<PCSpecs> {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    userAgentData?: {
      platform?: string
      mobile?: boolean
      brands?: { brand: string; version: string }[]
      getHighEntropyValues?: (hints: string[]) => Promise<{
        architecture?: string
        bitness?: string
        platformVersion?: string
        model?: string
        uaFullVersion?: string
        fullVersionList?: { brand: string; version: string }[]
        platform?: string
      }>
    }
    connection?: { effectiveType?: string; downlink?: number; saveData?: boolean }
  }

  let architecture = 'unknown'
  let bitness = ''
  let platformVersion = ''
  let platform = nav.userAgentData?.platform || navigator.platform || 'unknown'

  if (nav.userAgentData?.getHighEntropyValues) {
    try {
      const he = await nav.userAgentData.getHighEntropyValues([
        'architecture',
        'bitness',
        'platformVersion',
        'model',
        'uaFullVersion',
        'fullVersionList',
        'platform',
      ])
      architecture = he.architecture || architecture
      bitness = he.bitness || bitness
      platformVersion = he.platformVersion || ''
      platform = he.platform || platform
    } catch {
      /* privacy-restricted */
    }
  }

  const ua = navigator.userAgent
  const isWindows = /Windows/i.test(platform) || /Windows/i.test(ua)

  let osName = 'Unknown OS'
  let osVersion = ''
  if (isWindows) {
    osName = 'Windows'
    const m = ua.match(/Windows NT ([\d.]+)/)
    const nt = m?.[1]
    const ntMap: Record<string, string> = {
      '10.0': '10 / 11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
    }
    osVersion = platformVersion && platformVersion !== '0.0.0' ? platformVersion : ntMap[nt || ''] || nt || ''
  } else if (/Mac/i.test(platform) || /Mac OS X/.test(ua)) {
    osName = 'macOS'
    osVersion = (ua.match(/Mac OS X ([\d_]+)/)?.[1] || '').replace(/_/g, '.')
  } else if (/Linux/i.test(platform) || /Linux/.test(ua)) {
    osName = 'Linux'
  } else if (/CrOS/.test(ua)) {
    osName = 'ChromeOS'
  } else if (/Android/.test(ua)) {
    osName = 'Android'
  }

  const ramRaw = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null
  const { gpu, vendor } = readGpu()

  let storageQuotaGB: number | null = null
  let storageUsageGB: number | null = null
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate()
      if (est.quota) storageQuotaGB = Math.round((est.quota / 1024 / 1024 / 1024) * 10) / 10
      if (typeof est.usage === 'number') storageUsageGB = Math.round((est.usage / 1024 / 1024 / 1024) * 100) / 100
    }
  } catch {
    /* ignore */
  }

  const conn = nav.connection

  return {
    scannedAt: new Date().toISOString(),
    osName,
    osVersion,
    platform,
    isWindows,
    architecture: architecture + (bitness ? ` ${bitness}-bit` : ''),
    bitness,
    cores: navigator.hardwareConcurrency || 0,
    ramGB: ramRaw,
    ramSource: ramRaw ? 'deviceMemory' : 'unknown',
    gpu,
    gpuVendor: vendor,
    screen: `${screen.width} × ${screen.height}`,
    pixelRatio: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    touch: navigator.maxTouchPoints > 0,
    language: navigator.language,
    connection: conn?.effectiveType ? conn.effectiveType.toUpperCase() : 'Unknown',
    downlinkMbps: typeof conn?.downlink === 'number' ? conn.downlink : null,
    storageQuotaGB,
    storageUsageGB,
    userAgent: ua,
    browser: parseBrowser(ua),
  }
}

export function checkCompat(app: AppSoftware, specs: PCSpecs | null): CompatResult {
  if (!specs) return { level: 'unknown', reasons: ['Scan this PC to compare requirements.'] }

  const reasons: string[] = []
  let level: CompatLevel = 'ok'

  if (!specs.isWindows) {
    reasons.push(`SoftInst installers target Windows. This device looks like ${specs.osName}.`)
    level = 'no'
  }

  if (specs.ramGB != null) {
    if (specs.ramGB < app.minRamGB) {
      reasons.push(`Needs at least ${app.minRamGB} GB RAM. This PC reports ~${specs.ramGB} GB.`)
      level = 'no'
    } else if (specs.ramGB < app.recommendedRamGB) {
      reasons.push(`Runs at ${app.minRamGB} GB, but ${app.recommendedRamGB} GB RAM is recommended. You have ~${specs.ramGB} GB.`)
      if (level === 'ok') level = 'warn'
    }
  } else {
    reasons.push(`Needs ${app.minRamGB} GB RAM minimum (${app.recommendedRamGB} GB recommended). Browser hid exact RAM.`)
    if (level === 'ok') level = 'unknown'
  }

  if (specs.cores && specs.cores < app.minCores) {
    reasons.push(`Needs ${app.minCores}+ CPU cores. This PC reports ${specs.cores}.`)
    if (level !== 'no') level = 'warn'
  }

  if (app.minDiskMB >= 1000 && specs.storageQuotaGB != null && specs.storageQuotaGB < app.minDiskMB / 1024) {
    reasons.push(`Wants ~${Math.ceil(app.minDiskMB / 1024)} GB disk. Browser storage quota looks tight.`)
    if (level !== 'no') level = 'warn'
  }

  if (app.notes) reasons.push(app.notes)

  if (level === 'ok' && reasons.length === 0) {
    reasons.push('Looks good on this PC.')
  }

  return { level, reasons }
}

export function formatBytesHint(mb: number) {
  if (mb >= 1000) return `${(mb / 1024).toFixed(mb >= 10240 ? 0 : 1)} GB`
  return `${mb} MB`
}
