import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { appRoutes } from './appRoutes'

async function loadDevRoutes(): Promise<RouteObject[]> {
  if (!import.meta.env.DEV) return []
  const { devRoutes } = await import('./dev')
  return devRoutes
}

export async function createRouter() {
  const devRoutes = await loadDevRoutes()
  return createBrowserRouter([...devRoutes, ...appRoutes])
}
