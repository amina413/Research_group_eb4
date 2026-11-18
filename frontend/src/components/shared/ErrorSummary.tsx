import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorSummaryProps {
  errors: string[]
}

/** "N things to fix before submission" banner (06 §3). */
export function ErrorSummary({ errors }: ErrorSummaryProps) {
  if (errors.length === 0) return null
  const noun = errors.length === 1 ? 'thing' : 'things'
  return (
    <Alert variant="destructive" className="border-destructive">
      <AlertTitle>
        {errors.length} {noun} to fix before submission
      </AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-6">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
