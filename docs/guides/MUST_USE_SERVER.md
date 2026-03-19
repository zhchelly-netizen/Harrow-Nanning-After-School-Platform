# 🚨 关键问题：你必须使用本地服务器！

## 问题确认

从你的截图可以看到，浏览器地址栏显示的是：
```
file:///Users/ryantang/Documents/...
```

**这就是问题所在！** 你在用 `file://` 协议直接打开 HTML 文件，这会导致：
- ❌ JavaScript 无法正确加载
- ❌ `i18n is not defined` 错误
- ❌ CCA 课程无法加载
- ❌ 语言切换不工作

## ✅ 解决方案：启动本地服务器

### 方法 1: 使用我创建的启动脚本（最简单）

**步骤：**

1. 打开终端（Terminal）

2. 运行启动脚本：
```bash
cd /Users/ryantang/Documents/harrow-portal
./start-server.sh
```

3. 脚本会自动找到可用端口并启动服务器

4. 在浏览器中访问显示的 URL（例如 `http://localhost:8080/cca-planning.html`）

---

### 方法 2: 手动启动（如果脚本不工作）

**步骤：**

1. 打开终端

2. 进入项目目录：
```bash
cd /Users/ryantang/Documents/harrow-portal
```

3. 启动服务器（尝试不同端口）：
```bash
# 尝试端口 8080
python3 -m http.server 8080

# 如果 8080 被占用，尝试 9000
python3 -m http.server 9000

# 如果还不行，尝试 3000
python3 -m http.server 3000
```

4. 看到 "Serving HTTP on..." 消息后，在浏览器中访问：
```
http://localhost:8080/cca-planning.html
```
（把 8080 替换成你使用的端口号）

---

### 方法 3: 使用 VS Code（如果你用 VS Code）

1. 在 VS Code 中打开项目文件夹
2. 安装 "Live Server" 扩展
3. 右键点击 `cca-planning.html`
4. 选择 "Open with Live Server"

---

## 🎯 验证是否成功

### 成功的标志：

1. **浏览器地址栏显示：**
   ```
   http://localhost:8080/cca-planning.html
   ```
   **不是：**
   ```
   file:///Users/ryantang/Documents/...
   ```

2. **控制台没有错误：**
   - ✅ 没有 `i18n is not defined`
   - ✅ 没有 404 错误

3. **功能正常：**
   - ✅ CCA 课程列表显示
   - ✅ 语言切换工作
   - ✅ 管理后台可以打开

---

## 📸 对比

### ❌ 错误的方式（你现在的方式）
```
地址栏: file:///Users/ryantang/Documents/harrow-portal/cca-planning.html
结果: i18n is not defined 错误
```

### ✅ 正确的方式
```
地址栏: http://localhost:8080/cca-planning.html
结果: 一切正常工作
```

---

## 🔧 常见问题

### Q: 为什么不能直接双击 HTML 文件打开？
A: 现代 Web 应用需要 HTTP 服务器环境才能正常工作。直接打开会受到浏览器安全限制。

### Q: 服务器启动后可以关闭终端吗？
A: 不可以！终端必须保持打开，服务器才会继续运行。

### Q: 如何停止服务器？
A: 在终端中按 `Ctrl + C`

### Q: 端口被占用怎么办？
A: 使用其他端口号，例如 9000、3000、5000 等

---

## 🚀 立即执行

**复制粘贴到终端：**

```bash
cd /Users/ryantang/Documents/harrow-portal && ./start-server.sh
```

**如果脚本不工作，使用：**

```bash
cd /Users/ryantang/Documents/harrow-portal && python3 -m http.server 9000
```

**然后在浏览器中打开：**

```
http://localhost:9000/cca-planning.html
```

---

## ⚠️ 重要提醒

**从现在开始，你必须：**

1. ✅ 始终通过 `http://localhost:端口号` 访问
2. ❌ 不要再双击 HTML 文件打开
3. ✅ 保持终端窗口打开（服务器运行中）
4. ✅ 使用 `Ctrl + C` 停止服务器

---

**这是解决所有问题的关键！** 请立即尝试并告诉我结果！
