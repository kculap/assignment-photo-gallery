import { test, expect, Page } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';
import { login } from '../../helpers/auth.helper';

/* ---------------------------------------------------------
   SELECTORS (REAL PHOTO GALLERY UI)
--------------------------------------------------------- */

const SELECTORS = {
  // MENU
  menuLogo: '.menu__brand',
  menuTitle: '.menu__title',
  overlay: '.nav__content',
  closeButton: '.jq--closeMenu',

  // SEARCH
  searchIcon: '.search__toggle',
  searchInput: '.search__input',

  // GALLERY
  thumbnail: '.thumbnail',
  photoClose: '.photo__close, .icon-close',

  // REGISTER
  regEmail: 'input[formcontrolname="email"]',
  regUsername: 'input[formcontrolname="username"]',
  regPassword: 'input[formcontrolname="password"]',
  regConfirm: 'input[formcontrolname="confirmPassword"]',
  regButton: 'button:has-text("REGISTER")',

  // RECOVERY
  recEmail: 'input[formcontrolname="email"]',
  recButton: 'button:has-text("RECOVER PASSWORD")',

  // ALBUM CREATE
  albumName: 'input[formcontrolname="albumName"]',
  saveAlbum: 'button:has-text("SAVE ALBUM")',
  uploadPhotoBtn: 'button:has-text("UPLOAD PHOTO")',
  fileInput: 'input[type="file"]',
  uploadConfirm: 'button:has-text("UPLOAD")',
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

async function openMenu(page: Page) {
  await page.locator(SELECTORS.menuLogo).hover();
  await page.locator(SELECTORS.menuTitle).waitFor({ state: 'visible' });
  await page.locator(SELECTORS.menuTitle).click();
  await page.locator(SELECTORS.overlay).waitFor({ state: 'visible' });
}

async function fillAlbumName(page: Page, name: string) {
  const input = page.locator(SELECTORS.albumName);
  await input.waitFor({ state: 'visible' });
  await input.click({ force: true });
  await input.fill('');
  await input.type(name, { delay: 20 });
}

async function uploadPhoto(page: Page) {
  await page.locator(SELECTORS.uploadPhotoBtn).click({ force: true });
  const fileInput = page.locator(SELECTORS.fileInput);
  await fileInput.waitFor({ state: 'attached' });
  await fileInput.setInputFiles('helpers/test-image.jpg');
  await page.locator(SELECTORS.uploadConfirm).click({ force: true });
}

/* ---------------------------------------------------------
   REGRESSION TEST SUITE
--------------------------------------------------------- */

test.describe('Regression: Known Bugs', () => {

  /* ---------------------------------------------------------
     1. BUG‑008 — Menu close redirects to Home
  --------------------------------------------------------- */
  test('BUG‑008: Menu close should NOT redirect to Home', async ({ page }) => {
    // EXPECTED: Closing menu stays on /login
    // CURRENT: Redirects to /main

    await page.goto(`${BASE_URL}/login`);
    await openMenu(page);

    await page.locator(SELECTORS.closeButton).click();

    await expect(page.locator(SELECTORS.overlay)).toBeHidden();
    await expect(page).toHaveURL(/\/login/);
  });

  /* ---------------------------------------------------------
     2. BUG‑007 — Whitespace search crashes app
  --------------------------------------------------------- */
  test('BUG‑007: Whitespace search should NOT crash app', async ({ page }) => {
    // EXPECTED: No console errors, app stays functional
    // CURRENT: "Cannot read properties of undefined"

    await page.goto(`${BASE_URL}/main`);

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.locator(SELECTORS.searchIcon).click();
    await page.locator(SELECTORS.searchInput).fill(' ');
    await page.keyboard.press('Enter');

    expect(errors.some(e => e.includes('Cannot read properties'))).toBeFalsy();
  });

  /* ---------------------------------------------------------
     3. BUG‑006 — "/" in search causes 404
  --------------------------------------------------------- */
  test('BUG‑006: Slash "/" search should NOT cause 404', async ({ page }) => {
    // EXPECTED: Search handles "/" normally
    // CURRENT: Navigates to 404

    await page.goto(`${BASE_URL}/main`);

    await page.locator(SELECTORS.searchIcon).click();
    await page.locator(SELECTORS.searchInput).fill('/');
    await page.keyboard.press('Enter');

    await expect(page.locator('text=404')).not.toBeVisible();
  });

  /* ---------------------------------------------------------
     4. BUG‑023 — Enter in Album Name navigates back
  --------------------------------------------------------- */
  test('BUG‑023: Enter key in Album Name should NOT navigate back', async ({ page }) => {
    // EXPECTED: Stay on /album/create
    // CURRENT: Navigates to /profile

    await login(page);
    await page.goto(`${BASE_URL}/album/create`);

    await fillAlbumName(page, 'Test Album');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/album\/create/);
  });

  /* ---------------------------------------------------------
     5. BUG‑016 — Image count not updated after delete
  --------------------------------------------------------- */
  test('BUG‑016: Image count should update immediately after delete', async ({ page }) => {
    // EXPECTED: Count updates 1 → 0 immediately
    // CURRENT: Stays 1 until refresh

    await login(page);

    await page.goto(`${BASE_URL}/album/create`);
    await fillAlbumName(page, 'Regression Album');
    await page.locator(SELECTORS.saveAlbum).click();

    await uploadPhoto(page);

    await expect(page.locator('text=1 photos')).toBeVisible();

    const thumb = page.locator('.thumbnail').first();
    await thumb.hover();
    await thumb.locator('button:has-text("DELETE")').click();
    await page.locator('button:has-text("DELETE")').click();

    await expect(page.locator('text=0 photos')).toBeVisible();
  });

  /* ---------------------------------------------------------
     6. BUG‑002 — X button returns to Home not gallery
  --------------------------------------------------------- */
  test('BUG‑002: X button should return to gallery, not Home', async ({ page }) => {
    // EXPECTED: Return to gallery scroll position
    // CURRENT: Redirects to /main

    await page.goto(`${BASE_URL}/main`);

    await page.mouse.wheel(0, 2000);
    await page.locator(SELECTORS.thumbnail).first().click();

    await page.locator(SELECTORS.photoClose).click();

    await expect(page).not.toHaveURL(/main$/);
  });

  /* ---------------------------------------------------------
     7. BUG‑012 — Registration form freeze
  --------------------------------------------------------- */
  test('BUG‑012: Registration form should NOT freeze', async ({ page }) => {
    // EXPECTED: REGISTER button responds
    // CURRENT: Form freezes

    await page.goto(`${BASE_URL}/register`);

    await page.locator(SELECTORS.regConfirm).click();
    await page.locator(SELECTORS.regEmail).fill('test123@test.com');
    await page.locator(SELECTORS.regUsername).fill('testuser123');
    await page.locator(SELECTORS.regPassword).fill('Test123!');
    await page.locator(SELECTORS.regConfirm).fill('Test123!');

    const btn = page.locator(SELECTORS.regButton);
    await btn.click({ force: true });

    await expect(btn).not.toBeDisabled();
  });

  /* ---------------------------------------------------------
     8. BUG‑014 — Invalid email no feedback
  --------------------------------------------------------- */
  test('BUG‑014: Invalid email should show error message', async ({ page }) => {
    // EXPECTED: Error message visible
    // CURRENT: Silent failure

    await page.goto(`${BASE_URL}/register`);

    await page.locator(SELECTORS.regEmail).fill('test@test');
    await page.locator(SELECTORS.regUsername).fill('validuser');
    await page.locator(SELECTORS.regPassword).fill('Test123!');
    await page.locator(SELECTORS.regConfirm).fill('Test123!');

    await page.locator(SELECTORS.regButton).click();

    await expect(page.locator('.text-danger, .validation-error')).toBeVisible();
  });

  /* ---------------------------------------------------------
     9. BUG‑011 — Wrong error for invalid email in recovery
  --------------------------------------------------------- */
  test('BUG‑011: Invalid email should NOT show "Unknown user"', async ({ page }) => {
    // EXPECTED: Proper validation error
    // CURRENT: Shows "Unknown user"

    await page.goto(`${BASE_URL}/passwordRecovery`);

    await page.locator(SELECTORS.recEmail).fill('test@test');
    await page.locator(SELECTORS.recButton).click();

    await expect(page.locator('text=Unknown user')).not.toBeVisible();
  });

  /* ---------------------------------------------------------
     10. BUG‑048 — Whitespace username accepted
  --------------------------------------------------------- */
  test('BUG‑048: Whitespace username should NOT be accepted', async ({ page }) => {
    // EXPECTED: Error shown
    // CURRENT: Registration succeeds

    await page.goto(`${BASE_URL}/register`);

    await page.locator(SELECTORS.regUsername).fill('   ');
    await page.locator(SELECTORS.regEmail).fill('valid@test.com');
    await page.locator(SELECTORS.regPassword).fill('Test123!');
    await page.locator(SELECTORS.regConfirm).fill('Test123!');

    await page.locator(SELECTORS.regButton).click();

    await expect(page.locator('.text-danger, .validation-error')).toBeVisible();
  });

});
