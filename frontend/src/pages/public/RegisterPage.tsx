/**
 * Sign up — /register (A1). Figma "Sign up page" 69-1429.
 * Keeps ?code= from the study landing page (data contract §7) for C3.
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { TextField } from '@/components/shared/TextField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { authErrorMessage } from '@/features/auth/authErrorMessage'
import { registerSchema, type RegisterValues } from '@/features/auth/schemas'
import { useSignUp } from '@/features/auth/useAuthMutations'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: '', email: '', password: '', confirm_password: '' },
  })

  const onSubmit = handleSubmit(async ({ full_name, email, password }) => {
    try {
      await signUp.mutateAsync({ full_name: full_name.trim(), email: email.trim(), password, sourceCode: code })
    } catch {
      // Shown as the form-level error below.
    }
  })

  const loginHref = code ? `${ROUTES.login}?code=${encodeURIComponent(code)}` : ROUTES.login

  return (
    <section aria-labelledby="register-title" className="mx-auto flex w-full max-w-md flex-col gap-6">
      <h1 id="register-title" className="text-hero font-bold">
        Create your participant account
      </h1>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField id="full_name" label="Full name" autoComplete="name" error={errors.full_name?.message} {...register('full_name')} />
        <TextField id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          id="confirm_password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        {signUp.isError && (
          <Alert variant="destructive" className="border-destructive">
            <AlertDescription className="text-destructive">{authErrorMessage(signUp.error)}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={signUp.isPending} className="w-full">
          {signUp.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center">
        <Link to={loginHref} className="font-bold text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Log in if you already have an account
        </Link>
      </p>
    </section>
  )
}
