# ADDITIONAL BUGS — Photo Gallery Starter Kit

**Application:** https://demo.baasic.com/angular/starterkit-photo-gallery/main  
**Prepared by:** Katarina Ćulap  
**Method:** AI-assisted (Claude)  
**Date:** March 2026  
**Environment:** Google Chrome (latest), Windows

> All bugs in this document were identified with AI assistance (Claude) and are tagged **[AI-assisted]**.  
> Manually found bugs (BUG-001 to BUG-023) are documented in BUG_REPORT.md.  
> None of the bugs below duplicate or overlap with manually found bugs.

---

# BUG-024 [AI-assisted]

**Title:** Search With URL-Reserved Characters Breaks Routing — Broader Pattern Beyond "/"

**Severity:** High  
**Priority:** High  
**Type:** Functional / Security

**Description:**  
BUG-006 confirmed that entering "/" in the search field causes a 404 error because the application appends user input directly into the URL route without encoding (`/photo/search/{keyword}`). The same vulnerability affects all other URL-reserved characters: `?`, `#`, `&`. Each of these has special meaning in URLs and can break routing or corrupt application state.

**Steps to Reproduce:**
1. Open the Home page
2. Click the search icon
3. Enter `?test` and press Enter — observe URL and behavior
4. Repeat with `#test`
5. Repeat with `&test`

**Expected Result:**  
Input is URL-encoded before being inserted into the route. All inputs handled safely — results or "no results" shown, no 404 or routing failure.

**Actual Result (expected based on BUG-006 pattern):**  
Application navigates to malformed URL and shows 404 or crashes.

**Test Data:** `?test`, `#test`, `&test`

**Console Error (expected):**  
`Cannot match any routes. URL Segment: 'photo/search/?test'`

**Root Cause:**  
Angular router receives raw user input as route parameter without `encodeURIComponent()` applied first.

**Related Bug:** BUG-006

---

# BUG-025 [AI-assisted]

**Title:** XSS Vulnerability — Script Tag in Search Input May Be Reflected in DOM

**Severity:** Critical  
**Priority:** High  
**Type:** Security

**Description:**  
Since the search keyword is appended directly to the URL route and rendered in the "Search result for: '{keyword}'" heading, a script tag or HTML injection payload entered in the search field may be reflected in the DOM without sanitization.

**Steps to Reproduce:**
1. Open the Home page
2. Click search icon
3. Enter: `<script>alert('xss')</script>`
4. Press Enter
5. Observe: does any dialog appear? Inspect DOM for unescaped tags.
6. Also try: `<img src=x onerror=alert('xss2')>`

**Expected Result:**  
Input treated as plain text. Tags escaped in DOM (`&lt;script&gt;`). No script executes.

**Actual Result (to be verified):**  
Script may execute or raw HTML rendered in heading/DOM.

**Test Data:**  
`<script>alert('xss')</script>`, `<img src=x onerror=alert('xss2')>`

---

# BUG-026 [AI-assisted]

**Title:** No Rate Limiting on Login — Account Blocked With No User Guidance

**Severity:** High  
**Priority:** High  
**Type:** Security / UX

**Description:**  
After multiple failed login attempts, the backend blocks the account and displays "User blocked". However:
- No warning shown before block (e.g. "2 attempts remaining")
- No information on how many attempts trigger the block
- No timeout displayed ("your account will be unblocked in X minutes")
- No self-service unblock mechanism visible in UI

**Steps to Reproduce:**
1. Navigate to /login
2. Enter a valid username "test-user2"
3. Enter incorrect password repeatedly "wrongpassword"
4. Observe error message change to "User blocked"
5. Try logging in with correct password — still blocked

**Expected Result:**  
Warning shown before block. On block: "Your account has been temporarily locked. Please try again in 15 minutes or reset your password." with self-service unblock option.

**Actual Result:**  
"User blocked" shown with no guidance, no timeout, no recovery path visible.


---

# BUG-027 [AI-assisted]

**Title:** Blocked Account Has No Recovery Path — Password Recovery Also Non-Functional

**Severity:** Critical  
**Priority:** High  
**Type:** Functional / Security

**Description:**  
When a user account is blocked (BUG-026), the only apparent recovery option is password recovery. However, since password reset links lead to a 404 page (BUG-010), the recovery flow is also broken. A blocked user has absolutely no way to regain account access without admin intervention.

