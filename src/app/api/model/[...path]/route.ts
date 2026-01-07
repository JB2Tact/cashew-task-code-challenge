import { getEnhancedDb } from '@/lib/db';
import { NextRequestHandler } from '@zenstackhq/server/next';

const handler = NextRequestHandler({ 
  getPrisma: getEnhancedDb,
  useAppDir: true,
});

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };

