# 奖学金系统更新计划

**项目**: 南宁哈罗礼德学校奖学金系统  
**更新日期**: 2026-03-18  
**版本**: V2627.0.1 → V2627.1.0

---

## 📋 更新概览

### 更新范围
- **文件**: `scholarship.html`, `scripts/scholarship.js`, `styles/scholarship.css`
- **文档**: `docs/guides/SCHOLARSHIP_GUIDE.md` (新建)
- **数据**: 奖学金类型、评价类别、申请条件

### 更新优先级
- 🔴 **P0**: 必须更新（影响核心功能）
- 🟡 **P1**: 建议更新（改善用户体验）
- 🟢 **P2**: 可选更新（增强功能）

---

## 🎯 第一阶段：核心内容更新（P0）

### 任务1.1：评价类别调整 🔴

**问题**: 评价类别从4个增加到5个，艺术类别拆分

**具体修改**:

#### 1.1.1 HTML更新（scholarship.html）

**位置**: 第133-149行

**修改前**:
```html
<div class="evaluation-categories">
    <h3 data-i18n="evaluationCategories">评价类别</h3>
    <div class="categories-grid-compact">
        <div class="category-card-compact academic-cat">
            <h4 data-i18n="academic">学术</h4>
        </div>
        <div class="category-card-compact sports-cat">
            <h4 data-i18n="sports">体育</h4>
        </div>
        <div class="category-card-compact arts-cat">
            <h4 data-i18n="arts">艺术</h4>
        </div>
        <div class="category-card-compact leadership-cat">
            <h4 data-i18n="leadership">领导力</h4>
        </div>
    </div>
</div>
```

**修改后**:
```html
<div class="evaluation-categories">
    <h3 data-i18n="evaluationCategories">评价类别</h3>
    <div class="categories-grid-compact five-categories">
        <div class="category-card-compact academic-cat">
            <h4 data-i18n="academic">学术</h4>
            <p class="category-desc" data-i18n="academicDesc">学科成绩、学术竞赛、考级认证等</p>
        </div>
        <div class="category-card-compact sports-cat">
            <h4 data-i18n="competitiveSports">竞技体育</h4>
            <p class="category-desc" data-i18n="sportsDesc">校队项目、体育竞赛、运动员注册等</p>
        </div>
        <div class="category-card-compact music-performing-arts-cat">
            <h4 data-i18n="musicPerformingArts">音乐与表演艺术</h4>
            <p class="category-desc" data-i18n="musicArtsDesc">音乐演出、戏剧表演、艺术竞赛、考级等</p>
        </div>
        <div class="category-card-compact visual-arts-cat">
            <h4 data-i18n="visualArts">视觉艺术</h4>
            <p class="category-desc" data-i18n="visualArtsDesc">艺术作品、展览、竞赛获奖等</p>
        </div>
        <div class="category-card-compact leadership-cat">
            <h4 data-i18n="leadershipService">领导力与服务</h4>
            <p class="category-desc" data-i18n="leadershipDesc">学生会、社团领导、社区服务、公益项目等</p>
        </div>
    </div>
</div>
```

#### 1.1.2 CSS更新（styles/scholarship.css）

**新增样式**:
```css
/* 五类别网格布局 */
.categories-grid-compact.five-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
}

/* 新增类别样式 */
.category-card-compact.music-performing-arts-cat {
    background: linear-gradient(135deg, #9d8b9e 0%, #b8a5c7 100%);
}

.category-card-compact.visual-arts-cat {
    background: linear-gradient(135deg, #c17767 0%, #d4998a 100%);
}

/* 类别描述文字 */
.category-desc {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 0.5rem;
    line-height: 1.4;
}
```

#### 1.1.3 i18n更新（scripts/i18n.js）

