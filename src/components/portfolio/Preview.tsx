'use client'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
export function Preview({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  return (
    <>
      <RefreshRouteOnSave refresh={router.refresh} serverURL={serverURL} />
      <button
        type="button"
        className="fixed z-50 bottom-4 left-4 bg-blue-700 text-white rounded-full px-4 py-2 shadow-lg"
        onClick={() => router.push('/exit-preview')}
      >
        Preview mode · Exit
      </button>
    </>
  )
}
