// ===================================
// CCA 课程数据配置文件
// 南宁哈罗礼德学校 25-26 S2 课程列表
// ===================================

const CCA_COURSES = {
    // 周一课程
    monday: [
        { id: 'mon-1', name: '滑板', nameEn: 'Skateboarding', teacher: '那山水', grades: ['G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '🛹' },
        { id: 'mon-2', name: '机器魁地奇：无人机足球 (G1-5)', nameEn: 'Robo Quidditch: Drone Football (G1-5)', teacher: '桂荣俱乐部', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '🚁' },
        { id: 'mon-3', name: '机器魁地奇：无人机足球 (G6-12)', nameEn: 'Robo Quidditch: Drone Football (G6-12)', teacher: '桂荣俱乐部', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '🚁' },
        { id: 'mon-4', name: '社交舞蹈游戏', nameEn: 'Social Dance Games', teacher: 'III DanceLab', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '💃' },
        { id: 'mon-5', name: '小学部编程', nameEn: 'Programing (Primary)', teacher: '皮卡丘', grades: ['G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '💻' },
        { id: 'mon-6', name: '中学部编程', nameEn: 'Programing (Upper)', teacher: '皮卡丘', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '💻' },
        { id: 'mon-7', name: '小学部多元艺术', nameEn: 'Multi-craft Arts (Primary)', teacher: '品象', grades: ['G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '🎨' },
        { id: 'mon-8', name: '中学部多元艺术', nameEn: 'Multi-craft Arts (Upper)', teacher: '品象', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '🎨' },
        { id: 'mon-9', name: '小学部高尔夫', nameEn: 'Golf (Primary)', teacher: '吉尔', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'scouting', emoji: '⛳' },
        { id: 'mon-10', name: '中学部高尔夫', nameEn: 'Golf (Upper)', teacher: '吉尔', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'scouting', emoji: '⛳' },
        { id: 'mon-11', name: '小学部篮球 (体验)', nameEn: 'Basketball (Primary)', teacher: '吉克', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'scouting', emoji: '🏀' },
        { id: 'mon-12', name: '小学部匹克球', nameEn: 'Pickle Ball (Primary)', teacher: '青奥', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '🏓' },
        { id: 'mon-13', name: '中学部匹克球', nameEn: 'Pickle Ball (Upper)', teacher: '青奥', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '🏓' },
        { id: 'mon-14', name: '小学部网球 (体验)', nameEn: 'Tennis (Primary)', teacher: '青奥', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'scouting', emoji: '🎾' },
        { id: 'mon-15', name: '中学部网球 (体验)', nameEn: 'Tennis (Upper)', teacher: '青奥', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'scouting', emoji: '🎾' },
        { id: 'mon-16', name: '小学部围棋', nameEn: 'GO (Primary)', teacher: '科世', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '⚫' },
        { id: 'mon-17', name: '中学部围棋', nameEn: 'GO (Upper)', teacher: '科世', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '⚫' }
    ],

    // 周二课程
    tuesday: [
        { id: 'tue-1', name: '袋鼠数学 (中学初级)', nameEn: 'Math Kangaroo (Upper)', teacher: 'Nathan Quain', grades: ['G5','G6','G7','G8'], fee: '¥0', category: 'competition', emoji: '🔢' },
        { id: 'tue-2', name: '科学知识挑战训练营', nameEn: 'Science Bee', teacher: 'Amy Luo', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'competition', emoji: '🔬' },
        { id: 'tue-3', name: '英语畅读 (G9+)', nameEn: 'English Reading', teacher: 'Jenny Tang', grades: ['G9','G10','G11','G12'], fee: '¥0', category: 'support', emoji: '📖' },
        { id: 'tue-4', name: '高中部物理支持', nameEn: 'Physics Support (Senior)', teacher: 'Godwine Okochi', grades: ['G9','G10','G11','G12'], fee: '¥0', category: 'support', emoji: '⚛️' },
        { id: 'tue-5', name: '剑桥英语考级 (中学)', nameEn: 'Cambridge English (Upper)', teacher: 'Nathanael Lucchi', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥500', category: 'competition', emoji: '📖' },
        { id: 'tue-6', name: '3D建模与设计', nameEn: '3D Modeling & Design in ThinkerCAD', teacher: 'Mohamed Kisten', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '🎨' },
        { id: 'tue-7', name: '中国毛笔书法', nameEn: 'Chinese Calligraphy', teacher: 'Chloe Huang', grades: ['G1','G2','G3','G4','G5'], fee: '¥500', category: 'skill', emoji: '✍️' },
        { id: 'tue-8', name: '小学部企业家俱乐部', nameEn: 'Entrepreneurs Club (Primary)', teacher: 'Lining H, Joyce L', grades: ['G3','G4','G5'], fee: '¥0', category: 'club', emoji: '💼' },
        { id: 'tue-9', name: '中学部企业家俱乐部', nameEn: 'Entrepreneurs Club (Upper)', teacher: 'Liam Moulton', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'club', emoji: '💼' },
        { id: 'tue-10', name: '古诗词鉴赏', nameEn: 'Chinese Poetry Appreciation', teacher: 'Stacy Ling', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '📜' },
        { id: 'tue-11', name: '趣味乐高积木', nameEn: 'Fun LEGO', teacher: 'Sue Liang', grades: ['G1','G2','G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🧱' },
        { id: 'tue-12', name: '三维立体人物绘画', nameEn: '3D Character Drawing', teacher: 'Christopher Booth', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🎨' },
        { id: 'tue-13', name: '小学部流行乐队', nameEn: 'Pop Band (Primary)', teacher: 'Andrew Gardner', grades: ['G2','G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🎵' },
        { id: 'tue-14', name: '小学部羽毛球 (体验)', nameEn: 'Badminton (Primary)', teacher: '青奥', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'scouting', emoji: '🏸' },
        { id: 'tue-15', name: '中学部羽毛球 (体验)', nameEn: 'Badminton (Upper)', teacher: '青奥', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'scouting', emoji: '🏸' },
        { id: 'tue-16', name: '折纸艺术', nameEn: 'Origami', teacher: 'Leon Li', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '📄' },
        { id: 'tue-17', name: '美国英语大联盟', nameEn: 'American Language League', teacher: 'Zinhle Sibisi', grades: ['G1','G2'], fee: '¥0', category: 'skill', emoji: '📖' },
        { id: 'tue-18', name: '信息学竞赛 (G1-4)', nameEn: 'Informatics Competition (G1-4)', teacher: '纬世', grades: ['G1','G2','G3','G4'], fee: '¥1,000', category: 'competition', emoji: '💾' },
        { id: 'tue-19', name: '信息学竞赛 (G5-8)', nameEn: 'Informatics Competition (G5-8)', teacher: '纬世', grades: ['G5','G6','G7','G8'], fee: '¥1,000', category: 'competition', emoji: '💾' },
        { id: 'tue-20', name: '学生会 (小学)', nameEn: 'Student Council (Primary)', teacher: 'Colin Hulshof', grades: ['G1','G2','G3','G4','G5'], fee: '¥0', category: 'club', emoji: '🎓', inviteOnly: true },
        { id: 'tue-21', name: '英皇乐理支持', nameEn: 'ABRSM Theory Support', teacher: 'Charles Elly', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'support', emoji: '🎼' }
    ],

    // 周三课程
    wednesday: [
        { id: 'wed-1', name: 'STEP数学考试支持', nameEn: 'STEP Math Support', teacher: 'Robert Adeoba', grades: ['G9','G10','G11','G12'], fee: '¥0', category: 'support', emoji: '🔢', inviteOnly: true },
        { id: 'wed-2', name: '国际化学知识竞赛', nameEn: 'International Chemistry Quiz', teacher: 'Sohaib Qureshi', grades: ['G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'competition', emoji: '⚗️' },
        { id: 'wed-3', name: '哈罗最强大脑 (G3-6)', nameEn: 'Advanced Math Competition (G3-G6)', teacher: '纬世', grades: ['G3','G4','G5','G6'], fee: '¥1,000', category: 'competition', emoji: '🔢' },
        { id: 'wed-4', name: '哈罗最强大脑 (G7-10)', nameEn: 'Advanced Math Competition (G7-G10)', teacher: '纬世', grades: ['G7','G8','G9','G10'], fee: '¥1,000', category: 'competition', emoji: '🔢' },
        { id: 'wed-5', name: 'LAMDA公共演讲 (中学)', nameEn: 'LAMDA Public Speaking (Upper)', teacher: '纬世', grades: ['G6','G7','G8'], fee: '¥1,000', category: 'competition', emoji: '🎙️' },
        { id: 'wed-6', name: '世界学者杯与模联', nameEn: 'WSC & Model UN', teacher: 'Angel, Chelsea', grades: ['G4','G5','G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'competition', emoji: '🌍' },
        { id: 'wed-7', name: '剑桥英语考级 (小学)', nameEn: 'Cambridge English Exam (Primary)', teacher: 'Germano Le Roux', grades: ['G1','G2','G3','G4','G5'], fee: '¥500', category: 'competition', emoji: '📖' },
        { id: 'wed-8', name: '墙绘艺术', nameEn: 'Mural Arts', teacher: 'Colin Hulshof', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🖌️', inviteOnly: true },
        { id: 'wed-9', name: 'CASHFLOW财商启蒙', nameEn: 'CASHFLOW Business Mindset', teacher: 'Sherry Liang', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '💰' },
        { id: 'wed-10', name: '畅读俱乐部', nameEn: 'Reading Fluency Club', teacher: 'Wenny Song', grades: ['G1','G2','G3','G4'], fee: '¥0', category: 'skill', emoji: '📚' },
        { id: 'wed-11', name: '飞盘', nameEn: 'Frisbee', teacher: '那山水', grades: ['G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '🥏' },
        { id: 'wed-12', name: '小学部乐高机器人', nameEn: 'Lego Robot Programming (Primary)', teacher: '棒儿贝', grades: ['G1','G2'], fee: '¥1,000', category: 'skill', emoji: '⚫' },
        { id: 'wed-13', name: '趣味数学游戏', nameEn: 'Fun Math Games', teacher: 'Edward Marriott-Lodge', grades: ['G1','G2'], fee: '¥0', category: 'skill', emoji: '🔢' },
        { id: 'wed-14', name: '赛事编程无人机 (G3-5)', nameEn: 'Programming (G3-5)', teacher: '皮卡丘', grades: ['G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '💻' },
        { id: 'wed-15', name: '赛事编程无人机 (G6-12)', nameEn: 'Programming (G6-12)', teacher: '皮卡丘', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '💻' },
        { id: 'wed-16', name: '文学漫游指南', nameEn: 'Ms Chens Guide to the Fiction Galaxy', teacher: 'Kiki Chen', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '🎯' },
        { id: 'wed-17', name: '小歌手训练营', nameEn: 'Singing Club', teacher: 'Karen Mark', grades: ['G1','G2','G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🎤' },
        { id: 'wed-18', name: '中文演讲与口才', nameEn: 'Chinese Public Speaking', teacher: 'Nancy Yang', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🎙️' },
        { id: 'wed-19', name: '自由搏击', nameEn: 'Boxing', teacher: '爱菲尚', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '🥊' },
        { id: 'wed-20', name: '河马英语趣味挑战 (G1-2)', nameEn: 'Hippo English Challenge (G1-G2)', teacher: 'Lee Li', grades: ['G1','G2'], fee: '¥0', category: 'competition', emoji: '📖' },
        { id: 'wed-21', name: '河马英语趣味挑战 (G3-4)', nameEn: 'Hippo English Challenge (G3-G4)', teacher: 'Joanne Liang', grades: ['G3','G4'], fee: '¥0', category: 'competition', emoji: '📖' },
        { id: 'wed-22', name: '美国科学测评', nameEn: 'National Science League', teacher: 'George Odero', grades: ['G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'competition', emoji: '🔬' },
        { id: 'wed-23', name: '萌爪之家流浪动物领养中心', nameEn: 'House of Paws Animal Adoption Centre', teacher: 'Lily Yang, Chloe Chen', grades: ['G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'club', emoji: '🐾', inviteOnly: true }
    ],

    // 周四课程
    thursday: [
        { id: 'thu-1', name: '袋鼠数学 (小学初级)', nameEn: 'Math Kangaroo (Primary)', teacher: 'Connie Chen, Vivian Liang', grades: ['G1','G2','G3','G4'], fee: '¥0', category: 'competition', emoji: '🔢' },
        { id: 'thu-2', name: '高中部进阶数学支持', nameEn: 'Fast Track IGCSE Maths (Senior)', teacher: 'Steven McGowan', grades: ['G9','G10','G11','G12'], fee: '¥0', category: 'support', emoji: '🔢' },
        { id: 'thu-3', name: '平面与时尚设计 (G1-5)', nameEn: 'Fashion Design', teacher: '品象', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '👗' },
        { id: 'thu-4', name: '平面与时尚设计 (G6-12)', nameEn: 'Fashion Design', teacher: '品象', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '👗' },
        { id: 'thu-5', name: '非遗文化体验与传承', nameEn: 'Intangible Culture Heritage Experience', teacher: 'Jada Zhang', grades: ['G1','G2','G3','G4','G5'], fee: '¥500', category: 'skill', emoji: '🏮' },
        { id: 'thu-6', name: '哈罗定格动画社', nameEn: 'Stop Animation Club', teacher: 'Daria Caraus', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '🎞️' },
        { id: 'thu-7', name: '小小摄影家俱乐部', nameEn: 'Little Photographers Club', teacher: 'Matthew Law', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '📷' },
        { id: 'thu-8', name: '地理爱好者俱乐部', nameEn: 'Geography Club', teacher: 'Kenny Wong', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '🌏' },
        { id: 'thu-9', name: '电影制作', nameEn: 'Film Making', teacher: 'Thomas James', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '🎬' },
        { id: 'thu-10', name: '键盘打字技巧', nameEn: 'Keyboard Skill', teacher: 'Jeanna Fergusson', grades: ['G1','G2','G3'], fee: '¥0', category: 'skill', emoji: '⌨️' },
        { id: 'thu-11', name: '经济学写作训练营', nameEn: 'Economic Writing Camp', teacher: 'Susie Wen', grades: ['G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '✏️' },
        { id: 'thu-12', name: '硬笔书法 (G1-2)', nameEn: 'Handwriting Camp', teacher: 'Molly Guo', grades: ['G1','G2'], fee: '¥0', category: 'skill', emoji: '✍️' },
        { id: 'thu-13', name: '硬笔书法 (G3-5)', nameEn: 'Handwriting Camp', teacher: 'Goh S.M.', grades: ['G3','G4','G5'], fee: '¥0', category: 'skill', emoji: '✍️' },
        { id: 'thu-14', name: '中文数学支持 (G9)', nameEn: 'Chinese Maths Support', teacher: 'Neil Fan', grades: ['G9'], fee: '¥0', category: 'support', emoji: '🔢' },
        { id: 'thu-15', name: '中学部常春藤杯', nameEn: 'Ivy Cup (Upper)', teacher: 'Miranda, Sarah', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'competition', emoji: '🏆' },
        { id: 'thu-16', name: '戏剧社', nameEn: 'Drama Club', teacher: 'Le Roux Germano', grades: ['G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'skill', emoji: '🎭' },
        { id: 'thu-17', name: '学生会 (中学)', nameEn: 'Student Council (Secondary)', teacher: 'Brandon Cook', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥0', category: 'club', emoji: '🎓', inviteOnly: true }
    ],

    // 周五课程
    friday: [
        { id: 'fri-1', name: 'LAMDA公共演讲 (小学)', nameEn: 'LAMDA Public Speaking (Primary)', teacher: '纬世', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'competition', emoji: '🎙️' },
        { id: 'fri-2', name: '艺术体操', nameEn: 'Art Gymnastics', teacher: '可莱尔', grades: ['G1','G2','G3','G4'], fee: '¥1,000', category: 'skill', emoji: '🤸' },
        { id: 'fri-3', name: '小学部国际象棋', nameEn: 'Chess (Primary)', teacher: '科世', grades: ['G1','G2','G3','G4','G5'], fee: '¥1,000', category: 'skill', emoji: '♟️' },
        { id: 'fri-4', name: '中学部国际象棋', nameEn: 'Chess (Upper)', teacher: '科世', grades: ['G6','G7','G8','G9','G10','G11','G12'], fee: '¥1,000', category: 'skill', emoji: '♟️' }
    ]
};
