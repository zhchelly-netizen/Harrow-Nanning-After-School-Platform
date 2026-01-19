// ===================================
// Registration Guide JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    loadPlanData();
    generateRegistrationSteps();
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
    let summaryHTML = '';
    
    // 学生信息
    summaryHTML += `
        <div class="summary-section">
            <h4>学生信息</h4>
            <div class="summary-list">
                <li>年级：${planData.student.grade}</li>
            </div>
        </div>
    `;
    
    // 精英项目
    if (planData.elitePrograms && planData.elitePrograms.length > 0) {
        summaryHTML += `
            <div class="summary-section">
                <h4>精英项目</h4>
                <ul class="summary-list">
        `;
        
        planData.elitePrograms.forEach(program => {
            const categoryName = getCategoryName(program.category);
            summaryHTML += `<li><span class="category-badge badge-${program.category}">${categoryName}</span>${program.label}</li>`;
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
                <h4>CCA 课程</h4>
                <ul class="summary-list">
        `;
        
        const dayNames = {
            monday: '周一',
            tuesday: '周二',
            wednesday: '周三',
            thursday: '周四',
            friday: '周五'
        };
        
        ccaCourses.forEach(([day, course]) => {
            summaryHTML += `<li><span class="category-badge badge-cca">${dayNames[day]}</span>${course.name}</li>`;
        });
        
        summaryHTML += `
                </ul>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = summaryHTML;
}

function getCategoryName(category) {
    const names = {
        sports: '体育',
        music: '音乐',
        academic: '学术',
        hub: '宏博',
        math: '数学'
    };
    return names[category] || category;
}

function generateRegistrationSteps() {
    const stepsContainer = document.getElementById('registration-steps');
    const planData = window.currentPlanData;
    
    if (!planData) return;
    
    const steps = [];
    
    // 检查是否有精英体育项目
    const hasSports = planData.elitePrograms.some(p => p.category === 'sports');
    if (hasSports) {
        steps.push({
            title: '精英体育校队报名',
            description: '您选择了精英体育项目，请填写报名表完成报名',
            items: [
                '填写精英体育报名表',
                '等待体育部负责老师联系确认选拔时间',
                '准备相关运动装备'
            ],
            buttonText: '填写精英体育报名表 →',
            buttonAction: 'openSportsForm',
            buttonUrl: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnCAHxjkVeIqUdu9b2NLGzBe'
        });
    }
    
    // 检查是否有音乐学院项目
    const hasMusic = planData.elitePrograms.some(p => p.category === 'music');
    if (hasMusic) {
        steps.push({
            title: '哈罗音乐学院报名',
            description: '您选择了音乐学院课程，请填写报名表预约上课时间',
            items: [
                '填写音乐学院报名表',
                '选择合适的上课时间',
                '等待老师确认并安排试课'
            ],
            buttonText: '填写音乐学院报名表 →',
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
            title: '"以言论道"思辨社报名',
            description: '您选择了辩论队，请在企业微信上联系辩论队教练组',
            items: [
                '中文教育组组长：欧老师 Kasey Ou',
                '高年级教练：谭老师 Lily Tan',
                '小学部教练：梁老师 Nicky Liang',
                '在企业微信上搜索并添加对应年级的教练',
                '说明您想加入辩论队',
                '与教练沟通确认训练时间和安排'
            ],
            buttonText: '记住：联系辩论队教练组',
            buttonAction: 'showDebateContact'
        });
    } else if (hasAcademic) {
        // 其他学术竞赛项目
        steps.push({
            title: '学术竞赛队伍报名',
            description: '您选择了学术竞赛项目，请联系拓展部负责老师',
            items: [
                '联系拓展部负责老师',
                '了解竞赛安排和要求',
                '确认训练时间'
            ],
            buttonText: '查看联系方式（见页面底部）',
            buttonAction: 'scrollToContact'
        });
    }
    
    // 检查特定的宏博中心项目 - 需要联系特定老师
    const hasEnglishFoundation = planData.elitePrograms.some(p => p.value === 'english-foundation');
    const hasIELTS = planData.elitePrograms.some(p => p.value === 'ielts-advanced');
    const hasMathSupport = planData.elitePrograms.some(p => p.value === 'math-support');
    
    if (hasEnglishFoundation || hasIELTS) {
        steps.push({
            title: '宏博中心课程报名',
            description: '您选择了宏博中心课程，请在企业微信上联系负责老师',
            items: [
                '在企业微信上搜索并添加 龚安琪 Angel Gong 老师',
                '说明您需要的课程（英语基础/雅思进阶）',
                '与老师沟通确认上课时间和安排'
            ],
            buttonText: '记住：联系 龚安琪 Angel Gong 老师',
            buttonAction: 'showTeacherContact',
            buttonData: '龚安琪 Angel Gong'
        });
    }
    
    if (hasMathSupport) {
        steps.push({
            title: '英文数学课程报名',
            description: '您选择了中文数学支持课程，请在企业微信上联系负责老师',
            items: [
                '在企业微信上搜索并添加 唐齐昌 Ryan Tang 老师',
                '说明您需要中文数学支持课程',
                '与老师沟通确认上课时间和安排'
            ],
            buttonText: '记住：联系 唐齐昌 Ryan Tang 老师',
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
            title: 'CCA 课程报名',
            description: '您选择了常规CCA课程，请登录 SchoolsBuddy 系统完成报名',
            items: [
                '使用学校账号登录 SchoolsBuddy',
                '在系统中选择您规划的课程',
                '确认报名并等待审核'
            ],
            buttonText: '登录 SchoolsBuddy →',
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
    window.open(url, '_blank');
}

function openMusicForm(url) {
    window.open(url, '_blank');
}

function openSchoolsBuddy(url) {
    window.open(url, '_blank');
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
