import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  try {
    const payload = await getPayload({ config, cron: true })
    const db = payload.db.connection?.db

    if (!db) {
      return NextResponse.json({ status: 'error' }, { status: 503 })
    }

    await db.admin().ping()
    return NextResponse.json({ status: 'ok' })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 503 })
  }
}
