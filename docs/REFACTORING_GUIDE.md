# 代码重构指南

本文档详细说明如何将大型JavaScript文件拆分为ES6模块。

---

## 📊 当前代码结构分析

### scripts/cca.js (2126行)

**当前状态**: 单文件包含所有功能
**风险等级**: 高 - 拆分需要全面测试
**依赖关系**:
- i18n.js (翻译系统)
- cca-data.js (CCA数据)
- main.js (通用功能)
- floating-planner.js (浮动规划器)

---

## 🎯 拆分方案

### 方案概述

将 `scripts/cca.js` 拆分为以下模块：

```
scripts/cca/
├── config.js              # 配置和常量
├── translations.js        # 翻译映射
├── navigation.js          # 步骤导航
├── courseLoader.js        # 课程加载
├── conflictManager.js     # 冲突管理
├── summaryGenerator.js    # 摘要生成
├── scheduleRenderer.js    # 时间表渲染
├── utils.js              # 工具函数
└── main.js               # 主入口
```

---

## 📝 详细拆分步骤

### 第一步：创建模块目录

```bash
mkdir -p scripts/cca
```

---

### 第二步：提取配置和常量

**文件**: `scripts/cca/config.js`

```javascript
// 精英项目时间表配置
export const ELITE_SCHEDULES = {
    'football-primary': { days: ['tue', 'thu'], time: '16:00-17:00', blocksWeekdays: true },
    'football-secondary': { days: ['mon', 'tue', 'thu'], time: '16:00-18:00', blocksWeekdays: true },
    // ... 其他配置
};

// 全局状态
export let currentStep = 1;
export let studentData = {};
export let selectedElitePrograms = [];
export let selectedCCAs = {};

// 状态更新函数
export function updateCurrentStep(step) {
    currentStep = step;
}

export function updateStudentData(data) {
    studentData = { ...studentData, ...data };
}

export function updateSelectedElitePrograms(programs) {
    selectedElitePrograms = programs;
}

export function updateSelectedCCAs(ccas) {
    selectedCCAs = ccas;
}
```

**原文件行数**: 1-43行 (~43行)

---

### 第三步：提取翻译映射

**文件**: `scripts/cca/translations.js`

```javascript
// 精英项目翻译映射
export const ELITE_PROGRAM_TRANSLATIONS = {
    'zh': {
        'football-primary': '⚽ 足球（小学）',
        'football-secondary': '⚽ 足球（中学）',
        // ... 其他翻译
    },
    'en': {
        'football-primary': '⚽ Football (Primary)',
        'football-secondary': '⚽ Football (Secondary)',
        // ... 其他翻译
    }
};

export function updateEliteProgramsLanguage() {
    // 函数实现
}
```

**原文件行数**: 72-202行 (~130行)

---

### 第四步：提取步骤导航

**文件**: `scripts/cca/navigation.js`

```javascript
import { currentStep, updateCurrentStep } from './config.js';
import { validateStep } from './validation.js';
import { saveStepData } from './dataManager.js';
import { loadCCACourses } from './courseLoader.js';
import { generateSummary } from './summaryGenerator.js';

export function nextStep(step) {
    if (!validateStep(currentStep)) {
        return;
    }
    
    saveStepData(currentStep);
    updateCurrentStep(step);
    updateStepDisplay();
    
    if (step === 3) {
        loadCCACourses();
    }
    
    if (step === 4) {
        generateSummary();
    }
    
    if (step === 5) {
        generateRegistrationGuidePreview();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function prevStep(step) {
    updateCurrentStep(step);
    updateStepDisplay();
    // ... 其他逻辑
}

export function updateStepDisplay() {
    // 函数实现
}
```

**原文件行数**: 204-285行 (~81行)

---

### 第五步：提取课程加载

**文件**: `scripts/cca/courseLoader.js`

```javascript
import { selectedElitePrograms } from './config.js';
import { ELITE_SCHEDULES } from './config.js';

export async function loadCCACourses() {
    // 函数实现 (365-500行)
}

export function showInviteOnlyDialog(day, course) {
    // 函数实现 (501-523行)
}

export function closeInviteDialog() {
    // 函数实现 (526-531行)
}

export function acceptInvitation(day, courseId) {
    // 函数实现 (534-539行)
}

export function getBlockedDays() {
    // 函数实现 (542-569行)
}
```

**原文件行数**: 365-569行 (~204行)

---

### 第六步：提取冲突管理

**文件**: `scripts/cca/conflictManager.js`

```javascript
import { selectedCCAs, selectedElitePrograms } from './config.js';

export function selectCCA(day, course) {
    // 函数实现 (570-591行)
}

export function unselectCCA(day) {
    // 函数实现 (592-609行)
}

export function confirmSelectCCA(day, course, conflictOverride = null) {
    // 函数实现 (610-634行)
}

export function checkCCAConflict(day, course) {
    // 函数实现 (635-664行)
}

export function showConflictDialog(day, course, conflict) {
    // 函数实现 (665-751行)
}

export function closeConflictDialog() {
    // 函数实现 (752-760行)
}

export function forceAddCCA() {
    // 函数实现 (761-789行)
}

export function detectScheduleConflicts() {
    // 函数实现 (1765-1807行)
}

export function updateConflictWarnings() {
    // 函数实现 (1741-1764行)
}
```

**原文件行数**: 570-789, 1741-1807行 (~267行)

---

### 第七步：提取摘要生成

**文件**: `scripts/cca/summaryGenerator.js`

```javascript
import { studentData, selectedElitePrograms, selectedCCAs } from './config.js';

export function generateSummary() {
    // 函数实现 (790-915行)
}

export function generatePriceSummary(weekSchedule) {
    // 函数实现 (916-1043行)
}

export function parseFee(feeString) {
    // 函数实现 (1044-1058行)
}

export function generateScheduleImage() {
    // 函数实现 (1059-1494行)
}
```

