// ===================================
// 后台管理系统 JavaScript
// Admin System
// ===================================

class AdminSystem {
    constructor() {
        this.config = this.loadConfig();
        this.init();
    }
    
    init() {
        // 绑定导航事件
        this.bindNavigation();
        
        // 加载配置到表单
        this.loadConfigToForm();
        
        // 加载时间线项目
        this.loadTimelineItems();
        
        // 加载更新日志
        this.loadChangelog();
    }
    
    // 绑定导航
    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }
    
    // 切换页面
    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // 更新内容区域
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
        
        // 更新标题
        const titles = {
            'timeline': '时间节点管理',
            'links': '链接管理',
            'announcements': '公示信息管理',
            'settings': '系统设置'
        };
        document.getElementById('page-title').textContent = titles[section];
    }
    
    // 加载配置到表单
    loadConfigToForm() {
        // 时间节点
        if (this.config.timeline) {
            document.getElementById('application-start').value = this.config.timeline.applicationStart || '';
            document.getElementById('application-end').value = this.config.timeline.applicationEnd || '';
            document.getElementById('announcement-date').value = this.config.timeline.announcementDate || '';
            document.getElementById('notification-date').value = this.config.timeline.notificationDate || '';
        }
        
        // 链接
        if (this.config.links) {
            document.getElementById('link-academic').value = this.config.links.academic || '';
            document.getElementById('link-sports').value = this.config.links.sports || '';
            document.getElementById('link-visual-arts').value = this.config.links.visualArts || '';
            document.getElementById('link-performing-arts').value = this.config.links.performingArts || '';
            document.getElementById('link-leadership').value = this.config.links.leadership || '';
            document.getElementById('link-feishu').value = this.config.links.feishu || '';
            document.getElementById('link-backup').value = this.config.links.backup || '';
        }
        
        // 通知
        if (this.config.notice) {
            document.getElementById('notice-title-zh').value = this.config.notice.titleZh || '';
            document.getElementById('notice-title-en').value = this.config.notice.titleEn || '';
            document.getElementById('notice-content-zh').value = this.config.notice.contentZh || '';
            document.getElementById('notice-content-en').value = this.config.notice.contentEn || '';
            document.getElementById('notice-type').value = this.config.notice.type || 'info';
            document.getElementById('notice-enabled').checked = this.config.notice.enabled || false;
        }
        
        // 公示
        if (this.config.announcement) {
            document.getElementById('announcement-year').value = this.config.announcement.year || '';
            document.getElementById('announcement-link').value = this.config.announcement.link || '';
            document.getElementById('announcement-desc-zh').value = this.config.announcement.descZh || '';
            document.getElementById('announcement-desc-en').value = this.config.announcement.descEn || '';
            document.getElementById('announcement-enabled').checked = this.config.announcement.enabled || false;
        }
        
        // 系统设置
        if (this.config.system) {
            document.getElementById('system-enabled').checked = this.config.system.enabled !== false;
            document.getElementById('maintenance-mode').checked = this.config.system.maintenanceMode || false;
            document.getElementById('maintenance-message').value = this.config.system.maintenanceMessage || '';
        }
    }
    
    // 加载时间线项目
    loadTimelineItems() {
        const container = document.getElementById('timeline-items');
        const items = this.config.timelineItems || [];
        
        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p class="empty-state-text">暂无时间节点</p><p class="empty-state-hint">点击下方按钮添加</p></div>';
            return;
        }
        
        container.innerHTML = items.map((item, index) => `
            <div class="timeline-item" data-index="${index}">
                <div class="form-group">
                    <label>节点名称</label>
                    <input type="text" class="form-control" value="${item.name}" onchange="adminSystem.updateTimelineItem(${index}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>日期时间</label>
                    <input type="datetime-local" class="form-control" value="${item.datetime}" onchange="adminSystem.updateTimelineItem(${index}, 'datetime', this.value)">
                </div>
                <button class="timeline-item-remove" onclick="adminSystem.removeTimelineItem(${index})" title="删除">×</button>
            </div>
        `).join('');
    }
    
    // 添加时间线项目
    addTimelineItem() {
        if (!this.config.timelineItems) {
            this.config.timelineItems = [];
        }
        
        this.config.timelineItems.push({
            name: '新节点',
            datetime: ''
        });
        
        this.loadTimelineItems();
        this.showToast('已添加新节点');
    }
    
    // 更新时间线项目
    updateTimelineItem(index, field, value) {
        if (this.config.timelineItems && this.config.timelineItems[index]) {
            this.config.timelineItems[index][field] = value;
        }
    }
    
    // 删除时间线项目
    removeTimelineItem(index) {
        if (confirm('确定要删除这个时间节点吗？')) {
            this.config.timelineItems.splice(index, 1);
            this.loadTimelineItems();
            this.showToast('已删除节点');
        }
    }
    
    // 保存所有更改
    saveAllChanges() {
        // 收集所有表单数据
        this.config.timeline = {
            applicationStart: document.getElementById('application-start').value,
            applicationEnd: document.getElementById('application-end').value,
            announcementDate: document.getElementById('announcement-date').value,
            notificationDate: document.getElementById('notification-date').value
        };
        
        this.config.links = {
            academic: document.getElementById('link-academic').value,
            sports: document.getElementById('link-sports').value,
            visualArts: document.getElementById('link-visual-arts').value,
            performingArts: document.getElementById('link-performing-arts').value,
            leadership: document.getElementById('link-leadership').value,
            feishu: document.getElementById('link-feishu').value,
            backup: document.getElementById('link-backup').value
        };
        
        this.config.notice = {
            titleZh: document.getElementById('notice-title-zh').value,
            titleEn: document.getElementById('notice-title-en').value,
            contentZh: document.getElementById('notice-content-zh').value,
            contentEn: document.getElementById('notice-content-en').value,
            type: document.getElementById('notice-type').value,
            enabled: document.getElementById('notice-enabled').checked
        };
        
        this.config.announcement = {
            year: document.getElementById('announcement-year').value,
            link: document.getElementById('announcement-link').value,
            descZh: document.getElementById('announcement-desc-zh').value,
            descEn: document.getElementById('announcement-desc-en').value,
            enabled: document.getElementById('announcement-enabled').checked
        };
        
        this.config.system = {
            enabled: document.getElementById('system-enabled').checked,
            maintenanceMode: document.getElementById('maintenance-mode').checked,
            maintenanceMessage: document.getElementById('maintenance-message').value
        };
        
        // 保存到本地存储
        this.saveConfig();
        
        // 添加到更新日志
        this.addToChangelog('保存配置', '所有配置已更新');
        
        // 显示成功提示
        this.showToast('保存成功！');
    }
    
    // 保存配置
    saveConfig() {
        try {
            localStorage.setItem('scholarship_admin_config', JSON.stringify({
                config: this.config,
                lastUpdated: new Date().toISOString(),
                version: '1.0'
            }));
            
            // 同时保存到前端可访问的位置
            localStorage.setItem('scholarship_config', JSON.stringify(this.config));
            
            console.log('Configuration saved successfully');
        } catch (error) {
            console.error('Failed to save configuration:', error);
            this.showToast('保存失败', 'error');
        }
    }
    
    // 加载配置
    loadConfig() {
        try {
            const saved = localStorage.getItem('scholarship_admin_config');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.config || this.getDefaultConfig();
            }
        } catch (error) {
            console.error('Failed to load configuration:', error);
        }
        
        return this.getDefaultConfig();
    }
    
    // 获取默认配置
    getDefaultConfig() {
        return {
            timeline: {
                applicationStart: '2026-02-15T00:00',
                applicationEnd: '2026-03-15T23:59',
                announcementDate: '2026-04-01',
                notificationDate: '2026-04-15'
            },
            links: {
                academic: 'https://harrownanning-est.feishu.cn/wiki/LAAAwIUkKit4JQkz3rTc0kFqn0f',
                sports: 'https://harrownanning-est.feishu.cn/wiki/SbvWwJqJfiOUTFkLlhZcoTPln6g',
                visualArts: 'https://harrownanning-est.feishu.cn/wiki/B9g7wnny4ikJ97kge9xcHTJAnug',
                performingArts: 'https://harrownanning-est.feishu.cn/wiki/RdKmwGO2JiVLz0kCETzc9FbSnGd',
                leadership: 'https://harrownanning-est.feishu.cn/wiki/AFcpwk5CXidPTQkSwVWcuYJxnmg',
                feishu: 'https://harrownanning-est.feishu.cn/share/base/dashboard/shrcn68xVtB1LQysGLxZKpW2xFd',
                backup: ''
            },
            notice: {
                titleZh: '重要提醒',
                titleEn: 'Important Notice',
                contentZh: '申请窗口期即将开启。请确保您已仔细阅读奖学金规则，并准备好所有必要的申请材料。申请提交后将无法修改，请谨慎填写。',
                contentEn: 'The application window will open soon. Please ensure you have carefully read the scholarship rules and prepared all necessary application materials. Applications cannot be modified after submission, please fill in carefully.',
                type: 'warning',
                enabled: true
            },
            announcement: {
                year: '2026',
                link: '',
                descZh: '',
                descEn: '',
                enabled: false
            },
            system: {
                enabled: true,
                maintenanceMode: false,
                maintenanceMessage: '系统正在维护中，请稍后再试...'
            },
            timelineItems: [
                { name: '申请窗口开启', datetime: '2026-02-15T00:00' },
                { name: '申请截止', datetime: '2026-03-15T23:59' },
                { name: '初审完成', datetime: '2026-03-25T17:00' },
                { name: '结果公示', datetime: '2026-04-01T09:00' },
                { name: '正式通知', datetime: '2026-04-15T09:00' }
            ]
        };
    }
    
    // 导出配置
    exportConfig() {
        const dataStr = JSON.stringify(this.config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scholarship-config-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.showToast('配置已导出');
    }
    
    // 导入配置
    importConfig() {
        const fileInput = document.getElementById('import-file');
        fileInput.click();
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    this.config = imported;
                    this.loadConfigToForm();
                    this.loadTimelineItems();
                    this.saveConfig();
                    this.showToast('配置已导入');
                    this.addToChangelog('导入配置', '从文件导入配置');
                } catch (error) {
                    console.error('Import failed:', error);
                    this.showToast('导入失败，文件格式错误', 'error');
                }
            };
            reader.readAsText(file);
        };
    }
    
    // 重置配置
    resetConfig() {
        if (confirm('确定要重置为默认配置吗？此操作不可撤销！')) {
            this.config = this.getDefaultConfig();
            this.loadConfigToForm();
            this.loadTimelineItems();
            this.saveConfig();
            this.showToast('已重置为默认配置');
            this.addToChangelog('重置配置', '恢复为默认配置');
        }
    }
    
    // 预览更改
    previewChanges() {
        // 临时保存当前配置
        const tempConfig = { ...this.config };
        this.saveAllChanges();
        
        // 在新窗口打开预览
        window.open('scholarship-application.html', '_blank');
        
        this.showToast('已在新窗口打开预览');
    }
    
    // 添加到更新日志
    addToChangelog(action, details) {
        if (!this.config.changelog) {
            this.config.changelog = [];
        }
        
        this.config.changelog.unshift({
            action,
            details,
            timestamp: new Date().toISOString(),
            user: 'Admin'
        });
        
        // 只保留最近50条
        if (this.config.changelog.length > 50) {
            this.config.changelog = this.config.changelog.slice(0, 50);
        }
        
        this.saveConfig();
        this.loadChangelog();
    }
    
    // 加载更新日志
    loadChangelog() {
        const container = document.getElementById('changelog');
        const logs = this.config.changelog || [];
        
        if (logs.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p class="empty-state-text">暂无更新记录</p></div>';
            return;
        }
        
        container.innerHTML = logs.map(log => {
            const date = new Date(log.timestamp);
            const timeStr = date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="changelog-item">
                    <div class="changelog-time">${timeStr}</div>
                    <div class="changelog-action">${log.action}</div>
                    <div class="changelog-details">${log.details}</div>
                </div>
            `;
        }).join('');
    }
    
    // 显示提示
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = toast.querySelector('.toast-message');
        
        messageEl.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// 全局函数
function addTimelineItem() {
    adminSystem.addTimelineItem();
}

function saveAllChanges() {
    adminSystem.saveAllChanges();
}

function exportConfig() {
    adminSystem.exportConfig();
}

function importConfig() {
    adminSystem.importConfig();
}

function resetConfig() {
    adminSystem.resetConfig();
}

function previewChanges() {
    adminSystem.previewChanges();
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 这里可以添加实际的登出逻辑
        window.location.href = 'index.html';
    }
}

// 全局实例
let adminSystem;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    adminSystem = new AdminSystem();
});
