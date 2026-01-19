// ===================================
// 多语言配置文件
// ===================================

const translations = {
    zh: {
        // 通用
        'common.back': '返回主页',
        'common.next': '下一步',
        'common.prev': '上一步',
        'common.submit': '确认提交',
        'common.generate': '生成课程表图片',
        
        // 主页
        'home.title': '南宁哈罗礼德学校',
        'home.subtitle': '课后发展平台',
        'home.hero_title': '塑造卓越 · 成就未来',
        'home.cca_title': '课后课程规划',
        'home.cca_desc': '规划您的课后时间，选择精英项目或联课活动',
        'home.scholarship_title': '奖学金申请',
        'home.scholarship_desc': '了解奖学金体系，提交您的申请',
        
        // 步骤
        'steps.select_type': '选择类型',
        'steps.elite_programs': '精英项目',
        'steps.cca_selection': 'CCA选课',
        'steps.confirm': '确认提交',
        
        // CCA页面
        'cca.page_title': '课后课程规划',
        'cca.select_grade': '选择年级',
        'cca.grade': '年级',
        'cca.select_grade_placeholder': '请选择年级',
        'cca.elite_selection': '精英项目选择',
        'cca.elite_desc': '选择您希望加入的精英培养项目（可多选）',
        'cca.cca_selection': 'CCA 课程选择',
        'cca.cca_desc': '选择周一至周五 16:00-17:00 的课后联课活动',
        'cca.selection_notice': '请为每一天选择一门课程，或选择"不参加"',
        'cca.conflict_warning': '系统将自动检测与精英项目的时间冲突，仅显示可选时段',
        'cca.loading': '加载课程中...',
        'cca.blocked': '该时段已被精英项目占用',
        'cca.no_courses': '该年级暂无可选课程',
        'cca.opt_out': '不参加',
        'cca.confirm_title': '确认提交',
        'cca.confirm_desc': '请确认您的课程选择',
        'cca.student_info': '学生信息',
        'cca.schedule': '课后时间安排',
        'cca.weekly_schedule': '您的一周课后安排',
        
        // 天
        'days.monday': '周一 Monday',
        'days.tuesday': '周二 Tuesday',
        'days.wednesday': '周三 Wednesday',
        'days.thursday': '周四 Thursday',
        'days.friday': '周五 Friday',
        
        // 错误提示
        'error.select_grade': '请选择年级',
        'error.select_all_days': '请为所有工作日选择课程或"不参加"',
        'error.invite_only': '此课程为邀请制，请联系老师',
        
        // 成功提示
        'success.image_generated': '课程表图片已生成并下载！',
        'success.submitted': '课程选择已成功提交！'
    },
    
    en: {
        // Common
        'common.back': 'Back to Home',
        'common.next': 'Next',
        'common.prev': 'Previous',
        'common.submit': 'Submit',
        'common.generate': 'Generate Schedule Image',
        
        // Home
        'home.title': 'Harrow LiDe School Nanning',
        'home.subtitle': 'Co-Curricular Portal',
        'home.hero_title': 'Excellence Through Opportunity',
        'home.cca_title': 'CCA Planning',
        'home.cca_desc': 'Plan your after-school time and select elite programs or CCA activities',
        'home.scholarship_title': 'Scholarship Application',
        'home.scholarship_desc': 'Learn about our scholarship system and submit your application',
        
        // Steps
        'steps.select_type': 'Select Type',
        'steps.elite_programs': 'Elite Programs',
        'steps.cca_selection': 'CCA Selection',
        'steps.confirm': 'Confirm',
        
        // CCA Page
        'cca.page_title': 'Co-Curricular Activities Planning',
        'cca.select_grade': 'Select Grade',
        'cca.grade': 'Grade',
        'cca.select_grade_placeholder': 'Please select grade',
        'cca.elite_selection': 'Elite Programs Selection',
        'cca.elite_desc': 'Select elite programs you wish to join (multiple selections allowed)',
        'cca.cca_selection': 'CCA Course Selection',
        'cca.cca_desc': 'Select after-school activities for Monday to Friday 16:00-17:00',
        'cca.selection_notice': 'Please select a course for each day, or choose "Opt-out"',
        'cca.conflict_warning': 'System will automatically detect time conflicts with elite programs',
        'cca.loading': 'Loading courses...',
        'cca.blocked': 'This time slot is occupied by elite programs',
        'cca.no_courses': 'No courses available for this grade',
        'cca.opt_out': 'Opt-out',
        'cca.confirm_title': 'Confirm Submission',
        'cca.confirm_desc': 'Please confirm your course selection',
        'cca.student_info': 'Student Information',
        'cca.schedule': 'After-School Schedule',
        'cca.weekly_schedule': 'Your Weekly Schedule',
        
        // Days
        'days.monday': 'Monday',
        'days.tuesday': 'Tuesday',
        'days.wednesday': 'Wednesday',
        'days.thursday': 'Thursday',
        'days.friday': 'Friday',
        
        // Errors
        'error.select_grade': 'Please select a grade',
        'error.select_all_days': 'Please select a course or "Opt-out" for all weekdays',
        'error.invite_only': 'This course is by invitation only. Please contact the teacher.',
        
        // Success
        'success.image_generated': 'Schedule image generated and downloaded!',
        'success.submitted': 'Course selection submitted successfully!'
    }
};

// 当前语言
let currentLanguage = 'zh';

// 切换语言
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新页面文本
    updatePageLanguage();
}

// 更新页面语言
function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[currentLanguage][key];
        if (translation) {
            element.textContent = translation;
        }
    });
}

// 获取翻译
function t(key) {
    return translations[currentLanguage][key] || key;
}

// 页面加载时恢复语言设置
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'zh';
    switchLanguage(savedLang);
});
