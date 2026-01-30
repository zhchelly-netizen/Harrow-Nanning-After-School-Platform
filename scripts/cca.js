// ===================================
// CCA 课程规划页面 JavaScript
// ===================================

let currentStep = 1;
let studentData = {};
let selectedElitePrograms = [];
let selectedCCAs = {};

// 精英项目时间表配置
const ELITE_SCHEDULES = {
    // 精英体育
    'football-primary': { days: ['tue', 'thu'], time: '16:00-17:00', blocksWeekdays: true },
    'football-secondary': { days: ['mon', 'tue', 'thu'], time: '16:00-18:00', blocksWeekdays: true },
    'basketball-primary': { days: ['wed', 'fri'], time: '16:00-17:30', blocksWeekdays: true },
    'basketball-secondary': { days: ['tue', 'thu'], time: '16:00-17:30', blocksWeekdays: true },
    'swimming-team': { days: ['mon', 'wed', 'thu', 'sat', 'sun'], time: '16:00-18:00', blocksWeekdays: true },
    'swimming-reserve': { days: ['mon', 'wed', 'sat', 'sun'], time: '16:00-17:30', blocksWeekdays: true },
    'badminton': { days: ['tue', 'fri', 'sun'], time: '16:00-17:30', blocksWeekdays: true },
    'golf': { days: [], time: '定制时间', blocksWeekdays: false },
    'equestrian': { days: [], time: '定制时间', blocksWeekdays: false },
    'tennis': { days: [], time: '定制时间', blocksWeekdays: false },
    'skating': { days: [], time: '定制时间', blocksWeekdays: false },
    
    // 音乐学院
    'piano': { days: [], time: '定制时间', blocksWeekdays: false },
    'violin': { days: [], time: '定制时间', blocksWeekdays: false },
    'guitar': { days: [], time: '定制时间', blocksWeekdays: false },
    'drums': { days: [], time: '定制时间', blocksWeekdays: false },
    'vocal': { days: [], time: '定制时间', blocksWeekdays: false },
    'other-instrument': { days: [], time: '定制时间', blocksWeekdays: false },
    'band': { days: ['mon'], time: '16:00-17:00', blocksWeekdays: true },
    
    // 学术竞赛
    'debate': { days: ['wed'], time: '16:00-17:00', blocksWeekdays: true },
    
    // 宏博中心
    'english-foundation': { days: [], time: '定制时间', blocksWeekdays: false },
    'ielts-advanced': { days: ['tue', 'thu'], time: '定制时间', blocksWeekdays: false },
    
    // 数学支持
    'math-support': { days: [], time: '16:00-18:00 & 18:00-20:00', blocksWeekdays: true }
};

// 监听语言切换事件
document.addEventListener('languageChanged', function(e) {
    console.log('Language changed to:', e.detail.lang);
    
    // 更新精英项目文本
    updateEliteProgramsLanguage();
    
    // 重新渲染当前步骤的内容
    if (currentStep === 3) {
        // 重新加载CCA课程列表
        loadCCACourses();
    } else if (currentStep === 4) {
        // 重新生成摘要
        generateSummary();
        generateSchedulePreview();
    } else if (currentStep === 5) {
        // 重新生成报名指引
        generateRegistrationGuidePreview();
    }
    
    // 更新冲突警告
    if (document.querySelector('.conflict-warning')) {
        updateConflictWarnings();
    }
});

// 精英项目翻译映射
const ELITE_PROGRAM_TRANSLATIONS = {
    'zh': {
        'football-primary': '⚽ 足球（小学）',
        'football-secondary': '⚽ 足球（中学）',
        'basketball-primary': '🏀 篮球（小学）',
        'basketball-secondary': '🏀 篮球（中学）',
        'swimming-team': '🏊 游泳一队',
        'swimming-reserve': '🏊 游泳预备队',
        'badminton': '🏸 羽毛球队',
        'golf': '⛳ 高尔夫',
        'equestrian': '🐴 马术',
        'tennis': '🎾 网球',
        'skating': '⛸️ 花样滑冰',
        'piano': '🎹 钢琴',
        'violin': '🎻 小提琴',
        'guitar': '🎸 吉他',
        'drums': '🥁 架子鼓',
        'vocal': '🎤 声乐',
        'other-instrument': '🎼 其他乐器',
        'band': '🎸 无主乐队',
        'debate': '🗣️ "以言论道"思辨社',
        'english-foundation': '📖 英语基础',
        'ielts-advanced': '📝 雅思进阶',
        'math-support': '🔢 英文数学支持'
    },
    'en': {
        'football-primary': '⚽ Football (Primary)',
        'football-secondary': '⚽ Football (Secondary)',
        'basketball-primary': '🏀 Basketball (Primary)',
        'basketball-secondary': '🏀 Basketball (Secondary)',
        'swimming-team': '🏊 Swimming Senior',
        'swimming-reserve': '🏊 Swimming Reserve',
        'badminton': '🏸 Badminton Team',
        'golf': '⛳ Golf',
        'equestrian': '🐴 Equestrian',
        'tennis': '🎾 Tennis',
        'skating': '⛸️ Figure Skating',
        'piano': '🎹 Piano',
        'violin': '🎻 Violin',
        'guitar': '🎸 Guitar',
        'drums': '🥁 Drums',
        'vocal': '🎤 Vocal',
        'other-instrument': '🎼 Other Instruments',
        'band': '🎸 Free Soul Band',
        'debate': '🗣️ Chinese Debate Team',
        'english-foundation': '📖 English Foundation',
        'ielts-advanced': '📝 IELTS Advanced',
        'math-support': '🔢 English Maths Support'
    }
};

// 更新精英项目语言
function updateEliteProgramsLanguage() {
    const lang = i18n.currentLang;
    
    // 日期和备注翻译映射
    const translations = {
        'zh': {
            '周一': '周一',
            '周二': '周二',
            '周三': '周三',
            '周四': '周四',
            '周五': '周五',
            '周六': '周六',
            '周日': '周日',
            '定制时间': '定制时间',
            '全年级': '全年级',
            '一对一专业培训': '一对一专业培训',
            '需选拔/试课': '需选拔/试课',
            '需选拔': '需选拔',
            '预约制': '预约制',
            '请在备注中说明': '请在备注中说明'
        },
        'en': {
            '周一': 'Mon',
            '周二': 'Tue',
            '周三': 'Wed',
            '周四': 'Thu',
            '周五': 'Fri',
            '周六': 'Sat',
            '周日': 'Sun',
            '定制时间': 'Custom Time',
            '全年级': 'All Grades',
            '一对一专业培训': '1v1 Training',
            '需选拔/试课': 'Audition Required',
            '需选拔': 'Audition Required',
            '预约制': 'By Appointment',
            '请在备注中说明': 'Please specify in remarks'
        }
    };
    
    // 更新所有精英项目的 checkbox 标签
    document.querySelectorAll('input[name="elite-sports"], input[name="music"], input[name="academic"], input[name="hub"], input[name="math"]').forEach(checkbox => {
        const value = checkbox.value;
        const label = checkbox.closest('.checkbox-card');
        if (label) {
            const strong = label.querySelector('strong');
            const small = label.querySelector('small');
            
            // 更新项目名称
            if (strong && ELITE_PROGRAM_TRANSLATIONS[lang][value]) {
                strong.textContent = ELITE_PROGRAM_TRANSLATIONS[lang][value];
            }
            
            // 更新日期和年级描述
            if (small) {
                const originalText = small.textContent;
                let translatedText = originalText;
                
                // 翻译所有中文日期和关键词
                Object.keys(translations['zh']).forEach(zhWord => {
                    const enWord = translations['en'][zhWord];
                    if (lang === 'en') {
                        translatedText = translatedText.replace(new RegExp(zhWord, 'g'), enWord);
                    } else {
                        translatedText = translatedText.replace(new RegExp(enWord, 'g'), zhWord);
                    }
                });
                
                // 特殊处理：替换年级范围
                if (lang === 'en') {
                    translatedText = translatedText.replace(/G(\d+)\+/g, 'G$1+');
                    translatedText = translatedText.replace(/G(\d+)-G(\d+)/g, 'G$1-G$2');
                }
                
                small.textContent = translatedText;
            }
        }
    });
}

