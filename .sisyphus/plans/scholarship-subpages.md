# Scholarship Subpages Development Plan

## TL;DR

> **Quick Summary**: Create 5 scholarship category subpages as modal/panels with embedded Feishu forms, minimize-to-floating-button functionality, and category-specific styling.
> 
> **Deliverables**:
> - Modal/panel component with open/close/minimize functionality
> - 5 category configurations (领导力, 竞技体育, 音表艺术, 视觉艺术, 学术)
> - Feishu iframe form cards (6 forms total)
> - Minimize-to-floating-button feature
> - Bilingual support (Chinese/British English)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Wave 0 (iframe test) → Wave 1 (modal + content) → Wave 2 (integration + minimize) → Wave 3 (testing)

---

## Context

### Original Request
用户希望为奖学金申请页面创建子页面，点击仪表盘按钮后在当前页面打开模态框/侧边栏，可以随时缩小、返回仪表盘。每个子页面包含步骤说明和嵌入的飞书收集表。

### Interview Summary
**Key Discussions**:
- Modal/Slide-out panel approach with minimize-to-floating-button
- Category-specific background colors using existing design system
- Card-style iframe embedding for Feishu forms
- Yellow alert style for non-form items (contact via WeCom)
- Bilingual support (Chinese/British English)
- Agent-Executed QA for verification

**Research Findings**:
- Existing patterns: CCA dialogs (dynamic creation), Floating Planner (minimize pattern)
- design-system.css has all category gradients defined
- i18n.js follows flat key-value structure with camelCase naming
- **CRITICAL**: Feishu iframe embedding needs validation first

### Metis Review
**Identified Gaps** (addressed):
- Feishu iframe blocking risk → Wave 0 test added
- Multiple minimized panels conflict → One at a time only
- Mobile panel behavior → Full-screen overlay on mobile
- Form loading states → Added loading skeleton

---

## Work Objectives

### Core Objective
Create a reusable modal/panel component for scholarship category subpages with embedded Feishu forms and minimize functionality.

### Concrete Deliverables
- `tests/test-feishu-iframe.html` - Iframe embedding validation
- `scripts/scholarship-subpage-modal.js` - Modal component logic
- `styles/scholarship-subpage-modal.css` - Modal component styles
- Updated `scripts/scholarship-dashboard.js` - Integration
- Updated `scripts/i18n.js` - All new translations

### Definition of Done
- [ ] All 6 Feishu forms successfully embed in iframes
- [ ] Modal opens/closes/minimizes correctly for all 5 categories
- [ ] Floating button shows correct category name and can restore modal
- [ ] Category-specific gradient backgrounds applied
- [ ] All content displays correctly in both Chinese and English
- [ ] Responsive design works at 375px viewport

### Must Have
- Modal/panel component with open, close, minimize states
- Category-specific background colors (Leadership=Pink, Sports=Orange-Yellow, MusicPerformingArts=Purple-blue, VisualArts=Purple-pink, Academic=SkyBlue)
- Breadcrumb navigation + back button
- Card-style iframe embedding with loading skeleton
- Yellow alert for non-form items (contact WeCom)
- Minimize-to-floating-button functionality
- **Floating button persists across all scholarship pages** (scholarship.html and sub-pages)
- **"Return to Dashboard" button in modal header** - navigates background page to dashboard
- Bilingual support (zh/en)

### Must NOT Have (Guardrails)
- NO separate HTML files per category (use single modal component)
- NO new CSS color variables (use existing design-system.css)
- NO form state persistence across sessions
- NO submission tracking/history
- NO WeCom deep links (display-only)
- NO multiple minimized panels simultaneously (one at a time)
- NO analytics/tracking

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Playwright via /playwright skill)
- **Automated tests**: YES (Agent-Executed QA)
- **Framework**: Playwright
- **Approach**: Test after implementation

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Form Embedding**: Use Playwright — Verify iframe loads, check for X-Frame-Options blocking

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (CRITICAL BLOCKER — Must Complete First):
└── Task 1: Test Feishu iframe embedding [quick]
    → BLOCKS all other tasks if failed

