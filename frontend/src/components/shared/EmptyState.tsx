import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  message: string
  /** Buttons / links shown under the message. */
  children?: React.ReactNode
}

/** Card with a message and actions, e.g. "You haven't created any studies yet." (06 §3). */
export function EmptyState({ message, children }: EmptyStateProps) {
  return (
    <Card className="bg-muted ring-0">
      <CardContent className="flex flex-col items-start gap-4">
        <p className="font-bold">{message}</p>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </CardContent>
    </Card>
  )
}
