import { cn } from '@/lib/utils'

interface FieldErrorProps {
  id?: string
  children: React.ReactNode
  className?: string
}

/** "!" mark + message shown under an invalid field (06 §3). Link it with aria-describedby. */
export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p id={id} className={cn('flex items-center gap-2 text-helper font-bold text-destructive', className)}>
      <span
        aria-hidden
        className="inline-flex size-mark shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
      >
        !
      </span>
      {children}
    </p>
  )
}
