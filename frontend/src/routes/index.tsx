import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import App from '@/App'

// The real route tree (role guards, pages) comes with the app-shell ticket (A3).
const appRoutes: RouteObject[] = [{ path: ROUTES.home, element: <App /> }]

async function loadDevRoutes(): Promise<RouteObject[]> {
  if (!import.meta.env.DEV) return []
  const { devRoutes } = await import('./dev')
  return devRoutes
}

export async function createRouter() {
  const devRoutes = await loadDevRoutes()
  return createBrowserRouter([...appRoutes, ...devRoutes])
}
