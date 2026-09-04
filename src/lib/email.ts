import type { Payload } from 'payload'
export async function deliverInquiry(payload: Payload, id: number) {
  // Trusted system operation; the public endpoint validates input and retry requires admin.
  const inquiry = await payload.findByID({ collection: 'inquiries', id, overrideAccess: true })
  if (inquiry.emailStatus === 'sent') return
  try {
    if (!process.env.SMTP_HOST || !process.env.CONTACT_EMAIL)
      throw new Error('Email is not configured')
    await payload.sendEmail({
      to: process.env.CONTACT_EMAIL,
      replyTo: inquiry.email,
      subject: `New inquiry: ${inquiry.firstName} ${inquiry.lastName}`.replace(/[\r\n]/g, ' '),
      text: `Name: ${inquiry.firstName} ${inquiry.lastName}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phoneNumber}\nService: ${inquiry.serviceInterest}\nOther: ${inquiry.otherService || ''}\n\n${inquiry.message}`,
    })
    await payload.update({
      collection: 'inquiries',
      id,
      overrideAccess: true,
      data: { emailStatus: 'sent', emailError: null },
    })
  } catch {
    await payload.update({
      collection: 'inquiries',
      id,
      overrideAccess: true,
      data: {
        emailStatus: 'failed',
        emailError: 'Notification could not be delivered. Check SMTP configuration and retry.',
      },
    })
  }
}
