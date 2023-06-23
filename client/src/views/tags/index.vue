<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- <ShowArticleList :tagSet="tagSet" :keywordRef="keywordRef" ref="articleList" /> -->
      <ShowArticleList :tagSet="tagSet" keywordRef="" :categoryId="0" ref="articleList" />

    </template>
    <template v-slot:aside>
      <div class="tags-box">
          <div @click="tagsRef=[]" class="tag-title center--text">
            <n-icon color="gray" size="1rem" :component="PricetagsOutline" />
            标签
          </div>
          <span :style="{zoom:Math.log10(tag.count+1)+0.6}" @click="onAddTag(tag.name)" :class="{ active: tagSet.has(tag.name) }" class="tag center--text"
            v-for="tag in getTags">
            {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
          </span>
        </div>
    </template>
  </MainAsideBox>
</template>

<script setup>
import MainAsideBox from "@/components/MainAsideBox.vue";
import ShowArticleList from '@/components/ShowArticleList.vue'

import { PricetagsOutline } from "@vicons/ionicons5";

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
  // loadBlog();
}
const axios = inject('axios')
onMounted(() => {
  // 加载标签
  axios.get('/blog/get_tags').then(result => getTags.value = result.data.result)
})
</script>

<style lang="scss" scoped>
.tags-box {
  margin-bottom: $gap;
  display: block;

  .tag-title {
    height: $gap*2;
    padding-left: $s-gap;
    gap: $s-gap;
    justify-content: normal;
    overflow: hidden;
    position: relative;
    transition: transform 200ms;

    @extend .active-effect-enlarge;
    &:hover{
      color: $clr-text-pri;
    }
    
    &::after {
      transition-property: all, color;
      transition-duration: 50ms, 150ms;
      content: '点击移除全部标签';
      color: $clr-back-grey;
      position: absolute;
      left: 25%;
      white-space: nowrap;
      zoom: 0.8;
    }

    &:hover::after {
      color: $clr-text-pri;
      content: '移除全部标签 (查看全部)';
    }
  }

  .tag {
    padding-inline: $s-gap;
    margin-top: $s-gap;
    margin-right: $s-gap;
    display: inline-block;
    @extend .active-effect;
    position: relative;
    &::before{
      content:'#'
    }

    &-count{
      font-weight: bold;
      position: absolute;
      right: -2%;
      top: 30%;
      color: $primary-transp-2;
      mix-blend-mode: multiply;

    }
  }
}
</style>