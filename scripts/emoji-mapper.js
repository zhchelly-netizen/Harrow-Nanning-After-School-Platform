// ===================================
// Emoji 映射系统
// 为CCA课程和精英项目提供精准的emoji图标
// ===================================

const EMOJI_MAP = {
    // 体育运动类
    '滑板': '🛹',
    'skateboarding': '🛹',
    
    '足球': '⚽',
    'football': '⚽',
    'soccer': '⚽',
    
    '篮球': '🏀',
    'basketball': '🏀',
    
    '网球': '🎾',
    'tennis': '🎾',
    
    '羽毛球': '🏸',
    'badminton': '🏸',
    
    '游泳': '🏊',
    'swimming': '🏊',
    
    '高尔夫': '⛳',
    'golf': '⛳',
    
    '马术': '🏇',
    'equestrian': '🏇',
    
    '花样滑冰': '⛸️',
    'skating': '⛸️',
    
    '匹克球': '🏓',
    'pickle ball': '🏓',
    'pickleball': '🏓',
    
    '飞盘': '🥏',
    'frisbee': '🥏',
    
    '自由搏击': '🥊',
    'boxing': '🥊',
    
    '艺术体操': '🤸',
    'art gymnastics': '🤸',
    'gymnastics': '🤸',
    
    // 舞蹈类
    '舞蹈': '💃',
    'dance': '💃',
    '社交舞蹈': '💃',
    'social dance': '💃',
    
    // 棋类
    '国际象棋': '♟️',
    'chess': '♟️',
    
    '围棋': '⚫',
    'go': '⚫',
    'weiqi': '⚫',
    
    // 科技类
    '编程': '💻',
    'programming': '💻',
    'programing': '💻',
    
    '无人机': '🚁',
    'drone': '🚁',
    '机器魁地奇': '🚁',
    'robo quidditch': '🚁',
    
    '机器人': '🤖',
    'robot': '🤖',
    'lego robot': '🤖',
    
    '3d建模': '🧑‍💻',
    '3d modeling': '🧑‍💻',
    'thinker': '🧑‍💻',
    
    // 艺术类
    '绘画': '🎨',
    'drawing': '🎨',
    'painting': '🎨',
    '三维立体人物绘画': '🎨',
    '3d character drawing': '🎨',
    
    '多元艺术': '🎨',
    'multi-craft arts': '🎨',
    
    '墙绘': '🖼️',
    'mural': '🖼️',
    
    '书法': '✍️',
    'calligraphy': '✍️',
    '毛笔书法': '✍️',
    '硬笔书法': '✍️',
    'handwriting': '✍️',
    
    '折纸': '📄',
    'origami': '📄',
    
    '时尚设计': '👗',
    'fashion design': '👗',
    
    '摄影': '📷',
    'photographer': '📷',
    'photography': '📷',
    
    // 音乐类
    '钢琴': '🎹',
    'piano': '🎹',
    
    '小提琴': '🎻',
    'violin': '🎻',
    
    '大提琴': '🎻',
    'cello': '🎻',
    
    '吉他': '🎸',
    'guitar': '🎸',
    
    '架子鼓': '🥁',
    'drums': '🥁',
    
    '声乐': '🎤',
    'vocal': '🎤',
    '歌手': '🎤',
    'singing': '🎤',
    
    '长笛': '🎺',
    'flute': '🎺',
    
    '单簧管': '🎺',
    'clarinet': '🎺',
    
    '萨克斯': '🎷',
    'saxophone': '🎷',
    
    '管乐': '🎺',
    'brass': '🎺',
    
    '尤克里里': '🎸',
    'ukulele': '🎸',
    
    '乐队': '🎵',
    'band': '🎵',
    'pop band': '🎵',
    
    '乐理': '🎼',
    'theory': '🎼',
    'abrsm': '🎼',
    
    // 学术竞赛类
    '数学': '🔢',
    'math': '🔢',
    'maths': '🔢',
    '袋鼠数学': '🦘',
    'kangaroo': '🦘',
    
    '科学': '🔬',
    'science': '🔬',
    
    '化学': '⚗️',
    'chemistry': '⚗️',
    
    '物理': '⚛️',
    'physics': '⚛️',
    
    '信息学': '💾',
    'informatics': '💾',
    
    // 语言类
    '英语': '📖',
    'english': '📖',
    'cambridge english': '📖',
    
    '演讲': '🎙️',
    'speaking': '🎙️',
    'public speaking': '🎙️',
    'lamda': '🎙️',
    
    '阅读': '📚',
    'reading': '📚',
    
    '写作': '✏️',
    'writing': '✏️',
    
    '古诗词': '📜',
    'poetry': '📜',
    
    '中文': '🀄',
    'chinese': '🀄',
    
    // 商业与社会类
    '企业家': '💼',
    'entrepreneur': '💼',
    
    '财商': '💰',
    'cashflow': '💰',
    'business': '💰',
    
    '经济学': '📊',
    'economic': '📊',
    
    '模联': '🇺🇳',
    'model un': '🇺🇳',
    'mun': '🇺🇳',
    
    '世界学者杯': '🏆',
    'wsc': '🏆',
    'world scholar': '🏆',
    
    '学生会': '🎓',
    'student council': '🎓',
    
    '爱丁堡': '🎖️',
    'dofe': '🎖️',
    'duke of edinburgh': '🎖️',
    
    '萌爪之家': '🐾',
    '流浪动物': '🐾',
    'house of paws': '🐾',
    'animal adoption': '🐾',
    
    // 文化与手工类
    '乐高': '🧱',
    'lego': '🧱',
    
    '非遗': '🏮',
    'heritage': '🏮',
    'intangible culture': '🏮',
    
    // 媒体类
    '电影': '🎬',
    'film': '🎬',
    'movie': '🎬',
    
    '动画': '🎞️',
    'animation': '🎞️',
    'stop animation': '🎞️',
    
    // 其他
    '地理': '🌋',
    'geography': '🌋',
    
    '键盘': '⌨️',
    'keyboard': '⌨️',
    'typing': '⌨️',
    
    '常春藤杯': '🌲',
    'ivy cup': '🌲',
    
    '河马英语': '🦛',
    'hippo': '🦛',
    
    '支持': '📝',
    'support': '📝'
};

