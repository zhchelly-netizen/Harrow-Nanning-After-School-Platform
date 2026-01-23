# 多语言支持实施指南
# Multilingual Support Implementation Guide

## 📋 已完成的工作

### 1. ✅ 创建了国际化配置文件
- **文件**: `scripts/i18n.js`
- **功能**: 包含中英文所有翻译文本
- **特性**: 
  - 自动保存用户语言偏好到 localStorage
  - 支持动态切换语言
  - 提供翻译函数 `i18n.t(key)`

### 2. ✅ 添加了语言切换按钮
- **位置**: 页面右上角固定位置
- **样式**: 已添加到 `styles/cca.css`
- **功能**: 点击切换中英文

### 3. ✅ 更新了 HTML 结构
- 添加了语言切换按钮
- 为关键元素添加了 `data-i18n` 属性

## 🔧 如何使用

### 在 HTML 中添加多语言支持

#### 1. 引入 i18n.js（必须在其他脚本之前）

```html
<!-- 在 </body> 标签前，其他脚本之前引入 -->
<script src="scripts/i18n.js"></script>
<script src="scripts/elite-schedules.js"></script>
<script src="scripts/cca-config.js"></script>
<script src="scripts/floating-planner.js"></script>
<script src="scripts/cca.js"></script>
```

#### 2. 为静态文本添加 data-i18n 属性

```html
<!-- 普通文本 -->
<h2 data-i18n="step1Title">学生信息</h2>
<button data-i18n="nextStep">下一步</button>

<!-- 占位符文本 -->
<input type="text" data-i18n-placeholder="selectGrade" placeholder="请选择年级">

<!-- 标题属性 -->
<button data-i18n-title="close" title="关闭">×</button>
```

#### 3. 在 JavaScript 中使用翻译

```javascript
// 获取翻译文本
const buttonText = i18n.t('nextStep'); // "下一步" 或 "Next"

// 获取星期翻译
const monday = i18n.getDay('monday'); // "周一" 或 "Monday"
const monShort = i18n.getDay('monday', true); // "MON"

// 检查当前语言
if (i18n.getCurrentLanguage() === 'en') {
    // 英文模式
}

// 监听语言切换事件
window.addEventListener('languageChanged', function(e) {
    console.log('语言已切换到:', e.detail.lang);
    // 重新加载动态内容
    loadCCACourses();
});
```

## 📝 需要完成的工作

### 1. 更新 cca-planning.html 的所有文本

需要为以下元素添加 `data-i18n` 属性：

```html
<!-- 步骤1：学生信息 -->
<h2 class="section-title" data-i18n="step1Title">选择年级</h2>
<label data-i18n="grade">年级</label>
<select data-i18n-placeholder="selectGrade">
    <option value="" data-i18n="pleaseSelect">请选择年级</option>
</select>
<button data-i18n="nextStep">下一步 →</button>

<!-- 步骤2：精英项目 -->
<h2 class="section-title" data-i18n="step2Title">精英项目选择</h2>
<h3 data-i18n="eliteSports">精英体育校队</h3>
<h3 data-i18n="musicAcademy">哈罗音乐学院</h3>
<h3 data-i18n="academicCompetition">学术竞赛队伍</h3>

<!-- 步骤3：CCA课程 -->
<h2 class="section-title" data-i18n="step3Title">CCA课程选择</h2>
<h3 data-i18n="monday">周一</h3>
<h3 data-i18n="tuesday">周二</h3>
<!-- ... 其他星期 -->

<!-- 步骤4：确认 -->
<h2 class="section-title" data-i18n="step4Title">确认规划</h2>
<h3 data-i18n="studentInfo">学生信息</h3>
<h3 data-i18n="afterSchoolSchedule">课后时间安排</h3>
<h3 data-i18n="priceSummary">费用摘要</h3>

<!-- 步骤5：报名指引 -->
<h2 class="section-title" data-i18n="step5Title">报名指引</h2>
```

### 2. 更新 cca.js 中的动态内容

需要修改以下函数使用 `i18n.t()`:

#### loadCCACourses() 函数

```javascript
function loadCCACourses() {
    // 使用翻译
    const optOutText = i18n.t('optOut');
    const optOutDesc = i18n.t('optOutDesc');
    const freeText = i18n.t('free');
    const blockedText = i18n.t('blockedByElite');
    const noCoursesText = i18n.t('noCoursesAvailable');
    
    // 不参加选项
    optOutSlot.innerHTML = `
        <div class="slot-name">🚫 ${optOutText}</div>
        <div class="slot-teacher" style="font-size: 0.875rem; opacity: 0.7;">${optOutDesc}</div>
    `;
    
    // 被占用提示
    container.innerHTML = `
        <div class="blocked-notice">
            <p>⚠️ ${blockedText}</p>
        </div>
    `;
    
    // 费用显示
    const feeBadge = course.fee !== '¥0' 
        ? `<span>${course.fee}</span>` 
        : `<span>${freeText}</span>`;
}
```

#### generateSummary() 函数

```javascript
function generateSummary() {
    const studentInfoText = i18n.t('studentInfo');
    const gradeText = i18n.t('grade');
    const scheduleText = i18n.t('afterSchoolSchedule');
    
    let summaryHTML = `
        <h3>${studentInfoText}</h3>
        <p><strong>${gradeText}：</strong>${studentData.grade}</p>
        <h3>${scheduleText}</h3>
    `;
    
    // 星期名称
    const dayNames = {
        monday: i18n.getDay('monday') + ' ' + i18n.getDay('monday', true),
        tuesday: i18n.getDay('tuesday') + ' ' + i18n.getDay('tuesday', true),
        // ...
    };
}
```

