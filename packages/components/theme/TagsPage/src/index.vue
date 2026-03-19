<script setup lang="ts" name="TagsPage">
import type { Tag } from "@teek/config";
import { useData, useRouter, withBase } from "vitepress";
import { computed, ref, watch, onMounted } from "vue";
import { useNamespace, useLocale } from "@teek/composables";
import { tagIcon, emptyIcon } from "@teek/static";
import { isFunction } from "@teek/helper";
import { useTeekConfig, usePagePath, usePosts, useTagColor } from "@teek/components/theme/ConfigProvider";
import { postDataUpdateSymbol } from "@teek/components/theme/Home/src/home";
import { TkArticlePage } from "@teek/components/common/ArticlePage";
import { TkIcon } from "@teek/components/common/Icon";
import { inject } from "vue";

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

// 当前选中的标签
const selectedTag = ref("");
const tagKey = "tag";

// 获取所有标签
const tags = computed(() => posts.value.groupCards.tags);

// 默认标签配置
const defaultLabel = computed(() => {
  const frontmatterConst = frontmatter.value;
  const title = tagsPageConfig.title;
  const titleStr = isFunction(title) ? title(tagIcon) : title;
  return {
    title: frontmatterConst.title ?? titleStr ?? t("tk.tagsPage.title", { icon: tagIcon }),
    totalCount: t("tk.tagsPage.totalCount", { count: tags.value.length }),
    empty: tagsPageConfig.emptyLabel ?? t("tk.tagsPage.empty"),
  };
});

// 排序后的标签
const sortedTags = computed(() => {
  const sortBy = tagsPageConfig.sortBy || "count";
  const tagsList = [...tags.value];

  switch (sortBy) {
    case "name":
      return tagsList.sort((a, b) => a.name.localeCompare(b.name));
    case "date":
      // 按最新文章日期排序（这里简化为按名称）
      return tagsList;
    case "count":
    default:
      return tagsList.sort((a, b) => b.length - a.length);
  }
});

// 按首字母分组的标签（用于 group 模式）
const groupedTags = computed(() => {
  const groups: Record<string, typeof tags.value> = {};
  sortedTags.value.forEach(tag => {
    const firstLetter = tag.name.charAt(0).toUpperCase();
    const key = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";
    if (!groups[key]) groups[key] = [];
    groups[key].push(tag);
  });
  return groups;
});

// 计算标签云字体大小
const getTagSize = (length: number) => {
  const minSize = tagsPageConfig.cloudMinSize || 12;
  const maxSize = tagsPageConfig.cloudMaxSize || 24;
  const maxCount = Math.max(...tags.value.map(t => t.length), 1);
  const minCount = Math.min(...tags.value.map(t => t.length), 0);
  const ratio = maxCount === minCount ? 0 : (length - minCount) / (maxCount - minCount);
  return minSize + ratio * (maxSize - minSize);
};

// 获取标签样式
const getTagStyle = (index: number, length: number, isCloud = false) => {
  const tagColorConst = tagColor.value;
  const color = tagColorConst[index % tagColorConst.length];
  const baseStyle = {
    backgroundColor: color.bg,
    color: color.text,
    borderColor: color.border,
  };

  if (isCloud) {
    return {
      ...baseStyle,
      fontSize: `${getTagSize(length)}px`,
    };
  }
  return baseStyle;
};

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

  // 如果此时不在标签页，则跳转至标签页
  if (!inTagsPage) return router.go(tagsPageLinkConst + searchParamsStr);

  // 如果在标签页，则替换 URL，但不刷新
  window.history.pushState({}, "", pathname + searchParamsStr);
  // 更新文章列表数据
  updatePostListData();
};

// 显示模式
const displayMode = computed(() => tagsPageConfig.displayMode || "cloud");

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
  <TkArticlePage :class="ns.b()" :aria-label="t('tk.tagsPage.label')">
    <slot name="teek-tags-top-before" />

    <!-- 页面头部 -->
    <div :class="`${ns.e('header')} flx-justify-between`">
      <h1>
        <TkIcon :icon="tagIcon" :size="24" />
        {{ defaultLabel.title.replace("{icon}", "") }}
      </h1>
      <div class="count">{{ defaultLabel.totalCount }}</div>
    </div>

    <slot name="teek-tags-top-after" />

    <!-- 标签展示区域 -->
    <div :class="ns.e('content')">
      <!-- 空状态 -->
      <div v-if="!tags.length" :class="ns.e('empty')">
        <TkIcon :icon="emptyIcon" :size="48" />
        <p>{{ defaultLabel.empty }}</p>
      </div>

      <!-- 云状模式 -->
      <div v-else-if="displayMode === 'cloud'" :class="[ns.e('cloud'), ns.is('active', !!selectedTag)]">
        <a
          v-for="(item, index) in sortedTags"
          :key="item.name"
          :style="getTagStyle(index, item.length, true)"
          :class="[{ active: item.name === selectedTag }, ns.e('tag-item')]"
          @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
          :aria-label="`${item.name} (${item.length})`"
        >
          <span class="name">{{ item.name }}</span>
          <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
        </a>
      </div>

      <!-- 列表模式 -->
      <div v-else-if="displayMode === 'list'" :class="[ns.e('list'), ns.is('active', !!selectedTag)]">
        <a
          v-for="(item, index) in sortedTags"
          :key="item.name"
          :style="getTagStyle(index, item.length)"
          :class="[{ active: item.name === selectedTag }, ns.e('tag-item')]"
          @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
          :aria-label="`${item.name} (${item.length})`"
        >
          <span class="name">{{ item.name }}</span>
          <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
        </a>
      </div>

      <!-- 分组模式 -->
      <div v-else-if="displayMode === 'group'" :class="[ns.e('group'), ns.is('active', !!selectedTag)]">
        <div v-for="(groupTags, letter) in groupedTags" :key="letter" :class="ns.e('group-section')">
          <div :class="ns.e('group-letter')">{{ letter }}</div>
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
              :class="[{ active: item.name === selectedTag }, ns.e('tag-item')]"
              @click="handleSwitchTag(item.name === selectedTag ? '' : item.name)"
              :aria-label="`${item.name} (${item.length})`"
            >
              <span class="name">{{ item.name }}</span>
              <span v-if="tagsPageConfig.showCount !== false" class="count">{{ item.length }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前选中标签提示 -->
    <div v-if="selectedTag" :class="ns.e('selected')">
      <span>{{ t("tk.tagsPage.selected", { tag: selectedTag }) }}</span>
      <button @click="handleSwitchTag('')" :class="ns.e('clear')">
        {{ t("tk.tagsPage.clear") }}
      </button>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </TkArticlePage>
</template>
