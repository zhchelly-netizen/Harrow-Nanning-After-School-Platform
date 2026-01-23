// ===================================
// 翻译管理后台 JavaScript
// Translation Admin System
// ===================================

const ADMIN_PASSWORD = 'Mustslide-0xf6b5';
const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 3600000; // 1小时

let currentTranslations = {};
let currentCategory = 'all';
let editingKey = null;
let hasUnsavedChanges = false;

// ===================================
// 登录相关
// ===================================

function login() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    if (password === ADMIN_PASSWORD) {
        // 保存会话
        const session = {
            timestamp: Date.now(),
            authenticated: true
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        // 显示管理页面
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-screen').style.display = 'block';
        
        // 加载翻译数据
        loadTranslations();
    } else {
        errorMessage.textContent = '❌ 密码错误，请重试 / Incorrect password';
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

function logout() {
    if (hasUnsavedChanges) {
        if (!confirm('您有未保存的更改，确定要退出吗？\nYou have unsaved changes. Are you sure you want to logout?')) {
            return;
        }
    }
    
    localStorage.removeItem(SESSION_KEY);
    document.getElementById('admin-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('password').value = '';
    hasUnsavedChanges = false;
}

function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();
            
            // 检查会话是否过期
            if (sessionData.authenticated && (now - sessionData.timestamp) < SESSION_DURATION) {
                // 会话有效，直接显示管理页面
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('admin-screen').style.display = 'block';
                loadTranslations();
                return;
            }
        } catch (e) {
            console.error('Session parse error:', e);
        }
    }
    
    // 会话无效或过期，显示登录页面
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-screen').style.display = 'none';
}

// 监听回车键登录
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    // 监听导入方式切换
    document.querySelectorAll('input[name="import-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'file') {
                document.getElementById('file-import-group').style.display = 'block';
                document.getElementById('text-import-group').style.display = 'none';
            } else {
                document.getElementById('file-import-group').style.display = 'none';
                document.getElementById('text-import-group').style.display = 'block';
            }
        });
    });
    
    // 监听未保存更改
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

// ===================================
// 翻译数据管理
// ===================================

function loadTranslations() {
    // 从 i18n.js 加载翻译数据
    if (typeof i18n !== 'undefined' && i18n.translations) {
        currentTranslations = JSON.parse(JSON.stringify(i18n.translations));
    } else {
        currentTranslations = { zh: {}, en: {} };
    }
    
    renderCategories();
    renderTranslations();
    updateStats();
}

function saveTranslations() {
    if (!hasUnsavedChanges) {
        showNotification('没有需要保存的更改', 'info');
        return;
    }
    
    // 生成新的 i18n.js 文件内容
    const fileContent = generateI18nFile();
    
    // 创建下载链接
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'i18n.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    hasUnsavedChanges = false;
    showNotification('✅ 翻译已保存！请将下载的 i18n.js 文件替换到 scripts 目录', 'success');
}

function generateI18nFile() {
    const template = `// ===================================
// 多语言国际化配置
// Internationalization Configuration
// ===================================

const translations = ${JSON.stringify(currentTranslations, null, 4)};

// ===================================
// 语言管理器类
// Language Manager Class
// ===================================
class LanguageManager {
    constructor() {
        // 从 localStorage 读取用户偏好，默认中文
        this.currentLang = localStorage.getItem('preferredLanguage') || 'zh';
        this.translations = translations;
    }
    
    /**
     * 获取翻译文本
     * @param {string} key - 翻译键
     * @returns {string} 翻译后的文本
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    /**
     * 切换语言
     */
    switchLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('preferredLanguage', this.currentLang);
        this.updatePageLanguage();
    }
    
    /**
     * 更新页面所有文本
     */
    updatePageLanguage() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // 如果元素是按钮或输入框，更新 value
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // 更新所有带 data-i18n-placeholder 属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // 更新所有带 data-i18n-title 属性的元素
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // 更新页面标题
        document.title = this.t('pageTitle');
        
        // 更新语言切换按钮文本
        const langBtn = document.getElementById('language-toggle');
        if (langBtn) {
            langBtn.textContent = this.t('switchLanguage');
        }
        
        // 触发自定义事件，让其他组件知道语言已切换
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang: this.currentLang } 
        }));
    }
    
    /**
     * 获取当前语言
     * @returns {string} 当前语言代码 ('zh' 或 'en')
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    /**
     * 设置语言（不触发更新）
     * @param {string} lang - 语言代码
     */
    setLanguage(lang) {
        if (lang === 'zh' || lang === 'en') {
            this.currentLang = lang;
            localStorage.setItem('preferredLanguage', lang);
        }
    }
    
    /**
     * 获取星期的翻译（带缩写支持）
     * @param {string} day - 星期的英文小写 (monday, tuesday, etc.)
     * @param {boolean} short - 是否使用缩写
     * @returns {string} 翻译后的星期
     */
    getDay(day, short = false) {
        const key = short ? \`\${day}Short\` : day;
        return this.t(key);
    }
}

// 创建全局实例
const i18n = new LanguageManager();

// 页面加载时初始化语言
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.updatePageLanguage();
    });
} else {
    i18n.updatePageLanguage();
}
`;
    
    return template;
}