**原文件行数**: 790-1494行 (~704行)

---

### 第八步：提取时间表渲染

**文件**: `scripts/cca/scheduleRenderer.js`

```javascript
export function generateSchedulePreview() {
    // 函数实现 (1495-1607行)
}

export function generateRegistrationGuidePreview() {
    // 函数实现 (1808-2111行)
}
```

**原文件行数**: 1495-1607, 1808-2111行 (~416行)

---

### 第九步：提取工具函数

**文件**: `scripts/cca/utils.js`

```javascript
export function submitSelection() {
    // 函数实现 (1608-1642行)
}

export function getKnowledgeIcon(category) {
    // 函数实现 (1643-1701行)
}

export function filterEliteProgramsByGrade(grade) {
    // 函数实现 (1702-1740行)
}

export function showDebateContact() {
    // 函数实现 (2112-2115行)
}

export function showHubContact() {
    // 函数实现 (2116-2119行)
}

export function showMathContact() {
    // 函数实现 (2120-2123行)
}

export function scrollToContact() {
    // 函数实现 (2124-2126行)
}
```

**原文件行数**: 1608-1701, 2112-2126行 (~119行)

---

### 第十步：创建主入口文件

**文件**: `scripts/cca/main.js`

```javascript
// 导入所有模块
import { currentStep } from './config.js';
import { nextStep, prevStep, updateStepDisplay } from './navigation.js';
import { loadCCACourses } from './courseLoader.js';
import { selectCCA, unselectCCA } from './conflictManager.js';
import { generateSummary } from './summaryGenerator.js';
import { generateSchedulePreview } from './scheduleRenderer.js';
import { submitSelection } from './utils.js';

// 初始化事件监听器
document.addEventListener('languageChanged', function(e) {
    console.log('Language changed to:', e.detail.lang);
    updateEliteProgramsLanguage();
    
    if (currentStep === 3) {
        loadCCACourses();
    } else if (currentStep === 4) {
        generateSummary();
        generateSchedulePreview();
    } else if (currentStep === 5) {
        generateRegistrationGuidePreview();
    }
    
    if (document.querySelector('.conflict-warning')) {
        updateConflictWarnings();
    }
});

// 导出全局函数（供HTML调用）
window.nextStep = nextStep;
window.prevStep = prevStep;
window.selectCCA = selectCCA;
window.unselectCCA = unselectCCA;
window.submitSelection = submitSelection;
```

---

## 🔄 HTML文件修改

### 修改前

```html
<script src="scripts/cca.js?v=20260128"></script>
```

### 修改后

```html
<script type="module" src="scripts/cca/main.js?v=20260128"></script>
```

**注意事项**:
1. 必须使用 `type="module"`
2. ES6模块默认严格模式
3. 模块作用域隔离，需要显式导出到window
4. 需要服务器支持（不能直接打开HTML文件）

---

## ⚠️ 拆分风险

### 高风险点

1. **全局变量依赖**
   - 问题: 多个函数共享全局变量（currentStep, studentData等）
   - 解决: 使用模块导出和导入，或使用状态管理

2. **HTML内联事件**
   - 问题: HTML中使用 `onclick="nextStep(2)"`
   - 解决: 需要将函数导出到window对象

3. **函数调用链**
   - 问题: 函数之间相互调用
   - 解决: 正确管理导入关系

4. **依赖顺序**
   - 问题: 脚本加载顺序
   - 解决: ES6模块自动处理依赖

---

## 🧪 测试清单

拆分后必须测试的功能：

- [ ] 步骤导航（下一步/上一步）
- [ ] 学生信息保存
- [ ] 精英项目选择
- [ ] CCA课程加载
- [ ] 课程冲突检测
- [ ] 邀请制课程处理
- [ ] 摘要生成
- [ ] 时间表预览
- [ ] 价格计算
- [ ] 提交功能
- [ ] 语言切换
- [ ] 浏览器兼容性

---

## 📦 渐进式重构建议

### 阶段1：准备（当前）
- ✅ 创建模块目录
- ✅ 分析代码结构
- ✅ 制定拆分计划
- ⚠️ 备份原始文件

### 阶段2：低风险拆分
- 提取纯函数（utils.js）
- 提取配置常量（config.js）
- 提取翻译映射（translations.js）

### 阶段3：中风险拆分
- 提取导航逻辑（navigation.js）
- 提取冲突管理（conflictManager.js）

### 阶段4：高风险拆分
- 提取摘要生成（summaryGenerator.js）
- 重构全局状态管理

### 阶段5：集成测试
- 全面功能测试
- 性能测试
- 浏览器兼容性测试

---

## 💡 替代方案

如果拆分风险过高，可以采用以下方案：

### 方案1：保持单文件，添加注释分区
```javascript
// ===================================
// 配置和常量
// ===================================
// ...

// ===================================
// 步骤导航
// ===================================
// ...
```

### 方案2：使用IIFE模块模式
```javascript
const CCAConfig = (function() {
    // 模块代码
    return {
        ELITE_SCHEDULES,
        // 导出
    };
})();
```

### 方案3：引入构建工具
- 使用 Webpack / Rollup / Vite
- 自动处理模块打包
- 更好的代码分割

---

## 🎓 最佳实践

1. **小步重构**: 每次只拆分一个模块，立即测试
2. **保留备份**: 拆分前备份原始文件
3. **版本控制**: 使用Git管理，便于回滚
4. **文档同步**: 更新README和开发文档
5. **团队沟通**: 确保所有开发者了解变更

---

*最后更新: 2026-03-18*