# Playwright homepage test file creation
_Exported on 3/31/2026 at 09:40:38 GMT+2 from Cursor (2.6.22)_

---

**User**

Create a new Playwright test file:

tests/smoke/homepage.spec.ts

Write all homepage tests in a clean, professional QA style.  
Do not use emojis or conversational tone.  
Use clear comments and stable selectors.  
Follow all rules and conclusions listed below.


GENERAL RULES

- Import BASE_URL from ../../helpers/test-data.
- After navigation, always wait for "networkidle".
- Use only the selectors listed in this prompt.
- Do not use toBeVisible() on SVG elements.
- The scroll icon is an SVG sprite and Playwright does not reliably detect its visibility.
  Do not check visibility before clicking it.
- Clicking the scroll icon does not move the Playwright viewport.
  After clicking it, manually scroll down using:

  await page.mouse.wheel(0, 800);

- The gallery wrapper [infinitescroll] exists in the DOM immediately but is not visible until the page is scrolled.
  Do not check its visibility.
- To confirm the gallery is loaded, wait for the first grid item to be attached:

  await gridItems.first().waitFor({ state: 'attached' });

- Write tests with clear comments and stable expectations.


SELECTORS TO USE


Hero tagline: .hero__title  
Scroll icon: .scroll__icon  
Logo: .menu__brand  
Search icon: .search--custom  
Gallery wrapper: .container[infinitescroll]  
Grid item: .container > .display--ib.w--33  
Thumbnail: .thumbnail__img  
Footer: .footer  
Expected browser title: baasic-starterkit-angular-blog


TESTS TO IMPLEMENT


1. Homepage loads
   - Navigate to BASE_URL
   - Verify hero tagline is visible
   - Verify scroll icon exists (do not check visibility)
   - Verify logo is visible
   - Verify search icon is visible

2. Scroll icon loads gallery
   - Click .scroll__icon
   - Manually scroll down using page.mouse.wheel(0, 800)
   - Wait for first grid item to be attached
   - Assert at least 3 grid items exist
   - Assert each grid item contains a visible thumbnail

3. Gallery images render
   - Verify at least one .thumbnail__img is visible

4. Logo is visible
   - Verify .menu__brand is visible

5. Search icon is visible
   - Verify .search--custom is visible

6. Browser tab title
   - Verify the page title equals: baasic-starterkit-angular-blog


OUTPUT FORMAT


Return only the full content of:

tests/smoke/homepage.spec.ts

No explanations.  
No additional text.  
Only the file content.


---

**Cursor**

I’m going to locate your existing Playwright test structure and helper paths, mirror the established QA style from nearby smoke specs, then add the new `homepage.spec.ts` with only the selectors and assertions you specified.

I found your helper at `automation/helpers/test-data.ts` and your Playwright config at `automation/playwright.config.ts`. Next I’ll inspect existing test patterns and then create `automation/tests/smoke/homepage.spec.ts` with the exact behaviors and selectors you listed.

I’m going to locate the existing smoke tests (including `feed-scroll.spec.ts`) to match your project’s conventions, then I’ll add the new `homepage.spec.ts` alongside them.

I’ve confirmed your Playwright `testDir` is `automation/tests` and the `smoke` folder is currently empty. Next I’ll add `automation/tests/smoke/homepage.spec.ts` implementing the six required tests with the exact selectors and the required scroll/gallery handling.

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

    // Gallery wrapper exists in the DOM immediately; confirm the gallery is loaded by waiting for the first grid item.
    await gridItems.first().waitFor({ state: 'attached' });

    // Assert a minimum number of gallery items are present.
    const itemCount = await gridItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(3);

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

---

**User**

Create a new Playwright test file:

tests/smoke/navigation.spec.ts

Write all navigation tests in a clean, professional QA style.  
Do not use emojis or conversational tone.  
Use clear comments and stable selectors.  
Follow all rules and conclusions listed below.


GENERAL RULES


- Import BASE_URL from ../../helpers/test-data.
- Import login() from ../../helpers/auth.helper.
- After navigation, always wait for "networkidle".
- Use only the selectors listed in this prompt.
- The MENU trigger requires hover before click.
- The overlay navigation appears only after clicking .menu__title.
- The overlay is inside <modal-component> and disappears when closed.
- Closing the menu on a non-home page must NOT redirect (known bug BUG-008).
- Menu items are not keyboard navigable via Tab (known bug BUG-041).
- Use clear comments and stable expectations.


SELECTORS TO USE


MENU trigger container: .menu  
MENU text (click target): .menu__title  
Logo: .menu__brand  

Overlay container: modal-component .modal  
Overlay background: .modal-backdrop  
X button: modal-component .pull  

Guest menu items:
- Home: modal-component a[href*="/main"]
- Login: modal-component a[href*="/login"]
- Register: modal-component a[href*="/register"]

Authenticated menu items:
- Profile: modal-component a[href*="/profile"]
- Create Album: modal-component a[href*="/albums/create"]
- Log out: modal-component a[href*="/logout"]


