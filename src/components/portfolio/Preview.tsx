'use client'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
export function Preview() {
  const router = useRouter()
  return (
    <>
      <RefreshRouteOnSave
        refresh={router.refresh}
        serverURL={typeof window !== 'undefined' ? window.location.origin : ''}
      />
      <button
        className="fixed z-50 bottom-4 left-4 bg-blue-700 text-white rounded-full px-4 py-2 shadow-lg"
        onClick={() => router.push('/exit-preview')}
      >
        Preview mode · Exit
      </button>
    </>
  )
}
