import type { Block } from 'payload'

export const ReviewsBlock: Block = {
  slug: 'reviews',
  interfaceName: 'Reviews',
  labels: {
    singular: 'Reviews',
    plural: 'Reviews',
  },
  admin: {
    group: 'Cards',
    components: {
      Label: '/lib/blocks/reviews-block/components/ReviewsBlockLabel',
    },
  },
  fields: [],
}