**新增翻译键**:
```javascript
// 评价类别
'competitiveSports': { zh: '竞技体育', en: 'Competitive Sports' },
'musicPerformingArts': { zh: '音乐与表演艺术', en: 'Music & Performing Arts' },
'visualArts': { zh: '视觉艺术', en: 'Visual Arts' },
'leadershipService': { zh: '领导力与服务', en: 'Leadership & Service' },

// 类别描述
'academicDesc': { 
    zh: '学科成绩、学术竞赛、考级认证等', 
    en: 'Academic performance, competitions, and certification exams' 
},
'sportsDesc': { 
    zh: '校队项目、体育竞赛、运动员注册等', 
    en: 'School team programs, sports competitions, and athlete registration' 
},
'musicArtsDesc': { 
    zh: '音乐演出、戏剧表演、艺术竞赛、考级等', 
    en: 'Music performances, theatrical performances, art competitions, and graded exams' 
},
'visualArtsDesc': { 
    zh: '艺术作品、展览、竞赛获奖等', 
    en: 'Artworks, exhibitions, and awards in competitions' 
},
'leadershipDesc': { 
    zh: '学生会、社团领导、社区服务、公益项目等', 
    en: 'Student union, club leaders, community service, and public welfare projects' 
}
```

---

### 任务1.2：申请先决条件具体化 🔴

**问题**: 现有表述过于笼统，需要具体化

**具体修改**:

#### 1.2.1 HTML更新（scholarship.html）

**位置**: 第158-165行

**修改前**:
```html
<ul class="rules-list">
    <li data-i18n="prerequisite1">在册身份与年级要求符合当年度规定</li>
    <li data-i18n="prerequisite2">出勤与迟到记录符合标准</li>
    <li data-i18n="prerequisite3">学术表现达到 HEP 进阶体系"光荣晋级"或以上</li>
    <li data-i18n="prerequisite4">不存在其他冲突性学费减免或同类奖学金</li>
</ul>
```

**修改后**:
```html
<ul class="rules-list">
    <li>
        <strong data-i18n="identityReq">身份要求：</strong>
        <span data-i18n="identityReqDesc">2025-26学年就读，且2026-27学年在册学生；约翰·里昂奖学金及校长奖学金仅授予六年级及以上学生</span>
    </li>
    <li>
        <strong data-i18n="attendanceReq">出勤要求：</strong>
        <span data-i18n="attendanceReqDesc">总缺勤天数≤5天，总迟到次数≤5次</span>
    </li>
    <li>
        <strong data-i18n="academicReq">学术成绩：</strong>
        <span data-i18n="academicReqDesc">平均成绩≥5，单科不得有U或低于15%得分</span>
    </li>
    <li>
        <strong data-i18n="disciplineReq">纪律要求：</strong>
        <span data-i18n="disciplineReqDesc">不能有面见总督学、中方校长的纪律问题，不能有学术不端或违法行为</span>
    </li>
    <li>
        <strong data-i18n="conflictReq">无冲突项目：</strong>
        <span data-i18n="conflictReqDesc">非教师子女、非其他学费减免学生、非AISL奖学金获得者（全额/半额奖学金适用）</span>
    </li>
</ul>
```

#### 1.2.2 添加详细说明表格

**新增内容**（在申请先决条件后）:
```html
<div class="requirements-table">
    <h4 data-i18n="requirementsSummary">申请条件一览表</h4>
    <table class="req-table">
        <thead>
            <tr>
                <th data-i18n="reqType">条件类型</th>
                <th data-i18n="reqSpecific">具体要求</th>
                <th data-i18n="reqScope">适用范围</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td data-i18n="identity">身份</td>
                <td data-i18n="identityDetail">2025-26在读，2026-27在册</td>
                <td data-i18n="allApplicants">所有申请人</td>
            </tr>
            <tr>
                <td data-i18n="attendance">出勤</td>
                <td data-i18n="attendanceDetail">缺勤、迟到≤5次</td>
                <td data-i18n="allApplicants">所有申请人</td>
            </tr>
            <tr>
                <td data-i18n="academic">学术</td>
                <td data-i18n="academicDetail">均分≥5，单科无U</td>
                <td data-i18n="allApplicants">所有申请人</td>
            </tr>
            <tr>
                <td data-i18n="noConflict">无冲突项目</td>
                <td data-i18n="noConflictDetail">非教师子女/非AISL奖学金获得者</td>
                <td data-i18n="fullHalfScholarship">全额/半额奖学金</td>
            </tr>
        </tbody>
    </table>
</div>
```

#### 1.2.3 CSS更新

