import { Link } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { homeForRole } from '@/features/auth/roleHome'
import { useCurrentProfile } from '@/features/auth/useCurrentProfile'

const STEPS = [
  { title: 'Step 1', text: 'Scan a study QR code or open the link you were given.' },
  { title: 'Step 2', text: 'Sign up and answer a few questions to check you can take part.' },
  { title: 'Step 3', text: 'Complete short daily tasks and earn rewards as you go.' },
]

/** Home / about (`/`). Simplified from the landing page frame (Figma 69-1146). */
export default function HomePage() {
  const { data: profile } = useCurrentProfile()

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="home-title" className="flex flex-col items-start gap-4">
        <h1 id="home-title" className="text-hero font-bold">
          Take part in research that fits your day
        </h1>
        <p className="max-w-prose">
          Join studies run by researchers, complete short tasks from your phone and earn rewards for
          taking part.
        </p>
        <div className="flex flex-wrap gap-2">
          {profile ? (
            <Button asChild>
              <Link to={homeForRole(profile.role)}>Go to your dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link to={ROUTES.register}>I want to take part</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={ROUTES.login}>I'm a researcher</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="how-title" className="flex flex-col gap-4">
        <h2 id="how-title" className="font-bold">
          How it works
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.title}>
              <Card className="h-full bg-secondary text-secondary-foreground ring-0">
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>{step.text}</CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
