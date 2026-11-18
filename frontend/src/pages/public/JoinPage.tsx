/**
 * Study landing page — /join/:code (C1, C2).
 * Figma: "Study landing page" 69-1190 and "Study landing page: closed" 69-1452.
 * Data only via get_study_by_source_code (rule R-X5).
 */
import { Link, useParams } from 'react-router-dom'
import type { StudyLandingInfo } from '@contract/database.types'
import { ROUTES } from '@contract/routes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentProfile } from '@/features/auth/useCurrentProfile'
import { landingView } from '@/features/studies/landingView'
import { useStudyLanding } from '@/features/studies/useStudyLanding'

function BackToHome() {
  return (
    <Button asChild variant="outline" className="self-start">
      <Link to={ROUTES.home}>Back to home</Link>
    </Button>
  )
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-secondary text-secondary-foreground ring-0">
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="whitespace-pre-line">{children}</CardContent>
    </Card>
  )
}

/** Join card for a recruiting study. Joining while signed in comes with C3. */
function JoinCard({ code, spotsLeft }: { code: string; spotsLeft: number }) {
  const { data: profile, isPending } = useCurrentProfile()
  const registerHref = `${ROUTES.register}?code=${encodeURIComponent(code)}`

  return (
    <Card className="bg-muted ring-0">
      <CardContent className="flex flex-col gap-4">
        <p className="text-number font-bold">
          {spotsLeft} {spotsLeft === 1 ? 'place' : 'places'} left
        </p>
        {isPending ? null : profile === null ? (
          <Button asChild>
            <Link to={registerHref}>Join this study</Link>
          </Button>
        ) : profile?.role === 'participant' ? (
          <p className="text-muted-foreground">
            You're already signed in. Joining a study from your account is coming soon.
          </p>
        ) : (
          <p className="font-bold">This page is for participants.</p>
        )}
      </CardContent>
    </Card>
  )
}

/** Shown instead of the join card when the study isn't taking sign-ups. */
function NotAcceptingPanel({ title, text }: { title: string; text: string }) {
  return (
    <section
      aria-labelledby="not-accepting-title"
      className="flex flex-col gap-1 bg-primary p-6 text-primary-foreground"
    >
      <h2 id="not-accepting-title" className="font-bold">
        {title}
      </h2>
      <p>{text}</p>
    </section>
  )
}

function StudyHeader({ study }: { study: StudyLandingInfo }) {
  return (
    <h1 id="study-title" className="text-hero font-bold">
      {study.title}
    </h1>
  )
}

function Description({ study }: { study: StudyLandingInfo }) {
  return study.description ? <InfoPanel title="About this study">{study.description}</InfoPanel> : null
}

export default function JoinPage() {
  const { code = '' } = useParams()
  const { data: study, isPending, isError, refetch } = useStudyLanding(code)

  if (isPending) {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        Loading study…
      </p>
    )
  }

  if (isError) {
    return (
      <section role="alert" className="flex flex-col items-start gap-4">
        <h1 className="text-hero font-bold">Something went wrong</h1>
        <p>We couldn't load this study. Please try again.</p>
        <Button onClick={() => void refetch()}>Try again</Button>
      </section>
    )
  }

  const view = landingView(study)

  if (view === 'not_found' || !study) {
    return (
      <section aria-labelledby="not-found-title" className="flex flex-col items-start gap-4">
        <h1 id="not-found-title" className="text-hero font-bold">
          We couldn't find that study
        </h1>
        <p>Check the link or QR code you were given. It may have been typed incorrectly, or the study may have been removed.</p>
        <BackToHome />
      </section>
    )
  }

  if (view === 'recruiting') {
    return (
      <article aria-labelledby="study-title" className="flex flex-col gap-6">
        <StudyHeader study={study} />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-4 md:col-span-2">
            <Description study={study} />
            {study.eligibility_criteria && (
              <InfoPanel title="What taking part means">{study.eligibility_criteria}</InfoPanel>
            )}
          </div>
          <aside aria-label="Join this study">
            <JoinCard code={code} spotsLeft={study.spots_left} />
          </aside>
        </div>
      </article>
    )
  }

  // full (C2, rule R-R2) or closed
  const notAccepting =
    view === 'full'
      ? {
          title: 'This study is full',
          text: "It has reached its target number of participants, so it isn't taking new sign-ups.",
        }
      : {
          title: 'This study is no longer accepting participants',
          text: 'Recruitment for this study has closed.',
        }

  return (
    <article aria-labelledby="study-title" className="flex flex-col gap-6">
      <StudyHeader study={study} />
      <div className="flex flex-col gap-4 md:w-2/3">
        <Description study={study} />
        <NotAcceptingPanel {...notAccepting} />
        <BackToHome />
      </div>
    </article>
  )
}
