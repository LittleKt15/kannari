import type { Page, SiteSetting, Service } from '@/payload-types'
import { VideoHeroBlock } from './blocks/VideoHeroBlock'
import { IntroBlock } from './blocks/IntroBlock'
import { TextImageBlock } from './blocks/TextImageBlock'
import { ClientCarouselBlock } from './blocks/ClientCarouselBlock'
import { ProjectGridBlock } from './blocks/ProjectGridBlock'
import { ServiceGridBlock } from './blocks/ServiceGridBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { CallToActionBlock } from './blocks/CallToActionBlock'
import { ContactFormBlock } from './blocks/ContactFormBlock'
type Props = {
  block: NonNullable<Page['layout']>[number]
  settings: SiteSetting
  services: Service[]
}
export function Blocks({
  layout,
  settings,
  services,
}: {
  layout: Page['layout']
  settings: SiteSetting
  services: Service[]
}) {
  return (
    <>
      {layout?.map((block) =>
        block.hidden ? null : (
          <Block key={block.id} block={block} settings={settings} services={services} />
        ),
      )}
    </>
  )
}
function Block({ block, settings, services }: Props) {
  switch (block.blockType) {
    case 'videoHero':
      return <VideoHeroBlock block={block} />
    case 'intro':
      return <IntroBlock block={block} />
    case 'textImage':
      return <TextImageBlock block={block} settings={settings} />
    case 'clientCarousel':
      return <ClientCarouselBlock block={block} />
    case 'projectGrid':
      return <ProjectGridBlock block={block} />
    case 'serviceGrid':
      return <ServiceGridBlock block={block} />
    case 'gallery':
      return <GalleryBlock block={block} />
    case 'callToAction':
      return <CallToActionBlock block={block} />
    case 'contactForm':
      return <ContactFormBlock block={block} services={services} />
  }
}
