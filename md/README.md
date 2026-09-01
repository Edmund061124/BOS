# BOS — Business Operating System | 官网落地页说明书

## 一、项目目标

为马来西亚数字化系统公司 **Business Operating System（简称 BOS）** 搭建一个单页营销落地页（Landing Page）。

- 品牌定位语：*We Simplify Complex Business Operations Through Digital Systems.*
- BOS 是 **custom-build（定制交付）合作伙伴**，不是模板建站店，也不是带产品截图的 SaaS。
- 页面主语言为英文（默认），另提供简体中文（`/zh/`）；服务地区为 Malaysia。
- 页面不包含：客户案例、客户 Logo、虚假数据、用户评价、产品界面截图、价格表、登录/CMS。语言版本为独立静态页（非 CMS）。

## 二、信息架构（自上而下）

1. **Nav** — 左侧 BOS letter mark，顶栏分页 Home / Process / Service Areas / FAQ / About / Contact，右侧语言切换（`EN | 中文`）。Home 链回对应语种首页。
2. **Hero（首屏）** — 品牌以英雄级尺寸出现（字母标 + Business Operating System 全称），展示定位语 + 一句补充说明，短列表「If this is your day-to-day」痛点共鸣，主按钮 `Contact us`，次要文字链 `View capabilities`。背景为漂浮代码水印（见下）。
3. **Services / Capabilities** — 统一叙事："one digital operating layer for modern businesses"。五项能力各带一句痛点问句 + 说明 + 标签；其中 Business System Development 链到独立页 `/capabilities/business-systems/`（试点深页）。
4. **Process（How we work）** — 固定三步：Discover → Design & Build → Launch & Improve。
5. **Contact** — Based in Kuching, Sarawak — serving businesses across Malaysia + `Contact us`。
6. **Footer** — NAP（Kuching / Sarawak / nationwide）+ 内链（Business Systems / Kuching / FAQ / About）+ 版权。
7. **英文 SEO 内页（2026-08）** — `/kuching/`、`/faq/`、`/about/`、`/capabilities/business-systems/`（其余能力深页尚未建，Footer 不链死链）。
8. **Contact 渠道选择层** — Facebook / Instagram / WhatsApp。

## 三、技术架构（前后端分离说明）

本项目是**纯静态前端站点**，不含任何后端服务、数据库或表单提交接口——因为页面唯一的"转化动作"是跳转到外部社交/即时通讯渠道（Facebook / Instagram / WhatsApp），不需要服务器处理数据。

按照"前后端分离"的文件组织原则，三类文件职责严格分开、互不耦合：

| 文件 | 角色 | 职责 |
| --- | --- | --- |
| `index.html` | 结构层（相当于"模板/视图"） | 页面语义结构、内容文案、可访问性标签。不写样式，不写交互逻辑。 |
| `styles.css` | 表现层 | 所有视觉样式：颜色、字体、间距、栅格、响应式断点、动效过渡。不含任何业务逻辑。 |
| `main.js` | 行为层（唯一的"业务逻辑"所在地） | 纯 Vanilla JS，零框架、零依赖。集中管理：联系渠道链接配置、弹层开关与无障碍焦点控制、移动端导航开合、滚动显隐动效、导航栏滚动态。 |
| `assets/` | 静态资源 | Logo（黑色版 / 白色版）、favicon、苹果触控图标。 |

三者通过标准 `<link>` 与 `<script src="...">` 引用装配，彼此可以独立替换（例如换一套视觉系统只需改 `styles.css`，不影响结构与行为）。

技术栈锁定为 **Vanilla JS**，未使用 React / Vue / Next.js 等框架，无需构建（build）步骤，直接双击 `index.html` 或用任意静态服务器打开即可运行。

## 四、视觉系统

