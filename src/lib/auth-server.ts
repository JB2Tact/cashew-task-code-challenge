import { cookies } from 'next/headers';
import { MOCK_USERS, type User, type MockUserKey } from './auth';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userKey = cookieStore.get('mock-user')?.value as MockUserKey | undefined;
  
  // Return null if no cookie is set (user not logged in)
  if (!userKey || !(userKey in MOCK_USERS)) {
    return null;
  }
  
  return MOCK_USERS[userKey];
}

export async function setCurrentUser(userKey: MockUserKey): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('mock-user', userKey, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearCurrentUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('mock-user');
}

