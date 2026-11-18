// Mock data MUST use exact contract field names and enum values.
// task_questions.options follow shape A in docs/04-data-contract.md §3.
import type { TaskQuestionRow, TaskRow } from '@contract/database.types';

const MOOD_STUDY = '11111111-1111-1111-1111-111111111111';
const STEPS_STUDY = '44444444-4444-4444-4444-444444444444';

const MOOD_ONBOARDING = 'b1111111-0000-0000-0000-000000000001';
const STEPS_ONBOARDING = 'b4444444-0000-0000-0000-000000000001';

/** Exactly one `onboarding` task per study (contract §2.4). */
export const mockTasks: TaskRow[] = [
  {
    id: MOOD_ONBOARDING,
    study_id: MOOD_STUDY,
    title: 'Tell us about you',
    description: 'A few questions so the researcher can check you can take part.',
    task_type: 'onboarding',
    frequency: 'once',
    points: 0,
    counts_towards_streak: false,
    is_active: true,
    opens_at: null,
    closes_at: null,
    created_at: '2026-11-15T10:00:00Z',
  },
  {
    id: STEPS_ONBOARDING,
    study_id: STEPS_STUDY,
    title: 'Tell us about you',
    description: null,
    task_type: 'onboarding',
    frequency: 'once',
    points: 0,
    counts_towards_streak: false,
    is_active: true,
    opens_at: null,
    closes_at: null,
    created_at: '2026-11-02T10:00:00Z',
  },
];

const AGE_BANDS = {
  choices: [
    { value: '18_24', label: '18–24' },
    { value: '25_34', label: '25–34' },
    { value: '35_44', label: '35–44' },
    { value: '45_54', label: '45–54' },
    { value: '55_plus', label: '55 or over' },
  ],
};

const GENDERS = {
  choices: [
    { value: 'woman', label: 'Woman' },
    { value: 'man', label: 'Man' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'self_describe', label: 'Prefer to self-describe' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ],
};

const LOCATIONS = {
  choices: [
    { value: 'north_east', label: 'North East England' },
    { value: 'north_west', label: 'North West England' },
    { value: 'yorkshire', label: 'Yorkshire and the Humber' },
    { value: 'midlands', label: 'Midlands' },
    { value: 'london_south', label: 'London and the South' },
    { value: 'scotland', label: 'Scotland' },
    { value: 'wales', label: 'Wales' },
    { value: 'northern_ireland', label: 'Northern Ireland' },
    { value: 'outside_uk', label: 'Outside the UK' },
  ],
};

/** The Daily Mood & Sleep onboarding uses every question_type, so the form can be checked end to end. */
export const mockTaskQuestions: TaskQuestionRow[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', task_id: MOOD_ONBOARDING, position: 1, prompt: 'Age band', question_type: 'single_choice', options: AGE_BANDS, is_required: true },
  { id: 'c1000000-0000-0000-0000-000000000002', task_id: MOOD_ONBOARDING, position: 2, prompt: 'Gender', question_type: 'single_choice', options: GENDERS, is_required: true },
  { id: 'c1000000-0000-0000-0000-000000000003', task_id: MOOD_ONBOARDING, position: 3, prompt: 'Location', question_type: 'single_choice', options: LOCATIONS, is_required: true },
  { id: 'c1000000-0000-0000-0000-000000000004', task_id: MOOD_ONBOARDING, position: 4, prompt: 'Do you own a smartphone?', question_type: 'yes_no', options: null, is_required: true },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    task_id: MOOD_ONBOARDING,
    position: 5,
    prompt: 'Which wearables do you use?',
    question_type: 'multi_choice',
    options: {
      choices: [
        { value: 'smart_watch', label: 'Smart watch' },
        { value: 'fitness_band', label: 'Fitness band' },
        { value: 'smart_ring', label: 'Smart ring' },
      ],
    },
    is_required: false,
  },
  { id: 'c1000000-0000-0000-0000-000000000006', task_id: MOOD_ONBOARDING, position: 6, prompt: 'Average hours of sleep a night', question_type: 'number', options: { min: 0, max: 24, unit: 'hours' }, is_required: true },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    task_id: MOOD_ONBOARDING,
    position: 7,
    prompt: 'How stressed do you feel day to day?',
    question_type: 'scale',
    options: { min: 1, max: 5, min_label: 'Not at all', max_label: 'Extremely' },
    is_required: true,
  },
  { id: 'c1000000-0000-0000-0000-000000000008', task_id: MOOD_ONBOARDING, position: 8, prompt: 'Occupation', question_type: 'short_text', options: null, is_required: false },
  { id: 'c1000000-0000-0000-0000-000000000009', task_id: MOOD_ONBOARDING, position: 9, prompt: 'Anything else we should know?', question_type: 'long_text', options: null, is_required: false },

  { id: 'c4000000-0000-0000-0000-000000000001', task_id: STEPS_ONBOARDING, position: 1, prompt: 'Age band', question_type: 'single_choice', options: AGE_BANDS, is_required: true },
];
