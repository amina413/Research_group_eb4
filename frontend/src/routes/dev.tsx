/**
 * Dev-only routes under /dev (see frontend/CLAUDE.md).
 * Registered only when import.meta.env.DEV is true, so they are exempt from
 * the contract and never ship in a production build. Never link to them from
 * app pages.
 */
import type { RouteObject } from 'react-router-dom'

export const devRoutes: RouteObject[] = [
  {
    path: '/dev/styleguide',
    lazy: async () => ({ Component: (await import('@/pages/dev/StyleguidePage')).default }),
  },
]
