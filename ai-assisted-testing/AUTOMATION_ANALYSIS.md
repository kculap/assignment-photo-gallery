# AUTOMATION ANALYSIS — Photo Gallery Starter Kit

**Application:** Starterkit Photo Gallery  
**URL:** https://demo.baasic.com/angular/starterkit-photo-gallery/main  
**Prepared by:** Katarina Culap  
**Method:** AI-assisted (Claude, MS Copilot)  
**Date:** March 2026  
**Recommended Framework:** Playwright (TypeScript)

---

## 1. Automation Strategy

The Photo Gallery is an Angular SPA with API-driven content, dynamic routing, authenticated/unauthenticated states, and multiple user flows. The automation strategy is based on the following principles:

**Risk-based prioritization:** Every bug found in manual testing is a regression candidate — once fixed, it must be covered automatically to prevent recurrence.

**Happy path first:** Core user journeys (register → login → create album → upload photo → view photo → delete) must be automated before edge cases.

**Stability-first selection:** Only elements with stable, semantic selectors are automated. Hover-dependent, animation-heavy, or intermittent elements are deprioritized.

**Security regressions:** Input injection and routing vulnerabilities are deterministic and fast — high automation priority.

**Layered approach:**
1. Smoke tests (app loads, core navigation)
2. Happy path tests (full user journeys)
3. Negative tests (validation, error handling)
4. Regression tests (known bugs)
5. Security tests (XSS, auth bypass, routing)

---

## 2. Decision Criteria

| Criterion | Description |
|-----------|-------------|
| **Execution frequency** | Runs every regression cycle or CI/CD trigger |
| **Criticality** | User impact if this breaks in production |
| **UI stability** | How likely selectors/layout are to change |
| **Implementation complexity** | Effort to write and maintain the test |
| **ROI** | Is automation investment worth it over time? |

---

## 3. Recommendations

| Symbol | Meaning |
|--------|---------|
| Automate | High ROI, stable, deterministic |
| Partially automate | Automatable with limitations or caveats |
| Do not automate | Low ROI, unstable, or requires external infrastructure |

---

## 4. Analysis by Functionality

---

### 4.1 Homepage & Hero Section

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Homepage loads — hero, logo, search icon visible | ✅ Automate | Core smoke test — first check every regression; fast and stable | High |
| Scroll icon loads gallery feed | ✅ Automate | Critical entry point to gallery; regression for BUG-005 on desktop | High |
| Gallery grid renders images in 3 columns | ✅ Automate | Most critical visual state; stable grid structure | High |
| Hover on image shows username and date | ⚠️ Partially | Hover testable in Playwright; low business risk; adds maintenance | Low |
| Footer visible | ❌ Do not automate | BUG-001 (infinite scroll) makes footer unreachable; automate after fix | Low |
| Footer links functional | ❌ Do not automate | BUG-003 known; low priority cosmetic issue | Low |
| Browser tab title correct | ✅ Automate | Simple assertion on `document.title`; fast; BUG-055 regression | Low |
| Favicon present | ❌ Do not automate | Not directly testable in Playwright without network inspection | Low |
| Logo reloads homepage | ✅ Automate | Simple click and URL assertion | Low |
| MENU text appears on hover | ⚠️ Partially | Hover testable; low business value | Low |

**Summary:** Automate smoke tests. Skip visual/cosmetic checks.

---

### 4.2 Navigation — MENU

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| MENU opens on click | ✅ Automate | Prerequisite for all navigation tests; stable | High |
| Guest menu shows Home, Login, Register | ✅ Automate | Auth state verification; fast assertion | High |
| Authenticated menu shows Profile, Create Album, Log out | ✅ Automate | Critical post-login check | High |
| Menu closes without redirect (BUG-008 regression) | ✅ Automate | Known high-severity bug; trivial to script; permanent regression | High |
| Menu closes on background overlay click | ✅ Automate | Related to BUG-008; stable behavior | High |
| Menu closes on Escape key | ✅ Automate | Keyboard interaction; verified behavior | Medium |
| Menu items keyboard navigable (Tab) | ✅ Automate | BUG-041 regression; Tab sequence easy to script | Medium |
| Each menu item navigates correctly | ✅ Automate | Core navigation; stable text selectors | Medium |
| Log out works correctly | ✅ Automate | Critical auth flow; verifies session termination | High |
| Back button after logout | ✅ Automate | Security regression; verify route guard | High |

**Summary:** All menu tests are good automation candidates. Menu behavior is stable and deterministic.

