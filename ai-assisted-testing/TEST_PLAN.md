# TEST PLAN — Photo Gallery Starter Kit
## AI-Assisted | Prepared by Katarina Culap | March 2026

**Application:** Starterkit Photo Gallery  
**URL:** https://demo.baasic.com/angular/starterkit-photo-gallery/main  
**Method:** AI-assisted (Claude, MS Copilot)

---

## 1. Application Overview

Photo Gallery Starter Kit is an Angular SPA that allows users to browse a public photo gallery, register, log in, create photo albums, upload photos, and search for content.

### 1.1 Pages & Routes

| Page | URL | Access |
|------|-----|--------|
| Homepage / Hero | /main | Public |
| Gallery feed | /main (scroll down) | Public |
| Photo detail | /photo/detail/{albumId}/{photoId} | Public |
| Search results | /photo/search/{keyword} | Public |
| Login | /login | Public |
| Register | /register | Public |
| Password Recovery | /passwordRecovery | Public |
| Account Activation | /accountActivation/{token} | Public |
| Profile | /profile/{userId} | Authenticated |
| Create Album Step 1 | /album/create | Authenticated |
| Create Album Step 2 | /album/create (after save) | Authenticated |
| Album detail | /album/detail/{albumId} | Authenticated |
| Photo upload (cover) | /photo/upload/{albumId}/true | Authenticated |
| Photo upload (album) | /photo/upload/{albumId}/false | Authenticated |

### 1.2 Navigation States

**Logged OUT:** MENU hover → Home · Login · Register  
**Logged IN:** MENU hover → Profile · Create Album · Log out  
**Logo click:** Reloads homepage (always)

---

## 2. Test Environment

| Parameter | Value |
|-----------|-------|
| Primary browser | Google Chrome (latest) |
| Secondary browser | Firefox (latest) |
| OS | Windows |
| Mobile emulation | Chrome DevTools — iPhone 12, Samsung Galaxy S20 Ultra |
| Real device | Honor 90 (Android) |
| Test account | username: password, password: password |

---

## 3. Test Data

| Type | Value |
|------|-------|
| Valid email | test.user@mailinator.com |
| Invalid email (missing TLD) | test@test |
| Invalid email (missing @) | testtest.com |
| Non-existing email | notexist999@mailinator.com |
| Valid password | password |
| Mismatched password | differentpassword123 |
| Valid image JPG ~2MB | photo.jpg |
| Valid image PNG ~2MB | photo.png |
| GIF image | photo.gif |
| WebP image | photo.webp |
| Large image ~20MB | large_photo.jpg |
| Long string (200+ chars) | aaaa... (200 characters) |
| Long string (1000 words) | Lorem Ipsum generated |
| Emoji input | 🔥 |
| Special characters | #$%&/()=?* |
| Whitespace only | " " (single space) |
| HTML tag input | `<h1>test</h1>` |
| XSS payload | `<script>alert('xss')</script>` |
| Search — valid results | cat |
| Search — no results | xyznotexist999 |
| Search — routing break | / |
| Search — URL reserved | ? # & |

---

## 4. Priority Definitions

| Priority | Definition |
|----------|-----------|
| **Critical** | Core functionality broken — application unusable |
| **High** | Major feature broken or significant user impact |
| **Medium** | Feature works but with issues; workaround exists |
| **Low** | Minor UX or cosmetic issue; no functional impact |

---

## 5. Test Cases by Functionality

---

## FUNCTION 1: Homepage & Hero Section

**Observed UI elements:** Full-screen hero image, tagline "We are celebrating the vastness of life", scroll indicator icon (mouse icon with arrow), logo top-left, search icon top-right, footer with "Copyright @ Blog name" and "Powered by Baasic"

---

### F1-TC-001 — Homepage loads successfully
**Priority:** Critical  
**Steps:**
1. Open https://demo.baasic.com/angular/starterkit-photo-gallery/main
2. Wait for page to fully load
3. Observe all elements

**Expected Result:** Hero background image visible, tagline displayed, scroll icon visible center-bottom, logo top-left, search icon top-right, no console errors

---

### F1-TC-002 — Scroll indicator icon is visible in hero section
**Priority:** Medium  
**Steps:**
1. Open homepage
2. Observe center-bottom of hero

**Expected Result:** Mouse/scroll icon visible with down arrow animation

---

### F1-TC-003 — Clicking scroll icon loads gallery feed
**Priority:** Critical  
**Steps:**
1. Open homepage
2. Click scroll indicator icon

**Expected Result:** Page scrolls down and 3-column image grid appears

---

### F1-TC-004 — Gallery grid displays images in 3-column layout
**Priority:** High  
**Steps:**
1. Scroll to gallery section
2. Observe layout

**Expected Result:** Images displayed in 3-column grid

---

### F1-TC-005 — Hover on gallery image shows username and date overlay
**Priority:** Medium  
**Steps:**
1. Hover mouse over any gallery image
2. Observe overlay

**Expected Result:** Username and upload date visible on dark overlay

---

### F1-TC-006 — Clicking gallery image opens photo detail page
**Priority:** Critical  
**Steps:**
1. Click any image in gallery
2. Observe

**Expected Result:** Photo detail page opens at /photo/detail/{albumId}/{photoId}

---

### F1-TC-007 — Gallery loads more images when scrolling (infinite scroll)
**Priority:** High  
**Steps:**
1. Scroll to gallery
2. Continue scrolling down for several seconds

**Expected Result:** New images load as user scrolls

---

### F1-TC-008 — Logo click reloads homepage
**Priority:** Medium  
**Steps:**
1. Navigate to any page
2. Click logo (top-left)

**Expected Result:** Homepage reloads

---

### F1-TC-009 — Logo hover shows MENU text
**Priority:** Low  
**Steps:**
1. Hover over logo area (top-left)
2. Observe

**Expected Result:** "MENU" text appears on hover — clicking it opens navigation menu

---

### F1-TC-010 — Right-clicking MENU link does not open broken tab
**Priority:** Low  
**Steps:**
1. Hover over logo to reveal MENU text
2. Right-click MENU
3. Select "Open link in new tab"

**Expected Result:** No broken "about:blank#blocked" page opens
**Test Data:** N/A

---

### F1-TC-011 — Footer visible at bottom of page
**Priority:** Low  
**Steps:**
1. Scroll to bottom (if reachable)
2. Observe footer

