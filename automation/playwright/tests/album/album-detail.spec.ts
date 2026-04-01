import { expect, Page, test } from '@playwright/test';
import { login, logout } from '../../helpers/auth.helper';
import { BASE_URL, TEST_IMAGE_PATH } from '../../helpers/test-data';

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

async function createAlbum(page: Page): Promise<string> {
  await page.goto(`${BASE_URL}/album/create`);
  await page.locator('input[formcontrolname="albumName"]').fill(`Album-${Date.now()}`);
  await page.locator('button:has-text("SAVE ALBUM")').click();
  await expect(page.getByRole('heading', { name: 'Almost done!' })).toBeVisible();
  await expect(page).toHaveURL(/\/album\/detail\/[^/?#]+/);
  const match = page.url().match(/\/album\/detail\/([^/?#]+)/);
  if (!match?.[1]) {
    throw new Error(`Could not parse album id from URL: ${page.url()}`);
  }
  return match[1];
}

async function uploadTwoPhotosAndReturnSecondUrl(page: Page, albumId: string): Promise<string> {
  await page.goto(`${BASE_URL}/album/detail/${albumId}`);

  // Upload first (buggy)
  await page.locator('button:has-text("UPLOAD PHOTO")').first().click();
  await page.setInputFiles('input[type="file"]', TEST_IMAGE_PATH);
  await page.locator('button:has-text("UPLOAD")').first().click();

  // Upload second (good)
  await page.locator('button:has-text("UPLOAD PHOTO")').first().click();
  await page.setInputFiles('input[type="file"]', TEST_IMAGE_PATH);
  await page.locator('button:has-text("UPLOAD")').first().click();

  const thumbs = page.locator('.thumbnail');
  await expect(thumbs).toHaveCount(2, { timeout: 15000 });

  const secondThumb = thumbs.nth(1);
  await secondThumb.hover();
  await secondThumb.locator('.icon-eye').click();

  const url = page.url();
  await page.goBack();
  return url;
}

async function deleteAlbum(page: Page, albumId: string) {
  await page.goto(`${BASE_URL}/album/detail/${albumId}`);
  await page.locator('button:has-text("DELETE ALBUM")').click();
  await page.locator('button:has-text("DELETE")').click();
}

/* ---------------------------------------------------------
   TEST SUITE
--------------------------------------------------------- */

test.describe('Album Detail Page', () => {

  let albumId: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    albumId = await createAlbum(page);
  });

  test.afterEach(async ({ page }) => {
    if (!albumId) return;
    await deleteAlbum(page, albumId);
  });

  test('1. Album detail loads with metadata', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    await expect(page.locator('button:has-text("GO BACK TO ALBUMS")')).toBeVisible();
    await expect(page.locator('button:has-text("UPLOAD PHOTO")')).toBeVisible();
    await expect(page.locator('text=0 photos')).toBeVisible();
    await expect(page.locator('text=Created by')).toBeVisible();
    await expect(page.locator('text=Album description')).toBeVisible();
  });

  test('2. Empty album shows "0 photos"', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/detail/${albumId}`);
    await expect(page.locator('text=0 photos')).toBeVisible();
  });

  test('3. UPLOAD PHOTO navigates to upload', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    await page.locator('button:has-text("UPLOAD PHOTO")').click();

    await expect(page).toHaveURL(new RegExp(`/photo/upload/${albumId}/false`));
  });

  test('4. GO BACK TO ALBUMS returns to profile', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    await page.locator('button:has-text("GO BACK TO ALBUMS")').click();

    await expect(page).toHaveURL(/profile/);
  });

  test('5. Photo visible after upload', async ({ page }) => {
    await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    await expect(page.locator('.thumbnail')).toHaveCount(2);
  });

  test('6. Hover shows eye icon and DELETE', async ({ page }) => {
    await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    const photo = page.locator('.thumbnail').nth(1);
    await photo.hover();

    await expect(photo.locator('.icon-eye')).toBeVisible();
    await expect(photo.locator('button:has-text("DELETE")')).toBeVisible();
  });

  test('7. Eye icon opens photo detail', async ({ page }) => {
    const photoUrl = await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    const photo = page.locator('.thumbnail').nth(1);
    await photo.hover();
    await photo.locator('.icon-eye').click();

    await expect(page).toHaveURL(photoUrl);
  });

  test('8. DELETE photo shows confirmation', async ({ page }) => {
    await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    const photo = page.locator('.thumbnail').nth(1);
    await photo.hover();
    await photo.locator('button:has-text("DELETE")').click();

    await expect(page.locator('text=Warning!')).toBeVisible();
  });

  test('9. CANCEL keeps photo', async ({ page }) => {
    await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    const photo = page.locator('.thumbnail').nth(1);
    await photo.hover();
    await photo.locator('button:has-text("DELETE")').click();

    await page.locator('button:has-text("CANCEL")').click();

    await expect(page.locator('.thumbnail')).toHaveCount(2);
  });

  test('10. Confirm delete removes photo', async ({ page }) => {
    await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    const photo = page.locator('.thumbnail').nth(1);
    await photo.hover();
    await photo.locator('button:has-text("DELETE")').click();

    await page.locator('button:has-text("DELETE")').click();

    await expect(page.locator('.thumbnail')).toHaveCount(1);
  });

  test('11. Count updates immediately after delete', async ({ page }) => {
    await uploadTwoPhotosAndReturnSecondUrl(page, albumId);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    const header = page.locator('text=photos');

    await expect(header).toContainText('2 photos');

    const photo = page.locator('.thumbnail').nth(1);
    await photo.hover();
    await photo.locator('button:has-text("DELETE")').click();
    await page.locator('button:has-text("DELETE")').click();

    await expect(header).toContainText('1 photos');
  });

  test('12. All uploaded photos open without 404', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    for (let i = 0; i < 3; i++) {
      await page.locator('button:has-text("UPLOAD PHOTO")').first().click();
      await page.setInputFiles('input[type="file"]', TEST_IMAGE_PATH);
      await page.locator('button:has-text("UPLOAD")').first().click();
    }

    await page.reload();

    const thumbs = page.locator('.thumbnail');
    const count = await thumbs.count();

    for (let i = 0; i < count; i++) {
      await thumbs.nth(i).hover();
      await thumbs.nth(i).locator('.icon-eye').click();

      await expect(page.locator('img')).toBeVisible();

      await page.goBack();
    }
  });

  test('13. Album not accessible when logged out', async ({ page }) => {
    await logout(page);

    await page.goto(`${BASE_URL}/album/detail/${albumId}`);

    await expect(page).toHaveURL(/login/);
  });

});
