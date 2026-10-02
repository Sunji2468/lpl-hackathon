# LPL backend

Express + Prisma 7 + PostgreSQL hosted on Supabase. Requires Node.js 22.12 or newer.

## Setup

```sh
cd server
npm install
cp .env.example .env # only for a new checkout; preserve your existing .env
```

Set `DATABASE_PASSWORD` to the **raw** Supabase database password (quote it in `.env`, especially if it contains `#`). The backend percent-encodes it when building the connection URL. Set `JWT_SECRET` to a random secret of at least 32 bytes; generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

```sh
npm run db:migrate
npm run dev
```

The server defaults to http://localhost:3000. Set `PORT` to change it. `npm start` runs without automatic restarts. Prisma Client is generated during installation; run `npm run prisma:generate` after editing the schema.

## Routes

| Method | Path | Result |
| --- | --- | --- |
| GET | `/` | Welcome message |
| GET | `/health` | Server liveness (`status: ok`), not database readiness |
| POST | `/api/auth/register` | Create user; returns 201 |
| POST | `/api/auth/login` | Authenticate user; returns 200 |

Both auth endpoints accept JSON:

```json
{ "email": "you@example.com", "password": "a-long-unique-password" }
```

Both return:

```json
{
  "user": { "id": "uuid", "email": "you@example.com", "createdAt": "ISO timestamp" },
  "token": "signed-jwt",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

Email is trimmed and lowercased. Passwords must be 8–128 characters and are hashed with Argon2id. Passwords and hashes are never returned. Invalid input returns 400; duplicate registration returns 409; incorrect credentials return 401 with the same message for unknown emails and wrong passwords. Auth allows 20 failed requests per IP per 15 minutes, then returns 429.

JWTs expire after one hour and use HS256, issuer `lpl-server`, and audience `lpl-client`. These are custom backend accounts in `app.users`, separate from Supabase Auth. Email verification, password reset, refresh tokens, logout/revocation, and protected resource routes are not implemented yet. Future protected endpoints must verify the signature, algorithm, issuer, audience, and expiry. Use HTTPS when deployed; configure a shared rate-limit store and the exact trusted proxy settings when running multiple instances or behind a proxy.

## Database

`prisma/schema.prisma` defines the user model. The committed migration creates `app.users` with a unique email constraint and enables RLS, with no anonymous/authenticated API access. The supplied `postgres` database role accesses it through Prisma. Keep database credentials exclusively on the backend.

The default connection uses the supplied Supabase host, port 5432, and database/user `postgres`, with verified TLS using `prisma/supabase-ca.crt`. The public CA was downloaded from [Supabase's certificate storage](https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt); see [Supabase SSL documentation](https://supabase.com/docs/guides/platform/ssl-enforcement).

`DATABASE_HOST`, `DATABASE_PORT`, and `DATABASE_USER` can override those defaults. `DATABASE_URL` overrides the entire connection, so include encoded credentials and appropriate TLS parameters yourself. For networks without IPv6, use the session-pooler host and user from your Supabase Connect panel. Do not guess the pooler region. See [Supabase's connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres).

## Checks

```sh
npm test
node --env-file=.env scripts/smoke-auth.js
```

The unit/HTTP tests use an in-memory database substitute. The optional smoke test uses your actual database, creates a unique temporary user, checks registration/login, and deletes that user afterward.

Dependency audit on setup reported four high-severity findings through Prisma 7.10.0's tooling dependencies (`deepmerge-ts` and `mysql2`, plus their parent packages). npm's suggested automatic fix downgrades Prisma to version 6 and was not applied. These packages are not used by the auth route handlers; recheck with `npm audit` and update compatible Prisma releases when fixes are available.
