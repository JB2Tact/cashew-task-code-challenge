import { ResetDatabaseDialog } from './reset-database-dialog';
import { InstructionsSheet } from '@/app/(authenticated)/my-tasks/components/instructions-sheet';

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-50 border-t mt-auto bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Task Manager Challenge • Built with Next.js & ZenStack
        </div>
        <div className="flex items-center gap-2">
          <InstructionsSheet />
          <ResetDatabaseDialog />
        </div>
      </div>
    </footer>
  );
}

