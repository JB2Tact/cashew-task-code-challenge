/**
 * Task Categories
 * 
 * Available categories for organizing tasks and helper functions.
 */

export const TASK_CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Learning',
  'Other',
] as const;

export type TaskCategory = typeof TASK_CATEGORIES[number];

/**
 * Helper function to check if a string is a valid category
 */
export function isValidCategory(value: string): value is TaskCategory {
  return TASK_CATEGORIES.includes(value as TaskCategory);
}

/**
 * Get a color class for a category badge
 * You can customize these colors as needed
 */
export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    'Work': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Personal': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Shopping': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Health': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Learning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'UNKNOWN': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  
  return colorMap[category] || colorMap['Other'];
}