// 步骤导航
function nextStep(step) {
    // 验证当前步骤
    if (!validateStep(currentStep)) {
        return;
    }
    
    // 保存当前步骤数据
    saveStepData(currentStep);
    
    // 更新步骤
    currentStep = step;
    
    // 保存状态到 localStorage
    saveCurrentState();
    
    updateStepDisplay();
    
    // 如果进入CCA选择步骤，加载课程
    if (step === 3) {
        console.log('进入步骤3 - 加载CCA课程');
        setTimeout(() => {
            loadCCACourses();
        }, 100);
    }
    
    // 如果进入确认步骤，生成摘要
    if (step === 4) {
        console.log('进入步骤4 - 生成摘要');
        setTimeout(() => {
            generateSummary();
            generateSchedulePreview();
        }, 100);
    }
    
    // 如果进入报名指引步骤，生成报名指引预览
    if (step === 5) {
        console.log('进入步骤5 - 生成报名指引');
        setTimeout(() => {
            generateRegistrationGuidePreview();
        }, 100);
    }
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // 如果从步骤2回退到步骤1，提示用户并清除缓存
    if (currentStep === 2 && step === 1) {
        const confirmReset = confirm(i18n.t('messages.confirmResetPlanning') || '返回第一步将清除所有已选择的内容，确定要继续吗？');
        if (!confirmReset) {
            return; // 用户取消，不执行回退
        }
        
        // 清除所有缓存和数据
        localStorage.removeItem('ccaPlanningState');
        studentData = {};
        selectedElitePrograms = [];
        selectedCCAs = {};
        console.log('已清除所有规划数据');
    }
    
    currentStep = step;
    
    // 保存状态到 localStorage
    saveCurrentState();
    
    updateStepDisplay();
    
    // 如果返回到步骤1，清空表单
    if (step === 1) {
        const gradeSelect = document.getElementById('student-grade');
        if (gradeSelect) {
            gradeSelect.value = '';
        }
    }
    
    // 如果返回到步骤2（精英项目），恢复精英项目选择
    if (step === 2) {
        console.log('返回步骤2 - 恢复精英项目选择');
        setTimeout(() => {
            selectedElitePrograms.forEach(program => {
                const checkbox = document.querySelector(`input[value="${program.value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }, 100);
    }
    
    // 如果返回到步骤3（CCA选择），重新加载课程以重新计算冲突
    if (step === 3) {
        console.log('返回步骤3 - 重新加载CCA课程');
        // 保存步骤2的数据以确保精英项目是最新的
        saveStepData(2);
        // 重新加载CCA课程（会重新计算被占用的日期）
        setTimeout(() => {
            loadCCACourses();
        }, 100);
        // 更新浮动规划框
        if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
            floatingPlanner.updateElitePrograms(selectedElitePrograms);
        }
    }
    
    // 如果返回到步骤4（确认），重新生成摘要
    if (step === 4) {
        console.log('返回步骤4 - 重新生成摘要');
        console.log('返回步骤4前，selectedElitePrograms:', selectedElitePrograms);
        setTimeout(() => {
            generateSummary();
            generateSchedulePreview();
        }, 100);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepDisplay() {
    console.log('updateStepDisplay 被调用，currentStep:', currentStep);
    
    // 更新进度指示器
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // 更新内容区域
    document.querySelectorAll('.step-section').forEach((section, index) => {
        const stepNumber = index + 1;
        if (stepNumber === currentStep) {
            section.classList.add('active');
            console.log('激活步骤', stepNumber, '的内容区域');
        } else {
            section.classList.remove('active');
        }
    });
    
    // 同步浮动规划窗口的步骤进度
    if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
        floatingPlanner.updateProgress(currentStep);
    }
}

// 验证步骤
function validateStep(step) {
    if (step === 1) {
        const grade = document.getElementById('student-grade').value;
        
        if (!grade) {
            showErrorMessage(i18n.t('messages.selectGrade'));
            return false;
        }
    }
    
    if (step === 3) {
        // 验证是否所有工作日都已选择
        const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const unselectedDays = requiredDays.filter(day => !selectedCCAs[day]);
        
        if (unselectedDays.length > 0) {
            showErrorMessage(i18n.t('messages.selectAllDays'));
            return false;
        }
    }
    
    return true;
}

// 保存步骤数据
function saveStepData(step) {
    if (step === 1) {
        studentData = {
            grade: document.getElementById('student-grade').value
        };
    }
    
    if (step === 2) {
        selectedElitePrograms = [];
        
        // 收集所有选中的精英项目
        document.querySelectorAll('input[name="elite-sports"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'sports',
                value: input.value,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="music"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'music',
                value: input.value,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="academic"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'academic',
                value: input.value,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="hub"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'hub',
                value: input.value,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="math"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'math',
                value: input.value,
                schedule: input.dataset.schedule
            });
        });
        
        console.log('saveStepData(2) 完成，selectedElitePrograms:', selectedElitePrograms);
    }
}

// 加载CCA课程（从飞书多维表格获取，这里使用配置文件数据）
function loadCCACourses() {
    // 检查 CCA_COURSES 是否已加载
    if (typeof CCA_COURSES === 'undefined') {
        console.error('CCA_COURSES is not defined! Please check if cca-data.js is loaded correctly.');
        // 显示错误信息
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
            const container = document.getElementById(`${day}-slots`);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 1rem; background: #fef2f2; border-radius: 8px; text-align: center; color: #dc2626;">
                        <p style="margin: 0; font-weight: 600;">⚠️ 数据加载失败</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">请刷新页面重试</p>
                    </div>
                `;
            }
        });
        return;
    }
    
    console.log('CCA_COURSES loaded:', Object.keys(CCA_COURSES));
    
    // 使用配置文件中的数据
    const mockCourses = CCA_COURSES;
    
    const studentGrade = studentData.grade;
    
    if (!studentGrade) {
        console.error('Student grade is not set!');
        return;
    }
    
    console.log('Loading courses for grade:', studentGrade);
    
    const blockedDays = getBlockedDays();
    
    // 渲染课程
    Object.keys(mockCourses).forEach(day => {
        const container = document.getElementById(`${day}-slots`);
        if (!container) return;
        
        container.innerHTML = '';
        
        // 检查该天是否被精英项目占用
        const isDayBlocked = blockedDays.includes(day);
        
        if (isDayBlocked) {
            container.innerHTML = `
                <div class="blocked-notice" style="padding: 1rem; background: #fef2f2; border-radius: 8px; text-align: center; color: #dc2626;">
                    <p style="margin: 0; font-weight: 600;">⚠️ ${i18n.t('messages.blockedByElite')}</p>
                </div>
            `;
            // 自动标记为已选择（被精英项目占用）
            selectedCCAs[day] = { id: 'blocked', name: i18n.t('general.eliteProgramme'), blocked: true };
            return;
        }
        
        // 添加"不参加"选项
        const optOutSlot = document.createElement('div');
        optOutSlot.className = 'cca-slot opt-out-slot';
        optOutSlot.dataset.courseId = 'opt-out';
        optOutSlot.dataset.day = day;
        
        // 检查是否已选中"不参加"
        if (selectedCCAs[day] && selectedCCAs[day].id === 'opt-out') {
            optOutSlot.classList.add('selected');
        }
        
        optOutSlot.innerHTML = `
            <div class="slot-name">🚫 ${i18n.t('courses.optOut')}</div>
            <div class="slot-teacher" style="font-size: 0.875rem; opacity: 0.7;">${i18n.t('courses.optOutDesc')}</div>
        `;
        optOutSlot.addEventListener('click', function() {
            selectCCA(day, { id: 'opt-out', name: i18n.t('courses.optOut'), isOptOut: true, fee: '¥0' });
        });
        container.appendChild(optOutSlot);
        
        const availableCourses = mockCourses[day].filter(course => 
            course.grades.includes(studentGrade)
        );
        
        if (availableCourses.length === 0) {
            const noCoursesDiv = document.createElement('div');
            noCoursesDiv.className = 'no-courses';
            noCoursesDiv.style.cssText = 'padding: 1rem; text-align: center; color: #9ca3af; margin-top: 0.5rem;';
            noCoursesDiv.innerHTML = `<p style="margin: 0;">${i18n.t('messages.noCoursesAvailable')}</p>`;
            container.appendChild(noCoursesDiv);
            return;
        }
        
        availableCourses.forEach(course => {
            const slot = document.createElement('div');
            slot.className = 'cca-slot';
            slot.dataset.courseId = course.id;
            slot.dataset.day = day;
            
            // 检查是否已选中该课程
            if (selectedCCAs[day] && selectedCCAs[day].id === course.id) {
                slot.classList.add('selected');
            }
            
            // 根据当前语言选择课程名称
            const courseName = i18n.currentLang === 'en' && course.nameEn ? course.nameEn : course.name;
            
            // 添加emoji（如果有）
            const emoji = course.emoji || '';
            const displayName = emoji ? `${emoji} ${courseName}` : courseName;
            
            const inviteBadge = course.inviteOnly ? `<span style="background: #fbbf24; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">${i18n.t('courses.inviteOnly')}</span>` : '';
            const feeBadge = course.fee !== '¥0' ? `<span style="color: #059669; font-size: 0.875rem; font-weight: 600;">${course.fee}</span>` : `<span style="color: #10b981; font-size: 0.875rem; font-weight: 600;">${i18n.t('courses.free')}</span>`;
            
            // 添加知识板块图标
            const categoryIcon = getKnowledgeIcon(course.category);
            const categoryBadge = `<span style="display: inline-flex; align-items: center; gap: 0.25rem; background: rgba(166, 152, 103, 0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; color: #8a7d52; margin-left: 0.5rem;"><span style="font-size: 0.875rem;">${categoryIcon}</span></span>`;
            
            slot.innerHTML = `
                <div class="slot-name">${displayName}${categoryBadge}${inviteBadge}</div>
                <div class="slot-teacher" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="flex: 1;">${course.teacher}</span>
                    <span style="margin-left: 1rem;">${feeBadge}</span>
                </div>
            `;
            
            slot.addEventListener('click', function() {
                // 检查是否已选中该课程（取消选择）
                if (selectedCCAs[day] && selectedCCAs[day].id === course.id) {
                    // 取消选择，不需要弹窗
                    unselectCCA(day);
                } else if (course.inviteOnly) {
                    // 选择单招项目，显示邀请对话框
                    showInviteOnlyDialog(day, course);
                } else {
                    // 选择普通课程
                    selectCCA(day, course);
                }
            });
            
            container.appendChild(slot);
        });
    });
}

// 显示邀请制对话框
function showInviteOnlyDialog(day, course) {
    const dialog = document.createElement('div');
    dialog.className = 'invite-dialog-overlay';
    dialog.innerHTML = `
        <div class="invite-dialog">
            <h3>${i18n.t('messages.inviteOnlyTitle')}</h3>
            <p style="margin: 1rem 0; line-height: 1.6;">
                ${i18n.t('messages.inviteOnlyDesc1')}
            </p>
            <p style="margin: 1rem 0; line-height: 1.6;">
                ${i18n.t('messages.inviteOnlyDesc2')}
            </p>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="secondary-button" onclick="closeInviteDialog()">${i18n.t('buttons.cancel')}</button>
                <button class="primary-button" onclick="acceptInvitation('${day}', '${course.id}')">${i18n.t('buttons.haveInvitation')}</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    
    // 保存课程信息到临时变量
    window.tempInviteCourse = { day, course };
}

// 关闭邀请对话框
function closeInviteDialog() {
    const dialog = document.querySelector('.invite-dialog-overlay');
    if (dialog) {
        dialog.remove();
    }
}

// 接受邀请
function acceptInvitation(day, courseId) {
    const { course } = window.tempInviteCourse;
    selectCCA(day, course);
    closeInviteDialog();
    showSuccessMessage(i18n.t('messages.addedToPlan'));
}

// 获取被精英项目占用的日期
function getBlockedDays() {
    const blocked = [];
    
    selectedElitePrograms.forEach(program => {
        // 检查该项目是否占用CCA时段
        const scheduleInfo = ELITE_SCHEDULES[program.value];
        if (scheduleInfo && scheduleInfo.blocksWeekdays && scheduleInfo.days.length > 0) {
            scheduleInfo.days.forEach(dayShort => {
                // 转换为完整的日期名称
                const dayMapping = {
                    'mon': 'monday',
                    'tue': 'tuesday',
                    'wed': 'wednesday',
                    'thu': 'thursday',
                    'fri': 'friday'
                };
                const fullDay = dayMapping[dayShort];
                if (fullDay && !blocked.includes(fullDay)) {
                    blocked.push(fullDay);
                }
            });
        }
    });
    
    return blocked;
}

// 选择CCA课程
function selectCCA(day, course) {
    // 检查是否点击了已选中的课程（切换取消选择）
    if (selectedCCAs[day] && selectedCCAs[day].id === course.id) {
        // 取消选择
        unselectCCA(day);
        return;
    }
    
    // 检查是否有时间冲突
    const conflict = checkCCAConflict(day, course);
    
    if (conflict) {
        // 显示冲突对话框
        showConflictDialog(day, course, conflict);
        return;
    }
    
    // 没有冲突，直接选择
    confirmSelectCCA(day, course);
}

// 取消选择CCA课程
function unselectCCA(day) {
    // 移除该天的选择
    document.querySelectorAll(`[data-day="${day}"]`).forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 从数据中删除
    delete selectedCCAs[day];
    
    // 保存状态到 sessionStorage
    saveCurrentState();
    
    // 更新浮动规划框
    if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
        floatingPlanner.updateCCASelection(day, null);
    }
    
    showSuccessMessage(i18n.t('messages.selectionCancelled'));
}

// 确认选择CCA课程（内部函数）
function confirmSelectCCA(day, course, conflictOverride = null) {
    // 取消该天的其他选择
    document.querySelectorAll(`[data-day="${day}"]`).forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 选中当前课程 - 需要同时匹配 day 和 course-id
    const slot = document.querySelector(`[data-day="${day}"][data-course-id="${course.id}"]`);
    if (slot) {
        slot.classList.add('selected');
    }
    
    // 保存选择（包含冲突覆盖信息）
    selectedCCAs[day] = {
        ...course,
        conflictOverride: conflictOverride
    };
    
    // 保存状态到 sessionStorage
    saveCurrentState();
    
    // 更新浮动规划框
    if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
        floatingPlanner.updateCCASelection(day, course);
    }
}

// 检查CCA课程时间冲突
function checkCCAConflict(day, course) {
    // 如果是"不参加"，不检查冲突
    if (course.isOptOut) return null;
    
    // 转换日期格式
    const dayShortMap = {
        'monday': 'mon',
        'tuesday': 'tue',
        'wednesday': 'wed',
        'thursday': 'thu',
        'friday': 'fri'
    };
    const dayShort = dayShortMap[day];
    
    // 检查是否与精英项目冲突
    for (const program of selectedElitePrograms) {
        const scheduleInfo = ELITE_SCHEDULES[program.value];
        if (scheduleInfo && scheduleInfo.blocksWeekdays && scheduleInfo.days.includes(dayShort)) {
            return {
                type: 'elite',
                program: program.label,
                time: scheduleInfo.time
            };
        }
    }
    
    return null;
}

// 显示冲突对话框
function showConflictDialog(day, course, conflict) {
    const dayNames = {
        'monday': i18n.t('days.monday'),
        'tuesday': i18n.t('days.tuesday'),
        'wednesday': i18n.t('days.wednesday'),
        'thursday': i18n.t('days.thursday'),
        'friday': i18n.t('days.friday')
    };
    
    const dialog = document.createElement('div');
    dialog.className = 'conflict-dialog-overlay';
    dialog.innerHTML = `
        <div class="conflict-dialog">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">⚠️</div>
                <h3 style="color: #dc2626; margin: 0 0 0.5rem 0; font-size: 1.5rem;">${i18n.t('messages.conflictWarning')}</h3>
                <p style="color: #6b7280; margin: 0; font-size: 0.875rem;">${i18n.t('messages.conflictWarningEn')}</p>
            </div>
            
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="color: #991b1b; margin: 0 0 0.75rem 0; font-weight: 600; font-size: 1rem;">
                    ${i18n.t('messages.conflictDesc')}
                </p>
                <div style="background: white; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem;">
                    <p style="margin: 0; color: #374151; font-size: 0.875rem;">
                        <strong>${dayNames[day]}</strong> 16:00-17:00<br>
                        <span style="color: #dc2626;">📚 ${course.name}</span>
                    </p>
                </div>
                <div style="background: white; padding: 0.75rem; border-radius: 6px;">
                    <p style="margin: 0; color: #374151; font-size: 0.875rem;">
                        <strong>${dayNames[day]}</strong> ${conflict.time}<br>
                        <span style="color: #8b2635;">🏆 ${conflict.program}</span>
                    </p>
                </div>
            </div>
            
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="color: #92400e; margin: 0; font-size: 0.875rem; line-height: 1.6;">
                    <strong>💡 ${i18n.t('messages.tip')}：</strong>${i18n.t('messages.conflictTip')}
                </p>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">
                    ${i18n.t('messages.conflictReasonLabel')}
                </label>
                <textarea id="conflict-reason" 
                          placeholder="${i18n.t('messages.conflictReasonPlaceholder')}"
                          style="width: 100%; min-height: 80px; padding: 0.75rem; border: 2px solid #d1d5db; border-radius: 8px; font-size: 0.875rem; font-family: inherit; resize: vertical;"
                          maxlength="200"></textarea>
                <div style="text-align: right; margin-top: 0.25rem;">
                    <span id="char-count" style="font-size: 0.75rem; color: #9ca3af;">0/200</span>
                </div>
            </div>
            
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="color: #075985; margin: 0; font-size: 0.875rem; line-height: 1.6;">
                    <strong>📋 ${i18n.t('messages.importantReminder')}：</strong>${i18n.t('messages.conflictReminder')}
                </p>
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <button class="secondary-button" onclick="closeConflictDialog()" style="flex: 1; padding: 0.875rem;">
                    <span>${i18n.t('buttons.cancel')}</span>
                </button>
                <button class="primary-button" onclick="forceAddCCA()" style="flex: 1; padding: 0.875rem; background: #dc2626;">
                    <span>${i18n.t('buttons.forceAdd')}</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 保存临时数据
    window.tempConflictData = { day, course, conflict };
    
    // 绑定字符计数
    const textarea = dialog.querySelector('#conflict-reason');
    const charCount = dialog.querySelector('#char-count');
    textarea.addEventListener('input', function() {
        charCount.textContent = `${this.value.length}/200`;
    });
}

// 关闭冲突对话框
function closeConflictDialog() {
    const dialog = document.querySelector('.conflict-dialog-overlay');
    if (dialog) {
        dialog.remove();
    }
    window.tempConflictData = null;
}

// 强制添加CCA课程
function forceAddCCA() {
    const reason = document.getElementById('conflict-reason').value.trim();
    
    if (!reason) {
        alert(i18n.t('messages.pleaseProvideReason'));
        return;
    }
    
    const { day, course, conflict } = window.tempConflictData;
    
    // 添加冲突覆盖信息
    const conflictOverride = {
        conflictWith: conflict.program,
        conflictTime: conflict.time,
        reason: reason,
        timestamp: new Date().toISOString()
    };
    
    // 确认选择
    confirmSelectCCA(day, course, conflictOverride);
    
    // 关闭对话框
    closeConflictDialog();
    
    // 显示成功消息
    showSuccessMessage(i18n.t('messages.courseAddedConfirm'));
}

// 生成摘要
function generateSummary() {
    const summaryContainer = document.getElementById('selection-summary');
    
    let summaryHTML = `
        <h3>${i18n.t('general.studentInfo')}</h3>
        <div style="margin-bottom: 2rem;">
            <p><strong>${i18n.t('general.grade')}：</strong>${studentData.grade}</p>
        </div>
    `;
    
    // 统计课后安排 - 改为数组以支持同一天多个活动
    const weekSchedule = {};
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayShortMap = {
        'monday': 'mon',
        'tuesday': 'tue',
        'wednesday': 'wed',
        'thursday': 'thu',
        'friday': 'fri'
    };
    
    // 初始化每天为空数组
    dayKeys.forEach(day => {
        weekSchedule[day] = [];
    });
    
    // 收集精英项目
    selectedElitePrograms.forEach(program => {
        if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
            const days = program.schedule.split(',').map(d => d.trim());
            days.forEach(dayShort => {
                const fullDay = Object.keys(dayShortMap).find(key => dayShortMap[key] === dayShort);
                if (fullDay) {
                    // 根据当前语言获取精英项目名称
                    const programName = ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value] || program.label;
                    weekSchedule[fullDay].push({
                        type: 'elite',
                        name: programName,
                        fee: i18n.t('general.customPackage')
                    });
                }
            });
        }
    });
    
    // 收集CCA课程
    dayKeys.forEach(day => {
        if (selectedCCAs[day]) {
            if (selectedCCAs[day].isOptOut) {
                weekSchedule[day].push({
                    type: 'optout',
                    name: i18n.t('courses.optOut'),
                    fee: '¥0'
                });
            } else if (!selectedCCAs[day].blocked) {
                // 根据当前语言获取CCA课程名称
                const courseName = i18n.currentLang === 'en' && selectedCCAs[day].nameEn 
                    ? selectedCCAs[day].nameEn 
                    : selectedCCAs[day].name;
                weekSchedule[day].push({
                    type: 'cca',
                    name: courseName,
                    fee: selectedCCAs[day].fee || '¥0',
                    hasConflictOverride: !!selectedCCAs[day].conflictOverride
                });
            }
        }
    });
    
    // 显示课后时间安排
    const hasAnyActivities = dayKeys.some(day => weekSchedule[day].length > 0);
    
    if (hasAnyActivities || selectedElitePrograms.length > 0) {
        summaryHTML += `
            <h3>${i18n.t('general.afterSchoolSchedule')}</h3>
            <div>
                <ul style="list-style: none; padding: 0;">
        `;
        
        const dayNames = {
            monday: i18n.t('days.monday'),
            tuesday: i18n.t('days.tuesday'),
            wednesday: i18n.t('days.wednesday'),
            thursday: i18n.t('days.thursday'),
            friday: i18n.t('days.friday')
        };
        
        dayKeys.forEach(day => {
            if (weekSchedule[day].length > 0) {
                const hasConflict = weekSchedule[day].filter(a => a.type === 'elite' || a.type === 'cca').length > 1;
                const conflictBadge = hasConflict ? `<span style="background: #dc2626; color: white; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; margin-left: 0.5rem;">⚠️ ${i18n.t('general.conflict')}</span>` : '';
                
                summaryHTML += `<li style="padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0;">
                    <strong>${dayNames[day]}${conflictBadge}</strong>
                    <ul style="list-style: none; padding-left: 1.5rem; margin-top: 0.5rem;">`;
                
                weekSchedule[day].forEach(activity => {
                    let icon = '📚';
                    if (activity.type === 'elite') icon = '🏆';
                    if (activity.type === 'optout') icon = '🚫';
                    
                    const conflictMark = activity.hasConflictOverride ? `<span style="color: #dc2626; font-size: 0.75rem; margin-left: 0.5rem;">(${i18n.t('general.forceAdded')})</span>` : '';
                    
                    summaryHTML += `<li style="padding: 0.25rem 0;">${icon} ${activity.name}${conflictMark}</li>`;
                });
                
                summaryHTML += `</ul></li>`;
            }
        });
        
        summaryHTML += `
                </ul>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = summaryHTML;
    
    // 生成价格摘要
    generatePriceSummary(weekSchedule);
    
    // 生成可视化课程表
    generateSchedulePreview();
}

// 生成价格摘要
function generatePriceSummary(weekSchedule) {
    const priceContainer = document.getElementById('price-summary');
    if (!priceContainer) return;
    
    const priceDetails = priceContainer.querySelector('.price-details');
    let priceHTML = '';
    let totalPrice = 0;
    let hasCustomPackage = false;
    const CCA_PRICE_CAP = 3000; // CCA费用封顶金额
    
    // 计算精英项目费用
    const elitePrograms = selectedElitePrograms.filter(p => p.schedule !== 'custom' || selectedElitePrograms.length > 0);
    if (elitePrograms.length > 0) {
        priceHTML += `
            <div class="price-section">
                <h4>${i18n.t('general.elitePrograms')}</h4>
                <ul class="price-list">
        `;
        
        elitePrograms.forEach(program => {
            // 根据当前语言获取精英项目名称
            const programName = ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value] || program.label;
            priceHTML += `
                <li>
                    <span>${programName}</span>
                    <span class="price-tag custom">${i18n.t('general.customPackage')}</span>
                </li>
            `;
            hasCustomPackage = true;
        });
        
        priceHTML += `
                </ul>
            </div>
        `;
    }
    
    // 计算CCA费用 - 从 weekSchedule 数组中提取
    const ccaCourses = [];
    Object.values(weekSchedule).forEach(dayActivities => {
        if (Array.isArray(dayActivities)) {
            dayActivities.forEach(activity => {
                if (activity.type === 'cca') {
                    ccaCourses.push(activity);
                }
            });
        }
    });
    
    if (ccaCourses.length > 0) {
        priceHTML += `
            <div class="price-section">
                <h4>${i18n.t('general.ccaCourses')}</h4>
                <ul class="price-list">
        `;
        
        ccaCourses.forEach(course => {
            const price = parseFee(course.fee);
            if (price > 0) {
                totalPrice += price;
            }
            
            const conflictMark = course.hasConflictOverride ? `<span style="color: #dc2626; font-size: 0.75rem; margin-left: 0.5rem;">(${i18n.t('general.conflict')})</span>` : '';
            
            priceHTML += `
                <li>
                    <span>${course.name}${conflictMark}</span>
                    <span class="price-tag ${price === 0 ? 'free' : ''}">${course.fee}</span>
                </li>
            `;
        });
        
        priceHTML += `
                </ul>
            </div>
        `;
    }
    
    // 应用封顶规则
    const originalTotal = totalPrice;
    const finalTotal = totalPrice > CCA_PRICE_CAP ? CCA_PRICE_CAP : totalPrice;
    const hasCap = totalPrice > CCA_PRICE_CAP;
    
    // 总计
    priceHTML += `
        <div class="price-total">
            ${hasCap ? `
                <div class="total-row" style="text-decoration: line-through; opacity: 0.6; font-size: 0.9rem;">
                    <span>${i18n.t('general.ccaOriginalPrice')}：</span>
                    <span>¥${originalTotal.toLocaleString('zh-CN')}</span>
                </div>
            ` : ''}
            <div class="total-row">
                <span>${i18n.t(hasCap ? 'general.ccaFinalPrice' : 'general.ccaSubtotal')}：</span>
                <span class="total-amount">¥${finalTotal.toLocaleString('zh-CN')}</span>
            </div>
            ${hasCap ? `
                <div class="custom-note" style="background: #d1fae5; border-left: 4px solid #10b981;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: #059669;">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span style="color: #065f46;">${i18n.t('messages.capApplied')}</span>
                </div>
            ` : totalPrice > 0 ? `
                <div class="custom-note" style="background: #e0f2fe; border-left: 4px solid #0284c7;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: #0369a1;">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span style="color: #075985;">${i18n.t('messages.capNotice')}</span>
                </div>
            ` : ''}
            ${hasCustomPackage ? `
                <div class="custom-note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span>${i18n.t('messages.customPackageNote')}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    priceDetails.innerHTML = priceHTML;
}

// 解析费用
function parseFee(feeString) {
    if (!feeString || feeString === '¥0' || feeString === i18n.t('general.customPackage')) {
        return 0;
    }
    
    // 匹配所有数字，包括千位分隔符
    const match = feeString.match(/¥([\d,]+)/);
    if (match) {
        // 移除逗号后转换为数字
        return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
}

// 清除保存的规划状态
function clearPlanningState() {
    localStorage.removeItem('ccaPlanningState');
    console.log('规划状态已清除');
}

// 生成课程表图片
function generateScheduleImage() {
    // 保存选择数据到 localStorage
    const planData = {
        student: studentData,
        elitePrograms: selectedElitePrograms,
        ccas: selectedCCAs,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('ccaPlanData', JSON.stringify(planData));
    
    const canvas = document.getElementById('schedule-canvas');
    const ctx = canvas.getContext('2d');
    
    // 收集待办事项
    const todos = [];
    const hasSports = selectedElitePrograms.some(p => p.category === 'sports');
    const hasMusic = selectedElitePrograms.some(p => p.category === 'music');
    const hasDebate = selectedElitePrograms.some(p => p.value === 'debate');
    const hasOtherAcademic = selectedElitePrograms.some(p => p.category === 'academic' && p.value !== 'debate');
    const hasHub = selectedElitePrograms.some(p => p.value === 'english-foundation' || p.value === 'ielts-advanced');
    const hasMathSupport = selectedElitePrograms.some(p => p.value === 'math-support');
    const hasCCA = Object.values(selectedCCAs).some(course => course && !course.blocked && !course.isOptOut);
    
    if (hasSports) todos.push('填写精英体育报名表');
    if (hasMusic) todos.push('填写音乐学院报名表');
    if (hasDebate) todos.push('企业微信联系辩论队教练组');
    if (hasOtherAcademic) todos.push('联系拓展部负责老师');
    if (hasHub) todos.push('企业微信联系龚安琪老师');
    if (hasMathSupport) todos.push('企业微信联系唐齐昌老师');
    if (hasCCA) todos.push('登录SchoolsBuddy完成报名');
    
    // 根据待办事项数量调整canvas高度
    const todoHeight = todos.length > 0 ? 120 + (todos.length * 40) : 0;
    
    // 设置画布尺寸 - 适合打印和查看
    canvas.width = 1600;
    canvas.height = 2000 + todoHeight;
    
    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a2332');
    gradient.addColorStop(1, '#8b2635');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加装饰图案
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 80, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // 标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px SimHei, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('南宁哈罗礼德学校', canvas.width / 2, 70);
    
    ctx.font = '30px Arial';
    ctx.fillText('Harrow LiDe School Nanning', canvas.width / 2, 115);
    
    ctx.font = 'bold 44px SimHei, Arial';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('我的课后课程表', canvas.width / 2, 175);
    
    // 年级信息
    ctx.font = '28px SimHei, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`年级：${studentData.grade}`, canvas.width / 2, 215);
    
    // 白色背景区域
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.roundRect(50, 250, canvas.width - 100, canvas.height - 330, 20);
    ctx.fill();
    
    // 准备课程数据
    const dayNames = ['周一', '周二', '周三', '周四', '周五'];
    const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri'];
    const dayMapping = {
        mon: 'monday',
        tue: 'tuesday',
        wed: 'wednesday',
        thu: 'thursday',
        fri: 'friday'
    };
    
    // 收集每天的课程
    const weekSchedule = [];
    dayKeys.forEach((dayKey, index) => {
        const dayData = {
            name: dayNames[index],
            activities: []
        };
        
        // 收集精英项目
        selectedElitePrograms.forEach(program => {
            if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                const days = program.schedule.split(',').map(d => d.trim());
                if (days.includes(dayKey)) {
                    const scheduleInfo = ELITE_SCHEDULES[program.value];
                    // 根据当前语言获取精英项目名称
                    const programName = ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value] || program.label;
                    dayData.activities.push({
                        type: 'elite',
                        name: programName,
                        time: scheduleInfo ? scheduleInfo.time : '16:00-17:00',
                        fee: '定制课包'
                    });
                }
            }
        });
        
        // 收集CCA课程
        const fullDay = dayMapping[dayKey];
        if (fullDay && selectedCCAs[fullDay]) {
            const cca = selectedCCAs[fullDay];
            if (!cca.blocked) {
                // 根据当前语言获取CCA课程名称
                const courseName = i18n.currentLang === 'en' && cca.nameEn 
                    ? cca.nameEn 
                    : cca.name;
                dayData.activities.push({
                    type: cca.isOptOut ? 'optout' : 'cca',
                    name: courseName,
                    time: '16:00-17:00',
                    fee: cca.fee || '¥0',
                    hasConflictOverride: !!cca.conflictOverride
                });
            }
        }
        
        weekSchedule.push(dayData);
    });
    
    // 绘制课程卡片
    const cardWidth = 280;
    const cardHeight = 320;
    const cardGap = 20;
    const startX = 80;
    let startY = 290;
    
    weekSchedule.forEach((day, index) => {
        const x = startX + (index % 5) * (cardWidth + cardGap);
        const y = startY;
        
        // 检查是否有冲突
        const hasConflict = day.activities.filter(a => a.type === 'elite' || a.type === 'cca').length > 1;
        
        // 卡片背景
        if (day.activities.length > 0) {
            // 有课程 - 彩色卡片，如果有冲突使用红色渐变
            if (hasConflict) {
                const cardGradient = ctx.createLinearGradient(x, y, x, y + cardHeight);
                cardGradient.addColorStop(0, '#fef2f2');
                cardGradient.addColorStop(1, '#fee2e2');
                ctx.fillStyle = cardGradient;
            } else {
                const cardGradient = ctx.createLinearGradient(x, y, x, y + cardHeight);
                cardGradient.addColorStop(0, '#ffffff');
                cardGradient.addColorStop(1, '#f8fafc');
                ctx.fillStyle = cardGradient;
            }
        } else {
            // 休息 - 灰色卡片
            ctx.fillStyle = '#f1f5f9';
        }
        
        ctx.roundRect(x, y, cardWidth, cardHeight, 12);
        ctx.fill();
        
        // 卡片边框
        ctx.strokeStyle = hasConflict ? '#dc2626' : (day.activities.length > 0 ? '#8b2635' : '#cbd5e0');
        ctx.lineWidth = hasConflict ? 4 : 3;
        ctx.stroke();
        
        // 如果有冲突，添加冲突标记
        if (hasConflict) {
            ctx.fillStyle = '#dc2626';
            ctx.roundRect(x + cardWidth - 80, y + 10, 70, 30, 8);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px SimHei, Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️ 冲突', x + cardWidth - 45, y + 30);
        }
        
        // 日期标题背景
        ctx.fillStyle = hasConflict ? '#dc2626' : (day.activities.length > 0 ? '#8b2635' : '#94a3b8');
        ctx.roundRect(x, y, cardWidth, 50, [12, 12, 0, 0]);
        ctx.fill();
        
        // 日期文字
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px SimHei, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(day.name, x + cardWidth / 2, y + 37);
        
        // 课程内容
        if (day.activities.length > 0) {
            let contentY = y + 80;
            
            day.activities.forEach((activity, actIndex) => {
                // 如果有多个活动，添加分隔线
                if (actIndex > 0) {
                    ctx.strokeStyle = '#e5e7eb';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x + 20, contentY - 10);
                    ctx.lineTo(x + cardWidth - 20, contentY - 10);
                    ctx.stroke();
                }
                
                // 图标
                const icon = activity.type === 'elite' ? '🏆' : activity.type === 'optout' ? '🚫' : '📚';
                ctx.font = '32px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(icon, x + cardWidth / 2, contentY);
                contentY += 40;
                
                // 课程名称
                ctx.fillStyle = '#1a2332';
                ctx.font = 'bold 18px SimHei, Arial';
                ctx.textAlign = 'center';
                
                // 处理长文本换行
                const maxWidth = cardWidth - 20;
                const words = activity.name.split('');
                let line = '';
                let lines = [];
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i];
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && i > 0) {
                        lines.push(line);
                        line = words[i];
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                
                // 最多显示2行
                lines.slice(0, 2).forEach((textLine, idx) => {
                    ctx.fillText(textLine, x + cardWidth / 2, contentY + idx * 22);
                });
                contentY += lines.length * 22 + 10;
                
                // 时间
                ctx.fillStyle = '#6b7280';
                ctx.font = '16px Arial';
                ctx.fillText(activity.time, x + cardWidth / 2, contentY);
                contentY += 25;
                
                // 费用
                if (activity.fee && activity.fee !== '¥0') {
                    ctx.fillStyle = activity.fee === '定制课包' ? '#f59e0b' : '#059669';
                    ctx.font = 'bold 18px SimHei, Arial';
                    ctx.fillText(activity.fee, x + cardWidth / 2, contentY);
                    contentY += 25;
                }
                
                // 如果有冲突覆盖标记
                if (activity.hasConflictOverride) {
                    ctx.fillStyle = '#dc2626';
                    ctx.font = 'bold 14px SimHei, Arial';
                    ctx.fillText('(已强制添加)', x + cardWidth / 2, contentY);
                    contentY += 20;
                }
                
                contentY += 10; // 活动之间的间距
            });
        } else {
            // 休息日
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('😴', x + cardWidth / 2, y + 150);
            
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 28px SimHei, Arial';
            ctx.fillText('休息', x + cardWidth / 2, y + 210);
        }
    });
    
    // 价格汇总区域
    startY += cardHeight + 40;
    
    // 计算总价
    let totalCCAPrice = 0;
    const CCA_PRICE_CAP = 3000;
    
    weekSchedule.forEach(day => {
        day.activities.forEach(activity => {
            if (activity.type === 'cca') {
                totalCCAPrice += parseFee(activity.fee);
            }
        });
    });
    
    const finalCCAPrice = totalCCAPrice > CCA_PRICE_CAP ? CCA_PRICE_CAP : totalCCAPrice;
    const hasElite = selectedElitePrograms.length > 0;
    
    // 价格框背景
    ctx.fillStyle = '#fef3c7';
    ctx.roundRect(80, startY, canvas.width - 160, 150, 12);
    ctx.fill();
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 价格标题
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 32px SimHei, Arial';
    ctx.textAlign = 'left';
    ctx.fillText('💰 费用汇总', 110, startY + 45);
    
    // CCA费用
    ctx.fillStyle = '#78350f';
    ctx.font = '24px SimHei, Arial';
    let priceY = startY + 85;
    
    if (totalCCAPrice > 0) {
        if (totalCCAPrice > CCA_PRICE_CAP) {
            ctx.fillText(`CCA课程原价：¥${totalCCAPrice.toLocaleString('zh-CN')}`, 110, priceY);
            priceY += 35;
            ctx.font = 'bold 28px SimHei, Arial';
            ctx.fillStyle = '#059669';
            ctx.fillText(`CCA课程实付：¥${finalCCAPrice.toLocaleString('zh-CN')} (已封顶优惠)`, 110, priceY);
        } else {
            ctx.fillText(`CCA课程费用：¥${finalCCAPrice.toLocaleString('zh-CN')}`, 110, priceY);
        }
    } else {
        ctx.fillText('CCA课程费用：¥0', 110, priceY);
    }
    
    // 精英项目提示
    if (hasElite) {
        priceY += 35;
        ctx.font = '22px SimHei, Arial';
        ctx.fillStyle = '#92400e';
        ctx.fillText('精英项目为定制课包，请咨询负责老师', 110, priceY);
    }
    
    // 待办事项列表
    if (todos.length > 0) {
        startY += 180;
        
        // 待办框背景
        ctx.fillStyle = '#e8f0f7';
        ctx.roundRect(80, startY, canvas.width - 160, todoHeight - 30, 12);
        ctx.fill();
        
        ctx.strokeStyle = '#6b7c93';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 待办标题
        ctx.fillStyle = '#152242';
        ctx.font = 'bold 32px SimHei, Arial';
        ctx.textAlign = 'left';
        ctx.fillText('📋 下一步待办', 110, startY + 45);
        
        // 待办列表
        ctx.fillStyle = '#152242';
        ctx.font = '24px SimHei, Arial';
        let todoY = startY + 85;
        
        todos.forEach((todo, index) => {
            ctx.fillText(`${index + 1}. ${todo}`, 110, todoY);
            todoY += 40;
        });
    }
    
    // 底部信息
    ctx.fillStyle = '#A69867';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Leadership for a Better World', canvas.width / 2, canvas.height - 45);
    
    // 生成时间
    ctx.fillStyle = '#9ca3af';
    ctx.font = '20px Arial';
    const now = new Date();
    ctx.fillText(`生成时间：${now.toLocaleDateString('zh-CN')} ${now.toLocaleTimeString('zh-CN')}`, canvas.width / 2, canvas.height - 15);
    
    // 下载图片
    canvas.toBlob(function(blob) {
        if (!blob) {
            showErrorMessage(i18n.t('messages.imageGenerationFailed'));
            return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `${i18n.t('general.harrowSchedule')}_${studentData.grade}_${timestamp}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 延迟释放URL，确保下载完成
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showSuccessMessage(i18n.t('messages.scheduleGenerated'));
        
        // 跳转到引导页面
        setTimeout(() => {
            window.location.href = 'registration-guide.html';
        }, 1500);
    }, 'image/png', 1.0);
}