**新增样式**:
```css
.requirements-table {
    margin: 1.5rem 0;
}

.requirements-table h4 {
    font-size: 1.1rem;
    color: var(--primary-navy);
    margin-bottom: 1rem;
}

.req-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.req-table thead {
    background: var(--primary-navy);
    color: white;
}

.req-table th,
.req-table td {
    padding: 0.875rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.req-table tbody tr:last-child td {
    border-bottom: none;
}

.req-table tbody tr:hover {
    background: #f8f9fa;
}
```

---

### 任务1.3：时间线窗口明确化 🔴

**问题**: 缺少具体的时间窗口信息

**具体修改**:

#### 1.3.1 添加时间线模块

**位置**: 在"数据与申请机制"部分后

**新增内容**:
```html
<div class="rules-section">
    <h3>📅 <span data-i18n="timelineTitle">统计与确认时间线</span></h3>
    
    <div class="timeline-intro">
        <p data-i18n="timelineIntro">奖学金评审分为两个核心阶段：统计阶段与意愿确认阶段。统计是一个半主动的数据收集过程，由学校和家庭共同完成，窗口期覆盖全学年；意愿确认是一个申请家庭主动的确认过程，只有几个月。</p>
    </div>

    <div class="timeline-cards">
        <div class="timeline-card data-collection">
            <div class="timeline-header">
                <h4 data-i18n="dataCollectionWindow">统计窗口</h4>
                <div class="timeline-dates">
                    <span class="date-start">2025.6.23</span>
                    <span class="date-separator">—</span>
                    <span class="date-end">2026.6.28</span>
                </div>
            </div>
            <div class="timeline-body">
                <p data-i18n="dataCollectionDesc">从上学年授奖日（Speech Day）当周周一起，至本学年授奖日周之前一周的周日止。</p>
                <div class="timeline-note">
                    <span class="note-icon">ℹ️</span>
                    <span data-i18n="dataCollectionNote">学校与家庭共同完成数据收集</span>
                </div>
            </div>
        </div>

        <div class="timeline-card intention-confirmation">
            <div class="timeline-header">
                <h4 data-i18n="intentionWindow">意愿确认窗口</h4>
                <div class="timeline-dates">
                    <span class="date-start">2026.1.1</span>
                    <span class="date-separator">—</span>
                    <span class="date-end">2026.6.12</span>
                </div>
            </div>
            <div class="timeline-body">
                <p data-i18n="intentionDesc">由家长主动完成确认，包括：</p>
                <ul class="timeline-list">
                    <li data-i18n="intentionItem1">明确竞争奖学金的意愿</li>
                    <li data-i18n="intentionItem2">整理、汇总、提交主观材料（个人陈述、作品、训练视频、推荐信等）</li>
                    <li data-i18n="intentionItem3">补全遗漏的客观材料（比赛、考级、运动员注册等）</li>
                </ul>
            </div>
        </div>

        <div class="timeline-card review-period">
            <div class="timeline-header">
                <h4 data-i18n="reviewPeriod">评审阶段</h4>
                <div class="timeline-dates">
                    <span class="date-start">2026.6.15</span>
                    <span class="date-separator">—</span>
                    <span class="date-end">2026.6.22</span>
                </div>
            </div>
            <div class="timeline-body">
                <p data-i18n="reviewDesc">评审委员会审核材料，进行综合评定。</p>
            </div>
        </div>

        <div class="timeline-card result-announcement">
            <div class="timeline-header">
                <h4 data-i18n="resultAnnouncement">结果公布</h4>
                <div class="timeline-dates">
                    <span class="date-end">2026.6.29（暂定）</span>
                </div>
            </div>
            <div class="timeline-body">
                <p data-i18n="resultDesc">公布结果，通知获奖学生。</p>
            </div>
        </div>
    </div>

    <div class="timeline-warning">
        <div class="warning-icon">⚠️</div>
        <div class="warning-text">
            <strong data-i18n="importantNotice">重要提示：</strong>
            <span data-i18n="timelineWarning">若你在系统里有比赛记录，但是没有完成申请确认，你的孩子并不会自动获得奖学金的资格。</span>
        </div>
    </div>
</div>
```

#### 1.3.2 CSS更新