---

### 4.3 Search

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Search icon opens input | ✅ Automate | Core entry point | High |
| Valid keyword returns results | ✅ Automate | Core feature; end-to-end search validation | High |
| Search result URL contains keyword | ✅ Automate | Simple URL assertion | Medium |
| No results keyword shows message | ✅ Automate | Important UX state; deterministic | Medium |
| Empty input — no crash | ✅ Automate | Edge case; fast | Low |
| Whitespace crashes app (BUG-007 regression) | ✅ Automate | Critical crash bug; trivial to reproduce; assert no TypeError in console | High |
| "/" causes 404 (BUG-006 regression) | ✅ Automate | Known routing bug; simple to reproduce | High |
| "?" breaks routing (BUG-024 regression) | ✅ Automate | Security-relevant; parameterize with #, & | High |
| "#" breaks routing | ✅ Automate | Same as above — parameterized test | High |
| "&" breaks routing | ✅ Automate | Same as above | High |
| XSS payload not executed | ✅ Automate | Security regression; assert no alert dialog | High |
| Result images clickable | ✅ Automate | Core navigation | Medium |
| No "Back to Gallery" on results (BUG-033) | ✅ Automate | Simple element presence assertion | Low |

**Summary:** All search tests are excellent automation candidates. Search input goes directly into URL — making all special character tests fast and deterministic.

---

### 4.4 Photo Detail View

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Click image opens detail | ✅ Automate | Core user flow | High |
| Photo name displayed | ✅ Automate | Data rendering check | Medium |
| "No description available" fallback | ✅ Automate | Simple text assertion | Medium |
| Username and date shown | ✅ Automate | Metadata rendering | Medium |
| X closes detail — returns to gallery (BUG-002 regression) | ✅ Automate | Known bug; verify URL after close | High |
| Browser back returns to gallery | ⚠️ Partially | Route can be verified; scroll position harder to assert reliably | Medium |
| Previous arrow navigates | ✅ Automate | Core album navigation; deterministic with known test data | Medium |
| Next arrow navigates | ✅ Automate | Same as above | Medium |
| Photo counter accurate | ✅ Automate | Simple text assertion | Low |
| Photo detail accessible without auth (BUG-032 regression) | ✅ Automate | Security regression; open in new context without auth | High |
| Unauthenticated user can browse album via arrows (BUG-059) | ✅ Automate | Security regression; navigate arrows in unauthenticated context | High |

**Summary:** Photo detail has stable selectors and good regression coverage needed. Auth bypass is a critical security test.

---

### 4.5 Authentication — Login

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Login page loads with all elements | ✅ Automate | Smoke test | High |
| Successful login | ✅ Automate | Most critical flow; prerequisite for all authenticated tests | High |
| Wrong password shows error | ✅ Automate | Security-relevant; validates error handling | High |
| Non-existing username shows error | ✅ Automate | Common negative scenario | High |
| Empty username validation | ✅ Automate | Simple validation | Medium |
| Empty password validation | ✅ Automate | Simple validation | Medium |
| Both fields empty | ✅ Automate | Simple validation | Medium |
| Multiple failed logins trigger block (BUG-026) | ⚠️ Partially | Can automate repeated attempts; account blocking is real — needs fresh test account each run | Medium |
| Social login — all 4 providers | ❌ Do not automate | Requires external OAuth redirect; impossible to automate reliably without mocking; currently broken (BUG-009) | Low |
| Forgot password link navigates | ✅ Automate | Simple navigation check | Low |
| Authenticated user on /login redirected (BUG-068) | ✅ Automate | Route guard regression; simple | Low |
| Login accepts email format | ✅ Automate | Field accepts both username and email | Medium |

**Summary:** Standard form auth is ideal for automation. Social login cannot be automated without OAuth mocking infrastructure.

---

### 4.6 Authentication — Register

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Register page loads | ✅ Automate | Smoke test | High |
| REGISTER button disabled until valid | ✅ Automate | Simple state check | Medium |
| Successful registration | ✅ Automate | Core flow; use unique email per run (timestamp-based) | High |
| Invalid email format shows error (BUG-014 regression) | ✅ Automate | Known bug; assert error message text | High |
| Duplicate email shows error | ✅ Automate | Server-side validation | High |
| Duplicate username shows error | ✅ Automate | Server-side validation | High |
| Mismatched passwords shows error | ✅ Automate | Client-side validation; fast | High |
| Empty fields validation | ✅ Automate | Multiple field assertions | Medium |
| Form freeze after Confirm Password (BUG-012 regression) | ✅ Automate | High-severity bug; click sequence trivial to script | High |
| Enter key does not navigate away | ✅ Automate | Keyboard regression; simple assertion | High |
| Profile image "+" icon — file dialog | ⚠️ Partially | Click automatable; OS file dialog hard to handle in CI | Low |
| Whitespace username not accepted (BUG-048) | ✅ Automate | Validation regression | Medium |
| Authenticated user on /register redirected (BUG-040) | ✅ Automate | Route guard regression | Low |

