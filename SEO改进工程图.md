# BOS（bosmy.tech）SEO 落地工程图

> **配套文档：** `bos-seo-keyword-strategy.md`（关键词战略，本文档负责"怎么把关键词具体嵌进网站"）
> **诊断日期：** 2026-08-11
> **诊断方式：** 直接抓取 `bosmy.tech` 首页原始 HTML（Title/Meta/Schema/H 标签/robots.txt/sitemap.xml）

---

## 一、技术现状诊断（先说问题，再给方案）

| 检查项 | 现状 | 严重度 | 影响 |
|--------|------|--------|------|
| 站点结构 | **纯单页站**，`/services` `/contact` 等子路径均 404 | 🔴 高 | 5 大能力 + 痛点层 + 地理层 + 三语层，全部挤在一个 URL 里，Google 没法针对不同关键词意图单独排名多个页面 |
| `sitemap.xml` | robots.txt 里声明了，但访问返回 **500 错误** | 🔴 高 | 搜索引擎抓取不到站点地图，新增页面很难被及时发现收录 |
| Title 标签 | `BOS - Business Operating System \| Digital Systems for Malaysian Businesses` | 🟡 中 | 没有地区词（Kuching/Sarawak），没有痛点词，泛得像介绍页而非获客页 |
| Meta Description | 有写，但只提"Malaysia"，无 Kuching、无痛点句 | 🟡 中 | 摘要没有差异化钩子 |
| H1 | `We simplify complex business operations through digital systems.` | 🟢 低 | 已经是品牌理念原句，保留，但周边缺"痛点自测"内容支撑它 |
| Schema.org 结构化数据 | 有 `ProfessionalService`，但 `areaServed` 只写到 `Country: Malaysia`，**没有古晋/砂拉越地址** | 🔴 高 | Google 无法把你和"古晋本地服务"关联，本地搜索（Local SEO）完全没启动 |
| FAQ / AEO 结构化数据 | 无 | 🟡 中 | 竞品 GRITC 已用 FAQPage schema 抢占 AI 答案引擎（ChatGPT/Gemini/Google AI Overview）曝光位 |
| hreflang（多语言标记） | 无（本来也只有英文版） | 🟢 低（暂时） | 一旦上线中文/马来语版本，必须补上，否则搜索引擎会认为是重复内容或语言混乱 |
| Google Search Console | `google-site-verification` 标签是**注释掉的占位符**，尚未验证 | 🔴 高 | 你现在大概率**看不到自己网站的搜索表现数据**，后续做的所有 SEO 优化都缺乏效果反馈 |
| 内部链接 | 只有导航锚点（Services/Process/Contact），无跨页面链接 | 🟡 中 | 单页站的天然限制，等多页面上线后需要重新设计 |
| Footer | 只有品牌名+版权，无 NAP 信息（地址/电话）、无内链 | 🟡 中 | 本地 SEO 通常要求 Footer 出现地址/电话，帮助 Google 确认"你在哪营业" |

**一句话总结现状：** 内容方向没问题（H1/理念句是对的），但**网站的"骨架"目前只能承载 1 个关键词意图，承载不了你需要的 5 层关键词架构**。所以第一步不是"改文案"，是"先把骨架搭成能放文案的形状"。

---

## 二、目标网站架构图（工程蓝图）

把上一份关键词报告的五层（痛点/品类/服务/地理/语言）对应到实际 **URL 结构**：

```
bosmy.tech/
│
├── /                                  [首页] 品牌 + 根痛点 + 5 能力入口一览
│   └── H1: We simplify complex business operations through digital systems.
│
├── /capabilities/                     [能力总览页，替代原 #services 锚点]
│   ├── /website-development/          → 痛点：网站不承接真实业务运作
│   ├── /software-development/         → 痛点：软件不合身
│   ├── /business-systems/             → 痛点：核心数据孤岛（CRM/ERP/库存/会员）
│   ├── /workflow-automation/          → 痛点：人工重复劳动
│   └── /digital-transformation/       → 痛点：系统不整合、跟不上规模
│
├── /kuching/                          [★ 新增] 古晋/砂拉越本地落地页
│   └── 承载：地理层 P0 词 + LocalBusiness schema
│
├── /faq/                              [★ 新增] 常见问题页（AEO 优化）
│   └── 承载：信任长尾词 + FAQPage schema
│
├── /about/  或 /why-bos/              [★ 新增] 品牌故事/方法论页
│   └── 承载："business operating system" 品类词 + Discover→Build→Improve 流程
│
├── /zh/                               [★ 新增，二期] 中文版（结构镜像英文版）
│   ├── /zh/kuching/
│   └── /zh/faq/
│
├── /ms/                               [★ 新增，二期] 马来语版
│   ├── /ms/kuching/
│   └── /ms/faq/
│
└── /contact/                          [可选：独立页，也可保留现有弹层]
```