**Expected Result:** "Copyright @ Blog name" on left, "Powered by Baasic" on right

---

### F1-TC-012 — Footer "Blog name" link is functional
**Priority:** Low  
**Steps:**
1. Scroll to footer
2. Click "Blog name"

**Expected Result:** Navigates to valid page
**Related Bug:** BUG-003

---

### F1-TC-013 — Footer "Baasic" link is functional
**Priority:** Low  
**Steps:**
1. Click "Baasic" in footer

**Expected Result:** Navigates to Baasic website

---

### F1-TC-014 — Browser tab title shows application name
**Priority:** Low  
**Steps:**
1. Open application
2. Observe browser tab title

**Expected Result:** Meaningful name (e.g. "Photo Gallery")
**Related Bug:** BUG-055

---

### F1-TC-015 — Application has favicon
**Priority:** Low  
**Steps:**
1. Open application
2. Observe tab icon

**Expected Result:** Custom favicon visible
**Related Bug:** BUG-056

---

## FUNCTION 2: Navigation — MENU

**Observed UI elements:** MENU text appears on hover over logo area. Clicking opens full-screen overlay. Guest menu: Home, Login, Register. Authenticated menu: Profile, Create Album, Log out. X button top-right closes menu.

---

### F2-TC-001 — MENU opens on click
**Priority:** Critical  
**Steps:**
1. Hover over logo to reveal MENU
2. Click MENU

**Expected Result:** Full-screen navigation overlay opens

---

### F2-TC-002 — Guest menu shows Home, Login, Register only
**Priority:** High  
**Steps:**
1. Ensure logged out
2. Open MENU
3. Observe links

**Expected Result:** Exactly Home, Login, Register visible — no authenticated items

---

### F2-TC-003 — Authenticated menu shows Profile, Create Album, Log out only
**Priority:** High  
**Steps:**
1. Log in
2. Open MENU
3. Observe links

**Expected Result:** Exactly Profile, Create Album, Log out visible — no guest items

---

### F2-TC-004 — Menu closes on X button click without redirecting
**Priority:** Critical  
**Steps:**
1. Navigate to /login
2. Open MENU
3. Click X button
4. Observe current page

**Expected Result:** Menu closes, user stays on /login
**Related Bug:** BUG-008

---

### F2-TC-005 — Menu closes on background overlay click without redirecting
**Priority:** High  
**Steps:**
1. Navigate to /register
2. Open MENU
3. Click outside menu links (on overlay background)

**Expected Result:** Menu closes, user stays on /register
**Related Bug:** BUG-008

---

### F2-TC-006 — Menu closes on Escape key press
**Priority:** Medium  
**Steps:**
1. Open MENU
2. Press Escape key

**Expected Result:** Menu closes

---

### F2-TC-007 — Menu items are keyboard navigable with Tab
**Priority:** Medium  
**Steps:**
1. Open MENU
2. Press Tab repeatedly

**Expected Result:** Focus moves between Home/Login/Register (or Profile/Create Album/Log out)
**Related Bug:** BUG-041

---

### F2-TC-008 — "Home" link navigates to homepage
**Priority:** Medium  
**Steps:**
1. Open MENU (guest)
2. Click Home

**Expected Result:** Navigated to /main

---

### F2-TC-009 — "Login" link navigates to login page
**Priority:** Medium  
**Steps:**
1. Open MENU (guest)
2. Click Login

**Expected Result:** Navigated to /login

---

### F2-TC-010 — "Register" link navigates to register page
**Priority:** Medium  
**Steps:**
1. Open MENU (guest)
2. Click Register

**Expected Result:** Navigated to /register

---

### F2-TC-011 — "Profile" link navigates to user profile
**Priority:** High  
**Steps:**
1. Log in, open MENU
2. Click Profile

**Expected Result:** Navigated to /profile/{userId}

---

### F2-TC-012 — "Create Album" link navigates to album creation
**Priority:** High  
**Steps:**
1. Log in, open MENU
2. Click Create Album

**Expected Result:** Navigated to /album/create

---

### F2-TC-013 — "Log out" logs user out and redirects to login
**Priority:** Critical  
**Steps:**
1. Log in, open MENU
2. Click Log out

**Expected Result:** Logged out, redirected to /login, menu now shows guest items

---

### F2-TC-014 — Back button after logout does not restore authenticated state
**Priority:** High  
**Steps:**
1. Log in, navigate to /profile
2. Log out
3. Press browser Back

**Expected Result:** Redirected to /login or unauthenticated state shown

---

---

## FUNCTION 3: Search

**Observed UI elements:** Search icon (magnifying glass) top-right. Clicking opens input field. Typing and pressing Enter navigates to /photo/search/{keyword}. Results page shows "Search result for: '{keyword}'" heading and image grid.

---

### F3-TC-001 — Search icon opens input field
**Priority:** High  
**Steps:**
1. Click search icon top-right
2. Observe

**Expected Result:** Search input field appears and is focused

---

### F3-TC-002 — Typing in search field shows input
**Priority:** Medium  
**Steps:**
1. Open search
2. Type "cat"

**Expected Result:** Text "cat" visible in input field

---

### F3-TC-003 — Valid keyword returns results
**Priority:** Critical  
**Steps:**
1. Enter "cat", press Enter

**Expected Result:** /photo/search/cat loads with "Search result for: 'cat'" and matching images

---

### F3-TC-004 — Search result URL contains keyword
**Priority:** Medium  
**Steps:**
1. Search for "cat"
2. Observe URL

**Expected Result:** URL is /photo/search/cat

---

### F3-TC-005 — Search with no matching results shows message
**Priority:** Medium  
**Steps:**
1. Enter "xyznotexist999", press Enter

**Expected Result:** "No results" message — no crash

---

### F3-TC-006 — Search with empty input
**Priority:** Medium  
**Steps:**
1. Open search, press Enter without typing

**Expected Result:** All images or appropriate message — no crash

---

### F3-TC-007 — Search with whitespace only does not crash
**Priority:** Critical  
**Steps:**
1. Enter " " (space), press Enter
2. Check Console for errors

**Expected Result:** Frontend validates, no API request sent with %20, no TypeError
**Related Bug:** BUG-007

---

### F3-TC-008 — Search with "/" does not cause 404
**Priority:** Critical  
**Steps:**
1. Enter "/", press Enter

**Expected Result:** Safe handling — no 404
**Related Bug:** BUG-006