**新增样式**:
```css
.timeline-intro {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 4px solid var(--accent-gold);
}

.timeline-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
}

.timeline-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
}

.timeline-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.timeline-header {
    padding: 1.25rem;
    color: white;
}

.data-collection .timeline-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.intention-confirmation .timeline-header {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.review-period .timeline-header {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.result-announcement .timeline-header {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.timeline-header h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.timeline-dates {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    opacity: 0.95;
}

.timeline-body {
    padding: 1.25rem;
}

.timeline-body p {
    color: #4a5568;
    margin-bottom: 0.75rem;
}

.timeline-list {
    margin: 0;
    padding-left: 1.25rem;
    color: #4a5568;
}

.timeline-list li {
    margin-bottom: 0.5rem;
}

.timeline-note {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #6b7280;
}

.timeline-warning {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #fff5f5;
    border: 1px solid #fc8181;
    border-radius: 8px;
    margin-top: 1.5rem;
}

.timeline-warning .warning-icon {
    font-size: 1.5rem;
}

.timeline-warning .warning-text {
    flex: 1;
    color: #742a2a;
}
```

---

## 📝 第二阶段：内容补充（P1）

### 任务2.1：奖学金撤销条件表述统一 🟡

**问题**: 表述方式不一致，需要统一

**具体修改**:

#### 2.1.1 HTML更新（scholarship.html）

**位置**: 第194-216行

**修改后**:
```html
<div class="warning-grid">
    <div class="warning-card">
        <div class="warning-icon">🚫</div>
        <h4 data-i18n="disciplineIssues">纪律问题</h4>
        <p data-i18n="disciplineDesc">总督学、中方校长处理的纪律问题</p>
    </div>
    <div class="warning-card">
        <div class="warning-icon">📉</div>
        <h4 data-i18n="gradeDecline">学术成绩下滑</h4>
        <p data-i18n="gradeDeclineDesc">同比20%以上的学术成绩降幅</p>
    </div>
    <div class="warning-card">
        <div class="warning-icon">⚖️</div>
        <h4 data-i18n="integrityIssues">学术诚信</h4>
        <p data-i18n="integrityDesc">在作业、考试中作弊或帮助他人作弊</p>
    </div>
    <div class="warning-card">
        <div class="warning-icon">👤</div>
        <h4 data-i18n="civicObligations">公民义务</h4>
        <p data-i18n="civicDesc">违反中华人民共和国法律、法规</p>
    </div>
</div>
```

---

### 任务2.2：核心价值观展示 🟡

**问题**: 缺少核心价值观的展示

**具体修改**:

#### 2.2.1 在概览页面添加核心价值观

**位置**: 在overview-hero后

**新增内容**:
```html
<div class="core-values-section">
    <h3 data-i18n="coreValuesTitle">核心价值观 Core Values</h3>
    <p class="values-intro" data-i18n="valuesIntro">奖学金获得者需展现出我们的核心价值观：</p>
    
    <div class="values-grid">
        <div class="value-card courage">
            <div class="value-icon">💪</div>
            <h4 data-i18n="courage">勇气 Courage</h4>
            <p data-i18n="courageDesc">敢于挑战、勇于尝试、展现雄心与毅力</p>
        </div>
        <div class="value-card honour">
            <div class="value-icon">🎖️</div>
            <h4 data-i18n="honour">荣誉 Honour</h4>
            <p data-i18n="honourDesc">诚实正直、尊重他人、维护学校声誉</p>
        </div>
        <div class="value-card humility">
            <div class="value-icon">🙏</div>
            <h4 data-i18n="humility">谦和 Humility</h4>
            <p data-i18n="humilityDesc">虚心学习、认可他人贡献、保持谦逊</p>
        </div>
        <div class="value-card fellowship">
            <div class="value-icon">🤝</div>
            <h4 data-i18n="fellowship">互助 Fellowship</h4>
            <p data-i18n="fellowshipDesc">团队协作、帮助他人、共同成长</p>
        </div>
    </div>
</div>
```

#### 2.2.2 CSS更新

**新增样式**:
```css
.core-values-section {
    margin: 2rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 12px;
}

.core-values-section h3 {
    font-size: 1.5rem;
    color: var(--primary-navy);
    margin-bottom: 0.5rem;
}

.values-intro {
    color: #6b7280;
    margin-bottom: 1.5rem;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.value-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s, box-shadow 0.3s;
}

.value-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.value-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
}

.value-card h4 {
    font-size: 1.1rem;
    color: var(--primary-navy);
    margin-bottom: 0.5rem;
}

.value-card p {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.5;
}

/* 不同价值观的颜色主题 */
.value-card.courage {
    border-top: 3px solid #ef4444;
}

.value-card.honour {
    border-top: 3px solid #f59e0b;
}

.value-card.humility {
    border-top: 3px solid #10b981;
}

.value-card.fellowship {
    border-top: 3px solid #3b82f6;
}
```

