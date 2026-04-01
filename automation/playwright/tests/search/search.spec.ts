import { test, expect, Page } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';

const SELECTORS = {
  searchTrigger: '.search--custom',                     
  searchInput: 'input[formcontrolname="search"]',       
  searchHeading: 'h4.spc--bottom--med',                 
  searchResults: '.display--ib.w--33',                 
  resultClickable: '.thumbnail--overlay'                
};

async function openSearch(page: Page) {
  await page.locator(SELECTORS.searchTrigger).click();  
  await expect(page.locator(SELECTORS.searchInput)).toBeVisible();
}

function captureConsoleErrors(page: Page, errors: string[]) {
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
}

test.describe('Search functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/main`, { waitUntil: 'networkidle' });
  });

  test('Search trigger opens input field', async ({ page }) => {
    await openSearch(page);
  });

  test('Valid search returns results', async ({ page }) => {
    await openSearch(page);

    await page.locator(SELECTORS.searchInput).fill('cat');
    await page.keyboard.press('Enter'); 

    await expect(page).toHaveURL(/photo\/search\/cat/);
    await expect(page.locator(SELECTORS.searchHeading)).toContainText("Search result for: 'cat'");
    await expect(page.locator(SELECTORS.searchResults).first()).toBeVisible();
  });

  test('Search with no results does not crash', async ({ page }) => {
    await openSearch(page);

    await page.locator(SELECTORS.searchInput).fill('xyznotexist999');
    await page.keyboard.press('Enter');

    await expect(page.locator('body')).not.toContainText('TypeError');
  });

  test('Empty search does not crash', async ({ page }) => {
    await openSearch(page);

    await page.keyboard.press('Enter');

    await expect(page.locator('body')).not.toContainText('TypeError');
  });

  test('BUG-007: Whitespace search does not crash', async ({ page }) => {
    const errors: string[] = [];
    captureConsoleErrors(page, errors);

    await openSearch(page);

    await page.locator(SELECTORS.searchInput).fill(' ');
    await page.keyboard.press('Enter');

    expect(errors.join('\n')).not.toContain('Cannot read properties of undefined');
  });

  test('BUG-006: Slash "/" does not cause 404', async ({ page }) => {
    await openSearch(page);

    await page.locator(SELECTORS.searchInput).fill('/');
    await page.keyboard.press('Enter');

    await expect(page.locator('body')).not.toContainText('404');
  });

  test('Search with "?" does not break routing', async ({ page }) => {
    await openSearch(page);

    await page.locator(SELECTORS.searchInput).fill('?');
    await page.keyboard.press('Enter');

    await expect(page.locator('body')).not.toContainText('Error');
  });

  test('Search with "#" does not break routing', async ({ page }) => {
    await openSearch(page);

    await page.locator(SELECTORS.searchInput).fill('#');
    await page.keyboard.press('Enter');

    await expect(page.locator('body')).not.toContainText('Error');
  });

  test('XSS payload is treated as text, no alert appears', async ({ page }) => {
    let alertShown = false;

    page.on('dialog', () => {
      alertShown = true;
    });

    await openSearch(page);

    const payload = '<script>alert("xss")</script>';
    await page.locator(SELECTORS.searchInput).fill(payload);
    await page.keyboard.press('Enter');

    expect(alertShown).toBeFalsy();
  });

  test('Search results are clickable', async ({ page }) => {
    await openSearch(page);
  
    await page.locator(SELECTORS.searchInput).fill('cat');
    await page.keyboard.press('Enter');
  
    const firstResult = page.locator('.display--ib.w--33').first();
  
    await expect(firstResult).toBeVisible();
  
    await firstResult.click();  
  
    await expect(page).toHaveURL(/photo\/detail/);
  });
  

});