**Steps to Reproduce:**
1. Trigger account block by entering wrong password multiple times (BUG-026)
2. Navigate to /passwordRecovery
3. Enter blocked account's email, click RECOVER PASSWORD
4. Open received email, click reset link
5. Observe — 404 page shown (BUG-010)
6. Attempt login again — still blocked

**Expected Result:**  
Password recovery resets account and unblocks it, allowing user to set new password and log in.

**Actual Result:**  
Recovery email sent but reset link leads to 404. Account remains blocked. No recovery path.

**Impact:** Critical — legitimate users permanently locked out with no self-service solution.

**Related Bugs:** BUG-010, BUG-026

---

# BUG-028 [AI-assisted]

**Title:** No Loading Indicator During Image Upload

**Severity:** Medium  
**Priority:** Medium  
**Type:** UX

**Description:**  
During image upload, no loading indicator, spinner, or progress bar is shown. The UPLOAD button remains active and clickable throughout the upload process, potentially leading to multiple submissions.

**Steps to Reproduce:**
1. Log in, navigate to photo upload
2. Select a moderately large image (~5MB)
3. Enter a name and click UPLOAD
4. Observe UI during upload process

**Expected Result:**  
Loading indicator visible. UPLOAD button disabled until upload completes or fails.

**Actual Result:**  
No visual feedback — button remains active, no progress shown.

---

# BUG-029 [AI-assisted]

**Title:** Photo Detail and Album Content Accessible Without Authentication via Direct URL

**Severity:** High  
**Priority:** High  
**Type:** Security / Functional

**Description:**  
Photo detail pages are publicly accessible via direct URL without authentication. Once an unauthenticated user opens a photo detail page, they can use the previous/next navigation arrows to browse all other photos in the same album — bypassing album-level access control entirely.

**Steps to Reproduce:**
1. Log in and open any photo detail page from an album
2. Copy the photo detail URL
3. Open incognito window and paste the URL
4. Observe — photo visible without login
5. Click > (next) arrow — next photo in album loads without authentication
6. Continue clicking to browse all album photos

**Expected Result:**  
Photo detail page not accessible without authentication. Unauthenticated user redirected to /login.

**Actual Result:**  
All photos in album browsable via navigation arrows without logging in.

---

# BUG-030 [AI-assisted]

**Title:** Search Results Page Has No Navigation Back to Gallery

**Severity:** Low  
**Priority:** Low  
**Type:** UX

**Description:**  
After performing a search, the results page (`/photo/search/{keyword}`) has no "Back to Gallery" button or breadcrumb. The only way back is browser Back button or hamburger menu — but BUG-008 means closing the menu redirects to Home, leaving no reliable path back to gallery.

**Steps to Reproduce:**
1. Search for "photo"
2. Observe search results page
3. Look for any navigation element to return to gallery
4. Try using hamburger menu to go back

**Expected Result:**  
Visible "Back to Gallery" button or breadcrumb on search results page.

**Actual Result:**  
No dedicated back navigation. Browser back is the only reliable option.

**Related Bug:** BUG-008

---

# BUG-031 [AI-assisted]

**Title:** Root Cause Pattern — Generic Error Handler Returns Wrong Validation Messages

**Severity:** High  
**Priority:** High  
**Type:** Functional / Root Cause Analysis

**Description:**  
Three manually found bugs share a common root cause: the frontend uses a single generic error handler that maps multiple distinct server-side failures to the same incorrect UI message.

**Affected bugs:**
- **BUG-017:** Large file upload (~20MB) → shows "Name already taken" (should be "File too large")
- **BUG-018:** Very long image name → shows "Name already exists" (should be "Name too long")
- **BUG-021:** Special characters in name → shows "Name already taken" with 409 Conflict (should be "Invalid characters")

**Root Cause Hypothesis:**  
The frontend error handler reads only a generic message field rather than parsing the specific HTTP error code (400 vs 409 vs 413). Fix: implement error-type-specific message mapping.

**Related Bugs:** BUG-017, BUG-018, BUG-021

---

# BUG-032 [AI-assisted]

**Title:** No Character Limit on Photo Name and Album Name Input Fields

**Severity:** Medium  
**Priority:** Medium  
**Type:** Functional / Validation

