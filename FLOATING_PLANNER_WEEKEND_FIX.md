# Floating Planner 周末显示问题修复

## 问题描述

在"我的规划"浮动框中，**周五、周六、周日的精英项目活动不显示**。

### 具体表现：
- ✅ 周一到周四的精英项目正常显示
- ❌ 周五的精英项目不显示
- ❌ 周六的精英项目不显示
- ❌ 周日的精英项目不显示

### 示例场景：
选择游泳一队（周一、周二、周三、周四、周五、周六、周日），结果：
- 周一到周四：显示 ✓ 游泳队
- 周五到周日：显示 - （未选择）

---

## 问题原因

### 根本原因
`getActivitiesForDay` 函数中，获取 CCA 课程时直接检查 `selectedCCAs[dayKey]`，但是：

1. **周末没有 CCA 课程**
   - CCA 课程只在工作日（周一到周五）开设
   - `selectedCCAs` 对象只包含 `monday`, `tuesday`, `wednesday`, `thursday`, `friday`
   - 不包含 `saturday` 和 `sunday`

2. **代码逻辑问题**
   ```javascript
   // 旧代码
   if (typeof selectedCCAs !== 'undefined' && selectedCCAs[dayKey]) {
       // 这里会检查 selectedCCAs['saturday'] 和 selectedCCAs['sunday']
       // 但这两个键不存在，所以条件为 false
       // 导致整个函数提前返回，精英项目也不显示
   }
   ```

3. **实际问题**
   - 当 `dayKey` 是 'saturday' 或 'sunday' 时
   - `selectedCCAs[dayKey]` 返回 `undefined`
   - 条件 `selectedCCAs[dayKey]` 为 `false`
   - 但这不应该影响精英项目的显示！

### 为什么周五也不显示？

检查后发现，周五的问题是因为：
1. 游泳一队的配置中缺少 `'fri'`（已在之前修复）
2. 但即使修复了配置，如果代码逻辑有问题，周五仍然可能不显示

---

## 解决方案

### 修改前的代码

```javascript
getActivitiesForDay(dayShort, dayKey) {
    const activities = [];
    
    // 获取精英项目
    if (typeof selectedElitePrograms !== 'undefined') {
        selectedElitePrograms.forEach(program => {
            if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                const days = program.schedule.split(',');
                if (days.includes(dayShort)) {
                    const scheduleInfo = typeof ELITE_SCHEDULES !== 'undefined' ? ELITE_SCHEDULES[program.value] : null;
                    activities.push({
                        icon: '🏆',
                        name: program.label,
                        time: scheduleInfo ? scheduleInfo.time : '16:00-17:00',
                        type: 'elite',
                        typeLabel: '精英'
                    });
                }
            }
        });
    }
    
    // 获取CCA课程 - 问题在这里！
    if (typeof selectedCCAs !== 'undefined' && selectedCCAs[dayKey]) {
        const cca = selectedCCAs[dayKey];
        if (!cca.blocked) {
            activities.push({
                icon: cca.isOptOut ? '🚫' : '📚',
                name: cca.name,
                time: '16:00-17:00',
                type: cca.isOptOut ? 'optout' : 'cca',
                typeLabel: cca.isOptOut ? '不参加' : 'CCA'
            });
        }
    }
    
    return activities;
}
```

### 修改后的代码

```javascript
getActivitiesForDay(dayShort, dayKey) {
    const activities = [];
    
    // 获取精英项目
    if (typeof selectedElitePrograms !== 'undefined') {
        selectedElitePrograms.forEach(program => {
            if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                const days = program.schedule.split(',');
                if (days.includes(dayShort)) {
                    const scheduleInfo = typeof ELITE_SCHEDULES !== 'undefined' ? ELITE_SCHEDULES[program.value] : null;
                    activities.push({
                        icon: '🏆',
                        name: program.label,
                        time: scheduleInfo ? scheduleInfo.time : '16:00-17:00',
                        type: 'elite',
                        typeLabel: '精英'
                    });
                }
            }
        });
    }
    
    // 获取CCA课程（仅工作日有CCA）- 添加工作日检查
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    if (weekdays.includes(dayKey) && typeof selectedCCAs !== 'undefined' && selectedCCAs[dayKey]) {
        const cca = selectedCCAs[dayKey];
        if (!cca.blocked) {
            activities.push({
                icon: cca.isOptOut ? '🚫' : '📚',
                name: cca.name,
                time: '16:00-17:00',
                type: cca.isOptOut ? 'optout' : 'cca',
                typeLabel: cca.isOptOut ? '不参加' : 'CCA'
            });
        }
    }
    
    return activities;
}
```

### 关键改动

添加了工作日检查：
```javascript
const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
if (weekdays.includes(dayKey) && ...) {
    // 只在工作日检查 CCA 课程
}
```

