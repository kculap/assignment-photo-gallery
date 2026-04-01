import { test, expect, Page } from '@playwright/test';
import { BASE_URL, TEST_USER } from '../../helpers/test-data';
import { logout } from '../../helpers/auth.helper';

const SELECTORS = {
  email: 'input[formcontrolname="email"]',
  userName: 'input[formcontrolname="userName"]',
  password: 'input[formcontrolname="password"]',
  confirmPassword: 'input[formcontrolname="confirmPassword"]',
  registerBtn: 'button[type="submit"]',
};

function uniqueEmail() {
  return `test.user+${Date.now()}@mailinator.com`;
}

test.describe('Auth - Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form[name="registrationForm"]');
  });

  // 1. Register page loads
  test('Register page loads', async ({ page }) => {
    await expect(
      page.locator('svg.align--h--center.display--b.spc--top--xlrg')
    ).toBeVisible();

    await expect(page.locator('h2:has-text("Register")')).toBeVisible();
    await expect(page.locator(SELECTORS.email)).toBeVisible();
    await expect(page.locator(SELECTORS.userName)).toBeVisible();
    await expect(page.locator(SELECTORS.password)).toBeVisible();
    await expect(page.locator(SELECTORS.confirmPassword)).toBeVisible();
    await expect(page.locator(SELECTORS.registerBtn)).toBeVisible();
  });

  // 2. REGISTER button disabled initially
  test('REGISTER button disabled initially', async ({ page }) => {
    await expect(page.locator(SELECTORS.registerBtn)).toBeDisabled();
  });

  // 3. Successful registration
  test('Successful registration', async ({ page }) => {
    const email = uniqueEmail();
    const userName = `reguser${Date.now()}`;

    await page.locator(SELECTORS.email).fill(email);
    await page.locator(SELECTORS.userName).fill(userName);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill(TEST_USER.password);

    await page.locator(SELECTORS.registerBtn).click();

    await expect(
      page.locator('p:has-text("You have successfully registered")')
    ).toBeVisible({ timeout: 5000 });
  });

  // 4. Invalid email format
  test('Invalid email format shows validation error', async ({ page }) => {
    await page.locator(SELECTORS.email).fill('test@test');
    await page.locator(SELECTORS.userName).fill(`user${Date.now()}`);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill(TEST_USER.password);

    await page.locator(SELECTORS.email).blur();

    await expect(
      page.locator('.alert.alert--warning:has-text("Please enter the correct email address!")')
    ).toBeVisible();
  });

  // 5. Duplicate email
  test('Duplicate email does not register user', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(TEST_USER.email);
    await page.locator(SELECTORS.userName).fill(`dup${Date.now()}`);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill(TEST_USER.password);

    await page.locator(SELECTORS.registerBtn).click();

    await expect(
      page.locator('p:has-text("You have successfully registered")')
    ).not.toBeVisible();
  });

  // 6. Duplicate username
  test('Duplicate username shows error', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(uniqueEmail());
    await page.locator(SELECTORS.userName).fill(TEST_USER.username);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill(TEST_USER.password);

    await page.locator(SELECTORS.registerBtn).click();

    await expect(page.locator('p:has-text("Username taken!")')).toBeVisible();
  });

  // 7. Mismatched passwords
  test('Mismatched passwords show error', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(uniqueEmail());
    await page.locator(SELECTORS.userName).fill(`user${Date.now()}`);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill('different');

    await page.locator(SELECTORS.registerBtn).click();

    await expect(
      page.locator('.alert.alert--warning:has-text("Passwords do not match")')
    ).toBeVisible();
  });

  // 8. Empty fields
  test('Empty fields keep REGISTER button disabled', async ({ page }) => {
    await expect(page.locator(SELECTORS.registerBtn)).toBeDisabled();
  });

  // 9. BUG-012 regression
  test('Confirm Password clicked first does not freeze form', async ({ page }) => {
    await page.locator(SELECTORS.confirmPassword).click();

    await expect(
      page.locator('.alert.alert--warning:has-text("Confirm Password is required.")')
    ).toBeVisible();

    await page.locator(SELECTORS.email).fill(uniqueEmail());
    await page.locator(SELECTORS.userName).fill(`bug012${Date.now()}`);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill(TEST_USER.password);

    await expect(page.locator(SELECTORS.registerBtn)).toBeEnabled();
  });

  // 10. Whitespace username
  test('Whitespace username is (incorrectly) accepted as valid username', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(uniqueEmail());
    await page.locator(SELECTORS.userName).fill('   ');
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.confirmPassword).fill(TEST_USER.password);

    await expect(page.locator(SELECTORS.registerBtn)).toBeEnabled();
  });

  // 11. Enter key does not navigate away
  test('Pressing Enter in email field does not navigate away', async ({ page }) => {
    await page.locator(SELECTORS.email).fill(uniqueEmail());
    await page.locator(SELECTORS.email).press('Enter');

    await expect(page).toHaveURL(/\/register/);
  });

  // 12. Authenticated user visiting /register stays on register page
  test('Authenticated user visiting /register stays on register page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[formcontrolname="username"]').fill(TEST_USER.email);
    await page.locator('input[formcontrolname="password"]').fill(TEST_USER.password);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/profile|main/);

    await page.goto(`${BASE_URL}/register`);
    await page.waitForURL(/\/register/);

    await expect(page).toHaveURL(/\/register/);

    // OPEN MENU BEFORE LOGOUT
    await page.locator('.menu__title').click();

    await logout(page);
  });
});
