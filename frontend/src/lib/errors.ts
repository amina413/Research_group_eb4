/** Thrown by services/supabase/* functions the backend hasn't marked ready yet. */
export class NotImplemented extends Error {
  constructor(feature: string) {
    super(`Not implemented yet: ${feature} (use VITE_USE_MOCKS=true until the backend is ready)`)
    this.name = 'NotImplemented'
  }
}