---

### F3-TC-009 — Search with "?" does not break routing
**Priority:** High  
**Steps:**
1. Enter "?", press Enter

**Expected Result:** Safe handling — no routing error

---

### F3-TC-010 — Search with "#" does not break routing
**Priority:** High  
**Steps:**
1. Enter "#", press Enter

**Expected Result:** Safe handling — no routing error

---

### F3-TC-011 — Search with "&" does not break routing
**Priority:** High  
**Steps:**
1. Enter "&", press Enter

**Expected Result:** Safe handling — no routing error

---

### F3-TC-012 — Search with XSS payload does not execute script
**Priority:** High  
**Steps:**
1. Enter `<script>alert('xss')</script>`, press Enter
2. Observe — any dialog? Inspect DOM

**Expected Result:** Input treated as text, no script executes

---

### F3-TC-013 — Search result images are clickable
**Priority:** High  
**Steps:**
1. Search for "cat"
2. Click any result image

**Expected Result:** Photo detail page opens

---

### F3-TC-014 — Search results page shows "Search result for: '{keyword}'" heading
**Priority:** Medium  
**Steps:**
1. Search for "cat"
2. Observe heading

**Expected Result:** Heading clearly shows searched keyword

---

### F3-TC-015 — Search results page has no navigation back to gallery
**Priority:** Low  
**Steps:**
1. Search for "cat"
2. Look for "Back to Gallery" button

**Expected Result:** A back navigation element present
**Related Bug:** BUG-033

---

---

## FUNCTION 4: Photo Detail View

**Observed UI elements:** Dark background page. Image centered top. Below image: photo name, description or "No description available", "More details:" section with username icon and date icon. X button top-right. Previous (<) and next (>) arrows on sides. "Photo X out of Y" counter bottom-right. Footer visible.

---

### F4-TC-001 — Photo detail loads with correct elements
**Priority:** Critical  
**Steps:**
1. Click any gallery image
2. Observe page

**Expected Result:** Image displayed, name below, description or fallback, username, date, X button, footer visible

---

### F4-TC-002 — Photo name displayed correctly
**Priority:** Medium  
**Steps:**
1. Open photo detail
2. Observe name below image

**Expected Result:** Photo name shown correctly

---

### F4-TC-003 — "No description available" shown when no description set
**Priority:** Medium  
**Steps:**
1. Open photo with no description

**Expected Result:** "No description available" text shown

---

### F4-TC-004 — Description displayed when set
**Priority:** Medium  
**Steps:**
1. Upload photo with description
2. Open in detail

**Expected Result:** Description text visible

---

### F4-TC-005 — Username shown in "More details" section
**Priority:** Medium  
**Steps:**
1. Open photo detail
2. Observe "More details" section

**Expected Result:** Username with person icon visible

---

### F4-TC-006 — "Last changed" date shown
**Priority:** Low  
**Steps:**
1. Open photo detail
2. Observe date

**Expected Result:** "Last changed: MM/DD/YYYY" with calendar icon

---

### F4-TC-007 — X button closes detail and returns to gallery position
**Priority:** Critical  
**Steps:**
1. Scroll down in gallery, open image, click X

**Expected Result:** Returns to gallery at same scroll position
**Related Bug:** BUG-002

---

### F4-TC-008 — Browser back button from detail returns to gallery
**Priority:** High  
**Steps:**
1. Open image from gallery, press browser Back

**Expected Result:** Returns to gallery (not homepage)
**Related Bug:** BUG-002

---

### F4-TC-009 — Previous (<) arrow navigates to previous photo
**Priority:** Medium  
**Steps:**
1. Open 2nd+ photo in album
2. Click < arrow

**Expected Result:** Previous photo shown, counter updates

---

### F4-TC-010 — Next (>) arrow navigates to next photo
**Priority:** Medium  
**Steps:**
1. Open photo with more after it
2. Click > arrow

**Expected Result:** Next photo shown, counter updates

---

### F4-TC-011 — "Photo X out of Y" counter is accurate
**Priority:** Low  
**Steps:**
1. Open 2nd of 3 photos
2. Observe counter

**Expected Result:** "Photo 2 out of 3" (or similar format) shown correctly

---

### F4-TC-012 — No download button present (missing feature)
**Priority:** Low  
**Steps:**
1. Open photo detail
2. Look for download button

**Expected Result:** Download button present
**Related Bug:** BUG-050

---

### F4-TC-013 — Photo detail accessible without authentication via direct URL
**Priority:** High  
**Steps:**
1. Copy photo detail URL
2. Open in incognito
3. Observe

**Expected Result:** Redirected to /login
**Related Bug:** BUG-032

---

### F4-TC-014 — Unauthenticated user can browse album via arrows
**Priority:** High  
**Steps:**
1. Open photo detail in incognito
2. Click > arrow

**Expected Result:** Redirected to /login
**Related Bug:** BUG-059

---

---

## FUNCTION 5: Authentication — Login

**Observed UI elements:** "Login" heading left, "Social Login" heading right. Username field ("Enter your email or username"), Password field, LOGIN button (brown). Social icons: Facebook (f), Twitter (bird), Google (G), GitHub (cat icon). "Forgot Your Password? Recover Your Password Here!" link below LOGIN button.

---

### F5-TC-001 — Login page loads with all elements
**Priority:** High  
**Steps:**
1. Navigate to /login
2. Observe

**Expected Result:** Username field, Password field, LOGIN button, 4 social icons, forgot password link visible

---

### F5-TC-002 — Successful login with valid credentials
**Priority:** Critical  
**Steps:**
1. Enter valid username and password
2. Click LOGIN

**Expected Result:** Logged in, menu changes to authenticated state (Profile, Create Album, Log out)

---

### F5-TC-003 — Login with wrong password shows error
**Priority:** High  
**Steps:**
1. Enter valid username, wrong password
2. Click LOGIN

**Expected Result:** Clear error message shown

---

### F5-TC-004 — Login with non-existing username shows error
**Priority:** High  
**Steps:**
1. Enter non-existing username
2. Click LOGIN

**Expected Result:** Error: user not found

---

### F5-TC-005 — Login with empty username field
**Priority:** High  
**Steps:**
1. Leave username empty, enter password
2. Click LOGIN

**Expected Result:** Validation error: "Username and password required" or similar

---

### F5-TC-006 — Login with empty password field
**Priority:** High  
**Steps:**
1. Enter username, leave password empty
2. Click LOGIN

