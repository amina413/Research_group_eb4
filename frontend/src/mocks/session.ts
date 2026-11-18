/**
 * Which mock user is "signed in". Only the mock services and the dev-only role
 * switcher use this. The choice is kept in localStorage so it survives a reload.
 */
import type { UserRole } from '@contract/database.types';

export type MockSession = UserRole | 'signed_out';

export const MOCK_SESSIONS: readonly MockSession[] = ['signed_out', 'participant', 'researcher', 'admin'];

const STORAGE_KEY = 'kv6014.mockSession';
const DEFAULT_SESSION: MockSession = 'participant';

function isMockSession(value: unknown): value is MockSession {
  return typeof value === 'string' && (MOCK_SESSIONS as readonly string[]).includes(value);
}

export function getMockSession(): MockSession {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isMockSession(stored) ? stored : DEFAULT_SESSION;
  } catch {
    return DEFAULT_SESSION;
  }
}

export function setMockSession(session: MockSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, session);
  } catch {
    // Storage blocked (private window etc.) — the switch just won't persist.
  }
}
