'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { deleteTask } from '../actions';
import { toast } from 'sonner';

type DeleteButtonProps = {
  taskId: string;
  taskTitle: string;
  authorName: string;
};

export function DeleteButton({ taskId, taskTitle, authorName }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTask(taskId);
        setOpen(false);
        toast.success(`Task deleted: ${taskTitle}`, {
          closeButton: true,
        });
      } catch {
        toast.error(`Failed to delete: ${taskTitle}`, {
          closeButton: true,
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete task</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 p-3 bg-muted rounded-md">
          <div className="font-medium text-foreground">{taskTitle}</div>
          <div className="text-sm text-muted-foreground mt-1">Created by {authorName}</div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

