import Link from 'next/link'
export default function NotFound() {
  return (
    <main className="pt-48 pb-24 text-center">
      <h1 className="text-5xl font-bold">Page not found</h1>
      <Link href="/" className="inline-block mt-8 text-blue-400">
        Back to home
      </Link>
    </main>
  )
}
