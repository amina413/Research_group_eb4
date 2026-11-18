import { cn } from '@/lib/utils'

/** Grey square standing in for a QR code until the real one is rendered (06 §3). */
export function QrPlaceholder({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="QR code placeholder"
      className={cn('grid size-qr place-items-center rounded-sm bg-secondary text-helper text-muted-foreground', className)}
    >
      QR
    </div>
  )
}
