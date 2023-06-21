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