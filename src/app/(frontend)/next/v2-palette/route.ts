import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { PALETTE_MAX_CUSTOM_COLORS } from '@/lib/blocks/v2/theme'
import { sanitizeHex } from '@/lib/blocks/v2/apply/values'
import {
  normalizePaletteLabel,
  normalizeSavedColors,
  paletteHasHex,
  type SavedPaletteColor,
} from '@/lib/blocks/v2/palette'
import { isPayloadUser } from '@/lib/utils/accessUtil'

type SettingsWithPalette = {
  brandPalette?: {
    customColors?: Array<{ id?: string | null; label?: string | null; hex?: string | null }> | null
  } | null
}

function newPaletteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function isAdminOrDeveloper(user: unknown): boolean {
  if (!isPayloadUser(user)) return false
  return Boolean(user.roles?.includes('admin') || user.roles?.includes('developer'))
}

async function readPalette(payload: Awaited<ReturnType<typeof getPayload>>): Promise<SavedPaletteColor[]> {
  const settings = (await payload.findGlobal({
    slug: 'settings',
    depth: 0,
    overrideAccess: true,
  })) as SettingsWithPalette
  return normalizeSavedColors(settings.brandPalette?.customColors)
}

async function writePalette(
  payload: Awaited<ReturnType<typeof getPayload>>,
  customColors: SavedPaletteColor[],
): Promise<SavedPaletteColor[]> {
  const next = customColors.slice(0, PALETTE_MAX_CUSTOM_COLORS)
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      brandPalette: {
        customColors: next,
      },
    },
    overrideAccess: true,
  })
  return readPalette(payload)
}

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!isPayloadUser(user)) {
    return Response.json({ message: 'Action forbidden.' }, { status: 403 })
  }

  const customColors = await readPalette(payload)
  return Response.json({ customColors })
}

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!isAdminOrDeveloper(user)) {
    return Response.json({ message: 'Action forbidden.' }, { status: 403 })
  }

  let body: Record<string, unknown> = {}
  try {
    const parsed = await request.json()
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>
    }
  } catch {
    return Response.json({ message: 'Invalid JSON body.' }, { status: 400 })
  }

  const hex = sanitizeHex(body.hex)
  if (!hex) {
    return Response.json({ message: 'A valid hex color is required.' }, { status: 400 })
  }

  const existing = await readPalette(payload)
  if (paletteHasHex(existing, hex)) {
    return Response.json({ customColors: existing })
  }
  if (existing.length >= PALETTE_MAX_CUSTOM_COLORS) {
    return Response.json(
      { message: `Palette is limited to ${PALETTE_MAX_CUSTOM_COLORS} custom colors.`, customColors: existing },
      { status: 422 },
    )
  }

  const next = await writePalette(payload, [
    ...existing,
    { id: newPaletteId(), label: normalizePaletteLabel(body.label), hex },
  ])
  return Response.json({ customColors: next })
}

export async function DELETE(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!isAdminOrDeveloper(user)) {
    return Response.json({ message: 'Action forbidden.' }, { status: 403 })
  }

  const url = new URL(request.url)
  let id = url.searchParams.get('id')?.trim() || ''
  if (!id) {
    try {
      const parsed = await request.json()
      if (parsed && typeof parsed === 'object' && typeof (parsed as { id?: unknown }).id === 'string') {
        id = (parsed as { id: string }).id.trim()
      }
    } catch {
      // Body is optional when id is in the query string.
    }
  }
  if (!id) {
    return Response.json({ message: 'Color id is required.' }, { status: 400 })
  }

  const existing = await readPalette(payload)
  const next = await writePalette(
    payload,
    existing.filter((color) => color.id !== id),
  )
  return Response.json({ customColors: next })
}
