/**
 * Builds the form schema from a study's task_questions and converts form values
 * to task_responses.answers (shape B, contract §3: keyed by task_questions.id).
 *
 * Form values: every question is a string, except multi_choice (string[]).
 * yes_no uses 'yes' | 'no'; scale and number are converted on submit.
 */
import { z } from 'zod'
import type { Json, TaskQuestionRow } from '@contract/database.types'
import { choicesOf, numberOf, scaleOf } from './questionOptions'

export type AnswerValue = string | string[]
export type AnswerValues = Record<string, AnswerValue>

function numberRangeMessage(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) return `Enter a number between ${min} and ${max}`
  if (min !== undefined) return `Enter a number of at least ${min}`
  if (max !== undefined) return `Enter a number no more than ${max}`
  return 'Enter a number'
}

function schemaFor(q: TaskQuestionRow): z.ZodType<AnswerValue> {
  const required = q.is_required
  switch (q.question_type) {
    case 'short_text':
    case 'long_text': {
      const s = z.string().max(5000, 'Keep your answer under 5000 characters')
      return required ? s.refine((v) => v.trim() !== '', 'Answer this question') : s
    }
    case 'single_choice': {
      const allowed = new Set(choicesOf(q).map((c) => c.value))
      return z
        .string()
        .refine((v) => (v === '' ? !required : allowed.has(v)), 'Choose an answer')
    }
    case 'multi_choice': {
      const allowed = new Set(choicesOf(q).map((c) => c.value))
      return z
        .array(z.string())
        .refine((v) => v.every((x) => allowed.has(x)), 'Choose from the listed answers')
        .refine((v) => !required || v.length > 0, 'Choose at least one answer')
    }
    case 'scale': {
      const { min, max } = scaleOf(q)
      return z.string().refine((v) => {
        if (v === '') return !required
        const n = Number(v)
        return Number.isInteger(n) && n >= min && n <= max
      }, 'Choose a value')
    }
    case 'number': {
      const { min, max } = numberOf(q)
      return z
        .string()
        .refine((v) => v.trim() !== '' || !required, 'Enter a number')
        .refine((v) => {
          if (v.trim() === '') return true
          const n = Number(v)
          return Number.isFinite(n) && (min === undefined || n >= min) && (max === undefined || n <= max)
        }, numberRangeMessage(min, max))
    }
    case 'yes_no':
      return z.string().refine((v) => (v === '' ? !required : v === 'yes' || v === 'no'), 'Choose yes or no')
  }
}

export function buildAnswersSchema(questions: TaskQuestionRow[]) {
  return z.object(Object.fromEntries(questions.map((q) => [q.id, schemaFor(q)])))
}

export function emptyAnswers(questions: TaskQuestionRow[]): AnswerValues {
  return Object.fromEntries(questions.map((q) => [q.id, q.question_type === 'multi_choice' ? [] : '']))
}

/** Shape B. Unanswered optional questions are left out. */
export function toAnswers(questions: TaskQuestionRow[], values: AnswerValues): Json {
  const answers: { [id: string]: Json } = {}
  for (const q of questions) {
    const v = values[q.id]
    if (v === undefined) continue
    if (Array.isArray(v)) {
      if (v.length > 0) answers[q.id] = v
      continue
    }
    const t = v.trim()
    if (t === '') continue
    switch (q.question_type) {
      case 'scale':
      case 'number':
        answers[q.id] = Number(t)
        break
      case 'yes_no':
        answers[q.id] = t === 'yes'
        break
      default:
        answers[q.id] = t
    }
  }
  return answers
}
