import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

// Opt-in integration check: creates a unique test user and removes only that user.
const email = `auth-smoke-${randomUUID()}@example.com`;
const password = randomUUID();
const server = createApp({ prisma, jwtSecret: process.env.JWT_SECRET }).listen(0, '127.0.0.1');
try {
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api/auth`;
  async function request(route, body) {
    const res = await fetch(`${base}/${route}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  }
  const registered = await request('register', { email, password });
  assert.equal(registered.status, 201);
  assert.equal(registered.body.user.passwordHash, undefined);
  const stored = await prisma.user.findUnique({ where: { email } });
  assert.ok(await argon2.verify(stored.passwordHash, password));
  assert.equal((await request('register', { email: email.toUpperCase(), password })).status, 409);
  const login = await request('login', { email, password });
  assert.equal(login.status, 200);
  const token = jwt.verify(login.body.token, process.env.JWT_SECRET, {
    algorithms: ['HS256'], issuer: 'lpl-server', audience: 'lpl-client',
  });
  assert.equal(token.sub, stored.id);
  assert.equal((await request('login', { email, password: 'incorrect-password' })).status, 401);
  console.log('PASS: Supabase registration, persisted hash, duplicate email, login token, and wrong password');
} finally {
  await new Promise(resolve => server.close(resolve));
  try {
    await prisma.user.deleteMany({ where: { email } });
    console.log('Removed temporary smoke-test user');
  } finally { await prisma.$disconnect(); }
}
