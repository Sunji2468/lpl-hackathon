CREATE SCHEMA IF NOT EXISTS "app";

CREATE TABLE "app"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "app"."users"("email");

-- Access is through the backend database role, never Supabase's anonymous API.
ALTER TABLE "app"."users" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "app"."users" FROM anon, authenticated;
