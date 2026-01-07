'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createTask } from '../actions';
import { useTransition, useState } from 'react';

export function TaskForm() {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    startTransition(async () => {
      try {
        await createTask({
          title: title.trim(),
          description: description.trim() || undefined,
        });
        setTitle('');
        setDescription('');
      } catch {
        alert('Failed to create task. Please try again.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title..."
              disabled={isPending}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter task description..."
              disabled={isPending}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

