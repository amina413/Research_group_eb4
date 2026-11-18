import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ROUTES } from '@contract/routes'
import { MOCK_DEV_PASSWORD } from '@/mocks/accounts'
import { getMockUserId } from '@/mocks/session'
import { renderAt } from '@/test/renderRoute'
import { getPendingSourceCode } from './pendingSourceCode'

const h1 = (name: string) => screen.findByRole('heading', { level: 1, name })
const field = (label: string) => screen.getByLabelText(label)

/** Asserts the field shows `message` and points to it with aria-describedby. */
function expectFieldError(label: string, message: string) {
  const input = field(label)
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAccessibleDescription(message)
}

async function fillRegister(values: { name?: string; email?: string; password?: string; confirm?: string }) {
  const user = userEvent.setup()
  await h1('Create your participant account')
  if (values.name) await user.type(field('Full name'), values.name)
  if (values.email) await user.type(field('Email'), values.email)
  if (values.password) await user.type(field('Password'), values.password)
  if (values.confirm) await user.type(field('Confirm password'), values.confirm)
  await user.click(screen.getByRole('button', { name: 'Create account' }))
  return user
}

async function fillLogin(email: string, password: string) {
  const user = userEvent.setup()
  await h1('Log in')
  if (email) await user.type(field('Email'), email)
  if (password) await user.type(field('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Log in' }))
  return user
}

describe('register (A1)', () => {
  it('shows an error under every empty field', async () => {
    renderAt(ROUTES.register, 'signed_out')
    await fillRegister({})

    expectFieldError('Full name', 'Enter your full name')
    expectFieldError('Email', 'Enter your email address')
    expectFieldError('Password', 'Enter a password')
    expectFieldError('Confirm password', 'Confirm your password')
    expect(field('Full name')).toHaveFocus()
  })

  it('rejects a bad email and a short password', async () => {
    renderAt(ROUTES.register, 'signed_out')
    await fillRegister({ name: 'Sam Smith', email: 'not-an-email', password: 'short', confirm: 'short' })

    expectFieldError('Email', 'Enter a valid email address, like name@example.com')
    expectFieldError('Password', 'Password must be at least 8 characters')
  })

  it('rejects passwords that do not match', async () => {
    renderAt(ROUTES.register, 'signed_out')
    await fillRegister({ name: 'Sam Smith', email: 'sam@example.com', password: 'longenough1', confirm: 'different1' })

    expectFieldError('Confirm password', 'Passwords do not match')
    expect(getMockUserId()).toBeNull()
  })

  it('creates a participant, signs them in and keeps ?code= for C3', async () => {
    const router = renderAt(`${ROUTES.register}?code=LIBPOST1`, 'signed_out')
    await fillRegister({ name: 'Sam Smith', email: 'sam@example.com', password: 'longenough1', confirm: 'longenough1' })

    expect(await h1('My dashboard')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.participant)
    expect(getPendingSourceCode()).toBe('LIBPOST1')
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    expect(getMockUserId()).not.toBeNull()
  })

  it('shows a form-level error when the email is already used', async () => {
    const router = renderAt(ROUTES.register, 'signed_out')
    await fillRegister({ name: 'Pat', email: 'participant@example.com', password: 'longenough1', confirm: 'longenough1' })

    expect(await screen.findByRole('alert')).toHaveTextContent('An account with this email already exists')
    expect(router.state.location.pathname).toBe(ROUTES.register)
  })

  it('passes ?code= on to the log-in link', async () => {
    renderAt(`${ROUTES.register}?code=LIBPOST1`, 'signed_out')
    const link = await screen.findByRole('link', { name: 'Log in if you already have an account' })
    expect(link).toHaveAttribute('href', `${ROUTES.login}?code=LIBPOST1`)
  })
})

describe('log in (A2)', () => {
  it('shows errors under empty fields', async () => {
    renderAt(ROUTES.login, 'signed_out')
    await fillLogin('', '')

    expectFieldError('Email', 'Enter your email address')
    expectFieldError('Password', 'Enter your password')
  })

  it('returns the user to the page they were trying to reach', async () => {
    const router = renderAt(ROUTES.researcherNewStudy, 'signed_out')
    await fillLogin('researcher@example.com', MOCK_DEV_PASSWORD)

    expect(await h1('Create a study')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.researcherNewStudy)
  })

  it('goes to the user\'s own area when no page was remembered', async () => {
    const router = renderAt(ROUTES.login, 'signed_out')
    await fillLogin('Admin@Example.com', MOCK_DEV_PASSWORD)

    expect(await h1('Admin overview')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.admin)
  })

  it('shows a form-level error for a wrong password and stays signed out', async () => {
    const router = renderAt(ROUTES.login, 'signed_out')
    await fillLogin('researcher@example.com', 'wrong-password')

    expect(await screen.findByRole('alert')).toHaveTextContent('The email or password is incorrect.')
    expect(router.state.location.pathname).toBe(ROUTES.login)
    expect(getMockUserId()).toBeNull()
  })
})

describe('sign out (A2)', () => {
  it('signs out from a protected page, goes home and shows the signed-out nav', async () => {
    const router = renderAt(ROUTES.participant, 'participant')
    const user = userEvent.setup()
    await h1('My dashboard')

    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(await h1('Take part in research that fits your day')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(ROUTES.home)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(await within(nav).findByRole('link', { name: 'Log in' })).toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument()
    expect(getMockUserId()).toBeNull()
  })
})
