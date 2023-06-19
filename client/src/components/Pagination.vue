<template>
  <!--———— 1  分页器 ——————-->

  <div class="pagination">
    <!--———— 1.1 分页器 左箭头 ——————-->
    <span :class="{ 'disable': pageInfo.page <= 1 }" class="pagination-arrow center--text"
      @click="$emit('toPage', pageInfo.page - 1)"></span>

    <!--———— 1.2 分页器 页数 ——————-->
    <!-- 首页 -->
    <span :class="{ 'active': 1 == pageInfo.page }" class="pagination-item center--text" @click="$emit('toPage', 1)">
      {{ 1 }}
    </span>

    <!-- 中间页 -->
    <span :class="{ active: page.n == pageInfo.page }" class="pagination-item center--text"
      @click="$emit('toPage', page.n)" v-for="page in setInfo">{{ page.d }}</span>

    <!-- 尾页 -->
    <span v-if="pageInfo.pageCount > 1" :class="{ 'active': pageInfo.pageCount == pageInfo.page }"
      class="pagination-item center--text" @click="$emit('toPage', pageInfo.pageCount)">
      {{ pageInfo.pageCount }}
    </span>

    <!--———— 1.3 分页器 右箭头 ——————-->
    <span :class="{ 'disable': pageInfo.page >= pageInfo.pageCount }" class="pagination-arrow center--text"
      @click="$emit('toPage', pageInfo.page + 1)"></span>
  </div>
</template>

<script setup>
import { prop } from 'dom7';
import { computed, reactive, ref } from 'vue';

const { pageInfo } = defineProps({
  pageInfo: {
    type: Object,
    required: true
  },
})


// 一个计算函数来生成分页信息
const setInfo = computed(() => {

  // 要显示的页码数量  
  // BUG: 更改xx后需要修改逻辑！！
  const xx = 10 / 2;
  // 生成分页号数组  
  const numbers = [];

  let start, end;

  // 页数过少则直接直接添加后返回
  if (pageInfo.pageCount < xx) {
    for (let i = 2; i <= pageInfo.pageCount - 1; i++) {
      numbers.push({ n: i, d: i, });
    }
    return numbers
  }

  // 根据当前页决定开始页和结束页
  if (pageInfo.page <= xx) {
    start = 2;
    end = start + xx;
  } else if (pageInfo.pageCount - pageInfo.page + 1 > xx) {
    start = pageInfo.page - 2;
    end = start + xx - 1;
  } else {
    start = pageInfo.pageCount - xx - 1;
    end = start + xx;
  }

  // 如果开始页不是2,添加'...'     
  if (start > 2) {
    numbers.push({ n: start - 1, d: '...', });
  }

  // 添加页码     
  for (let i = start; i <= end; i++) {
    numbers.push({ n: i, d: i, });
  }

  // 如果结束页不是最后一页,添加'...' 
  if (end < pageInfo.pageCount - 1) {
    numbers.push({ n: end + 1, d: '...', });
  }

  // 返回分页信息  
  return numbers
});


/**
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  count: 0,
  pageCount: 0,
  categoryId: 0,
  keyword: '',
})
 */

</script>

<style lang="scss" scoped>
.pagination {
  display: grid;
  margin: $gap;
  grid-gap: $gap;
  grid-template-columns: repeat(auto-fill, minmax($side-length, 1fr));

  >* {
    width: $side-length;
    height: $side-length;
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
      background-color: $primary-color;
      color: $white;
    }
  }

  // 左右 箭头
  &-arrow {
    transition: all 300ms;
    border: 1px solid $light-grey;

    // 禁用样式
    &.disable {
      opacity: 0.3;
      // cursor: not-allowed;
      pointer-events: none;
      border: none;
      background-color: $light-grey;
    }

    &:hover {
      color: $primary-color;
      border-color: $primary-color;
    }

    &:first-child::before {
      content: '<';
    }

    &:last-child::before {
      content: '>';
    }

  }

}
</style>