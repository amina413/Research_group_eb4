import { cn } from '@/lib/utils'

interface ProgressRingProps {
  /** 0–100, as returned by the backend. The UI never calculates it (R-P5). */
  value: number
  label?: string
  className?: string
}

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Donut with the % and "Complete" in the middle (06 §3). Sizes come from theme tokens. */
export function ProgressRing({ value, label = 'Complete', className }: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const offset = CIRCUMFERENCE * (1 - clamped / 100)

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={`${clamped}% ${label}`}
      className={cn('relative grid size-progress place-items-center', className)}
    >
      {/* viewBox units scale with the container; no fixed pixel sizes */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="10" className="stroke-secondary" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset]"
        />
      </svg>
      <div className="relative flex flex-col items-center">
        <span className="text-progress font-bold">{clamped}%</span>
        <span className="text-helper font-bold text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