**Description:**  
DevTools inspection confirms that both Album Name and Photo Name inputs have no `maxlength` attribute. Users can enter unlimited characters with no frontend restriction, which directly causes BUG-018 (wrong error on long name).

**DevTools confirmation:**
- `<input id="albumName" type="text">` — no `maxlength`
- `<input id="photoName" type="text">` — no `maxlength`

**Expected Result:**  
Both fields have appropriate `maxlength` with visible character counter.

**Actual Result:**  
No limit — unlimited input accepted, only rejected server-side with incorrect error.

**Related Bugs:** BUG-018, BUG-021

---

# BUG-033 [AI-assisted]

**Title:** Authenticated User Can Access /register and /login Pages Without Redirect

**Severity:** Low  
**Priority:** Low  
**Type:** Functional / UX

**Description:**  
When a logged-in user navigates directly to /register or /login, these pages load normally without redirecting the authenticated user. Missing route guards on public auth pages — inconsistent with /album/create and /profile which correctly redirect unauthenticated users.

**Steps to Reproduce:**
1. Log in with username "test-user2" and password "password" 
2. Manually navigate to /register
3. Observe — register page loads, no redirect
4. Repeat with /login

**Expected Result:**  
Logged-in user redirected to /main or /profile.

**Actual Result:**  
/register and /login load normally for authenticated users.

---

# BUG-034 [AI-assisted]

**Title:** Hamburger Menu Not Keyboard Navigable — Tab Key Does Not Move Focus Between Menu Items

**Severity:** Medium  
**Priority:** Medium  
**Type:** Functional / UX

**Description:**  
When the logo menu is open, pressing Tab does not move focus between menu items. Menu links are not reachable via keyboard navigation.

**Steps to Reproduce:**
1. Click logo menu icon
2. Press Tab repeatedly
3. Observe — focus does not move to Home, Login, Register links

**Expected Result:**  
Tab cycles through menu items with visible focus indicator.

**Actual Result:**  
Tab does not move focus to menu items.

---

# BUG-035 [AI-assisted]

**Title:** Application Shows 404 and Becomes Unresponsive When Internet Connection Lost During Upload

**Severity:** High  
**Priority:** High  
**Type:** Functional / UX

**Description:**  
When internet connection is lost during image upload, the application navigates to a 404 page. Navigating to the hamburger menu afterward causes the app to become unresponsive. No offline error message or retry mechanism exists.

**Steps to Reproduce:**
1. Log in and navigate to photo upload
2. Select valid image, enter name "photo-name22", click UPLOAD
3. Immediately disable internet connection
4. Observe — 404 page shown
5. Try opening hamburger menu — app becomes unresponsive

**Expected Result:**  
Clear error: "Upload failed. Please check your internet connection and try again." App remains functional.

**Actual Result:**  
404 page shown. Menu becomes unresponsive. No network error indication.

---

# BUG-036 [AI-assisted]

**Title:** No "Home" Link in Authenticated Navigation Menu

**Severity:** Medium  
**Priority:** Medium  
**Type:** UX / Navigation

**Description:**  
When logged in, the hamburger menu shows Profile, Create Album, Log out — but no "Home" or "Gallery" link. The only way back to the homepage is clicking the logo, which is not intuitive.

**Steps to Reproduce:**
1. Log in
2. Navigate to any page (e.g. /album/create)
3. Open hamburger menu
4. Look for "Home" or "Gallery" link

**Expected Result:**  
Authenticated menu includes "Home" or "Gallery" link.

**Actual Result:**  
No Home link in authenticated menu. Logo click is the only navigation path back to gallery.

---

# BUG-037 [AI-assisted]

**Title:** Deleting Image While Open in Another Tab Causes 404

**Severity:** Medium  
**Priority:** Medium  
**Type:** Functional

**Description:**  
When the same album is open in two browser tabs and a photo is deleted in one tab, interacting with that photo in the other tab results in a 404 page with no meaningful error or navigation back.

**Steps to Reproduce:**
1. Open album with photos in two browser tabs
2. In tab 1: delete a photo
3. In tab 2: click on the deleted photo
4. Observe — 404 page shown

**Expected Result:**  
Meaningful error: "This photo no longer exists." with navigation back to album.

