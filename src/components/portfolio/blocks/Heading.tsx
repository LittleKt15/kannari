export function Heading({ text }: { text?: string | null }) {
  return text ? (
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
      {text}
    </h2>
  ) : null
}