URL PATHS


Home: /main  
Login: /login  
Register: /register  
Profile: /profile  
Create Album: /albums/create  
Log out redirect: /login  

TESTS TO IMPLEMENT


1. MENU opens on click
   - Hover .menu
   - Click .menu__title
   - Verify overlay (modal-component .modal) is visible

2. Guest menu shows correct items
   - Open MENU
   - Verify Home, Login, Register links are visible
   - Verify Profile, Create Album, Log out are NOT visible

3. Authenticated menu shows correct items
   - login()
   - Open MENU
   - Verify Profile, Create Album, Log out are visible
   - Verify Home, Login, Register are NOT visible

4. Menu closes on X without redirect
   - Navigate to /login
   - Open MENU
   - Click X button (modal-component .pull)
   - Verify still on /login

5. Menu closes on background overlay click
   - Navigate to /register
   - Open MENU
   - Click overlay background (.modal-backdrop)
   - Verify still on /register

6. Menu closes on Escape key
   - Open MENU
   - Press Escape
   - Verify overlay is closed

7. "Home" link navigates to /main
   - Open MENU
   - Click Home
   - Verify URL ends with /main

8. "Login" link navigates to /login
   - Open MENU
   - Click Login
   - Verify URL ends with /login

9. "Register" link navigates to /register
   - Open MENU
   - Click Register
   - Verify URL ends with /register

10. Log out works
    - login()
    - Open MENU
    - Click Log out
    - Verify redirect to /login
    - Open MENU again
    - Verify guest items visible

OUTPUT FORMAT


Return only the full content of:

tests/smoke/navigation.spec.ts

No explanations.  
No additional text.  
Only the file content.


---

**Cursor**

I’m going to inspect your existing auth helper to match its `login()` signature and any established patterns, then I’ll produce `tests/smoke/navigation.spec.ts` implementing the 10 required navigation tests with only the provided selectors and required hover-before-click behavior.

import { test, expect, type Page } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';
import { login } from '../../helpers/auth.helper';

const SELECTORS = {
  menuTriggerContainer: '.menu',
  menuTitle: '.menu__title',
  logo: '.menu__brand',

  overlay: 'modal-component .modal',
  overlayBackdrop: '.modal-backdrop',
  closeButton: 'modal-component .pull',

  guestHome: 'modal-component a[href*="/main"]',
  guestLogin: 'modal-component a[href*="/login"]',
  guestRegister: 'modal-component a[href*="/register"]',

  authProfile: 'modal-component a[href*="/profile"]',
  authCreateAlbum: 'modal-component a[href*="/albums/create"]',
  authLogout: 'modal-component a[href*="/logout"]',
} as const;

const PATHS = {
  home: '/main',
  login: '/login',
  register: '/register',
  profile: '/profile',
  createAlbum: '/albums/create',
  logoutRedirect: '/login',
} as const;

async function openMenu(page: Page) {
  // MENU requires hover before click.
  await page.locator(SELECTORS.menuTriggerContainer).hover();

  // Overlay navigation appears only after clicking the menu title.
  await page.locator(SELECTORS.menuTitle).click();

  // Confirm the overlay is visible before asserting menu items.
  await expect(page.locator(SELECTORS.overlay)).toBeVisible();
}

