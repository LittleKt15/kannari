import { ProjectGrid } from '../Interactive'
import type { Page, Project } from '@/payload-types'
import { Heading } from './Heading'
export function ProjectGridBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'projectGrid' }>
}) {
  return (
    <section className="section px-2 md:px-6">
      <Heading text={b.heading} />
      <ProjectGrid
        projects={(b.projects || []).filter((p): p is Project => typeof p === 'object')}
      />
    </section>
  )
}