**Expected Result:** Validation error shown

---

### F5-TC-007 — Login with both fields empty
**Priority:** High  
**Steps:**
1. Leave all empty, click LOGIN

**Expected Result:** Validation errors shown

---

### F5-TC-008 — Multiple failed logins trigger account block
**Priority:** High  
**Steps:**
1. Enter valid username with wrong password
2. Repeat 10+ times

**Expected Result:** Warning before block shown, then clear message with unblock instructions
**Related Bug:** BUG-026

---

### F5-TC-009 — Social login — Facebook
**Priority:** Medium  
**Steps:**
1. Click Facebook icon

**Expected Result:** OAuth redirect OR clear configured error (not "undefined: Social login configuration not found")
**Related Bug:** BUG-009

---

### F5-TC-010 — Social login — Twitter
**Priority:** Medium  
**Steps:** Same as F5-TC-009, click Twitter icon
**Related Bug:** BUG-009

---

### F5-TC-011 — Social login — Google
**Priority:** Medium  
**Steps:** Same as F5-TC-009, click Google icon
**Related Bug:** BUG-009

---

### F5-TC-012 — Social login — GitHub
**Priority:** Medium  
**Steps:** Same as F5-TC-009, click GitHub icon
**Related Bug:** BUG-009

---

### F5-TC-013 — "Forgot password" link navigates to recovery page
**Priority:** Medium  
**Steps:**
1. Click "Forgot Your Password? Recover Your Password Here!"

**Expected Result:** Navigated to /passwordRecovery

---

### F5-TC-014 — Authenticated user accessing /login is redirected
**Priority:** Low  
**Steps:**
1. Log in
2. Navigate to /login manually

**Expected Result:** Redirected to /main or /profile
**Related Bug:** BUG-068

---

### F5-TC-015 — Login field accepts email format
**Priority:** Medium  
**Steps:**
1. Enter registered email in username field
2. Enter password, click LOGIN

**Expected Result:** Login successful (field accepts both username and email)

---

---

## FUNCTION 6: Authentication — Register

**Observed UI elements:** Profile image placeholder (hexagon shape) with brown "+" icon bottom-right. "Register" heading. Email field, Username field, Password field, Confirm Password field. REGISTER button (brown, disabled until valid). Footer visible.

---

### F6-TC-001 — Register page loads with all elements
**Priority:** High  
**Steps:**
1. Navigate to /register
2. Observe

**Expected Result:** Profile image placeholder with "+" icon, all 4 fields, REGISTER button visible

---

### F6-TC-002 — REGISTER button disabled until form valid
**Priority:** Medium  
**Steps:**
1. Open /register
2. Observe REGISTER button before filling fields

**Expected Result:** Button appears disabled/greyed out

---

### F6-TC-003 — Successful registration with valid data
**Priority:** Critical  
**Steps:**
1. Enter valid unique email, username, password, confirm password
2. Click REGISTER

**Expected Result:** Success message shown, email confirmation required before login

---

### F6-TC-004 — Registration requires email confirmation
**Priority:** High  
**Steps:**
1. Register successfully
2. Check if confirmation message shown

**Expected Result:** Clear message: "Please confirm your email before logging in"

---

### F6-TC-005 — Registration with invalid email format shows error
**Priority:** High  
**Steps:**
1. Enter "test@test" as email
2. Fill other fields, click REGISTER

**Expected Result:** Validation error: invalid email format
**Related Bug:** BUG-014

---

### F6-TC-006 — Registration with duplicate email shows error
**Priority:** High  
**Steps:**
1. Use already registered email
2. Click REGISTER

**Expected Result:** Error: email already in use

---

### F6-TC-007 — Registration with duplicate username shows error
**Priority:** High  
**Steps:**
1. Use already registered username
2. Click REGISTER

**Expected Result:** Error: username already taken

---

### F6-TC-008 — Registration with mismatched passwords shows error
**Priority:** High  
**Steps:**
1. Enter different Password and Confirm Password
2. Click REGISTER

**Expected Result:** Error: passwords do not match

---

### F6-TC-009 — Registration with empty fields shows validation
**Priority:** High  
**Steps:**
1. Leave all empty, click REGISTER

**Expected Result:** Validation errors shown

---

### F6-TC-010 — Form remains responsive after clicking Confirm Password first
**Priority:** Critical  
**Steps:**
1. Click Confirm Password first
2. Fill all fields
3. Click REGISTER

**Expected Result:** Form works normally
**Related Bug:** BUG-012

---

### F6-TC-011 — Profile image "+" icon opens file dialog
**Priority:** Medium  
**Steps:**
1. Click "+" icon on profile image placeholder

**Expected Result:** File upload dialog opens
**Related Bug:** BUG-013

---

### F6-TC-012 — Whitespace-only username not accepted
**Priority:** Medium  
**Steps:**
1. Enter only spaces in Username field
2. Click REGISTER

**Expected Result:** Validation error: username cannot be empty
**Related Bug:** BUG-048

---

### F6-TC-013 — Enter key in form does not navigate away
**Priority:** High  
**Steps:**
1. Type in Email field, press Enter

**Expected Result:** Focus moves to next field — does not navigate away

---

### F6-TC-014 — Authenticated user accessing /register is redirected
**Priority:** Low  
**Steps:**
1. Log in, navigate to /register

**Expected Result:** Redirected to /main or /profile
**Related Bug:** BUG-040

---

---

## FUNCTION 7: Authentication — Password Recovery

**Observed UI elements:** Lock icon with circular arrows. "Password Recovery" heading. Email field ("Enter your email"). RECOVER PASSWORD button (brown, appears disabled until email entered). Footer visible.

---

### F7-TC-001 — Password Recovery page loads correctly
**Priority:** High  
**Steps:**
1. Navigate to /passwordRecovery
2. Observe

**Expected Result:** Lock icon, heading, email field, RECOVER PASSWORD button visible

---

### F7-TC-002 — RECOVER PASSWORD button disabled until email entered
**Priority:** Medium  
**Steps:**
1. Open page, observe button before typing

**Expected Result:** Button disabled/greyed until email entered

---

### F7-TC-003 — Submit valid registered email shows confirmation
**Priority:** High  
**Steps:**
1. Enter valid registered email
2. Click RECOVER PASSWORD

**Expected Result:** Confirmation message shown

---

