import type { StudyLandingInfo } from '@contract/database.types'

/** What the landing page shows for a study (C1, C2). */
export type LandingView = 'recruiting' | 'full' | 'closed' | 'not_found'

export function landingView(study: StudyLandingInfo | null): LandingView {
  if (!study) return 'not_found'
  switch (study.status) {
    case 'recruiting':
      return 'recruiting'
    case 'full':
      return 'full' // rule R-R2
    case 'active':
    case 'completed':
    case 'archived':
      return 'closed'
    case 'draft':
      return 'not_found' // not published
  }
}
