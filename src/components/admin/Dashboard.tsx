import Link from 'next/link'
import type { Payload } from 'payload'
import type { User } from '@/payload-types'
export async function Dashboard({ payload, user }: { payload: Payload; user: User }) {
  const access = { user, overrideAccess: false as const }
  const [pages, projects, media, inquiries] = await Promise.all([
    payload.find({ collection: 'pages', ...access, depth: 0, limit: 100, sort: '-updatedAt' }),
    payload.count({ collection: 'projects', ...access }),
    payload.count({ collection: 'media', ...access }),
    user.role === 'admin'
      ? payload.find({ collection: 'inquiries', ...access, limit: 5, sort: '-createdAt' })
      : null,
  ])
  return (
    <div className="kn-dashboard">
      <section className="kn-welcome">
        <div>
          <p className="kn-eyebrow">YOUR STORIES, BEAUTIFULLY MANAGED</p>
          <h1>Welcome back, {user.name?.split(' ')[0] || 'creator'}.</h1>
          <p>
            Shape the next frame. Edit your portfolio, share your work, and bring new stories to
            life.
          </p>
        </div>
        <Link href="/" target="_blank" className="kn-button">
          View website ↗
        </Link>
      </section>
      <div className="kn-stats">
        {[
          [pages.docs.filter((p) => p._status === 'published').length, 'Published pages'],
          [pages.docs.filter((p) => p._status === 'draft').length, 'Draft pages'],
          [projects.totalDocs, 'Projects'],
          [media.totalDocs, 'Media assets'],
        ].map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="kn-panel">
        <div className="kn-section-heading">
          <h2>Your pages</h2>
          <Link href="/admin/collections/pages/create">Create page +</Link>
        </div>
        <div className="kn-page-grid">
          {pages.docs.map((p) => (
            <Link className="kn-page-card" key={p.id} href={`/admin/collections/pages/${p.id}`}>
              <span className="kn-eyebrow">{p.slug === 'home' ? '/' : `/${p.slug}`}</span>
              <h3>{p.title}</h3>
              <span className={`kn-status ${p._status}`}>{p._status}</span>
              <span className="kn-card-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <div className="kn-lower">
        <section className="kn-panel">
          <h2>Keep creating</h2>
          <div className="kn-links">
            <Link href="/admin/collections/projects/create">
              Add a project <span>↗</span>
            </Link>
            <Link href="/admin/collections/media/create">
              Upload media <span>↗</span>
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin/globals/site-settings">
                Brand & navigation <span>↗</span>
              </Link>
            )}
          </div>
        </section>
        <section className="kn-panel">
          <h2>{inquiries ? 'Latest inquiries' : 'Recently updated'}</h2>
          <div className="kn-links">
            {inquiries ? (
              inquiries.docs.length ? (
                inquiries.docs.map((i) => (
                  <Link key={i.id} href={`/admin/collections/inquiries/${i.id}`}>
                    <span>
                      {i.firstName} {i.lastName}
                      <small>{i.serviceInterest}</small>
                    </span>
                    <span className={i.emailStatus === 'failed' ? 'kn-failed' : ''}>
                      {i.emailStatus === 'failed' ? 'Email needs attention' : i.status}
                    </span>
                  </Link>
                ))
              ) : (
                <p>Your next story starts here. New inquiries will appear in this inbox.</p>
              )
            ) : (
              pages.docs.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/admin/collections/pages/${p.id}`}>
                  {p.title}
                  <span>{new Date(p.updatedAt).toLocaleDateString('en-US')}</span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
