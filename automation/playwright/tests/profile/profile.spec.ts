import { test, expect } from '@playwright/test';
import { BASE_URL, TEST_USER } from '../../helpers/test-data';

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.locator('input[formcontrolname="username"]').fill(TEST_USER.username);
  await page.locator('input[formcontrolname="password"]').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/profile/);
}

test.describe('Profile Page', () => {

  test('Profile loads with username and count', async ({ page }) => {
    await login(page);
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('span:has-text("albums")')).toBeVisible();
  });

  test('Empty profile shows 0 albums', async ({ page }) => {
    await login(page);
    await expect(page.locator('span:has-text("0 albums")')).toBeVisible();
  });

  test('CREATE ALBUM button navigates', async ({ page }) => {
    await login(page);
    await page.locator('button:has-text("Create Album")').click({ force: true });
    await expect(page).toHaveURL(/album\/create/);
  });

});