**Summary:** Registration has excellent automation ROI. BUG-012 (form freeze) is perfectly suited for automation.

---

### 4.7 Authentication — Password Recovery

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Page loads correctly | ✅ Automate | Smoke test | Low |
| RECOVER PASSWORD button disabled until email entered | ✅ Automate | Simple state check | Low |
| Valid email — confirmation shown | ✅ Automate | Form submission and success state | Medium |
| Non-existing email error | ✅ Automate | Server error handling | Medium |
| Invalid email format shows wrong error (BUG-011 regression) | ✅ Automate | Known bug; simple text assertion on error message | Medium |
| Empty email validation | ✅ Automate | Simple validation | Low |
| Password reset link opens form (BUG-010 regression) | ⚠️ Partially | Requires email delivery + link extraction; use Mailinator API for full coverage; complex but valuable | Low |
| Blocked account recovery (BUG-027) | ⚠️ Partially | Same email dependency as above | Low |

**Summary:** Form-level tests automatable. Full email flow requires Mailinator or similar API integration.

---


---

### 4.7B Account Activation

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Activation page loads correctly | ✅ Automate | Simple smoke test; stable elements | Medium |
| Invalid token shows error | ✅ Automate | Security check; navigate with fake token | Medium |
| Already used token shows error | ✅ Automate | Edge case; navigate twice with same token | Low |
| Full email activation flow | ❌ Do not automate | Requires Mailinator API for email link extraction; complex infrastructure | Low |
| Activated account can log in | ⚠️ Partially | Can automate if test account pre-activated; email flow itself not automatable | Medium |

**Note:** The activation flow requires email link clicking which needs external email API. Automate page-level checks only.

### 4.8 User Profile

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Profile loads with username and count | ✅ Automate | Smoke test for authenticated state | High |
| Empty profile shows "You have no albums." | ✅ Automate | Deterministic with fresh account | Medium |
| Album card visible after creation | ✅ Automate | End-to-end validation | High |
| Hover shows UPLOAD and DELETE buttons | ⚠️ Partially | Hover testable; adds maintenance cost | Low |
| DELETE shows confirmation dialog | ✅ Automate | Verify dialog appears with correct text | High |
| CANCEL in confirmation keeps album | ✅ Automate | Important safety check | Medium |
| DELETE + confirm removes album | ✅ Automate | Core CRUD | High |
| Album count updates after create/delete | ✅ Automate | Reactive UI state validation | High |
| Clicking album cover navigates to detail | ✅ Automate | Core navigation | High |
| CREATE ALBUM button navigates | ✅ Automate | Navigation check | Medium |
| Profile not accessible when logged out | ✅ Automate | Route guard regression | High |

**Summary:** Profile page is stable with semantic elements. All core operations automatable.

---

### 4.9 Create Album — Step 1

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Page loads correctly | ✅ Automate | Smoke test | High |
| SAVE ALBUM disabled until name entered | ✅ Automate | State check | Medium |
| Create with valid name + description | ✅ Automate | Core flow; prerequisite for upload tests | High |
| Create with name only | ✅ Automate | Validates optional description | Medium |
| Empty name validation | ✅ Automate | Required field | High |
| Enter key does not navigate back (BUG-023 regression) | ✅ Automate | Known bug; keyboard regression trivial to script | High |
| BACK returns to profile | ✅ Automate | Navigation check | Low |
| Whitespace name not accepted (BUG-048) | ✅ Automate | Validation regression | Medium |
| Very long name validation | ✅ Automate | Server-side validation regression | Medium |
| Emoji in name | ✅ Automate | Character encoding regression | Medium |

**Summary:** All step 1 tests are good candidates. BUG-023 (Enter navigates back) is critical regression.

---

