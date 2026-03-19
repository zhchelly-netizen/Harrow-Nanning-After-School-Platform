# CCA课程数据更新指南

## 快速更新步骤

### 1. 更新CCA课程列表

编辑文件：`scripts/cca-data.js`

找到 `CCA_COURSES` 对象，按照以下格式添加或修改课程：

```javascript
const CCA_COURSES = {
    monday: [
        { 
            id: 'mon-1',                    // 唯一ID
            name: '课程名称',                // 课程名称
            teacher: '教师姓名',             // 教师姓名
            grades: ['G1','G2','G3'],       // 适用年级
            fee: '¥0',                      // 费用（¥0 / ¥500 / ¥1,000 / 定制课包）
            category: 'academic',           // 类别（academic/sports/arts/leadership）
            inviteOnly: false               // 是否邀请制（可选，默认false）
        }
    ],
    tuesday: [...],
    wednesday: [...],
    thursday: [...],
    friday: [...]
};
```

### 2. 课程类别说明

- **academic**: 学术支持与竞赛类
- **sports**: 精英体育与校队
- **arts**: 艺术与音乐学院
- **leadership**: 综合兴趣与领导力

### 3. 年级代码

使用以下年级代码：
- G1, G2, G3, G4, G5（小学）
- G6, G7, G8, G9, G10, G11, G12（中学）

### 4. 费用标注

- `¥0` - 免费课程
- `¥500` - 固定费用500元
- `¥1,000` - 固定费用1000元
- `定制课包` - 根据课时量定制

### 5. 邀请制课程

如果课程需要邀请或选拔，添加：
```javascript
inviteOnly: true
```

学生点击时会提示"此课程为邀请制，请联系老师"

---

## 从Excel导入数据

如果您有Excel格式的课程列表，可以按照以下步骤转换：

### Excel表格格式示例

| 课程名称 | 教师 | 费用 | 地点 | 年级 | 星期 |
|---------|------|------|------|------|------|
| 创意写作 | Ms. Johnson | ¥0 | A101 | G6-G12 | 周一 |

### 转换步骤

1. **确定星期**
   - 周一 → monday
   - 周二 → tuesday
   - 周三 → wednesday
   - 周四 → thursday
   - 周五 → friday

2. **转换年级**
   - G6-G12 → ['G6','G7','G8','G9','G10','G11','G12']
   - G1-G5 → ['G1','G2','G3','G4','G5']

3. **生成ID**
   - 格式：`星期缩写-序号`
   - 例如：mon-1, tue-2, wed-3

4. **确定类别**
   - 根据课程性质选择：academic/sports/arts/leadership

### 批量转换工具（Python脚本）

```python
import pandas as pd
import json

# 读取Excel
df = pd.read_excel('CCA课程列表.xlsx')

# 星期映射
day_map = {
    '周一': 'monday',
    '周二': 'tuesday',
    '周三': 'wednesday',
    '周四': 'thursday',
    '周五': 'friday'
}

# 转换数据
cca_courses = {day: [] for day in day_map.values()}

for idx, row in df.iterrows():
    day = day_map[row['星期']]
    
    # 解析年级范围
    grade_range = row['年级']
    if '-' in grade_range:
        start, end = grade_range.replace('G', '').split('-')
        grades = [f'G{i}' for i in range(int(start), int(end)+1)]
    else:
        grades = [grade_range]
    
    course = {
        'id': f"{day[:3]}-{len(cca_courses[day])+1}",
        'name': row['课程名称'],
        'teacher': row['教师'],
        'grades': grades,
        'fee': row['费用'],
        'category': row.get('类别', 'academic')
    }
    
    if row.get('邀请制') == '是':
        course['inviteOnly'] = True
    
    cca_courses[day].append(course)

# 输出JavaScript格式
print("const CCA_COURSES = " + json.dumps(cca_courses, ensure_ascii=False, indent=4) + ";")
```

---

## 常见问题

### Q1: 如何添加新的一天（如周六课程）？

在 `CCA_COURSES` 中添加：
```javascript
saturday: [
    { id: 'sat-1', name: '周六课程', ... }
]
```

然后在 `cca-planning.html` 中添加对应的显示列。

### Q2: 如何设置课程容量限制？

在课程对象中添加：
```javascript
{
    id: 'mon-1',
    name: '创意写作',
    capacity: 20,        // 最大容量
    enrolled: 15         // 已报名人数
}
```

需要配合后端API实现实时容量检查。

### Q3: 如何标记课程为"已满"？

添加 `full: true` 属性：
```javascript
{
    id: 'mon-1',
    name: '创意写作',
    full: true
}
```

在渲染时检查此属性并禁用选择。

### Q4: 如何添加课程描述？

添加 `description` 字段：
```javascript
{
    id: 'mon-1',
    name: '创意写作',
    description: '培养学生的创意写作能力，包括小说、诗歌、散文等多种文体'
}
```

可以在鼠标悬停时显示。

---

## 数据验证清单

更新数据后，请检查：

- [ ] 所有课程ID唯一
- [ ] 年级代码格式正确（G1-G12）
- [ ] 费用格式统一
- [ ] 教师姓名拼写正确
- [ ] 类别选择正确
- [ ] 邀请制标记准确
- [ ] 每天至少有一门课程（或明确标注无课程）

---

## 测试步骤

1. 保存 `cca-data.js` 文件
2. 刷新浏览器页面
3. 选择不同年级测试
4. 验证课程列表是否正确显示
5. 测试课程选择功能
6. 生成课程表图片验证

---

## 联系支持

如有问题，请联系：
- IT部门：it@harrowlide.cn
- 课程协调员：cca@harrowlide.cn

---

**最后更新：** 2026年1月19日