Wave 1 (After Wave 0 Passes — Core Infrastructure):
├── Task 2: Create modal component (JS + CSS) [unspecified-high]
├── Task 3: Add category content configuration [quick]
└── Task 4: Add i18n translations [quick]

Wave 2 (After Wave 1 — Integration):
├── Task 5: Integrate modal with dashboard buttons [quick]
└── Task 6: Implement minimize-to-floating-button [unspecified-high]

Wave 3 (After Wave 2 — Testing & Polish):
├── Task 7: Playwright test suite [unspecified-high]
├── Task 8: Responsive testing and bug fixes [quick]
└── Task 9: Floating button persistence across pages [quick]

Wave FINAL (After ALL tasks — Verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|------------|--------|
| 1 | — | 2-9, F1-F4 |
| 2 | 1 | 5, 6 |
| 3 | — | 5 |
| 4 | — | 5 |
| 5 | 2, 3, 4 | 6, 7, 8, 9 |
| 6 | 2, 5 | 7, 8, 9 |
| 7 | 5, 6 | F1-F4 |
| 8 | 5, 6 | F1-F4 |
| 9 | 5, 6 | F1-F4 |

---

## TODOs

- [ ] 1. **Test Feishu iframe Embedding** (Wave 0 - CRITICAL BLOCKER)

  **What to do**:
  - Create test HTML file `tests/test-feishu-iframe.html`
  - Embed all 6 Feishu form URLs in iframes
  - Test in browser to verify no X-Frame-Options blocking
  - Document which forms work and which fail
  - If any form fails, report to user for alternative approach

  **Feishu URLs to Test**:
  1. Leadership: `https://harrownanning-est.feishu.cn/share/base/form/shrcnB40KooxOKt5EYs4xpmu1rd`
  2. Sports Supplementary: `https://harrownanning-est.feishu.cn/share/base/form/shrcnP99gEv6ciHgaUhRit3TLOL`
  3. Music Performing Supplementary: `https://harrownanning-est.feishu.cn/share/base/form/shrcnJp9Mr4tOwEDjmSyZ4wkjEg`
  4. Visual Arts Registration: `https://harrownanning-est.feishu.cn/share/base/form/shrcnSAJWDoZDsR8p3vMg6N87vd`
  5. Visual Arts Portfolio: `https://harrownanning-est.feishu.cn/share/base/form/shrcnu4BKBNp7JWxJEgaiNdpTrf`
  6. Academic Winter/Summer School: `https://harrownanning-est.feishu.cn/share/base/form/shrcn28ZlvLbieFxQH2xWBhAMMf`

  **Must NOT do**:
  - Do NOT proceed to Wave 1 if any iframe fails
  - Do NOT assume iframes work without testing

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO - This is a blocking task
  - **Parallel Group**: Wave 0 (standalone)
  - **Blocks**: Tasks 2-8, F1-F4
  - **Blocked By**: None

  **References**:
  - Create new file: `tests/test-feishu-iframe.html`
  - Use simple iframe HTML structure: `<iframe src="URL" width="100%" height="600px"></iframe>`

  **Acceptance Criteria**:
  - [ ] Test HTML file created
  - [ ] All 6 iframes tested in browser
  - [ ] Results documented (PASS/FAIL per URL)
  - [ ] If ALL PASS: proceed to Wave 1
  - [ ] If ANY FAIL: stop and report to user

  **QA Scenarios**:
  ```
  Scenario: Verify all Feishu iframes can be embedded
    Tool: Playwright
    Preconditions: Local server running on port 3000
    Steps:
      1. Navigate to http://localhost:3000/tests/test-feishu-iframe.html
      2. For each iframe, check if content loaded (not blank/blocked)
      3. Capture screenshot of each iframe state
    Expected Result: All 6 iframes show Feishu form content
    Failure Indicators: Blank iframe, X-Frame-Options error in console
    Evidence: .sisyphus/evidence/task-1-feishu-iframe-test.png
  ```

  **Commit**: YES
  - Message: `test: add Feishu iframe embedding validation test`
  - Files: `tests/test-feishu-iframe.html`

---

- [ ] 2. **Create Modal Component** (Wave 1)

  **What to do**:
  - Create `scripts/scholarship-subpage-modal.js` with modal logic
  - Create `styles/scholarship-subpage-modal.css` with modal styles
  - Implement open/close functionality
  - Reference CCA dialog pattern for dynamic creation
  - Support category-specific gradient backgrounds

  **Modal Structure**:
  ```html
  <div class="subpage-modal-overlay">
    <div class="subpage-modal {category}">
      <div class="modal-header">
        <div class="breadcrumb">仪表盘 > {categoryName}</div>
        <div class="modal-actions">
          <button class="dashboard-btn">返回仪表盘</button>
          <button class="minimize-btn">最小化</button>
          <button class="close-btn">关闭</button>
        </div>
      </div>
      <div class="modal-content">
        <!-- Category-specific content -->
      </div>
    </div>
  </div>
  ```

  **Must NOT do**:
  - Do NOT create separate HTML files per category
  - Do NOT add new CSS color variables

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4)
  - **Parallel Group**: Wave 1 (with Tasks 3, 4)
  - **Blocks**: Tasks 5, 6
  - **Blocked By**: Task 1

  **References**:
  - Pattern: `scripts/cca.js` - Dynamic dialog creation
  - Pattern: `scripts/floating-planner.js` - Minimize functionality
  - Styles: `styles/design-system.css` - All category gradients
  - Styles: `styles/scholarship-dashboard.css` - Existing modal patterns

  **Acceptance Criteria**:
  - [ ] `scholarship-subpage-modal.js` created with openModal(), closeModal() functions
  - [ ] `scholarship-subpage-modal.css` created with all modal styles
  - [ ] Modal can be opened via JavaScript call
  - [ ] Modal can be closed via close button
  - [ ] **"Return to Dashboard" button navigates parent page to dashboard URL**
  - [ ] Category-specific gradient applied based on category parameter

  **QA Scenarios**:
  ```
  Scenario: Modal opens with correct category styling
    Tool: Playwright
    Preconditions: Modal component created
    Steps:
      1. Execute JavaScript: openSubpageModal('leadership')
      2. Check modal is visible
      3. Check modal has class 'leadership'
      4. Verify gradient background contains pink colors
    Expected Result: Modal visible with leadership styling
    Evidence: .sisyphus/evidence/task-2-modal-leadership.png

  Scenario: Return to Dashboard button navigates correctly
    Tool: Playwright
    Steps:
      1. Open modal with openSubpageModal('sports')
      2. Click .dashboard-btn
      3. Verify page navigates to scholarship.html (dashboard)
      4. Verify modal state is preserved (floating button visible or modal still open)
    Expected Result: Page navigates to dashboard
    Evidence: .sisyphus/evidence/task-2-dashboard-nav.png

  Scenario: Modal closes on close button click
    Tool: Playwright
    Steps:
      1. Open modal with openSubpageModal('sports')
      2. Click .close-btn
      3. Verify modal is removed from DOM
    Expected Result: Modal closed and removed
    Evidence: .sisyphus/evidence/task-2-modal-close.png
  ```

  **Commit**: YES
  - Message: `feat(scholarship): add subpage modal component`
  - Files: `scripts/scholarship-subpage-modal.js`, `styles/scholarship-subpage-modal.css`

