'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { TaskDetailModal } from './task-detail-modal';

export function ChallengeSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="absolute -right-3 top-4 z-10 h-8 w-8 rounded-full p-0 shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Card className="h-full">
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium [writing-mode:vertical-lr] rotate-180">
                Instructions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCollapsed(true)}
        className="absolute -right-3 top-4 z-10 h-8 w-8 rounded-full p-0 shadow-md"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Overview Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Challenge Instructions</CardTitle>
          </div>
          <CardDescription>
            Complete these tasks to demonstrate your skills with Next.js 15, TypeScript, Tailwind CSS, and ZenStack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">1-2 hours</span>
            <span className="text-muted-foreground">for core tasks</span>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tasks to Complete</CardTitle>
          <CardDescription className="text-xs">
            Click each card to view detailed instructions and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <TaskDetailModal
            taskId="A"
            title="Data Modeling"
            duration="15-20 min"
            description="Add a category field to the Task model to enable task categorization."
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                  <li>Open <code className="bg-muted px-1.5 py-0.5 rounded text-xs">src/schema.zmodel</code></li>
                  <li>Add an optional <code className="bg-muted px-1.5 py-0.5 rounded text-xs">category</code> field to the Task model</li>
                  <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs">pnpm zenstack</code> to regenerate types</li>
                  <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs">pnpm db:push</code> to update the database</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Expected Solution:</h4>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`model Task {
  // ... existing fields
  category    String?  // Add this line
  // ... rest of model
}`}
                </pre>
              </div>
            </div>
          </TaskDetailModal>

          <TaskDetailModal
            taskId="B"
            title="Access Control"
            duration="30-40 min"
            description="Fix the security vulnerability by implementing ZenStack access policies."
          >
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm font-medium text-destructive mb-1">🚨 Security Bug</p>
                <p className="text-sm text-foreground/90">
                  Currently, all users can see and delete all tasks!
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="space-y-2 text-sm text-foreground/90">
                  <li>• Users can only <strong>read</strong> tasks they created</li>
                  <li>• Users can only <strong>delete</strong> tasks they created</li>
                  <li>• Users can only <strong>update</strong> tasks they created</li>
                  <li>• Users can <strong>create</strong> tasks (but only for themselves)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Hints:</h4>
                <ul className="space-y-2 text-sm text-foreground/90">
                  <li>• Use <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@@allow()</code> rules in the Task model</li>
                  <li>• The <code className="bg-muted px-1.5 py-0.5 rounded text-xs">auth()</code> function gives you the current user</li>
                  <li>• Reference relationships: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">auth() == author</code></li>
                  <li>• Remove the broken <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@@allow(&apos;all&apos;, true)</code> rule</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Testing:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                  <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs">pnpm zenstack</code></li>
                  <li>Restart your dev server</li>
                  <li>Use the user switcher to test different users</li>
                  <li>Each user should only see their own tasks</li>
                </ol>
              </div>
            </div>
          </TaskDetailModal>

          <TaskDetailModal
            taskId="C"
            title="UI Implementation"
            duration="30-40 min"
            description="Add category display and filtering functionality to the dashboard."
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                  <li>Display category as a colored badge on each task card</li>
                  <li>Add a dropdown filter to filter by category</li>
                  <li>Update the task form to include a category field</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Hints:</h4>
                <ul className="space-y-2 text-sm text-foreground/90">
                  <li>• Use the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Badge</code> component from Shadcn UI</li>
                  <li>• Use the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Select</code> component for filtering</li>
                  <li>• Consider using React state for the filter</li>
                </ul>
              </div>
            </div>
          </TaskDetailModal>
        </CardContent>
      </Card>

      {/* Quick Commands Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="bg-muted p-2 rounded text-xs font-mono">
            <div className="text-muted-foreground mb-1"># Regenerate schema</div>
            <div>pnpm zenstack</div>
          </div>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            <div className="text-muted-foreground mb-1"># Update database</div>
            <div>pnpm db:push</div>
          </div>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            <div className="text-muted-foreground mb-1"># Reset data</div>
            <div>pnpm db:seed</div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://zenstack.dev/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                ZenStack Docs →
              </a>
            </li>
            <li>
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Next.js Docs →
              </a>
            </li>
            <li>
              <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Shadcn UI →
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

