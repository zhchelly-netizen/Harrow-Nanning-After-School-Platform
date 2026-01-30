// ===================================
// Registration Guide JavaScript
// ===================================

// 精英项目翻译映射（与 cca.js 保持一致）
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
        'math-support': '🔢 中文数学支持'
    },
    'en': {
        'football-primary': '⚽ Football (Primary)',
        'football-secondary': '⚽ Football (Secondary)',
        'basketball-primary': '🏀 Basketball (Primary)',
        'basketball-secondary': '🏀 Basketball (Secondary)',
        'swimming-team': '🏊 Swimming Team 1',
        'swimming-reserve': '🏊 Swimming Reserve Team',
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
        'math-support': '🔢 Chinese Maths Support'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // 确保 i18n 已经初始化
    if (typeof i18n === 'undefined') {
        console.error('i18n is not loaded yet, retrying...');
        setTimeout(function() {
            if (typeof i18n !== 'undefined') {
                i18n.updatePageLanguage();
                loadPlanData();
                generateRegistrationSteps();
            }
        }, 100);
        return;
    }
    
    // 先更新页面语言
    i18n.updatePageLanguage();
    
    // 然后加载数据
    loadPlanData();
    generateRegistrationSteps();
    
    // 监听语言切换事件
    window.addEventListener('languageChanged', function() {
        // 重新更新页面语言
        i18n.updatePageLanguage();
        
        if (window.currentPlanData) {
            displayPlanSummary(window.currentPlanData);
            generateRegistrationSteps();
        }
    });
});

function loadPlanData() {
    const planDataStr = localStorage.getItem('ccaPlanData');
    
    if (!planDataStr) {
        // 如果没有数据，返回规划页面
        window.location.href = 'cca-planning.html';
        return;
    }
    
    const planData = JSON.parse(planDataStr);
    displayPlanSummary(planData);
    
    // 保存到全局变量供其他函数使用
    window.currentPlanData = planData;
}