- 主色白，强调色近黑（`#111110`），极浅灰边框/分割线，不使用紫色渐变或霓虹配色。
- 字体：标题使用 `Source Serif 4`（正式衬线，大小写轮廓清晰），正文/UI 使用 `Source Sans 3`，编号/eyebrow 全大写标签使用 `IBM Plex Mono`；中文页另载 `Noto Serif SC` / `Noto Sans SC`。均通过 Google Fonts 加载，刻意避开 Inter / Roboto / Arial / 纯系统默认字体栈。
- "Coding 元素"：Hero/Contact 背景里的代码水印、`// LABEL` 风格的 eyebrow 前缀、Process 三步之间的静态连接线（编号做成圆形节点），均为呼应"我们写代码、搭系统"的克制装饰，不含任何真实产品截图或虚构界面。代码水印采用 VS Code 默认 Dark+ 主题的语法高亮配色（关键字/字符串/属性/函数/标识符各自不同颜色，定义在 `styles.css` 的 `.tok-*` 类里，Hero 的 `.hero-code-line` 与 Contact 的 `.code-snippet` 共用同一套配色），整体透明度克制，色彩可辨但不喧宾夺主。`assets/code-pattern.svg` 是早期版本遗留的静态素材，目前已不再被任何 CSS/HTML 引用（Hero 水印已改为下面的动态实现），暂未删除。
- 动效克制在几处：区块滚动淡入（Intersection Observer）、导航栏滚动态描边、弹层开合过渡、Hero 背景 42 条独立漂浮代码行（`.hero-code-line` + `@keyframes hero-code-float-left/right-a/b`、`hero-code-float-band-up/down`，纯 CSS，无 JS）。已适配 `prefers-reduced-motion`（全局 `* { animation-duration: 0.001ms !important }`，动效会被自动收敛为静止）。

## 五、如何修改联系渠道链接

打开 `main.js`，文件最顶部的 `CONTACT_LINKS` 对象即为唯一配置入口。当前已填入真实链接；若以后要更换，改这里即可（同步更新 `index.html`、`zh/index.html` 的 JSON-LD `sameAs`）：

```js
const CONTACT_LINKS = {
  facebook:  'https://www.facebook.com/bostechmy',
  instagram: 'https://www.instagram.com/bostechmy/',
  whatsapp:  'https://wa.me/601116641914',
};
```

## 六、如何本地预览

直接用浏览器打开 `index.html` 即可（无需安装依赖、无需构建）。若浏览器对 `file://` 协议下的字体/资源加载有限制，也可用任意静态服务器（如 VS Code Live Server）打开根目录。

## 七、目录结构

```
BOS Landing/
├── index.html          # 英文首页（默认）
├── zh/index.html       # 简体中文版
├── kuching/index.html  # Service Areas / 古晋据点页
├── faq/index.html      # FAQ + FAQPage schema
├── about/index.html    # 品牌 / 品类词页
├── contact/index.html  # 联系渠道页
├── process/index.html  # 协作流程页
├── capabilities/
│   ├── website-development/index.html
│   ├── software-development/index.html
│   ├── business-systems/index.html
│   ├── workflow-automation/index.html
│   └── digital-transformation/index.html
├── styles.css
├── main.js
├── robots.txt
├── sitemap.xml         # 英/中首页 + 内页（无马来语）
├── assets/
└── md/                 # 内部文档（勿部署；含 README / 日志 / GBP-NAP）
```

## 八、多语言

- 语言独立 URL：`/`（en）、`/zh/`（zh-Hans）；深页镜像为 `/zh/process/`、`/zh/contact/`、`/zh/faq/`、`/zh/about/`、`/zh/kuching/`、`/zh/capabilities/*/`。
- 两页互相声明 `hreflang`（含 `x-default` → 英文）。
- 导航右侧 `EN | 中文` 切换；品牌名 *Business Operating System* 保留英文写法。
- 装饰性代码水印保持英文 API 片段（非面向读者的文案）。
- **中英深页成对**：各 SEO/功能深页均有中文镜像；语言切换在对应页互指；sitemap 已收录双语文档。
- 部署到 GitHub Pages 后请在 GSC 重新提交 `https://bosmy.tech/sitemap.xml`（已移除 `/ms/`）。
- 场外 GBP 填写说明见 `md/GBP-NAP.md`。

