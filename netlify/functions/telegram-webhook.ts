// @ts-expect-error - Netlify provides types at build time, ignore during local lint
import type { Handler } from '@netlify/functions'
// @ts-expect-error - exifr has no types in our project yet
import { parse as parseEXIF } from 'exifr'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const GIST_ID = process.env.GIST_ID!
const GH_TOKEN = process.env.GH_TOKEN!

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

// Simple helper to choose a decent place name from Nominatim result
function pickPlaceName(obj: any) {
  return (
    obj?.name
    || obj?.address?.attraction
    || obj?.address?.building
    || obj?.address?.leisure
    || obj?.address?.park
    || obj?.address?.road
    || obj?.address?.neighbourhood
    || obj?.display_name?.split(',')[0]
    || 'Somewhere'
  )
}

function pickCity(obj: any) {
  return (
    obj?.address?.city
    || obj?.address?.town
    || obj?.address?.village
    || obj?.address?.county
    || obj?.address?.state
    || 'Earth'
  )
}

export const handler: Handler = async (event: any) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' }

  if (!BOT_TOKEN || !GIST_ID || !GH_TOKEN)
    return { statusCode: 500, body: 'Missing env vars' }

  let update
  try {
    update = JSON.parse(event.body ?? '{}')
  }
  catch {
    return { statusCode: 400, body: 'Bad JSON' }
  }

  const message = update.message || update.edited_message
  if (!message)
    return { statusCode: 200, body: 'No message, ignored' }

  let lat: number | undefined
  let lon: number | undefined
  let createdAtSec: number = message.date // seconds

  // Case 1: explicit location
  if (message.location) {
    lat = message.location.latitude
    lon = message.location.longitude
  }

  // Case 2: photo with EXIF
  if (!lat && message.photo) {
    try {
      const largest = message.photo[message.photo.length - 1]
      const fileRes = await fetch(`${TELEGRAM_API}/getFile?file_id=${largest.file_id}`)
      const fileJson = await fileRes.json()
      const filePath = fileJson.result.file_path as string
      const imgRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`)
      const arrayBuf = await imgRes.arrayBuffer()
      const exif = await parseEXIF(arrayBuf, { translateKeys: false }) as any
      if (exif && exif.latitude && exif.longitude) {
        lat = exif.latitude
        lon = exif.longitude
      }
      if (exif?.DateTimeOriginal instanceof Date)
        createdAtSec = Math.floor(exif.DateTimeOriginal.getTime() / 1000)
    }
    catch {
      console.warn('EXIF parsing failed')
    }
  }

  if (lat === undefined || lon === undefined) {
    // Nothing we can do
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: 'Could not extract location from that message. Try sending a Location pin?',
      }),
    })
    return { statusCode: 200, body: 'No location' }
  }

  // Reverse geocode
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
    {
      headers: {
        'User-Agent': 'last-checkin-bot',
      },
    },
  )
  const geoJson = await geoRes.json()
  const venueName = pickPlaceName(geoJson)
  const cityName = pickCity(geoJson)

  const payload = {
    venue: {
      name: venueName,
      location: { city: cityName },
    },
    createdAt: createdAtSec,
  }

  // Patch gist
  const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'last-checkin.json': {
          content: JSON.stringify(payload, null, 2),
        },
      },
    }),
  })

  if (!patchRes.ok) {
    return { statusCode: 502, body: 'Failed to update gist' }
  }

  // Let the sender know
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: message.chat.id,
      text: `✅ Updated! Last seen at ${payload.venue.name}, ${payload.venue.location.city}.`,
    }),
  })

  return { statusCode: 200, body: 'ok' }
}
