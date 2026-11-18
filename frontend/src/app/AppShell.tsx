import { lazy, Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { TopNav, type NavItem } from '@/components/layout/TopNav'
import { homeForRole } from '@/features/auth/roleHome'
import { useSignOut } from '@/features/auth/useAuthMutations'
import { useCurrentProfile } from '@/features/auth/useCurrentProfile'

// Dev-only: not included in production builds, and hidden when real auth is on.
const DevRoleSwitcher =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS !== 'false'
    ? lazy(() => import('@/components/dev/DevRoleSwitcher'))
    : null

function navFor(profile: ReturnType<typeof useCurrentProfile>['data']): {
  items: NavItem[]
  actions: NavItem[]
} {
  if (profile === undefined) return { items: [], actions: [] } // still loading
  if (profile === null) {
    return {
      items: [{ label: 'About', to: ROUTES.home }],
      actions: [
        { label: 'Log in', to: ROUTES.login },
        { label: 'Sign up', to: ROUTES.register },
      ],
    }
  }
  return {
    items: [{ label: 'Home', to: homeForRole(profile.role) }],
    actions: [{ label: 'Account', to: ROUTES.settings }],
  }
}

/** Nav bar + page content for every route. */
export function AppShell() {
  const { data: profile } = useCurrentProfile()
  const { items, actions } = navFor(profile)
  const navigate = useNavigate()
  const signOut = useSignOut()

  function handleSignOut() {
    // Leave protected pages first, or their guard would send us to /login.
    void navigate(ROUTES.home)
    signOut.mutate()
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-sm bg-background px-4 py-2 font-bold text-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-3 focus:ring-ring"
      >
        Skip to main content
      </a>
      <TopNav items={items} actions={actions} onSignOut={profile ? handleSignOut : undefined} />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-content flex-1 px-inset py-8 outline-none md:px-inset-lg">
        <Outlet />
      </main>
      {DevRoleSwitcher && (
        <Suspense fallback={null}>
          <DevRoleSwitcher />
        </Suspense>
      )}
    </div>
  )
}
