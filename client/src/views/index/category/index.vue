<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- <ShowArticleList :tagSet="tagSet" :keywordRef="keywordRef" ref="articleList" /> -->
      <ShowArticleList :tagSet="[]" keywordRef="" :categoryId="categoryIdref" ref="articleList" />
    </template>
    <template v-slot:top>
      <div class="category">
        <div :class="{ active: categoryIdref == 0 }" @click="changeCateId(0)" class="category-title">全部分类</div>
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
import api from "@/api";
import MainAsideBox from "@/components/MainAsideBox.vue";
import ShowArticleList from '@/components/ShowArticleList.vue'

import { FolderOpenOutline } from "@vicons/ionicons5";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

let categoryIdref = ref(+route.params.type)


const changeCateId = (id) => {
  if (categoryIdref.value == id) {
    categoryIdref.value = 0
    router.push('/category/' + 0)
  } else {
    categoryIdref.value = id
    router.push('/category/' + id)
  }
}

// 加载分类
const categoryOptions = ref([])
onMounted(async () => {
  const res = await api.categoryGet()
  categoryOptions.value =  res.result
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
    flex-grow: 1;
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