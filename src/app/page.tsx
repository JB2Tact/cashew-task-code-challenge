import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { LoginPage } from '@/components/login-page';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  // If user is logged in, redirect to my-tasks
  if (user) {
    redirect('/my-tasks');
  }
  
  // Otherwise show login page
  return <LoginPage />;
}
