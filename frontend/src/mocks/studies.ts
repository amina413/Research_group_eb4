// Mock data MUST use exact contract field names and enum values.
import type { StudyLandingInfo, StudyRow } from '@contract/database.types';

export const mockStudies: StudyRow[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    researcher_id: '99999999-9999-9999-9999-999999999999',
    title: 'Daily Mood & Sleep Study',
    description: 'A 12-week study on how sleep affects day-to-day emotions.',
    eligibility_criteria: 'Aged 18+, owns a smartphone.',
    target_participants: 50,
    approved_count: 18,
    status: 'recruiting',
    start_date: '2026-12-01',
    end_date: '2027-02-28',
    created_at: '2026-11-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
];

export const mockLandingByCode: Record<string, StudyLandingInfo> = {
  LIBPOST1: {
    study_id: '11111111-1111-1111-1111-111111111111',
    title: 'Daily Mood & Sleep Study',
    description: 'A 12-week study on how sleep affects day-to-day emotions.',
    eligibility_criteria: 'Aged 18+, owns a smartphone.',
    status: 'recruiting',
    spots_left: 32,
  },
};
