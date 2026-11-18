// Example service — every domain follows this shape, with the SAME signatures
// as services/supabase/index.ts.
import type { ProfileRow, StudyLandingInfo, StudyRow } from '@contract/database.types';
import { AuthError } from '@/lib/errors';
import { createAccount, findAccountByEmail, findProfileById } from '@/mocks/accounts';
import { getMockUserId, setMockUserId } from '@/mocks/session';
import { mockStudies, mockLandingByCode } from '@/mocks/studies';
import type { SignInInput, SignUpInput } from '@/services/types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/** The signed-in user's profile, or null when signed out (A3). */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  await delay(100);
  const id = getMockUserId();
  return id ? (findProfileById(id) ?? null) : null;
}

/** A1 — creates a participant account and signs it in. */
export async function signUp(input: SignUpInput): Promise<ProfileRow> {
  await delay();
  if (findAccountByEmail(input.email)) throw new AuthError('email_taken');
  const profile = createAccount(input);
  setMockUserId(profile.id);
  return profile;
}

/** A2 */
export async function signIn(input: SignInInput): Promise<ProfileRow> {
  await delay();
  const account = findAccountByEmail(input.email);
  if (!account || account.password !== input.password) throw new AuthError('invalid_credentials');
  setMockUserId(account.profile.id);
  return account.profile;
}

/** A2 */
export async function signOut(): Promise<void> {
  await delay(100);
  setMockUserId(null);
}

export async function getStudyBySourceCode(code: string): Promise<StudyLandingInfo | null> {
  await delay();
  return mockLandingByCode[code] ?? null;
}

export async function listMyStudies(): Promise<StudyRow[]> {
  await delay();
  return mockStudies;
}
