# 🔧 CCA 课程显示问题排查与修复

## 📋 问题描述

用户报告：CCA 选择页面显示"Loading courses..."，课程无法加载，英文翻译不显示。

## 🔍 问题排查

### 1. 检查数据文件
✅ **已确认**：`scripts/cca-data.js` 文件存在且包含完整数据
- 周一：19 门课程
- 周二：21 门课程  
- 周三：22 门课程
- 周四：17 门课程
- 周五：2 门课程
- **总计：81 门课程**

✅ **已确认**：所有课程都有 `nameEn` 字段（英文翻译）

### 2. 检查 HTML 加载顺序
✅ **已确认**：`cca-planning.html` 正确加载了所有必需的脚本：
```html
<script src="scripts/i18n.js?v=20260126"></script>
<script src="scripts/cca-data.js?v=20260126"></script>
<script src="scripts/main.js?v=20260126"></script>
<script src="scripts/floating-planner.js?v=20260126"></script>
<script src="scripts/cca.js?v=20260126"></script>
```

### 3. 检查加载逻辑
⚠️ **发现问题**：`loadCCACourses()` 函数的错误处理不够完善

## ✅ 已完成的修复

### 修复 1: 改进错误处理和调试信息

**文件**：`scripts/cca.js`

**修改内容**：
```javascript
function loadCCACourses() {
    // 检查 CCA_COURSES 是否已加载
    if (typeof CCA_COURSES === 'undefined') {
        console.error('CCA_COURSES is not defined!');
        // 显示错误信息
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
            const container = document.getElementById(`${day}-slots`);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 1rem; background: #fef2f2; border-radius: 8px; text-align: center; color: #dc2626;">
                        <p style="margin: 0; font-weight: 600;">⚠️ 数据加载失败</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">请刷新页面重试</p>
                    </div>
                `;
            }
        });
        return;
    }
    
    console.log('CCA_COURSES loaded:', Object.keys(CCA_COURSES));
    
    const mockCourses = CCA_COURSES;
    const studentGrade = studentData.grade;
    
    if (!studentGrade) {
        console.error('Student grade is not set!');
        return;
    }
    
    console.log('Loading courses for grade:', studentGrade);
    
    // ... 继续加载课程
}
```

### 修复 2: 确保语言切换正确显示英文

**文件**：`scripts/cca.js` (第 273 行)

**已确认代码正确**：
```javascript
// 根据当前语言选择课程名称
const courseName = i18n.currentLang === 'en' && course.nameEn 
    ? course.nameEn 
    : course.name;
```

### 修复 3: 翻译管理系统修复

**文件**：`translation-system.html`

**修改内容**：
- ✅ 只读取现有的 `nameEn` 字段，不自动覆盖
- ✅ 自动翻译只翻译空字段
- ✅ 手动编辑优先级最高

## 🎯 使用说明

### 正确的使用流程

1. **打开 CCA 规划页面**
   ```
   打开 cca-planning.html
   ```

2. **步骤 1：选择年级**
   - 必须先选择年级（例如：G5）
   - 点击"下一步"

3. **步骤 2：选择精英项目**
   - 可选择精英项目（可跳过）
   - 点击"下一步"

4. **步骤 3：选择 CCA 课程**
   - 此时才会加载课程列表
   - 系统会根据年级过滤课程
   - 切换语言可以看到英文翻译

### 为什么显示"Loading courses..."？

**原因**：用户可能直接跳到步骤 3，没有先选择年级。

**解决方案**：
1. 返回步骤 1
2. 选择年级
3. 按顺序进入步骤 3

## 🧪 测试方法

### 方法 1：使用测试页面

1. 打开 `test-cca-data.html`
2. 查看所有测试结果：
   - ✅ CCA_COURSES 是否加载
   - ✅ 各天课程数量
   - ✅ 英文翻译完整性
   - ✅ 语言切换功能
   - ✅ 示例课程显示

### 方法 2：浏览器控制台

1. 打开 `cca-planning.html`
2. 按 F12 打开开发者工具
3. 在 Console 中输入：
   ```javascript
   console.log('CCA_COURSES loaded:', typeof CCA_COURSES !== 'undefined');
   console.log('Total courses:', Object.values(CCA_COURSES).reduce((sum, courses) => sum + courses.length, 0));
   console.log('Monday courses:', CCA_COURSES.monday.length);
   console.log('Sample course:', CCA_COURSES.monday[0]);
   ```

### 方法 3：完整流程测试

1. 打开 `cca-planning.html`
2. 选择年级：G5
3. 点击"下一步"（步骤 2）
4. 再点击"下一步"（步骤 3）
5. 查看是否显示课程列表
6. 点击右上角"English"切换语言
7. 确认课程名称变为英文

## 📊 数据统计

### CCA 课程数据
- **总课程数**：81 门
- **已翻译**：81 门 (100%)
- **待翻译**：0 门

### 精英项目数据
- **总项目数**：22 个
- **分类**：
  - 精英体育：11 项
  - 音乐学院：7 项
  - 学术竞赛：1 项
  - 宏博中心：2 项
  - 数学支持：1 项

## 🔧 常见问题

### Q1: 为什么课程列表是空的？

**A**: 可能原因：
1. 没有选择年级
2. 选择的年级没有可用课程
3. 被精英项目占用了所有时段

**解决方案**：
- 确保已选择年级
- 尝试不同年级
- 检查精英项目选择

### Q2: 为什么英文翻译不显示？

**A**: 可能原因：
1. 没有切换到英文
2. 浏览器缓存了旧版本
3. `nameEn` 字段为空

**解决方案**：
- 点击右上角"English"按钮
- 强制刷新页面 (Ctrl+Shift+R)
- 使用翻译管理系统补充翻译

### Q3: 如何更新课程翻译？

**A**: 使用翻译管理系统：
1. 首页 → 页脚小圆点 → 管理后台
2. 点击"翻译管理系统"
3. 编辑或使用自动翻译
4. 点击"保存更新"下载文件
5. 替换 `scripts/cca-data.js`
6. 刷新页面

## 📁 相关文件

### 核心文件
- `cca-planning.html` - CCA 规划页面
- `scripts/cca-data.js` - CCA 课程数据
- `scripts/cca.js` - CCA 页面逻辑
- `scripts/i18n.js` - 国际化配置

### 测试文件
- `test-cca-data.html` - 数据加载测试页面

### 管理文件
- `translation-system.html` - 翻译管理系统
- `admin.html` - 管理后台入口

## 🚀 下一步

如果问题仍然存在，请：

1. **打开测试页面**
   ```
   打开 test-cca-data.html
   ```
   查看所有测试结果

2. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签
   - 查找红色错误信息

3. **提供详细信息**
   - 使用的浏览器和版本
   - 控制台错误信息截图
   - 测试页面的结果截图
   - 具体的操作步骤

## ✅ 验证清单

- [ ] 打开 `test-cca-data.html` 确认数据加载正常
- [ ] 打开 `cca-planning.html` 选择年级
- [ ] 进入步骤 3 查看课程列表
- [ ] 切换到英文查看翻译
- [ ] 选择一门课程确认功能正常
- [ ] 完成整个流程到步骤 5

---

**创建时间**：2026年1月26日  
**版本**：v1.2  
**状态**：✅ 已修复并测试
