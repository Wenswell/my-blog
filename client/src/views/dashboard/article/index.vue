<template>
  <div>

    <!--———— 0. 顶部标签 ——————-->
    <n-tabs v-model:value="tabValue" type="line" animated>

      <!--———— 1. 文章列表 ——————-->
      <n-tab-pane name="list" tab="文章列表">
        <!--———— 1.1 文章列表 分页器 ——————-->
        <Pagination :pageInfo="pageInfo" @toPage="toPage" />
        <!--———— 1.2 文章列表 摘要 ——————-->
        <ArticleList :tabValue="tabValue" @updateArticle="getUpdateArticleId" @changeTab="changeTab" :blogList="blogList"
          @loadBlog="loadBlog" editModel />
        <!--———— 1.3 文章列表 分页器 ——————-->
        <Pagination :pageInfo="pageInfo" @toPage="toPage" />
      </n-tab-pane>

      <!-- 2. 添加/修改文章 -->
      <n-tab-pane name="md-add" tab="添加文章-MD">
        <MdPage :updateArticle="updateArticle" @changeTab="changeTab" @loadBlog="loadBlog" />

      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')

import { computed, onMounted, reactive, ref } from "vue";
import Pagination from "@/components/Pagination.vue";
import ArticleList from '@/components/ArticleList.vue'
import MdPage from './components/article-md.vue'

// <!--———— 0. 顶部标签 ——————-->
const tabValue = ref('md-add')
const changeTab = (type) => {
  tabValue.value = type
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
  tags: "",
  keyword: '',
})
// 分页跳转
const toPage = async (page) => {
  if (page == pageInfo.page || page > pageInfo.pageCount || page <= 0) return
  pageInfo.page = page
  loadBlog()
}


// 要更新的文章
let updateArticle = reactive({
  id: 0,
  categoryId: undefined,
  title: '',
  content: '',
  tags: "",
  description: '',
})

// 获取要更新的文章信息并去更新页面
const getUpdateArticleId = async (id) => {
  const result = await axios.get(`/blog/detail?id=${id}`)
  console.log("result", result.data.result[0])
  console.log("result.data.result[0]", result.data.result[0])
  Object.assign(updateArticle, result.data.result[0])
  changeTab('md-add')
}

onMounted(() => {

  loadBlog()

})
</script>
<style lang="scss" scoped></style>