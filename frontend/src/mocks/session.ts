/**
 * Which mock user is signed in (VITE_USE_MOCKS=true only). Stores a profile id,
 * or 'signed_out'. Kept in localStorage so it survives a reload.
 *
 * `setMockSession(role)` signs in that role's preset account; the dev role
 * switcher and tests use it.
 */
import type { UserRole } from '@contract/database.types';
import { findProfileById } from '@/mocks/accounts';
import { mockProfiles } from '@/mocks/profiles';

export type MockSession = UserRole | 'signed_out';

export const MOCK_SESSIONS: readonly MockSession[] = ['signed_out', 'participant', 'researcher', 'admin'];

const STORAGE_KEY = 'kv6014.mockSession';
const SIGNED_OUT = 'signed_out';
/** Used when nothing is stored yet, so the app opens on a real page. */
const DEFAULT_USER_ID = mockProfiles.participant.id;

function isRole(value: string): value is UserRole {
  return value in mockProfiles;
}

/** The signed-in mock user's profile id, or null when signed out. */
export function getMockUserId(): string | null {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked — fall through to the default.
  }
  if (stored === null) return DEFAULT_USER_ID;
  if (stored === SIGNED_OUT) return null;
  if (isRole(stored)) return mockProfiles[stored].id; // value stored before A1
  return findProfileById(stored) ? stored : null;
}

export function setMockUserId(id: string | null): void {
  try {
    localStorage.setItem(STORAGE_KEY, id ?? SIGNED_OUT);
  } catch {
    // Storage blocked — the change just won't persist.
  }
}

/** Sign in as a role's preset account, or sign out. */
export function setMockSession(session: MockSession): void {
  setMockUserId(session === 'signed_out' ? null : mockProfiles[session].id);
}
