export interface PhotoMate {
  text?: string
  lang?: string
}

export interface Photo extends PhotoMate {
  name: string
  url: string
  webpUrl?: string
  avifUrl?: string
}

const metaInfo = Object.entries(
  import.meta.glob<PhotoMate>('./**/*.json', {
    eager: true,
    import: 'default',
  }),
).map(([name, data]) => {
  name = name.replace(/\.\w+$/, '').replace(/^\.\//, '')
  return {
    name,
    data,
  }
})

// Get all image files
const allImages = Object.entries(
  import.meta.glob<string>('./**/*.{jpg,png,JPG,PNG,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

// Group images by base name (without extension)
const imageGroups = new Map<string, { jpg?: string, png?: string, webp?: string, avif?: string }>()

allImages.forEach(([path, url]) => {
  const name = path.replace(/\.\w+$/, '').replace(/^\.\//, '')
  const ext = path.split('.').pop()?.toLowerCase()

  if (!imageGroups.has(name)) {
    imageGroups.set(name, {})
  }

  const group = imageGroups.get(name)!
  if (ext === 'jpg' || ext === 'jpeg')
    group.jpg = url
  else if (ext === 'png')
    group.png = url
  else if (ext === 'webp')
    group.webp = url
  else if (ext === 'avif')
    group.avif = url
})

const photos = Array.from(imageGroups.entries())
  .map(([name, urls]): Photo => {
    // Prefer original format as main URL, with modern formats as alternatives
    const url = urls.jpg || urls.png || urls.webp || urls.avif || ''

    return {
      ...metaInfo.find(info => info.name === name)?.data,
      name,
      url,
      webpUrl: urls.webp,
      avifUrl: urls.avif,
    }
  })
  .filter(photo => photo.url) // Only include photos with at least one format
  .sort((a, b) => b.name.localeCompare(a.name))

export default photos
