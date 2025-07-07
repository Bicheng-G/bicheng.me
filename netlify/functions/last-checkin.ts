import type { Handler } from '@netlify/functions'

const GIST_ID = process.env.GIST_ID!
const GH_TOKEN = process.env.GH_TOKEN // optional for higher rate limits

export const handler: Handler = async (event: any) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }

  if (!GIST_ID) {
    return {
      statusCode: 500,
      body: 'Missing GIST_ID env var',
    }
  }

  try {
    const apiUrl = `https://api.github.com/gists/${GIST_ID}`
    const res = await fetch(apiUrl, {
      headers: GH_TOKEN ? { Authorization: `token ${GH_TOKEN}` } : undefined,
    })

    if (!res.ok) {
      return {
        statusCode: 502,
        body: 'Failed to fetch gist',
      }
    }

    const gist: any = await res.json()
    const file = gist.files?.['last-checkin.json']
    if (!file?.content) {
      return {
        statusCode: 404,
        body: 'last-checkin.json not found in gist',
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: file.content,
    }
  }
  catch {
    return {
      statusCode: 500,
      body: 'Unexpected error',
    }
  }
}
