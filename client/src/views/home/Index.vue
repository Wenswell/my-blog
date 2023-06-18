<template>
  <div class="home">
    <nav class="nav">
      <span @click="router.push('/')" class="nav-item">首页</span>
      <n-popselect @update:value="loadBlog" v-model:value="pageInfo.categoryId" :options="categoryOptions" scrollable>
        <span class="nav-item">
          {{ categoryName?.label || '分类' }}
        </span>
      </n-popselect>
      <span @click="router.push('/login')" class="nav-item">后台</span>
      {{ pageInfo }}

      <n-input @keyup.enter="loadBlog" v-model:value="pageInfo.keyword" type="text" placeholder="输入关键词" />
      <n-button @click="loadBlog">搜索</n-button>

    </nav>



    <div @click="router.push(`/detail?id=${blog.id}`)" v-for="(blog, index) in blogList" style="margin-bottom: 1rem;">
      <n-card :title="blog.title">
        <div>{{ blog.content }}</div>
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ getFormatTime(blog.create_time) }}</div>
          </n-space>

        </template>
      </n-card>
    </div>

    <n-pagination v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" @update:page="loadBlog" />


    <footer>
      尾部
    </footer>
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')

import { computed, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter()

const changeCategory = async (id) => {
  console.log("id", id)
  const result = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)

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
    };
  });
  if (result.data.code === 200) {
  } else {
  }
}



const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  count: 0,
  pageCount: 0,
  categoryId: 0,
  keyword: '',
})
let blogList = ref([])
const loadBlog = async () => {
  const result = await axios.get(`/blog/search?categoryId=${pageInfo.categoryId}&keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  if (result.data.code === 200) {
    blogList.value = result.data.result.list
    pageInfo.count = result.data.result.count
    pageInfo.pageCount = pageInfo.pageSize ? Math.ceil(pageInfo.count / pageInfo.pageSize) : 0
    message.success(result.data.msg)
  } else {
    message.error(result.data.msg)
  }
}
const getFormatTime = ((timestamp) => {
  return new Date(timestamp).toLocaleString()
})



onMounted(() => {
  loadCategory()

  loadBlog()

})
</script>

<style lang="scss" scoped>
.home {
  outline: solid;
  // width: 10rem;
  margin: 0 auto;
}
</style>