/**
 * DEV ONLY — switch the mock signed-in user. Loaded only when
 * import.meta.env.DEV is true and mocks are on (see app/AppShell.tsx).
 */
import { useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { EnrolmentStatus } from '@contract/database.types'
import { currentProfileQueryKey, useCurrentProfile } from '@/features/auth/useCurrentProfile'
import { enrolmentsQueryKey, useMyEnrolments } from '@/features/enrolments/useEnrolments'
import { MOCK_DEV_PASSWORD } from '@/mocks/accounts'
import { setMockEnrolmentStatus } from '@/mocks/enrolments'
import { MOCK_SESSIONS, setMockSession, type MockSession } from '@/mocks/session'
import { mockStudies } from '@/mocks/studies'

const LABELS: Record<MockSession, string> = {
  signed_out: 'Signed out',
  participant: 'Participant',
  researcher: 'Researcher',
  admin: 'Admin',
}

const DEV_STUDY = mockStudies[0] // Daily Mood & Sleep (recruiting)

type EnrolmentChoice = EnrolmentStatus | 'none'
const ENROLMENT_CHOICES: { value: EnrolmentChoice; label: string }[] = [
  { value: 'none', label: 'Not enrolled' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

/** Fake the participant's enrolment in the dev study (R-R5 / C4). */
function EnrolmentSwitcher({ participantId }: { participantId: string }) {
  const id = useId()
  const queryClient = useQueryClient()
  const { data: enrolments = [] } = useMyEnrolments()
  const current: EnrolmentChoice = enrolments.find((e) => e.study_id === DEV_STUDY.id)?.status ?? 'none'

  function change(value: string) {
    const next = ENROLMENT_CHOICES.find((c) => c.value === value)?.value
    if (!next) return
    setMockEnrolmentStatus(participantId, DEV_STUDY.id, next === 'none' ? null : next)
    void queryClient.invalidateQueries({ queryKey: enrolmentsQueryKey })
  }

  return (
    <>
      <Label htmlFor={id} className="text-helper">
        Enrolment · {DEV_STUDY.title}
      </Label>
      <Select value={current} onValueChange={change}>
        <SelectTrigger id={id} size="sm" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ENROLMENT_CHOICES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

export default function DevRoleSwitcher() {
  const id = useId()
  const queryClient = useQueryClient()
  const { data: profile } = useCurrentProfile()
  // Follows the real signed-in user, so it stays right after logging in or out.
  const session: MockSession = profile ? profile.role : 'signed_out'

  function change(value: string) {
    const next = MOCK_SESSIONS.find((s) => s === value)
    if (!next) return
    setMockSession(next)
    void queryClient.invalidateQueries({ queryKey: currentProfileQueryKey })
  }

  return (
    <aside
      aria-label="Developer tools"
      className="fixed right-inset bottom-inset z-50 flex max-w-xs flex-col gap-2 rounded-sm border bg-background p-3 shadow-md"
    >
      <Label htmlFor={id} className="text-helper">
        Dev · signed in as
      </Label>
      <Select value={session} onValueChange={change}>
        <SelectTrigger id={id} size="sm" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MOCK_SESSIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {profile?.role === 'participant' && <EnrolmentSwitcher participantId={profile.id} />}
      <p className="text-helper text-muted-foreground">
        Mock accounts: participant@, researcher@, admin@example.com · password <code>{MOCK_DEV_PASSWORD}</code>
      </p>
    </aside>
  )
}
