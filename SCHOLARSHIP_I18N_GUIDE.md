# 奖学金页面多语言支持实施指南

## ✅ 已完成

1. ✅ 添加了语言切换按钮
2. ✅ 引入了 i18n.js
3. ✅ 为标签页添加了 data-i18n 属性
4. ✅ 为概览标题添加了 data-i18n 属性

## 📋 需要完成的工作

由于奖学金页面内容非常多，建议使用**后台管理系统**批量添加翻译。

### 方案一：使用后台管理系统（推荐）⭐

1. **访问后台**
   - 打开 `index.html`
   - 滚动到页面底部右下角
   - 点击小点 `·` 进入管理后台
   - 输入密码：`Mustslide-0xf6b5`

2. **批量添加奖学金翻译**
   
   点击"➕ 添加翻译"，逐个添加以下翻译键：

#### 页面基础
```
scholarshipPageTitle
中文：AISL 哈罗南宁奖学金
英文：AISL Harrow Nanning Scholarships

tabOverview
中文：奖学金概览
英文：Scholarship Overview

tabRules
中文：奖学金规则
英文：Scholarship Rules

tabApplication
中文：申请入口
英文：Application Portal
```

#### 概览页面
```
overviewHeroTitle
中文：识别卓越 · 激励成长
英文：Recognizing Excellence · Inspiring Growth

overviewHeroDesc
中文：奖学金系统是南宁哈罗礼德学校用于识别、激励并规范学生长期卓越发展的核心治理机制
英文：The scholarship system is a core governance mechanism at Harrow LiDe School Nanning for recognizing, motivating, and regulating students' long-term excellence

fullScholarshipBadge
中文：全额奖学金
英文：Full Scholarship

johnLyonTitle
中文：约翰·里昂全额奖学金
英文：John Lyon Full Scholarship

johnLyonAmount
中文：100% 学费减免
英文：100% Tuition Waiver

grantConditions
中文：授予条件
英文：Grant Conditions

johnLyonCond1
中文：在三个或以上评价类别中表现卓越
英文：Excellence in three or more evaluation categories

johnLyonCond2
中文：六年级及以上年级学生
英文：Grade 6 and above students

johnLyonCond3
中文：持续践行学校核心价值观
英文：Consistently uphold school core values

johnLyonCond4
中文：代表学校最高荣誉与学术标准
英文：Represent the school's highest honor and academic standards

reviewCycle
中文：评审周期：
英文：Review Cycle:

reviewCycleAnnual
中文：每学年评定一次
英文：Evaluated once per academic year

continuousReq
中文：持续要求：
英文：Continuous Requirements:

continuousReqDesc
中文：需保持各类别卓越表现
英文：Must maintain excellence in all categories

honorSymbol
中文：荣誉象征：
英文：Honor Symbol:

honorSymbolDesc
中文：学校最高级别奖学金
英文：School's highest level scholarship

halfScholarshipBadge
中文：半额奖学金
英文：Half Scholarship

principalTitle
中文：校长半额奖学金
英文：Principal's Half Scholarship

principalAmount
中文：50% 学费减免
英文：50% Tuition Waiver

principalCond1
中文：在两个评价类别中表现突出
英文：Outstanding performance in two evaluation categories

principalCond2
中文：六年级及以上年级学生
英文：Grade 6 and above students

principalCond3
中文：展现持续的卓越表现与发展潜力
英文：Demonstrate continuous excellence and development potential

principalCond4
中文：积极参与学校社区建设
英文：Actively participate in school community building

developmentPath
中文：发展路径：
英文：Development Path:

developmentPathDesc
中文：可晋升为全额奖学金
英文：Can be promoted to full scholarship

recognitionStandard
中文：认可标准：
英文：Recognition Standard:

recognitionStandardDesc
中文：双领域卓越表现
英文：Excellence in two domains

talentScholarshipBadge
中文：优才奖学金
英文：Talent Scholarship

talentTitle
中文：优才奖学金
英文：Talent Scholarship

talentAmount
中文：专项培养资源
英文：Specialized Development Resources

talentCond1
中文：在单一领域具有突出潜力与成果
英文：Outstanding potential and achievements in a single field

talentCond2
中文：所有年级均可申请
英文：Open to all grades

talentCond3
中文：获得专项培养资源与导师支持
英文：Receive specialized resources and mentor support

talentCond4
中文：展现该领域的持续投入与热情
英文：Demonstrate continuous commitment and passion in the field

supportContent
中文：支持内容：
英文：Support Content:

supportContentDesc
中文：专项训练、导师指导、资源配置
英文：Specialized training, mentor guidance, resource allocation

developmentGoal
中文：发展目标：
英文：Development Goal:

developmentGoalDesc
中文：培养单一领域专业人才
英文：Cultivate professionals in a single field

applicableScope
中文：适用范围：
英文：Applicable Scope:

applicableScopeDesc
中文：学术/体育/艺术/领导力任一领域
英文：Any field: Academic/Sports/Arts/Leadership

evaluationCategories
中文：评价类别
英文：Evaluation Categories

categoryAcademic
中文：学术
英文：Academic

categorySports
中文：体育
英文：Sports

categoryArts
中文：艺术
英文：Arts

categoryLeadership
中文：领导力
英文：Leadership

categoryAnyTwo
中文：任选两个类别
英文：Choose any two categories

categorySpecialized
中文：专项培养
英文：Specialized Development
```

