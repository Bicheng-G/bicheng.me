export interface PhotoMate {
  text?: string
  lang?: string
}

export interface Photo extends PhotoMate {
  name: string
  url: string
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

// Get all WebP image files (single format strategy)
const allImages = Object.entries(
  import.meta.glob<string>('./**/*.webp', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

// Simple mapping since we only have WebP files
const imageMap = new Map<string, string>()

allImages.forEach(([path, url]) => {
  const name = path.replace(/\.webp$/, '').replace(/^\.\//, '')
  imageMap.set(name, url)
})

const photos = Array.from(imageMap.entries())
  .map(([name, url]): Photo => {
    const metadata = metaInfo.find(info => info.name === name)?.data || {}
    return {
      ...metadata,
      name,
      url,
    }
  })
  .filter((photo): photo is Photo => Boolean(photo && photo.name && photo.url)) // Filter out any invalid photos
  .sort((a, b) => b.name.localeCompare(a.name))

export default photos
