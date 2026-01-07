# Challenge Solutions

This document contains the solutions to the intern challenge. **DO NOT share this with candidates!**

## Task A: Add Category Field

**Solution:**

In `src/schema.zmodel`, add the category field to the Task model:

```zmodel
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  category    String?  // Add this line
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // ... access control rules
}
```

Then run:
```bash
pnpm zenstack
pnpm db:push
```

---

## Task B: Fix Access Control

**Basic Solution:**

Replace the broken `@@allow('all', true)` in the Task model with proper access control:

```zmodel
model Task {
  // ... fields
  
  // Allow users to read their own tasks
  @@allow('read', auth() == author)
  
  // Allow users to create tasks (ZenStack will enforce authorId matches auth())
  @@allow('create', auth() != null)
  
  // Allow users to update their own tasks
  @@allow('update', auth() == author)
  
  // Allow users to delete their own tasks
  @@allow('delete', auth() == author)
}
```

**Bonus Solution (with public tasks):**

```zmodel
model Task {
  // ... existing fields
  isPublic    Boolean  @default(false)  // Add this field
  
  // Allow users to read their own tasks OR public tasks
  @@allow('read', auth() == author || isPublic)
  
  // Allow users to create tasks
  @@allow('create', auth() != null)
  
  // Allow users to update their own tasks only
  @@allow('update', auth() == author)
  
  // Allow users to delete their own tasks only
  @@allow('delete', auth() == author)
}
```

Then run:
```bash
pnpm zenstack
```

And restart the dev server.

---

## Task C: Build Category Filter UI

**Step 1: Update task-card.tsx to display category badge**

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from './delete-button';
import { toggleTaskComplete } from '../actions';
import { useTransition } from 'react';

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;  // Add this
    completed: boolean;
    createdAt: Date;
    author: {
      name: string;
      email: string;
    };
  };
};

// Category color mapping
const getCategoryColor = (category: string | null) => {
  if (!category) return 'default';
  
  const colors: Record<string, string> = {
    'Work': 'bg-blue-100 text-blue-800',
    'Personal': 'bg-green-100 text-green-800',
    'Shopping': 'bg-purple-100 text-purple-800',
    'Urgent': 'bg-red-100 text-red-800',
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTaskComplete(task.id);
    });
  };

  return (
    <Card className={task.completed ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggle}
              disabled={isPending}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className={task.completed ? 'line-through' : ''}>
                  {task.title}
                </CardTitle>
                {task.category && (
                  <Badge className={getCategoryColor(task.category)}>
                    {task.category}
                  </Badge>
                )}
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <DeleteButton taskId={task.id} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Created by {task.author.name} • {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Update task-form.tsx to include category input**

```typescript
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
  const [category, setCategory] = useState('');  // Add this

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
          category: category.trim() || undefined,  // Add this
        });
        setTitle('');
        setDescription('');
        setCategory('');  // Add this
      } catch (error) {
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

          {/* Add this section */}
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g., Work, Personal, Shopping..."
              disabled={isPending}
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
```

**Step 3: Update actions.ts to accept category**

```typescript
export async function createTask(data: { 
  title: string; 
  description?: string;
  category?: string;  // Add this
}) {
  const db = await getEnhancedDb();
  const user = await getCurrentUser();
  
  const task = await db.task.create({
    data: {
      ...data,
      authorId: user.id,
    },
  });
  
  revalidatePath('/my-tasks');
  return { success: true, task };
}
```

**Step 4: Add category filter (Advanced)**

Create a new component `task-list.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCard } from './task-card';

type Task = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  completed: boolean;
  createdAt: Date;
  author: {
    name: string;
    email: string;
  };
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = Array.from(
    new Set(tasks.map(task => task.category).filter(Boolean))
  ) as string[];
  
  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No tasks found.
          </p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </>
  );
}
```

Then update `page.tsx`:

```typescript
import { getEnhancedDb } from '@/lib/db';
import { TaskForm } from './components/task-form';
import { TaskList } from './components/task-list';

export default async function DashboardPage() {
  const db = await getEnhancedDb();
  const tasks = await db.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
      
      <TaskForm />
      
      <div className="mt-8">
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
```

---

## Evaluation Checklist

### Task A (Data Modeling)
- [ ] Added `category` field to Task model in `src/schema.zmodel`
- [ ] Field is optional (String?)
- [ ] Ran `pnpm zenstack`
- [ ] Ran `pnpm db:push`
- [ ] TypeScript types updated correctly

### Task B (Access Control)
- [ ] Removed `@@allow('all', true)` from `src/schema.zmodel`
- [ ] Added read access control
- [ ] Added create access control
- [ ] Added update access control
- [ ] Added delete access control
- [ ] Used `auth()` function correctly
- [ ] Used relationship comparison (`auth() == author`)
- [ ] Ran `pnpm zenstack`
- [ ] Tested that only Alice's tasks are visible

### Task C (UI Implementation)
- [ ] Category badge displayed on task cards
- [ ] Different colors for different categories
- [ ] Category input added to form
- [ ] Category filter dropdown implemented
- [ ] Filter shows "All Categories" option
- [ ] Filter shows existing categories
- [ ] Filtering works correctly
- [ ] UI is clean and functional

### Code Quality
- [ ] No TypeScript errors
- [ ] No use of `any` type
- [ ] Proper variable naming (3+ characters, descriptive)
- [ ] Good component structure
- [ ] Error handling present
- [ ] Code is readable and maintainable

### Bonus Points
- [ ] Implemented optimistic UI updates
- [ ] Added form validation with Zod
- [ ] Implemented debounced search
- [ ] Used URL search params for state
- [ ] Added public tasks feature

