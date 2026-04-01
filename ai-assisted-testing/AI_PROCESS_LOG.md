# AI PROCESS LOG — Photo Gallery Starter Kit

**Application:** Starterkit Photo Gallery  
**Prepared by:** Katarina Culap  
**AI Tool Used:** Claude (claude.ai — Claude Sonnet, Cursor)  
**Date:** March 2026

---

## 1. Overview

This document records my use of Claude as an AI assistant throughout Dio 2 of the QA task. It covers the specific prompts I provided, what Claude generated, what I evaluated and modified, and my reasoning for those decisions.

The goal was not to let AI replace my judgment, but to use it as a structured thinking partner — to scale my coverage, challenge my assumptions, and accelerate documentation production.

---

## 2. AI Tool Used

| Tool | Version | Purpose |
|------|---------|---------|
| Claude (claude.ai) | Claude Sonnet (March 2026) | Cursor | Test plan structuring, bug identification, automation analysis, documentation |


---

## 3. Session Log

---

### Interaction 1 — Application Mapping Before Test Plan

**Context:**  
Before starting the test plan, I needed Claude to have a complete understanding of the application. Rather than describing it in text, I provided screenshots of every page and state I encountered during manual testing.

**Prompt:**
> "I am a software tester working on a QA task for Photo Gallery Starter Kit (http://demo.baasic.com/angular/starterkit-photo-gallery/main). I am attaching screenshots of every page and state of the application: homepage hero, footer, gallery grid, photo detail view, hamburger menu (logged out and logged in), login page, register page, password recovery page, profile page (empty and with album), create album page (step 1 and step 2 'Almost done!'), album detail page (empty and with photo), photo upload page (before and after file selection), and search results page. Please map the complete application structure — pages, routes, navigation states, UI elements, and user flows — before we begin building the test plan."

**What Claude generated:**  
A complete structured application map including all pages, their URLs, navigation states (guest vs authenticated), and key UI elements per page. Claude correctly identified the 2-step album creation flow, the hover actions on album and photo cards, the difference between the two upload URLs (`/true` for cover image, `/false` for album photos), and the search URL structure (`/photo/search/{keyword}`).

**What I reviewed and adjusted:**  
- Claude correctly identified the "Photo X out of Y" counter in album photo detail — I confirmed this from my own screenshots.
- Claude noted the URL pattern `/photo/upload/{albumId}/{isCover}` — I verified this was accurate from the browser address bar in my screenshots.
- I confirmed the logged-in menu items (Profile, Create Album, Log out) vs logged-out items (Home, Login, Register).

**My evaluation:**  
Accurate and complete. Using screenshots rather than text descriptions resulted in a much more precise application map than my earlier text-based approach.

---

### Interaction 2 — Test Plan Creation

**Prompt:**
> "Based on the complete application map we've established, create a comprehensive TEST_PLAN.md for the Photo Gallery application. Requirements:
> - Organize test cases by functionality/page
> - Each TC must have: TC#, Title, Steps (numbered), Expected Result, Priority (High/Medium/Low)
> - Include a complete application structure section with all routes and access levels
> - Include a test data table with specific values
> - Cover: homepage, navigation, search, photo detail, login, register, password recovery, profile, create album (both steps), album detail, photo upload, responsive
> - Write in English, professional QA standard
> - Total target: 100+ test cases covering all observed functionality"

**What Claude generated:**  
A 110 test case plan organized into 12 sections with consistent formatting, complete routes table, test data table, and exit criteria.

**What I reviewed and adjusted:**
- I removed 3 test cases that referenced UI elements I could not confirm exist in the application (e.g., a "title on image hover" that only shows username/date, not the photo name).
- I added TC-059 (sequential field interaction causing form freeze) explicitly, which Claude had not included as a separate test case — this came directly from BUG-013 I found manually.
- I added TC-083 ("Album is not created until you upload a cover image" message) because Claude's draft missed the specific warning text on the "Almost done!" page.
- I corrected TC-060 — Claude described clicking the "+" icon as "opens file upload dialog" but this is actually BUG-014 (it does nothing). I changed Expected Result to match what the correct behavior should be, not what it currently does.
- I adjusted several priorities — Claude defaulted to Medium for many navigation items; I elevated those covering known bugs to High.

**My evaluation:**  
Strong structural output. Claude was accurate on routes and flows. Required judgment calls on priority weighting and adding bug-specific TCs that weren't in Claude's initial output.

---

### Interaction 3 — Additional Bug Identification

**Prompt:**
> "I have completed manual exploratory testing of the Photo Gallery application and documented 17 bugs. Please analyze my bug report and the application structure to identify additional bugs or edge cases I may have missed. Focus specifically on:
> 1. Security vulnerabilities (XSS, injection, authentication weaknesses, session management)
> 2. Edge cases in URL routing (the application uses Angular SPA routing)
> 3. UX gaps and missing feedback states (loading indicators, confirmation dialogs, empty states)
> 4. Input validation gaps not already documented
> 5. Navigation consistency issues
> Please format each bug with: Title, Severity, Priority, Type, Description, Steps to Reproduce, Expected Result, Actual Result, Test Data, and any root cause hypothesis.
> Here is my existing bug report: [pasted full BUG_REPORT.md]"

**What Claude generated:**  
10 additional potential bugs covering: URL injection via search route, brute force login, XSS via name fields, missing confirmation dialogs, missing loading indicators, session handling post-logout, missing profile links, empty description handling, direct URL access to upload page, and missing back navigation on search results.

