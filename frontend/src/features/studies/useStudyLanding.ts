import { useQuery } from '@tanstack/react-query'
import { services } from '@/services'

/** Public study landing info for a recruitment source code (C1). null = unknown code. */
export function useStudyLanding(code: string) {
  return useQuery({
    queryKey: ['studies', 'landing', code],
    queryFn: () => services.getStudyBySourceCode(code),
  })
}
