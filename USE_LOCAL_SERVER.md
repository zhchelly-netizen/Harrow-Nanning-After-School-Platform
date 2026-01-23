# 🚨 紧急修复：使用本地服务器

## 问题根源

你现在看到的错误 `i18n is not defined` 是因为：

**你正在使用 `file://` 协议直接打开 HTML 文件！**

从你的截图可以看到 URL 是：
```
file:///Users/ryantang/Documents/harrow-portal/cca-planning.html
```

这会导致：
1. JavaScript 模块加载失败
2. 某些浏览器安全限制阻止脚本执行
3. 相对路径可能无法正确解析

## ✅ 正确的解决方案：使用本地服务器

### 方法 1: 使用 Python 启动服务器（推荐）

**步骤：**

1. 打开终端（Terminal）

2. 进入项目目录：
```bash
cd /Users/ryantang/Documents/harrow-portal
```

3. 启动 Python 服务器：
```bash
python3 -m http.server 8888
```

4. 在浏览器中访问：
```
http://localhost:8888/cca-planning.html
```

**不要关闭终端窗口！** 服务器需要一直运行。

---

### 方法 2: 使用 VS Code Live Server

如果你使用 VS Code：

1. 安装 "Live Server" 扩展
2. 右键点击 `cca-planning.html`
3. 选择 "Open with Live Server"
4. 会自动在浏览器中打开

---

### 方法 3: 使用 Node.js http-server

如果你安装了 Node.js：

```bash
# 安装 http-server（只需一次）
npm install -g http-server

# 进入项目目录
cd /Users/ryantang/Documents/harrow-portal

# 启动服务器
http-server -p 8888
```

然后访问：`http://localhost:8888/cca-planning.html`

---

## 🎯 立即执行

### 第 1 步：启动服务器

在终端中运行：
```bash
cd /Users/ryantang/Documents/harrow-portal
python3 -m http.server 8888
```

你应该看到：
```
Serving HTTP on :: port 8888 (http://[::]:8888/) ...
```

### 第 2 步：在浏览器中访问

打开浏览器，访问：
```
http://localhost:8888/cca-planning.html
```

**注意：** 是 `http://localhost:8888`，不是 `file://`！

### 第 3 步：验证

1. 打开开发者工具（F12）
2. 查看 Console 标签
3. 应该**不再有** `i18n is not defined` 错误
4. CCA 课程应该正常加载

---

## 为什么必须使用服务器？

### `file://` 协议的限制：
- ❌ 无法正确加载 JavaScript 模块
- ❌ 浏览器安全策略阻止某些操作
- ❌ 相对路径可能解析错误
- ❌ localStorage 可能不工作

### `http://` 协议的优势：
- ✅ 完全模拟真实网站环境
- ✅ 所有功能正常工作
- ✅ 没有安全限制
- ✅ 可以正确加载所有资源

---

## 📋 验证清单

使用 `http://localhost:8888` 访问后：

- [ ] 控制台没有 `i18n is not defined` 错误
- [ ] CCA 课程列表正常显示
- [ ] 语言切换按钮工作
- [ ] 管理后台可以打开

---

## 🔧 如果服务器启动失败

### 错误：端口被占用
```bash
# 使用其他端口
python3 -m http.server 9999
```

然后访问：`http://localhost:9999/cca-planning.html`

### 错误：python3 命令不存在
```bash
# 尝试 python
python -m http.server 8888
```

### 错误：权限问题
```bash
# 使用 sudo
sudo python3 -m http.server 8888
```

---

## 📸 成功的标志

当你使用 `http://localhost:8888` 访问时，浏览器地址栏应该显示：

```
http://localhost:8888/cca-planning.html
```

**不是：**
```
file:///Users/ryantang/Documents/harrow-portal/cca-planning.html
```

---

## 🚀 快速启动命令

复制粘贴到终端：

```bash
cd /Users/ryantang/Documents/harrow-portal && python3 -m http.server 8888
```

然后在浏览器中打开：
```
http://localhost:8888/cca-planning.html
```

---

**这是最关键的修复！** 使用本地服务器后，所有问题都会解决。

请立即尝试并告诉我结果！
