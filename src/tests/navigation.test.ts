
import { expect, test } from '@playwright/test';

test('navigation works properly', async ({ page }) => {
  // Start from the home page
  await page.goto('/');
  
  // Check if the page contains Missões
  await expect(page.getByTestId('quests-tab')).toBeVisible();
  
  // Navigate to Character page
  await page.getByTestId('character-tab').click();
  await expect(page.url()).toContain('/character');
  
  // Navigate to Inventory page
  await page.getByTestId('inventory-tab').click();
  await expect(page.url()).toContain('/inventory');
  
  // Navigate back to home
  await page.getByTestId('quests-tab').click();
  await expect(page.url()).toEqual(expect.stringContaining('/'));
});
