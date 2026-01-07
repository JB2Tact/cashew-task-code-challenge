import { CreateTaskDialog } from './create-task-dialog';

type TaskListHeaderProps = {
  taskCount: number;
  userCount: number;
};

export function TaskListHeader({ taskCount, userCount }: TaskListHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {taskCount === 0 
            ? 'No tasks yet' 
            : `${taskCount} ${taskCount === 1 ? 'task' : 'tasks'} from ${userCount} ${userCount === 1 ? 'user' : 'users'}`
          }
        </p>
      </div>
      <div className="shrink-0">
        <CreateTaskDialog />
      </div>
    </div>
  );
}


