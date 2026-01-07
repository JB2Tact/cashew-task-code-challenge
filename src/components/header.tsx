import { getCurrentUser } from '@/lib/auth-server';
import { UserSwitcher } from './user-switcher';
import { LogoutButton } from './logout-button';
import Link from 'next/link';

export async function Header() {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-semibold hover:opacity-80 transition-opacity">
            Task Manager
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href="/tasks" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              All Tasks
            </Link>
            {currentUser && (
              <Link 
                href="/my-tasks" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                My Tasks
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <UserSwitcher currentUser={currentUser} />
              <LogoutButton />
            </>
          ) : (
            <Link 
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

