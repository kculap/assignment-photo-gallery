import { expect, Page, test } from '@playwright/test';
import { login } from '../../helpers/auth.helper';
import { BASE_URL, TEST_IMAGE_PATH } from '../../helpers/test-data';

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

async function createAlbum(page: Page): Promise<string> {
  await page.goto(`${BASE_URL}/album/create`);
  await page.locator('input[formcontrolname="albumName"]').fill(`Album-${Date.now()}`);
  await page.locator('button:has-text("SAVE ALBUM")').click();
  await expect(page.getByRole('heading', { name: 'Almost done!' })).toBeVisible();
  return page.url().split('/').pop();
}

async function uploadTwoPhotosAndReturnSecondUrl(page, albumId) {
  await page.goto(`${BASE_URL}/album/detail/${albumId}`);

  // 1) Upload first (buggy) — BEZ redirect checka
  await page.locator('button:has-text("UPLOAD PHOTO")').first().click();
  await page.setInputFiles('input[type="file"]', 'helpers/test-image.jpg');
  await page.locator('button:has-text("UPLOAD")').first().click();

  // 2) Upload second (good)
  await page.locator('button:has-text("UPLOAD PHOTO")').first().click();
  await page.setInputFiles('input[type="file"]', 'helpers/test-image.jpg');
  await page.locator('button:has-text("UPLOAD")').first().click();

  // čekamo da se pojave 2 thumbnaila
  const thumbs = page.locator('.thumbnail');
  await expect(thumbs).toHaveCount(2, { timeout: 15000 });

  // UZIMAMO DRUGU SLIKU
  const secondThumb = thumbs.nth(1);
  await secondThumb.hover();
  await secondThumb.locator('.icon-eye').click();

  const url = page.url();
  await page.goBack();
  return url;
}

/* ---------------------------------------------------------
   SECURITY TESTS
--------------------------------------------------------- */

test.describe('Security: Authentication Bypass', () => {

  test('1. Photo detail accessible without auth (BUG-032)', async ({ page, browser }) => {
    await login(page);

    const albumId = await createAlbum(page);
    const photoUrl = await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    const p2 = await browser.newPage(); // no auth
    await p2.goto(photoUrl);

    test.fail(true, 'BUG-032: Photo detail loads without authentication');
    await expect(p2).toHaveURL(/login/);
  });

  test('2. Album browsable via arrows without auth (BUG-059)', async ({ page, browser }) => {
    await login(page);

    const albumId = await createAlbum(page);
    const photoUrl1 = await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    const p2 = await browser.newPage();
    await p2.goto(photoUrl1);

    await p2.locator('.icon-arrow-right, .icon-chevron-right').click();

    test.fail(true, 'BUG-059: Unauthenticated user can browse album via arrows');
    await expect(p2).toHaveURL(/login/);
  });

  test('3. Album detail not accessible without auth', async ({ page, browser }) => {
    await login(page);

    const albumId = await createAlbum(page);
    const albumUrl = `${BASE_URL}/album/detail/${albumId}`;

    const p2 = await browser.newPage();
    await p2.goto(albumUrl);

    await expect(p2).toHaveURL(/login/);
  });

  test('4. /album/create not accessible without auth', async ({ browser }) => {
    const p2 = await browser.newPage();
    await p2.goto(`${BASE_URL}/album/create`);
    await expect(p2).toHaveURL(/login/);
  });

  test('5. /profile not accessible without auth', async ({ page, browser }) => {
    await login(page);

    const profileUrl = page.url();

    const p2 = await browser.newPage();
    await p2.goto(profileUrl);

    await expect(p2).toHaveURL(/login/);
  });

  test('6. Authenticated user on /register not redirected (BUG-040)', async ({ page }) => {
    await login(page);

    await page.goto(`${BASE_URL}/register`);

    test.fail(true, 'BUG-040: Logged-in user can access /register');
    await expect(page).toHaveURL(/profile|main/);
  });

  test('7. Authenticated user on /login not redirected (BUG-068)', async ({ page }) => {
    await login(page);

    await page.goto(`${BASE_URL}/login`);

    test.fail(true, 'BUG-068: Logged-in user can access /login');
    await expect(page).toHaveURL(/profile|main/);
  });

});
