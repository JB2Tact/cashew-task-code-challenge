'use server';

import { setCurrentUser } from '@/lib/auth-server';
import { type MockUserKey } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(userKey: MockUserKey) {
  await setCurrentUser(userKey);
  redirect('/my-tasks');
}

