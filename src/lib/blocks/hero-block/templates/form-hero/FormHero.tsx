import type { Form, Hero } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { MediaImage } from '@/components/ui/media-image'
import { FormBlockComponent } from '@/lib/blocks/form-block/components/FormBlockComponent'
import { FULL_BLEED_IMAGE_MAX_WIDTH } from '@/lib/utils/getOptimalMediaSize'

export async function FormHero(props: Hero) {
  const content = props.formHeroContent

  if (!content?.image || !content.form) return null

  let form: Form | null = null

  if (typeof content.form === 'object' && content.form !== null) {
    form = content.form
  } else if (typeof content.form === 'string') {
    const payload = await getPayload({ config: configPromise })
    form = await payload.findByID({
      collection: 'forms',
      id: content.form,
      depth: 2,
    })
  }

  if (!form?.id) return null

  const heading = content.heading?.trim() || form.title

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
