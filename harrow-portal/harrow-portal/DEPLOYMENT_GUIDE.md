# Harrow Portal 部署指南

## 🚀 快速部署

### 方法1：使用一键部署脚本（推荐）

```bash
cd /Users/ryantang/Documents/harrow-portal
./deploy.sh
```

然后按照提示选择部署平台即可！

---

## 📦 部署平台详解

### 1️⃣ Vercel（最推荐）

**优点：**
- ✅ 完全免费
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 支持自定义域名
- ✅ 每次Git推送自动部署
- ✅ 部署速度快

**部署步骤：**

```bash
# 1. 安装Vercel CLI（如果还没安装）
npm install -g vercel

# 2. 在项目目录运行
cd /Users/ryantang/Documents/harrow-portal
vercel

# 3. 首次使用需要登录
# 按照提示操作即可

# 4. 生产环境部署
vercel --prod
```

**访问地址：** `https://harrow-portal.vercel.app`（可自定义）

---

### 2️⃣ Netlify

**优点：**
- ✅ 免费
- ✅ 功能丰富
- ✅ 表单处理
- ✅ 无服务器函数支持

**部署步骤：**

```bash
# 1. 安装Netlify CLI
npm install -g netlify-cli

# 2. 部署
cd /Users/ryantang/Documents/harrow-portal
netlify deploy --prod
```

---

### 3️⃣ GitHub Pages

**优点：**
- ✅ 完全免费
- ✅ 与GitHub集成
- ✅ 简单易用

**部署步骤：**

```bash
# 1. 初始化Git仓库
cd /Users/ryantang/Documents/harrow-portal
git init
git add .
git commit -m "Initial commit"

# 2. 创建GitHub仓库
# 在GitHub上创建新仓库：harrow-portal

# 3. 推送代码
git branch -M main
git remote add origin https://github.com/你的用户名/harrow-portal.git
git push -u origin main

# 4. 启用GitHub Pages
# 进入仓库 Settings → Pages
# Source 选择 main 分支
# 点击 Save
```

**访问地址：** `https://你的用户名.github.io/harrow-portal/`

---

### 4️⃣ 阿里云OSS（国内推荐）

**优点：**
- ✅ 国内访问速度快
- ✅ 稳定可靠
- ✅ 价格便宜

**部署步骤：**

1. 登录阿里云控制台
2. 开通OSS服务
3. 创建Bucket，设置为"公共读"
4. 上传所有文件到Bucket
5. 绑定自定义域名（需要备案）

---

### 5️⃣ 自己的服务器（Nginx）

**适合场景：** 已有服务器

**部署步骤：**

```bash
# 1. 打包项目
cd /Users/ryantang/Documents
tar -czf harrow-portal.tar.gz harrow-portal/

# 2. 上传到服务器
scp harrow-portal.tar.gz user@your-server:/var/www/

# 3. 在服务器上解压
ssh user@your-server
cd /var/www
tar -xzf harrow-portal.tar.gz

# 4. 配置Nginx
sudo nano /etc/nginx/sites-available/harrow-portal
```

**Nginx配置：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/harrow-portal;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 启用Gzip压缩
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # 缓存静态资源
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 5. 启用站点
sudo ln -s /etc/nginx/sites-available/harrow-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ⚙️ 部署前配置

### 必须替换的占位符

在 `scholarship.html` 第 385 行：

```html
<!-- 当前 -->
<button class="application-button" onclick="window.open('PLACEHOLDER_URL', '_blank')">

<!-- 替换为实际URL -->
<button class="application-button" onclick="window.open('https://your-actual-application-url.com', '_blank')">
```

---

## ✅ 部署后验证

### 1. 功能测试
- [ ] 访问首页 `index.html`
- [ ] CCA规划页面 `cca-planning.html`
- [ ] 奖学金页面 `scholarship.html`
- [ ] 所有Tab切换正常
- [ ] 所有按钮可点击

### 2. 外部链接测试
- [ ] 精英体育飞书表单
- [ ] 音乐学院飞书表单
- [ ] SchoolsBuddy登录
- [ ] 奖学金计分模型文档（4个飞书链接）

### 3. 响应式测试
- [ ] 桌面端（1920x1080）
- [ ] 平板端（768px）
- [ ] 手机端（375px）

### 4. 浏览器兼容性
- [ ] Chrome
- [ ] Safari
- [ ] Edge
- [ ] Firefox

---

## 🔧 常见问题

### Q: 部署后页面显示404？
**A:** 检查文件路径是否正确，确保 `index.html` 在根目录。

### Q: CSS/JS文件加载失败？
**A:** 检查文件路径，确保使用相对路径（`./styles/` 而不是 `/styles/`）。

### Q: 需要HTTPS吗？
**A:** Vercel、Netlify、GitHub Pages 都自动提供HTTPS。自己的服务器需要配置SSL证书（推荐使用Let's Encrypt免费证书）。

### Q: 如何绑定自定义域名？
**A:** 
- **Vercel/Netlify:** 在控制台添加域名，然后在DNS设置CNAME记录
- **GitHub Pages:** 在仓库设置中添加自定义域名
- **自己的服务器:** 直接在Nginx配置中设置

---

## 📊 性能优化建议

### 1. 启用Gzip压缩
大多数平台自动启用，自己的服务器需要在Nginx中配置。

### 2. 设置缓存
静态资源（CSS/JS）可以设置长期缓存。

### 3. 使用CDN
Vercel、Netlify自带全球CDN，无需额外配置。

---

## 🆘 需要帮助？

如果遇到问题，请检查：
1. `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
2. `README.md` - 项目说明文档
3. 浏览器控制台的错误信息

---

## 🎉 推荐部署方案

**最简单：** GitHub Pages（免费，零配置）  
**最快速：** Vercel（免费，全球CDN，自动部署）  
**国内访问：** 阿里云OSS（需要备案，速度快）  
**完全控制：** 自己的服务器（灵活，需要维护）

---

**祝部署顺利！🚀**
