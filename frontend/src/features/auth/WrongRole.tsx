import { Link } from 'react-router-dom'
import type { UserRole } from '@contract/database.types'
import { Button } from '@/components/ui/button'
import { homeForRole } from './roleHome'

/** "Blocked: wrong role" (Figma 69-1271). Shown in place of a page the user's role can't open. */
export function WrongRole({ role }: { role: UserRole }) {
  return (
    <section aria-labelledby="wrong-role-title" className="flex flex-col items-start gap-4 bg-muted p-6">
      <h1 id="wrong-role-title" className="text-hero font-bold">
        You can't open this page
      </h1>
      <p>
        You're signed in as a <strong>{role}</strong>, and this page belongs to a different
        area.
      </p>
      <Button asChild>
        <Link to={homeForRole(role)}>Go to my area</Link>
      </Button>
    </section>
  )
}
