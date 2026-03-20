// ===================================
// 奖学金仪表盘 JavaScript
// Scholarship Dashboard JavaScript
// ===================================

const COUNTDOWN_DEADLINE = new Date('2026-06-12T17:00:00+08:00');

const ACTION_LINKS = {
    'leadership': '#leadership',
    'music-performing': '#music-performing',
    'visual-arts': '#visual-arts',
    'sports': '#sports',
    'academic': '#academic',
    'confirmation': '#confirmation'
};

let countdownInterval = null;
let previousValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
};

function initCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date();
    const diff = COUNTDOWN_DEADLINE - now;

    if (diff <= 0) {
        clearInterval(countdownInterval);
        setCountdownValues(0, 0, 0, 0);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdownValues(days, hours, minutes, seconds);
}

function setCountdownValues(days, hours, minutes, seconds) {
    const elements = {
        days: document.getElementById('countdown-days'),
        hours: document.getElementById('countdown-hours'),
        minutes: document.getElementById('countdown-minutes'),
        seconds: document.getElementById('countdown-seconds')
    };

    const values = { days, hours, minutes, seconds };

    Object.keys(elements).forEach(key => {
        const el = elements[key];
        const value = values[key];

        if (el) {
            const formattedValue = String(value).padStart(2, '0');
            if (previousValues[key] !== formattedValue) {
                el.textContent = formattedValue;
                el.classList.add('updating');
                setTimeout(() => el.classList.remove('updating'), 300);
                previousValues[key] = formattedValue;
            }
        }
    });
}

function toggleArtsSubmenu(button) {
    const wrapper = button.closest('.arts-wrapper');
    if (wrapper) {
        wrapper.classList.toggle('expanded');
    }
}

function handleActionClick(action) {
    const url = ACTION_LINKS[action] || '#';

    if (url !== '#') {
        window.open(url, '_blank');
    } else {
        showComingSoonNotice(action);
    }
}

function handleFinalConfirmation() {
    const url = ACTION_LINKS['confirmation'];

    if (url !== '#') {
        window.open(url, '_blank');
    } else {
        showComingSoonNotice('confirmation');
    }
}

function showComingSoonNotice(action) {
    const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh';

    const messages = {
        zh: {
            title: '功能开发中',
            message: '此功能正在开发中，敬请期待！'
        },
        en: {
            title: 'Coming Soon',
            message: 'This feature is under development. Please check back later!'
        }
    };

    const msg = messages[currentLang] || messages.zh;
    alert(`${msg.title}\n\n${msg.message}`);
}

function toggleLanguage() {
    if (typeof i18n !== 'undefined') {
        const newLang = i18n.getCurrentLanguage() === 'zh' ? 'en' : 'zh';
        i18n.setLanguage(newLang);
        i18n.updatePageLanguage();
    }
}

function initializeDashboard() {
    console.log('🎓 奖学金仪表盘开始初始化...');

    initCountdown();

    if (typeof i18n === 'undefined') {
        console.warn('⚠️ i18n not loaded, retrying...');
        setTimeout(() => {
            if (typeof i18n !== 'undefined') {
                i18n.updatePageLanguage();
                console.log('✅ i18n loaded after retry');
            }
        }, 100);
    } else {
        console.log('✅ i18n 已加载，当前语言:', i18n.getCurrentLanguage());
        i18n.updatePageLanguage();
    }

    window.addEventListener('languageChanged', () => {
        console.log('🔄 仪表盘语言已切换');
    });

    console.log('✅ 奖学金仪表盘初始化完成');
}

document.addEventListener('DOMContentLoaded', initializeDashboard);

window.toggleArtsSubmenu = toggleArtsSubmenu;
window.handleActionClick = handleActionClick;
window.handleFinalConfirmation = handleFinalConfirmation;
window.toggleLanguage = toggleLanguage;