import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ context }) => {
    // Clear all cookies before each test to ensure logged out state
    await context.clearCookies();
  });

  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/');

    // Should see login page
    await expect(page.getByText('Welcome to Task Manager')).toBeVisible();
    await expect(page.getByText('Select a user to continue')).toBeVisible();

    // Should see all user options
    await expect(page.getByRole('button', { name: /Alice/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Bob/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Charlie/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Diana/i })).toBeVisible();
  });

  test('should redirect to dashboard after login', async ({ page }) => {
    await page.goto('/');

    // Click on Alice to login
    await page.getByRole('button', { name: /Alice/i }).click();

    // Should redirect to my-tasks
    await expect(page).toHaveURL('/my-tasks');

    // Should see my-tasks content with user greeting
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Alice');
  });

  test('should login as different users', async ({ page }) => {
    // Login as Bob
    await page.goto('/');
    await page.getByRole('button', { name: /Bob/i }).click();
    await expect(page).toHaveURL('/my-tasks');
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Bob');

    // Logout
    await page.getByRole('button', { name: /Logout/i }).click();
    await expect(page).toHaveURL('/');

    // Login as Charlie
    await page.getByRole('button', { name: /Charlie/i }).click();
    await expect(page).toHaveURL('/my-tasks');
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Charlie');

    // Logout
    await page.getByRole('button', { name: /Logout/i }).click();
    await expect(page).toHaveURL('/');

    // Login as Diana
    await page.getByRole('button', { name: /Diana/i }).click();
    await expect(page).toHaveURL('/my-tasks');
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Diana');
  });

  test('should logout and return to login page', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByRole('button', { name: /Alice/i }).click();
    await expect(page).toHaveURL('/my-tasks');

    // Should see logout button in header
    const logoutButton = page.getByRole('button', { name: /Logout/i });
    await expect(logoutButton).toBeVisible();

    // Click logout
    await logoutButton.click();

    // Should redirect to login page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome to Task Manager')).toBeVisible();
  });

  test('should not access my-tasks when logged out', async ({ page }) => {
    // Try to directly access my-tasks without logging in
    await page.goto('/my-tasks');

    // Should redirect to login page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome to Task Manager')).toBeVisible();
  });

  test('should persist authentication across page refreshes', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.getByRole('button', { name: /Alice/i }).click();
    await expect(page).toHaveURL('/my-tasks');
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Alice');

    // Refresh the page
    await page.reload();

    // Should still be authenticated
    await expect(page).toHaveURL('/my-tasks');
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Alice');
  });

  test('should redirect to my-tasks when visiting home page while authenticated', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.getByRole('button', { name: /Bob/i }).click();
    await expect(page).toHaveURL('/my-tasks');

    // Try to go back to home page
    await page.goto('/');

    // Should redirect to my-tasks
    await expect(page).toHaveURL('/my-tasks');
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Bob');
  });

  test('should show user-specific header controls when authenticated', async ({ page }) => {
    // Start logged out
    await page.goto('/');
    
    // Header should not show user controls
    await expect(page.getByRole('button', { name: /Logout/i })).not.toBeVisible();

    // Login
    await page.getByRole('button', { name: /Alice/i }).click();
    await expect(page).toHaveURL('/my-tasks');

    // Header should show user switcher and logout button
    await expect(page.getByRole('button', { name: /Logout/i })).toBeVisible();
    // User switcher should show current user
    await expect(page.locator('button').filter({ hasText: 'Alice' })).toBeVisible();
  });

  test('should handle rapid login/logout cycles', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      // Login
      await page.goto('/');
      await page.getByRole('button', { name: /Alice/i }).click();
      await expect(page).toHaveURL('/my-tasks');
      await expect(page.getByTestId('user-greeting')).toContainText('Hello, Alice');

      // Logout
      await page.getByRole('button', { name: /Logout/i }).click();
      await expect(page).toHaveURL('/');
      await expect(page.getByText('Welcome to Task Manager')).toBeVisible();
    }
  });

  test('should show user avatar and email on login page', async ({ page }) => {
    await page.goto('/');

    // Check that each user button shows name and email
    const aliceButton = page.getByRole('button', { name: /Alice/i });
    await expect(aliceButton).toContainText('alice@example.com');
    
    const bobButton = page.getByRole('button', { name: /Bob/i });
    await expect(bobButton).toContainText('bob@example.com');

    const charlieButton = page.getByRole('button', { name: /Charlie/i });
    await expect(charlieButton).toContainText('charlie@example.com');

    const dianaButton = page.getByRole('button', { name: /Diana/i });
    await expect(dianaButton).toContainText('diana@example.com');
  });

  test('should maintain authentication after navigation', async ({ page }) => {
    // Login as Alice
    await page.goto('/');
    await page.getByRole('button', { name: /Alice/i }).click();
    await expect(page).toHaveURL('/my-tasks');

    // Navigate using browser back
    await page.goBack();
    
    // Should redirect to my-tasks (authenticated)
    await expect(page).toHaveURL('/my-tasks');

    // Navigate using browser forward
    await page.goForward();
    await expect(page).toHaveURL('/my-tasks');
  });

  test('should prevent unauthorized task creation when not logged in', async ({ page }) => {
    // Try to access my-tasks directly (will redirect to login)
    await page.goto('/my-tasks');
    await expect(page).toHaveURL('/');

    // Verify we cannot create tasks
    await expect(page.getByRole('button', { name: /New Task/i })).not.toBeVisible();
  });
});

