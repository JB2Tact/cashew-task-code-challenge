'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { TASK_CATEGORIES } from '@/lib/categories';

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  // category?: string | null; // TODO: Uncomment after Task A
};

type EditTaskDialogProps = {
  task: Task;
};

/**
 * EditTaskDialog Component
 * 
 * INCOMPLETE - This component is a starting point for the intern to complete.
 * 
 * TODO (Task A): After adding the `category` field to the Task model:
 * 1. Uncomment the `category` field in the Task type above
 * 2. Add category to the initial state
 * 3. Create/update the server action to handle category updates
 * 4. Wire up the form submission to save the category
 * 
 * TODO (Stretch Goal): Add form validation using Zod
 * TODO (Stretch Goal): Add optimistic UI updates
 */
export function EditTaskDialog({ task }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [category, setCategory] = useState<string>(''); // TODO: Initialize from task.category

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // TODO: Call server action to update the task
    // Example:
    // await updateTask({
    //   id: task.id,
    //   title,
    //   description,
    //   category,
    // });
    
    console.log('TODO: Implement task update with category:', {
      id: task.id,
      title,
      description,
      category,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category
                <span className="text-xs text-muted-foreground ml-2">
                  (TODO: Wire up to server action)
                </span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

