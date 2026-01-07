'use server';

import { setCurrentUser } from '@/lib/auth-server';
import { type MockUserKey } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function switchUser(userKey: MockUserKey) {
  await setCurrentUser(userKey);
  revalidatePath('/my-tasks');
}

