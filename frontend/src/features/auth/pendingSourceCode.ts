/**
 * The recruitment source code (`?code=` from /join/:code → /register) kept after
 * sign-up or log-in so C3 (onboarding / apply_to_study p_source_code) can use it.
 * Session storage only: it shouldn't outlive the browser tab.
 */
const STORAGE_KEY = 'kv6014.pendingSourceCode'

export function getPendingSourceCode(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setPendingSourceCode(code: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, code)
  } catch {
    // Storage blocked — C3 will have to ask for the code again.
  }
}

export function clearPendingSourceCode(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
