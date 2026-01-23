#!/bin/bash

# 修复验证脚本
# Fix Verification Script

echo "======================================"
echo "🔍 哈罗南宁门户网站 - 修复验证"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASSED=0
FAILED=0

# 测试1: 检查按钮圆角
echo "📋 测试 1: 检查按钮圆角样式"
BUTTON_COUNT=$(grep -r "border-radius: 50px" styles/*.css | wc -l | tr -d ' ')
if [ "$BUTTON_COUNT" -gt 20 ]; then
    echo -e "${GREEN}✅ 通过${NC} - 找到 $BUTTON_COUNT 处圆角按钮样式"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败${NC} - 只找到 $BUTTON_COUNT 处圆角按钮样式（预期 > 20）"
    FAILED=$((FAILED + 1))
fi
echo ""

# 测试2: 检查语言切换事件
echo "📋 测试 2: 检查语言切换事件系统"
if grep -q "window.dispatchEvent" scripts/i18n.js; then
    echo -e "${GREEN}✅ 通过${NC} - i18n.js 使用 window.dispatchEvent"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败${NC} - i18n.js 未使用 window.dispatchEvent"
    FAILED=$((FAILED + 1))
fi

if grep -q "detail: { lang:" scripts/i18n.js; then
    echo -e "${GREEN}✅ 通过${NC} - 事件详情使用正确的属性名 'lang'"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败${NC} - 事件详情未使用 'lang' 属性"
    FAILED=$((FAILED + 1))
fi
echo ""

# 测试3: 检查管理后台翻译访问
echo "📋 测试 3: 检查管理后台翻译数据访问"
if grep -q "i18n.translations" scripts/admin.js; then
    echo -e "${GREEN}✅ 通过${NC} - admin.js 使用 i18n.translations"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败${NC} - admin.js 未使用 i18n.translations"
    FAILED=$((FAILED + 1))
fi

if ! grep -q "typeof translations" scripts/admin.js; then
    echo -e "${GREEN}✅ 通过${NC} - admin.js 不再直接访问 translations"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  警告${NC} - admin.js 仍然直接访问 translations"
    FAILED=$((FAILED + 1))
fi
echo ""

# 测试4: 检查文件完整性
echo "📋 测试 4: 检查关键文件完整性"
FILES=("index.html" "cca-planning.html" "scholarship.html" "admin.html" "scripts/i18n.js" "scripts/admin.js" "scripts/cca.js")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file 存在"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌${NC} $file 不存在"
        FAILED=$((FAILED + 1))
    fi
done
echo ""

# 测试5: 检查CSS文件
echo "📋 测试 5: 检查CSS样式文件"
CSS_FILES=("styles/main.css" "styles/cca.css" "styles/scholarship.css" "styles/admin.css")
for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file 存在"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌${NC} $file 不存在"
        FAILED=$((FAILED + 1))
    fi
done
echo ""

# 总结
echo "======================================"
echo "📊 测试总结"
echo "======================================"
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo "通过: $PASSED"
echo "失败: $FAILED"
echo "总计: $TOTAL"
echo "通过率: $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！修复成功！${NC}"
    echo ""
    echo "✅ 按钮圆角已修改为 50px"
    echo "✅ 语言切换系统已修复"
    echo "✅ 管理后台已修复"
    echo ""
    echo "📝 请打开以下文件进行手动测试："
    echo "   - test-buttons.html (自动化测试页面)"
    echo "   - index.html (主页)"
    echo "   - cca-planning.html (CCA规划)"
    echo "   - scholarship.html (奖学金)"
    echo "   - admin.html (管理后台)"
    exit 0
else
    echo -e "${RED}⚠️  部分测试失败，请检查上述错误${NC}"
    exit 1
fi
