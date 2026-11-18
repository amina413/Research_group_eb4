import { AuthError } from '@/lib/errors'

/** Form-level message for a failed sign-up / log-in. */
export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'invalid_credentials':
        return 'The email or password is incorrect.'
      case 'email_taken':
        return 'An account with this email already exists. Log in instead.'
    }
  }
  return 'Something went wrong. Please try again.'
}
