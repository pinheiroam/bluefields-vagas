const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY_ENV = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

function readEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} ausente. Confira o arquivo .env.local (use .env.example como referência).`,
    );
  }
  return value;
}

export function getSupabaseUrl(): string {
  return readEnvOrThrow(SUPABASE_URL_ENV);
}

export function getSupabaseAnonKey(): string {
  return readEnvOrThrow(SUPABASE_ANON_KEY_ENV);
}
