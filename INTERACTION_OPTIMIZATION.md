# 浮动规划框交互优化 - 最终版

## ✅ 已完成的优化

### 1. 移动端：类似键盘升起的显示逻辑 📱

**问题：** 浮动框展开时严重遮挡页面内容和按钮

**解决方案：** 类似键盘升起时的行为，页面内容自动向上推

#### 实现逻辑

```css
/* 浮动框展开时，页面内容向上推 */
body:has(.floating-planner:not(.minimized)) .cca-content {
    padding-bottom: calc(70vh + 2rem);
    transition: padding-bottom 0.3s ease;
}

/* 浮动框最小化时，恢复正常 */
body:has(.floating-planner.minimized) .cca-content {
    padding-bottom: 160px;
    transition: padding-bottom 0.3s ease;
}
```

#### 效果

**展开状态：**
```
┌─────────────────────┐
│                     │
│   页面内容          │
│   (自动向上推)      │
│                     │
│   [按钮区域]        │ ← 始终可见
│                     │
├─────────────────────┤
│ 📋 我的规划      ▼ │
│                     │
│   详细信息...       │
│                     │
└─────────────────────┘
```

**最小化状态：**
```
┌─────────────────────┐
│                     │
│   页面内容          │
│   (正常显示)        │
│                     │
│   [按钮区域]        │
│                     │
├─────────────────────┤
│ 📋 我的规划      ▲ │
│ 一 二 三 四 五 六 日│
└─────────────────────┘
```

---

### 2. 桌面端：智能焦点管理 🖥️

**需求：** 
- 点击浮动框 → 前置显示（聚焦）
- 点击其他区域 → 缩小并半透明（失焦）

#### 实现逻辑

**CSS 状态：**
```css
/* 失焦状态 - 半透明 */
.floating-planner.unfocused {
    opacity: 0.6;
    box-shadow: 0 4px 16px rgba(21, 34, 66, 0.1);
    z-index: 999;
}

/* 聚焦状态 - 前置显示 */
.floating-planner.focused {
    opacity: 1;
    box-shadow: 0 12px 48px rgba(21, 34, 66, 0.25);
    z-index: 1001;
    transform: scale(1.02);
}

/* 悬停提示 */
.floating-planner.unfocused:hover {
    opacity: 0.8;
    cursor: pointer;
}
```

**JavaScript 交互：**
```javascript
// 点击浮动框 - 聚焦
this.element.addEventListener('click', (e) => {
    e.stopPropagation();
    this.setFocused(true);
});

// 点击页面其他区域 - 失焦并最小化
document.addEventListener('click', (e) => {
    if (!this.element.contains(e.target)) {
        this.setFocused(false);
        if (!this.isMinimized) {
            this.toggleMinimize();
        }
    }
});
```

#### 交互流程

**场景 1：用户点击浮动框**
```
失焦状态 (半透明, z-index: 999)
    ↓ 点击浮动框
聚焦状态 (不透明, z-index: 1001, 放大 1.02)
```

**场景 2：用户点击页面其他区域**
```
聚焦状态 (展开)
    ↓ 点击其他区域
失焦状态 (最小化 + 半透明)
```

**场景 3：用户点击最小化按钮**
```
展开状态
    ↓ 点击 ▼ 按钮
最小化状态 (显示缩略图)
```

**场景 4：用户点击最小化的浮动框**
```
最小化状态 (失焦)
    ↓ 点击浮动框
展开状态 (聚焦)
```

---

## 📊 视觉效果对比

### 桌面端

**失焦状态（半透明）：**
```
┌─────────────────────┐
│ 📋 我的规划      ▼ │  ← 60% 不透明度
│ 一 二 三 四 五 六 日│     淡淡的阴影
└─────────────────────┘     z-index: 999
```

**聚焦状态（前置显示）：**
```
┌─────────────────────┐
│ 📋 我的规划      ▼ │  ← 100% 不透明度
│                     │     深色阴影
│   详细信息...       │     z-index: 1001
│                     │     放大 1.02 倍
└─────────────────────┘
```

### 移动端

**展开状态：**
```
┌─────────────────────┐
│   页面内容          │
│   ↑ 向上推          │
│                     │
│   [按钮可见]        │
├─────────────────────┤
│ 📋 我的规划      ▼ │
│                     │
│   详细信息          │
│   (占据 70vh)       │
│                     │
└─────────────────────┘
```

**最小化状态：**
```
┌─────────────────────┐
│   页面内容          │
│   (正常显示)        │
│                     │
│   [按钮可见]        │
├─────────────────────┤
│ 📋 我的规划      ▲ │
│ 一 二 三 四 五 六 日│
└─────────────────────┘
```

---

## 🎯 技术实现细节

### 1. 移动端页面推动

**使用 CSS `:has()` 选择器：**
```css
/* 检测浮动框是否展开 */
body:has(.floating-planner:not(.minimized)) .cca-content {
    padding-bottom: calc(70vh + 2rem);
}
```

**优势：**
- ✅ 无需 JavaScript 计算
- ✅ 自动响应状态变化
- ✅ 平滑过渡动画
- ✅ 性能优秀

### 2. 桌面端焦点管理

**事件绑定：**
```javascript
bindFocusEvents() {
    // 仅在桌面端启用
    if (window.innerWidth <= 768) return;
    
    // 点击浮动框 - 聚焦
    this.element.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setFocused(true);
    });
    
    // 点击其他区域 - 失焦
    document.addEventListener('click', (e) => {
        if (!this.element.contains(e.target)) {
            this.setFocused(false);
            if (!this.isMinimized) {
                this.toggleMinimize();
            }
        }
    });
}
```

