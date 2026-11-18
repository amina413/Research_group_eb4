import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .pipe(z.email('Enter a valid email address, like name@example.com'))

/** A1 — full_name and email match `profiles`. */
export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(1, 'Enter your full name')
      .max(100, 'Full name must be 100 characters or fewer'),
    email,
    password: z
      .string()
      .min(1, 'Enter a password')
      .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
    confirm_password: z.string().min(1, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type RegisterValues = z.input<typeof registerSchema>

/** A2 */
export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
})

export type LoginValues = z.input<typeof loginSchema>
