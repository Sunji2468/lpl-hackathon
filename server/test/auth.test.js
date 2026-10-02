import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { databaseUrl } from '../src/config/database.js';

test('database password special characters round-trip safely', () => {
  const password = 'a@b:/?#%+$&';
  const url = new URL(databaseUrl({ DATABASE_PASSWORD: password }));
  assert.equal(decodeURIComponent(url.password), password);
  assert.equal(url.searchParams.get('sslmode'), 'verify-full');
});

test('authentication HTTP contract', async (t) => {
  const users = new Map();
  const prisma = { user: {
    async create({ data }) {
      if (users.has(data.email)) throw Object.assign(new Error('Duplicate'), { code: 'P2002' });
      const user = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
      users.set(data.email, user);
      return { id: user.id, email: user.email, createdAt: user.createdAt };
    },
    async findUnique({ where }) { return users.get(where.email) ?? null; },
  } };
  const jwtSecret = 'test-only-secret-with-at-least-32-bytes';
  const server = createApp({ prisma, jwtSecret }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api/auth`;
  async function post(route, body) {
    const response = await fetch(`${base}/${route}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  }
  const password = 'A-long-test-password!';

  await t.test('validation rejects missing, malformed, and oversized credentials', async () => {
    for (const body of [{}, { email: 'bad', password }, { email: 'a@example.com', password: 'short' }, { email: 'a@example.com', password: 'x'.repeat(129) }, null]) {
      assert.equal((await post('register', body)).status, 400);
    }
    assert.equal(users.size, 0);
  });
  await t.test('register normalizes email, hashes password, and issues a scoped token', async () => {
    const response = await post('register', { email: ' Test@Example.com ', password });
    assert.equal(response.status, 201);
    assert.equal(response.body.user.email, 'test@example.com');
    assert.equal(response.body.user.passwordHash, undefined);
    assert.equal(response.body.user.password, undefined);
    const stored = users.get('test@example.com');
    assert.notEqual(stored.passwordHash, password);
    assert.ok(await argon2.verify(stored.passwordHash, password));
    const token = jwt.verify(response.body.token, jwtSecret, { algorithms: ['HS256'], issuer: 'lpl-server', audience: 'lpl-client' });
    assert.equal(token.sub, stored.id);
    assert.equal(token.exp - token.iat, 3600);
  });
  await t.test('duplicate registration returns 409', async () => {
    assert.equal((await post('register', { email: 'TEST@example.com', password })).status, 409);
    assert.equal(users.size, 1);
  });
  await t.test('login succeeds without exposing password hashes', async () => {
    const response = await post('login', { email: 'test@example.com', password });
    assert.equal(response.status, 200);
    assert.equal(response.body.user.passwordHash, undefined);
    assert.ok(response.body.token);
  });
  await t.test('unknown email and wrong password return identical 401 errors', async () => {
    const wrong = await post('login', { email: 'test@example.com', password: 'wrong-password' });
    const missing = await post('login', { email: 'missing@example.com', password });
    assert.equal(wrong.status, 401);
    assert.deepEqual(wrong, missing);
  });
  await t.test('database failures return a generic 500 without leaking details', async () => {
    prisma.user.findUnique = async () => { throw new Error('sensitive connection details'); };
    const response = await post('login', { email: 'test@example.com', password });
    assert.deepEqual(response, { status: 500, body: { error: 'Internal server error' } });
  });
  await t.test('repeated failed requests are rate limited', async () => {
    let response;
    for (let i = 0; i < 21; i++) response = await post('login', {});
    assert.equal(response.status, 429);
  });
});
