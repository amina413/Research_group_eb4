import { useQuery } from '@tanstack/react-query'
import { services } from '@/services'

export const currentProfileQueryKey = ['auth', 'currentProfile'] as const

/** The signed-in user's profile (null = signed out). The only way components read the user. */
export function useCurrentProfile() {
  return useQuery({
    queryKey: currentProfileQueryKey,
    queryFn: () => services.getCurrentProfile(),
    staleTime: Infinity,
  })
}
