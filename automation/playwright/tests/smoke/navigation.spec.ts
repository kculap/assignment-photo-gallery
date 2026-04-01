import { test, expect, Page } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';
import { login } from '../../helpers/auth.helper';

const SELECTORS = {
  // MENU triggers
  menuLogo: '.menu__brand',
  menuTitle: '.menu__title',

  // Navigation overlay (actual visible container)
  overlay: '.nav__content',
  closeButton: '.jq--closeMenu',

  // Guest menu items
  guestHome: '.nav__content .nav__link:has-text("Home")',
  guestLogin: '.nav__content .nav__link:has-text("Login")',
  guestRegister: '.nav__content .nav__link:has-text("Register")',

  // Authenticated menu items
  authProfile: '.nav__content .nav__link:has-text("Profile")',
  authCreateAlbum: '.nav__content .nav__link:has-text("Create Album")',
  authLogout: '.nav__content .nav__link:has-text("Log out")',
} as const;

const PATHS = {
  home: '/main',
  login: '/login',
  register: '/register',
  profile: '/profile',
  createAlbum: '/albums/create',
  logoutRedirect: '/login',
} as const;

// Helper to open the MENU (ultra-stable version)
async function openMenu(page: Page) {
  await page.locator(SELECTORS.menuLogo).hover();
  await page.locator(SELECTORS.menuTitle).waitFor({ state: 'visible' });
  await page.locator(SELECTORS.menuTitle).click();
  await page.locator('.nav__content .nav__link').first().waitFor({ state: 'visible' });
}

test.describe('Navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/main`, { waitUntil: 'networkidle' });
  });

  test('MENU opens on click', async ({ page }) => {
    await openMenu(page);
    await expect(page.locator('.nav__content .nav__link')).toHaveCount(3);
  });

  test('Guest menu shows correct items', async ({ page }) => {
    await openMenu(page);

    await expect(page.locator(SELECTORS.guestHome)).toHaveCount(1);
    await expect(page.locator(SELECTORS.guestLogin)).toHaveCount(1);
    await expect(page.locator(SELECTORS.guestRegister)).toHaveCount(1);

    await expect(page.locator(SELECTORS.authProfile)).toHaveCount(0);
    await expect(page.locator(SELECTORS.authCreateAlbum)).toHaveCount(0);
    await expect(page.locator(SELECTORS.authLogout)).toHaveCount(0);
  });

  test('Authenticated menu shows correct items', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openMenu(page);

    await expect(page.locator(SELECTORS.authProfile)).toHaveCount(1);
    await expect(page.locator(SELECTORS.authCreateAlbum)).toHaveCount(1);
    await expect(page.locator(SELECTORS.authLogout)).toHaveCount(1);

    await expect(page.locator(SELECTORS.guestHome)).toHaveCount(0);
    await expect(page.locator(SELECTORS.guestLogin)).toHaveCount(0);
    await expect(page.locator(SELECTORS.guestRegister)).toHaveCount(0);
  });

  test('Menu closes on X without redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });

    await openMenu(page);
    await page.locator(SELECTORS.closeButton).click();

    await expect(page.locator(SELECTORS.overlay)).toBeHidden();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Menu closes on background overlay click', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });

    await openMenu(page);

    await page.mouse.click(5, 5);

    await expect(page.locator(SELECTORS.overlay)).toBeHidden();
    await expect(page).toHaveURL(/\/register/);
  });

  test('Menu closes on Escape key', async ({ page }) => {
    await openMenu(page);

    await page.keyboard.press('Escape');

    await expect(page.locator(SELECTORS.overlay)).toBeHidden();
  });

  test('"Home" link navigates to /main', async ({ page }) => {
    await openMenu(page);
    await page.locator(SELECTORS.guestHome).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/main/);
  });

  test('"Login" link navigates to /login', async ({ page }) => {
    await openMenu(page);
    await page.locator(SELECTORS.guestLogin).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/login/);
  });

  test('"Register" link navigates to /register', async ({ page }) => {
    await openMenu(page);
    await page.locator(SELECTORS.guestRegister).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/register/);
  });

  test('Log out works', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openMenu(page);
    await page.locator(SELECTORS.authLogout).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/login/);

    await openMenu(page);
    await expect(page.locator(SELECTORS.guestLogin)).toHaveCount(1);
    await expect(page.locator(SELECTORS.guestRegister)).toHaveCount(1);
  });
});
