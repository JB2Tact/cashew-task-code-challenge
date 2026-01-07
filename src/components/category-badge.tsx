import { Badge } from './ui/badge';
import { getCategoryColor } from '@/lib/categories';

type CategoryBadgeProps = {
  category?: string | null;
};

/**
 * CategoryBadge Component
 * 
 * TODO (Task C): Pass the task's category to this component.
 * Currently showing "UNKNOWN" because no category prop is being passed.
 * Color logic is already implemented via getCategoryColor().
 */
export function CategoryBadge({ category }: CategoryBadgeProps) {
  const displayCategory = category || 'UNKNOWN';
  const colorClass = getCategoryColor(displayCategory);
  
  return (
    <Badge 
      variant="secondary" 
      className={`${colorClass} text-xs font-medium`}
    >
      {displayCategory}
    </Badge>
  );
}

