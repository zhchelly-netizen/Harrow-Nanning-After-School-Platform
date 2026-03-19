# 项目文档索引

本目录包含南宁哈罗礼德学校课后平台的所有文档资料。

## 📚 使用指南 (Guides)

### 系统管理
- [管理员系统指南](guides/ADMIN_SYSTEM_GUIDE.md) - 管理后台使用说明
- [部署指南](guides/DEPLOYMENT_GUIDE.md) - 项目部署详细步骤
- [部署检查清单](guides/DEPLOYMENT_CHECKLIST.md) - 部署前检查事项

### 开发指南
- [多语言系统指南](guides/MULTILINGUAL_GUIDE.md) - 国际化系统使用说明
- [翻译指南](guides/TRANSLATION_GUIDE.md) - 翻译系统使用方法
- [CCA优化指南](guides/CCA_OPTIMIZATION_GUIDE.md) - CCA功能优化建议
- [奖学金国际化指南](guides/SCHOLARSHIP_I18N_GUIDE.md) - 奖学金多语言配置

### 数据管理
- [数据更新指南](guides/DATA_UPDATE_GUIDE.md) - 课程数据更新流程
- [数据更新状态](changelog/updates/DATA_UPDATE_STATUS.md) - 数据更新记录

### 问题排查
- [故障排查](guides/TROUBLESHOOTING.md) - 常见问题解决方案
- [使用本地服务器](guides/USE_LOCAL_SERVER.md) - 本地开发环境配置
- [必须使用服务器](guides/MUST_USE_SERVER.md) - 服务器访问要求

### 功能说明
- [如何修改魁地奇名称](guides/HOW_TO_CHANGE_QUIDDITCH_NAME.md) - 课程名称修改方法

---

## 📅 变更日志 (Changelog)

### 2026年1月更新
- [2026-01-24 修复记录](changelog/2026-01/FIXES_20260124.md)
- [2026-01-25 修复记录](changelog/2026-01/FIXES_20260125.md)
- [2026-01-26 修复记录](changelog/2026-01/FIXES_20260126.md)

### 功能更新
- [更新摘要 v2](changelog/updates/UPDATES_20260126_v2.md)
- [更新摘要 v3](changelog/updates/UPDATES_20260126_v3.md)
- [更新摘要 v4](changelog/updates/UPDATES_20260126_v4.md)
- [更新总结](changelog/updates/UPDATE_SUMMARY.md)

---

## 🔧 修复记录 (Fixes)

### CCA相关修复
- [CCA修复最终报告](fixes/cca/CCA_FIX_FINAL_REPORT.md)
- [CCA国际化完成](fixes/cca/CCA_I18N_COMPLETE.md)
- [CCA加载修复](fixes/cca/CCA_LOADING_FIX.md)
- [CCA切换修复](fixes/cca/CCA_TOGGLE_FIX.md)
- [CCA翻译完成](fixes/cca/CCA_TRANSLATION_COMPLETE.md)
- [CCA故障排查](fixes/cca/CCA_TROUBLESHOOTING.md)
- [步骤4冲突显示修复](fixes/cca/STEP4_CONFLICT_DISPLAY_FIX.md)
- [浮动规划器周末修复](fixes/cca/FLOATING_PLANNER_WEEKEND_FIX.md)

### 翻译相关修复
- [添加CCA翻译](fixes/translations/ADD_CCA_TRANSLATIONS.md)
- [确认页面翻译修复](fixes/translations/CONFIRM_PAGE_TRANSLATION_FIX.md)
- [精英项目翻译修复](fixes/translations/ELITE_PROGRAMS_TRANSLATION_FIX.md)
- [全局语言修复完成](fixes/translations/GLOBAL_LANGUAGE_FIX_COMPLETE.md)
- [语言系统重构完成](fixes/translations/LANGUAGE_SYSTEM_REFACTOR_COMPLETE.md)
- [多语言完成](fixes/translations/MULTILINGUAL_COMPLETE.md)
- [多语言更新](fixes/translations/MULTILINGUAL_UPDATE.md)
- [翻译修复完成](fixes/translations/TRANSLATION_FIX_COMPLETE.md)
- [翻译系统精英更新](fixes/translations/TRANSLATION_SYSTEM_ELITE_UPDATE.md)
- [翻译系统更新](fixes/translations/TRANSLATION_SYSTEM_UPDATE.md)
- [翻译系统更新 v1.1](fixes/translations/TRANSLATION_SYSTEM_UPDATE_v1.1.md)

### 奖学金相关修复
- [奖学金翻译完成](fixes/scholarship/SCHOLARSHIP_TRANSLATION_COMPLETE.md)

### 其他修复
- [Bug修复摘要](fixes/other/BUG_FIXES_SUMMARY.md)
- [Bug修复总结](fixes/other/BUG_FIX_SUMMARY.md)
- [缓存修复](fixes/other/CACHE_FIX.md)
- [Emoji更新完成](fixes/other/EMOJI_UPDATE_COMPLETE.md)
- [最终Bug修复](fixes/other/FINAL_BUG_FIXES.md)
- [最终修复完成](fixes/other/FINAL_FIX_COMPLETE.md)
- [最终优化](fixes/other/FINAL_OPTIMIZATION.md)
- [修复总结](fixes/other/FIX_SUMMARY.md)
- [字体优化](fixes/other/FONT_OPTIMIZATION.md)
- [字体替换完成](fixes/other/FONT_REPLACEMENT_COMPLETE.md)
- [交互优化](fixes/other/INTERACTION_OPTIMIZATION.md)
- [迷你摘要功能](fixes/other/MINI_SUMMARY_FEATURE.md)
- [优化总结](fixes/other/OPTIMIZATION_SUMMARY.md)
- [游泳时间修复](fixes/other/SWIMMING_TIME_FIX.md)
- [测试修复](fixes/other/TEST_FIXES.md)
- [紧急修复](fixes/other/URGENT_FIX.md)
- [冲突覆盖功能](fixes/other/CONFLICT_OVERRIDE_FEATURE.md)

---

## 📂 目录结构

```
docs/
├── guides/              # 使用指南
│   ├── ADMIN_SYSTEM_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── MULTILINGUAL_GUIDE.md
│   └── ...
├── changelog/           # 变更日志
│   ├── 2026-01/        # 按月归档
│   └── updates/        # 功能更新
├── fixes/              # 修复记录
│   ├── cca/            # CCA相关
│   ├── translations/   # 翻译相关
│   ├── scholarship/    # 奖学金相关
│   └── other/          # 其他修复
└── README.md           # 本文件
```

---

## 🔍 快速导航

### 我想要...

- **部署项目** → [部署指南](guides/DEPLOYMENT_GUIDE.md) + [部署检查清单](guides/DEPLOYMENT_CHECKLIST.md)
- **添加新语言** → [多语言系统指南](guides/MULTILINGUAL_GUIDE.md) + [翻译指南](guides/TRANSLATION_GUIDE.md)
- **更新课程数据** → [数据更新指南](guides/DATA_UPDATE_GUIDE.md)
- **排查问题** → [故障排查](guides/TROUBLESHOOTING.md)
- **使用管理后台** → [管理员系统指南](guides/ADMIN_SYSTEM_GUIDE.md)

---

## 📝 文档维护

文档按以下规则组织：
- **guides/** - 长期有效的使用指南和教程
- **changelog/** - 按时间组织的变更记录
- **fixes/** - 历史修复记录，便于问题追溯

---

*最后更新: 2026-03-18*