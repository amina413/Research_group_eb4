/**
 * Single entry point for all data access.
 * Components/hooks import from here — never from mock/ or supabase/ directly.
 */
import * as mock from './mock';
import * as real from './supabase';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export const services = useMocks ? mock : real;