**Actual Result:**  
404 page with no context or navigation.

---

# BUG-038 [AI-assisted]

**Title:** HTML Tags in Photo Name Are Stripped Incorrectly — Garbled Output With No Warning

**Severity:** Medium  
**Priority:** Medium  
**Type:** Security / Functional

**Description:**  
When HTML tags are entered in Photo Name (e.g. `<h1>test</h1>`), tags are stripped but output is garbled — displays as "h1testh1" with no spaces or separators, and no frontend warning that HTML is not allowed.

**Steps to Reproduce:**
1. Navigate to photo upload
2. In Photo Name enter: `<h1>test</h1>`
3. Upload valid image
4. Open photo detail view
5. Observe displayed name

**Expected Result:**  
Input rejected with clear error "HTML tags not allowed" OR escaped and displayed as plain text `<h1>test</h1>`.

**Actual Result:**  
Tags stripped, inner text concatenated — displays as "h1testh1". No user warning.

**Test Data:** Photo Name: `<h1>test</h1>`

---

# BUG-039 [AI-assisted]

**Title:** Whitespace-Only Input Accepted Across All Fields — Stored as "-" or "No Name Available"

**Severity:** Medium  
**Priority:** Medium  
**Type:** Functional / Validation

**Description:**  
Whitespace-only input is accepted across multiple fields without frontend validation:
- **Username:** Accepted, stored/displayed as "-"
- **Photo Name:** Accepted, detail view shows "No name available"
- **Album Name:** Accepted, stored/displayed as "-"

This is a consistent pattern of missing whitespace trimming across the entire application.

**Steps to Reproduce:**
1. Navigate to /register, enter only spaces in Username field, complete registration → username shows as "-"
2. Navigate to photo upload, enter only spaces in Photo Name, upload → detail shows "No name available"
3. Navigate to /album/create, enter only spaces in Album Name, save → album name shows as "-"

**Expected Result:**  
Frontend trims and validates whitespace. Error: "This field cannot be empty or contain only spaces."

**Actual Result:**  
All three fields accept whitespace-only input. Stored with garbled/fallback values.

---

# BUG-040 [AI-assisted]

**Title:** Cover Image Upload Area Has No File Type, Size, or Dimension Guidance

**Severity:** Low  
**Priority:** Low  
**Type:** UX

**Description:**  
The "Almost done!" page after album creation shows only "Click to upload cover image" text with no guidance on accepted formats, maximum file size, or recommended dimensions.

**Steps to Reproduce:**
1. Create an album (step 1)
2. Observe the "Almost done!" cover upload area
3. Look for format, size, or dimension guidance

**Expected Result:**  
Upload area shows: "Accepted formats: JPG, PNG. Max size: 5MB."

**Actual Result:**  
Only "Click to upload cover image" — no format, size, or dimension information.

---

# BUG-041 [AI-assisted]

**Title:** All Input Fields Have autocomplete="off" — Consistent Misuse Across Application

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Security

**Description:**  
DevTools inspection confirms `autocomplete="off"` is set on all major input fields: Login password, Register password, Register confirm password, Album Name, Photo Name. This prevents password managers from working correctly and appears to be an indiscriminate default template setting.

**DevTools confirmation:**
- Login `password` → `autocomplete="off"`
- Register `password` → `autocomplete="off"`
- Register `confirmPassword` → `autocomplete="off"`
- `albumName` → `autocomplete="off"`
- `photoName` → `autocomplete="off"`

**Expected Result:**  
Password fields: `autocomplete="current-password"` (login) and `autocomplete="new-password"` (register). Text fields: intentional per-field configuration.

**Actual Result:**  
`autocomplete="off"` applied to all fields indiscriminately.

---

# BUG-042 [AI-assisted]

**Title:** Browser Tab Title Shows Internal Project Name

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Branding

**Description:**  
The browser tab displays "baasic-starterkit-angular-blog" — the internal development project name — instead of a meaningful application name. Visible in browser tab, bookmarks, and history.

**Steps to Reproduce:**
1. Open the application in any browser
2. Observe browser tab title

**Expected Result:**  
Tab shows meaningful name (e.g. "Photo Gallery").

**Actual Result:**  
Tab shows "baasic-starterkit-angular-blog".

---

# BUG-043 [AI-assisted]

