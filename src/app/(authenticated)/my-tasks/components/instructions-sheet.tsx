'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BookOpen, Clock, AlertCircle } from 'lucide-react';
import { TaskDetailModal } from './task-detail-modal';
import { ResetDatabaseDialog } from '@/components/reset-database-dialog';

export function InstructionsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          View Instructions
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-[1200px] overflow-y-auto p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Challenge Instructions</SheetTitle>
          <SheetDescription className="text-base mt-2">
            Complete these tasks to demonstrate your skills with Next.js 15, TypeScript, Tailwind CSS, and ZenStack
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Time Expectation */}
          <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">1-2 hours</span>
            <span className="text-muted-foreground">for core tasks</span>
          </div>

          {/* Current State Alert */}
          <div className="border-l-4 border-l-destructive bg-destructive/10 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-sm">Current State: Broken!</p>
                <p className="text-sm text-foreground/90">
                  Right now, you can see tasks from <strong>all users</strong> (Alice, Bob, Charlie, Diana). 
                  This is a security vulnerability that you&apos;ll fix in Task B.
                </p>
                <p className="text-xs text-muted-foreground">
                  Use the user switcher in the header to test different users and verify the bug.
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Build */}
          <div className="space-y-3">
            <h3 className="font-semibold">What You&apos;ll Build</h3>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Add a <strong>category field</strong> to organize tasks (Work, Personal, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Implement <strong>access control</strong> so users only see their own tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Build <strong>category badges</strong> and <strong>filtering UI</strong> for the dashboard</span>
              </li>
            </ul>
          </div>

          {/* Tasks Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Tasks to Complete</h3>
            <p className="text-xs text-muted-foreground">Click each card for detailed step-by-step instructions</p>
            
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
          </div>

          {/* Quick Commands */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Commands</h3>
            <div className="space-y-2">
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
            </div>
          </div>

          {/* Success Criteria */}
          <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm">How to Know You&apos;re Done</h3>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Tasks have a category field in the database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Each user only sees their own tasks (test with user switcher)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Categories display as colored badges on task cards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Users can filter tasks by category</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Task creation form includes category selection</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Resources</h3>
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
          </div>

          {/* Reset Database */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="font-semibold text-sm">Need to Start Over?</h3>
            <p className="text-xs text-muted-foreground">
              Reset the database to restore all seed data and test your access control implementation.
            </p>
            <ResetDatabaseDialog />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