---

### 任务2.3：重要提示与规则补充 🟡

**问题**: 缺少重要提示与规则说明

**具体修改**:

#### 2.3.1 在申请页面添加重要提示

**位置**: 在application-process后

**新增内容**:
```html
<div class="important-rules">
    <h3 data-i18n="importantRules">重要提示与规则</h3>
    
    <div class="rule-cards">
        <div class="rule-card">
            <div class="rule-icon">✅</div>
            <h4 data-i18n="acceptRules">接受规则</h4>
            <p data-i18n="acceptRulesDesc">提交申请即表示您已完全理解并接受奖学金的规则和算法。</p>
        </div>
        
        <div class="rule-card">
            <div class="rule-icon">📋</div>
            <h4 data-i18n="responsibility">责任与截止</h4>
            <p data-i18n="responsibilityDesc">申请人和家庭对申请材料的完整性负全责。截止日期后仍未完成的材料将按现有内容评审，恕不补充。</p>
        </div>
        
        <div class="rule-card">
            <div class="rule-icon">⚖️</div>
            <h4 data-i18n="finalAuthority">最终解释权</h4>
            <p data-i18n="finalAuthorityDesc">学校保留奖学金提名、规则、数据及结果的最终解释权。欢迎对平衡机制和鼓励范围提出建设性意见，反馈将作为下年度制度修订的重要参考。</p>
        </div>
    </div>
</div>
```

---

## 🎨 第三阶段：UI/UX优化（P2）

### 任务3.1：类别卡片设计优化 🟢

**优化目标**: 5个类别如何美观展示

**设计建议**:
- 使用渐变色区分不同类别
- 添加图标增强识别度
- 添加简短描述文字
- 优化响应式布局

### 任务3.2：时间线可视化 🟢

**优化目标**: 时间线更直观

**设计建议**:
- 使用时间轴图形
- 添加进度指示
- 突出当前阶段
- 添加倒计时功能

### 任务3.3：申请表单优化 🟢

**优化目标**: 提升申请体验

**设计建议**:
- 分步骤表单
- 实时验证
- 自动保存草稿
- 材料上传进度

---

## 📋 i18n翻译更新汇总

### 新增翻译键（需要添加到 scripts/i18n.js）

