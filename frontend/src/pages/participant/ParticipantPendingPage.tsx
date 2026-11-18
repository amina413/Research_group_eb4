/**
 * "Waiting for approval" — /participant/pending (C4, rule R-R5).
 * Figma "Eligibility results: pending" 69-1524. No study name yet: participants
 * can't read `studies` under R-X2 (see PR notes).
 */
import { Link } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { Button } from '@/components/ui/button'

export default function ParticipantPendingPage() {
  return (
    <section aria-labelledby="pending-title" className="flex flex-col gap-4">
      <h1 id="pending-title" className="text-hero font-bold">
        Eligibility results
      </h1>
      <div className="flex flex-col items-start gap-3 bg-primary p-6 text-primary-foreground md:w-1/2">
        <h2 className="font-bold">Pending approval</h2>
        <p>We will email you once a researcher approves you.</p>
        <Button asChild variant="outline" className="text-foreground">
          <Link to={ROUTES.home}>Back to home</Link>
        </Button>
      </div>
    </section>
  )
}