3. **保存并应用**
   - 添加完所有翻译后
   - 点击"💾 保存更改"
   - 下载新的 `i18n.js`
   - 替换到 `scripts/i18n.js`

### 方案二：手动编辑 HTML（快速但不推荐）

如果需要快速实现，可以直接在 HTML 中添加 `data-i18n` 属性。

示例：
```html
<!-- 原来 -->
<h3>约翰·里昂全额奖学金</h3>

<!-- 修改后 -->
<h3 data-i18n="johnLyonTitle">约翰·里昂全额奖学金</h3>
```

但这种方式需要：
1. 手动为每个文本元素添加 `data-i18n`
2. 手动在 i18n.js 中添加对应的翻译
3. 工作量大，容易出错

## 🎯 推荐实施步骤

### 第1步：测试现有功能
1. 打开 `scholarship.html`
2. 点击右上角语言切换按钮
3. 确认标签页文本能正确切换

### 第2步：使用后台批量添加
1. 访问管理后台
2. 按照上面的列表逐个添加翻译
3. 每添加10-20个就保存一次（防止丢失）

### 第3步：更新 HTML
在 `scholarship.html` 中为对应元素添加 `data-i18n` 属性：

```html
<!-- 示例：奖学金卡片 -->
<div class="scholarship-type-card john-lyon">
    <div class="type-badge" data-i18n="fullScholarshipBadge">全额奖学金</div>
    <h3 data-i18n="johnLyonTitle">约翰·里昂全额奖学金</h3>
    <div class="type-amount" data-i18n="johnLyonAmount">100% 学费减免</div>
    <div class="type-requirements">
        <h4 data-i18n="grantConditions">授予条件</h4>
        <ul>
            <li data-i18n="johnLyonCond1">在<strong>三个或以上</strong>评价类别中表现卓越</li>
            <li data-i18n="johnLyonCond2">六年级及以上年级学生</li>
            <li data-i18n="johnLyonCond3">持续践行学校核心价值观</li>
            <li data-i18n="johnLyonCond4">代表学校最高荣誉与学术标准</li>
        </ul>
    </div>
</div>
```

### 第4步：测试完整功能
1. 刷新页面
2. 切换语言
3. 检查所有文本是否正确翻译

## 📝 注意事项

1. **保持键名一致**
   - HTML 中的 `data-i18n="johnLyonTitle"`
   - i18n.js 中的键名也必须是 `johnLyonTitle`

2. **特殊字符处理**
   - 如果文本中有 HTML 标签（如 `<strong>`），需要特殊处理
   - 建议在翻译中去掉 HTML 标签，只保留纯文本

3. **动态内容**
   - 如果有 JavaScript 动态生成的内容
   - 需要在 JS 中使用 `i18n.t('key')` 获取翻译

## 🚀 快速开始

最快的方式：

1. **现在就测试**
   ```
   打开 scholarship.html
   点击右上角 🌐 按钮
   看到标签页文字切换 ✅
   ```

2. **逐步完善**
   - 先完成最重要的部分（标题、按钮）
   - 再完成详细内容
   - 最后完成辅助文本

3. **使用后台管理**
   - 所有翻译集中管理
   - 新增翻译会高亮显示
   - 方便后续维护

## 💡 提示

- 奖学金页面内容多，建议分批完成
- 优先完成用户最常看的部分
- 使用后台管理系统可以大大提高效率
- 翻译完成后记得测试所有页面

---

**当前状态**：基础框架已完成，等待添加详细翻译  
**预计工作量**：使用后台管理约需 30-60 分钟  
**优先级**：中等（首页和 CCA 页面更重要）
