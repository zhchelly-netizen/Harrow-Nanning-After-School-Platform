#!/bin/bash

# 南宁哈罗礼德学校课后平台 - 快速启动脚本
# Harrow LiDe School Nanning Co-Curricular Portal - Quick Start

echo "======================================"
echo "南宁哈罗礼德学校课后平台"
echo "Harrow LiDe School Nanning"
echo "Co-Curricular Portal"
echo "======================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null
then
    echo "❌ Python3 未安装，请先安装 Python3"
    exit 1
fi

echo "✓ Python3 已安装"
echo ""

# 启动服务器
echo "🚀 正在启动本地服务器..."
echo "📍 服务器地址: http://localhost:8080"
echo ""
echo "💡 提示："
echo "   - 在浏览器中访问: http://localhost:8080"
echo "   - 按 Ctrl+C 停止服务器"
echo ""
echo "======================================"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8080
