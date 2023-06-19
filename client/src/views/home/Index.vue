<template>
  <div class="home-page">
    <!-- <nav class="nav grid--margin"> -->
    <nav class="nav">
      <span @click="router.push('/')" class="nav-item">首页</span>
      <n-popselect @update:value="changeCategory" v-model:value="pageInfo.categoryId" :options="categoryOptions" scrollable>
        <span class="nav-item">
          {{ categoryName?.label || '分类' }}
        </span>
      </n-popselect>
      <span @click="router.push('/login')" class="nav-item">后台</span>

      <n-input class="search-bar" @keyup.enter="loadBlog" v-model:value="pageInfo.keyword" type="text"
        placeholder="输入关键词" />
      <n-button class="search-btn" @click="loadBlog">搜索</n-button>
    </nav>

    <main class="main-content">

      <Pagination :pageInfo="pageInfo" @toPage="toPage" />
      <ArticleList :blogList="blogList" :showModel="true" />
      <Pagination :pageInfo="pageInfo" @toPage="toPage" />

    </main>


    <footer>
      尾部
    </footer>
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')

import Pagination from "@/components/Pagination.vue";
import ArticleList from '@/components/ArticleList.vue'
import { computed, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter()

const changeCategory = (id) => {
  pageInfo.categoryId = id
  loadBlog()
}

const categoryName = computed(() => {
  const selectedOption = categoryOptions.value.find((option) => option.value == pageInfo.categoryId)
  return selectedOption
})

const categoryOptions = ref([])
const loadCategory = async () => {
  const result = await axios.get('/category/get')
  categoryOptions.value = result.data.result.map(item => {
    return {
      label: item.type,
      value: item.id
    }
  })
  categoryOptions.value.unshift({
    label: '全部分类',
    value: 0
  })
  if (result.data.code === 200) {
  } else {
  }
}



// 文章预览列表
let blogList = ref([])
// 加载文章列表
const loadBlog = async () => {
  const result = await axios.get(`/blog/search?categoryId=${pageInfo.categoryId}&keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  if (result.data.code === 200) {
    blogList.value = result.data.result.list
    pageInfo.count = result.data.result.count
    pageInfo.pageCount = pageInfo.pageSize ? Math.ceil(pageInfo.count / pageInfo.pageSize) : 0
    // message.success(result.data.msg)
  } else {
    message.error(result.data.msg)
  }
}
// 列表分页信息
const pageInfo = reactive({
  page: 1,
  pageSize: 10,
  count: 0,
  pageCount: 0,
  categoryId: 0,
  keyword: '',
})
// 分页跳转
const toPage = async (page) => {
  if (page == pageInfo.page || page > pageInfo.pageCount || page <= 0) return
  pageInfo.page = page
  loadBlog()
}


onMounted(() => {
  loadCategory()

  loadBlog()

})
</script>

<style lang="scss" scoped>
.home-page {
  margin: $gap auto;
  max-width: 60rem;

}

.nav {
  display: flex;
  gap: $gap;

  &-item {
    @extend .center--text;
    min-width: 5rem;

  }

  .search-bar {
    // grid-column: 0/-1; 


  }

}

.main-content {}
</style>