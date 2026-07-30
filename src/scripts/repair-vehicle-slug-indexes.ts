import config from '@payload-config'
import { getPayload } from 'payload'

import { ensureVehicleSlugIndexes } from '@/lib/vehicle-catalog/ensureVehicleSlugIndexes'

async function repairVehicleSlugIndexes(): Promise<void> {
  const payload = await getPayload({ config })

  payload.logger.info('Checking vehicle-models and vehicle-variants slug indexes...')
  await ensureVehicleSlugIndexes(payload)
  payload.logger.info('Vehicle slug index repair complete.')

  await payload.destroy()
}

repairVehicleSlugIndexes().catch((error) => {
  console.error('Failed to repair vehicle slug indexes:', error)
  process.exit(1)
})