### 4.10 Create Album — Step 2 ("Almost done!")

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| "Almost done!" page loads after step 1 | ✅ Automate | Flow validation; 2-step process must work end-to-end | High |
| Warning message visible | ✅ Automate | Simple text assertion | Medium |
| Album preview shows correct name | ✅ Automate | Data validation | Medium |
| Click upload area opens file picker | ⚠️ Partially | File picker automation varies by OS/browser | Medium |
| Upload cover completes album creation | ✅ Automate | Critical — album not created without cover | High |
| Album visible on profile after cover upload | ✅ Automate | End-to-end validation | High |
| Album not created without cover | ✅ Automate | Navigate away without cover, check profile | High |
| Empty description shows fallback (BUG-035) | ✅ Automate | Simple text assertion regression | Low |

**Summary:** 2-step flow is critical and benefits greatly from automation — easy to miss step 2 manually.

---

### 4.11 Album Detail

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Album detail loads with correct metadata | ✅ Automate | Smoke test | High |
| "0 photos" empty state | ✅ Automate | Deterministic | Medium |
| Photos visible after upload | ✅ Automate | Core state validation | High |
| DELETE shows confirmation dialog | ✅ Automate | Verify dialog appears | High |
| CANCEL keeps photo | ✅ Automate | Safety check | Medium |
| DELETE + confirm removes photo | ✅ Automate | Core CRUD | High |
| Photo count updates immediately (BUG-016 regression) | ✅ Automate | Known bug; simple count assertion without refresh | High |
| UPLOAD PHOTO navigates to upload | ✅ Automate | Navigation check | Medium |
| All photos open without 404 (BUG-015 regression) | ✅ Automate | Known bug; upload 3 photos, click each | High |
| GO BACK TO ALBUMS returns to profile | ✅ Automate | Navigation check | Low |
| Album not accessible when logged out | ✅ Automate | Route guard regression | High |

**Summary:** Album detail has critical regressions (BUG-015, BUG-016) that are perfect for automation.

---

### 4.12 Photo Upload

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| Page loads correctly | ✅ Automate | Smoke test | High |
| UPLOAD IMAGE opens file picker | ⚠️ Partially | File picker interaction complex in CI | Medium |
| UPLOAD disabled before image + name | ✅ Automate | Button state check | Medium |
| Upload valid JPG | ✅ Automate | Core functionality; must pass every regression | High |
| Upload valid PNG | ✅ Automate | Format support regression | High |
| Upload GIF shows format error (BUG-044 regression) | ✅ Automate | Known bug; assert error message content | High |
| Upload WebP shows format error (BUG-044) | ✅ Automate | Same as above | High |
| Empty name validation | ✅ Automate | Required field | High |
| Whitespace-only name (BUG-048 regression) | ✅ Automate | Validation regression | Medium |
| Duplicate name error | ✅ Automate | Server validation | Medium |
| Large file wrong error (BUG-017 regression) | ✅ Automate | Known bug; assert specific error text | High |
| Long name wrong error (BUG-018 regression) | ✅ Automate | Known bug; assert specific error text | High |
| Emoji name displays correctly (BUG-020 regression) | ✅ Automate | Known bug; assert detail view shows emoji | Medium |
| Special chars wrong error (BUG-021 regression) | ✅ Automate | Known bug; assert correct error | Medium |
| Long description not shown (BUG-019 regression) | ✅ Automate | Known bug; assert description in detail view | Medium |
| Whitespace description fallback | ✅ Automate | Validation | Low |
| HTML tags in name garbled (BUG-047) | ✅ Automate | Security regression; assert escaped output | Medium |
| Upload fails offline (BUG-043) | ⚠️ Partially | Can simulate with Playwright network intercept; more complex | Low |
| Deleted photo not on Home (BUG-022) | ⚠️ Partially | Intermittent — flaky in automation; implement with retry | Low |

**Summary:** Photo upload has the most known bug regressions — all high value for automation.

---

### 4.13 Responsive Design

| Test Case | Recommendation | Reasoning | Priority |
|-----------|---------------|-----------|----------|
| App loads on Chrome | ✅ Automate | Default browser target | High |
| App loads on Firefox | ✅ Automate | Playwright supports natively | Medium |
| Mobile viewport — scroll icon (BUG-005 regression) | ⚠️ Partially | Playwright can set mobile viewport; touch events more complex | Medium |
| Image alignment on mobile (BUG-004) | ❌ Do not automate | Visual/pixel regression requires screenshot comparison tools (Percy, Applitools) | Low |
| Real device testing | ❌ Do not automate | Requires device farm (BrowserStack, Sauce Labs); out of scope | Low |

