/**
 * DEV ONLY — switch the mock signed-in user. Loaded only when
 * import.meta.env.DEV is true and mocks are on (see app/AppShell.tsx).
 */
import { useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { currentProfileQueryKey } from '@/features/auth/useCurrentProfile'
import { getMockSession, MOCK_SESSIONS, setMockSession, type MockSession } from '@/mocks/session'

const LABELS: Record<MockSession, string> = {
  signed_out: 'Signed out',
  participant: 'Participant',
  researcher: 'Researcher',
  admin: 'Admin',
}

export default function DevRoleSwitcher() {
  const id = useId()
  const queryClient = useQueryClient()
  const [session, setSession] = useState<MockSession>(getMockSession)

  function change(value: string) {
    const next = MOCK_SESSIONS.find((s) => s === value)
    if (!next) return
    setMockSession(next)
    setSession(next)
    void queryClient.invalidateQueries({ queryKey: currentProfileQueryKey })
  }

  return (
    <aside
      aria-label="Developer tools"
      className="fixed right-inset bottom-inset z-50 flex flex-col gap-2 rounded-sm border bg-background p-3 shadow-md"
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
    </aside>
  )
}
