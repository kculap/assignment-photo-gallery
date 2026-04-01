# Photo Gallery — QA Project  

This repository contains the solution for a three‑part QA assignment:

1. Manual testing (without AI)  
2. AI-assisted testing and analysis  
3. Automated testing using AI coding tools  

Each part is documented and stored in its own directory.

---

# 1. Manual Testing (No AI Allowed)

The first part of the assignment focuses on independent exploratory testing of the Photo Gallery application.

The objective is to demonstrate personal testing skills, defect discovery, and structured reporting.

### Deliverables (located in `manual-testing/`)

- **BUG_REPORT.md**  
  Contains all defects found manually, including:
  - title and short description  
  - severity and priority  
  - steps to reproduce  
  - expected vs. actual behavior  
  - screenshots or videos when relevant  

- **screenshots/**  
  Visual evidence of defects.

This part was completed entirely without AI tools, as required.

---

# 2. AI-Assisted Testing

The second part demonstrates how AI tools can support QA work.  
AI was used for planning, analysis, and identifying additional scenarios.

### Deliverables (located in `ai-assisted-testing/`)

- **TEST_PLAN.md**  
  A structured, AI-assisted test plan covering all major functionalities of the application.  
  Includes prioritization and grouping by feature.

- **AUTOMATION_ANALYSIS.md**  
  Evaluation of which functionalities should be automated.  
  For each feature:
  - recommendation (automate / do not automate / partially automate)  
  - justification (frequency, criticality, UI stability, ROI)  
  - automation priority (high / medium / low)

- **ADDITIONAL_BUGS.md**  
  Additional defects identified with AI assistance.  
  All AI-discovered bugs are clearly marked with the tag `[AI-assisted]`.

- **AI_PROCESS_LOG.md**  
  Documentation of the AI workflow:
  - which tools were used (Cursor, Claude Code, Gemini CLI, etc.)  
  - exact prompts used  
  - what AI generated  
  - what was manually corrected or adjusted and why  

This part demonstrates the ability to integrate AI tools into QA processes.

---

# 3. Automated Testing (Playwright + AI Coding Tools)

The third part focuses on writing automated tests using AI coding tools

The automated test suite covers core functionalities of the Photo Gallery application, including:

- login and authentication  
- album creation and management  
- photo upload  
- gallery browsing  
- search  
- profile  
- security checks  
- regression tests for known bugs  

### Deliverables (located in `automation/playwright/`)

- **tests/**  
  Organized test suite covering all major features:
  - smoke  
  - auth  
  - gallery  
  - albums  
  - profile  
  - search  
  - security  
  - regression  

- **helpers/**  
  Shared utilities for login, navigation, uploads, and selectors.

- **playwright.config.ts**  
  Playwright configuration.

- **package.json**  
  Project dependencies and scripts.

- **AI_AUTOMATION_LOG.md**  
  Documentation of the AI coding process:
  - which AI coding tools were used  
  - how they were guided  
  - what code was generated  
  - what was manually corrected  
  - challenges and stability improvements  

---

# Running the Automated Test Suite

## Prerequisites
- Node.js 18 or newer  
- npm or yarn  

## Installation

```bash
cd automation
npm install
npx playwright install
```

## Running tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/smoke/homepage.spec.ts

# Run in UI mode
npx playwright test --ui

# Run only regression tests
npx playwright test tests/regression/

# Run with a specific browser
npx playwright test --project=chromium

# Generate HTML report
npx playwright show-report
```

## Test Credentials

Before running tests, update:

automation/playwright/helpers/test-data.ts

with valid credentials for the demo environment.

