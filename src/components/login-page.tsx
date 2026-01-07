'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MOCK_USERS, type MockUserKey } from '@/lib/auth';
import { login } from '@/app/actions/login';
import Image from 'next/image';

export function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const handleLogin = (userKey: MockUserKey) => {
    startTransition(async () => {
      await login(userKey);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Task Manager</CardTitle>
          <CardDescription className="text-center">
            Select a user to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(MOCK_USERS).map(([key, user]) => (
            <Button
              key={key}
              variant="outline"
              className="w-full h-auto py-4 justify-start"
              onClick={() => handleLogin(key as MockUserKey)}
              disabled={isPending}
            >
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div className="text-left">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

