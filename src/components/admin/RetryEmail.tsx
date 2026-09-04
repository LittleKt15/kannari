'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
export function RetryEmail() {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const [status, setStatus] = useState('')
  const sending = useRef(false)
  return (
    <div>
      <button
        type="button"
        className="kn-button"
        disabled={!id || status === 'Sending…'}
        onClick={async () => {
          if (!id || sending.current) return
          sending.current = true
          setStatus('Sending…')
          try {
            const r = await fetch(`/api/inquiries/${id}/retry`, { method: 'POST' })
            setStatus(r.ok ? 'Attempt completed. Refresh to see delivery status.' : 'Retry failed.')
            router.refresh()
          } catch {
            setStatus('Retry failed.')
          } finally {
            sending.current = false
          }
        }}
      >
        Retry email notification
      </button>
      <p role="status">{status}</p>
    </div>
  )
}