**为什么必须拆成多页面，不能继续用锚点（#services、#process）？**

Google 排名的最小单位是"页面"，不是"页面里的一段"。你现在 5 个能力共用 1 个 URL（`/#services`），意味着 Google 只能给这个 URL 一个"主题信号"，不可能同时让它在"网站开发"和"ERP 系统"两组完全不同的搜索词上都排到前面。**拆页面 = 给每一组关键词一个专属的"竞选人"**。

---

## 三、逐段落具体改动（现有首页，Phase 1 立即可做）

以下按你网站真实的 HTML 结构（`id="top"` `id="services"` `id="process"` `id="contact"`）逐条给出**改前 → 改后**。

### 3.1 `<head>` 区域

**现状：**
```html
<title>BOS - Business Operating System | Digital Systems for Malaysian Businesses</title>
<meta name="description" content="BOS (Business Operating System) builds custom websites, software and business systems that simplify complex operations for businesses across Malaysia.">
```

**改为：**
```html
<title>BOS — Simplify Complex Business Operations | Custom Digital Systems, Kuching & Malaysia</title>
<meta name="description" content="Too many disconnected tools slowing your business down? BOS builds one connected digital system — website, software, CRM/ERP, automation — for businesses in Kuching, Sarawak and across Malaysia.">
```

**改动逻辑：**
- Title 里塞进"痛点动词"（Simplify）+ 地理词（Kuching）+ 保留品牌词，比原来纯"品牌+泛服务"更有点击欲望
- Meta Description 用一句"痛点提问"开场（呼应 GRITC 的"Sound familiar?"打法，但用你自己的措辞），比平铺直叙的公司介绍更抓人

**同步补一条尚未做的：**
```html
<!-- 去掉注释，实际接入 Google Search Console -->
<meta name="google-site-verification" content="你的真实验证码">
```

### 3.2 Hero 区（`<section class="hero" id="top">`）

**现状：**
```html
<h1 class="hero-tagline">We simplify complex business operations through digital systems.</h1>
```
（H1 保留不改，这句已经是最精准的品牌理念表达）

**建议在 H1 下方新增一段"痛点自测"小模块**（现有 hero 只有一行 subtext，直接跟 CTA，中间缺一层"你是不是也这样"的共鸣）：

```html
<div class="hero-pain-check">
  <p class="hero-pain-check__label">Sound familiar?</p>
  <ul class="hero-pain-check__list">
    <li>Running the business on WhatsApp, Excel, and five different tools that don't talk to each other</li>
    <li>Every new customer, order or system means another vendor, another login, another bill</li>
    <li>Nobody has real-time visibility into what's actually happening in the business</li>
  </ul>
</div>
```

**改动逻辑：** 这直接对应你在关键词报告里的"根痛点"（工具供应商拼凑症），也是唯一能让访客秒懂"这在说我"的内容形式。GRITC 用列表式痛点做到了这点，BOS 应该用**自己的措辞**做同款结构，而不是原样照抄。

### 3.3 能力区（`<section class="section" id="services">`）

**现状 H2：**
```html
<h2>One digital operating layer for modern businesses.</h2>
```
（保留，这句支撑"根痛点→根解法"的叙事，不用改）

**每个能力卡片，现状 vs 改动示例（以 03 Business System Development 为例，其余 4 个同理）：**

现状：
```html
<h3>Business System Development</h3>
<p>CRM, ERP, order and inventory management, membership platforms and admin backends that run the core of your business.</p>
```

改为（在原句前插入一句"痛点句"，原句保留作为"解法句"）：
```html
<h3>Business System Development</h3>
<p class="capability-pain">Customer, order and inventory data scattered across spreadsheets and separate tools?</p>
<p>CRM, ERP, order and inventory management, membership platforms and admin backends that run the core of your business — all in one connected system.</p>
```

**5 个能力卡片的痛点句对照表（直接可用）：**

| 能力 | 新增痛点句（放在原描述之前） |
|------|-------------------------------|
| Website Development | "Website that looks good but doesn't connect to how your business actually runs?" |
| Software Development | "Off-the-shelf software forcing your team to work around it instead of with it?" |
| Business System Development | "Customer, order and inventory data scattered across spreadsheets and separate tools?" |
| Workflow & Automation | "Staff spending hours on approvals and data entry that a system could do in seconds?" |
| Digital Transformation | "Business has outgrown the tools it started with, and nothing talks to each other anymore?" |

