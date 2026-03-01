import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { teekConfig } from "./teekConfig";
// 本地 Teek 主题包引用（与 Teek 在线主题包引用 二选一）
import { version } from "../../packages/teek/version";

// Teek 在线主题包引用（需安装 Teek 在线版本）
// import { version } from "vitepress-theme-teek/es/version";

const description = [
  "欢迎来到 vitepress-theme-teek 使用文档",
  "Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置",
  "Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景",
].toString();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  title: "a22999's Blog",
  description: description,
  base: "/", // Cloudflare Pages 自定义域名
  cleanUrls: true,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/universe-svgrepo-com.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/teek-logo-mini.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "a22999's Blog" }],
    ["meta", { property: "og:site_name", content: "VitePress Theme Teek" }],
    ["meta", { property: "og:image", content: "https://vp.teek.top/teek-logo-large.png" }],
    ["meta", { property: "og:url", content: "https://vp.teek.top" }],
    ["meta", { property: "og:description", description }],
    ["meta", { name: "description", description }],
    ["meta", { name: "author", content: "Teeker" }],
    // 禁止浏览器缩放
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["meta", { name: "keywords", description }],
    ["meta", { name: "algolia-site-verification", content: "CCFB3324220D59C7" }],
    // ["meta", { name: "baidu-site-verification", content: "codeva-GdK2q9MO1i" }], // 百度收录
    // ["meta", { name: "msvalidate.01", content: "48CABE70F538B8D117567176ABF325AF" }], // Bing 收录验证
    // ["script", { charset: "UTF-8", id: "LA_COLLECT", src: "//sdk.51.la/js-sdk-pro.min.js" }], // 51.la
    // [
    //   "script",
    //   {},
    //   `typeof LA !== 'undefined' && LA.init({ id: "3LqfP8Icg0GeEvtn", ck: "3LqfP8Icg0GeEvtn", hashMode: true })`,
    // ], // 51.la
  ],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  // sitemap: {
  //   hostname: "https://vp.teek.top",
  //   transformItems: items => {
  //     const permalinkItemBak: typeof items = [];
  //     // 使用永久链接生成 sitemap
  //     const permalinks = (globalThis as any).VITEPRESS_CONFIG.site.themeConfig.permalinks;
  //     items.forEach(item => {
  //       const permalink = permalinks?.map[item.url];
  //       if (permalink) permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
  //     });
  //     return [...items, ...permalinkItemBak];
  //   },
  // },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/universe-svgrepo-com.svg",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "AI提效", link: "/01.AI提效/01.🛠️ 工具安装/01.软件安装", activeMatch: "/01.AI提效/" },
      { text: "智能表格", link: "/02.智能表格/01.📊 核心教程/01.产品介绍与界面", activeMatch: "/02.智能表格/" },
      // {
      //   text: "指南",
      //   link: "/guide/intro",
      //   activeMatch: "/01.指南/",
      // },
      // { text: "配置", link: "/reference/config", activeMatch: "/10.配置/" },
      // { text: "开发", link: "/develop/intro", activeMatch: "/15.主题开发/" },
      // {
      //   text: "资源",
      //   items: [
      //     { text: "案例", link: "/resources/case" },
      //     { text: "常见问题", link: "/resources/qa" },
      //     { text: "功能拓展", link: "/resources/expand/intro" },
      //   ],
      // },
      // {
      //   text: "生态",
      //   items: [
      //     { text: "Components 组件", link: "/ecosystem/components" },
      //     { text: "运行时 API", link: "/reference/runtime-api" },
      //     { text: "Helper 工具", link: "/ecosystem/helper" },
      //     { text: "Composables 函数", link: "/ecosystem/composables" },
      //     { text: "Markdown 插件工具", link: "/ecosystem/md-plugin-utils" },
      //   ],
      // },
      // {
      //   text: "功能页",
      //   items: [
      //     { text: "归档页", link: "/archives" },
      //     { text: "清单页", link: "/articleOverview" },
      //     { text: "登录页", link: "/login" },
      //     { text: "风险链接提示页", link: "/risk-link?target=https://vp.teek.top" },
      //     { text: "分类页", link: "/categories" },
      //     { text: "标签页", link: "/tags" },
      //   ],
      // },
      // { text: "✨ 赞赏", link: "/personal/" },
      // {
      //   text: version,
      //   items: [
      //     { text: "历史版本", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/releases" },
      //     { text: "更新日志", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/dev/CHANGELOG.md" },
      //   ],
      // },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/a22999/a22999-Blog" }],
    search: {
      provider: "algolia",
      options: {
        appId: "KGZLPCPBA1",
        apiKey: "688c807af03c1f1d132e6c9bdd09356b",
        indexName: "a22999-Blog",
      },
    },
    // 注释以关闭 "在 GitHub 上编辑此页" 功能
    // editLink: {
    //   text: "在 GitHub 上编辑此页",
    //   pattern: "https://a22999.github.io/a22999-Blog/edit/master/docs/:path",
    // },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
  // transformHtml: (code, id, context) => {
  //   if (context.page !== "404.md") return code;
  //   return code.replace("404 | ", "");
  // },
});
