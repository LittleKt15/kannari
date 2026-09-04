'use client'
import { useState } from 'react'
type Labels = Partial<
  Record<
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phoneNumber'
    | 'serviceInterest'
    | 'otherService'
    | 'message'
    | 'submit',
    string | null
  >
>
export function ContactForm({
  services,
  labels,
  successMessage,
}: {
  services: string[]
  labels?: Labels | null
  successMessage?: string | null
}) {
  const [busy, setBusy] = useState(false)
  const [other, setOther] = useState(false)
  const [status, setStatus] = useState<{ error: boolean; text: string } | null>(null)
  return (
    <form
      className="max-w-2xl mx-auto"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        setBusy(true)
        setStatus(null)
        const data = Object.fromEntries(new FormData(form))
        data.otherService ||= ''
        try {
          const result = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          const body = await result.json()
          if (!result.ok) throw new Error(body.error || 'Please try again.')
          form.reset()
          setOther(false)
          setStatus({
            error: false,
            text: successMessage || 'Thank you! Your message has been received.',
          })
        } catch (error) {
          setStatus({
            error: true,
            text: error instanceof Error ? error.message : 'Please try again.',
          })
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="border border-white rounded-lg px-6 sm:px-16 py-6">
        <div className="grid sm:grid-cols-2 gap-x-8">
          {(['firstName', 'lastName'] as const).map((name, i) => (
            <label className="form-field" key={name}>
              <span className="sr-only">{labels?.[name] || (i ? 'Last Name' : 'First Name')}</span>
              <input
                name={name}
                placeholder={labels?.[name] || (i ? 'Last Name' : 'First Name')}
                required
                maxLength={80}
                autoComplete={i ? 'family-name' : 'given-name'}
              />
            </label>
          ))}
        </div>
        <label className="form-field">
          <span className="sr-only">Phone number</span>
          <input
            name="phoneNumber"
            type="tel"
            placeholder={labels?.phoneNumber || 'Phone Number'}
            required
            maxLength={40}
            autoComplete="tel"
          />
        </label>
        <label className="form-field">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            placeholder={labels?.email || 'Email'}
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label className="form-field">
          <span className="sr-only">Service</span>
          <select
            name="serviceInterest"
            required
            defaultValue=""
            onChange={(e) => setOther(e.target.value === 'other')}
          >
            <option value="" disabled>
              {labels?.serviceInterest || 'What services are you looking for?'}
            </option>
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
            <option value="other">Other</option>
          </select>
        </label>
        {other && (
          <label className="form-field">
            <span className="sr-only">Other service</span>
            <input
              name="otherService"
              required
              maxLength={300}
              placeholder={labels?.otherService || 'Please specify your service request'}
            />
          </label>
        )}
        <label className="form-field">
          <span className="sr-only">Message</span>
          <textarea
            name="message"
            required
            maxLength={5000}
            rows={4}
            placeholder={labels?.message || 'Your message'}
          />
        </label>
        <label className="hidden" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="text-center mt-4">
        <button
          disabled={busy}
          className="border border-white rounded px-6 py-2 hover:bg-white hover:text-[#181818] disabled:opacity-50"
        >
          {busy ? 'Sending…' : labels?.submit || 'Send'}
        </button>
      </div>
      {status && (
        <p
          role={status.error ? 'alert' : 'status'}
          className={`mt-4 rounded p-4 ${status.error ? 'bg-red-950' : 'bg-emerald-950'}`}
        >
          {status.text}
        </p>
      )}
    </form>
  )
}