---

- [ ] 3. **Add Category Content Configuration** (Wave 1)

  **What to do**:
  - Create category configuration data structure in `scholarship-subpage-modal.js`
  - Define all 5 categories with their steps and form URLs
  - Include yellow alert text for non-form items

  **Category Configuration Structure**:
  ```javascript
  const CATEGORY_CONFIG = {
    leadership: {
      name: { zh: '领导力记录补全', en: 'Leadership Record Completion' },
      gradient: 'leadership',
      steps: [
        { type: 'info', title: { zh: '注册', en: 'Registration' }, desc: { zh: '以提交为准', en: 'Based on submission' } },
        { type: 'form', title: { zh: '领导力综合提交', en: 'Leadership Comprehensive Submission' }, url: '...' }
      ]
    },
    sports: {
      name: { zh: '竞技体育记录补全', en: 'Sports Record Completion' },
      gradient: 'sports',
      steps: [
        { type: 'info', title: { zh: '注册', en: 'Registration' }, desc: { zh: '集中管理', en: 'Centralised Management' }, alert: true },
        { type: 'info', title: { zh: '奖项', en: 'Awards' }, desc: { zh: '提交给 Ryan Tang 或 Yackey Chen', en: 'Submit to Ryan Tang or Yackey Chen' }, alert: true },
        { type: 'info', title: { zh: '段位', en: 'Rankings' }, desc: { zh: '提交给 Ryan Tang 或 Yackey Chen', en: 'Submit to Ryan Tang or Yackey Chen' }, alert: true },
        { type: 'form', title: { zh: '补充材料', en: 'Supplementary Materials' }, url: '...' }
      ]
    },
    // ... music-performing, visual-arts, academic
  };
  ```

  **Must NOT do**:
  - Do NOT hardcode HTML in configuration
  - Do NOT include WeCom deep links

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 4)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:
  - File: `scripts/scholarship-subpage-modal.js` (add to this file)
  - Pattern: `scripts/i18n.js` - Bilingual text structure

  **Acceptance Criteria**:
  - [ ] CATEGORY_CONFIG defined with all 5 categories
  - [ ] Each category has name, gradient, steps array
  - [ ] Steps include both info and form types
  - [ ] Alert flag set for info items requiring yellow highlight

  **QA Scenarios**:
  ```
  Scenario: Verify category configuration completeness
    Tool: Bash (Node REPL)
    Steps:
      1. Load scholarship-subpage-modal.js
      2. Check CATEGORY_CONFIG has 5 keys
      3. Verify each category has name, gradient, steps
      4. Verify all form URLs are present
    Expected Result: Configuration complete with all data
    Evidence: .sisyphus/evidence/task-3-config-check.txt
  ```

  **Commit**: YES
  - Message: `feat(scholarship): add category content configuration`
  - Files: `scripts/scholarship-subpage-modal.js`

