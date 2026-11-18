// Mock data MUST use exact contract field names and enum values.
import type { RecruitmentSourceRow } from '@contract/database.types';

/** One default source per mock study; codes match mockLandingByCode in mocks/studies.ts. */
export const mockRecruitmentSources: RecruitmentSourceRow[] = [
  {
    id: 'a1111111-0000-0000-0000-000000000001',
    study_id: '11111111-1111-1111-1111-111111111111',
    label: 'Library poster',
    code: 'LIBPOST1',
    is_default: true,
    created_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'a4444444-0000-0000-0000-000000000001',
    study_id: '44444444-4444-4444-4444-444444444444',
    label: 'Gym flyer',
    code: 'GYMFULL1',
    is_default: true,
    created_at: '2026-11-02T10:00:00Z',
  },
  {
    id: 'a5555555-0000-0000-0000-000000000001',
    study_id: '55555555-5555-5555-5555-555555555555',
    label: 'Default link',
    code: 'MORNING1',
    is_default: true,
    created_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'a6666666-0000-0000-0000-000000000001',
    study_id: '66666666-6666-6666-6666-666666666666',
    label: 'Default link',
    code: 'HYDRATE1',
    is_default: true,
    created_at: '2026-11-16T10:00:00Z',
  },
];
