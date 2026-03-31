---
title: 博客修改默认主题指南
description: "已设置博客站默认主题为亮色，笔记站默认主题为暗色"
published: 2026-03-31
tags: [博客指南]
category: 博客指南
draft: false
---

# Astro博客修改默认主题教程
核心目标：修改博客首次打开默认显示主题，保留「跟随系统」「手动切换暗色」功能，不影响原有主题切换逻辑，适配Astro模板。

## 一、核心修改逻辑
Astro博客主题控制依赖2个核心文件：
1.  全局布局文件 `src/layouts/Layout.astro`（主题初始化脚本）
2.  工具文件 `src/utils/setting-utils.ts`（主题读取/保存逻辑）

## 二、具体修改步骤
### 第一步：修改 Layout.astro 主题初始化脚本
1.  打开文件：`src/layouts/Layout.astro`
2.  找到头部 `is:inline` 主题脚本
3.  找到核心代码行，只修改1处默认值：

    原代码：
    ```javascript
    const theme = localStorage.getItem('theme') || DEFAULT_THEME;
    ```

    修改后：
    ```javascript
    // 关键：无本地存储时，默认亮色
    const theme = localStorage.getItem('theme') || LIGHT_MODE;//或者DARK_MODE
    ```

4.  保留脚本中所有原有逻辑（包括 `switch` 里的 `AUTO_MODE`、`DARK_MODE` 分支），**不要删除任何代码**，确保跟随系统、手动切换功能正常。

### 第二步：修改 setting-utils.ts 主题读取默认值
1.  打开文件：`src/utils/setting-utils.ts`
2.  找到 `getStoredTheme` 函数，只修改1处默认返回值：

    原代码：
    ```typescript
    export function getStoredTheme(): LIGHT_DARK_MODE {
    	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
    }
    ```

    修改后：
    ```typescript
    export function getStoredTheme(): LIGHT_DARK_MODE {
    	// 关键：无本地存储时，默认亮色（同步Layout逻辑）
    	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || LIGHT_MODE;//或者DARK_MODE
    }
    ```

### 第三步：可选优化（提升体验，避免闪屏）
在 `Layout.astro` 的 `html` 标签上，默认添加 `light` 类，防止页面加载时闪一下暗色：

原代码：
```astro
    <html lang={siteLang} class="bg-[var(--page-bg)] transition text-[14px] md:text-[16px]"
        data-overlayscrollbars-initialize
    >
```

修改后:
```astro
    <html lang={siteLang} class="bg-[var(--page-bg)] transition text-[14px] md:text-[16px] light"
        data-overlayscrollbars-initialize
    >
```

## 四、验证修改效果
1.  本地重启项目：终端执行 `pnpm dev`（或 `npm run dev`）
2.  首次打开博客：无论电脑/手机系统是亮色还是暗色，均默认显示亮色
3.  测试主题切换：清除浏览器本地存储（或用无痕模式打开）：再次默认显示亮/暗色