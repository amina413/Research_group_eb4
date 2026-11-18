import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { setMockSession, type MockSession } from '@/mocks/session'
import { appRoutes } from '@/routes/appRoutes'

/** Render the real route tree at `path` with the given mock user signed in. */
export function renderAt(path: string, session: MockSession) {
  setMockSession(session)
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}
