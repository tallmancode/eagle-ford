import type { GroupField } from 'payload'

const hexColorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export type SocialIconStyleVariant = 'default' | 'custom' | 'rounded'

export type SocialIconStyle = {
  variant?: SocialIconStyleVariant | null
  fill?: string | null
  background?: string | null
}

export const iconStyleFields: GroupField = {
  name: 'iconStyle',
  type: 'group',
  label: 'Icon appearance',
  admin: {
    description: 'Override the default brand color or use a rounded badge style.',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Style',
      defaultValue: 'default',
      options: [
        { label: 'Brand color', value: 'default' },
        { label: 'Custom fill', value: 'custom' },
        { label: 'Rounded badge', value: 'rounded' },
      ],
    },
    {
      name: 'fill',
      type: 'text',
      label: 'Fill color',
      admin: {
        description: 'Hex, e.g. #ffffff',
        condition: (_, siblingData) =>
          siblingData?.variant === 'custom' || siblingData?.variant === 'rounded',
        components: {
          Field: '@/lib/fields/social-icons/components/ColorField#ColorField',
        },
      },
      validate: (
        val: string | null | undefined,
        { siblingData }: { siblingData: SocialIconStyle },
      ) => {
        const variant = siblingData?.variant
        if (variant !== 'custom' && variant !== 'rounded') return true
        if (!val) return 'Fill color is required for this style'
        if (!hexColorPattern.test(val)) return 'Enter a valid hex color (e.g. #ffffff)'
        return true
      },
    },
    {
      name: 'background',
      type: 'text',
      label: 'Background',
      admin: {
        description: 'Hex, e.g. #3b5998',
        condition: (_, siblingData) => siblingData?.variant === 'rounded',
        components: {
          Field: '@/lib/fields/social-icons/components/ColorField#ColorField',
        },
      },
      validate: (
        val: string | null | undefined,
        { siblingData }: { siblingData: SocialIconStyle },
      ) => {
        if (siblingData?.variant !== 'rounded') return true
        if (!val) return 'Background color is required for rounded style'
        if (!hexColorPattern.test(val)) return 'Enter a valid hex color (e.g. #3b5998)'
        return true
      },
    },
  ],
}

export function resolveIconColors(
  defaultColor: string,
  iconStyle?: SocialIconStyle | null,
): { fill: string; bg?: string; variant: SocialIconStyleVariant } {
  const variant = iconStyle?.variant ?? 'default'

  if (variant === 'default') {
    return { fill: defaultColor, variant }
  }

  if (variant === 'custom') {
    return {
      fill: iconStyle?.fill ?? defaultColor,
      variant,
    }
  }

  return {
    fill: iconStyle?.fill ?? '#ffffff',
    bg: iconStyle?.background ?? defaultColor,
    variant,
  }
}