**Title:** Application Has No Favicon

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Branding

**Description:**  
The application has no favicon configured. Browsers display a generic placeholder icon in the tab, bookmarks, and history.

**Steps to Reproduce:**
1. Open the application in any browser
2. Observe browser tab icon

**Expected Result:**  
Custom favicon displayed in browser tab.

**Actual Result:**  
Generic browser placeholder icon — no custom favicon.

---

# BUG-044 [AI-assisted]

**Title:** Username Login Field Uses type="text" Instead of type="email" — Wrong Mobile Keyboard

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Mobile

**Description:**  
The username/email field on login uses `type="text"` despite accepting email addresses. On mobile devices, this displays a standard keyboard without quick access to "@" and "." characters essential for email entry.

**DevTools confirmation:**  
`<input type="text" placeholder="Enter your email or username" formcontrolname="username">`

**Steps to Reproduce:**
1. Open /login on mobile device or DevTools mobile emulation 
2. Tap the username/email field
3. Observe keyboard — no "@" shortcut shown

**Expected Result:**  
`type="email"` triggers email-optimized keyboard on mobile.

**Actual Result:**  
Standard text keyboard shown.

---

# BUG-045 [AI-assisted]

**Title:** Registration Succeeds With Username Containing Only Numbers — No Format Rules Documented

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Documentation

**Description:**  
Registration accepts usernames containing only numbers and usernames with hyphens (-), but there is no visible documentation on the registration form about allowed username formats. Users must guess through trial and error.

**Steps to Reproduce:**
1. Navigate to /register
2. Enter username consisting only of numbers (e.g. "12345")
3. Complete registration — succeeds
4. Look for any username format rules on the form

**Expected Result:**  
Registration form shows clear username format rules (e.g. "3-20 characters. Letters, numbers and hyphens allowed.").

**Actual Result:**  
No format rules shown. Users must guess what is accepted.

---

# BUG-046 [AI-assisted]

**Title:** Unauthenticated User Can Browse Entire Album via Photo Detail Navigation Arrows

**Severity:** High  
**Priority:** High  
**Type:** Security / Functional

**Description:**  
Although album detail pages redirect unauthenticated users to /login, individual photo detail pages are publicly accessible (BUG-032). Once opened, unauthenticated users can use navigation arrows to browse ALL photos in the album — bypassing album-level access control entirely.

**Steps to Reproduce:**
1. Log in, open photo detail from album, copy URL
2. Open incognito window, paste URL
3. Photo visible without login
4. Click > (next) arrow — next photo loads
5. Continue to browse all album photos without authentication

**Expected Result:**  
Photo detail not accessible without authentication.

**Actual Result:**  
Entire album browsable via navigation arrows without logging in.

**Related Bug:** BUG-032

---

# BUG-047 [AI-assisted]

**Title:** Copying Another User's Photo URL Causes 404 With No Friendly Error

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Functional

**Description:**  
Navigating to a photo detail URL using a photo ID from the public gallery (another user's photo in a different album context) returns a 404 page with no helpful error or navigation back to gallery.

**Steps to Reproduce:**
1. Open gallery on homepage
2. Copy photo detail URL from another user's image
3. Navigate to that URL
4. Observe — 404 page shown

**Expected Result:**  
Photo detail loads correctly OR friendly error with navigation back to gallery.

**Actual Result:**  
404 page with no context or navigation.

---

# BUG-048 [AI-assisted]

**Title:** MENU Trigger Opens "about:blank#blocked" When Opened in New Tab

**Severity:** Low  
**Priority:** Low  
**Type:** UX / Functional

**Description:**  
The MENU trigger element (hover area top-left) uses `href="javascript:void(0)"` as its link. When a user right-clicks and selects "Open link in new tab", the browser opens an `about:blank#blocked` page instead of navigating anywhere. This is confusing UX — the element should either have no href (if it's purely JS-driven) or should not appear as a right-clickable link at all.

**Steps to Reproduce:**
1. Hover over the logo/MENU area top-left
2. Right-click on the "MENU" text
3. Select "Open link in new tab"
4. Observe new tab

**Expected Result:**  
Either no "Open link in new tab" option available, or navigation to the correct page in new tab.

**Actual Result:**  
New tab opens with `about:blank#blocked` — blank blocked page with no content.