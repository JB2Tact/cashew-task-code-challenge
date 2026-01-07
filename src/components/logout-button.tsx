'use client';

import { useTransition } from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/app/(authenticated)/my-tasks/actions/logout';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}