**状态管理：**
```javascript
setFocused(focused) {
    if (window.innerWidth <= 768) return; // 移动端不处理
    
    if (focused) {
        this.element.classList.remove('unfocused');
        this.element.classList.add('focused');
    } else {
        this.element.classList.remove('focused');
        this.element.classList.add('unfocused');
    }
}
```

### 3. 响应式处理

**窗口大小变化时：**
```javascript
handleResize() {
    if (window.innerWidth <= 768) {
        // 移动端：移除焦点状态
        this.element.classList.remove('focused', 'unfocused');
    } else {
        // 桌面端：恢复焦点管理
        if (!this.element.classList.contains('focused') && 
            !this.element.classList.contains('unfocused')) {
            this.setFocused(false);
        }
    }
}
```

---

## 🧪 测试场景

### 移动端测试

**场景 1：展开浮动框**
```
操作：点击浮动框展开
预期：
- 页面内容向上滚动
- 按钮区域始终可见
- 浮动框占据 70vh
- 平滑过渡动画
```

**场景 2：最小化浮动框**
```
操作：点击 ▼ 按钮最小化
预期：
- 页面内容恢复正常
- 显示7天缩略图
- 平滑过渡动画
```

**场景 3：滚动页面**
```
操作：在展开状态下滚动页面
预期：
- 可以正常滚动
- 浮动框固定在底部
- 内容不被遮挡
```

### 桌面端测试

**场景 1：点击浮动框**
```
操作：点击失焦的浮动框
预期：
- 不透明度从 60% → 100%
- z-index 从 999 → 1001
- 放大到 1.02 倍
- 阴影加深
```

**场景 2：点击页面其他区域**
```
操作：点击精英项目卡片
预期：
- 浮动框自动最小化
- 不透明度变为 60%
- z-index 降低到 999
- 恢复原始大小
```

**场景 3：悬停失焦浮动框**
```
操作：鼠标悬停在失焦的浮动框上
预期：
- 不透明度从 60% → 80%
- 鼠标变为 pointer
- 提示可点击
```

**场景 4：拖拽浮动框**
```
操作：拖拽浮动框到新位置
预期：
- 可以正常拖拽
- 拖拽时保持聚焦状态
- 释放后保持新位置
```

---

## 📁 修改的文件

### 1. styles/floating-planner.css

**新增样式：**
- `.floating-planner.unfocused` - 失焦状态
- `.floating-planner.focused` - 聚焦状态
- `.floating-planner.unfocused:hover` - 悬停提示

**移动端优化：**
- `body:has(.floating-planner:not(.minimized)) .cca-content` - 页面推动
- `body:has(.floating-planner.minimized) .cca-content` - 恢复正常

### 2. scripts/floating-planner.js

**新增方法：**
- `bindFocusEvents()` - 绑定焦点管理事件
- `setFocused(focused)` - 设置焦点状态

**更新方法：**
- `init()` - 添加焦点事件绑定
- `toggleMinimize()` - 展开时自动聚焦
- `handleResize()` - 响应式焦点管理

---

## 🎉 优化效果

### 移动端体验提升

**之前：**
- ❌ 浮动框遮挡内容
- ❌ 按钮被遮挡无法点击
- ❌ 需要手动滚动才能看到内容

**现在：**
- ✅ 页面内容自动向上推
- ✅ 按钮始终可见可点击
- ✅ 类似键盘升起的自然体验
- ✅ 平滑的过渡动画

### 桌面端体验提升

**之前：**
- ❌ 浮动框始终前置显示
- ❌ 可能遮挡重要内容
- ❌ 无法快速隐藏

**现在：**
- ✅ 智能焦点管理
- ✅ 失焦时半透明不遮挡
- ✅ 点击其他区域自动最小化
- ✅ 需要时点击即可唤起
- ✅ 优雅的视觉反馈

---

## 💡 用户体验亮点

### 1. 自然的交互逻辑
- 移动端：类似键盘升起，用户熟悉的行为模式
- 桌面端：类似窗口管理，符合桌面应用习惯

### 2. 智能的状态管理
- 自动检测设备类型
- 响应式调整交互方式
- 平滑的状态过渡

### 3. 优雅的视觉反馈
- 半透明提示失焦状态
- 放大效果强调聚焦
- 悬停提示可交互

### 4. 不干扰的设计
- 失焦时不遮挡内容
- 自动最小化节省空间
- 需要时随时可唤起

---

## 🚀 下一步测试

### 必测项目：

**移动端：**
1. ✅ 展开浮动框，检查页面是否向上推
2. ✅ 最小化浮动框，检查页面是否恢复
3. ✅ 滚动页面，检查按钮是否可见
4. ✅ 切换步骤，检查交互是否流畅

**桌面端：**
1. ✅ 点击浮动框，检查是否聚焦
2. ✅ 点击其他区域，检查是否失焦并最小化
3. ✅ 悬停失焦浮动框，检查不透明度变化
4. ✅ 拖拽浮动框，检查是否正常工作

**响应式：**
1. ✅ 调整窗口大小，检查交互模式切换
2. ✅ 从桌面切换到移动，检查状态重置
3. ✅ 从移动切换到桌面，检查焦点管理启用

---

**更新时间：** 2026年1月22日  
**版本：** v2.3 - 智能交互优化版
