import type { Page } from '@/payload-types'
import { Heading } from './Heading'
export function ServiceGridBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'serviceGrid' }>
}) {
  return (
    <section className="section max-w-6xl mx-auto">
      <Heading text={b.heading} />
      <div className="grid md:grid-cols-3 gap-8">
        {(b.services || []).map((s) =>
          typeof s !== 'object' ? null : (
            <div
              key={s.id}
              className="border border-gray-700 p-8 rounded-xl bg-[#1f1f1f] hover:border-gray-500"
            >
              <h3 className="text-2xl font-bold mb-6">{s.title}</h3>
              {s.description && <p className="mb-4 text-gray-300">{s.description}</p>}
              <ul className="space-y-3">
                {s.items?.map((item) => (
                  <li key={item.id} className="text-gray-300 flex gap-3">
                    <span aria-hidden="true">•</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </div>
    </section>
  )
}