test.describe('Navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test from the homepage with network activity settled.
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test('MENU opens on click', async ({ page }) => {
    await openMenu(page);
  });

  test('Guest menu shows correct items', async ({ page }) => {
    await openMenu(page);

    // Guest menu items should be visible.
    await expect(page.locator(SELECTORS.guestHome)).toBeVisible();
    await expect(page.locator(SELECTORS.guestLogin)).toBeVisible();
    await expect(page.locator(SELECTORS.guestRegister)).toBeVisible();

    // Authenticated-only items must not be present for guests.
    await expect(page.locator(SELECTORS.authProfile)).toHaveCount(0);
    await expect(page.locator(SELECTORS.authCreateAlbum)).toHaveCount(0);
    await expect(page.locator(SELECTORS.authLogout)).toHaveCount(0);
  });

  test('Authenticated menu shows correct items', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openMenu(page);

    // Authenticated menu items should be visible.
    await expect(page.locator(SELECTORS.authProfile)).toBeVisible();
    await expect(page.locator(SELECTORS.authCreateAlbum)).toBeVisible();
    await expect(page.locator(SELECTORS.authLogout)).toBeVisible();

    // Guest-only items must not be present when authenticated.
    await expect(page.locator(SELECTORS.guestHome)).toHaveCount(0);
    await expect(page.locator(SELECTORS.guestLogin)).toHaveCount(0);
    await expect(page.locator(SELECTORS.guestRegister)).toHaveCount(0);
  });

  test('Menu closes on X without redirect', async ({ page }) => {
    // Navigate to a non-home page and wait for network idle.
    await page.goto(`${BASE_URL}${PATHS.login}`, { waitUntil: 'networkidle' });

    await openMenu(page);
    await page.locator(SELECTORS.closeButton).click();

    // Overlay is inside modal-component and disappears when closed.
    await expect(page.locator(SELECTORS.overlay)).toHaveCount(0);

    // Closing the menu on a non-home page must NOT redirect (BUG-008).
    await expect(page).toHaveURL(new RegExp(`${PATHS.login}$`));
  });

  test('Menu closes on background overlay click', async ({ page }) => {
    // Navigate to a non-home page and wait for network idle.
    await page.goto(`${BASE_URL}${PATHS.register}`, { waitUntil: 'networkidle' });

    await openMenu(page);
    await page.locator(SELECTORS.overlayBackdrop).click();

    // Overlay is inside modal-component and disappears when closed.
    await expect(page.locator(SELECTORS.overlay)).toHaveCount(0);

    // Closing the menu on a non-home page must NOT redirect (BUG-008).
    await expect(page).toHaveURL(new RegExp(`${PATHS.register}$`));
  });

  test('Menu closes on Escape key', async ({ page }) => {
    await openMenu(page);

    await page.keyboard.press('Escape');

    // Overlay is inside modal-component and disappears when closed.
    await expect(page.locator(SELECTORS.overlay)).toHaveCount(0);
  });

  test('"Home" link navigates to /main', async ({ page }) => {
    await openMenu(page);

    await page.locator(SELECTORS.guestHome).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp(`${PATHS.home}$`));
  });

  test('"Login" link navigates to /login', async ({ page }) => {
    await openMenu(page);

    await page.locator(SELECTORS.guestLogin).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp(`${PATHS.login}$`));
  });

  test('"Register" link navigates to /register', async ({ page }) => {
    await openMenu(page);

    await page.locator(SELECTORS.guestRegister).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp(`${PATHS.register}$`));
  });

  test('Log out works', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('networkidle');

    await openMenu(page);

    await page.locator(SELECTORS.authLogout).click();
    await page.waitForLoadState('networkidle');

    // Log out should redirect to /login.
    await expect(page).toHaveURL(new RegExp(`${PATHS.logoutRedirect}$`));

    // After logout, menu should show guest items again.
    await openMenu(page);
    await expect(page.locator(SELECTORS.guestHome)).toBeVisible();
    await expect(page.locator(SELECTORS.guestLogin)).toBeVisible();
    await expect(page.locator(SELECTORS.guestRegister)).toBeVisible();
  });
});

---

**User**

Create or overwrite the following file:

helpers/auth.helper.ts

Write clean, minimal, professional Playwright helper functions for authentication.  
No emojis, no conversational tone, no unnecessary comments.  
Use only the selectors and logic provided below.

------------------------------------------------------------
REQUIREMENTS
------------------------------------------------------------

1. Export a login(page) function that:
   - navigates to `${BASE_URL}/login`
   - waits for networkidle
   - fills email and password fields
   - submits the form
   - waits for networkidle again
   - ensures login succeeded by checking that URL no longer ends with /login

2. Export a logout(page) function that:
   - clears localStorage token if present
   - navigates to `${BASE_URL}/login`
   - waits for networkidle

3. Use credentials from helpers/test-data.ts:
   - BASE_URL
   - USER_EMAIL
   - USER_PASSWORD

4. Do not hardcode selectors outside the function body.
   Use:
     input[name="email"]
     input[name="password"]
     button[type="submit"]

5. Code must be fully self-contained and ready to use.

------------------------------------------------------------
ALSO UPDATE helpers/test-data.ts
------------------------------------------------------------

If missing, create or update helpers/test-data.ts with:

- export BASE_URL
- export USER_EMAIL
- export USER_PASSWORD

Values must be defined as constants at the top of the file.

------------------------------------------------------------
OUTPUT FORMAT
------------------------------------------------------------

Return ONLY the full content of:

helpers/auth.helper.ts  
helpers/test-data.ts

No explanations.  
No extra text.  
Only the file contents.


---

**Cursor**

I’m going to add `auth.helper.ts` with the required `login()`/`logout()` helpers and then update `test-data.ts` to include `USER_EMAIL` and `USER_PASSWORD` while keeping `BASE_URL` as-is.

import { expect, type Page } from '@playwright/test';
import { BASE_URL, USER_EMAIL, USER_PASSWORD } from './test-data';

export async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });

  await page.locator('input[name="email"]').fill(USER_EMAIL);
  await page.locator('input[name="password"]').fill(USER_PASSWORD);
  await page.locator('button[type="submit"]').click();

  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/\/login$/);
}

export async function logout(page: Page) {
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (/token/i.test(key)) localStorage.removeItem(key);
    }
  });

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
}

export const BASE_URL =
  'https://demo.baasic.com/angular/starterkit-photo-gallery/main';

export const USER_EMAIL = '';
export const USER_PASSWORD = '';

---

**User**

You will create a new Playwright E2E test file for the Baasic Photo Gallery demo application.

