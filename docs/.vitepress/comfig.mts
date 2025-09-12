// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { defineTeekConfig } from "../../packages/config";

// Teek 主题配置
const teekConfig = defineTeekConfig({
  teekHome: true,
  vpHome: false,
  loading: true,
  wallpaper: {
    enabled: true,
    hideBanner: true,
  },
  footerInfo: {},
  social: [],
  pageStyle: "segment-nav",
  bodyBgImg: {
    imgSrc: ["/blog/bg1.png"],
  },
  banner: {
    name: "🎉 a22999’s Blog",
    description: [
      "不要高估一年的积蓄,也不要低估十年的改变",
      "圣人之所以为圣,是善假于物的结果",
      "让人止步不前的从来不是人或环境,而是想法和认知",
    ],
    descStyle: "types",
  },
  themeEnhance: {
    layoutSwitch: {
      disabled: true,
      defaultMode: "bothWidthAdjustable",
    },
  },
});

// VitePress 配置
export default defineConfig({
  extends: teekConfig,
  // ...
});
