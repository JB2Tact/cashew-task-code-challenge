import { enhance } from '@zenstackhq/runtime';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from './auth-server';

const prisma = new PrismaClient();

export async function getEnhancedDb() {
  const user = await getCurrentUser();
  // Pass user to ZenStack (can be null for unauthenticated access)
  return enhance(prisma, { user: user || undefined });
}

