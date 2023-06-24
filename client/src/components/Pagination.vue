<template>
  <!--———— 1  分页器 ——————-->

  <div class="pagination grid--margin">
    <!--———— 1.1 分页器 左箭头 ——————-->
    <button :disabled="pageInfo.page <= 1" :class="{ 'disable': pageInfo.page <= 1 }"
      class="pagination-arrow center--text plain" @click="handleClick(pageInfo.page - 1)"><n-icon size="1.1rem"
        :component="ArrowBack" /></button>
    <!--———— 1.3 分页器 右箭头 ——————-->
    <button :disabled="pageInfo.page >= pageInfo.pageCount" :class="{ 'disable': pageInfo.page >= pageInfo.pageCount }"
      class="pagination-arrow center--text plain" @click="handleClick(pageInfo.page + 1)"><n-icon size="1.1rem"
        :component="ArrowForward" /></button>

    <!--———— 1.2 分页器 页数 ——————-->
    <button :class="{ active: page.n == pageInfo.page }" class="pagination-item center--text plain"
      @click="handleClick(page.n)" v-for="page in createPaginator">{{ page.d }}</button>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";
import { useRoute, useRouter } from 'vue-router';
import { updateQueryParameter } from '@/utils/index'
const route = useRoute()
const router = useRouter()

const { pageInfo } = defineProps({
  pageInfo: {
    type: Object,
    required: true
    /**
    const pageInfo = reactive({
      page: 1,
      pageSize: 3,
      count: 0,
      pageCount: 0,
      categoryId: 0,
      tags:"",
      keyword: '',
    })
     */
  },
})
// const updateQuery = updateQueryParameter(route, router,'page',)

const emit = defineEmits(['to-page'])
function handleClick(page) {
  console.log("page", page)
  updateQueryParameter(route, router, 'page', page!==1, page)
  emit('to-page', page)
}
onMounted(()=>{
  if (route.query.page) {
    handleClick(route.query.page)
  } else handleClick(1)
})


/**
 * 创建分页器
 * @param {number} currentPage 当前页数
 * @param {number} totalPages 总页数
 * @param {number} displayLength 要显示的页码长度
 * @returns {Array} 生成的分页数组
 */
const createPaginator = computed(() => {
  let currentPage = pageInfo.page
  let totalPages = pageInfo.pageCount
  let displayLength = 7
  // 初始化分页数组
  const pages = [];

  // 左边界，用于计算开始的页码
  const leftBoundary = Math.floor((displayLength - 4) / 2);
  // 右边界，用于计算结束的页码
  const rightBoundary = Math.ceil((displayLength - 4) / 2);

  // 首页
  pages.push({ n: 1, d: 1 });

  // 当需要显示省略号时，添加省略号
  if (currentPage - leftBoundary > 2) {
    pages.push({ n: currentPage - leftBoundary - 1, d: '...' });
  }

  // 计算开始页码
  const startPage = Math.max(2, currentPage - leftBoundary);

  // 计算结束页码
  const endPage = Math.min(currentPage + rightBoundary, totalPages - 1);

  // 添加中间页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push({ n: i, d: i, });
  }

  // 当需要显示省略号时，添加省略号
  if (currentPage + rightBoundary < totalPages - 1) {
    pages.push({ n: currentPage + rightBoundary + 1, d: '...' });
  }

  // 末页
  pages.push({ n: totalPages, d: totalPages, });





  return pages;
})

// 一个计算函数来生成分页信息
// const setInfo = computed(() => {

//   // 要显示的页码数量
//   // BUG: 更改xx后需要修改逻辑！！
//   const xx = 10 / 2;
//   // 生成分页号数组
//   const numbers = [];

//   let start, end;

//   // 页数过少则直接直接添加后返回
//   if (pageInfo.pageCount < xx) {
//     for (let i = 2; i <= pageInfo.pageCount - 1; i++) {
//       numbers.push({ n: i, d: i, });
//     }
//     return numbers
//   }

//   // 根据当前页决定开始页和结束页
//   if (pageInfo.page <= xx) {
//     start = 2;
//     end = start + xx;
//   } else if (pageInfo.pageCount - pageInfo.page + 1 > xx) {
//     start = pageInfo.page - 2;
//     end = start + xx - 1;
//   } else {
//     start = pageInfo.pageCount - xx - 1;
//     end = start + xx;
//   }

//   // 如果开始页不是2,添加'...'
//   if (start > 2) {
//     numbers.push({ n: start - 1, d: '...', });
//   }

//   // 添加页码
//   for (let i = start; i <= end; i++) {
//     numbers.push({ n: i, d: i, });
//   }

//   // 如果结束页不是最后一页,添加'...'
//   if (end < pageInfo.pageCount - 1) {
//     numbers.push({ n: end + 1, d: '...', });
//   }

//   // 返回分页信息
//   return numbers
// });

</script>

<style lang="scss" scoped>
.pagination {
  max-width: 90vw;
  grid-template-columns: repeat(auto-fill, minmax($l-gap, 1fr));

  >* {
    background-color: $clr-back;
    width: $l-gap;
    height: $l-gap;
  }


  // 中间 页数
  &-item {
    transition: all 250ms;
    border: 1px solid transparent;

    &:hover {
      color: $primary-color;
      border-color: $primary-color;
    }

    &.active {
      cursor:auto;
      pointer-events: none;
      background-color: $primary-color;
      color: $white;
    }
  }

  // 左右 箭头
  &-arrow {
    transition: all 300ms;
    border: 1px solid $clr-back-grey;

    // 禁用样式
    &.disable {
      opacity: 0.5;
      cursor:auto;
      pointer-events: none;
      border: none;
      background-color: $clr-back-grey;
    }

    &:hover {
      color: $primary-color;
      border-color: $primary-color;
    }

  }

}
</style>