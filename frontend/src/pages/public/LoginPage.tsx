/**
 * Log in — /login (A2). Figma "Log in page" 69-1309.
 * After login, RedirectIfSignedIn sends the user back to the page they were
 * trying to reach (remembered by A3), otherwise to their own area.
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@contract/routes'
import { TextField } from '@/components/shared/TextField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { authErrorMessage } from '@/features/auth/authErrorMessage'
import { loginSchema, type LoginValues } from '@/features/auth/schemas'
import { useSignIn } from '@/features/auth/useAuthMutations'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const location = useLocation()
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signIn.mutateAsync({ email: email.trim(), password, sourceCode: code })
    } catch {
      // Shown as the form-level error below.
    }
  })

  const registerHref = code ? `${ROUTES.register}?code=${encodeURIComponent(code)}` : ROUTES.register

  return (
    <section aria-labelledby="login-title" className="mx-auto flex w-full max-w-md flex-col gap-6">
      <h1 id="login-title" className="text-hero font-bold">
        Log in
      </h1>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {signIn.isError && (
          <Alert variant="destructive" className="border-destructive">
            <AlertDescription className="text-destructive">{authErrorMessage(signIn.error)}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={signIn.isPending} className="w-full">
          {signIn.isPending ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="text-center">
        {/* Keep A3's remembered page if the user switches to sign-up. */}
        <Link
          to={registerHref}
          state={location.state}
          className="font-bold text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          New participant? Create an account
        </Link>
      </p>
    </section>
  )
}
