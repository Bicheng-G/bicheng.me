/**
 * Smart Photo Processor
 *
 * Processes photos with the following features:
 * - Converts any format (JPG, PNG, HEIC) to optimized WebP
 * - Extracts EXIF data for proper dating
 * - Resizes large images (max 1440px)
 * - Auto-rotates based on EXIF orientation
 * - Renames with timestamp: p-2024-12-25-10-30-00-1.webp
 * - Deletes original files (WebP-only strategy)
 *
 * Usage:
 *   pnpm run photos        # Process only new photos
 *   pnpm run photos:force  # Process all photos (re-process existing)
 */

import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ExifReader from 'exifreader'
import fg from 'fast-glob'
import { basename, join, parse } from 'pathe'
import sharp from 'sharp'
import { compressSharp } from './img-compress'

const folder = fileURLToPath(new URL('../photos', import.meta.url))

// CLI option to force process all photos (not just unprocessed ones)
const forceAll = process.argv.includes('--force')

// Get files to process based on mode
const allFiles = await fg('**/*.{jpg,png,jpeg,heic,JPG,PNG,JPEG,HEIC}', {
  caseSensitiveMatch: false,
  absolute: true,
  cwd: folder,
})

const filesToProcess = forceAll
  ? allFiles
  : allFiles.filter(file => !basename(file).startsWith('p-'))

if (filesToProcess.length === 0) {
  console.log('✅ No photos to process')
  process.exit(0)
}

const mode = forceAll ? 'all photos' : 'new photos'
console.log(`📸 Found ${filesToProcess.length} ${mode} to process`)

const files = filesToProcess.sort((a, b) => a.localeCompare(b))

let processedCount = 0

for (const filepath of files) {
  let writepath = filepath
  let { ext } = parse(filepath.toLowerCase())
  if (ext === '.jpeg')
    ext = '.jpg'
  const buffer = await fs.readFile(filepath)
  const img = await sharp(buffer)
  const exif = await ExifReader.load(buffer)

  let title: string | undefined

  let dateRaw = exif.DateTimeOriginal?.value || exif.DateTime?.value || exif.DateCreated?.value
  dateRaw ||= new Date(await fs.stat(filepath).then(stat => stat.birthtime || stat.mtime)).toISOString()
  if (Array.isArray(dateRaw))
    dateRaw = dateRaw[0] as string
  dateRaw = String(dateRaw)

  // convert 2025:02:02 10:07:10 to date object
  const date = new Date(dateRaw.replace(/:/g, (x, idx) => {
    if (idx < 10)
      return '-'
    return x
  }))

  const base = `p-${date.toISOString().replace(/[:.a-z]+/gi, '-')}`
  let index = 1
  while (existsSync(join(folder, `${base}${index}${ext}`.toLowerCase())))
    index++
  writepath = join(folder, `${base}${index}${ext}`.toLowerCase())

  // Convert directly to WebP with Sharp optimizations
  const webpPath = writepath.replace(/\.(jpe?g|png|heic)$/i, '.webp')
  const { outBuffer: webpBuffer, percent } = await compressSharp(img, buffer, filepath, webpPath, { format: 'webp', quality: 85 })

  if (percent > -0.10) {
    console.log(`✅ Processed: ${basename(filepath)} -> ${basename(webpPath)}`)
    await fs.writeFile(webpPath, webpBuffer)
  }
  else {
    console.log(`✅ Optimized: ${basename(filepath)} -> ${basename(webpPath)} (${(percent * 100).toFixed(1)}% reduction)`)
    await fs.writeFile(webpPath, webpBuffer)
  }

  // Always delete the original file (WebP-only strategy)
  await fs.unlink(filepath)

  if (title) {
    await fs.writeFile(webpPath.replace(/\.\w+$/, '.json'), JSON.stringify({ text: title }, null, 2))
  }

  processedCount++
}

if (processedCount === 0) {
  console.log('⏭️  No photos were processed (all were too recent or already processed)')
}
else {
  console.log(`🎉 Successfully processed ${processedCount} photos`)
}
