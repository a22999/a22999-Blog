import type { TeekConfig } from "@teek/config";

// 文档配置
export const teekDocConfig: TeekConfig = {
  themeEnhance: {
    layoutSwitch: {
      disabled: false,
      defaultMode: "bothWidthAdjustable",
    },
  },
};

// 博客基础配置
const teekBlogCommonConfig: TeekConfig = {
  teekHome: true,
  vpHome: true,
  loading: true,
  wallpaper: {
    enabled: true,
    hideBanner: true,
  },
  footerInfo: {
    // customHtml: `<span id="runtime"></span>`, // 需要搭配 .vitepress/theme/helper/useRuntime.ts 使用
  },
  // docAnalysis: {
  //   createTime: "2025-03-23",
  //   statistics: {
  //     provider: "busuanzi",
  //   },
  // },
  // friendLink: {
  //   list: [],
  //   autoScroll: true,
  // },
  social: [
    {
      icon: "mdi:github",
      name: "GitHub",
      link: "https://github.com/a22999",
    },
    // {
    //   icon: "simple-icons:gitee",
    //   name: "Gitee",
    //   link: "https://gitee.com/kele-bingtang",
    // },
  ],
};

// 博客默认配置
export const teekBlogConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 a22999’s Blog",
    description: "故事由我书写，旅程由你见证，传奇由她聆听 —— 来自 Young Kbt",
    bgStyle: "partImg",
  },
};

// 博客小图配置
export const teekBlogParkConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 a22999's Blog",
    bgStyle: "partImg",
    imgSrc: ["/blog/bg1.png"],
    description: ["a22999"],
    descStyle: "switch",
  },
  footerGroup: [
    {
      title: "外部链接",
      links: [
        { name: "示例 1", link: "https://vp.teek.top" },
        { name: "示例 2", link: "https://vp.teek.top" },
        { name: "示例 3", link: "https://vp.teek.top" },
      ],
    },
    {
      title: "内部链接",
      links: [
        { name: "快速开始", link: "/guide/quickstart" },
        { name: "配置简介", link: "/reference/config" },
      ],
    },
  ],
};

// 博客大图配置
export const teekBlogFullConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    coverImgMode: "full",
  },
  banner: {
    name: "🎉 a22999’s Blog",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.png"],
    description: [
      "不要高估一年的积蓄,也不要低估十年的改变",
      "圣人之所以为圣,是善假于物的结果",
      "让人止步不前的从来不是人或环境,而是想法和认知",
    ],
    descStyle: "types",
  },
  // comment: {
  //   provider: "giscus",
  //   options: {
  //     repo: "Kele-Bingtang/vitepress-theme-teek",
  //     repoId: "R_kgDONpVfBA",
  //     category: "Announcements",
  //     categoryId: "DIC_kwDONpVfBM4Cm3v9",
  //   },
  // },
  codeBlock: {
    overlay: true,
  },
  themeEnhance: {
    themeColor: {
      append: [
        {
          label: "博客扩展主题",
          tip: "博客扩展主题",
          options: [
            { label: "紫罗兰", value: "violet", color: "#7166f0" },
            { label: "珊瑚粉", value: "coral-pink", color: "#ff6b6b" },
            { label: "天蓝", value: "sky-blue", color: "#00bbf9" },
            { label: "蓝绿", value: "blue-green", color: "#00f5d4" },
            { label: "石板灰", value: "slate-gray", color: "#708090" },
            { label: "粉红", value: "pink", color: "#f15bb5" },
            { label: "黄绿", value: "yellow-green", color: "#8ac926" },
            { label: "橙红", value: "orange-red", color: "#ff9e6b" },
          ],
        },
      ],
    },
    layoutSwitch: {
      defaultMode: "bothWidthAdjustable",
    },
  },
};

// 博客全图配置
export const teekBlogBodyConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  pageStyle: "segment-nav",
  // 此处配置背景图片 - 设置页面背景图片数组，支持多张图片轮播
  bodyBgImg: {
    imgSrc: ["/blog/bg1.png"],
  },
  // 此处配置横幅描述 - 设置博客标题和描述信息
  banner: {
    name: "🎉 a22999’s Blog",
    description: [
      "不要高估一年的积蓄,也不要低估十年的改变",
      "圣人之所以为圣,是善假于物的结果",
      "让人止步不前的从来不是人或环境,而是想法和认知",
    ],
    descStyle: "types", // 描述样式类型
  },
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "original",
    },
  },
};

// 博客卡片配置
export const teekBlogCardConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    postStyle: "card",
  },
  homeCardListPosition: "left",
  banner: {
    name: "🎉 a22999’s Blog",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.png"],
    description: [
      "不要高估一年的积蓄,也不要低估十年的改变",
      "圣人之所以为圣,是善假于物的结果",
      "让人止步不前的从来不是人或环境,而是想法和认知",
    ],
    descStyle: "types",
  },
};
