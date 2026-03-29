---
title: 博客添加友链功能指南
description: "博客站新增友链！欢迎交换友链~"
published: 2026-03-29
tags: [博客指南]
category: 博客指南
draft: false
---

# Astro博客添加友链：从0到1全流程

## 前言
在个人博客中，**友链（Friends）** 是连接不同创作者、互相交流的重要功能。
本篇文章将带你**一步一步**在 Astro 博客中完整实现友链功能，包括：页面创建、数据配置、类型校验、国际化、导航栏接入、类型声明修复，全程可直接复用，无冗余代码。

**适用场景**：基于 Astro 构建的静态博客，已拥有布局、国际化、导航配置体系。
**最终效果**：独立友链页面 + 响应式卡片 + 数据化配置 + 多语言支持 + 完整 MD 前言渲染。

---

## 一、整体思路
我们采用 **数据与页面分离** 的方式：
1. **页面**：负责展示样式与布局
2. **数据**：放在 Markdown 中统一管理
3. **类型**：使用 Astro Content Collection 做类型安全
4. **导航**：接入现有导航系统
5. **国际化**：支持多语言切换
这样后续**增删友链只需要改一个 MD 文件**，完全不用动页面代码。

## 二、最终文件结构
```
src/
├── pages/
│   └── friends.astro         # 友链页面（自动路由）
├── content/
│   ├── spec/
│   │   └── friends.md        # 友链数据配置
│   └── config.ts             # 集合类型定义
├── types/
│   └── config.ts             # 导航路由枚举
├── constants/
│   └── link-presets.ts       # 导航路由映射
├── i18n/
│   ├── i18nKey.ts            # 多语言键名
│   └── languages/
│       ├── en.ts
│       └── zh_CN.ts…
└── env.d.ts                  # 类型声明修复文件
```

## 三、正式开始搭建

### 1. 创建友链页面
文件路径：`src/pages/friends.astro`

这是友链的**展示页面**，使用你博客现有的布局 `MainGridLayout.astro`，**无需修改布局文件**。

```astro
---
// src/pages/friends.astro
import { getEntry, render } from "astro:content";
import Markdown from "@components/misc/Markdown.astro";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import MainGridLayout from "../layouts/MainGridLayout.astro";

// 从 content/spec/friends.md 读取友链数据
const friendEntry = await getEntry("spec", "friends");

// 错误处理
if (!friendEntry) {
  throw new Error("Friends content not found");
}

// 解析 MD 内容与数据
const { Content } = await render(friendEntry);
const { friends = [], myInfo } = friendEntry.data;
---

<MainGridLayout title={i18n(I18nKey.friends)}>
  <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
    <div class="card-base z-10 px-9 py-6 relative w-full">

      <div class="mb-6 text-90">
        <Markdown>
          <Content />
        </Markdown>
      </div>

      {myInfo && (
        <div class="bg-[var(--btn-plain-bg-hover)] p-5 rounded-xl border-l-4 border-[var(--primary)] mb-10">
          <p class="font-bold mb-2 text-90 flex items-center">
            <span class="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></span>
            本站信息
          </p>
          <ul class="space-y-1 text-75 text-sm ">
            <li>名称：{myInfo.name}</li>
            <li>介绍：{myInfo.introduction}</li>
            <li>链接：<code class="bg-black/5 dark:bg-white/10 px-1 rounded">{myInfo.link}</code></li>
            <li>头像：<code class="bg-black/5 dark:bg-white/10 px-1 rounded text-xs">{myInfo.avatar}</code></li>
          </ul>
        </div>
      )}

      <div class="h-[1px] w-full bg-black/5 dark:bg-white/10 my-8"></div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {friends.map((friend) => (
          <a
            href={friend.link}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-4 rounded-xl hover:bg-[var(--btn-plain-bg-hover)] transition-all group active:scale-95 border border-transparent hover:border-[var(--primary)]/20 shadow-sm"
          >
            <img
              src={friend.avatar}
              alt={friend.name}
              class="w-16 h-16 rounded-full border-2 border-[var(--primary)] shadow-sm mr-4 shrink-0 transition-transform group-hover:rotate-12 object-cover"
            />
            <div class="overflow-hidden">
              <div class="font-bold text-lg text-90 transition-all group-hover:text-[var(--primary)] truncate">
                {friend.name}
              </div>
              <div class="text-sm text-50 line-clamp-1 italic">
                {friend.introduction}
              </div>
            </div>
          </a>
        ))}
      </div>

    </div>
  </div>
</MainGridLayout>
```

### 2. 配置友链数据（核心）
文件路径：`src/content/spec/friends.md`

所有友链信息**只在这里修改**，格式严格遵循 YAML。

