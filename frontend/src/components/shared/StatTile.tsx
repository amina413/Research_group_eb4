import { Card, CardContent } from '@/components/ui/card'

interface StatTileProps {
  label: string
  value: React.ReactNode
}

/** Card with a label and one big value, e.g. "54 / 80" (06 §3). */
export function StatTile({ label, value }: StatTileProps) {
  return (
    <Card className="bg-secondary text-secondary-foreground ring-0">
      <CardContent className="flex flex-col gap-1">
        <span className="text-helper font-bold">{label}</span>
        <span className="text-number font-bold">{value}</span>
      </CardContent>
    </Card>
  )
}
