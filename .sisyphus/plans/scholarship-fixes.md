# 奖学金移动端优化和 Typo 修复

## TL;DR

> **目标**：修复 typo 并优化移动端卡片样式，让收缩状态更紧凑
> 
> **交付物**：
> - 修复 "清晰" → "清洗" typo
> - 优化移动端收缩卡片高度，确保嵌入标签完全显示
> 
> **预计工作量**：快速（15 分钟内）

---

## Work Objectives

### Core Objective
1. 修复警告卡片中的 typo
2. 优化移动端卡片样式，收缩状态更紧凑，展开时占据全屏空间

### Concrete Deliverables
- `scholarship-dashboard.html` — 修复 typo
- `styles/scholarship-subpage-modal.css` — 优化移动端样式

### Must Have
- Typo 修复：清晰 → 清洗
- 移动端收缩卡片高度优化（确保嵌入标签完全显示）
- 展开卡片占据可用空间

### Must NOT Have
- 不要改变桌面端样式
- 不要改变功能逻辑

---

## TODOs

- [ ] 1. 修复 Typo: 清晰 → 清洗

  **What to do**:
  - 在 `scholarship-dashboard.html` 第 49 行
  - 将 "数据库清晰完成后" 改为 "数据库清洗完成后"

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] Typo 已修复
  - [ ] 运行 `grep "清洗" scholarship-dashboard.html` 确认

  **Commit**: YES
  - Message: `fix: correct typo 清晰 → 清洗 in warning card`

---

- [ ] 2. 优化移动端收缩卡片样式

  **What to do**:
  - 在 `styles/scholarship-subpage-modal.css` 中添加移动端专用样式
  - 收缩状态的卡片：
    - 减小 padding（从 1rem 1.25rem → 0.75rem 1rem）
    - 减小字体大小（从 1rem → 0.9rem）
    - 减小 step-badge 大小（从 28px → 24px）
    - 确保嵌入标签（如 Feishu 表单预览）在收缩时完全可见
  - 展开状态的卡片：
    - 保持 flex: 1 占据可用空间
    - iframe 高度自适应

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] 移动端（375px 宽度）测试：收缩卡片高度紧凑
  - [ ] 嵌入标签在收缩状态下完全可见
  - [ ] 展开卡片占据可用空间
  - [ ] 桌面端样式不受影响

  **QA Scenarios**:

  ```
  Scenario: 移动端收缩卡片测试
    Tool: chrome-devtools
    Steps:
      1. 设置 viewport 为 375x667（iPhone）
      2. 打开奖学金 dashboard
      3. 点击任意类别按钮打开 modal
      4. 验证收缩卡片高度紧凑（< 60px）
      5. 验证嵌入标签（如 Feishu 表单预览）完全可见
    Expected Result: 收缩卡片高度 < 60px，嵌入标签完整显示
    Evidence: .sisyphus/evidence/task-2-mobile-collapsed.png

  Scenario: 移动端展开卡片测试
    Tool: chrome-devtools
    Steps:
      1. 点击卡片标题展开
      2. 验证卡片占据可用空间
      3. 验证 iframe 高度自适应
    Expected Result: 展开卡片占据可用空间，iframe 完整显示
    Evidence: .sisyphus/evidence/task-2-mobile-expanded.png
  ```

  **Commit**: YES
  - Message: `style: optimize mobile collapsed card height`

---

## Commit Strategy

- **1**: `fix: correct typo 清晰 → 清洗 in warning card` — scholarship-dashboard.html:49
- **2**: `style: optimize mobile collapsed card height` — scholarship-subpage-modal.css

---

## Success Criteria

### Verification Commands
```bash
grep "清洗" scholarship-dashboard.html  # Expected: match found
grep "清晰" scholarship-dashboard.html   # Expected: no match (in warning context)
```

### Final Checklist
- [ ] Typo 已修复
- [ ] 移动端收缩卡片高度优化
- [ ] 嵌入标签在收缩状态下完全可见
- [ ] 展开卡片占据可用空间
- [ ] 桌面端样式不受影响
