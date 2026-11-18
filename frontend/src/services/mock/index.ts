// Example service — every domain follows this shape, with the SAME signatures
// as services/supabase/index.ts.
import type { StudyLandingInfo, StudyRow } from '@contract/database.types';
import { mockStudies, mockLandingByCode } from '@/mocks/studies';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getStudyBySourceCode(code: string): Promise<StudyLandingInfo | null> {
  await delay();
  return mockLandingByCode[code] ?? null;
}

export async function listMyStudies(): Promise<StudyRow[]> {
  await delay();
  return mockStudies;
}
