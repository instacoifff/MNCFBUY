/**
 * Runtime environment variable validation.
 * Throws clear errors at startup if required env vars are missing,
 * instead of failing silently with `!` assertions at runtime.
 */

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Please add it to your .env.local file.`
    )
  }
  return value
}

/** Validated environment variables — import these instead of using process.env directly. */
export const env = {
  get SUPABASE_URL() {
    return getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
  },
  get SUPABASE_ANON_KEY() {
    return getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  },
} as const
