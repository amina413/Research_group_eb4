/** Inputs for service functions. Same shapes for mock/ and supabase/. */

/** A1 — field names match `profiles` where they map to it (full_name, email). */
export interface SignUpInput {
  full_name: string
  email: string
  password: string
}

/** A2 */
export interface SignInInput {
  email: string
  password: string
}
