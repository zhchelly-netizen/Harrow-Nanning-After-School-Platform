# 测试文件说明

本目录包含用于测试和诊断的HTML文件。

## 📁 文件列表

### test-buttons.html
**用途**: 测试各种按钮样式和交互功能

**访问地址**: `http://localhost:8080/tests/test-buttons.html`

**测试内容**:
- 按钮悬停效果
- 点击反馈
- 禁用状态
- 不同样式变体

---

### test-cca-data.html
**用途**: 测试CCA课程数据加载和显示

**访问地址**: `http://localhost:8080/tests/test-cca-data.html`

**测试内容**:
- CCA数据加载
- 数据格式验证
- 课程列表渲染
- 数据完整性检查

---

### test-i18n.html
**用途**: 测试国际化翻译系统

**访问地址**: `http://localhost:8080/tests/test-i18n.html`

**测试内容**:
- 语言切换功能
- 翻译文本显示
- 语言存储
- 动态翻译更新

---

### diagnostic.html
**用途**: 系统诊断工具

**访问地址**: `http://localhost:8080/tests/diagnostic.html`

**功能**:
- 检查系统配置
- 验证数据完整性
- 诊断常见问题
- 生成诊断报告

---

## 🚀 使用方法

### 1. 启动本地服务器
```bash
# 在项目根目录执行
python3 -m http.server 8080
```

### 2. 访问测试页面
在浏览器中打开相应的测试文件URL，例如：
```
http://localhost:8080/tests/test-buttons.html
```

### 3. 检查结果
- 查看控制台日志（F12）
- 检查页面显示是否正常
- 验证交互功能是否正常

---

## ⚠️ 注意事项

1. **仅用于开发测试** - 这些文件不应部署到生产环境
2. **保持更新** - 当主要功能变更时，同步更新测试文件
3. **不要修改生产代码** - 测试文件只用于验证，不应影响主代码

---

## 📋 测试清单

在部署前，建议运行以下测试：

- [ ] 访问 test-buttons.html，验证所有按钮样式
- [ ] 访问 test-cca-data.html，验证CCA数据加载
- [ ] 访问 test-i18n.html，验证多语言切换
- [ ] 访问 diagnostic.html，运行系统诊断

---

*最后更新: 2026-03-18*