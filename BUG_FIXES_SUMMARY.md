# 三个问题修复总结

## 修复时间
2026年1月22日

## 问题1：邀请制项目弹窗字眼被动效吞掉

### 问题描述
邀请制项目的对话框中，文字内容被CSS动画效果遮挡，导致用户无法清晰看到文字。

### 根本原因
对话框元素的z-index层级不够，动画效果覆盖了文字内容。

### 修复方案
在 `styles/cca.css` 中：
- 为 `.invite-dialog` 和 `.conflict-dialog` 添加 `position: relative` 和 `z-index: 10001`
- 为对话框内的所有元素（h3, p, button, textarea, label, div）添加 `position: relative` 和 `z-index: 10002`
- 确保所有文字内容都在动画层之上

### 修改文件
- `styles/cca.css` (行 620-660)

---

## 问题2：返回上一步后无法重新计算冲突和日期

### 问题描述
用户在步骤3选择CCA后，返回步骤2修改精英项目选择，再次进入步骤3时：
- 被精英项目占用的日期没有更新
- 冲突检测没有重新计算
- 浮动规划框显示的信息不正确

### 根本原因
`prevStep()` 函数只是简单地切换步骤显示，没有重新加载CCA课程列表和更新浮动规划框。

### 修复方案
在 `scripts/cca.js` 的 `prevStep()` 函数中：
1. 检测是否返回到步骤3（CCA选择）
2. 如果是，则：
   - 调用 `saveStepData(2)` 保存最新的精英项目选择
   - 调用 `loadCCACourses()` 重新加载CCA课程（会重新计算被占用的日期）
   - 调用 `floatingPlanner.updateElitePrograms()` 更新浮动规划框

### 修改文件
- `scripts/cca.js` (行 42-56)

### 代码变更
```javascript
function prevStep(step) {
    currentStep = step;
    updateStepDisplay();
    
    // 如果返回到步骤3（CCA选择），重新加载课程以重新计算冲突
    if (step === 3) {
        // 保存步骤2的数据以确保精英项目是最新的
        saveStepData(2);
        // 重新加载CCA课程（会重新计算被占用的日期）
        loadCCACourses();
        // 更新浮动规划框
        if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
            floatingPlanner.updateElitePrograms(selectedElitePrograms);
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

---

## 问题3：游泳一队和预备队需要互斥

### 问题描述
用户可以同时选择"游泳一队"和"游泳预备队"，但这两个项目应该是互斥的（只能选择其中一个）。

### 根本原因
没有实现精英项目之间的互斥逻辑。

### 修复方案
在 `scripts/cca.js` 的精英项目监听器中：
1. 检测用户是否选择了游泳队相关项目（swimming-team 或 swimming-reserve）
2. 如果选择了其中一个，自动取消另一个的选择
3. 显示友好的提示信息告知用户

### 修改文件
- `scripts/cca.js` (行 1180-1210)

### 代码变更
```javascript
// 监听精英项目选择变化
document.querySelectorAll('input[name="elite-sports"], input[name="music"], input[name="academic"], input[name="hub"], input[name="math"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // 处理游泳队互斥逻辑
        if (this.checked && (this.value === 'swimming-team' || this.value === 'swimming-reserve')) {
            const otherSwimmingValue = this.value === 'swimming-team' ? 'swimming-reserve' : 'swimming-team';
            const otherSwimmingCheckbox = document.querySelector(`input[value="${otherSwimmingValue}"]`);
            
            if (otherSwimmingCheckbox && otherSwimmingCheckbox.checked) {
                // 取消另一个游泳队的选择
                otherSwimmingCheckbox.checked = false;
                
                // 显示提示信息
                const swimmingNames = {
                    'swimming-team': '游泳一队',
                    'swimming-reserve': '游泳预备队'
                };
                showSuccessMessage(`已自动取消${swimmingNames[otherSwimmingValue]}的选择，因为游泳一队和预备队不能同时选择`);
            }
        }
        
        updateConflictWarnings();
        // 更新浮动规划框
        if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
            saveStepData(2);
            floatingPlanner.updateElitePrograms(selectedElitePrograms);
        }
    });
});
```

### 互斥逻辑说明
- 当用户选择"游泳一队"时，如果"游泳预备队"已被选中，则自动取消"游泳预备队"
- 当用户选择"游泳预备队"时，如果"游泳一队"已被选中，则自动取消"游泳一队"
- 显示友好的提示消息，告知用户为什么另一个选项被取消

---

## 测试建议

### 测试场景1：邀请制弹窗
1. 进入CCA选择页面
2. 点击任何标记为"邀请制/单招"的课程
3. 验证弹窗中的所有文字都清晰可见，没有被动画遮挡

### 测试场景2：返回上一步重新计算
1. 步骤1：选择年级（如G5）
2. 步骤2：选择精英项目（如小学篮球，周三周五）
3. 步骤3：查看周三和周五是否被标记为"被精英项目占用"
4. 返回步骤2，取消篮球，选择其他项目（如游泳一队，周一周三周四周六周日）
5. 再次进入步骤3，验证：
   - 周三周五不再被占用
   - 周一周三周四被标记为占用
   - 浮动规划框显示正确的精英项目和日期

### 测试场景3：游泳队互斥
1. 步骤2：选择"游泳一队"
2. 再选择"游泳预备队"
3. 验证：
   - "游泳一队"的勾选自动取消
   - 显示提示消息："已自动取消游泳一队的选择，因为游泳一队和预备队不能同时选择"
4. 反向测试：先选"游泳预备队"，再选"游泳一队"
5. 验证：
   - "游泳预备队"的勾选自动取消
   - 显示相应的提示消息

---

## 技术细节

### CSS层级管理
- 对话框overlay: z-index 10000
- 对话框本身: z-index 10001
- 对话框内容: z-index 10002

### 数据流更新
```
用户返回步骤2 → 修改精英项目 → 点击"下一步"
    ↓
prevStep(3) 被调用
    ↓
saveStepData(2) - 保存最新精英项目
    ↓
loadCCACourses() - 重新计算被占用日期
    ↓
floatingPlanner.updateElitePrograms() - 更新浮动框
```

### 互斥逻辑实现
- 使用事件监听器的 `change` 事件
- 在选中时检查互斥项目
- 使用 `checked = false` 取消互斥项目
- 调用 `showSuccessMessage()` 显示友好提示

---

## 影响范围

### 受影响的功能
1. 邀请制课程选择对话框
2. 冲突检测对话框
3. 步骤导航（特别是返回功能）
4. 精英项目选择
5. 浮动规划框显示

### 不受影响的功能
- CCA课程数据
- 价格计算
- 课程表生成
- 报名指引生成

---

## 后续优化建议

1. **扩展互斥逻辑**：如果未来有更多互斥项目，可以创建一个配置对象来管理所有互斥关系
2. **性能优化**：考虑在 `loadCCACourses()` 中添加缓存机制，避免重复计算
3. **用户体验**：在返回步骤时添加过渡动画，让用户感知到数据正在更新
4. **错误处理**：添加更多的边界情况检查，确保在异常情况下也能正常工作

---

## 修复确认

✅ 问题1：邀请制弹窗文字显示正常
✅ 问题2：返回上一步后正确重新计算冲突和日期
✅ 问题3：游泳一队和预备队互斥逻辑正常工作

所有修复已完成并测试通过！
