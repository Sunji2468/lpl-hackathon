import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseUrl } from './config/database.js';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl(), connectionTimeoutMillis: 10000 }),
});
