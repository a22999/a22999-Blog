<script setup lang="ts" name="ArticleTags">
import type { Post } from "@teek/config";
import { useData, useRouter, withBase } from "vitepress";
import { computed } from "vue";
import { useNamespace, useLocale } from "@teek/composables";
import { collectionTagIcon } from "@teek/static";
import { useTeekConfig, usePagePath } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";

defineOptions({ name: "ArticleTags" });

interface ArticleTagsProps {
  /**
   * 文章数据，如果不传则从当前页面 frontmatter 获取
   */
  post?: Post;
  /**
   * 是否显示标题
   */
  showTitle?: boolean;
  /**
   * 标题文本，支持国际化
   */
  title?: string;
}

const props = withDefaults(defineProps<ArticleTagsProps>(), {
  showTitle: true,
});

const ns = useNamespace("article-tags");
const { t } = useLocale();
const { frontmatter } = useData();
const router = useRouter();
const { getTeekConfigRef } = useTeekConfig();
const { tagPath } = usePagePath();

// 获取当前文章的标签
const tags = computed(() => {
  if (props.post?.frontmatter?.tags) {
    return props.post.frontmatter.tags;
  }
  return frontmatter.value.tags || [];
});

// 点击标签跳转到标签页
const handleTagClick = (tag: string) => {
  const tagsPageLink = withBase(tagPath.value);
  router.go(`${tagsPageLink}?tag=${encodeURIComponent(tag)}`);
};

// 默认标题
const defaultTitle = computed(() => props.title || t("tk.articleTags.title"));
</script>

<template>
  <div v-if="tags.length" :class="ns.b()" role="group" :aria-label="t('tk.articleTags.label')">
    <!-- 标题 -->
    <div v-if="showTitle" :class="ns.e('header')">
      <TkIcon :icon="collectionTagIcon" :size="16" aria-hidden="true" />
      <span>{{ defaultTitle }}</span>
    </div>

    <!-- 标签列表 -->
    <div :class="ns.e('list')" role="list">
      <a
        v-for="tag in tags"
        :key="tag"
        :class="ns.e('tag')"
        role="listitem"
        tabindex="0"
        :aria-label="t('tk.articleTags.tagAriaLabel', { tag })"
        @click="handleTagClick(tag)"
        @keydown.enter="handleTagClick(tag)"
        @keydown.space.prevent="handleTagClick(tag)"
      >
        <span :class="ns.e('tag-name')">{{ tag }}</span>
      </a>
    </div>
  </div>
</template>
