'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronRight, FileText } from 'lucide-react';

type TaskDetailProps = {
  taskId: 'A' | 'B' | 'C';
  title: string;
  duration: string;
  description: string;
  children: React.ReactNode;
};

export function TaskDetailModal({ taskId, title, duration, description, children }: TaskDetailProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-xs">
                  Task {taskId}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {duration}
                </Badge>
              </div>
              <div className="font-semibold text-sm">{title}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono">Task {taskId}</Badge>
            <Badge variant="secondary" className="text-xs">{duration}</Badge>
          </div>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

