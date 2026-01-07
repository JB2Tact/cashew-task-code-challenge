import { test as base, type Page } from '@playwright/test';
import type { MockUserKey } from '@/lib/auth';

type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Extended test fixture that provides authentication helpers
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Automatically logs in as Alice before each test
   */
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/');
    
    // Login as Alice (default user for most tests)
    await page.getByRole('button', { name: /Alice/i }).click();
    
    // Wait for redirect to my-tasks
    await page.waitForURL('/my-tasks');
    
    // Use the authenticated page
    await use(page);
  },
});

/**
 * Helper function to login as a specific user
 */
export async function loginAs(page: any, userKey: MockUserKey) {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(userKey, 'i') }).click();
  await page.waitForURL('/my-tasks');
}

export { expect } from '@playwright/test';