// Canvas圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
};

// 生成课程表预览
function generateSchedulePreview() {
    const previewGrid = document.querySelector('.preview-grid');
    
    const dayNames = {
        monday: i18n.t('days.monday'),
        tuesday: i18n.t('days.tuesday'),
        wednesday: i18n.t('days.wednesday'),
        thursday: i18n.t('days.thursday'),
        friday: i18n.t('days.friday')
    };
    
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    let previewHTML = '';
    
    dayKeys.forEach(day => {
        const dayShort = day.substring(0, 3);
        
        // 收集该天的所有活动
        const activities = [];
        let hasConflict = false;
        
        // 收集精英项目
        selectedElitePrograms.forEach(program => {
            if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                const days = program.schedule.split(',').map(d => d.trim());
                if (days.includes(dayShort)) {
                    const scheduleInfo = ELITE_SCHEDULES[program.value];
                    // 根据当前语言获取精英项目名称
                    const programName = ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value] || program.label;
                    activities.push({
                        name: programName,
                        time: scheduleInfo ? scheduleInfo.time : '16:00-17:00',
                        type: 'elite'
                    });
                }
            }
        });
        
        // 收集CCA课程
        if (selectedCCAs[day]) {
            if (selectedCCAs[day].isOptOut) {
                activities.push({
                    name: i18n.t('courses.optOut'),
                    time: '16:00-17:00',
                    type: 'optout'
                });
            } else if (!selectedCCAs[day].blocked) {
                // 根据当前语言获取CCA课程名称
                const courseName = i18n.currentLang === 'en' && selectedCCAs[day].nameEn 
                    ? selectedCCAs[day].nameEn 
                    : selectedCCAs[day].name;
                activities.push({
                    name: courseName,
                    time: '16:00-17:00',
                    type: 'cca',
                    hasConflictOverride: !!selectedCCAs[day].conflictOverride
                });
                
                // 检查是否有冲突覆盖
                if (selectedCCAs[day].conflictOverride) {
                    hasConflict = true;
                }
            }
        }
        
        // 如果同一天有多个活动（精英项目 + CCA），标记为冲突
        if (activities.filter(a => a.type === 'elite' || a.type === 'cca').length > 1) {
            hasConflict = true;
        }
        
        // 生成卡片
        const cardStyle = hasConflict 
            ? 'background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 3px solid #dc2626;' 
            : 'background: white;';
        
        previewHTML += `
            <div style="${cardStyle} padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: relative;">
                ${hasConflict ? `
                    <div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #dc2626; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem;">
                        <span>⚠️</span>
                        <span>${i18n.t('general.conflict')}</span>
                    </div>
                ` : ''}
                <h4 style="color: #1a2332; margin-bottom: 1rem; font-size: 1.125rem; font-weight: 600;">${dayNames[day]}</h4>
                <div style="color: #4a5568; display: flex; flex-direction: column; gap: 0.75rem;">
                    ${activities.length > 0 ? activities.map(activity => `
                        <div style="background: ${activity.type === 'elite' ? 'rgba(166, 152, 103, 0.1)' : activity.type === 'optout' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(139, 38, 53, 0.1)'}; padding: 0.75rem; border-radius: 8px; border-left: 4px solid ${activity.type === 'elite' ? '#A69867' : activity.type === 'optout' ? '#d97706' : '#8b2635'};">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                <span style="font-size: 1.25rem;">${activity.type === 'elite' ? '🏆' : activity.type === 'optout' ? '🚫' : '📚'}</span>
                                <strong style="color: ${activity.type === 'optout' ? '#d97706' : '#1a2332'}; font-size: 0.875rem;">${activity.time}</strong>
                            </div>
                            <div style="font-size: 0.95rem; color: #374151; font-weight: 500;">${activity.name}</div>
                            ${activity.hasConflictOverride ? `
                                <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(220, 38, 38, 0.1); border-radius: 6px; font-size: 0.8rem; color: #991b1b;">
                                    <strong>⚠️ ${i18n.t('general.forceAdded')}</strong>
                                </div>
                            ` : ''}
                        </div>
                    `).join('') : `
                        <div style="color: #cbd5e0; text-align: center; padding: 1rem 0;">
                            ${i18n.t('general.rest')}
                        </div>
                    `}
                </div>
            </div>
        `;
    });
    
    previewGrid.innerHTML = previewHTML;
}

