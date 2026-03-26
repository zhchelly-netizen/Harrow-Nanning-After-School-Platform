// ===================================
// 奖学金子页面模态框组件
// Scholarship Subpage Modal Component
// ===================================

class ScholarshipSubpageModal {
    constructor() {
        this.element = null;
        this.overlay = null;
        this.floatingBtn = null;
        this.currentCategory = null;
        this.isMinimized = false;
        this.isOpen = false;
        
        this.CATEGORY_CONFIG = {
            'leadership': {
                gradient: 'var(--gradient-leadership)',
                gradientClass: 'leadership',
                title: { zh: '领导力记录补全', en: 'Leadership Record Completion' },
                items: [
                    {
                        type: 'text',
                        title: { zh: '资格审查', en: 'Eligibility Check' },
                        content: { 
                            zh: '所有符合条件的哈罗南宁学生都可以申请，并以提交为准', 
                            en: 'All eligible Harrow Nanning students can apply, subject to submission' 
                        }
                    },
                    {
                        type: 'form',
                        title: { zh: '领导力与企业家精神版块综合项目申报', en: 'Leadership & Entrepreneurship Comprehensive Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnB40KooxOKt5EYs4xpmu1rd'
                    }
                ]
            },
            'music-performing': {
                gradient: 'var(--gradient-music-performing)',
                gradientClass: 'music-performing',
                title: { zh: '音表艺术记录补全', en: 'Music & Performing Arts Record' },
                items: [
                    {
                        type: 'text',
                        title: { zh: '资格审查', en: 'Eligibility Check' },
                        content: { 
                            zh: '音乐与表演艺术的身份需要预先注册，你可以登记你的专业项目，我们需要验证参与', 
                            en: 'Music & Performing Arts identity requires pre-registration. You can register your professional project, and we need to verify participation' 
                        }
                    },
                    {
                        type: 'form',
                        title: { zh: '音乐与表演艺术身份登记', en: 'Music & Performing Arts Identity Registration' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcn5Nz9wPDKdN1ROqp8DM1ELf'
                    },
                    {
                        type: 'form',
                        title: { zh: '音乐与表演艺术奖项申报', en: 'Music & Performing Arts Awards Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnfU3BPsUWlcEEMTssiEHwyf'
                    },
                    {
                        type: 'form',
                        title: { zh: '音乐与表演艺术考级申报', en: 'Music & Performing Arts Grade Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnrSpXxLeLgpCetsxZZpbvAg'
                    },
                    {
                        type: 'form',
                        title: { zh: '补充材料提交（主观评价15分，不提交就没有）', en: 'Support Materials (15 points subjective evaluation, no submission = no points)' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnJp9Mr4tOwEDjmSyZ4wkjEg'
                    }
                ]
            },
            'visual-arts': {
                gradient: 'var(--gradient-visual-arts)',
                gradientClass: 'visual-arts',
                title: { zh: '视觉艺术记录补全', en: 'Visual Arts Record Completion' },
                items: [
                    {
                        type: 'text',
                        title: { zh: '资格审查', en: 'Eligibility Check' },
                        content: { 
                            zh: '视觉艺术的身份需要预先注册，你可以登记你的专业项目，我们需要验证参与', 
                            en: 'Visual Arts identity requires pre-registration. You can register your professional project, and we need to verify participation' 
                        }
                    },
                    {
                        type: 'form',
                        title: { zh: '视觉艺术身份登记', en: 'Visual Arts Identity Registration' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnOGTHpOLOz2RMaMdZEpdAJd'
                    },
                    {
                        type: 'form',
                        title: { zh: '视觉艺术作品申报', en: 'Visual Arts Artwork Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnSAJWDoZDsR8p3vMg6N87vd'
                    },
                    {
                        type: 'form',
                        title: { zh: '视觉艺术奖项申报', en: 'Visual Arts Awards Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcn5Nz9wPDKdN1ROqp8DM1ELf'
                    },
                    {
                        type: 'form',
                        title: { zh: '视觉艺术考级申报', en: 'Visual Arts Grade Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnyvynbFoIz25JCWyHvHFS4c'
                    },
                    {
                        type: 'form',
                        title: { zh: '作品集提交', en: 'Portfolio Submission' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnu4BKBNp7JWxJEgaiNdpTrf'
                    }
                ]
            },
            'sports': {
                gradient: 'var(--gradient-sports)',
                gradientClass: 'sports',
                title: { zh: '竞技体育记录补全', en: 'Competitive Sports Record Completion' },
                items: [
                    {
                        type: 'text',
                        title: { zh: '资格审查', en: 'Eligibility Check' },
                        content: { 
                            zh: '仅有注册在精英体育项目并且符合要求（训练/180天赛果）的学生有资格竞争，精英运动员（Elite Sportsmen）名单实施集中管理', 
                            en: 'Only students registered in Elite Sports programs and meeting requirements (training/180-day competition results) are eligible. Elite Sportsmen list is centrally managed' 
                        }
                    },
                    {
                        type: 'form',
                        title: { zh: '竞技体育奖项申报', en: 'Competitive Sports Awards Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnx4HNjpOcVJXGddGXp5TGyB'
                    },
                    {
                        type: 'form',
                        title: { zh: '体育考级、国家运动员段位等申报', en: 'Sports Grade & National Athlete Level Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnnhykLOxeS444rsSp3f6d9f'
                    },
                    {
                        type: 'form',
                        title: { zh: '补充材料提交（主观评价15分，不提交就没有）', en: 'Support Materials (15 points subjective evaluation, no submission = no points)' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnP99gEv6ciHgaUhRit3TLOL'
                    }
                ]
            },
            'academic': {
                gradient: 'var(--gradient-academic)',
                gradientClass: 'academic',
                title: { zh: '学术记录补全', en: 'Academic Record Completion' },
                items: [
                    {
                        type: 'text',
                        title: { zh: '资格审查', en: 'Eligibility Check' },
                        content: { 
                            zh: '所有符合条件的哈罗南宁学生都会自动获得学术类奖学金的资格，考试成绩占比60%', 
                            en: 'All eligible Harrow Nanning students automatically qualify for academic scholarships. Exam results account for 60%' 
                        }
                    },
                    {
                        type: 'form',
                        title: { zh: '学术竞赛奖项申报', en: 'Academic Competition Awards Application' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnEuZi3olUwV9txLyyQugBme'
                    },
                    {
                        type: 'form',
                        title: { zh: '学术考级（英语等级考试、演讲考级等，不包含GSE）', en: 'Academic Grade (English exams, speech exams, etc., excluding GSE)' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnFXgMiReStGMmLy4BTdURCg'
                    },
                    {
                        type: 'form',
                        title: { zh: '冬、夏校登记', en: 'Winter/Summer School Registration' },
                        subtitle: { zh: '（教师直接评估出分）', en: '(Teacher direct assessment)' },
                        url: 'https://harrownanning-est.feishu.cn/share/base/form/shrcn28ZlvLbieFxQH2xWBhAMMf'
                    }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'subpage-modal-overlay';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        this.element = document.createElement('div');
        this.element.className = 'subpage-modal';
        this.element.innerHTML = this.getModalHTML();
        
        this.overlay.appendChild(this.element);
        document.body.appendChild(this.overlay);
        
        this.createFloatingButton();
        this.bindEvents();
        this.checkPersistedState();
    }
    
    getModalHTML() {
        return `
            <div class="subpage-modal-header">
                <button class="subpage-back-btn" onclick="scholarshipSubpageModal.returnToDashboard()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span data-i18n="backToDashboard">返回仪表盘</span>
                </button>
                <div class="subpage-modal-title-wrapper">
                    <h2 class="subpage-modal-title"></h2>
                </div>
                <div class="subpage-modal-actions">
                    <button class="subpage-minimize-btn" onclick="scholarshipSubpageModal.minimize()" title="最小化">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14"/>
                        </svg>
                    </button>
                    <button class="subpage-close-btn" onclick="scholarshipSubpageModal.close()" title="关闭">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="subpage-modal-breadcrumb">
                <span data-i18n="dashboardPageTitle">奖学金申请通道</span>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current"></span>
            </div>
            <div class="subpage-modal-content">
                <div class="subpage-items-container"></div>
            </div>
        `;
    }
    
    createFloatingButton() {
        this.floatingBtn = document.createElement('button');
        this.floatingBtn.className = 'subpage-floating-btn';
        this.floatingBtn.style.display = 'none';
        this.floatingBtn.innerHTML = `
            <div class="floating-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 12h6"/>
                </svg>
            </div>
            <span class="floating-btn-text"></span>
        `;
        this.floatingBtn.addEventListener('click', () => this.restore());
        document.body.appendChild(this.floatingBtn);
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        document.addEventListener('languageChanged', () => {
            if (this.currentCategory) {
                this.updateLanguage();
            }
        });
    }
    
    open(category) {
        if (!this.CATEGORY_CONFIG[category]) {
            console.error(`Unknown category: ${category}`);
            return;
        }
        
        this.currentCategory = category;
        this.isMinimized = false;
        this.isOpen = true;
        
        sessionStorage.removeItem('subpageModalMinimized');
        sessionStorage.removeItem('subpageModalCategory');
        
        this.updateContent();
        
        const config = this.CATEGORY_CONFIG[category];
        this.element.className = `subpage-modal ${config.gradientClass}`;
        this.element.style.setProperty('--category-gradient', config.gradient);
        
        this.floatingBtn.style.display = 'none';
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            this.element.classList.add('open');
        });
    }
    
    updateContent() {
        const config = this.CATEGORY_CONFIG[this.currentCategory];
        const lang = i18n ? i18n.getCurrentLanguage() : 'zh';
        
        const titleEl = this.element.querySelector('.subpage-modal-title');
        titleEl.textContent = config.title[lang];
        
        const breadcrumbCurrent = this.element.querySelector('.breadcrumb-current');
        breadcrumbCurrent.textContent = config.title[lang];
        
        const backBtnText = this.element.querySelector('[data-i18n="backToDashboard"]');
        if (backBtnText && i18n) {
            backBtnText.textContent = i18n.t('backToDashboard');
        }
        
        const breadcrumbFirst = this.element.querySelector('.subpage-modal-breadcrumb span:first-child');
        if (breadcrumbFirst && i18n) {
            breadcrumbFirst.textContent = i18n.t('dashboardPageTitle');
        }
        
        const container = this.element.querySelector('.subpage-items-container');
        container.innerHTML = '';
        
        // Count steps (only forms get numbered, text items are info only)
        let stepNumber = 0;
        
        config.items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = `subpage-item ${item.type} collapsed`;
            itemEl.style.setProperty('--item-index', index);
            itemEl.dataset.index = index;
            
            // Expand icon SVG
            const expandIcon = `<svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 9l-7 7-7-7"/>
            </svg>`;
            
            // Step number badge (only for forms)
            const stepBadge = item.type === 'form' ? 
                `<span class="subpage-step-badge">${++stepNumber}</span>` : 
                `<span class="subpage-step-badge info">ℹ</span>`;
            
            if (item.type === 'form') {
                itemEl.innerHTML = `
                    <div class="subpage-item-header" onclick="window.scholarshipModal.toggleItem(${index})">
                        ${stepBadge}
                        <h3 class="subpage-item-title">${item.title[lang]}</h3>
                        ${expandIcon}
                    </div>
                    <div class="subpage-item-content">
                        <div class="feishu-form-card">
                            <div class="feishu-form-loading">
                                <div class="ds-spinner"></div>
                                <span data-i18n="loadingForm">${i18n ? i18n.t('loadingForm') : '加载表单中...'}</span>
                            </div>
                            <iframe 
                                class="feishu-form-iframe"
                                data-src="${item.url}"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                `;
            } else if (item.type === 'alert') {
                itemEl.innerHTML = `
                    <div class="subpage-item-header" onclick="window.scholarshipModal.toggleItem(${index})">
                        ${stepBadge}
                        <h3 class="subpage-item-title">${item.title[lang]}</h3>
                        ${expandIcon}
                    </div>
                    <div class="subpage-item-content">
                        <div class="ds-alert ds-alert-warning">
                            <div class="ds-alert-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <div class="ds-alert-content">
                                <div class="ds-alert-message">${item.message[lang]}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (item.type === 'text') {
                itemEl.innerHTML = `
                    <div class="subpage-item-header" onclick="window.scholarshipModal.toggleItem(${index})">
                        ${stepBadge}
                        <h3 class="subpage-item-title">${item.title[lang]}</h3>
                        ${expandIcon}
                    </div>
                    <div class="subpage-item-content">
                        <div class="subpage-text-content">
                            <p>${item.content[lang]}</p>
                        </div>
                    </div>
                `;
            }
            
container.appendChild(itemEl);
        });
        
        setTimeout(() => {
            const firstFormItem = container.querySelector('.subpage-item.form');
            if (firstFormItem) {
                const index = parseInt(firstFormItem.dataset.index);
                this.toggleItem(index);
            }
        }, 200);
    }
    
    toggleItem(index) {
        const items = this.element.querySelectorAll('.subpage-item');
        const item = items[index];
        if (!item) return;
        
        const isCollapsed = item.classList.contains('collapsed');
        const content = item.querySelector('.subpage-item-content');
        const iframe = item.querySelector('.feishu-form-iframe');
        
        if (isCollapsed) {
            // Expand this item
            item.classList.remove('collapsed');
            item.classList.add('expanded');
            
            // Load iframe on first expand
            if (iframe && iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
                iframe.onload = function() {
                    const loading = this.parentElement.querySelector('.feishu-form-loading');
                    if (loading) loading.style.display = 'none';
                };
            }
            
            // Collapse other items
            items.forEach((otherItem, i) => {
                if (i !== index && otherItem.classList.contains('expanded')) {
                    otherItem.classList.remove('expanded');
                    otherItem.classList.add('collapsed');
                }
            });
        } else {
            // Collapse this item
            item.classList.remove('expanded');
            item.classList.add('collapsed');
        }
    }
    
    updateLanguage() {
        if (this.currentCategory) {
            this.updateContent();
        }
    }
    
    minimize() {
        this.isMinimized = true;
        this.isOpen = false;
        
        sessionStorage.setItem('subpageModalMinimized', 'true');
        sessionStorage.setItem('subpageModalCategory', this.currentCategory);
        
        const config = this.CATEGORY_CONFIG[this.currentCategory];
        const lang = i18n ? i18n.getCurrentLanguage() : 'zh';
        this.floatingBtn.querySelector('.floating-btn-text').textContent = config.title[lang];
        this.floatingBtn.className = `subpage-floating-btn ${config.gradientClass}`;
        this.floatingBtn.style.setProperty('--category-gradient', config.gradient);
        this.floatingBtn.style.display = 'flex';
        
        this.element.classList.remove('open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    restore() {
        if (!this.currentCategory) {
            const persistedCategory = sessionStorage.getItem('subpageModalCategory');
            if (persistedCategory) {
                this.currentCategory = persistedCategory;
            }
        }
        
        this.isMinimized = false;
        this.isOpen = true;
        
        sessionStorage.removeItem('subpageModalMinimized');
        sessionStorage.removeItem('subpageModalCategory');
        
        this.floatingBtn.style.display = 'none';
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            this.element.classList.add('open');
        });
    }
    
    close() {
        this.isOpen = false;
        this.isMinimized = false;
        this.currentCategory = null;
        
        sessionStorage.removeItem('subpageModalMinimized');
        sessionStorage.removeItem('subpageModalCategory');
        
        this.floatingBtn.style.display = 'none';
        
        this.element.classList.remove('open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    returnToDashboard() {
        this.close();
        if (!window.location.pathname.includes('scholarship-dashboard.html')) {
            window.location.href = 'scholarship-dashboard.html';
        }
    }
    
    checkPersistedState() {
        const isMinimized = sessionStorage.getItem('subpageModalMinimized') === 'true';
        const category = sessionStorage.getItem('subpageModalCategory');
        
        if (isMinimized && category && this.CATEGORY_CONFIG[category]) {
            this.currentCategory = category;
            
            const config = this.CATEGORY_CONFIG[category];
            const lang = i18n ? i18n.getCurrentLanguage() : 'zh';
            this.floatingBtn.querySelector('.floating-btn-text').textContent = config.title[lang];
            this.floatingBtn.className = `subpage-floating-btn ${config.gradientClass}`;
            this.floatingBtn.style.setProperty('--category-gradient', config.gradient);
            this.floatingBtn.style.display = 'flex';
        }
    }
}

let scholarshipSubpageModal = null;

document.addEventListener('DOMContentLoaded', function() {
    scholarshipSubpageModal = new ScholarshipSubpageModal();
    window.scholarshipModal = scholarshipSubpageModal;
});