// ===================================
// 分类管理
// ===================================

function renderCategories() {
    const categoryNav = document.getElementById('category-nav');
    const categories = getCategories();
    
    let html = `
        <div class="category-item ${currentCategory === 'all' ? 'active' : ''}" onclick="selectCategory('all')">
            <span class="category-name">📚 全部翻译</span>
            <span class="category-badge">${Object.keys(currentTranslations.zh || {}).length}</span>
        </div>
    `;
    
    categories.forEach(cat => {
        const count = getKeysInCategory(cat).length;
        html += `
            <div class="category-item ${currentCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
                <span class="category-name">${getCategoryIcon(cat)} ${getCategoryName(cat)}</span>
                <span class="category-badge">${count}</span>
            </div>
        `;
    });
    
    categoryNav.innerHTML = html;
    document.getElementById('category-count').textContent = `${categories.length + 1} 个分类`;
}

function getCategories() {
    // 根据键名前缀自动分类
    const keys = Object.keys(currentTranslations.zh || {});
    const categories = new Set();
    
    keys.forEach(key => {
        if (key.startsWith('step')) categories.add('steps');
        else if (key.includes('Button') || key.includes('button') || ['nextStep', 'prevStep', 'confirm', 'submit', 'cancel', 'close'].includes(key)) categories.add('buttons');
        else if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key) || key.includes('Short')) categories.add('days');
        else if (key.includes('elite') || key.includes('Elite') || key.includes('cca') || key.includes('CCA')) categories.add('courses');
        else if (key.includes('grade') || key.includes('Grade') || key.includes('student') || key.includes('Student')) categories.add('forms');
        else if (key.includes('warning') || key.includes('Warning') || key.includes('error') || key.includes('Error') || key.includes('success') || key.includes('Success')) categories.add('messages');
        else if (key.includes('page') || key.includes('Page') || key.includes('nav') || key.includes('Nav')) categories.add('navigation');
        else categories.add('general');
    });
    
    return Array.from(categories).sort();
}

function getKeysInCategory(category) {
    const keys = Object.keys(currentTranslations.zh || {});
    
    if (category === 'all') return keys;
    
    return keys.filter(key => {
        if (category === 'steps') return key.startsWith('step');
        if (category === 'buttons') return key.includes('Button') || key.includes('button') || ['nextStep', 'prevStep', 'confirm', 'submit', 'cancel', 'close'].includes(key);
        if (category === 'days') return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key) || key.includes('Short');
        if (category === 'courses') return key.includes('elite') || key.includes('Elite') || key.includes('cca') || key.includes('CCA');
        if (category === 'forms') return key.includes('grade') || key.includes('Grade') || key.includes('student') || key.includes('Student');
        if (category === 'messages') return key.includes('warning') || key.includes('Warning') || key.includes('error') || key.includes('Error') || key.includes('success') || key.includes('Success');
        if (category === 'navigation') return key.includes('page') || key.includes('Page') || key.includes('nav') || key.includes('Nav');
        return true; // general
    });
}

function getCategoryIcon(category) {
    const icons = {
        steps: '📋',
        buttons: '🔘',
        days: '📅',
        courses: '📚',
        forms: '📝',
        messages: '💬',
        navigation: '🧭',
        general: '📦'
    };
    return icons[category] || '📦';
}

