// ===================================
// CCA 课程规划页面 JavaScript
// ===================================

let currentStep = 1;
let studentData = {};
let selectedElitePrograms = [];
let selectedCCAs = {};

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
    updateStepDisplay();
    
    // 如果进入CCA选择步骤，加载课程
    if (step === 3) {
        loadCCACourses();
    }
    
    // 如果进入确认步骤，生成摘要
    if (step === 4) {
        generateSummary();
    }
    
    // 如果进入报名指引步骤，生成报名指引预览
    if (step === 5) {
        generateRegistrationGuidePreview();
    }
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    currentStep = step;
    updateStepDisplay();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepDisplay() {
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
        if (index + 1 === currentStep) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// 验证步骤
function validateStep(step) {
    if (step === 1) {
        const grade = document.getElementById('student-grade').value;
        
        if (!grade) {
            showErrorMessage('请选择年级 Please select a grade');
            return false;
        }
    }
    
    if (step === 3) {
        // 验证是否所有工作日都已选择
        const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const unselectedDays = requiredDays.filter(day => !selectedCCAs[day]);
        
        if (unselectedDays.length > 0) {
            showErrorMessage('请为所有工作日选择课程或"不参加" Please select a course or "Opt-out" for all weekdays');
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
                label: input.parentElement.querySelector('strong').textContent,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="music"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'music',
                value: input.value,
                label: input.parentElement.querySelector('strong').textContent,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="academic"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'academic',
                value: input.value,
                label: input.parentElement.querySelector('strong').textContent,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="hub"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'hub',
                value: input.value,
                label: input.parentElement.querySelector('strong').textContent,
                schedule: input.dataset.schedule
            });
        });
        
        document.querySelectorAll('input[name="math"]:checked').forEach(input => {
            selectedElitePrograms.push({
                category: 'math',
                value: input.value,
                label: input.parentElement.querySelector('strong').textContent,
                schedule: input.dataset.schedule
            });
        });
    }
}

