# SoftInst

SoftInst is a client-side web app for Windows. There is no backend, no database and no account: you tick the applications you want, optionally pick from a set of reversible PC tweaks, and the app generates a single silent installer script that you download and run. Everything happens in your browser.

## Tech stack

| Layer       | Choice                                          |
| ----------- | ----------------------------------------------- |
| UI          | React 19                                         |
| Language    | TypeScript 5.9                                   |
| Build tool  | Vite 7                                           |
| Styling     | Tailwind CSS v4 (via the `@tailwindcss/vite` plugin) |
| Animation   | framer-motion                                    |
| Icons       | lucide-react                                     |
| Routing     | react-router-dom 7                               |

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server
npm run build   # type-check and produce a production build
npm run preview # serve the production build locally
npm run lint    # run ESLint
```

## Project structure

- `src/data/` — the static app catalog and PC tweak definitions, compiled straight into the bundle.
- `src/lib/` — pure logic: PC-spec detection, compatibility checks, and PowerShell / batch script generation.
- `src/context/` — the single global store shared across the app.
- `src/components/` — reusable presentational pieces.
- `src/pages/` — route-level screens.
- `src/index.css` — Tailwind v4 `@theme` tokens plus a few custom utility classes.

## How installation works

A browser cannot know what is already installed on the machine that will run the generated script, and it certainly cannot know which package managers that machine has. So the detection happens **at runtime, inside the generated script**, not at generation time.

For every selected app the script tries each method in order and falls through on failure:

1. **winget** — if `winget` is on PATH, the script installs via the package id and the matching silent switches.
2. **Chocolatey** — if `choco` is available, it falls back to the Chocolatey package id.
3. **Scoop** — if `scoop` is available, it falls back to the Scoop manifest.
4. **Direct vendor download** — as a last resort it downloads the vendor's own installer and runs it with that product's silent/unattended switches.

Users can override the order from the UI. The selectable methods are:

- `auto` — try everything in the order above (the default).
- `winget`
- `choco`
- `scoop`
- `direct` — always use the vendor installer.

A `.cmd` batch launcher is always shipped alongside the generated `.ps1`. Its only job is to hand over to PowerShell and to self-elevate to Administrator through a UAC prompt when the current shell is not already elevated — most of the supported package managers and vendor installers require it.

## How PC tweaks work

Tweaks are grouped into categories (performance, privacy, network, cleanup, interface, and similar). Every tweak ships with its own **rollback commands**, so nothing is a one-way door. The same generated script can be re-run in rollback mode, which reverses the tweaks it applied and leaves everything else alone.

A few tweaks touch things Windows only re-reads at boot. When that is the case the tweak is flagged and the script tells you that a reboot is required.

## How PC spec detection works

Detection runs automatically on page load — there is no button to press — and uses only browser APIs:

- User-Agent Client Hints
- `navigator.hardwareConcurrency` (CPU threads)
- `navigator.deviceMemory` (approximate RAM)
- WebGL `WEBGL_debug_renderer_info` (GPU string)
- `navigator.storage.estimate()` (quota and usage)
- Network Information API (effective connection type)

These readings are used locally to flag apps whose requirements the current machine probably does not meet. Nothing is uploaded and nothing is persisted to a server.

## Data model

Each app entry in the catalog carries the identifiers needed for every install path so the runtime fallback chain always has something to try:

```ts
{
  id: string
  name: string
  description: string
  winget?: string   // winget package id
  choco?: string    // Chocolatey package id
  scoop?: string    // Scoop manifest name
  directUrl?: string// vendor installer URL, plus its silent switches
  requires: { ramMb: number; cores: number; diskMb: number }
  color: string     // brand colour used in the UI
  logo: string      // logo image URL
}
```

The `requires` block holds real published minimums rather than a rough guess, which is what makes the compatibility warnings on the picker meaningful.

## Deployment

SoftInst is a fully static site: the build output is plain HTML, CSS and JavaScript with no server-side runtime. It can be hosted anywhere that serves static files — Vercel, Netlify, or GitHub Pages. `vercel.json` handles the SPA fallback by rewriting all unmatched routes to `/index.html`, which is what client-side routing needs.

## Disclaimer / responsible use

- The generated scripts require Administrator rights and they modify the machine they run on. **Read the generated script before you run it.** It is a plain text file, and nothing about it is hidden from you.
- Rolling back a tweak is best-effort. If you change system settings by other means in the meantime, a rollback may not restore the original state.
- All catalog entries are third-party software. Trademarks, logos and product names belong to their respective owners. Logo images are referenced by URL, not redistributed.
- SoftInst is not affiliated with or endorsed by Microsoft, Ninite, the Chocolatey project, Scoop, or any individual software vendor.
- Use it on machines you own or have permission to administer.
