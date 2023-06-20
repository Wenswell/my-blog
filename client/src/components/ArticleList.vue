<template>
  <div class="blog-box">
    <!--———— 1.2 文章列表 摘要 ——————-->
    <div class="blog-card" :style="{ cursor: (showModel ? 'pointer' : 'default') }" @click="toDetail(blog.id)"
      v-for="(blog, index) in blogList">
      <!--———— 1.2.1 摘要 标题 ——————-->
      <n-card :title="blog.title">
        <!--———— 1.2.2 摘要 开头内容 ——————-->
        <div class="content">{{ removeStyles(blog.content) }}</div>
        <template #footer>
          <div class="box-footer grid--margin">
            <!--———— 1.2.3 摘要 发布时间 ——————-->
            <div>发布时间：{{ getFormatTime(blog.create_time) }}</div>
            <!--———— 1.2.3 摘要 修改 删除 ——————-->
            <template v-if="!showModel">
              <n-button @click="toUpdate(blog.id)" tertiary type="info">修改</n-button>
              <n-button @click="onDelete(blog.id, blog.title)" tertiary type="error">删除</n-button>
            </template>
          </div>
        </template>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';


const { showModel } = defineProps({
  blogList: {
    type: Object,
    required: true
  },
  tabValue: {
    type: String,
  },
  showModel: {
    type: Boolean,
  }
})

onMounted(() => {
  // message.success(1)
  if (!showModel) {
    toDetail = () => { }
  }
})

import { useRouter } from 'vue-router';
const router = useRouter()
let toDetail = (id) => {
  router.push(`/detail?id=${id}`)
}

// 将HTML转为txt，移除样式
const removeStyles = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
// 时间戳转本地时间显示
const getFormatTime = ((timestamp) => {
  return new Date(timestamp).toLocaleString()
})


// 前往更新页面
const emit = defineEmits(['load-blog', 'change-tab', 'update-article'])
const toUpdate = (id) => {
  emit('update-article', id)
}


// 删除文章
const message = inject('message')
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
        emit('load-blog')
      } else {
        message.error(result.data.msg)
      }
    },
    onNegativeClick: () => { }
  });
}
</script>

<style lang="scss" scoped>
.blog-box {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

.blog-card {
  border: 1px solid $light-grey;
  border-radius: 4px;
  transition: 300ms;

  &:hover {
    border-color: $primary-color;
  }
}

.content {
  // outline: solid;
  min-height: 2.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.box-footer {
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  margin: 0;
}
</style>