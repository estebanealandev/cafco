#!/usr/bin/env node
// Generates real, correctly-sized local image files at the exact final paths
// the app imports, so the build never depends on the original Wix/R2 hosts.
// Pixel content is a placeholder — run fetch-legacy-assets.mjs later (from an
// environment with network access to those hosts) to overwrite with the real
// photos at the same paths. No code changes are needed when that happens.
import { Buffer } from 'node:buffer'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { ASSETS, OG_IMAGE, PUBLIC_LOGO } from './assets-manifest.mjs'

const ROOT = new URL('..', import.meta.url).pathname

const BG = '#c4bbae'
const FG = '#2c2824'

function placeholderSvg(width, height, label) {
  const fontSize = Math.max(14, Math.round(Math.min(width, height) / 18))
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${BG}"/>
    <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="${FG}" stroke-opacity="0.25" stroke-width="2"/>
    <text x="50%" y="48%" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" fill="${FG}" fill-opacity="0.7">CAFCO — PLACEHOLDER</text>
    <text x="50%" y="56%" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(fontSize * 0.7)}" fill="${FG}" fill-opacity="0.5">${label} · ${width}×${height}</text>
  </svg>`
}

async function ensureDir(path) {
  await mkdir(dirname(path), { recursive: true })
}

async function main() {
  for (const asset of ASSETS) {
    const outPath = join(ROOT, asset.finalPath)
    await ensureDir(outPath)

    if (asset.format === 'svg') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${asset.width}" height="${asset.height}" viewBox="0 0 ${asset.width} ${asset.height}">
  <text x="0" y="44" font-family="Georgia, serif" font-size="40" font-style="italic" fill="#f5f1ec">CAFCO</text>
</svg>`
      await writeFile(outPath, svg)
      console.warn(`placeholder svg -> ${asset.finalPath}`)
      continue
    }

    const svg = placeholderSvg(asset.width, asset.height, asset.key)
    const pipeline = sharp(Buffer.from(svg))
    await (asset.format === 'webp' ? pipeline.webp({ quality: 80 }) : pipeline.png()).toFile(outPath)
    console.warn(`placeholder ${asset.format} -> ${asset.finalPath} (${asset.width}x${asset.height})`)
  }

  const ogPath = join(ROOT, OG_IMAGE.finalPath)
  await ensureDir(ogPath)
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_IMAGE.width}" height="${OG_IMAGE.height}">
    <rect width="100%" height="100%" fill="#1a1612"/>
    <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="96" fill="#f5f1ec">CAFCO</text>
    <text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#c4bbae">Chorreadores de café artesanales</text>
  </svg>`
  await sharp(Buffer.from(ogSvg)).png().toFile(ogPath)
  console.warn(`placeholder png -> ${OG_IMAGE.finalPath} (${OG_IMAGE.width}x${OG_IMAGE.height}) [net-new, no legacy source]`)

  const publicLogoPath = join(ROOT, PUBLIC_LOGO.finalPath)
  await ensureDir(publicLogoPath)
  const publicLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64">
  <rect width="240" height="64" fill="#f5f1ec"/>
  <text x="8" y="44" font-family="Georgia, serif" font-size="40" font-style="italic" fill="#2c2824">CAFCO</text>
</svg>`
  await writeFile(publicLogoPath, publicLogoSvg)
  console.warn(`placeholder svg -> ${PUBLIC_LOGO.finalPath}`)

  console.warn('\nAll placeholders generated. Run scripts/fetch-legacy-assets.mjs later, from an environment with network access to the original hosts, to replace them with the real images.')
}

main()
