'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export function RetryEmail() {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const [status, setStatus] = useState('')
  return (
    <div>
      <button
        type="button"
        className="kn-button"
        disabled={!id || status === 'Sending…'}
        onClick={async () => {
          setStatus('Sending…')
          try {
            const r = await fetch(`/api/inquiries/${id}/retry`, { method: 'POST' })
            setStatus(r.ok ? 'Attempt completed. Refresh to see delivery status.' : 'Retry failed.')
            router.refresh()
          } catch {
            setStatus('Retry failed.')
          }
        }}
      >
        Retry email notification
      </button>
      <p role="status">{status}</p>
    </div>
  )
}
