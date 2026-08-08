# BOS — Business Operating System | 官网落地页说明书

## 一、项目目标

为马来西亚数字化系统公司 **Business Operating System（简称 BOS）** 搭建一个单页营销落地页（Landing Page）。

- 品牌定位语：*We Simplify Complex Business Operations Through Digital Systems.*
- BOS 是 **custom-build（定制交付）合作伙伴**，不是模板建站店，也不是带产品截图的 SaaS。
- 页面主语言为英文，服务地区为 Malaysia。
- 页面不包含：客户案例、客户 Logo、虚假数据、用户评价、产品界面截图、价格表、多页站、登录/CMS。

## 二、信息架构（自上而下）

1. **Nav** — 左侧 BOS letter mark，锚点链接 Services / Process / Contact，右侧 `Contact us` 按钮。
2. **Hero（首屏）** — 品牌以英雄级尺寸出现（字母标 + Business Operating System 全称），展示定位语 + 一句补充说明，主按钮 `Contact us`，次要文字链 `View capabilities`。背景为纯 CSS 绘制的抽象网格 + 同心圆环，呼应 Logo 中的 "O"；整个首屏另铺有一层与业务强相关的极淡代码/API 水印（订单、库存、CRM/ERP、webhook 等，见 `assets/code-pattern.svg`，CSS 平铺铺满整屏），纯装饰、不可选中、透明度约 5%，≥768px 才显示，移动端保持简洁。
3. **Services / Capabilities** — 统一叙事："one digital operating layer for modern businesses"。五项能力以「编号 + 标题 + 一行说明 + 关键词标签」的干净列表行呈现（非重卡片网格）：
   - Website Development
   - Software Development
   - Business System Development
   - Workflow & Automation
   - Digital Transformation
4. **Process（How we work）** — 固定三步：Discover → Design & Build → Launch & Improve。
5. **Contact** — 简短说明（based in Malaysia / custom-built systems）+ 复用同一个 `Contact us` 触发器。
6. **Footer** — 深色收尾条：白色版字母标 + "Business Operating System (BOS)"、版权信息、Privacy Policy 占位链接。
7. **Contact 渠道选择层（弹层）** — 点击任意 `Contact us` 按钮，弹出轻量对话框，提供 Facebook / Instagram / WhatsApp 三个外链选项。支持 Esc 关闭、点击遮罩关闭、焦点陷阱（Tab 循环）、关闭后焦点归还触发按钮。

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
- 字体：标题使用 `Fraunces`（衬线，呼应 Logo 的衬线气质），正文/UI 使用 `Manrope`（几何无衬线），编号/eyebrow 标签使用等宽字体 `IBM Plex Mono`（呼应"数字系统/工程"气质），均通过 Google Fonts 加载，刻意避开 Inter / Roboto / Arial / 纯系统默认字体栈。
- "Coding 元素"：Hero/Contact 背景里的代码水印、`// LABEL` 风格的 eyebrow 前缀、Process 三步之间的静态连接线（编号做成圆形节点），均为呼应"我们写代码、搭系统"的克制装饰，不含任何真实产品截图或虚构界面。代码水印采用 VS Code 默认 Dark+ 主题的语法高亮配色（关键字/字符串/属性/函数/标识符各自不同颜色，定义在 `styles.css` 的 `.tok-*` 类与 `assets/code-pattern.svg` 里），整体透明度克制在 16% 左右，色彩可辨但不喧宾夺主。
- 动效克制在 2–3 处：区块滚动淡入（Intersection Observer）、导航栏滚动态描边、弹层开合过渡。已适配 `prefers-reduced-motion`；本轮新增的背景装饰按客户要求为纯静态，不额外加动画。

## 五、如何修改联系渠道链接

打开 `main.js`，文件最顶部的 `CONTACT_LINKS` 对象即为唯一配置入口，把 `'#'` 替换为真实链接即可，无需改动 `index.html`：

```js
const CONTACT_LINKS = {
  facebook: '#',  // TODO: 替换为真实 Facebook 主页链接
  instagram: '#', // TODO: 替换为真实 Instagram 主页链接
  whatsapp: '#',  // TODO: 替换为真实 WhatsApp 聊天链接，如 https://wa.me/60XXXXXXXXX
};
```

## 六、如何本地预览

直接用浏览器打开 `index.html` 即可（无需安装依赖、无需构建）。若浏览器对 `file://` 协议下的字体/资源加载有限制，也可用任意静态服务器（如 VS Code Live Server）打开根目录。

## 七、目录结构

```
BOS Landing/
├── index.html          # 页面结构与文案
├── styles.css          # 全站样式
├── main.js             # 交互逻辑（含联系渠道配置）
├── assets/             # 处理后的网站素材（透明版/白色版 Logo、favicon）
├── 品牌logo/            # 客户提供的原始 Logo 源文件（未改动，仅供追溯）
├── README.md           # 本说明书
├── Progress.md          # 任务进度与子任务追踪
├── Project-status.md    # 项目状态日志
└── Lesson.md            # 问题与解决方案记录
```
