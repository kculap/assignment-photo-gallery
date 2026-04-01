# AI Automation Log  
Photo Gallery — Playwright Test Suite

This document describes how AI coding tools were used to generate, refine, and stabilize the automated test suite for the Photo Gallery application.  
The goal of this log is to clearly separate AI-generated work from manual corrections and to demonstrate the workflow used during development.

---

## 1. AI Tools Used

### Cursor IDE
Primary tool used for:
- generating initial Playwright test files  
- creating helper utilities (login, upload, navigation)  
- refactoring selectors  
- stabilizing flaky tests  
- generating repetitive test patterns  

Cursor was used directly inside the IDE, not through a chat interface.

### Claude Code (CLI)
Used for:
- generating regression test drafts  
- producing documentation templates  
- analyzing selectors and DOM structure  
- generating alternative implementations for comparison  

### Gemini CLI
Used for:
- validating test structure  
- generating additional edge-case scenarios  
- cross-checking logic and improving readability  

---

## 2. Workflow Summary

1. **Initial test scaffolding**  
   Cursor IDE generated the initial folder structure, basic test templates, and helper files.

2. **Selector discovery**  
   AI tools proposed selectors based on DOM inspection, but many required manual correction due to:
   - dynamic Angular components  
   - hidden overlays  
   - delayed rendering  
   - inconsistent class naming  

3. **Stabilization**  
   AI suggested waits and retries, but manual adjustments were required:
   - replacing `click()` with `click({ force: true })`  
   - adding `waitFor({ state: "visible" })`  
   - adding sanity checks after navigation  
   - fixing login/logout flow to avoid redirect issues  

4. **Regression suite generation**  
   Claude Code generated initial regression tests, but they targeted a different Baasic template.  
   Tests were rewritten manually to match the actual Photo Gallery UI.

5. **Final polishing**  
   - test names rewritten for clarity  
   - duplicated logic moved into helpers  
   - unnecessary waits removed  
   - error handling improved  

---

## 3. Prompts Used (Examples)

Below are representative prompts used during development.  
Full prompt history is stored in `ai-tooling/prompts/`.

### Example Prompt 1 — Cursor IDE
```
Generate a Playwright test for the Photo Gallery app that verifies album creation:
- navigate to /album/create
- fill album name
- save album
- verify redirect to step 2
- upload a photo
- verify album detail page loads
Use stable selectors and avoid brittle XPath.
```

### Example Prompt 2 — Claude Code CLI
```
Create a regression test suite for known bugs in the Photo Gallery application.
Each test must include:
- BUG ID
- expected vs actual behavior
- stable selectors
- no assumptions about elements that do not exist in this UI.
```

### Example Prompt 3 — Gemini CLI
```
Review this Playwright test file and suggest improvements for stability.
Focus on:
- waits
- selectors
- force clicks
- navigation timing
```

---

## 4. AI-Generated vs Manually Corrected

### AI-Generated
- initial test files (smoke, auth, gallery, albums)
- helper file scaffolding
- regression test drafts
- documentation templates
- repetitive test patterns
- initial selectors (partially correct)

### Manually Corrected
- all selectors that did not match the real DOM  
- login helper (AI used email; app requires username)  
- logout helper (AI assumed redirect; app does not redirect)  
- upload helper (AI missed hidden file input)  
- regression suite (AI targeted wrong Baasic template)  
- navigation menu tests (AI assumed hamburger menu; real UI uses hover + click)  
- stability improvements (force clicks, waits, sanity checks)  
- removal of unused or incorrect AI-generated code  

---

## 5. Challenges Encountered

- Angular animations caused delayed rendering  
- Hidden overlays blocked interactions  
- File input was not visible until triggered correctly  
- Demo server performance varied, causing flakiness  
- AI occasionally hallucinated selectors from other Baasic templates  
- Regression tests required full rewrite due to UI differences  

---

## 6. Time Savings

Estimated manual effort without AI: **20–25 hours**  
Actual time with AI assistance: **4–5 hours**

AI accelerated:
- boilerplate generation  
- repetitive test creation  
- documentation  
- refactoring  

Manual work was still required for:
- debugging  
- selector validation  
- stabilizing flaky tests  
- regression suite corrections  

---

## 7. Conclusion

AI coding tools significantly improved development speed and consistency.  
However, manual validation and correction were essential to ensure accuracy and stability.  
The final test suite is a hybrid product: AI-generated structure with human‑verified logic and selectors.

This document demonstrates the full AI-assisted workflow used to build the automated test suite.
