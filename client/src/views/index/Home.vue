<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- 这里是主要内容 -->
      <ArticleList :blogList="blogList" :showModel="true" />
      <div class="no-blog">{{ noBlog }}</div>
      <Pagination v-show="pageInfo.pageCount > 1 && blogList.length" :pageInfo="pageInfo" @toPage="toPage" />
    </template>
    <template v-slot:aside>
      <!-- 这里是侧边栏内容 -->
      <div class="search-box">
        <SearchInput @search-keyword="searchBlog" />
      </div>
    </template>
  </MainAsideBox>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')
import SearchInput from './components/search-input.vue'
import Pagination from "@/components/Pagination.vue";
import MainAsideBox from "@/components/MainAsideBox.vue";
import { onMounted, reactive, ref } from "vue";


// 文章预览列表
let blogList = ref([])
let noBlog = ref('')
// 加载文章列表
const loadBlog = async (isSearch) => {
  noBlog.value = ''
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
      noBlog.value = '没有结果，请更换搜索关键词'
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

// 搜索文章
const searchBlog = (keyword) => {
  pageInfo.keyword = keyword
  loadBlog(1)
}

onMounted(() => {
  loadBlog()
})
</script>

<style lang="scss" scoped>
.no-blog {
  @extend .center--text;
  font-size: $fs--big;
  color: $dark;
  font-weight: bold;
  cursor: auto;
  -webkit-text-stroke: 1px $light;
}
</style>