```javascript
// 评价类别
'competitiveSports': { zh: '竞技体育', en: 'Competitive Sports' },
'musicPerformingArts': { zh: '音乐与表演艺术', en: 'Music & Performing Arts' },
'visualArts': { zh: '视觉艺术', en: 'Visual Arts' },
'leadershipService': { zh: '领导力与服务', en: 'Leadership & Service' },

// 类别描述
'academicDesc': { 
    zh: '学科成绩、学术竞赛、考级认证等', 
    en: 'Academic performance, competitions, and certification exams' 
},
'sportsDesc': { 
    zh: '校队项目、体育竞赛、运动员注册等', 
    en: 'School team programs, sports competitions, and athlete registration' 
},
'musicArtsDesc': { 
    zh: '音乐演出、戏剧表演、艺术竞赛、考级等', 
    en: 'Music performances, theatrical performances, art competitions, and graded exams' 
},
'visualArtsDesc': { 
    zh: '艺术作品、展览、竞赛获奖等', 
    en: 'Artworks, exhibitions, and awards in competitions' 
},
'leadershipDesc': { 
    zh: '学生会、社团领导、社区服务、公益项目等', 
    en: 'Student union, club leaders, community service, and public welfare projects' 
},

// 申请先决条件
'identityReq': { zh: '身份要求：', en: 'Identity Requirements: ' },
'identityReqDesc': { 
    zh: '2025-26学年就读，且2026-27学年在册学生；约翰·里昂奖学金及校长奖学金仅授予六年级及以上学生', 
    en: 'Students enrolled in 2025-26 and still on the rolls for 2026-27; John Lyon Scholarship and Head\'s Scholarship are only awarded to students in G6 and above' 
},
'attendanceReq': { zh: '出勤要求：', en: 'Attendance Requirements: ' },
'attendanceReqDesc': { zh: '总缺勤天数≤5天，总迟到次数≤5次', en: 'Total absences ≤5 days, total late arrivals ≤5 times' },
'academicReq': { zh: '学术成绩：', en: 'Academic Performance: ' },
'academicReqDesc': { zh: '平均成绩≥5，单科不得有U或低于15%得分', en: 'Average grade ≥5, without single subject at U or below 15% score percentage' },
'disciplineReq': { zh: '纪律要求：', en: 'Discipline Requirements: ' },
'disciplineReqDesc': { 
    zh: '不能有面见总督学、中方校长的纪律问题，不能有学术不端或违法行为', 
    en: 'No disciplinary issues involving face-to-face meetings with the Superintendent or Chinese principals, no academic misconduct, and no illegal activities' 
},
'conflictReq': { zh: '无冲突项目：', en: 'No Conflicting Projects: ' },
'conflictReqDesc': { 
    zh: '非教师子女、非其他学费减免学生、非AISL奖学金获得者（全额/半额奖学金适用）', 
    en: 'Not a staff child, not other tuition reduction students, not AISL scholarship recipients (for Full/Half Scholarship)' 
},

// 时间线
'timelineTitle': { zh: '统计与确认时间线', en: 'Data Collection and Confirmation Timeline' },
'timelineIntro': { 
    zh: '奖学金评审分为两个核心阶段：统计阶段与意愿确认阶段。统计是一个半主动的数据收集过程，由学校和家庭共同完成，窗口期覆盖全学年；意愿确认是一个申请家庭主动的确认过程，只有几个月。', 
    en: 'The scholarship review consists of two core stages: the data collection stage and the intention confirmation stage. Data collection is a semi-automatic process done collectively by the school and families, with a window period covering the entire academic year; intention confirmation is a proactive confirmation process done by each applicant family, only lasting for a few months.' 
},
'dataCollectionWindow': { zh: '统计窗口', en: 'Data Collection Window' },
'dataCollectionDesc': { 
    zh: '从上学年授奖日（Speech Day）当周周一起，至本学年授奖日周之前一周的周日止。', 
    en: 'From the Monday of the previous Speech Day week to the Sunday before the current awarding week.' 
},
'dataCollectionNote': { zh: '学校与家庭共同完成数据收集', en: 'School and parents collect data together' },
'intentionWindow': { zh: '意愿确认窗口', en: 'Intention Confirmation Window' },
'intentionDesc': { zh: '由家长主动完成确认，包括：', en: 'Parents proactively complete the confirmation, including:' },
'intentionItem1': { zh: '明确竞争奖学金的意愿', en: 'Confirm intention to compete for scholarship' },
'intentionItem2': { zh: '整理、汇总、提交主观材料（个人陈述、作品、训练视频、推荐信等）', en: 'Organize, compile, and submit subjective materials (personal statements, portfolios, training videos, recommendation letters, etc.)' },
'intentionItem3': { zh: '补全遗漏的客观材料（比赛、考级、运动员注册等）', en: 'Complete the missing objective materials (competitions, graded exams, sportsman registration, etc.)' },
'reviewPeriod': { zh: '评审阶段', en: 'Review Period' },
'reviewDesc': { zh: '评审委员会审核材料，进行综合评定。', en: 'The review panel reviews materials and conducts comprehensive assessment.' },
'resultAnnouncement': { zh: '结果公布', en: 'Result Announcement' },
'resultDesc': { zh: '公布结果，通知获奖学生。', en: 'Release results and notify awarded students.' },
'importantNotice': { zh: '重要提示：', en: 'Important Notice: ' },
'timelineWarning': { 
    zh: '若你在系统里有比赛记录，但是没有完成申请确认，你的孩子并不会自动获得奖学金的资格。', 
    en: 'If you have competition records in the system but have not completed the application confirmation, your child will not automatically qualify for any scholarship.' 
},

// 撤销条件
'civicObligations': { zh: '公民义务', en: 'Civic Obligations' },
'civicDesc': { zh: '违反中华人民共和国法律、法规', en: 'Violation of Laws and Regulations of the People\'s Republic of China' },

// 核心价值观
'coreValuesTitle': { zh: '核心价值观', en: 'Core Values' },
'valuesIntro': { zh: '奖学金获得者需展现出我们的核心价值观：', en: 'Scholarship recipients are required to demonstrate our core values:' },
'courage': { zh: '勇气', en: 'Courage' },
'courageDesc': { zh: '敢于挑战、勇于尝试、展现雄心与毅力', en: 'Dare to challenge, try new things, demonstrate ambition and perseverance' },
'honour': { zh: '荣誉', en: 'Honour' },
'honourDesc': { zh: '诚实正直、尊重他人、维护学校声誉', en: 'Integrity, respect for others, uphold the school\'s reputation' },
'humility': { zh: '谦和', en: 'Humility' },
'humilityDesc': { zh: '虚心学习、认可他人贡献、保持谦逊', en: 'Open to learning, acknowledge others\' contributions, remain modest' },
'fellowship': { zh: '互助', en: 'Fellowship' },
'fellowshipDesc': { zh: '团队协作、帮助他人、共同成长', en: 'Teamwork, help others, grow together' },

// 重要提示与规则
'importantRules': { zh: '重要提示与规则', en: 'Important Notice and Rules' },
'acceptRules': { zh: '接受规则', en: 'Acceptance of Rules' },
'acceptRulesDesc': { zh: '提交申请即表示您已完全理解并接受奖学金的规则和算法。', en: 'Submitting this application confirms your full understanding and acceptance of the scholarship rules and algorithm.' },
'responsibility': { zh: '责任与截止', en: 'Responsibility & Deadline' },
'responsibilityDesc': { zh: '申请人和家庭对申请材料的完整性负全责。截止日期后仍未完成的材料将按现有内容评审，恕不补充。', en: 'Applicants and families are solely responsible for application completeness. Incomplete submissions by the deadline will be assessed as-is with no supplementary materials permitted.' },
'finalAuthority': { zh: '最终解释权', en: 'Final Authority' },
'finalAuthorityDesc': { zh: '学校保留奖学金提名、规则、数据及结果的最终解释权。欢迎对平衡机制和鼓励范围提出建设性意见，反馈将作为下年度制度修订的重要参考。', en: 'The school holds final authority over all scholarship matters. Feedback on the balancing mechanism and incentive scope is welcome and will inform future revisions.' }
```

