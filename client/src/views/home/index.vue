<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- 这里是主要内容 -->
      <TESTShowArticleList :tagSet="tagSet" :keywordRef="keywordRef" :isSearchAll="isSearchAll" />

    </template>
    <template v-slot:aside>
      <!-- 这里是侧边栏内容 -->
      <div class="search-box">
        <SearchInput v-model:valueModel="keywordRef" />
        <div class="tags-box">
          <div @click="searchAll" class="tag-title center--text">
            <n-icon color="gray" size="1rem" :component="PricetagsOutline" />
            标签
          </div>
          <span @click="onAddTag(tag.name)" :class="{ active: tagSet.has(tag.name) }" class="tag center--text"
            v-for="tag in getTags">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </template>
  </MainAsideBox>
</template>

<script setup>
const axios = inject('axios')
import SearchInput from './components/search-input.vue'
import MainAsideBox from "@/components/MainAsideBox.vue";
import TESTShowArticleList from '@/components/ShowArticleList.vue'

import { computed, onMounted, reactive, ref } from "vue";
import { PricetagsOutline } from "@vicons/ionicons5";

let isSearchAll = ref(false)
const searchAll = () => {
  isSearchAll.value = true
}

// 绑定至子组件用于搜索
const keywordRef = ref(null)
// 绑定至子组件用于搜索
const tagsRef = ref([])
// 转一份 set 方便查找去重
const tagSet = computed(() => {
  return new Set(tagsRef.value)
})

// 用于展示、点击添加
const getTags = ref([])
const onAddTag = (tag) => {
  const uniqueTags = tagSet.value
  // 已选中则去除，未选中则添加
  uniqueTags.has(tag) ? uniqueTags.delete(tag) : uniqueTags.add(tag);
  tagsRef.value = [...uniqueTags];
  loadBlog();
}
onMounted(() => {
  // 加载标签
  axios.get('/blog/get_tags').then(result => getTags.value = result.data.result)
})
</script>

<style lang="scss" scoped>
.no-blog {
  @extend .center--text;
  cursor: auto;
  font-size: $fs-big;
  color: $clr-text-pri;
  font-weight: bold;
  -webkit-text-stroke: 1px $clr-back;
}

.tags-box {
  margin-block: $gap;
  display: block;

  .tag-title {
    height: $gap*2;
    padding-left: $s-gap;
    gap: $s-gap;
    justify-content: normal;
    background-color: $clr-back;
    overflow: hidden;
    position: relative;
    transition: transform 200ms;

    &:active {
      background-color: $primary-transp;
      transform: scale(1.05);
    }

    &::after {
      transition-property: all, color;
      transition-duration: 50ms, 150ms;
      content: '点击移除全部标签 & 清空搜索栏';
      color: $clr-back-grey;
      position: absolute;
      left: 25%;
      white-space: nowrap;
      zoom: 0.8;
    }

    &:hover::after {
      color: $clr-text-pri;
      content: '移除全部标签 & 清空搜索栏 (查看全部)';
    }
  }

  .tag {
    padding-inline: $s-gap;
    margin-top: $gap;
    margin-right: 1rem;
    display: inline-block;
    background-color: $clr-back;
    transition: all 200ms;
    border: $mico-gap solid transparent;

    &:hover {
      color: $primary-color;
      border-color: $primary-transp;
    }

    &:active {
      background-color: $primary-transp;
      transform: scale(0.9);
    }

    &.active {
      background-color: $primary-color;
      color: $clr-back;
    }
  }
}
</style>