import { test, expect, Page } from '@playwright/test';
import { BASE_URL, TEST_USER } from '../../helpers/test-data';
import { logout } from '../../helpers/auth.helper';

const SELECTORS = {
  username: 'input[formcontrolname="username"]',
  password: 'input[formcontrolname="password"]',
  submit: 'button[type="submit"]',

  invalidLoginError: 'span.alert.alert--warning:has-text("Invalid email, username or password")',
  bothRequired: 'span.alert.alert--warning:has-text("Username and password required.")',

  forgotPassword: 'a[href*="passwordRecovery"]',
  socialFacebook: '.btn--social--facebook',
  socialLoginError: 'p.alert.alert--warning',

  // Authenticated menu items (INSIDE overlay)
  authProfile: '.nav__content .nav__link:has-text("Profile")',
  authCreateAlbum: '.nav__content .nav__link:has-text("Create Album")',
  authLogout: '.nav__content .nav__link:has-text("Log out")',
};

// 🔥 MINI openMenu() — radi bez helpera
async function openMenu(page: Page) {
  await page.locator('.menu__brand').hover();
  await page.locator('.menu__title').click();
  await page.locator('.nav__content .nav__link').first().waitFor({ state: 'visible' });
}

async function submitLogin(page: Page) {
  await page.locator(SELECTORS.submit).click();
}

async function waitForLogin(page: Page) {
  for (let i = 0; i < 20; i++) {
    if (page.url().includes('/profile/')) return true;
    await page.waitForTimeout(500);
  }
  return false;
}

test.describe('Auth - Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  });

  // 1. Login page loads
  test('Login page loads', async ({ page }) => {
    await expect(page.locator(SELECTORS.username)).toBeVisible();
    await expect(page.locator(SELECTORS.password)).toBeVisible();
    await expect(page.locator(SELECTORS.submit)).toBeVisible();
    await expect(page.locator(SELECTORS.forgotPassword)).toBeVisible();
    await expect(page.locator(SELECTORS.socialFacebook)).toBeVisible();
  });

  // 2. Successful login
  test('Successful login', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.email);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.password).blur();

    await submitLogin(page);
    expect(await waitForLogin(page)).toBeTruthy();

    // 🔥 OTVORI MENI (jer je skriven)
    await openMenu(page);

    await expect(page.locator(SELECTORS.authProfile)).toBeVisible();
    await expect(page.locator(SELECTORS.authCreateAlbum)).toBeVisible();
    await expect(page.locator(SELECTORS.authLogout)).toBeVisible();

    await logout(page);
  });

  // 3. Wrong password
  test('Wrong password', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.email);
    await page.locator(SELECTORS.password).fill('wrong-password');
    await page.locator(SELECTORS.password).blur();
    await submitLogin(page);

    await expect(page.locator(SELECTORS.invalidLoginError)).toBeVisible();
  });

  // 4. Non-existing username
  test('Non-existing username', async ({ page }) => {
    await page.locator(SELECTORS.username).fill('nonexistinguser123');
    await page.locator(SELECTORS.password).fill('wrong-password');
    await page.locator(SELECTORS.password).blur();
    await submitLogin(page);

    await expect(page.locator(SELECTORS.invalidLoginError)).toBeVisible();
  });

  // 5. Empty username
  test('Empty username', async ({ page }) => {
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.password).blur();
    await submitLogin(page);

    await expect(page.locator(SELECTORS.bothRequired)).toBeVisible();
  });

  // 6. Empty password
  test('Empty password', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.email);
    await page.locator(SELECTORS.username).blur();
    await submitLogin(page);

    await expect(page.locator(SELECTORS.bothRequired)).toBeVisible();
  });

  // 7. Both fields empty
  test('Both fields empty', async ({ page }) => {
    await submitLogin(page);
    await expect(page.locator(SELECTORS.bothRequired)).toBeVisible();
  });

  // 8. Forgot password link navigates
  test('Forgot password link navigates', async ({ page }) => {
    await page.locator(SELECTORS.forgotPassword).click();
    await expect(page).toHaveURL(/passwordRecovery/);
  });

 // 9. Social login icons show error (BUG-009)
test('Social login icons show error @bug-009', async ({ page }) => {
  const socialButtons = [
    { name: 'Facebook', selector: '.btn--social--facebook' },
    { name: 'Twitter', selector: '.btn--social--twitter' },
    { name: 'Google', selector: '.btn--social--google' },
    { name: 'GitHub', selector: '.btn--social--github' },
  ];

  for (const btn of socialButtons) {
    console.log(`Testing social login: ${btn.name}`);

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

    await page.locator(btn.selector).click();

    // Sve ikone otvaraju isti warning alert
    await expect(page.locator('p.alert.alert--warning')).toBeVisible();
  }
});


  // 10. Authenticated user visiting /login is redirected
  test('Authenticated user visiting /login is redirected', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.email);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.password).blur();
    await submitLogin(page);

    expect(await waitForLogin(page)).toBeTruthy();

    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(/profile/);

    await logout(page);
  });

  // 11. Login accepts email format
  test('Login accepts email format', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.email);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await page.locator(SELECTORS.password).blur();
    await submitLogin(page);

    expect(await waitForLogin(page)).toBeTruthy();

    await openMenu(page);
    await expect(page.locator(SELECTORS.authLogout)).toBeVisible();

    await logout(page);
  });

});
