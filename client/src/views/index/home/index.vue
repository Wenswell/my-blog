<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- 这里是主要内容 -->
      <ShowArticleList :tagSet="tagSet" :keywordRef="keywordRef" ref="articleList" />

    </template>
    <template v-slot:top>
      <!-- 这里是主要内容 -->
      <SearchInput  style="min-width: 10rem;" v-model:valueModel="keywordRef" ref="searchBar" />

    </template>
    <template v-slot:bottom>

      <ShowTagsBox @searchAll="searchAll" v-model:tagsRef="tagsRef"  />

    </template>
  </MainAsideBox>
</template>

<script setup>
import SearchInput from './components/search-input.vue'
import MainAsideBox from "@/components/MainAsideBox.vue";
import ShowArticleList from '@/components/ShowArticleList.vue'
import ShowTagsBox from '@/components/ShowTagsBox.vue'

import { computed, ref } from "vue";


const articleList = ref(null)
const searchBar = ref(null)
const searchAll = () => {
  // 清空本地
  tagsRef.value = []
  keywordRef.value = ''

  // 调用子组件的清空+搜索
  searchBar.value.clearKeyword()
  articleList.value.searchAll()
}

// 绑定至子组件用于搜索
const keywordRef = ref(null)
// 绑定至子组件用于搜索
// const tagsRef = ref([])
// 转一份 set 方便查找去重
let tagsRef = ref([])
// let tagSet = ref([])

const tagSet = computed(() => {
  return new Set(tagsRef.value)
})
// const message = inject('message')
// watchEffect(()=>{
//   // tagSet = new Set(someRef || [])
//   console.log("someRef", someRef)
//   console.log("tagSet", tagSet)
  
// })

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

</style>