/**
 * 根据课程名称获取对应的emoji
 * @param {string} name - 课程名称（中文或英文）
 * @param {string} nameEn - 英文名称（可选）
 * @param {string} category - 课程类别（可选）
 * @returns {string} - 对应的emoji，如果找不到则返回默认emoji
 */
function getEmojiForCourse(name, nameEn = '', category = '') {
    // 转换为小写以便匹配
    const nameLower = name.toLowerCase();
    const nameEnLower = nameEn.toLowerCase();
    
    // 首先尝试精确匹配
    if (EMOJI_MAP[nameLower]) {
        return EMOJI_MAP[nameLower];
    }
    
    if (nameEnLower && EMOJI_MAP[nameEnLower]) {
        return EMOJI_MAP[nameEnLower];
    }
    
    // 尝试部分匹配（关键词匹配）
    for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
        if (nameLower.includes(key) || nameEnLower.includes(key)) {
            return emoji;
        }
    }
    
    // 根据类别返回默认emoji
    const categoryDefaults = {
        'skill': '🎯',
        'competition': '🏆',
        'support': '📝',
        'club': '👥',
        'scouting': '🔍',
        'sports': '⚽',
        'music': '🎵',
        'academic': '📚'
    };
    
    if (category && categoryDefaults[category]) {
        return categoryDefaults[category];
    }
    
    // 最终默认emoji
    return '✨';
}

/**
 * 为CCA课程数据添加emoji
 * @param {Object} ccaCourses - CCA课程数据对象
 * @returns {Object} - 添加了emoji的课程数据
 */
function addEmojiToCourses(ccaCourses) {
    const enrichedCourses = {};
    
    for (const [day, courses] of Object.entries(ccaCourses)) {
        enrichedCourses[day] = courses.map(course => ({
            ...course,
            emoji: getEmojiForCourse(course.name, course.nameEn, course.category)
        }));
    }
    
    return enrichedCourses;
}

/**
 * 更新HTML中的emoji标签
 * @param {string} selector - CSS选择器
 */
function updateEmojiInHTML(selector = '.checkbox-content strong') {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        const text = element.textContent.trim();
        
        // 如果已经有emoji，先移除
        const textWithoutEmoji = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
        
        // 获取新的emoji
        const emoji = getEmojiForCourse(textWithoutEmoji, '', '');
        
        // 更新内容
        element.textContent = `${emoji} ${textWithoutEmoji}`;
    });
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EMOJI_MAP,
        getEmojiForCourse,
        addEmojiToCourses,
        updateEmojiInHTML
    };
}
