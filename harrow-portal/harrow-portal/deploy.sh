#!/bin/bash

# ===================================
# Harrow Portal 一键部署脚本
# ===================================

echo "🚀 Harrow Portal 部署助手"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "请选择部署平台："
echo "1) Vercel（推荐）"
echo "2) Netlify"
echo "3) GitHub Pages"
echo "4) 生成压缩包（手动上传）"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 准备部署到 Vercel..."
        echo ""
        
        # 检查是否安装了 Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "⚠️  未检测到 Vercel CLI，正在安装..."
            npm install -g vercel
        fi
        
        echo ""
        echo "🚀 开始部署..."
        vercel --prod
        
        echo ""
        echo "✅ 部署完成！"
        ;;
        
    2)
        echo ""
        echo "📦 准备部署到 Netlify..."
        echo ""
        
        # 检查是否安装了 Netlify CLI
        if ! command -v netlify &> /dev/null; then
            echo "⚠️  未检测到 Netlify CLI，正在安装..."
            npm install -g netlify-cli
        fi
        
        echo ""
        echo "🚀 开始部署..."
        netlify deploy --prod --dir .
        
        echo ""
        echo "✅ 部署完成！"
        ;;
        
    3)
        echo ""
        echo "📦 准备部署到 GitHub Pages..."
        echo ""
        
        # 检查是否已初始化 Git
        if [ ! -d ".git" ]; then
            echo "初始化 Git 仓库..."
            git init
            git add .
            git commit -m "Initial commit: Harrow Portal"
            git branch -M main
            
            echo ""
            read -p "请输入您的 GitHub 仓库地址 (例如: https://github.com/username/repo.git): " repo_url
            git remote add origin "$repo_url"
        fi
        
        echo ""
        echo "推送到 GitHub..."
        git push -u origin main
        
        echo ""
        echo "✅ 代码已推送到 GitHub！"
        echo "📝 请在 GitHub 仓库设置中启用 Pages："
        echo "   Settings → Pages → Source: main branch → Save"
        ;;
        
    4)
        echo ""
        echo "📦 生成部署压缩包..."
        
        # 创建临时目录
        TEMP_DIR="harrow-portal-deploy"
        mkdir -p "$TEMP_DIR"
        
        # 复制文件
        cp -r *.html "$TEMP_DIR/" 2>/dev/null
        cp -r scripts "$TEMP_DIR/" 2>/dev/null
        cp -r styles "$TEMP_DIR/" 2>/dev/null
        cp README.md "$TEMP_DIR/" 2>/dev/null
        
        # 创建压缩包
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        ARCHIVE_NAME="harrow-portal_${TIMESTAMP}.tar.gz"
        tar -czf "$ARCHIVE_NAME" "$TEMP_DIR"
        
        # 清理临时目录
        rm -rf "$TEMP_DIR"
        
        echo ""
        echo "✅ 压缩包已生成：$ARCHIVE_NAME"
        echo "📝 您可以将此文件上传到您的服务器"
        echo ""
        echo "解压命令："
        echo "  tar -xzf $ARCHIVE_NAME"
        ;;
        
    *)
        echo "❌ 无效的选项"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "🎉 部署流程完成！"
echo ""
echo "📋 部署后检查清单："
echo "  1. 访问网站确认所有页面正常"
echo "  2. 测试所有外部链接"
echo "  3. 检查移动端显示"
echo "  4. 替换 scholarship.html 中的 PLACEHOLDER_URL"
echo ""
echo "📚 更多信息请查看 DEPLOYMENT_CHECKLIST.md"
echo "================================"
