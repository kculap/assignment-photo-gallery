import { test, expect } from '@playwright/test';
import { login, logout } from '../../helpers/auth.helper';
import { BASE_URL } from '../../helpers/test-data';

/* ---------------------------------------------------------
   HELPERI
--------------------------------------------------------- */

async function fillAlbumName(page, name: string) {
  const nameInput = page.locator('input[formcontrolname="albumName"]');

  await nameInput.waitFor({ state: 'visible' });
  await nameInput.click({ force: true });
  await nameInput.fill('');
  await nameInput.type(name, { delay: 20 });

  await expect(nameInput).toHaveValue(name);
}

async function uploadCover(page) {
  const uploadArea = page.locator('.upload-area, .dashed-area');


  await expect(uploadArea).toBeVisible({ timeout: 10000 });

  await uploadArea.click({ force: true });

  const fileInput = page.locator('input[type="file"]');
  await fileInput.waitFor({ state: 'attached' });

  await fileInput.setInputFiles('helpers/test-image.jpg');
}

/* ---------------------------------------------------------
   TEST SUITE
--------------------------------------------------------- */

test.describe('Create Album Flow', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('1. Create Album page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);

    // SANITY CHECK
    await expect(page).toHaveURL(/album\/create/);

    await expect(page.getByRole('heading', { name: 'Create new album' })).toBeVisible();
    await expect(page.locator('input[formcontrolname="albumName"]')).toBeVisible();
    await expect(page.locator('textarea[formcontrolname="description"]')).toBeVisible();
    await expect(page.locator('button:has-text("BACK")')).toBeVisible();
    await expect(page.locator('button:has-text("SAVE ALBUM")')).toBeVisible();
  });

  test('2. SAVE ALBUM disabled until name entered', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    const saveBtn = page.locator('button:has-text("SAVE ALBUM")');
    await expect(saveBtn).toBeDisabled();

    await fillAlbumName(page, 'My Album');
    await expect(saveBtn).toBeEnabled();
  });

  test('3. Create with valid name and description', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await fillAlbumName(page, 'My Album');
    await page.locator('textarea[formcontrolname="description"]').fill('Test description');
    await page.locator('button:has-text("SAVE ALBUM")').click();

    await expect(page.getByRole('heading', { name: 'Almost done!' })).toBeVisible();
  });

  test('4. Create with name only', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await fillAlbumName(page, 'Album Only Name');
    await page.locator('button:has-text("SAVE ALBUM")').click();

    await expect(page.getByRole('heading', { name: 'Almost done!' })).toBeVisible();
  });

  test('5. Empty name shows validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await page.locator('button:has-text("SAVE ALBUM")').click();

    const error = page.locator('.validation-error, .text-danger, .error');
    await expect(error).toBeVisible();
  });

  test('6. BUG-023: Enter key does not navigate back', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await fillAlbumName(page, 'Album Enter Test');
    await page.keyboard.press('Enter');

    await expect(page.url()).not.toContain('/profile');
  });

  test('7. BACK button returns to profile', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await page.locator('button:has-text("BACK")').click();

    await expect(page).toHaveURL(/profile/);
  });

  test('8. "Almost done!" page elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await fillAlbumName(page, 'Album Step 2');
    await page.locator('button:has-text("SAVE ALBUM")').click();

    await expect(page.getByRole('heading', { name: 'Almost done!' })).toBeVisible();
    await expect(page.locator('.upload-area, .dashed-area')).toBeVisible();
    await expect(page.locator('text=Album is not created until you upload a cover image')).toBeVisible();
  });

  test('9. Cover upload completes album', async ({ page }) => {
    await page.goto(`${BASE_URL}/album/create`);
    await expect(page).toHaveURL(/album\/create/);

    await fillAlbumName(page, 'Album Cover Upload');
    await page.locator('button:has-text("SAVE ALBUM")').click();

    await uploadCover(page);

    await expect(page).toHaveURL(/album\/detail/);
  });

});