**改动逻辑：** 每个能力卡片从"我们能做什么"变成"你是不是有这个问题 → 我们就是解决这个的"，这是把痛点层关键词自然嵌入现有结构、不用大改版面的最低成本做法。

### 3.4 流程区（`<section id="process">`）

**现状：** Discover / Design & Build / Launch & Improve，纯流程描述，无关键词承载。

**建议：** 保留三步结构不变（这是你的差异化"方法论"资产），但在 `Discover` 步骤描述里补一句强调"按需报价、非模板"，呼应你确认的"性价比+按项目定制报价"定位：

现状（示意，具体以你官网实际文案为准）：
```html
<h3>Discover</h3>
<p>We study your operations, goals and constraints — understanding the real problem before designing a single screen.</p>
```

改为：
```html
<h3>Discover</h3>
<p>We study your operations, goals and constraints — understanding the real problem before designing a single screen or quoting a single ringgit.</p>
```

**改动逻辑：** 悄悄植入"quoting"一词，暗示"先懂你的业务，再报价"，对应信任长尾词（如 how much does custom system cost Malaysia）想要的答案感。

### 3.5 联系区（`<section id="contact">`）

**现状：**
```html
<h2>Let's build your system.</h2>
<p>Based in Malaysia. Every engagement is scoped and custom-built around your business — from a single workflow to a full operating system.</p>
```

**改为：**
```html
<h2>Let's build your system.</h2>
<p>Based in Kuching, Sarawak — serving businesses across Malaysia. Every engagement is scoped and custom-built around your business, priced around what you actually need — from a single workflow to a full operating system.</p>
```

**改动逻辑：** 这是全站**唯一一处明确写出"Kuching, Sarawak"** 的地方，对本地 SEO 至关重要——目前网站上完全没出现过古晋/砂拉越这两个词，Google 没有任何理由把你和当地搜索关联起来。

### 3.6 Footer（`<footer class="footer">`）

**现状：**
```html
<div class="footer-brand">
  <span>Business Operating System (BOS)</span>
</div>
<div class="footer-meta">
  <p>&copy; 2026 Business Operating System (BOS). All rights reserved.</p>
</div>
```

**改为（补齐 NAP 信息 + 内链，本地 SEO 标准做法）：**
```html
<div class="footer-brand">
  <span>Business Operating System (BOS)</span>
  <p class="footer-address">Kuching, Sarawak, Malaysia · Serving businesses nationwide</p>
</div>
<nav class="footer-links" aria-label="Footer">
  <a href="/capabilities/website-development/">Website Development</a>
  <a href="/capabilities/software-development/">Software Development</a>
  <a href="/capabilities/business-systems/">Business Systems</a>
  <a href="/capabilities/workflow-automation/">Workflow & Automation</a>
  <a href="/capabilities/digital-transformation/">Digital Transformation</a>
  <a href="/kuching/">Kuching / Sarawak</a>
  <a href="/faq/">FAQ</a>
</nav>
<div class="footer-meta">
  <p>&copy; 2026 Business Operating System (BOS). All rights reserved.</p>
</div>
```

**改动逻辑：** 补 NAP（地址）是本地 SEO 基本动作；Footer 内链是等 Phase 2 拆出子页面后，让全站每一页都能互相传递权重的必要结构。

---

## 四、Schema.org 结构化数据改动（技术 SEO，影响很大但不影响视觉）

### 4.1 现状 JSON-LD（节选）
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "BOS - Business Operating System",
  "areaServed": { "@type": "Country", "name": "Malaysia" },
  "address": { "@type": "PostalAddress", "addressCountry": "MY" }
}
```

### 4.2 改为（补齐城市级地理信息）
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "BOS - Business Operating System",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kuching",
    "addressRegion": "Sarawak",
    "addressCountry": "MY"
  },
  "areaServed": [
    { "@type": "City", "name": "Kuching" },
    { "@type": "State", "name": "Sarawak" },
    { "@type": "Country", "name": "Malaysia" }
  ]
}
```

**改动逻辑：** `areaServed` 从单一"Country"改成"City + State + Country"三级，是让 Google 理解"这是一家立足古晋、服务全马的公司"的关键信号，直接对应你确认的"古晋起步 + 全马并重"策略。

