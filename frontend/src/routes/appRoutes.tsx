/**
 * App route tree (A3). Every path comes from ROUTES (data contract §7);
 * paths with params reuse the ROUTES function, e.g. ROUTES.join(':code') = '/join/:code'.
 */
import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { AppShell } from '@/app/AppShell'
import { RedirectIfSignedIn, RequireRole } from '@/features/auth/guards'
import SettingsPage from '@/pages/account/SettingsPage'
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import NotFoundPage from '@/pages/NotFoundPage'
import OnboardingPage from '@/pages/participant/OnboardingPage'
import ParticipantDashboardPage from '@/pages/participant/ParticipantDashboardPage'
import ParticipantPendingPage from '@/pages/participant/ParticipantPendingPage'
import ParticipantRewardsPage from '@/pages/participant/ParticipantRewardsPage'
import ParticipantTaskPage from '@/pages/participant/ParticipantTaskPage'
import HomePage from '@/pages/public/HomePage'
import JoinPage from '@/pages/public/JoinPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import NewStudyPage from '@/pages/researcher/NewStudyPage'
import ResearcherStudiesPage from '@/pages/researcher/ResearcherStudiesPage'
import StudyOverviewPage from '@/pages/researcher/StudyOverviewPage'
import StudyParticipantsPage from '@/pages/researcher/StudyParticipantsPage'
import StudyRewardsPage from '@/pages/researcher/StudyRewardsPage'
import StudyTasksPage from '@/pages/researcher/StudyTasksPage'

export const appRoutes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      // Public
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.join(':code'), element: <JoinPage /> },
      {
        element: <RedirectIfSignedIn />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
        ],
      },

      // Participant
      {
        element: <RequireRole roles={['participant']} />,
        children: [
          { path: ROUTES.onboarding(':studyId'), element: <OnboardingPage /> },
          { path: ROUTES.participant, element: <ParticipantDashboardPage /> },
          { path: ROUTES.participantTask(':taskId'), element: <ParticipantTaskPage /> },
          { path: ROUTES.participantRewards, element: <ParticipantRewardsPage /> },
          { path: ROUTES.participantPending, element: <ParticipantPendingPage /> },
        ],
      },

      // Researcher
      {
        element: <RequireRole roles={['researcher']} />,
        children: [
          { path: ROUTES.researcher, element: <ResearcherStudiesPage /> },
          { path: ROUTES.researcherNewStudy, element: <NewStudyPage /> },
          { path: ROUTES.researcherStudy(':studyId'), element: <StudyOverviewPage /> },
          { path: ROUTES.researcherStudyTasks(':studyId'), element: <StudyTasksPage /> },
          { path: ROUTES.researcherStudyParticipants(':studyId'), element: <StudyParticipantsPage /> },
          { path: ROUTES.researcherStudyRewards(':studyId'), element: <StudyRewardsPage /> },
        ],
      },

      // Admin (oversight E1–E3 lives inside /admin, not in other areas)
      {
        element: <RequireRole roles={['admin']} />,
        children: [
          { path: ROUTES.admin, element: <AdminOverviewPage /> },
          { path: ROUTES.adminUsers, element: <AdminUsersPage /> },
        ],
      },

      // Any signed-in user
      {
        element: <RequireRole />,
        children: [{ path: ROUTES.settings, element: <SettingsPage /> }],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