function displayPlanSummary(planData) {
    const summaryContainer = document.getElementById('plan-summary');
    if (!summaryContainer) return;
    
    // 确保 i18n 已加载
    if (typeof i18n === 'undefined') {
        console.error('i18n is not defined in displayPlanSummary');
        return;
    }
    
    let summaryHTML = '';
    
    // 学生信息
    summaryHTML += `
        <div class="summary-section">
            <h4>${i18n.t('studentInfo')}</h4>
            <div class="summary-list">
                <li>${i18n.t('grade')}：${planData.student.grade}</li>
            </div>
        </div>
    `;
    
    // 精英项目
    if (planData.elitePrograms && planData.elitePrograms.length > 0) {
        summaryHTML += `
            <div class="summary-section">
                <h4>${i18n.t('elitePrograms')}</h4>
                <ul class="summary-list">
        `;
        
        planData.elitePrograms.forEach(program => {
            const categoryName = getCategoryName(program.category);
            // 根据当前语言获取精英项目名称
            const programName = ELITE_PROGRAM_TRANSLATIONS[i18n.currentLang][program.value] || program.label;
            summaryHTML += `<li><span class="category-badge badge-${program.category}">${categoryName}</span>${programName}</li>`;
        });
        
        summaryHTML += `
                </ul>
            </div>
        `;
    }
    
    // CCA课程
    const ccaCourses = Object.entries(planData.ccas).filter(([day, course]) => 
        course && !course.blocked && !course.isOptOut
    );
    
    if (ccaCourses.length > 0) {
        summaryHTML += `
            <div class="summary-section">
                <h4>${i18n.t('ccaCourses')}</h4>
                <ul class="summary-list">
        `;
        
        ccaCourses.forEach(([day, course]) => {
            const dayName = i18n.getDay(day);
            // 根据当前语言选择课程名称
            const courseName = i18n.currentLang === 'en' && course.nameEn ? course.nameEn : course.name;
            summaryHTML += `<li><span class="category-badge badge-cca">${dayName}</span>${courseName}</li>`;
        });
        
        summaryHTML += `
                </ul>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = summaryHTML;
}

function getCategoryName(category) {
    // 确保 i18n 已加载
    if (typeof i18n === 'undefined') {
        return category;
    }
    
    const names = {
        zh: {
            sports: '体育',
            music: '音乐',
            academic: '学术',
            hub: '宏博',
            math: '数学'
        },
        en: {
            sports: 'Sports',
            music: 'Music',
            academic: 'Academic',
            hub: 'Hub',
            math: 'Maths'
        }
    };
    return names[i18n.currentLang][category] || category;
}

function generateRegistrationSteps() {
    const stepsContainer = document.getElementById('registration-steps');
    const planData = window.currentPlanData;
    
    if (!planData) return;
    
    // 确保 i18n 已加载
    if (typeof i18n === 'undefined') {
        console.error('i18n is not defined in generateRegistrationSteps');
        return;
    }
    
    const steps = [];
    
    // 检查是否有精英体育项目
    const hasSports = planData.elitePrograms.some(p => p.category === 'sports');
    if (hasSports) {
        steps.push({
            title: i18n.t('regStepEliteSports'),
            description: i18n.t('regEliteSportsDesc'),
            items: i18n.currentLang === 'zh' ? [
                '填写精英体育报名表',
                '等待体育部负责老师联系确认选拔时间',
                '准备相关运动装备'
            ] : [
                'Fill in the Elite Sports registration form',
                'Wait for the Sports Department to contact you to confirm the selection time',
                'Prepare relevant sports equipment'
            ],
            buttonText: i18n.t('fillSportsForm'),
            buttonAction: 'openSportsForm',
            buttonUrl: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnCAHxjkVeIqUdu9b2NLGzBe'
        });
    }
    
    // 检查是否有音乐学院项目
    const hasMusic = planData.elitePrograms.some(p => p.category === 'music');
    if (hasMusic) {
        steps.push({
            title: i18n.t('regStepMusicAcademy'),
            description: i18n.t('regMusicAcademyDesc'),
            items: i18n.currentLang === 'zh' ? [
                '填写音乐学院报名表',
                '选择合适的上课时间',
                '等待老师确认并安排试课'
            ] : [
                'Fill in the Music Academy registration form',
                'Choose a suitable class time',
                'Wait for the teacher to confirm and arrange a trial lesson'
            ],
            buttonText: i18n.t('fillMusicForm'),
            buttonAction: 'openMusicForm',
            buttonUrl: 'https://harronnanning-est.feishu.cn/share/base/form/shrcn7k4bm3JYJZM5AzcQWSvcOq'
        });
    }
    
    // 检查是否有学术竞赛项目
    const hasAcademic = planData.elitePrograms.some(p => p.category === 'academic');
    const hasDebate = planData.elitePrograms.some(p => p.value === 'debate');
    
    if (hasDebate) {
        // 辩论队特殊处理
        steps.push({
            title: i18n.t('regStepDebate'),
            description: i18n.t('regDebateDesc'),
            items: i18n.currentLang === 'zh' ? [
                '中文教育组组长：欧老师 Kasey Ou',
                '高年级教练：谭老师 Lily Tan',
                '小学部教练：梁老师 Nicky Liang',
                '在企业微信上搜索并添加对应年级的教练',
                '说明您想加入辩论队',
                '与教练沟通确认训练时间和安排'
            ] : [
                'Head of Chinese: Ms. Kasey Ou',
                'Senior School Coach: Ms. Lily Tan',
                'Primary Coach: Ms. Nicky Liang',
                'Search and add the appropriate coach on WeWork',
                'Explain that you want to join the debate team',
                'Communicate with the coach to confirm training time and arrangements'
            ],
            buttonText: i18n.t('rememberContact'),
            buttonAction: 'showDebateContact'
        });
    } else if (hasAcademic) {
        // 其他学术竞赛项目
        steps.push({
            title: i18n.t('regStepAcademicComp'),
            description: i18n.t('regAcademicCompDesc'),
            items: i18n.currentLang === 'zh' ? [
                '联系拓展部负责老师',
                '了解竞赛安排和要求',
                '确认训练时间'
            ] : [
                'Contact Extension Department teachers',
                'Learn about competition arrangements and requirements',
                'Confirm training time'
            ],
            buttonText: i18n.t('viewContactInfo'),
            buttonAction: 'scrollToContact'
        });
    }
    
    // 检查特定的宏博中心项目 - 需要联系特定老师
    const hasEnglishFoundation = planData.elitePrograms.some(p => p.value === 'english-foundation');
    const hasIELTS = planData.elitePrograms.some(p => p.value === 'ielts-advanced');
    const hasMathSupport = planData.elitePrograms.some(p => p.value === 'math-support');
    
    if (hasEnglishFoundation || hasIELTS) {
        steps.push({
            title: i18n.t('regStepHub'),
            description: i18n.t('regHubDesc'),
            items: i18n.currentLang === 'zh' ? [
                '在企业微信上搜索并添加 龚安琪 Angel Gong 老师',
                '说明您需要的课程（英语基础/雅思进阶）',
                '与老师沟通确认上课时间和安排'
            ] : [
                'Search and add Ms. Angel Gong on WeWork',
                'Specify the course you need (English Foundation/IELTS Advanced)',
                'Communicate with the teacher to confirm class time and arrangements'
            ],
            buttonText: i18n.t('rememberContact'),
            buttonAction: 'showTeacherContact',
            buttonData: '龚安琪 Angel Gong'
        });
    }
    
    if (hasMathSupport) {
        steps.push({
            title: i18n.t('regStepMathSupport'),
            description: i18n.t('regMathSupportDesc'),
            items: i18n.currentLang === 'zh' ? [
                '在企业微信上搜索并添加 唐齐昌 Ryan Tang 老师',
                '说明您需要中文数学支持课程',
                '与老师沟通确认上课时间和安排'
            ] : [
                'Search and add Mr. Ryan Tang on WeWork',
                'Specify that you need Chinese Maths Support',
                'Communicate with the teacher to confirm class time and arrangements'
            ],
            buttonText: i18n.t('rememberContact'),
            buttonAction: 'showTeacherContact',
            buttonData: '唐齐昌 Ryan Tang'
        });
    }
    
    // 检查是否有普通CCA课程
    const hasCCA = Object.values(planData.ccas).some(course => 
        course && !course.blocked && !course.isOptOut
    );
    
    if (hasCCA) {
        steps.push({
            title: i18n.t('regStepCCA'),
            description: i18n.t('loginSchoolsBuddyDesc'),
            items: i18n.currentLang === 'zh' ? [
                '使用学校账号登录 SchoolsBuddy',
                '在系统中选择您规划的课程',
                '确认报名并等待审核'
            ] : [
                'Login to SchoolsBuddy with your school account',
                'Select your planned courses in the system',
                'Confirm registration and wait for approval'
            ],
            buttonText: i18n.t('loginToSchoolsBuddy'),
            buttonAction: 'openSchoolsBuddy',
            buttonUrl: 'https://accounts.schoolsbuddy.cn/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3Dspa%26state%3DbmEzbS16RlZUeWRqVGhRQWhnVy1OVU5WeTlzY2c4TFk4QWQ3TGZEb3dILmdz%26redirect_uri%3Dhttps%253A%252F%252Fharronnanning.schoolsbuddy.cn%26scope%3Dopenid%2520profile%2520coreAPI%2520offline_access%2520email%26code_challenge%3DZAynLS1zh5ox2nCmx4KfXEy9WOQudgXZtpJCHqs8OKc%26code_challenge_method%3DS256%26nonce%3DbmEzbS16RlZUeWRqVGhRQWhnVy1OVU5WeTlzY2c4TFk4QWQ3TGZEb3dILmdz'
        });
    }
    
    // 渲染步骤
    let stepsHTML = '';
    steps.forEach((step, index) => {
        const buttonData = step.buttonData ? `'${step.buttonData}'` : `'${step.buttonUrl || ''}'`;
        stepsHTML += `
            <div class="step-card">
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    <h3 class="step-title">${step.title}</h3>
                </div>
                <p class="step-description">${step.description}</p>
                ${step.items ? `
                    <ul class="step-items">
                        ${step.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
                <button 
                    class="step-button ${step.buttonDisabled ? 'secondary' : ''}" 
                    onclick="${step.buttonAction}(${buttonData})"
                    ${step.buttonDisabled ? 'disabled' : ''}
                >
                    ${step.buttonText}
                </button>
            </div>
        `;
    });
    
    stepsContainer.innerHTML = stepsHTML;
}