// 加载CCA课程（从飞书多维表格获取，这里使用配置文件数据）
function loadCCACourses() {
    // 使用配置文件中的数据
    const mockCourses = typeof CCA_COURSES !== 'undefined' ? CCA_COURSES : {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    };
    
    const studentGrade = studentData.grade;
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
                    <p style="margin: 0; font-weight: 600;">⚠️ 该时段已被精英项目占用</p>
                </div>
            `;
            // 自动标记为已选择（被精英项目占用）
            selectedCCAs[day] = { id: 'blocked', name: 'Elite Programme', blocked: true };
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
            <div class="slot-name">🚫 不参加</div>
            <div class="slot-teacher" style="font-size: 0.875rem; opacity: 0.7;">该时段不参加课后活动</div>
        `;
        optOutSlot.addEventListener('click', function() {
            selectCCA(day, { id: 'opt-out', name: '不参加', isOptOut: true, fee: '¥0' });
        });
        container.appendChild(optOutSlot);
        
        const availableCourses = mockCourses[day].filter(course => 
            course.grades.includes(studentGrade)
        );
        
        if (availableCourses.length === 0) {
            const noCoursesDiv = document.createElement('div');
            noCoursesDiv.className = 'no-courses';
            noCoursesDiv.style.cssText = 'padding: 1rem; text-align: center; color: #9ca3af; margin-top: 0.5rem;';
            noCoursesDiv.innerHTML = `<p style="margin: 0;">该年级暂无可选课程</p>`;
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
            
            const inviteBadge = course.inviteOnly ? '<span style="background: #fbbf24; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">邀请制/单招</span>' : '';
            const feeBadge = course.fee !== '¥0' ? `<span style="color: #059669; font-size: 0.875rem; font-weight: 600;">${course.fee}</span>` : '<span style="color: #10b981; font-size: 0.875rem; font-weight: 600;">免费</span>';
            
            slot.innerHTML = `
                <div class="slot-name">${course.name}${inviteBadge}</div>
                <div class="slot-teacher" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${course.teacher}</span>
                    ${feeBadge}
                </div>
            `;
            
            slot.addEventListener('click', function() {
                if (course.inviteOnly) {
                    showInviteOnlyDialog(day, course);
                } else {
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
            <h3>邀请制项目 Invitation-Only Programme</h3>
            <p style="margin: 1rem 0; line-height: 1.6;">
                此课程为邀请制/单招项目，需要联系负责老师。<br>
                This is an invitation-only programme. Please contact the teacher in charge.
            </p>
            <p style="margin: 1rem 0; line-height: 1.6;">
                如果您收到了邀请函，可以点击下方按钮添加到您的课程规划中。<br>
                If you have received an invitation, you can add it to your plan.
            </p>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="secondary-button" onclick="closeInviteDialog()">取消 Cancel</button>
                <button class="primary-button" onclick="acceptInvitation('${day}', '${course.id}')">我收到老师的邀请 I Have an Invitation</button>
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
    showSuccessMessage('已添加到课程规划 Added to your plan');
}

// 获取被精英项目占用的日期
function getBlockedDays() {
    const blocked = [];
    
    selectedElitePrograms.forEach(program => {
        // 跳过不占用CCA时段的项目（如辩论队）
        if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
            const days = program.schedule.split(',');
            days.forEach(day => {
                // 转换为完整的日期名称
                const dayMapping = {
                    'mon': 'monday',
                    'tue': 'tuesday',
                    'wed': 'wednesday',
                    'thu': 'thursday',
                    'fri': 'friday'
                };
                const fullDay = dayMapping[day];
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
    // 取消该天的其他选择
    document.querySelectorAll(`[data-day="${day}"]`).forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 选中当前课程 - 需要同时匹配 day 和 course-id
    const slot = document.querySelector(`[data-day="${day}"][data-course-id="${course.id}"]`);
    if (slot) {
        slot.classList.add('selected');
    }
    
    // 保存选择
    selectedCCAs[day] = course;
}

// 生成摘要
function generateSummary() {
    const summaryContainer = document.getElementById('selection-summary');
    
    let summaryHTML = `
        <h3>学生信息 Student Info</h3>
        <div style="margin-bottom: 2rem;">
            <p><strong>年级 Grade：</strong>${studentData.grade}</p>
        </div>
    `;
    
    // 统计课后安排
    const weekSchedule = {};
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayShortMap = {
        'monday': 'mon',
        'tuesday': 'tue',
        'wednesday': 'wed',
        'thursday': 'thu',
        'friday': 'fri'
    };
    
    // 先收集精英项目（优先级高）
    selectedElitePrograms.forEach(program => {
        if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
            const days = program.schedule.split(',');
            days.forEach(dayShort => {
                const fullDay = Object.keys(dayShortMap).find(key => dayShortMap[key] === dayShort);
                if (fullDay) {
                    weekSchedule[fullDay] = {
                        type: 'elite',
                        name: program.label,
                        fee: '定制课包'
                    };
                }
            });
        }
    });
    
    // 再收集CCA（不覆盖精英项目）
    dayKeys.forEach(day => {
        if (!weekSchedule[day] && selectedCCAs[day]) {
            if (selectedCCAs[day].isOptOut) {
                weekSchedule[day] = {
                    type: 'optout',
                    name: '不参加 Opt-out',
                    fee: '¥0'
                };
            } else if (!selectedCCAs[day].blocked) {
                weekSchedule[day] = {
                    type: 'cca',
                    name: selectedCCAs[day].name,
                    fee: selectedCCAs[day].fee || '¥0'
                };
            }
        }
    });
    
    // 显示课后时间安排
    if (Object.keys(weekSchedule).length > 0 || selectedElitePrograms.length > 0) {
        summaryHTML += `
            <h3>课后时间安排 After-School Schedule</h3>
            <div>
                <ul style="list-style: none; padding: 0;">
        `;
        
        const dayNames = {
            monday: '周一 MON',
            tuesday: '周二 TUE',
            wednesday: '周三 WED',
            thursday: '周四 THU',
            friday: '周五 FRI'
        };
        
        dayKeys.forEach(day => {
            if (weekSchedule[day]) {
                let icon = '📚';
                if (weekSchedule[day].type === 'elite') icon = '🏆';
                if (weekSchedule[day].type === 'optout') icon = '🚫';
                
                summaryHTML += `<li style="padding: 0.5rem 0;"><strong>${dayNames[day]}：</strong>${icon} ${weekSchedule[day].name}</li>`;
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
                <h4>精英项目</h4>
                <ul class="price-list">
        `;
        
        elitePrograms.forEach(program => {
            priceHTML += `
                <li>
                    <span>${program.label}</span>
                    <span class="price-tag custom">定制课包</span>
                </li>
            `;
            hasCustomPackage = true;
        });
        
        priceHTML += `
                </ul>
            </div>
        `;
    }
    
    // 计算CCA费用
    const ccaCourses = Object.values(weekSchedule).filter(item => item.type === 'cca');
    if (ccaCourses.length > 0) {
        priceHTML += `
            <div class="price-section">
                <h4>CCA 课程</h4>
                <ul class="price-list">
        `;
        
        ccaCourses.forEach(course => {
            const price = parseFee(course.fee);
            if (price > 0) {
                totalPrice += price;
            }
            
            priceHTML += `
                <li>
                    <span>${course.name}</span>
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
                    <span>CCA 课程原价：</span>
                    <span>¥${originalTotal.toLocaleString('zh-CN')}</span>
                </div>
            ` : ''}
            <div class="total-row">
                <span>CCA 课程${hasCap ? '实付' : '小计'}：</span>
                <span class="total-amount">¥${finalTotal.toLocaleString('zh-CN')}</span>
            </div>
            ${hasCap ? `
                <div class="custom-note" style="background: #d1fae5; border-left: 4px solid #10b981;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: #059669;">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span style="color: #065f46;">已应用封顶优惠：CCA课程费用超过¥3,000，按¥3,000封顶收取</span>
                </div>
            ` : totalPrice > 0 ? `
                <div class="custom-note" style="background: #e0f2fe; border-left: 4px solid #0284c7;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: #0369a1;">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span style="color: #075985;">CCA课程费用未满¥3,000，据实结算；超过¥3,000将封顶收取</span>
                </div>
            ` : ''}
            ${hasCustomPackage ? `
                <div class="custom-note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span>精英项目为定制课包，具体费用请咨询相关负责老师</span>
                </div>
            ` : ''}
        </div>
    `;
    
    priceDetails.innerHTML = priceHTML;
}

// 解析费用
function parseFee(feeString) {
    if (!feeString || feeString === '¥0' || feeString === '定制课包') {
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
                const days = program.schedule.split(',');
                if (days.includes(dayKey)) {
                    const scheduleInfo = ELITE_SCHEDULES[program.value];
                    dayData.activities.push({
                        type: 'elite',
                        name: program.label,
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
                dayData.activities.push({
                    type: cca.isOptOut ? 'optout' : 'cca',
                    name: cca.name,
                    time: '16:00-17:00',
                    fee: cca.fee || '¥0'
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
        
        // 卡片背景
        if (day.activities.length > 0) {
            // 有课程 - 彩色卡片
            const cardGradient = ctx.createLinearGradient(x, y, x, y + cardHeight);
            cardGradient.addColorStop(0, '#ffffff');
            cardGradient.addColorStop(1, '#f8fafc');
            ctx.fillStyle = cardGradient;
        } else {
            // 休息 - 灰色卡片
            ctx.fillStyle = '#f1f5f9';
        }
        
        ctx.roundRect(x, y, cardWidth, cardHeight, 12);
        ctx.fill();
        
        // 卡片边框
        ctx.strokeStyle = day.activities.length > 0 ? '#8b2635' : '#cbd5e0';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 日期标题背景
        ctx.fillStyle = day.activities.length > 0 ? '#8b2635' : '#94a3b8';
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
            
            day.activities.forEach(activity => {
                // 图标
                const icon = activity.type === 'elite' ? '🏆' : activity.type === 'optout' ? '🚫' : '📚';
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(icon, x + cardWidth / 2, contentY);
                contentY += 50;
                
                // 课程名称
                ctx.fillStyle = '#1a2332';
                ctx.font = 'bold 20px SimHei, Arial';
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
                    ctx.fillText(textLine, x + cardWidth / 2, contentY + idx * 25);
                });
                contentY += lines.length * 25 + 15;
                
                // 时间
                ctx.fillStyle = '#6b7280';
                ctx.font = '18px Arial';
                ctx.fillText(activity.time, x + cardWidth / 2, contentY);
                contentY += 30;
                
                // 费用
                if (activity.fee && activity.fee !== '¥0') {
                    ctx.fillStyle = activity.fee === '定制课包' ? '#f59e0b' : '#059669';
                    ctx.font = 'bold 20px SimHei, Arial';
                    ctx.fillText(activity.fee, x + cardWidth / 2, contentY);
                }
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
            showErrorMessage('图片生成失败，请重试');
            return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `哈罗课程表_${studentData.grade}_${timestamp}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 延迟释放URL，确保下载完成
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showSuccessMessage('课程表图片已生成并下载！📸');
        
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
        monday: '周一 MON',
        tuesday: '周二 TUE',
        wednesday: '周三 WED',
        thursday: '周四 THU',
        friday: '周五 FRI'
    };
    
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    let previewHTML = '';
    
    dayKeys.forEach(day => {
        const dayShort = day.substring(0, 3);
        
        // 检查该天是否有精英项目
        let eliteActivity = null;
        selectedElitePrograms.forEach(program => {
            if (program.schedule && program.schedule !== 'custom' && program.schedule !== 'none') {
                const days = program.schedule.split(',');
                if (days.includes(dayShort)) {
                    const scheduleInfo = ELITE_SCHEDULES[program.value];
                    eliteActivity = {
                        name: program.label,
                        time: scheduleInfo ? scheduleInfo.time : '16:00-17:00',
                        type: 'elite'
                    };
                }
            }
        });
        
        // 如果有精英项目，显示精英项目；否则显示CCA
        let activity = eliteActivity;
        if (!activity && selectedCCAs[day]) {
            if (selectedCCAs[day].isOptOut) {
                activity = {
                    name: '不参加 Opt-out',
                    time: '16:00-17:00',
                    type: 'optout'
                };
            } else if (!selectedCCAs[day].blocked) {
                activity = {
                    name: selectedCCAs[day].name,
                    time: '16:00-17:00',
                    type: 'cca'
                };
            }
        }
        
        previewHTML += `
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h4 style="color: #1a2332; margin-bottom: 1rem; font-size: 1.125rem; font-weight: 600;">${dayNames[day]}</h4>
                <div style="color: #4a5568;">
                    ${activity ? `
                        <div style="margin-bottom: 0.5rem;">
                            <strong style="color: ${activity.type === 'optout' ? '#d97706' : '#8b2635'};">${activity.time}</strong><br>
                            <span style="font-size: 1rem;">${activity.type === 'elite' ? '🏆' : activity.type === 'optout' ? '🚫' : '📚'} ${activity.name}</span>
                        </div>
                    ` : `
                        <div style="color: #cbd5e0; text-align: center; padding: 1rem 0;">
                            休息 Rest
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
    showSuccessMessage('课程选择已成功提交！');
    
    // 3秒后返回主页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    updateStepDisplay();
    
    // 监听年级选择变化
    const gradeSelect = document.getElementById('student-grade');
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            filterEliteProgramsByGrade(this.value);
        });
    }
    
    // 监听精英项目选择变化
    document.querySelectorAll('input[name="elite-sports"], input[name="music"], input[name="academic"], input[name="hub"], input[name="math"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateConflictWarnings();
        });
    });
});

// 根据年级过滤精英项目
function filterEliteProgramsByGrade(grade) {
    if (!grade) return;
    
    document.querySelectorAll('input[name="elite-sports"], input[name="music"], input[name="academic"], input[name="hub"], input[name="math"]').forEach(checkbox => {
        const allowedGrades = checkbox.dataset.grades ? checkbox.dataset.grades.split(',') : [];
        const card = checkbox.closest('.checkbox-card');
        
        if (allowedGrades.length === 0 || allowedGrades.includes(grade)) {
            card.style.display = 'flex';
            checkbox.disabled = false;
        } else {
            card.style.display = 'none';
            checkbox.disabled = true;
            checkbox.checked = false;
        }
    });
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
            <h4 style="color: #dc2626; margin-bottom: 0.5rem;">⚠️ 时间冲突提醒</h4>
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
                mon: '周一',
                tue: '周二',
                wed: '周三',
                thu: '周四',
                fri: '周五'
            };
            conflicts.push(`${dayNames[day]}：${scheduleMap[day].join(' 与 ')} 时间冲突`);
        }
    });
    
    return conflicts;
}

// 生成报名指引预览
function generateRegistrationGuidePreview() {
    const container = document.getElementById('registration-steps-preview');
    if (!container) return;
    
    const steps = [];
    
    // 检查是否有精英体育项目
    const hasSports = selectedElitePrograms.some(p => p.category === 'sports');
    if (hasSports) {
        steps.push({
            icon: '⚽',
            title: '精英体育校队报名',
            description: '填写精英体育报名表，等待体育部负责老师联系确认选拔时间',
            buttonText: '填写精英体育报名表 →',
            buttonUrl: 'https://harrownanning-est.feishu.cn/share/base/form/shrcnCAHxjkVeIqUdu9b2NLGzBe'
        });
    }
    
    // 检查是否有音乐学院项目
    const hasMusic = selectedElitePrograms.some(p => p.category === 'music');
    if (hasMusic) {
        steps.push({
            icon: '🎵',
            title: '哈罗音乐学院报名',
            description: '填写音乐学院报名表，选择合适的上课时间',
            buttonText: '填写音乐学院报名表 →',
            buttonUrl: 'https://harronnanning-est.feishu.cn/share/base/form/shrcn7k4bm3JYJZM5AzcQWSvcOq'
        });
    }
    
    // 检查是否有辩论队
    const hasDebate = selectedElitePrograms.some(p => p.value === 'debate');
    if (hasDebate) {
        steps.push({
            icon: '🗣️',
            title: '"以言论道"思辨社报名',
            description: '在企业微信上联系辩论队教练组：欧老师 Kasey Ou（中文教育组组长）、谭老师 Lily Tan（高年级）、梁老师 Nicky Liang（小学部）',
            buttonText: '记住联系方式',
            buttonAction: 'showDebateContact'
        });
    }
    
    // 检查是否有其他学术竞赛项目
    const hasOtherAcademic = selectedElitePrograms.some(p => p.category === 'academic' && p.value !== 'debate');
    if (hasOtherAcademic) {
        steps.push({
            icon: '🏆',
            title: '学术竞赛队伍报名',
            description: '联系拓展部负责老师：唐齐昌 Ryan Tang 或 陈老师 Yackey Chen',
            buttonText: '查看联系方式（见页面底部）',
            buttonAction: 'scrollToContact'
        });
    }
    
    // 检查宏博中心项目
    const hasEnglishFoundation = selectedElitePrograms.some(p => p.value === 'english-foundation');
    const hasIELTS = selectedElitePrograms.some(p => p.value === 'ielts-advanced');
    if (hasEnglishFoundation || hasIELTS) {
        steps.push({
            icon: '📖',
            title: '宏博中心课程报名',
            description: '在企业微信上联系 龚安琪 Angel Gong 老师',
            buttonText: '记住联系方式',
            buttonAction: 'showHubContact'
        });
    }
    
    // 检查数学支持
    const hasMathSupport = selectedElitePrograms.some(p => p.value === 'math-support');
    if (hasMathSupport) {
        steps.push({
            icon: '🔢',
            title: '中文数学支持课程报名',
            description: '在企业微信上联系 唐齐昌 Ryan Tang 老师',
            buttonText: '记住联系方式',
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
            title: 'CCA 课程报名',
            description: '登录 SchoolsBuddy 系统完成报名',
            buttonText: '登录 SchoolsBuddy →',
            buttonUrl: 'https://accounts.schoolsbuddy.cn/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3Dspa%26state%3Dcn4tTFhlR2dUeERCa0UuOEVGZjdONEtLaG8tazd0X2dXMW9pUkFOcTRGaUE1%26redirect_uri%3Dhttps%253A%252F%252Fharronnanning.schoolsbuddy.cn%26scope%3Dopenid%2520profile%2520coreAPI%2520offline_access%2520email%26code_challenge%3DEaCh8G7NXRXF8kroWfkmuGBpxx26-56x9dxuOTemyy0%26code_challenge_method%3DS256%26nonce%3Dcn4tTFhlR2dUeERCa0UuOEVGZjdONEtLaG8tazd0X2dXMW9pUkFOcTRGaUE1',
            loginGuide: true
        });
    }
    
    // 渲染步骤
    let html = '<div style="display: grid; gap: 1.5rem;">';
    steps.forEach((step, index) => {
        // 如果是CCA报名，使用特殊的整合布局
        if (step.loginGuide) {
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
                                    <h5 style="color: #92400e; margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600;">登录提示</h5>
                                    
                                    <!-- 步骤1：进入登录页面 -->
                                    <div style="margin-bottom: 1rem;">
                                        <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                            <span style="display: inline-block; background: #92400e; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.75rem; margin-right: 0.5rem;">1</span>
                                            进入 SchoolsBuddy 登录页面后
                                        </p>
                                        <div style="background: rgba(255,255,255,0.6); padding: 0.75rem; border-radius: 6px; margin-left: 1.75rem;">
                                            <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem;">
                                                在页面<strong>最下方</strong>找到并点击：
                                            </p>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; background: #7b3f8f; padding: 0.5rem 0.75rem; border-radius: 6px; width: fit-content;">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                                                    <text x="12" y="16" text-anchor="middle" fill="#7b3f8f" font-size="10" font-weight="bold">iS</text>
                                                </svg>
                                                <span style="color: white; font-weight: 600; font-size: 0.875rem;">iSAMS 登录</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- 步骤2：选择家长登录 -->
                                    <div style="margin-bottom: 1rem;">
                                        <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                            <span style="display: inline-block; background: #92400e; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.75rem; margin-right: 0.5rem;">2</span>
                                            选择登录类型
                                        </p>
                                        <div style="background: rgba(255,255,255,0.6); padding: 0.75rem; border-radius: 6px; margin-left: 1.75rem;">
                                            <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem;">
                                                点击 <strong style="color: #92400e;">ISAMS (Parents)</strong> 按钮进入家长登录页面
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <!-- 步骤3：输入登录信息 -->
                                    <div style="margin-bottom: 0.75rem;">
                                        <p style="color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                            <span style="display: inline-block; background: #92400e; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.75rem; margin-right: 0.5rem;">3</span>
                                            输入您的登录信息
                                        </p>
                                        <ul style="color: #78350f; margin: 0; padding-left: 3rem; font-size: 0.875rem; line-height: 1.6;">
                                            <li><strong>用户名：</strong>您用来注册的邮箱（例如：1234567890@qq.com）</li>
                                            <li><strong>密码：</strong>您注册设置的密码</li>
                                        </ul>
                                    </div>
                                    
                                    <p style="color: #92400e; margin: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.6); border-radius: 6px;">
                                        <span>💡</span>
                                        <span>如忘记密码请联系学校IT部门企业微信帐号：<strong>ITHelpDesk</strong> 重置</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 登录按钮部分 -->
                        <div style="padding: 1rem;">
                            <button onclick="window.open('${step.buttonUrl}', '_blank')" 
                                    style="width: 100%; padding: 1rem 1.5rem; background: linear-gradient(135deg, #152242 0%, #1e3158 100%); color: white; border: none; border-radius: 8px; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(21, 34, 66, 0.3); display: flex; align-items: center; justify-content: center; gap: 0.5rem; position: relative;">
                                <span style="position: relative; z-index: 2;">登录 SchoolsBuddy</span>
                                <span style="font-size: 1.25rem; position: relative; z-index: 2;">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 其他步骤使用原来的布局
            const buttonHtml = step.buttonUrl 
                ? `<button onclick="window.open('${step.buttonUrl}', '_blank')" style="width: 100%; padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #152242 0%, #1e3158 100%); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(21, 34, 66, 0.3); position: relative;"><span style="position: relative; z-index: 2;">${step.buttonText}</span></button>`
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
        html = '<div style="text-align: center; padding: 2rem; color: #9ca3af;">您没有需要额外报名的项目</div>';
    }
    
    container.innerHTML = html;
}

// 辅助函数
function showDebateContact() {
    alert('请在企业微信上联系辩论队教练组：\n\n【中文教育组组长】\n欧老师 Kasey Ou\n\n【高年级教练】\n谭老师 Lily Tan\n\n【小学部教练】\n梁老师 Nicky Liang\n\n请根据您的年级联系对应的教练老师');
}

function showHubContact() {
    alert('请在企业微信上联系：\n\n龚安琪 Angel Gong 老师\n\n说明您需要的课程（英语基础/雅思进阶）');
}

function showMathContact() {
    alert('请在企业微信上联系：\n\n唐齐昌 Ryan Tang 老师\n\n说明您需要中文数学支持课程');
}

function scrollToContact() {
    alert('请查看页面底部的拓展部联系方式');
}