// 提交选择
function submitSelection() {
    // 这里应该将数据提交到飞书多维表格
    const submissionData = {
        student: studentData,
        elitePrograms: selectedElitePrograms,
        ccas: selectedCCAs,
        timestamp: new Date().toISOString()
    };
    
    console.log('提交数据：', submissionData);
    
    // 模拟提交
    showSuccessMessage(i18n.t('messages.submissionSuccess'));
    
    // 3秒后返回主页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// 知识板块图标映射
const KNOWLEDGE_ICONS = {
    'skill': '🎯',           // 技能类
    'competition': '🏆',     // 竞赛类
    'support': '📚',         // 学术支持
    'club': '👥',            // 俱乐部
    'scouting': '🔍',        // 体验类
    'sports': '⚽',          // 体育类
    'arts': '🎨',            // 艺术类
    'music': '🎵',           // 音乐类
    'stem': '🔬',            // STEM类
    'language': '🗣️'        // 语言类
};

// 获取知识板块图标
function getKnowledgeIcon(category) {
    return KNOWLEDGE_ICONS[category] || '📖';
}

// 保存当前状态到 localStorage（改用 localStorage 以支持跨域导航后返回）
function saveCurrentState() {
    const state = {
        currentStep: currentStep,
        studentData: studentData,
        selectedElitePrograms: selectedElitePrograms,
        selectedCCAs: selectedCCAs,
        timestamp: Date.now()
    };
    localStorage.setItem('ccaPlanningState', JSON.stringify(state));
    console.log('状态已保存到 localStorage，currentStep:', currentStep);
}

// 从 localStorage 恢复状态
function restoreState() {
    const savedState = localStorage.getItem('ccaPlanningState');
    console.log('尝试恢复状态，savedState:', savedState);
    
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            console.log('解析的状态:', state);
            
            // 检查状态是否在30分钟内
            const timeDiff = Date.now() - state.timestamp;
            console.log('时间差（毫秒）:', timeDiff, '是否有效:', timeDiff < 30 * 60 * 1000);
            
            if (timeDiff < 30 * 60 * 1000) {
                currentStep = state.currentStep;
                studentData = state.studentData;
                selectedElitePrograms = state.selectedElitePrograms;
                selectedCCAs = state.selectedCCAs;
                
                console.log('状态已恢复，currentStep:', currentStep);
                
                // 恢复UI状态
                restoreUIState();
                return true;
            } else {
                console.log('状态已过期，清除状态');
                localStorage.removeItem('ccaPlanningState');
            }
        } catch (e) {
            console.error('Failed to restore state:', e);
        }
    }
    return false;
}