---

- [ ] 4. **Add i18n Translations** (Wave 1)

  **What to do**:
  - Add all new translation keys to `scripts/i18n.js`
  - Include Chinese (zh) and British English (en) translations
  - Follow existing camelCase naming convention

  **Translation Keys to Add**:
  ```javascript
  // Chinese (add to zh section)
  subpageBreadcrumb: '仪表盘',
  subpageMinimize: '最小化',
  subpageClose: '关闭',
  subpageRestore: '恢复',
  subpageLoading: '加载中...',
  
  // Category names (already partially exist)
  leadershipSubpage: '领导力记录补全',
  sportsSubpage: '竞技体育记录补全',
  musicPerformingSubpage: '音表艺术记录补全',
  visualArtsSubpage: '视觉艺术记录补全',
  academicSubpage: '学术竞赛记录补全',
  
  // Step items
  stepRegistration: '注册',
  stepAwards: '奖项',
  stepRankings: '段位',
  stepGrading: '考级',
  stepSupplementary: '补充材料',
  stepPortfolio: '作品集提交',
  stepWorks: '注册作品',
  stepWinterSummer: '冬夏校',
  
  // Alert text
  alertCentralized: '集中管理',
  alertSubmitTo: '提交给 Ryan Tang 或 Yackey Chen（企业微信）',
  alertAutoGranted: '所有学生自动获得',
  alertBasedOnSubmission: '以提交为准',
  alertSubjective: '主观评价15分，不提交就没有',
  
  // Floating button
  floatingBtnProgress: '记录补全中...',
  
  // English (British)
  // ... corresponding English translations
  ```

  **Must NOT do**:
  - Do NOT use American English (e.g., "Centralized" → "Centralised")
  - Do NOT duplicate existing keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 3)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:
  - File: `scripts/i18n.js` - Lines 478-506 (Chinese), 515+ (English)
  - Pattern: Existing translation key structure

  **Acceptance Criteria**:
  - [ ] All new keys added to zh section
  - [ ] All new keys added to en section with British English
  - [ ] No duplicate keys
  - [ ] Keys follow camelCase convention

  **QA Scenarios**:
  ```
  Scenario: Verify translations exist for all keys
    Tool: Bash (Node REPL)
    Steps:
      1. Load i18n.js
      2. Check all new keys exist in zh translations
      3. Check all new keys exist in en translations
      4. Verify British English spelling (Centralised, not Centralized)
    Expected Result: All translations present with correct spelling
    Evidence: .sisyphus/evidence/task-4-i18n-check.txt
  ```

  **Commit**: YES
  - Message: `feat(scholarship): add i18n translations for subpage content`
  - Files: `scripts/i18n.js`