**What I reviewed and adjusted:**
- **Kept as-is:** BUG-018 (URL injection via search), BUG-019 (brute force), BUG-020 (XSS), BUG-021 (no confirmation dialog), BUG-023 (session after logout), BUG-026 (direct URL to upload page), BUG-027 (no back navigation on search).
- **Modified and kept:** BUG-022 (loading indicator) — Claude described it as a standalone bug; I connected it explicitly to the double-click upload behavior I observed manually, making it more actionable.
- **Modified and kept:** BUG-024 (username not linked) — Claude described this as a generic UX issue; I added the inconsistency angle (hover in gallery shows username but it's not linked either, making it a pattern rather than isolated case).
- **Modified and kept:** BUG-025 (empty album description) — Claude's version was vague; I added the specific comparison to the Photo Detail "No description available" fallback, making it a consistency bug.
- **Removed:** 2 suggestions that required backend access to verify (CSRF token validation, missing HTTP security headers) — these cannot be tested from the browser without additional tooling and are out of scope for this task.
- **Added root cause hypotheses** to BUG-018 and BUG-023 that Claude did not include — these came from my knowledge of Angular routing and SPA session management patterns.
- All kept bugs are marked **[AI-assisted]** as required.

**My evaluation:**  
The security-focused suggestions (XSS, brute force, session) were genuinely valuable and I would not have included them in my manual report. The UX suggestions (no confirmation, no loading) were expected and aligned with what I observed. The two removed suggestions were theoretically valid but not testable in scope.

---

### Interaction 4 — Automation Analysis

**Prompt:**
> "Create a detailed AUTOMATION_ANALYSIS.md for the Photo Gallery application. For each of the 12 functionality areas in the test plan, evaluate every test case for automation suitability. For each, provide:
> - Recommendation: Automate / Partially automate / Do not automate
> - Detailed reasoning covering: execution frequency, criticality, UI stability, implementation complexity, ROI
> - Automation priority: High / Medium / Low
> Also include:
> - An overall automation strategy section explaining the approach
> - A prioritized list of known-bug regression tests for Dio 3
> - A recommended Playwright test suite folder structure
> Framework: Playwright (TypeScript)"

**What Claude generated:**  
A complete automation analysis covering all 12 functionality areas with individual recommendations per test case, a summary table, regression priority list, and recommended folder structure.

**What I reviewed and adjusted:**
- **Social login:** Claude initially suggested "partially automate with OAuth mocking." I changed this to "Do not automate" — mocking external OAuth in a demo/starter kit context has near-zero ROI and the feature is currently broken.
- **Password recovery email link:** Claude suggested "automate with Mailinator API." I kept this as "Partially automate" but added that it requires additional infrastructure investment, to be clear about the dependency.
- **Hover interactions:** Claude recommended automating all hover states (High). I downgraded these to Low/Partially — hover-triggered actions in Angular SPAs are notoriously flaky in CI environments.
- **Real device testing:** Claude marked this as Medium. I changed to "Do not automate" with explicit note that device farm infrastructure is out of scope.
- I added the **known bug regression priority table** myself — Claude's initial output had the regression tests embedded in the per-functionality tables but not consolidated. A consolidated priority list is more actionable for Dio 3 planning.
- I wrote the **recommended Playwright folder structure** based on Claude's suggestion but reorganized it to separate `smoke/`, `auth/`, `gallery/`, `albums/`, `profile/`, and `regression/` — Claude's original had a flatter structure.

**My evaluation:**  
Solid analytical framework. The per-test-case granularity was exactly what was needed. Required my judgment to calibrate automation complexity estimates (Claude tends to underestimate hover/animation complexity) and to consolidate the output for practical use in Dio 3.

---

## 4. Overall Evaluation of AI Assistance

### What AI did well:
- **Structural consistency:** Claude maintained consistent formatting across 110 test cases without drift — saving hours of manual formatting work.
- **Security coverage:** Brute force, XSS, and session management bugs were valuable additions I would likely have underweighted in manual testing.
- **Application mapping from screenshots:** Claude accurately interpreted UI elements, flows, and routes from visual inputs, enabling precise test case writing.
- **Scaling coverage:** Claude helped scale from my 17 manually-found bugs to 27 total, and from ad-hoc test scenarios to 110 structured test cases.

### Where my judgment was essential:
- **Priority calibration:** Claude defaults to Medium priority for most items. Correct prioritization requires knowledge of user impact and business risk that I brought from my testing experience.
- **Complexity estimation:** Claude consistently underestimates hover/animation/session test complexity in SPAs. I adjusted several automation recommendations accordingly.
- **Removing out-of-scope suggestions:** Claude included backend security checks (CSRF, security headers) that cannot be tested with browser-based tools in this context.
- **Connecting bugs to patterns:** Claude identified individual bugs; I identified the underlying patterns (e.g., BUG-010, BUG-012, BUG-015 all share the same root cause — incorrect error messages from a generic server error handler).

### Conclusion:
AI was most effective as a force multiplier for documentation and coverage breadth. Every piece of AI output required review, calibration, and in some cases significant rewriting. The AI_PROCESS_LOG itself demonstrates that the output is genuinely collaborative — not AI-generated content blindly submitted, but AI-assisted work validated against real testing experience.