// 恢复UI状态
function restoreUIState() {
    console.log('恢复UI状态，currentStep:', currentStep);
    console.log('selectedElitePrograms 数量:', selectedElitePrograms.length);
    console.log('selectedElitePrograms 内容:', selectedElitePrograms);
    
    // 恢复年级选择
    if (studentData.grade) {
        const gradeSelect = document.getElementById('student-grade');
        if (gradeSelect) {
            gradeSelect.value = studentData.grade;
            filterEliteProgramsByGrade(studentData.grade);
        }
    }
    
    // 恢复精英项目选择（需要延迟执行，确保DOM已加载）
    setTimeout(() => {
        console.log('恢复精英项目选择，数量:', selectedElitePrograms.length);
        selectedElitePrograms.forEach(program => {
            const checkbox = document.querySelector(`input[value="${program.value}"]`);
            if (checkbox) {
                checkbox.checked = true;
                console.log('已恢复精英项目:', program.value);
            } else {
                console.warn('未找到精英项目checkbox:', program.value);
            }
        });
        
        // 更新浮动规划框
        if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
            floatingPlanner.updateElitePrograms(selectedElitePrograms);
        }
    }, 100);
    
    // 如果在步骤3，恢复CCA选择
    if (currentStep === 3) {
        console.log('恢复步骤3 - 加载CCA课程');
        setTimeout(() => {
            loadCCACourses();
        }, 150);
    }
    
    // 如果在步骤4，生成摘要
    if (currentStep === 4) {
        console.log('恢复步骤4 - 生成摘要');
        setTimeout(() => {
            generateSummary();
            generateSchedulePreview();
        }, 150);
    }
    
    // 如果在步骤5，生成报名指引
    if (currentStep === 5) {
        console.log('恢复步骤5 - 生成报名指引');
        setTimeout(() => {
            console.log('生成报名指引前，selectedElitePrograms:', selectedElitePrograms);
            generateRegistrationGuidePreview();
        }, 150);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载，当前步骤:', currentStep);
    
    // 检查是否是从外部链接返回
    const isReturningFromExternal = localStorage.getItem('ccaNavigatingToExternal') === 'true';
    console.log('是否从外部链接返回:', isReturningFromExternal);
    
    // 尝试恢复状态
    const stateRestored = restoreState();
    
    console.log('状态恢复结果:', stateRestored, '当前步骤:', currentStep);
    
    // 如果不是从外部链接返回，且恢复了状态，清除缓存重新开始
    if (!isReturningFromExternal && stateRestored) {
        console.log('检测到非外部链接返回，清除缓存重新开始');
        localStorage.removeItem('ccaPlanningState');
        currentStep = 1;
        studentData = {};
        selectedElitePrograms = [];
        selectedCCAs = {};
    }
    
    // 清除导航标记（在状态恢复和判断之后）
    localStorage.removeItem('ccaNavigatingToExternal');
    
    // 无论是否恢复状态，都更新显示
    updateStepDisplay();
    
    // 初始化精英项目语言
    updateEliteProgramsLanguage();
    
    // 同步浮动规划窗口的步骤进度
    if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
        floatingPlanner.updateProgress(currentStep);
        if (studentData.grade) {
            floatingPlanner.updateStudentInfo(studentData.grade);
        }
        if (selectedElitePrograms.length > 0) {
            floatingPlanner.updateElitePrograms(selectedElitePrograms);
        }
        // 恢复CCA选择到浮动窗口
        Object.keys(selectedCCAs).forEach(day => {
            if (selectedCCAs[day]) {
                floatingPlanner.updateCCASelection(day, selectedCCAs[day]);
            }
        });
    }
    
    // 监听年级选择变化
    const gradeSelect = document.getElementById('student-grade');
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            const grade = this.value;
            if (grade) {
                filterEliteProgramsByGrade(grade);
                // 更新浮动规划框
                if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
                    floatingPlanner.updateStudentInfo(grade);
                }
                // 保存状态到 sessionStorage
                studentData.grade = grade;
                saveCurrentState();
            }
        });
    }
    
    // 监听精英项目选择变化
    document.querySelectorAll('input[name="elite-sports"], input[name="music"], input[name="academic"], input[name="hub"], input[name="math"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 处理游泳队互斥逻辑
            if (this.checked && (this.value === 'swimming-team' || this.value === 'swimming-reserve')) {
                const otherSwimmingValue = this.value === 'swimming-team' ? 'swimming-reserve' : 'swimming-team';
                const otherSwimmingCheckbox = document.querySelector(`input[value="${otherSwimmingValue}"]`);
                
                if (otherSwimmingCheckbox && otherSwimmingCheckbox.checked) {
                    // 取消另一个游泳队的选择
                    otherSwimmingCheckbox.checked = false;
                    
                    // 显示提示信息
                    showSuccessMessage(i18n.t('messages.swimmingTeamExclusive'));
                }
            }
            
            updateConflictWarnings();
            // 更新浮动规划框
            if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
                saveStepData(2);
                floatingPlanner.updateElitePrograms(selectedElitePrograms);
            }
            
            // 保存状态到 sessionStorage
            saveStepData(2);
            saveCurrentState();
        });
    });
});

