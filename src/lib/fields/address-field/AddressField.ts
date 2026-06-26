import { GroupField } from 'payload'

const AddressField = (): GroupField => {
  return {
    name: 'address',
    type: 'group',
    fields: [
      {
        name: 'street',
        type: 'text',
        required: true,
      },
      {
        name: 'suburb',
        type: 'text',
      },
      {
        name: 'city',
        type: 'text',
        required: true,
      },
      {
        name: 'province',
        type: 'text',
        required: true,
      },
      {
        name: 'postCode',
        type: 'text',
      },
      {
        name: 'mapsLink',
        type: 'text',
        validate: (value: string | null | undefined) => {
          if (!value) return true
          const pattern = /^https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9_-]+$/
          return (
            pattern.test(value) ||
            'Must be a valid Google Maps link (e.g. https://maps.app.goo.gl/Mcf5G87gPPebkE5v9)'
          )
        },
      },
    ],
  }
}

export default AddressField
