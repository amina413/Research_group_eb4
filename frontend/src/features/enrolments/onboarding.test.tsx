import { screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ROUTES } from '@contract/routes'
import { getPendingSourceCode, setPendingSourceCode } from '@/features/auth/pendingSourceCode'
import { MOCK_DEV_PASSWORD } from '@/mocks/accounts'
import { listEnrolments, listTaskResponses, setMockEnrolmentStatus } from '@/mocks/enrolments'
import { mockProfiles } from '@/mocks/profiles'
import { mockRecruitmentSources } from '@/mocks/recruitmentSources'
import { renderAt } from '@/test/renderRoute'

const MOOD_STUDY = '11111111-1111-1111-1111-111111111111' // recruiting, every question type
const FULL_STUDY = '44444444-4444-4444-4444-444444444444' // status 'full'
const PARTICIPANT = mockProfiles.participant.id
const Q = (n: number) => `c1000000-0000-0000-0000-00000000000${n}`

const h1 = (name: string) => screen.findByRole('heading', { level: 1, name })

async function choose(user: UserEvent, comboboxName: string, optionName: string) {
  await user.click(screen.getByRole('combobox', { name: comboboxName }))
  await user.click(await screen.findByRole('option', { name: optionName }))
}

/** Answers every required question on the Daily Mood & Sleep onboarding. */
async function answerRequired(user: UserEvent) {
  await choose(user, 'Age band', '18–24')
  await choose(user, 'Gender', 'Prefer not to say')
  await choose(user, 'Location', 'North East England')
  const smartphone = screen.getByRole('group', { name: 'Do you own a smartphone?' })
  await user.click(within(smartphone).getByText('Yes'))
  await user.type(screen.getByRole('spinbutton', { name: 'Average hours of sleep a night' }), '7.5')
  await user.click(screen.getByRole('radio', { name: '3' }))
}