// 根据年级过滤精英项目
function filterEliteProgramsByGrade(grade) {
    if (!grade) return;
    
    // 遍历所有精英项目卡片
    document.querySelectorAll('.elite-card').forEach(card => {
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        let hasVisibleOptions = false;
        
        checkboxes.forEach(checkbox => {
            const allowedGrades = checkbox.dataset.grades ? checkbox.dataset.grades.split(',') : [];
            const checkboxCard = checkbox.closest('.checkbox-card');
            
            if (allowedGrades.length === 0 || allowedGrades.includes(grade)) {
                checkboxCard.style.display = 'flex';
                checkbox.disabled = false;
                hasVisibleOptions = true;
            } else {
                checkboxCard.style.display = 'none';
                checkbox.disabled = true;
                checkbox.checked = false;
            }
        });
        
        // 如果该类别没有任何可选项目，隐藏整个卡片
        if (!hasVisibleOptions) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    });
    
    // 更新浮动规划框（不调用 saveStepData，因为这只是过滤显示，不应该修改数据）
    if (typeof floatingPlanner !== 'undefined' && floatingPlanner) {
        floatingPlanner.updateElitePrograms(selectedElitePrograms);
    }
}

// 更新时间冲突警告
function updateConflictWarnings() {
    const conflicts = detectScheduleConflicts();
    
    // 清除所有警告
    document.querySelectorAll('.conflict-warning').forEach(el => el.remove());
    
    if (conflicts.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'conflict-warning';
        warningDiv.style.cssText = 'background: #fef2f2; border: 2px solid #dc2626; padding: 1rem; border-radius: 8px; margin: 1rem 0;';
        warningDiv.innerHTML = `
            <h4 style="color: #dc2626; margin-bottom: 0.5rem;">⚠️ ${i18n.t('messages.conflictWarning')}</h4>
            <ul style="margin: 0; padding-left: 1.5rem; color: #4a5568;">
                ${conflicts.map(c => `<li>${c}</li>`).join('')}
            </ul>
        `;
        
        const eliteSection = document.querySelector('#step-2');
        const buttonGroup = eliteSection.querySelector('.button-group');
        buttonGroup.parentNode.insertBefore(warningDiv, buttonGroup);
    }
}

