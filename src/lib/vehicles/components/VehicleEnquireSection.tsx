'use client'

import type { Form } from '@/payload-types'
import { FormBlockClient } from '@/lib/blocks/form-block/components/FormBlockClient'

type VehicleEnquireSectionProps = {
  form: Form
  vehicleName: string
  modelName?: string
}

export function VehicleEnquireSection({
  form,
  vehicleName,
  modelName,
}: VehicleEnquireSectionProps) {
  const subject = modelName ? `${modelName}` : vehicleName

  return (
    <section id="enquire" className="scroll-mt-24 border-t bg-muted/40 py-14 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary">Enquire Now</h2>
          <p className="text-muted-foreground">
            Interested in the {subject}? Fill in your details and our team will be in touch.
          </p>
        </div>
        <FormBlockClient
          form={form}
          contextValues={{
            vehicleName,
            ...(modelName ? { modelName } : {}),
          }}
        />
      </div>
    </section>
  )
}