// 按钮操作函数
function openSportsForm(url) {
    navigateToExternal(url);
}

function openMusicForm(url) {
    navigateToExternal(url);
}

function openSchoolsBuddy(url) {
    navigateToExternal(url);
}

// 导航到外部链接（保存状态后跳转）
function navigateToExternal(url) {
    // 保存当前状态到 localStorage（从 cca-planning 页面带过来的状态）
    const planningState = localStorage.getItem('ccaPlanningState');
    if (planningState) {
        console.log('保持规划状态，准备跳转到外部链接');
    }
    
    // 设置标记，表示即将跳转到外部链接
    localStorage.setItem('ccaNavigatingToExternal', 'true');
    
    // 跳转到外部链接
    window.location.href = url;
}

function scrollToContact() {
    const contactSection = document.getElementById('contact-info');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 高亮效果
        contactSection.style.animation = 'highlight 2s ease';
    }
}

function showTeacherContact(teacherName) {
    alert(`请在企业微信上联系：${teacherName}\n\n1. 打开企业微信\n2. 搜索老师姓名\n3. 添加并说明您的需求`);
}

function showDebateContact() {
    alert(`请在企业微信上联系辩论队教练组：\n\n【中文教育组组长】\n欧老师 Kasey Ou\n\n【高年级教练】\n谭老师 Lily Tan\n\n【小学部教练】\n梁老师 Nicky Liang\n\n请根据您的年级联系对应的教练老师`);
}

// 返回到规划页面（保留状态）
function goBackToPlanningPage() {
    // 设置标记，表示这是从 registration-guide 返回，应该保留状态
    localStorage.setItem('ccaNavigatingToExternal', 'true');
    
    // 跳转回规划页面
    window.location.href = 'cca-planning.html';
}

// 完成规划（清除状态，返回首页）
function completePlanning() {
    // 清除所有规划相关的缓存
    localStorage.removeItem('ccaPlanningState');
    localStorage.removeItem('ccaPlanData');
    localStorage.removeItem('ccaNavigatingToExternal');
    
    // 返回首页
    window.location.href = 'index.html';
}
