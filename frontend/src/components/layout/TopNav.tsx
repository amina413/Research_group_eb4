import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  to: string
}

interface TopNavProps {
  /** Links shown after the logo, e.g. "Home". */
  items: NavItem[]
  /** Links pinned to the right, e.g. "Account" or "Log in" / "Sign up". */
  actions?: NavItem[]
  className?: string
}

/** Top nav bar (06 §3): logo at left, tabs, actions at right. */
export function TopNav({ items, actions = [], className }: TopNavProps) {
  const linkClass =
    'inline-flex h-button items-center rounded-sm px-3 font-bold outline-none hover:bg-primary-foreground/10 focus-visible:ring-3 focus-visible:ring-primary-foreground/60'

  return (
    <header className={cn('bg-primary text-primary-foreground', className)}>
      <nav
        aria-label="Main"
        className="mx-auto flex h-nav max-w-content items-center gap-2 px-inset md:px-inset-lg"
      >
        <span aria-hidden className="size-mark shrink-0 rounded-full bg-primary-foreground/80" />
        <span className="sr-only">Logo</span>
        <ul className="flex items-center gap-1">
          {items.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="ml-auto flex items-center gap-1">
          {actions.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