---

- [ ] 5. **Integrate Modal with Dashboard Buttons** (Wave 2)

  **What to do**:
  - Update `scripts/scholarship-dashboard.js` to import and use modal
  - Update ACTION_LINKS to use modal instead of external links
  - Update `handleActionClick()` to open modal
  - Add modal CSS import to `scholarship-dashboard.html`

  **Code Changes**:
  ```javascript
  // In scholarship-dashboard.js
  // Update ACTION_LINKS
  const ACTION_LINKS = {
      'leadership': 'modal:leadership',
      'music-performing': 'modal:music-performing',
      'visual-arts': 'modal:visual-arts',
      'sports': 'modal:sports',
      'academic': 'modal:academic',
      'confirmation': '#confirmation'
  };

  // Update handleActionClick
  function handleActionClick(action) {
      const url = ACTION_LINKS[action] || '#';
      
      if (url.startsWith('modal:')) {
          const category = url.replace('modal:', '');
          openSubpageModal(category);
      } else if (url !== '#') {
          window.open(url, '_blank');
      } else {
          showComingSoonNotice(action);
      }
  }
  ```

  **Must NOT do**:
  - Do NOT break existing confirmation button functionality
  - Do NOT remove countdown timer or other features

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 2, 3, 4)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 6, 7, 8
  - **Blocked By**: Tasks 2, 3, 4

  **References**:
  - File: `scripts/scholarship-dashboard.js` - Lines 8-15 (ACTION_LINKS), Lines 81-89 (handleActionClick)
  - File: `scholarship-dashboard.html` - Add CSS link

  **Acceptance Criteria**:
  - [ ] `scholarship-dashboard.js` updated with modal integration
  - [ ] `scholarship-dashboard.html` imports modal CSS
  - [ ] Clicking Leadership button opens modal with leadership content
  - [ ] Clicking Arts submenu items opens correct modal
  - [ ] Confirmation button still works independently

  **QA Scenarios**:
  ```
  Scenario: Leadership button opens modal
    Tool: Playwright
    Preconditions: Dashboard page loaded
    Steps:
      1. Click .completion-btn.leadership
      2. Wait for .subpage-modal to appear
      3. Verify modal title contains '领导力' or 'Leadership'
      4. Verify modal has 'leadership' class
    Expected Result: Modal opens with leadership content
    Evidence: .sisyphus/evidence/task-5-leadership-modal.png

  Scenario: Sports button opens modal
    Tool: Playwright
    Steps:
      1. Click .completion-btn.sports
      2. Verify modal opens with 'sports' class
      3. Verify modal has orange-yellow gradient background
    Expected Result: Modal opens with sports styling
    Evidence: .sisyphus/evidence/task-5-sports-modal.png

  Scenario: Arts submenu items open correct modals
    Tool: Playwright
    Steps:
      1. Click .completion-btn.arts to expand submenu
      2. Click '音表艺术' button
      3. Verify modal opens with music-performing content
      4. Close modal
      5. Reopen and click '视觉艺术' button
      6. Verify modal opens with visual-arts content
    Expected Result: Each arts submenu opens correct modal
    Evidence: .sisyphus/evidence/task-5-arts-submenu.png
  ```

  **Commit**: YES
  - Message: `feat(scholarship): integrate modal with dashboard buttons`
  - Files: `scripts/scholarship-dashboard.js`, `scholarship-dashboard.html`

