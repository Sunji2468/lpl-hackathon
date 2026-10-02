import { fileURLToPath } from 'node:url';

export function databaseUrl(env = process.env) {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  if (!env.DATABASE_PASSWORD) throw new Error('DATABASE_PASSWORD or DATABASE_URL is required');

  const url = new URL('postgresql://db.rhgruexujsgakhxcdhic.supabase.co:5432/postgres');
  url.username = encodeURIComponent(env.DATABASE_USER || 'postgres');
  url.password = encodeURIComponent(env.DATABASE_PASSWORD);
  url.hostname = env.DATABASE_HOST || url.hostname;
  url.port = env.DATABASE_PORT || '5432';
  url.searchParams.set('sslmode', 'verify-full');
  url.searchParams.set('sslrootcert', fileURLToPath(new URL('../../prisma/supabase-ca.crt', import.meta.url)));
  return url.toString();
}
