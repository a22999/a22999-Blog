<script setup lang="ts" name="TagsPage">
import type { Tag } from "@teek/config";
import { useData, useRouter, withBase } from "vitepress";
import { computed, ref, watch, onMounted, inject, shallowRef, nextTick, onUnmounted } from "vue";
import { useNamespace, useLocale } from "@teek/composables";
import { tagIcon, emptyIcon, searchIcon, arrowLeftIcon, arrowRightIcon } from "@teek/static";
import { isFunction } from "@teek/helper";
import { useTeekConfig, usePagePath, usePosts, useTagColor } from "@teek/components/theme/ConfigProvider";
import { postDataUpdateSymbol } from "@teek/components/theme/Home/src/home";
import { TkArticlePage } from "@teek/components/common/ArticlePage";
import { TkIcon } from "@teek/components/common/Icon";

defineOptions({ name: "TagsPage" });

const ns = useNamespace("tags-page");
const { t } = useLocale();
const { getTeekConfigRef } = useTeekConfig();
const router = useRouter();

const { frontmatter } = useData();
const posts = usePosts();
const tagColor = useTagColor();
const { tagPath } = usePagePath();

// 标签页配置
const tagsPageConfig = getTeekConfigRef<NonNullable<Tag["tagsPage"]>>("tag", {}).value.tagsPage || {};

// 性能优化配置
const PAGE_SIZE = tagsPageConfig.pageSize || 50; // 每页显示的标签数量
const VIRTUAL_THRESHOLD = tagsPageConfig.virtualThreshold || 100; // 触发分页/虚拟滚动的阈值

// 搜索关键词
const searchKeyword = ref("");
const searchInputRef = ref<HTMLInputElement>();

// 当前选中的标签
const selectedTag = ref("");
const tagKey = "tag";

// 分页状态
const currentPage = ref(1);

// 焦点索引（用于键盘导航）
const focusedIndex = ref(-1);

// 标签容器引用（用于虚拟滚动）
const tagContainerRef = shallowRef<HTMLElement>();

// 屏幕阅读器状态提示
const srAnnouncement = ref("");

// 获取所有标签 - 使用 shallowRef 避免深层响应式
const tags = computed(() => posts.value.groupCards.tags);

// 标签总数（缓存）
const totalTagsCount = computed(() => tags.value.length);

// 是否需要分页（性能优化）
const needsPagination = computed(() => totalTagsCount.value > VIRTUAL_THRESHOLD && !searchKeyword.value);

// 动画配置
const animationConfig = computed(() => ({
  enabled: tagsPageConfig.cloudAnimation?.enabled !== false,
  hoverScale: tagsPageConfig.cloudAnimation?.hoverScale !== false,
  hoverGlow: tagsPageConfig.cloudAnimation?.hoverGlow ?? false,
  selectTransition: tagsPageConfig.cloudAnimation?.selectTransition !== false,
  breathing: tagsPageConfig.cloudAnimation?.breathing ?? false,
  breathingDuration: tagsPageConfig.cloudAnimation?.breathingDuration ?? 3,
}));

// 时间线配置
const timelineConfig = computed(() => ({
  style: tagsPageConfig.timeline?.style ?? "default",
  showLine: tagsPageConfig.timeline?.showLine !== false,
  showYearGroup: tagsPageConfig.timeline?.showYearGroup !== false,
  direction: tagsPageConfig.timeline?.direction ?? "vertical",
}));

// 是否启用键盘导航
const keyboardEnabled = computed(() => tagsPageConfig.keyboardNavigation !== false);

