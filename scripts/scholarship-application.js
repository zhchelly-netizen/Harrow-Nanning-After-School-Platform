// ===================================
// 奖学金申请系统 JavaScript
// Scholarship Application System
// ===================================

class ScholarshipApplication {
    constructor() {
        this.currentCategory = null;
        this.applicationData = this.loadProgress();
        this.categories = ['academic', 'sports', 'visual-arts', 'performing-arts', 'leadership'];
        this.config = this.loadConfig();
        this.countdownDate = this.getCountdownDate();
        
        this.init();
    }
    
    // 加载后台配置
    loadConfig() {
        try {
            const saved = localStorage.getItem('scholarship_config');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        }
        
        // 默认配置
        return {
            timeline: {
                applicationStart: '2026-02-15T00:00'
            },
            notice: {
                titleZh: '重要提醒',
                titleEn: 'Important Notice',
                contentZh: '申请窗口期即将开启。请确保您已仔细阅读奖学金规则，并准备好所有必要的申请材料。',
                contentEn: 'The application window will open soon. Please ensure you have carefully read the scholarship rules and prepared all necessary application materials.',
                enabled: true
            }
        };
    }
    
    // 获取倒计时日期
    getCountdownDate() {
        const startTime = this.config.timeline?.applicationStart || '2026-02-15T00:00';
        return new Date(startTime).getTime();
    }
    
    init() {
        // 检查系统状态
        if (!this.checkSystemStatus()) {
            return;
        }
        
        // 应用后台配置
        this.applyConfig();
        
        // 初始化倒计时
        this.startCountdown();
        
        // 绑定类别点击事件
        this.bindCategoryEvents();
        
        // 恢复进度显示
        this.restoreProgress();
        
        // 检查是否所有类别都完成
        this.checkAllComplete();
        
        // 自动保存
        this.setupAutoSave();
    }
    
    // 检查系统状态
    checkSystemStatus() {
        if (this.config.system?.maintenanceMode) {
            // 显示维护页面
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; padding: 2rem;">
                    <div style="text-align: center; max-width: 600px;">
                        <div style="font-size: 5rem; margin-bottom: 2rem;">🔧</div>
                        <h1 style="font-size: 2rem; color: #1e293b; margin-bottom: 1rem;">系统维护中</h1>
                        <p style="font-size: 1.125rem; color: #64748b; line-height: 1.6;">${this.config.system.maintenanceMessage || '系统正在维护中，请稍后再试...'}</p>
                    </div>
                </div>
            `;
            return false;
        }
        
        if (this.config.system?.enabled === false) {
            // 系统未启用
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; padding: 2rem;">
                    <div style="text-align: center; max-width: 600px;">
                        <div style="font-size: 5rem; margin-bottom: 2rem;">⏸️</div>
                        <h1 style="font-size: 2rem; color: #1e293b; margin-bottom: 1rem;">申请系统未开放</h1>
                        <p style="font-size: 1.125rem; color: #64748b; line-height: 1.6;">申请系统暂未开放，请关注学校通知。</p>
                    </div>
                </div>
            `;
            return false;
        }
        
        return true;
    }
    
    // 应用后台配置
    applyConfig() {
        // 更新重要通知
        if (this.config.notice?.enabled) {
            const noticeTitle = document.querySelector('.important-notice h3');
            const noticeText = document.querySelector('.important-notice p');
            
            if (noticeTitle && noticeText) {
                const lang = i18n?.currentLang || 'zh';
                noticeTitle.textContent = lang === 'zh' ? this.config.notice.titleZh : this.config.notice.titleEn;
                noticeText.textContent = lang === 'zh' ? this.config.notice.contentZh : this.config.notice.contentEn;
            }
        } else {
            // 隐藏通知
            const notice = document.querySelector('.important-notice');
            if (notice) notice.style.display = 'none';
        }
        
        // 更新倒计时说明
        if (this.config.timeline?.applicationStart) {
            const countdownNote = document.querySelector('.countdown-note');
            if (countdownNote) {
                const startDate = new Date(this.config.timeline.applicationStart);
                const dateStr = startDate.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                countdownNote.textContent = `申请窗口将于 ${dateStr} 开启`;
            }
        }
    }
    
