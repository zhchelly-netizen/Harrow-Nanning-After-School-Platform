// ===================================
// 奖学金页面 JavaScript
// ===================================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保 i18n 已经初始化
    if (typeof i18n === 'undefined') {
        console.error('i18n is not loaded yet, retrying...');
        setTimeout(function() {
            if (typeof i18n !== 'undefined') {
                i18n.updatePageLanguage();
            }
        }, 100);
        return;
    }
    
    // 手动触发一次页面语言更新，确保所有 data-i18n 属性都被正确翻译
    i18n.updatePageLanguage();
    
    console.log('奖学金页面已加载');
    
    // 监听语言切换事件
    window.addEventListener('languageChanged', function() {
        // 语言切换时，i18n.js 会自动更新所有带 data-i18n 属性的元素
        console.log('奖学金页面语言已切换');
    });
});
