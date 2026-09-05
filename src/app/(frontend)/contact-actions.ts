'use server'

import { headers } from 'next/headers'
import { randomUUID } from 'node:crypto'
import { submitContactRequest } from '@/lib/submit-contact'
import { siteURL } from '@/lib/content'
import type { ContactState } from '@/lib/contact-state'

export async function submitContact(
  _previous: ContactState,
  form: FormData,
): Promise<ContactState> {
  const values: Record<string, string> = {}
  for (const name of [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'serviceInterest',
    'otherService',
    'message',
    'website',
  ]) {
    const value = form.get(name)
    values[name] = typeof value === 'string' ? value : ''
  }
  const response = await submitContactRequest(
    new Request(new URL('/api/contact', siteURL()), {
      method: 'POST',
      headers: new Headers(await headers()),
      body: JSON.stringify(values),
    }),
  )
  const result = await response.json()
  return {
    error: !response.ok,
    text: response.ok
      ? 'Thank you! Your message has been received.'
      : result.error || 'Please try again.',
    attempt: randomUUID(),
    values: response.ok ? {} : values,
  }
}
