import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { UserRole } from '@contract/database.types'
import { ROUTES } from '@contract/routes'
import { homeForRole, type LoginRedirectState } from './roleHome'
import { useCurrentProfile } from './useCurrentProfile'
import { WrongRole } from './WrongRole'

/**
 * UX only — the backend (RLS) is the real guard (03-business-rules).
 */

function AuthLoading() {
  return (
    <p role="status" aria-live="polite" className="text-muted-foreground">
      Loading…
    </p>
  )
}

function AuthError() {
  return (
    <p role="alert" className="font-bold text-destructive">
      We couldn't load your account. Please refresh the page.
    </p>
  )
}

interface RequireRoleProps {
  /** Roles allowed in. Omit to allow any signed-in user (e.g. /settings). */
  roles?: readonly UserRole[]
}

/** Layout route: signed out → login; wrong role → blocked screen; otherwise the page. */
export function RequireRole({ roles }: RequireRoleProps) {
  const { data: profile, isPending, isError } = useCurrentProfile()
  const location = useLocation()

  if (isPending) return <AuthLoading />
  if (isError) return <AuthError />

  if (!profile) {
    const state: LoginRedirectState = { from: location.pathname + location.search }
    return <Navigate to={ROUTES.login} replace state={state} />
  }

  if (roles && !roles.includes(profile.role)) return <WrongRole role={profile.role} />

  return <Outlet />
}

/** Layout route for /login and /register: a signed-in user goes to their own area. */
export function RedirectIfSignedIn() {
  const { data: profile, isPending, isError } = useCurrentProfile()

  if (isPending) return <AuthLoading />
  if (isError) return <AuthError />
  if (profile) return <Navigate to={homeForRole(profile.role)} replace />

  return <Outlet />
}
