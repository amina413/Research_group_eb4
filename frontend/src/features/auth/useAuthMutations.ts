import { useMutation, useQueryClient } from '@tanstack/react-query'
import { services } from '@/services'
import type { SignInInput, SignUpInput } from '@/services/types'
import { setPendingSourceCode } from './pendingSourceCode'
import { currentProfileQueryKey } from './useCurrentProfile'

interface WithSourceCode {
  /** `?code=` to keep for C3, if the user arrived from a study link. */
  sourceCode?: string | null
}

/** A1. On success the guards see the new user and redirect. */
export function useSignUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ sourceCode, ...input }: SignUpInput & WithSourceCode) => {
      const profile = await services.signUp(input)
      if (sourceCode) setPendingSourceCode(sourceCode)
      return profile
    },
    onSuccess: (profile) => queryClient.setQueryData(currentProfileQueryKey, profile),
  })
}

/** A2. On success the guards see the user and redirect. */
export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ sourceCode, ...input }: SignInInput & WithSourceCode) => {
      const profile = await services.signIn(input)
      if (sourceCode) setPendingSourceCode(sourceCode)
      return profile
    },
    onSuccess: (profile) => queryClient.setQueryData(currentProfileQueryKey, profile),
  })
}

/** A2. Navigate away from protected pages *before* calling this. */
export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => services.signOut(),
    onSuccess: () => queryClient.setQueryData(currentProfileQueryKey, null),
  })
}
