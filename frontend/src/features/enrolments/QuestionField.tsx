/**
 * Renders one task_question for every question_type in the contract, with a
 * label/legend, "(optional)" when not required, and an accessible error.
 */
import { Controller, type Control } from 'react-hook-form'
import type { TaskQuestionRow } from '@contract/database.types'
import { FieldError } from '@/components/shared/FieldError'
import { YesNoToggle } from '@/components/shared/YesNoToggle'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { AnswerValues } from './answersSchema'
import { choicesOf, numberOf, scaleOf } from './questionOptions'

interface QuestionFieldProps {
  question: TaskQuestionRow
  control: Control<AnswerValues>
  error?: string
}

/** One inline span, so spacing is the same inside a flex <Label> and a <legend>. */
function QuestionLabel({ question }: { question: TaskQuestionRow }) {
  return (
    <span>
      {question.prompt}
      {!question.is_required && (
        <>
          {' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </>
      )}
    </span>
  )
}

const asString = (v: AnswerValues[string] | undefined) => (typeof v === 'string' ? v : '')
const asArray = (v: AnswerValues[string] | undefined) => (Array.isArray(v) ? v : [])

export function QuestionField({ question, control, error }: QuestionFieldProps) {
  const id = `q-${question.id}`
  const errorId = `${id}-error`
  const legendId = `${id}-legend`
  const invalid = error ? true : undefined
  const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined
  const errorMessage = error && <FieldError id={errorId}>{error}</FieldError>

  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => {
        switch (question.question_type) {
          case 'short_text':
          case 'long_text': {
            const Control = question.question_type === 'long_text' ? Textarea : Input
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={id}>
                  <QuestionLabel question={question} />
                </Label>
                <Control
                  id={id}
                  ref={field.ref}
                  name={field.name}
                  value={asString(field.value)}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={invalid}
                  aria-describedby={describedBy(error && errorId)}
                />
                {errorMessage}
              </div>
            )
          }

          case 'number': {
            const { min, max, unit } = numberOf(question)
            const unitId = `${id}-unit`
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={id}>
                  <QuestionLabel question={question} />
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id={id}
                    ref={field.ref}
                    name={field.name}
                    type="number"
                    inputMode="decimal"
                    min={min}
                    max={max}
                    step="any"
                    value={asString(field.value)}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="max-w-40"
                    aria-invalid={invalid}
                    aria-describedby={describedBy(unit && unitId, error && errorId)}
                  />
                  {unit && <span id={unitId}>{unit}</span>}
                </div>
                {errorMessage}
              </div>
            )
          }

          case 'single_choice':
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={id}>
                  <QuestionLabel question={question} />
                </Label>
                <Select value={asString(field.value)} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id={id}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    className="w-full"
                    aria-invalid={invalid}
                    aria-describedby={describedBy(error && errorId)}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {choicesOf(question).map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorMessage}
              </div>
            )

          case 'multi_choice': {
            const selected = asArray(field.value)
            return (
              <fieldset className="flex flex-col gap-3" aria-describedby={describedBy(error && errorId)} aria-invalid={invalid}>
                <legend className="mb-1 font-bold">
                  <QuestionLabel question={question} />
                </legend>
                {choicesOf(question).map((c, i) => {
                  const optionId = `${id}-${c.value}`
                  return (
                    <div key={c.value} className="flex items-center gap-3">
                      <Checkbox
                        id={optionId}
                        ref={i === 0 ? field.ref : undefined}
                        checked={selected.includes(c.value)}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true ? [...selected, c.value] : selected.filter((v) => v !== c.value))
                        }
                        onBlur={field.onBlur}
                      />
                      <Label htmlFor={optionId} className="font-normal">
                        {c.label}
                      </Label>
                    </div>
                  )
                })}
                {errorMessage}
              </fieldset>
            )
          }

          case 'scale': {
            const { min, max, min_label, max_label } = scaleOf(question)
            const values = Array.from({ length: max - min + 1 }, (_, i) => String(min + i))
            const hintId = `${id}-hint`
            const hint = min_label && max_label ? `${min} = ${min_label}, ${max} = ${max_label}` : undefined
            return (
              <fieldset className="flex flex-col gap-3">
                <legend id={legendId} className="mb-1 font-bold">
                  <QuestionLabel question={question} />
                </legend>
                {hint && (
                  <p id={hintId} className="text-helper text-muted-foreground">
                    {hint}
                  </p>
                )}
                <RadioGroup
                  ref={field.ref}
                  value={asString(field.value)}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-labelledby={legendId}
                  aria-describedby={describedBy(hint && hintId, error && errorId)}
                  aria-invalid={invalid}
                  className="flex flex-wrap gap-4"
                >
                  {values.map((v) => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem id={`${id}-${v}`} value={v} />
                      <Label htmlFor={`${id}-${v}`} className="font-normal">
                        {v}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errorMessage}
              </fieldset>
            )
          }

          case 'yes_no':
            return (
              <fieldset className="flex flex-col gap-3" aria-describedby={describedBy(error && errorId)} aria-invalid={invalid}>
                <legend className="mb-1 font-bold">
                  <QuestionLabel question={question} />
                </legend>
                {/* Named by the fieldset legend; not labelled again so it isn't announced twice. */}
                <YesNoToggle
                  value={asString(field.value) === 'yes' ? 'yes' : asString(field.value) === 'no' ? 'no' : ''}
                  onChange={field.onChange}
                />
                {errorMessage}
              </fieldset>
            )
        }
      }}
    />
  )
}
