'use client';

import { useState, useTransition } from 'react';
import { switchUser } from '@/app/(authenticated)/my-tasks/actions/switch-user';
import { MOCK_USERS, type MockUserKey, type User } from '@/lib/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import Image from 'next/image';

type UserSwitcherProps = {
  currentUser: User;
};

export function UserSwitcher({ currentUser }: UserSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<string>(
    Object.entries(MOCK_USERS).find(([, user]) => user.id === currentUser.id)?.[0] || 'alice'
  );

  const handleUserChange = (userKey: string) => {
    setSelectedUser(userKey);
    startTransition(async () => {
      await switchUser(userKey as MockUserKey);
    });
  };

  return (
    <Select
      value={selectedUser}
      onValueChange={handleUserChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm">{currentUser.name}</span>
        </div>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {Object.entries(MOCK_USERS).map(([key, user]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Image
                src={user.avatar}
                alt={user.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{user.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

