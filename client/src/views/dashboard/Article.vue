<template>
  <div>

    <!--———— 0. 顶部标签 ——————-->
    <n-tabs v-model:value="tabValue" type="line" animated>

      <!--———— 1. 文章列表 ——————-->
      <n-tab-pane name="list" tab="文章列表">
        <!--———— 1.1 文章列表 分页器 ——————-->
        <Pagination :pageInfo="pageInfo" @toPage="toPage" />


        <!--———— 1.2 文章列表 摘要 ——————-->
        <div v-for="(blog, index) in blogList" style="margin-bottom: 1rem;">
          <!--———— 1.2.1 摘要 标题 ——————-->
          <n-card :title="blog.title">
            <!--———— 1.2.2 摘要 开头内容 ——————-->
            <div>{{ removeStyles(blog.content) }}</div>
            <template #footer>
              <n-space align="center">
                <!--———— 1.2.3 摘要 发布时间 ——————-->
                <div>发布时间：{{ getFormatTime(blog.create_time) }}</div>
                <!--———— 1.2.3 摘要 修改 删除 ——————-->
                <n-button @click="toUpdate(blog.id)">修改</n-button>
                <n-button @click="onDelete(blog.id, blog.title)">删除</n-button>
              </n-space>

            </template>
          </n-card>
        </div>

        <!--———— 1.3 文章列表 分页器 ——————-->
        <Pagination :pageInfo="pageInfo" @toPage="toPage" />


      </n-tab-pane>

      <!--———— 2. 添加文章 ——————-->
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
          <n-form-item label="标题">
            <n-input v-model:value="addArticle.title" placeholder="标题" />
            <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" placeholder="选择分类" />
          </n-form-item>
          <n-form-item label="内容">
            <RichTextEditorVue v-model:valueModel="addArticle.content" />
          </n-form-item>
          <n-button @click="onAdd">提交</n-button>
        </n-form>
      </n-tab-pane>

      <!--———— 3. 修改文章 ——————-->
      <n-tab-pane name="update" tab="修改文章">
        <n-form>
          <n-form-item label="标题">
            <n-input v-model:value="updateArticle.title" placeholder="标题" />
            <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" placeholder="选择分类" />
          </n-form-item>
          <n-form-item label="内容">
            <RichTextEditorVue v-model:valueModel="updateArticle.content" />
          </n-form-item>
          <n-button @click="onUpdate">提交</n-button>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')

import { computed, onMounted, reactive, ref } from "vue";
import RichTextEditorVue from "@/components/RichTextEditor.vue";
import Pagination from "@/components/Pagination.vue";


const tabValue = ref('list')

const removeStyles = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}



const pageInfo = reactive({
  page: 1,
  pageSize: 20,
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
    // message.success(result.data.msg)
  } else {
    message.error(result.data.msg)
  }
}
const getFormatTime = ((timestamp) => {
  return new Date(timestamp).toLocaleString()
})


const toPage = async (page) => {
  if (page == pageInfo.page || page > pageInfo.pageCount || page <= 0) return
  pageInfo.page = page
  loadBlog()
}

const toUpdate = async (id) => {
  console.log("id", id)
  const result = await axios.get(`/blog/detail?id=${id}`)
  updateArticle.id = result.data.result[0].id
  updateArticle.categoryId = result.data.result[0].category_id
  updateArticle.title = result.data.result[0].title
  updateArticle.content = result.data.result[0].content
  tabValue.value = 'update'
}



const addArticle = reactive({
  categoryId: undefined,
  title: '',
  content: '',
})

const updateArticle = reactive({
  id: 0,
  categoryId: undefined,
  title: '',
  content: '',
})

const dialog = inject('dialog')
const onDelete = async (id, title) => {
  dialog.warning({
    title: "警告",
    content: `是否删除文章 [ ${title} ]`,
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: async () => {
      const result = await axios.delete(`/blog/_token/delete?id=${id}`)
      if (result.data.code === 200) {
        message.success(`文章 [ ${title} ] ${result.data.msg}`)
        loadBlog()
      } else {
        message.error(result.data.msg)
      }
    },
    onNegativeClick: () => { }
  });
}


const onUpdate = async () => {
  try {
    const result = await axios.put('/blog/_token/update', updateArticle)
    if (result.data.code === 200) {
      message.success(`文章 [ ${updateArticle.title} ] ${result.data.msg}`)
      addArticle.id = 0
      addArticle.categoryId = undefined
      addArticle.title = ''
      addArticle.content = ''
      loadBlog()
    } else {
      message.error(result.data.msg)
    }
  } catch (error) {
    console.log("error", error)
    message.error(error.response.data.msg)
  }
}

const onAdd = async () => {
  try {
    const result = await axios.post('/blog/_token/add', addArticle)
    // console.log("addArticle", addArticle)
    if (result.data.code === 200) {
      message.success(`文章 [ ${addArticle.title} ] ${result.data.msg}`)
      addArticle.categoryId = undefined
      addArticle.title = ''
      addArticle.content = ''
      loadBlog()
    } else {
      message.error(result.data.msg)
    }
  } catch (error) {
    console.log("error", error)
    message.error(error.response.data.msg)
  }
}

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
onMounted(() => {
  loadCategory()

  loadBlog()

})
</script>
<style lang="scss" scoped>

</style>