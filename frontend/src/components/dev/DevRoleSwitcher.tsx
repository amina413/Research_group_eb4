/**
 * DEV ONLY — switch the mock signed-in user. Loaded only when
 * import.meta.env.DEV is true and mocks are on (see app/AppShell.tsx).
 */
import { useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { currentProfileQueryKey, useCurrentProfile } from '@/features/auth/useCurrentProfile'
import { MOCK_DEV_PASSWORD } from '@/mocks/accounts'
import { MOCK_SESSIONS, setMockSession, type MockSession } from '@/mocks/session'

const LABELS: Record<MockSession, string> = {
  signed_out: 'Signed out',
  participant: 'Participant',
  researcher: 'Researcher',
  admin: 'Admin',
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
      <p className="text-helper text-muted-foreground">
        Mock accounts: participant@, researcher@, admin@example.com · password <code>{MOCK_DEV_PASSWORD}</code>
      </p>
    </aside>
  )
}