```markdown
---
# 本站信息（别人添加你的友链时使用）
myInfo:
  name: 旅行家说
  introduction: 去走上一座山吧，走在夕阳下
  link: https://blogs.papership.top
  avatar: https://blogs.papership.top/favicon/avatar.png

# 友链列表
friends:
  - name: 友人A
    introduction: 热爱技术与生活
    link: https://aaa.com
    avatar: https://aaa.com/avatar.png
---

# 友链说明
欢迎各位朋友交换友链～
请使用上方本站信息进行申请，我会尽快通过！
```


### 3. 配置 Content Collection 类型
文件路径：`src/content/config.ts`

作用：让 Astro 识别友链数据结构，避免格式错误。

```typescript
import { defineCollection, z } from "astro:content";

// 文章集合（原有代码）
const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(""),
    image: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().nullable().default(""),
    lang: z.string().optional().default(""),
    prevTitle: z.string().default(""),
    prevSlug: z.string().default(""),
    nextTitle: z.string().default(""),
    nextSlug: z.string().default(""),
  }),
});

// 新增：友链数据类型定义
const specCollection = defineCollection({
  schema: z.object({
    myInfo: z.object({
      name: z.string(),
      introduction: z.string(),
      link: z.string(),
      avatar: z.string(),
    }),
    friends: z.array(
      z.object({
        name: z.string(),
        introduction: z.string(),
        link: z.string(),
        avatar: z.string(),
      })
    ),
  }),
});

export const collections = {
  posts: postsCollection,
  spec: specCollection,
};
```

### 4. 修复 Markdown 组件 IDE 报红
文件路径：`src/env.d.ts`

**关键步骤**：解决 `Markdown` 组件导入报红问题，不影响运行，仅优化开发体验。

```typescript
/// <reference types="astro/client" />

// 声明 Markdown 组件类型，消除 IDE 报错
declare module '@components/misc/Markdown.astro' {
  import type { ComponentType } from 'astro';
  const Markdown: ComponentType;
  export default Markdown;
}
```

### 5. 配置导航栏路由
#### 5.1 路由枚举
文件路径：`src/types/config.ts`

```typescript
export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Friends = 3, // 新增友链
}
```

#### 5.2 路由映射
文件路径：`src/constants/link-presets.ts`

```typescript
import { i18n } from "../i18n/translation";
import I18nKey from "../i18n/i18nKey";
import { LinkPreset, type NavBarLink } from "../types/config";

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
  [LinkPreset.Home]: { name: i18n(I18nKey.home), url: "/" },
  [LinkPreset.Archive]: { name: i18n(I18nKey.archive), url: "/archive/" },
  [LinkPreset.About]: { name: i18n(I18nKey.about), url: "/about/" },
  [LinkPreset.Friends]: { name: i18n(I18nKey.friends), url: "/friends/" }, // 新增
};
```

### 6. 国际化配置（多语言）
#### 6.1 新增语言键
文件路径：`src/i18n/i18nKey.ts`

```typescript
export enum I18nKey {
  home = "home",
  archive = "archive",
  about = "about",
  friends = "friends", // 新增
  // ...其他键
}
```

#### 6.2 添加语言文本
**英文**：`src/i18n/languages/en.ts`
```typescript
export default {
  // ...
  [I18nKey.friends]: "Friends",
};
```

**简体中文**：`src/i18n/languages/zh_CN.ts`
```typescript
export default {
  // ...
  [I18nKey.friends]: "友链",
};
```

其他语言可按相同格式补充。


## 四、启动查看
```bash
npm run dev
```

访问地址：
```
http://localhost:4321/friends
```

✅ 能正常访问即配置成功！

## 五、常见问题排查
### 1. 页面 404
- 检查文件是否在 `src/pages/friends.astro`
- 重启开发服务器

### 2. 数据读取失败
- 检查 `friends.md` 缩进是否正确（YAML 严格缩进）
- 检查 `content/config.ts` 是否配置 `spec`

### 3. 导航栏不显示
- 检查 `LinkPreset` 枚举是否添加
- 检查 `link-presets.ts` 是否映射

### 4. Markdown 组件报红
- 已在 `env.d.ts` 中添加类型声明，重启 IDE 即可解决

### 5. MD 前言标题不显示
- 无需额外配置，原有 `Markdown` 组件会自动渲染标题与样式

## 六、后记
整个友链功能遵循 Astro 官方最佳实践，结构清晰、易于扩展。
后续你只需要在 `friends.md` 中添加友链信息，即可自动展示在页面上，非常适合长期维护。

如果你也在使用 Astro 搭建博客，希望这篇文章能帮到你！