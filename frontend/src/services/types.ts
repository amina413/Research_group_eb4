import type { Json, TaskQuestionRow, TaskRow } from '@contract/database.types'

/** Inputs for service functions. Same shapes for mock/ and supabase/. */

/** A1 — field names match `profiles` where they map to it (full_name, email). */
export interface SignUpInput {
  full_name: string
  email: string
  password: string
}

/** A2 */
export interface SignInInput {
  email: string
  password: string
}

/** C3 — same argument names as the apply_to_study RPC. */
export interface ApplyToStudyInput {
  p_study_id: string
  /** recruitment_sources.code the participant came from; null if unknown. */
  p_source_code: string | null
  /** Shape B: answers keyed by task_questions.id. */
  p_answers: Json
}

/** C3 — a study's onboarding task and its questions, ordered by position. */
export interface OnboardingQuestionnaire {
  task: TaskRow
  questions: TaskQuestionRow[]
}
