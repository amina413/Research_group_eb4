import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROUTES } from '@contract/routes'
import { renderAt } from '@/test/renderRoute'

const joinLink = () => screen.queryByRole('link', { name: 'Join this study' })

describe('study landing page /join/:code (C1, C2)', () => {
  describe('recruiting study (C1)', () => {
    it('shows the study and a join link to /register that keeps ?code=', async () => {
      renderAt(ROUTES.join('LIBPOST1'), 'signed_out')

      expect(await screen.findByRole('heading', { level: 1, name: 'Daily Mood & Sleep Study' })).toBeInTheDocument()
      expect(screen.getByText('A 12-week study on how sleep affects day-to-day emotions.')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'What taking part means' })).toBeInTheDocument()
      expect(screen.getByText('32 places left')).toBeInTheDocument()
      expect(joinLink()).toHaveAttribute('href', `${ROUTES.register}?code=LIBPOST1`)
    })

    it('following the join link opens sign up with the code kept', async () => {
      const router = renderAt(ROUTES.join('LIBPOST1'), 'signed_out')
      ;(await screen.findByRole('link', { name: 'Join this study' })).click()

      expect(await screen.findByRole('heading', { level: 1, name: 'Create your participant account' })).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(ROUTES.register)
      expect(router.state.location.search).toBe('?code=LIBPOST1')
    })

    it.each(['researcher', 'admin'] as const)('a signed-in %s sees "This page is for participants"', async (session) => {
      renderAt(ROUTES.join('LIBPOST1'), session)
      const card = await screen.findByRole('complementary', { name: 'Join this study' })
      expect(await within(card).findByText('This page is for participants.')).toBeInTheDocument()
      expect(joinLink()).not.toBeInTheDocument()
    })

    it('a signed-in participant gets a join link straight to onboarding (C3)', async () => {
      renderAt(ROUTES.join('LIBPOST1'), 'participant')
      expect(await screen.findByRole('link', { name: 'Join this study' })).toHaveAttribute(
        'href',
        ROUTES.onboarding('11111111-1111-1111-1111-111111111111'),
      )
    })
  })

  describe('full study (C2, rule R-R2)', () => {
    it('shows "study full", no join link and a way home', async () => {
      renderAt(ROUTES.join('GYMFULL1'), 'signed_out')

      expect(await screen.findByRole('heading', { level: 1, name: 'Step Count & Focus Study' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'This study is full' })).toBeInTheDocument()
      expect(screen.queryByText(/places? left/)).not.toBeInTheDocument()
      expect(joinLink()).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', ROUTES.home)
    })
  })

  describe('unknown code', () => {
    it('shows a friendly not-found state', async () => {
      renderAt(ROUTES.join('NOPE0000'), 'signed_out')

      expect(await screen.findByRole('heading', { level: 1, name: "We couldn't find that study" })).toBeInTheDocument()
      expect(joinLink()).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Back to home' })).toBeInTheDocument()
    })
  })

  describe('other statuses', () => {
    it('a completed study shows "no longer accepting participants"', async () => {
      renderAt(ROUTES.join('MORNING1'), 'signed_out')
      expect(
        await screen.findByRole('heading', { name: 'This study is no longer accepting participants' }),
      ).toBeInTheDocument()
      expect(joinLink()).not.toBeInTheDocument()
    })

    it('a draft study is treated as not found', async () => {
      renderAt(ROUTES.join('HYDRATE1'), 'signed_out')
      expect(await screen.findByRole('heading', { level: 1, name: "We couldn't find that study" })).toBeInTheDocument()
      expect(screen.queryByText('Hydration Diary (draft)')).not.toBeInTheDocument()
    })
  })
})
