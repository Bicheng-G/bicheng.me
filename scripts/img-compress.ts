import fs from 'node:fs/promises'
import process from 'node:process'
import c from 'ansis'
import sharp from 'sharp'

const maxSize = 1440

export async function compressSharp(image: sharp.Sharp, inBuffer: Buffer, inFile: string, outFile: string, options: { format?: 'webp' | 'avif' | 'original', quality?: number } = {}) {
  const { format, width, height } = await image.metadata()
  if (!format)
    throw new Error(`Could not determine format of ${inFile}`)
  if (!width || !height)
    throw new Error(`Could not determine size of ${inFile}`)
  if (!['jpeg', 'png', 'webp', 'heif'].includes(format))
    throw new Error(`Unsupported format ${format} of ${inFile}`)

  if (width > maxSize || height > maxSize)
    image = image.resize(maxSize)

  // Convert to modern format if specified
  const targetFormat = options.format || format
  const quality = options.quality || (targetFormat === 'webp' ? 85 : targetFormat === 'avif' ? 80 : format === 'png' ? 100 : 80)

  if (targetFormat === 'webp') {
    image = image.webp({
      quality,
      effort: 6, // Higher effort for better compression
    })
    outFile = outFile.replace(/\.(jpe?g|png)$/i, '.webp')
  }
  else if (targetFormat === 'avif') {
    image = image.avif({
      quality,
      effort: 9, // Maximum effort for AVIF
    })
    outFile = outFile.replace(/\.(jpe?g|png)$/i, '.avif')
  }
  else if (format === 'jpeg') {
    image = image.jpeg({
      quality,
    })
  }
  else if (format === 'png') {
    image = image.png({
      compressionLevel: 9,
    })
  }
  else {
    // For HEIF or other formats, convert to JPEG as fallback
    image = image.jpeg({
      quality,
    })
  }

  // Auto-rotate based on EXIF orientation before converting, then strip metadata for smaller files
  const outBuffer = await image.rotate().toBuffer()
  const size = inBuffer.byteLength
  const outSize = outBuffer.byteLength

  const percent = (outSize - size) / size
  return {
    image,
    outBuffer,
    size,
    outSize,
    percent,
    inFile,
    outFile,
  }
}

export async function compressImages(files: string[], options: { format?: 'webp' | 'avif' | 'original', quality?: number } = {}) {
  await Promise.all(files.map(async (file) => {
    const buffer = await fs.readFile(file)
    const image = sharp(buffer)
    const { percent, size, outSize, inFile, outFile, outBuffer } = await compressSharp(image, buffer, file, file, options)
    if (percent > -0.10) {
      console.log(c.dim`[SKIP] ${bytesToHuman(size)} -> ${bytesToHuman(outSize)} ${(percent * 100).toFixed(1).padStart(5, ' ')}%  ${inFile}`)
    }
    else {
      await fs.writeFile(outFile, outBuffer)
      console.log(`[COMP] ${bytesToHuman(size)} -> ${bytesToHuman(outSize)} ${c.green`${(percent * 100).toFixed(1).padStart(5, ' ')}%`}  ${inFile}`)
    }
  }))
}

function bytesToHuman(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`.padStart(10, ' ')
}

// CLI functionality
if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2)
  if (files.length === 0) {
    console.log('Usage: tsx img-compress.ts <file1> <file2> ...')
    console.log('       tsx img-compress.ts --webp <file1> <file2> ...')
    process.exit(1)
  }

  const webpMode = files[0] === '--webp'
  const filesToProcess = webpMode ? files.slice(1) : files
  const options = webpMode ? { format: 'webp' as const, quality: 85 } : {}

  compressImages(filesToProcess, options)
}
