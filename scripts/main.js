// ===================================
// 主JavaScript文件 - 通用功能
// ===================================

// 移动端手势处理 - 防止侧滑退出，改为返回上一级
(function() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwipeGesture = false;
    let isSwiping = false;
    
    // 检测是否在屏幕边缘开始滑动
    function isTouchNearEdge(x) {
        const edgeThreshold = 50; // 边缘区域宽度（像素）
        return x < edgeThreshold;
    }
    
    // 检测是否为横向滑动
    function isHorizontalSwipe() {
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);
        return deltaX > deltaY && deltaX > 30; // 至少滑动30px
    }
    
    // 检测是否为从左向右滑动（返回手势）
    function isBackSwipe() {
        return (touchEndX - touchStartX) > 50 && touchStartX < 50;
    }
    
    // 计算滑动进度
    function getSwipeProgress() {
        const delta = touchEndX - touchStartX;
        return Math.min(Math.max(delta / 100, 0), 1); // 0-1之间
    }
    
    document.addEventListener('touchstart', function(e) {
        // 忽略多点触摸
        if (e.touches.length > 1) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwipeGesture = isTouchNearEdge(touchStartX);
        isSwiping = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isSwipeGesture || e.touches.length > 1) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        // 检测是否为横向滑动
        if (isHorizontalSwipe() && touchEndX > touchStartX) {
            isSwiping = true;
            
            // 阻止默认行为（防止浏览器后退）
            if (e.cancelable) {
                e.preventDefault();
            }
            
            // 添加视觉反馈
            const progress = getSwipeProgress();
            document.body.style.transform = `translateX(${progress * 20}px)`;
            document.body.style.opacity = 1 - (progress * 0.1);
            
            // 显示返回指示器
            if (progress > 0.2) {
                document.body.classList.add('swiping-back');
            } else {
                document.body.classList.remove('swiping-back');
            }
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (!isSwipeGesture) return;
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        // 检测是否为返回手势
        if (isSwiping && isBackSwipe()) {
            if (e.cancelable) {
                e.preventDefault();
            }
            handleBackNavigation();
        } else {
            // 恢复原状
            document.body.style.transition = 'all 0.3s ease-out';
            document.body.style.transform = '';
            document.body.style.opacity = '';
            document.body.classList.remove('swiping-back');
            
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }
        
        // 重置
        isSwipeGesture = false;
        isSwiping = false;
    }, { passive: false });
    
    document.addEventListener('touchcancel', function() {
        // 恢复原状
        document.body.style.transition = 'all 0.3s ease-out';
        document.body.style.transform = '';
        document.body.style.opacity = '';
        document.body.classList.remove('swiping-back');
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        isSwipeGesture = false;
        isSwiping = false;
    });
    
    // 处理返回导航
    function handleBackNavigation() {
        // 检查当前页面
        const currentPage = window.location.pathname.split('/').pop();
        
        // 添加完整的滑出动画
        document.body.style.transition = 'all 0.3s ease-out';
        document.body.style.transform = 'translateX(100%)';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            // 如果在子页面，返回主页
            if (currentPage !== 'index.html' && currentPage !== '' && currentPage !== 'language-selection.html') {
                window.location.href = 'index.html';
            } else if (window.history.length > 1) {
                // 如果有历史记录，返回上一页
                window.history.back();
            } else {
                // 没有可返回的页面，恢复原状
                document.body.style.transform = '';
                document.body.style.opacity = '';
                document.body.classList.remove('swiping-back');
            }
        }, 300);
    }
    
    // 防止浏览器默认的后退手势
    window.addEventListener('popstate', function(e) {
        // 可以在这里添加自定义的页面切换动画
    });
})();

// 页面导航
document.addEventListener('DOMContentLoaded', function() {
    // 导航卡片点击事件
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                window.location.href = `${page}.html`;
            }
        });
    });

    // 标签切换功能
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 显示成功消息
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// 显示错误消息
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// 添加消息样式
const style = document.createElement('style');
style.textContent = `
    .success-message,
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        transition: opacity 0.3s ease-out;
    }
    
    .success-message {
        border-left: 4px solid #2d5f4f;
    }
    
    .error-message {
        border-left: 4px solid #dc2626;
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .message-content svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }
    
    .success-message svg {
        color: #2d5f4f;
    }
    
    .error-message svg {
        color: #dc2626;
    }
    
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
`;
document.head.appendChild(style);