---

## ✅ 验收标准

### P0任务验收标准
- [ ] 评价类别从4个增加到5个，正确展示
- [ ] 艺术类别成功拆分为音乐与表演艺术和视觉艺术
- [ ] 申请先决条件具体化，包含明确的数字要求
- [ ] 时间线窗口完整展示四个阶段
- [ ] 所有页面在移动端和桌面端正常显示
- [ ] 中英文切换功能正常

### P1任务验收标准
- [ ] 撤销条件表述统一
- [ ] 核心价值观完整展示
- [ ] 重要提示与规则补充完整
- [ ] 所有新增内容有中英文翻译

### P2任务验收标准
- [ ] UI设计美观，符合哈罗学校品牌风格
- [ ] 响应式设计完美适配各种屏幕尺寸
- [ ] 交互流畅，无卡顿

---

## 📅 执行时间表

### 第1天：P0任务
- 上午：评价类别调整（任务1.1）
- 下午：申请先决条件具体化（任务1.2）
- 晚上：时间线窗口明确化（任务1.3）

### 第2天：P1任务
- 上午：撤销条件表述统一（任务2.1）
- 下午：核心价值观展示（任务2.2）
- 晚上：重要提示与规则补充（任务2.3）

### 第3-5天：P2任务（可选）
- UI/UX优化
- 测试和调试
- 文档更新

---

## 📚 参考文档

- **白皮书**: `scholarship_whitepaper.txt` (已提取)
- **对比分析**: `SCHOLARSHIP_COMPARISON.md`
- **现有页面**: `scholarship.html`
- **飞书文档链接**:
  - 学术奖学金计分模型
  - 竞技体育奖学金计分模型
  - 领导力奖学金计分模型
  - 音乐与表演艺术奖学金计分模型（新增）
  - 视觉艺术奖学金计分模型（新增）

---

*计划制定时间: 2026-03-18*  
*计划制定者: Claude AI Assistant*