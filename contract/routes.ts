/**
 * CONTRACT ROUTES — mirrors section 7 of docs/04-data-contract.md.
 * Links in emails and QR codes depend on these, so treat them as stable.
 */
export const ROUTES = {
  home: '/',
  join: (code: string) => `/join/${code}`,
  login: '/login',
  register: '/register',
  onboarding: (studyId: string) => `/onboarding/${studyId}`,

  participant: '/participant',
  participantTask: (taskId: string) => `/participant/tasks/${taskId}`,
  participantRewards: '/participant/rewards',
  participantPending: '/participant/pending',

  researcher: '/researcher',
  researcherNewStudy: '/researcher/studies/new',
  researcherStudy: (studyId: string) => `/researcher/studies/${studyId}`,
  researcherStudyTasks: (studyId: string) => `/researcher/studies/${studyId}/tasks`,
  researcherStudyParticipants: (studyId: string) => `/researcher/studies/${studyId}/participants`,
  researcherStudyRewards: (studyId: string) => `/researcher/studies/${studyId}/rewards`,

  admin: '/admin',
  adminUsers: '/admin/users',

  settings: '/settings',
} as const;
