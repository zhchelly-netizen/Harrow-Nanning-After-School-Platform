# 字体优化说明

## 问题诊断

网站在Vercel部署后加载缓慢的主要原因是**庞大的中文字体文件**：

### 原字体文件大小：
- **思源宋体（Source Han Serif SC）**：5个文件，共约 115MB
  - Regular: 23MB
  - SemiBold: 24MB
  - Bold: 24MB
  - Light: 23MB
  - Heavy: 23MB

- **思源黑体（Source Han Sans SC）**：7个文件，共约 110MB
  - Regular: 16MB
  - Normal: 16MB
  - Bold: 16MB
  - Light: 16MB
  - Medium: 16MB
  - Heavy: 17MB
  - ExtraLight: 14MB

**总计：约 225MB 的字体文件！**

## 解决方案

### 替换为 Google Fonts CDN

使用 Google Fonts 提供的 **Noto Serif SC** 和 **Noto Sans SC**：

#### 优势：
1. **按需加载**：只加载页面实际使用的字符，大幅减少数据传输
2. **CDN加速**：利用Google全球CDN网络，加载速度更快
3. **浏览器缓存**：用户访问其他使用相同字体的网站时可复用缓存
4. **自动优化**：Google Fonts会根据浏览器自动选择最优字体格式（WOFF2等）

#### 字体对比：
| 原字体 | 新字体 | 视觉效果 |
|--------|--------|----------|
| Source Han Serif SC | Noto Serif SC | 几乎相同（同一字体家族） |
| Source Han Sans SC | Noto Sans SC | 几乎相同（同一字体家族） |

> **注意**：Noto字体和思源字体实际上是同一套字体的不同名称。Google称之为Noto，Adobe称之为Source Han。

### 实施的更改

#### 1. CSS文件 (`styles/main.css`)
```css
/* 替换前 */
@font-face {
    font-family: 'Source Han Serif SC';
    src: url('../fonts/SourceHanSerifSC-Regular.otf');
}

/* 替换后 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');
```

#### 2. HTML文件
在所有HTML文件的`<head>`中添加：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

#### 3. 字体变量更新
```css
:root {
    --font-serif: 'Noto Serif SC', serif;
    --font-sans: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 性能提升预期

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 字体文件大小 | ~225MB | ~50-100KB* | **99.9%** |
| 首次加载时间 | 10-30秒 | 1-3秒 | **90%** |
| 后续访问 | 10-30秒 | <1秒 | **95%** |

*实际大小取决于页面使用的字符数量

### 保留的字体

以下字体仍使用本地文件（文件较小，约30-60KB）：
- **Bembo**：英文衬线字体，用于标题
- **Gotham**：英文无衬线字体，用于正文

## 后续建议

### 可选的进一步优化：

1. **字体子集化**：如果需要更极致的优化，可以使用工具提取网站实际使用的汉字，生成自定义字体子集

2. **字体预加载**：对关键字体使用`<link rel="preload">`
   ```html
   <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap">
   ```

3. **本地字体回退**：在CSS中添加系统字体作为回退
   ```css
   font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
   ```

## 测试清单

部署后请验证：
- [ ] 中文字体正常显示
- [ ] 页面加载速度明显提升
- [ ] 不同浏览器兼容性正常
- [ ] 移动端显示正常
- [ ] 字体粗细（font-weight）正确应用

## 旧字体文件处理

`fonts/` 目录中的以下文件可以安全删除（如需要）：
- SourceHanSerifSC-*.otf（所有思源宋体文件）
- SourceHanSansSC-*.otf（所有思源黑体文件）

**保留文件**：
- Bembo*.otf
- Gotham*.otf

---

**优化日期**：2026-01-28  
**优化人员**：Ryan Tang  
**预期效果**：网站加载速度提升90%以上
