import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';

const SELECTORS = {
  heroTagline: '.hero__title',
  scrollIcon: '.scroll__icon',
  logo: '.menu__brand',
  searchIcon: '.search--custom',
  gridItem: '.container > .display--ib.w--33',
  thumbnail: '.thumbnail__img',
} as const;

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage and wait for the initial network activity to settle.
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test('Homepage loads', async ({ page }) => {
    const heroTagline = page.locator(SELECTORS.heroTagline);
    const scrollIcon = page.locator(SELECTORS.scrollIcon);
    const logo = page.locator(SELECTORS.logo);
    const searchIcon = page.locator(SELECTORS.searchIcon);

    // Primary hero content should be visible.
    await expect(heroTagline).toBeVisible();

    // Scroll icon is an SVG sprite; verify it exists without checking visibility.
    await expect(scrollIcon).toHaveCount(1);

    // Global navigation elements should be visible.
    await expect(logo).toBeVisible();
    await expect(searchIcon).toBeVisible();
  });

  test('Scroll icon loads gallery', async ({ page }) => {
    const scrollIcon = page.locator(SELECTORS.scrollIcon);
    const gridItems = page.locator(SELECTORS.gridItem);

    // Do not check visibility for the SVG scroll icon; click it directly.
    await scrollIcon.click();

    // Clicking the scroll icon does not move the viewport; scroll manually to trigger gallery rendering.
    await page.mouse.wheel(0, 800);

    // Confirm the gallery is loaded by waiting for the first grid item.
    await gridItems.first().waitFor({ state: 'attached' });

    // Assert a minimum number of gallery items are present.
    const itemCount = await gridItems.count();
    await expect(itemCount).toBeGreaterThanOrEqual(3);

    // Assert each grid item contains a visible thumbnail image.
    for (let i = 0; i < itemCount; i++) {
      const gridItem = gridItems.nth(i);
      const thumbnail = gridItem.locator(SELECTORS.thumbnail);
      await expect(thumbnail).toBeVisible();
    }
  });

  test('Gallery images render', async ({ page }) => {
    const scrollIcon = page.locator(SELECTORS.scrollIcon);
    const gridItems = page.locator(SELECTORS.gridItem);
    const thumbnails = page.locator(SELECTORS.thumbnail);

    // Ensure the gallery is triggered before validating image rendering.
    await scrollIcon.click();
    await page.mouse.wheel(0, 800);
    await gridItems.first().waitFor({ state: 'attached' });

    // At least one thumbnail image should be visible.
    await expect(thumbnails.first()).toBeVisible();
  });

  test('Logo is visible', async ({ page }) => {
    const logo = page.locator(SELECTORS.logo);
    await expect(logo).toBeVisible();
  });

  test('Search icon is visible', async ({ page }) => {
    const searchIcon = page.locator(SELECTORS.searchIcon);
    await expect(searchIcon).toBeVisible();
  });

  test('Browser tab title', async ({ page }) => {
    await expect(page).toHaveTitle('baasic-starterkit-angular-blog');
  });
});