### F7-TC-004 — Submit non-existing email shows error
**Priority:** Medium  
**Steps:**
1. Enter non-existing email
2. Click RECOVER PASSWORD

**Expected Result:** Error: "Unknown user" or similar

---

### F7-TC-005 — Submit invalid email format shows format error
**Priority:** Medium  
**Steps:**
1. Enter "test@test"
2. Click RECOVER PASSWORD

**Expected Result:** "Invalid email format" — NOT "Unknown user"
**Related Bug:** BUG-011

---

### F7-TC-006 — Submit empty email shows validation error
**Priority:** Medium  
**Steps:**
1. Leave empty, click RECOVER PASSWORD

**Expected Result:** Validation error

---

### F7-TC-007 — Password reset link opens valid form
**Priority:** Critical  
**Steps:**
1. Complete recovery flow
2. Click link in email

**Expected Result:** Password reset form opens — NOT 404
**Related Bug:** BUG-010

---

### F7-TC-008 — Blocked account recovery path works
**Priority:** Critical  
**Steps:**
1. Block account via failed logins
2. Use password recovery
3. Click reset link

**Expected Result:** Account unblocked, new password can be set
**Related Bug:** BUG-027

---

---

## FUNCTION 7B: Account Activation

**Observed UI elements:** "Welcome to Baasic Web Gallery!" heading. "Do you want to activate your account?" subheading. "Activate Account" button (brown). Footer visible.  
**URL pattern:** /accountActivation/{token}

---

### F7B-TC-001 — Account activation page loads correctly
**Priority:** High  
**Steps:**
1. Register new account with test.user@mailinator.com
2. Open confirmation email
3. Click activation link
4. Observe page

**Expected Result:** "Welcome to Baasic Web Gallery!", "Do you want to activate your account?", "Activate Account" button visible

---

### F7B-TC-002 — Clicking Activate Account button activates account
**Priority:** Critical  
**Steps:**
1. Navigate to activation page via email link
2. Click "Activate Account" button
3. Observe

**Expected Result:** Success message shown and/or redirect to /login

---

### F7B-TC-003 — Activated account can log in
**Priority:** Critical  
**Steps:**
1. Complete activation flow
2. Navigate to /login
3. Enter credentials (test-user / password)
4. Click LOGIN

**Expected Result:** Login successful

---

### F7B-TC-004 — Invalid activation token shows error
**Priority:** Medium  
**Steps:**
1. Navigate to /accountActivation/INVALIDTOKEN123
2. Click "Activate Account"

**Expected Result:** Clear error: activation link invalid or expired
**Related Bug:** BUG-070

---

### F7B-TC-005 — Already used activation token shows error
**Priority:** Medium  
**Steps:**
1. Activate account once
2. Click same activation link again
3. Click "Activate Account"

**Expected Result:** Error: account already activated or link already used

---

---

## FUNCTION 8: User Profile

**Observed UI elements:** CREATE ALBUM button (brown, top-left). Username and album count (top-right, e.g. "kculap — 1 albums"). Album cards in grid. Each card: cover image, username and date on hover overlay, UPLOAD button (bottom-left on hover), DELETE button (bottom-right on hover), album name and photo count below card (e.g. "new albb - 0 photos"). "You have no albums." message when empty.

---

### F8-TC-001 — Profile loads with username and album count
**Priority:** High  
**Steps:**
1. Log in, navigate to /profile/{id}

**Expected Result:** Username and correct album count shown top-right

---

### F8-TC-002 — Empty profile shows "You have no albums."
**Priority:** Medium  
**Steps:**
1. Log in with account with no albums

**Expected Result:** "You have no albums." message shown

---

### F8-TC-003 — Album card visible after creation
**Priority:** High  
**Steps:**
1. Create album with cover
2. Navigate to profile

**Expected Result:** Album card with cover image, album name, photo count visible

---

### F8-TC-004 — Album card shows UPLOAD button on hover
**Priority:** Medium  
**Steps:**
1. Hover over album card

**Expected Result:** UPLOAD button appears bottom-left

---

### F8-TC-005 — Album card shows DELETE button on hover
**Priority:** Medium  
**Steps:**
1. Hover over album card

**Expected Result:** DELETE button appears bottom-right

---

### F8-TC-006 — UPLOAD on hover opens cover image upload
**Priority:** Medium  
**Steps:**
1. Hover album, click UPLOAD

**Expected Result:** Navigates to /photo/upload/{albumId}/true

---

### F8-TC-007 — DELETE on hover shows confirmation dialog before removing album
**Priority:** High  
**Steps:**
1. Hover album card
2. Click DELETE
3. Observe dialog
4. Click DELETE to confirm
5. Observe album removed

**Expected Result:** Confirmation dialog shown: "Warning! Are you sure you want to delete album {name}?" with DELETE and CANCEL buttons. After confirmation, album removed from profile.

---

### F8-TC-008 — Album count updates after creating album
**Priority:** Medium  
**Steps:**
1. Note count, create album, check profile

**Expected Result:** Count incremented

---

### F8-TC-009 — Album count updates after deleting album
**Priority:** Medium  
**Steps:**
1. Delete album, check profile

**Expected Result:** Count decremented

---

### F8-TC-010 — Clicking album cover navigates to album detail
**Priority:** High  
**Steps:**
1. Click on album cover image

**Expected Result:** Navigated to /album/detail/{albumId}

---

### F8-TC-011 — CREATE ALBUM button navigates to album creation
**Priority:** Medium  
**Steps:**
1. Click CREATE ALBUM button on profile

**Expected Result:** Navigated to /album/create

---

### F8-TC-012 — Profile not accessible when logged out
**Priority:** High  
**Steps:**
1. Log out, navigate to /profile/{id}

**Expected Result:** Redirected to /login

---

---

## FUNCTION 9: Create Album — Step 1

**Observed UI elements:** Album image placeholder icon (3 stacked images). "Create new album" heading. Album Name field (required). Description textarea (optional). BACK button (brown, left). SAVE ALBUM button (brown/grey, right — appears disabled until name entered).

---

### F9-TC-001 — Create Album page loads correctly
**Priority:** High  
**Steps:**
1. Navigate to /album/create
2. Observe

**Expected Result:** Album icon, heading, Album Name field, Description field, BACK and SAVE ALBUM buttons visible

---

### F9-TC-002 — SAVE ALBUM disabled until name entered
**Priority:** Medium  
**Steps:**
1. Open /album/create
2. Observe SAVE ALBUM before typing

