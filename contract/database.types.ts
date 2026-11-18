/**
 * CONTRACT TYPES — mirrors docs/04-data-contract.md exactly.
 *
 * Phase 1 (now): hand-written by frontend so we can build with mocks.
 * Phase 2: backend REPLACES this file with the generated one:
 *   cd backend && supabase gen types typescript --local > ../contract/database.types.ts
 * The helper types at the bottom keep the same names Supabase generates,
 * so frontend imports do not change when the file is swapped.
 *
 * Do not edit without a contract PR (see docs/05-workflow.md).
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ---------- Enums ----------
export type UserRole = 'participant' | 'researcher' | 'admin';
export type StudyStatus = 'draft' | 'recruiting' | 'full' | 'active' | 'completed' | 'archived';
export type EnrolmentStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'completed';
export type TaskType = 'onboarding' | 'questionnaire' | 'survey' | 'daily_task';
export type TaskFrequency = 'once' | 'daily' | 'weekly';
export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multi_choice'
  | 'scale'
  | 'number'
  | 'yes_no';
export type RewardType = 'voucher' | 'badge' | 'device';
export type RewardClaimStatus = 'locked' | 'unlocked' | 'issued';
export type NotificationType =
  | 'enrolment_approved'
  | 'enrolment_rejected'
  | 'task_due'
  | 'falling_behind'
  | 'reward_unlocked'
  | 'study_full'
  | 'general';

// ---------- Rows ----------
export interface ProfileRow {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyRow {
  id: string;
  researcher_id: string;
  title: string;
  description: string | null;
  eligibility_criteria: string | null;
  target_participants: number;
  approved_count: number;
  status: StudyStatus;
  start_date: string | null;
  end_date: string | null;
  /** 0–100 in steps of 10. No reward below this completion % (R-M6). */
  payment_threshold_percent: number;
  created_at: string;
  updated_at: string;
}

export interface RecruitmentSourceRow {
  id: string;
  study_id: string;
  label: string;
  code: string;
  is_default: boolean;
  created_at: string;
}

export interface TaskRow {
  id: string;
  study_id: string;
  title: string;
  description: string | null;
  task_type: TaskType;
  frequency: TaskFrequency;
  counts_towards_progress: boolean;
  is_active: boolean;
  opens_at: string | null;
  closes_at: string | null;
  created_at: string;
}

export interface TaskQuestionRow {
  id: string;
  task_id: string;
  position: number;
  prompt: string;
  question_type: QuestionType;
  options: Json | null;
  is_required: boolean;
}

export interface EnrolmentRow {
  id: string;
  study_id: string;
  participant_id: string;
  source_id: string | null;
  status: EnrolmentStatus;
  applied_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
}

export interface TaskResponseRow {
  id: string;
  task_id: string;
  enrolment_id: string;
  due_date: string;
  answers: Json;
  submitted_at: string;
}

export interface RewardRow {
  id: string;
  study_id: string;
  title: string;
  description: string | null;
  reward_type: RewardType;
  /** Milestone that unlocks it: 10–100 in steps of 10 (R-M4). */
  completion_percent: number;
  /** Payment for this step in pence, not a running total. */
  amount_pence: number | null;
  created_at: string;
}

export interface RewardClaimRow {
  id: string;
  reward_id: string;
  enrolment_id: string;
  status: RewardClaimStatus;
  unlocked_at: string | null;
  issued_at: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

// ---------- RPC return shapes ----------
export interface StudyLandingInfo {
  study_id: string;
  title: string;
  description: string | null;
  eligibility_criteria: string | null;
  status: StudyStatus;
  spots_left: number;
}

/** A milestone reward as returned by get_participation_summary. */
export interface MilestoneReward {
  reward_id: string;
  completion_percent: number;
  title: string;
  reward_type: RewardType;
  amount_pence: number | null;
}

export interface ParticipationSummary {
  enrolment_id: string;
  /** Whole number 0–100, rounded down (R-M1). */
  completion_percent: number;
  completed_count: number;
  total_count: number;
  payment_threshold_percent: number;
  /** Sum of amount_pence over unlocked_milestones. Never add amounts in the UI (R-P5). */
  earned_pence: number;
  unlocked_milestones: (MilestoneReward & { status: Exclude<RewardClaimStatus, 'locked'> })[];
  next_milestone: MilestoneReward | null;
  is_behind_schedule: boolean;
}

export interface StudyStats {
  applied: number;
  pending: number;
  approved: number;
  rejected: number;
  by_source: { label: string; code: string; count: number }[];
}

// ---------- Name maps (use these instead of string literals) ----------
export const TABLES = {
  profiles: 'profiles',
  studies: 'studies',
  recruitment_sources: 'recruitment_sources',
  tasks: 'tasks',
  task_questions: 'task_questions',
  enrolments: 'enrolments',
  task_responses: 'task_responses',
  rewards: 'rewards',
  reward_claims: 'reward_claims',
  notifications: 'notifications',
} as const;

export const RPC = {
  get_study_by_source_code: 'get_study_by_source_code',
  apply_to_study: 'apply_to_study',
  approve_enrolment: 'approve_enrolment',
  reject_enrolment: 'reject_enrolment',
  get_participation_summary: 'get_participation_summary',
  get_study_stats: 'get_study_stats',
} as const;

export const EDGE_FUNCTIONS = {
  delete_account: 'delete-account',
} as const;

export const BUCKETS = {
  study_assets: 'study-assets',
} as const;

// ---------- Supabase-style helpers (same names the CLI generates) ----------
type TableMap = {
  profiles: ProfileRow;
  studies: StudyRow;
  recruitment_sources: RecruitmentSourceRow;
  tasks: TaskRow;
  task_questions: TaskQuestionRow;
  enrolments: EnrolmentRow;
  task_responses: TaskResponseRow;
  rewards: RewardRow;
  reward_claims: RewardClaimRow;
  notifications: NotificationRow;
};
export type Tables<T extends keyof TableMap> = TableMap[T];
