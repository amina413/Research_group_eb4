import { useParams } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  /** What the page is for (data contract §7). */
  description: string
  /** Feature IDs from docs/02-features.md that will build this page. */
  features: string[]
}

/** Stand-in for a page that hasn't been built yet. */
export function PlaceholderPage({ title, description, features }: PlaceholderPageProps) {
  const params = Object.entries(useParams())

  return (
    <section aria-labelledby="page-title" className="flex flex-col gap-4">
      <h1 id="page-title" className="text-hero font-bold">
        {title}
      </h1>
      <p>{description}</p>
      {params.length > 0 && (
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-helper">
          {params.map(([key, value]) => (
            <div key={key} className="flex gap-1">
              <dt className="font-bold">{key}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="text-helper text-muted-foreground">
        Placeholder page · {features.length > 0 ? `features ${features.join(', ')}` : 'not built yet'}
      </p>
    </section>
  )
}
