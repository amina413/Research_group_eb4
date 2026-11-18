// Mock data MUST use exact contract field names and enum values.
import type { ProfileRow, UserRole } from '@contract/database.types';

/** One mock signed-in user per role. */
export const mockProfiles: Record<UserRole, ProfileRow> = {
  participant: {
    id: '22222222-2222-2222-2222-222222222222',
    role: 'participant',
    full_name: 'Pat Participant',
    email: 'participant@example.com',
    date_of_birth: '2001-04-12',
    created_at: '2026-11-01T09:00:00Z',
    updated_at: '2026-11-01T09:00:00Z',
  },
  researcher: {
    // Same id as researcher_id in mocks/studies.ts, so "my studies" lines up.
    id: '99999999-9999-9999-9999-999999999999',
    role: 'researcher',
    full_name: 'Rae Researcher',
    email: 'researcher@example.com',
    date_of_birth: null,
    created_at: '2026-10-20T09:00:00Z',
    updated_at: '2026-10-20T09:00:00Z',
  },
  admin: {
    id: '33333333-3333-3333-3333-333333333333',
    role: 'admin',
    full_name: 'Ada Admin',
    email: 'admin@example.com',
    date_of_birth: null,
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-10-01T09:00:00Z',
  },
};
