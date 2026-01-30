// ===================================
// 浮动规划框组件
// Floating Planner Widget
// ===================================

class FloatingPlanner {
    constructor() {
        this.isMinimized = false;
        this.isDragging = false;
        this.currentPosition = { x: 0, y: 0 };
        this.dragOffset = { x: 0, y: 0 };
        this.element = null;
        
        this.init();
    }
    
    init() {
        // 创建浮动框元素
        this.element = document.createElement('div');
        this.element.className = 'floating-planner';
        this.element.innerHTML = `
            <div class="planner-header">
                <div class="planner-title">
                    <span class="icon">📋</span>
                    <span data-i18n="floatingPlannerTitle">我的规划</span>
                </div>
                <button class="minimize-btn" onclick="event.stopPropagation(); floatingPlanner.toggleMinimize();">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
            </div>
            <div class="planner-custom-time-warning" style="display: none;">
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                    <div class="warning-title" data-i18n="customTimeWarningTitle">定制时间提醒</div>
                    <div class="warning-text" data-i18n="customTimeWarningText">您已选择定制时间的课程。请注意，后续选择的内容可能会导致可定制的课程无法协调。定制课程（除1v1外）也需要多人协调，请在后续与负责老师协商具体时间安排。</div>
                </div>
            </div>
            <div class="planner-mini-summary">
                <div class="planner-mini-reminder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span data-i18n="selectForEachDay">你需要为周中每一天都做出选择</span>
                </div>
                <div class="planner-mini-days">
                    <div class="planner-mini-day empty" data-day="monday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">MON</div>
                    </div>
                    <div class="planner-mini-day empty" data-day="tuesday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">TUE</div>
                    </div>
                    <div class="planner-mini-day empty" data-day="wednesday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">WED</div>
                    </div>
                    <div class="planner-mini-day empty" data-day="thursday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">THU</div>
                    </div>
                    <div class="planner-mini-day empty" data-day="friday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">FRI</div>
                    </div>
                    <div class="planner-mini-day empty" data-day="saturday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">SAT</div>
                    </div>
                    <div class="planner-mini-day empty" data-day="sunday">
                        <div class="planner-mini-day-icon">-</div>
                        <div class="planner-mini-day-name">SUN</div>
                    </div>
                </div>
            </div>
            <div class="planner-content">
                <div class="planner-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text" data-i18n="floatingPlannerProgress">${i18n.t('floatingPlannerProgress', {current: 0, total: 5})}</div>
                </div>
                
                <div class="planner-empty-state">
                    <div class="icon">📝</div>
                    <p data-i18n="floatingPlannerEmpty">${i18n.t('floatingPlannerEmpty')}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.element);
        
        // 绑定拖拽事件
        this.bindDragEvents();
        
        // 绑定焦点管理事件（仅桌面端）
        this.bindFocusEvents();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
        
        // 初始化页面内边距
        this.adjustPagePadding(false);
    }
    
    bindFocusEvents() {
        // 点击浮动框 - 聚焦（仅桌面端）
        this.element.addEventListener('click', (e) => {
            // 移动端不处理焦点
            if (window.innerWidth <= 768) return;
            
            e.stopPropagation();
            this.setFocused(true);
        });
        
        // 点击页面其他区域 - 失焦并最小化（仅桌面端）
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) return; // 移动端不处理
            
            if (!this.element.contains(e.target)) {
                this.setFocused(false);
                // 自动最小化
                if (!this.isMinimized) {
                    this.toggleMinimize();
                }
            }
        });
        
        // 初始状态：桌面端失焦，移动端正常
        if (window.innerWidth > 768) {
            this.setFocused(false);
        }
    }
    
    setFocused(focused) {
        if (window.innerWidth <= 768) return; // 移动端不处理
        
        if (focused) {
            this.element.classList.remove('unfocused');
            this.element.classList.add('focused');
        } else {
            this.element.classList.remove('focused');
            this.element.classList.add('unfocused');
        }
    }
    
    bindDragEvents() {
        const header = this.element.querySelector('.planner-header');
        
        header.addEventListener('mousedown', (e) => {
            if (this.isMinimized) {
                this.toggleMinimize();
                return;
            }
            
            this.isDragging = true;
            this.element.classList.add('dragging');
            
            const rect = this.element.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            
            // 限制在视口内
            const maxX = window.innerWidth - this.element.offsetWidth;
            const maxY = window.innerHeight - this.element.offsetHeight;
            
            this.currentPosition.x = Math.max(0, Math.min(x, maxX));
            this.currentPosition.y = Math.max(0, Math.min(y, maxY));
            
            this.element.style.left = this.currentPosition.x + 'px';
            this.element.style.top = this.currentPosition.y + 'px';
            this.element.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.element.classList.remove('dragging');
            }
        });
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.element.classList.toggle('minimized', this.isMinimized);
        
        // 桌面端：展开时自动聚焦
        if (!this.isMinimized && window.innerWidth > 768) {
            this.setFocused(true);
        }
    }
    
    handleResize() {
        // 移动端自动定位到底部
        if (window.innerWidth <= 768) {
            this.element.style.left = '';
            this.element.style.top = '';
            this.element.style.right = '';
            // 移动端移除焦点状态
            this.element.classList.remove('focused', 'unfocused');
        } else {
            // 桌面端恢复焦点管理
            if (!this.element.classList.contains('focused') && !this.element.classList.contains('unfocused')) {
                this.setFocused(false);
            }
        }
        
        // 重新调整页面内边距
        const warningElement = this.element.querySelector('.planner-custom-time-warning');
        if (warningElement) {
            const hasWarning = warningElement.style.display !== 'none';
            this.adjustPagePadding(hasWarning);
        }
    }
    
    updateProgress(currentStep, totalSteps = 5) {
        const percentage = (currentStep / totalSteps) * 100;
        const progressFill = this.element.querySelector('.progress-fill');
        const progressText = this.element.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.dataset.currentStep = currentStep;
            progressText.dataset.totalSteps = totalSteps;
            progressText.textContent = i18n.t('floatingPlannerProgress', {current: currentStep, total: totalSteps});
        }
    }
    
    updateStudentInfo(grade) {
        const content = this.element.querySelector('.planner-content');
        
        // 移除空状态
        const emptyState = content.querySelector('.planner-empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // 检查是否已存在学生信息
        let studentInfo = content.querySelector('.planner-student-info');
        if (!studentInfo) {
            studentInfo = document.createElement('div');
            studentInfo.className = 'planner-student-info';
            content.insertBefore(studentInfo, content.firstChild.nextSibling);
        }
        
        studentInfo.innerHTML = `
            <div class="info-label" data-i18n="general.currentGrade">${i18n.t('general.currentGrade')}</div>
            <div class="info-value">${grade}</div>
        `;
        
        // 不自动更新进度，由页面的 currentStep 控制
    }
    
    updateElitePrograms(programs) {
        const content = this.element.querySelector('.planner-content');
        
        // 移除旧的精英项目列表
        const oldList = content.querySelector('.planner-elite-list');
        if (oldList) {
            oldList.remove();
        }
        
        // 检查是否有定制时间的课程
        this.checkAndShowCustomTimeWarning(programs);
        
        if (programs.length === 0) {
            // 不自动更新进度，由页面的 currentStep 控制
            // 即使没有精英项目，也要更新周计划
            this.updateWeekSchedule();
            this.updateMiniSummary();
            return;
        }
        
        // 创建新的精英项目列表
        const eliteList = document.createElement('div');
        eliteList.className = 'planner-elite-list';
        
        const title = document.createElement('div');
        title.className = 'planner-section-title';
        title.innerHTML = `<span>🏆</span><span data-i18n="general.elitePrograms">${i18n.t('general.elitePrograms')}</span>`;
        eliteList.appendChild(title);
        
        programs.forEach(program => {
            const item = document.createElement('div');
            item.className = 'planner-elite-item';
            
            const icon = this.getIconForCategory(program.category);
            const scheduleText = this.getScheduleText(program.schedule);
            
            // 根据当前语言获取精英项目名称
            const programName = typeof ELITE_PROGRAM_TRANSLATIONS !== 'undefined' && ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang] && ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value]
                ? ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value]
                : program.value;
            
            item.innerHTML = `
                <div class="planner-elite-icon">${icon}</div>
                <div class="planner-elite-details">
                    <div class="planner-elite-name">${programName}</div>
                    <div class="planner-elite-schedule">${scheduleText}</div>
                </div>
            `;
            
            eliteList.appendChild(item);
        });
        
        // 插入到学生信息后面
        const studentInfo = content.querySelector('.planner-student-info');
        if (studentInfo) {
            studentInfo.after(eliteList);
        } else {
            content.insertBefore(eliteList, content.firstChild.nextSibling);
        }
        
        // 不自动更新进度，由页面的 currentStep 控制
        this.updateWeekSchedule();
    }
    
    updateWeekSchedule() {
        const content = this.element.querySelector('.planner-content');
        
        // 移除旧的周计划
        const oldSchedule = content.querySelector('.planner-week-schedule');
        if (oldSchedule) {
            oldSchedule.remove();
        }
        
        // 创建新的周计划
        const weekSchedule = document.createElement('div');
        weekSchedule.className = 'planner-week-schedule';
        
        const title = document.createElement('div');
        title.className = 'planner-section-title';
        title.innerHTML = `<span>📅</span><span data-i18n="general.weeklySchedule">${i18n.t('general.weeklySchedule')}</span>`;
        weekSchedule.appendChild(title);
        
        const days = [
            { key: 'monday', name: i18n.t('days.monday'), short: 'mon' },
            { key: 'tuesday', name: i18n.t('days.tuesday'), short: 'tue' },
            { key: 'wednesday', name: i18n.t('days.wednesday'), short: 'wed' },
            { key: 'thursday', name: i18n.t('days.thursday'), short: 'thu' },
            { key: 'friday', name: i18n.t('days.friday'), short: 'fri' },
            { key: 'saturday', name: i18n.t('days.saturday'), short: 'sat' },
            { key: 'sunday', name: i18n.t('days.sunday'), short: 'sun' }
        ];
        
        days.forEach(day => {
            const dayItem = document.createElement('div');
            dayItem.className = 'planner-day-item';
            dayItem.dataset.day = day.key;
            
            const activities = this.getActivitiesForDay(day.short, day.key);
            const hasActivities = activities.length > 0;
            const hasConflict = this.checkDayConflict(day.short);
            
            if (hasActivities) {
                dayItem.classList.add('has-selection');
            }
            if (hasConflict) {
                dayItem.classList.add('has-conflict');
            }
            
            let statusClass = 'empty';
            let statusText = i18n.t('general.notSelected');
            if (hasConflict) {
                statusClass = 'conflict';
                statusText = i18n.t('general.conflict');
            } else if (hasActivities) {
                statusClass = 'selected';
                statusText = i18n.t('general.selected');
            }
            
            dayItem.innerHTML = `
                <div class="planner-day-header">
                    <div class="planner-day-name">${day.name}</div>
                    <div class="planner-day-status ${statusClass}">${statusText}</div>
                </div>
                <div class="planner-day-activities">
                    ${activities.length > 0 ? activities.map(activity => `
                        <div class="planner-activity">
                            <div class="planner-activity-icon">${activity.icon}</div>
                            <div class="planner-activity-details">
                                <div class="planner-activity-name">${activity.name}</div>
                                <div class="planner-activity-time">${activity.time}</div>
                                <span class="planner-activity-type ${activity.type}">${activity.typeLabel}</span>
                            </div>
                        </div>
                    `).join('') : `<div style="font-size: 0.75rem; color: #94a3b8; text-align: center;">${i18n.t('general.noArrangement')}</div>`}
                </div>
            `;
            
            weekSchedule.appendChild(dayItem);
        });
        
        // 插入到内容区域
        content.appendChild(weekSchedule);
        
        // 更新统计信息
        this.updateStats();
        
        // 更新缩略信息
        this.updateMiniSummary();
    }
    
    updateMiniSummary() {
        const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        allDays.forEach(day => {
            const miniDay = this.element.querySelector(`.planner-mini-day[data-day="${day}"]`);
            if (!miniDay) return;
            
            const dayShortMap = {
                'monday': 'mon',
                'tuesday': 'tue',
                'wednesday': 'wed',
                'thursday': 'thu',
                'friday': 'fri',
                'saturday': 'sat',
                'sunday': 'sun'
            };
            
            const activities = this.getActivitiesForDay(dayShortMap[day], day);
            const hasConflict = this.checkDayConflict(dayShortMap[day]);
            
            const iconEl = miniDay.querySelector('.planner-mini-day-icon');
            
            // 重置类名
            miniDay.className = 'planner-mini-day';
            
            if (hasConflict) {
                miniDay.classList.add('conflict');
                iconEl.textContent = '⚠️';
            } else if (activities.length > 0) {
                miniDay.classList.add('selected');
                iconEl.textContent = '✓';
            } else {
                miniDay.classList.add('empty');
                iconEl.textContent = '-';
            }
        });
    }
    
    getActivitiesForDay(dayShort, dayKey) {
        const activities = [];
        
        // 获取精英项目
        if (typeof selectedElitePrograms !== 'undefined') {
            selectedElitePrograms.forEach(program => {
                if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                    // 分割并去除空格
                    const days = program.schedule.split(',').map(d => d.trim());
                    if (days.includes(dayShort)) {
                        const scheduleInfo = typeof ELITE_SCHEDULES !== 'undefined' ? ELITE_SCHEDULES[program.value] : null;
                        // 根据当前语言获取精英项目名称
                        const programName = typeof ELITE_PROGRAM_TRANSLATIONS !== 'undefined' && ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang] && ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value]
                            ? ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value]
                            : program.label;
                        activities.push({
                            icon: '🏆',
                            name: programName,
                            time: scheduleInfo ? scheduleInfo.time : '16:00-17:00',
                            type: 'elite',
                            typeLabel: i18n.t('general.elite')
                        });
                    }
                }
            });
        }
        
        // 获取CCA课程（仅工作日有CCA）
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        if (weekdays.includes(dayKey) && typeof selectedCCAs !== 'undefined' && selectedCCAs[dayKey]) {
            const cca = selectedCCAs[dayKey];
            if (!cca.blocked) {
                // 根据当前语言选择课程名称
                const ccaName = i18n.currentLang === 'en' && cca.nameEn ? cca.nameEn : cca.name;
                activities.push({
                    icon: cca.isOptOut ? '🚫' : '📚',
                    name: ccaName,
                    time: '16:00-17:00',
                    type: cca.isOptOut ? 'optout' : 'cca',
                    typeLabel: cca.isOptOut ? i18n.t('courses.optOut') : 'CCA'
                });
            }
        }
        
        return activities;
    }
    
    checkDayConflict(dayShort) {
        // 检查该天是否有冲突（精英项目之间，或精英项目与CCA之间）
        if (typeof selectedElitePrograms === 'undefined') return false;
        
        // 统计该天的精英项目数量
        let eliteCount = 0;
        selectedElitePrograms.forEach(program => {
            if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                // 分割并去除空格
                const days = program.schedule.split(',').map(d => d.trim());
                if (days.includes(dayShort)) {
                    eliteCount++;
                }
            }
        });
        
        // 检查是否有多个精英项目冲突
        if (eliteCount > 1) {
            return true;
        }
        
        // 检查精英项目与CCA是否冲突
        const dayKeyMap = {
            'mon': 'monday',
            'tue': 'tuesday',
            'wed': 'wednesday',
            'thu': 'thursday',
            'fri': 'friday',
            'sat': 'saturday',
            'sun': 'sunday'
        };
        
        const dayKey = dayKeyMap[dayShort];
        
        // 如果该天有精英项目，且该天也有CCA课程（非"不参加"），则冲突
        if (eliteCount > 0 && dayKey && typeof selectedCCAs !== 'undefined' && selectedCCAs[dayKey]) {
            const cca = selectedCCAs[dayKey];
            // 只有实际的CCA课程才算冲突，"不参加"和被占用的不算
            if (!cca.blocked && !cca.isOptOut) {
                return true;
            }
        }
        
        return false;
    }
    
    updateStats() {
        const content = this.element.querySelector('.planner-content');
        
        // 移除旧的统计信息
        const oldStats = content.querySelector('.planner-stats');
        if (oldStats) {
            oldStats.remove();
        }
        
        // 计算统计数据
        const eliteCount = typeof selectedElitePrograms !== 'undefined' ? selectedElitePrograms.length : 0;
        const ccaCount = typeof selectedCCAs !== 'undefined' ? Object.values(selectedCCAs).filter(c => c && !c.blocked && !c.isOptOut).length : 0;
        const totalDays = 5;
        const selectedDays = typeof selectedCCAs !== 'undefined' ? Object.keys(selectedCCAs).length : 0;
        
        // 创建统计信息
        const stats = document.createElement('div');
        stats.className = 'planner-stats';
        // 根据语言决定量词显示
        const itemsUnit = i18n.currentLang === 'zh' ? ` ${i18n.t('general.items')}` : '';
        const coursesUnit = i18n.currentLang === 'zh' ? ` ${i18n.t('general.courses')}` : '';
        const daysUnit = i18n.currentLang === 'zh' ? ` ${i18n.t('general.days')}` : ` ${i18n.t('general.days')}`;
        
        stats.innerHTML = `
            <div class="planner-stat-row">
                <span class="planner-stat-label" data-i18n="general.elitePrograms">${i18n.t('general.elitePrograms')}</span>
                <span class="planner-stat-value">${eliteCount}${itemsUnit}</span>
            </div>
            <div class="planner-stat-row">
                <span class="planner-stat-label" data-i18n="general.ccaCourses">${i18n.t('general.ccaCourses')}</span>
                <span class="planner-stat-value">${ccaCount}${coursesUnit}</span>
            </div>
            <div class="planner-stat-row">
                <span class="planner-stat-label" data-i18n="general.scheduledDays">${i18n.t('general.scheduledDays')}</span>
                <span class="planner-stat-value">${selectedDays}/${totalDays}${daysUnit}</span>
            </div>
        `;
        
        content.appendChild(stats);
    }
    
    getIconForCategory(category) {
        const icons = {
            'sports': '⚽',
            'music': '🎵',
            'academic': '🎓',
            'hub': '📖',
            'math': '🔢'
        };
        return icons[category] || '📚';
    }
    
    getScheduleText(schedule) {
        if (!schedule || schedule === 'custom') {
            return i18n.t('customTime');
        }
        if (schedule === 'none') {
            return i18n.t('noBlockCCA');
        }
        
        const dayMap = {
            'mon': i18n.t('mondayShort'),
            'tue': i18n.t('tuesdayShort'),
            'wed': i18n.t('wednesdayShort'),
            'thu': i18n.t('thursdayShort'),
            'fri': i18n.t('fridayShort'),
            'sat': i18n.t('saturdayShort'),
            'sun': i18n.t('sundayShort')
        };
        
        // 分割并去除空格
        const days = schedule.split(',').map(d => d.trim()).map(d => dayMap[d] || d);
        return days.join(i18n.t('comma'));
    }
    
    updateCCASelection(day, course) {
        this.updateWeekSchedule();
        
        // 不自动更新进度，由页面的 currentStep 控制
    }
    
    checkAndShowCustomTimeWarning(programs) {
        const warningElement = this.element.querySelector('.planner-custom-time-warning');
        if (!warningElement) return;
        
        // 检查是否有定制时间的课程
        const hasCustomTime = programs.some(program => {
            return program.schedule === 'custom' || program.schedule === '定制时间';
        });
        
        if (hasCustomTime) {
            warningElement.style.display = 'flex';
            this.adjustPagePadding(true);
        } else {
            warningElement.style.display = 'none';
            this.adjustPagePadding(false);
        }
    }
    
    adjustPagePadding(hasWarning) {
        const ccaContent = document.querySelector('.cca-content');
        if (!ccaContent) return;
        
        // 根据屏幕尺寸和警告状态调整底部内边距
        const isMobile = window.innerWidth <= 768;
        const isSmallScreen = window.innerWidth <= 480;
        
        if (hasWarning) {
            if (isSmallScreen) {
                ccaContent.style.paddingBottom = '550px';
            } else if (isMobile) {
                ccaContent.style.paddingBottom = '600px';
            } else {
                ccaContent.style.paddingBottom = '650px';
            }
        } else {
            if (isSmallScreen) {
                ccaContent.style.paddingBottom = '400px';
            } else if (isMobile) {
                ccaContent.style.paddingBottom = '450px';
            } else {
                ccaContent.style.paddingBottom = '500px';
            }
        }
    }
    
    show() {
        this.element.style.display = 'flex';
    }
    
    hide() {
        this.element.style.display = 'none';
    }
    
    updatePageLanguage() {
        // 更新标题
        const titleSpan = this.element.querySelector('.planner-title span[data-i18n]');
        if (titleSpan) {
            titleSpan.textContent = i18n.t('floatingPlannerTitle');
        }
        
        // 更新提醒文字
        const reminderSpan = this.element.querySelector('.planner-mini-reminder span[data-i18n]');
        if (reminderSpan) {
            reminderSpan.textContent = i18n.t('selectForEachDay');
        }
        
        // 更新定制时间警告
        const warningTitle = this.element.querySelector('.planner-custom-time-warning .warning-title');
        if (warningTitle) {
            warningTitle.textContent = i18n.t('customTimeWarningTitle');
        }
        const warningText = this.element.querySelector('.planner-custom-time-warning .warning-text');
        if (warningText) {
            warningText.textContent = i18n.t('customTimeWarningText');
        }
        
        // 更新空状态
        const emptyState = this.element.querySelector('.planner-empty-state p');
        if (emptyState) {
            emptyState.innerHTML = i18n.t('floatingPlannerEmpty');
        }
        
        // 更新进度文本
        const progressText = this.element.querySelector('.progress-text');
        if (progressText) {
            const currentStep = parseInt(progressText.dataset.currentStep) || 0;
            const totalSteps = parseInt(progressText.dataset.totalSteps) || 5;
            progressText.textContent = i18n.t('floatingPlannerProgress', {current: currentStep, total: totalSteps});
        }
        
        // 重新生成所有内容
        if (typeof studentData !== 'undefined' && studentData.grade) {
            this.updateStudentInfo(studentData.grade);
        }
        
        if (typeof selectedElitePrograms !== 'undefined') {
            this.updateElitePrograms(selectedElitePrograms);
        }
        
        this.updateWeekSchedule();
    }
}

// 全局实例
let floatingPlanner = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    floatingPlanner = new FloatingPlanner();
    
    // 监听语言切换事件
    document.addEventListener('languageChanged', function(e) {
        if (floatingPlanner) {
            // 重新渲染所有内容
            floatingPlanner.updatePageLanguage();
        }
    });
    
    // 页面加载时立即根据当前语言更新
    if (floatingPlanner && typeof i18n !== 'undefined') {
        setTimeout(() => {
            floatingPlanner.updatePageLanguage();
        }, 100);
    }
});