TASK:
Create a new file at EXACT path:
tests/search/search.spec.ts

Do NOT ask questions.  
Do NOT wait for confirmation.  
Generate the complete file content.

Before writing the tests, FIRST scan the DOM of the Baasic Photo Gallery demo app and automatically extract selectors for:

- Search icon (magnifying glass)
- Search input field
- Search results grid items
- Search results heading
- Any fallback selectors that appear in the DOM

IMPORTANT:
Baasic demo uses inconsistent class names, so generate MULTIPLE fallback selectors for each element.  
Then create a helper function:

function pick(selectors) {
  return selectors.join(', ');
}

Then build a SELECTORS object like this:

const SELECTORS = {
  searchIcon: pick([ ...detected selectors... ]),
  searchInput: pick([ ...detected selectors... ]),
  searchHeading: pick([ ...detected selectors... ]),
  searchResults: pick([ ...detected selectors... ]),
};

Selectors must be:
- stable
- short
- not dependent on dynamic Angular classes
- include fallback options

After generating selectors, create the full test suite.

FILE REQUIREMENTS:
- Use: import { test, expect } from '@playwright/test'
- Use: import { BASE_URL } from '../../helpers/test-data'
- Before each test: await page.goto(`${BASE_URL}/main`, { waitUntil: 'networkidle' })

HELPERS TO IMPLEMENT:

1) openSearch(page):
   - Click search icon
   - Wait for search input to become visible

2) captureConsoleErrors(page, errors):
   - page.on('console', msg => if msg.type() === 'error' push msg.text())

TEST CASES TO IMPLEMENT:

1. Search icon opens input field
   - Click search icon
   - Verify input appears

2. Valid search returns results
   - Type "cat"
   - Press Enter
   - Verify URL contains /photo/search/cat
   - Verify heading contains "Search result for: 'cat'"

3. Search with no results
   - Type "xyznotexist999"
   - Press Enter
   - Verify no crash (no TypeError)
   - Verify page loads normally

4. Empty search
   - Press Enter with empty input
   - Verify no crash

5. REGRESSION BUG-007: Whitespace search
   - Capture console errors
   - Type " "
   - Press Enter
   - Verify NO console error containing "Cannot read properties of undefined"

6. REGRESSION BUG-006: Slash "/"
   - Type "/"
   - Press Enter
   - Verify page does NOT show "404"

7. Search with "?"
   - Type "?"
   - Press Enter
   - Verify no routing error

8. Search with "#"
   - Type "#"
   - Press Enter
   - Verify no routing error

9. XSS payload
   - Type '<script>alert("xss")</script>'
   - Press Enter
   - Verify no alert dialog appears

10. Search results are clickable
   - Search "cat"
   - Click first result
   - Verify navigation to photo detail page (/photo/detail)

ADDITIONAL RULES:
- Use expect(page).toHaveURL(/pattern/) because Baasic adds query params
- Use expect(body).not.toContainText("TypeError") for crash detection
- Use page.on('dialog') to detect unwanted alerts
- Use fallback selectors for robustness
- Generate the full file content with all tests implemented
- Ensure the file is ready to run immediately

OUTPUT:
Generate ONLY the complete file content of tests/search/search.spec.ts.


---

**Cursor**

I’m going to programmatically open the demo homepage in a headless browser, inspect the DOM for search-related elements, and derive short stable selectors with fallbacks. Then I’ll generate `tests/search/search.spec.ts` using those selectors and the exact test behaviors you specified.

import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../helpers/test-data';

function pick(selectors: string[]) {
  return selectors.join(', ');
}

const SELECTORS = {
  searchIcon: pick([
    '.search--custom',
    '[class*="search"]',
    'button[title*="Search" i]',
    'a[title*="Search" i]',
    '[aria-label*="Search" i]',
  ]),
  searchInput: pick([
    'input[placeholder*="Search" i]',
    'input[type="search"]',
    'input[name*="search" i]',
    'input',
  ]),
  searchHeading: pick(['.hero__title', 'h1', 'h2', 'h3', 'p']),
  searchResults: pick([
    '.container > .display--ib.w--33',
    '.display--ib.w--33',
    'a[href*="/photo/detail"]',
    'a[href*="/photo/"]',
  ]),
};

async function openSearch(page: import('@playwright/test').Page) {
  await page.locator(SELECTORS.searchIcon).first().click();
  await expect(page.locator(SELECTORS.searchInput).first()).toBeVisible();
}

