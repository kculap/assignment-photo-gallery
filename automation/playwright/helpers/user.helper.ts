import { Page } from '@playwright/test';

export async function getUserIdFromUrl(page: Page) {
  const url = page.url();
  return url.split('/').pop()!;
}
