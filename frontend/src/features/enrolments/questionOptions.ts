/**
 * Read task_questions.options (shape A, contract §3) safely. `options` is untyped
 * JSON, so anything malformed falls back to an empty/neutral value.
 */
import type { Json, TaskQuestionRow } from '@contract/database.types'

export interface Choice {
  value: string
  label: string
}

export interface ScaleOptions {
  min: number
  max: number
  min_label?: string
  max_label?: string
}

export interface NumberOptions {
  min?: number
  max?: number
  unit?: string
}

const isRecord = (v: Json | null): v is { [key: string]: Json | undefined } =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const num = (v: Json | undefined): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined)
const str = (v: Json | undefined): string | undefined => (typeof v === 'string' && v !== '' ? v : undefined)

/** single_choice / multi_choice */
export function choicesOf(question: TaskQuestionRow): Choice[] {
  const o = question.options
  if (!isRecord(o) || !Array.isArray(o.choices)) return []
  return o.choices.flatMap((c) => {
    if (!isRecord(c)) return []
    const value = str(c.value)
    const label = str(c.label)
    return value && label ? [{ value, label }] : []
  })
}

/** scale — defaults to 1–5 */
export function scaleOf(question: TaskQuestionRow): ScaleOptions {
  const o = isRecord(question.options) ? question.options : {}
  const min = num(o.min) ?? 1
  const max = num(o.max) ?? 5
  return { min, max: Math.max(min, max), min_label: str(o.min_label), max_label: str(o.max_label) }
}

/** number */
export function numberOf(question: TaskQuestionRow): NumberOptions {
  const o = isRecord(question.options) ? question.options : {}
  return { min: num(o.min), max: num(o.max), unit: str(o.unit) }
}
