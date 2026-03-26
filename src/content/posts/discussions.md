---
title: 博客评论区接入步骤
description: 笔记站和博客站新增评论区！欢迎大家留言~
published: 2026-03-26
tags: [博客指南]
category: 博客指南
draft: false
---

# Giscus评论区接入步骤

## 一、GitHub 仓库准备
1. 进入博客仓库 → **设置**
2. 在「功能（Features）」板块，勾选 **Discussions（讨论）**
3. 切换到「讨论」标签页，创建一个评论分类（推荐：`通常 / General`）

## 二、安装并授权 Giscus
1. 访问 [Giscus GitHub App](https://github.com/apps/giscus)
2. 点击「Install」安装应用
3. 选择授权给你的博客仓库（格式：`用户名/仓库名`）

## 三、生成评论区代码
1. 打开 [Giscus 配置页](https://giscus.app/zh-CN)
2. 输入完整仓库名：`用户名/仓库名`
3. 选择已创建的讨论分类
4. 复制页面底部生成的 `<script>` 代码

## 四、集成到博客项目
1. 新建组件文件 `src/components/Comment.astro`
2. 粘贴 Giscus 脚本并包裹容器
3. 在**文章页面布局**（如 `pages/posts/[slug].astro `）中引入：
   ```astro
   ---
   import Comment from '../../components/Comment.astro';
   ---

  在这个文件的最底部，也就是在</MainGridLayout> 标签的上面，加上 <Comment /> 就可以了。

## 五、部署上线
1. 提交代码并推送至 GitHub
2. 等待 GitHub Actions 完成部署
3. 访问任意文章页面，验证底部评论区是否正常加载

---

### 最终效果
- 每篇文章对应独立评论区
- 支持 GitHub 账号登录评论
- 包含回复、表情反应、Markdown 语法
- 可自由设置主题
- 评论数据存储于仓库 Discussions 中，完全可控