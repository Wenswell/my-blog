<template>
  <!--———— 1  分页器 ——————-->
  <div class="pagination">
    <!--———— 1.1 分页器 左箭头 ——————-->
    <span :class="{ 'disable': pageInfo.page <= 1 }" class="pagination-arrow center--text"
      @click="$emit('toPage', pageInfo.page - 1)"></span>


    <!--———— 1.2 分页器 页数 ——————-->
    <span :class="{ active: page == pageInfo.page }" class="pagination-item center--text" @click="$emit('toPage', page)"
      v-for="page in pageInfo.pageCount">{{ page }}</span>


    <!--———— 1.3 分页器 右箭头 ——————-->
    <span :class="{ 'disable': pageInfo.page >= pageInfo.pageCount }" class="pagination-arrow center--text"
      @click="$emit('toPage', pageInfo.page + 1)"></span>
  </div>
</template>

<script setup>
defineProps({
  pageInfo: {
    type: Object,
    required: true
  },
})
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