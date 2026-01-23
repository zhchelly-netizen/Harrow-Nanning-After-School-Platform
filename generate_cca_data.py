#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CCA 数据生成脚本
根据Excel数据生成JavaScript数据文件
"""

# 知识领域到category的映射
KNOWLEDGE_TO_CATEGORY = {
    '音表艺术': 'music',
    '中文/人文': 'language',
    '领导力': 'club',
    '体育': 'sports',
    '数学': 'competition',
    '英语': 'language',
    '自然科学': 'competition',
    '英语/人文': 'language',
    '计算机': 'stem',
    '视觉艺术': 'arts',
    '自然/人文': 'skill',
    '音表/视觉': 'arts',
    '人文/中文': 'language',
    '计算机/体育': 'stem',
    '经济/商科': 'skill',
    '经济/英语': 'skill',
    '自然/领导力': 'club',
    '商科/自然': 'skill',
    '中文/音表': 'language',
    '音表/体育': 'sports',
    'N/A': 'skill'
}

# 星期映射
DAY_MAPPING = {
    '一': 'monday',
    '二': 'tuesday',
    '三': 'wednesday',
    '四': 'thursday',
    '五': 'friday',
    '六': 'saturday',
    '日': 'sunday',
    'MON': 'monday',
    'TUE': 'tuesday',
    'WED': 'wednesday',
    'THU': 'thursday',
    'FRI': 'friday',
    'SAT': 'saturday',
    'SUN': 'sunday'
}

def parse_grade_range(grade_str):
    """解析年级范围"""
    if not grade_str or grade_str == 'N/A':
        return []
    
    # 处理 G1-G12 格式
    if '-' in grade_str:
        parts = grade_str.split('-')
        start = int(parts[0].replace('G', ''))
        end = int(parts[1].replace('G', ''))
        return [f'G{i}' for i in range(start, end + 1)]
    
    # 处理单个年级
    return [grade_str]

def parse_day(day_str):
    """解析上课日期"""
    if not day_str or day_str == '协商':
        return []
    
    days = []
    for char in day_str:
        if char in DAY_MAPPING:
            day = DAY_MAPPING[char]
            if day not in days:
                days.append(day)
    
    return days

def get_category(knowledge):
    """获取课程分类"""
    return KNOWLEDGE_TO_CATEGORY.get(knowledge, 'skill')

def parse_fee(fee_str):
    """解析费用"""
    if not fee_str or fee_str == '免费':
        return '¥0'
    if fee_str == '自费':
        return '¥1,000'
    if fee_str == '定制':
        return '定制课包'
    if '¥' in fee_str:
        return fee_str
    return '¥0'

def is_invite_only(signup_method):
    """判断是否邀请制"""
    return signup_method in ['邀请制', '单招组织', '报名选拔']

# CCA课程数据（普通CCA）
cca_courses = {
    'monday': [],
    'tuesday': [],
    'wednesday': [],
    'thursday': [],
    'friday': []
}

# 普通CCA课程列表
普通CCA = [
    # 周一课程
    ('滑板', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '那山水', 'G1-G12'),
    ('机器魁地奇：无人机足球 (G1-5)', '计算机/体育', '一 MON', '16:00-17:00', '自费', '自由选课', '桂荣俱乐部', 'G1-G5'),
    ('机器魁地奇：无人机足球 (G6-12)', '计算机/体育', '一 MON', '16:00-17:00', '自费', '自由选课', '桂荣俱乐部', 'G6-G12'),
    ('社交舞蹈游戏', '音表艺术', '一 MON', '16:00-17:00', '自费', '自由选课', 'III舞蹈实验室', 'G1-G5'),
    ('小学部编程', '计算机', '一 MON', '16:00-17:00', '自费', '自由选课', '皮卡丘教育', 'G3-G5'),
    ('中学部编程（竞赛方向）', '计算机', '一 MON', '16:00-17:00', '自费', '自由选课', '皮卡丘教育', 'G6-G12'),
    ('小学部多元艺术', '视觉艺术', '一 MON', '16:00-17:00', '自费', '自由选课', '品象工艺品', 'G3-G5'),
    ('中学部多元艺术', '视觉艺术', '一 MON', '16:00-17:00', '自费', '自由选课', '品象工艺品', 'G6-G12'),
    ('小学部高尔夫 (校队体验营)', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '吉尔文化 Jier', 'G1-G5'),
    ('中学部高尔夫 (校队体验营)', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '吉尔文化 Jier', 'G6-G12'),
    ('小学部国际象棋', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '科世教育 Keshi', 'G1-G5'),
    ('中学部国际象棋', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '科世教育 Keshi', 'G6-G12'),
    ('小学部篮球 (校队体验营)', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '吉克篮球 Jike', 'G1-G5'),
    ('小学部匹克球', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '青奥雨露星辰', 'G1-G5'),
    ('中学部匹克球', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '青奥雨露星辰', 'G6-G12'),
    ('小学部网球 (校队体验营)', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '青奥雨露星辰', 'G1-G5'),
    ('中学部网球 (校队体验营)', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '青奥雨露星辰', 'G6-G12'),
    ('小学部围棋', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '科世教育 Keshi', 'G1-G5'),
    ('中学部围棋', '体育', '一 MON', '16:00-17:00', '自费', '自由选课', '科世教育 Keshi', 'G6-G12'),
]

print("// CCA数据生成完成")
print(f"// 共 {len(普通CCA)} 门周一课程")
