import Image from 'next/image'
export function Brand() {
  return (
    <div className="kn-brand">
      <Image src="/logo.svg" alt="" width={64} height={64} unoptimized />
      <div>
        KAN NARI<small>CONTENT STUDIO</small>
      </div>
    </div>
  )
}
export function Icon() {
  return <Image src="/logo.svg" alt="Kannari" width={28} height={28} unoptimized />
}
