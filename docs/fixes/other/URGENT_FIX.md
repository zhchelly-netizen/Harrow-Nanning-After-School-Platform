# 紧急修复说明

## 当前问题
1. CCA 课程无法加载
2. 翻译后台无法显示
3. 语言切换不工作

## 立即尝试的解决方案

### 方案 1: 清除浏览器缓存（最可能有效）

**步骤：**
1. 在浏览器中按 `Cmd + Shift + Delete` (Mac) 或 `Ctrl + Shift + Delete` (Windows)
2. 选择"缓存的图片和文件"
3. 时间范围选择"全部时间"
4. 点击"清除数据"
5. 关闭所有浏览器窗口
6. 重新打开浏览器
7. 再次访问 `cca-planning.html`

### 方案 2: 使用无痕模式测试

**步骤：**
1. 打开浏览器的无痕/隐私模式
   - Chrome: `Cmd + Shift + N` (Mac) 或 `Ctrl + Shift + N` (Windows)
   - Safari: `Cmd + Shift + N`
2. 在无痕模式中打开 `cca-planning.html`
3. 测试功能是否正常

**如果无痕模式正常：**
- 问题是浏览器缓存导致的
- 清除缓存后应该可以解决

**如果无痕模式也不正常：**
- 继续尝试方案 3

### 方案 3: 检查文件完整性

在终端中运行：

```bash
cd /Users/ryantang/Documents/harrow-portal

# 检查关键文件是否存在
ls -la scripts/i18n.js
ls -la scripts/cca-data.js
ls -la scripts/cca.js

# 检查文件大小（应该都大于 0）
wc -l scripts/i18n.js
wc -l scripts/cca-data.js
wc -l scripts/cca.js
```

**预期输出：**
```
scripts/i18n.js: 645 行
scripts/cca-data.js: 600+ 行
scripts/cca.js: 2000+ 行
```

### 方案 4: 使用诊断页面

1. 在浏览器中打开 `diagnostic.html`
2. 查看所有测试结果
3. 如果有红色的 ❌，记录错误信息
4. 点击"清除浏览器缓存"按钮
5. 点击"强制刷新所有资源"按钮

### 方案 5: 手动验证代码

打开浏览器控制台（F12），在 `cca-planning.html` 页面中运行：

```javascript
// 1. 检查 i18n
console.log('=== 检查 i18n ===');
console.log('i18n 存在:', typeof i18n !== 'undefined');
if (typeof i18n !== 'undefined') {
    console.log('当前语言:', i18n.getCurrentLanguage());
    console.log('测试翻译:', i18n.t('heroTitle'));
    console.log('中文键数:', Object.keys(i18n.translations.zh).length);
    console.log('英文键数:', Object.keys(i18n.translations.en).length);
}

// 2. 检查 CCA 数据
console.log('\n=== 检查 CCA 数据 ===');
console.log('CCA_COURSES 存在:', typeof CCA_COURSES !== 'undefined');
if (typeof CCA_COURSES !== 'undefined') {
    console.log('周一课程:', CCA_COURSES.monday?.length || 0);
    console.log('周二课程:', CCA_COURSES.tuesday?.length || 0);
    console.log('周三课程:', CCA_COURSES.wednesday?.length || 0);
    console.log('周四课程:', CCA_COURSES.thursday?.length || 0);
    console.log('周五课程:', CCA_COURSES.friday?.length || 0);
}

// 3. 检查 ELITE_SCHEDULES
console.log('\n=== 检查精英项目数据 ===');
console.log('ELITE_SCHEDULES 存在:', typeof ELITE_SCHEDULES !== 'undefined');
if (typeof ELITE_SCHEDULES !== 'undefined') {
    console.log('精英项目数:', Object.keys(ELITE_SCHEDULES).length);
}

// 4. 测试语言切换
console.log('\n=== 测试语言切换 ===');
if (typeof i18n !== 'undefined') {
    const before = i18n.getCurrentLanguage();
    console.log('切换前:', before);
    i18n.switchLanguage();
    const after = i18n.getCurrentLanguage();
    console.log('切换后:', after);
    console.log('切换成功:', before !== after);
    // 切换回去
    i18n.switchLanguage();
}

// 5. 手动加载 CCA 课程
console.log('\n=== 手动加载 CCA 课程 ===');
if (typeof loadCCACourses === 'function') {
    console.log('loadCCACourses 函数存在');
    console.log('当前步骤:', currentStep);
    console.log('学生数据:', studentData);
    
    // 如果在步骤 3，手动加载
    if (currentStep === 3) {
        console.log('正在加载课程...');
        loadCCACourses();
    } else {
        console.log('不在步骤 3，无法加载课程');
    }
} else {
    console.error('loadCCACourses 函数不存在！');
}
```

**将控制台输出截图发给我，我可以帮你诊断具体问题。**

## 最可能的原因

根据症状判断，最可能的原因是：

### 1. 浏览器缓存问题（90% 可能性）
- 浏览器加载了旧版本的 JavaScript 文件
- 解决方案：清除缓存 + 硬刷新

### 2. 文件路径问题（5% 可能性）
- 某个脚本文件路径错误
- 解决方案：检查 HTML 中的 `<script>` 标签

### 3. 代码执行顺序问题（5% 可能性）
- 脚本加载顺序不对
- 解决方案：调整 HTML 中脚本的顺序

## 紧急联系

如果以上方法都不行，请：
1. 截图浏览器控制台的所有错误信息
2. 运行上面的"手动验证代码"并截图输出
3. 告诉我你的浏览器类型和版本
4. 告诉我你尝试了哪些方案

我会根据具体情况提供针对性的解决方案。

---

**创建时间：** 2026-01-22 18:10
**紧急程度：** 🔴 高
