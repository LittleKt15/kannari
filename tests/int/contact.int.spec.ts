import { describe, expect, it } from 'vitest'
import { validateContact } from '../../src/lib/contact-validation'
const valid = {
  firstName: 'Alex',
  lastName: 'Example',
  email: 'alex@example.invalid',
  phoneNumber: '123456',
  serviceInterest: 'other',
  otherService: 'Editing',
  message: 'A portfolio inquiry.',
}
describe('Contact boundary validation', () => {
  it('trims valid content', () =>
    expect(validateContact({ ...valid, firstName: ' Alex ' }).firstName).toBe('Alex'))
  it.each([
    null,
    {},
    { ...valid, email: 'not-email' },
    { ...valid, firstName: 42 },
    { ...valid, message: ' ' },
    { ...valid, message: 'x'.repeat(5001) },
    { ...valid, otherService: '' },
  ])('rejects malformed or oversized submissions', (input) =>
    expect(() => validateContact(input)).toThrow(),
  )
})
