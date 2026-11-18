/**
 * Onboarding questionnaire — /onboarding/:studyId (C3). Figma "Eligibility
 * questionnaire page" 69-1229; group-full message from 69-1556.
 * Everyone who submits goes to the pending screen (C4) — no automatic eligibility.
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { TaskQuestionRow, TaskRow } from '@contract/database.types'
import { ROUTES } from '@contract/routes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getPendingSourceCode } from '@/features/auth/pendingSourceCode'
import { buildAnswersSchema, emptyAnswers, toAnswers, type AnswerValues } from '@/features/enrolments/answersSchema'
import { QuestionField } from '@/features/enrolments/QuestionField'
import { useApplyToStudy, useOnboardingQuestions } from '@/features/enrolments/useEnrolments'
import { ApplyError } from '@/lib/errors'

function ApplyErrorAlert({ error }: { error: unknown }) {
  if (error instanceof ApplyError && error.code === 'study_not_recruiting') {
    return (
      <Alert variant="destructive" className="border-destructive">
        <AlertTitle>This group is currently full</AlertTitle>
        <AlertDescription className="text-destructive">
          This study group is full right now, so it isn't taking new participants.
        </AlertDescription>
      </Alert>
    )
  }
  if (error instanceof ApplyError && error.code === 'already_enrolled') {
    return (
      <Alert variant="destructive" className="border-destructive">
        <AlertTitle>You've already applied to this study</AlertTitle>
        <AlertDescription className="text-destructive">
          <Link to={ROUTES.participantPending}>Check the status of your application</Link>
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <Alert variant="destructive" className="border-destructive">
      <AlertDescription className="text-destructive">Something went wrong. Please try again.</AlertDescription>
    </Alert>
  )
}

function OnboardingForm({ studyId, task, questions }: { studyId: string; task: TaskRow; questions: TaskQuestionRow[] }) {
  const navigate = useNavigate()
  const apply = useApplyToStudy()
  // Read once: the code is cleared when the application succeeds.
  const [sourceCode] = useState(getPendingSourceCode)
  const [schema] = useState(() => buildAnswersSchema(questions))
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AnswerValues>({
    resolver: zodResolver(schema) as unknown as Resolver<AnswerValues>,
    defaultValues: emptyAnswers(questions),
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await apply.mutateAsync({ p_study_id: studyId, p_source_code: sourceCode, p_answers: toAnswers(questions, values) })
      void navigate(ROUTES.participantPending)
    } catch {
      // Shown by ApplyErrorAlert.
    }
  })

  return (
    <section aria-labelledby="onboarding-title" className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="font-bold text-muted-foreground">Eligibility</p>
        <h1 id="onboarding-title" className="text-hero font-bold">
          {task.title}
        </h1>
        {task.description && <p>{task.description}</p>}
      </header>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        {questions.map((q) => (
          <QuestionField key={q.id} question={q} control={control} error={errors[q.id]?.message} />
        ))}

        {apply.isError && <ApplyErrorAlert error={apply.error} />}

        <div className="flex flex-wrap items-center justify-between gap-2">
          {sourceCode ? (
            <Button asChild variant="outline">
              <Link to={ROUTES.join(sourceCode)}>Back to study page</Link>
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={apply.isPending}>
            {apply.isPending ? 'Sending…' : 'Continue'}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default function OnboardingPage() {
  const { studyId = '' } = useParams()
  const { data, isPending, isError, refetch } = useOnboardingQuestions(studyId)

  if (isPending) {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        Loading questions…
      </p>
    )
  }

  if (isError) {
    return (
      <section role="alert" className="flex flex-col items-start gap-4">
        <h1 className="text-hero font-bold">Something went wrong</h1>
        <p>We couldn't load the questions. Please try again.</p>
        <Button onClick={() => void refetch()}>Try again</Button>
      </section>
    )
  }

  if (!data) {
    return (
      <section aria-labelledby="no-onboarding-title" className="flex flex-col items-start gap-4">
        <h1 id="no-onboarding-title" className="text-hero font-bold">
          We couldn't find that study
        </h1>
        <p>Check the link or QR code you were given.</p>
        <Button asChild variant="outline">
          <Link to={ROUTES.home}>Back to home</Link>
        </Button>
      </section>
    )
  }

  return <OnboardingForm key={studyId} studyId={studyId} task={data.task} questions={data.questions} />
}
