/**
 * Mock enrolments + onboarding responses (VITE_USE_MOCKS=true only), kept in
 * localStorage so they survive a reload. Mock data MUST use exact contract
 * field names and enum values.
 */
import type { EnrolmentRow, EnrolmentStatus, Json, TaskResponseRow } from '@contract/database.types';

const ENROLMENTS_KEY = 'kv6014.mockEnrolments';
const RESPONSES_KEY = 'kv6014.mockTaskResponses';

function load<T>(key: string): T[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, rows: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    // Storage blocked — the change just won't survive a reload.
  }
}

export function listEnrolments(): EnrolmentRow[] {
  return load<EnrolmentRow>(ENROLMENTS_KEY);
}

export function listTaskResponses(): TaskResponseRow[] {
  return load<TaskResponseRow>(RESPONSES_KEY);
}

export function enrolmentsFor(participantId: string): EnrolmentRow[] {
  return listEnrolments().filter((e) => e.participant_id === participantId);
}

/** Creates a `pending` enrolment and its onboarding response in one go (apply_to_study). */
export function createPendingEnrolment(input: {
  study_id: string;
  participant_id: string;
  source_id: string | null;
  onboarding_task_id: string;
  answers: Json;
}): EnrolmentRow {
  const now = new Date();
  const enrolment: EnrolmentRow = {
    id: crypto.randomUUID(),
    study_id: input.study_id,
    participant_id: input.participant_id,
    source_id: input.source_id,
    status: 'pending',
    total_points: 0,
    applied_at: now.toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    rejection_reason: null,
  };
  const response: TaskResponseRow = {
    id: crypto.randomUUID(),
    task_id: input.onboarding_task_id,
    enrolment_id: enrolment.id,
    due_date: now.toISOString().slice(0, 10),
    answers: input.answers,
    submitted_at: now.toISOString(),
  };
  save(ENROLMENTS_KEY, [...listEnrolments(), enrolment]);
  save(RESPONSES_KEY, [...listTaskResponses(), response]);
  return enrolment;
}

/**
 * DEV ONLY (role switcher): set a participant's enrolment in one study to a
 * status, or remove it with `null`.
 */
export function setMockEnrolmentStatus(participantId: string, studyId: string, status: EnrolmentStatus | null): void {
  const others = listEnrolments().filter((e) => !(e.participant_id === participantId && e.study_id === studyId));
  if (status === null) {
    save(ENROLMENTS_KEY, others);
    return;
  }
  const now = new Date().toISOString();
  const reviewed = status !== 'pending';
  save(ENROLMENTS_KEY, [
    ...others,
    {
      id: crypto.randomUUID(),
      study_id: studyId,
      participant_id: participantId,
      source_id: null,
      status,
      total_points: 0,
      applied_at: now,
      reviewed_at: reviewed ? now : null,
      reviewed_by: reviewed ? '99999999-9999-9999-9999-999999999999' : null,
      rejection_reason: status === 'rejected' ? 'Mock rejection (dev switcher)' : null,
    },
  ]);
}
