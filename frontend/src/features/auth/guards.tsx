import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { UserRole } from '@contract/database.types'
import { ROUTES } from '@contract/routes'
import { isAwaitingApproval, useMyEnrolments } from '@/features/enrolments/useEnrolments'
import { landingView } from '@/features/studies/landingView'
import { useStudyLanding } from '@/features/studies/useStudyLanding'
import { clearPendingSourceCode, getPendingSourceCode } from './pendingSourceCode'
import { homeForRole, isSafeInternalPath, type LoginRedirectState } from './roleHome'
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

/**
 * A participant arrived from a study link (saved ?code=): continue to that
 * study's onboarding (C3). If the study isn't recruiting, show its landing page
 * instead; if the code is unknown, carry on to `fallback`.
 */
function ContinueToStudy({ code, fallback }: { code: string; fallback: string }) {
  const { data: study, isPending } = useStudyLanding(code)
  const recruiting = study ? landingView(study) === 'recruiting' : false

  useEffect(() => {
    if (!isPending && !recruiting) clearPendingSourceCode()
  }, [isPending, recruiting])

  if (isPending) return <AuthLoading />
  if (study && recruiting) return <Navigate to={ROUTES.onboarding(study.study_id)} replace />
  if (study && landingView(study) !== 'not_found') return <Navigate to={ROUTES.join(code)} replace />
  return <Navigate to={fallback} replace />
}

/** Researchers/admins don't join studies: drop any saved code. */
function DropCodeAndRedirect({ to }: { to: string }) {
  useEffect(() => clearPendingSourceCode(), [])
  return <Navigate to={to} replace />
}

/**
 * Layout route for /login and /register. A signed-in user (including straight
 * after signing up or logging in) goes:
 * 1. participant with a saved study code → that study's onboarding (C3);
 * 2. otherwise back to the page A3 remembered, if any;
 * 3. otherwise to their own area.
 */
export function RedirectIfSignedIn() {
  const { data: profile, isPending, isError } = useCurrentProfile()
  const location = useLocation()

  if (isPending) return <AuthLoading />
  if (isError) return <AuthError />
  if (profile) {
    const from = (location.state as LoginRedirectState | null)?.from
    const target = isSafeInternalPath(from) ? from : homeForRole(profile.role)
    const code = getPendingSourceCode()
    if (code && profile.role === 'participant') return <ContinueToStudy code={code} fallback={target} />
    if (code) return <DropCodeAndRedirect to={target} />
    return <Navigate to={target} replace />
  }

  return <Outlet />
}

/** R-R5: participant pages that need an approved enrolment. Waiting for approval → pending screen. */
export function RequireApprovedEnrolment() {
  const { data: enrolments, isPending, isError } = useMyEnrolments()

  if (isPending) return <AuthLoading />
  if (isError) return <AuthError />
  if (isAwaitingApproval(enrolments)) return <Navigate to={ROUTES.participantPending} replace />
  return <Outlet />
}

/** C4: the pending screen is only for participants waiting for approval. */
export function RequirePendingEnrolment() {
  const { data: enrolments, isPending, isError } = useMyEnrolments()

  if (isPending) return <AuthLoading />
  if (isError) return <AuthError />
  if (!isAwaitingApproval(enrolments)) return <Navigate to={ROUTES.participant} replace />
  return <Outlet />
}
