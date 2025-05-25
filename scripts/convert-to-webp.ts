import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { basename } from 'pathe'
import sharp from 'sharp'
import { compressSharp } from './img-compress'

const folder = fileURLToPath(new URL('../photos', import.meta.url))

const files = (await fg('**/*.{jpg,png,jpeg}', {
  caseSensitiveMatch: false,
  absolute: true,
  cwd: folder,
}))
  .sort((a, b) => a.localeCompare(b))

console.log(`Found ${files.length} images to convert to WebP`)

for (const filepath of files) {
  const webpPath = filepath.replace(/\.(jpe?g|png)$/i, '.webp')

  // Skip if WebP version already exists
  if (existsSync(webpPath)) {
    console.log(`WebP version already exists: ${basename(webpPath)}`)
    continue
  }

  try {
    const buffer = await fs.readFile(filepath)
    const image = sharp(buffer)
    const { outBuffer, percent, outFile } = await compressSharp(image, buffer, filepath, webpPath, { format: 'webp', quality: 85 })

    await fs.writeFile(outFile, outBuffer)
    console.log(`Converted: ${basename(filepath)} -> ${basename(outFile)} (${(percent * 100).toFixed(1)}% size change)`)
  }
  catch (error) {
    console.error(`Failed to convert ${filepath}:`, error)
  }
}

console.log('WebP conversion complete!')
