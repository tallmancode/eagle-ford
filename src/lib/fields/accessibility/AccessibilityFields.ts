import { Field } from 'payload'

export const AccessibilityFields = (): Field[] => {
  return [
    {
      name: 'landmark',
      type: 'select',
      label: 'Landmark Role',
      defaultValue: 'region',
      options: [
        { label: 'None (div)', value: '' },
        { label: 'main', value: 'main' },
        { label: 'section / region', value: 'region' },
        { label: 'header / banner', value: 'banner' },
        { label: 'footer / contentinfo', value: 'contentinfo' },
        { label: 'nav', value: 'navigation' },
        { label: 'aside / complementary', value: 'complementary' },
        { label: 'search', value: 'search' },
        { label: 'form', value: 'form' },
      ],
      admin: {
        description:
          'Sets the semantic HTML element or ARIA landmark role. "region" requires a label to be announced by screen readers.',
      },
    },
    {
      name: 'ariaRoleDescription',
      type: 'text',
      label: 'ARIA Role Description',
      admin: {
        description:
          'Provides a human-readable, localised description of the element\'s role (aria-roledescription). Overrides how assistive technology announces the landmark role — e.g. "Promotional banner" instead of "region". Use sparingly; requires a meaningful role to be set.',
      },
    },
    {
      name: 'ariaLabel',
      type: 'text',
      label: 'ARIA Label',
      admin: {
        description:
          'Provides an accessible name for the section (aria-label). Required when using "region" landmark and no visible heading is present.',
      },
    },
    {
      name: 'ariaLabelledBy',
      type: 'text',
      label: 'ARIA Labelled By (ID)',
      admin: {
        description:
          'References the ID of a visible heading element that labels this section (aria-labelledby). Preferred over ARIA Label when a heading exists.',
      },
    },
    {
      name: 'ariaDescribedBy',
      type: 'text',
      label: 'ARIA Described By (ID)',
      admin: {
        description:
          'References the ID of an element that provides an extended description of this section (aria-describedby).',
      },
    },
    {
      name: 'ariaHidden',
      type: 'checkbox',
      label: 'Hide from Assistive Technology (aria-hidden)',
      defaultValue: false,
      admin: {
        description:
          'Hides this section entirely from screen readers. Use only for purely decorative sections that add no informational value.',
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description:
          'Sets the HTML id attribute. Used as an anchor target and can be referenced by aria-labelledby / aria-describedby on other elements.',
      },
    },
    {
      name: 'tabIndex',
      type: 'select',
      label: 'Tab Index',
      options: [
        { label: 'Default (not set)', value: '' },
        { label: '0 — focusable in natural order', value: '0' },
        { label: '-1 — programmatically focusable only', value: '-1' },
      ],
      admin: {
        description:
          'Controls whether the section itself is focusable. Rarely needed — only set if the section is a scroll target or managed focus container.',
      },
    },
  ]
}
