import { Link } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-title" className="flex flex-col items-start gap-4">
      <h1 id="not-found-title" className="text-hero font-bold">
        Page not found
      </h1>
      <p>We couldn't find that page.</p>
      <Button asChild>
        <Link to={ROUTES.home}>Back to home</Link>
      </Button>
    </section>
  )
}