---

## 5. Summary Table

| Functionality | ✅ Automate | ⚠️ Partially | ❌ Do Not |
|--------------|-----------|------------|---------|
| F1: Homepage & Hero | 4 | 2 | 4 |
| F2: Navigation (MENU) | 10 | 0 | 0 |
| F3: Search | 12 | 0 | 0 |
| F4: Photo Detail | 9 | 1 | 0 |
| F5: Login | 10 | 1 | 1 |
| F6: Register | 11 | 1 | 0 |
| F7: Password Recovery | 6 | 2 | 0 |
| F8: Profile | 9 | 1 | 0 |
| F9: Create Album Step 1 | 10 | 0 | 0 |
| F10: Create Album Step 2 | 6 | 1 | 0 |
| F11: Album Detail | 11 | 0 | 0 |
| F12: Photo Upload | 16 | 3 | 0 |
| F13: Responsive | 2 | 1 | 2 |
| **TOTAL** | **116** | **13** | **7** |

---

## 6. Bug Regression Priority List for Dio 3

These test cases directly cover known bugs and must be implemented first:

| Priority | Bug | Description | TC Reference |
|----------|-----|-------------|-------------|
| 1 | BUG-008 | Menu closes → redirects to Home | F2-TC-004, F2-TC-005 |
| 2 | BUG-007 | Whitespace search → app crash + TypeError | F3-TC-007 |
| 3 | BUG-012 | Registration form freezes after Confirm Password | F6-TC-010 |
| 4 | BUG-006 | "/" in search → 404 | F3-TC-008 |
| 5 | BUG-023 | Enter in Album Name → navigates back | F9-TC-006 |
| 6 | BUG-032 | Photo detail accessible without auth | F4-TC-013 |
| 7 | BUG-059 | Album browsable via arrows without auth | F4-TC-014 |
| 8 | BUG-015 | Album images return 404 | F11-TC-011 |
| 9 | BUG-016 | Image count not updated after delete | F11-TC-009 |
| 10 | BUG-002 | Closing image returns to Home not gallery | F4-TC-007 |
| 11 | BUG-017 | Large file → wrong error message | F12-TC-013 |
| 12 | BUG-014 | Invalid email on register → no feedback | F6-TC-005 |

---

## 7. Recommended Playwright Test Suite Structure

```
tests/
├── smoke/
│   ├── homepage.spec.ts          # F1-TC-001 to F1-TC-003
│   └── navigation.spec.ts        # F2-TC-001, F2-TC-002, F2-TC-003
├── auth/
│   ├── login.spec.ts             # F5 all TCs
│   ├── register.spec.ts          # F6 all TCs
│   └── password-recovery.spec.ts # F7 all TCs
├── gallery/
│   ├── gallery.spec.ts           # F1-TC-004 to F1-TC-007
│   ├── photo-detail.spec.ts      # F4 all TCs
│   └── search.spec.ts            # F3 all TCs
├── albums/
│   ├── create-album.spec.ts      # F9, F10 all TCs
│   ├── album-detail.spec.ts      # F11 all TCs
│   └── photo-upload.spec.ts      # F12 all TCs
├── profile/
│   └── profile.spec.ts           # F8 all TCs
├── security/
│   └── auth-bypass.spec.ts       # F4-TC-013, F4-TC-014, F5-TC-014, F6-TC-014
├── regression/
│   └── known-bugs.spec.ts        # All bug regression TCs (priority list above)
└── helpers/
    ├── auth.helper.ts             # login(), logout(), register() reusable functions
    ├── album.helper.ts            # createAlbum(), uploadPhoto(), deleteAlbum()
    └── test-data.ts               # Shared constants, test users, file paths
```

---

## 8. Notes on Implementation

**Test isolation:** Each test should set up its own data and clean up after. Use unique usernames/album names with timestamps to avoid conflicts with other test runs on the shared demo server.

**Shared demo server:** Since multiple candidates may use the same demo server simultaneously, tests should use unique identifiers (e.g. `test-user-${Date.now()}`) to avoid data conflicts.

**File uploads in Playwright:** Use `page.setInputFiles()` for file upload interactions — more reliable than clicking the OS file dialog.

**Auth state:** Use Playwright's `storageState` to save and reuse authenticated state across tests — avoids repeating login in every test.

**Flaky tests:** BUG-022 (intermittent deleted image visible) should be marked with `test.slow()` and retries configured.