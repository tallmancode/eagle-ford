import { Field } from 'payload'

const headingBlockFields = (): Field[] => {
  return [
    {
      name: 'headingTag',
      type: 'select',
      label: 'Heading Tag',
      defaultValue: 'h2',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
      ],
    },
    {
      name: 'size',
      type: 'select',
      label: 'Size',
      defaultValue: 'lg',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Alignment',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'color',
      type: 'select',
      label: 'Color',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Success', value: 'success' },
        { label: 'Danger', value: 'danger' },
        { label: 'Warning', value: 'warning' },
        { label: 'White', value: 'white' },
      ],
    },
    {
      name: 'fontWeight',
      type: 'select',
      label: 'Font Weight',
      defaultValue: 'bold',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
        { label: 'Extrabold', value: 'extrabold' },
      ],
    },
    {
      name: 'uppercase',
      type: 'checkbox',
      label: 'Uppercase',
      defaultValue: true,
    },
  ]
}

export default headingBlockFields