### 4.3 新增 FAQPage Schema（放在新建的 `/faq/` 页面）

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a custom business system cost in Malaysia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BOS scopes every project around what you actually need, so pricing depends on complexity — from a single automated workflow to a full connected system. We discuss your operations first, then quote, with no fixed package forcing you to pay for features you don't need."
      }
    },
    {
      "@type": "Question",
      "name": "Do you only serve Kuching and Sarawak?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BOS is based in Kuching, Sarawak, and serves businesses across Malaysia. Local clients get direct, on-the-ground engagement, while businesses anywhere in Malaysia can work with us remotely."
      }
    }
  ]
}
```

**改动逻辑：** 这是直接对标 GRITC 最强的那一招——FAQ 结构化数据能让 Google/ChatGPT/Gemini 之类的 AI 答案引擎**直接引用你的回答**，是目前性价比最高的 AEO（Answer Engine Optimisation）动作，且不需要大改版面。

### 4.4 新增 LocalBusiness Schema（放在新建的 `/kuching/` 页面）

在 ProfessionalService 基础上叠加地理坐标（如有实际办公地址）：
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "BOS - Business Operating System",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kuching",
    "addressRegion": "Sarawak",
    "addressCountry": "MY"
  },
  "areaServed": "Kuching, Sarawak"
}
```

---

## 五、新页面详细规格（Phase 2，每个都给 URL / Title / H1 / Meta / 核心内容）

### 5.1 `/kuching/` — 古晋/砂拉越本地页 ★ 最高优先

| 项目 | 内容 |
|------|------|
| URL | `bosmy.tech/kuching/` |
| Title | `Business & Digital System Developer in Kuching, Sarawak \| BOS` |
| H1 | `Custom digital systems, built from Kuching for businesses across Sarawak.` |
| Meta Description | `BOS is based in Kuching, Sarawak — building custom websites, software and business systems that simplify complex operations for local businesses.` |
| 核心内容板块 | 1) 为什么"本地团队"重要（响应速度、面谈可能性）2) 服务范围（古晋为主，可扩展诗巫/美里/民都鲁）3) 与全马服务的关系说明 4) 古晋相关案例/未来案例占位 |
| Schema | LocalBusiness（见 4.4） |

### 5.2 `/faq/` — 常见问题页 ★ 高优先

| 项目 | 内容 |
|------|------|
| URL | `bosmy.tech/faq/` |
| Title | `Frequently Asked Questions — Custom Business Systems \| BOS` |
| H1 | `Common questions about building your business system.` |
| 建议问题清单（覆盖信任长尾词） | How much does a custom business system cost in Malaysia? / How long does a project take? / Do you only serve Kuching and Sarawak? / What's the difference between BOS and a freelance developer? / What's the difference between BOS and a big agency? / Do I need to know technical terms to work with you? |
| Schema | FAQPage（见 4.3） |

### 5.3 `/capabilities/business-systems/`（示例，其余 4 个能力页结构相同）

| 项目 | 内容 |
|------|------|
| URL | `bosmy.tech/capabilities/business-systems/` |
| Title | `Custom CRM, ERP & Business System Development \| BOS Malaysia` |
| H1 | `One system for your customers, orders and inventory — instead of five spreadsheets.` |
| Meta Description | `Custom CRM, ERP, inventory and membership systems built around how your business actually runs. Serving businesses in Kuching, Sarawak and across Malaysia.` |
| 内容结构 | 痛点段（数据孤岛）→ 解法段（原能力描述扩写）→ 适合谁（起步型/成长型业务）→ 常见场景 3-4 个 → CTA |

其余 4 个能力页（`website-development` / `software-development` / `workflow-automation` / `digital-transformation`）按同样结构，用本报告 3.3 节的痛点句 + 关键词战略报告第 5.3 节的服务词组合展开即可。

### 5.4 `/about/`（或 `/why-bos/`）— 品类词锚定页

用于承接"business operating system"这个品类词的教育型内容，解释品牌名的由来，把"WHY（理念）vs HOW（方式）"这套逻辑写成对外可读的品牌故事，顺势定义你自己语境下的"Business Operating System"是什么意思。

---

## 六、Sitemap.xml 修复（技术优先级最高，必须先修）

**现状问题：** `robots.txt` 里声明了 `Sitemap: https://bosmy.tech/sitemap.xml`，但访问该文件返回 **500 服务器错误**——等于告诉 Google"这里有地图"，结果地图打不开。

**修复方向（视你的部署方式，二选一）：**
1. 如果是纯静态部署：手写一份 `sitemap.xml` 静态文件放在根目录，随每次新增页面手动更新
2. 如果用了任何构建工具/框架：检查生成 sitemap 的脚本/插件是否报错（500 通常是服务器端渲染逻辑出错，不是"文件不存在"）

