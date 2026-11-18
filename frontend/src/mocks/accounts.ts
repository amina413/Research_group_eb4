/**
 * FAKE DEV DATA — mock sign-in accounts for VITE_USE_MOCKS=true only.
 * The password below is a well-known dev value shown in the dev role switcher.
 * NEVER reuse it for real or seeded Supabase accounts.
 *
 * Accounts created through the sign-up form are kept in localStorage so they
 * survive a reload. Passwords are stored in plain text because this is mock data.
 */
import type { ProfileRow } from '@contract/database.types';
import { mockProfiles } from '@/mocks/profiles';

export const MOCK_DEV_PASSWORD = 'password123';

interface MockAccount {
  profile: ProfileRow;
  password: string;
}

const STORAGE_KEY = 'kv6014.mockAccounts';

const presetAccounts: MockAccount[] = Object.values(mockProfiles).map((profile) => ({
  profile,
  password: MOCK_DEV_PASSWORD,
}));

function isMockAccount(value: unknown): value is MockAccount {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<MockAccount>;
  return typeof v.password === 'string' && typeof v.profile?.id === 'string' && typeof v.profile.email === 'string';
}

function loadRegistered(): MockAccount[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isMockAccount) : [];
  } catch {
    return [];
  }
}

function saveRegistered(accounts: MockAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Storage blocked — the account just won't survive a reload.
  }
}

function allAccounts(): MockAccount[] {
  return [...presetAccounts, ...loadRegistered()];
}

const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function findAccountByEmail(email: string): MockAccount | undefined {
  return allAccounts().find((a) => sameEmail(a.profile.email, email));
}

export function findProfileById(id: string): ProfileRow | undefined {
  return allAccounts().find((a) => a.profile.id === id)?.profile;
}

/** Creates a participant account (A1: new sign-ups are always participants). */
export function createAccount(input: { full_name: string; email: string; password: string }): ProfileRow {
  const now = new Date().toISOString();
  const profile: ProfileRow = {
    id: crypto.randomUUID(),
    role: 'participant',
    full_name: input.full_name,
    email: input.email.trim(),
    date_of_birth: null,
    created_at: now,
    updated_at: now,
  };
  saveRegistered([...loadRegistered(), { profile, password: input.password }]);
  return profile;
}