**Expected Result:** Button disabled/greyed until name entered

---

### F9-TC-003 — Create album with valid name and description
**Priority:** Critical  
**Steps:**
1. Enter valid name and description
2. Click SAVE ALBUM

**Expected Result:** "Almost done!" page shown

---

### F9-TC-004 — Create album with name only (no description)
**Priority:** Medium  
**Steps:**
1. Enter name only, click SAVE ALBUM

**Expected Result:** Proceeds to step 2 — description optional

---

### F9-TC-005 — Create album with empty name shows error
**Priority:** High  
**Steps:**
1. Leave name empty, click SAVE ALBUM

**Expected Result:** Validation error: name required

---

### F9-TC-006 — Enter key in Album Name does not navigate back
**Priority:** Critical  
**Steps:**
1. Type name, press Enter

**Expected Result:** Saves or moves to Description — does NOT navigate back
**Related Bug:** BUG-023

---

### F9-TC-007 — BACK button returns to profile
**Priority:** Medium  
**Steps:**
1. Click BACK

**Expected Result:** Returns to profile page

---

### F9-TC-008 — Whitespace-only album name not accepted
**Priority:** Medium  
**Steps:**
1. Enter only spaces in Album Name
2. Click SAVE ALBUM

**Expected Result:** Validation error
**Related Bug:** BUG-048

---

### F9-TC-009 — Very long album name shows validation error
**Priority:** Medium  
**Steps:**
1. Enter 1000+ char name
2. Click SAVE ALBUM

**Expected Result:** Clear validation error: name too long

---

### F9-TC-010 — Album name with emoji
**Priority:** Medium  
**Steps:**
1. Enter "🔥" as name
2. Complete album creation

**Expected Result:** Emoji displayed correctly in album

---

---

## FUNCTION 10: Create Album — Step 2 ("Almost done!")

**Observed UI elements:** "Almost done!" heading. Dashed-border upload area with camera icon and "Click to upload cover image" text. Red warning: "Album is not created until you upload a cover image." Album preview below showing name, "0 photos", "Created by on {date} - Last updated on {date}", "Album description:" (empty if no description).

---

### F10-TC-001 — "Almost done!" page loads after step 1
**Priority:** Critical  
**Steps:**
1. Complete step 1 with valid name
2. Observe

**Expected Result:** Cover upload area visible with warning message and album preview

---

### F10-TC-002 — Warning message visible
**Priority:** Medium  
**Steps:**
1. Observe "Almost done!" page

**Expected Result:** Red text "Album is not created until you upload a cover image." visible

---

### F10-TC-003 — Album preview shows correct name and date
**Priority:** Medium  
**Steps:**
1. Complete step 1 with name "Test Album"
2. Observe preview on step 2

**Expected Result:** "Test Album - 0 photos", correct creation date shown

---

### F10-TC-004 — Clicking upload area opens file picker
**Priority:** Critical  
**Steps:**
1. Click dashed upload area or camera icon

**Expected Result:** File picker dialog opens

---

### F10-TC-005 — Uploading cover image completes album creation
**Priority:** Critical  
**Steps:**
1. Click upload area
2. Select valid JPG image

**Expected Result:** Album created with cover, visible on profile

---

### F10-TC-006 — Album not created without cover image
**Priority:** High  
**Steps:**
1. Complete step 1, navigate away without cover
2. Check profile

**Expected Result:** Album not visible on profile

---

### F10-TC-007 — "Album description:" empty when no description provided
**Priority:** Low  
**Steps:**
1. Create album with no description
2. Observe step 2 preview

**Expected Result:** "Album description: No description available" or label hidden
**Related Bug:** BUG-035

---

---

## FUNCTION 11: Album Detail

**Observed UI elements:** GO BACK TO ALBUMS button (brown, top-right). Album header: "{name} - {X} photos" (left), UPLOAD PHOTO button (brown, right). "Created by {username} on {date} - Last updated on {date}". "Album description: {text}". Photo grid below. On hover: username and date overlay (top), eye icon (center), DELETE button (bottom-right).

---

### F11-TC-001 — Album detail loads with all elements
**Priority:** High  
**Steps:**
1. Click album cover from profile
2. Observe

**Expected Result:** Album name, photo count, creator info, dates, description, GO BACK TO ALBUMS, UPLOAD PHOTO buttons visible

---

### F11-TC-002 — Empty album shows "0 photos" with no grid
**Priority:** Medium  
**Steps:**
1. Open album with no photos

**Expected Result:** "new albb - 0 photos" in header, no images shown

---

### F11-TC-003 — Photos visible after upload
**Priority:** High  
**Steps:**
1. Upload photos, open album

**Expected Result:** Photos displayed in grid

---

### F11-TC-004 — Hover on photo shows username, date and eye icon
**Priority:** Medium  
**Steps:**
1. Hover over photo card

**Expected Result:** Username and date overlay (top), eye icon (center) visible

---

### F11-TC-005 — Hover on photo shows DELETE button
**Priority:** Medium  
**Steps:**
1. Hover over photo card

**Expected Result:** DELETE button appears bottom-right

---

### F11-TC-006 — Eye icon opens photo detail
**Priority:** High  
**Steps:**
1. Hover photo, click eye icon

**Expected Result:** Photo detail page opens

---

### F11-TC-007 — DELETE photo shows confirmation dialog before removing
**Priority:** Medium  
**Steps:**
1. Hover photo card
2. Click DELETE
3. Observe dialog
4. Click DELETE to confirm

**Expected Result:** Confirmation dialog shown with DELETE and CANCEL buttons. After confirmation, photo removed from album.

---

### F11-TC-008 — DELETE photo removes it from album
**Priority:** High  
**Steps:**
1. Confirm deletion

**Expected Result:** Photo removed from grid

---

### F11-TC-009 — Photo count updates immediately after delete
**Priority:** Critical  
**Steps:**
1. Delete photo, observe header count immediately

**Expected Result:** Count decrements without page refresh
**Related Bug:** BUG-016

---

### F11-TC-010 — UPLOAD PHOTO navigates to photo upload
**Priority:** High  
**Steps:**
1. Click UPLOAD PHOTO

**Expected Result:** Navigated to /photo/upload/{albumId}/false

---

### F11-TC-011 — All photos open without 404
**Priority:** Critical  
**Steps:**
1. Upload 3+ photos
2. Click each one

