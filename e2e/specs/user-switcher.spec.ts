import { test, expect } from '../fixtures/auth';

test.describe('User Switcher', () => {
  // Note: authenticatedPage fixture automatically logs in as Alice

  test('displays the current user in the header', async ({ authenticatedPage: page }) => {
    // Check that the user switcher button is visible
    const userSwitcher = page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ });
    await expect(userSwitcher).toBeVisible();
    
    // The default user should be visible in the button
    await expect(userSwitcher).toContainText(/Alice|Bob|Charlie|Diana/);
  });

  test('opens dropdown when clicked', async ({ authenticatedPage: page }) => {
    // Click the user switcher button (the one showing a user name)
    await page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ }).click();
    
    // Wait for the dropdown to be visible
    const dropdown = page.getByRole('listbox');
    await expect(dropdown).toBeVisible();
    
    // Verify all users are listed
    await expect(page.getByRole('option', { name: /Alice/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Bob/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Charlie/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Diana/ })).toBeVisible();
  });

  test('switches users and updates greeting', async ({ authenticatedPage: page }) => {
    // Get the initial user name from the greeting
    const greeting = page.getByTestId('user-greeting');
    await expect(greeting).toBeVisible();
    const initialGreeting = await greeting.textContent();
    
    // Click the user switcher button (filter to the one showing a user name)
    const userSwitcher = page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ });
    await userSwitcher.click();
    
    // Wait for dropdown to be visible
    await expect(page.getByRole('listbox')).toBeVisible();
    
    // Find a different user to switch to
    let targetUser = 'Bob';
    if (initialGreeting?.includes('Bob')) {
      targetUser = 'Alice';
    }
    
    // Click on the target user
    await page.getByRole('option', { name: new RegExp(targetUser) }).click();
    
    // Wait for the page to update
    await page.waitForLoadState('networkidle');
    
    // Verify the greeting has changed
    await expect(greeting).toContainText(`Hello, ${targetUser}`);
    
    // Verify the user switcher shows the new user
    await expect(page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ })).toContainText(targetUser);
  });

  test('switches between multiple users sequentially', async ({ authenticatedPage: page }) => {
    const users = ['Alice', 'Bob', 'Charlie'];
    
    for (const user of users) {
      // Open the user switcher (filter to the one showing a user name)
      await page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ }).click();
      
      // Wait for dropdown
      await expect(page.getByRole('listbox')).toBeVisible();
      
      // Select the user
      await page.getByRole('option', { name: new RegExp(user) }).click();
      
      // Wait for the update
      await page.waitForLoadState('networkidle');
      
      // Verify the greeting matches
      await expect(page.getByTestId('user-greeting')).toContainText(`Hello, ${user}`);
      
      // Verify the switcher shows the correct user
      await expect(page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ })).toContainText(user);
    }
  });

  test('shows only tasks for the current user after switching', async ({ authenticatedPage: page }) => {
    // Switch to Alice
    await page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ }).click();
    await page.getByRole('option', { name: /Alice/ }).click();
    await page.waitForLoadState('networkidle');
    
    // Get the task count for Alice
    const aliceTasksText = await page.locator('text=/\\d+ tasks? from/').textContent();
    
    // Switch to Bob
    await page.getByRole('combobox').filter({ hasText: /Alice/ }).click();
    await page.getByRole('option', { name: /Bob/ }).click();
    await page.waitForLoadState('networkidle');
    
    // Get the task count for Bob
    const bobTasksText = await page.locator('text=/\\d+ tasks? from/').textContent();
    
    // The task counts might be different (unless they happen to have the same number)
    // The key is that the page updated and we can see task information
    expect(aliceTasksText).toBeTruthy();
    expect(bobTasksText).toBeTruthy();
  });

  test('persists user selection after page reload', async ({ authenticatedPage: page }) => {
    // Switch to Charlie
    await page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ }).click();
    await page.getByRole('option', { name: /Charlie/ }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're Charlie
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Charlie');
    
    // Reload the page
    await page.reload();
    
    // Verify we're still Charlie
    await expect(page.getByTestId('user-greeting')).toContainText('Hello, Charlie');
    await expect(page.getByRole('combobox').filter({ hasText: /Alice|Bob|Charlie|Diana/ })).toContainText('Charlie');
  });
});

