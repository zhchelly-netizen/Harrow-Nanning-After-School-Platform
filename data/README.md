# 数据文件说明

本目录包含项目的数据源文件和生成工具。

## 📊 数据文件

### CCA 课程数据

**文件**: `CCA 文档_Parent's 25-26 S2 CCA List (2).xlsx`
- **用途**: CCA课程列表数据源
- **格式**: Excel文件
- **更新频率**: 每学期
- **内容**: 课程名称、时间、教师、容量等

**文件**: `15231846_202408291617576221.numbers`
- **用途**: Numbers格式的课程数据
- **格式**: Numbers文件（Apple格式）

---

## 🔧 工具脚本

### generate_cca_data.py

**用途**: 从Excel文件生成JavaScript课程数据

**使用方法**:
```bash
python3 data/generate_cca_data.py
```

**输入**: `CCA 文档_Parent's 25-26 S2 CCA List (2).xlsx`

**输出**: `scripts/cca-data.js`

---

## 📝 临时文件

### elite-programs-updated.html

**用途**: 精英项目页面的更新版本（临时）

**状态**: 待确认是否合并到主文件

---

## 🔄 数据更新流程

1. 更新Excel文件 `CCA 文档_Parent's 25-26 S2 CCA List (2).xlsx`
2. 运行生成脚本 `python3 data/generate_cca_data.py`
3. 验证生成的 `scripts/cca-data.js`
4. 测试网页功能
5. 提交更改

---

## ⚠️ 注意事项

- **不要修改生成的JS文件**: 所有数据修改应在Excel中进行
- **保持数据格式一致**: Excel文件必须遵循既定格式
- **备份原始数据**: 更新前备份Excel文件

---

*最后更新: 2026-03-18*