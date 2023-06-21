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
        <div class="tags-box">
          <div @click="searchAll" class="tag-title center--text">
            <n-icon color="gray" size="1rem" :component="PricetagsOutline" />
            标签
          </div>
          <span @click="onAddTag(tag)" :class="{ active: tagSet.has(tag) }" class="tag center--text"
            v-for="tag in getTags">
            {{ tag }}
          </span>
        </div>
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
import { computed, onMounted, reactive, ref } from "vue";
import { PricetagsOutline } from "@vicons/ionicons5";


// 文章预览列表
let blogList = ref([])
let noBlog = ref('')
// 加载文章列表
const loadBlog = async (isSearch) => {
  noBlog.value = ''
  const result = await axios.get(`/blog/search?categoryId=${pageInfo.categoryId}&tags=${pageInfo.tags}&keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
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
  tags: [],
  keyword: '',
})
// 转一份 set 方便查找去重
const tagSet = computed(() => {
  return new Set(pageInfo.tags)
})
// 分页跳转
const toPage = async (page) => {
  if (page == pageInfo.page || page > pageInfo.pageCount || page <= 0) return
  pageInfo.page = page
  loadBlog()
}
// 根据关键词搜索文章
const searchBlog = (keyword) => {
  pageInfo.keyword = keyword
  loadBlog()
}
// 根据标签过滤文章
const onAddTag = (tag) => {
  const uniqueTags = tagSet.value
  // 已选中则去除，未选中则添加
  uniqueTags.has(tag) ? uniqueTags.delete(tag) : uniqueTags.add(tag);
  pageInfo.tags = [...uniqueTags];
  loadBlog();
}
const getTags = ref([])
// 加载标签
const loadTags = async () => {
  const result = await axios.get('/blog/get_tags')
  getTags.value = result.data.result
}

// 清空条件，搜索全部
const searchAll = () => {
  pageInfo.categoryId = 0
  pageInfo.tags = []
  pageInfo.keyword = ''
  loadBlog()
}

onMounted(() => {
  loadBlog()
  loadTags()
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

.tags-box {
  margin-block: $gap;
  display: block;

  .tag-title {
    height: $gap*2;
    padding-left: $gap/2;
    gap: $gap/2;
    justify-content: normal;
    background-color: $light;
    overflow: hidden;
    position: relative;
    transition: transform 200ms;


    &:active {
      background-color: $primary-transp;
      transform: scale(1.05);
    }

    &::after {
      transition-property: all, color;
      transition-duration: 50ms, 150ms;
      content: '点击移除全部标签 & 清空搜索栏';
      color: $light-grey;
      position: absolute;
      left: 25%;
      white-space: nowrap;
      zoom: 0.8;
    }

    &:hover::after {
      color: $dark;
      content: '移除全部标签 & 清空搜索栏 (查看全部)';
    }
  }

  .tag {
    padding-inline: $gap/2;
    margin-top: $gap;
    margin-right: 1rem;
    display: inline-block;
    background-color: $light;
    transition: all 200ms;
    border: 2px solid transparent;

    &:hover {
      color: $primary-color;
      border-color: $primary-transp;
    }

    &:active {
      background-color: $primary-transp;
      transform: scale(0.9);
    }

    &.active {
      background-color: $primary-color;
      color: $light;
    }
  }
}
</style>