/** Thrown by services/supabase/* functions the backend hasn't marked ready yet. */
export class NotImplemented extends Error {
  constructor(feature: string) {
    super(`Not implemented yet: ${feature} (use VITE_USE_MOCKS=true until the backend is ready)`)
    this.name = 'NotImplemented'
  }
}

export type AuthErrorCode = 'invalid_credentials' | 'email_taken'

/** Expected auth failures. The UI picks its message from `code`, never from `message`. */
export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}
