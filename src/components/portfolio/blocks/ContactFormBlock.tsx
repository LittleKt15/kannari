import { RichText } from '@payloadcms/richtext-lexical/react'
import { ContactForm } from '../ContactForm'
import type { Page, Service } from '@/payload-types'
import { Heading } from './Heading'
export function ContactFormBlock({
  block: b,
  services,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'contactForm' }>
  services: Service[]
}) {
  return (
    <section className="section max-w-3xl mx-auto">
      <Heading text={b.heading} />
      {b.body && <RichText data={b.body} className="rich-text text-center text-gray-300 mb-12" />}
      <ContactForm
        services={services.map((s) => s.title)}
        labels={b.labels}
        successMessage={b.successMessage}
      />
    </section>
  )
}