// 排序后的标签 - 使用缓存
const sortedTags = computed(() => {
  const sortBy = tagsPageConfig.sortBy || "count";
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

// 总页数
const totalPages = computed(() => Math.ceil(filteredTags.value.length / PAGE_SIZE));

// 当前页显示的标签（分页模式）
const paginatedTags = computed(() => {
  if (!needsPagination.value) return filteredTags.value;

  const start = (currentPage.value - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filteredTags.value.slice(start, end);
});

// 最终显示的标签
const displayTags = computed(() => {
  if (needsPagination.value) return paginatedTags.value;
  return filteredTags.value;
});

// 默认标签配置
const defaultLabel = computed(() => {
  const frontmatterConst = frontmatter.value;
  const title = tagsPageConfig.title;
  const titleStr = isFunction(title) ? title(tagIcon) : title;
  return {
    title: frontmatterConst.title ?? titleStr ?? t("tk.tagsPage.title", { icon: tagIcon }),
    totalCount: t("tk.tagsPage.totalCount", { count: filteredTags.value.length }),
    empty: tagsPageConfig.emptyLabel ?? t("tk.tagsPage.empty"),
    searchPlaceholder: t("tk.tagsPage.searchPlaceholder"),
    noResult: t("tk.tagsPage.noResult"),
    loadMore: t("tk.tagsPage.loadMore"),
    showingRange: t("tk.tagsPage.showingRange", {
      start: (currentPage.value - 1) * PAGE_SIZE + 1,
      end: Math.min(currentPage.value * PAGE_SIZE, filteredTags.value.length),
      total: filteredTags.value.length,
    }),
  };
});

// 按首字母分组的标签（用于 group 模式）- 优化计算
const groupedTags = computed(() => {
  const groups: Record<string, typeof tags.value> = {};
  const displayTagsConst = displayTags.value;

  for (let i = 0; i < displayTagsConst.length; i++) {
    const tag = displayTagsConst[i];
    const firstLetter = tag.name.charAt(0).toUpperCase();
    const key = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";
    if (!groups[key]) groups[key] = [];
    groups[key].push(tag);
  }
  return groups;
});

// 按时间分组的标签（用于 timeline 模式）
const timelineTags = computed(() => {
  // 获取所有文章的时间信息来推断标签的使用时间
  const tagFirstUsedDate: Record<string, Date> = {};

  // 从文章数据中提取标签首次使用时间
  posts.value.posts.forEach(post => {
    const postDate = post.date ? new Date(post.date) : null;
    if (postDate && post.tags) {
      post.tags.forEach((tagName: string) => {
        if (!tagFirstUsedDate[tagName] || (postDate && postDate < tagFirstUsedDate[tagName])) {
          tagFirstUsedDate[tagName] = postDate;
        }
      });
    }
  });

  // 按年月分组
  const groups: { year: number; month: number; tags: (typeof tags.value)[0][] }[] = [];

  displayTags.value.forEach(tag => {
    const date = tagFirstUsedDate[tag.name] || new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let group = groups.find(g => g.year === year && g.month === month);
    if (!group) {
      group = { year, month, tags: [] };
      groups.push(group);
    }
    group.tags.push(tag);
  });

  // 按时间倒序排列
  groups.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return groups;
});

// 按年份分组的时间线标签
const timelineYearGroups = computed(() => {
  const yearGroups: Record<number, typeof timelineTags.value> = {};

  timelineTags.value.forEach(group => {
    if (!yearGroups[group.year]) {
      yearGroups[group.year] = [];
    }
    yearGroups[group.year].push(group);
  });

  return yearGroups;
});

// 计算标签云字体大小 - 缓存计算结果
const tagSizeCache = new Map<number, number>();
const getTagSize = (length: number) => {
  if (tagSizeCache.has(length)) return tagSizeCache.get(length)!;

  const minSize = tagsPageConfig.cloudMinSize || 12;
  const maxSize = tagsPageConfig.cloudMaxSize || 24;
  const maxCount = Math.max(...tags.value.map(t => t.length), 1);
  const minCount = Math.min(...tags.value.map(t => t.length), 0);
  const ratio = maxCount === minCount ? 0 : (length - minCount) / (maxCount - minCount);
  const size = minSize + ratio * (maxSize - minSize);

  tagSizeCache.set(length, size);
  return size;
};

// 获取标签样式 - 使用缓存
const tagStyleCache = new Map<string, Record<string, string>>();
const getTagStyle = (index: number, length: number, isCloud = false) => {
  const cacheKey = `${index}-${length}-${isCloud}`;
  if (tagStyleCache.has(cacheKey)) return tagStyleCache.get(cacheKey)!;

  const tagColorConst = tagColor.value;
  const color = tagColorConst[index % tagColorConst.length];
  const baseStyle = {
    backgroundColor: color.bg,
    color: color.text,
    borderColor: color.border,
  };

  const style = isCloud
    ? {
        ...baseStyle,
        fontSize: `${getTagSize(length)}px`,
      }
    : baseStyle;

  tagStyleCache.set(cacheKey, style);
  return style;
};

// 显示模式
const displayMode = computed(() => tagsPageConfig.displayMode || "cloud");

// 通知屏幕阅读器
const announceToScreenReader = (message: string) => {
  srAnnouncement.value = "";
  nextTick(() => {
    srAnnouncement.value = message;
  });
};

// 分页导航
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  focusedIndex.value = -1;
  announceToScreenReader(t("tk.tagsPage.pageAnnounce", { page, total: totalPages.value }));

  // 滚动到顶部
  tagContainerRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

// 键盘导航处理
const handleKeydown = (e: KeyboardEvent) => {
  const tagsList = displayTags.value;

  // 搜索框内的键盘事件
  if (document.activeElement === searchInputRef.value) {
    if (e.key === "Enter" && selectedTag.value) {
      e.preventDefault();
      handleSwitchTag(selectedTag.value);
    } else if (e.key === "Escape" && searchKeyword.value) {
      clearSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      searchInputRef.value?.blur();
      focusedIndex.value = 0;
    }
    return;
  }

  // 标签列表内的键盘导航
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      e.preventDefault();
      focusedIndex.value = Math.min(focusedIndex.value + 1, tagsList.length - 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      if (focusedIndex.value >= 0 && focusedIndex.value < tagsList.length) {
        const tag = tagsList[focusedIndex.value];
        handleSwitchTag(tag.name === selectedTag.value ? "" : tag.name);
      }
      break;
    case "Escape":
      if (selectedTag.value) {
        handleSwitchTag("");
      } else {
        searchInputRef.value?.focus();
        focusedIndex.value = -1;
      }
      break;
    case "Home":
      e.preventDefault();
      focusedIndex.value = 0;
      break;
    case "End":
      e.preventDefault();
      focusedIndex.value = tagsList.length - 1;
      break;
    case "PageUp":
      e.preventDefault();
      if (needsPagination.value) prevPage();
      break;
    case "PageDown":
      e.preventDefault();
      if (needsPagination.value) nextPage();
      break;
  }
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = "";
  currentPage.value = 1;
  searchInputRef.value?.focus();
  announceToScreenReader(t("tk.tagsPage.searchCleared"));
};

// 搜索时重置分页
watch(searchKeyword, () => {
  currentPage.value = 1;
  focusedIndex.value = -1;
});

const updatePostListData = inject(postDataUpdateSymbol, () => {});

/**
 * 点击标签，更新文章列表
 */
const handleSwitchTag = (tag = "") => {
  const { pathname, searchParams } = new URL(window.location.href);
  const tagsPageLinkConst = withBase(tagPath.value);
  const inTagsPage = tagsPageLinkConst === pathname;

  // 先删除旧的参数再追加新的
  searchParams.delete("pageNum");
  searchParams.append("pageNum", "1");
  searchParams.delete(tagKey);
  if (tag) searchParams.append(tagKey, tag);

  const searchParamsStr = tag ? `?${searchParams.toString()}` : "";

  // 避免重复点击
  if (inTagsPage && selectedTag.value === tag) return;
  selectedTag.value = tag;

  // 屏幕阅读器提示
  if (tag) {
    const tagInfo = displayTags.value.find(t => t.name === tag);
    if (tagInfo) {
      announceToScreenReader(t("tk.tagsPage.tagSelected", { tag, count: tagInfo.length }));
    }
  } else {
    announceToScreenReader(t("tk.tagsPage.filterCleared"));
  }

  // 如果此时不在标签页，则跳转至标签页
  if (!inTagsPage) return router.go(tagsPageLinkConst + searchParamsStr);

  // 如果在标签页，则替换 URL，但不刷新
  window.history.pushState({}, "", pathname + searchParamsStr);
  // 更新文章列表数据
  updatePostListData();
};

// 获取时间线月份标签
const getMonthLabel = (month: number) => {
  return t("tk.tagsPage.timeline.month", { month });
};

// 获取时间线年份标签
const getYearLabel = (year: number) => {
  return t("tk.tagsPage.timeline.year", { year });
};

// 清理缓存
onUnmounted(() => {
  tagSizeCache.clear();
  tagStyleCache.clear();
});

onMounted(() => {
  const { searchParams } = new URL(window.location.href);
  const tag = searchParams.get(tagKey);
  if (tag) selectedTag.value = tag;
});

watch(
  () => frontmatter.value.tagsPage,
  () => {
    // 离开标签页后，清除激活状态
    if (!frontmatter.value.tagsPage) {
      selectedTag.value = "";
      return;
    }
    const { searchParams } = new URL(window.location.href);
    const tag = searchParams.get(tagKey);
    if (tag && selectedTag.value !== tag) selectedTag.value = tag;
  }
);
</script>

<template>
  <TkArticlePage :class="ns.b()" :aria-label="t('tk.tagsPage.label')" role="region">
    <slot name="teek-tags-top-before" />

    <!-- 屏幕阅读器实时区域 -->
    <div
      :class="ns.e('sr-only')"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      :aria-label="t('tk.tagsPage.ariaLiveRegion')"
    >
      {{ srAnnouncement }}
    </div>

    <!-- 页面头部 -->
    <div :class="`${ns.e('header')} flx-justify-between`">
      <h1 :id="ns.e('title')">
        <TkIcon :icon="tagIcon" :size="24" aria-hidden="true" />
        {{ defaultLabel.title.replace("{icon}", "") }}
      </h1>
      <div class="count" :aria-label="defaultLabel.totalCount">{{ defaultLabel.totalCount }}</div>
    </div>

    <slot name="teek-tags-top-after" />

    <!-- 搜索框 -->
    <div v-if="tags.length > 1" :class="ns.e('search')" role="search">
      <TkIcon :icon="searchIcon" :size="18" aria-hidden="true" />
      <label :for="ns.e('search-input')" class="sr-only">{{ defaultLabel.searchPlaceholder }}</label>
      <input
        :id="ns.e('search-input')"
        ref="searchInputRef"
        v-model="searchKeyword"
        :placeholder="defaultLabel.searchPlaceholder"
        :aria-label="defaultLabel.searchPlaceholder"
        :aria-describedby="`${ns.e('search-desc')}`"
        type="search"
        @keydown="handleKeydown"
      />
      <span :id="`${ns.e('search-desc')}`" class="sr-only">
        {{ t("tk.tagsPage.searchDesc") }}
      </span>
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

    <!-- 键盘导航提示 -->
    <div v-if="keyboardEnabled && filteredTags.length > 0" :class="ns.e('keyboard-hint')" aria-hidden="true">
      {{ t("tk.tagsPage.keyboardHint") }}
    </div>

    <!-- 标签展示区域 -->
    <div ref="tagContainerRef" :class="ns.e('content')">
      <!-- 空状态 -->
      <div v-if="!tags.length" :class="ns.e('empty')" role="status" aria-live="polite">
        <TkIcon :icon="emptyIcon" :size="48" aria-hidden="true" />
        <p>{{ defaultLabel.empty }}</p>
      </div>

      <!-- 无搜索结果 -->
      <div
        v-else-if="searchKeyword && !filteredTags.length"
        :class="ns.e('no-result')"
        role="status"
        aria-live="polite"
      >
        <p>{{ defaultLabel.noResult }}</p>
      </div>

      <!-- 云状模式 -->
      <div
        v-else-if="displayMode === 'cloud'"
        :class="[
          ns.e('cloud'),
          ns.is('active', !!selectedTag),
          ns.is('animation', animationConfig.enabled),
          ns.is('breathing', animationConfig.breathing),
        ]"
        :style="animationConfig.breathing ? { '--tk-breathing-duration': `${animationConfig.breathingDuration}s` } : {}"
        role="list"
        :aria-label="t('tk.tagsPage.tagList')"
        @keydown="handleKeydown"
      >
        <a
          v-for="(item, index) in displayTags"
          :key="item.name"
          :style="getTagStyle(index, item.length, true)"
          :class="[
            { active: item.name === selectedTag, focused: index === focusedIndex },
            { 'hover-scale': animationConfig.hoverScale },
            { 'hover-glow': animationConfig.hoverGlow },
            { 'select-transition': animationConfig.selectTransition },
            ns.e('tag-item'),
          ]"
          role="listitem"
          tabindex="0"
          :aria-label="t('tk.tagsPage.tagAriaLabel', { tag: item.name, count: item.length })"
          :aria-pressed="item.name === selectedTag"
          :aria-current="item.name === selectedTag ? 'true' : undefined"
          @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
        >
          <span class="name">{{ item.displayName || item.name }}</span>
          <span v-if="tagsPageConfig.showCount !== false" class="count" aria-label="">{{ item.length }}</span>
        </a>
      </div>

      <!-- 列表模式 -->
      <div
        v-else-if="displayMode === 'list'"
        :class="[ns.e('list'), ns.is('active', !!selectedTag)]"
        role="list"
        :aria-label="t('tk.tagsPage.tagList')"
        @keydown="handleKeydown"
      >
        <a
          v-for="(item, index) in displayTags"
          :key="item.name"
          :style="getTagStyle(index, item.length)"
          :class="[{ active: item.name === selectedTag, focused: index === focusedIndex }, ns.e('tag-item')]"
          role="listitem"
          tabindex="0"
          :aria-label="t('tk.tagsPage.tagAriaLabel', { tag: item.name, count: item.length })"
          :aria-pressed="item.name === selectedTag"
          :aria-current="item.name === selectedTag ? 'true' : undefined"
          @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
        >
          <span class="name">{{ item.displayName || item.name }}</span>
          <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
        </a>
      </div>

      <!-- 分组模式 -->
      <div
        v-else-if="displayMode === 'group'"
        :class="[ns.e('group'), ns.is('active', !!selectedTag)]"
        role="list"
        :aria-label="t('tk.tagsPage.tagList')"
        @keydown="handleKeydown"
      >
        <div
          v-for="(groupTags, letter) in groupedTags"
          :key="letter"
          :class="ns.e('group-section')"
          role="group"
          :aria-label="t('tk.tagsPage.tagGroup', { letter })"
        >
          <div v-if="groupTags.length" :class="ns.e('group-letter')" aria-hidden="true">{{ letter }}</div>
          <div :class="ns.e('group-tags')">
            <a
              v-for="item in groupTags"
              :key="item.name"
              :style="
                getTagStyle(
                  sortedTags.findIndex(t => t.name === item.name),
                  item.length
                )
              "
              :class="[
                { active: item.name === selectedTag, focused: displayTags.indexOf(item) === focusedIndex },
                ns.e('tag-item'),
              ]"
              role="listitem"
              tabindex="0"
              :aria-label="t('tk.tagsPage.tagAriaLabel', { tag: item.name, count: item.length })"
              :aria-pressed="item.name === selectedTag"
              :aria-current="item.name === selectedTag ? 'true' : undefined"
              @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
            >
              <span class="name">{{ item.displayName || item.name }}</span>
              <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 时间线模式 -->
      <div
        v-else-if="displayMode === 'timeline'"
        :class="[ns.e('timeline'), ns.is('active', !!selectedTag), ns.is(`timeline-${timelineConfig.style}`)]"
        role="list"
        :aria-label="t('tk.tagsPage.tagList')"
        @keydown="handleKeydown"
      >
        <!-- 按年份分组展示 -->
        <template v-if="timelineConfig.showYearGroup">
          <div v-for="(yearData, year) in timelineYearGroups" :key="year" :class="ns.e('timeline-year')">
            <div :class="ns.e('timeline-year-header')">
              <div v-if="timelineConfig.showLine" :class="ns.e('timeline-line')"></div>
              <span :class="ns.e('timeline-year-label')">{{ getYearLabel(Number(year)) }}</span>
            </div>
            <div
              v-for="monthGroup in yearData"
              :key="`${monthGroup.year}-${monthGroup.month}`"
              :class="ns.e('timeline-month')"
            >
              <div :class="ns.e('timeline-month-header')">
                <div v-if="timelineConfig.showLine" :class="ns.e('timeline-dot')"></div>
                <span :class="ns.e('timeline-month-label')">{{ getMonthLabel(monthGroup.month) }}</span>
              </div>
              <div :class="ns.e('timeline-tags')">
                <a
                  v-for="item in monthGroup.tags"
                  :key="item.name"
                  :style="
                    getTagStyle(
                      sortedTags.findIndex(t => t.name === item.name),
                      item.length
                    )
                  "
                  :class="[
                    { active: item.name === selectedTag, focused: displayTags.indexOf(item) === focusedIndex },
                    ns.e('tag-item'),
                  ]"
                  role="listitem"
                  tabindex="0"
                  :aria-label="t('tk.tagsPage.tagAriaLabel', { tag: item.name, count: item.length })"
                  :aria-pressed="item.name === selectedTag"
                  :aria-current="item.name === selectedTag ? 'true' : undefined"
                  @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
                >
                  <span class="name">{{ item.displayName || item.name }}</span>
                  <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
                </a>
              </div>
            </div>
          </div>
        </template>

        <!-- 不按年份分组展示 -->
        <template v-else>
          <div
            v-for="(group, index) in timelineTags"
            :key="`${group.year}-${group.month}`"
            :class="ns.e('timeline-item')"
          >
            <div :class="ns.e('timeline-item-header')">
              <div
                v-if="timelineConfig.showLine"
                :class="index === 0 ? ns.e('timeline-dot-first') : ns.e('timeline-dot')"
              ></div>
              <span :class="ns.e('timeline-date')">
                {{ getYearLabel(group.year) }} {{ getMonthLabel(group.month) }}
              </span>
            </div>
            <div :class="ns.e('timeline-tags')">
              <a
                v-for="item in group.tags"
                :key="item.name"
                :style="
                  getTagStyle(
                    sortedTags.findIndex(t => t.name === item.name),
                    item.length
                  )
                "
                :class="[
                  { active: item.name === selectedTag, focused: displayTags.indexOf(item) === focusedIndex },
                  ns.e('tag-item'),
                ]"
                role="listitem"
                tabindex="0"
                :aria-label="t('tk.tagsPage.tagAriaLabel', { tag: item.name, count: item.length })"
                :aria-pressed="item.name === selectedTag"
                :aria-current="item.name === selectedTag ? 'true' : undefined"
                @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
              >
                <span class="name">{{ item.displayName || item.name }}</span>
                <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
              </a>
            </div>
          </div>
        </template>
      </div>

      <!-- 分页控制 -->
      <div
        v-if="needsPagination && totalPages > 1"
        :class="ns.e('pagination')"
        role="navigation"
        :aria-label="t('tk.tagsPage.pagination')"
      >
        <button
          :class="[ns.e('pagination-btn'), ns.is('disabled', currentPage <= 1)]"
          :disabled="currentPage <= 1"
          :aria-label="t('tk.tagsPage.prevPage')"
          type="button"
          @click="prevPage"
        >
          <TkIcon :icon="arrowLeftIcon" :size="16" aria-hidden="true" />
          <span class="sr-only">{{ t("tk.tagsPage.prevPage") }}</span>
        </button>

        <span :class="ns.e('pagination-info')" aria-live="polite">
          {{ defaultLabel.showingRange }}
        </span>

        <button
          :class="[ns.e('pagination-btn'), ns.is('disabled', currentPage >= totalPages)]"
          :disabled="currentPage >= totalPages"
          :aria-label="t('tk.tagsPage.nextPage')"
          type="button"
          @click="nextPage"
        >
          <TkIcon :icon="arrowRightIcon" :size="16" aria-hidden="true" />
          <span class="sr-only">{{ t("tk.tagsPage.nextPage") }}</span>
        </button>
      </div>
    </div>

    <!-- 当前选中标签提示 -->
    <div v-if="selectedTag" :class="ns.e('selected')" role="status" aria-live="polite">
      <span>{{ t("tk.tagsPage.selected", { tag: selectedTag }) }}</span>
      <button
        :class="ns.e('clear')"
        :aria-label="t('tk.tagsPage.clearFilter')"
        type="button"
        @click="handleSwitchTag('')"
      >
        {{ t("tk.tagsPage.clear") }}
      </button>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </TkArticlePage>
</template>
