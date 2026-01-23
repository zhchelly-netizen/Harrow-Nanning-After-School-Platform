# 🔍 CCA 课程加载和语言切换问题排查指南

## 问题现象
1. CCA 课程页面一直显示"加载课程中..."
2. 翻译后台无法显示内容
3. 语言切换按钮无法切换语言

## 诊断步骤

### 第一步：打开诊断页面
在浏览器中打开 `diagnostic.html`，这个页面会自动运行所有测试并显示结果。

**如何打开：**
1. 在浏览器中输入文件路径，或
2. 右键点击 `diagnostic.html` → 选择"打开方式" → 选择浏览器

### 第二步：检查浏览器控制台
1. 打开 `cca-planning.html`
2. 按 `F12` 或 `Cmd+Option+I` (Mac) 打开开发者工具
3. 切换到 "Console" 标签
4. 查看是否有红色错误信息

**常见错误及解决方案：**

#### 错误 1: `i18n is not defined`
**原因：** `i18n.js` 文件未正确加载

**解决方案：**
```html
<!-- 检查 HTML 中的脚本顺序，确保 i18n.js 在最前面 -->
<script src="scripts/i18n.js"></script>
<script src="scripts/cca-data.js"></script>
<script src="scripts/cca.js"></script>
```

#### 错误 2: `CCA_COURSES is not defined`
**原因：** `cca-data.js` 文件未正确加载

**解决方案：**
```html
<!-- 确保 cca-data.js 在 cca.js 之前加载 -->
<script src="scripts/cca-data.js"></script>
<script src="scripts/cca.js"></script>
```

#### 错误 3: `Cannot read property 'lang' of undefined`
**原因：** 事件详情对象属性名不匹配

**已修复：** 我们已经将所有地方统一为 `e.detail.lang`

### 第三步：检查文件是否正确加载

在浏览器控制台中运行以下命令：

```javascript
// 检查 i18n
console.log('i18n:', typeof i18n);
console.log('i18n.translations:', typeof i18n?.translations);
console.log('翻译键数量:', Object.keys(i18n?.translations?.zh || {}).length);

// 检查 CCA 数据
console.log('CCA_COURSES:', typeof CCA_COURSES);
console.log('周一课程数:', CCA_COURSES?.monday?.length);

// 检查 ELITE_SCHEDULES
console.log('ELITE_SCHEDULES:', typeof ELITE_SCHEDULES);
console.log('精英项目数:', Object.keys(ELITE_SCHEDULES || {}).length);
```

**预期输出：**
```
i18n: object
i18n.translations: object
翻译键数量: 284
CCA_COURSES: object
周一课程数: 19
ELITE_SCHEDULES: object
精英项目数: 60+
```

### 第四步：测试语言切换

在浏览器控制台中运行：

```javascript
// 测试语言切换
console.log('当前语言:', i18n.getCurrentLanguage());
i18n.switchLanguage();
console.log('切换后语言:', i18n.getCurrentLanguage());
```

**预期行为：**
- 第一次输出：`zh` 或 `en`
- 第二次输出：与第一次相反

### 第五步：手动触发 CCA 加载

在 CCA 页面的控制台中运行：

```javascript
// 检查是否进入了步骤 3
console.log('当前步骤:', currentStep);

// 手动触发加载
if (typeof loadCCACourses === 'function') {
    console.log('手动加载 CCA 课程...');
    loadCCACourses();
} else {
    console.error('loadCCACourses 函数不存在');
}
```

## 常见问题及解决方案

### 问题 1: 浏览器缓存导致旧代码运行

**症状：**
- 修改了代码但页面没有变化
- 控制台显示旧的错误信息

**解决方案：**
1. **硬刷新页面：**
   - Windows: `Ctrl + Shift + R` 或 `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **清除浏览器缓存：**
   - Chrome: 设置 → 隐私和安全 → 清除浏览数据
   - 选择"缓存的图片和文件"
   - 点击"清除数据"

3. **禁用缓存（开发时）：**
   - 打开开发者工具 (F12)
   - 切换到 Network 标签
   - 勾选 "Disable cache"

### 问题 2: 文件路径错误

**症状：**
- 控制台显示 404 错误
- 某些脚本文件无法加载

**解决方案：**
检查所有脚本标签的路径是否正确：

```html
<!-- 正确的路径 -->
<script src="scripts/i18n.js"></script>
<script src="scripts/cca-data.js"></script>
<script src="scripts/cca.js"></script>

<!-- 错误的路径示例 -->
<script src="script/i18n.js"></script>  <!-- 缺少 s -->
<script src="/scripts/i18n.js"></script>  <!-- 多了开头的 / -->
```

### 问题 3: 脚本加载顺序错误

**症状：**
- 控制台显示 "xxx is not defined"
- 某些功能无法使用

**正确的加载顺序：**
```html
<!-- 1. 首先加载 i18n（国际化系统） -->
<script src="scripts/i18n.js"></script>

