import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROUTES } from '@contract/routes'
import type { MockSession } from '@/mocks/session'
import { renderAt } from '@/test/renderRoute'

const heading = (name: string) => screen.findByRole('heading', { level: 1, name })

describe('role guards (A3)', () => {
  describe('signed out', () => {
    it.each([
      ROUTES.participant,
      ROUTES.researcherStudy('abc'),
      ROUTES.admin,
      ROUTES.settings,
    ])('%s redirects to the login page and remembers where they were going', async (path) => {
      const router = renderAt(path, 'signed_out')
      expect(await heading('Log in')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(ROUTES.login)
      expect(router.state.location.state).toEqual({ from: path })
    })

    it('can still open public pages', async () => {
      renderAt(ROUTES.join('LIBPOST1'), 'signed_out')
      expect(await heading('Daily Mood & Sleep Study')).toBeInTheDocument()
    })
  })

  describe('wrong role', () => {
    it.each<[MockSession, string]>([
      ['researcher', ROUTES.participant],
      ['admin', ROUTES.participantTask('t1')],
      ['participant', ROUTES.researcher],
      ['admin', ROUTES.researcherNewStudy],
      ['participant', ROUTES.admin],
      ['researcher', ROUTES.adminUsers],
    ])('%s opening %s sees the blocked screen, not the page', async (session, path) => {
      const router = renderAt(path, session)
      expect(await heading("You can't open this page")).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Go to my area' })).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(path)
    })
  })

  describe('right role', () => {
    it.each<[MockSession, string, string]>([
      ['participant', ROUTES.participant, 'My dashboard'],
      ['participant', ROUTES.onboarding('11111111-1111-1111-1111-111111111111'), 'Tell us about you'],
      ['researcher', ROUTES.researcher, 'My studies'],
      ['researcher', ROUTES.researcherStudyParticipants('s1'), 'Participants'],
      ['admin', ROUTES.admin, 'Admin overview'],
      ['admin', ROUTES.adminUsers, 'Manage users'],
    ])('%s can open %s', async (session, path, title) => {
      renderAt(path, session)
      expect(await heading(title)).toBeInTheDocument()
    })

    it.each<MockSession>(['participant', 'researcher', 'admin'])(
      '%s can open settings',
      async (session) => {
        renderAt(ROUTES.settings, session)
        expect(await heading('Account settings')).toBeInTheDocument()
      },
    )
  })

  describe('signed in on /login or /register', () => {
    it.each<[MockSession, string, string]>([
      ['participant', ROUTES.participant, 'My dashboard'],
      ['researcher', ROUTES.researcher, 'My studies'],
      ['admin', ROUTES.admin, 'Admin overview'],
    ])('%s is sent from /login to %s', async (session, home, title) => {
      const router = renderAt(ROUTES.login, session)
      expect(await heading(title)).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(home)
    })

    it('a signed-in user is sent away from /register too', async () => {
      const router = renderAt(ROUTES.register, 'researcher')
      expect(await heading('My studies')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(ROUTES.researcher)
    })
  })
})
