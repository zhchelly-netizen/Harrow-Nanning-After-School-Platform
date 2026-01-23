# CCA课程点击切换功能修复

## 修复时间
2026年1月22日

---

## 问题描述

用户反馈：CCA课程选择页面中，点击课程后会选中，但再次点击同一课程无法取消选择。需要实现点击切换功能（toggle）。

---

## 修复方案

### 1. 修改 `selectCCA()` 函数

添加了点击切换逻辑：
- 检测用户是否点击了已选中的课程
- 如果是，则调用新的 `unselectCCA()` 函数取消选择
- 如果不是，则继续原有的选择流程

```javascript
function selectCCA(day, course) {
    // 检查是否点击了已选中的课程（切换取消选择）
    if (selectedCCAs[day] && selectedCCAs[day].id === course.id) {
        // 取消选择
        unselectCCA(day);
        return;
    }
    
    // 检查是否有时间冲突
    const conflict = checkCCAConflict(day, course);
    
    if (conflict) {
        // 显示冲突对话框
        showConflictDialog(day, course, conflict);
        return;
    }
    
    // 没有冲突，直接选择
    confirmSelectCCA(day, course);
}
```

### 2. 新增 `unselectCCA()` 函数

专门处理取消选择的逻辑：

```javascript
function unselectCCA(day) {
    // 移除该天的选择
    document.querySelectorAll(`[data-day="${day}"]`).forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 从数据中删除
    delete selectedCCAs[day];
    
    // 更新浮动规划框
    if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
        floatingPlanner.updateCCASelection(day, null);
    }
    
    showSuccessMessage('已取消选择');
}
```

---

## 功能特性

### ✅ 点击切换
- **首次点击**：选中课程，显示蓝色高亮
- **再次点击**：取消选择，移除高亮
- **切换其他课程**：自动取消旧选择，选中新课程

### ✅ 数据同步
- UI状态（CSS class）与数据状态（selectedCCAs）保持同步
- 浮动规划框实时更新显示
- 取消选择后，该天显示为"未选择"状态

### ✅ 用户反馈
- 取消选择时显示提示："已取消选择"
- 选择课程时保持原有的提示逻辑

---

## 工作流程

```
用户点击课程
    ↓
selectCCA(day, course) 被调用
    ↓
检查：是否点击了已选中的课程？
    ↓
是 → unselectCCA(day)
    ├─ 移除UI高亮 (classList.remove('selected'))
    ├─ 删除数据 (delete selectedCCAs[day])
    ├─ 更新浮动规划框 (updateCCASelection(day, null))
    └─ 显示提示 ("已取消选择")
    ↓
否 → 继续原有流程
    ├─ 检查冲突
    ├─ 确认选择
    └─ 更新浮动规划框
```

---

## 浮动规划框更新

浮动规划框的 `updateCCASelection()` 方法需要能够处理 `null` 值（表示取消选择）：

```javascript
// 在 floating-planner.js 中
updateCCASelection(day, course) {
    // course 可能为 null（取消选择）
    this.updateWeekSchedule();
    
    // 检查是否所有工作日都已选择
    const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const selectedDays = typeof selectedCCAs !== 'undefined' 
        ? Object.keys(selectedCCAs).filter(d => requiredDays.includes(d)) 
        : [];
    
    if (selectedDays.length === requiredDays.length) {
        this.updateProgress(3);
    }
}
```

---

## 修改文件

| 文件 | 修改内容 | 行数 |
|------|---------|------|
| `scripts/cca.js` | 修改 `selectCCA()` 函数，添加切换逻辑 | ~420-435 |
| `scripts/cca.js` | 新增 `unselectCCA()` 函数 | ~436-450 |

---

## 测试场景

### 场景1：基本切换功能
1. 点击周一的某个课程（如"滑板"）
2. **验证**：课程卡片显示蓝色高亮，浮动规划框显示该课程
3. 再次点击"滑板"
4. **验证**：
   - ✅ 高亮消失
   - ✅ 显示提示"已取消选择"
   - ✅ 浮动规划框周一显示"未选择"
   - ✅ `selectedCCAs['monday']` 被删除