**Expected Result:** All open in detail view — none return 404
**Related Bug:** BUG-015

---

### F11-TC-012 — GO BACK TO ALBUMS returns to profile
**Priority:** Medium  
**Steps:**
1. Click GO BACK TO ALBUMS

**Expected Result:** Returns to /profile/{userId}

---

### F11-TC-013 — Album detail not accessible when logged out
**Priority:** High  
**Steps:**
1. Log out, navigate to /album/detail/{id}

**Expected Result:** Redirected to /login

---

---

## FUNCTION 12: Photo Upload

**Observed UI elements:** Dark top section. Green "UPLOAD IMAGE" button (center, with upload icon). Photo Name field (short input). Description textarea. UPLOAD button (grey/disabled until image selected and name filled). After image selected: preview shown above form. Footer visible.

---

### F12-TC-001 — Photo upload page loads correctly
**Priority:** High  
**Steps:**
1. Navigate to photo upload
2. Observe

**Expected Result:** Green UPLOAD IMAGE button, Photo Name field, Description field, UPLOAD button (disabled) visible

---

### F12-TC-002 — UPLOAD IMAGE button opens file picker
**Priority:** High  
**Steps:**
1. Click green UPLOAD IMAGE button

**Expected Result:** File picker opens

---

### F12-TC-003 — File picker shows all file types (missing accept filter)
**Priority:** Medium  
**Steps:**
1. Click UPLOAD IMAGE
2. Observe file picker

**Expected Result:** Only image files selectable
**Related Bug:** BUG-054

---

### F12-TC-004 — Selected image preview shown above form
**Priority:** Medium  
**Steps:**
1. Select valid image

**Expected Result:** Preview of selected image shown above the form

---

### F12-TC-005 — UPLOAD button activates after image AND name provided
**Priority:** Medium  
**Steps:**
1. Select image and enter name
2. Observe UPLOAD button

**Expected Result:** Button becomes active/enabled

---

### F12-TC-006 — Upload valid JPG successfully
**Priority:** Critical  
**Steps:**
1. Select JPG ~2MB, enter name, click UPLOAD

**Expected Result:** Upload succeeds, photo appears in album

---

### F12-TC-007 — Upload valid PNG successfully
**Priority:** High  
**Steps:**
1. Select PNG ~2MB, enter name, click UPLOAD

**Expected Result:** Upload succeeds

---

### F12-TC-008 — Upload GIF shows format error
**Priority:** Medium  
**Steps:**
1. Select GIF, click UPLOAD

**Expected Result:** Clear error listing all accepted formats (JPG, PNG)
**Related Bug:** BUG-044

---

### F12-TC-009 — Upload WebP shows format error
**Priority:** Medium  
**Steps:**
1. Select WebP, click UPLOAD

**Expected Result:** Clear error listing all accepted formats
**Related Bug:** BUG-044

---

### F12-TC-010 — Upload with empty Photo Name shows error
**Priority:** High  
**Steps:**
1. Select image, leave name empty, click UPLOAD

**Expected Result:** Validation error: name required

---

### F12-TC-011 — Upload with whitespace-only name not accepted
**Priority:** Medium  
**Steps:**
1. Enter only spaces in Photo Name, click UPLOAD

**Expected Result:** Validation error
**Related Bug:** BUG-048

---

### F12-TC-012 — Upload duplicate name shows clear error
**Priority:** Medium  
**Steps:**
1. Upload two photos with same name

**Expected Result:** Error: name already exists

---

### F12-TC-013 — Upload large file (~20MB) shows file size error
**Priority:** Critical  
**Steps:**
1. Select ~20MB file, click UPLOAD

**Expected Result:** Error: "File too large" — NOT "Name already taken"
**Related Bug:** BUG-017

---

### F12-TC-014 — Upload with very long name shows length error
**Priority:** High  
**Steps:**
1. Enter 1000-word Lorem Ipsum as name, click UPLOAD

**Expected Result:** Error: name too long — NOT "Name already exists"
**Related Bug:** BUG-018

---

### F12-TC-015 — Upload with emoji name displays correctly
**Priority:** Medium  
**Steps:**
1. Enter "🔥" as name, upload, open detail

**Expected Result:** Emoji displayed — NOT "No available name"
**Related Bug:** BUG-020

---

### F12-TC-016 — Upload with special characters in name
**Priority:** Medium  
**Steps:**
1. Enter "#$%&/()=?*" as name, click UPLOAD

**Expected Result:** Clear error: invalid characters — NOT "Name already taken"
**Related Bug:** BUG-021

---

### F12-TC-017 — Upload with long description displays correctly
**Priority:** Medium  
**Steps:**
1. Enter 1000-word Lorem Ipsum in Description, upload, open detail

**Expected Result:** Description displayed — NOT "No description available"
**Related Bug:** BUG-019

---

### F12-TC-018 — Upload with whitespace-only description
**Priority:** Low  
**Steps:**
1. Enter only spaces in Description, upload, open detail

**Expected Result:** "No description available" shown as fallback
**Related Bug:** BUG-048

---

### F12-TC-019 — Upload with HTML tags in name
**Priority:** Medium  
**Steps:**
1. Enter `<h1>test</h1>` as name, upload, open detail

**Expected Result:** Either rejected OR displayed as escaped text `<h1>test</h1>`
**Related Bug:** BUG-047

---

### F12-TC-020 — No loading indicator during upload (missing feature)
**Priority:** Medium  
**Steps:**
1. Upload ~5MB image, observe UI during upload

**Expected Result:** Loading indicator or disabled button state visible
**Related Bug:** BUG-030

---

### F12-TC-021 — Upload fails gracefully when internet lost
**Priority:** High  
**Steps:**
1. Start upload, disconnect internet
2. Observe

**Expected Result:** Clear error: "Upload failed. Check your connection." — NOT 404
**Related Bug:** BUG-043

---

### F12-TC-022 — Deleted photo no longer visible on Home page
**Priority:** Medium  
**Steps:**
1. Upload photo, delete it, go to Home

**Expected Result:** Deleted photo not in gallery
**Related Bug:** BUG-022

---

---

## FUNCTION 13: Responsive Design & Cross-device

---

### F13-TC-001 — App fully functional on Chrome desktop
**Priority:** Critical  
**Steps:** Use all features in Chrome

**Expected Result:** All features work

---

