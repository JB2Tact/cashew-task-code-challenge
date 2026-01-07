import { test, expect } from '../fixtures/auth';

test.describe('My Tasks Page', () => {
  test('my-tasks page loads successfully', async ({ authenticatedPage: page }) => {
    // Page is already on /my-tasks via authenticatedPage fixture

    // Verify the page loads without errors by checking for the user greeting
    await expect(page.getByTestId('user-greeting')).toBeVisible();
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Alice');

    // Verify the page doesn't have any error states
    await expect(page.locator('body')).not.toContainText('404');
    await expect(page.locator('body')).not.toContainText('500');
  });
});