---

- [ ] 6. **Implement Minimize-to-Floating-Button** (Wave 2)

  **What to do**:
  - Add minimize functionality to modal
  - Create floating button component
  - Implement state toggle between modal and floating button
  - Reference Floating Planner minimize pattern

  **Floating Button Structure**:
  ```html
  <button class="floating-subpage-btn {category}">
    <span class="floating-icon">{category_icon}</span>
    <span class="floating-text">{categoryName} 记录补全中...</span>
  </button>
  ```

  **Behavior**:
  1. User clicks minimize button in modal header
  2. Modal fades out and is hidden
  3. Floating button appears in bottom-right corner
  4. Floating button shows category name + "记录补全中..."
  5. Clicking floating button restores modal
  6. Only one floating button at a time

  **Must NOT do**:
  - Do NOT allow multiple floating buttons
  - Do NOT persist state across page refresh (not in scope)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Task 5

  **References**:
  - Pattern: `scripts/floating-planner.js` - Minimize/restore logic
  - Pattern: `styles/floating-planner.css` - Floating button styles
  - File: `scripts/scholarship-subpage-modal.js` - Add minimize functions
  - File: `styles/scholarship-subpage-modal.css` - Add floating button styles

  **Acceptance Criteria**:
  - [ ] Minimize button visible in modal header
  - [ ] Clicking minimize hides modal and shows floating button
  - [ ] Floating button shows correct category name
  - [ ] Floating button has category-specific gradient
  - [ ] Clicking floating button restores modal
  - [ ] Close button removes both modal and floating button

  **QA Scenarios**:
  ```
  Scenario: Minimize creates floating button
    Tool: Playwright
    Steps:
      1. Open leadership modal
      2. Click .minimize-btn
      3. Verify modal is hidden
      4. Verify .floating-subpage-btn is visible
      5. Verify button text contains '领导力' and '记录补全中'
    Expected Result: Modal hidden, floating button visible
    Evidence: .sisyphus/evidence/task-6-minimize.png

  Scenario: Floating button restores modal
    Tool: Playwright
    Steps:
      1. Have minimized modal (floating button visible)
      2. Click .floating-subpage-btn
      3. Verify modal is visible again
      4. Verify floating button is hidden
    Expected Result: Modal restored, floating button hidden
    Evidence: .sisyphus/evidence/task-6-restore.png

  Scenario: Only one floating button at a time
    Tool: Playwright
    Steps:
      1. Open leadership modal, minimize it
      2. Open sports modal (should close leadership)
      3. Minimize sports modal
      4. Verify only one floating button exists
      5. Verify it shows '竞技体育'
    Expected Result: Only sports floating button visible
    Evidence: .sisyphus/evidence/task-6-single-float.png
  ```

  **Commit**: YES
  - Message: `feat(scholarship): add minimize-to-floating-button functionality`
  - Files: `scripts/scholarship-subpage-modal.js`, `styles/scholarship-subpage-modal.css`

---