<!-- 2. 然后加载数据文件 -->
<script src="scripts/cca-data.js"></script>

<!-- 3. 加载其他依赖 -->
<script src="scripts/main.js"></script>
<script src="scripts/floating-planner.js"></script>

<!-- 4. 最后加载主逻辑 -->
<script src="scripts/cca.js"></script>
```

### 问题 4: localStorage 数据损坏

**症状：**
- 语言切换后没有保存
- 页面行为异常

**解决方案：**
在控制台中运行：

```javascript
// 清除所有 localStorage 数据
localStorage.clear();

// 重新设置语言
localStorage.setItem('preferredLanguage', 'zh');

// 刷新页面
location.reload();
```

## 快速修复脚本

如果以上方法都不行，在控制台中运行以下脚本进行完整重置：

```javascript
// 完整重置脚本
(function() {
    console.log('🔧 开始系统重置...');
    
    // 1. 清除所有存储
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ 已清除存储');
    
    // 2. 设置默认语言
    localStorage.setItem('preferredLanguage', 'zh');
    console.log('✅ 已设置默认语言');
    
    // 3. 检查关键对象
    const checks = {
        'i18n': typeof i18n !== 'undefined',
        'CCA_COURSES': typeof CCA_COURSES !== 'undefined',
        'ELITE_SCHEDULES': typeof ELITE_SCHEDULES !== 'undefined'
    };
    
    console.log('📊 系统检查结果:', checks);
    
    // 4. 强制刷新
    console.log('🔄 3秒后将强制刷新页面...');
    setTimeout(() => {
        location.reload(true);
    }, 3000);
})();
```

## 验证修复是否成功

### 测试清单

#### ✅ i18n 系统
- [ ] 打开任意页面，控制台输入 `i18n`，应该返回对象
- [ ] 控制台输入 `i18n.t('heroTitle')`，应该返回中文文本
- [ ] 点击语言切换按钮，页面内容应该切换到英文
- [ ] 再次点击，应该切换回中文

#### ✅ CCA 课程加载
- [ ] 打开 `cca-planning.html`
- [ ] 选择年级（如 Year 7）
- [ ] 点击"下一步"两次，进入 CCA 选择页面
- [ ] 应该看到周一到周五的课程列表
- [ ] 每天应该有多个课程卡片可选

#### ✅ 管理后台
- [ ] 打开 `admin.html`
- [ ] 输入密码：`Mustslide-0xf6b5`
- [ ] 应该看到翻译列表
- [ ] 右下角应该显示统计信息（总键数、完成度等）

#### ✅ 语言切换
- [ ] 在任意页面点击语言切换按钮
- [ ] 所有文本应该立即切换
- [ ] 刷新页面，语言设置应该保持
- [ ] 导航到其他页面，语言设置应该一致

## 如果问题仍然存在

### 收集诊断信息

在控制台中运行以下命令，并将输出发送给我：

```javascript
// 生成诊断报告
(function() {
    const report = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: location.href,
        checks: {
            i18n: {
                exists: typeof i18n !== 'undefined',
                hasTranslations: typeof i18n?.translations !== 'undefined',
                currentLang: i18n?.getCurrentLanguage?.(),
                zhKeys: Object.keys(i18n?.translations?.zh || {}).length,
                enKeys: Object.keys(i18n?.translations?.en || {}).length
            },
            ccaData: {
                exists: typeof CCA_COURSES !== 'undefined',
                monday: CCA_COURSES?.monday?.length || 0,
                tuesday: CCA_COURSES?.tuesday?.length || 0,
                wednesday: CCA_COURSES?.wednesday?.length || 0,
                thursday: CCA_COURSES?.thursday?.length || 0,
                friday: CCA_COURSES?.friday?.length || 0
            },
            eliteSchedules: {
                exists: typeof ELITE_SCHEDULES !== 'undefined',
                count: Object.keys(ELITE_SCHEDULES || {}).length
            },
            localStorage: {
                preferredLanguage: localStorage.getItem('preferredLanguage')
            }
        },
        errors: consoleErrors || []
    };
    
    console.log('📋 诊断报告:');
    console.log(JSON.stringify(report, null, 2));
    
    // 复制到剪贴板
    const text = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(text).then(() => {
        console.log('✅ 报告已复制到剪贴板');
    });
    
    return report;
})();
```

### 联系支持

如果以上所有方法都无法解决问题，请提供：
1. 诊断报告（上面的脚本输出）
2. 浏览器控制台的截图
3. 浏览器版本信息
4. 操作系统版本

---

**最后更新：** 2026-01-22
**版本：** 1.0
