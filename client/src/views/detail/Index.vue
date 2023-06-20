<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- 这里是主要内容 -->
      <div class="blog-box">
        <h1 class="blog-title">
          {{ blogDetail.title }}
        </h1>
        <div class="blog-content" v-html="blogDetail.content"></div>
      </div>
    </template>
    <template v-slot:aside>
      <!-- 这里是侧边栏内容 -->
    </template>
  </MainAsideBox>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import MainAsideBox from "@/components/MainAsideBox.vue";
const route = useRoute()
import { marked } from 'marked';
marked.use({
  mangle: false,
  headerIds: false
});
const html1 = marked.parse('# Marked in Node.js\n\nRendered by **marked**.');
const html2 = marked.parse(`
# Marked in Node.js
vite vue3 博客，写一个函数用于生成HTML格式文章的目录
要求函数返回一个多重数组，第一层是h1，第二层是h2以此类推
数组中的每一项都至少包括：el: HTMLElement,name: name属性值,tag: 标签名字(h1,h2,h3...),text: 标题内容
目标是可以跳转到该标题的相应位置，判断现在是哪个标题，折叠非当前高级标题对应的子标题
你的函数应该包含注释

Rendered by **marked**.
`);
console.log("html1", html1)
console.log("html2", html2)





// 加载单篇文章的详细信息
let blogDetail = ref({})
const loadBlogById = async () => {
  const result = await axios.get(`/blog/detail?id=${route.params.id}`)
  if (result.data.code === 200) {
    blogDetail.value = result.data.result[0]
    message.success(result.data.msg)
  } else {
    message.error(result.data.msg)
  }
}
onMounted(() => {
  loadBlogById()
})
</script>

<style lang="scss" scoped>
.blog-box {
  background-color: $light;
  padding: $gap;
  margin-block: $gap;
}
</style>