#### showInviteOnlyDialog() 函数

```javascript
function showInviteOnlyDialog(day, course) {
    const title = i18n.t('inviteOnlyTitle');
    const desc1 = i18n.t('inviteOnlyDesc1');
    const desc2 = i18n.t('inviteOnlyDesc2');
    const cancelText = i18n.t('cancel');
    const inviteText = i18n.t('iHaveInvitation');
    
    dialog.innerHTML = `
        <div class="invite-dialog">
            <h3>${title}</h3>
            <p>${desc1}</p>
            <p>${desc2}</p>
            <div style="display: flex; gap: 1rem;">
                <button class="secondary-button" onclick="closeInviteDialog()">${cancelText}</button>
                <button class="primary-button" onclick="acceptInvitation('${day}', '${course.id}')">${inviteText}</button>
            </div>
        </div>
    `;
}
```

#### showConflictDialog() 函数

```javascript
function showConflictDialog(day, course, conflict) {
    const title = i18n.t('timeConflictWarning');
    const message = i18n.t('conflictMessage');
    const tip = i18n.t('conflictTip');
    const reasonLabel = i18n.t('conflictReasonLabel');
    const placeholder = i18n.t('conflictReasonPlaceholder');
    const important = i18n.t('conflictImportant');
    const cancelText = i18n.t('cancel');
    const forceAddText = i18n.t('forceAdd');
    
    // 星期名称
    const dayName = i18n.getDay(day);
    
    dialog.innerHTML = `
        <div class="conflict-dialog">
            <h3>${title}</h3>
            <p>${message}</p>
            <div><strong>${dayName}</strong> 16:00-17:00<br>${course.name}</div>
            <p>${tip}</p>
            <label>${reasonLabel}</label>
            <textarea id="conflict-reason" placeholder="${placeholder}"></textarea>
            <p>${important}</p>
            <button onclick="closeConflictDialog()">${cancelText}</button>
            <button onclick="forceAddCCA()">${forceAddText}</button>
        </div>
    `;
}
```

### 3. 更新 floating-planner.js

```javascript
class FloatingPlanner {
    constructor() {
        // ...
        this.updateLanguage();
        
        // 监听语言切换
        window.addEventListener('languageChanged', () => {
            this.updateLanguage();
        });
    }
    
    updateLanguage() {
        // 更新标题
        const title = this.container.querySelector('.planner-title');
        if (title) {
            title.textContent = i18n.t('floatingPlannerTitle');
        }
        
        // 重新渲染内容
        this.render();
    }
    
    render() {
        // 使用翻译的星期名称
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            const dayName = i18n.getDay(day, true); // MON, TUE, etc.
            // 渲染...
        });
    }
}
```

### 4. 为课程数据添加英文名称

在 `cca-config.js` 中：

```javascript
const CCA_COURSES = {
    monday: [
        {
            id: 'golf-primary',
            name: '小学部高尔夫',
            nameEn: 'Golf (Primary)',
            teacher: '张教练',
            teacherEn: 'Coach Zhang',
            category: 'sports',
            categoryName: '体育类',
            categoryNameEn: 'Sports',
            // ...
        }
    ]
};

// 辅助函数
function getCourseName(course) {
    return i18n.getCurrentLanguage() === 'en' ? course.nameEn : course.name;
}

function getTeacherName(course) {
    return i18n.getCurrentLanguage() === 'en' ? course.teacherEn : course.teacher;
}
```

## 🎯 实施步骤

### 第一步：引入 i18n.js
在 `cca-planning.html` 的 `</body>` 前添加：
```html
<script src="scripts/i18n.js"></script>
```

### 第二步：批量添加 data-i18n 属性
使用查找替换功能快速添加：
- 查找: `<h2 class="section-title">学生信息</h2>`
- 替换: `<h2 class="section-title" data-i18n="step1Title">学生信息</h2>`

### 第三步：更新 JavaScript 函数
逐个更新 `cca.js` 中的函数，将硬编码的中文文本替换为 `i18n.t(key)`

### 第四步：测试
1. 打开页面，点击右上角语言切换按钮
2. 检查所有文本是否正确切换
3. 测试动态生成的内容（对话框、提示信息等）
4. 刷新页面，确认语言偏好被保存

## 💡 最佳实践

1. **保持键名简洁明了**: 使用 `nextStep` 而不是 `next_step_button_text`
2. **分组管理**: 相关的翻译放在一起（如所有按钮文本）
3. **避免硬编码**: 所有用户可见的文本都应该通过 i18n 系统
4. **测试两种语言**: 确保英文文本长度不会破坏布局
5. **使用事件监听**: 动态内容应监听 `languageChanged` 事件

## 📱 移动端适配

语言切换按钮已针对移动端优化：
```css
@media (max-width: 768px) {
    .language-toggle {
        top: 10px;
        right: 10px;
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
    }
}
```

## 🚀 下一步

需要我帮你：
1. ✅ 批量更新 HTML 文件添加 data-i18n 属性
2. ✅ 修改 cca.js 中的所有函数使用 i18n.t()
3. ✅ 更新 floating-planner.js 支持多语言
4. ✅ 为所有课程数据添加英文名称

请告诉我你想先完成哪一步！
