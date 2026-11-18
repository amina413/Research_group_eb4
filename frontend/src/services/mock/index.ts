// Example service — every domain follows this shape, with the SAME signatures
// as services/supabase/index.ts.
import type { ProfileRow, StudyLandingInfo, StudyRow } from '@contract/database.types';
import { mockProfiles } from '@/mocks/profiles';
import { getMockSession } from '@/mocks/session';
import { mockStudies, mockLandingByCode } from '@/mocks/studies';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/** The signed-in user's profile, or null when signed out (A3). */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  await delay(100);
  const session = getMockSession();
  return session === 'signed_out' ? null : mockProfiles[session];
}

export async function getStudyBySourceCode(code: string): Promise<StudyLandingInfo | null> {
  await delay();
  return mockLandingByCode[code] ?? null;
}

export async function listMyStudies(): Promise<StudyRow[]> {
  await delay();
  return mockStudies;
}