**Phase 1（当前仅 1 页）示例内容：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bosmy.tech/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Phase 2（新增页面后）需要同步追加对应 `<url>` 条目**，包括 `/kuching/` `/faq/` `/capabilities/*/` 等全部新页面。

---

## 七、Google Search Console 验证（不是"改网站"，但没这个后面全部白做）

现状 `<meta name="google-site-verification" content="PASTE_VALUE_HERE">` 是**注释掉的占位符**，从未真正接入。

**必须做：**
1. 去 [Google Search Console](https://search.google.com/search-console) 用 `bosmy.tech` 添加资源
2. 选择"HTML 标记"验证方式，拿到真实验证码
3. 取消注释，把验证码填进 `<head>`，重新部署
4. 验证成功后，在 GSC 里手动提交 `sitemap.xml`（前提是第六节已修好 500 错误）

**为什么这一步排最前：** 没有 GSC，你后续做的所有关键词改动（Title/H1/新页面/Schema）**都无法验证是否生效**——看不到哪些词有展示、有点击、排第几位，等于蒙眼做优化。

---

## 八、三语版本落地方式（Phase 3，暂缓但先定好技术路径）

**推荐结构：** 子目录形式 `/zh/`、`/ms/`，而不是子域名（子目录能共享主域名权重，子域名等于从零开始攒权重）。

**必须加的标记（在每个语言版本的 `<head>` 里）：**
```html
<link rel="alternate" hreflang="en" href="https://bosmy.tech/" />
<link rel="alternate" hreflang="zh" href="https://bosmy.tech/zh/" />
<link rel="alternate" hreflang="ms" href="https://bosmy.tech/ms/" />
<link rel="alternate" hreflang="x-default" href="https://bosmy.tech/" />
```

**注意事项：**
- 中文版、马来语版**不是逐字翻译**，要用 `bos-seo-keyword-strategy.md` 第 5.1/5.2 节里对应语言的痛点句重新写，语气可以更口语化（尤其中文版面向古晋华人商家）
- 三语版建议先做**首页 + `/kuching/` + `/faq/`** 三个页面即可验证效果，不用一次性翻译全站

---

## 九、分阶段实施顺序（工程排期）

| 阶段 | 内容 | 预估工作量 | 前置依赖 |
|------|------|------------|----------|
| **Phase 0（今天就能做）** | 接入 Google Search Console；修复 `sitemap.xml` 500 错误 | 小 | 无 |
| **Phase 1（1 周内）** | 改 Title/Meta；Hero 加痛点自测模块；5 个能力卡片加痛点句；Contact 区补"Kuching, Sarawak"；Footer 补 NAP；Schema 补 areaServed 城市级 | 中 | Phase 0 完成，方便看到改动前后对比数据 |
| **Phase 2（2-4 周）** | 拆出 `/kuching/`、`/faq/`、5 个 `/capabilities/*/` 子页面；新增 FAQPage/LocalBusiness schema；更新 sitemap.xml 与 Footer 内链 | 大 | 需要决定站点技术架构（是否要框架化，还是继续纯静态多文件） |
| **Phase 3（视效果决定）** | 中文版 `/zh/`、马来语版 `/ms/`，先做首页+古晋页+FAQ 三页 | 大 | Phase 2 稳定后，且 Phase 1-2 已能在 GSC 看到"该有排名但没有的中文/BM 搜索需求"作为验证 |

---

## 十、一张总览表：关键词 → 落点位置

| 关键词层 | 具体去哪 |
|----------|----------|
| 痛点层（根痛点：工具供应商拼凑症） | 首页 Hero 痛点自测模块 + 每个能力卡片的痛点句 |
| 品类词（business operating system） | `/about/` 品牌故事页 + 首页 H1（已有） |
| 服务层（5 大能力） | `/capabilities/*/` 5 个独立子页面 |
| 地理层（Kuching/Sarawak） | `/kuching/` 页面 + 首页 Contact 区文案 + Schema areaServed + Footer 地址 |
| 全马层（泛服务词） | 首页整体 + 5 个能力子页面的次要关键词位 |
| 信任/长尾层 | `/faq/` 页面 + FAQPage schema |
| 三语层 | `/zh/`、`/ms/` 子目录，镜像英文结构 |

---

*本工程图基于 `bosmy.tech` 实际抓取的 HTML/robots.txt/schema 现状制定，所有"现状"代码块均为线上真实内容，"改为"代码块为建议修改，落地前请在你的实际代码库/部署环境中核对标签闭合与样式类名是否一致。*