    // 倒计时功能
    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.countdownDate - now;
            
            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // 绑定类别点击事件
    bindCategoryEvents() {
        document.querySelectorAll('.category-step').forEach(step => {
            step.addEventListener('click', () => {
                const category = step.dataset.category;
                this.openCategory(category);
            });
        });
    }
    
    // 打开类别表单
    openCategory(category) {
        this.currentCategory = category;
        
        // 隐藏欢迎屏幕
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('active');
        }
        
        // 显示表单容器
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
            formContainer.style.display = 'block';
        }
        
        // 隐藏所有表单
        document.querySelectorAll('.category-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // 显示当前类别表单
        const formId = `${category}-form`;
        let form = document.getElementById(formId);
        
        if (!form.hasChildNodes()) {
            // 动态生成表单内容
            this.generateForm(category, form);
        }
        
        form.style.display = 'block';
        
        // 更新类别状态为进行中
        if (!this.applicationData[category] || !this.applicationData[category].completed) {
            this.updateCategoryStatus(category, 'in-progress');
        }
        
        // 滚动到表单
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 生成表单内容
    generateForm(category, container) {
        const categoryNames = {
            'academic': i18n.t('academic'),
            'sports': i18n.t('sports'),
            'visual-arts': i18n.t('visualArts'),
            'performing-arts': i18n.t('performingArts'),
            'leadership': i18n.t('leadership')
        };
        
        const categoryIcons = {
            'academic': '📖',
            'sports': '⚽',
            'visual-arts': '🎨',
            'performing-arts': '🎭',
            'leadership': '👥'
        };
        
        const formHTML = `
            <div class="form-header">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${categoryIcons[category]}</div>
                <h3>${categoryNames[category]} ${i18n.t('categoryApplication')}</h3>
                <p data-i18n="fillCategoryInfo">${i18n.t('fillCategoryInfo')}</p>
            </div>
            
            <div class="form-section">
                <h4 data-i18n="achievementsTitle">${i18n.t('achievementsTitle')}</h4>
                
                <div class="form-group">
                    <label data-i18n="achievementDescription">${i18n.t('achievementDescription')}</label>
                    <textarea id="${category}-achievements" placeholder="${i18n.t('achievementPlaceholder')}" rows="6"></textarea>
                    <p class="form-hint" data-i18n="achievementHint">${i18n.t('achievementHint')}</p>
                </div>
                
                <div class="form-group">
                    <label data-i18n="awards">${i18n.t('awards')}</label>
                    <textarea id="${category}-awards" placeholder="${i18n.t('awardsPlaceholder')}" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                    <label data-i18n="uploadEvidence">${i18n.t('uploadEvidence')}</label>
                    <div class="file-upload" onclick="document.getElementById('${category}-files').click()">
                        <div class="file-upload-icon">📎</div>
                        <p data-i18n="clickToUpload">${i18n.t('clickToUpload')}</p>
                        <p class="form-hint" data-i18n="fileHint">${i18n.t('fileHint')}</p>
                        <input type="file" id="${category}-files" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                    </div>
                    <div class="uploaded-files" id="${category}-uploaded-files"></div>
                </div>
            </div>
            
            <div class="form-section">
                <h4 data-i18n="personalStatement">${i18n.t('personalStatement')}</h4>
                
                <div class="form-group">
                    <label data-i18n="whyApply">${i18n.t('whyApply')}</label>
                    <textarea id="${category}-why" placeholder="${i18n.t('whyApplyPlaceholder')}" rows="6"></textarea>
                </div>
                
                <div class="form-group">
                    <label data-i18n="futurePlans">${i18n.t('futurePlans')}</label>
                    <textarea id="${category}-plans" placeholder="${i18n.t('futurePlansPlaceholder')}" rows="6"></textarea>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="secondary-button" onclick="scholarshipApp.saveAndClose('${category}')">
                    <span data-i18n="saveAndClose">${i18n.t('saveAndClose')}</span>
                </button>
                <button class="primary-button" onclick="scholarshipApp.completeCategory('${category}')">
                    <span data-i18n="completeCategory">${i18n.t('completeCategory')}</span>
                    <span>✓</span>
                </button>
            </div>
        `;
        
        container.innerHTML = formHTML;
        
        // 绑定文件上传事件
        this.bindFileUpload(category);
        
        // 恢复已保存的数据
        this.restoreCategoryData(category);
    }
    
    // 绑定文件上传
    bindFileUpload(category) {
        const fileInput = document.getElementById(`${category}-files`);
        const uploadedFilesContainer = document.getElementById(`${category}-uploaded-files`);
        
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            
            if (!this.applicationData[category]) {
                this.applicationData[category] = {};
            }
            if (!this.applicationData[category].files) {
                this.applicationData[category].files = [];
            }
            
            files.forEach(file => {
                this.applicationData[category].files.push({
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            });
            
            this.displayUploadedFiles(category);
            this.saveProgress();
        });
    }
    
    // 显示已上传文件
    displayUploadedFiles(category) {
        const container = document.getElementById(`${category}-uploaded-files`);
        if (!container) return;
        
        const files = this.applicationData[category]?.files || [];
        
        container.innerHTML = files.map((file, index) => `
            <div class="uploaded-file">
                <span class="file-icon">📄</span>
                <span class="file-name">${file.name}</span>
                <button class="file-remove" onclick="scholarshipApp.removeFile('${category}', ${index})" title="${i18n.t('remove')}">×</button>
            </div>
        `).join('');
    }
    
    // 移除文件
    removeFile(category, index) {
        if (this.applicationData[category]?.files) {
            this.applicationData[category].files.splice(index, 1);
            this.displayUploadedFiles(category);
            this.saveProgress();
        }
    }
    
    // 保存并关闭
    saveAndClose(category) {
        this.saveCategoryData(category);
        
        // 检查是否所有类别都完成
        const allComplete = this.categories.every(cat => 
            this.applicationData[cat]?.completed
        );
        
        if (allComplete) {
            // 如果所有类别都完成，隐藏表单容器
            document.getElementById('form-container').style.display = 'none';
        } else {
            // 显示欢迎屏幕
            document.getElementById('welcome-screen').classList.add('active');
        }
        
        document.getElementById(`${category}-form`).style.display = 'none';
        
        // 检查完成状态
        this.checkAllComplete();
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // 完成类别
    completeCategory(category) {
        this.saveCategoryData(category);
        
        // 标记为已完成
        if (!this.applicationData[category]) {
            this.applicationData[category] = {};
        }
        this.applicationData[category].completed = true;
        this.applicationData[category].completedAt = new Date().toISOString();
        
        this.saveProgress();
        this.updateCategoryStatus(category, 'completed');
        
        // 隐藏当前表单
        document.getElementById(`${category}-form`).style.display = 'none';
        
        // 检查是否所有类别都完成
        const allComplete = this.categories.every(cat => 
            this.applicationData[cat]?.completed
        );
        
        if (allComplete) {
            // 如果所有类别都完成，隐藏表单容器
            document.getElementById('form-container').style.display = 'none';
        } else {
            // 显示欢迎屏幕
            document.getElementById('welcome-screen').classList.add('active');
        }
        
        // 检查完成状态
        this.checkAllComplete();
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 显示成功提示
        this.showNotification(i18n.t('categorySaved'), 'success');
    }
    
    // 保存类别数据
    saveCategoryData(category) {
        if (!this.applicationData[category]) {
            this.applicationData[category] = {};
        }
        
        const data = {
            achievements: document.getElementById(`${category}-achievements`)?.value || '',
            awards: document.getElementById(`${category}-awards`)?.value || '',
            why: document.getElementById(`${category}-why`)?.value || '',
            plans: document.getElementById(`${category}-plans`)?.value || '',
            files: this.applicationData[category].files || []
        };
        
        this.applicationData[category] = {
            ...this.applicationData[category],
            ...data,
            lastSaved: new Date().toISOString()
        };
        
        this.saveProgress();
    }
    
    // 恢复类别数据
    restoreCategoryData(category) {
        const data = this.applicationData[category];
        if (!data) return;
        
        const fields = ['achievements', 'awards', 'why', 'plans'];
        fields.forEach(field => {
            const element = document.getElementById(`${category}-${field}`);
            if (element && data[field]) {
                element.value = data[field];
            }
        });
        
        if (data.files) {
            this.displayUploadedFiles(category);
        }
    }
    
    // 更新类别状态
    updateCategoryStatus(category, status) {
        const step = document.querySelector(`.category-step[data-category="${category}"]`);
        if (!step) return;
        
        // 移除所有状态类
        step.classList.remove('completed', 'in-progress');
        
        // 添加新状态
        if (status === 'completed') {
            step.classList.add('completed');
            step.querySelector('.category-check').textContent = '✓';
        } else if (status === 'in-progress') {
            step.classList.add('in-progress');
            step.querySelector('.category-check').textContent = '○';
        }
        
        // 更新状态文本
        const statusElement = step.querySelector('.category-status');
        statusElement.className = `category-status ${status === 'completed' ? 'completed' : status === 'in-progress' ? 'in-progress' : 'incomplete'}`;
        
        const statusTexts = {
            'completed': i18n.t('completed'),
            'in-progress': i18n.t('inProgress'),
            'incomplete': i18n.t('notStarted')
        };
        statusElement.textContent = statusTexts[status] || statusTexts['incomplete'];
    }
    
    // 恢复进度
    restoreProgress() {
        this.categories.forEach(category => {
            const data = this.applicationData[category];
            if (data?.completed) {
                this.updateCategoryStatus(category, 'completed');
            }
        });
    }
    
    // 检查是否所有类别都完成
    checkAllComplete() {
        const allComplete = this.categories.every(category => 
            this.applicationData[category]?.completed
        );
        
        const submitSection = document.getElementById('final-submit-section');
        const welcomeScreen = document.getElementById('welcome-screen');
        const formContainer = document.getElementById('form-container');
        
        if (allComplete) {
            // 隐藏欢迎屏幕和表单容器
            if (welcomeScreen) welcomeScreen.style.display = 'none';
            if (formContainer) formContainer.style.display = 'none';
            
            // 显示提交按钮
            submitSection.style.display = 'flex';
            submitSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // 显示欢迎屏幕或表单
            if (formContainer) formContainer.style.display = 'block';
            
            // 隐藏提交按钮
            submitSection.style.display = 'none';
        }
    }
    
    // 保存进度到本地存储
    saveProgress() {
        try {
            // 使用设备指纹作为唯一标识
            const deviceId = this.getDeviceId();
            const storageKey = `scholarship_application_${deviceId}`;
            
            localStorage.setItem(storageKey, JSON.stringify({
                data: this.applicationData,
                lastUpdated: new Date().toISOString(),
                version: '1.0'
            }));
            
            console.log('Progress saved successfully');
        } catch (error) {
            console.error('Failed to save progress:', error);
            this.showNotification(i18n.t('saveFailed'), 'error');
        }
    }
    
    // 加载进度
    loadProgress() {
        try {
            const deviceId = this.getDeviceId();
            const storageKey = `scholarship_application_${deviceId}`;
            const saved = localStorage.getItem(storageKey);
            
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Progress loaded successfully');
                return parsed.data || {};
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
        
        return {};
    }
    
    // 获取设备ID（基于浏览器指纹）
    getDeviceId() {
        let deviceId = localStorage.getItem('device_id');
        
        if (!deviceId) {
            // 生成设备指纹
            const fingerprint = [
                navigator.userAgent,
                navigator.language,
                screen.width,
                screen.height,
                screen.colorDepth,
                new Date().getTimezoneOffset()
            ].join('|');
            
            // 简单哈希
            deviceId = this.simpleHash(fingerprint);
            localStorage.setItem('device_id', deviceId);
        }
        
        return deviceId;
    }
    
    // 简单哈希函数
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    
    // 自动保存
    setupAutoSave() {
        // 每30秒自动保存一次
        setInterval(() => {
            if (this.currentCategory) {
                this.saveCategoryData(this.currentCategory);
            }
        }, 30000);
        
        // 页面关闭前保存
        window.addEventListener('beforeunload', () => {
            if (this.currentCategory) {
                this.saveCategoryData(this.currentCategory);
            }
        });
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 前往最终确认页面
function goToFinalConfirmation() {
    // 这里可以跳转到最终确认表格页面
    window.location.href = 'scholarship-confirmation.html';
}

// 全局实例
let scholarshipApp;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    scholarshipApp = new ScholarshipApplication();
});

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