describe('onboarding questionnaire (C3)', () => {
  it('renders every question type with an accessible label', async () => {
    renderAt(ROUTES.onboarding(MOOD_STUDY), 'participant')
    expect(await h1('Tell us about you')).toBeInTheDocument()

    // single_choice → dropdown
    for (const name of ['Age band', 'Gender', 'Location']) {
      expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
    }
    // yes_no → Yes / No buttons in a labelled group
    const smartphone = screen.getByRole('group', { name: 'Do you own a smartphone?' })
    expect(within(smartphone).getByText('Yes')).toBeInTheDocument()
    expect(within(smartphone).getByText('No')).toBeInTheDocument()
    // multi_choice → checkboxes
    const wearables = screen.getByRole('group', { name: 'Which wearables do you use? (optional)' })
    expect(within(wearables).getAllByRole('checkbox')).toHaveLength(3)
    // number → number input with its unit
    expect(screen.getByRole('spinbutton', { name: 'Average hours of sleep a night' })).toHaveAccessibleDescription('hours')
    // scale → radio group 1–5 with labels
    const stress = screen.getByRole('radiogroup', { name: 'How stressed do you feel day to day?' })
    expect(within(stress).getAllByRole('radio')).toHaveLength(5)
    expect(stress).toHaveAccessibleDescription('1 = Not at all, 5 = Extremely')
    // short_text → input, long_text → textarea
    expect(screen.getByRole('textbox', { name: 'Occupation (optional)' }).tagName).toBe('INPUT')
    expect(screen.getByRole('textbox', { name: 'Anything else we should know? (optional)' }).tagName).toBe('TEXTAREA')
  })

  it('shows errors on required questions only, and checks number ranges', async () => {
    renderAt(ROUTES.onboarding(MOOD_STUDY), 'participant')
    const user = userEvent.setup()
    await h1('Tell us about you')

    await user.type(screen.getByRole('spinbutton', { name: 'Average hours of sleep a night' }), '30')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('combobox', { name: 'Age band' })).toHaveAccessibleDescription('Choose an answer')
    expect(screen.getByRole('combobox', { name: 'Gender' })).toHaveAccessibleDescription('Choose an answer')
    expect(screen.getByRole('combobox', { name: 'Location' })).toHaveAccessibleDescription('Choose an answer')
    expect(screen.getByRole('group', { name: 'Do you own a smartphone?' })).toHaveAccessibleDescription('Choose yes or no')
    expect(screen.getByRole('spinbutton', { name: 'Average hours of sleep a night' })).toHaveAccessibleDescription(
      'hours Enter a number between 0 and 24',
    )
    expect(screen.getByRole('radiogroup', { name: 'How stressed do you feel day to day?' })).toHaveAccessibleDescription(
      '1 = Not at all, 5 = Extremely Choose a value',
    )
    // Optional questions have no error
    expect(screen.getByRole('textbox', { name: 'Occupation (optional)' })).not.toHaveAttribute('aria-invalid')
    expect(screen.getByRole('group', { name: 'Which wearables do you use? (optional)' })).not.toHaveAttribute('aria-invalid')
    expect(listEnrolments()).toHaveLength(0)
  })

  it('submitting creates a pending enrolment with shape-B answers and goes to the pending screen', async () => {
    setPendingSourceCode('LIBPOST1')
    const router = renderAt(ROUTES.onboarding(MOOD_STUDY), 'participant')
    const user = userEvent.setup()
    await h1('Tell us about you')

    await answerRequired(user)
    await user.click(screen.getByRole('checkbox', { name: 'Smart ring' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await h1('Eligibility results')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.participantPending)
    expect(screen.getByRole('heading', { name: 'Pending approval' })).toBeInTheDocument()

    const enrolments = listEnrolments()
    expect(enrolments).toHaveLength(1)
    expect(enrolments[0]).toMatchObject({
      study_id: MOOD_STUDY,
      participant_id: PARTICIPANT,
      status: 'pending',
      source_id: mockRecruitmentSources.find((s) => s.code === 'LIBPOST1')?.id,
    })
    const [response] = listTaskResponses()
    expect(response.enrolment_id).toBe(enrolments[0].id)
    // Shape B: keyed by question id; unanswered optional questions left out
    expect(response.answers).toEqual({
      [Q(1)]: '18_24',
      [Q(2)]: 'prefer_not_to_say',
      [Q(3)]: 'north_east',
      [Q(4)]: true,
      [Q(5)]: ['smart_ring'],
      [Q(6)]: 7.5,
      [Q(7)]: 3,
    })
    expect(getPendingSourceCode()).toBeNull()
  })

  it('shows the group-full message when the study is not recruiting', async () => {
    setPendingSourceCode('GYMFULL1')
    const router = renderAt(ROUTES.onboarding(FULL_STUDY), 'participant')
    const user = userEvent.setup()
    await h1('Tell us about you')

    await choose(user, 'Age band', '25–34')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('This group is currently full')
    expect(router.state.location.pathname).toBe(ROUTES.onboarding(FULL_STUDY))
    expect(listEnrolments()).toHaveLength(0)
    expect(getPendingSourceCode()).toBe('GYMFULL1')
  })
})

describe('getting to onboarding (C3)', () => {
  it('logging in with ?code= continues to that study\'s onboarding', async () => {
    const router = renderAt(`${ROUTES.login}?code=LIBPOST1`, 'signed_out')
    const user = userEvent.setup()
    await h1('Log in')
    await user.type(screen.getByLabelText('Email'), 'participant@example.com')
    await user.type(screen.getByLabelText('Password'), MOCK_DEV_PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await h1('Tell us about you')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.onboarding(MOOD_STUDY))
  })

  it('the landing page Join button takes a signed-in participant to onboarding and keeps the code', async () => {
    const router = renderAt(ROUTES.join('LIBPOST1'), 'participant')
    const user = userEvent.setup()
    await user.click(await screen.findByRole('link', { name: 'Join this study' }))

    expect(await h1('Tell us about you')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.onboarding(MOOD_STUDY))
    expect(getPendingSourceCode()).toBe('LIBPOST1')
  })
})

describe('waiting for approval (C4, rule R-R5)', () => {
  it.each([ROUTES.participant, ROUTES.participantRewards, ROUTES.participantTask('t1')])(
    'a pending participant opening %s is kept on the pending screen',
    async (path) => {
      setMockEnrolmentStatus(PARTICIPANT, MOOD_STUDY, 'pending')
      const router = renderAt(path, 'participant')

      expect(await h1('Eligibility results')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(ROUTES.participantPending)
    },
  )

  it('an approved participant reaches the dashboard and is sent away from the pending screen', async () => {
    setMockEnrolmentStatus(PARTICIPANT, MOOD_STUDY, 'approved')
    const router = renderAt(ROUTES.participantPending, 'participant')

    expect(await h1('My dashboard')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.participant)
  })

  it('a participant with no enrolment can open the dashboard', async () => {
    renderAt(ROUTES.participant, 'participant')
    expect(await h1('My dashboard')).toBeInTheDocument()
  })
})
