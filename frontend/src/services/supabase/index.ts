// Real implementations. Fill these in only once the backend marks the feature ready.
import type { EnrolmentRow, ProfileRow, StudyLandingInfo, StudyRow } from '@contract/database.types';
import { RPC, TABLES } from '@contract/database.types';
import { NotImplemented } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { ApplyToStudyInput, OnboardingQuestionnaire, SignInInput, SignUpInput } from '@/services/types';

/** The signed-in user's profile, or null when signed out (A3). Waits on backend auth (A2). */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  throw new NotImplemented('getCurrentProfile');
}

/** A1. Waits on backend auth. */
export async function signUp(_input: SignUpInput): Promise<ProfileRow> {
  throw new NotImplemented('signUp');
}

/** A2. Waits on backend auth. */
export async function signIn(_input: SignInInput): Promise<ProfileRow> {
  throw new NotImplemented('signIn');
}

/** A2. Waits on backend auth. */
export async function signOut(): Promise<void> {
  throw new NotImplemented('signOut');
}

export async function getStudyBySourceCode(code: string): Promise<StudyLandingInfo | null> {
  const { data, error } = await supabase.rpc(RPC.get_study_by_source_code, { p_code: code });
  if (error) throw error;
  return (data as StudyLandingInfo | null) ?? null;
}

export async function listMyStudies(): Promise<StudyRow[]> {
  const { data, error } = await supabase.from(TABLES.studies).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as StudyRow[];
}

/** C3. Waits on backend (and an RLS policy letting participants read a recruiting study's onboarding task). */
export async function getOnboardingQuestions(_studyId: string): Promise<OnboardingQuestionnaire | null> {
  throw new NotImplemented('getOnboardingQuestions');
}

/** C3. Will call RPC.apply_to_study. */
export async function applyToStudy(_input: ApplyToStudyInput): Promise<EnrolmentRow> {
  throw new NotImplemented('applyToStudy');
}

/** C4 / R-R5. Waits on backend. */
export async function listMyEnrolments(): Promise<EnrolmentRow[]> {
  throw new NotImplemented('listMyEnrolments');
}
