<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- <ShowArticleList :tagSet="tagSet" :keywordRef="keywordRef" ref="articleList" /> -->
      <ShowArticleList :tagSet="tagSet" keywordRef="" :categoryId="0" ref="articleList" />

    </template>
    <template v-slot:top>

      <ShowTagsBox class="tag-box" v-model:tagsRef="tagsRef" isShowAll />

    </template>
  </MainAsideBox>
</template>

<script setup>
import MainAsideBox from "@/components/MainAsideBox.vue";
import ShowArticleList from '@/components/ShowArticleList.vue'
import ShowTagsBox from '@/components/ShowTagsBox.vue'


// 绑定至子组件用于搜索
const tagsRef = ref(['A'])
// 转一份 set 方便查找去重
const tagSet = computed(() => {
  return new Set(tagsRef.value)
})

</script>

<style lang="scss" scoped></style>