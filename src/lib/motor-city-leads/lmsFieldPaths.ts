export const LMS_FIELD_PATH_OPTIONS: { label: string; value: string }[] = [
  { label: 'Contact — First name', value: 'contact.firstName' },
  { label: 'Contact — Surname', value: 'contact.surname' },
  { label: 'Contact — Email', value: 'contact.email' },
  { label: 'Contact — Cell phone', value: 'contact.cellPhone' },
  { label: 'Contact — Title', value: 'contact.title' },
  { label: 'Contact — Preferred contact method', value: 'contact.preferredContactMethod' },
  { label: 'Seeks — Brand', value: 'seeks.brand' },
  { label: 'Seeks — Model', value: 'seeks.model' },
  { label: 'Seeks — Model range', value: 'seeks.modelrange' },
  { label: 'Seeks — Used (0/1)', value: 'seeks.used' },
  { label: 'Seeks — Year', value: 'seeks.year' },
  { label: 'Seeks — KMs', value: 'seeks.kms' },
  { label: 'Seeks — Stock number', value: 'seeks.stockNr' },
  { label: 'Seeks — MM Code', value: 'seeks.mmCode' },
  { label: 'Seeks — Colour', value: 'seeks.colour' },
  { label: 'Seeks — Price', value: 'seeks.price' },
  { label: 'Seeks — Comments', value: 'seeks.comments' },
  { label: 'Seeks — VIN', value: 'seeks.vin' },
  { label: 'Seeks — Registration', value: 'seeks.regno' },
]

export type LmsFieldPath = (typeof LMS_FIELD_PATH_OPTIONS)[number]['value']
