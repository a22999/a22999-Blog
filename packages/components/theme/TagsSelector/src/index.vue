<script setup lang="ts" name="TagsSelector">
import type { Tag } from "@teek/config";
import { computed, ref, inject, onMounted, watch } from "vue";
import { useRouter, withBase, useData } from "vitepress";
import { useNamespace, useLocale } from "@teek/composables";
import { tagIcon, searchIcon, emptyIcon } from "@teek/static";
import { isFunction } from "@teek/helper";
import { useTeekConfig, usePagePath, usePosts } from "@teek/components/theme/ConfigProvider";
import { postDataUpdateSymbol } from "@teek/components/theme/Home/src/home";
import { TkIcon } from "@teek/components/common/Icon";

defineOptions({ name: "TagsSelector" });

const ns = useNamespace("tags-selector");
const { t } = useLocale();
const { getTeekConfigRef } = useTeekConfig();
const router = useRouter();
const { frontmatter } = useData();

const posts = usePosts();
const { tagPath } = usePagePath();

// 标签配置项
const tagConfig = getTeekConfigRef<NonNullable<Tag["tagsPage"]>>("tag", {}).value.tagsPage || {};
const mainTagConfig = getTeekConfigRef<Required<Tag>>("tag", {
  pageTitle: t("tk.tagCard.pageTitle", { icon: tagIcon }),
  homeTitle: t("tk.tagCard.homeTitle", { icon: tagIcon }),
  emptyLabel: t("tk.tagCard.emptyLabel"),
  moreLabel: t("tk.tagCard.moreLabel"),
  limit: 21,
  autoPage: false,
  pageSpeed: 4000,
});

// 搜索关键词
const searchKeyword = ref("");
const searchInputRef = ref<HTMLInputElement>();

// 选中的标签（支持多选）
const selectedTags = ref<string[]>([]);
const tagKey = "tag";

// 获取所有标签
const tags = computed(() => posts.value.groupCards.tags);

// 排序后的标签
const sortedTags = computed(() => {
  const sortBy = tagConfig.sortBy || "count";
  const tagsList = [...tags.value];

  switch (sortBy) {
    case "name":
      return tagsList.sort((a, b) => a.name.localeCompare(b.name));
    case "date":
      return tagsList;
    case "count":
    default:
      return tagsList.sort((a, b) => b.length - a.length);
  }
});

// 过滤后的标签
const filteredTags = computed(() => {
  if (!searchKeyword.value) return sortedTags.value;

  const keyword = searchKeyword.value.toLowerCase().trim();
  return sortedTags.value.filter(tag => {
    const name = tag.name.toLowerCase();
    const displayName = tag.displayName?.toLowerCase() || "";
    return name.includes(keyword) || displayName.includes(keyword);
  });
});

// 页面标题
const pageTitle = computed(() => {
  const title = mainTagConfig.value.pageTitle;
  if (isFunction(title)) return title(tagIcon);
  // 处理 {icon} 占位符
  return title.replace(/{icon}/g, "");
});

// 判断标签是否选中
const isTagSelected = (tagName: string) => selectedTags.value.includes(tagName);

const updatePostListData = inject(postDataUpdateSymbol, () => {});

/**
 * 点击标签，切换选中状态（支持多选）
 */
const handleToggleTag = (tagName: string) => {
  const { pathname, searchParams } = new URL(window.location.href);
  const tagsPageLinkConst = withBase(tagPath.value);
  const inTagsPage = tagsPageLinkConst === pathname;

  // 切换选中状态
  if (isTagSelected(tagName)) {
    // 取消选中
    selectedTags.value = selectedTags.value.filter(t => t !== tagName);
  } else {
    // 选中
    selectedTags.value = [...selectedTags.value, tagName];
  }

  // 更新 URL 参数
  searchParams.delete("pageNum");
  searchParams.append("pageNum", "1");
  searchParams.delete(tagKey);
  selectedTags.value.forEach(tag => searchParams.append(tagKey, tag));

  const searchParamsStr = selectedTags.value.length > 0 ? `?${searchParams.toString()}` : "";

  // 如果此时不在标签页，则跳转至标签页
  if (!inTagsPage) return router.go(tagsPageLinkConst + searchParamsStr);

  // 如果在标签页，则替换 URL，但不刷新
  window.history.pushState({}, "", pathname + searchParamsStr);
  // 更新文章列表数据
  updatePostListData();
};

