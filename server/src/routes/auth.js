import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

const credentials = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  password: z.string().min(8).max(128),
});
const publicFields = { id: true, email: true, createdAt: true };
const hashOptions = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export function authRouter({ prisma, jwtSecret }) {
  if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
  }
  const router = Router();
  // Verify a real hash even when an email is unknown.
  const dummyHash = argon2.hash('dummy-password-for-timing-only', hashOptions);
  router.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: 'Too many attempts. Please try again later.' },
  }));
  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  function result(user) {
    const token = jwt.sign({}, jwtSecret, {
      algorithm: 'HS256', subject: user.id, expiresIn: '1h',
      issuer: 'lpl-server', audience: 'lpl-client',
    });
    return { user, token, tokenType: 'Bearer', expiresIn: 3600 };
  }

  router.post('/register', async (req, res) => {
    const parsed = credentials.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Provide a valid email and a password between 8 and 128 characters' });
    }
    const { email, password } = parsed.data;
    const passwordHash = await argon2.hash(password, hashOptions);
    try {
      const user = await prisma.user.create({ data: { email, passwordHash }, select: publicFields });
      return res.status(201).json(result(user));
    } catch (err) {
      if (err.code === 'P2002') return res.status(409).json({ error: 'Email is already registered' });
      throw err;
    }
  });

  router.post('/login', async (req, res) => {
    const parsed = credentials.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Provide a valid email and a password between 8 and 128 characters' });
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = await argon2.verify(user?.passwordHash ?? await dummyHash, password);
    if (!user || !valid) return res.status(401).json({ error: 'Invalid email or password' });
    return res.json(result({ id: user.id, email: user.email, createdAt: user.createdAt }));
  });
  return router;
}
