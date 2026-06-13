# 动力站触摸屏监控系统 HMI

> LVGL 8.x 风格工业 HMI UI，基于 React + Tailwind CSS，1024×600 工业触屏比例。

## 页面结构

| 页面 | 路由 | LVGL 控件 |
|------|------|-----------|
| 数据监控 | `/monitoring` | `lv_meter` 多区段仪表 + `lv_bar` + 火花图 |
| 异常报警 | `/alarms` | `lv_list` + `lv_led` 闪烁 + `lv_btn` 复位 |
| 保养提醒 | `/maintenance` | 双环同心 `lv_arc` (外消耗/内剩余) |
| 历史追溯 | `/history` | `lv_chart` 三系列折线 + 统计面板 |
| 商家服务 | `/service` | `lv_qrcode` + 工单列表 + 远程协助计时 |

## 设计系统

- **字体**: Space Grotesk (UI) + JetBrains Mono (数值)
- **主色**: `#00d4ff` 电子青
- **背景**: `#0a0e1a` 深海军蓝
- **所有颜色/间距均通过 CSS 变量定义**，修改 `src/styles/theme.css` 即可全局生效

## 开发

```bash
pnpm install
pnpm dev
```

## LVGL 移植说明

每个组件顶部注释列出了对应的 LVGL 8.x 控件和 API，可直接参照移植到 C 代码。
