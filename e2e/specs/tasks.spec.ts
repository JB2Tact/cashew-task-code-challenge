import { test, expect } from '../fixtures/auth';
import { test as baseTest } from '@playwright/test';

test.describe('Tasks Routes', () => {
  test.describe('/tasks - All Tasks Page', () => {
    test('should display all tasks from all users (broken state)', async ({ authenticatedPage: page }) => {
      // Navigate to all tasks page
      await page.goto('/tasks');

      // Should see the page title
      await expect(page.getByRole('heading', { name: 'All Tasks' })).toBeVisible();
      await expect(page.getByText('Browse tasks shared by the community')).toBeVisible();

      // In the broken state, should see tasks from multiple users
      // (This is intentional - will be fixed when intern adds isPublic field)
      const taskCards = page.locator('[class*="rounded"]').filter({ hasText: 'Created by' });
      const count = await taskCards.count();
      
      // Should have multiple tasks visible
      expect(count).toBeGreaterThan(0);
    });

    test('should show tasks from different authors', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');

      // Should see tasks from different users (broken security state)
      const pageContent = await page.textContent('body');
      
      // Verify we can see multiple authors (this is the bug)
      const hasMultipleAuthors = 
        pageContent?.includes('Created by Alice') ||
        pageContent?.includes('Created by Bob') ||
        pageContent?.includes('Created by Charlie') ||
        pageContent?.includes('Created by Diana');
      
      expect(hasMultipleAuthors).toBeTruthy();
    });

    test('should have View Details links for each task', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');

      // Should see "View Details" links
      const detailsLinks = page.getByText('View Details →');
      const count = await detailsLinks.count();
      
      expect(count).toBeGreaterThan(0);
    });

    test('should navigate to task detail when clicking View Details', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');

      // Click the first "View Details" link
      await page.getByText('View Details →').first().click();

      // Should navigate to a task detail page
      await expect(page).toHaveURL(/\/tasks\/.+/);
    });
  });

  test.describe('/tasks/[id] - Task Detail Page', () => {
    test('should display task details', async ({ authenticatedPage: page }) => {
      // Go to tasks page first
      await page.goto('/tasks');
      
      // Click on first task detail
      await page.getByText('View Details →').first().click();

      // Should see back button
      await expect(page.getByRole('button', { name: /Back to All Tasks/i })).toBeVisible();

      // Should see task content (title should be in a heading or prominent text)
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    });

    test('should show author information', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');
      await page.getByText('View Details →').first().click();

      // Should see "Created by" section with user info
      await expect(page.getByText(/Created by/i)).toBeVisible();
    });

    test('should show security warning for non-owned tasks (broken state)', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');
      
      // Find a task that's NOT owned by Alice (since we're logged in as Alice)
      const pageContent = await page.textContent('body');
      
      // If there are tasks from other users, click one
      if (pageContent?.includes('Created by Bob') || 
          pageContent?.includes('Created by Charlie') ||
          pageContent?.includes('Created by Diana')) {
        
        // Find all task cards that are NOT created by Alice
        const allCards = page.locator('[class*="border"]').filter({ hasText: 'Created by' });
        const cardCount = await allCards.count();
        
        let foundNonAliceTask = false;
        for (let i = 0; i < cardCount; i++) {
          const cardText = await allCards.nth(i).textContent();
          if (cardText && !cardText.includes('Created by Alice')) {
            // Click this card's detail link
            await allCards.nth(i).getByText('View Details →').click();
            foundNonAliceTask = true;
            break;
          }
        }

        if (foundNonAliceTask) {
          // Should see security warning (this indicates the broken state)
          await expect(page.getByText(/Security Issue/i)).toBeVisible();
          await expect(page.getByText(/You can see this task even though/i)).toBeVisible();
        }
      }
    });

    test('should show "Your Task" badge for owned tasks', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');
      
      // Look for Alice's task
      const aliceTask = page.locator('[class*="rounded"]').filter({ hasText: 'Created by Alice' }).first();
      await aliceTask.getByText('View Details →').click();

      // Should see "Your Task" badge
      await expect(page.getByText('Your Task')).toBeVisible();
    });

    test('should have "Edit in My Tasks" button for owned tasks', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');
      
      // Find and click on Alice's task
      const aliceTask = page.locator('[class*="rounded"]').filter({ hasText: 'Created by Alice' }).first();
      await aliceTask.getByText('View Details →').click();

      // Should see edit button
      await expect(page.getByRole('button', { name: /Edit in My Tasks/i })).toBeVisible();
    });

    test('should navigate back to tasks page', async ({ authenticatedPage: page }) => {
      await page.goto('/tasks');
      await page.getByText('View Details →').first().click();

      // Click back button
      await page.getByRole('button', { name: /Back to All Tasks/i }).click();

      // Should be back on tasks page
      await expect(page).toHaveURL('/tasks');
    });

    test('should show 404 for non-existent task', async ({ authenticatedPage: page }) => {
      // Try to access a task that doesn't exist
      const response = await page.goto('/tasks/non-existent-id-12345');

      // Should return 404 status
      expect(response?.status()).toBe(404);
    });
  });

  test.describe('Navigation', () => {
    test('should have navigation links in header', async ({ authenticatedPage: page }) => {
      // Should see both navigation links
      await expect(page.getByRole('link', { name: 'My Tasks' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'All Tasks' })).toBeVisible();
    });

    test('should navigate between My Tasks and All Tasks', async ({ authenticatedPage: page }) => {
      // Start on My Tasks
      await expect(page).toHaveURL('/my-tasks');

      // Click All Tasks
      await page.getByRole('link', { name: 'All Tasks' }).click();
      await expect(page).toHaveURL('/tasks');

      // Click My Tasks
      await page.getByRole('link', { name: 'My Tasks' }).click();
      await expect(page).toHaveURL('/my-tasks');
    });
  });

  test.describe('Unauthenticated Access', () => {
    test('should allow unauthenticated users to view /tasks page', async ({ page }) => {
      // Navigate to /tasks without logging in
      await page.goto('/tasks');

      // Should see the page title
      await expect(page.getByRole('heading', { name: 'All Tasks' })).toBeVisible();
      
      // Should see tasks (in broken state)
      await expect(page.getByText('Browse tasks shared by the community')).toBeVisible();
    });

    test('should allow unauthenticated users to view /tasks/[id] page', async ({ page }) => {
      // First get a task ID from the tasks page
      await page.goto('/tasks');
      
      // Click on first task detail
      const detailLink = page.getByText('View Details →').first();
      if (await detailLink.count() > 0) {
        await detailLink.click();

        // Should be able to view the task detail
        await expect(page.getByRole('button', { name: /Back to All Tasks/i })).toBeVisible();
        await expect(page.getByText(/Created by/i)).toBeVisible();
      }
    });

    test('should show Login link in header when not authenticated', async ({ page }) => {
      await page.goto('/tasks');

      // Should see Login link instead of user controls
      await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
      
      // Should NOT see My Tasks link
      await expect(page.getByRole('link', { name: 'My Tasks' })).not.toBeVisible();
      
      // Should still see All Tasks link
      await expect(page.getByRole('link', { name: 'All Tasks' })).toBeVisible();
    });

    test('should redirect to login when accessing /my-tasks without authentication', async ({ page }) => {
      // Try to access /my-tasks without logging in
      await page.goto('/my-tasks');

      // Should redirect to login page
      await expect(page).toHaveURL('/');
      await expect(page.getByText('Welcome to Task Manager')).toBeVisible();
    });
  });
});

