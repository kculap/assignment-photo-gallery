import { Page, expect } from '@playwright/test';
import { BASE_URL, TEST_USER } from './test-data';

export async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  const userInput = page.locator('input[formcontrolname="username"]');
  const passInput = page.locator('input[formcontrolname="password"]');

  await userInput.click();
  await userInput.fill(TEST_USER.email);  

  await passInput.click();
  await passInput.fill(TEST_USER.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/profile\//);
}

export async function logout(page: Page) {
  await page.goto(`${BASE_URL}/logout`);
  await expect(page).toHaveURL(/login/);
}
