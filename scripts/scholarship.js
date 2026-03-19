// ===================================
// 奖学金页面 JavaScript
// ===================================

// 申请系统链接（根据语言不同）
const APPLICATION_LINKS = {
    zh: 'https://harrownanning-est.feishu.cn/share/base/dashboard/shrcnndXTpfEnw4hcQguLrkZdsb',
    en: 'https://harrownanning-est.feishu.cn/share/base/dashboard/shrcntBlmd5AFe4h4ZsPaoqLb6d'
};

// 跳转到申请系统
function navigateToApplication() {
    const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh';
    const url = APPLICATION_LINKS[currentLang] || APPLICATION_LINKS.zh;
    window.open(url, '_blank');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 奖学金页面开始初始化...');
    console.log('📦 sessionStorage.selectedLanguage:', sessionStorage.getItem('selectedLanguage'));
    console.log('📦 localStorage.preferredLanguage:', localStorage.getItem('preferredLanguage'));
    
    // 确保 i18n 已经初始化
    if (typeof i18n === 'undefined') {
        console.error('❌ i18n is not loaded yet, retrying...');
        setTimeout(function() {
            if (typeof i18n !== 'undefined') {
                console.log('✅ i18n loaded after retry');
                i18n.updatePageLanguage();
            }
        }, 100);
        return;
    }
    
    console.log('✅ i18n 已加载，当前语言:', i18n.getCurrentLanguage());
    
    // 手动触发一次页面语言更新，确保所有 data-i18n 属性都被正确翻译
    i18n.updatePageLanguage();
    
    console.log('✅ 奖学金页面初始化完成');
    
    // 监听语言切换事件
    window.addEventListener('languageChanged', function() {
        // 语言切换时，i18n.js 会自动更新所有带 data-i18n 属性的元素
        console.log('🔄 奖学金页面语言已切换');
    });
});