/**
 * 清除所有选中
 */
const clearAllTags = () => {
  selectedTags.value = [];
  const { pathname } = new URL(window.location.href);
  window.history.pushState({}, "", pathname);
  updatePostListData();
};

/**
 * 清除搜索
 */
const clearSearch = () => {
  searchKeyword.value = "";
  searchInputRef.value?.focus();
};

// 解析 URL 参数中的标签
const parseUrlTags = () => {
  const { searchParams } = new URL(window.location.href);
  const tags = searchParams.getAll(tagKey);
  selectedTags.value = tags;
};

onMounted(() => {
  parseUrlTags();
});

// 监听 frontmatter 变化
watch(
  () => frontmatter.value.tagsPage,
  () => {
    if (!frontmatter.value.tagsPage) {
      selectedTags.value = [];
      return;
    }
    parseUrlTags();
  }
);
</script>

<template>
  <div :class="ns.b()" role="region" :aria-label="t('tk.tagsPage.label')">
    <!-- 页面头部 -->
    <div :class="ns.e('header')">
      <div :class="ns.e('title-wrapper')">
        <TkIcon :icon="tagIcon" :size="22" aria-hidden="true" />
        <h2 :class="ns.e('title')">{{ pageTitle }}</h2>
        <span :class="ns.e('count')">共 {{ filteredTags.length }} 个</span>
      </div>
      <button
        v-if="selectedTags.length > 0"
        :class="ns.e('clear-all')"
        type="button"
        @click="clearAllTags"
        :aria-label="t('tk.tagsPage.clearFilter')"
      >
        清除全部 ({{ selectedTags.length }})
      </button>
    </div>

    <!-- 搜索框 -->
    <div v-if="tags.length > 1" :class="ns.e('search')" role="search">
      <TkIcon :icon="searchIcon" :size="18" aria-hidden="true" />
      <input
        ref="searchInputRef"
        v-model="searchKeyword"
        :placeholder="t('tk.tagsPage.searchPlaceholder')"
        :aria-label="t('tk.tagsPage.searchPlaceholder')"
        type="search"
      />
      <button
        v-if="searchKeyword"
        :class="ns.e('search-clear')"
        :aria-label="t('tk.tagsPage.clearSearch')"
        type="button"
        @click="clearSearch"
      >
        <TkIcon :icon="emptyIcon" :size="16" aria-hidden="true" />
      </button>
    </div>

    <!-- 标签列表 -->
    <div :class="ns.e('content')">
      <!-- 空状态 -->
      <div v-if="!tags.length" :class="ns.e('empty')" role="status">
        <TkIcon :icon="emptyIcon" :size="48" aria-hidden="true" />
        <p>{{ mainTagConfig.emptyLabel }}</p>
      </div>

      <!-- 无搜索结果 -->
      <div v-else-if="searchKeyword && !filteredTags.length" :class="ns.e('no-result')" role="status">
        <p>{{ t("tk.tagsPage.noResult") }}</p>
      </div>

      <!-- 标签云 -->
      <div v-else :class="[ns.e('cloud'), { [ns.is('has-selected')]: selectedTags.length > 0 }]" role="list">
        <button
          v-for="item in filteredTags"
          :key="item.name"
          :class="[ns.e('tag-item'), { [ns.is('active')]: isTagSelected(item.name) }]"
          type="button"
          role="listitem"
          :aria-pressed="isTagSelected(item.name)"
          @click="handleToggleTag(item.name)"
        >
          <span :class="ns.e('tag-name')">{{ item.displayName || item.name }}</span>
          <span :class="ns.e('tag-count')">{{ item.length }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