### 场景2：切换不同课程
1. 点击周一的"滑板"
2. **验证**：滑板被选中
3. 点击周一的"机器魁地奇"
4. **验证**：
   - ✅ 滑板高亮消失
   - ✅ 机器魁地奇高亮显示
   - ✅ 浮动规划框显示机器魁地奇

### 场景3："不参加"选项切换
1. 点击周一的"不参加"
2. **验证**："不参加"被选中
3. 再次点击"不参加"
4. **验证**：
   - ✅ 选择被取消
   - ✅ 周一恢复为未选择状态

### 场景4：邀请制课程切换
1. 点击邀请制课程，在弹窗中确认
2. **验证**：课程被选中
3. 再次点击该邀请制课程
4. **验证**：
   - ✅ 选择被取消（不弹出对话框）
   - ✅ 显示"已取消选择"

### 场景5：验证步骤3的验证逻辑
1. 选择周一到周五的课程
2. 取消周三的选择
3. 点击"下一步"
4. **验证**：
   - ✅ 显示错误提示："请为所有工作日选择课程或'不参加'"
   - ✅ 无法进入步骤4

---

## 边界情况处理

### ✅ 被精英项目占用的日期
- 这些日期不显示课程选项
- 不受切换功能影响
- `selectedCCAs[day]` 保持 `{ blocked: true }` 状态

### ✅ 冲突课程的取消
- 如果用户强制添加了冲突课程
- 再次点击可以正常取消
- 冲突覆盖信息一并删除

### ✅ 数据一致性
- UI状态和数据状态始终保持同步
- 浮动规划框实时反映最新状态
- 步骤验证基于最新的 `selectedCCAs` 数据

---

## 用户体验改进

### 之前
- ❌ 点击已选中的课程无反应
- ❌ 用户必须选择其他课程才能改变选择
- ❌ 无法"反悔"取消选择

### 之后
- ✅ 点击已选中的课程可以取消选择
- ✅ 提供清晰的视觉反馈（高亮消失）
- ✅ 显示友好的提示消息
- ✅ 浮动规划框实时更新
- ✅ 符合用户的直觉操作习惯

---

## 技术细节

### 选择状态判断
```javascript
// 通过比较 course.id 判断是否点击了已选中的课程
if (selectedCCAs[day] && selectedCCAs[day].id === course.id) {
    unselectCCA(day);
    return;
}
```

### DOM操作
```javascript
// 移除所有该天课程的高亮
document.querySelectorAll(`[data-day="${day}"]`).forEach(slot => {
    slot.classList.remove('selected');
});
```

### 数据清理
```javascript
// 使用 delete 操作符删除对象属性
delete selectedCCAs[day];
```

### 浮动规划框通知
```javascript
// 传递 null 表示取消选择
floatingPlanner.updateCCASelection(day, null);
```

---

## 相关功能

### 已有功能（不受影响）
- ✅ 冲突检测
- ✅ 邀请制课程对话框
- ✅ 强制添加冲突课程
- ✅ 步骤验证
- ✅ 价格计算
- ✅ 课程表生成

### 增强功能
- ✅ 浮动规划框冲突检测（之前修复）
- ✅ 点击切换选择（本次修复）

---

## 后续优化建议

1. **视觉反馈增强**
   - 添加取消选择的动画效果
   - 使用不同的颜色或图标表示"可取消"状态

2. **批量操作**
   - 添加"清空本周选择"按钮
   - 添加"重置为默认"功能

3. **撤销功能**
   - 实现操作历史记录
   - 支持撤销/重做操作

4. **键盘支持**
   - 支持键盘导航选择课程
   - 支持快捷键操作

---

## 修复确认

✅ **问题1**：浮动规划框冲突检测 - 已修复  
✅ **问题2**：CCA课程点击切换功能 - 已修复  

**所有功能已完成并准备测试！** 🎉

---

## 版本信息
- 修复日期：2026年1月22日
- 修复内容：CCA课程点击切换功能
- 影响范围：CCA选择页面、浮动规划框
- 测试状态：待用户测试确认
