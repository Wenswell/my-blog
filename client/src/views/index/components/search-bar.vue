<template>
  <div class="nav-right">
    
    <n-input :class="{ hidden: hiddenSearch }" class="nav-right-search-bar" @keyup.enter="toSearch"
      v-model:value="keyword" type="text" placeholder="输入关键词" />
    <n-button :loading="loading" class="nav-right-search-btn" @click="toSearch">
      <template #icon>
        <n-icon size="1rem" :component="Search" />
      </template>
      搜索
    </n-button>
  </div>
</template>

<script setup>
import { Search } from "@vicons/ionicons5";

const message = inject('message')
const emit = defineEmits(['search-keyword'])
// 搜索文章
let keyword = ref('')
let hiddenSearch = ref(true)
let loading = ref(false)
let timer = null
const toSearch = () => {
  if (hiddenSearch.value) {
    hiddenSearch.value = false
    return
  }
  if (!keyword.value) {
    message.info('全部内容')
  }
  if (timer) return
  loading.value = true
  emit('search-keyword', keyword)
  timer = setTimeout(async () => {
    // 这里是需要节流的代码
    loading.value = false
    timer = null
  }, 500)
}

</script>

<style lang="scss" scoped>
.nav-right {
  display: flex;
  gap: $gap;
  justify-content: flex-end;
  .nav-right-search-btn{
    background-color: $light;
  }

  &-search-bar {
    width: 100%;
    transition: all 200ms;

    &.hidden {
      // outline: solid;
      width: 0;
      opacity: 0;
      // border-color:transparent;
    }

    // grid-column: 0/-1; 


  }
}
</style>