这样：
- ✅ 工作日（周一到周五）：检查精英项目 + CCA 课程
- ✅ 周末（周六、周日）：只检查精英项目，不检查 CCA（因为周末没有 CCA）

---

## 修复效果

### 修复前
```
周一 ✓ (游泳队)
周二 ✓ (游泳队)
周三 ✓ (游泳队)
周四 ✓ (游泳队)
周五 - (不显示)
周六 - (不显示)
周日 - (不显示)
```

### 修复后
```
周一 ✓ (游泳队)
周二 ✓ (游泳队)
周三 ✓ (游泳队)
周四 ✓ (游泳队)
周五 ✓ (游泳队)
周六 ✓ (游泳队)
周日 ✓ (游泳队)
```

---

## 测试场景

### 测试 1：游泳一队（全周7天）

**步骤：**
1. 选择年级 G7
2. 选择精英项目：游泳一队
3. 查看"我的规划"浮动框

**预期结果：**
- ✅ 周一到周日都显示 ✓
- ✅ 展开后显示：🏆 游泳一队 16:00-17:30

### 测试 2：羽毛球一队（周二、周五、周日）

**步骤：**
1. 选择年级 G7
2. 选择精英项目：羽毛球一队
3. 查看"我的规划"浮动框

**预期结果：**
- ✅ 周二显示 ✓
- ✅ 周五显示 ✓
- ✅ 周日显示 ✓
- ✅ 其他天显示 -

### 测试 3：游泳预备队（周一、周三、周六、周日）

**步骤：**
1. 选择年级 G5
2. 选择精英项目：游泳预备队
3. 查看"我的规划"浮动框

**预期结果：**
- ✅ 周一显示 ✓
- ✅ 周三显示 ✓
- ✅ 周六显示 ✓
- ✅ 周日显示 ✓
- ✅ 其他天显示 -

### 测试 4：混合场景（精英项目 + CCA）

**步骤：**
1. 选择年级 G7
2. 选择精英项目：游泳一队（周一到周日）
3. 在周二选择 CCA 课程（如：袋鼠数学）
4. 查看"我的规划"浮动框

**预期结果：**
- ✅ 周一：显示 ✓，展开显示游泳队
- ✅ 周二：显示 ⚠️（冲突），展开显示游泳队 + 袋鼠数学
- ✅ 周三到周日：显示 ✓，展开显示游泳队

---

## 相关修复

### 1. 游泳一队配置修复（已完成）

**文件：** `scripts/cca-data.js`

**修改：**
```javascript
// 修改前
'swimming-team': {
    days: ['mon', 'wed', 'thu', 'sat', 'sun'],  // 缺少 tue 和 fri
    ...
}

// 修改后
'swimming-team': {
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],  // 完整的7天
    ...
}
```

### 2. Floating Planner 显示逻辑修复（本次修复）

**文件：** `scripts/floating-planner.js`

**修改：** `getActivitiesForDay` 函数，添加工作日检查

---

## 技术细节

### 数据结构

**selectedElitePrograms（精英项目）：**
```javascript
[
    {
        category: 'sports',
        value: 'swimming-team',
        label: '🏊 游泳一队',
        schedule: 'mon,tue,wed,thu,fri,sat,sun'  // 包含周末
    }
]
```

**selectedCCAs（CCA课程）：**
```javascript
{
    monday: { id: 'mon-1', name: '滑板', ... },
    tuesday: { id: 'tue-1', name: '袋鼠数学', ... },
    wednesday: { id: 'wed-1', name: '飞盘', ... },
    thursday: { id: 'thu-1', name: '硬笔书法', ... },
    friday: { id: 'fri-1', name: 'LAMDA公共演讲', ... }
    // 注意：没有 saturday 和 sunday
}
```

### 函数调用流程

```
updateElitePrograms()
    ↓
updateWeekSchedule()
    ↓
遍历 7 天（周一到周日）
    ↓
getActivitiesForDay(dayShort, dayKey)
    ↓
    ├─ 检查精英项目（所有天）
    └─ 检查 CCA 课程（仅工作日）
    ↓
返回 activities 数组
    ↓
updateMiniSummary()
```

---

## 注意事项

### 1. 工作日 vs 周末
- **工作日**（周一到周五）：有 CCA 课程 + 精英项目
- **周末**（周六、周日）：只有精英项目，没有 CCA 课程

### 2. 数据完整性
- 确保 `ELITE_SCHEDULES` 中的 `days` 数组包含所有训练日
- 周末的精英项目必须在 `days` 中包含 'sat' 和/或 'sun'

### 3. 显示逻辑
- 精英项目：根据 `schedule` 字段的 `days` 数组显示
- CCA 课程：只在工作日显示，根据 `selectedCCAs` 对象显示

---

**修复日期：** 2026年1月22日  
**版本：** v2.7 - Floating Planner 周末显示修复
