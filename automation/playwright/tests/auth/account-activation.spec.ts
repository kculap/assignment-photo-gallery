import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';

test.describe('Auth - Account Activation', () => {

  // 1. Activation page loads — NOT POSSIBLE (page shows nothing for fake tokens)
  test.fixme('Activation page loads correctly (requires real activation token)', async ({ page }) => {
    await page.goto(`${BASE_URL}/accountActivation/sometoken`);
  });

  // 2. Full registration + activation flow — requires email API
  test.fixme('Full registration + activation flow (requires email API)', async ({ page }) => {
    // Cannot fetch activation email without Mailinator API
  });

  // 3. Invalid token shows error — NOT POSSIBLE (Baasic shows no error)
  test.fixme('Invalid token shows error message (Baasic does not display any error)', async ({ page }) => {
    await page.goto(`${BASE_URL}/accountActivation/INVALIDTOKEN123`);
  });

  // 4. Already activated token — requires real token
  test.fixme('Already activated token shows error on second attempt', async ({ page }) => {
    // Cannot test without real token from email
  });

});
