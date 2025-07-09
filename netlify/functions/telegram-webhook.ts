import type { Handler } from '@netlify/functions'
import { parse as parseEXIF } from 'exifr'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const GIST_ID = process.env.GIST_ID!
const GH_TOKEN = process.env.GH_TOKEN!

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendTelegramMessage(chatId: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

async function patchGist(payload: any) {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'last-checkin.json': { content: JSON.stringify(payload, null, 2) },
      },
    }),
  })
  return res.ok
}

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

// Extract timestamp from EXIF data, trying several common date tags.
function extractTimestamp(exif: any): number | undefined {
  const dateTags = [
    'DateTimeOriginal',
    'CreateDate',
    'DateTimeDigitized',
    'ModifyDate',
    'GPSDateStamp',
    'DateTime',
  ]
  for (const tag of dateTags) {
    const val = exif?.[tag]
    if (!val)
      continue
    if (val instanceof Date)
      return Math.floor(val.getTime() / 1000)
    if (typeof val === 'string') {
      // EXIF date strings are usually "YYYY:MM:DD HH:mm:SS"
      const parsed = new Date(val.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'))
      if (!Number.isNaN(parsed.getTime()))
        return Math.floor(parsed.getTime() / 1000)
    }
  }
  return undefined
}

// Try to get the most specific place name: first at building/POI level (zoom 18),
// then fall back to suburb/locality (zoom 14) if nothing useful is returned.
async function reverseGeocode(lat: number, lon: number) {
  const base = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2'
  for (const zoom of [18, 14]) {
    const res = await fetch(`${base}&lat=${lat}&lon=${lon}&zoom=${zoom}&addressdetails=1`, {
      headers: { 'User-Agent': 'last-checkin-bot' },
    })
    if (!res.ok)
      continue
    const json = await res.json()
    const name = pickPlaceName(json)
    if (name && name !== 'Somewhere')
      return { json, name }
  }
  // Final fallback with a lower zoom just in case
  const res = await fetch(`${base}&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
    headers: { 'User-Agent': 'last-checkin-bot' },
  })
  const json = await res.json()
  return { json, name: pickPlaceName(json) }
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

  // ──────────────────────────────────────────────
  // Manual override command: /set <place> | <date>
  if (typeof message.text === 'string' && message.text.startsWith('/help')) {
    const helpText = `LastCheckin bot usage:\n\n• Send a Location pin 📍 to set your whereabouts.\n• Send a photo *as a file* (Attach → File → Photos) to use its EXIF GPS.\n• /set Place, City | YYYY-MM-DD HH:mm  — manually set place and optional date.\n   ↳ Date part is optional; omit it to use current time.\n• /help  — show this message.`
    await sendTelegramMessage(message.chat.id, helpText)
    return { statusCode: 200, body: 'help shown' }
  }

  if (typeof message.text === 'string' && message.text.startsWith('/set ')) {
    const raw = message.text.slice(5).trim()
    if (!raw) {
      await sendTelegramMessage(message.chat.id, 'Usage: /set Place, City | YYYY-MM-DD HH:mm')
      return { statusCode: 200, body: 'bad set syntax' }
    }

    const [placePart, datePart] = raw.split('|').map((s: string) => s.trim())
    const [name, ...cityParts] = placePart.split(',').map((s: string) => s.trim())
    const city = cityParts.join(', ')

    let createdAtSec = Math.floor(Date.now() / 1000)
    if (datePart) {
      const parsed = new Date(datePart)
      if (!Number.isNaN(parsed.getTime()))
        createdAtSec = Math.floor(parsed.getTime() / 1000)
    }

    const payload = {
      venue: { name, location: { city } },
      createdAt: createdAtSec,
    }

    const ok = await patchGist(payload)
    await sendTelegramMessage(
      message.chat.id,
      ok ? `✅ Updated! Last seen at ${name}${city ? `, ${city}` : ''}.` : '❌ Failed to update.',
    )
    return { statusCode: 200, body: 'manual set processed' }
  }

  let lat: number | undefined
  let lon: number | undefined
  let createdAtSec: number = message.date // seconds

  // Case 1a: explicit location (regular location or venue)
  if (message.location) {
    lat = message.location.latitude
    lon = message.location.longitude
  }

  // If the user selected a venue (search result), Telegram includes `venue.title`
  // Use it directly – it's often more accurate than reverse-geocoding.
  let venueOverride: string | undefined
  let cityOverride: string | undefined
  if (message.venue) {
    venueOverride = message.venue.title
    // try to infer city from address last part
    const addrParts = (message.venue.address as string | undefined)?.split(',').map(p => p.trim())
    if (addrParts?.length)
      cityOverride = addrParts[addrParts.length - 1]
  }

  // Case 1b: document sent as file (preserves EXIF)
  if (!lat && message.document && message.document.mime_type?.startsWith('image/')) {
    try {
      const fileRes = await fetch(`${TELEGRAM_API}/getFile?file_id=${message.document.file_id}`)
      const fileJson = await fileRes.json()
      const filePath = fileJson.result.file_path as string
      const imgRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`)
      const arrayBuf = await imgRes.arrayBuffer()
      const exif = await parseEXIF(arrayBuf, { translateKeys: false }) as any
      if (exif && exif.latitude && exif.longitude) {
        lat = exif.latitude
        lon = exif.longitude
      }
      const ts = extractTimestamp(exif)
      if (ts)
        createdAtSec = ts
    }
    catch {
      console.warn('EXIF parsing failed (document)')
    }
  }

  // Case 2: compressed photo (may strip EXIF, but try)
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
      const ts = extractTimestamp(exif)
      if (ts)
        createdAtSec = ts
    }
    catch {
      console.warn('EXIF parsing failed')
    }
  }

  if (lat === undefined || lon === undefined) {
    // Nothing we can do
    await sendTelegramMessage(message.chat.id, 'Could not extract location from that message. Try sending a Location pin? Or type /help')
    return { statusCode: 200, body: 'No location' }
  }

  // Reverse geocode
  const { json: geoJson, name: placeName } = await reverseGeocode(lat, lon)
  const venueName = venueOverride ?? placeName
  const cityName = cityOverride ?? pickCity(geoJson)

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
  await sendTelegramMessage(message.chat.id, `✅ Updated! Last seen at ${payload.venue.name}, ${payload.venue.location.city}.`)

  return { statusCode: 200, body: 'ok' }
}
