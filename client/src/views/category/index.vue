<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- <ShowArticleList :tagSet="tagSet" :keywordRef="keywordRef" ref="articleList" /> -->
      <ShowArticleList :tagSet="[]" keywordRef="" :categoryId="categoryIdref" ref="articleList" />

    </template>
    <template v-slot:aside>
      <div class="category">
        <div :class="{ active: categoryIdref == 0 }"  @click="changeCateId(0)" class="category-title">全部分类</div>
        <div :class="{ active: cate.id == categoryIdref }" class="category-item center--text"
          v-for="cate in categoryOptions" @click="changeCateId(cate.id)">
          <n-icon style="opacity: 0.5;" class="icon" size="1rem" :component="FolderOpenOutline" />
          {{ cate.type }}
          <span class="category-item-count">{{ cate.blogs_num }}</span>
        </div>
      </div>
    </template>
  </MainAsideBox>
</template>

<script setup>
import MainAsideBox from "@/components/MainAsideBox.vue";
import ShowArticleList from '@/components/ShowArticleList.vue'

import { FolderOpenOutline } from "@vicons/ionicons5";

let categoryIdref = ref(0)
const changeCateId = (id) => {
  if (categoryIdref.value == id) {
    categoryIdref.value = 0
  } else categoryIdref.value = id
}

// 加载分类
const axios = inject('axios')
const categoryOptions = ref([])
const loadCategory = async () => {
  const result = await axios.get('/category/get')
  console.log("result", result)
  categoryOptions.value = result.data.result
  // categoryOptions.value.push({ "id": -1, "type": "还没分类" })
  // categoryOptions.value = result.data.result.map(item => {
  //   return {
  //     label: item.type,
  //     value: item.id
  //   };
  // });
}

onMounted(() => {
  loadCategory()
})
</script>

<style lang="scss" scoped>
.category {

  padding-bottom: $gap;
  display: flex;
  flex-wrap: wrap;
  gap: $s-gap $gap;
  justify-content: center;

  &-title {
    flex-basis: 100%;
    @extend .center--text;
    @extend .active-effect-enlarge;
    background-color: $clr-back;
    padding-block: $s-gap;
  }

  &-item {
    flex-basis: 30%;
    padding-block: $gap;
    gap: $mico-gap;
    @extend .active-effect-enlarge;
    position: relative;

    &-count {
      font-weight: bold;
      position: absolute;
      right: 0;
      font-size: 3rem;
      color: $primary-transp-0;
      mix-blend-mode: multiply;
    }

  }
}
</style>