<template>
  <!-- 这里是主要内容 -->
  <ArticleList :blogList="blogList" />
  <div class="no-blog">{{ noBlog }}</div>
  <Pagination v-show="pageInfo.pageCount > 1 && blogList.length" :pageInfo="pageInfo" @toPage="toPage" />
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')
import Pagination from "@/components/Pagination.vue";
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
// import SearchInput from './components/search-input.vue'
// import MainAsideBox from "@/components/MainAsideBox.vue";
// import { PricetagsOutline } from "@vicons/ionicons5";

let props = defineProps({
  tagSet: { type: Object, },
  keywordRef: { type: String, },
  categoryId: { type: Number, },
  isSearchAll: { type: Boolean, },
})

// 文章预览列表
let blogList = ref([])
let noBlog = ref('')
// 加载文章列表
const loadBlog = async () => {
  noBlog.value = ''

  const result = await axios.get(`/blog/search?categoryId=${pageInfo.categoryId}&tags=${pageInfo.tags}&keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  if (result.data.code === 200) {
    blogList.value = result.data.result.list
    pageInfo.count = result.data.result.count
    pageInfo.pageCount = pageInfo.pageSize ? Math.ceil(pageInfo.count / pageInfo.pageSize) : 0


    if ((pageInfo.categoryId||pageInfo.keyword || pageInfo.tags.length) && result.data.result.count) {
      // 搜索完成
      message.success(`共 ${pageInfo.count} 条结果`)
    } else if (pageInfo.keyword || pageInfo.tags.length) {
      // 没有结果
      noBlog.value = '没有结果，换换条件'
    } else if (pageInfo.categoryId) {
      // 没有结果
      noBlog.value = `这是一个空的分类`
    }

  } else {
    message.error(result.data.msg)
  }
}
// 列表分页信息
let pageInfo = reactive({
  page: 1,
  pageSize: 10,
  count: 0,
  pageCount: 0,
  categoryId: 0,
  tags: [],
  keyword: '',
})
// 分页跳转
const toPage = async (page) => {
  if (page == pageInfo.page || page > pageInfo.pageCount || page <= 0) return
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  })
  pageInfo.page = page
  loadBlog()
}
watchEffect(() => {
  pageInfo.tags = [...props.tagSet]
  pageInfo.keyword = props.keywordRef || ''
  pageInfo.categoryId = props.categoryId || 0

  loadBlog()
});


// 清空条件，搜索全部
const searchAll = () => {
  pageInfo.categoryId = 0
  pageInfo.tags = []
  pageInfo.keyword = ''
  loadBlog()
}

defineExpose({
  searchAll
});
// // 根据关键词搜索文章
// const searchBlog = (keyword) => {
//   pageInfo.keyword = keyword
//   loadBlog()
// }
// // 根据标签过滤文章
// const onAddTag = (tag) => {
//   const uniqueTags = tagSet.value
//   // 已选中则去除，未选中则添加
//   uniqueTags.has(tag) ? uniqueTags.delete(tag) : uniqueTags.add(tag);
//   pageInfo.tags = [...uniqueTags];
//   loadBlog();
// }
// const getTags = ref([])
// // 加载标签
// const loadTags = async () => {
//   const result = await axios.get('/blog/get_tags')
//   getTags.value = result.data.result
// }

// // 清空条件，搜索全部
// const searchAll = () => {
//   pageInfo.categoryId = 0
//   pageInfo.tags = []
//   pageInfo.keyword = ''
//   loadBlog()
// }

onMounted(() => {
  loadBlog()
  // loadTags()
})
</script>

<style lang="scss" scoped>
.no-blog {
  @extend .center--text;
  cursor: auto;
  font-size: $fs-big;
  color: $clr-text-pri;
  font-weight: bold;
  -webkit-text-stroke: 1px $clr-back;
}

// .tags-box {
//   margin-block: $gap;
//   display: block;

//   .tag-title {
//     height: $gap*2;
//     padding-left: $s-gap;
//     gap: $s-gap;
//     justify-content: normal;
//     background-color: $clr-back;
//     overflow: hidden;
//     position: relative;
//     transition: transform 200ms;

//     &:active {
//       background-color: $primary-transp-0;
//       transform: scale(1.05);
//     }

//     &::after {
//       transition-property: all, color;
//       transition-duration: 50ms, 150ms;
//       content: '点击移除全部标签 & 清空搜索栏';
//       color: $clr-back-grey;
//       position: absolute;
//       left: 25%;
//       white-space: nowrap;
//       zoom: 0.8;
//     }

//     &:hover::after {
//       color: $clr-text-pri;
//       content: '移除全部标签 & 清空搜索栏 (查看全部)';
//     }
//   }

//   .tag {
//     padding-inline: $s-gap;
//     margin-top: $gap;
//     margin-right: 1rem;
//     display: inline-block;
//     background-color: $clr-back;
//     transition: all 200ms;
//     border: $mico-gap solid transparent;

//     &:hover {
//       color: $primary-color;
//       border-color: $primary-transp-0;
//     }

//     &:active {
//       background-color: $primary-transp-0;
//       transform: scale(0.9);
//     }

//     &.active {
//       background-color: $primary-color;
//       color: $clr-back;
//     }
//   }
// }
</style>