// Example service — every domain follows this shape, with the SAME signatures
// as services/supabase/index.ts.
import type { EnrolmentRow, ProfileRow, StudyLandingInfo, StudyRow } from '@contract/database.types';
import { ApplyError, AuthError } from '@/lib/errors';
import { createAccount, findAccountByEmail, findProfileById } from '@/mocks/accounts';
import { getMockUserId, setMockUserId } from '@/mocks/session';
import { createPendingEnrolment, enrolmentsFor } from '@/mocks/enrolments';
import { mockRecruitmentSources } from '@/mocks/recruitmentSources';
import { mockStudies, mockLandingByCode } from '@/mocks/studies';
import { mockTaskQuestions, mockTasks } from '@/mocks/tasks';
import type { ApplyToStudyInput, OnboardingQuestionnaire, SignInInput, SignUpInput } from '@/services/types';

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

/** C3 — the study's single onboarding task and its questions. */
export async function getOnboardingQuestions(studyId: string): Promise<OnboardingQuestionnaire | null> {
  await delay();
  const task = mockTasks.find((t) => t.study_id === studyId && t.task_type === 'onboarding' && t.is_active);
  if (!task) return null;
  const questions = mockTaskQuestions.filter((q) => q.task_id === task.id).sort((a, b) => a.position - b.position);
  return { task, questions };
}

/** C3 — mirrors apply_to_study: creates a `pending` enrolment + the onboarding response. */
export async function applyToStudy(input: ApplyToStudyInput): Promise<EnrolmentRow> {
  await delay();
  const participantId = getMockUserId();
  if (!participantId) throw new Error('Not signed in');

  const study = mockStudies.find((s) => s.id === input.p_study_id);
  if (study?.status !== 'recruiting') throw new ApplyError('study_not_recruiting'); // R-R3
  if (enrolmentsFor(participantId).some((e) => e.study_id === study.id)) throw new ApplyError('already_enrolled'); // R-R4

  const task = mockTasks.find((t) => t.study_id === study.id && t.task_type === 'onboarding');
  if (!task) throw new Error('Study has no onboarding task');

  const source = mockRecruitmentSources.find((s) => s.code === input.p_source_code && s.study_id === study.id);
  return createPendingEnrolment({
    study_id: study.id,
    participant_id: participantId,
    source_id: source?.id ?? null,
    onboarding_task_id: task.id,
    answers: input.p_answers,
  });
}

/** C4 / R-R5 — the signed-in participant's enrolments. */
export async function listMyEnrolments(): Promise<EnrolmentRow[]> {
  await delay(100);
  const participantId = getMockUserId();
  return participantId ? enrolmentsFor(participantId) : [];
}
