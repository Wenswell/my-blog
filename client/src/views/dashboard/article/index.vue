<template>
  <div>

    <!--———— 0. 顶部标签 ——————-->
    <n-tabs v-model:value="tabValue" type="line" animated>

      <!--———— 1. 文章列表 ——————-->
      <n-tab-pane name="list" tab="文章列表">
        <!--———— 1.1 文章列表 分页器 ——————-->
        <Pagination :pageInfo="pageInfo" @toPage="toPage" />
        <!--———— 1.2 文章列表 摘要 ——————-->
        <ListPage :tabValue="tabValue" @updateArticle="getUpdateArticleId" @changeTab="changeTab" :blogList="blogList"
          @loadBlog="loadBlog" />
        <!--———— 1.3 文章列表 分页器 ——————-->
        <Pagination :pageInfo="pageInfo" @toPage="toPage" />
      </n-tab-pane>

      <!--———— 2. 添加文章 ——————-->
      <n-tab-pane name="add" tab="添加文章">
        <AddPage @changeTab="changeTab" @loadBlog="loadBlog" />
      </n-tab-pane>

      <!--———— 3. 修改文章 ——————-->
      <n-tab-pane name="update" tab="修改文章">
        <EditPage :updateArticle="updateArticle" @changeTab="changeTab" @loadBlog="loadBlog" />

      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')

import { computed, onMounted, reactive, ref } from "vue";
import Pagination from "@/components/Pagination.vue";
import ListPage from './components/article-list.vue'
import AddPage from './components/article-add.vue'
import EditPage from './components/article-edit.vue'

// <!--———— 0. 顶部标签 ——————-->
const tabValue = ref('list')
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
})
// 获取要更新的文章信息并去更新页面
const getUpdateArticleId = async (id) => {
  const result = await axios.get(`/blog/detail?id=${id}`)
  console.log("result", result.data.result[0])
  console.log("result.data.result[0]", result.data.result[0])
  updateArticle = result.data.result[0]
  changeTab('update')
}

onMounted(() => {

  loadBlog()

})
</script>
<style lang="scss" scoped></style>