- [ ] 7. **Playwright Test Suite** (Wave 3)

  **What to do**:
  - Create `tests/scholarship-subpage.spec.js`
  - Write comprehensive tests for all modal functionality
  - Include tests for all 5 categories
  - Include tests for minimize/restore functionality
  - Include tests for bilingual switching

  **Test Cases**:
  ```javascript
  describe('Scholarship Subpage Modal', () => {
    test('Modal opens for each category', async () => { ... });
    test('Modal displays correct content', async () => { ... });
    test('Minimize creates floating button', async () => { ... });
    test('Floating button restores modal', async () => { ... });
    test('Close removes modal and floating button', async () => { ... });
    test('Language toggle updates content', async () => { ... });
    test('Category-specific gradients applied', async () => { ... });
    test('Iframe loads Feishu form', async () => { ... });
    test('Responsive at 375px', async () => { ... });
  });
  ```

  **Must NOT do**:
  - Do NOT skip iframe tests
  - Do NOT use vague assertions

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 5, 6)
  - **Parallel Group**: Wave 3
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 5, 6

  **References**:
  - Create new file: `tests/scholarship-subpage.spec.js`
  - Pattern: Playwright test syntax

  **Acceptance Criteria**:
  - [ ] Test file created with all test cases
  - [ ] All tests pass
  - [ ] Tests cover open/close/minimize for all 5 categories
  - [ ] Tests cover bilingual switching
  - [ ] Tests cover responsive behavior

  **QA Scenarios**:
  ```
  Scenario: All Playwright tests pass
    Tool: Bash
    Steps:
      1. Run: npx playwright test tests/scholarship-subpage.spec.js
      2. Check exit code is 0
      3. Verify all tests passed
    Expected Result: All tests pass
    Evidence: .sisyphus/evidence/task-7-test-results.txt
  ```

  **Commit**: YES
  - Message: `test(scholarship): add Playwright test suite`
  - Files: `tests/scholarship-subpage.spec.js`

---

- [ ] 8. **Responsive Testing and Bug Fixes** (Wave 3)

  **What to do**:
  - Test all functionality at 375px viewport
  - Fix any responsive issues
  - Ensure modal is full-screen on mobile
  - Verify floating button positioning on mobile
  - Test touch interactions

  **Mobile Considerations**:
  - Modal should be full-screen (100% width/height)
  - Floating button should be positioned for thumb reach
  - Touch targets should be at least 44px
  - Form iframes should scroll properly

  **Must NOT do**:
  - Do NOT break desktop layout
  - Do NOT add unnecessary mobile-only features

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 5, 6)
  - **Parallel Group**: Wave 3
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 5, 6

  **References**:
  - File: `styles/scholarship-subpage-modal.css` - Add mobile media queries
  - Pattern: `styles/scholarship-dashboard.css` - Existing responsive patterns

  **Acceptance Criteria**:
  - [ ] Modal full-screen on mobile
  - [ ] All buttons accessible with thumb
  - [ ] No horizontal scroll
  - [ ] Iframe scrolls properly
  - [ ] Floating button correctly positioned

  **QA Scenarios**:
  ```
  Scenario: Modal full-screen on mobile
    Tool: Playwright
    Steps:
      1. Set viewport to 375x667
      2. Open leadership modal
      3. Verify modal width is 100%
      4. Verify no horizontal scroll
    Expected Result: Modal fills screen on mobile
    Evidence: .sisyphus/evidence/task-8-mobile-modal.png

  Scenario: Floating button positioned correctly on mobile
    Tool: Playwright
    Steps:
      1. Set viewport to 375x667
      2. Minimize modal
      3. Verify floating button is visible
      4. Verify button is in thumb-reachable position
    Expected Result: Floating button accessible on mobile
    Evidence: .sisyphus/evidence/task-8-mobile-float.png
  ```

  **Commit**: YES
  - Message: `fix(scholarship): responsive and integration fixes`
  - Files: `styles/scholarship-subpage-modal.css`

---

