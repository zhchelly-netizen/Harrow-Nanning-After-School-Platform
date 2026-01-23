#!/bin/bash

# 哈罗南宁门户网站 - 本地服务器启动脚本

echo "🚀 正在启动本地服务器..."
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 尝试不同的端口
PORTS=(8080 8888 9000 9999 3000 5000)

for PORT in "${PORTS[@]}"; do
    echo "尝试端口 $PORT..."
    
    # 检查端口是否被占用
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo ""
        echo "✅ 成功！服务器已启动在端口 $PORT"
        echo ""
        echo "📱 请在浏览器中访问："
        echo "   http://localhost:$PORT/cca-planning.html"
        echo ""
        echo "📋 其他页面："
        echo "   主页: http://localhost:$PORT/index.html"
        echo "   奖学金: http://localhost:$PORT/scholarship.html"
        echo "   管理后台: http://localhost:$PORT/admin.html"
        echo ""
        echo "⚠️  按 Ctrl+C 停止服务器"
        echo ""
        
        # 启动服务器
        python3 -m http.server $PORT
        exit 0
    fi
done

echo ""
echo "❌ 所有端口都被占用，请手动指定端口："
echo "   python3 -m http.server 端口号"
echo ""
