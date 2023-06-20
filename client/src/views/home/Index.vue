<template>
  <div class="home-page">

    <HomeNav @search-keyword="searchBlog" />

    <main class="main-content">

      <!-- <Pagination v-show="pageInfo.pageCount > 1 && blogList.length" :pageInfo="pageInfo" @toPage="toPage" /> -->
      <ArticleList :blogList="blogList" :showModel="true" />
      <div class="no-blog" v-show="!blogList.length">没有结果，请更换搜索关键词</div>
      <Pagination v-show="pageInfo.pageCount > 1 && blogList.length" :pageInfo="pageInfo" @toPage="toPage" />

    </main>


    <footer>
      尾部
    </footer>
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')
import HomeNav from './components/home-nav.vue'

import Pagination from "@/components/Pagination.vue";
import ArticleList from '@/components/ArticleList.vue'
import { onMounted, reactive, ref } from "vue";



const searchBlog = (keyword) => {
  pageInfo.keyword = keyword
  loadBlog(1)
}



// 文章预览列表
let blogList = ref([])
// 加载文章列表
const loadBlog = async (isSearch) => {
  const result = await axios.get(`/blog/search?categoryId=${pageInfo.categoryId}&keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  if (result.data.code === 200) {
    blogList.value = result.data.result.list
    pageInfo.count = result.data.result.count
    pageInfo.pageCount = pageInfo.pageSize ? Math.ceil(pageInfo.count / pageInfo.pageSize) : 0

    if (isSearch && result.data.result.count) {
      // 搜索完成
      message.success(`共 ${pageInfo.count} 条结果`)
    } else if (isSearch) {
      // 没有结果
      message.warning('没有结果，请更换搜索关键词')
    }

    // message.success(result.data.msg)
    // return result.data.result.count
  } else {
    message.error(result.data.msg)
  }
}
// 列表分页信息
const pageInfo = reactive({
  page: 1,
  pageSize: 2,
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
  loadBlog()
})
</script>

<style lang="scss" scoped>
.home-page {
  margin: $gap auto;
  max-width: 80vw;
  height: 100%;
}


.main-content {
  margin: $gap;

  .no-blog {
    @extend .center--text;
    font-size: $fs--big;
    color: $light-grey;
    cursor: auto;
  }
}
</style>