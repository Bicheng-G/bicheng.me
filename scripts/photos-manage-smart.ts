import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import ExifReader from 'exifreader'
import fg from 'fast-glob'
import { basename, join, parse } from 'pathe'
import sharp from 'sharp'
import { compressSharp } from './img-compress'

const folder = fileURLToPath(new URL('../photos', import.meta.url))

// Check if there are any unprocessed photos (not starting with 'p-')
const unprocessedFiles = await fg('**/*.{jpg,png,jpeg}', {
  caseSensitiveMatch: false,
  absolute: true,
  cwd: folder,
})
  .then(files => files.filter(file => !basename(file).startsWith('p-')))

if (unprocessedFiles.length === 0) {
  console.log('✅ No new photos to process')
  process.exit(0)
}

console.log(`📸 Found ${unprocessedFiles.length} new photos to process`)

const files = unprocessedFiles.sort((a, b) => a.localeCompare(b))

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

  const timeDiff = Date.now() - +date
  // 1 hour
  if (timeDiff < 1000 * 60 * 60) {
    console.warn(`Date of ${filepath} is too recent: ${dateRaw}`)
    continue
  }

  const base = `p-${date.toISOString().replace(/[:.a-z]+/gi, '-')}`
  let index = 1
  while (existsSync(join(folder, `${base}${index}${ext}`.toLowerCase())))
    index++
  writepath = join(folder, `${base}${index}${ext}`.toLowerCase())

  const { outBuffer, percent, outFile } = await compressSharp(img, buffer, filepath, writepath)
  if (outFile !== filepath || percent > -0.10) {
    await fs.writeFile(outFile, outBuffer)
    console.log(`✅ Processed: ${basename(filepath)} -> ${basename(outFile)}`)

    // Automatically create WebP version
    const webpPath = outFile.replace(/\.(jpe?g|png)$/i, '.webp')
    if (!existsSync(webpPath)) {
      try {
        const webpBuffer = await fs.readFile(outFile)
        const webpImage = sharp(webpBuffer)
        const { outBuffer: webpOutBuffer } = await compressSharp(webpImage, webpBuffer, outFile, webpPath, { format: 'webp', quality: 85 })
        await fs.writeFile(webpPath, webpOutBuffer)
        console.log(`✅ Created WebP: ${basename(webpPath)}`)
      }
      catch (error) {
        console.error(`❌ Failed to create WebP for ${outFile}:`, error)
      }
    }
  }

  // Clean up original file if it was renamed
  if (outFile !== filepath) {
    await fs.unlink(filepath)
  }

  if (title) {
    await fs.writeFile(outFile.replace(/\.\w+$/, '.json'), JSON.stringify({ text: title }, null, 2))
  }
}

console.log(`🎉 Successfully processed ${files.length} photos`)
