# CCA 课程加载问题修复报告

## 问题描述
CCA 课程页面一直显示"加载课程中..."，课程列表无法正常加载。

## 问题原因
在之前修复语言切换功能时，我们将 `i18n.js` 中的事件详情属性从 `detail.language` 改为 `detail.lang`，但忘记同步更新 `cca.js` 中的事件监听器。

**不一致的代码：**

**i18n.js (第 603 行):**
```javascript
window.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { lang: this.currentLang }  // ✅ 使用 lang
}));
```

**cca.js (第 11 行) - 修复前:**
```javascript
document.addEventListener('languageChanged', function(e) {
    console.log('Language changed to:', e.detail.language);  // ❌ 使用 language
    // ...
});
```

这导致 `e.detail.language` 返回 `undefined`，从而影响了后续的课程加载逻辑。

## 修复方案

将 `cca.js` 中的 `e.detail.language` 改为 `e.detail.lang`，与 `i18n.js` 保持一致。

**修复后的代码：**
```javascript
document.addEventListener('languageChanged', function(e) {
    console.log('Language changed to:', e.detail.lang);  // ✅ 统一使用 lang
    
    // 重新渲染当前步骤的内容
    if (currentStep === 3) {
        // 重新加载CCA课程列表
        loadCCACourses();
    } else if (currentStep === 4) {
        // 重新生成摘要
        generateSummary();
        generateSchedulePreview();
    } else if (currentStep === 5) {
        // 重新生成报名指引
        generateRegistrationGuidePreview();
    }
    
    // 更新冲突警告
    if (document.querySelector('.conflict-warning')) {
        updateConflictWarnings();
    }
});
```

## 修复文件
- `scripts/cca.js` - 第 11 行

## 测试步骤

1. 打开 `cca-planning.html`
2. 选择年级（例如：Year 7）
3. 点击"下一步"进入精英项目选择
4. 再次点击"下一步"进入 CCA 课程选择
5. 验证课程列表是否正常加载
6. 尝试切换语言，验证课程列表是否正确更新

## 预期结果

✅ CCA 课程列表正常加载并显示
✅ 可以选择不同的课程
✅ 语言切换时课程列表正确更新
✅ 所有动态内容正确翻译

## 根本原因分析

这个问题是由于在修复语言切换功能时，只修改了事件发送方（`i18n.js`），但没有检查所有事件接收方（`cca.js`）是否使用了相同的属性名。

## 预防措施

在未来修改事件接口时，应该：
1. 搜索所有使用该事件的文件
2. 确保所有监听器使用相同的属性名
3. 使用 TypeScript 或 JSDoc 定义事件接口以避免此类错误

---

**修复完成时间：** 2026-01-22
**修复状态：** ✅ 已完成
**影响范围：** CCA 课程选择页面
