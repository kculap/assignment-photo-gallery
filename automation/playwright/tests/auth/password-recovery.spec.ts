import { test, expect } from '@playwright/test';
import { BASE_URL, TEST_USER } from '../../helpers/test-data';

const SELECTORS = {
  email: 'input[formcontrolname="email"]',
  recoverBtn: 'button[type="submit"]',
};

// Non-existing email must NOT contain "+" because Baasic treats it as invalid format
function uniqueEmail() {
  return `nonexisting${Date.now()}@mailinator.com`;
}

test.describe('Auth - Password Recovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/passwordRecovery`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form[name="passwordRecoveryForm"]');
  });

  // 1. Page loads correctly
  test('Page loads correctly', async ({ page }) => {
    await expect(
      page.locator('svg.align--h--center.display--b.spc--top--xlrg')
    ).toBeVisible();

    await expect(page.locator('h2:has-text("Password Recovery")')).toBeVisible();
    await expect(page.locator(SELECTORS.email)).toBeVisible();
    await expect(page.locator(SELECTORS.recoverBtn)).toBeVisible();
  });

  // 2. Recover button state
  test('RECOVER PASSWORD button state', async ({ page }) => {
    await expect(page.locator(SELECTORS.recoverBtn)).toBeDisabled();

    await page.locator(SELECTORS.email).fill('test@mail.com');

    await expect(page.locator(SELECTORS.recoverBtn)).toBeEnabled();
  });

  // 3. Valid email shows confirmation
  test('Valid email shows confirmation', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(TEST_USER.email);
    await page.locator(SELECTORS.recoverBtn).click();

    await expect(
      page.locator('p:has-text("Please check your email in order to finish password recovery process.")')
    ).toBeVisible();
  });

  // 4. Non-existing email shows error
  test('Non-existing email shows error', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(uniqueEmail());
    await page.locator(SELECTORS.recoverBtn).click();

    await expect(
      page.locator('p:has-text("Unknown user.")')
    ).toBeVisible();
  });

  // 5. BUG‑011: Invalid email format wrong error
  test('BUG-011: Invalid email format shows wrong error', async ({ page }) => {
    await page.locator(SELECTORS.email).fill('test@test');
    await page.locator(SELECTORS.recoverBtn).click();

    // WRONG behavior: app shows "Unknown user."
    await expect(
      page.locator('p:has-text("Unknown user.")')
    ).toBeVisible();

    // Correct error should NOT appear
    await expect(
      page.locator('.alert.alert--warning:has-text("Please enter the correct email address")')
    ).not.toBeVisible();
  });

  // 6. Empty email validation
  test('Empty email validation', async ({ page }) => {
    // Trigger Angular validation properly
    await page.locator(SELECTORS.email).fill('a');
    await page.locator(SELECTORS.email).fill('');
    await page.locator(SELECTORS.email).blur();

    await expect(
      page.locator('.alert.alert--warning:has-text("Please enter the correct email address")')
    ).toBeVisible();

    await expect(page.locator(SELECTORS.recoverBtn)).toBeDisabled();
  });

  // 7. Navigation from login
  test('Navigation from login page works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  
    // Click the routerlink directly (most stable)
    await page.locator('a[routerlink="/passwordRecovery"]').click();
  
    await expect(page).toHaveURL(/\/passwordRecovery/);
    await expect(page.locator('h2:has-text("Password Recovery")')).toBeVisible();
  });
  
  

  
});
