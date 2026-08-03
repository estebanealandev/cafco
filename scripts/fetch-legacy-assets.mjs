#!/usr/bin/env node
// Downloads the original Wix/R2-hosted CAFCO images and overwrites the local
// placeholders (see generate-placeholders.mjs) at the same paths.
//
// Run this from an environment with network access to static.wixstatic.com
// and the pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev R2 bucket — both were
// unreachable from the sandbox this migration was built in. No other code
// changes are needed afterwards: every image import already points at these
// exact final paths.
//
//   node scripts/fetch-legacy-assets.mjs
import { Buffer } from 'node:buffer'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { ASSETS } from './assets-manifest.mjs'

const ROOT = new URL('..', import.meta.url).pathname

async function download(url, outPath) {
  const res = await fetch(url)
  if (!res.ok)
    throw new Error(`${res.status} ${res.statusText} fetching ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, buffer)
}

async function main() {
  for (const asset of ASSETS) {
    const outPath = join(ROOT, asset.finalPath)
    console.warn(`fetching ${asset.sourceUrl} -> ${asset.finalPath}`)
    await download(asset.sourceUrl, outPath)
  }
  console.warn(
    '\nDone. public/og-image.png and public/cafco-logo.svg have no legacy source '
    + '(they never existed on Wix/R2) — replace those independently with real designs whenever ready.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