function getCategoryName(category) {
    const names = {
        steps: '步骤',
        buttons: '按钮',
        days: '日期',
        courses: '课程',
        forms: '表单',
        messages: '消息',
        navigation: '导航',
        general: '通用'
    };
    return names[category] || category;
}

function selectCategory(category) {
    currentCategory = category;
    renderCategories();
    renderTranslations();
}

// ===================================
// 翻译列表渲染
// ===================================

function renderTranslations() {
    const container = document.getElementById('translations-container');
    const keys = getKeysInCategory(currentCategory);
    
    if (keys.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: #9ca3af;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                <h3>暂无翻译</h3>
                <p>点击"添加翻译"按钮创建新的翻译项</p>
            </div>
        `;
        return;
    }
    
    // 按最近添加排序（新添加的在前）
    // 检查是否有新添加的键（在 zh 或 en 中存在但不在原始 i18n.translations 中）
    const originalTranslations = (typeof i18n !== 'undefined' && i18n.translations) ? i18n.translations : { zh: {}, en: {} };
    const sortedKeys = keys.sort((a, b) => {
        const aIsNew = !originalTranslations.zh[a] && !originalTranslations.en[a];
        const bIsNew = !originalTranslations.zh[b] && !originalTranslations.en[b];
        
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        
        // 按字母顺序排序
        return a.localeCompare(b);
    });
    
    let html = '';
    sortedKeys.forEach(key => {
        const zhText = currentTranslations.zh[key] || '';
        const enText = currentTranslations.en[key] || '';
        
        // 检查是否是新添加的
        const isNew = (!originalTranslations.zh[key] && !originalTranslations.en[key]) && (zhText || enText);
        const newBadge = isNew ? '<span style="background: #10b981; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">🆕 新增</span>' : '';
        
        html += `
            <div class="translation-card ${isNew ? 'new-translation' : ''}">
                <div class="translation-header">
                    <div class="translation-key">${key}${newBadge}</div>
                    <div class="translation-actions">
                        <button class="icon-button" onclick="editTranslation('${key}')" title="编辑">✏️</button>
                        <button class="icon-button delete" onclick="deleteTranslation('${key}')" title="删除">🗑️</button>
                    </div>
                </div>
                <div class="translation-content">
                    <div class="translation-lang">
                        <div class="lang-label">🇨🇳 中文</div>
                        <div class="lang-text ${!zhText ? 'empty' : ''}">${zhText || '(未翻译)'}</div>
                    </div>
                    <div class="translation-lang">
                        <div class="lang-label">🇬🇧 English</div>
                        <div class="lang-text ${!enText ? 'empty' : ''}">${enText || '(Not translated)'}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ===================================
// 翻译编辑
// ===================================

function addTranslation() {
    editingKey = null;
    document.getElementById('dialog-title').textContent = '添加翻译';
    document.getElementById('translation-key').value = '';
    document.getElementById('translation-key').disabled = false;
    document.getElementById('translation-zh').value = '';
    document.getElementById('translation-en').value = '';
    document.getElementById('translation-category').value = currentCategory === 'all' ? 'general' : currentCategory;
    document.getElementById('translation-dialog').style.display = 'flex';
}

function editTranslation(key) {
    editingKey = key;
    document.getElementById('dialog-title').textContent = '编辑翻译';
    document.getElementById('translation-key').value = key;
    document.getElementById('translation-key').disabled = true;
    document.getElementById('translation-zh').value = currentTranslations.zh[key] || '';
    document.getElementById('translation-en').value = currentTranslations.en[key] || '';
    document.getElementById('translation-dialog').style.display = 'flex';
}

function saveTranslation() {
    const key = document.getElementById('translation-key').value.trim();
    const zhText = document.getElementById('translation-zh').value.trim();
    const enText = document.getElementById('translation-en').value.trim();
    
    if (!key) {
        alert('请输入翻译键');
        return;
    }
    
    if (!zhText && !enText) {
        alert('请至少输入一种语言的翻译');
        return;
    }
    
    // 检查键名是否已存在（新增时）
    if (!editingKey && currentTranslations.zh[key]) {
        if (!confirm(`翻译键 "${key}" 已存在，是否覆盖？`)) {
            return;
        }
    }
    
    // 保存翻译
    if (zhText) currentTranslations.zh[key] = zhText;
    if (enText) currentTranslations.en[key] = enText;
    
    hasUnsavedChanges = true;
    closeDialog();
    renderCategories();
    renderTranslations();
    updateStats();
    showNotification('✅ 翻译已更新（记得点击"保存更改"）', 'success');
}

function deleteTranslation(key) {
    if (!confirm(`确定要删除翻译键 "${key}" 吗？`)) {
        return;
    }
    
    delete currentTranslations.zh[key];
    delete currentTranslations.en[key];
    
    hasUnsavedChanges = true;
    renderCategories();
    renderTranslations();
    updateStats();
    showNotification('🗑️ 翻译已删除', 'info');
}

function closeDialog() {
    document.getElementById('translation-dialog').style.display = 'none';
    editingKey = null;
}

// ===================================
// 搜索功能
// ===================================

function searchTranslations() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.translation-card');
    
    cards.forEach(card => {
        const key = card.querySelector('.translation-key').textContent.toLowerCase();
        const zhText = card.querySelectorAll('.lang-text')[0].textContent.toLowerCase();
        const enText = card.querySelectorAll('.lang-text')[1].textContent.toLowerCase();
        
        if (key.includes(searchTerm) || zhText.includes(searchTerm) || enText.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===================================
// 统计信息
// ===================================

function updateStats() {
    const zhKeys = Object.keys(currentTranslations.zh || {});
    const enKeys = Object.keys(currentTranslations.en || {});
    const allKeys = new Set([...zhKeys, ...enKeys]);
    
    const totalKeys = allKeys.size;
    const zhComplete = zhKeys.length;
    const enComplete = enKeys.length;
    const missing = (totalKeys * 2) - (zhComplete + enComplete);
    
    document.getElementById('total-keys').textContent = totalKeys;
    document.getElementById('zh-complete').textContent = totalKeys > 0 ? Math.round((zhComplete / totalKeys) * 100) + '%' : '0%';
    document.getElementById('en-complete').textContent = totalKeys > 0 ? Math.round((enComplete / totalKeys) * 100) + '%' : '0%';
    document.getElementById('missing-count').textContent = missing;
}

// ===================================
// 导入导出
// ===================================

function exportTranslations() {
    const dataStr = JSON.stringify(currentTranslations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('📥 翻译数据已导出', 'success');
}

function importTranslations() {
    document.getElementById('import-dialog').style.display = 'flex';
}

function closeImportDialog() {
    document.getElementById('import-dialog').style.display = 'none';
    document.getElementById('import-file').value = '';
    document.getElementById('import-text').value = '';
}

function confirmImport() {
    const importType = document.querySelector('input[name="import-type"]:checked').value;
    
    if (importType === 'file') {
        const fileInput = document.getElementById('import-file');
        if (!fileInput.files.length) {
            alert('请选择文件');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                processImport(data);
            } catch (error) {
                alert('文件格式错误：' + error.message);
            }
        };
        
        reader.readAsText(file);
    } else {
        const text = document.getElementById('import-text').value.trim();
        if (!text) {
            alert('请粘贴 JSON 内容');
            return;
        }
        
        try {
            const data = JSON.parse(text);
            processImport(data);
        } catch (error) {
            alert('JSON 格式错误：' + error.message);
        }
    }
}

function processImport(data) {
    if (!data.zh || !data.en) {
        alert('导入数据格式错误，必须包含 zh 和 en 对象');
        return;
    }
    
    if (!confirm('导入将覆盖当前所有翻译，确定继续吗？')) {
        return;
    }
    
    currentTranslations = data;
    hasUnsavedChanges = true;
    closeImportDialog();
    renderCategories();
    renderTranslations();
    updateStats();
    showNotification('📤 翻译数据已导入', 'success');
}

// ===================================
// 通知提示
// ===================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// 其他功能
// ===================================

function toggleView() {
    // 预留功能：切换列表/卡片视图
    showNotification('视图切换功能开发中...', 'info');
}

function addCategory() {
    const categoryName = prompt('请输入新分类名称：');
    if (categoryName) {
        showNotification('自定义分类功能开发中...', 'info');
    }
}