### F13-TC-002 — App loads on Firefox desktop
**Priority:** High  
**Steps:** Open app in Firefox

**Expected Result:** App loads and functions

---

### F13-TC-003 — Scroll icon works on Chrome mobile emulation (iPhone 12)
**Priority:** High  
**Steps:**
1. DevTools → iPhone 12
2. Tap scroll icon

**Expected Result:** Gallery loads
**Related Bug:** BUG-005

---

### F13-TC-004 — Scroll icon works on real device (Honor 90)
**Priority:** High  
**Steps:**
1. Open on Honor 90
2. Tap scroll icon

**Expected Result:** Gallery loads
**Related Bug:** BUG-005

---

### F13-TC-005 — Images centered on Samsung Galaxy S20 Ultra emulation
**Priority:** Medium  
**Steps:**
1. DevTools → Samsung Galaxy S20 Ultra
2. Search, open image detail

**Expected Result:** Images centered — no left shift
**Related Bug:** BUG-004

---

### F13-TC-006 — All pages responsive on mobile emulation
**Priority:** Medium  
**Steps:**
1. Navigate all pages on iPhone 12 emulation

**Expected Result:** No overflow, layout adapts

---

### F13-TC-007 — App renders on real mobile device
**Priority:** High  
**Steps:**
1. Open URL on real phone

**Expected Result:** App visible and functional

---

### F13-TC-008 — Forms usable on mobile (touch inputs)
**Priority:** Medium  
**Steps:**
1. Navigate to /login on mobile emulation
2. Tap each field, enter data

**Expected Result:** All fields focusable, keyboard appears

---

---

## 6. Test Coverage Summary

| Functionality | TCs | Critical | High | Medium | Low |
|--------------|-----|----------|------|--------|-----|
| F1: Homepage & Hero | 15 | 2 | 2 | 4 | 7 |
| F2: Navigation (MENU) | 14 | 3 | 5 | 5 | 1 |
| F3: Search | 15 | 3 | 5 | 5 | 2 |
| F4: Photo Detail | 14 | 3 | 4 | 5 | 2 |
| F5: Login | 15 | 2 | 7 | 5 | 1 |
| F6: Register | 14 | 2 | 7 | 4 | 1 |
| F7: Password Recovery | 8 | 2 | 2 | 4 | 0 |
| F8: Profile | 12 | 0 | 6 | 5 | 1 |
| F9: Create Album Step 1 | 10 | 2 | 3 | 4 | 1 |
| F10: Create Album Step 2 | 7 | 2 | 1 | 3 | 1 |
| F11: Album Detail | 13 | 2 | 6 | 4 | 1 |
| F12: Photo Upload | 22 | 3 | 7 | 10 | 2 |
| F13: Responsive | 8 | 1 | 4 | 3 | 0 |
| **TOTAL** | **167** | **27** | **59** | **61** | **20** |

---

## 7. Known Bugs Cross-Reference

| Bug ID | Title (short) | TC(s) |
|--------|--------------|-------|
| BUG-002 | Gallery state lost after close | F4-TC-007, F4-TC-008 |
| BUG-003 | Non-functional footer link | F1-TC-012 |
| BUG-004 | Image alignment mobile | F13-TC-005 |
| BUG-005 | Scroll icon not working Honor 90 | F13-TC-004 |
| BUG-006 | "/" in search causes 404 | F3-TC-008 |
| BUG-007 | Whitespace search crashes | F3-TC-007 |
| BUG-008 | Menu close redirects Home | F2-TC-004, F2-TC-005 |
| BUG-009 | Social login not working | F5-TC-009 to F5-TC-012 |
| BUG-010 | Password reset 404 | F7-TC-007 |
| BUG-011 | Wrong error invalid email recovery | F7-TC-005 |
| BUG-012 | Register form freezes | F6-TC-010 |
| BUG-013 | Profile "+" icon does nothing | F6-TC-011 |
| BUG-014 | No feedback invalid email register | F6-TC-005 |
| BUG-015 | Album images return 404 | F11-TC-011 |
| BUG-016 | Image count not updated | F11-TC-009 |
| BUG-017 | Large file wrong error | F12-TC-013 |
| BUG-018 | Long name wrong error | F12-TC-014 |
| BUG-019 | Long description not shown | F12-TC-017 |
| BUG-020 | Emoji name not shown | F12-TC-015 |
| BUG-021 | Special chars 409 wrong error | F12-TC-016 |
| BUG-022 | Deleted image still on Home | F12-TC-022 |
| BUG-023 | Enter in album name navigates back | F9-TC-006 |
| BUG-026 | Account blocked no guidance | F5-TC-008 |
| BUG-027 | Blocked account no recovery | F7-TC-008 |
| BUG-028 | No confirmation delete album | F8-TC-007 |
| BUG-029 | No confirmation delete photo | F11-TC-007 |
| BUG-030 | No loading indicator upload | F12-TC-020 |
| BUG-032 | Photo detail public without auth | F4-TC-013 |
| BUG-033 | No back nav on search results | F3-TC-015 |
| BUG-035 | Empty album description | F10-TC-007 |
| BUG-040 | /register accessible when logged in | F6-TC-014 |
| BUG-041 | Menu not keyboard navigable | F2-TC-007 |
| BUG-043 | Upload fails offline — 404 | F12-TC-021 |
| BUG-044 | GIF/WebP wrong error | F12-TC-008, F12-TC-009 |
| BUG-047 | HTML tags garbled in name | F12-TC-019 |
| BUG-048 | Whitespace accepted all fields | F6-TC-012, F9-TC-008, F12-TC-011 |
| BUG-050 | No download button | F4-TC-012 |
| BUG-054 | No accept filter on file input | F12-TC-003 |
| BUG-055 | Wrong browser tab title | F1-TC-014 |
| BUG-056 | No favicon | F1-TC-015 |
| BUG-059 | Album browsable via arrows anon | F4-TC-014 |
| BUG-068 | /login accessible when logged in | F5-TC-014 |

---

## 8. Out of Scope

- Backend/API performance and load testing
- Security penetration testing beyond input validation
- Accessibility (WCAG) compliance testing
- Email delivery reliability testing
- Cross-browser testing beyond Chrome and Firefox

---

## 9. Exit Criteria

- All Critical priority test cases executed
- All High priority test cases executed
- All Critical and High severity bugs documented with attachments
- Test results recorded for all failed cases