// 检测时间冲突
function detectScheduleConflicts() {
    const conflicts = [];
    const scheduleMap = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: []
    };
    
    // 收集所有选中项目的时间
    document.querySelectorAll('input[name="elite-sports"]:checked, input[name="academic"]:checked').forEach(checkbox => {
        const schedule = checkbox.dataset.schedule;
        const label = checkbox.parentElement.querySelector('strong').textContent;
        
        if (schedule && schedule !== 'custom') {
            const days = schedule.split(',');
            days.forEach(day => {
                if (scheduleMap[day]) {
                    scheduleMap[day].push(label);
                }
            });
        }
    });
    
    // 检查冲突
    Object.keys(scheduleMap).forEach(day => {
        if (scheduleMap[day].length > 1) {
            const dayNames = {
                mon: i18n.t('days.monday'),
                tue: i18n.t('days.tuesday'),
                wed: i18n.t('days.wednesday'),
                thu: i18n.t('days.thursday'),
                fri: i18n.t('days.friday')
            };
            conflicts.push(`${dayNames[day]}：${scheduleMap[day].join(` ${i18n.t('general.and')} `)} ${i18n.t('messages.timeConflict')}`);
        }
    });
    
    return conflicts;
}

// 生成报名指引预览
function generateRegistrationGuidePreview() {
    const container = document.getElementById('registration-steps-preview');
    if (!container) return;
    
    const steps = [];
    
    // 检查是否有冲突覆盖的课程
    const conflictOverrides = [];
    Object.keys(selectedCCAs).forEach(day => {
        const cca = selectedCCAs[day];
        if (cca && cca.conflictOverride) {
            const dayNames = {
                'monday': i18n.t('days.monday'),
                'tuesday': i18n.t('days.tuesday'),
                'wednesday': i18n.t('days.wednesday'),
                'thursday': i18n.t('days.thursday'),
                'friday': i18n.t('days.friday')
            };
            // 根据当前语言获取CCA课程名称
            const ccaName = i18n.currentLang === 'en' && cca.nameEn 
                ? cca.nameEn 
                : cca.name;
            conflictOverrides.push({
                day: dayNames[day],
                ccaName: ccaName,
                conflictWith: cca.conflictOverride.conflictWith,
                conflictTime: cca.conflictOverride.conflictTime,
                reason: cca.conflictOverride.reason
            });
        }
    });
    
    // 如果有冲突覆盖，首先显示特别提醒
    if (conflictOverrides.length > 0) {
        steps.push({
            icon: '⚠️',
            title: i18n.t('messages.conflictWarningTitle'),
            description: i18n.t('messages.conflictWarningDesc'),
            isConflictWarning: true,
            conflicts: conflictOverrides
        });
    }
    
    // 检查是否有精英体育项目
    const hasSports = selectedElitePrograms.some(p => p.category === 'sports');
    if (hasSports) {
        steps.push({
            icon: '⚽',
            title: i18n.t('messages.regStepEliteSports'),
            description: i18n.t('messages.regEliteSportsDesc'),
            buttonText: i18n.t('buttons.fillSportsForm'),
            buttonUrl: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnCAHxjkVeIqUdu9b2NLGzBe'
        });
    }
    
    // 检查是否有音乐学院项目
    const hasMusic = selectedElitePrograms.some(p => p.category === 'music');
    if (hasMusic) {
        steps.push({
            icon: '🎵',
            title: i18n.t('messages.regStepMusicAcademy'),
            description: i18n.t('messages.regMusicAcademyDesc'),
            buttonText: i18n.t('buttons.fillMusicForm'),
            buttonUrl: 'https://harronnanning-est.feishu.cn/share/base/form/shrcn7k4bm3JYJZM5AzcQWSvcOq'
        });
    }
    
    // 检查是否有辩论队
    const hasDebate = selectedElitePrograms.some(p => p.value === 'debate');
    if (hasDebate) {
        steps.push({
            icon: '🗣️',
            title: i18n.t('messages.regStepDebate'),
            description: i18n.t('messages.regDebateDesc'),
            buttonText: i18n.t('buttons.rememberContact'),
            buttonAction: 'showDebateContact'
        });
    }
    
    // 检查是否有其他学术竞赛项目
    const hasOtherAcademic = selectedElitePrograms.some(p => p.category === 'academic' && p.value !== 'debate');
    if (hasOtherAcademic) {
        steps.push({
            icon: '🏆',
            title: i18n.t('messages.regStepAcademicComp'),
            description: i18n.t('messages.regAcademicCompDesc'),
            buttonText: i18n.t('buttons.viewContactInfo'),
            buttonAction: 'scrollToContact'
        });
    }
    
    // 检查宏博中心项目
    const hasEnglishFoundation = selectedElitePrograms.some(p => p.value === 'english-foundation');
    const hasIELTS = selectedElitePrograms.some(p => p.value === 'ielts-advanced');
    if (hasEnglishFoundation || hasIELTS) {
        steps.push({
            icon: '📖',
            title: i18n.t('messages.regStepHub'),
            description: i18n.t('messages.regHubDesc'),
            buttonText: i18n.t('buttons.rememberContact'),
            buttonAction: 'showHubContact'
        });
    }
    
    // 检查数学支持
    const hasMathSupport = selectedElitePrograms.some(p => p.value === 'math-support');
    if (hasMathSupport) {
        steps.push({
            icon: '🔢',
            title: i18n.t('messages.regStepMathSupport'),
            description: i18n.t('messages.regMathSupportDesc'),
            buttonText: i18n.t('buttons.rememberContact'),
            buttonAction: 'showMathContact'
        });
    }
    
    // 检查是否有普通CCA课程
    const hasCCA = Object.values(selectedCCAs).some(course => 
        course && !course.blocked && !course.isOptOut
    );
    if (hasCCA) {
        steps.push({
            icon: '📚',
            title: i18n.t('messages.regStepCCA'),
            description: i18n.t('messages.loginSchoolsBuddyDesc'),
            buttonText: i18n.t('buttons.loginSchoolsBuddy'),
            buttonUrl: 'https://accounts.schoolsbuddy.cn/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3Dspa%26state%3Dcn4tTFhlR2dUeERCa0UuOEVGZjdONEtLaG8tazd0X2dXMW9pUkFOcTRGaUE1%26redirect_uri%3Dhttps%253A%252F%252Fharronnanning.schoolsbuddy.cn%26scope%3Dopenid%2520profile%2520coreAPI%2520offline_access%2520email%26code_challenge%3DEaCh8G7NXRXF8kroWfkmuGBpxx26-56x9dxuOTemyy0%26code_challenge_method%3DS256%26nonce%3Dcn4tTFhlR2dUeERCa0UuOEVGZjdONEtLaG8tazd0X2dXMW9pUkFOcTRGaUE1',
            loginGuide: true
        });
    }
    
    // 渲染步骤
    let html = '<div style="display: grid; gap: 1.5rem;">';
    steps.forEach((step, index) => {
        // 如果是冲突警告，使用特殊布局
        if (step.isConflictWarning) {
            html += `
                <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15); border: 3px solid #dc2626;">
                    <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="font-size: 2.5rem; flex-shrink: 0;">${step.icon}</div>
                        <div style="flex: 1;">
                            <h4 style="color: #991b1b; margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 700;">${step.title}</h4>
                            <p style="color: #7f1d1d; margin: 0; line-height: 1.6; font-weight: 500;">${step.description}</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; gap: 1rem;">
                        ${step.conflicts.map((conflict, idx) => `
                            <div style="background: white; padding: 1.25rem; border-radius: 10px; border-left: 4px solid #dc2626;">
                                <div style="margin-bottom: 1rem;">
                                    <h5 style="color: #991b1b; margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600;">
                                        ${i18n.t('messages.conflictNumber')} ${idx + 1}：${conflict.day}
                                    </h5>
                                    <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
                                        <div style="background: #fef3c7; padding: 0.75rem; border-radius: 6px;">
                                            <p style="margin: 0; color: #78350f; font-size: 0.875rem;">
                                                <strong>📚 ${i18n.t('messages.ccaCourse')}：</strong>${conflict.ccaName}<br>
                                                <span style="color: #92400e;">${i18n.t('messages.time')}：16:00-17:00</span>
                                            </p>
                                        </div>
                                        <div style="background: #fee2e2; padding: 0.75rem; border-radius: 6px;">
                                            <p style="margin: 0; color: #7f1d1d; font-size: 0.875rem;">
                                                <strong>🏆 ${i18n.t('messages.eliteProgramTime')}：</strong>${conflict.conflictWith}<br>
                                                <span style="color: #991b1b;">${i18n.t('messages.time')}：${conflict.conflictTime}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="background: #e0f2fe; padding: 1rem; border-radius: 8px; border-left: 4px solid #0284c7;">
                                    <p style="color: #075985; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                        📝 ${i18n.t('messages.yourExplanation')}：
                                    </p>
                                    <p style="color: #0c4a6e; margin: 0; font-size: 0.875rem; line-height: 1.6; font-style: italic;">
                                        "${conflict.reason}"
                                    </p>
                                </div>
                                
                                <div style="background: #fffbeb; padding: 0.875rem; border-radius: 8px; margin-top: 1rem; border-left: 4px solid #f59e0b;">
                                    <p style="color: #92400e; margin: 0; font-size: 0.875rem; line-height: 1.6;">
                                        <strong>⚠️ ${i18n.t('messages.importantNote')}：</strong>${i18n.t('messages.conflictNoteText')}
                                    </p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        // 如果是CCA报名，使用特殊的整合布局
        else if (step.loginGuide) {
            html += `
                <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(21, 34, 66, 0.08); border-left: 4px solid #A69867;">
                    <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="font-size: 2rem; flex-shrink: 0;">${step.icon}</div>
                        <div style="flex: 1;">
                            <h4 style="color: #152242; margin: 0 0 0.5rem 0; font-size: 1.125rem;">${index + 1}. ${step.title}</h4>
                            <p style="color: #5a5a5a; margin: 0; line-height: 1.6;">${step.description}</p>
                        </div>
                    </div>
                    
                    <!-- 整合的登录提示和按钮 -->
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; overflow: hidden; border: 2px solid #f59e0b;">
                        <!-- 登录提示部分 -->
                        <div style="padding: 1.25rem; border-bottom: 2px dashed #f59e0b;">
                            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                                <div style="font-size: 1.5rem; flex-shrink: 0;">🔑</div>
                                <div style="flex: 1;">
                                    <h5 style="color: #92400e; margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600;">${i18n.t('messages.loginGuideKey')}</h5>
                                    
                                    <!-- 步骤1：进入登录页面 -->
                                    <div style="margin-bottom: 1rem;">
                                        <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                            <span style="display: inline-block; background: #92400e; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.75rem; margin-right: 0.5rem;">1</span>
                                            ${i18n.t('messages.loginStep1Title')}
                                        </p>
                                        <div style="background: rgba(255,255,255,0.6); padding: 0.75rem; border-radius: 6px; margin-left: 1.75rem;">
                                            <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem;">
                                                ${i18n.t('messages.loginStep1Text')}
                                            </p>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; background: #7b3f8f; padding: 0.5rem 0.75rem; border-radius: 6px; width: fit-content;">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                                                    <text x="12" y="16" text-anchor="middle" fill="#7b3f8f" font-size="10" font-weight="bold">iS</text>
                                                </svg>
                                                <span style="color: white; font-weight: 600; font-size: 0.875rem;">${i18n.t('messages.iSAMSLogin')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- 步骤2：选择家长登录 -->
                                    <div style="margin-bottom: 1rem;">
                                        <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                            <span style="display: inline-block; background: #92400e; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.75rem; margin-right: 0.5rem;">2</span>
                                            ${i18n.t('messages.loginStep2Title')}
                                        </p>
                                        <div style="background: rgba(255,255,255,0.6); padding: 0.75rem; border-radius: 6px; margin-left: 1.75rem;">
                                            <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem;">
                                                ${i18n.t('messages.loginStep2Text')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <!-- 步骤3：输入登录信息 -->
                                    <div style="margin-bottom: 0.75rem;">
                                        <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                            <span style="display: inline-block; background: #92400e; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.75rem; margin-right: 0.5rem;">3</span>
                                            ${i18n.t('messages.loginStep3Title')}
                                        </p>
                                        <ul style="color: #78350f; margin: 0; padding-left: 3rem; font-size: 0.875rem; line-height: 1.6;">
                                            <li><strong>${i18n.t('messages.username')}：</strong>${i18n.t('messages.usernameExample')}</li>
                                            <li><strong>${i18n.t('messages.password')}：</strong>${i18n.t('messages.passwordText')}</li>
                                        </ul>
                                    </div>
                                    
                                    <p style="color: #92400e; margin: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.6); border-radius: 6px;">
                                        <span>💡</span>
                                        <span>${i18n.t('messages.forgotPasswordTip')}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 登录按钮部分 -->
                        <div style="padding: 1rem;">
                            <button onclick="navigateToExternal('${step.buttonUrl}')" 
                                    style="width: 100%; padding: 1rem 1.5rem; background: linear-gradient(135deg, #152242 0%, #1e3158 100%); color: white; border: none; border-radius: 8px; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(21, 34, 66, 0.3); display: flex; align-items: center; justify-content: center; gap: 0.5rem; position: relative;">
                                <span style="position: relative; z-index: 2;">${i18n.t('messages.loginToSchoolsBuddy')}</span>
                                <span style="font-size: 1.25rem; position: relative; z-index: 2;">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 其他步骤使用原来的布局
            const buttonHtml = step.buttonUrl 
                ? `<button onclick="navigateToExternal('${step.buttonUrl}')" style="width: 100%; padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #152242 0%, #1e3158 100%); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(21, 34, 66, 0.3); position: relative;"><span style="position: relative; z-index: 2;">${step.buttonText}</span></button>`
                : `<button onclick="${step.buttonAction}()" style="width: 100%; padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #6b7c93 0%, #7a8ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(107, 124, 147, 0.3); position: relative;"><span style="position: relative; z-index: 2;">${step.buttonText}</span></button>`;
            
            html += `
                <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(21, 34, 66, 0.08); border-left: 4px solid #A69867;">
                    <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                        <div style="font-size: 2rem; flex-shrink: 0;">${step.icon}</div>
                        <div style="flex: 1;">
                            <h4 style="color: #152242; margin: 0 0 0.5rem 0; font-size: 1.125rem;">${index + 1}. ${step.title}</h4>
                            <p style="color: #5a5a5a; margin: 0; line-height: 1.6;">${step.description}</p>
                        </div>
                    </div>
                    ${buttonHtml}
                </div>
            `;
        }
    });
    html += '</div>';
    
    if (steps.length === 0) {
        html = `<div style="text-align: center; padding: 2rem; color: #9ca3af;">${i18n.t('messages.noExtraRegistration')}</div>`;
    }
    
    container.innerHTML = html;
}

// 导航到外部链接（保存状态后跳转）
function navigateToExternal(url) {
    // 保存当前状态
    saveCurrentState();
    
    // 设置标记，表示即将跳转到外部链接
    localStorage.setItem('ccaNavigatingToExternal', 'true');
    
    // 跳转到外部链接
    window.location.href = url;
}

// 辅助函数
function showDebateContact() {
    alert(i18n.t('messages.debateContact'));
}

function showHubContact() {
    alert(i18n.t('messages.hubContact'));
}

function showMathContact() {
    alert(i18n.t('messages.mathContact'));
}

function scrollToContact() {
    alert(i18n.t('messages.checkContactInfo'));
}
