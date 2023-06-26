<template>
  <MainAsideBox>
    <template v-slot:main>
      <!-- 这里是主要内容 -->
      <!-- <div class="blog-box">
        <h1 class="blog-title">
          {{ blogDetail.title }}
        </h1>
        <div class="blog-content" v-html="blogDetail.content"></div>
      </div> -->
      <MdPreview class="main" :editorId="id" :modelValue="blogDetail.content" />
    </template>
    <template v-slot:top>
      <div class="aside">

        <div class="aside-title">
          <n-icon :component="BookmarksOutline" />
          目录
        </div>
        <MdCatalog :scrollElementOffsetTop="headerHeightPx" class="aside-content" :editorId="id"
          :scrollElement="scrollElement" />
      </div>

    </template>
  </MainAsideBox>
</template>


<script setup>
const message = inject('message')
import { onMounted, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { BookmarksOutline } from "@vicons/ionicons5";
import MainAsideBox from "@/components/MainAsideBox.vue";
const route = useRoute()
const router = useRouter()

const headerHeightPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) * parseInt(getComputedStyle(document.documentElement).fontSize)

import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import api from '@/api';
const id = 'preview-only';
const scrollElement = document.documentElement;

// 加载单篇文章的详细信息
let blogDetail = ref({})
const loadBlogById = async () => {
  const result = await api.blogGetDetailById({id:route.params.id})
  if (result.code === 200 && result.result.length) {
    blogDetail.value = result.result[0]
    // message.success("文章加载成功")
  } else {
    message.error("加载失败，请刷新")
    router.back()
  }
}
onMounted(() => {
  loadBlogById()
})

</script>

<style lang="scss" scoped>
.aside {
  color: $clr-text-pri;

  &-title {
    user-select: none;
    -webkit-user-select: none;
    padding: $s-gap $gap;
    background-color: $clr-back;
    display: flex;
    gap: $s-gap;
    align-items: center;
    margin-bottom: $gap;
  }

  &-content {
    width: 100%;
    padding: $s-gap $gap;
    background-color: $clr-back;
  }
}
</style>