- [ ] 9. **Floating Button Persistence Across Pages** (Wave 3)

  **What to do**:
  - Include scholarship-subpage-modal.js on ALL scholarship-related pages
  - Ensure floating button state persists across page navigation
  - Use sessionStorage to store current category state
  - On page load, check sessionStorage and restore floating button if needed

  **Pages to Include Floating Button**:
  - `scholarship.html` (main scholarship page)
  - `scholarship-dashboard.html` (dashboard)
  - Any other scholarship sub-pages

  **State Management**:
  ```javascript
  // On modal minimize
  sessionStorage.setItem('scholarshipSubpageCategory', category);
  sessionStorage.setItem('scholarshipSubpageState', 'minimized');

  // On page load
  const savedCategory = sessionStorage.getItem('scholarshipSubpageCategory');
  const savedState = sessionStorage.getItem('scholarshipSubpageState');
  if (savedCategory && savedState === 'minimized') {
    showFloatingButton(savedCategory);
  }
  ```

  **Must NOT do**:
  - Do NOT use localStorage (should clear on session end)
  - Do NOT persist across browser restarts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7, 8)
  - **Parallel Group**: Wave 3
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 5, 6

  **References**:
  - File: `scholarship.html` - Add script include
  - File: `scholarship-dashboard.html` - Add script include
  - File: `scripts/scholarship-subpage-modal.js` - Add state persistence logic

  **Acceptance Criteria**:
  - [ ] Floating button visible on scholarship.html
  - [ ] Floating button visible on scholarship-dashboard.html
  - [ ] Minimizing on one page, navigating to another keeps floating button
  - [ ] Closing browser tab clears state (sessionStorage)
  - [ ] "Return to Dashboard" button preserves floating button state

  **QA Scenarios**:
  ```
  Scenario: Floating button persists across page navigation
    Tool: Playwright
    Steps:
      1. Open scholarship-dashboard.html
      2. Open leadership modal, minimize to floating button
      3. Navigate to scholarship.html (click logo or link)
      4. Verify floating button still visible
      5. Verify clicking it restores modal
    Expected Result: Floating button persists across navigation
    Evidence: .sisyphus/evidence/task-9-persistence.png

  Scenario: State clears on session end
    Tool: Playwright
    Steps:
      1. Open scholarship-dashboard.html
      2. Minimize modal to floating button
      3. Close browser tab
      4. Reopen scholarship-dashboard.html in new tab
      5. Verify no floating button appears
    Expected Result: No floating button after session ends
    Evidence: .sisyphus/evidence/task-9-session-clear.png

  Scenario: Return to Dashboard preserves floating button
    Tool: Playwright
    Steps:
      1. Open modal, minimize to floating button
      2. Click "返回仪表盘" button in modal header
      3. Verify page navigates to dashboard
      4. Verify floating button still visible
    Expected Result: Navigation preserves floating button
    Evidence: .sisyphus/evidence/task-9-dashboard-preserve.png
  ```

  **Commit**: YES
  - Message: `feat(scholarship): add floating button persistence across pages`
  - Files: `scripts/scholarship-subpage-modal.js`, `scholarship.html`, `scholarship-dashboard.html`

---

## Final Verification Wave

4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
- [ ] F2. **Code Quality Review** — `unspecified-high`
- [ ] F3. **Real Manual QA** — `unspecified-high`
- [ ] F4. **Scope Fidelity Check** — `deep`

---

## Commit Strategy

- **Commit 1**: `test: add Feishu iframe embedding validation test`
- **Commit 2**: `feat(scholarship): add subpage modal component (JS + CSS)`
- **Commit 3**: `feat(scholarship): add category content configuration`
- **Commit 4**: `feat(scholarship): add i18n translations for subpage content`
- **Commit 5**: `feat(scholarship): integrate modal with dashboard buttons`
- **Commit 6**: `feat(scholarship): add minimize-to-floating-button functionality`
- **Commit 7**: `test(scholarship): add Playwright test suite`
- **Commit 8**: `fix(scholarship): responsive and integration fixes`
- **Commit 9**: `feat(scholarship): add floating button persistence across pages`

---

## Success Criteria

### Verification Commands
```bash
# Open test page and verify all iframes load
open tests/test-feishu-iframe.html

# Run Playwright tests
npx playwright test tests/scholarship-subpage.spec.js
```

### Final Checklist
- [ ] All 6 Feishu iframes load without X-Frame-Options blocking
- [ ] Modal opens for all 5 categories from dashboard
- [ ] Minimize creates floating button with correct category name
- [ ] Floating button restores modal correctly
- [ ] Close button returns to dashboard
- [ ] Category-specific gradient backgrounds applied
- [ ] Bilingual content displays correctly
- [ ] Responsive at 375px viewport