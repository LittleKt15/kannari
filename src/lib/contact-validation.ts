export function validateContact(input: unknown) {
  if (!input || typeof input !== 'object') throw new Error('Invalid form')
  const raw = input as Record<string, unknown>
  const field = (name: string, max: number, required = true) => {
    const value = raw[name]
    if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
      throw new Error(`Please check ${name}.`)
    return value.trim()
  }
  const data = {
    firstName: field('firstName', 80),
    lastName: field('lastName', 80),
    email: field('email', 254),
    phoneNumber: field('phoneNumber', 40),
    serviceInterest: field('serviceInterest', 120),
    otherService: field('otherService', 300, false),
    message: field('message', 5000),
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    throw new Error('Enter a valid email address.')
  if (data.serviceInterest === 'other' && !data.otherService)
    throw new Error('Please describe the service you need.')
  return data
}