function captureConsoleErrors(
  page: import('@playwright/test').Page,
  errors: string[],
) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
}

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/main`, { waitUntil: 'networkidle' });
  });

  test('Search icon opens input field', async ({ page }) => {
    await openSearch(page);
  });

  test('Valid search returns results', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('cat');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/photo\/search\/cat/i);
    await expect(page.locator(SELECTORS.searchHeading)).toContainText(
      "Search result for: 'cat'",
    );
  });

  test('Search with no results', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('xyznotexist999');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).not.toContainText('TypeError');
  });

  test('Empty search', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).not.toContainText('TypeError');
  });

  test('REGRESSION BUG-007: Whitespace search', async ({ page }) => {
    const errors: string[] = [];
    captureConsoleErrors(page, errors);

    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill(' ');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    expect(errors.join('\n')).not.toContain('Cannot read properties of undefined');
  });

  test('REGRESSION BUG-006: Slash "/"', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('/');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).not.toContainText('404');
    await expect(body).not.toContainText('Cannot match any routes');
  });

  test('Search with "?"', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('?');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).not.toContainText('404');
    await expect(body).not.toContainText('Cannot match any routes');
  });

  test('Search with "#"', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('#');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).not.toContainText('404');
    await expect(body).not.toContainText('Cannot match any routes');
  });

  test('XSS payload', async ({ page }) => {
    let dialogSeen = false;
    page.on('dialog', async (dialog) => {
      dialogSeen = true;
      await dialog.dismiss();
    });

    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('<script>alert("xss")</script>');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    expect(dialogSeen).toBeFalsy();
  });

  test('Search results are clickable', async ({ page }) => {
    await openSearch(page);

    const input = page.locator(SELECTORS.searchInput).first();
    await input.fill('cat');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/photo\/search\/cat/i);

    const results = page.locator(SELECTORS.searchResults);
    await expect(results.first()).toBeVisible();

    await results.first().click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/photo\/detail/i);
  });
});

---

**User**

You will create a new Playwright E2E test file for the Baasic Photo Gallery demo application.

TASK:
Create a new file at EXACT path:
tests/search/search.spec.ts

Do NOT ask questions.  
Do NOT wait for confirmation.  
Generate the complete file content.

IMPORTANT — SELECTOR GENERATION RULES:
Before writing the tests, you MUST inspect the DOM of the Baasic Photo Gallery demo app and extract REAL selectors.

STRICT RULES FOR SELECTORS:
- DO NOT use generic selectors like: input, [class*="search"], [name*="search"], [placeholder*="Search"], or anything that matches too many elements.
- DO NOT use selectors that match more than one unrelated element.
- DO NOT use selectors that rely on dynamic Angular classes.
- DO NOT use selectors that rely on text unless absolutely necessary.

You MUST extract selectors from the actual DOM structure of:
https://demo.baasic.com/angular/starterkit-photo-gallery/main

You MUST identify the REAL elements:
1. Search icon (magnifying glass)
2. Search input field (the one that appears after clicking the icon)
3. Search results grid items (photo thumbnails)
4. Search results heading

You MUST generate 2–3 fallback selectors for each element, but ALL fallbacks must be:
- specific
- stable
- based on real DOM structure
- NOT generic patterns

Example of GOOD fallback selectors:
- '.nav__search .icon--search'
- '.search__toggle'
- 'button.search__trigger'

Example of BAD fallback selectors (DO NOT USE):
- '[class*="search"]'
- 'input'
- 'a[href*="/photo"]'
- 'button'

After extracting selectors, create:

function pick(selectors) {
  return selectors.join(', ');
}

const SELECTORS = {
  searchIcon: pick([ ...real selectors... ]),
  searchInput: pick([ ...real selectors... ]),
  searchHeading: pick([ ...real selectors... ]),
  searchResults: pick([ ...real selectors... ]),
};

HELPERS TO IMPLEMENT:

1) openSearch(page):
   - Click search icon
   - Wait for search input to become visible

2) captureConsoleErrors(page, errors):
   - page.on('console', msg => if msg.type() === 'error' push msg.text())

TEST CASES TO IMPLEMENT:

1. Search icon opens input field
2. Valid search returns results
3. Search with no results
4. Empty search
5. REGRESSION BUG-007: Whitespace search
6. REGRESSION BUG-006: Slash "/"
7. Search with "?"
8. Search with "#"
9. XSS payload
10. Search results are clickable

ADDITIONAL RULES:
- Use expect(page).toHaveURL(/pattern/) because Baasic adds query params
- Use expect(body).not.toContainText("TypeError") for crash detection
- Use page.on('dialog') to detect unwanted alerts
- Use fallback selectors for robustness
- Generate the full file content with all tests implemented
- Ensure the file is ready to run immediately

OUTPUT:
Generate ONLY the complete file content of tests/search/search.spec.ts.


---

**Cursor**

I’m going to run a DOM inspection against the live Baasic demo to extract **real, specific, unique** selectors for the search icon, the opened search input, the search results heading, and the search results grid items. Then I’ll overwrite `tests/search/search.spec.ts` using only those selectors and your required test cases.

---

**User**

You are generating Playwright tests for the Photo Gallery application.

Create a new file: tests/auth/login.spec.ts

Use the following selectors from the real DOM:

Inputs:
- Username: input[formcontrolname="username"]
- Password: input[formcontrolname="password"]

Buttons:
- Login button: button[type="submit"]
- Social login buttons:
  - Facebook: .btn--social--facebook
  - Twitter: .btn--social--twitter
  - Google: .btn--social--google
  - GitHub: .btn--social--github

Links:
- Forgot password: a[href*="passwordRecovery"]

Error messages:
- Invalid login: span.alert.alert--warning (text: "Invalid email, username or password")
- Social login error: p.alert.alert--warning (text contains "Social login configuration not found")
- Username required: div.alert.alert--warning (text: "Username is required.")
- Password required: div.alert.alert--warning (text: "Password is required.")

After successful login, the user is redirected to /profile.

Authenticated menu items after login:
- Profile
- Create Album
- Log out (selector: span.nav__link.type--thin.type--lrg with text "Log out")

Use TEST_USER from helpers/test-data.ts:
- username: "-"
- email: "nobru131@gmail.com"
- password: "password"

Use logout() helper after tests that perform login.

Write the following test cases:

1. Login page loads:
   - Verify username input, password input, login button, 4 social icons, forgot password link.

2. Successful login:
   - Fill TEST_USER.username and TEST_USER.password
   - Click Login
   - Verify redirect to /profile
   - Verify authenticated menu items appear

3. Wrong password:
   - Valid username, wrong password
   - Expect error: "Invalid email, username or password"

4. Non-existing username:
   - Username: "nonexistinguser123"
   - Expect same invalid login error

5. Empty username:
   - Leave username empty, fill password
   - Expect validation error: "Username is required."

6. Empty password:
   - Fill username, leave password empty
   - Expect validation error: "Password is required."

7. Both fields empty:
   - Click Login without filling anything
   - Expect both validation errors

8. Forgot password link navigates:
   - Click link
   - Expect URL to contain /passwordRecovery

9. Social login Facebook shows error:
   - Click .btn--social--facebook
   - Expect error message containing "Social login configuration not found"

10. Authenticated user visiting /login is redirected:
    - Login successfully
    - Navigate manually to /login
    - Expect redirect to /profile

11. Login accepts email format:
    - Use TEST_USER.email + TEST_USER.password
    - Expect successful login

Structure:
- Use test.describe() to group tests
- Use beforeEach to navigate to /login
- Use logout() helper where needed
- Use expect() assertions for visibility, text, and URL checks

Generate clean, stable, readable Playwright tests.


---

**Cursor**

I’m going to add `tests/auth/login.spec.ts` with the exact real-DOM selectors you provided, wire it to `TEST_USER` from `helpers/test-data.ts`, and ensure all login flows clean up via `logout()` where required.

import { test, expect } from '@playwright/test';
import { BASE_URL, TEST_USER } from '../../helpers/test-data';
import { logout } from '../../helpers/auth.helper';

const SELECTORS = {
  username: 'input[formcontrolname="username"]',
  password: 'input[formcontrolname="password"]',
  submit: 'button[type="submit"]',

  socialFacebook: '.btn--social--facebook',
  socialTwitter: '.btn--social--twitter',
  socialGoogle: '.btn--social--google',
  socialGithub: '.btn--social--github',

  forgotPassword: 'a[href*="passwordRecovery"]',

  invalidLoginError: 'span.alert.alert--warning',
  socialLoginError: 'p.alert.alert--warning',
  usernameRequiredError: 'div.alert.alert--warning',
  passwordRequiredError: 'div.alert.alert--warning',

  logoutNavItem: 'span.nav__link.type--thin.type--lrg:has-text("Log out")',
} as const;

async function submitLogin(page: import('@playwright/test').Page) {
  await page.locator(SELECTORS.submit).click();
  await page.waitForLoadState('networkidle');
}

test.describe('Auth - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  });

  test('Login page loads', async ({ page }) => {
    await expect(page.locator(SELECTORS.username)).toBeVisible();
    await expect(page.locator(SELECTORS.password)).toBeVisible();
    await expect(page.locator(SELECTORS.submit)).toBeVisible();

    await expect(page.locator(SELECTORS.socialFacebook)).toBeVisible();
    await expect(page.locator(SELECTORS.socialTwitter)).toBeVisible();
    await expect(page.locator(SELECTORS.socialGoogle)).toBeVisible();
    await expect(page.locator(SELECTORS.socialGithub)).toBeVisible();

    await expect(page.locator(SELECTORS.forgotPassword)).toBeVisible();
  });

  test('Successful login', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.username);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await submitLogin(page);

    await expect(page).toHaveURL(/\/profile(\?|$)/);

    await expect(page.locator(SELECTORS.logoutNavItem)).toBeVisible();
    await expect(page.locator('body')).toContainText('Profile');
    await expect(page.locator('body')).toContainText('Create Album');

    await logout(page);
  });

  test('Wrong password', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.username);
    await page.locator(SELECTORS.password).fill('wrong-password');
    await submitLogin(page);

    await expect(page.locator(SELECTORS.invalidLoginError)).toContainText(
      'Invalid email, username or password',
    );
  });

  test('Non-existing username', async ({ page }) => {
    await page.locator(SELECTORS.username).fill('nonexistinguser123');
    await page.locator(SELECTORS.password).fill('wrong-password');
    await submitLogin(page);

    await expect(page.locator(SELECTORS.invalidLoginError)).toContainText(
      'Invalid email, username or password',
    );
  });

  test('Empty username', async ({ page }) => {
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await submitLogin(page);

    await expect(page.locator(SELECTORS.usernameRequiredError)).toContainText(
      'Username is required.',
    );
  });

  test('Empty password', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.username);
    await submitLogin(page);

    await expect(page.locator(SELECTORS.passwordRequiredError)).toContainText(
      'Password is required.',
    );
  });

  test('Both fields empty', async ({ page }) => {
    await submitLogin(page);

    await expect(page.locator(SELECTORS.usernameRequiredError)).toContainText(
      'Username is required.',
    );
    await expect(page.locator(SELECTORS.passwordRequiredError)).toContainText(
      'Password is required.',
    );
  });

  test('Forgot password link navigates', async ({ page }) => {
    await page.locator(SELECTORS.forgotPassword).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/passwordRecovery/i);
  });

  test('Social login Facebook shows error', async ({ page }) => {
    await page.locator(SELECTORS.socialFacebook).click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator(SELECTORS.socialLoginError)).toContainText(
      'Social login configuration not found',
    );
  });

  test('Authenticated user visiting /login is redirected', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.username);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await submitLogin(page);

    await expect(page).toHaveURL(/\/profile(\?|$)/);

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/profile(\?|$)/);

    await logout(page);
  });

  test('Login accepts email format', async ({ page }) => {
    await page.locator(SELECTORS.username).fill(TEST_USER.email);
    await page.locator(SELECTORS.password).fill(TEST_USER.password);
    await submitLogin(page);

    await expect(page).toHaveURL(/\/profile(\?|$)/);

    await logout(page);
  });
});

---

**User**

You are generating Playwright tests for the Photo Gallery application.

Create a complete file: tests/auth/register.spec.ts

Requirements:
- Use BASE_URL and TEST_USER from helpers/test-data.ts
- Use logout() from helpers/auth.helper.ts
- Do NOT use any external helpers except logout()
- Include a small openMenu(page) helper inside this file (same as in login.spec.ts)
- Use unique emails with: test.user+${Date.now()}@mailinator.com
- Use the exact selectors listed below (do not invent new ones)

Selectors:
- Profile image placeholder: .profile-image__placeholder
- Plus icon inside placeholder: .profile-image__placeholder .icon--plus
- Email field: input[formcontrolname="email"]
- Username field: input[formcontrolname="userName"]
- Password field: input[formcontrolname="password"]
- Confirm Password field: input[formcontrolname="confirmPassword"]
- REGISTER button: button[type="submit"]
- Success message: .alert.alert--success
- Error message: .alert.alert--warning

Known bugs:
- BUG-012: Form freezes if Confirm Password is clicked first
- BUG-014: Invalid email has no feedback
- BUG-048: Username with whitespace is accepted

Write these 12 test cases:

1. Register page loads — verify profile image, + icon, all fields, REGISTER button visible
2. REGISTER button disabled initially
3. Successful registration — use unique email, verify success message
4. Invalid email format — enter "test@test", verify validation error (BUG-014 regression)
5. Duplicate email — use TEST_USER.email, verify error
6. Duplicate username — use TEST_USER.username, verify error
7. Mismatched passwords — verify error
8. Empty fields — verify validation errors
9. BUG-012 regression — click Confirm Password first, then fill fields, verify form still works
10. Whitespace username — enter "   ", verify validation error (BUG-048)
11. Pressing Enter in email field does not navigate away
12. Authenticated user visiting /register is redirected to /main or /profile

Output:
- Full Playwright test file
- All selectors included directly in this file
- No external helpers except logout()
- Use openMenu(page) only if needed for redirect test
- Code must be clean, stable, and ready to run


---

**Cursor**


Reading `test-data.ts`, `auth.helper.ts`, and `login.spec.ts` for patterns and `openMenu` implementation.




Creating `register.spec.ts` with the specified selectors and test cases. Checking for a `/register` route pattern in the repo.




Writing the complete `register.spec.ts` file.




Handling empty-fields case: submit may stay disabled. Using a forced click so we can assert validation alerts if the app shows them.




Here’s what was added.

**File:** `automation/tests/auth/register.spec.ts`

- Imports only `BASE_URL`, `TEST_USER`, and `logout()`; **`openMenu`** is defined locally (same idea as `login.spec.ts`).
- Uses only your listed selectors; emails use `test.user+${Date.now()}@mailinator.com`.
- **12 tests** as specified, including BUG-012 / BUG-014 / BUG-048 behavior you described.
- After successful registration (tests 3 and 9) and after the authenticated redirect test (12), **`openMenu` + `logout()`** runs so the session is cleared (aligned with `auth.helper`’s `logout`).
- **Empty fields:** fields are focused so the form is touched, then **REGISTER** is clicked with **`force: true`** so submission is attempted even if the button stays disabled until valid—otherwise many Angular apps never show `.alert.alert--warning` on an empty form.

If you want “empty fields” to use a normal click only (no `force`), say so and we can adjust once you confirm whether the real app enables the button when invalid.

---

**User**

You are generating a Playwright test file for the Photo Gallery application.

Create the file: tests/auth/register.spec.ts

Requirements:
- Use BASE_URL and TEST_USER from helpers/test-data.ts
- Use logout() from helpers/auth.helper.ts
- Do NOT use any external helpers except logout()
- Include a small openMenu(page) helper inside this file
- Use unique emails with: test.user+${Date.now()}@mailinator.com
- Use the EXACT selectors listed below (do not invent new ones)
- Do NOT use waitForLoadState('networkidle') anywhere
- All waits must be explicit: expect(...).toBeVisible() or small timeouts
- Tests must be stable, deterministic, and Angular-friendly

Selectors:
- Profile image placeholder: .profile-image__placeholder
- Plus icon: .profile-image__placeholder .icon--plus
- Email field: input[formcontrolname="email"]
- Username field: input[formcontrolname="userName"]
- Password field: input[formcontrolname="password"]
- Confirm Password field: input[formcontrolname="confirmPassword"]
- REGISTER button: button[type="submit"]
- Success message: .alert.alert--success
- Error message: .alert.alert--warning

Known bugs:
- BUG-012: Form freezes if Confirm Password is clicked first
- BUG-014: Invalid email has no feedback
- BUG-048: Username with whitespace is accepted

Write these 12 test cases:

1. Register page loads — verify profile image, + icon, all fields, REGISTER button visible
2. REGISTER button disabled initially
3. Successful registration — use unique email, verify success message
4. Invalid email format — enter "test@test", verify validation error (BUG-014 regression)
5. Duplicate email — use TEST_USER.email, verify error
6. Duplicate username — use TEST_USER.username, verify error
7. Mismatched passwords — verify error
8. Empty fields — verify validation errors
9. BUG-012 regression — click Confirm Password first, then fill fields, verify form still works
10. Whitespace username — enter "   ", verify validation error (BUG-048)
11. Pressing Enter in email field does not navigate away
12. Authenticated user visiting /register is redirected to /main or /profile

Output:
- Full Playwright test file
- All selectors included directly in this file
- No external helpers except logout()
- Use openMenu(page) only for redirect test
- Code must match the structure and stability of the login.spec.ts file


You are an expert QA automation engineer.  
Write a Playwright test file named password-recovery.spec.ts for the Photo Gallery application.

The tests must match the DOM EXACTLY as described below and must be fully stable, non-flaky, and use precise selectors.

PAGE: /passwordRecovery  
DOM ELEMENTS:
- Lock icon SVG has classes: svg.align--h--center.display--b.spc--top--xlrg
- Heading: <h2>Password Recovery</h2>
- Email input: input[formcontrolname="email"], placeholder "Enter your email"
- Recover button: button[type="submit"], text "Recover password", disabled until email entered

MESSAGES (IMPORTANT):
- Invalid email format → shows: <div class="alert alert--warning">Please enter the correct email address</div>
- Non-existing email → shows: <p>Unknown user.</p>
- Valid email → shows: <p>Please check your email in order to finish password recovery process.</p>

BUGS TO COVER:
- BUG‑010: Reset link leads to 404 (just mention in test name, do NOT navigate)
- BUG‑011: Invalid email format incorrectly shows "Unknown user." instead of invalid format error

WRITE THESE TESTS:

1. Page loads correctly  
   - Verify lock icon SVG visible  
   - Verify heading visible  
   - Verify email field visible  
   - Verify Recover button visible  

2. Recover button state  
   - Disabled before typing  
   - Enabled after typing any email  

3. Valid email shows confirmation  
   - Fill TEST_USER.email  
   - Click Recover  
   - Expect: "Please check your email in order to finish password recovery process."  

4. Non-existing email shows error  
   - Fill unique non-existing email  
   - Click Recover  
   - Expect: "Unknown user."  

5. BUG‑011 regression test  
   - Fill "test@test"  
   - Click Recover  
   - Expect WRONG behavior: "Unknown user."  
   - Expect correct error ("Please enter the correct email address") NOT visible  

6. Empty email validation  
   - Blur email field  
   - Expect: "Please enter the correct email address"  
   - Button stays disabled  

7. Navigation from login  
   - Go to /login  
   - Click "Forgot password" link  
   - Expect navigation to /passwordRecovery  

ADDITIONAL REQUIREMENTS:
- Use BASE_URL and TEST_USER from helpers/test-data  
- Use stable selectors  
- Use uniqueEmail() helper for non-existing email  
- No flaky waits, only expect() and waitForURL()  
- File must be fully ready for copy/paste  
- Do NOT create login/logout helpers here  
- Output ONLY the final test file content, nothing else


