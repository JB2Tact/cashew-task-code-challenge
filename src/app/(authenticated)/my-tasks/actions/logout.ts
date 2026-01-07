'use server';

import { clearCurrentUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export async function logout() {
  await clearCurrentUser();
  redirect('/');
}

