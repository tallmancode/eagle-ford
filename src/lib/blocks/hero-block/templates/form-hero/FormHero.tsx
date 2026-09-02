import type { Hero } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { MediaImage } from '@/components/ui/media-image'
import { FormBlockComponent } from '@/lib/blocks/form-block/components/FormBlockComponent'
import { getFormDisplayLabel } from '@/lib/forms/enquiryFormIdentity'
import { FULL_BLEED_IMAGE_MAX_WIDTH } from '@/lib/utils/getOptimalMediaSize'

export async function FormHero(props: Hero) {
  const content = props.formHeroContent

  if (!content?.image || !content.form) return null

  const formId =
    typeof content.form === 'object' && content.form !== null
      ? content.form.id
      : typeof content.form === 'string'
        ? content.form
        : null

  if (!formId) return null

  // Always depth 2 so confirmation redirect.reference resolves to a Page with slug.
  const payload = await getPayload({ config: configPromise })
  const form = await payload.findByID({
    collection: 'forms',
    id: formId,
    depth: 2,
    disableErrors: true,
  })

  if (!form?.id) return null

  const heading =
    content.heading?.trim() || getFormDisplayLabel(form.form_name) || form.title

  return (
    <section className="relative w-full">
      <div className="w-full">
        <MediaImage
          resource={content.image}
          imgClassName="w-full h-auto block"
          priority
          loading="eager"
          maxWidth={FULL_BLEED_IMAGE_MAX_WIDTH}
          size="100vw"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 -mt-16 pb-8 md:-mt-24 md:pb-12 lg:-mt-32">
        <div className="bg-white p-6 shadow-lg md:p-8 lg:p-10">
          {heading ? (
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
              {heading}
            </h2>
          ) : null}
          <FormBlockComponent
            form={form}
            enableIntro={false}
            layout="hero"
            blockType="formBlock"
          />
        </div>
      </div>
    </section>
  )
}

export default FormHero
