import type { Block, Field } from 'payload'
export const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  {
    name: 'url',
    type: 'text',
    required: true,
    validate: (value: string | null | undefined) =>
      !value ||
      /^(\/(?!\/)|https:\/\/|mailto:|tel:)/.test(value) ||
      'Use a relative path or an https, mailto, or tel URL.',
  },
]
const heading: Field = { name: 'heading', type: 'text' }
const body: Field = { name: 'body', type: 'richText' }
const image: Field = { name: 'image', type: 'upload', relationTo: 'media' }
const block = (slug: string, fields: Field[]): Block => ({
  slug,
  fields: [{ name: 'hidden', type: 'checkbox', defaultValue: false }, ...fields],
})
export const blocks: Block[] = [
  block('videoHero', [
    heading,
    { name: 'video', type: 'upload', relationTo: 'media', required: true },
    { ...image, name: 'poster' },
    { name: 'links', type: 'array', maxRows: 2, fields: linkFields },
  ]),
  block('intro', [heading, body]),
  block('textImage', [
    heading,
    body,
    image,
    { name: 'imagePosition', type: 'select', options: ['left', 'right'], defaultValue: 'right' },
    { name: 'showSocials', type: 'checkbox', defaultValue: true },
  ]),
  block('clientCarousel', [
    heading,
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'direction', type: 'select', options: ['left', 'right'], defaultValue: 'left' },
        {
          name: 'clients',
          type: 'relationship',
          relationTo: 'clients',
          hasMany: true,
          required: true,
        },
      ],
    },
  ]),
  block('projectGrid', [
    heading,
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      required: true,
    },
  ]),
  block('serviceGrid', [
    heading,
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
    },
  ]),
  block('gallery', [
    heading,
    { name: 'aspect', type: 'select', options: ['square', 'video'], defaultValue: 'square' },
    { name: 'images', type: 'array', fields: [{ ...image, required: true }] },
  ]),
  block('callToAction', [
    heading,
    { name: 'description', type: 'textarea' },
    { name: 'link', type: 'group', fields: linkFields },
  ]),
  block('contactForm', [
    heading,
    body,
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thank you! Your message has been received.',
    },
    {
      name: 'labels',
      type: 'group',
      fields: [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'serviceInterest',
        'otherService',
        'message',
        'submit',
      ].map((name) => ({ name, type: 'text' as const })),
    },
  ]),
]
