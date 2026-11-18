import type { UserRole } from '@contract/database.types'
import { ROUTES } from '@contract/routes'

/** Each role's own area (A3). */
export function homeForRole(role: UserRole): string {
  switch (role) {
    case 'participant':
      return ROUTES.participant
    case 'researcher':
      return ROUTES.researcher
    case 'admin':
      return ROUTES.admin
  }
}

/** Router state set when a signed-out user is sent to the login page. */
export interface LoginRedirectState {
  from?: string
}
