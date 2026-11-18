import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { EnrolmentRow } from '@contract/database.types'
import { clearPendingSourceCode } from '@/features/auth/pendingSourceCode'
import { useCurrentProfile } from '@/features/auth/useCurrentProfile'
import { services } from '@/services'
import type { ApplyToStudyInput } from '@/services/types'

export const enrolmentsQueryKey = ['enrolments'] as const
const myEnrolmentsKey = (profileId: string | undefined) => [...enrolmentsQueryKey, 'mine', profileId] as const

/** The signed-in participant's enrolments (R-R5). Keyed by user, so switching users never shows stale rows. */
export function useMyEnrolments() {
  const { data: profile } = useCurrentProfile()
  return useQuery({
    queryKey: myEnrolmentsKey(profile?.id),
    queryFn: () => services.listMyEnrolments(),
    enabled: profile?.role === 'participant',
  })
}

/** C3 — the study's onboarding task + questions. */
export function useOnboardingQuestions(studyId: string) {
  return useQuery({
    queryKey: [...enrolmentsQueryKey, 'onboarding', studyId],
    queryFn: () => services.getOnboardingQuestions(studyId),
  })
}

/** C3 — apply_to_study. On success the new pending enrolment is in the cache before the caller navigates. */
export function useApplyToStudy() {
  const queryClient = useQueryClient()
  const { data: profile } = useCurrentProfile()
  return useMutation({
    mutationFn: (input: ApplyToStudyInput) => services.applyToStudy(input),
    onSuccess: (enrolment) => {
      clearPendingSourceCode()
      queryClient.setQueryData<EnrolmentRow[]>(myEnrolmentsKey(profile?.id), (old = []) => [...old, enrolment])
      void queryClient.invalidateQueries({ queryKey: enrolmentsQueryKey })
    },
  })
}

/** R-R5: no approved enrolment yet, but at least one waiting for review. */
export function isAwaitingApproval(enrolments: EnrolmentRow[]): boolean {
  return !enrolments.some((e) => e.status === 'approved') && enrolments.some((e) => e.status === 'pending')
}
